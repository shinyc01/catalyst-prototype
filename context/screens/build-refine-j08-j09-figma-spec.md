# Spec: Build › Refine (J08 Alternatives & Forecast, J09 Value & Business Case)

**Figma:** Build handover `BmOuH8YCHltiitqwNW2ARt`. **These frames are the spec.** Sizes are px at 1440 x 900. Copy is the Figma copy (old story: "Southern Feeder Replacement", Ridgeview, feeders, Northgate). The prototype keeps the Figma *pattern* and fills names and numbers from `shared/` (see section 5). Real-looking person names are written `[person name]`. Tags: `[Figma]`, `[Assumed]`, `[Added]`, `[Whistler]`.

## 1. Frames found
| Node | What it holds | Sub-frames used |
|---|---|---|
| `48:59236` | Compare Alternatives (section "Compare Option 2": Hover / Remove from going to plan / Hide from comparison, 7 frames) | `48:57678` hover, `48:58049` open popover, `48:59236` Targeted Hardening excluded + callout |
| `55:52663` | Comments "Shape with Cooper" (9 frames) | `55:53126` comment focus, `55:54064` Cooper recs, `55:54960` rec expanded, `55:55441` rec detail, `55:56469` + peer benchmark, `55:53590` resolved |
| `53:201387` | Alternative details (General, Sidebar expanded/collapsed, Edit manually, Edit with Cooper x many, Edit cell, Collaboration) | `53:209948` General (1440 x 1684), `53:203751` Cooper working, `53:205790` field changed |
| `76:8792` | Cost & Schedule **table** (about 90 frames: hover, focus, drag, bulk select, recalculating, editing) | `76:8795` default, `76:10948` single select, `76:16086` bulk select, `76:17540` expand |
| `96:80712` | Cost & Schedule **Gantt** (about 140 frames) | `96:80718` with side panels, `96:82370` full width |
| `43:303888` | Investment details, Dependencies (Cooper-linked) | one frame |
| `48:146320` | Value: list, model details (formula, measure interactions, edit cell/measure with Cooper, questionnaire, add, delete, selected models, Cooper) | `48:186968` list, `48:187558` hover Add, `48:188190` models drawer, `48:146324` model, `48:180294`/`48:181786` questionnaire, `48:169497` edit with Cooper, `48:178811` cell edit, `48:189415` removed |
| `58:31703` | Refine Investment Overview, readiness 100% | one frame; the toast frame is the same overview with "Widget shared with your team" |
| `43:229806` | Refine System confidence (same overview, panel open) | `53:230306` is Attachments (Hover / Opened / Search / Card / Manual upload / Drag and drop) |

Not found / not read: a frame with the exact text "Value updated"; the "Generate widget with Cooper" flow frames; the Evidence frame `48:182063` ("Investment details / Evid…"). Flagged in section 6.

## 2. Refine shell (shared by every sub-page)
**Page chrome (all `[Figma]`):**
- **NavBar** 48 px: Command · Value · Explore · **Build** (active) · Plan · Results; search, settings, notifications (red dot), avatar "JP". DS `NavBar`.
- **PageHeader** 40 px (y 48-88): back chevron · investment title (truncated) · code · ▾ · status dot + "Refining" (Cost & Schedule table frames say "In progress"). Centre **Stepper** 352 px: Shape ✓ · Review ✓ · **Refine** (active, hatched bar) · Approve (some frames say "Decide"). Right: collaborators "3/5", **comment icon button** (red dot when unresolved, opens Comments panel), **Dismiss** (secondary), **Send for approval** (white primary). DS `PageHeader` + `Stepper` + `CollaboratorsButton` + `CommentButton` + `Button`.
- **Cooper's context bar** 40 px at the bottom (y 860-900): "COOPER'S CONTEXT" label · **16 Documents** button (opens Attachments popover) · upload icon button · right-aligned **prompt chips** that change per page. DS `BottomSheet` + `DocumentsPopover` + `PromptButton`.
- **Cooper orb** (round, bottom right) opens the Cooper window.

