'use strict';

// Reads Claude Code session transcripts locally for `oduncu learn` and `oduncu savings`.
// Nothing leaves the machine.

const fs = require('fs');
const os = require('os');
const path = require('path');

const projectsRoot = () =>
  path.join(process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude'), 'projects');

// Claude Code names a project's folder after its cwd, every non-alphanumeric turned into '-'.
const projectDir = (cwd, root = projectsRoot()) => path.join(root, cwd.replace(/[^a-zA-Z0-9]/g, '-'));

const ODUNCU_CMD = /<command-name>\/(?:[\w-]+:)?oduncu<\/command-name>/;
const ARGS = /<command-args>([^<]*)<\/command-args>/;

function textOf(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.filter((p) => p && p.type === 'text').map((p) => p.text).join('\n');
}

// Returns the turns of one transcript: each real user prompt, whether oduncu was on when it
// arrived, whether the user interrupted the reply, and the output tokens the reply cost.
function parseSession(text) {
  const turns = [];
  let cur = null;
  let on = false;
  const apply = (args) => {
    const word = String(args || '').trim().split(/\s+/)[0].toLowerCase();
    if (word === 'yat') on = false;
    else if (word === '' || word === 'kalk') on = true;
  };

  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    if (e.isSidechain || !e.message) continue;
    const c = e.message.content;

    if (e.type === 'user') {
      if (Array.isArray(c) && c.some((p) => p && p.type === 'tool_result')) continue;
      const t = textOf(c);
      if (t.trim() === '[Request interrupted by user]') { if (cur) cur.interrupted = true; continue; }
      if (ODUNCU_CMD.test(t)) { apply((t.match(ARGS) || [])[1]); cur = null; continue; }
      if (t.includes('<command-name>')) { cur = null; continue; }
      if (e.isMeta || !t.trim() || t.includes('<system-reminder>') || t.startsWith('[Request interrupted')) continue;
      cur = { prompt: t.trim(), oduncu: on, interrupted: false, tokens: {} };
      turns.push(cur);
    } else if (e.type === 'assistant') {
      for (const p of Array.isArray(c) ? c : []) {
        if (p.type === 'tool_use' && p.name === 'Skill' && /(^|:)oduncu$/.test((p.input && p.input.skill) || '')) apply(p.input.args);
        // An agent that already speaks the four strings is running oduncu, however it got there.
        if (p.type === 'text' && /^yaparım\.\.\./.test(p.text)) { on = true; if (cur) cur.oduncu = true; }
      }
      const u = e.message.usage;
      // One API message is split over several lines that repeat its usage; keep the largest.
      if (cur && u && e.message.id) cur.tokens[e.message.id] = Math.max(cur.tokens[e.message.id] || 0, u.output_tokens || 0);
    }
  }
  return turns.map((t) => ({
    prompt: t.prompt,
    oduncu: t.oduncu,
    interrupted: t.interrupted,
    outputTokens: Object.values(t.tokens).reduce((a, b) => a + b, 0),
  }));
}

// Top-level *.jsonl only: subagent transcripts live in subfolders and are not the user's turns.
function readSessions(dirs) {
  const sessions = [];
  for (const dir of dirs) {
    let files;
    try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.jsonl')); } catch { continue; }
    for (const f of files) {
      const turns = parseSession(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (turns.length) sessions.push({ id: f.slice(0, -6), turns });
    }
  }
  return sessions;
}

function sessionDirs(all, cwd = process.cwd()) {
  if (!all) return [projectDir(cwd)];
  const root = projectsRoot();
  try { return fs.readdirSync(root).map((d) => path.join(root, d)); } catch { return []; }
}

const BREVITY = /(^|[^\p{L}])(kısa(?!(?: ?yol|ltmadan))|uzatma|özet geçme|çok uzun|lafı dolandırma|too long|tl;?dr|be brief|shorter|less verbose|more concise)/iu;
const TRACE = /(ne yaptın|neyi değiştirdin|ne değişti|hangi dosya|what did you (do|change)|what changed|which files)/iu;

// Pasted text, scheduled tasks, other sessions' messages and quoted replies are not the user's
// own words. A complaint about length is short, so long prompts (briefs, summaries) are skipped.
const ownWords = (t) => t
  .replace(/<([\w-]+)[^>]*>[\s\S]*?<\/\1>/g, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .split('\n').filter((l) => !/^\s*>/.test(l)).join('\n')
  .trim();
const MAX_SIGNAL_CHARS = 300;

// Groups the prompts that hint at a mode change and picks the one-line suggestion.
function learn(sessions) {
  const turns = sessions.flatMap((s) => s.turns);
  const off = turns.filter((t) => !t.oduncu);
  // Resumed and forked sessions repeat earlier prompts, so each prompt counts once.
  const pick = (list, test) => [...new Set(list.map((t) => ownWords(t.prompt)).filter((w) => w && w.length <= MAX_SIGNAL_CHARS && test(w)))];
  const signals = {
    interrupted: [...new Set(off.filter((t) => t.interrupted).map((t) => ownWords(t.prompt) || t.prompt))],
    brevity: pick(off, (w) => BREVITY.test(w)),
    trace: pick(turns.filter((t) => t.oduncu), (w) => TRACE.test(w)),
  };
  const suggest = [];
  if (signals.interrupted.length + signals.brevity.length >= 3) suggest.push('/oduncu kalk');
  if (signals.trace.length >= 2) suggest.push('/oduncu talk');
  return { sessions: sessions.length, turns: turns.length, on: turns.length - off.length, signals, suggest };
}

const MIN_SESSIONS = 5;

function stats(turns) {
  const v = turns.map((t) => t.outputTokens).filter((n) => n > 0).sort((a, b) => a - b);
  if (!v.length) return { turns: 0, median: 0, mean: 0 };
  const m = v.length >> 1;
  const median = v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
  return { turns: v.length, median, mean: v.reduce((a, b) => a + b, 0) / v.length };
}

// Output tokens per turn with oduncu on vs off. Different sessions do different work, so the
// result is an estimate and is withheld below MIN_SESSIONS sessions per group.
function savings(sessions) {
  const group = (on) => {
    const ss = sessions.filter((s) => s.turns.some((t) => t.oduncu === on));
    return { sessions: ss.length, ...stats(ss.flatMap((s) => s.turns.filter((t) => t.oduncu === on))) };
  };
  const off = group(false);
  const on = group(true);
  const enough = off.sessions >= MIN_SESSIONS && on.sessions >= MIN_SESSIONS && off.median > 0;
  const pct = (a, b) => Math.round(((a - b) / a) * 100);
  return {
    off,
    on,
    enough,
    medianReduction: enough ? pct(off.median, on.median) : null,
    meanReduction: enough ? pct(off.mean, on.mean) : null,
  };
}

module.exports = { projectDir, parseSession, readSessions, sessionDirs, learn, savings, MIN_SESSIONS };
