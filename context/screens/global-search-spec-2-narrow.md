# Global Search › Narrow down + result count states — Figma frame spec

Source: Figma file `acAfLbn5qy49dNNMouadUR` ("Global Search and Notifications Handover"), page "1️⃣ Global Search" (`2:61`). This part covers:
- section **"3 · Narrow down"** (`2:30491`) and its sub-sections 3.1–3.6;
- section **"5 Results · one type · result count states"** (`2:29347`).

The other parts of the same page are specced in their own files, for example `global-search-spec-3-results.md`.

Every frame is 1440×900 and was screenshotted at 1440 px wide; the screenshots are the source of truth. Copy in "quotes" is exact. It comes from `get_design_context` on the `global-search — …` dropdown instance, the `sort & filter popover` and the dev-note frames, and from the screenshots where a design-context call hit the Figma rate limit (`2:32036` and `2:33359` were read off the screenshots, and they match "Results · Assets").

Layer names are often stale. For example, the AREA group is named "section / MARKET" and CONDITION is named "section / STATUS", so never copy a layer name as UI text. Real-looking person names in Figma copy are replaced by **[person name]**. The 3.5 example query uses a first name shared by two owners, written here as **[first name]**, and the owners are told apart as [person name A] / [person name B] / [person name C].

**The data in the frames is illustrative.** The query is "substation", there are 343 results, and the codes are SUB-2210, INV-2288 and so on. In the prototype every row, count and filter value must come from `shared/` (see CLAUDE.md, "one data layer"). Take the *structure, copy and rules* from this spec, not the numbers. Any Figma value that the data layer can't back is `[Assumed]` until it is confirmed.

---

## 1. Frames found

### 3.1 · Pick a type (`2:30492`). Flow-name sticky: "Pick a type" (`2:31430`)
| Node | Name | Dropdown instance |
|---|---|---|
| `2:30493` | Results · All types | `2:30791` "global-search — 4 · Results — All types" (600×804) |
| `2:30817` | Results · Assets | `2:31104` "global-search — 5 · Results — one type" |
| `2:31122` | Types · scrolled | `2:31420` "global-search — 23 · More types" |

Connectors: `2:31431` All types → Assets; `2:31434` Assets → Types · scrolled.

### 3.2 · Apply a filter (`2:31437`). Flow-name sticky: "Apply a filter" (`2:32722`)
| Node | Name | Overlays |
|---|---|---|
| `2:31748` | Assets · Filters opened | `2:32036` dropdown + `2:32076` sort & filter popover (320×328) |
| `2:32086` | Assets · Filter applied (Condition: Healthy) | `2:32374` "global-search — 6 · Filters applied" + popover `2:32414` |
| `2:32424` | Assets · Filter applied · closed | `2:32712` "global-search — 6 · Filters applied" |
| `2:31438` | Type switched (drawn at the right end of the row) | `2:31727` "global-search — 20 · Type switched" + loose `2:31730` snackbar-organism |

Connectors: `2:32723` Filters opened → Filter applied; `2:32726` Filter applied → closed; `2:32729` closed → Type switched.

### 3.3 · Clear filters (`2:32732`). Flow-name sticky: "Clear filters" (`2:33401`)
| Node | Name | Overlays |
|---|---|---|
| `2:32733` | Assets · Clear all | `2:33021` "6 · Filters applied" + popover `2:33061` |
| `2:33071` | Assets · Filters reset | `2:33359` "5 · Results — one type" + popover `2:33399` |

Connector: `2:33402` Clear all → Filters reset.

### 3.4 · Sort, Match and long value lists (`2:33405`). Flow-name sticky: "Sort, Match and long value lists" (`2:35335`)
| Node | Name | Overlays |
|---|---|---|
| `2:33406` | Assets · Sort by opened | popover `2:33734` + "sort menu" `2:33745` (296×120) |
| `2:33755` | Match drop down | single-select-list-molecule `2:34053` (240×92) |
| `2:34054` | Select ID code | single-select-list-molecule `2:34352` |
| `2:34363` | Match: ID code | `2:34629` "global-search — 21 · Match: Code" (h 299) |
| `2:34647` | Investments · Owner opened | `2:34935` "22 · Filter value search" + popover `2:34971` (320×306) + multiple-select-list-molecule `2:34985` (296×280) |
| `2:34995` | Investments · Owner · some unselected | `2:35283` + popover `2:35319` + list `2:35333` |

Connectors: `2:35336` Match drop down → Select ID code; `2:35350` Select ID code → Match: ID code; `2:35339` Owner opened → some unselected. "Sort by opened" is a stand-alone state with no connector.

### 3.5 · Filters from the query (`2:35353`). Flow-name sticky: "Filters from the query" (`2:35945`)
| Node | Name | Dropdown instance |
|---|---|---|
| `2:35354` | Narrow with | `2:35643` "global-search — 10 · Narrow with" (h 595) |
| `2:36517` | Owner applied | `2:36809` "10 · Narrow with" (h 517) |
| `2:36819` | Undo applied · Owner | `2:37108` "10 · Narrow with" (h 595) |
| `2:35947` | Filled from query | `2:36223` "global-search — 11 · Filter filled from query" (h 391) |
| `2:36224` | Undo applied · Coastal | `2:36494` "11 · Filter filled from query" (h 413) |
| `2:35662` | Ambiguous value | `2:35935` "global-search — Ambiguous value" (h 441) |

Connectors: `2:36511` Narrow with → Owner applied; `2:37118` Owner applied → Undo applied · Owner; `2:36514` Filled from query → Undo applied · Coastal. "Ambiguous value" is a comparison state with no connector.

### 3.6 · Sort & filter per type (`2:37121`). Flow-name sticky: "Sort & filter per type" (`2:40053`)
| Node | Name | Popover (h) |
|---|---|---|
| `2:37122` | All · Filters opened | `2:37446` (248) |
| `2:37448` | Assets · Filters opened | `2:37776` (328) |
| `2:37778` | Investments · Filters opened | `2:38100` (306) |
| `2:38102` | Portfolios · Filters opened | `2:38424` (276) |
| `2:38426` | Scenarios · Filters opened | `2:38749` (306) |
| `2:38751` | Studies · Filters opened | `2:39082` (276) |
| `2:39084` | Value frameworks · Filters opened | `2:39400` (218) |
| `2:39402` | Value models · Filters opened | `2:39725` (336) |
| `2:39727` | Locations · Filters opened | `2:40051` (210) |

