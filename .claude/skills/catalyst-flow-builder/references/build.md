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
- Use **tokens only, for everything** (DS 2.0.2 foundations: `vendor/ds2/spacing.md`, `layout.md`, `typography.md`). `scripts/check.mjs` enforces it.
  - Colours: `var(--…)`. Canvas and WebGL colours are read from tokens at runtime.
  - Spacing: `--space-*` (100 = 4px: 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1100). Containers (cards, panels, drawers, modals, popovers) pad with `--space-inset` on all four sides, blocks inside them sit `--space-stack` apart, page sections `--space-section`. Cards on a page: `--page-gap`. Inside controls, rows and gaps of 8 or less use fixed steps.
  - Sizes: `--size-*` (ruler), `--control-h-s/m/l`, `--region-panel` (380), `--region-panel-l` (600), `--overlay-width-s/m/l` (320/440/600), `--table-col-*` for table columns (pass the token as the column `width` string).
  - Page screens (not maps): content goes in `<div className="page">` (page margin, 1600 cap, centred); cards and columns go in `.ifs-grid` with `.ifs-span-N` (or `.ifs-span-rest` + `.ifs-span-panel` for a side column, `.is-halves` for 6 + 6). Docked panels sit outside `.page` in `.page-dock`. Test at 1440, 1280 and 900 wide.
  - Density: every screen must work in Spacious, Comfortable and Compact (Prototype settings → Display). Use the roles (`--space-inset`, `--space-stack`) and the `.t-*` styles so it follows; check new screens in all three.
  - Map screens: add `ifs-slots` to the map container; right panels use `.ifs-slot-right`, the large left panel `.ifs-slot-left`; anything else on the map sits `--page-margin` from the side edges and `--space-300` from top and bottom.
  - Text: the semantic `.t-*` classes or `font: var(--text-…)` + `letter-spacing: var(--text-…-tracking)`; never a font size, weight or line height number. No uppercase: Label/M/medium in sentence case. Card, panel and modal titles are `t-heading-h4-semibold` in Title Case; sub-sections inside them `t-label-m-medium`.
  - Layers: `--z-index-*` or the `--proto-z-*` tokens.
  - Anything the DS has no token for: add a `--proto-*` token to the `:root` block at the top of `app/styles.css`, built on `--proto-unit` (= `--space-100`) or a DS region, with a comment saying what it is. Never a raw number in a screen. JS geometry reads tokens with `tokenPx('--space-300')` (app/ui.jsx).
  - Exceptions: MapLibre paint and camera padding (px by API), numbers passed to a DS component's own props (icon `size`, chart `height`), `opacity: 0/1`. Anything else needs a `tokens-ok` comment on the line and a note in `context/decisions.md`.
- **Non-DS parts.** Anything the kit doesn't have is wrapped in `<NDS label="what it is">`, which shows the "Not in DS" flag when "Show non-DS parts" is on (Prototype settings, off by default). List each one in the hand-over.
- **Updating DS 2.0** happens only on purpose: `bash scripts/update-ds.sh`, then re-check every screen and commit the update on its own.
- **DS 2.0 content rules** are in `vendor/ds2/content.md` (voice, labels, messages) and the Case rule in `typography.md`: Title Case for page, card, panel and modal titles and navigation; sentence case for buttons, statuses, column headers and all content. Follow them in new copy.

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

- **One global scope gotchas** (all app files share it): never declare a top-level name twice (check.mjs now fails on it), and avoid object-rest destructuring (`const { a, ...rest } = x`) outside `app/ui.jsx`: Babel emits a top-level `_excluded` helper per file, and two of them crash the app. Copy and `delete` instead.
