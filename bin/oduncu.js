#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const SRC = path.join(__dirname, '..', 'skills', 'oduncu');
const HOME = os.homedir();

const TARGETS = [
  { id: 'claude',      label: 'Claude Code', dir: path.join(HOME, '.claude', 'skills') },
  { id: 'codex',       label: 'Codex',       dir: path.join(HOME, '.codex', 'skills') },
  { id: 'antigravity', label: 'Antigravity', dir: path.join(HOME, '.gemini', 'config', 'skills') },
  { id: 'gemini',      label: 'Gemini CLI',  dir: path.join(HOME, '.gemini', 'skills') },
  { id: 'cursor',      label: 'Cursor',      dir: path.join(HOME, '.cursor', 'skills') },
  { id: 'agents',      label: 'Agent Skills standard', dir: path.join(HOME, '.agents', 'skills') },
];

const argv = process.argv.slice(2);
const cmd = argv.find((a) => !a.startsWith('-')) || 'help';
const has = (f) => argv.includes(f);
const valueOf = (f) => {
  const i = argv.indexOf(f);
  return i === -1 ? null : argv[i + 1];
};

const exists = (p) => { try { fs.accessSync(p); return true; } catch { return false; } };

function selected() {
  const only = valueOf('--only');
  const ids = only ? only.split(',').map((s) => s.trim()) : null;
  return TARGETS.filter((t) => {
    if (ids) return ids.includes(t.id);
    return has('--all') || exists(t.dir) || exists(path.dirname(t.dir));
  });
}

function install() {
  const dry = has('--dry-run');
  const list = selected();
  if (!list.length) {
    console.log('No agent found. Nothing installed.');
    console.log('Force one with:  npx oduncu install --only claude');
    console.log('Or install everywhere:  npx oduncu install --all');
    process.exit(1);
  }
  for (const t of list) {
    const dest = path.join(t.dir, 'oduncu');
    if (dry) { console.log(`would install  ${t.label.padEnd(24)} ${dest}`); continue; }
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(SRC, dest, { recursive: true });
    console.log(`installed      ${t.label.padEnd(24)} ${dest}`);
  }
  if (!dry) {
    console.log('');
    console.log('Start it with  /oduncu kalk   ·  list commands with  /oduncu help');
  }
}

function uninstall() {
  let n = 0;
  for (const t of TARGETS) {
    const dest = path.join(t.dir, 'oduncu');
    if (!exists(dest)) continue;
    fs.rmSync(dest, { recursive: true, force: true });
    console.log(`removed        ${t.label.padEnd(24)} ${dest}`);
    n++;
  }
  if (!n) console.log('Not installed anywhere.');
}

function where() {
  for (const t of TARGETS) {
    const dest = path.join(t.dir, 'oduncu');
    const state = exists(dest) ? 'installed' : exists(t.dir) || exists(path.dirname(t.dir)) ? 'detected' : '-';
    console.log(`${state.padEnd(10)} ${t.id.padEnd(12)} ${t.dir}`);
  }
}

function scanned() {
  const s = require('./sessions');
  const sessions = s.readSessions(s.sessionDirs(has('--all')));
  const scope = has('--all') ? 'all projects' : 'this project (--all for every project)';
  return { s, sessions, scope };
}

function learn() {
  const { s, sessions, scope } = scanned();
  const r = s.learn(sessions);
  console.log(`oduncu learn — Claude Code sessions, ${scope}`);
  console.log(`scanned ${r.sessions} sessions, ${r.turns} prompts (${r.on} with oduncu on)\n`);
  const show = (title, list) => {
    console.log(`${title}: ${list.length}`);
    for (const p of list.slice(0, 10)) {
      const one = p.replace(/\s+/g, ' ');
      console.log(`  "${one.length > 80 ? one.slice(0, 79) + '…' : one}"`);
    }
  };
  show('long replies you interrupted (oduncu off)', r.signals.interrupted);
  show('asked for shorter answers (oduncu off)', r.signals.brevity);
  show('asked what was done (oduncu on)', r.signals.trace);
  console.log(`\nsuggestion: ${r.suggest.length ? r.suggest.join(', ') : 'none — keep your current settings'}`);
}

function savings() {
  const { s, sessions, scope } = scanned();
  const r = s.savings(sessions);
  console.log(`oduncu savings — ESTIMATED, Claude Code sessions, ${scope}`);
  console.log('output tokens per assistant turn\n');
  console.log('              sessions   turns   median     mean');
  for (const [label, g] of [['oduncu off', r.off], ['oduncu on', r.on]]) {
    console.log(`${label.padEnd(12)} ${String(g.sessions).padStart(9)} ${String(g.turns).padStart(7)} ${String(Math.round(g.median)).padStart(8)} ${String(Math.round(g.mean)).padStart(8)}`);
  }
  console.log('');
  if (!r.enough) {
    console.log(`not enough data: need ${s.MIN_SESSIONS} sessions in each group.`);
    return;
  }
  console.log(`reduction: ${r.medianReduction}% median, ${r.meanReduction}% mean (estimated)`);
  console.log('The two groups did different work, so this is a rough estimate, not a measurement.');
}

function help() {
  console.log(`oduncu — silent-executor mode for coding agents

  npx oduncu install              install into every agent found on this machine
  npx oduncu install --all        install into every known location, found or not
  npx oduncu install --only claude,codex
  npx oduncu install --dry-run    show what would happen
  npx oduncu uninstall            remove it everywhere
  npx oduncu where                show paths and what is installed
  npx oduncu learn [--all]        read past Claude Code sessions, suggest kalk or talk
  npx oduncu savings [--all]      estimated output tokens per turn, oduncu on vs off

Targets: ${TARGETS.map((t) => t.id).join(', ')}

Nothing is written until you run install — no postinstall hook touches your home
directory. learn and savings only read local transcripts; nothing is sent anywhere.
https://github.com/erayendes/oduncu`);
}

({ install, uninstall, where, learn, savings, help }[cmd] || help)();
