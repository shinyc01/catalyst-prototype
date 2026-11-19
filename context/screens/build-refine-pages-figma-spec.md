# Spec: Build › Refine pages as Figma draws them (audit 2026-11-19)

**Supersedes the page list in `build-refine-j08-j09-figma-spec.md`** (that file still holds the J08/J09 interactions). Built from this audit: Details tabs, Overview comparison cards, Alternative comparison groups and chart view, Cost & Schedule scales and sub-stages, Activity drawer. Sample copy (names, company) replaced with [placeholders]: the repo is public.


Factual record of what Figma draws. All frames 1440 wide. Screenshots were taken during the audit (not stored in the repo).
Sample record used in every frame: **Southern Feeder Replacement — Circuit 14B**, header code `INV-2025-0842`, detail code `INV-2026-0418`.

## 0. Where Refine lives in the file

Figma pages (the "3️⃣ Investment — Refine" page `43:215233` is an empty divider; content is in the sub-pages below it):

| Figma page | id | Sections (frame count) |
|---|---|---|
| ↪ Investment Overview | 43:215234 | Widgets modal (11), Widget actions: Resize/Change position/Remove/Share (16), Asset map actions (2), Generate widget (11, 1440x970), Edit widget (11), Evidence (2), Collaboration (1), GIS (2 tall: 1720 / 1680), Sidebar (4, 1440x970) |
| ↪ Investment Details | 43:293693 | System confidence (7 "Automated checks"), Sidebar (2), Evidence chain (2), Collaboration (1), Edit (5 "Edit cell"), **Tabs (General 2048 tall, Forecast & Execution, Relationships 1392 tall)**, Cooper links investments to groups (6) |
| ↪ Compare Alternatives | 48:25090 | Alternative card actions (change recommended / change order), Comparison chart, Add new alternative (button: 28 frames; with sidebar: 22), Edit alternative (5), Collaboration, Alternatives quantity (min / medium / max), Cooper's evaluation, Sidebar (4), Select alternatives to plan — "Option 2 — Separate comparison from Plan selection" (7) |
| ↪ Value | 48:144864 | Figma section is named **"Alternative value"**: Value model page (formula, measure interactions, edit measure with Cooper, edit cell with Cooper, questionnaire answers, collaboration) and Selected value models (Cooper, value list, add value with button / with Cooper chat, delete value model) |
| ↪ Alternative Details | 53:199656 | Edit alternative (manual 3, with Cooper 11, with Cooper + redirect 5, Edit with Cooper button 2), Sidebar (4), **General (53:209948, 1440x1676)**, Collaboration |
| ↪ Alternatives Cost and Schedule | 53:229122 | **Table**: States/Cell (11), States/Row (13), States/Table (4), Single actions (Edit type, Adjust by %), Bulk actions (Adjust by %, Shift dates, Distribute, Set to), Copy & Paste, Edit with Cooper, Formula. **Gantt**: Page sidebar (3), Main view modes (2), Global settings (9), Action with stage (72), action with sub stage (4), action with timeline rows (41), Open details (8) |
| ↪ Attachments | 53:229123 | Attachments (10 frames: "Documents" modal opened from the Cooper's context bar) |
| ↪ Activity and Comments | 55:44683 | Comments: Open + States, Add my comment, Comment hover, Comment Focus (Action Required / Question / Info), Resolve, More button (Unresolved/Resolved), Mention, Comment actions; Activity (3) |

Node `58:31703` (given as "investment overview") is NOT under the Refine pages — it is an overview with sidebar collapsed and Approval readiness 100% (all checks Passed), cursor on "Send for approval"; it is the ready-to-send state (saved as `inv-overview-ready-100.png`).

**No other Refine page types were found.** There is no alternative Overview, alternative Risk, alternative Milestones, or separate Evidence page; Evidence chain, Comments, Activity and Attachments are overlays/panels on existing pages, not SideNav pages.

---

## 1. Shared chrome (every Refine frame)

- **Top NavBar**: IFS Copperleaf logo · Command · Value · Explore · **Build** (active, filled) · Plan · Results · right: search, settings, bell (red dot), avatar "JP".
- **Investment header bar** (below NavBar): `‹` back · "Southern Feeder Replacem…" · `INV-2025-0842` · chevron-down (opens Activity menu) · status dot + **"Refining"** (Cost & Schedule table frames say "In progress"). Center stepper: ✓ Shape · ✓ Review · **Refine** (active, spinner icon, hatched underline) · Approve (dashed circle). (Comments frames label the last step "Decide".) Right: people chip "3/5" · comment icon button (red dot when unread) · divider · "Dismiss" (secondary) · "Send for approval" (primary white).
- **Left SideNav** (240 wide expanded; collapsed = 48 px rail with `|→` expand icon only). Header "INVESTMENT" + collapse icon `←|`.
- **Right panel "SYSTEM CONFIDENCE"** (380 wide; collapsed = 48 px rail with `←|` icon and red dot). See §1b.
- **Bottom bar**: "COOPER'S CONTEXT" label · "16 Documents" button (doc icon) · upload icon button · right: two Cooper suggestion chips (page-specific, listed per page) · Cooper orb avatar.

### 1a. SideNav tree (as drawn in most frames, e.g. 43:239704, 43:297556, 48:56129, 53:208518, 48:187260)
```
INVESTMENT                       ←|
  Overview
  Details
  Alternative comparison
  Value
ALTERNATIVES                     +
  Full Replacement  [Cooper ✦ icon]   ▲ (expanded)
    ↳ Details
    ↳ Cost & Schedule
  Targeted Hardening                  ▼
  Reactive Repair                     ▼
```
Active row = filled grey pill. Children are prefixed with "↳". The Cooper sparkle icon after "Full Replacement" marks the Cooper-recommended alternative.

**Variant in the Gantt "Page sidebar" frame 96:80718 (`alt-cost-sidebar.png`) — different tree:**
```
INVESTMENT                       ←|
  Overview
  Details
  Alternative comparison          (no "Value" row here)
ALTERNATIVES                     +
  Full Replacement ✦              ▼
  Targeted Hardening              ▼
  Reactive Repair                 ▼
  Selective Feeder Renewal        ▲ (expanded)
    ↳ Details
    ↳ Cost & Schedule   (active)
    ↳ Value
```
So Figma has two inconsistent trees: older frames put **Value** at investment level and give each alternative only Details + Cost & Schedule; the newest (Gantt) frame drops investment-level Value, adds a 4th alternative "Selective Feeder Renewal", and gives each alternative **Details / Cost & Schedule / Value**.

### 1b. System confidence panel (default content, Refine 35%)
- Header "SYSTEM CONFIDENCE" · Cooper icon button · collapse `|→`.
- Card: "Approval readiness" · ring · **35%**. Rows: ✓ "Investment readiness" — Passed · "Path forward" — ● 1 error · "Assumption consistency" — ● 1 error · "Review blockers" — ● 1/2 ● 1/3.
- Segmented tabs: "Open questions 2" (selected) | "Warnings 2".
- Pager row: "2 / 10 (10% resolved)" · "All errors" button (list icon) · ‹ › arrows.
- Question block (investment pages): title **"Urgency needs confirmation"**, body "The 12–18 month action window needs supporting evidence." · "SOLUTIONS": (1) Cooper-highlighted card "Ask field team to confirm urgency" / "Ask the Field Team Lead to confirm the 12–18 month action window." (2) "Adjust urgency to lower confidence" / "Keep the action window as an early estimate and mark urgency as provisional until more evidence is added." (3) "Use peer benchmark" / "Compare this action window against similar feeder investments to confirm urgency." + "Review details" button.
- Question block on alternative pages / value-model page: **"What contingency should be carried on this estimate?"** · "Consequence · Required" · SOLUTIONS: "10% — standard for replacement work" (Cooper-highlighted) · "5% — high confidence in scope" · "15% — supply-chain risk on long-lead units".
- Footer buttons: "Upload file" (upload icon) · "+ My answer".
- Other states: "System confidence expanded/collapsed" (43:240204 / 43:241195); "Automated checks" variant (55:84848): "Automated checks · 2/4 passed ▾", tabs Errors / Warnings / Notes, "2 / 10 (10% resolved)", "Questionnaire is incomplete" / "2 questions need your input" / "Take me there". Ready state (58:31703): 100%, all four rows Passed, list "1 WDRM v4 concentration above cap ✓", "3 Affordability under intended target ✓".

---

## 2. Investment-level pages

### 2.1 Overview — `inv-overview.png` (43:239704, 1440x970, SideNav expanded, Overview active, System confidence open)
Also: `inv-overview-gis-tall.png` (43:238766, 1440x1720, full scroll, SideNav collapsed), `inv-overview-collapsed.png` (53:230307, both sidebars collapsed), `inv-overview-ready-100.png` (58:31703).
- Title **"Investment overview"**; description "High-level investment summary, key metrics, and current progress". Right: "Widgets" button (chart icon).
- Stat cards (4): "Benefit-cost ratio" **2.5x** "BENEFIT RETURNED PER $1 SPENT" · "Estimated cost" **$4.2M** "EXPECTED DELIVERY COST" · "Investment value" **$23k** "TOTAL EXPECTED VALUE" · "Baseline risk" **$12.6M** "RISK BEFORE INTERVENTION".
- Row 1: **INVESTMENT DETAILS** widget (Cooper icon top-right): Name "Southern Feeder Replacement — Circuit 14B" · Code "INV-2026-0418" · Type "Capital Replacement" · Planning portfolio "FY26–27 Distribution Capital · Northern Region" · divider · "Problem statement" "7 aging feeders serving Ridgeview Village and ~9,400 customers — reliability risk rising, flagged before failure, with an investment idea already drafted." | **AFFECTED ASSETS & AREA** widget: 3D dark map, Ridgeview Village, Recloser R-1, Demeter SS, numbered poles 1–7 on red route, "88%" badge, map icon button top-right.
- Row 2: **YEARLY FORECAST** bar chart (purple bars FY25–FY29, axis $0–$2.5M) | **INVESTMENT VALUE** diverging bar chart: rows Electrical Distribution Reliability (red, negative), Electrical Delivery Capacity (red), Compliance Risk, Financial Benefits-OPEX, Project Execution Risk (green), Total Investment Cost (outlined green); axis -30k -10k 0 10k 30k.
- Row 3 (full width, tall frame only): **COMPARE TO OTHER INVESTMENTS** | "PORTFOLIO LEVEL ▾" dropdown. Stats: Rate "#4 of 35 investments" · Percentile "75th" · Standing "Top quartile" · Alternative "Targeted Hardening". Inner card **INVESTMENT POSITION** with toggle "Value vs Cost" / "Efficiency": scatter, y "Forecast value" 0–12, x "Forecast cost ($M)" 0–30, "Median cost" vertical line, "Median value" horizontal line, highlighted point.
- Row 4: **WHY THIS INVESTMENT MATTERS** paragraph ("This investment addresses the highest-risk aging feeders, protecting ~9,400 customers from potential outages. By acting within the recommended FY27–FY29 window, it reduces financial exposure by $18.1M, …") | **SIMILAR INVESTMENTS BY BCR** list: Riverside Recloser Upgrade 2.46 BCR · Zone 3 Cable Renewal 2.44 BCR · Oakdale Switchgear 2.41 BCR · Southern Feeder Replacement — Circuit 14B (highlighted, current) · North Loop Reconnector 2.39 BCR.
- Bottom chips: "Generate Annualized outcome risk by risk type chart" · "Compare to best practice".
- Overview-specific interactions in Figma: Widgets drawer (add / drag / search widgets), widget resize / move / remove / share, Generate widget (with Cooper), Edit widget, Asset map actions.

### 2.2 Details — tabs General / Cost & Schedule / Relationships
Title **"Investment details"**; description "Core investment details, context, and current status". Underline tabs: **General · Cost & Schedule · Relationships**. SideNav Details active; System confidence open. Bottom chips: "Explain gaps in confidence" · "Draft value assessment". (Figma section calls the 2nd tab frame "Forecast & Execution"; the tab label drawn is "Cost & Schedule".)

**General** — `inv-details-general.png` (43:301879, 1440x2048). Collapsible cards (▲ title, Cooper icon right):
1. **IDENTITY & CLASSIFICATION** (header also has "Edit with Cooper" button): Name "Southern Feeder Replacement — Circuit 14B" · Description "Replace aging equipment on Circuit 14B to reduce reliability risk, improve feeder performance, and support long-term service continuity in the Southern area." · Owner (avatar EW) "[owner]" | Creator  "[creator]" · Created date "02 Jul 2026" | Stage "● REFINING" · Code "INV-2026-0418" (copy icon) | Type "Capital Replacement" · Group "Parent group" | Planning portfolio "FY26–27 Distribution Capital · Northern Region" · Maintenance category "Distribution" | Primary location type "Suburban" · Must do "Yes" (green chip) | Disposition "Recommended" · Alternatives created "3" (count chip). Annotation: "Button is visible on hover" (edit pen next to Code).
2. **OWNERSHIP & ORGANISATION**: Division "Transmission & Distribution" | Facility "Northgate Substation" · Company "[company]" | Funding org "[utility] — Distribution Capital" · Operating unit "Grid North".
3. **DATES**: Required by "30 Sep 2027" | Start date "15 Apr 2027" · Earliest start "01 Mar 2027" | Latest start "01 Jun 2027" · End of investment "28 Feb 2028" | Pause date "—" · Resume date "—".
4. **RESTRICTIONS** (toggles, on): "Lock forecast and value assessment" / "Prevents edits to the forecast and value assessment while under review." · "Must-do with recommended alternative" / "Bypasses optimization — always funded, using the recommended alternative."

**Cost & Schedule** — `inv-details-forecast.png` (43:302377, 1440x908). One card **COST & SCHEDULE**: Last month of actuals "May 2026" | Percent complete (progress bar) "0%" · Forecast has adjustments "Yes" (chip) | Calendarization curve "Linear" · Interpolation "Off".

**Relationships** — `inv-details-relationships.png` (43:302585, 1440x1392).
1. **DEPENDENCIES**: Cooper search input "Ask anything about investments" (mic). Table columns (each with filter icon): INVESTMENT · DEPENDENCY TYPE · PROGRESS · COST · VALUE. Rows: "Southern Feeder Replacement —…" INV-2026-SFR-12A · Value · 68% · $4.2M · $8.7M; …-13C · Timing and milestone · 42% · $3.9M · $7.5M; …-15D · Program · 11% · $2.0M · $6.1M; …-16A · Program · 89% · $5.7M · $12.0M.
2. **ASSETS IMPACTED**: columns ASSET · SEGMENT · STATUS · RISK SCORE. Pole 1 / Pole 4 CRITICAL ▲62% · Pole 2 / Pole 7 MODERATE ▲48% · Pole 3 / 5 / 6 HEALTHY ▲12%; segment "Demeter SS → Recloser R-1".
3. **RISKS IMPACTED**: columns RISK · STATUS · RISK SCORE. "Loss of supply" CRITICAL ▲62% · "Regulatory breach" MODERATE ▲48%.
- Related flows in Figma: "Cooper links investments to groups" (43:302985 …), "Link child with parent".

**Evidence chain overlay** — `inv-details-evidence.png` (43:299004). Floating panel over the right side (System confidence collapsed): "EVIDENCE CHAIN" ×; score bar **87%** with zones "<70% REJECT · 87% REVIEW · >90% APPROVE"; tabs "Rationale" | "Peer benchmark"; "WHY IT'S FLAGGED": chips + text — "OMS · high" ("4 sustained outages across the 7 feeders in 90 days, vs ~1/quarter baseline — a clear trend break."), "Asset register + inspection · med-high" ("Avg age 47 yrs, 5 of 7 past service life; condition trending down 3 cycles straight."), "Copperleaf risk engine · high" ("PoF up ~2.4× over 24 months; ~9,400 customers served incl. 2 critical-care facilities, …"); "DECISIONS": "Southern Feeder Replacement — Circuit 14B" ("Proceed with a proactive feeder replacement investment instead of waiting for asset failure." + link "Reduced reliability exposure"), "Reliability Risk Review — FY27 Capital Planning" … Opened from the Cooper icon on a card header.

### 2.3 Alternative comparison — `inv-compare.png` (48:56129, 1440x1448, SideNav expanded)
Also: `inv-compare-chart.png` (48:29450, 1440x1405, chart view), `inv-compare-cooper-eval.png` (48:55438), `inv-compare-add-alt-sidebar.png` (48:44002).
- Title **"Alternative comparison"** + view toggle (list icon | radar icon); description "Investment alternatives evaluated against risk and return criteria". Right: "3 selected ▾" dropdown · "New" (pen icon) · "Cooper's evaluation" (Cooper-gradient button).
- Alternative header cards (3 columns; recommended one outlined): **Full Replacement** "$4.2M ~ 3 – 5 years" · chip "All 7 feeders" · "9,400 customers protected" · inner "Risk reduced 76% of reliability scored" · disabled "✓ Recommended". **Targeted Hardening** "$2.6M ~ 8 months" · "5 of 7 high-risk feeders" · "Reconductor worst segments only" · 43% · "Set as recommended". **Reactive Repair** "$0.6M ~ 2–3 weeks" · "Feeder 4 only" · "4,100 customers protected" (chart frame: "Restore the failed conductor") · 12% · "Set as recommended".
- Table view: collapsible groups with count chips:
  - FINANCIAL (6): CAPEX $22.5M / $22.5M / $10M · ROI +18.2% / +22.4% / +8.1% · Payback period 36 mo / 28 mo / 48 mo · NPV $4.2M / $5.8M / $1.4M · IRR 10.9% / 11.4% / 11.2% · OPEX Impact -210K/yr / -245K/yr / -95K/yr.
  - RELIABILITY (5): Risk Level MEDIUM / LOW / HIGH · Failure Reduction 85% / 92% / 38% · Reliability +18.2% / +22.4% / +22.4% · Safety HIGH POSITIVE / HIGH POSITIVE / MEDIUM POSITIVE · Regulatory Minimal ×3.
  - DELIVERY (4): Duration 36 mo / 24 mo / 9 mo · Outage 72 h ×3 · Schedule Risk MEDIUM / LOW / MEDIUM · Vendor Single source ×3.
  - PORTFOLIO FIT (4): Capital Year FY2027 ×3 · Budget Fit 88% / 95% / 98% · Priority P1 ×3 · Ranking HIGH / HIGH / MEDIUM.
- Chart view (48:29450): same header cards, then **COMPARISON HUB** with tabs Financial | Reliability | Delivery; radar with axes CAPEX, ROI, Payback, NPV, IRR, OPEX impact; legend Full Replacement / Targeted Hardening / Reactive Repair. Then **TRADE-OFFS**: three bar groups — "Capital cost" (▼ Lower is better) $4.2M / $2.6M / $0.6M · "Risk reduction" (▲ Higher is better) 76% / 43% / 12% · "10-yr risk-adjusted value" (▲ Higher is better) $11.8M / $6.4M / $1.1M.
- Cooper's evaluation panel (floating, right): "COOPER'S EVALUATION" ×; highlighted "Favors Full replacement" ("Full replacement recommended. Cost agent favors targeted hardening for its lower spend, but risk agent found it leaves the recurring failure mode on poles 2 and 7 unresolved." / "Would change if: pole 2/7 degradation trend flattens, or budget cap forces a scope cut."); "Risk — FAVORS FULL REPLACEMENT" (…); "Cost — FAVORS TARGETED HARDENING" (…).
- Bottom chips: "Explain gaps in confidence" · "Why this alternative?".
- Other Figma flows here: change recommended alternative, change order, alternatives quantity (min / medium / max columns), add new alternative (with button: 28 frames; with sidebar), edit alternative, "Select alternatives to plan — Option 2".

### 2.4 Value — `inv-value-list.png` (48:187260, SideNav expanded, **Value active under INVESTMENT**, System confidence collapsed)
Also 48:186054 (both sidebars collapsed).
- Title **"Value"**; description "Shows the investment value model baseline and the value models assigned to this investment."
- Stat cards (4): "Total avg value created, $/yr" **$2.05M** · "Avg risk reduction" **76%** · "Benefit-cost ratio" **2.5x** · "Evaluation horizon" **FY27–FY30**.
- Card **SELECTED MODELS** (Cooper icon): columns VALUE MODEL (filter) · STATUS (filter) · MEASURES (sort+filter) · OUTPUT (filter) · RISK REDUCTION (sort+filter). Rows: Simple financial risk · ● NEEDS INPUT 0/2 · 3 · "Expected financial risk" +2 · 74-78% | Safety risk · READY · 2 · "Public & crew safety exposure" +1 · 56-60% | Reliability benefit · READY · 12 · "SAIDI / SAIFI improvement" +11 · 88-92% | Environmental risk · READY · 4 · "Spill habitat / exposure" +3 · 96-100% | Community impact · READY · 6 · "Community impact score" +6 · 67-71% | Customer experience · READY · 2 · "Complaint & CEMI trend" +1 · 69-73%. (48:186054 shows "Expected financial risk" "Avoided failure cost" +1.)
- Bottom chips: "Explain these value models" · "Explain the baseline value".

**Value model detail** — `inv-value-model.png` (48:146324), `inv-value-model-tall.png` (48:184533, 1440x1146, Cooper popover), `inv-value-model-questionnaire.png` (48:181786).
- Back chevron + title **"Simple financial risk"** + ƒx icon; description "Financial risk measures the expected annual cost of sustained cluster outages if the assets are left in service. It combines the priced consequence of an outage with the probability of failure derived from asset condition."
- Tabs: "Value measures" | "Questionnaire answers 2".
- Value measures: collapsible **EXPECTED FINANCIAL RISK, $/YR** (header "Edit with Cooper" on hover). Formula line: ƒx "Change Baseline - Outcome where Outcome is Risk Likelihood * Risk Consequence" (tokens as chips). Table RANK · VALUE (filter) · FY26 … FY31 · Σ: Baseline "Shared reference" $310k $368k $442k $545k $601k $688k $2,90M; 1 "Full Replacement · Alt 1" "Change · avoided risk" 0 ▲$26k ▲$384k ▲$484k ▲$537k ▲$620k ▲$2,00M; 2 "Targeted Hardening · Alt 2" 0 ▲$13 ▲$192k ▲$242k ▲$268k ▲$310k ▲$1,02M; 3 "Reactive Repair · Alt 3" 0 ▲$10 ▲$177k ▲$215k ▲$226k ▲$267k ▲$0,69M. Then **OUTAGE** line chart ($0–$1M, FY26–FY31) with legend Baseline / Full Replacement / Targeted Hardening / Reactive Repair. Collapsed cards below: **SAFETY RISK**, **LOST GENERATION**, **O&M SAVINGS**.
- Cooper popover (tall frame): "COOPER · Speaking ▮▮ · Ask"; "← Back"; "Simple Financial Risk" + explanation; "IMPACT": "VALUE OVER HORIZON $2.6M-$3.7M", "RISK REDUCTION 56% ▲8 %".
- Questionnaire answers tab: columns QUESTION · VALUE MODEL · ANSWER. Group "Need input" (2): "Is regulatory penalty exposure triggered if this cluster fails?" (Consequence · Required) · Simple financial risk +1 · "$410k — if the outage falls outside a major-event exclusion"; "What contingency should be carried on this estimate?" (Likelihood · Required) · Simple financial risk · "5% — high confidence in scope". Group "Ready" (5): unserved energy rate → Customer experience "$28.40/kWh — commercial and industrial weighted for this feeder mix"; "How was the condition score of 4.2 established?" → Reliability benefit "Field inspection within the last 24 months"; "Do all 10 feeders fail as one cluster, or independently?" → Customer experience "All 10 share the tie — one failure takes the cluster"; "How long would a sustained cluster outage actually last?" → Simple financial risk "18 h — cluster class standard"; "What does restoring the cluster after a failure cost?" → Reliability benefit "$940k — planned-crew rate only". Each row has a Cooper status icon at right.
- Bottom chips (model page): "Explain the value impact" · "What is driving this model?".
- NOTE: the value model shows all three alternatives side by side (it is not per-alternative), even though the Figma section is named "Alternative value".

---

## 3. Alternative-level pages

### 3.1 Alternative › Details — `alt-details.png` (53:209948, 1440x1684 full) and `alt-details-sidebar-expanded.png` (53:208518)
SideNav: Full Replacement expanded, **↳ Details active**. System confidence open with the contingency question. Bottom chips: "Explain gaps in confidence" · "Why this alternative?".
- Title **"Alternative details"**; description "Alternative details, scope, cost, risk reduction, and expected value". (Edit flow frame 48:44002 also shows a disabled "✓ Recommended" button top-right of the title row.)
- Stat cards (4): "Rank" **#1** + Cooper chip "Recommended" · "Risk reduced" **76%** "of reliability scored" · "Customers protected" **9,4k** · "Scope" **All 7 feeders**.
- Cards:
  1. **IDENTITY & CLASSIFICATION** ("Edit with Cooper" on hover): Name "Full Replacement" · Description "Replaces all end-of-life units across the 7 feeders. Balances cost, supply chain capacity and risk reduction. Clears the Ridgeview hazard and the recurring failure mode." · Code "ALT-2026-0418" (copy) | Type "Full Replacement" · Creator  "Cooper" | Created date "02 Jul 2026".
  2. **DATES**: End of alternative "28 Feb 2028" | Pause date "—" · Resume date "—".
  3. **RESTRICTIONS** (toggles on): "Allow alternative to be chosen as recommended" / "Allows this alternative to be selected as the recommended option for the investment." · "Allow alternative to be shifted" / "Allows this alternative to be moved to a different year or planning period."
  4. **SCOPE**: Cooper input "Ask anything about assets" (mic); table ASSET · SEGMENT · STATUS · RISK SCORE (Poles 1,4 CRITICAL 62%; 2,7 MODERATE 48%; 3,5,6 HEALTHY 12%; "Demeter SS → Recloser R-1"). Annotation: "For large lists, the table will use infinite scroll to load more items as the user scrolls."
- Other frames: Edit alternative manually / with Cooper (with redirect to another page), "Edit with Cooper" button, collaboration.

### 3.2 Alternative › Cost & Schedule — Gantt (default) and Table
Title **"Alternative cost & schedule"**; description "Alternative details, scope, cost, risk reduction, and expected value" (same text as Details). Right: segmented "Gantt" | "Table". Bottom chips: "Increase budget by 15%" · "Create new phase".

**Gantt** — `alt-cost-gantt.png` (96:82370, sidebars collapsed), `alt-cost-sidebar.png` (96:80718, SideNav expanded with the 4-alternative tree, **Selective Feeder Renewal ↳ Cost & Schedule active**, System confidence open), `alt-cost-gantt-row-hover.png` (96:166224).
- Toolbar: "VIEW ▾" · right: Year | Quarter | Month (Month selected) · (some frames) settings icon.
- Left column "STAGE" + timeline header "2027" Apr…Dec / "2028" Jan…Jun.
- Stage rows (▼/▶ expander, colour square, name, "Internal" chip, red error dot where flagged, date range, cost): **Design** Internal (error) "Apr 15, 2027 – Jun 30, 2027" $2.25M (expanded) → sub-stages "Field survey & assessment" Apr 15 – Apr 30, 2027 $240K · "Detailed engineering" (error) May 1 – Jun 8, 2027 $620K · "Permitting & ROW" May 12 – Jun 22, 2027 $310K · "Long-lead procurement" Jun 1 – Jun 30, 2027 $1.08M; **Civil & foundations** Internal (error) Jul 1 – Sep 30, 2027 $3.4M; **Feeder replacement** Internal Aug 15 – Dec 15, 2027 $7.9M; **Commissioning & closeout** Internal Dec 10, 2027 – May 28, 2028 $1.15M.
- Bars per month with cost labels under each segment, diamond milestones, hatched gap segments with error dot.
- Footer "TOTAL COST" $14.7M; per month: $240K ∑$240K · $618K ∑$858K · $1.39M ∑$2.25M · $1.35M ∑$3.6M · $3.14M ∑$6.74M · $1.93M ∑$8.67M · $1.99M ∑$10.6M · $1.93M ∑$12.59M · $1.11M ∑$13.7M · $208K ∑$13.91M · $446K ∑$14.35M · $100K ∑$14.45M · $100K ∑$14.55M · $150K ∑$14.7M.
- Row hover: drag handle ⠿, "+" and "⋮" appear on the stage row.
- Figma also specifies Gantt global settings, actions on stage / sub-stage / timeline rows, and "Open details" states.

**Table** — `alt-cost-table.png` (76:8795 "Default"), `alt-cost-table-row-expand.png` (76:17540).
- Toolbar: "COLUMNS ▾" · "VIEW ▾" · right Year | Quarter | Month · settings icon. Formula bar row "ƒx".
- Spreadsheet: lettered columns A–J, numbered rows. Headers: STAGE · TOTAL COST · DAYS · TYPE · START DATE · END DATE · then "2027" Apr / May / Jun / Jul…
- Rows: 1 ▶ Design $2.25M 43 Internal 15.04.2027 30.06.2027 $240K $618K $1.39M - · 2 ▶ Civil & foundations $3.4M 1 Internal 01.07.2027 30.09.2027 · 3 ▶ Feeder replacement $7.9M 1 Internal 15.08.2027 30.12.2027 · 4 ▶ Commissioning & closeout $1.15M 1 Internal 10.12.2027 26.05.2028. Expanded Design shows sub-rows Field survey & assessment $240K 15 · Detailed engineering $620K 7 · Permitting & ROW $310K 10 · Long-lead procurement $1.08M 30 (type "-").
- Footer TOTAL COST $14.7M; monthly $240K ∑$240K · $618K ∑$8.67M · $1.39M $2.25M · $1.93M ∑$12.59M (as drawn).
- Monospace numerals in the table. Figma specifies cell states (hover can-edit / read-only / blocked-derived, focus, editing, recalculating, single/bulk select, drag reorder), row expand/hover, single actions (edit, adjust by %), bulk actions (adjust by %, shift dates, distribute, set to), copy & paste, edit with Cooper, formula.
- Header status reads "In progress" in table frames (vs "Refining" elsewhere).

### 3.3 Alternative › Value
Only appears as a SideNav child ("↳ Value") in the Gantt sidebar frame 96:80718. **No dedicated per-alternative Value page frame exists**; the only Value content is the investment-level Value page / value model pages (§2.4), which compare all alternatives together.

---

## 4. Overlays & panels (not SideNav pages)

- **Comments** — `inv-comments.png` (55:46585): right drawer "COMMENTS" ×; tabs Unresolved | Resolved; input "Ask anything about comments" (mic); comment card: avatar MC, "Action required" chip, blue unread dot, "#56 · Investment details", "[reviewer] 30 min ago", body "The problem statement mentions 7 aging feeders, but the asset map only highlights Circuit 14B. Can we confirm whether this investment covers all feeders…". Opened by the comment icon in the header bar. Many further states (focus by type Action Required / Question / Info, resolve, mention, more menu).
- **Activity** — `inv-activity.png` (55:84848: header chevron menu with "Activity" item), `inv-activity-open.png` (55:85304): right drawer "Activity" ×, input "Ask anything about version history", timeline: "Version 4 Current" "Published this version and set it as the active investment record." [editor] 3:42 PM · May 12; "Version 2" "Updated the preferred alternative to Full Replacement and confirmed all 7 feeders are included in scope." [editor] 11:15 AM · May 6; "Version 2" "Added Targeted Hardening as a faster delivery alternative for the current reliability risk window." [editor]; "Version 1" "Initial draft of Southern Feeder Replacement — Circuit 14B." Cooper 11:15 AM · May 6.
- **Attachments** — `inv-attachments-modal.png` (53:230808): popover from "16 Documents" in the bottom bar: "DOCUMENTS 16" ×, "Search for…", list rows (file icon, name, date, download icon on hover): 2025 Board Planning Present.pdf JAN 15, 2025 · Quarterly Marketing Review.docx DEC 20, 2024 · Product Roadmap Update.pptx NOV 5, 2024 · Customer Feedback Summary.xlsx OCT 18, 2024 · Annual Financial Report.pdf SEP 30, 2024 · New Hire Orientation Guide.doc JUN 5, 2024 … Annotation: "Clicking on the card opens the document view. Clicking on the 'download' icon downloads the file."
- **Evidence chain** — see §2.2 (also on Overview 43:237538/43:237876 and Value model 48:182063).
- **Cooper's evaluation** — see §2.3.

## 5. PNG index
| File | Node | Page |
|---|---|---|
| inv-overview.png | 43:239704 | Overview (SideNav expanded) |
| inv-overview-gis-tall.png | 43:238766 | Overview full height (1720) |
| inv-overview-collapsed.png | 53:230307 | Overview, both rails collapsed |
| inv-overview-ready-100.png | 58:31703 | Overview, 100% ready (not on Refine pages) |
| inv-details-general.png | 43:301879 | Details › General (2048) |
| inv-details-forecast.png | 43:302377 | Details › Cost & Schedule |
| inv-details-relationships.png | 43:302585 | Details › Relationships (1392) |
| inv-details-evidence.png | 43:299004 | Details + Evidence chain overlay |
| inv-compare.png | 48:56129 | Alternative comparison, table (1448) |
| inv-compare-chart.png | 48:29450 | Alternative comparison, chart (1405) |
| inv-compare-cooper-eval.png | 48:55438 | Cooper's evaluation panel |
| inv-compare-add-alt-sidebar.png | 48:44002 | Alt details w/ Recommended button (add-alt flow) |
| inv-value-list.png | 48:187260 | Value (SideNav expanded) |
| inv-value-model.png | 48:146324 | Value model › Value measures |
| inv-value-model-tall.png | 48:184533 | Value model full + Cooper popover (1146) |
| inv-value-model-questionnaire.png | 48:181786 | Value model › Questionnaire answers |
| alt-details.png | 53:209948 | Alternative › Details full (1684) |
| alt-details-sidebar-expanded.png | 53:208518 | Alternative › Details (viewport) |
| alt-cost-gantt.png | 96:82370 | Alternative › Cost & Schedule, Gantt |
| alt-cost-sidebar.png | 96:80718 | Gantt with SideNav (4 alts, Value child) |
| alt-cost-gantt-row-hover.png | 96:166224 | Gantt row hover |
| alt-cost-table.png | 76:8795 | Cost & Schedule, Table default |
| alt-cost-table-row-expand.png | 76:17540 | Table, Design expanded |
| inv-comments.png | 55:46585 | Comments drawer |
| inv-activity.png / inv-activity-open.png | 55:84848 / 55:85304 | Activity menu / drawer |
| inv-attachments-modal.png | 53:230808 | Documents popover |
