# Plan: Setup (Scenarios) and Send to Plan: Figma screen spec

There are two Figma sources. They are two **different designs** for the same moment (Plan → Setup), so read §0 first.

| | Source A | Source B |
|---|---|---|
| File | `Dv3HzkcFTTrb4E34zLF7cy` | `U7AUNbrWHYuX3E0O4GbfEx` |
| Section | node `85:162876` "Scenarios" (labels: Default · Expanded · Summary) | node `103:63527` "Send to Plan" ("12 Screens #8") |
| Page | "Setup", with tabs Data readiness / Planning groups / **Scenarios** | "FY26–27 Distribution Capital · Northern Region" setup, with derived constraints and 3 proposed scenarios |
| Frame size | 1440×900 (collapsed) or 1440×~2280 (expanded, scrolling) | 1440×810 |

Every frame was screenshotted at 1440 px wide, and the screenshots are the source of truth. Copy in "quotes" is exact, typos included. Dev notes and the notes card are quoted verbatim.

Local screenshots (not part of the repo): `/private/tmp/claude-503/-Users-schu-Documents-CLAUDE-NEW-CODE-Catalyst-prototype/ace79f5e-35e0-4abb-8fb9-fe85df86f85d/scratchpad/ps/*.png` (A* = source A, B*/C*/D*/E* = source B).

---

## 0. How the two sources relate (needs a decision)

- **Source A** is a scenario *browser*: 5 named scenarios (MIN COST … MAX COST). Each one expands to show its Restrictions, a multi-year Constraints table and Investment groups. Cooper "summarises" a scenario section by section.
- **Source B** is the "Send to Plan" moment (storyboard box 8). Cooper has placed Northgate in a portfolio, derived 3–4 constraints from strategic objectives, and proposed 3 scenario cards. The user edits, adds and deletes constraints, and the scenario cards recalculate.
- Both use the Plan stepper, but the steps differ: A has "Setup · Compare · Approve"; B has "Setup · Compare · Review · Approve · Execution".
- Scenario names, counts and numbers do not overlap: A's Min cost has a $37.8M budget; B's Recommended plan is $4.2M.
- **Ask:** which one is the Plan Setup screen, or is A the "Scenarios" tab that B's "Move to Compare" leads to? This spec documents both without merging them.

---

## 1. Shared shell (both sources)

- **NavBar** (`nav-bar-organism`, 48 px): the IFS Copperleaf logo, then "Command", "Value", "Explore", "Build", "**Plan**" (active pill), "Results". On the right: search, gear, bell with a red dot, and the avatar "JP".
- **Page header bar** (`page-header`, 40 px):
  - Left: "‹", the entity name, a grey qualifier, "▾" and a status dot plus label.
  - Centre: a stepper. Each step is a dotted-circle icon plus a label with an underline bar; the active step ("Setup") has a sun/spinner icon and a hatched underline.
  - Right: a "3/5" people chip, a comment icon button, a divider and the primary button.
- **Bottom bar:** `base-bottom-sheet-organism` or `Evidence-strip-bar/all actions` (40 px). Right side: Cooper suggestion chips (outlined pills) and the Cooper orb. Some frames also have "COOPER'S CONTEXT" plus a "16 Documents" button and an upload icon on the left.
- Dark theme. Cards are dark grey on black; section titles are grey uppercase. A small round Cooper dot icon button sits at the top right of each section.

---

## 2. Source A: Setup › Scenarios (`Dv3HzkcFTTrb4E34zLF7cy`)

### 2.1 Header (all A frames)
- Header: "‹ Electrical distribution" "FY27" "▾" "• Planning" (purple dot).
- Stepper: "Setup" (active), "Compare", "Approve".
- Right: "3/5", the comment icon and an **"Optimize"** button (white, primary).
- Far right: a slim rail (x~1392–1440) with a "←|" expand icon and a red dot. This is a collapsed side panel.
- Page title: "Setup".
- **Tabs** (DS Tabs with count badge): "Data readiness", "Planning groups", "Scenarios **5**" (active, underlined). The Expanded frame shows "Scenarios **3**" (see §4).
- A **"New scenario"** button (outlined, pencil-plus icon) sits right-aligned on the tabs row.

