# Global Search · Open search & recent / Find a known item / Clear all / Open from searches — Figma spec

Source: Figma file `acAfLbn5qy49dNNMouadUR` ("Global Search and Notifications Handover"), page "1️⃣ Global Search" (`2:61`), section "Global Search" (`2:20157`). This file specs four sub-sections:

- **"1 · Open search & recent"** (`2:20158`): 5 frames
- **"2 · Find a known item"** (`2:21346`): 8 frames
- **"9 Clear all searches"** (`2:28150`): 2 frames
- **"10 open from searches"** (`2:28747`): 2 frames

The other sections (3 Narrow down, 4 Too many results → Explore, 5 Results · one type, 6 No results & questions, 7 Limit to one type, 8 Slow or failing search) are **not** specced here.

Every frame was screenshotted at 1440×900. The dropdown copy for `2:20704` was read from `get_design_context`; the copy in the other frames was read off screenshots. Text in "quotes" is exact. Dev notes were read **verbatim** from their text nodes. Layer names are sometimes stale: sections 9 and 10 reuse the labels "Retry → Results" and "First visit · Empty recent", and the second frame of section 10 is named "Empty recent" but shows Results. **Never use a layer name as UI text.**

Person names in the Figma copy are replaced with "[person name]". That covers the recent-search chip, the "Owner: …" values and the initials-style names.

"~x/y" values are approximate pixel positions in the 1440-wide frame. The dropdown component is `global-search — <n> · <state>` (600 wide, x 732–1332, y 44). All of its variants come from one component set: Title slot (48 h), Content slot, scroll-bar-atom.

---

## 1. Frames found

| Section | Node | Frame name | State |
|---|---|---|---|
| 1 | `2:20159` | Start | Command home, search closed (nav search icon only) |
| 1 | `2:20400` | Pressed · Recent | Field open and empty. Dropdown variant `1 · Recent — All`: recent searches + recently opened |
| 1 | `2:20733` | Type chosen · Recent | Field shows the "Type: Assets" pill. Variant `2 · Recent — type chosen` |
| 1 | `2:21026` | Open item | Placeholder destination ("Asset · Substation North A / Opens in the owning area") |
| 1 | `2:21041` | First visit · Empty recent | Variant `3 · Recent — empty` |
| 2 | `2:21348` | Pressed | Same as `2:20400` (variant `1 · Recent — All`) |
| 2 | `2:21670` | Typing · Loading | Variant `17 · Loading`: 3 skeleton rows |
| 2 | `2:21957` | Best match | Variant `7 · Best match` |
| 2 | `2:22235` | Open item | Same placeholder as `2:21026` |
| 2 | `2:22250` | Code prefix | Variant `19 · Code prefix` |
| 2 | `2:22535` | Duplicate names | Variant `8 · Duplicate names` |
| 2 | `2:22812` | Typo corrected | Variant `9 · Typo corrected` |
| 2 | `2:23116` | Refining · Loading | Variant `7 · Best match`, with the query extended to "SUB-2210-T" (old results kept) |
| 9 | `2:28152` | Pressed · Recent | Same as `2:20400` |
| 9 | `2:28458` | Empty recent | Recent with **no "Your searches" group** (after Clear all) |
| 10 | `2:28749` | Pressed · Recent | Recent; the first search chip is "substation" |
| 10 | `2:29055` | Empty recent (stale name) | Variant `5 · Results — one type`: "substation" re-run as Assets, 186 results |

**Not designed** (if built, tag `[Assumed]`):
- the real "Open item" destination per type; the frame is only a grey placeholder card;
- the Sort & filter panel;
- the Match select menu;
- removing a single recent search (its ×);
- the ⌘/Ctrl+Enter new-tab result;
- the Esc sequence;
- the hover row being visibly different from the selected row (see §6).

---

## 2. Shared shell

### 2.1 Page behind the search
The page behind is the **Command home**, unchanged in every frame. It is not dimmed and has no scrim. Its content:
- "Welcome back, [person name]." (the Figma copy uses a first name);
- tabs "My works 3 / Decisions 6 / Conversations 3 / Following 3";
- the "DECISIONS TO REVIEW" list, Cooper's work results, Milestone and calendar;
- the bottom bar with the prompt chips "Why is Northgate #1?" and "Brief me", plus the Cooper orb.

Search is global. The page only needs to stay rendered behind it.

### 2.2 NavBar (DS `NavBar`, h 48)
- **Closed (Start):**
  - Left: the logo, then "Command" (active pill), "Value", "Explore", "Build", "Plan", "Results".
  - Right: a search icon (~x 1320), the gear, the bell with a red dot, and the avatar "JP".
- **Open (every other frame):** the search icon is replaced by a **600px search field** (x ~732–1334, y 8–40, h 32). The nav page items stay visible on the left. The gear, bell and avatar stay on the right.
  - Field (`NDS`, not in kit): black fill, **focused blue/accent 1px border**, radius ~4. Its parts:
    - a 12px search icon on the left;
    - optionally a **type pill**: a DS `Chip` (removable), outlined, label "Type: Assets" / "Type: Investments" and a ×;
    - the query text (body M, white), then a **caret** (orange/accent vertical bar right after the text);
    - when the query is empty, the placeholder **"Search by name or ID"** (tertiary);
    - a ghost **×** clear `IconButton` at the right end, shown only when there is query text.

