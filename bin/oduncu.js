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

function help() {
  console.log(`oduncu — silent-executor mode for coding agents

  npx oduncu install              install into every agent found on this machine
  npx oduncu install --all        install into every known location, found or not
  npx oduncu install --only claude,codex
  npx oduncu install --dry-run    show what would happen
  npx oduncu uninstall            remove it everywhere
  npx oduncu where                show paths and what is installed

Targets: ${TARGETS.map((t) => t.id).join(', ')}

Nothing is written until you run install — no postinstall hook touches your home
directory. https://github.com/erayendes/oduncu`);
}

({ install, uninstall, where, help }[cmd] || help)();