### 2.2 `85:174154` — Default (1440×900)
There are 5 collapsed **scenario cards** (full width, dark grey, radius ~8, 8 px gap). Card anatomy:
- "▸" caret, then the NAME in grey uppercase.
- A 2-line description (white, ~14 px) on the left half.
- 3 metric columns, each with a vertical divider on its left: "Budget", "Resources", "Enterprise goal" (label grey, value white).
- An optional "+3" count chip after the goal.
- A Cooper icon button at the far right.

| # | Name | Description | Budget | Resources | Enterprise goal |
|---|---|---|---|---|---|
| 1 | "MIN COST" | "Lower cost constraints vs Baseline; resource and strategic constraints stay the same. Restrictions keep alternatives and timing flexible." | "$37.8M" | "18,500 T&D crew hours" | "+1% SAIDI year by year" + chip "+3" |
| 2 | "MID -5%" | "Slightly tighter cost and resource constraints vs Baseline; strategic constraints stay the same. Restrictions allow alternative and timing changes." | "$39.2M" | "18,500 T&D crew hours" | "2% YoY SAIDI reduction" + "+3" |
| 3 | "MID" | "Cost, resource, and strategic constraints stay close to Baseline. Restrictions allow alternative and timing changes." | "$41.3M" | "20,000 T&D crew hours" | "3% YoY SAIDI reduction" |
| 4 | "MID +5%" | "Higher cost and resource limits vs Baseline; strategic constraints stay the same. Restrictions allow alternative and timing changes." | "$43.4M" | "21,500 T&D crew hours" | "4% YoY SAIDI reduction" |
| 5 | "MAX COST" | "Highest cost and resource limits vs Baseline, with strategic constraints maintained. Restrictions allow maximum flexibility in alternatives and timing." | "$45.0M" | "23,000 T&D crew hours" | "6% YoY SAIDI reduction" |

- Bottom bar chips: "Compare to peer", "Compare to best practice", then the orb.

### 2.3 `85:172438` — Expanded (1440×2283, page scrolls)
MIN COST is expanded: the caret is "▴" and the card grows to contain three nested section cards (slightly lighter panels, each with a Cooper icon at the top right). The other 4 scenarios follow collapsed below.

**a) RESTRICTIONS**
- 5 KPI tiles in a row (label grey ~12 px, value white ~20 px):

| Label | Value |
|---|---|
| "Investments adjustable" | "1,417" |
| "Planning groups enabled" | "1" plus small grey "/3" |
| "Max date shift" | "3yr" |
| "Alternative changes" | "Allowed" |
| "Interpolation" | "Off" |

- 3 setting rows. Each has a bold title, a grey description and a **DS Switch** on the right:
  1. "Change recommended alternatives". Description: "Each alternative solution has unique costs, schedules, and value outcomes. Optimization can suggest the optimal solution to maximize portfolio value by changing the recommended alternative." Switch **ON**.
  2. "Interpolate investments configured for interpolation". Description: "Enable this option to allow the Optimizer to calculate interpolated alternatives during optimization. For non-interpolated investments, optimization will proceed as usual." Switch **ON**.
  3. "Shift start dates from alternatives' earliest start dates". Description: "The timing of an investment can affect its value. Optimization can suggest the optimal timing for execution to maximize portfolio value by deferring or advancing the start date." Switch **OFF**. Below it are disabled (greyed) sub-controls:
     - "Shift dates by a maximum of": a stepper "–" / "1 Year" / "+".
     - A vertical divider.
     - "Shift granularity": radio "Years" (selected) and radio "Months".
- **Contradiction:** the "Interpolation: Off" tile conflicts with the Interpolate switch being ON.

**b) CONSTRAINTS**
- Segmented filter chips with counts: "Cost 3" (selected), "Resource hours 30", "Strategic 7". On the right, a "‹ | ›" pager (prev disabled).
- A horizontal scroll bar sits above the table; the table is wider than the card (more FY columns to the right).
- **Table** (DS Table):
  - Header columns: "CONSTRAINT" (filter icon), "TYPE" (sort + filter icons), "UNIT" (filter icon).
  - Grouped column headers "FY26", "FY27", "FY28", "FY29", …, each with "Min" and "Max" sub-columns.

