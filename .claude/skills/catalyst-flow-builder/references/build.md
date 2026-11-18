# Building screens

## How the app is put together (no build step)
- `index.html` loads React 18, Babel standalone and MapLibre, then the app's own files. Those are listed in order in the `#app-files` JSON block:
  - `css`: DS 2.0 css, then `app/styles.css`;
  - `js`: DS 2.0 js (`window.IFS`), the data layer (`shared/*.js`), then `app/flows/index.js`;
  - `babel`: `ui.jsx` → `map.jsx` → `store.jsx` → `screens/*.jsx` → `tour.jsx` → `main.jsx`.

  A small loader adds `?v=<now>` to each file, so a publish never leaves a browser with a mix of cached old files and new ones. **To add a file, add it to the right list in `#app-files`.** `scripts/check.mjs` fails if a listed file is missing, and `scripts/build-standalone.py` reads the same list.
- Every file shares one global scope (top-level `const` / `function` are visible to later files). Names must be unique across files: grep before adding a top-level name.
- Kit components are destructured from `IFS` in `app/ui.jsx`. Add new ones there.
- `app/main.jsx` owns routing: `initialFromHash()` turns a hash into state, the effect writes state back to the hash, and a `hashchange` listener applies links and tour steps. A new screen needs: a `screen` value, a hash, a branch in `initialFromHash`, a render line, and navigation from the NavBar/`onStage` if it's a stage.
- GitHub Pages serves the repo as-is: what's on `main` is the live site. It must work over `http(s)`; the offline single file comes from `scripts/build-standalone.sh`.

## Design system rules
- **Catalyst Design System 2.0 only**: `vendor/ds2/`. Its API is `vendor/ds2/api.md`, with examples in `examples.md`, and usage and placement rules in `rules.md`, `components.md` and `usage.md`. Look a component up with `bash scripts/entry.sh Name1 Name2` rather than reading the whole file.
- Use props as the handovers use them (the **In handovers** line in api.md).
- Use **tokens only**. Colours are `var(--…)`; typography uses the `.t-*` classes or the DS 2.0 type tokens (`--text-*`). No hex or rgba values, which `scripts/check.mjs` enforces. Canvas and WebGL colours are read from tokens at runtime.
- **Non-DS parts.** Anything the kit doesn't have is wrapped in `<NDS label="what it is">`, which shows the "Not in DS" flag when "Show non-DS parts" is on (Prototype settings, off by default). List each one in the hand-over.
- **Updating DS 2.0** happens only on purpose: `bash scripts/update-ds.sh`, then re-check every screen and commit the update on its own.
- **DS 2.0 content rules** (Title Case for titles and buttons, and so on) are in `vendor/ds2/rules.md`. Follow them in new copy.

## Fidelity
- **The Figma frame is the spec.** Match layout, controls, labels and card order exactly. Logic changes values, never UI.
- When frames disagree with each other, follow the most complete frame and note the inconsistency in the screen's context file.

## Persistence and presentation
- **Tester changes that should stick:** use `const [x, setX] = usePersisted('screen.key', initial)` (from `app/store.jsx`), with keys namespaced by screen and persona. "Reset demo" clears them.
- **Prototype controls** live only in the Prototype settings drawer, which opens from the NavBar gear (`onSettings`). Never put prototype or debug UI on the screens themselves; add it to `SettingsPanel` in `app/tour.jsx`.

## Known DS 2.0 issues (work around them; don't patch the kit; report them in the hand-over)
- **Drawer with `overlay="base"` or `"strong"`:** the scrim (`.ifs-overlay`, z-index 500) renders above the drawer (`.ifs-drawer`, z-index 200), so the drawer can't be clicked. Use `overlay="none"`; the drawer still closes with ✕ and Esc. Found 2026-11-18 in vendor/ds2 (repo commit 0696ac5). Re-check after `scripts/update-ds.sh`.
- **`SystemConfidence` hard-codes "Approval readiness":** it doesn't pass a label to `ConfidenceGates`. For another label (Plan: "Optimization readiness"), compose it from `Panel` + `ContentCard` + `ConfidenceGates label=…` + `IssueKindSwitch` + `IssueNavigator`, with the kit's `ifs-trc-*` class names (see `app/screens/plan.jsx`). Found 2026-11-18.
- **Icons only exist at some sizes.** A size-S button draws 12 px icons, and an icon without a 12 px version renders as an empty dotted box (`ifs-icon--missing`). Check the sizes in `vendor/ds2/ifs-ds.js` before using an icon in a small button (e.g. `system-mail-message` has 12 px; `system-mail-user` doesn't).
- **`TextField` doesn't forward `onBlur` / `onKeyDown`.** Control it (`value` + `onChange`) and put those handlers on a wrapper element.
