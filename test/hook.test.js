'use strict';
// Runs the hook as Claude Code does — a child process with JSON on stdin — against a temp
// state dir and a temp transcript root.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const HOOK = path.join(__dirname, '..', 'hooks', 'oduncu.js');
const CWD = '/work/app';

function setup() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'oduncu-'));
  return { state: path.join(root, 'state'), claude: path.join(root, 'claude') };
}

function run(env, kind, payload) {
  const out = execFileSync(process.execPath, [HOOK, kind], {
    env: { ...process.env, ODUNCU_STATE_DIR: env.state, CLAUDE_CONFIG_DIR: env.claude },
    input: JSON.stringify(payload),
    encoding: 'utf8',
  });
  return out ? JSON.parse(out).hookSpecificOutput.additionalContext : null;
}

const state = (env) => JSON.parse(fs.readFileSync(path.join(env.state, 'state.json'), 'utf8'));
const writeState = (env, s) => { fs.mkdirSync(env.state, { recursive: true }); fs.writeFileSync(path.join(env.state, 'state.json'), JSON.stringify(s)); };

let n = 0;
// One transcript: prompts, each answered with `out` output tokens; `on` starts it with the hook's context.
function transcript(env, cwd, prompts, { on = false, out = 100 } = {}) {
  const dir = path.join(env.claude, 'projects', cwd.replace(/[^a-zA-Z0-9]/g, '-'));
  fs.mkdirSync(dir, { recursive: true });
  const lines = on ? [JSON.stringify({ attachment: { type: 'hook_additional_context', content: ['ODUNCU ON — trace: off'] } })] : [];
  for (const p of prompts) {
    n++;
    lines.push(JSON.stringify({ type: 'user', message: { role: 'user', content: p } }));
    lines.push(JSON.stringify({ type: 'assistant', message: { id: `m${n}`, content: [], usage: { output_tokens: out } } }));
  }
  fs.writeFileSync(path.join(dir, `s${n}.jsonl`), lines.join('\n'));
}

test('on by default, injecting only the core rules', () => {
  const ctx = run(setup(), 'session', { source: 'startup', cwd: CWD });
  assert.match(ctx, /^ODUNCU ON — trace: off, language: default/);
  assert.match(ctx, /## The four strings/);
  assert.match(ctx, /## Outside the chat/);
  assert.doesNotMatch(ctx, /## First run|## Help/);
  assert.doesNotMatch(ctx, /^oduncu note:/m);
});

test('commands persist across sessions', () => {
  const env = setup();
  assert.match(run(env, 'prompt', { prompt: '/oduncu yat' }), /ODUNCU OFF/);
  assert.strictEqual(state(env).on, false);
  assert.strictEqual(run(env, 'session', { source: 'resume', cwd: CWD }), null);

  assert.strictEqual(run(env, 'prompt', { prompt: '/oduncu talk' }), null);
  assert.strictEqual(run(env, 'prompt', { prompt: '/oduncu lang EN' }), null);
  assert.match(run(env, 'prompt', { prompt: '/anthropic-skills:oduncu kalk' }), /^ODUNCU ON — trace: on, language: en/);
  assert.deepStrictEqual([state(env).on, state(env).trace, state(env).lang], [true, true, 'en']);

  run(env, 'prompt', { prompt: '/oduncu lang tr' });
  assert.strictEqual(state(env).lang, null);
  assert.strictEqual(run(env, 'prompt', { prompt: 'fix the oduncu bug' }), null);
  assert.strictEqual(run(env, 'prompt', { prompt: '/oduncu help' }), null);
});

test('learn nudge: kalk when off, once a week, only at startup', () => {
  const env = setup();
  writeState(env, { on: false, savingsAt: Date.now() });
  transcript(env, CWD, ['çok uzun yazıyorsun', 'kısa anlat', 'tl;dr please']);

  assert.strictEqual(run(env, 'session', { source: 'resume', cwd: CWD }), null);
  const ctx = run(env, 'session', { source: 'startup', cwd: CWD });
  assert.match(ctx, /^oduncu note: .*\/oduncu kalk/);
  assert.doesNotMatch(ctx, /ODUNCU ON/);
  assert.ok(state(env).nudged[CWD]);
  assert.strictEqual(run(env, 'session', { source: 'startup', cwd: CWD }), null);
});

test('learn nudge: talk when on and the trace is off', () => {
  const env = setup();
  writeState(env, { on: true, savingsAt: Date.now() });
  transcript(env, CWD, ['ne yaptın?', 'what did you change', 'hangi dosyalar değişti'], { on: true });
  assert.match(run(env, 'session', { source: 'startup', cwd: CWD }), /^oduncu note: .*\/oduncu talk/m);
});

test('savings: silent without enough data, then once a week with the estimate', () => {
  const env = setup();
  for (let i = 0; i < 5; i++) transcript(env, '/p/' + i, ['task'], { out: 200 });
  for (let i = 0; i < 4; i++) transcript(env, '/q/' + i, ['task'], { on: true, out: 100 });

  assert.doesNotMatch(run(env, 'session', { source: 'startup', cwd: CWD }), /^oduncu note:/m);
  assert.ok(state(env).savingsAt, 'the check is recorded even when it stays silent');

  transcript(env, '/q/4', ['task'], { on: true, out: 100 });
  writeState(env, { ...state(env), savingsAt: 0 });
  assert.match(run(env, 'session', { source: 'startup', cwd: CWD }), /^oduncu note: .*estimated 50% of output tokens/m);
  assert.doesNotMatch(run(env, 'session', { source: 'startup', cwd: CWD }), /^oduncu note:/m);
});

test('bad input never fails the hook', () => {
  const env = setup();
  const out = execFileSync(process.execPath, [HOOK, 'session'], {
    env: { ...process.env, ODUNCU_STATE_DIR: env.state, CLAUDE_CONFIG_DIR: env.claude },
    input: 'not json',
    encoding: 'utf8',
  });
  assert.match(out, /ODUNCU ON/);
});