| Constraint | Type (chip) | Unit | FY26 Min / Max | FY27 | FY28 | FY29 |
|---|---|---|---|---|---|---|
| "Aggregate Risk" | "Outcome" | "Value units" | "—" / "900M" | — / 900M | — / 900M | — / 900M |
| "CAPEX Cost" | "Outcome" | "$" | "—" / "$425B" | — / $425B | — / $425B | — / $425B |
| "CML" | "Change" | "Value units" | "—" / "1" | — / 2 | — / 3 | — / 4 |
| "Maintenance Cost (OPEX)" | "Outcome" | "$" | "—" / "$900M" | — / $900M | — / $900M | — / $900M |
| "Enterprise CAPEX envelope" | "Outcome" | "$" | "—" / "$900M" | — / $900M | — / $900M | — / $900M |

- The "Cost 3" chip shows 3 but there are 5 rows, and "Aggregate Risk" / "CML" are not cost constraints.

**c) INVESTMENT GROUPS** (two-pane)
- **Left pane:** header "⊞ Groups" with a "←|" collapse icon. Checkbox rows with count badges, all checked:
  - "Under consideration" "1417"
  - "Required by management" "14" (this row has an outlined/focus border)
  - "Executing" "61"
- **Right pane:**
  - Cooper search "Ask anything about investments" with a mic.
  - Table columns: "INVESTMENTS", "STATUS" (empty in all rows), "COST", "VALUE", "SCHEDULE", each with a filter icon.
  - Rows (name, then grey "INV-2026-0910" under it; every row uses the same code):

| Investment | Cost | Value | Schedule |
|---|---|---|---|
| "West Corridor Protection Relay Upgrade" | "$3.4M" | "2.3M" | "Jan 2026 – Jun 2026" |
| "Ridgeview Village Backup Tie to Feeder 5" | "$12.7M" | "2.3M" | "Mar 2026 – Dec 2026" |
| "Cedar Park Feeder Hardening Program" | "$8.9M" | "2.3M" | "May 2026 – Aug 2027" |
| "Southern Feeder Replacement — Circuit 17C" | "$1.2M" | "2.3M" | "Jul 2026 – Oct 2026" |
| "Elmwood Feeder 2 Underground Cable Renewal" | "$650K" | "2.3M" | "Sep 2026 – Mar 2027" |
| "Flood Erosion Protection at River Crossing Structure" | "$22.3M" | "2.3M" | "Nov 2026 – Dec 2027" |
| "Elmwood Feeder 2 Underground Cable Renewal" (duplicate name) | "$480K" | "2.3M" | "Feb 2026 – May 2026" |
| "West Corridor Protection Relay Upgrade" (duplicate name) | "$5.6M" | "2.3M" | "Apr 2026 – Jul 2027" |

- The table scrolls internally (scrollbar on the right).
- Bottom bar: left "COOPER'S CONTEXT", "16 Documents", upload icon. Right: chips "Explain gaps in confidence", "Why this scenario?", then the orb.

### 2.4 Summary sequence (Cooper explains a scenario)
This is a Cooper `agent-window-organism` floating at the bottom right (x 1048–1428, width 380).
- **Panel header:** dot logo + "COOPER"; an orange waveform + "Speaking" + pause icon; an "Ask" button; a collapse icon; "×".
- **Highlight:** the section Cooper is talking about gets a **1px warm/orange gradient outline**. (Source B dev note: "Outline fades after 5 seconds.")

**`85:162879` — Summary 1: Select a scenario (1440×900).** The page is the Default list (collapsed), with the panel open:
- Body: "I read all five scenarios and wrote a plain summary of each. Pick one and I will tell you what it actually tests, what binds it, and what it cannot answer."
- "SELECT A SCENARIO". List rows with a "↳" glyph and dividers: "Min cost", "Mid -5%", "Mid", "Mid +5", "Max cost". Note "Mid +5" has no "%".
- Clicking "Min cost" leads to Summary 2.

**`85:163749` — Summary 2: scenario intro.** MIN COST is expanded, and the **whole MIN COST card** is outlined orange. The panel shows:
- "← Back"
- "[Scenario author] built Min cost on 2 July to answer one question: what is the least we can spend and still improve SAIDI by 1% a year. The envelope is $12–15M against the T&D crew pool, and it is the scenario finance will read first."