**Left sub-navigation** (SideNav, 240 px wide, y 88-860, row 216 x 40 with 12 px inset; collapse arrow top-right of the title; collapsed = 48 px rail with an expand icon at x 24). DS `SideNav` (title, items, `section` with Add action, `submenu`, `cooper` marker on a row).
```
INVESTMENT                        [collapse]
  Overview
  Details
  Alternative comparison
  Value
ALTERNATIVES                      [+]        (section subtitle with Add action)
  Full Replacement  [Cooper dots] [▲]        (recommended one carries the Cooper marker)
     ↳ Details
     ↳ Cost & Schedule
     ↳ Value
  Targeted Hardening                [▼]      (collapsed submenu)
  Reactive Repair                   [▼]
EXCLUDED ALTERNATIVES                        (only when something was excluded)
  Targeted Hardening                [▼]      (outlined / focus state in the callout frame)
```
Active row has a filled background. Only one alternative is open at a time. "Selective Feeder Renewal" in the Gantt frame is a stale name; treat it as the open alternative.

**Sub-pages of Refine (the "~8"):** 1 Overview · 2 Details (tabs General / Cost & Schedule / Relationships) · 3 Alternative comparison · 4 Value (list, then a model's page with tabs Value measures / Questionnaire answers) · 5 Alternative › Details · 6 Alternative › Cost & Schedule (Gantt | Table) · 7 Alternative › Value · plus overlays 8 Attachments (documents popover), 9 Comments (right panel), 10 System confidence (right panel). Dependencies (J08 step 6) lives on page 2, tab General.

**Right panels** (one at a time; they share the right edge, 380 wide, x 1060-1440, y 88-860, with a 48 px collapsed rail at x 1392-1440 whose icon shows a red dot when it has open items):
- **System confidence** (title "SYSTEM CONFIDENCE", Cooper icon, collapse arrow): "Approval readiness" ring with percent (35% or 100%); four gates, each Passed or an error/warning count: Investment readiness · Path forward · Assumption consistency · Review blockers; tab switch **Open questions 2 | Warnings 2**; "2 / 10 (10% resolved)", **All errors** filter, prev/next; the current issue (title, subtitle "Consequence · Required", SOLUTIONS list with the Cooper-suggested one highlighted), **Upload file** and **My answer** buttons. DS `SystemConfidence`, `ConfidenceGates`, `IssueNavigator`, `IssueSolution`, `IssueAnswerField`, `ProgressRing`.
- **Comments** (section 3.2) and **Cooper window** (floating, 380 x ~360-640, x 1048-1428, bottom-anchored or top-anchored, never pushes the layout). DS `CommentsPanel`, `AgentWindow`.

Wide pages (Cost & Schedule, Value, Details) hide the sidebar and the right panel by default (both collapsed to rails), so content runs x 60-1380.

## 3. Sub-pages

### 3.1 Alternative comparison (J08 steps 1, 8) `48:59236`
**Layout (with sidebar + System confidence open):** header y 100-150; comparison grid x 252-1048.
- **Title row:** "Alternative comparison" (h2) + 2 icon toggle buttons (table / cards view, first active); description "Investment alternatives evaluated against risk and return criteria". Right: **"N selected ▾"** dropdown (3 selected), **New** (icon + label, secondary), **Cooper's evaluation** (Cooper gradient button).
- **Selection popover** (from "N selected", about 220 x 112): column heads "SEND TO PLAN" and "COMPARE"; one row per alternative = checkbox (send to plan) + name + switch (compare, on). DS `Popover` + `Checkbox` + `Switch` (NDS wrapper for the two-column layout).
- **Alternative cards** (one per compared alternative, 308-379 wide, y 172-445). Top to bottom: name (muted if not recommended) · large cost `$4.2M` with "~ 3 – 5 years" · chip ("All 7 feeders") · text line ("9,400 customers protected") · inner stat "Risk reduced" **76%** "of reliability scored" · full-width button: **✓ Recommended** (disabled) on the recommended card, **Set as recommended** on the others. Recommended card has a white outline. DS `ContentCard` (slots) + `Badge`/`Chip` + `Button`; inner stat `Stat`. Wrapper is NDS.
- **Comparison table** under the cards, sticky label column 168 wide, one column per card. Group header rows 32 high with caret, name, count badge: **FINANCIAL 6**: CAPEX · ROI · Payback period · NPV · IRR · OPEX Impact. **RELIABILITY 5**: Risk Level · Failure Reduction · Reliability… (rest below the fold). Row height 40. Cell styles: ROI and OPEX show a green ▲ value; Risk Level shows a dot + word (MEDIUM amber, LOW green, HIGH red). Not-hovered columns dim when a comment is in focus.
- **States:** (a) default; (b) popover open; (c) **Targeted Hardening excluded**: it leaves the compared columns, its sidebar row moves under EXCLUDED ALTERNATIVES, with a callout "Excluded from Plan and Compare, but still available in the investment record." (d) comment focus dims the other cards and outlines the one the comment is on (3.2).
- **Clicks:** card name → that alternative's Details; **Set as recommended** → card becomes ✓ Recommended, the old one reverts, Rank badge on Details moves (a "Change recommended" is the same action from another card); **New** → Add alternative (3.3); **Cooper's evaluation** → Cooper window with an evaluation message (no frame; `[Assumed]` text: one paragraph + Recommended / Other groups like 3.2); checkbox off = "Remove from going to plan" (card stays, flag in Plan); switch off = "Hide from comparison" (column disappears, row stays in popover).
- **Bottom chips:** "Explain gaps in confidence" · "Why this alternative?" (with System confidence open) or "Generate Annualized outcome risk by risk type chart" · "Compare to best practice" (without).
- **DS:** `CompareDropdown` is Plan-flavoured, not this. Comparison grid is NDS (DS `Table` cannot hold card columns).

### 3.2 Comments panel and "Shape with Cooper" (J08 step 2) `55:52663`
- **Comments panel** (x 1048-1428, y 100-848, 380 wide, closes with X): title "COMMENTS"; tabs **Unresolved | Resolved**; Cooper search field "Ask anything about comments" (mic); comment cards: avatar initials, `#54 · Targeted Hardening` (number + the alternative it is on), author [person name] + "30 min ago", body, round ✓ resolve and "..." menu on the active one; unread blue dot on others. DS `CommentsPanel`, `CommentDrawerCard`, `CommentMenu`.
- **Comment popover** (anchored over the card, 380 wide): "COMMENT #54", "..." · resolve ✓ · X; thread; wide gradient button **Shape with Cooper →**; composer "Add a comment" with Cooper, mic, send. DS `CommentCallout` + `CommentComposer` + `Button`.
- **Click Shape with Cooper →** the Cooper window opens (top right, "COOPER · Speaking ‖ · Ask · collapse · X"): message "After analyzing comment #54, I've generated a set of recommended actions to address this issue." Then **RECOMMENDED 1**: "Refine Targeted Hardening Schedule"; **OTHER 3**: "Review Outage Windows", "Reduce Delivery Scope", "Recalculate Cost and Risk Impact". DS `CooperRecommendations` / `RecommendationGroup` / `RecommendationItem`.
- **Expand a row:** description, **IMPACT** rows (SCHEDULE ~8 mo ▾ 2 mo · RISK REDUCED 41% ▾ 2% · ESTIMATED COST $2.4M ▾ $0.2M), button **See details**. DS `RecommendationImpact`. **See details** → detail view with ← Back, title, text, IMPACT, a collapsible **PEER BENCHMARK** (text, SUMMARY: PEER UTILITIES, MOST COMMON DECISION + legend Replace like to like / Upgrade / Repair / Refurbish + chart) and a **Do it** button. DS `RecommendationDetail`, `PeerBenchmark`.
- **Do it** → comment #54 moves to Resolved, thread gains a Cooper reply "Targeted Hardening has been refined. The schedule now stays under 12 months…" + **Edit solution** button, resolved check turns green. Card figures change (cost, years, Risk reduced).
- **Set as recommended / Change recommended:** the card button in 3.1 (no extra dialog in the frames).
- **Gap:** "Set as recommended" is not drawn inside the recommendation window; the card button is the only control.

### 3.3 Add alternative and Alternative details (J08 steps 3-4) `53:201387`
**Add alternative:** **New** (3.1) or the **+** next to ALTERNATIVES; or Cooper from the prompt. No dedicated "new" frame; assume it creates a draft named by the user in a Cooper-assisted flow and opens its Details. `[Assumed]`.

**Details page layout** (sidebar + System confidence open; content x 252-1048; page is 1684 tall when scrolled):
1. Title "Alternative details" + "Alternative details, scope, cost, risk reduction, and expected value".
2. **Four stat cards** (each 192 x 76, gap 8): **Rank** `#1` + Cooper-marked "Recommended" badge · **Risk reduced** 76% "of reliability scored" · **Customers protected** 9,4k · **Scope** "All 7 feeders". DS `StatCard`/`StatCardsRow` + `Badge`.
3. **IDENTITY & CLASSIFICATION** card (collapsible caret, title uppercase, right: **Edit with Cooper** button + divider + round Cooper icon): Name · Description (2 lines) · Code `ALT-2026-0418` with a copy icon (visible on hover, callout "Button is visible on hover") · Type "Full Replacement" · Creator (avatar "UN", "Cooper") · Created date "02 Jul 2026". Two-column label/value grid, labels muted.
4. **DATES** card: End of alternative · Pause date · Resume date (dash when empty).
5. **RESTRICTIONS** card: switch "Allow alternative to be chosen as recommended" (help text "Allows this alternative to be selected as the recommended option for the investment.") · switch "Allow alternative to be shifted" ("Allows this alternative to be moved to a different year or planning period."). Both on by default.
6. **SCOPE** card: Cooper search "Ask anything about assets" (mic) · table **ASSET · SEGMENT · STATUS · RISK SCORE**, each head with a filter icon; rows (60 high): "Pole 1", "Demeter SS → Recloser R-1", status dot + CRITICAL / MODERATE / HEALTHY, risk score with ▲ and %. Infinite scroll for long lists (callout in frame). DS `DataTable` (columns status + counter) with `Search`.
- **Editing manually:** hover a field → pencil/edit affordance; click → field becomes an input (outlined blue); blur or Enter saves; saved state returns to read-only. DS `TextField`/`TextArea`/`DatePicker`/`Switch`.
- **Edit with Cooper:** click **Edit with Cooper** (section header) or a field's Cooper icon → floating "NEW CHAT" window (x 1108-1428, y 488-848): user bubble ("I want to change the name of alternative"), progress "Cooper is working on it (Step 2/4): This will take about 10 seconds…" with steps Text Query Processing · Framework Data Analysis · Diagram Construction · Data Validation, stop button, "+" and keyboard toggle. Variants in the Figma: voice, speaking, analyzing, interrupted/answered, generating, field changed (the field briefly highlights), and "edit with Cooper with redirect to another page". DS `AgentWindow`, `CooperProgress`, `TextMessageInput`, `VoiceMessageInput`, `SpeakingControl`.
- **System confidence beside it** shows a different issue here ("What contingency should be carried on this estimate?" with 10% / 5% / 15% solutions) than on the comparison page. It follows the open page, from the readiness model.
- **Sidebar** here shows Details as the active child row; the page has the "Value" top-level entry (Value list).
- **Chips:** "Explain gaps in confidence" · "Why this alternative?".

### 3.4 Alternative Cost & Schedule: Table (J08 step 5) `76:8792`
**Layout (no side panels; content x 60-1380):** title "Alternative cost & schedule" + "Alternative details, scope, cost, risk reduction, and expected value". Right: **view toggle** (segmented) **Gantt | Table** (Table active). Card (60-1380, y 168-563, grows):
- **Toolbar** (y 168-220): **COLUMNS ▾** · **VIEW ▾**; right: scale **Year | Quarter | Month** (Month active) · settings icon.
- **Formula bar** (y 220-272, ƒx icon; empty when nothing is selected). With one cell selected it reads e.g. "Σ 3 line items * base $2.01M + 12% loading" (monospace, tokens as grey pills) and shows **Adjust by %** at the right. With a range (B1:D2) it reads "B1:D2 = Σ $5.65M * avg $2.83M * 2 OF 6 filled" and shows **Set to · Adjust by % · Distribute · Shift dates**.
- **Grid** (spreadsheet look): column letters A-J above headers; row numbers at left (1-4). Columns: **STAGE** (name with expand caret, 340) · **TOTAL COST** · **DAYS** · **TYPE** · **START DATE** (dd.mm.yyyy) · **END DATE** · then a monthly strip under year "2027": Apr · May · Jun · Jul … cost per month. Rows (32 high): Design $2.25M, 43, Internal, 15.04.2027, 30.06.2027; Civil & foundations $3.4M; Feeder replacement $7.9M; Commissioning & closeout $1.15M. Footer **TOTAL COST** $14.7M, with monthly cost and running total underneath each month (`$240K` / `∑$240K`).
- **Expand a stage** (caret): child rows indented with no row number: Field survey & assessment, Detailed engineering, Permitting & ROW, Long-lead procurement (days, dates, cost per month).
- **Cooper edit:** floating pill bottom right "+ What do you want to change?" (keyboard icon). Selecting a cell fills it with a prompt such as "Shift all projects by 7 months"; Enter runs "Recalculating" and updates cells.
- **Cell states:** hover (can edit), focus ring blue, single select, drag/reorder rows, editing (type), read-only hover, blocked (derived), bulk select (range), recalculating.
- **Chips:** "Increase budget by 15%" · "Create new phase". 
- **Buttons act on the selection:** Set to (value), Adjust by % (dialog with a % field), Distribute (spread a total across months), Shift dates (days/months).
- **DS:** card, toolbar and tabs use `SegmentedControl`, `Menu`, `Button`. The spreadsheet grid, formula bar, cell selection and fill handle are **NDS**. `DataTable` and `Table` do not support them.

### 3.5 Alternative Cost & Schedule: Gantt `96:80712`
Same header, view toggle (**Gantt** active) and scale. Toolbar has only **VIEW ▾** (no Columns). Left **STAGE** column 340 wide: caret, colour swatch, stage name, "Internal" badge, red alert dot when there is a conflict, dates "Apr 15, 2027 – Jun 30, 2027", cost at the right (`$2.25M`). Time axis: year row 2027 / 2028, month row Apr … Jun. Bars per stage (teal for Design, purple for Civil, magenta for Feeder, navy for Commissioning), diamond markers at milestones, hatched segment = unfunded gap, cost chip under each bar per month (`$240K`). A row height 62 (child rows 62). Footer **TOTAL COST** `$14.7M` with monthly cost and cumulative (`$240K` / `∑$240K`).
- With sidebar + System confidence open the axis scrolls horizontally (Apr to Oct visible).
- Click a bar or row → select it and open the Cooper edit pill; drag a bar to shift dates; the same Adjust by % / Shift dates controls appear in the table view.
- **DS:** `TimelineChart` and `TimelinePhase` cover the phases on a time axis; milestone diamonds, per-month cost chips, hatched gap and the cumulative footer are **NDS** extensions.

### 3.6 Details › Dependencies (J08 step 6) `43:303888`
**Page** "Investment details" + "Core investment details, context, and current status". Tabs (DS `Tabs`, size m): **General** (active) · **Cost & Schedule** · **Relationships**. Right panel collapsed to a rail.
- **DEPENDENCIES** card: Cooper search "Ask anything about investments"; table **INVESTMENT · DEPENDENCY TYPE · PROGRESS · COST · VALUE** (each with a filter icon). Row: name + code (`INV-2026-SFR-12A`), type badge (**Value**, **Timing and milestone**, **Program**), progress bar + `68%`, cost `$4.2M`, value `$8.7M`, trash icon on hover. Hover row gets a white outline with a "Cooper" cursor label (Cooper linked them). Click a row → Cooper window "Back" + title, code, a paragraph "This dependency links … I'm tracking its status and impact…". DS `DataTable`, `ProgressBar`, `Badge`, `AgentWindow`.
- **ASSETS IMPACTED** card below: ASSET · SEGMENT · … (same pattern as the Scope table in 3.3).
- **Gap:** no "add dependency" control in the frame; assume the Cooper search is how to add one `[Assumed]`.

### 3.7 Value: list and model (J09 step 1) `48:146320`
**3.7a Value list** (`48:186968`; content x 60-1380; right panel collapsed to a rail). Title "Value" + "Shows the investment value model baseline and the value models assigned to this investment."
- **4 stat cards** (322 x 72): Total avg value created, $/yr `$2.05M` · Avg risk reduction `76%` · Benefit-cost ratio `2.5x` · Evaluation horizon `FY27–FY30`. DS `StatCardsRow`.
- **SELECTED MODELS** card: header with **+ Add** (appears on hover of the header; Cooper icon button always) ; columns **VALUE MODEL · STATUS · MEASURES · OUTPUT · RISK REDUCTION** (filter icons; MEASURES and RISK REDUCTION sortable). Rows (48 high): Simple financial risk · **● NEEDS INPUT 0/2** (amber) · `3` counter · output chips "Expected financial risk" "Avoided failure cost" "+1" · 74-78%; Safety risk · ● READY · 2 · "Public & crew safety exposure +1" · 56-60%; Reliability benefit · READY · 12 · "SAIDI / SAIFI improvement +11" · 88-92%; Environmental risk · 4 · 96-100%; Community impact · 6 · 67-71%; Customer experience · 2 · 69-73%. DS `DataTable` (status + counter + badge columns) inside `ContentCard`.
- **Add:** click **+ Add** → right drawer "MODELS" (`48:188190`, x 1014-1392): **Create new model** button · X; Cooper search "Ask anything about value models"; model cards (title + description): Public Safety Risk, Employee Safety Risk, Asset/Pipeline Integrity Risk, Reliability Risk, Outage/Service Interruption Risk, Environmental Risk, Emissions Reduction, Capital Carbon. Pick one → joins the table. Table shrinks and columns truncate (chips show 1 + count). DS `Drawer`/`Panel` + `ContentCard` (selectable).
- **With Cooper:** bottom pill "Say anything, I'm listening" or Cooper window "I've analyzed the … context and applied the Value Models relevant to this investment. Add supporting documents anytime…" + **Start walkthrough**.
- **Delete:** row action → Cooper confirms "Done — I've removed the Simple Financial Risk model and recalculated the investment value…"; the row is gone, Avg risk reduction recalculates (76% to 70%).
- **Chips:** "Explain these value models" · "Explain the baseline value".

**3.7b Model page** (click a row; `48:146324`). Header: ‹ back · "Simple financial risk" · ƒx icon (formula; click opens the formula view) ; description (one long line). Tabs **Value measures** (active) · **Questionnaire answers 2**.
- **EXPECTED FINANCIAL RISK, $/YR** card (collapsible; Cooper icon): formula line in mono "ƒx Change **Baseline** − **Outcome** where Outcome is **Risk Likelihood** * **Risk Consequence**" (a clicked cell shows numbers: "Change $545k − $61k where Outcome is 2.54%/yr * $2.04M = $61k"). Table **RANK · VALUE · FY26 FY27 FY28 FY29 FY30 FY31 · Σ**. First row **Baseline** (Shared reference) values `$310k … $688k`, Σ `$2,90M`. Then ranked rows `1 Full Replacement · Alt 1` "Change · avoided risk" with green ▲ values per year and Σ column highlighted; rows 2 and 3 likewise. Click a value cell → blue focus ring and the formula line explains that cell.
- **OUTAGE** chart: line chart, y `$0 … $1M`, x FY26-FY31, one line per alternative + baseline (grey), dashed gridlines. DS `LineChart`/`DataVizLine`.
- **Edit with Cooper:** floating pill "What do you want to change?" (or a prefilled prompt like "Shift all projects by 7 months"); with System confidence open the layout narrows to x 60-1048. After Cooper edits, the changed cells flash and Cooper replies "Value updated" `[Assumed text; frame not found]`.
- **Questionnaire answers** (`48:181786`): table **QUESTION · VALUE MODEL · ANSWER** (filter icons), grouped with a collapsible group bar and count: **Need input 2** (amber) then **Ready 5** (green). Row: question (bold) + "Consequence · Required" or "Likelihood · Required" or "Scope · Required"; value model badge ("Simple financial risk" +1); answer text; round Cooper status icon at the right (red-dotted = needs you, amber-dotted = Cooper suggestion pending, green-dotted = Cooper answered). Questions are answered by Cooper, by the user (**My answer** in System confidence) or marked needs-you. DS `IssueNavigator`/`IssueSolution`/`IssueAnswerField` for the answer flow, `Table` with `groupBy` for the layout, `Badge`.
- **Chips:** "Explain the value impact" · "What is driving this model?".

### 3.8 Alternative › Value (J08/J09 link)
The sidebar has "↳ Value" under each alternative. Frames `48:183539`+ are titled "Alternative value" and show the same Value list, scoped to one alternative. Treat as: same layout, same cards, values from that alternative. `[Assumed]`; no extra frame read.

### 3.9 Refine Investment Overview (J09 step 2) `58:31703` and `43:229806`
**Layout (System confidence open, x 60-1048; full width x 60-1380 when closed).** Title "Investment overview" + "High-level investment summary, key metrics, and current progress"; right: **Widgets** (icon + label, secondary).
- **4 KPI cards** (about 240 x 92; gap 10): label · big value · uppercase caption: **Benefit-cost ratio** `2.5x` "BENEFIT RETURNED PER $1 SPENT" · **Estimated cost** `$4.2M` "EXPECTED DELIVERY COST" · **Investment value** `$23k` "TOTAL EXPECTED VALUE" · **Baseline risk** `$12.6M` "RISK BEFORE INTERVENTION". DS `StatCard`.
- **Row 2:** **INVESTMENT DETAILS** card (Name, Code, Type, Planning portfolio, Problem statement; label/value rows) · **AFFECTED ASSETS & AREA** card (map with route, pins, map icon button top right; DS map slot, reuse `app/map.jsx`).
- **Row 3:** **YEARLY FORECAST** (column chart, y `$0 … $2.5M`, x FY25-FY29, bars purple; DS `ColumnChart`) · **INVESTMENT VALUE** (horizontal diverging bars by measure: Electrical Distribution Reliability, Electrical Delivery Capacity, Compliance Risk, Financial Benefits-OPEX, Project Execution Risk, Total Investment Cost; red negative, green positive, last bar outlined; axis -30k … 30k; DS `BarChart`/`WaterfallChart`). Each card has a Cooper icon button.
- **Widgets:** **Widgets** opens a drawer to add, hide, resize and reorder cards; **Generate widget with Cooper** is in the drawer or the prompt chip "Generate Annualized outcome risk by risk type chart"; after it, a snackbar at the bottom of the grid "Widget shared with your team" + `[person name]` · `[person name]` + **Okay**. DS `WidgetsDrawer`, `WidgetBoard`, `WidgetCard`, `Snackbar`.
- **Readiness 100%:** System confidence shows ring 100%, four gates **Passed**, Open questions with two items each ending in a green check ("WDRM v4 concentration above cap", "Affordability under intended target"); **Send for approval** is enabled (cursor on it).
- **Chips:** "Generate Annualized outcome risk by risk type chart" · "Compare to best practice".

### 3.10 System confidence (J09 step 3) `43:229806`
Same Overview with the panel at 35% and the issue "Urgency needs confirmation. The 12–18 month action window needs supporting evidence." SOLUTIONS: (1) **Ask field team to confirm urgency** (Cooper-suggested, highlighted; description "Ask the Field Team Lead to confirm the 12–18 month action window.") · (2) **Adjust urgency to lower confidence** ("Keep the action window as an early estimate and mark urgency as provisional until more evidence is added.") · (3) **Use peer benchmark** ("Compare this action window against similar feeder investments to confirm urgency.") + **Review details** link button; then **Upload file**, **My answer**. Choosing a solution marks the item resolved ("n / 10 resolved"), updates the gate row and the percentage. DS `SystemConfidence` family (`IssueSolution`, `IssueNavigator`).

### 3.11 Attachments (J09 step 4) `53:230306`
- **Hover:** the upload icon next to "16 Documents" highlights. **Opened:** click "16 Documents" → popover (about 300 x 345, bottom-left, anchored above the bar): "DOCUMENTS **16**" + X; search "Search for…"; list rows (icon tile, file name, date): `2025 Board Planning Present.pdf JAN 15, 2025`, `Quarterly Marketing Review.docx`, `Product Roadmap Update.pptx`, `Customer Feedback Summary.xlsx`, `Annual Financial Report.pdf`, `New Hire Orientation Guide.doc`. Scrolls. DS `DocumentsPopover`, `DocumentRow`.
- **Search:** typing filters; empty shows "no results". **Card:** hover a row shows a preview card with a small callout. DS `SourceCard`.
- **Add attachments:** manual = upload icon opens the OS file picker; **drag and drop** = page gets a dashed outline, a floating file chip ("Investment ideas PDF") follows the cursor, drop adds it and the count becomes 17. DS `DocumentsDropArea`, `DocumentsFeedback`, `useDocuments`.

### 3.12 Comments (J09 step 5)
Same Comments panel and popover as 3.2, opened from the header comment icon on any Refine page. Comment numbers and the alternative name show where it was left. Resolved tab lists resolved ones. Cooper reply can include **Edit solution**.

## 4. Navigation map
- Stepper "Refine" is the home of this area; entry from Build › Shape idea overview `Send for review` or from the investment list.
- **Overview** ⇄ **Details** ⇄ **Alternative comparison** ⇄ **Value** via the left SideNav; Details tabs switch inside the page.
- **Alternative comparison** card name or sidebar row → **Alternative › Details**; sidebar children → **Cost & Schedule** (Gantt/Table toggle inside) and **Value**.
- **Value list** row → **Model page** (‹ back returns); **+ Add** → drawer; **ƒx** → formula view.
- **Comment icon** → Comments panel → **Shape with Cooper** → Cooper window → **See details** → **Do it** → alternative figures change, comment resolves.
- **Cooper's evaluation** / any Cooper icon → Cooper window. **16 Documents** → Attachments popover. **Right rail** icon → System confidence.
- **Send for approval** (enabled at 100%) → leads to Approve (outside this spec).

## 5. Data mapping
| Figma field | Prototype source |
|---|---|
| Investment title, code, status, owner | `WHISTLER_INVESTMENTS` (8380 "Pad-Mount Transformer Replacement Program V2", DIST000246, owner Hollis Grant) `[Whistler]` |
| Alternative cards: name | `WHISTLER_ALTERNATIVES[].name` (Aggressive / Median / Minimal Replacement); `isRecommended`, `isSelected` give the badge and Send to plan |
| Cost `$4.2M`, "~3-5 years" | `spendTotal`; years from `firstSpendDate`..`lastSpendDate` `[Whistler]` |
| Risk reduced % | `1 - riskResidualByYear/riskBaselineByYear` `[Whistler]` (derived) |
| Chip "All 7 feeders" / "9,400 customers protected" | no data: `[Added]` from `whistler-additions.js` customers per kind |
| Comparison rows CAPEX / OPEX Impact | `spendByAccountByYear.CAPEX/OPEX` `[Whistler]` |
| ROI, Payback, NPV, IRR, Failure Reduction, Risk Level | no data: `[Added]` computed once from `valueTotal` / `spendTotal` and risk outlook; BCR rule in `whistler-additions.js` |
| Value measures (Investment value chart, value list measures) | `valueByMeasure` (6 real measures; the real names replace Figma's list); value models status, risk reduction ranges: `[Added]` |
| Value by year per alternative (model page) | `valueByMeasure` spread across `spendByYear` years `[Assumed]` |
| Baseline row ($310k…) | `riskBaselineByYear` `[Whistler]` |
| Stages Design / Civil / Feeder / Commissioning, days, dates, monthly cost | no stage data: `[Added]` split of `spendByYear` and `milestones` (start of program, milestone 1-3 `[Whistler]`) |
| Scope assets table (Pole 1 …, status, risk score) | `WHISTLER_ASSETS` where `investmentId` = 8380 (`name`, `lof`, `cof`, outlook) `[Whistler]` |
| Dependencies (other circuits, type, progress, cost, value) | other cluster investments (2891, 2892, 2893, 104860): cost `spendTotal`, value `totalValue`; type and progress `[Added]` |
| Comments (author, text) | `WHISTLER_USERS` names, text `[Added]` (`[person name]` in Figma) |
| System confidence issues, solutions, readiness % | `plan-model.js` readiness style rules / `recommend-model.js`; text `[Assumed]` |
| Documents (16) | `[Added]` fixed list |
| Collaborators 3/5 | `[Added]` |

## 6. Gaps and conflicts
1. Stepper last step reads **Approve** in most frames but **Decide** in the Comments and Cooper frames. Use Approve (matches CLAUDE.md `app/screens/build.jsx`). Status text "Refining" vs "In progress": use "Refining".
2. Figma names the first sidebar group "INVESTMENT" and shows **Value** as a top-level entry in some frames but not in the Gantt/Cost frames (no Value row); build the full list.
3. Alternative names differ between frames (Selective Feeder Renewal vs Targeted Hardening); all frames use 3 alternatives, matching the 3 real ones.
4. The Overview's INVESTMENT VALUE chart shows `$23k` total value while the Value page says `$2.05M` per year and the cards show BCR 2.5x: Figma numbers do not reconcile; the prototype derives all from the same record.
5. Cost & Schedule spreadsheet (formula bar, cell selection, Set to / Adjust by % / Distribute / Shift dates) and Gantt chips/diamonds are **not in DS 2.0**: wrap in `NDS`.
6. No frame found for: Add alternative, Cooper's evaluation output, "Value updated" message, Generate widget with Cooper, Alternative › Value, Evidence (`48:182063`), the "Remove from going to plan" and "Hide from comparison" result states other than the excluded callout. Behaviour above is `[Assumed]` where marked; ask Shiny/Mahsa before building them as truth.
7. System confidence readiness (35% to 100%) has no rule in `logic/`; needs a decision before the issues can really resolve.
8. Compare popover: which control is "Send to plan" and which is "Compare" is inferred from the column labels (checkbox left, switch right).
