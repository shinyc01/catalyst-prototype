# Catalyst Design System 2.0.4 — rules

The one rulebook. Each rule is stated once; other files point here by number (e.g. "rule 3.9").
Values are Spacious / Comfortable / Compact unless a rule says otherwise. Comfortable is the default.
Components and patterns: [components.md](components.md). Props: [`dist/api.md`](../dist/api.md). Figma keys, nodes and review items: [figma.json](figma.json).
When Figma frames and Figma notes disagree, the notes win. When a guide and the code disagree, the code wins.

---

## 1. Tokens and code

1.1 **Raw values only in the foundations.** Colour, spacing, radius, type and shadow values live in `src/tokens.css` and `src/foundations/*.css`. Everything else uses `var(--…)`. A raw value is allowed only where Figma itself has no variable; mark it `/* raw in Figma */`.
1.2 **Semantic tokens, not numbers.** Spacing uses the `--space-*` roles and steps (rule 3.1–3.2); type uses `font:var(--text-<style>);letter-spacing:var(--text-<style>-tracking)` (rule 2.1). A style's token is its name in lowercase with `/` → `-`: Heading/H4/semibold → `--text-heading-h4-semibold` + `--text-heading-h4-semibold-tracking`, class `.t-heading-h4-semibold`. Never write a size, weight, letter-spacing, padding, gap or margin as a number. Old names are aliases only; don't use them in new code: `--spacing-modal` / `--spacing-form` → `inset-l`, table cell sides → `table-x`, cell y → 0, card-compact → `stack` (the other `--spacing-*`, `--gaps-*`, `--paddings-*` likewise); `--type-caption` = `--type-s`.
1.3 **px in Figma, rem in code.** Figma stays in px. Code ships every size that holds text or icons in rem at a 16px base (16px = `1rem`): type, the spacing scale, `--size-*` from 4 up, control, tab, nav and table sizes, icons and layout widths. Still px: 1–3px lines (borders, dividers, focus rings, `--size-0` … `--size-3`), radius, letter-spacing, `@media` breakpoints, and chart, map-pin and canvas geometry. Guides give numbers in px.
1.4 **Start and end, never left and right.** All new and changed code uses logical properties (`margin-inline-start`, `padding-inline-*`, `inset-inline-*`, `border-inline-*`, `text-align:start|end`; in JSX `marginInlineStart` …). Geometry that must not mirror (chart time axes, canvas coordinates) keeps physical values with a `/* ltr: reason */` comment. In RTL the side nav moves to the right and directional icons (arrows, chevrons, back) flip; numbers, media controls, chart time axes, check marks, clocks, trends and logos never mirror. Progress: `node tools/check-direction.mjs`.
1.5 **Layout spacing in screens uses `IFS.Stack` (top to bottom) and `IFS.Inline` (side by side, in reading order),** never a hand-written `display:flex; gap`. Props on both:
- `gap`: a role (`inset`, `stack`, `section`, `page-gap`) or a scale step as a string (`"200"`); default `stack`; anything else warns and falls back to `stack`.
- `align` start | center | end | stretch (Inline also `baseline`), default stretch; `justify` start | center | end | between, default start. Logical values only.
- Inline `wrap` (default off; wrapped rows keep the gap). `as` (element, default `div`), `className`, `style` (size and surface only, not layout).

Cards on the page grid use `.ifs-grid` (rule 4.2). Components keep their own CSS.
1.6 **Building kit components** (`src/components/<family>.css + .jsx`, one pair per Figma family):
- Match the Figma component exactly; never invent one Figma doesn't have. Get exact specs with `tools/extract-spec.js` via `use_figma` and see the target with `get_screenshot`; never use `get_design_context` code as the implementation. Figma variable `a/b/c` is `var(--a-b-c)` (lowercase; spaces, `/` and `,` become `-`; parentheses dropped). A Figma fill with no variable keeps its hex (rule 1.1).
- Class names: `.ifs-<component>` block, `--<modifier>` per Figma variant value.
- Strokes keep the Figma box: INSIDE → `box-shadow: inset 0 0 0 Wpx`, OUTSIDE → `box-shadow: 0 0 0 Wpx`, CENTER → `outline` with a −W/2 offset. Use `border` only when the stroke changes layout.
- States: Hover / Pressed / Disabled / Focus → `:hover`, `:active`, `:disabled` / `[aria-disabled=true]`, `:focus-visible`, plus `[data-state=hover|pressed|focus]` for the gallery.
- Focus ring: `box-shadow: 0 0 0 1.5px var(--focus-focus-inner), 0 0 0 3px var(--focus-focus-outer)`. Effect `blur/medium` → `backdrop-filter: blur(var(--blur-medium))`.
- JSX: React 18 function components; each file imports `IFS` from `./registry.js`, uses other components as `IFS.Button` (no cross-family imports) and ends with `Object.assign(IFS, { … }); export { … };`.
- Props mirror Figma properties in camelCase with lowercase values (`Type=Primary` → `type="primary"`, `Size=M (32)` → `size="m"`, `show-icon-left` + `Icon left` → `iconLeft="system-heart"`; no icon prop = hidden); text properties → `children` or a named prop. Interactive components work for real and also take controlled props (`value`/`onChange`, `open`/`onOpenChange`).
- Icons: always `<IFS.Icon name="…" size={16} />` with a Figma icon name; never inline SVG or an icon font.
- The header comment names the Figma source: `// Figma: button (65:3211)`. Add every variant and state to `src/gallery/<family>.jsx` and compare the story with Figma before calling it done.

---

## 2. Type

2.1 **Two token layers, like Figma.** Primitives (families, weights 400 / 500 / 600, letter-spacing steps, size/line-height pairs `--type-s|m|l|h3|h2|h1|display-*` per density) and one semantic set per style: `--text-<style>`, `-tracking`, `-weight` (`src/foundations/typography.css`; naming: rule 1.2). The semantic set is declared on `:root` and every `[data-density]` container, so text follows the nearest density. Components and prototypes use only the semantic set; `.t-<style>` classes exist for prototypes. Every text in the kit uses a style, including chart SVG text.
2.2 **Levels** (size/line height):

