# Global Search — results, no results, type limit, slow/failing search — Figma screen spec (part 3)

Source: Figma file `acAfLbn5qy49dNNMouadUR` ("Global Search and Notifications Handover"), page `2:61`. This part covers four sections:

| Section | Node | Flow-name card(s) |
|---|---|---|
| "4 · Too many results → Explore" | `2:23396` | "Too many results → Explore" |
| "6 · No results & questions" | `2:24027` | "No results → widen the search", "No results → ask Cooper", "Question → Cooper answers" |
| "7 · Limit to one type" | `2:25726` | "Limit to one type" |
| "8 · Slow or failing search" | `2:26971` | "Slow or failing search" |

Every frame is 1440×900. Copy in "quotes" is exact. It comes from `get_design_context` where that was read (the `4 · Results — All types` dropdown and all dev notes), and from 1440-px screenshots otherwise. **Rate limit:** the Figma MCP seat limit was hit partway through the session. As a result:
- the dropdowns other than `2:23702` were read from screenshots, not code;
- frame `2:25728` was not screenshotted on its own. It uses the same `global-search — 4 · Results — All types` instance as `2:23398`, so it is treated as identical.

Real-looking person names in the Figma copy are replaced with "[person name]". This also covers the owner names in result rows, the welcome line and the dev-note mention.