### 2.3 Dropdown container (all states)
- 600 wide, attached 4px below the field (y 44), radius 8, 1px `border/base`, and a dark elevated fill (`surface/secondary-alpha` over the elevation-1 grey). It has a big drop shadow.
- **Title slot (h 48, p 12):**
  - **Type chips row** (left, sideways carousel, gap 6, with a fade at the right edge). Each chip is a DS `Chip` + `Counter`, h 24, full radius: label M + counter (h 18, radius 10).
    - Selected: white fill, black label, dark counter with a white number.
    - Unselected: outlined (`chips/off/border`), white label, secondary counter.
    - Types with 0 results are **dimmed (opacity 40%)**.
  - **Right "button-stack":**
    - "Match: Any" select (tertiary button, label "Match: " white + "Any" tertiary, chevron-down 12). DS `Select` / tertiary `Button`.
    - A 24px tertiary **filter** `IconButton` (`system-filter`). The dev notes call it **"Sort & filter"**.
- **Content slot:** sections (group captions, rows, links), then the **keyboard hints** footer.
- **Keyboard hints footer** (top hairline, p 8/12, gap 16). Each item is a `hotkey-atom` (disabled-grey glyph) + label (12px, secondary):
  - "↑↓" **"Navigate"** · "↵" **"Open"** · "⌘↵" **"New tab"** · "Tab" **"Type"** · "Esc" **"Close"**.
  - The footer is present in **every** state, loading and empty included.
- **Vertical scrollbar** (`scroll-bar-atom`, 8 wide at x 592) when the list overflows. It is seen in §5.2.

### 2.4 Result row (`search-result-row`, component `2:13306`, h 52, radius 4, pl 8 pr 12, gap 12) — not in DS (`NDS`)
The Figma component description, verbatim:
> "Global Search result row. Name + code (never truncated) on line 1, details that tell similar items apart on line 2, status badge. Swap the leading instance Type for the entity. Selected = keyboard focus; Hover = mouse. Best match is preselected. Inactive = Retired/Archived, still clickable."

Leading (`search-result-leading`, `2:13283`), verbatim:
> "Leading visual for a Global Search result row. Icon tile per searchable type; Person uses an avatar."

- **Leading:** a 32×32 tile (`card/state/fill/hover`, radius 4) with a 16px icon per type:
  - Asset: a diamond/pin glyph;
  - Investment: "$";
  - Scenario: a branch/fork glyph;
  - Portfolio: a briefcase.
- **Line 1** (gap 6): the name (body M medium, white, max 360, ellipsis), then the code (body M regular, secondary). The code is never truncated.
- **Line 2** (body M regular, secondary, ellipsis):
  - In **All** (no type chosen), it starts with the type: "Asset · …", "Investment · …", "Scenario · …", "Portfolio · …".
  - With a **type chosen**, the type prefix is dropped (e.g. "Power transformer · Ridgeview · North District").
- **Status pill:** h 20, full radius, `button/secondary/fill`, a 4px status dot + label M. It looks like DS `Badge` with an indicator. Values seen:

  | Label | Dot |
  |---|---|
  | "Healthy" | green |
  | "Moderate" | amber |
  | "Critical" | red |
  | "In review" | blue |
  | "Approved" | green |
  | "Active" | green |
  | "Draft" | grey |

- **States:**
  - **Selected** (keyboard focus): `card/state/fill/selected` + a 1px `card/state/border/selected` (white 40%) outline.
  - **Hover** (mouse): `card/state/fill/hover`.
  - **Default:** no fill.
- **Match highlight** (dev note §4): the matched text is **text/primary + Semi Bold**. The rest of the title is text/secondary, and the code and line 2 are text/tertiary. Recent items (no query) keep the default colours (name white, code and line 2 secondary).

### 2.5 Group caption (`group header`)
- Caption style: 10px uppercase, regular, `text/secondary`, e.g. "YOUR SEARCHES", "RECENTLY OPENED", "BEST MATCH", "OTHER MATCHES · 2", "RESULTS · 3", "ASSETS · 6".
- An optional right-side action: a ghost `Button` ("Clear all") or a text link with → ("View all in Explore →", "View all in Build →").

---

## 3. Section 1 · Open search & recent

Flow-name card: **"Open search & recent"**.

### 3.1 `2:20159` Start
- Command home, search closed. The NavBar search icon is at ~x 1320, y 24.
- **Dev note** (`2:20391`): "Search opens from the nav search icon, ⌘K / Ctrl+K or / on any screen."
- **Flow** `2:20729`: starts on the **nav search icon** (~1320, 20) → `2:20400` Pressed · Recent.

### 3.2 `2:20400` Pressed · Recent — dropdown `2:20704` "global-search — 1 · Recent — All" (600×559)
- **Field:** empty. Caret at the start, placeholder "Search by name or ID". No pill, no ×.
- **Title row:**
  - Chips: **"All 6" (selected)**, "Assets 3", "Investments 1", "Portfolios 1", "Scenarios 1". Then, at 40% opacity and cut off under the fade, "Studies 0", "Value frameworks 0", "Value models 0" and "Locations 0".
  - Right: "Match: Any ▾" and the filter button.
  - In recent mode the counts count the **recent items**: 3 + 1 + 1 + 1 = 6.