**`85:167212` — Summary 3: Restrictions.** The **RESTRICTIONS** panel is outlined. Panel:
- "← Back", eyebrow "RESTRICTIONS". Bullets:
  - "The optimizer may swap alternatives and interpolate between them, so it will hunt for cheaper ways to do the same work."
  - "It may not move start dates. Timing is frozen at each alternative's earliest start."
  - "It only touches Under consideration (1,417). Required by management (14) and Executing (61) are left exactly as they are."
- Callout box with a left rule: "Because dates are frozen, this scenario tests scope, not timing. Work that does not fit the budget this year is dropped, which is why Min cost funds 186 of 200 rather than shifting the other 14 outward."

**`85:168975` — Summary 4: Constraints.** The **CONSTRAINTS** panel is outlined. Panel:
- "← Back", "CONSTRAINTS". Bullets:
  - "40 limits are set, but only 2 actually bind."
  - "CAPEX FY27, max $12.0M — the plan lands $0.3M under it. This is the limit shaping the answer."
  - "T&D crew hours in Q3 — 96% used, so nothing more can be scheduled in that quarter."
  - "Aggregate risk is capped at 900M value units and never gets close, so it shapes nothing."
- Callout: "The other 38 limits are guard-rails, not levers. If you want a different answer from this scenario, the FY27 cost cap is the only dial worth turning."

**`85:170713` — Summary 5: Investment groups.** The **INVESTMENT GROUPS** panel is outlined. Panel:
- "← Back", "INVESTMENT GROUPS". Bullets:
  - "All three groups are ticked, so the optimizer may change 1,492 investments, not 1,417."
  - "Executing (61) is in scope. Those have purchase orders raised — the optimizer is allowed to re-time and re-scope committed work."
  - "Required by management (14) is in scope too, so mandated work can be moved."

**`85:165479` — Summary 6: Verdict.** The whole MIN COST card is outlined again. Panel:
- "← Back", "VERDICT".
- "Min cost answers how little can we spend. It cannot tell you what happens when work slips instead of being dropped — no scenario in this set can."
- Callout: "Across all five scenarios: every one freezes start dates, so nothing in this set tests deferral. Since FY29 is what binds MID, that is the missing case."
- A full-width button **"Select next to explain →"**, which presumably returns to the scenario picker or moves on to Mid -5%.

**Sequence:** Default → (Cooper opened) Summary 1 picker → click scenario → the card expands and Summary 2 intro shows → Restrictions → Constraints → Investment groups → Verdict → "Select next to explain". "← Back" steps back one. How the user advances between steps is not shown: there is no Next button until the Verdict.

**Contradictions inside the summary copy:**
- Restrictions says "only touches Under consideration (1,417)", but Investment groups says "All three groups are ticked … 1,492". The UI shows all 3 groups checked while the tile says "Planning groups enabled 1 /3".
- The Constraints copy says "40 limits" and "CAPEX FY27, max $12.0M", but the table shows CAPEX Cost max "$425B" and chip counts 3 + 30 + 7 = 40.
- The intro says "envelope is $12–15M", but the card budget is "$37.8M".

---

## 3. Source B: Send to Plan (`U7AUNbrWHYuX3E0O4GbfEx`, node `103:63527`)

### 3.1 Notes card (top left, `103:63528`, an image)
> **8 · Send to Plan** — *"Cooper drafts the scenarios from your strategy"*
>
> **The moment.** The operator has shaped the Northgate investment and now sends it into the plan. The wow is that Cooper has already placed it in the right portfolio and drafted the constraint scenarios — read from the company's own strategic objectives, not typed into a blank grid.
>
> **What to show on screen:**
> - **Portfolio, already chosen** — Cooper names the portfolio Northgate joins and why, with the reasoning in plain sight. Changing it is the exception, not the first step.
> - **Constraints derived from objectives** — a short table reading objective → constraint → target, so the CAPEX ceiling visibly traces to capital discipline, the CMI floor to reliability. Nothing keyed cold.
> - **Two or three drafted setups** — capital-disciplined, risk-max, defer-tolerant — colour-matched to the scenarios they become on the comparison screen. Cooper's pick is flagged.
> - **Honest gaps, flagged not faked** — where the value framework has no target, Cooper leaves it "needs you" rather than inventing a number.
> - **The process bar, intact** — the operator always knows they are setting up the plan, one step before Compare.
> - **No blank constraint grid** and no 4-step optimizer wizard — the killed patterns stay killed.
>
> **Cooper here.** Cooper translates strategic objectives into optimizer constraints and drafts the scenario spread — the operator reviews and steers a setup, never configures one from scratch.
>
> **Platform thread.** The setups sent here are the scenarios that land on Scenario Comparison (9). Same investment, now competing for budget — the moment the scenarios are born.

