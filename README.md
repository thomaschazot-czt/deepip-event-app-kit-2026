# deepip-event-app-kit

Starter kit for building the sales app for one DeepIP event. Each event starts
from a copy of this repo.

No contact data, no photos of people, no exports are ever committed here. See
CLAUDE.md, section 2. **This repo is currently public**, because it serves a built
app from GitHub Pages on a free plan — which means its history is public too, so
run the `git grep` check from CLAUDE.md section 6 before every push.

## How it is used

1. **Set up**, in a normal Claude conversation, using the phase A prompt on the
   Notion page "Event Sales App, build kit and handover". It produces a build
   brief and a filled configuration.
2. **Build**, in Claude Code, on a copy of this repo, using the phase B prompt.
   CLAUDE.md is the contract.
3. **Close out**, a few days after, with the phase C prompt.

Claude Code reads CLAUDE.md first. Do not skip it and do not edit it casually:
it is where the field lessons from Munich and Budapest are recorded.

## Files

| File | What it is |
|---|---|
| `CLAUDE.md` | The contract. Rules, interview, architecture, checklist. |
| `config.template.js` | Copy to `config.js` and fill. The only file you edit per event. |
| `Code.gs` | Apps Script backend. Only the configuration block at the top changes per event. |
| `appsscript.json` | Apps Script manifest. Only `timeZone` changes, per event. |
| `tests/` | Regression tests for the engine. No dependencies. |

## Checking a change

```
node tests/filters-and-priority.test.js
```

No dependencies and no DOM: `model.js` and `ui.js` are string templates over plain
objects, so every screen can be rendered over invented people in a Node `vm` and
read as text. The people in the tests are invented. Never put a real one there.

## State of this repo

Complete and proven. `Code.gs` and the full frontend engine (`store.js`, `auth.js`,
`sync.js`, `model.js`, `ui.js`, `app.js` and the shell files) are all here, and all
three phases have been run end to end. Two events have shipped from this kit: VPP
Herbstfachtagung (October 2026) and "Beyond the pilot", Paris (November 2026).

A new event is a copy of this repo plus a filled `config.js` and the configuration
block at the top of `Code.gs`. Copy the files; do not fork, so that no history
travels with them.
