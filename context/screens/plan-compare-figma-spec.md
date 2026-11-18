# Plan › Compare (Scenario comparison, results in) — Figma screen spec

Source: Figma file `Dv3HzkcFTTrb4E34zLF7cy`, page "2️⃣ Compare" (`0:1`), top section "Compare" (`85:55944`). It has two sub-sections:
- **"Optimizing"** (`85:83780`): Plan home, the Optimizing badge and the skeleton Compare. Already specced in `plan-home-figma-spec.md` (§3 and §4). Not repeated here.
- **"Optimized Plan"** (`85:55945`): Compare **with all results in**, plus the final-plan interaction, tabs and side panels. **This file specs it.**

Every frame is 1440 wide. Screenshots at 1:1 are the source of truth. Copy in "quotes" is exact. It was taken from `get_design_context` where fetched (header buttons, Max cost card, DEV NOTEs); otherwise it was read off the 1:1 screenshots. Layer names are stale (e.g. every card's text layers are named "Recommended plan", "Selection rationale: Highest risk-adjusted return"), so never copy a layer name as UI text. "~x/y" are approximate pixel positions in the 1440 frame.

This extends `plan-home-figma-spec.md` §4. The shell (NavBar, bottom bar, right rail), the page-header layout and the chart list are as described there. Only what differs or is new is written here.

---

## 1. Frames found ("Optimized Plan", `85:55945`)

| Sub-section | Node | Size | State |
|---|---|---|---|
| Entry point `85:65859` | `85:67986` Plan home | 1440×900 | Plan home with "Compare results" button (cursor on it) |
| | **`85:65862` Scenario compare** | 1440×2929 | **Target: all results in, Max cost = final plan**, cards scrolled to start |
| | `85:66924` Scenario compare | 1440×2929 | Same, card row scrolled right (Min cost … Mid +5% visible) |
| Tabs `85:63437` | `85:63438` | 1440×900 | Tab "Overview" (cursor on "Value measures and constraints") |
| | `85:64499` | 1440×975 | Tab "Value measures and constraints" |
| | `85:65242` | 1440×1348 | Tab "Investments" |
| Cooper's evaluation `85:55946` | `85:55947`, `85:57012` | 1440×900 | Hover on "Cooper's evaluation" → right panel "COOPER'S EVALUATION" open |
| Evidence chain `85:58438` | `85:58439`, `85:59501` + `modal` `85:60797` (396×934), `85:61034` (396×844) | | Evidence-chain panels (not specced) |
| Scenario Details `85:61394` | `85:61394`, `85:62481` (1440×2055) | | Drill into a scenario: "Investment list for user to make specific edits to investment alternative or start date" (canvas text `85:63428`) (not specced) |
| System Evidence `85:69005` | `85:69009`, `85:70070` + loose `sidebar-organism` `85:71197` | | System-evidence panel (not specced) |
| Exclude from Comparison `85:71201` | `85:71205` (Hover), `85:72266` (Excluded) | 2929 / 2901 | "All compared" dropdown with per-scenario toggles → "5 compared" |
| **Choose Another Scenario `85:73306`** | **`85:73310` (Hover), `85:74383` (Selected)** | 1440×2929 | **The final-plan interaction** (§4) |
| Re-Optimize `85:75447` | 9 frames (`85:75452` … `85:83439`) + `chat-full-panel-organism` | | Cooper-led re-optimize. Canvas text `85:83770`, verbatim: "Trigger cooper, cooper asks user what kind of scenarios They want to run + a few suggestions, user selects from suggestions or describes. once cooper gets enough info, cooper puts together the setting and present them as in set up" (not specced) |

The sub-section labels are grey sticky headers, e.g. "Plan Home", "Compare", "Overview", "Value measures and constraints", "Investments", "Hover", "Selected", "Excluded from comparisson" (sic), "Cooper's evaluation". They are design labels, not UI.

---

## 2. `85:65862` — Compare, all results in (target)

### 2.1 Page header (`page-header` `85:65883`, 40 px). Delta vs Plan-home spec §4.1
- Left: "‹", "Electrical Distribution", "FY27" ▾, "• Planning".
- Centre stepper (DS `Stepper`): **"✓ Setup"** (check-circle, white underline), **"Compare"** (active: spinner/sun icon, `elevation-1` pill, hatched underline), "Approve" (dotted circle, grey underline).
- Right: "3/5" collaborators (people icon) · comment icon button · divider · **"Send for approval"**.
  - **Here it is ENABLED**: a primary button (white fill, black text, small).
  - In the skeleton/optimizing frames it is disabled (grey).
  - It is enabled in every frame where a final plan is chosen.

### 2.2 Title row (`85:65888`, y ~100–132)
- Left: **"Scenario comparison"** (H1 medium 20/24, white). A hidden "description" layer is not rendered.
- Right `button-stack`, left to right:
  1. `multiple-select-atom` (outlined, 32 tall): badge text **"All compared"** + caret-down. DS `MultiSelect`/`Select`. It opens the include/exclude list (§5.2).
  2. Tertiary button, pencil-plus icon + **"New scenario"** (DS `Button` tertiary).
  3. Paired icon buttons ‹ | › (chevron-left disabled at the start, chevron-right enabled) in one bordered 56×32 group. They scroll the card row.
  4. Thin vertical divider.
  5. **"Cooper's evaluation"** (curly apostrophe): a Cooper-accent button (`element/button/accent-cooper`) with a dark fill, warm orange radial glow at the right, and the Cooper dots icon. DS `Button` variant cooper/accent.
- Under the title row: a thin grey **horizontal scrollbar** (`Scroll bar` 1368×8) for the card row. Its thumb covers ~75% at the start.
- The far-right `button` at ~x1310 y28 (70×32) is the right-rail expand icon "←|" with a red dot (the collapsed System-evidence rail).

### 2.3 Scenario cards (`Frame 2147228209` `85:65912`, y ~152–434)
- 6 cards, each a `content-card-organism` **320×270**, 12 gap, horizontal scroll.
- An `overlay` (80×270) fades the right edge.
- **DEV NOTE** (verbatim, `85:69000`): "The scenario cards use horizontal scrolling when there are more scenarios than can fit in the available space."

Card anatomy (DS `ContentCard`; padding 12):
1. **Title** (body L medium 14/20, white).
2. **Value row:**
   - the cost (Display 24/32 medium, white);
   - then a delta in body M medium 12 (green `text/success` + caret-up, or red + caret-down);
   - then "vs baseline" (label M, tertiary).
   - The baseline card shows the word "baseline" instead of a delta.
3. A hairline (`border/base` top) between the value row and the details.
4. **Chip** (DS `Badge`, secondary fill `element/button/secondary/fill/default`, full radius, 20 tall, label M white).
5. **Sub-line** (body M regular 12/16, `text/secondary`).
6. **Inset stat** (`stat-card-organism`, `surface/secondary-alpha`, radius 4, p 8):
   - label "Retained risk" (H4 medium 12, tertiary);
   - value (H1 20/24 white);
   - an optional caption (label M, tertiary). DS `StatCard`.
7. **Footer** (`button-stack`, pt 12, gap 8):
   - non-baseline cards: a 32×32 tertiary **refresh** icon button (`arrow-refresh`; re-optimize this scenario), then the full-width secondary button;
   - the baseline card has **no refresh button**, only the full-width button.

| # | Title | Cost | Delta | Chip | Sub-line | Retained risk | Risk caption | Footer button |
|---|---|---|---|---|---|---|---|---|
| 1 | "Baseline" | "$41.3M" | "baseline" | "174 investments" | "~3% YoY · leaves Wildfire gap open" | "$11.0M" | "≈27% of exposure" | "Select as final plan" |
| 2 | "Max cost" | "$45.0M" | "+9%" ▲ green | "194 of 200 funded" | "~10% YoY · closes the Wildfire gap" | "$6.9M" | "lowest of the three" | **"✓ Final plan"** (disabled) |
| 3 | "Min cost" | "$37.8M" | "-8%" ▼ red | "165 of 200 funded" | "~ -3% YoY · most capital-disciplined" | "$14.6M" | "highest of the six" | "Select as final plan" |
| 4 | "Mid −5%" | "$39.0M" | "-6%" ▼ red | "158 of 200 funded" | "~ -5% YoY · trims lowest-value work first" | "$15.8M" | — | "Select as final plan" |
| 5 | "Mid" | "$41.0M" | "-1%" ▼ red | "172 of 200 funded" | "~2% YoY · Cooper's balanced recommendation" | "$11.5M" | — | "Select as final plan" |
| 6 | "Mid +5%" | "$42.6M" | "+3" ▲ green (sic, no %) | "187 of 200 funded" | "~7% YoY · comfortable buffer above baseline" | "$8.6M" | — | "Select as final plan" |

Cards 5–6 are read from `85:66924` (scrolled). Card 6's instance is 226 tall in the metadata but renders like the others.

**Final-plan card state (Max cost, `85:65998`):**
- 1px light border (`border/strong`-like white ~40%), rounded 8.
- A **warm Cooper glow**: a brown/orange radial gradient bleeding from the top-centre down through the card and the footer button.
- The footer button is DS `Button` secondary **disabled** (`element/button/secondary/fill/disabled`, border disabled), with a `system-check` icon + **"Final plan"**. The text is white 50%.
- In the Hover/Selected frames (§4) the glow **stays on Max cost** even when it is no longer final, so the glow = "Cooper's pick", and the border + "✓ Final plan" = "selected as final". See §6.

### 2.4 Tabs (`85:66189`, y ~454–490)
- DS `Tabs` underline: **"Overview"** (active, white + underline) | "Value measures and constraints" | "Investments".
- Right: a 32 px outlined icon button (bar-chart icon; chart/table view toggle — purpose not annotated).

### 2.5 Overview tab content (`charts` `85:66195`)
Each card is a DS `DataVizCard` (dark `surface/secondary-alpha`, radius 4, header in H3 uppercase tertiary).

**Series colours (used in every chart and legend):**
- Baseline: indigo/dark purple
- Max cost: **white→orange gradient** (final plan + Cooper)
- Min cost: teal
- Mid −5%: magenta
- Mid: periwinkle
- Mid +5%: light pink

The legend chip for the final plan is **outlined (bordered box)**. The scenario name "Max cost" carries a small Cooper dots icon in KPI tiles, chart row labels and the forecast list.

1. **"VALUE COMPARISON"** — KPI strip + DS diverging bar chart (`DivergingBarChart` / stacked horizontal bars around 0).
   - 6 `quick-stat-card` tiles (214×74), each with a label, a value (H1) and a green ▲ delta:

     | Label | Value | Delta |
     |---|---|---|
     | "Baseline" | "3M" | — |
     | "Max cost ⁘" | "6.3M" | "+$3.3M, +110%" |
     | "Min cost" | "3.6M" | "+$0.6M, +20%" |
     | "Mid -5%" | "4.4M" | "+$1.4M, +47%" |
     | "Mid" | "5.2M" | "+$2.2M, +73%" |
     | "Mid +5%" | "5.8M" | "+$2.8M,+93%" (sic, no space) |

   - Chart rows (labels at left): "Baseline", "Max cost ⁘" (bold white = final), "Min cost", "Mid −5%", "Mid", "Mid +5%".
   - Each row is a stacked bar of 6 segments centred on a dashed 0 line. Widths shrink down the list.
   - X axis: "-$6M", "-$4M", "-$2M", "0", "$2M", "$4M", "$6M".
   - Legend (square swatches): "Total Risk" (pink), "CAPEX Cost" (dark indigo), "CMI" (periwinkle), "OPEX Cost" (teal), "Project Manager Hours Required" (magenta), "Total Investment Cost" (lavender).
2. **"STRATEGIC OBJECTIVE CONTRIBUTION"** — DS `RadarChart`.
   - Five axes: "Reliability" (top), "Wildfire" (right), "Safety" (bottom right), "Compliance" (bottom left), "Load growth" (left).
   - One filled translucent polygon per scenario, with dots at the vertices. Max cost and Baseline are the outermost; Min cost and Mid +5% the innermost.
   - Legend: "Baseline", "Max cost" (outlined chip), "Min cost", "Mid −5%", "Mid", "Mid +5%", "100% target" (dashed square).
3. **"FORECAST COMPARISON BY YEAR"** — delta list + DS `GroupedColumnChart`.
   - The top part is 5 columns ("FY 26" … "FY 30"). Each lists 6 rows: scenario name + caret + delta (red ▼ negative, green ▲ positive). Max cost is bold white with the Cooper icon.

     | | FY 26 | FY 27 | FY 28 | FY 29 | FY 30 |
     |---|---|---|---|---|---|
     | Baseline | -$0.5M | -$0.5M | -$0.5M | -$0.5M | -$0.5M |
     | Max cost | -$0.2M | -$0.2M | -$0.1M | +$0.2M | +$0.2M |
     | Min cost | -$0.5M | -$0.3M | -$0.2M | -$0.1M | -$0.1M |
     | Mid −5% | +$0.7M | +$0.5M | +$0.3M | +$0.2M | +$0.2M |
     | Mid | +$0.7M | +$0.7M | +$0.7M | +$0.7M | +$0.7M |
     | Mid +5% | +$0.7M | +$0.7M | +$0.7M | +$0.7M | +$0.7M |

   - Below: grouped columns, 6 per year.
     - Y axis: "0", "$0.5M", "$1M", "$1.5M", "$2.0M", "$2.5M".
     - X axis: "FY 26" … "FY 30".
     - The FY26 tallest is Mid −5% (~$2.4M); the values decline toward FY30.
   - Legend: the 6 scenarios.
4. **"CUMULATIVE RISK REDUCTION"** — DS `LineChart`.
   - Y axis: "0", "20%", "40%", "60%", "80%", "100%". X axis: "FY 26" … "FY 35" (10 years).
   - All lines start at ~44% at the left edge.
   - Max cost (white→orange) rises to ~65% at FY27 and ~95% at the end. Baseline ends ~83%.
   - Mid +5% dips to ~22% at FY27 and ends ~51%.
   - Legend: the 6 scenarios.
5. **"ANNUAL RISK REDUCTION - ALL SCENARIOS"** — DS `GroupedColumnChart`.
   - Y axis: "0", "5%", "10%", "15%", "20%", "25%". X axis: FY 26–FY 30.
   - FY26: all ~12%. FY27: Max cost is highest (~15%).
   - Legend: the 6 scenarios.

### 2.6 Bottom bar (`Evidence-strip-bar/all actions`, 40 px)
- Left: "COOPER'S CONTEXT", "16 Documents" (file icon), upload icon button.
- Right: DS `PromptButton`s **"Explain gaps in confidence"** and **"Why this scenario?"**, then the Cooper orb.

---

## 3. Other tabs (summary level)

### 3.1 "Value measures and constraints" (`85:64499`, 975 tall)
The header and cards are unchanged. The tab content is one card.
- **Card header:** **"VALUE MEASURES AND CONSTRAINTS"**. A round Cooper-evidence icon button sits at the right.
- **Toolbar:**
  - Left: DS `SegmentedControl` with counters: **"Cost" "3"** (selected) | "Resource hours" "30" | "Strategic" "7".
  - Right: a ‹ › paired button that scrolls the table's scenario columns.
  - A horizontal scrollbar sits under the toolbar.
- **Table** (DS `Table`, bordered cells, grouped header):
  - Columns: "Value measure" (filter icon), "Type" (sort + filter), "Baseline" (filter).
  - Then a group per scenario: "Max cost ⁘", "Min cost", "Mid -5%", "Mid", … Each has the sub-columns "Value" | "Change".

| Value measure | Type (Badge) | Baseline | Max cost Value / Change | Min cost | Mid -5% | Mid |
|---|---|---|---|---|---|---|
| "OPEX Cost" | "Outcome" | "$2.77B" | "$80.40B" / ▼ "-$1.98M" | "$80.40B" / ▲ "+$4.75M" | "$80.40B" / ▼ "-$1.98M" | "$80.40B" / ▼ "-$1.98M" |
| "CMI" | "Outcome" | "3 CMI" | "$80.40B" / ▲ "+$4.75M" | same | same | same |
| "Total Investment" | "Change" | "$6.77B" | "$80.40B" / ▲ "+$4.75M" | same | same | same |
| "CAPEX Cost" | "Outcome" | "$4.00B" | "$80.40B" / ▲ "+$4.75M" | same | same | same |
| "OPEX Cost" | "Outcome" | "$3.50B" | "$80.40B" / ▲ "+$4.75M" | same | same | same |

These are placeholder values (all "$80.40B"; OPEX Cost twice; "Cost 3" but 5 rows). Map to real Whistler value measures instead.

### 3.2 "Investments" (`85:65242`, 1348 tall)
- **Compare bar** (bordered inset):
  - DS `Select` **"Baseline"** ▾, then the label **"COMPARE TO"** (uppercase, secondary), then DS `Select` **"Max cost ⁘"** ▾.
  - It is a pairwise diff of two scenarios.
- **Table card** (DS `Table` with grouped, collapsible rows):
  - Columns: "INVESTMENT" (filter), "ALTERNATIVE (1)" ⇅, "ALTERNATIVE (2)" ⇅, "START DATE (1)" ⇅, "START DATE (2)" ⇅.
  - Group header rows (grey bar, caret ▾, status dot, uppercase, counter badge at the right):
    - **"HIGHEST SHIFT"** red dot, "3"
    - **"MODERATE SHIFT"** amber dot, "4"
    - **"NO SHIFT"** green dot, "150"
  - Rows (48 px):
    - the name;
    - Alt (1) as a `Badge` "Full Replacement";
    - Alt (2): either the same badge, or **struck-through "Full Replacement"** followed by a badge "Target Hardening" (alternative changed);
    - Start (1);
    - Start (2) with a delta (red ▼ "+12m" for highest, amber ▼ "+5m" for moderate).

| Group | Investment | Alt (1) | Alt (2) | Start (1) | Start (2) |
|---|---|---|---|---|---|
| Highest | "Cedar Park reconductor" | Full Replacement | ~~Full Replacement~~ Target Hardening | 01/03/2026 | 01/03/2027 +12m |
| Highest | "Birchwood feeder upgrade" | " | " | 01/03/2026 | 01/03/2027 +12m |
| Highest | "Westfield valve replacement" | " | " | 01/03/2026 | 01/03/2027 +12m |
| Moderate | "Lakeshore transformer bank" | Full Replacement | ~~Full Replacement~~ Target Hardening | 02/15/2026 | 01/07/2026 +5m |
| Moderate | "Pinecrest switching station" | Full Replacement | Full Replacement | 02/15/2026 | 01/07/2026 +5m |
| Moderate | "Ridgeline tower inspection" | Full Replacement | ~~Full Replacement~~ Target Hardening | 02/15/2026 | 01/07/2026 +5m |
| Moderate | "Maple Ave pressure regulator" | " | " | 02/15/2026 | 01/07/2026 +5m |
| No shift | "Oakwood leak repair" | Full Replacement | Full Replacement | 02/15/2026 | 02/15/2026 |
| No shift | "Maplewood system maintenance" | " | " | 02/15/2026 | 02/15/2026 |
| No shift | "Pinehill infrastructure upgrade" | " | " | 06/20/2026 | 01/04/2026 |
| No shift | "Maplewood system maintenance" | " | " | 04/01/2026 | 01/06/2026 |

These are placeholder names, not Whistler records.
- "+5m" rows show Start (2) *earlier* than Start (1) yet labelled +5m.
- "No shift" rows have differing dates.

Map to real Whistler investments and compute the shift.

---

## 4. Choosing a final plan (sub-section "Choose Another Scenario", `85:73306`)

The two frames are 1440×2929 with identical layout to §2. **In this sub-section Min cost reads "$40.5M" "-2%" ▼** (the entry frame shows "$37.8M" "-8%"). Everything else on the card is the same: "165 of 200 funded", "$14.6M", "highest of the six".

### 4.1 `85:73310` — Hover (before)
- Max cost is the final plan: border + glow + disabled "✓ Final plan".
- The cursor hovers Min cost's "Select as final plan". The hovered card:
  - gets a **lighter fill** (`surface` hover, ~grey 20%);
  - shows a **drag handle "⠿"** before the title ("⠿ Min cost"; the cards are reorderable, not annotated);
  - its button gets the hover fill.
- The charts are unchanged: Max cost white/orange, legend chip outlined.

### 4.2 `85:74383` — Selected (after clicking "Select as final plan" on Min cost)
- **Min cost card:**
  - gets the light 1px border;
  - its footer button becomes disabled **"✓ Final plan"**;
  - **no glow** (Min cost is not Cooper's pick).
- **Max cost card:**
  - loses the border;
  - its button reverts to an enabled **"Select as final plan"**;
  - **keeps the warm Cooper glow**, now spreading behind the button too.
- **Charts:** the final-plan series switches to **white**.
  - Min cost becomes white (bars, line, radar polygon, legend swatch). Its legend chip is outlined, and "Min cost" in the chart rows / forecast list turns bold white.
  - Max cost becomes **plain orange** (swatch no longer gradient, chip not outlined).
  - So: white = final plan, orange = Cooper pick, gradient = both.
- **Header:** "Send for approval" stays enabled (primary). The stepper is unchanged (Compare active).
- **No confirmation modal, toast or snackbar is drawn.** The switch is immediate and single-select (exactly one final plan at a time). It is unclear whether Baseline can be chosen as final; its card offers "Select as final plan".

### 4.3 Sequence
1. Results arrive (Optimizing section). Baseline is filled first; the others are skeletons.
   - In those frames **Baseline shows "✓ Final plan"** and "Send for approval" is disabled. See `plan-home-figma-spec.md` §4.2.
2. All results in (`85:65862`): **Max cost is the final plan** (the Cooper pick, preselected — not annotated), and **"Send for approval" is enabled**.
3. Hover another card → hover fill + drag handle.
4. Click "Select as final plan" → that card becomes "✓ Final plan" and the previous one reverts to "Select as final plan". The chart highlight moves.
5. Click **"Send for approval"** → page "3️⃣ Approve" (§7). No connector is drawn for this click; it is inferred from the stepper and the Approve page header "Approval" + chip "Max cost".

---

## 5. Other interactions on this page (brief)

### 5.1 Prototype connectors (magenta arrows)
- Plan home "Compare results" → `85:65862` (`85:68994` "button <-> Scenario compare").
- `85:65862` header › (scroll right) → `85:66924` (`85:68997`).
- "Cooper's evaluation" button → frame with the panel open (`85:58435`).

### 5.2 Exclude from Comparison
- `85:71205` Hover: the cursor is on "All compared".
- `85:72266` Excluded:
  - the dropdown is open, with a list of DS `Switch` rows: "Baseline", "Max cost ⁘", "Min cost", "Mid -5%", "Mid", "Mid +5%";
  - Max cost's switch is being toggled; the others are on;
  - the trigger now reads **"5 compared"**;
  - the excluded card's title shows a small toggle/dot ("Min cost ●").

### 5.3 Cooper's evaluation
`85:57012`: a right panel (~300 wide) titled **"COOPER'S EVALUATION"** with an ✕. It holds three cards:
- **"Favors min cost"** (Cooper-highlight card, warm gradient). Body: "Max Cost delivers the strongest overall outcome across portfolio value and risk reduction. Baseline performs worst, while Min Cost improves affordability but gives up too much value and leaves more risk unresolved." Then: "Would change if: budget pressure increases significantly or funding limits become more restrictive."
- **"Risk"** with tag "FAVORS MAX COST". Body: "Max Cost delivers the greatest risk reduction by funding more high-impact investments and accelerating critical work. Baseline leaves the highest residual risk."
- **"Cost"** with tag "FAVORS MIN COST". Body: "Min Cost keeps total portfolio spend lowest. Max Cost requires the highest investment, while Baseline sits between the two on cost but delivers the weakest overall outcome."

Copy was read at reduced resolution; re-check it against `get_design_context` before building.

---

## 6. DEV NOTE / annotations (verbatim)
- `85:69000` (Entry point, over the card row): **DEV NOTE** "The scenario cards use horizontal scrolling when there are more scenarios than can fit in the available space."
- `85:87503` (Optimizing › Entry point, canvas text): "baseline will already be here, rest of the scenarios get populated as the results come in"
- `85:87510` (Optimizing › Entry point): **DEV NOTE** "Visible across all sections while optimization is running. Once it finishes, the badge disappears and a notification links to the results."
- `85:83762` (Re-Optimize): "The frame disappears after 5 seconds. Animated stroke. Animation: gradient overflow."
- `85:83770` (Re-Optimize, canvas text): quoted in §1.
- `85:63428` (Scenario Details, canvas text): "Investment list for user to make specific edits to investment alternative or start date"
- No DEV NOTE exists in "Choose Another Scenario" or "Tabs".

---

## 7. Approve page (`32:91316`, "3️⃣ Approve") — what "Send for approval" leads to

Section "Approve" (`84:108434`) holds four sub-sections:

| Sub-section | Frames |
|---|---|
| **Workspace** `84:108435` | `84:108440` "Executive" · `84:108560` "Changed reviewer" · `84:108777` "Other gates opened" · `84:108685` "All approved" |
| Stakeholders › Types `84:115108` | Executive `84:115112` · Technical `84:116447` · Financial `84:115875` |
| Stakeholders › Open `84:121960` | `84:121964` Executive · `84:123676` Scenario compare · `84:122729` Investment / Data readiness |
| Stakeholders › Actions `84:117220` | 6 "Executive" frames |
| Approved `84:108890` | 6 "Container" frames |

**First screen `84:108440`:**
- **Stepper:** "✓ Setup", "✓ Compare", **"Approve"** active.
- **Header right:** "3/5", comment, then **"Publish"** (disabled). In "All approved" it is enabled.
- A left rail "|→" sits on the page.
- **Title:** **"Approval"** + chip **"Max cost"** (the chosen final plan). Description: "Reviewers and approvers are preconfigured by your administrator based on your role and plan type."
- **3 stat cards:**
  - "Cost" "$41.2M"
  - "Retained risk" "$8.4M" "Low · lowest of 3"
  - "Investments funded" "186" "of 200 · 14 deferred"
- **Gate accordion:**
  - **"EXECUTIVE"** (expanded), status "● UNDER REVIEW" "1/3".
    - Table columns: "USER" (filter), "NOTE", "COMMENT", "LAST NOTIFIED".
    - Rows:
      - 1: [person name] (You), CFO — approved (green check).
      - 2: [person name], Director of Capital Planning — pending (amber clock). Long note, then the comment "The cost range needs a clearer benchmark before I can sign off.", "Feb 15, 2025", and a disabled "Notified" button.
      - 3: [person name], COO — pending. Comment "The cost range needs a clearer benchmark before this idea can move forward."
  - "TECHNICAL" and "FINANCIAL" are locked (lock icon, collapsed).
- **Bottom bar:** "Compare to peer", "Compare to best practice", orb.

**Purpose:** collect sign-off by gate (Executive → Technical → Financial), then Publish.

---

## 8. Kit mapping (looks like DS 2.0)

| UI | DS component |
|---|---|
| Stepper | `Stepper` |
| "Send for approval", "New scenario", "Select as final plan", "✓ Final plan", refresh, ‹ › | `Button` (primary / tertiary / secondary / secondary-disabled), `IconButton` |
| "Cooper's evaluation" | `Button` Cooper-accent variant |
| "All compared" / "5 compared" + switch list | `MultiSelect` (`multiple-select-atom`) + `Switch` |
| Scenario card | `ContentCard` + `Badge` (chip) + `StatCard` (Retained risk) |
| Tabs | `Tabs` |
| Chart cards | `DataVizCard` + `StatCard`/QuickStat tiles |
| Value comparison | diverging stacked bar (`DivergingBarChart` if in kit; else `BarChart` stacked horizontal) |
| Strategic objective | `RadarChart` |
| Forecast by year, Annual risk reduction | `GroupedColumnChart` |
| Cumulative risk reduction | `LineChart` |
| Legends | chart `Legend` (selected item outlined) |
| Value measures | `SegmentedControl` + `Counter`, `Table` with grouped header, `Badge` |
| Investments diff | `Select` ×2, `Table` with group rows + `Counter`, `Badge`, status `Indicator` |
| Bottom bar | `PromptButton`, `FtaButton` |

Check each in `vendor/ds2/` with `scripts/entry.sh`. Anything missing (e.g. the diverging bar, the struck-through alternative cell, the Cooper glow on a card) must be wrapped in `NDS`.

---

## 9. Ambiguities / inconsistencies

1. **Who is the default final plan?** The optimizing frames show Baseline as "✓ Final plan"; the results frame shows Max cost (no annotation says it is auto-selected as Cooper's pick).
2. **The Cooper glow vs the final-plan state** is inferred: the glow stays on Max cost after Min cost is selected. The legend gradient appears to mean "final + Cooper", white "final", orange "Cooper".
3. **The Cooper's evaluation panel headline says "Favors min cost"**, but its body text favours Max Cost; card 5's sub-line says "Cooper's balanced recommendation" for **Mid**. That gives three different "Cooper picks".
4. **Min cost** is "$37.8M -8%" in Entry/Tabs but "$40.5M -2%" in Choose Another Scenario.
5. **Mid +5% delta "+3"** has no "%". The KPI "+$2.8M,+93%" has no space.
6. **"lowest of the three" / "highest of the six"** captions are mixed (6 scenarios exist).
7. **Approve shows "Max cost" at "$41.2M" / "$8.4M" / "186 of 200 · 14 deferred"**, which doesn't match the Max cost card ($45.0M / $6.9M / 194 of 200). Pull both from one record.
8. **The Value comparison KPI "Baseline 3M"** doesn't relate to the card costs ($41.3M). Its unit/measure is unstated (value?).
9. **The Value measures table is placeholder** (all $80.40B; "Cost 3" vs 5 rows; OPEX Cost twice). **The Investments diff** has dates contradicting the deltas and placeholder names.
10. **No confirmation, toast or undo** is designed for "Select as final plan". **No connector** for "Send for approval" → Approve (inferred).
11. **"Send for approval" disabled vs enabled:** disabled while optimizing, enabled once results are in. The rule (any final plan selected? all results in?) is not annotated.
12. The **drag handle on hover** suggests reorderable cards; this is not specced.
13. **The chart-icon button right of the tabs** has no defined behaviour.
14. **Sticky label typo** "Excluded from comparisson" (design label only).