Layer names are often stale. Each dropdown instance is named `global-search — <n> · <state>` (for example the Error frame's dropdown is still named "17 · Loading"). Never use a layer name as UI text.

---

## 1. Frames found

| Section | Node | Frame | Dropdown instance |
|---|---|---|---|
| 4 | `2:23398` | Results · All types | `2:23702` "4 · Results — All types" |
| 4 | `2:23712` | Results · Assets | `2:23999` "5 · Results — one type" |
| 4 | `2:24012` | Explore · Assets (destination placeholder) | — |
| 6 | `2:24029` | No results · Widen | `2:24300` "14 · No results — widen" |
| 6 | `2:24302` | Match any field | `2:24591` "Match any field" |
| 6 | `2:24601` | No results | `2:24875` "15 · No results" |
| 6 | `2:25220` | Cooper · Help find | — (Cooper panel open, search closed) |
| 6 | `2:24897` | Question | `2:25191` "16 · Question" |
| 6 | `2:25462` | Cooper · Answer | — (Cooper panel open, search closed) |
| 7 | `2:25728` | Results · All types | `2:26033` (same as `2:23702`) |
| 7 | `2:26043` | Tab → Type pill | `2:26331` "5 · Results — one type" |
| 7 | `2:26349` | Pill removed | `2:26654` "4 · Results — All types" |
| 7 | `2:26664` | Prefix typed | `2:26952` "5 · Results — one type" |
| 8 | `2:26973` | Loading | `2:27255` "17 · Loading" |
| 8 | `2:27265` | Error | `2:27526` (named "17 · Loading") |
| 8 | `2:27537` | Retry → Results | `2:27825` "5 · Results — one type" |
| 8 | `2:27840` | Pressed · searches (label: "Show in your searches section (query saved to searches)") | `2:28071` "1 · Recent — All" |

---

## 2. Shared shell (every frame)

- **Background page:** Command home, dark theme.
  - "Welcome back, [person name]." and "3 things deserve your attention this week, and I've drafted responses to two of them. Planning closes in 41 days".
  - Tabs: My works 3 · Decisions 6 · Conversations 3 · Following 3.
  - DECISIONS TO REVIEW list on the left; KPI ring, Milestone and calendar on the right.
  - Bottom bar with prompt pills "Why is Northgate #1?" and "Brief me", then the Cooper orb.
  - The page is unchanged by search; only the overlay matters.
- **NavBar** (`nav-bar-organism`, DS `NavBar`): the search field replaces the Actions slot. The field is expanded to **600 px** (x 732–1332, y 8–40), followed by gear, bell (red dot) and avatar "JP".
  - Focused field: blue focus border, search icon on the left, a text caret after the text, and a clear "×" ghost icon button on the right.
  - Empty placeholder: "Search by name or ID".
- **Dropdown** (`global-search`): attached under the field at x 732, y 44, 600 wide, height hugs content (max ~804).
  - Surface: elevated dark grey, 1px `border/base`, radius 8, a large drop shadow.
  - **Title slot** (h 48, p 12):
    - left: the **type chips** carousel (DS `Chip` + `Counter`, fading at the right edge with a "carousel fade");
    - right: the **button-stack**, holding "Match: Any" (a tertiary select-button: "Match:" in white, the value in tertiary grey, chevron-down; DS `Select`/`Button` tertiary s) and a 24px tertiary filter icon button (`system-filter`; the dev notes call it "Sort & filter").
  - **Content slot**, scrollable. A `scroll-bar-atom` sits on the right when the list overflows.
  - **Keyboard hints** row (top hairline, p 8/12): hotkey-atoms in disabled grey plus labels in secondary: "↑↓ Navigate" · "↵ Open" · "⌘↵ New tab" · "Tab Type" · "Esc Close". The row is present in **every** dropdown state, including Loading and Error.
- **search-result-row** (Figma component `2:13306`, h 52, radius 4, padding 8/12, gap 12). Component description:
  > "Global Search result row. Name + code (never truncated) on line 1, details that tell similar items apart on line 2, status badge. Swap the leading instance Type for the entity. Selected = keyboard focus; Hover = mouse. Best match is preselected. Inactive = Retired/Archived, still clickable."

  Its parts:
  - **Leading:** a 32px tile (`card/state/fill/hover`, radius 4) with a 16px type icon: asset = pin/marker, investment = "$", portfolio = briefcase, scenario = branch. The `search-result-leading` description says "Person uses an avatar".
  - **Line 1:** the name in body M medium secondary, with the **matched word(s) in semibold white**. Then the code in tertiary.
  - **Line 2:** tertiary details, as "<Type> · <class> · <area> · <location/owner>".
  - **Status:** a pill badge (`button/secondary/fill`, 20 high) with a 4px status dot and label M white. DS `Badge` with indicator.
  - **Selected row** (the first row in every results state): `card/state/fill/selected` plus a 1px `card/state/border/selected` (white 40%).
- **Group header:** caption, regular, UPPERCASE, secondary. "<Type> · <count>", with pt 12 between groups.
- **"Show all n <type>" link:** a ghost button (DS `Button` ghost s), label M white, arrow-right 12px.

---

## 3. Section 4 · Too many results → Explore

### 3.1 `2:23398` Results · All types

Field: "substation" + caret; no pill.

**Type chips** (selected = white fill, black text, dark counter; others outlined, with a counter on `surface/secondary-alpha`):

| Chip | Counter |
|---|---|
| "All" (selected) | "343" |
| "Assets" | "186" |
| "Investments" | "31" |
| "Portfolios" | "24" |
| "Scenarios" | "38" |
| "Studies" | "14" |
| "Value frameworks" | "12" |
| "Value models" | "16" |
| "Locations" | "22" |

The counts sum to the All counter. Only All → Scenarios (partly) are visible before the carousel fade.

Right of the chips: "Match: Any ▾" and the filter button.

**Content**, top to bottom:

1. **"ASSETS · 186"**
   - row (selected): **Substation** North A · SUB-2210 · "Asset · Power transformer · Ridgeview · North District" · ● "Healthy"
   - row: **Substation** North B · SUB-2214 · "Asset · Power transformer · Ridgeview · North District" · ● "Healthy"
   - row: **Substation** East 1 · SUB-3102 · "Asset · Switchgear · Coastal · Harbor Rd" · ● "Healthy"
   - "Show all 186 assets →"
2. **"INVESTMENTS · 31"**
   - **Substation** North A rebuild · INV-2288 · "Investment · Grid Resilience 2027 · Owner: [person name]" · ● "In review" (blue dot)
   - Harbor **substation** protection · INV-2307 · "Investment · Coastal Portfolio · Owner: [person name]" · ● "Approved" (green)
   - West **substation** SCADA · INV-2312 · "Investment · Western Portfolio · Owner: [person name]" · ● "Draft" (grey)
   - "Show all 31 investments →"
3. **"PORTFOLIOS · 24"**
   - **Substation** renewal 2026–2030 · PF-0031 · "Portfolio · Northern Region · Owner: [person name]" · ● "Planning" (green)
   - Coastal **substation** hardening · PF-0034 · "Portfolio · Coastal Region · Owner: [person name]" · ● "Ad hoc" (grey)
   - Strengthening coastal **substations** · PF-0041 · "Portfolio · Coastal Region · Owner: [person name]" · ● "Ad hoc"
   - "Show all 24 portfolios →"
4. **"SCENARIOS · 38"** (below the fold, reached by scrolling)
   - **Substation** North A — Option A · SCN-0151 · "Scenario · Grid Resilience 2027 · Planning" · "Draft"
   - **Substation** North A — Option B · SCN-0158 · "Scenario · Coastal Portfolio · Planning" · "In review"
   - Coastal **substation** hardening — Base · SCN-0165 · "Scenario · Western Portfolio · Planning" · "Approved"
   - "Show all 38 scenarios →"

The code stops after Scenarios. Groups for Studies, Value frameworks, Value models and Locations are **not drawn**.

Keyboard hints as in §2. A scroll bar shows on the right.

There is **no "BEST MATCH" caption** in this state: the first row is simply preselected.

DEV NOTE (`2:23703`), verbatim:
> "Each type lists its top 3. Show all switches to that type."

Flow: "Show all 186 assets" → `2:23712` Results · Assets (connector `2:24008`).

### 3.2 `2:23712` Results · Assets

Field: a **type pill "Type: Assets ×"** (chip inside the field, before the text) + "substation" + caret, then the clear "×".

Chips: "All 343", **"Assets 186" (selected)**, "Investments 31", "Portfolios 24", "Scena…" (faded). Then "Match: Any ▾" and the filter button.

Content:
- Header row: **"RESULTS · 186"** on the left; **"View all in Explore →"** (ghost button) on the right.
- A flat list with **no type prefix on line 2**. Twelve rows are visible, and the list continues on scroll:

| Name | Code | Line 2 | Status |
|---|---|---|---|
| **Substation** North A (selected) | SUB-2210 | Power transformer · Ridgeview · North District | Healthy |
| **Substation** North B | SUB-2214 | Power transformer · Ridgeview · North District | Healthy |
| **Substation** East 1 | SUB-3102 | Switchgear · Coastal · Harbor Rd | Healthy |
| **Substation** East 2 | SUB-3107 | Circuit breaker · Coastal · Harbor Rd | Moderate (amber) |
| **Substation** West 4 | SUB-4120 | Feeder · Western · Mill Creek | Moderate |
| **Substation** West 5 | SUB-4127 | Feeder · Western · Mill Creek | Healthy |
| **Substation** South 2 | SUB-5031 | Recloser · Southern · Bay St | Critical (red) |
| **Substation** North C | SUB-2247 | Power transformer · Ridgeview · North District | Healthy |
| **Substation** East 3 | SUB-3176 | Switchgear · Coastal · Harbor Rd | Healthy |
| **Substation** West 7 | SUB-3218 | Circuit breaker · Coastal · Harbor Rd | Moderate |
| **Substation** South 4 | SUB-4268 | Feeder · Western · Mill Creek | Healthy |
| **Substation** South 3 | SUB-5036 | (cut off) | Healthy |

DEV NOTE (`2:24000`), verbatim (2 paragraphs):
> "Within one type there is no row limit: results load on scroll. “View all in …” sits in the Results header and is always shown."
>
> "Destinations (search and filters are preset): Assets, Studies, Locations → Explore. Investments, Ideas → Build. Value frameworks, Value models → Value. Portfolios, Scenarios → no View all for now (Plan has no search and filters yet, in backlog)."

Flow: "View all in Explore" → `2:24012` (connector `2:24023`).

### 3.3 `2:24012` Explore · Assets (destination, summary only)

This is a placeholder: a plain dark grey frame with centred text "Explore · Assets" and "Query “substation” and filters applied".

DEV NOTE (`2:24015`), verbatim:
> "Opens the owning area’s list with the query and filters applied. The dropdown closes."

---

## 4. Section 6 · No results & questions

### 4.1 `2:24029` No results · Widen

Field: "harbor [person name] north" + caret. In Figma the query contains a first name.

Title slot:
- Chips: **only "All" (selected), with no counter**.
- Right: **"Match: ID code ▾"** + the filter button.

Content:
- Centred heading (uppercase, white): "NO MATCHES FOR “HARBOR [PERSON NAME] NORTH”"
- Centred secondary line: "Searching in codes."
- Caption header: "WIDEN THE SEARCH"
- Option row (full width, filled `surface/secondary`, radius 4): "Match any field instead" (white medium) on the left, "11 results" (tertiary) on the right.
- **Ask Cooper row** (same filled style): Cooper dots icon + "Ask Cooper" (white) + the query in quotes in Cooper accent orange: “harbor [person name] north”.
- Keyboard hints.

DEV NOTE (`2:25707`), verbatim:
> "Says what was searched: the text, then type, match mode and filters — “Searching in codes.” With no results, type chips disappear; only All stays, without a counter."

DEV NOTE (`2:25715`), verbatim:
> "Widen the search lists only options that would find something — Match any field, Remove filters, Show all types — each with its result count. Here only Match any field applies. No results never leads to Explore."

Flow: "Match any field instead" → `2:24302` (connector `2:25704`).

### 4.2 `2:24302` Match any field

Field: unchanged ("harbor [person name] north").

Chips: **"All 11" (selected)**, "Assets 3", "Investments 8". Match select now reads **"Match: Any"**.

Content:
- Caption "NARROW WITH", then outlined chips with counters (DS `Chip` + `Counter`), on a slightly raised band separated by hairlines:
  - "Owner: [person name] 6"
  - "Owner: [person name] 5"
  - "Portfolio: North Portfolio 2"
- **"INVESTMENTS · 8"**. This group is listed first: it has the higher count, and the order isn't explained.
  - (selected) **Harbor** substation protection · INV-2307 · "Investment · Coastal Portfolio · Owner: **[person name]**" (the matched owner word is bold) · "Approved"
  - **Harbor** Rd feeder tie · INV-2311 · "Investment · North Portfolio · Owner: [person name]" · "In review"
  - **Harbor** bay cable replacement · INV-2347 · "Investment · North Portfolio · Owner: [person name]" · "Draft"
  - "Show all 8 investments →"
- **"ASSETS · 3"**
  - **Harbor** Rd Substation · SUB-3133 · "Asset · Switchgear · Coastal · Owner: [person name]" · "Healthy"
  - **Harbor** Rd Substation · SUB-3415 · "Asset · Switchgear · Southern · Owner: [person name]" · "Moderate"
  - "Show all 3 assets →". This is shown even though the group holds only 2 drawn rows.
- Keyboard hints.

DEV NOTE (`2:24592`), verbatim:
> "Match any field instead re-runs the same text with Match: Any in all types. Known owners and areas in the query are offered under Narrow with."

### 4.3 `2:24601` No results

Field: "zzqx". Chips: "All" only, no counter. Then "Match: Any ▾" and the filter button.

Content:
- "NO MATCHES FOR “ZZQX”"
- "Check the spelling, try fewer words, or search by code."
- **Ask Cooper row:** "Ask Cooper “zzqx”". It shows in the hover/selected fill (lighter), i.e. it is the active row.
- Keyboard hints.
- There is no "Widen the search" block.

DEV NOTE (`2:24876`), verbatim:
> "Nothing to widen — no option would find anything, so the Widen the search block is not shown. Only Ask Cooper is offered. No results never leads to Explore."

Flow: "Ask Cooper" → `2:25220` (connector `2:24893`).

### 4.4 `2:25220` Cooper · Help find

- Search is closed: the NavBar shows the search icon again.
- The **Cooper panel** is floating top-right (x ~1050–1430, y ~60–250). This is DS `AgentWindow` / Cooper panel.
  - **Header:** Cooper dots logo + "COOPER", a dotted divider, "Paused" + a play icon, then the collapse (arrows-in) and close "×" icons.
  - **User bubble** (right-aligned, filled pill): "Help me find “zzqx”".
  - **Status line** (tertiary, with the Cooper dots): "Cooper is working on it…"
  - **Composer:** "+" on the left, the animated dotted voice/working visual in the centre, and a keyboard icon on the right.
- **No answer content is designed.**

DEV NOTE (`2:24885`), verbatim:
> "Ask Cooper opens the Cooper panel with the query as the request. Search itself never shows AI answers."

### 4.5 `2:24897` Question

Field: "which feeders are at risk in Q3?" + caret.

Chips: "All 35" (selected), "Assets 35". Then "Match: Any ▾" and the filter button.

Content:
- "NARROW WITH": chip "Risk score: High 12"
- **"ASSETS · 35"**
  - (selected) **Feeder** 12 — Mill Creek · FDR-0012 · "Asset · Feeder · Western · Risk: High" · "Healthy"
  - **Feeder** 7 — Harbor Rd · FDR-0007 · "Asset · Feeder · Coastal · Risk: High" · "Healthy"
  - **Feeder** 3 — Northgate · FDR-0631 · "Asset · Feeder · Northern · Risk: Medium" · "Healthy"
  - "Show all 35 assets →"
- **Ask Cooper row (last):** "Ask Cooper “which feeders are at risk in Q3?”"
- Keyboard hints.

Note: in Figma the status badge says "Healthy" while line 2 says "Risk: High". That is a Figma inconsistency, so don't copy it.

DEV NOTE (`2:25192`), verbatim:
> "A question still returns matching records: filler words dropped, words like “risk” offered as filters."

DEV NOTE (`2:25200`), verbatim:
> "Ask Cooper is always the last row, never above real results."

Flow: "Ask Cooper" row → `2:25462` (connector `2:25217`).

### 4.6 `2:25462` Cooper · Answer

Same panel as §4.4. The user bubble reads "Which feeders are at risk in Q3?" (capitalised first letter), followed by "Cooper is working on it…". **No answer card is designed.**

DEV NOTE (`2:25209`), verbatim (name replaced):
> "Cooper answers in its own panel. Open: [person name] asks for a TL;DR above results — to confirm with IFS."

---

## 5. Section 7 · Limit to one type

- **`2:25728` Results · All types:** identical to §3.1 (field "substation", All selected, grouped top-3 lists).
  - DEV NOTE (`2:26034`), verbatim: "Tab moves to the next type chip; Shift+Tab goes back."
  - Flows: Tab → `2:26043` (connector `2:26961`), and typing a prefix → `2:26664` (connector `2:26967`).
- **`2:26043` Tab → Type pill:** identical to §3.2. The field shows "Type: Assets ×" + "substation"; the Assets chip is selected; the list has "RESULTS · 186" + "View all in Explore →".
  - DEV NOTE (`2:26332`), verbatim: "The chosen type shows as a removable pill in the field, before the text. Sort & filter now shows the filters of that type."
  - DEV NOTE (`2:26340`), verbatim: "Clear resets the text, the type and the filters."
  - Flow: pill "×" → `2:26349` (connector `2:26964`).
- **`2:26349` Pill removed:** back to the All-types state. Field "substation" (no pill), "All 343" selected, "ASSETS · 186" grouped.
  - DEV NOTE (`2:26655`), verbatim: "× on the pill or Backspace in an empty field removes the type. Results return to All types."
- **`2:26664` Prefix typed:** the end state is the same as Tab → Type pill ("Type: Assets ×" + "substation", the Assets chip selected, "RESULTS · 186", "View all in Explore →").
  - DEV NOTE (`2:26953`), read from the screenshot (the design-context call was rate-limited): "Typing a prefix such as asset: or inv: turns it into the same type pill."

---

## 6. Section 8 · Slow or failing search

- **`2:26973` Loading:**
  - Field: "Type: Assets ×" + "substation".
  - Chips: "All" (outlined, **no counter**) and **"Assets" (selected, no counter)**. Then "Match: Any ▾" and the filter button.
  - Content: **3 skeleton rows**. Each has a 32px square tile, two bars (a short top bar and a longer second bar) and a pill-shaped bar on the right. DS `Skeleton`.
  - Keyboard hints.
  - DEV NOTE (`2:27256`), verbatim: "Set Network to Slow: while results load, the list shows 3 skeleton rows (same pattern as Typing · Loading in 2 · Find a known item). Type chips, filters and keyboard hints stay real."
  - Flow: → `2:27265` (connector `2:27834`).
- **`2:27265` Error:**
  - Field and chips: same as Loading.
  - Centred content:
    - an amber warning icon in a dark round tile (`status-warning-filled`);
    - heading (uppercase, white) "COULDN’T LOAD RESULTS";
    - secondary text "Something went wrong on our end. Your search is saved in Your searches, so you can try it again later.";
    - a **secondary button with a refresh icon, "Retry"** (white fill; DS `Button` secondary/primary s, icon-left).
  - Keyboard hints.
  - DEV NOTE (`2:27527`), verbatim (2 paragraphs):
    > "Set Network to Error: the message keeps the query and offers Retry. Type and filters stay as they were. "
    >
    > "A search that fails is still saved to Your searches, as the first item"
  - Flows:
    - "Retry" → `2:27537` (connector `2:27837`);
    - the "Your searches" mention → `2:27840` (`Vector 1` `2:28140`, a magenta line to the lower frame).
- **`2:27537` Retry → Results:** identical to §3.2 (pill "Type: Assets", "RESULTS · 186", "View all in Explore →", the flat asset list).
  - DEV NOTE (`2:27826`), verbatim: "Retry re-runs the same query with the same type and filters."
- **`2:27840` Pressed · searches** (canvas label "Show in your searches section (query saved to searches)"). This is the empty-field popup after the failed search.
  - Field: empty, with caret and placeholder "Search by name or ID".
  - Chips: "All 6" (selected), "Assets 3", "Investments 1", "Portfolios 1", "Scenarios 1" (counts of recently opened items).
  - **"YOUR SEARCHES"** caption + a "Clear all" ghost link on the right. A row of outlined chips, each with a clock icon and "×" (DS `Chip` removable):
    - "substation" (first: the failed query)
    - "SUB-22"
    - "[person name]"
    - "Coastal hardening"
    - "INV-2291" (cut off)
  - **"RECENTLY OPENED"**:
    - (selected) Substation North A · SUB-2210 · "Asset · Power transformer · Ridgeview · North District" · Healthy
    - Ridgeline protection upgrade · INV-2291 · "Investment · Grid Resilience 2027 · Owner: [person name]" · In review
    - Storm hardening — Option B · SCN-0148 · "Scenario · Coastal Portfolio · Planning" · Draft
    - Grid Resilience 2027 · PF-0027 · "Portfolio · Northern Region · Owner: [person name]" · ● "Active"
    - Substation North B · SUB-2214 · … · Healthy
    - Substation East 1 · SUB-3102 · "Asset · Switchgear · Coastal · Harbor Rd" · Healthy
  - Keyboard hints.
  - DEV NOTE (`2:28141`), title "Dev note: Your searches & Recently opened", verbatim:
    > "The search popup (All) has two sections:
    > • Your searches: the search queries the user ran. Shown as chips.
    > • Recently opened: only items the user opened. Queries are never listed here.
    >
    > Your searches:
    > • Only the last 5 queries are shown, newest first. Older queries are not shown.
    > • If the user repeats a query, it moves to the first position instead of being duplicated.
    > • Clicking a chip fills the field and re-runs the search.
    > • X on a chip removes that query. Clear all removes all chips; after that the section is hidden until a new query is saved.
    > • Shown only in All; hidden when a specific type is selected."

---

## 7. Rules (collected)

1. **Grouping (All):** results are grouped by type. Each group has a header "<TYPE> · <total>", its **top 3** rows, and "Show all <n> <type> →". "Show all" **switches to that type inside the dropdown**; it does not leave the page. [Figma]
2. **One type:** there is **no row cap** and results load on scroll. The header reads "RESULTS · <n>", with **"View all in <Area> →" always shown**. That link opens the owning area's list with the query and filters preset, and the dropdown closes. [Figma]
   - Assets, Studies, Locations → Explore.
   - Investments, Ideas → Build.
   - Value frameworks, Value models → Value.
   - Portfolios, Scenarios → **no View all** (backlog).
3. **Type chips:** All plus 8 types, each with a total count; All = the sum. Tab moves to the next chip and Shift+Tab to the previous one. Choosing a type puts a removable pill **"Type: <Type>"** in the field before the text, and Sort & filter then shows that type's filters. [Figma]
4. **Removing the type:** "×" on the pill, or Backspace in an empty field, returns to All types. Clear "×" resets the text, the type **and** the filters. [Figma]
5. **Prefix:** typing `asset:` or `inv:` turns the prefix into the same pill. The full prefix list isn't given [Assumed: one prefix per type].
6. **No results:**
   - Type chips collapse to "All" without a counter.
   - The heading "NO MATCHES FOR “<QUERY>”" is followed by a line saying what was searched (text, type, match mode, filters; for example "Searching in codes.").
   - "WIDEN THE SEARCH" lists only options that would return something, each with its count: Match any field instead / Remove filters / Show all types.
   - If nothing would help, the block is hidden and a generic hint shows instead: "Check the spelling, try fewer words, or search by code."
   - No results **never** leads to Explore. [Figma]
7. **Match any field** re-runs the text with Match: Any across all types. Known owners and areas found in the query are offered as **"NARROW WITH"** filter chips with counts. [Figma]
8. **Questions:**
   - A question still returns records: filler words are dropped, and words like "risk" are offered as Narrow-with filters (e.g. "Risk score: High 12").
   - **"Ask Cooper “<query>”" is always the last row**, never above results. It is shown in the no-results and question states. Whether it shows for every query isn't stated.
   - Ask Cooper opens the Cooper panel with the request "Help me find “<query>”" (for no results), or the question itself (for a question).
   - **Search never shows AI answers.**
   - How a question is detected isn't specified [Assumed: question words or a "?"]. The TL;DR above results is an open question.
9. **Loading (slow network):** shows 3 skeleton rows. Chips (without counts), Match, filter and hints stay real. No timeout value is given. [Figma]
10. **Error:**
    - The message keeps the query: "COULDN’T LOAD RESULTS" + "Retry". Type and filters are kept.
    - Retry re-runs the same query, type and filters.
    - A failed search is still saved as the first item in Your searches. [Figma]
11. **Empty field (All):** two sections, "YOUR SEARCHES" (the last 5 queries as chips, newest first, de-duplicated; clicking re-runs; "×" removes one; Clear all hides the section) and "RECENTLY OPENED" (opened items only). Your searches is hidden when a type is selected. [Figma]
12. **Keyboard:** ↑↓ navigate, ↵ open, **⌘↵ open in a new tab**, Tab type, Esc close. The first row is preselected (selected style). [Figma]
13. **Status badges by type:**
    - Assets: Healthy / Moderate / Critical.
    - Investments: In review / Approved / Draft.
    - Portfolios: Planning / Ad hoc / Active.
    - Scenarios: Draft / In review / Approved.

## 8. DS pieces seen

- `Chip` + `Counter`: type chips, Narrow-with chips, Your-searches chips (clock icon, removable). The type pill in the field is a removable `Chip`.
- `Select`-style tertiary button "Match: …" and an `IconButton` tertiary (filter); `Button` ghost ("Show all…", "View all in Explore", "Clear all"); a `Button` with an icon ("Retry").
- `Badge` with a status indicator; `Skeleton` rows; a warning status icon. No `Alert` component is used: the error is a centred empty state.
- Cooper panel: `AgentWindow` / CooperMessage (user bubble, "Cooper is working on it…", composer).
- `PromptButton` pills appear in the page bottom bar only.
- **Not in DS:** the expanded NavBar search field, `global-search` dropdown shell, `search-result-row` / `search-result-leading`, hotkey-atom hints row, Widen/Ask-Cooper option rows.

## 9. Gaps vs `app/screens/search.jsx`

The current implementation is missing, or differs from Figma, in the following:

- **Type chips:** it has only All / Assets / Investments. Figma has 9 chips (Portfolios, Scenarios, Studies, Value frameworks, Value models, Locations) in a fading carousel.
- **All-types layout:** it shows a flat "BEST MATCH" + "OTHER MATCHES · n" list capped at 6. Figma groups by type (top 3, "<TYPE> · n" headers, "Show all n <type> →") and has no Best-match caption here.
- **One-type state:** "RESULTS · n", "View all in Explore →" (and Build/Value destinations), infinite scroll and the type-less line 2 are all missing. Investments only toast instead of going to Build.
- **Keyboard:** Shift+Tab, Backspace-in-empty-field (remove pill), prefix typing (`asset:` / `inv:`) and ⌘↵ new tab (also missing from the hints row) aren't implemented.
- **Clear button:** clears only the text. Figma also resets the type and filters.
- **Match select:** it is a dead control. "Match: ID code" mode, "Searching in codes." and Match any field re-runs are missing.
- **No-results copy:** search.jsx shows "No matches for “q”. Try an asset code…". Figma has the uppercase heading, the what-was-searched line, the WIDEN THE SEARCH options with counts, the generic hint and the All-only chip without a counter.
- **Narrow with:** the filter chips (owner/area/risk) are missing.
- **Cooper:** question handling, the "Ask Cooper “q”" last row, and opening the Cooper panel with "Help me find “q”" are all missing.
- **Loading and error:** the loading skeleton (3 rows) and the error state (COULDN’T LOAD RESULTS + Retry) are missing, and nothing simulates a slow or failing network.
- **Empty-field popup:** Your searches (5 chips, Clear all) and Recently opened are missing. search.jsx shows no dropdown when the query is empty.
- **Status badges:** Moderate isn't used (only Healthy/Critical); investment statuses use stage names; the portfolio and scenario row types are missing.
- **Placeholder text:** search.jsx says "Search assets, investments, plans…"; Figma says "Search by name or ID".
- **Matched-text highlight:** search.jsx bolds the matched part of the **code**. Figma bolds the matched **name words** (and matched owner words) in semibold white, with the code in tertiary.
