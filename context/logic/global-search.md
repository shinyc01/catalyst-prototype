# Logic: Global Search (the whole handover, not a flow)

Figma: Global Search handover `acAfLbn5qy49dNNMouadUR`, page 2:61 (10 sections, ~60 frames). Frame specs: `screens/global-search-spec-1-open-find.md`, `-2-narrow.md`, `-3-results.md`. Code: `shared/search-model.js` (index and rules), `app/screens/search.jsx` (UI), `app/main.jsx` (open shortcuts, where results open).

## What can be searched `[Whistler]` + `[Added]`
| Type | Records | Code | Status pill | Filters (Sort & filter) | Opens in |
|---|---|---|---|---|---|
| Assets | 23 real cluster assets | real code | condition from the risk model: Critical ≥ tolerance, Moderate ≥ 80%, else Healthy | Asset type · Area · Condition | Explore, asset details |
| Investments | 45 real curated investments | real code | workflow status `[Assumed]` from the real stage: Initial → Draft, Long Term Planning → In review, Short Term / Executing → Approved | Status · Portfolio · Owner | Build (the idea) or a toast |
| Portfolios | 46 real portfolios | `PF-<id>` `[Added]` | Planning (Demo Portfolio, or has constraints) / Active | Type · Region | Plan home (Demo Portfolio) or a toast |
| Scenarios | 29 real named scenarios | `SCN-<id>` `[Added]` | the real scenario type (Draft, Submitted, Approved, Budget, Planning…) | Status · Portfolio | Compare (the 2028 Plan set) or a toast |
| Studies | the Alpine Meadows Study `[Added]` | `ST-0001` | Draft | Region · Updated · Owner | Study |
| Value frameworks | 3 `[Added]`, one per real measure category | `VF-00n` | Active | Status | toast (Value isn't built) |
| Value models | 69 real value measures | `VM-<id>` | Active | Framework · Status | toast |
| Locations | 7 `[Added]` Whistler places (region, districts, clusters) | `LOC-…` | — | Region · Level | Explore |

All types: Updated (Any time / 7 days / 30 days / last year) and Owner. Edit and creation dates are `[Added]` (stable per record), because the demo data has no history.

## Rules `[Figma]` unless marked
- **Opening:** the NavBar icon, ⌘K / Ctrl+K, or `/` (outside a text field). The icon becomes a 600 px field; the dropdown hangs below (max 804 px; only the list scrolls).
- **Empty field = recent mode:** YOUR SEARCHES (last 5, newest first, no duplicates; a chip re-runs it with its type; × removes one; Clear all) and RECENTLY OPENED (last 6 opened items). Type chips count the recent items, and zero-count types are dimmed. A type hides Your searches. A first visit shows "No recent items". Both lists survive a reload; Reset demo clears them.
- **Typing:** 250 ms debounce. Chips show All, the chosen type and the types with results. Chip counts ignore filters; the list follows them.
- **All:** grouped by type, top 3 each, "Show all n <type>" switches type. **One type:** "RESULTS · n" + "View all in Explore / Build / Value" (none for Portfolios and Scenarios), with no cap (loads 20 more as you scroll).
- **Best match:** only an exact code (also its last part, e.g. `PM-0005` for WD-LV-PM-0005, ignoring spaces) or an exact name, and only when unique. Duplicates and code prefixes get none.
- **Code prefix alone** (e.g. `OHL-`, `SCN-`) sets the type pill when every match is that type's code.
- **Prefixes:** `asset:`, `inv:`, `pf:`, `scn:`, `study:`, `vf:`, `vm:`, `loc:` set the type; `code:` / `name:` set Match.
- **Match:** Any / Name / ID code (select, or Alt+1/2/3). ID code matches codes only, with just the code fragment in bold.
- **Words:** filler words dropped; simple plurals match; words in any order. Typos within 1–2 letters are corrected, with the banner "No exact matches for “q”. Showing results for **x**."
- **Filters from the query:** a word naming exactly one value that's valid for the chosen type is filled in ("Filled from “word”: Field: Value. ↶ Undo"). Other known values (owners, areas, asset types, portfolios) are offered under NARROW WITH, with the count each would leave. Undo, or Backspace at the start, puts the word back and isn't refilled for that query.
- **Questions** (a "?" or a question word): still return records; attribute words like "risk" become filters, not text. **Ask Cooper “…”** is always the last row in questions and no-results, and it opens the Cooper panel ("Cooper is working on it…": no answer is designed). Search never shows AI answers.
- **No results:** only "All", with no counter. The line says what was searched. "Widen the search" lists only options that find something (Match any field, Remove filters, Show all types), with counts. It never leads to Explore.
- **Slow / failing** (Prototype settings → Global Search network): Slow shows 3 skeleton rows; Error shows "Couldn’t load results" + Retry, and the query is still saved to Your searches.
- **Keyboard:** ↑↓ wraps; ↵ opens; ⌘↵ opens in a new tab; Tab / Shift+Tab change type; Alt+F opens Sort & filter; Backspace in an empty field removes the pill; Esc clears the text, then the type and filters, then closes. Keyboard selection and mouse hover look different.
- **Switching type** clears its filters and says so ("Asset filters cleared — each type has its own filters").

## Not built / assumed
- The Cooper answer (not designed). The TL;DR-above-results idea is an open question in Figma.
- Build, Value and Plan libraries for "View all" and opening most investments, value models and portfolios: a toast says where they'd open.
- The Owner field uses DS MultiSelect (Select all is the MultiSelect's own).