There are no connectors: these are side-by-side reference states. One dev note, `2:40054`.

### 5 · Results · one type · result count states (`2:29347`). Flow-name sticky: "Result count states (one type)" (`2:30490`)
| Node | Name | Dropdown h |
|---|---|---|
| `2:29348` | Assets · 1 result | 179 |
| `2:29625` | Assets · 5 results | 419 |
| `2:29906` | Assets · 10 results | 719 |
| `2:30192` | Assets · 11 results · scroll starts | 804 (max) |

One dev note, `2:30482`. Its layer name, "dev-note / No results · Widen 5", is stale: the note is about popup height.

**Not designed in this part** (building any of these is invention and must be tagged `[Assumed]`):
- the open Sort menu for any type except Assets;
- the open Updated / Region / Level options as menus (they are only drawn as chips);
- a search box inside the Owner list (a hidden atom exists, but none is drawn);
- the Owner list for any type except Investments;
- multi-select inside a chip group;
- "Match: Name" results;
- `name:` / `inv:` prefixes in action;
- the zero-results state (it is not in these sections);
- infinite-scroll loading.

---

## 2. Shared pieces (every frame in this part)

### 2.1 Page behind
Command home (Welcome back + "Decisions to review"), with **no scrim**. The NavBar items stay visible. The page's bottom bar (Cooper prompt chips and the orb) also stays visible.

### 2.2 Field (in the NavBar, x 732–1332, h 32, focused: 1px accent-blue border)
From left to right:
1. `system-search` icon.
2. An optional **type pill**: "Type: Assets ×" / "Type: Investments ×". This is a DS `Chip`, small and removable.
3. The query text with caret.
4. A ghost `system-close` "×" clear button on the right.

The gear, the bell (red dot) and the avatar "JP" stay to the right of the field.

### 2.3 Dropdown (instance "global-search — …", x 732, y 44, w 600, max h 804)
- **Surface:** dark elevated, radius 8, 1px `border/base`, drop shadow.
- **Title slot** (h 48, p 12, fixed):
  - Left: **type chips**, a horizontal carousel 452 wide. Each chip is a DS `Chip` + `Counter`. The selected chip has a white fill, a black label and a dark counter. The others are dark/outlined with grey counters. When the row is clipped, the edges fade ("carousel fade" right, and "carousel fade left" once scrolled).
  - Right: **"Match: Any ⌄"** (DS `Select` size s, styled tertiary; "Match:" is primary and "Any" tertiary grey). Then the **filter icon button** (DS `IconButton`, 24px, `system-filter`; DS also has `FilterButton`). It shows as pressed while the popover is open, and carries a small **red/orange dot** while any filter is applied.
- **Type order and the "substation" counts:** "All 343" · "Assets 186" · "Investments 31" · "Portfolios 24" · "Scenarios 38" · "Studies 14" · "Value frameworks 12" · "Value models 16" · "Locations 22". All is the sum of the others.
- **Content slot** (p 12, gap 8): this part scrolls. It uses DS `ScrollArea` / `ScrollBar`: the `scroll-bar-atom` is 8px wide, at the right, and only appears when the content overflows.
- **Keyboard hints** (fixed, h 33, top hairline, DS `Hotkey`): "↑↓" Navigate · "↵" Open · "⌘↵" New tab · "Tab" Type · "Esc" Close. The keys are tertiary and the labels secondary, 12px.

### 2.4 Result row (`search-result-row`, h 52, radius 4). Not in DS
- **Leading tile** (`search-result-leading`, 32px): asset = asset/pin-diamond glyph; investment = "$"; portfolio = briefcase. Figma's description of this component: "Leading visual for a Global Search result row. Icon tile per searchable type; Person uses an avatar."
- **Line 1:** the name, with the query words in **semibold white** and the rest regular. Then the code in tertiary grey (e.g. "Substation North A  SUB-2210").
- **Line 2:** the detail, in secondary/tertiary grey.
- **Right:** the status, a DS `Badge` with an indicator dot:

  | Dot | Statuses |
  |---|---|
  | Green | Healthy, Approved, Planning |
  | Amber | Moderate |
  | Red | Critical |
  | Blue | In review |
  | None | Draft, Deferred, Ad hoc, Active |
- **First row:** selected style, a card-selected fill plus a 1px light border.
- **Figma component description (verbatim):** "Global Search result row. Name + code (never truncated) on line 1, details that tell similar items apart on line 2, status badge. Swap the leading instance Type for the entity. Selected = keyboard focus; Hover = mouse. Best match is preselected. Inactive = Retired/Archived, still clickable."
- **Detail format:**
  - asset: "Power transformer · Ridgeview · North District" (asset type · area · location);
  - investment: "Investment · Grid Resilience 2027 · Owner: [person name]" (the "Investment ·" prefix is kept even in the one-type view);
  - portfolio: "Portfolio · Northern Region · Owner: [person name]".
- **In the All view** every detail line starts with its type ("Asset · …", "Investment · …", "Portfolio · …"). In the one-type Assets view the prefix is dropped.

### 2.5 Sort & filter popover (instance "sort & filter popover", x 1000, y 86, w 320). DS `Popover`
- **Position:** anchored under the filter button and right-aligned to the dropdown. It covers the right half of the results, including the "View all" link and the badges.
- **Surface:** `background/elevation-2/primary-(base)` + blur, 1px `border/base`, radius 4.
- **Contents, top to bottom:**
  1. **Header** (h 38, p 12, bottom hairline): "Sort & filter" (H4 uppercase, so it renders **"SORT & FILTER"**, tertiary). When filters are applied it is followed by a DS `Counter` with the applied-filter count. On the right is a ghost `Button` **"Clear all"** (label M, primary).
  2. **Sort select** (DS `Select` single, 296×32): leading `arrow-sort` icon, **"Sort by: Relevance"**, caret.
  3. **Filter groups:** each has a label (H4 uppercase, tertiary) and a wrapping row of DS `Chip`s (small pills, gap 6). Each group is single-select. The first chip, **"All"** (or **"Any time"** for Updated), is selected by default; selected chips are white with black text, the others outlined.
  4. **Owner**, for types that have it: a DS `MultiSelect` / `Combobox` field (h 32) that reads **"Anyone"**, with a caret.