- **Group 1** (top and bottom hairlines, p 12):
  - Caption **"YOUR SEARCHES"**, with a ghost button **"Clear all"** on the right.
  - A sideways carousel of recent-search chips (outlined DS `Chip`, h 24). Each has a 12px clock icon, a label and a 12px ×:
    - "Northgate feeder"
    - "SUB-22"
    - "[person name]"
    - "Coastal hardening"
    - "INV-2291" (cut off under the right fade)
- **Group 2** (p 12, gap 8): 6 rows.

  | # | Line 1 | Line 2 | Status |
  |---|---|---|---|
  | 1 *(Selected)* | "Substation North A" "SUB-2210" | "Asset · Power transformer · Ridgeview · North District" | Healthy |
  | 2 *(Hover per dev note)* | "Ridgeline protection upgrade" "INV-2291" | "Investment · Grid Resilience 2027 · Owner: [person name]" | In review |
  | 3 | "Storm hardening — Option B" "SCN-0148" | "Scenario · Coastal Portfolio · Planning" | Draft |
  | 4 | "Grid Resilience 2027" "PF-0027" | "Portfolio · Northern Region · Owner: [person name]" | Active |
  | 5 | "Substation North B" "SUB-2214" | "Asset · Power transformer · Ridgeview · North District" | Healthy |
  | 6 | "Substation East 1" "SUB-3102" | "Asset · Switchgear · Coastal · Harbor Rd" | Healthy |

  - The caption **"RECENTLY OPENED"** is drawn **below** the 6 rows, at the bottom of the group (a layer-order slip; in `2:20733` it sits on top). Build it on top.
- Keyboard hints footer.
- **Dev notes** (verbatim):
  - `2:20705`: "The last 6 items the user opened. ↑↓ then Enter reopens one."
  - `2:20713`: "All types: Sort & filter offers only the shared filters, Updated and Owner. Type-specific filters appear once a type is chosen."
  - `2:20721`: "Focus stays in the field. ↑/↓ moves through results and wraps around. Esc clears the text, then the filters, then closes search and returns focus to the nav field."
  - `2:21329`: "Tab / Shift+Tab: next or previous type. Alt+F opens Sort & filter. Backspace in an empty field removes the last pill."
  - `2:21337`: "Keyboard selection and mouse hover look different: the selected row uses State=Selected, the hovered row State=Hover (second row here)."
- **Flows:**
  - `2:21022` starts on the **"Assets 3" chip** (~x 880, y 64) → `2:20733` Type chosen · Recent. Tab does the same (dev note §3.3).
  - `2:21326` starts at the field (~1319, 20) → `2:21041` First visit · Empty recent. This is an **alternative state** (no history), not a click.

### 3.3 `2:20733` Type chosen · Recent — dropdown `2:21005` "2 · Recent — type chosen" (600×299)
- **Field:** the pill **"Type: Assets ×"**, then the caret and the placeholder "Search by name or ID". No clear ×.
- **Chips:**
  - "All 6", **"Assets 3" (selected)**, "Investments 1", "Portfolios 1", "Scenarios 1";
  - "Match: Any ▾" and the filter button.
- **The "YOUR SEARCHES" group is gone.** Caption **"RECENTLY OPENED"** (on top), then 3 rows:

  | # | Line 1 | Line 2 | Status |
  |---|---|---|---|
  | 1 *(Selected)* | "Substation North A" "SUB-2210" | "Power transformer · Ridgeview · North District" | Healthy |
  | 2 | "Substation North B" "SUB-2214" | "Power transformer · Ridgeview · North District" | Healthy |
  | 3 | "Substation East 1" "SUB-3102" | "Switchgear · Coastal · Harbor Rd" | Healthy |

- The "Asset ·" prefix is dropped from line 2.
- Keyboard hints.
- **Dev notes:**
  - `2:21006`: "Tab or a click on a type chip shows recent items of that type only."
  - `2:21014`: "The filters of that type appear in Sort & filter — Assets: Asset type, Area, Condition."
- **Flow** `2:21037` starts on **row 1** (right end) → `2:21026` Open item.

### 3.4 `2:21026` Open item
- A full-frame grey placeholder (no shell), centred: "Asset · Substation North A" (body M, secondary) / "Opens in the owning area" (tertiary).
- **Dev note** `2:21029`: "Enter or click opens the item. ⌘/Ctrl+Enter opens it in a new tab."
- The "owning area" for an asset = Explore (asset details). For the other types it is not drawn (see §7).

### 3.5 `2:21041` First visit · Empty recent — dropdown `2:21317` "3 · Recent — empty" (600×125)
- **Field:** empty, placeholder "Search by name or ID".
- **No title row:** no type chips, no Match, no filter.
- Content, centred: **"NO RECENT ITEMS"** (uppercase heading, ~H4, white), then **"Items you open will appear here"** (body, secondary).
- Keyboard hints footer, still shown.
- **Dev note** `2:21318`: "Nothing opened yet: an empty state explains what will appear. Type chips are hidden: there is nothing to narrow yet."