### 3.2 Base layout (all "Plan setup" frames, 1440×810)
**Header:**
- Left rail (x 0–48) with a "|→" expand icon (the Plan sidebar, collapsed).
- Header: "‹ FY26–27 Distribution Capital..." (truncated) "▾" "• In progress" (grey dot).
- Stepper: "Setup" (active, hatched), "Compare", "Review", "Approve", "Execution".
- Right: "3/5", the comment icon, then **"Optmise"** (sic). It is disabled (grey) in every frame except "Move to Compare".

**Main column (x 48–1042, scrolls):**
- Title "FY26–27 Distribution Capital · Northern Region" (~20 px). Subtitle: "Cooper has prepared your portfolio for optimization, review it before optimizing."
- Section "CONSTRAINTS DERIVED FROM STRATEGIC OBJECTIVES". A card holding a row-card table (DS Table; rows are separate rounded dark rows):
  - Columns: "CONSTRAINTS" (filter icon), "STATUS" (sort), "TOTAL VALUE" (sort), "VALUE CHANGE" (sort).
  - Status cell: grey dot plus bold uppercase "COOPER SET" (all rows).
  - Below the rows, a "+ Add" text button.

| Constraints | Status | Total value (grey) | Value change |
|---|---|---|---|
| "Resource capacity" | COOPER SET | "Crew hours ceiling" | "Not set" |
| "Capital discipline" | COOPER SET | "CAPEX ceiling" | "≤ $4.2M" |
| "Reliability improvement" | COOPER SET | "CMI reduction floor" | "≥ 55%" |
| "Safety risk tolerance" | COOPER SET | "Cap high-category safety risk" | "0 in 'high'" |

- Section "PORTFOLIO PROPOSED SCENARIOS", with a "+ Add scenario" button (outlined) on the right. Below it, 3 **scenario cards** side by side. Card anatomy: title, a checkbox at the top right, a grey subtitle or chip, a big value (~24 px), a grey caption, a divider and a 2-line description.