- **There is no Apply button**, and there are no counts on the filter chips.

---

## 3. 3.1 · Pick a type

### 3.1.1 `2:30493` Results · All types
- **Field:** "substation" with no pill.
- **Chips:** "All 343" is **selected**. The row is cut at "Scena…" with a right fade. "Match: Any", and the filter button has no dot.
- **Content:** grouped by type. Each group has a caption, its **top 3** rows, and a ghost button ending in →:
  - **"ASSETS · 186"**
    1. "Substation North A" SUB-2210 · "Asset · Power transformer · Ridgeview · North District" · Healthy (**selected**)
    2. "Substation North B" SUB-2214 · "Asset · Power transformer · Ridgeview · North District" · Healthy
    3. "Substation East 1" SUB-3102 · "Asset · Switchgear · Coastal · Harbor Rd" · Healthy
    - **"Show all 186 assets →"**
  - **"INVESTMENTS · 31"**
    1. "Substation North A rebuild" INV-2288 · "Investment · Grid Resilience 2027 · Owner: [person name]" · In review
    2. "Harbor substation protection" INV-2307 · "Investment · Coastal Portfolio · Owner: [person name]" · Approved
    3. "West substation SCADA" INV-2312 · "Investment · Western Portfolio · Owner: [person name]" · Draft
    - **"Show all 31 investments →"**
  - **"PORTFOLIOS · 24"**
    1. "Substation renewal 2026–2030" PF-0031 · "Portfolio · Northern Region · Owner: [person name]" · Planning
    2. "Coastal substation hardening" PF-0034 · "Portfolio · Coastal Region · Owner: [person name]" · Ad hoc
    3. "Strengthening coastal substations" PF-0041 · "Portfolio · Coastal Region · Owner: [person name]" · Ad hoc
    - "Show all 24 portfolios →" (cut at the bottom; the list scrolls and the scrollbar is shown)
- There is **no "Best match" caption** and no "View all in …" header in this view.
- **Dev notes (verbatim):**
  - `2:30793`: "Only types with results keep a chip. All types: top 3 per type, then Show all."
  - `2:30801`: "In All, Sort & filter has only shared filters: Updated and Owner. Type-specific filters appear once a type is chosen."
  - `2:30809`, header "DEV NOTE / Popup height and scroll":
    - "The popup height adjusts to its content."
    - "Max height is 804 px. When the content is taller, the popup height stays fixed at 804 px and the results list scrolls inside it."
    - "Type chips at the top and keyboard hints at the bottom stay fixed; only the results list scrolls."
- **Connector** `2:31431`: from the **"Assets 186"** type chip to Results · Assets.

### 3.1.2 `2:30817` Results · Assets
- **What changed:**
  - The field now shows the pill **"Type: Assets ×"** before "substation".
  - "Assets 186" is selected.
  - The group captions are gone. In their place is a single header: left **"RESULTS · 186"**, right a ghost button **"View all in Explore →"**.
  - The "Asset ·" prefix is dropped from the detail lines.
- **Rows** (12 visible, then the list scrolls; the first row is selected):

| # | Name | Code | Detail | Badge |
|---|---|---|---|---|
| 1 | Substation North A | SUB-2210 | Power transformer · Ridgeview · North District | Healthy |
| 2 | Substation North B | SUB-2214 | Power transformer · Ridgeview · North District | Healthy |
| 3 | Substation East 1 | SUB-3102 | Switchgear · Coastal · Harbor Rd | Healthy |
| 4 | Substation East 2 | SUB-3107 | Circuit breaker · Coastal · Harbor Rd | Moderate |
| 5 | Substation West 4 | SUB-4120 | Feeder · Western · Mill Creek | Moderate |
| 6 | Substation West 5 | SUB-4127 | Feeder · Western · Mill Creek | Healthy |
| 7 | Substation South 2 | SUB-5031 | Recloser · Southern · Bay St | Critical |
| 8 | Substation North C | SUB-2247 | Power transformer · Ridgeview · North District | Healthy |
| 9 | Substation West 7 | SUB-3213 | Switchgear · Coastal · Harbor Rd | Healthy |
| 10 | Substation South 4 | SUB-3255 | Circuit breaker · Coastal · Harbor Rd | Moderate |
| 11 | Substation South 3 | SUB-5036 | Recloser · Southern · Bay St | Healthy |
| 12 | Substation North D | SUB-2263 | Power transformer · Ridgeview · North District (cut) | Healthy |

Rows 9 and 10 have West/South names but Coastal · Harbor Rd details. This is a Figma data slip; don't copy it.
- **Dev notes (verbatim):**
  - `2:31106`: "A chip, Tab or a prefix (asset:, inv:) limits results to one type."
  - `2:31114`:
    - "Assets filters (Sort & filter button): Asset type, Area, Condition."
    - "No row limit: all results load as the user scrolls (infinite scroll)."
    - "Popup grows with content up to 804 px, then the height is fixed and the list scrolls; type chips, filters and keyboard hints stay in place."
    - "“View all in …” sits in the Results header and is always shown, whatever the number of results. It opens the full list in the type’s home area: Explore for assets, studies and locations; Build for investments; Value for value frameworks and models. Portfolios and Scenarios have no View all for now: Plan has no search and filters yet (backlog)."
- **Connector** `2:31434`: from the right end of the type-chip row to Types · scrolled.

### 3.1.3 `2:31122` Types · scrolled
- Same as Results · Assets, except that **the chip row is scrolled to the end**. It shows "…14" (the Studies counter, cut), then "Value frameworks 12", "Value models 16", "Locations 22".
- The **left edge fades** instead of cutting a chip off. Assets stays the selected chip.
- **Dev note `2:31422` (verbatim):** "Type chips scroll sideways (trackpad, Shift+wheel or Tab). Edges fade instead of cutting a chip off."

---

## 4. 3.2 · Apply a filter