---

## 4. Section 2 · Find a known item

Flow-name card: **"Find a known item"**.

### 4.1 `2:21348` Pressed
- Identical to §3.2 (variant `1 · Recent — All`).
- **Dev note** `2:21653`: "Typing starts in the open field; recent items are replaced by results."
- **Dev note** `2:21661` (named "Pressed 3", but placed on the canvas beside **Refining · Loading**, x 3988 y 1832): "Search match highlight: matched text uses text/primary + Semi Bold, no underline. The rest of the title uses text/secondary, ID and description use text/tertiary. Applies to any matched part of the row, including ID and description. Recent items (no query) keep default colors."
- **Flow** `2:21953` starts at the field (~1322, 20) → `2:21670` Typing · Loading (the user types).

### 4.2 `2:21670` Typing · Loading — dropdown `2:21952` "17 · Loading" (600×269)
- **Field:** the pill **"Type: Assets ×"** + "SUB-22" + caret, with the clear × on the right.
  - The pill appears although `2:21348` had no type. This is consistent with the **code prefix rule** ("SUB-" → Assets, §4.5). `[Figma]`, inferred.
- **Chips:** only **"All"** and **"Assets" (selected)**, with **no counters** while loading. "Match: Any ▾" and filter stay.
- **No caption.** **3 skeleton rows**, each shaped like a result row: a 32px tile, a title bar, a longer subtitle bar, and a pill-shaped status bar on the right. The bars are grey, radius ~4, on a subtle shimmer fill. They look like DS `Skeleton`.
- Keyboard hints.
- **Dev note** `2:23394` "Typing · Loading" (verbatim; its line breaks are kept):
  > Loading timing (first search, no results yet)
  > • Debounce: search runs 250 ms after the user stops typing, not on every keystroke.
  > • If the response takes longer than 300 ms, the results list shows 3 skeleton rows. Responses under 300 ms show no loading state.
  > • Skeleton rows match the result row layout (icon, title, subtitle, status). Tabs, filters and keyboard hints stay real.
  > • Once shown, the skeleton stays for at least 300 ms, even if results arrive sooner, to avoid flicker.
  > • Loading → results is a direct replace, with no empty frame in between.
  > • No response after 10 s → Error state with Retry (see 8 · Slow or failing search).
  > • “No results” shows only after the response returns 0 items. Never while a request is still running.
- **Flows**: all four start at the field (~1320, 20). The branch depends on what the response returns:
  - `2:22231` → `2:21957` Best match;
  - `2:22531` → `2:22250` Code prefix;
  - `2:22808` → `2:22535` Duplicate names;
  - `2:23113` → `2:22812` Typo corrected.

### 4.3 `2:21957` Best match — dropdown `2:22222` "7 · Best match" (600×333)
- **Field:** "Type: Assets ×" + **"SUB-2210"** + caret + ×.
- **Chips:**
  - "All 4", **"Assets 3" (selected)**, "Investments 1";
  - **no other types** (they have no results);
  - "Match: Any ▾" and filter.
- Caption **"BEST MATCH"**, then 1 row, preselected (Selected state):
  - "Substation North A" (secondary) + **"SUB-2210"** (white semibold, the matched text);
  - line 2 "Power transformer · Ridgeview · North District";
  - status Healthy.
- Caption **"OTHER MATCHES · 2"**, then 2 rows:
  - "Substation North A — T1" + **"SUB-2210"** + "-T1" (tertiary). Line 2 "Power transformer · Ridgeview · North District". Status **Healthy**.
  - "Substation North A — T2" + **"SUB-2210"** + "-T2". Same line 2. Status **Critical** (red).
- Keyboard hints.
- **Dev note** `2:22223`: "An exact code or name match becomes Best match and is already selected — one Enter opens it."
- **Flow** `2:22246` starts on the **Best-match row** (right end) → `2:22235` Open item (Enter or click).

### 4.4 `2:22235` Open item
- Identical to §3.4: "Asset · Substation North A" / "Opens in the owning area".
- **Dev note** `2:22238`: "Enter or click opens the item. ⌘/Ctrl+Enter opens it in a new tab."

### 4.5 `2:22250` Code prefix — dropdown `2:22514` "19 · Code prefix" (600×299)
- **Field:** the pill **"Type: Investments ×"** + **"INV-"** + caret + ×.
- **Chips:**
  - "All 3", **"Investments 3" (selected)**;
  - no other chips;
  - "Match: Any ▾" and filter.
- Caption **"RESULTS · 3"**. On the right is the link **"View all in Build →"** (label M, white, arrow-right). No Best match.

  | # | Line 1 | Line 2 | Status |
  |---|---|---|---|
  | 1 *(Selected)* | "Ridgeline protection upgrade" **"INV-"**"2291" | "Grid Resilience 2027 · Owner: [person name]" | In review |
  | 2 | "Harbor substation protection" **"INV-"**"2307" | "Coastal Portfolio · Owner: [person name]" | Approved |
  | 3 | "West substation SCADA" **"INV-"**"2312" | "Western Portfolio · Owner: [person name]" | Draft |

