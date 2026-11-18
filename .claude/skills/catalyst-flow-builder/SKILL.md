---
name: catalyst-flow-builder
description: >
  Works on the Catalyst working prototype (repo shinyc01/catalyst-prototype) for Shiny and Mahsa, who are designers. Four jobs:
  (1) add a mini flow — usually a JTBD journey document like "J16 - Portfolio Owner - ….docx" or Figma links — building screens,
  data, logic, a guided tour and context, then publishing safely; (2) explain how something in the prototype works ("why does it
  show 33%?", "where does this number come from?", "what's assumed here?") from the context files; (3) change something — copy,
  layout, a rule, a number, a flow — keeping logic, data, context and tours in step; (4) answer an open question and record the
  decision. Also: review the prototype, sync / publish / update, and set it up on a new computer. Use whenever either of them
  mentions the Catalyst prototype, a J-numbered journey, a screen in it (Command, Explore, Study, Build, Plan, Compare), its tours,
  its logic or its open questions.
---

# Catalyst flow builder

You are building one **working mock Catalyst** that grows flow by flow. The people using this skill (Shiny, Mahsa) are designers, not developers: **you do all the git, code, data and testing work**, explain results in plain language, and never ask them to run commands except a one-time `gh auth login` they must do themselves.

Read these before anything else, every time:
- `CLAUDE.md` (standing rules) → `context/` files named there (product, glossary, logic, flows, screens, data, decisions, open questions).
- The references in this folder, as each step says: `references/journeys.md` (the mini-flow format), `references/build.md`, `references/data.md`, `references/flows.md`, `references/git.md`, `references/testing.md`.
- `context/README.md`: the map of what lives where, screen by screen. Start there for any question.

## Which job is this?
- **A new mini flow** (a journey document, a Figma link for a new flow, "add this"): follow **The run** below.
- **"How does … work?" / "Why does it show …?" / "What's assumed?"**: follow **Explain** below. Don't change anything.
- **"Change … / make it … / fix …"**: follow **Change** below.
- **"Answer open question n: …" / "We decided …"**: follow **Answer an open question** below.
- **"Review the prototype"**: open the live site in the browser pane, walk every tour, and report what looks off, as one list; change nothing until they pick.

## The run, start to finish (don't stop for plan approval — build, then hand over for review)

### 0. Make sure we're safe to start
1. Confirm you're in the repo (`git rev-parse --show-toplevel` ends in `catalyst-prototype`). If not: see `references/git.md` → *First time on a computer*.
2. Run `bash scripts/sync.sh status`. If there are unsaved changes or a conflict in progress from a previous session, deal with them first (save or resolve — never discard; see `references/git.md`).
3. Run `bash scripts/sync.sh start <short-flow-name>`. This gets the latest shared version and opens a private workspace (branch) for this flow. **Never work on `main`.**
4. Run `gh pr list --state open` and note what others are working on. If an open pull request changes the same screens or data, tell the user in one line and keep going; you'll reconcile at publish.

### 1. Understand the flow
1. Read the mini flow the user gave. It is usually a JTBD journey document (`J<n> - <persona> - <name>.docx`): read it with `python3 -I scripts/read-journey.py "<file>"` and follow `references/journeys.md`, which maps every section of the format to what to build. Keep its wording: save it verbatim to `context/flows/<id>.md` under "Source mini flow (verbatim)". The flow title starts with the journey number (`J16 · Plan · …`).
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

---

## Explain (no changes)
For "how does X work", "why does it show N", "where does this come from", "what's assumed".
1. Find the screen in `context/README.md`, then read its screen file, the logic file and the data notes it points to. Check the code it names (`shared/*.js`, `app/screens/*.jsx`) when the context is thin, and if the two disagree, say so: the code is what the prototype does.
2. Answer in plain language, short: what the user sees → the rule behind it → where the numbers come from. Work real examples with the actual numbers (e.g. "33% = 1 of 3 gates passed: Planning groups").
3. Tag each fact with its source: `[Whistler]` real demo data, `[Figma]`, `[Confluence]`, `[Confirmed]` decided by a designer, `[Assumed]` invented by Claude and waiting for confirmation, `[Added]` data filled in. Point out anything `[Assumed]` and its open question.
4. Give the deep link to see it (`https://shinyc01.github.io/catalyst-prototype/#…`) and the file names, so they can find it again.
5. End by offering the obvious change, if there is one ("Want the rule to be …?"). Don't make it unasked.

## Change
For copy, layout, a rule, a number, a flow.
1. Safety first, as in step 0 of the run: `sync.sh status`, then `sync.sh start <short-name>`.
2. Check the request against the Figma frame and `context/decisions.md`. If it **contradicts a frame or a recorded decision**, say which one in one line and ask before changing it. If it's clear, just do it.
3. Change it in the one place it lives: a rule → `shared/*-model.js` (never a number typed into a screen); data → the generator or the `[Added]` file; copy or layout → the screen. Then follow everything that depends on it: other screens using the same data, tours that point at a renamed label (`grep -rn "<old text>" app/flows`), and the context files that describe it (`logic/`, `screens/`, `data/`).
4. Log it: a dated line in `context/decisions.md` with who asked (`Source: Mahsa` / `Source: Shiny`). If it settles an open question, close it (below).
5. Test as `references/testing.md` says (checks, the browser at 1440×900, the affected tours), then publish (`save` → `finish`) and hand over with the live link and a before → after line.

## Answer an open question
For "answer open question 10: …", "we decided …", or a designer answering one in passing.
1. Find it in `context/open-questions.md`. Read back the question and the answer in one line to confirm you've got it right if there's any doubt.
2. Write the answer as `[Confirmed]` into the context file it belongs to (logic, screen, data or flow), and add a dated line to `context/decisions.md` (`Source: <name>`).
3. Remove it from `context/open-questions.md`, renumber, and fix any reference to the old number (`grep -rn "open question" context app`).
4. If the answer changes what the prototype does (e.g. an `[Assumed]` rule was wrong), make the change as in **Change** above. Then publish and say what changed.