### 4.1 `2:31748` Assets · Filters opened
- The dropdown is in the Results · Assets state. The filter button is **pressed**.
- **Popover** (§2.5), top to bottom:
  1. "SORT & FILTER" · "Clear all"
  2. "Sort by: Relevance"
  3. **"ASSET TYPE":** **All** · Power transformer · Switchgear · Feeder · Recloser · Circuit breaker (wraps to 2 lines)
  4. **"AREA":** **All** · Ridgeview · Coastal · Western · Southern
  5. **"CONDITION":** **All** · Healthy · Moderate · Critical
- **Dev note `2:32078` (verbatim):** "The filter button opens Sort & filter: sort on top, then the filters of the selected type. Tap a chip to apply it; All clears that group."
- **Connector** `2:32723`: from the **"Healthy"** chip in CONDITION.

### 4.2 `2:32086` Assets · Filter applied (Condition: Healthy)
- **What changed:**
  - CONDITION "Healthy" is selected, and "All" in that group is not.
  - The header reads "SORT & FILTER" + `Counter` **"1"**.
  - The filter button has a **dot**.
  - The header reads **"RESULTS · 12"** (it was 186), but the type chip counts are unchanged ("All 343", "Assets 186").
- **Rows** (all Healthy; no row is highlighted while the popover has focus):
  1. North A SUB-2210
  2. North B SUB-2214
  3. East 1 SUB-3102
  4. East 5 SUB-3121 (Circuit breaker · Coastal · Harbor Rd)
  5. West 6 SUB-4131 (Feeder · Western · Mill Creek)
  6. West 5 SUB-4127
  7. South 5 SUB-5040 (Recloser · Southern · Bay St)
  8. North C SUB-2247
  9. East 3 SUB-3176 (Switchgear · Coastal · Harbor Rd)
  10. West 8 SUB-3224 (Circuit breaker · Coastal · Harbor Rd)
  11. South 4 SUB-4268 (Feeder · Western · Mill Creek)
  12. South 3 SUB-5036

  Each name starts with "Substation". The list still overflows, so the scrollbar shows.
- **Dev note `2:32416` (verbatim):** "The number of applied filters shows next to Sort & filter, and the filter button gets a dot. Results update right away. Type chip counters show matches for the query without filters; the Results header shows the filtered number."
- **Connector** `2:32726`: from the **filter icon button**, which toggles the popover closed.

### 4.3 `2:32424` Assets · Filter applied · closed
- The popover is gone, but the filter button **keeps the dot**.
- "RESULTS · 12" and "View all in Explore →" are visible again, with the same 12 Healthy rows. The first row is selected.
- **No filter chip appears in the field**: only the dot shows that filters are on.
- **Dev note `2:32714` (verbatim):** "Closing the panel keeps the filters. The dot on the filter button shows that filters are on."
- **Connector** `2:32729`: from the **"Investments 31"** type chip to Type switched.

### 4.4 `2:31438` Type switched
- **Field:** "Type: Investments ×  substation". "Investments 31" is selected. "Match: Any" is unchanged, and the filter button has **no dot**.
- **New inline line** under the title row, inside the dropdown, full width and styled as a dark card: **"Asset filters cleared — each type has its own filters"**.
- A **second, loose variant** is drawn on the canvas left of the field. It is a DS `Snackbar` (`2:31730`) with the title "Asset filters cleared", the body "Not available for Investments", and a × close button.
  - The dev note says "A line above the results says so", so **the inline line is the spec** and the toast is an alternative. `[Figma]` Which one to build is an open question.
- **Header:** "RESULTS · 31" · **"View all in Build →"**.
- **Rows** (each detail line starts with "Investment ·" and ends with "· Owner: [person name]"):

| # | Name | Code | Portfolio | Badge |
|---|---|---|---|---|
| 1 | Substation North A rebuild | INV-2288 | Grid Resilience 2027 | In review |
| 2 | Harbor substation protection | INV-2307 | Coastal Portfolio | Approved |
| 3 | West substation SCADA | INV-2312 | Western Portfolio | Draft |
| 4 | Substation East 1 relay upgrade | INV-2309 | Grid Resilience 2027 | Deferred |
| 5 | Coastal substation flood walls | INV-2316 | Coastal Portfolio | In review |
| 6 | Substation South 2 transformer swap | INV-2323 | Western Portfolio | Approved |
| 7 | Mill Creek substation expansion | INV-2330 | Grid Resilience 2027 | Draft |
| 8 | Bay St substation automation | INV-2337 | Coastal Portfolio | Deferred |
| 9 | Substation West 4 breaker replacement | INV-2344 | Western Portfolio | In review |
| 10 | Northgate substation capacity | INV-2351 | Grid Resilience 2027 | Approved |
| 11 | Substation North B cooling upgrade | INV-2358 | Coastal Portfolio | Draft |
| 12 | Ridgeview substation security | INV-2365 | Western Portfolio | Deferred |

- **Dev notes (verbatim):**
  - `2:31732`: "Each type has its own filters. Switching type clears them: Asset type, Area and Condition are not carried over to Investments. A line above the results says so. The query and Match stay."
  - `2:31740`: "Investments filters (Sort & filter): Status, Portfolio, Owner."

---

## 5. 3.3 · Clear filters

### 5.1 `2:32733` Assets · Clear all
- Identical to §4.2: the popover is open with "SORT & FILTER 1", Healthy is selected, the button has a dot, and the list shows "RESULTS · 12".
- **Connector** `2:33402`: from **"Clear all"** in the popover header.
- **Dev note `2:33063` (verbatim):** "Clear all resets every filter of this type in one click."

### 5.2 `2:33071` Assets · Filters reset
- **The popover stays open.** The header is back to "SORT & FILTER" with no counter, every group is back on "All", and "Sort by: Relevance" is unchanged (Clear all does not reset the sort).
- The dot is gone, "RESULTS · 186" is back, and the unfiltered rows return (as §3.1.2).

---

## 6. 3.4 · Sort, Match and long value lists