| Level | Token | Spacious | Comfortable | Compact |
|---|---|---|---|---|
| Small | `--type-s` | 14/20 | 12/16 | 11/14 |
| Body | `--type-m` | 16/24 | 14/20 | 12/16 |
| Large | `--type-l` | 18/26 | 16/24 | 14/20 |
| H3 | `--type-h3` | 22/28 | 20/28 | 16/24 |
| H2 | `--type-h2` | 26/32 | 24/32 | 20/28 |
| H1 | `--type-h1` | 32/40 | 28/36 | 24/32 |
| Display S / M / L | `--type-display-s/m/l` | 36/44 · 40/48 · 48/56 | 32/40 · 36/44 · 44/52 | 28/36 · 32/40 · 40/48 |

2.3 **16 styles** (tracking in px):

| Style | Level | Weight | Tracking |
|---|---|---|---|
| Display L / M / S | Display L / M / S | 500 | −0.5 |
| Heading/H1/medium · H2/medium · H3/medium | H1 · H2 · H3 | 500 | −0.3 · −0.2 · −0.1 |
| Heading/H4/semibold | Large | 600 | 0 |
| Body/L/regular · Body/M/regular (default) · Body/S/regular | Large · Body · Small | 400 | −0.1 · 0 · +0.1 |
| Label/L/medium · Label/M/medium | Large · Body | 500 | −0.15 · 0 |
| Code/M/regular · Code/M/medium · Code/S/regular (mono) | Body · Body · Small | 400 · 500 · 400 | 0 |

Retired classes still work and render as: Code regular / medium → Code/M; Label/M/semibold, Label/S/medium, Label/S/UPPER, Caption UPPER, Body/M/medium, Heading/H4/medium → Label/M/medium; Label/L/semibold → H4; Body/L/medium → Label/L/medium. Caption semibold UPPER, H3 uppercase, H4 upper, Label/L upper → Label/M/medium; `.t-display` → Display/M. Label/M/UPPER is removed (style, tokens and class).
2.4 **Pick the style by role:**

| Role | Style |
|---|---|
| Hero or form page title (rare) | H1 |
| Page title in `PageTop` (broad pages), once per page | H2 |
| Title in the thin `PageHeader` and `ExploreHeader` | Label/M/medium |
| Page section on the page background (not in a container) | H3 |
| Title of a card, panel, modal, drawer, table card, side nav, empty state; every `ContentCard` title (S and M), readiness cards, Cooper fix cards, widget cards | H4 |
| Chart card (`DataVizCard` header) and stat card titles | Label/M/medium, text tertiary |
| Command list card title (`HomeRowCard`), notification titles | Label/L/medium |
| Sub-section inside a titled container | Label/M/medium, primary colour |
| Content, typed text, menu items, options, cells | Body/M/regular |
| Name, primary column, item title, key value | Label/M/medium |
| Control text (button, tab, chip, segmented, badge, nav item) | Label/M/medium; L controls Label/L/medium |
| Status, tag, badge, table header, nav group header, eyebrow | Label/M/medium |
| Meta: time, author, ID, file size, helper text, captions | Body/M/regular, secondary or tertiary colour |
| Long reading, L-field input | Body/L/regular |
| Code, formulas, JSON | Code/M (Code/S only inside Small text) |
| Disclaimer, footnote | Body/S/regular |