| Card | Subtitle | Value | Caption | Description |
|---|---|---|---|---|
| "Recommended plan" (Cooper's pick: **warm brown/orange glow** bottom-left) | "Optmized spend, best outcome" (sic) — or a **"Baseline"** chip in some frames | "$4.2M" | "within approved cap" | "Holds the line on capital. Prioritizes the highest-risk feeders first." |
| "Defer a lower-value item" | "Lower spend, lower outcome" | "$5.9M" | "+40% vs. cap" | "Maximizes reliability gain. Needs capital approval beyond the cap." |
| "Relax the budget" | "More spend, higher outcome" (blank in some frames) | "$3.1M" | "−26% vs. cap" | "Frees capital by allowing later start dates. Two feeders slip to FY27." |

**Right panel "SYSTEM CONFIDENCE"** (x 1048–1440):
- Header with a Cooper icon button and a "|→" collapse icon.
- Two collapsible cards, each with "▸", a title and a right-aligned bold uppercase "NEEDS YOUR INPUT":
  1. "Outlier Detection": "Cooper flagged 2 outliers in this setup: Resource capacity constraint has no total value set — crew hours ceiling is undefined."
  2. "Inconsistency Detection": "3 of 4 objectives translated to constraints. Resource capacity is unmapped — crew hours ceiling has no input, which means the optimizer will treat it as unconstrained."
- This is the "Scenarios setup" state of System confidence. It differs from the Investment overview version (Approval readiness ring and checklist).

**Bottom bar** (Evidence strip): chips "Re-derive for a tighter cap" and "What if I add a 4th setup?", then the orb.

### 3.3 Row "Plan setup" (scroll + compare)
- **`103:64791` — Page up.**
  - Only **3** constraint rows (no Resource capacity): Capital discipline / Reliability improvement / Safety risk tolerance.
  - The Recommended plan card shows a "Baseline" chip; the Relax the budget subtitle is blank.
  - Scroll-bar connector to the next frame.
- **`103:67144` — Page down (Hover on Card).**
  - The page is scrolled; the constraints table has 4 rows (Resource capacity first).
  - **Outlier Detection is expanded** ("▾") with a second paragraph: "Capital discipline shows a $4.2M value change that sits 340% above the portfolio average for this asset class. Review before optimizing."
  - The Recommended plan card is hovered: a **trash icon** appears left of the checkbox, and the subtitle reads "Optmized spend, best outcome".
- **`103:67405` — Move to Compare.**
  - The same 4-row layout, with Baseline chip and trash on hover.
  - **"Optmise" is enabled** (white).
  - Dev note `103:69773` (pointing at the button): "Unlocks once setup is selected, Navigate to Scenario Modeling (box 9) on click".
  - No checkbox is visibly ticked in this frame; selecting a card's checkbox is the implied trigger.

### 3.4 Row "Sidebar"
- **`103:63562` — Collapsed:** the base layout (4 rows, Baseline chip). The left rail has the "|→" icon; the connector starts from it.
- **`103:69508` — Expanded:** the left **PLAN sidebar** opens (x 0–240), pushing the content right.
  - Sidebar header "PLAN" with "←|". Nav items: "My plans" (selected, grey fill), "All plans", "Live plans".
  - In this frame the header reads "‹ FY26–27 Capital Plan ▾ • In progress", and the primary button reads **"Compare"** (disabled) instead of Optmise.
  - Page title is **"Set up"**, with the same subtitle.
  - A new top section, **"PORTFOLIO PLACEMENT"** card:
    - Title: "FY26–27 Distribution Capital · Northern Region"
    - Text: "Matched on asset class (distribution feeders), region, and its fit to the Reliability and Safety objectives."
    - Text: "Carries in the Targeted Hardening v1 alternative."
    - A divider, then the "Change portfolio" button (outlined) on the right.
  - Then the constraints table (4 rows) and the scenarios.
  - This is the only frame with the Portfolio placement card that the notes card asks for.

### 3.5 Row "System confidence"
- **`103:67662` — Collapsed:**
  - The right panel collapses to a narrow rail (x~1356–1440): a Cooper icon and a "←|" expand icon.
  - The main column widens: table columns spread, and scenario card descriptions become one line.
  - The page is scrolled (section title partly under the header).
- **`103:63817` — Expanded:** the normal panel. Connectors show that the rail icon toggles it.

### 3.6 Row "Evidence"
- **`103:64076` — Hover:** visually identical to the base. The connector points at the System confidence panel or Outlier card; no hover style is visible.
- **`103:64331` — Opened:** the System confidence panel switches to a drill-in view:
  - "← Back", title "Evidence chain".
  - A confidence bar: "87%" above an orange segment with a ▼ marker. The scale has a red dashed left part and a green dashed right part, labelled "<70% REJECT", "87% REVIEW", ">90% APPROVE".
  - 3 evidence cards, each with an outlined source chip and a body:
    1. "OMS · high": "4 sustained outages across the 7 feeders in 90 days, vs ~1/quarter baseline — a clear trend break."
    2. "Asset register + inspection · med-high": "Avg age 47 yrs, 5 of 7 past service life; condition trending down 3 cycles straight."
    3. "Copperleaf risk engine · high": "PoF up ~2.4× over 24 months; ~9,400 customers served incl. 2 critical-care facilities, limited backfeed on 3 feeders. Reliability risk is the dominant, rising driver → #1 in Greater Hartford."
  - The panel header loses the Cooper icon (only "|→").

### 3.7 Row "Hovers"
- **`103:67923` — Hover on Cooper recommended setup card:**
  - The Recommended plan card's warm glow intensifies to a peach/orange gradient across the card.
  - A trash icon appears and the cursor is on the card.
  - Subtitle "Optmized spend, best outcome".
- **`103:68193` — Hover on other setup cards:**
  - The "Defer a lower-value item" card gets a lighter grey background and a trash icon left of its checkbox.

### 3.8 Row "Constraints": edit a value cell
- **`103:68463` — Hover on table cell:**
  - The "Not set" cell (Resource capacity › Value change) gets a lighter rounded box.
  - A **pencil (edit) icon** appears at its right; the cursor is on it.
- **`103:69249` — Editing 1:**
  - The cell becomes a **text input** (DS TextField, focused border) with a caret.
  - Placeholder/suffix "/hr per year" and a **revert "↩" icon** at the right.
- **`103:68731` — Editing 2:** the value typed is "12.000" followed by the grey suffix "/hr per year".
- **`103:68990` — Edited (saved):** the cell reads **"12.000 hr per year"** as plain text.
  - Scenario values are **unchanged** ($4.2M / $5.9M / $3.1M).
  - System confidence cards are unchanged; they still say crew hours ceiling is undefined.
- Dev note `103:69830`:
  - "On click of the arrow (revert) icon, the field should revert to the previously saved value."
  - "Clicking away from the field saves entry."
- "12.000" uses a European thousands separator; elsewhere the numbers use "," (e.g. "1,417").

### 3.9 Row "Add a new constraint" (3-row table: Safety risk tolerance absent)
1. **`103:65039` — Hover on add:** the "+ Add" button shows a hover fill; the cursor is on it.
2. **`103:65300` — Input:**
   - A full-width Cooper prompt row replaces "+ Add" inside the table: Cooper dots icon, then the placeholder "Describe the constraint in your own words", and a mic icon.
   - Natural-language input; no form fields.
3. **`103:65564` — Filled:**
   - Text "don't schedule crew work on more than one Northgate feeder at once".
   - A mic icon and a round white **send "↑"** button appear.
4. **`103:65829` — Analyzing:** the row collapses to a dimmed "Cooper is analysing..." (with the Cooper icon).
5. **`103:66884` — Loading state:**
   - A new 4th row appears as **skeleton bars**, with an orange outline.
   - "+ Add" returns below it.
   - All 3 scenario cards become **skeletons**.
6. **`103:70083` — Metrics recalculated:**
   - The new row: "Concurrent outage limit" · COOPER SET · "Max feeders offline" · "≤ 1", with an orange outline. Dev note `103:70349`: "Outline fades after 5 seconds."
   - Scenario cards are recalculated:

| Card | Before | After |
|---|---|---|
| Recommended plan | "$4.2M" / "within approved cap" | **"$4.4M"** / "within approved cap" |
| Defer a lower-value item | "$5.9M" / "+40% vs. cap" | **"$6.2M"** / **"+32% vs. cap"** |
| Relax the budget | "$3.1M" / "−26% vs. cap" | **"$3.4M"** / **"−18% vs. cap"** |

   - Descriptions are unchanged. System confidence is unchanged.

### 3.10 Row "Hover row": delete a constraint
1. **`103:66093` — Hover row:**
   - The Safety risk tolerance row gets a lighter background.
   - A **trash icon** appears at the far right of the row; the cursor is in the row.
   - This frame uses the `base-bottom-sheet-organism` bottom bar.
2. **`103:66376` — Delete row:** the same view; the click target is the trash icon (connector from it).
3. **`103:66635` — Loading state due to recalculation:**
   - The row is removed and the table has 3 rows; there is an extra blank gap above the section title.
   - The scenario cards are skeletons.
   - No confirmation dialog and no undo toast are shown.
4. **`103:69831` — Metrics recalculated:**

| Card | Before | After |
|---|---|---|
| Recommended plan | $4.2M | **"$3.8M"** / "within approved cap" |
| Defer a lower-value item | $5.9M / +40% | **"$4.9M"** / **"+30% vs. cap"** |
| Relax the budget | $3.1M / −26% | **"$2.8M"** / **"−20% vs. cap"** |

   - No outline on the cards.

### 3.11 Interaction map (Source B)

| Trigger | Result |
|---|---|
| Scroll main column | Page up ↔ Page down (the constraints table shows 3 vs 4 rows; the frames are inconsistent) |
| Hover scenario card | Trash icon appears; Recommended card glow intensifies; other cards lighten |
| Tick a scenario checkbox (implied) | "Optmise" enables. Click → Scenario Modeling / Compare (box 9) |
| Left rail "\|→" | Plan sidebar opens (My plans / All plans / Live plans) |
| System confidence "\|→" / "←\|" | Panel collapses to a rail and expands again |
| Outlier / Inconsistency card "▸" | Card expands (extra paragraph) |
| Evidence (trigger unclear) | Panel drills into "Evidence chain" with "← Back" |
| Hover value cell → pencil | Inline TextField with unit suffix and revert. Blur saves; revert restores the previous value. No recalculation shown |
| "+ Add" → NL prompt → send | "Cooper is analysing..." → skeleton row + skeleton cards → new Cooper-set row (outlined 5 s) + new card values |
| Hover row → trash | Row removed → skeleton cards → new card values |

---

## 4. Ambiguities and inconsistencies

1. **Two competing designs** (§0): scenario naming, step list ("Setup·Compare·Approve" vs "Setup·Compare·Review·Approve·Execution") and the primary button ("Optimize" / "Optmise" / "Compare") all differ.
2. **Source A tab count:** Default and Summary show "Scenarios 5"; Expanded shows "Scenarios 3", while still listing 5 cards.
3. **Source A Restrictions:** "Interpolation: Off" vs the Interpolate switch ON; "Planning groups enabled 1/3" vs all 3 group checkboxes ticked. Cooper's text also contradicts itself on 1,417 vs 1,492.
4. **Source A Constraints:**
   - "Cost 3" but 5 mixed rows.
   - "$425B" CAPEX vs Cooper's "$12.0M" FY27 cap; the "$12–15M envelope" vs the "$37.8M" budget.
   - Every investment code is "INV-2026-0910", and two investment names are duplicated.
   - The "Mid +5" picker label has no "%".
5. **Summary navigation:** there is no control between steps 2–5 (only "← Back"). Auto-advance on narration, or clicking the outlined section, is unspecified.
6. **Source B row count:** the base table has 4 rows (some frames only 3). The "Add" flow starts from 3 rows (Safety risk tolerance missing), so the "after add" table never shows Safety + Concurrent together.
7. **Recalc logic is not derivable:**
   - Adding a *tighter* limit (≤1 feeder offline) raises all three costs. Deleting the safety cap lowers them.
   - "Recommended plan $4.4M within approved cap" contradicts the "≤ $4.2M" CAPEX ceiling.
   - "Defer a lower-value item … Lower spend" shows $5.9M (+40%), *more* than the recommended plan. "Relax the budget … More spend" shows $3.1M (−26%), less. The subtitles and values are inverted.
   - The "vs. cap" captions have no consistent base:
     - Before any change they match a $4.2M cap: 5.9/4.2 = +40% ✓ and 3.1/4.2 = −26% ✓.
     - After the add: 6.2/4.2 = +48% (shown "+32%"), and 3.4/4.2 = −19% (shown "−18%").
     - After the delete: 4.9/3.8 = +29% (shown "+30%", so measured against the new recommended value), but 2.8/3.8 = −26% (shown "−20%").
     - The prototype needs a defined rule; mark it `[Assumed]`.
   - Editing the Resource capacity cell does **not** recalculate the cards or clear the System confidence warnings. Should it?
8. **System confidence never updates** after constraint edits, adds or deletes; it says "2 outliers" but lists 1 in the collapsed state.
9. **"Baseline" chip vs "Optmized spend, best outcome" subtitle** on the Recommended plan card alternate between frames. "Relax the budget" subtitle is blank in some frames.
10. **Typos in the source:** "Optmise" and "Optmized". "12.000" uses a European separator.
11. **Move to Compare:** the button is enabled but no checkbox is shown ticked. Which card or cards must be selected (one or multiple) is unspecified.
12. **Evidence hover:** no visible hover style; the trigger for the "Evidence chain" drill-in is unclear (Outlier card? Cooper icon?).
13. **Delete:** no confirmation and no undo. Whether "COOPER SET" rows can be deleted without warning is a product decision.
14. **Notes card asks for** colour-matched setups, a "needs you" status for gaps, and Cooper's pick flagged. The frames show a warm glow on the pick but no colour coding per setup. Gaps show as "Not set" with status "COOPER SET", not "needs you".