### 6.1 `2:33406` Assets · Sort by opened
- The search is in the Assets one-type state, and the popover is as in §4.1. The Sort select is **open** (caret up).
- **Sort menu** (`2:33745`, 296×120): a DS `Menu` (single-select list, 28px rows) that drops over the ASSET TYPE group. Its options are **"Relevance" ✓** · "Name A–Z" · "Last edited" · "Created date".
- **Dev note `2:33747` (verbatim):** "Sort by: Relevance (default), Name A–Z, Last edited, Created date."

### 6.2 `2:33755` Match drop down
- The popover is closed and the **Match select is open**.
- **Menu** (`2:34053`, 240×92, DS `Select` options / `Menu`), under the select: **"Any" ✓** · "Name" · "ID code".
- **Dev note `2:34355` (verbatim):** "Match: Any / Name / ID code sets which field the query is matched against."
- **Connector** `2:35336`: from the **"ID code"** option.

### 6.3 `2:34054` Select ID code
- Same as §6.2, except that "ID code" is highlighted (hover fill) and carries the ✓.
- **Dev note `2:35342` (verbatim):** "Pointer or ↑↓ highlights ID code. Click, Enter or Alt+3 sets Match: ID code, closes the dropdown and re-runs the query."
- **Connector** `2:35350`: from the highlighted "ID code" option to Match: ID code.

### 6.4 `2:34363` Match: ID code
- **Field:** "Type: Assets ×" · **"22"**.
- **Dropdown** (h 299; it hugs 3 rows):
  - Chips "All 5" · **"Assets 3"** · "Investments 2" (only types with results). Then **"Match: ID code ⌄"** and the filter button.
  - "RESULTS · 3" · "View all in Explore →".
  - **Rows** (the names are now **regular weight**; only the matched code part is bold):
    - Substation North A SUB-**22**10 (Power transformer · Ridgeview · North District) · Healthy, active
    - Substation North B SUB-**22**14 · Healthy
    - Feeder 12 — Northgate FDR-1**22**9 (Feeder · Northern · Northgate Ave) · Healthy
  - Keyboard hints.
- **Dev notes (verbatim):**
  - `2:34631`: "Match: Any / Name / ID code (the button shows “Match: ID code”). Alt+1/2/3, or type code: or name: — the prefix leaves the field and switches Match (code: 22 → “22”, Match: ID code)."
  - `2:34639`: "ID code matches codes only, including the number part: 22 finds SUB-2210 and FDR-1229, never a name containing “22”."
- The pill says Type: Assets, but the chip row still lists "Investments 2". Type chip counts are per type, whatever the pill says.

### 6.5 `2:34647` Investments · Owner opened
- **Field:** "Type: Investments ×" · "substation". The header reads "RESULTS · 31" with the investment rows of §4.4.
- **Popover** (`2:34971`, 320×306):
  1. "SORT & FILTER" · "Clear all"
  2. "Sort by: Relevance" (closed)
  3. **"STATUS":** **All** · Draft · In review · Approved · Deferred
  4. **"PORTFOLIO":** **All** · Grid Resilience 2027 · Coastal Portfolio · Western Portfolio
  5. **"OWNER":** a multi-select field, **open** (caret up), reading **"Anyone"**
- **Owner list** (`2:34985`, 296×280, DS `MultiSelect` list, with a scrollbar):
  - Title row: **"OWNERS"** · ghost button **"Select all"**.
  - 6 rows, 40px each: a DS `Avatar` with initials, then [person name], then a DS `Checkbox`. **All six are checked.** The initials are AK, ML, ML, RC, AS and MC.
  - A hidden search atom + separator sits in the layer but is not drawn, so **don't build an in-list search**.
- **Dev note `2:34987` (verbatim):** "Long value lists (Owner) open as a dropdown with checkboxes and Select all. The field sums up the choice: Anyone, or N collaborators."
- **Connector** `2:35339`: it stands for "untick a box".

### 6.6 `2:34995` Investments · Owner · some unselected
- The first owner is **unchecked**, and the Owner field now reads **"5 collaborators"**.
- The results and counts are unchanged in the drawing (still 31), and the filter button shows no dot. Both are probably unfinished in the drawing rather than intended: by §4.2's rules a partial owner choice is an applied filter. `[Assumed]`
- No dev note.

---

## 7. 3.5 · Filters from the query

### 7.1 `2:35354` Narrow with
- **Field:** no pill · **"harbor [first name] north"**.
- **Dropdown** (h 595):
  - Chips **"All 11"** · "Assets 3" · "Investments 8" · "Match: Any ⌄". The filter button has no dot.
  - **"NARROW WITH"** (H4 uppercase, tertiary), then suggestion chips (DS `Chip`, outline, + `Counter`): **"Owner: [person name A] 6"** · **"Owner: [person name B] 5"** · **"Portfolio: North Portfolio 2"**.
  - A hairline, then **"INVESTMENTS · 8"**:
    - **Harbor** substation protection INV-2307 · "Investment · Coastal Portfolio · Owner: **[first name]** [surname A]" · Approved (active)
    - **Harbor** Rd feeder tie INV-2311 · "Investment · North Portfolio · Owner: **[first name]** [surname A]" · In review
    - **Harbor** bay cable replacement INV-2347 · "Investment · North Portfolio · Owner: **[first name]** [surname B]" · Draft
    - "Show all 8 investments →"
  - **"ASSETS · 3"**:
    - **Harbor** Rd Substation SUB-3133 · "Asset · Switchgear · Coastal · Owner: [person name A]" · Healthy
    - **Harbor** Rd Substation SUB-3415 · "Asset · Switchgear · Southern · Owner: [person name B]" · Moderate
    - "Show all 3 assets →"
  - Keyboard hints.
  - Assets carry an Owner in this detail line, unlike the "type · area · location" format elsewhere.
- **Dev note `2:35645` (verbatim):**
  - "Narrow with: when a word in the query matches a known value (owner, area, portfolio, status, type), it is offered as a one-click filter with the number of results it would leave. The word stays in the query until clicked."
  - "Click → the word leaves the query and the value is set in Sort & filter. Owner is shared, so it applies in All. A type-specific value (Area: Coastal → Assets) also switches to that type, because type filters live only inside their type."
- **Connector** `2:36511`: from the **"Owner: [person name A] 6"** chip.