- Keyboard hints.
- **Dev notes:**
  - `2:22515`: "A prefix alone limits results to the type. No Best match until the code is complete."
  - `2:22523` "Type chips" (placed next to Best match): "Once the user types, type chips show only All, the chosen type and types with results; the rest disappear. Chips sit in a sideways carousel that fades at the edge — no More menu."

### 4.6 `2:22535` Duplicate names — dropdown `2:22799` "8 · Duplicate names" (600×299)
- **Field:** "Type: Assets ×" + **"substation harbor"** + caret + ×.
- **Chips:** "All 4", **"Assets 3" (selected)**, "Investments 1"; Match and filter.
- Caption **"RESULTS · 3"**, with the link **"View all in Explore →"** on the right. **No Best match.**

  | # | Line 1 | Line 2 | Status |
  |---|---|---|---|
  | 1 *(Selected)* | **"Harbor"** "Rd" **"Substation"** "SUB-3133" | "Switchgear · Coastal · Harbor Rd" | Healthy |
  | 2 | **"Harbor"** "Rd" **"Substation"** "SUB-3415" | "Switchgear · Southern · Harbor Rd East" | Moderate (amber) |
  | 3 | **"Harbor"** "Rd" **"Substation"** "SUB-3420" | "Power transformer · Southern · Harbor Rd East" | Healthy |

- The query words match in any order ("substation harbor" → "Harbor Rd Substation"). Each matched word is bold.
- Keyboard hints.
- **Dev note** `2:22800`: "Identical names: no Best match is picked. Line 2 shows what tells them apart — code, area, location, status. The first row is still selected for the keyboard, as in any result list."

### 4.7 `2:22812` Typo corrected — dropdown `2:23096` "9 · Typo corrected" (600×531)
- **Field:** **"northate"** (no pill) + caret + ×.
- **Chips:** **"All 8" (selected)**, "Assets 6", "Investments 2"; Match and filter.
- **Correction banner** (a full-width band, slightly lighter fill, under the title row): "No exact matches for “northate”. Showing results for **northgate**." The corrected term is bold white.
- In All, the results are **grouped by type**, with up to 3 rows per group and a "Show all" link:
  - Caption **"ASSETS · 6"**:

    | # | Line 1 | Line 2 | Status |
    |---|---|---|---|
    | 1 *(Selected)* | **"Northgate"** "Substation" "SUB-6012" | "Asset · Power transformer · Northern · Northgate Ave" | Healthy |
    | 2 | **"Northgate"** "Feeder 3" "FDR-0603" | "Asset · Feeder · Northern · Northgate Ave" | Healthy |
    | 3 | **"Northgate"** "Recloser 7" "RCL-0711" | "Asset · Recloser · Northern · Northgate Ave" | Healthy |

    Then the link **"Show all 6 assets →"** (label M, white).
  - Caption **"INVESTMENTS · 2"**:

    | # | Line 1 | Line 2 | Status |
    |---|---|---|---|
    | 1 | **"Northgate"** "feeder upgrade" "INV-2518" | "Investment · Grid Resilience 2027 · Owner: [person name]" | Approved |
    | 2 | **"Northgate"** "substation rebuild" "INV-2533" | "Investment · **North**ern Region · Owner: [person name]" | Draft |

    "North" is highlighted inside "Northern", which looks like a Figma slip (see §6).
- Keyboard hints.
- **Dev notes:**
  - `2:23097`: "Small typos still find results; the header says what was searched instead."
  - `2:23105`: "Filler words are ignored; simple word forms match (feeders → feeder)."

### 4.8 `2:23116` Refining · Loading — dropdown `2:23381` "7 · Best match" (600×333)
- **Field:** "Type: Assets ×" + **"SUB-2210-T"** + caret + ×.
- The dropdown is **pixel-identical to Best match §4.3**: "All 4 / Assets 3 / Investments 1"; BEST MATCH Substation North A SUB-2210; OTHER MATCHES · 2 (T1 Healthy, T2 Critical). The previous results stay while the new query runs. There are no skeletons and no spinner.
- **Dev note** `2:23383` "Refining · Loading" (verbatim):
  > Refining a query
  > • When results are already shown and the user keeps typing, the previous results stay on screen. The list is never cleared or replaced with “Searching…” or skeleton rows.
  > • When the new response arrives, results are replaced in place, with no empty frame in between.
  > • Same 250 ms debounce as the first search.
- No flow connector enters or leaves this frame. It is a side state of Best match while typing.

---

## 5. Sections 9 and 10

### 5.1 Section 9 · Clear all searches (flow-name "Clear all searches")
- **`2:28152` Pressed · Recent** (dropdown `2:28456`): identical to §3.2. It has YOUR SEARCHES (Northgate feeder, SUB-22, [person name], Coastal hardening, INV…) and the 6 recently opened rows.
- **Flow** `2:28743` starts on **"Clear all"** (~x 1309, y 112) → `2:28458`.
- **`2:28458` "Empty recent"** (dropdown `2:28742`, 600×479):
  - The field is still empty, and the chips are still "All 6 / Assets 3 / Investments 1 / Portfolios 1 / Scenarios 1".
  - The **"YOUR SEARCHES" group (caption, Clear all, chips) is removed entirely**, with no empty message.
  - The same 6 recently-opened rows follow immediately (row 1 Selected). The "RECENTLY OPENED" caption is again below the rows. Keyboard hints.
  - So **Clear all clears recent searches only, not recently opened items.**
