---
name: catalyst-flow-builder
description: >
  Adds a mini flow to the Catalyst working prototype (repo shinyc01/catalyst-prototype): reads the mini flow and its Figma /
  Confluence sources, builds the screens and interactions into the one growing app with Catalyst Design System 2.0, extends the
  shared mock data layer, registers the flow with a guided tour in the Flows panel, updates the product context, tests it, and
  publishes it safely to GitHub (branch → checks → pull request → merge) so two people can work in parallel without overwriting
  each other. Use whenever Shiny or Mahsa gives a mini flow, a Figma link for a new flow, or asks to "add this flow", "build this
  into the prototype", "update the prototype", "publish", "sync", or to fix something in the Catalyst prototype. Also use for
  first-time setup on a new computer.
---

# Catalyst flow builder

You are building one **working mock Catalyst** that grows flow by flow. The people using this skill (Shiny, Mahsa) are designers, not developers: **you do all the git, code, data and testing work**, explain results in plain language, and never ask them to run commands except a one-time `gh auth login` they must do themselves.

Read these before anything else, every time:
- `CLAUDE.md` (standing rules) → `context/` files named there (product, glossary, logic, flows, screens, data, decisions, open questions).
- The references in this folder, as each step says: `references/build.md`, `references/data.md`, `references/flows.md`, `references/git.md`, `references/testing.md`.

## The run, start to finish (don't stop for plan approval — build, then hand over for review)

### 0. Make sure we're safe to start
1. Confirm you're in the repo (`git rev-parse --show-toplevel` ends in `catalyst-prototype`). If not: see `references/git.md` → *First time on a computer*.
2. Run `bash scripts/sync.sh status`. If there are unsaved changes or a conflict in progress from a previous session, deal with them first (save or resolve — never discard; see `references/git.md`).
3. Run `bash scripts/sync.sh start <short-flow-name>`. This gets the latest shared version and opens a private workspace (branch) for this flow. **Never work on `main`.**
4. Run `gh pr list --state open` and note what others are working on. If an open pull request changes the same screens or data, tell the user in one line and keep going; you'll reconcile at publish.

### 1. Understand the flow
1. Read the mini flow the user gave (Mahsa's template format — keep its wording; save it verbatim to `context/flows/<id>.md` under a "Source mini flow" heading).
2. For every Figma link: screenshot the frames and write a frame spec (layout top to bottom, components, exact copy, states, dev notes) into `context/screens/<screen>.md`. For big files, use a subagent exactly like `context/screens/command-figma-spec.md` was made. **The Figma frame is the spec.**
3. Map each step to the app: which existing screen it extends, which new screen it needs, what data it reads/changes.
4. Collect **gaps and conflicts**: data the store doesn't have, logic not in `context/logic/`, a frame that contradicts a recorded decision. Ask the user only about real conflicts or product decisions (one short list, all at once). Everything else: decide sensibly, tag it `[Assumed]`, and list it in the hand-over.

### 2. Build (`references/build.md`, `references/data.md`)
1. Use **Catalyst Design System 2.0 only** (`vendor/ds2/`; look components up in `vendor/ds2/api.md` with `bash scripts/entry.sh Name …`). Anything not in the kit: build it, wrap it in `NDS`, and name it in the hand-over.
2. Screens go in `app/screens/<screen>.jsx`; new files are added to `index.html` in the right order. Routes are hashes (`#screen?param=…`) and every meaningful state has one.
3. Data comes from the shared layer only (`shared/`). Need a new record or field? Pull it from the Whistler demo data (`scripts/make-whistler-data.py`) or add it to `shared/whistler-additions.js` / a new `shared/<domain>.js` tagged `[Added]`, linked to existing records so totals and IDs stay consistent across every screen. Never type a number into a screen.
4. Anything a tester changes that should stick (created items, status changes, reorders) uses `usePersisted`.
5. Keep earlier flows working. If you must change shared code, check every screen that uses it.

### 3. Register the flow (`references/flows.md`)
Add `app/flows/NNN-<id>.js` (next number) with title, summary, persona, date, who added it, sources, and tour steps that point at real elements. Run `python3 -I scripts/manifest.py`.

### 4. Test (`references/testing.md`)
1. `node scripts/check.mjs` must pass.
2. Serve the repo root and open the app in the browser pane at 1440×900: compare each new screen with its Figma frame side by side and fix differences; click through every new interaction; walk the new tour **and one older tour** end to end; check the console for errors.
3. Fix everything you find before publishing.

### 5. Update the context
Update the affected `context/` files (screens, flows, logic, data, glossary), add dated lines to `context/decisions.md`, add open questions to `context/open-questions.md`. Every new fact gets a source tag (`[Confirmed]`, `[Figma]`, `[Confluence]`, `[Assumed]`, `[Added]`).

### 6. Publish safely (`references/git.md`)
1. `bash scripts/sync.sh save "<what changed>"` (runs the checks, uploads the workspace).
2. `bash scripts/sync.sh finish "<Flow: title>"` — it re-syncs with the latest shared version, re-runs the checks, opens a pull request, waits for GitHub's checks and merges.
3. If it stops on a **conflict** (exit 3), resolve it as `references/git.md` describes — keeping both people's work — then run `bash scripts/sync.sh update` and `finish` again. If anything else stops it, read the message, fix the cause, and retry; never bypass a safeguard.

### 7. Hand over
1. Build the offline copy if asked (`bash scripts/build-standalone.sh`) and open the live site or local build in the user's browser.
2. Tell the user, in plain language: the live link (`https://shinyc01.github.io/catalyst-prototype/`) and deep links for the new screens; how to start the new tour (gear → Prototype settings → the flow → Start tour); what's clickable; what's `[Assumed]` or `[Added]`; non-DS parts; open questions; and that it's merged (pull request number).