### 7.2 `2:36517` Owner applied
- **Field:** **"harbor north"** (the first name has left the query).
- **Dropdown** (h 517):
  - Chips **"All 6"** · "Assets 2" · "Investments 4". The filter button now has a **dot**.
  - The **applied line** replaces NARROW WITH: "Applied from “[first name]”: **Owner: [person name A].**  ↶ Undo". The text is secondary, the value bold white, and Undo is a ghost button with an undo-arrow icon.
  - **"INVESTMENTS · 4":**
    - **Harbor** substation protection INV-2307 (Coastal Portfolio) · Approved
    - **Harbor** Rd feeder tie INV-2311 (North Portfolio) · In review
    - **Harbor** storm hardening INV-2319 (Coastal Portfolio) · Draft
    - "Show all 4 investments →"
  - **"ASSETS · 2":**
    - **Harbor** Rd Substation SUB-3133 (Switchgear · Coastal) · Healthy
    - **Harbor** Rd Feeder 2 FDR-0731 (Asset · Feeder · Coastal · Owner: [person name A]) · Moderate
- **What changed:**
  - The counts went from 11/3/8 to 6/2/4, and the search **stays in All**.
  - The owner name is no longer bold in the rows.
  - The "Portfolio: North Portfolio" suggestion has disappeared too (`[Figma]`, as drawn).
- **Dev note `2:36811` (verbatim, names replaced):** "Click on Owner: [person name A] in Narrow with: “[first name]” leaves the query (harbor north) and Owner is set in Sort & filter; the filter button gets a dot. Owner is a shared filter, so search stays in All and the counts update. The line above the results says what was applied; Undo removes the filter and puts “[first name]” back."
- **Connector** `2:37118`: from **"↶ Undo"**.

### 7.3 `2:36819` Undo applied · Owner
- Pixel-identical to §7.1.
- **Dev note `2:37110` (verbatim, names replaced):** "Undo removes Owner: [person name A] and puts “[first name]” back in the query at its place. Results, counts and the filter dot return to the state before the click, and Owner: [person name A] is offered again under Narrow with."

### 7.4 `2:35947` Filled from query
- **Field:** pill **"Type: Assets ×"** · **"substation"**. The user typed "asset: coastal substation".
- **Dropdown** (h 391; it hugs 4 rows):
  - Chips "All 343" · **"Assets 186"** · "Investments 31" · "Portfolios 24" · "Scenarios…". The filter button has a **dot**.
  - The chip counts are the unfiltered totals. This is consistent with §4.2 (chips ignore filters).
  - **Filled line:** "Filled from “coastal”: **Area: Coastal.**  ↶ Undo".
  - "RESULTS · 4" · "View all in Explore →".
  - **Rows:**
    - Substation East 1 SUB-3102 (Switchgear · Coastal · Harbor Rd) · Healthy, active
    - Substation East 2 SUB-3107 (Circuit breaker · Coastal · Harbor Rd) · Moderate
    - Substation East 3 SUB-3110 (Power transformer · Coastal · Bay Rd) · Healthy
    - Substation East 4 SUB-3118 (Recloser · Coastal · Bay Rd) · Healthy
- **Dev notes (verbatim):**
  - `2:35654`: "The prefix asset: becomes a type pill. “coastal” names exactly one Area, so it leaves the text and fills the Area filter. The line above the results says what was filled and from which word, and the filter button shows the dot."
  - `2:36503` (header "Filled from query — Undo"):
    - "Undo (one click fix if the system guessed wrong)"
    - "• Shown next to every auto-filled value; one Undo per value, so a correct guess is not lost."
    - "• Click → the filter is removed and the word goes back into the query at its place as plain text. Results refresh."
    - "• Backspace at the start of the text does the same for the last filled value."
    - "• Undo stays until the user edits the query or closes search."
- **Connector** `2:36514`: from **"↶ Undo"**.

### 7.5 `2:36224` Undo applied · Coastal
- **Field:** "Type: Assets ×" · **"coastal substation"**.
- **Dropdown** (h 413):
  - Chips "All 4" · **"Assets 4"**, and the filter button has **no dot**.
  - **"NARROW WITH"** · "Area: Coastal 4".
  - "RESULTS · 4" · "View all in Explore →", then the same 4 rows (East 1–4).
- **Dev note `2:36495` (verbatim):** "After Undo, “coastal” is searched as text and is not auto-filled again in this query, otherwise the same filter would come back at once. The value is still offered under Narrow with (Area: Coastal 4), so the user can apply it on purpose. The filter dot is gone. Typing a new query turns auto-fill back on."

### 7.6 `2:35662` Ambiguous value
- **Field:** "Type: Investments ×" · **"harbor [first name]"**.
- **Dropdown** (h 441):
  - Chips "All 4" · **"Investments 4"**, and the filter button has no dot.
  - **"NARROW WITH"** · "Owner: [person name C] 2" · "Owner: [person name B] 2".
  - "RESULTS · 4" · **"View all in Build →"**.
  - **Rows:**
    - **Harbor** feeders · Underground cable refurbishment INV-2175 (Coastal Portfolio, Owner: **[first name]** [surname B]) · In review, active
    - **Harbor** substation flood wall INV-5101 (North Grid Portfolio, [surname C]) · Draft
    - **Harbor** Road feeder reconductoring INV-5102 (North Grid Portfolio, [surname C]) · In review
    - **Harbor** Point switchgear replacement INV-5103 (Coastal Portfolio, [surname B]) · Approved
- **Dev note `2:35937` (verbatim, name replaced):** "Two owners are called [first name], so “[first name]” stays in the text and is offered under Narrow with. Compare with asset: coastal substation, where “coastal” names one Area and fills the filter."
- The "[first name]" owners here (B, C) are not the same as in §7.1 (A, B). This is a Figma sample-data slip.

---

## 8. 3.6 · Sort & filter per type

Every popover has the header "SORT & FILTER" · "Clear all", then "Sort by: Relevance", and is drawn in its default state (everything on All / Any time / Anyone). The query is always "substation". The selected type chip stays visible by scrolling the chip row: from Scenarios onward the earlier chips are cut at the left ("…ios 24").

