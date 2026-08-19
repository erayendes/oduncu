# oduncu

Silent-executor mode for coding agents.

Give it a task and it says `yaparım...`, does the work, and says `tamam.` Nothing in
between — no explanation, no summary, no progress notes, no task lists. Ask it a question
and you get a full answer.

Named after the villager in the Turkish dub of Age of Empires II, who answered every order
with one word.

```
you:    fix the token expiry bug in the auth middleware
agent:  yaparım...
agent:  tamam.
```

## Install

```bash
npx oduncu install
```

Finds every agent on your machine and installs into each. Nothing is written until you run
that command — there is no postinstall hook touching your home directory.

```bash
npx oduncu install --only claude,codex   # pick targets
npx oduncu install --all                 # every known location, found or not
npx oduncu install --dry-run             # show what would happen
npx oduncu where                         # paths and current state
npx oduncu uninstall                     # remove everywhere
```

One `SKILL.md`, six locations:

| Agent | Global skills directory |
|---|---|
| Claude Code | `~/.claude/skills/` |
| Codex | `~/.codex/skills/` |
| Antigravity | `~/.gemini/config/skills/` |
| Gemini CLI | `~/.gemini/skills/` |
| Cursor | `~/.cursor/skills/` |
| Agent Skills standard | `~/.agents/skills/` |

For a single project instead, drop `skills/oduncu/` into `.claude/skills/`,
`./.codex/skills/`, or `.agents/skills/` and commit it.

## Commands

| Command | Effect |
|---|---|
| `/oduncu kalk` | Mode on |
| `/oduncu yat` | Mode off |
| `/oduncu talk` | Trace on — the completion line carries the changed file paths |
| `/oduncu hush` | Trace off |
| `/oduncu lang <code>` | Language everything is answered in |
| `/oduncu help` | Print the command list |

Two pairs and a setting. `kalk`/`yat` drive the mode, `talk`/`hush` drive the trace.

## The four strings

| | |
|---|---|
| Task accepted | `yaparım...` |
| Task finished | `tamam.` |
| Tried, did not succeed | `yapamadım.` |
| Refuses to do it | `yapamam.` + reason |

`yapamadım.` and `yapamam.` are not synonyms. The first means it tried and failed, and
carries no reason. The second means it will not try — unsafe, or destructive beyond what was
asked — and always carries the reason, because a refusal you cannot understand is worse than
no refusal.

Turkish by default in every session, whatever language you write in. `/oduncu lang en`
switches to `will do... / done. / couldn't. / won't.`

## What it does not swallow

Silence is a register, not a gag. It breaks, in one line, for:

- an irreversible action you did not explicitly ask for
- ambiguity that risks the wrong irreversible thing
- a credential or security exposure found mid-task
- an unsafe request
- you repeating yourself, which means you did not get what you wanted

And never for a code comment, commit message, PR body, or doc. Those are written normally.
A commit message that says `tamam.` helps nobody.

## Does it save tokens

Yes, about as much as compressing every response does — but not for the reason you would
guess. Measured over three coding tasks, fresh agent per arm, identical work verified on
disk:

| Arm | Work tokens | vs baseline | Tool calls | Wall clock |
|---|---|---|---|---|
| Baseline | 41,925 | — | 22 | 322s |
| Prose compression only | 33,913 | −19% | 17 | 172s |
| oduncu, output silenced only | 43,150 | +3% | 13 | 149s |
| **oduncu, reasoning compressed too** | **34,617** | **−17%** | **13** | **122s** |

Silencing the output saved nothing: prose is 2–3% of a task's tokens, so deleting it is lost
in the noise. The savings come from compressing the *reasoning* — an agent with nothing to
narrate stops looking for things to narrate. Fewest tool calls and fastest of any arm.

Full method and caveats in [`benchmarks/`](./benchmarks). Every cell is n=1; the ±2%
differences are noise, the ±17-19% ones probably are not.

## Permissions

Approval prompts break the silence, so on first run oduncu offers the setting for whichever
agent you are in — `dontAsk` in Claude Code, `--ask-for-approval never` in Codex,
auto-approve in Antigravity. It offers; you apply it. A skill cannot change these itself, and
this one will never write your permission config unasked.

Whatever the agent, prefer the setting that **refuses** what is not on the allow list over
the one that **approves everything**. Both silence the prompts; only one leaves a floor under
the agent — and this mode is quiet, so you would never see what got skipped.

## Always on

One line in `~/.claude/CLAUDE.md` (or your agent's equivalent):

```
Oduncu mode starts on in every session. Active until /oduncu yat.
```

oduncu skips its first-run permission block when your config already has a permission mode
set, so it will not re-ask every session.

## License

MIT
