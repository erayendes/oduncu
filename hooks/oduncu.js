#!/usr/bin/env node
'use strict';
// oduncu hook — one script, two events (argv[2]): session | prompt.
// Keeps oduncu on across sessions, and at most once a week brings up what `oduncu learn` and
// `oduncu savings` would say. Reads one state file and local transcripts. No network.
// Every failure exits 0 silently: a hook must never block or slow the agent.

const fs = require('fs');
const os = require('os');
const path = require('path');
const sessions = require('../bin/sessions');

const WEEK = 7 * 24 * 3600 * 1000;
const WINDOW = 30 * 24 * 3600 * 1000;
// Keeps the transcript scan well inside the 5 s hook timeout.
const SCAN = { maxFiles: 100, maxBytes: 150 * 1024 * 1024 };

const stateDir = process.env.ODUNCU_STATE_DIR ||
  (process.platform === 'win32'
    ? path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'oduncu')
    : path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'), 'oduncu'));
const stateFile = path.join(stateDir, 'state.json');

// On by default: installing the plugin is the decision to use it.
function readState() {
  let s = {};
  try { s = JSON.parse(fs.readFileSync(stateFile, 'utf8')) || {}; } catch { /* defaults */ }
  return {
    on: s.on !== false,
    trace: s.trace === true,
    lang: typeof s.lang === 'string' ? s.lang : null,
    nudged: s.nudged && typeof s.nudged === 'object' ? s.nudged : {},
    savingsAt: Number(s.savingsAt) || 0,
  };
}

function writeState(state) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(stateFile, JSON.stringify(state) + '\n');
}

// The rules live once, in SKILL.md, between the oduncu:core markers.
function rules(state) {
  let core = '';
  try {
    const skill = fs.readFileSync(path.join(__dirname, '..', 'skills', 'oduncu', 'SKILL.md'), 'utf8');
    core = [...skill.matchAll(/<!-- oduncu:core -->([\s\S]*?)<!-- \/oduncu:core -->/g)].map((m) => m[1].trim()).join('\n\n');
  } catch { /* fall through to the short form */ }
  return `ODUNCU ON — trace: ${state.trace ? 'on' : 'off'}, language: ${state.lang || 'default'}. Off: /oduncu yat.\n` +
    'Do the work. Say nothing about it.\n\n' +
    (core || 'A task gets "yaparım..." before the work and "tamam." after it, nothing in between. Questions get a full answer.');
}

// Returns the context to inject for a prompt, or null when the prompt is not an oduncu command.
function onPrompt(prompt) {
  const m = String(prompt || '').trim().match(/^\/(?:[\w-]+:)?oduncu(?:\s+(\S+))?(?:\s+(\S+))?/i);
  if (!m) return null;
  const cmd = (m[1] || 'kalk').toLowerCase();
  const state = readState();
  if (cmd === 'yat') {
    writeState({ ...state, on: false });
    return 'ODUNCU OFF. Ignore the oduncu rules from earlier in this session; answer normally.';
  }
  if (cmd === 'kalk') { writeState({ ...state, on: true }); return rules({ ...state, on: true }); }
  if (cmd === 'talk' || cmd === 'hush') writeState({ ...state, trace: cmd === 'talk' });
  else if (cmd === 'lang') writeState({ ...state, lang: m[2] && m[2].toLowerCase() !== 'tr' ? m[2].toLowerCase() : null });
  return null; // help, or a setting the loaded skill applies in this session
}

const note = (text) => `oduncu note: in your first reply, tell the user in one line, in their language: ${text} Say it once, then carry on.`;

// At most one learn nudge per project per week, from the sessions since the last one.
function learnNote(state, cwd, now) {
  const last = state.nudged[cwd] || 0;
  if (!cwd || now - last < WEEK) return null;
  const r = sessions.learn(sessions.readSessions([sessions.projectDir(cwd)], { since: Math.max(last, now - WINDOW), ...SCAN }));
  if (!state.on && r.suggest.includes('/oduncu kalk')) {
    const n = r.signals.interrupted.length + r.signals.brevity.length;
    return note(`in ${n} recent prompts they cut a long reply short or asked for shorter answers, so /oduncu kalk would suit them.`);
  }
  if (state.on && !state.trace && r.suggest.includes('/oduncu talk')) {
    return note(`in ${r.signals.trace.length} recent prompts they asked what was done, so /oduncu talk would show the changed files on the tamam. line.`);
  }
  return null;
}

// At most one savings check a week, across all projects; silent unless both groups have data.
function savingsNote(state, now) {
  if (now - state.savingsAt < WEEK) return { checked: false, text: null };
  const r = sessions.savings(sessions.readSessions(sessions.sessionDirs(true), { since: now - WINDOW, ...SCAN }));
  const text = r.enough && r.medianReduction > 0
    ? note(`over the last 30 days oduncu saved an estimated ${r.medianReduction}% of output tokens per turn (an estimate: the sessions compared did different work).`)
    : null;
  return { checked: true, text };
}

function onSession(data, now = Date.now()) {
  const state = readState();
  const parts = state.on ? [rules(state)] : [];
  // Nudges only at a fresh start: a resume or compact is the same conversation.
  if (data.source === 'startup') {
    const learn = learnNote(state, data.cwd, now);
    const saved = savingsNote(state, now);
    if (learn) { parts.push(learn); state.nudged = { ...state.nudged, [data.cwd]: now }; }
    if (saved.text) parts.push(saved.text);
    if (saved.checked) state.savingsAt = now;
    if (learn || saved.checked) writeState(state);
  }
  return parts.length ? parts.join('\n\n') : null;
}

function emit(event, context) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: context } }));
}

function main(kind, input) {
  let data = {};
  try { data = JSON.parse(input.replace(/^﻿/, '')) || {}; } catch { /* no input: defaults */ }
  const context = kind === 'prompt' ? onPrompt(data.prompt) : kind === 'session' ? onSession(data) : null;
  if (context) emit(kind === 'prompt' ? 'UserPromptSubmit' : 'SessionStart', context);
}

if (require.main === module) {
  const kind = process.argv[2];
  let input = '';
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    try { main(kind, input); } catch { /* never block */ }
    // Let stdout drain instead of process.exit: a pipe write is async on macOS.
    process.stdin.destroy();
    process.exitCode = 0;
  };
  process.stdin.on('data', (c) => { input += c; });
  process.stdin.on('end', finish);
  process.stdin.on('error', finish);
  setTimeout(finish, 1000).unref();
}

module.exports = { onPrompt, onSession, readState, rules };