| Type | Filter groups (chips, the first is the default) | Owner ("Anyone") | Popover h |
|---|---|---|---|
| **All** | UPDATED: **Any time** · Last 7 days · Last 30 days · Last year | yes | 248 |
| **Assets** | ASSET TYPE: **All** · Power transformer · Switchgear · Feeder · Recloser · Circuit breaker — AREA: **All** · Ridgeview · Coastal · Western · Southern — CONDITION: **All** · Healthy · Moderate · Critical | no | 328 |
| **Investments** | STATUS: **All** · Draft · In review · Approved · Deferred — PORTFOLIO: **All** · Grid Resilience 2027 · Coastal Portfolio · Western Portfolio | yes | 306 |
| **Portfolios** | TYPE: **All** · Planning · Ad hoc — REGION: **All** · Northern · Coastal · Western · Southern | yes | 276 |
| **Scenarios** | STATUS: **All** · Draft · In review · Approved (no Deferred) — PORTFOLIO: **All** · Grid Resilience 2027 · Coastal Portfolio · Western Portfolio | yes | 306 |
| **Studies** | REGION: **All** · Northern · Coastal · Western · Southern — UPDATED: **Any time** · Last 7 days · Last 30 days (no Last year) | yes | 276 |
| **Value frameworks** | STATUS: **All** · Active · Draft | yes | 218 |
| **Value models** | FRAMEWORK: **All** · Substation reliability framework · Substation safety framework · Substation cost framework — STATUS: **All** · Active · Draft | yes | 336 |
| **Locations** | REGION: **All** · Northern · Coastal · Western · Southern — LEVEL: **All** · Region · District · Cluster | no | 210 |

- Assets use **AREA** with Ridgeview. Every other type uses **REGION** with Northern.
- The open Sort list is only drawn for Assets (§6.1). Assume it is the same four options for every type. `[Assumed]`
- In the All frame the list uses the grouped All layout (§3.1.1). The one-type frames use "RESULTS · n" and show the scrollbar.
- **Dev note `2:40054` (verbatim):** "Each type has its own filters in Sort & filter (All: Updated and Owner only). Filters are not kept between types: choosing another type starts with no filters. The query and Match stay."

---

## 9. 5 · Result count states (one type)

All four frames show: "Type: Assets ×  substation", the chips with "Assets n" selected, and "All" = 157 + n (158 / 162 / 167 / 168). The header is "RESULTS · n" · **"View all in Explore →"** at every count, and the keyboard hints are pinned at the bottom. The rows are the first n of the §3.1.2 table; row 12 is "Substation South 7" SUB-5032 · Healthy (cut).

| Frame | Rows | Popup h | Scrollbar |
|---|---|---|---|
| `2:29348` Assets · 1 result | 1 (North A, selected) | 179 | no |
| `2:29625` Assets · 5 results | rows 1–5 | 419 | no |
| `2:29906` Assets · 10 results | rows 1–10 | 719 | no |
| `2:30192` Assets · 11 results · scroll starts | 11 visible + row 12 cut | **804** (max) | **yes** |

- The "11 results" frame actually reads **"Assets 12" / "RESULTS · 12" / All 168**. The label and the content disagree in Figma; the rule is the same either way.
- Height rule: about 179 px for 1 row, then **+60 px per row** (52 row + 8 gap), up to 804 px. From the 11th row the popup locks at 804 and only the list scrolls.
- **No "Show all …" link in the one-type view.** It exists only per group in the All view.
- **Dev note `2:30482` (verbatim):** "Popup height by result count: the popup grows with content up to 804 px; from there the height is fixed and the list scrolls. “View all in …” sits in the Results header at every count, so it never moves with the list."

---

## 10. Rules (collected)

### Types
- **Fixed order:** All, Assets, Investments, Portfolios, Scenarios, Studies, Value frameworks, Value models, Locations.
- **Chips:** each has a counter, and only types with results get one. All is the sum.
- **Chip counts ignore filters** and count query matches only. The "RESULTS · n" / group caption shows the filtered number.
- **Choosing a type:** a chip, **Tab** (cycles), or the prefix `asset:` / `inv:` (prefixes for the other types are not specified). The field then shows a "Type: X ×" pill; clicking × goes back to All.
- **Chip row:** scrolls sideways (trackpad, Shift+wheel, Tab), with fading edges. The selected chip is kept in view.

### Layout by view
- **All:**
  - results are grouped by type, with the caption "TYPE · n", the top 3 rows, and "Show all n <types> →";
  - detail lines are prefixed with the type;
  - no "View all in …".
- **One type:**
  - a header "RESULTS · n" + "View all in <area> →", shown at every count;
  - the areas are Explore (assets, studies, locations), Build (investments) and Value (value frameworks, value models);
  - **Portfolios and Scenarios have no View all.**
  - There is no row limit: the list loads more as the user scrolls.
- **There is no "Best match" caption** in any frame of this part. The first row is simply preselected.

### Height
- The popup grows with its content, to a **max of 804 px**. After that only the results list scrolls.
- The title row (chips, Match, filter), any applied/filled line and the hints stay fixed.

### Sort & filter
- **Opening:** from the filter icon button. Sort is on top, then the current type's groups.
- **Chip groups:** single-select. Tapping a chip applies it **immediately** (no Apply button), and tapping **All** clears that group.
- **Applied filters:** a counter appears next to "SORT & FILTER", and a **dot** appears on the filter button. Closing the popover keeps the filters.
- **Clear all:** resets all filters of the type, keeps the sort, and leaves the popover open.
- **Sort:** Relevance (default) · Name A–Z · Last edited · Created date.
- **Long lists (Owner):** a multi-select dropdown with "OWNERS" + "Select all", and avatar + name + checkbox rows. The field reads **"Anyone"** when all are ticked, otherwise **"N collaborators"**.
- **Filters by type:** see the §8 table. **All has only Updated + Owner.**
- **Switching type clears the filters** and shows the line "Asset filters cleared — each type has its own filters" (the wording names the previous type). The query and Match stay.

### Match
- **Options:** "Match: Any" (default) / "Match: Name" / "Match: ID code". Use the select, **Alt+1/2/3**, or the prefixes `code:` / `name:`. A prefix leaves the field and switches Match.
- **Choosing an option** closes the menu and re-runs the query.
- **ID code** matches codes only, including the number part ("22" finds SUB-2210, FDR-1229). With ID code, names render regular weight and only the matched fragment of the code is bold.