- No dev notes in this section.

### 5.2 Section 10 · Open from searches (flow-name "Open from searches")
- **`2:28749` Pressed · Recent** (dropdown `2:29053`): same as §3.2, but the YOUR SEARCHES chips are **"substation"**, "SUB-22", "[person name]", "Coastal hardening" and "INV-2291".
- **Flow** `2:29343` starts on the **"substation" search chip** (~x 817, y 146) → `2:29055`.
- **`2:29055`** (dropdown `2:29342` "5 · Results — one type", 600×804):
  - **Field:** **"Type: Assets ×"** + "substation" + caret + ×. The saved search restores its type as well as its text.
  - **Chips:** "All 343", **"Assets 186" (selected)**, "Investments 31", "Portfolios 24", "Scena…" (cut off by the fade). Match and filter.
  - Caption **"RESULTS · 186"**, with **"View all in Explore →"** on the right. A vertical **scrollbar** is shown.
  - Rows (matched "Substation" bold; line 2 has no type prefix):

    | # | Line 1 | Line 2 | Status |
    |---|---|---|---|
    | 1 *(Selected)* | Substation North A SUB-2210 | Power transformer · Ridgeview · North District | Healthy |
    | 2 | Substation North B SUB-2214 | Power transformer · Ridgeview · North District | Healthy |
    | 3 | Substation East 1 SUB-3102 | Switchgear · Coastal · Harbor Rd | Healthy |
    | 4 | Substation East 2 SUB-3107 | Circuit breaker · Coastal · Harbor Rd | Moderate |
    | 5 | Substation West 4 SUB-4120 | Feeder · Western · Mill Creek | Moderate |
    | 6 | Substation West 5 SUB-4127 | Feeder · Western · Mill Creek | Healthy |
    | 7 | Substation South 2 SUB-5031 | Recloser · Southern · Bay St | Critical |
    | 8 | Substation North C SUB-2247 | Power transformer · Ridgeview · North District | Healthy |
    | 9 | Substation East 3 SUB-3176 | Switchgear · Coastal · Harbor Rd | Healthy |
    | 10 | Substation West 7 SUB-3218 | Circuit breaker · Coastal · Harbor Rd | Moderate |
    | 11 | Substation South 4 SUB-4268 | Feeder · Western · Mill Creek | Healthy |
    | 12 | Substation South 3 SUB-5036 | … (cut off) | Healthy |

  - Keyboard hints, fixed at the bottom.
- No dev notes in this section.

---

## 6. DS mapping

| Visible piece | DS 2.0 component | Notes |
|---|---|---|
| Type chips with counts | `Chip` + `Counter` | Selected = white "on" chip; 0-count chips dimmed to 40% |
| Recent-search chips (clock + label + ×) | `Chip` (removable, with leading icon) | — |
| "Type: Assets ×" pill in the field | `Chip` (removable) | — |
| "Match: Any ▾" | `Select` S / tertiary `Button` with chevron | — |
| Filter (Sort & filter) | `IconButton` tertiary S, `system-filter` | — |
| Clear × in field | `IconButton` ghost S, `system-close` | — |
| "Clear all" | ghost `Button` S | — |
| "View all in Explore →", "View all in Build →", "Show all 6 assets →" | ghost/link `Button` with trailing arrow | — |
| Status pill | `Badge` S with indicator dot | — |
| Skeleton rows | `Skeleton` | — |
| Keyboard hints | `hotkey-atom` (check the kit for a Hotkey/Kbd) | Otherwise `NDS` |
| Scrollbar | `scroll-bar-atom` | Native scroll is fine |
| Expanded search field, dropdown panel, `search-result-row`, `search-result-leading`, typo banner, "NO RECENT ITEMS" empty state | — | **`NDS`** |

No spinner appears anywhere in these sections.

---

## 7. Rules (from the dev notes and the frames)