Exceptions (H3 inside a container): the Trace report issue title (the issue is the panel's main subject) and the `Calendar` month/year title.
2.5 **Heading order** follows the page from the outside in: H2 page → H3 page section → H4 container → Label/M/medium sub-section. Don't skip a level: if cards are grouped into sections, each group gets an H3. H1 and H2 are never titles inside a card or panel. The HTML level is separate from the look: pick `<h1>`–`<h4>` so the screen-reader outline stays in order (the thin header's title is the page's top heading).
2.6 **Big numbers** sit next to a label that says what they are:
- H3 (stat card S), the default (`StatCard` is S when no `size` is passed, 2.0.4; `StatCardsRow` takes `size` per card): every stat card under a page title (`PageTop` H2, or on an entity step the H3 heading at the top of the content, e.g. "Setup" on Plan › Setup, "Approval" on Plan › Approve; Plan home) and every number inside a card or section with other numbers beside it (alternatives on Build › Shape, comparison rows, before → after pairs inside a card, metric rows). A 24 number under a 24 or 20 title would compete with it. Use `StatCard size="s"`, not loose heading text (Nov 20).
- H2 (stat card M, pass `size="m"`): only a row of key figures that is the first thing on the page, with no page title above it (only the thin header), e.g. the Value overview; also the donut centre, the Cooper chat card number and Command "1 Year".
- Display/M: one hero number that is the point of the view (gauge); at most one per screen.
- Label/M/medium: numbers inside content (table cells, lists, sentences). A number in a table never uses a heading style.
- Never H1 for a number. Revisit if prototypes keep overriding this.
2.7 **Small is rare.** Only disclaimers and footnotes, and text inside a fixed small shape: avatar initials at 24 and below, map pin counts, live-cursor name tags, chart axis ticks, labels inside Sankey bars. Never labels, statuses, headers, meta or anything the user acts on. Avatar initials: XL (56) H4; L (40) and M (32) Label/M/medium; S (24) and below Body/S (XS 20 and XXS 16 one initial). M and L map pins widen into a pill when the count needs it; a live-cursor tag grows with its text. In-plot chart values Label/M/medium. Widget thumbnails: title Label/M/medium, tiny text drawn as skeleton bars. Navbar wordmark fallback H3.
2.8 **Weights mean something:** 400 content, 500 every label, name and control, 600 H4 only. A row with no name or key value is all regular. In tables the name column (`primary: true`, else the first text column; `.ifs-table__td--primary`) is medium; every other cell is regular. Bold words inside text use `--text-label-m-medium-weight`.
2.9 **Case.** Title Case: page, section, card, chart, panel and modal titles, headings and navigation. Sentence case: buttons, dropdown triggers, statuses, column headers, menu items, options, field labels, Cooper prompts and answers, all content. Tags, badges and chips keep the case their text is written in (normal case, never forced). No uppercase text: only avatar initials and abbreviations are capitals. Case is a string change, not CSS.
2.10 **Status vs tag.** A status shows the object's changing state: coloured dot + 1–3 words ("Draft", "Under review"). A tag or badge shows a category, stage, count or attribute: pill, no dot ("Shape", "0/4"). One status per object; a second state is a tag or an icon. Never make a tag look like a status.
2.11 **Tabular figures** (`font-variant-numeric:var(--text-numeric)`, `.t-numeric`) for numbers people compare or watch change: table and list cells, big numbers, chart text, counters, progress and pager values. Numbers inside sentences keep normal figures.
2.12 **Line length and truncation:**
- Reading text (descriptions, Cooper answers, help, empty-state text) wraps at about 75 characters (`max-width:var(--text-measure)`, `.t-measure`).
- Titles, names, labels, buttons, tabs, statuses, table headers: one line, "…", full text in a tooltip (`.t-truncate`).
- Table and list cells: one line with "…" and a tooltip; a column may opt into wrapping to 2 lines.
- IDs and file names truncate in the middle (`TruncatedText mode="middle"`).
- Never truncate numbers, statuses in a table cell, error messages or anything the user acts on: the layout changes instead.
2.13 Paragraph spacing comes from spacing tokens, not type. Weights, letter-spacing and case are the same in every density.

---

## 3. Spacing and sizing

3.1 **One scale.** `--space-0` … `--space-1100` (100 = 4px): 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80. Dimensions use `--size-*` (rem from `--size-4` up; `--size-0` … `--size-3` stay px, rule 1.3). Neither changes with density.
3.2 **Roles (change with density):**

| Role | Values | Use for |
|---|---|---|
| `--space-inset` | 20 / 16 / 12 | Padding of every container part, all four sides: cards (stat, chart, content), panels, drawers, popovers, empty states |
| `--space-inset-l` | 24 / 20 / 16 | Padding of modals and form cards |
| `--space-table-x` | 20 / 16 / 16 | Table card padding and table cell sides |
| `--space-stack` | 16 / 12 / 8 | Gap between blocks inside a container (fields, cards in a panel, toolbar to table) |
| `--space-section` | 40 / 32 / 24 | Gap between page sections |

3.3 **Containers.** Every part of a container (header, tabs, body, footer) has the same inset on all four sides. A container's height comes from its padding, never a fixed height. Chat, history and agent headers: vertical padding = inset − 4 (`--space-100`), i.e. 16 / 12 / 8; the height = tallest item + that padding (chat and history headers 60 / 48 / 40; the agent window header 68 / 56 / 44, because it holds an M button).
3.4 **Fixed steps only where a part scales by its own height:** inside controls (buttons, fields, selects, tabs, chips, prompts, chat input), the nav bar and side nav, chart geometry, table-like rows and cells, and gaps of 8 or less (icon to label, label to field). These stay the same in every density; each is commented in the CSS. The allowed kinds: list and note rows (fixed vertical step, inset sides); a tab row sits on its divider (no bottom padding); full-bleed lists leave side padding to their items; the collapsed panel rail; header bars (`PageHeader`, `ExploreHeader`): tallest part + 4 top and bottom, page margin at the sides; never a fixed height. So the thin header is 50 / 46 / 42 with a stepper (the stepper is 42 / 38 / 34) and 36 / 32 / 32 without one (S buttons and icon buttons), and the ExploreHeader 36 / 32 / 32 (Spacious / Comfortable / Compact).
3.5 **Control heights** (`--control-h-s|m|l`): S 28 / 24 / 24, M 36 / 32 / 28, L 44 / 40 / 32. Every control uses them, including small segmented controls, icon buttons, nav items and breadcrumbs. Tabs `--tab-h-m` 40 / 36 / 32 and `--tab-h-l` 48 / 40 / 36; nav rows `--nav-row-h` 44 / 40 / 36.
3.6 **Fixed component sizes:** chips 28 / 24 / 24; search, Smart Search, popover search, phone picker, checkbox and radio rows 36 / 32 / 28 (the Explore map-bar search uses the small control height); badges S 24 / 20 / 20, M 28 / 24 / 24, L 36 / 32 / 28; small icon button square 28 / 24 / 24.
3.7 **Tables:** rows `--table-row-h` 64 / 52 / 40, content centred; header `--table-header-h` 40 / 32 / 24, text centred, no vertical padding; cells have no top/bottom padding; hairline row separators at most. One density per table. Every table, including ranked and approval-chain tables, sits in the one table card (`.ifs-table-card`, radius 8, `surface/secondary-alpha` fill).
3.8 **Menus, dropdowns and popovers:** 4px from the trigger and 4px inside the list, every density. Item height = control height 36 / 32 / 28 (large lists 44 / 40 / 32). `Menu` width s 200 (actions) or l 320 (items with descriptions).
3.9 **Target size: nothing clickable is smaller than 24 × 24** (`--target-min`, WCAG 2.5.8):
- The clickable component's own box is at least 24 (table filter and sort, version toggle, title menu ▾, select clear, drag handles, node-card buttons, readiness indicators, timeline and Cooper toggles). Icons keep their size; hover and focus fill the box. The Figma component gets a 24 frame.
- An invisible 24 hit layer only where the control must look smaller: bare checkbox, small switch, slider thumb, the options of a small segmented control (24 outside, 20 options inside the 2 frame; each option's area reaches the full 24), and the range-field stepper (it keeps its look; each 16 × 8 half gets an invisible area 24 wide and 12 tall, growing outward so the halves never overlap).
- Map pins and chart points: to be decided in the map and data-viz rounds. Touch targets (44–48): with the tablet and mobile work.
3.10 **Icon-only controls are always `IconButton`** (ghost S by default): select clear ×, table filter, node-card Open / Delete / Save / Cancel, compare clear, answer-field cancel / save, popover search clear, the timeline phase toggle (caret `IconButton` S; the phase name is plain text). Drag grips are 16 in a 24 box and use the ghost-button hover fill. The focus ring applies where the handle is keyboard-focusable (table row and column-settings handles); the node-card grip is pointer-only (the card itself takes keyboard focus).
3.11 **Icons** follow body text: `--icon-scale` 1.143 / 1 / 0.857 (16 → 18 / 16 / 14). Figma sizes 24 / 16 / 12: `Button` L and M 16, `Button` S 12; `IconButton` 16 at every size; 16 in dense rows; 12 in badges and chips; 24 only for standalone icons. Every expand/collapse and dropdown caret is 16; trend arrows next to numbers stay small.
3.12 **Small fixed gaps:** stat card title to number 4; empty state: icon, heading and text one inset apart (20 / 16 / 12), buttons one `section` below the text; Cooper's empty chat text sits two `section` above the bottom (80 / 64 / 48).
3.13 **Density.** Users pick Spacious, Comfortable or Compact (`data-density="spacious|comfortable|compact"` on `<html>` or any container; `IFS.setDensity('compact')` sets and remembers it, `IFS.getDensity()` reads it). Type, roles, control and table sizes follow the nearest density; `--density-scale` 1.2 / 1.05 / 0.95 multiplies fixed table column widths; the page grid follows screen width, never density (rule 4.1). Figma builds Comfortable and Compact; the code also has Spacious.

---

## 4. Layout

4.1 **Breakpoints and page grid, by screen width.** Designs use a 1440 × 810 desktop reference frame.

| Name | Width | Columns | `--page-margin` | `--page-gap` (gutter) |
|---|---|---|---|---|
| xs | < 600 | 4 | 16 | 16 |
| sm | 600–1023 | 8 | 24 | 16 |
| md | 1024–1439 | 12 | 24 | 16 |
| lg | 1440–1919 | 12 | 24 | 20 |
| xl | 1920+ | 12 | 32 | 32 |

4.2 **Cards and page regions snap to columns:** `.ifs-grid` with `.ifs-span-N`; `.ifs-span-panel` / `.ifs-span-rest` for a side column that is part of the page (3 columns, 4 below 1440; Command's right column is one of these, on columns). Below 1024 quarters become halves and wider spans go full width; below 600 everything is full width. Content inside a card follows the card, not the grid. Cards on a page are `page-gap` apart.
4.3 **Page container:** wrap each page's content in `.ifs-page`. It has the page margin on all four sides (top and bottom match the sides: 16 / 24 / 32 by width), caps content at `--layout-max-content-width` (1600), centres it, and spaces blocks a page gap apart. Docked panels sit outside it.
4.4 **The grid follows the content area** (beside the side nav and any pushed panel). A pushed panel shrinks it and the columns step down (12 → 8 → 4) like a smaller screen. An `over` panel or overlay (floating Cooper chat, record preview, popover, modal) never changes the grid.
4.5 **Fixed widths:**

| Surface | Width | Token |
|---|---|---|
| Side nav / rail | 240 / 48 | `--region-sidenav` / `--region-rail` |
| Side panel, drawer, widgets drawer | 380 (min 320, max 50%) | `--region-panel` |
| Cooper full chat | 380 by default; resizable by drag from 380 to 720 | `--region-panel` |
| Large panel (Study) | 600 | `--region-panel-l` |
| Popover (default; never under 160; wider only at `--overlay-width-m` 440 or `-l` 600), collaborators panel, Layers popover | 320 | `--overlay-width-s` |
| Modal (default / wide) | 440 / 600 | `--overlay-width-m` / `-l` |
| Approval chain popover | 440 | `--overlay-width-m` |
| Cooper history column | 240 | side-nav width |
| Form card | 464–680, content slot min 400 | — |

Docked panels sit flush against the content-area edge; the page beside them keeps its margin.
4.6 **Panel mode by job** (`Component.panelMode`; a screen overrides it only with `AppShell panelMode`; no third mode):
- `push`: the user works with the panel and the page together; the content shrinks and reflows. Panel, readiness evaluation, CommentsPanel, WidgetsDrawer, TraceReport, ApprovalChainPanel as a sidebar (it also opens as a 440 popover, the reviewer's form, or full screen).
- `over`: the panel is the focus and the page is context. No scrim; the page stays usable; outside click or Esc (rule 9.6) closes it (`onPanelClose`); clicking another row swaps it. RecordPreview, EvidenceChainDrawer, ActivityPanel, Cooper full chat (floats one page margin in; the Cooper button in the bottom sheet hides while it's open).
- **Open or folded at the start, by job:** a pushed panel that is part of the user's workflow (a checkpoint they go through before they submit) starts open (`Panel` default): System confidence on the work steps inside an entity (Build › Shape and Refine, Plan › Setup and Compare, a framework's Review step). It folds to its 48 rail only when the user folds it or by rule 4.7. A panel with extra information outside the workflow starts folded to its rail (`defaultExpanded={false}`). Every panel can fold; `Panel collapsible={false}` only when a screen is specifically asked to stay open (none today, Nov 20).
4.7 **Side nav folds to its rail** below md (1024) and whenever a pushed panel would leave the page area under 800 (`--layout-content-min`); with a 380 panel that is below 1440. The rail expands over the content; outside click or Esc (rule 9.6) folds it back. Below md a `push` panel also becomes a rail that expands over the content.
4.8 **Overlay layers,** lowest to highest: panel → popover (anchored to its trigger) → modal (centred, scrim, blocking). Toasts (alerts, snackbars) float top-end over everything. Hierarchy comes from elevation (blur, shadow, opacity).
4.9 **App shell:** nav bar (48, sticky, full width) on top; side nav (240) below it on the start side; page header at the top of the content area; content on the grid or a canvas; bottom sheet (40) at the bottom of the content area; Cooper button at the end-bottom corner. Bars, side nav, header and panels stay put; only content scrolls. The log-in screen has no product chrome.
4.10 **Map and canvas views** fill the space between the header and the bottom sheet with a pannable, zoomable `CanvasBackground`; floating panels go in map slots (section 6).
4.11 **Tables keep their columns:** flexible columns (no `width`, or an `fr` width) never go below 120 (`--table-col-short-min`), 160 when the user's text size is larger than the default (`--table-col-flex-min`). Fixed-width columns keep their width (a number is px × `--density-scale`; the `--table-col-*` tokens give widths per column type: primary, short, user, number, date, check, action). When the columns don't fit, the table scrolls sideways inside its card.
4.12 **Reflow (400% zoom / 320 wide, WCAG 1.4.10) is in scope.** The page frame reflows; tables, maps and canvases may scroll sideways. Fold points follow the user's text size (they are read in 16px-equivalent widths). Below 720 the bottom sheet hides its prompts; the Cooper button stays.

---

## 5. Page headers

5.1 **Three headers, chosen by the page:**
- `PageTop` on broad pages: tables, libraries, landing and category pages. H2 title, optional Cooper eyebrow, one-line description, one Secondary M action ("New"), then `Tabs` with counts and a 360 `SmartSearch`. On a `DataTable` library page pass `pageTop` so the table's tab filter and search sit in it.
- The thin `PageHeader` inside one entity (an idea, investment, plan, value or strategy framework): back, Label/M title, ID, menu ▾, status, views, stepper (its steps come from the user or the pattern; never invent them), actions. The ▾ opens the entity's Activity panel (`ActivityPanel`): always pass `onTitleMenu` (the kit warns in the console when a header with an ID has none). The header is the same on every step of the entity's flow: same title, ID and ▾. A plan's title is its portfolio and its ID the planning cycle (Electrical distribution · FY27). Narrow behaviour is decided per header type.
- `ExploreHeader` on the Explore and Study map: the thin header's map variant (height rule 3.4); its small Smart Search and round filter button use the small control height.
5.2 Never stack `PageHeader` above `PageTop`. Value and Plan canvases add `CanvasHeader` under the page header.
5.3 **Thin `PageHeader` as it narrows** (fine for now, revisit later):
- The title always stays (truncates, never hides); the main (primary) button always stays.
- The stepper stays in the bar from 1100 up (centred when both sides fit around it, else between the title side and the buttons). When it doesn't fit, it moves under the status (with no status, under a "Progress" button): hover shows, click pins a popover with the steps. No separate progress row.
- Header buttons sit 8 apart.
- When one row doesn't fit: row 1 = back, title and its menu ▾; row 2 starts under the title with the ID and status together, then views, the other buttons, the main button last. Buttons that wrap onto row 3 start at the start edge.
- The title menu ▾ stays at every size, on every entity header (rule 5.1).
- Sizes come from tokens, in rem so they follow the user's text size: the stepper leaves the bar below `--bp-header-steps` (1100 of the header's own width); two rows below `--bp-header-rows` (720) or whenever one row doesn't fit; the title never gets narrower than `--layout-header-title-min` (160) or its own text, and counts up to `--layout-header-title-mid` (240) when checking whether one row still fits.
5.4 **The thin header never scrolls away,** even on short screens.
5.5 **PageTop below 720:** the tabs and the search go on separate rows; the search goes full width.
5.6 **ExploreHeader below 720:** row 1 = back / context + collaborators and comments; row 2 = the search (full width) + filter.
5.7 **NavBar** collapses to the hamburger below 800 of its own width: logo + `IconButton` secondary S `system-hamburger-menu` opening a `Menu` of the stages, with a check on the current one. Its tabs never wrap or scroll.

---

## 6. Map slots

6.1 Floating panels on a map or canvas go in slots (`.ifs-slots` on the map container), never pinned. One panel per side; a new one replaces the open one.

| Slot | Holds, one at a time | Size |
|---|---|---|
| `.ifs-slot-left` (start) | Hierarchy · Study library (opens from the 2nd map-rail button, below Hierarchy) · Search results · Study | `--region-panel` 380; Study `--region-panel-l` 600 (`.has-left-l`) |
| `.ifs-slot-right` (end) | Asset / group details · Trace report · Evidence chain · Cooper window, with Back (details → evidence → back to details) | `--region-panel` 380 |
| `.ifs-slot-top` | Selected bar, or the draw bar while drawing | content, at most `--region-map-bar` 746 |
| `.ifs-slot-bottom` | Horizon bar (`.ifs-slot-fill`), only when a study is open or a time layer is on | `--region-map-bar` 746, never wider than the gap |
| `.ifs-slot-popover` | Layers / map display, beside the tool bar | `--overlay-width-s` 320 |
| `.ifs-slot-fab` | Cooper button, end-bottom corner (the same place on every screen) | `--size-48` |
| `.ifs-slot-exit` | "Exit map preview", top start, when arriving from Build (`.has-exit` moves every slot down one control row) | — |

6.2 **Sizes come from foundation tokens**; add one if missing, never hard-code. State classes on `.ifs-slots`: `.has-left` (+ `.has-left-l`), `.has-right`, `.has-exit`. The map rail and tool bar go in `.ifs-slot-tools` (top start) and `.ifs-slot-tools-bottom` (bottom start); the start slot already leaves room for them.
6.3 **Edges:** every slot sits one `--slot-inset` (= page margin, 16 / 24 / 32 by width) from the map edges; tops, bottoms and the end edge line up; neighbours sit a page gap apart. Map tools in the corners use the same edges.
6.4 **Top bar:** centred on the whole map. An open panel only nudges it aside, keeping a page gap; it is never re-centred in the space that's left. When it can't fit between the panels, it lines up with the start panel's edge and sits above it, and the start panel moves down. CSS alone centres the bar in the gap, so the kit measures it for you (`placeMapSlots`, run automatically for every `.ifs-slots`, before paint; nothing to call) and sets, on `.ifs-slots`: `.has-top-x` + `--slot-top-x` (the bar's start position), or `.has-top-start` + `--slot-top-h` (the bar's height, to push the start panel down). It clears the end panel even when that panel overlays the map. It slides in vertically only.
6.5 **Bottom bar (horizon):** the same rule as the top bar; it also clears the Cooper button, and shrinks to the space between panels when wider. The kit sets `.has-bottom-x` + `--slot-bottom-x` and `--slot-bottom-w` the same way. Snackbars stack above it, never on it.
6.6 **No map minimum:** panels never fold because the map is small.
6.7 **Study and the right slot:** Study folds to its rail when any right panel opens, including the Cooper chat, and comes back when it closes; clicking Study hides the right panel.
6.8 **Lists and details stay open together.** Clearing the selection closes the selected bar and the details panel.
6.9 **No legend on the map:** counts go in the selected bar, the key in the Layers popover (`.ifs-slot-legend` stays for other canvases). Layers closes on outside click or Esc (rule 9.6).
6.10 **Camera padding:** when a panel opens or the map flies to a target, centre the target in the visible gap.
6.11 **Narrow:** below 1100 (`--bp-map-overlay`) the end panel sits over the map and closes on outside click or Esc (rule 9.6); below 720 (`--bp-map-sheet`) panels become a bottom sheet.

---

## 7. Component use

7.1 **Buttons, not links.** Every move (open an object, go to a screen, go up a level) is a button; Ghost replaces a text link. Links stay only inside user-authored content and for external resources.
7.2 **One Primary per container** (page, panel, drawer, modal, card), usually one per page. Button sizes: L in footers of modals, form cards and panels (Cancel / Save, Undo); M in content areas and `PageTop` (the Secondary "New"); S in the thin `PageHeader`, toolbars and dense rows. Types: Primary = the single main action, Secondary = alternatives (most buttons), Tertiary = dense areas, Ghost = link replacement, Accent = hands the task to Cooper.
7.3 **Field size follows the surface:** L full-page forms, M modals, drawers and panels, S footers and toolbars, XL view-level selectors that change what the page shows. Select widths: S at most 240, M 140–400, XL 200–400.
7.4 **Forms:** every visible field is required (no asterisks; optional fields are not shown). Never disable the primary action to signal an incomplete form: on submit validate every field, show the errors, focus the first one; more than three errors adds a summary above the footer.
7.5 **Filters:** a surface is either instant (chips only) or deferred (fields that commit on Apply); never both. In a chip group values combine as OR and "All" is exclusive.
7.6 **No table pagination,** no hidden rows; the one exception is a table in a fixed-height 600 card with Show more / Show less, used when a page has several tables (Table pattern rule 1). Narrow with filters that show counts: on a library page `Tabs` with counts in `PageTop`; inside a table card a `SegmentedControl` S with counts (use it when the page already has tabs). The table scrolls with a sticky header. `Pager` is for item-by-item content, never tables.
7.7 **Collections are tables** (`Table`, or `DataTable` for any list with behaviour), not card grids. Exception: comparing 2–4 alternatives side by side uses `ContentCard` M columns with `BarChartItem` rows.
7.8 **Don't create new card, timeline or chart components.** Cards from `ContentCard` (M in main areas, S nested) and `StatCard`; timelines from the timeline base; charts from the data-viz base inside `DataVizCard` + `DataVizHeader`. Legacy sets only to match an existing handover screen. `NodeCard` is the one canvas exception.
7.9 **One of each:** one `Menu` for every ⋯ / overflow / split-button menu (`more` trigger; destructive items last after a divider); one `StatCard` (`compare` for from → to); one `NavBar`; one `EvidenceButton` (Cooper look, 16 icon) for chart headers and evidence; `VersionHistory` is standalone and `ActivityPanel` uses it. Two approval chains for two uses: `ApprovalChainTable` (on `Table`) is the chain people act on (notes, push, filter), on the approval page (with `stages`, Approval chain rule 10) and in the Approval chain panel (compact view); `ApprovalChain` (timeline cards) is the display-only history in `ActivityPanel`.
7.10 **Stepper is non-interactive:** a button or completion event advances it.
7.11 **Tooltips** name or clarify; they are non-interactive (anything interactive goes in a popover); ~300–500ms in, instant out, Esc dismisses, never tap-only. Every icon-only control has one (rule 9.2).
7.12 **Alerts have two intents:** error (stays until resolved; an error with nothing left to fix, such as a rejected upload, closes on the next action or ✕) and warning (stays while the condition holds). No info alert and no success alert. Success is one of two things: the result of the user's own action (approve, save, publish, remove, rename) is a snackbar; news that can happen while the user isn't watching (all reviewers approved, an investment approved at every gate, an optimization finished) is a notification, stored in the notification tray (`NotificationCard`) and, while the user is in the app, also shown live as a snackbar that leads to it (Nov 20). Neutral confirmation of the user's own action is a snackbar via `IFS.toast` (top-end, newest on top, 1–2 actions, 4s; 5s for approve, request more info, rename and comment delete; always pauses on hover and focus; Undo expires with it). Patterns use this timing. Errors are never snackbars; removal confirmations are never alerts.
7.13 **Modals:** a focused must-complete-or-cancel task over a scrim. Width rule 4.5; at most 85% of the viewport tall. Title never wraps; ✕ top-end; content scrolls; footer actions at the end; at most two footer actions, only one of them Primary (rule 7.2; more means split the flow). Long non-blocking tasks use a drawer.
7.14 **Surfaces by job:** panel = always-relevant side context in the layout (no scrim, no focus trap); drawer = an on-demand task or detail from a screen edge (informative: close only; actionable: collapse + close; blocking: neither until resolved); popover = small anchored content (width rule 4.5, max 600 tall, header and search pinned); floating bar = actions on the current map selection.
7.15 **Loading and empty:** skeletons only inside the component that owns the async data; shell, nav, header and static labels render at once. Unknown shape → spinner; user-triggered action → the button's loading state; measurable work → progress bar. Never loading → empty → content: hold the skeleton until the final state is known. The empty-state variant is chosen by cause (first run, empty container, all done, error, no access, no results), never by surface; Full size for a page region, Section size inside a card or panel.
7.16 **Status:** meaningful status (risk, health, process) uses icon + colour (`RiskStatus`, `ReadinessStatus`); colour-only dots (`StatusIndicator`) only for categories where a label carries the meaning. Badges are read-only; clickable values are chips.
7.17 **Cooper orange is attribution only,** never severity.
7.18 **Charts:** zero-based bars; one series = one colour group (sequential ramps stay within one hue group); exact values always available (tooltip + data-table fallback). Charts and their legends use data-viz colours only; the neutral colour (base, other, no data) is `--icon-tertiary`. Legends are `Legend` / `LegendSwatch` (`layout` inline or row, value optional), hover-only, in series order. People (cursors, avatars) use the collaboration colours, never the data-viz palette.
7.19 **Product defaults** (Oct 2026 audit of the Build, Explore, Command, Plan and Value handover files, `guide/usage.json`; the rules above win): `IconButton` ghost square S; `SegmentedControl` S everywhere (card, table and chart headers, drawers, panels), usually 2 options with counts; `Tabs` M or L for page views; `Badge` white S; `Counter` S next to labels; `StatusIndicator` dot without stroke inside tabs, segments and badges; `ContentCard selected` for pick-one options; `SideNav` rule 7.23; `Button` mostly Secondary or Tertiary (sizes rule 7.2).
7.20 **Not in the DS** (say so and offer the closest component): Gantt-style schedule timeline, formula builder rows, calendar day items, map layer list, mini-map navigator, tree component (Plan uses the composed `SideNavTree`).
7.21 **A card's title row is title · meta · actions.** `meta` (ContentCard `meta`) holds short read-only info about the card at the end of the row: a count, a date, time left, a value ("9d left", "3 of 5", "Updated Nov 12"). Body/M regular, text secondary; the title keeps priority and the meta truncates first. Actions (icon button, small segmented control) come last. Anything longer than a few words goes in the description under the title.
7.22 **Cooper bar (`BottomSheet`) by page:** every page inside one entity (thin `PageHeader`) uses `type="documents"`, showing that entity's documents (Cooper's context) and upload on every step of its flow; broad pages (`PageTop`: home, libraries, lists) use the base bar, because there's no single record for documents to belong to. Explore uses none. Always two screen-specific prompts.
7.23 **Side nav = the pages of where you are.** Show a side nav only when the current level has more than one page to move between, either a stage's sections (Value) or scopes (the Plan tree), or one entity's own pages (Investment in Build › Refine). Its title names that level. Going inside an entity replaces the stage's side nav with the entity's, or with none, never both. A stepper's steps are not side-nav pages, and a few views of one page are `Tabs`, not a side nav. Open by default; it folds to its rail only as rule 4.7 says.

---

## 8. Content

Format every value with `IFS.format` (`dist/api.md` → format); it follows the user's locale (en-US default; `IFS.format.configure({ locale, currency, fyStartMonth })`). Readers are experts short of time making decisions worth millions: words are exact, short and calm.

This section is writing guidance for screens, as in other large design systems (Material's writing guidelines, Carbon's and Polaris's content guidelines). Text in components (dialog titles, empty states, alerts, labels) is the screen's content, passed as props; the words in the kit's patterns and examples are samples, not rules (Nov 20).

**Voice**
8.1 Catalyst sounds like a trusted planning analyst. Conclusion first, then the reason ("Reliability is 1.1 min over target. The June storm caused most of it.").
8.2 Specific: name the thing, the number and the time ("6 investments are 10 weeks late").
8.3 Plain and short: everyday words, sentences of about 20 words at most, no internal jargon; domain terms users know (SAIDI, capex, NPV) are fine.
8.4 Talk to the user as "you"; "we" only for the company, rarely.
8.5 Calm: no exclamation marks, hype or emoji. Success is stated, not celebrated. Tone shifts with the moment (routine brief, warnings direct with the consequence, errors serious and helpful, never cute); the voice doesn't.
8.6 Honest about certainty: Cooper shows sources and confidence and never pretends to be a person. Cooper is always "Cooper", never chatbot, bot or "the AI".
8.7 Words to avoid: please, sorry, oops (say the fact and the next step; "sorry" once, only when the product truly failed); simply, just, easy, obviously; seamless, powerful, robust, magic, smart, AI-powered; leverage, utilize, facilitate, empower (use, help, let); click here, here, a bare "learn more"; invalid, illegal, failed, fatal, abort, a bare "error"; `!`, emoji, ALL CAPS. A quoted file or system name is the only exception.
8.8 Write for everyone: gender-neutral words; prefer "select" and "choose" in instructions; no idioms, sports metaphors or culture-specific jokes; one idea per sentence; common contractions (can't, don't, isn't).
8.9 One term per idea: investment (not project), portfolio, scenario (not what-if), value framework, constraint, approve / approval (not sign off), sign in / sign out, email. US spelling (optimization, prioritize). Write names as their owners do (Cooper, IFS, stage names, records as entered) and acronyms as acronyms (FY27, SAIDI, NPV).

**Labels**
8.10 Start with a verb and name the object unless context names it: "Add model", "Send for approval"; "Save" at the foot of an edit form.
8.11 Never "OK", "Submit", "Yes" / "No" alone. A dialog's secondary action is "Cancel" or a real alternative ("Keep draft").
8.12 Same action, same word: Delete removes for good; Remove takes out of a group; Archive hides and can be undone; Create makes something new; Add puts an item in a container.
8.13 Ellipsis `…` on a label only when the action needs more input ("Rename…"); none when the dialog it opens has nothing to fill in.
8.14 Links say where they go ("See the storm report"); a link in a sentence is part of the sentence.
8.15 An icon-only button's `label` (tooltip and accessible name) is verb + object: "Delete file", "Previous month".
8.16 Cooper prompt chips are questions or requests as the user would type them ("Why did Northeast slip?"). Prompts relate to the current screen or query; never generic.
8.17 No end punctuation on buttons, labels, titles, tabs or menu items. Full stops on full sentences in body text, descriptions, messages and tooltips (a 1–3 word tooltip needs none).

**Messages** (what happened, why if it helps, what to do next; important words first)
8.18 Errors (`Alert type="error"`, field errors, `EmptyState cause="error"`): what went wrong in the user's terms and how to fix it; no blame ("You entered…"); never a code alone (a code may follow the sentence when support needs it). Field errors say what's needed: "Enter a date after Jan 1, 2027", "Name is required". System errors: "Couldn't Load Frameworks" / "The server didn't respond. Try again in a minute." Button: **Try again** (not Retry). Form summary: "3 fields need attention" + list.
8.19 Warnings: the risk, its consequence, the way out ("Weighting is no longer balanced. …" + "Rebalance weights").
8.20 Success: past tense, object first, 2–5 words ("Investment saved", "3 investments moved to Plan"). Add a description only if it says something new. Offer Undo instead of a confirmation for reversible actions. Don't toast what the screen already shows.
8.21 Info: neutral and short, only when it changes what the user does next ("This framework is active, so it's read-only.").
8.22 Empty states: the heading states the situation, the body the next step, the button does it:

| Cause | Heading | Body | Button |
|---|---|---|---|
| first-run | No Value Frameworks Yet | Create your first framework to start planning. | Create framework |
| empty-container | No Models in This Framework | Add a model to start scoring investments. | Add model |
| all-done | All Caught Up | No frameworks are waiting for approval. | — |
| error | Couldn't Load Frameworks | The server didn't respond. Try again in a minute. | Try again |
| no-access | You Don't Have Access to This Framework | Ask the framework owner to share it with you. | Request access |
| no-results | No Frameworks Match Your Filters | Try a different term, or clear filters to see all frameworks. | Clear filters |
| no-results-similar | No Results for "WDRM-2" | You might be looking for + chips | — |

8.23 Loading: prefer a skeleton. Text is "Loading…" or "Loading investments…" with the `…` character; long jobs say what and how far ("Re-scoring 1,621 investments… 40%"). Give `LoadingRegion` a `label` naming the content.
8.24 Confirmations: ask only when the action can't be undone or affects other people; otherwise act and offer Undo. Title = action + object as a question ("Delete This Comment?"); body = the specific consequence ("… This can't be undone."); primary repeats verb + object ("Delete comment"), destructive style where Figma has it; secondary "Cancel". Never "Are you sure?", never Yes / No / OK.

**Numbers and dates** (helpers in brackets)
8.25 Money: under $10,000 in full, no cents unless present ($8,450 · $12.50); from $10,000 K / M / B with 3 significant digits ($860K · $19.4M · $3.04B) [`money`]. Zero "$0". Negative: true minus `−` (U+2212) before the symbol, never a hyphen or parentheses (−$1.8M). Changes always signed (+$1.3M) [`change`]. A column, axis or comparison uses one unit and fixed decimals [`money(v, { unit: 'M', decimals: 1 })`]. Exact amounts in forms, exports and audit [`compact: false`]. No value "—".
8.26 K, M, B: capitals, no space, no full stop; never MM, mn or bn. `$` is US dollars; for another currency, or users across "$" countries, show the code once in the header ("Cost (CAD)"). Negatives never rely on colour alone.
8.27 Numbers: thousands separators from 1,000; counts not abbreviated unless space forces it [`number(v, { compact: true })`]. Decimals as the decision needs, the same within a column. Ratios as plain numbers ("2.4", no "x"). Numerals for all numbers, including one to nine; words only in idioms. Units: a non-breaking space between number and unit, short units in tables ("5.1 min"), full words in sentences [`number(v, { unit })`]. Ranges: en dash, no spaces, symbol repeated ("28–35%", "$1.2M–$1.8M"); in sentences "from … to …".
8.28 Percentages: no space before `%`; up to 1 decimal, whole numbers without one ("48%") [`percent`]. A change in a percentage is in points ("rose 3 points", "+3 pts").
8.29 Dates: "Nov 12, 2026" default [`date`]; "November 12, 2026" in sentences and formal text; "Nov 12" when the year is obvious; "Nov 2026" for a month; ranges "Nov 12 – 18, 2026" [`dateRange`]; ISO only in exports. Never all-numeric dates in the UI. Data dates `YYYY-MM-DD` are calendar dates read in local time. Weekdays only when they matter ("Due Fri, Nov 13"). Weekday names and the first day of the week come from the locale (`IFS.format.weekStart()`).
8.30 Times: "3:44 AM" (minutes always; the locale decides 12/24h) [`time`]; "Nov 12, 2026, 3:44 AM" [`dateTime`]; add the time zone when several zones share a deadline ("5:00 PM PT"). Relative time for recent activity ("just now" under 45s, "5 minutes ago", "yesterday", "4 days ago"; from 7 days the date) [`relative`], with the exact time in a tooltip; absolute dates for deadlines and anything legal or financial. Durations "2 hr 15 min" in tables, "2 hours 15 minutes" in sentences, countdowns "3h left".
8.31 Fiscal years: FY27 [`fy`]; ranges FY27–FY31 [`fyRange`]; quarters Q2 FY27; FY2027 only where two digits are ambiguous. Never "FY 2027", "FY'27", "fy27" or "FY27-31". A fiscal year is named for the calendar year it ends in; the start month is per customer (`fyStartMonth`). Calendar quarters are "Q1 2026".
8.32 Mock data keeps numbers as numbers and formats them at render. Stories and demos use made-up people and organisations.

---

## 9. Accessibility

9.1 Target size: rule 3.9. Text in rem follows the user's own default text size (rule 1.3). Reflow: rule 4.12.
9.2 Every icon-only control has a tooltip and an `aria-label` (the same verb + object, rule 8.15). Text only for screen readers uses `.ifs-sr-only` (Figma: Visually Hidden).
9.3 Never colour alone: meaningful status has an icon (rule 7.16); negatives keep the minus sign; errors have an icon and text.
9.4 Focus is always visible (the shared focus ring, rule 1.6). Tooltips also show on keyboard focus.
9.5 Heading levels follow the outline, independent of the visual style (rule 2.5).
9.6 Esc closes popovers, menus, drawers, `over` panels, the end panel over a narrow map, the expanded side-nav rail, Layers and comment callouts; focus returns to the trigger.
9.7 Menus and lists: arrow keys, Home / End move; Enter picks; Esc or outside click closes. A multi-select's anchor is its only tab stop; its chips are display-only.
9.8 Breadcrumbs: each crumb is a tab stop; the current crumb is plain text with `aria-current="page"`; separators aren't focusable.
9.9 `LoadingRegion` announces "Loading <label>" and "Loaded".
9.10 A disabled action carries a tooltip saying why; an action that never applies is left out, not greyed.

---

## 10. Open

- Display and Code styles: count their use in the product Figma files; remove what nothing uses.
- Chips in narrow cards wrap more at Body size (Cooper saved scenarios): accept, or truncate them.
- Status sizes XS and S share a text style: merge into one size.
- Truncation: the kit has about 47 hand-written truncation rules; move them onto `.t-truncate` + tooltip and check none truncates a number, status or error.
- H1 / H2 still used inside panels (Cooper recommendation detail, widget-builder section, form card H1, the Cooper voice transcript H1, some prototype titles): pick per case.
- Status vocabulary: one set of names (proposal: success, warning, error, info, neutral, accent, cooper, disabled); neutral dot colour (#4d4d4d vs #8c8c8c); dot size 8 / 6 / 4; keep or remove Badge's `indicator` dot.
- Missing-value mark: em dash `—` (helpers) or en dash `–` (chart tables, Funnel).
- capex vs CAPEX; whether role names (Portfolio Owner) are written as names.
- Fiscal-year start month default (January today); fiscal or calendar quarters by default.
- Parentheses for negatives in finance tables (rule 8.25 says no).
- Bring the Catalyst voice-check glossary into this repo.
- Benefit-cost ratio shows as "2.40x" in widget stories and "2.4" elsewhere.
- Table Horizon / Modified filters mix instant chips with an Apply period (conflicts with rule 7.5); custom periods: fiscal years (notes) or date picker (frames, built).
- Data viz round: stacked column (VerticalBarChartItem vs DataVizGroupedBar) and bar colours.
- Map: details panel in two columns or stacked; Build → map preview entry; the folded Study rail looks poor.
- ApprovalChain timeline vs ApprovalChainTable: both kept; revisit.
- Sizes not yet on tokens: table filter popover (240), prompt button and risk pill heights, ApprovalChainPanel collapsed rail (84 vs 48), fixed heights (Cooper compact chat 360, history 400, chart empty state 388).
- Round 1 sizing, decisions still in progress: density rule, card title row (height), pattern heights, app chrome.
- Wide content: `--layout-max-content-width-wide` (2240) exists for data screens but has no class and nothing uses it; document a class or delete the token.
- Auto-reminder interval "N days" (Collaboration rule 8, Approval chain rule 8): a Figma placeholder; per tenant, not decided.
- The grid CSS reads the window width for page margin, gap and `--panel-cols`; check it against rule 4.4.
- RTL conversion to logical properties is gradual (rule 1.4).
- Should live cursors appear on framework canvases at all (`LiveCursors` is invented)?
- Real names in stories: "DC Water" (nav-bar gallery) and a real person's name (approval gallery); replace unless cleared.
