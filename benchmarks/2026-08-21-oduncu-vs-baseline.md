# oduncu vs. an unprompted baseline — 2026-08-21

## What was measured

Six prompts, each run twice against an identical fresh copy of a small JavaScript
fixture: once with no skill at all, once with `SKILL.md` appended to the system
prompt and the mode declared on. Same model, same tools, same starting files —
the instructions are the only variable.

- Model: `claude-sonnet-5`, headless (`claude -p --output-format json`)
- Tools allowed: `Read Write Edit Glob Grep Bash(node:*)`
- `--setting-sources project`, so user-level hooks do not reach either arm
- One run per cell, so treat single-prompt numbers as indicative, not precise

Two things are counted separately, because they are not the same thing:

- **output tokens** — everything the model emits, prose plus tool-call arguments
  plus thinking. This is what you pay for.
- **visible characters** — the final text a human reads. This is what oduncu
  exists to cut.

## Results

| prompt | kind | base tok | oduncu | tok Δ | base chars | oduncu chars | chars Δ | turns |
|:--|:--|--:|--:|--:|--:|--:|--:|:--|
| validate | task | 1291 | 1198 | −7.2% | 147 | 6 | −95.9% | 8/7 |
| rename | task | 508 | 529 | +4.1% | 130 | 6 | −95.4% | 5/4 |
| slug-bug | task | 858 | 713 | −16.9% | 181 | 6 | −96.7% | 5/5 |
| docs | task | 885 | 888 | +0.3% | 147 | 6 | −95.9% | 6/6 |
| failing | task | 987 | 545 | −44.8% | 217 | 6 | −97.2% | 7/7 |
| why-regex | question | 1828 | 1650 | −9.7% | 1228 | 1473 | +20.0% | 4/3 |

**Tasks (n=5):** output tokens median −7.2%, mean −12.9%. Visible characters
mean −96.2%.

**All six pooled:** output tokens 6357 → 5523 (−13.1%), visible characters
2050 → 1503 (−26.7%).

## Reading it honestly

The headline is not the token number. On four of the five tasks the entire
user-facing output was the six characters of `tamam.`, against 130–181
characters of summary from the baseline. That is the product working.

Token savings are real but modest and uneven — from −45% to +4% depending on the
task. The tokens do not vanish; they move. Prose disappears, tool-call arguments
and thinking stay, and on a task that needs several edits the totals barely
budge. Anyone promising a fixed percentage is guessing.

The question prompt behaved as designed: oduncu answered it more fully than the
baseline (+20% characters) while spending fewer tokens getting there. Silence
applies to tasks, not to questions.

Both arms produced correct work. On `failing`, both fixed the bug rather than
weakening the assertion, and `node calc.test.js` passes in both working copies.

## Caveats worth stating

- One run per cell, no variance measured. The −96% character reduction is far
  too large to be noise; the token deltas are not.
- A headless run is already terser than an interactive session, where the
  narration oduncu targets is heaviest. Against a chatty interactive baseline the
  character reduction would likely be larger.
- The skill itself is ~14KB of system prompt. It is cache-read on every turn and
  is not counted in the output-token figures above.
- An earlier version of this benchmark was invalid: user-level `SessionStart`
  hooks on the test machine were injecting a compression rule into the baseline
  arm, so oduncu was being compared against an already-compressed baseline.
  `--setting-sources project` fixes it. Worth checking on any machine that runs
  always-on style hooks.

## Prompts

```json
[
  {"id": "validate",  "kind": "task",     "prompt": "add() in calc.js should throw a TypeError when either argument is not a number. Add that and cover it in calc.test.js."},
  {"id": "rename",    "kind": "task",     "prompt": "In report.js, rename the parameter d to daysElapsed everywhere it is used."},
  {"id": "slug-bug",  "kind": "task",     "prompt": "slugify() in slug.js leaves a trailing dash when the title ends in punctuation. Fix it."},
  {"id": "docs",      "kind": "task",     "prompt": "Add a section to README.md documenting every function exported from calc.js and slug.js."},
  {"id": "failing",   "kind": "task",     "prompt": "Run calc.test.js with node. It fails. Make it pass without weakening what the test checks."},
  {"id": "why-regex", "kind": "question", "prompt": "Why does slugify() use a regex replace instead of split and join? Which is faster here?"}
]
```