### Opening and closing
1. Search opens from the nav search icon, **⌘K / Ctrl+K**, or **/** on any screen. `[Figma]`
2. The search icon becomes a 600px field in the NavBar. The dropdown hangs under it, and the page behind stays visible (no scrim). `[Figma]`
3. **Esc clears in stages:** first the text, then the filters/pill, then it closes search and returns focus to the nav field. `[Figma]`

### Recent items and recent searches
4. With an empty field, the dropdown shows **recent mode**: the YOUR SEARCHES chips (with Clear all) + the **last 6 items the user opened**. ↑↓ then Enter reopens one. `[Figma]`
5. In recent mode the type chips count the recent items.
6. Choosing a type (Tab or a chip click) shows **recent items of that type only**. It hides YOUR SEARCHES and drops the type prefix from line 2. `[Figma]`
7. **Clear all** removes the YOUR SEARCHES group only. Recently opened items stay. `[Figma]`
8. The recent-search count and storage are not stated. 5 or more chips are shown in a carousel. Store them per user `[Assumed]`. **Each chip's × removes one** `[Assumed]`; it is drawn but not designed.
9. Clicking a recent-search chip **re-runs that search with its saved type pill** ("substation" → Type: Assets, 186 results). `[Figma]`
10. **First visit** (no history): "NO RECENT ITEMS / Items you open will appear here", with **type chips hidden** and Match and filter hidden too. `[Figma]`

### Keyboard and mouse
11. Focus stays in the field. **↑/↓ wraps around.** Enter or click opens the item; **⌘/Ctrl+Enter opens it in a new tab.** `[Figma]`
12. **Tab / Shift+Tab** = next or previous type. **Alt+F** opens Sort & filter. **Backspace in an empty field removes the last pill.** `[Figma]`
13. The **Selected** state (keyboard) and the **Hover** state (mouse) are separate and look different. The first row is always selected in any result list. `[Figma]`

### Filters
14. **Sort & filter:** in All it offers only the shared filters, **Updated** and **Owner**. Type-specific filters appear once a type is chosen (Assets: **Asset type, Area, Condition**). `[Figma]`

### Typing, chips and loading
15. Typing replaces recent items with results. `[Figma]`
16. Once the user types, the type chips show only **All, the chosen type, and types with results**; the rest disappear. They sit in a sideways carousel with an edge fade, with **no More menu**. `[Figma]`
17. **Loading** `[Figma]`:
    - a 250 ms debounce;
    - skeletons (3 rows) only if the response takes over 300 ms, and once shown, they stay at least 300 ms;
    - chips, filters and hints stay real (the chips show no counts while loading);
    - a direct replace, with no empty frame;
    - after 10 s → Error with Retry (section 8);
    - "No results" only after a 0-item response.
18. **Refining:** when results are already shown, keep them on screen while the new request runs (no skeleton, no "Searching…"), and replace them in place. Same debounce. `[Figma]`

### Ranking and best match
19. **Best match:** an **exact code or name match** becomes Best match and is preselected, so one Enter opens it. The other hits are listed under "OTHER MATCHES · n". `[Figma]`
20. Prefix matches of a longer code (SUB-2210-T1, -T2) rank under the exact match. `[Figma]`
21. Ranking beyond that is not stated `[Assumed]`: exact code → exact name → code prefix → name words.

### Code prefix
22. **Code prefix:** typing a type prefix alone ("INV-", "SUB-") **sets the type** (the "Type: Investments" / "Type: Assets" pill appears) and limits the results to it. **No Best match until the code is complete**, so the list reads "RESULTS · n". `[Figma]`
23. The prefix-to-type map (SUB/FDR/RCL → Assets, INV → Investments, SCN → Scenarios, PF → Portfolios) is `[Assumed]` from the codes shown.

### Duplicates, typos and word matching
24. **Duplicate names:** if several items share the name, **no Best match** is picked. Line 2 shows what tells them apart (code, area, location, status). Row 1 is still keyboard-selected. `[Figma]`
25. **Typo tolerance:** small typos still find results, and a banner says "No exact matches for “<q>”. Showing results for **<corrected>**." `[Figma]`
26. **Filler words are ignored**, and simple word forms match (feeders → feeder). Query words match **in any order** (the "substation harbor" frame). `[Figma]`

### Highlighting and line 2
27. **Match highlight:** matched text is primary + Semi Bold, with no underline. The rest of the title is secondary, and the code and line 2 are tertiary. This applies to any matched part, including the code and line 2. Recent items keep the default colours. `[Figma]`
28. **Line 2** starts with the entity type ("Asset · …") only in All. With a type chosen, the prefix is dropped. `[Figma]`

### Result lists
29. **In All, results are grouped by type** ("ASSETS · 6", "INVESTMENTS · 2"), up to 3 per group, with a "Show all N <type> →" link. **With one type chosen** the list is flat, headed "RESULTS · n", with **"View all in Explore →"** (assets) or **"View all in Build →"** (investments) on the right, and it scrolls. `[Figma]`
    - The 3-per-group cap is read from one frame; it is `[Assumed]` as a rule.
30. **Status pill per type** `[Figma]` values:
    - assets: condition/risk (Healthy / Moderate / Critical);
    - investments: workflow (In review / Approved / Draft);
    - portfolios: Active;
    - scenarios: Draft.

    Inactive (Retired/Archived) rows stay clickable (component description).

### Open item
31. **Open item:**
    - Enter or click opens the item "in the owning area". For an asset that means Explore → asset details.
    - Investments → Build ("View all in Build").
    - Scenarios, Portfolios, Studies and the rest are not drawn `[Assumed]`.
    - Opening an item adds it to recently opened `[Assumed]`. It is implied by "The last 6 items the user opened".
    - The searched text is presumably added to YOUR SEARCHES `[Assumed]`.

### Searchable types
32. The searchable types (chip order) are: **All, Assets, Investments, Portfolios, Scenarios, Studies, Value frameworks, Value models, Locations**. The leading tile has an icon per type; a Person uses an avatar. `[Figma]`

---

## 8. Gaps vs the current `app/screens/search.jsx`

The current build covers: the expanded field; chips All/Assets/Investments with counts; Match select; filter button (toast); BEST MATCH + OTHER MATCHES · n; the code highlight; ↑↓ / Enter / Tab / Esc; Type pill; clear ×; asset → Explore.

What it's missing or does differently:

### Field
1. **Placeholder:** the current one is "Search assets, investments, plans…"; Figma says **"Search by name or ID"**.
2. **Opening shortcuts:** no ⌘K / Ctrl+K / "/". `main.jsx` only opens search from the icon.

### Recent mode (empty field)
3. **No recent mode at all:** the dropdown renders only when `q.trim()` is set. Missing pieces:
   - YOUR SEARCHES chips + Clear all;
   - the RECENTLY OPENED rows (last 6);
   - type-filtered recents;
   - the first-visit "NO RECENT ITEMS" state;
   - persistence (needs `usePersisted`);
   - re-running a search from a chip (with its type).

### Type chips
4. **Only 3 types.** Figma has 9:
   - All, Assets, Investments, Portfolios, Scenarios, Studies, Value frameworks, Value models, Locations;
   - the zero-count ones are dimmed in recent mode and hidden after typing;
   - a carousel with an edge fade.

   Scenario and Portfolio rows/icons don't exist in the data layer yet.

### Loading
5. **No loading behaviour:** no 250 ms debounce, no 3-row skeleton (>300 ms, minimum 300 ms), and no keep-old-results while refining.

### Best match and grouping
6. **Best match is always `list[0]`.** Figma picks it only on an **exact** code/name match. It shows none for prefix-only codes ("INV-") and none for duplicate names. Those show "RESULTS · n" instead.
7. **No grouping by type in All.** Missing:
   - the "ASSETS · 6 / INVESTMENTS · 2" groups (3 each) + "Show all N assets →";
   - the "RESULTS · n" caption + "View all in Explore →" / "View all in Build →" for one type.

   The current build also hard-caps the list at 6 rows instead of scrolling.

### Search logic
8. **Code prefix doesn't set the type pill** (typing "INV-" should apply Type: Investments).
9. **No typo correction** (and no banner), no filler-word or stemming handling, and no any-order word matching.
   - `globalSearch` uses substring + prefix scoring only.

### Row content
10. **Highlight rule:**
    - Figma highlights any matched part (name, code, line 2) in primary semibold and sets the rest of the title secondary.
    - The current build highlights only the code, and always greys the name.
    - Recents (no query) should use the default colours.
11. **Line 2:** Figma uses "Asset · <type> · <area> · <location>", and drops "Asset ·" when a type is chosen. The current one is "<type> · <parent>".
12. **Status:** assets show Healthy/Moderate/Critical (3 levels; the current build has 2). Investments show workflow status (In review/Approved/Draft), not the stage.

### Keyboard and hover
13. **Keyboard:**
    - Esc should clear text → filters → close (now it closes at once).
    - ↑↓ should wrap (now it clamps).
    - Missing: Shift+Tab, Alt+F, Backspace-removes-pill, ⌘/Ctrl+Enter new tab.
    - The hints footer lacks **"⌘↵ New tab"**.
14. **Hover vs selected:** `onMouseEnter` moves the selection. Figma keeps the keyboard **Selected** state and a separate mouse **Hover** state.

### Open and filters
15. **Open item:** investments only show a toast (Figma: they open in Build). Other types are not covered.
16. **Sort & filter:** the toast placeholder is fine for now. The designed content is "Updated, Owner" in All, and "Asset type, Area, Condition" for Assets (the panel is drawn in another section).

---

## 9. Ambiguities / inconsistencies

1. **Hover row** in Pressed · Recent: the dev note says row 2 is State=Hover, but in the render it looks the same as the default rows.
2. **"RECENTLY OPENED" caption placement:** it is drawn **below** the 6 rows in the All recent variants (`2:20704`, `2:28456`, `2:28742`, `2:29053`) and above them in `2:21005`. Treat this as a layer-order slip and put the caption on top.
3. **Typing · Loading shows "Type: Assets"** right after an All Pressed frame. It is only explained by the code-prefix rule ("SUB-"). Duplicate names ("substation harbor", no prefix) **also** carries a Type: Assets pill, with no frame showing how it got there.
4. **Typo frame** highlights "North" inside "Northern Region" on a line-2 field. Under the highlight rule that would only happen if "north" were a match, but the corrected term is "northgate".
5. **Counts:** Best match "All 4 = Assets 3 + Investments 1". In section 10, "All 343" ≠ 186 + 31 + 24 + Scenarios… (the rest is hidden under the fade). This is fine but not checkable.
6. **Recent searches count/limit** is not stated; 5 chips are shown.
7. **The Open item frame** is a placeholder. "Owning area" is not defined per type.
8. **Stale layer names:** in sections 9 and 10 the labels read "Retry → Results" and "First visit · Empty recent", and frame `2:29055` is named "Empty recent" but shows Results.
9. **Placeholder data:** none of these codes (SUB-2210, INV-2291, SCN-0148, PF-0027, …) are Whistler records.
   - Map them to real `shared/` records (assets via `ASSETS`, investments via `WHISTLER_INVESTMENTS`) and keep the *patterns*:
     - an exact code with -T1/-T2 children;
     - 3 identical names in different areas;
     - a typo of a real place name;
     - a 3-item code prefix.
   - Never copy the Figma numbers.
