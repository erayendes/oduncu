'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { projectDir, parseSession, learn, savings } = require('../bin/sessions');

const L = (o) => JSON.stringify(o);
const user = (content, extra = {}) => L({ type: 'user', message: { role: 'user', content }, ...extra });
const reply = (id, out, content = [{ type: 'text', text: 'ok' }]) =>
  L({ type: 'assistant', message: { id, role: 'assistant', content, usage: { output_tokens: out } } });
const cmd = (args) =>
  user(`<command-message>oduncu</command-message>\n<command-name>/anthropic-skills:oduncu</command-name>\n<command-args>${args}</command-args>`);

test('projectDir mirrors Claude Code folder naming', () => {
  assert.strictEqual(projectDir('/Users/a/my.app', '/r'), path.join('/r', '-Users-a-my-app'));
});

test('parseSession splits turns, tracks the mode and dedupes usage', () => {
  const turns = parseSession([
    user('fix the bug'),
    reply('m1', 100), reply('m1', 120), // same message on two lines: counted once, largest wins
    user([{ type: 'tool_result', tool_use_id: 'x', content: 'out' }]),
    reply('m2', 30),
    user([{ type: 'text', text: '[Request interrupted by user]' }]),
    cmd('kalk'),
    user([{ type: 'text', text: 'Base directory for this skill: /x/oduncu' }], { isMeta: true }),
    reply('m3', 999), // the reply to the command itself is not a turn
    user('what did you do?'),
    reply('m4', 10, [{ type: 'text', text: 'yaparım...' }]),
    cmd('yat'),
    user('<system-reminder>noise</system-reminder>'),
    user('sidechain', { isSidechain: true }),
    'not json',
    user('again'),
    reply('m5', 7),
  ].join('\n'));

  assert.deepStrictEqual(turns, [
    { prompt: 'fix the bug', oduncu: false, interrupted: true, outputTokens: 150 },
    { prompt: 'what did you do?', oduncu: true, interrupted: false, outputTokens: 10 },
    { prompt: 'again', oduncu: false, interrupted: false, outputTokens: 7 },
  ]);
});

test('the four strings mark oduncu on even without a command', () => {
  const turns = parseSession([user('a'), reply('m1', 5, [{ type: 'text', text: 'yaparım...' }]), user('b'), reply('m2', 5)].join('\n'));
  assert.deepStrictEqual(turns.map((t) => t.oduncu), [true, true]);
});

const t = (prompt, oduncu, extra = {}) => ({ prompt, oduncu, interrupted: false, outputTokens: 100, ...extra });

test('learn suggests kalk and talk from the right signals only', () => {
  const r = learn([{ id: 's', turns: [
    t('çok uzun yazıyorsun', false),
    t('kısa yanıt ver', false),
    t('kısayol ekle', false), // shortcut, not a brevity request
    t('<pasted_content id="1">too long</pasted_content> ne düşünüyorsun', false),
    t('refactor', false, { interrupted: true }),
    t('ne yaptın?', true),
    t('what did you change', true),
    t('ne yaptın?', false), // oduncu off: not a trace request
  ] }]);
  assert.deepStrictEqual(r.signals.brevity, ['çok uzun yazıyorsun', 'kısa yanıt ver']);
  assert.deepStrictEqual(r.signals.interrupted, ['refactor']);
  assert.deepStrictEqual(r.signals.trace, ['ne yaptın?', 'what did you change']);
  assert.deepStrictEqual(r.suggest, ['/oduncu kalk', '/oduncu talk']);
});

test('savings withholds the number below five sessions per group', () => {
  const s = (on, out) => ({ id: String(Math.random()), turns: [t('x', on, { outputTokens: out })] });
  assert.strictEqual(savings([s(false, 100), s(true, 50)]).enough, false);

  const many = [100, 200, 300, 400, 500].map((n) => s(false, n)).concat([50, 100, 150, 200, 250].map((n) => s(true, n)));
  const r = savings(many);
  assert.strictEqual(r.enough, true);
  assert.strictEqual(r.off.median, 300);
  assert.strictEqual(r.on.median, 150);
  assert.strictEqual(r.medianReduction, 50);
  assert.strictEqual(r.meanReduction, 50);
});