### Filters from the query
1. **Type prefix:** `asset:` becomes a type pill.
2. **A word that names exactly one known value** (owner, area, portfolio, status, type) **is auto-filled.** The word leaves the text, the filter is set, the dot shows, and this line appears: "Filled from “word”: **Field: Value.** ↶ Undo".
3. **A word that is ambiguous** (e.g. two owners with that first name), or a word typed in All without being filled (the §7.1 case), **stays in the text.** It is offered under **"NARROW WITH"** as chips "Field: Value n", where n is how many results would be left. There can be several chips.

   When exactly a word is auto-filled rather than offered is only shown for `asset: coastal` (filled) versus All/ambiguous (offered). `[Assumed]`: auto-fill happens when the value is unique *and* valid for the current type.
4. **Clicking a Narrow-with chip:** the word leaves the query, the filter is set, the dot shows, and this line appears: "Applied from “word”: **Field: Value.** ↶ Undo".
   - Shared filters (Owner) keep the search in All.
   - Type-specific values (Area) also switch to that type.
5. **Undo:**
   - It is per value. It removes the filter, puts the word back in its place, and restores the counts and the dot.
   - **Backspace at the start of the text** undoes the last filled value.
   - The Undo stays until the query is edited or search closes.
   - After an Undo the word is **not auto-filled again** in that query, but it is still offered under Narrow with. A new query turns auto-fill back on.

### Keyboard
- **↑↓** navigates and **↵** opens.
- **⌘↵** opens in a new tab.
- **Tab** changes the type.
- **Esc** closes.
- **Alt+1/2/3** sets Match.
- **Backspace** at the start of the text undoes the last fill.

---

## 11. DS mapping

| Piece | DS 2.0 component |
|---|---|
| Type chips, filter value chips, Narrow-with chips | `Chip` + `Counter` |
| "Type: X ×" pill in the field | `Chip` (removable) |
| "Match: Any ⌄", "Sort by: Relevance" | `Select` (single) |
| Match options, sort menu | `Menu` / `Select` option list |
| Filter icon button with dot | `IconButton` (or `FilterButton`) + `Indicator` |
| Sort & filter panel | `Popover` |
| Owner field and list | `MultiSelect` (or `Combobox`) + `Checkbox` + `Avatar` |
| "Clear all", "Select all", "↶ Undo", "View all in … →", "Show all n … →" | `Button` ghost |
| Status | `Badge` with indicator |
| Applied-filter count | `Counter` |
| "Asset filters cleared" toast variant | `Snackbar` |
| Keyboard hints | `Hotkey` |
| Scroll | `ScrollArea` / `ScrollBar` |
| **Not in DS (wrap in `NDS`)** | the expanded NavBar search field with the inline pill; the `search-result-row` and its leading tile; the "Filled from / Applied from … Undo" line; the inline "filters cleared" line; the keyboard-hints bar as a layout; the grouped All layout |

---

## 12. Gaps vs `app/screens/search.jsx` (current build)

`search.jsx` builds the Best-match frame (`2:21957`), with 3 types and a toast on the filter button. Compared with this part, it is missing the following.

**Types and layout**
1. **The other 6 types.** Only All / Assets / Investments exist, and `globalSearch()` in `shared/explore-model.js` only returns assets and investments. Portfolios, scenarios, studies, value frameworks, value models and locations need data in `shared/`.
2. **Only types with results get a chip.** The build always shows all 3. The chip row also lacks horizontal scroll and edge fades.
3. **The All view** should be grouped by type: "ASSETS · n" with the top 3 rows, then "Show all n assets →" per group. The build is a flat list cut to 6 rows.
4. **The one-type header** "RESULTS · n" + "View all in Explore/Build/Value →", always shown, with none for Portfolios/Scenarios. There is also no infinite scroll: the build slices to 6.
5. **The "BEST MATCH" / "OTHER MATCHES" captions** don't appear in any frame of this part; here the first row is just preselected. This conflicts with frame `2:21957` (an open question to ask the designer).
6. **Detail lines:** the type prefix in All, "Investment · portfolio · Owner: …", "asset type · area · location". The build shows "Type · parent" / "stage · portfolio".
7. **The status badge set** is missing Moderate (amber), In review, Approved, Draft, Deferred, Planning, Ad hoc and Active. The build has only Healthy/Critical plus the stage.

**Sort & filter**

8. **The Sort & filter popover** is entirely missing: the per-type groups (§8), Sort (4 options), Clear all, the counter, the dot on the filter button, the Owner multi-select with Select all / "N collaborators", filters cleared on type switch with the inline line, and chip counts that ignore filters while the header count follows them.

**Match**

9. **Match does nothing.** The Select is static with `onChange={() => {}}`, and its labels are "Code"/"Name" where Figma has "Any / Name / ID code". It also needs Alt+1/2/3, the `code:` / `name:` prefixes, code-only matching, and bold-only-the-code-fragment in ID-code mode.

**Filters from the query**

10. **None of it exists:** the `asset:` / `inv:` prefixes turning into a pill, NARROW WITH chips with counts, auto-fill with "Filled from …", "Applied from …" with ↶ Undo, Backspace-undo, and the no-refill-after-undo rule.

**Height and keyboard**

11. **Height:** the popup should grow to 804 max, with only the list scrolling and the title + hints fixed. This is unverified in the CSS.
12. **Keyboard hints** are missing "⌘↵ New tab" (and the ⌘↵ behaviour itself) and Alt+1/2/3.
13. **No-results copy:** the build's "No matches for … Try an asset code" is not specced in this part.

### Open questions raised by this part
- Inline "filters cleared" line vs `Snackbar` toast (§4.4): which one ships?
- "Best match" caption (frame `2:21957`) vs no caption (all frames here).
- Does a partial Owner choice count as an applied filter (dot, counter, results)? §6.6 doesn't show it.
- Exact auto-fill vs Narrow-with rule (§10, point 3).
- The Figma data slips: rows 9–10 details; the "11 results" frame showing 12; the different "[first name]" owners between §7.1 and §7.6.
