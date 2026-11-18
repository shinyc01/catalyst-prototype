# Plan › Setup (Data readiness + Planning groups) — Figma screen spec

Source: Figma file `Dv3HzkcFTTrb4E34zLF7cy`, page "1️⃣ Setup" (`27:41146`), section "Setup" (`85:156956`). The requested node `85:157926` is a single 1440×1350 frame ("Investment / Data readiness", the **Expanded** state). It sits in the sub-section **"Data readiness"** (`85:156957`), next to its Collapsed sibling and a loose Warnings-tab panel. The sibling sub-section **"Planning groups"** (`85:158974`) holds 6 frames for the second tab and is specced in §4. A third sub-section, **"Scenarios"** (`85:162876`, 8 frames, 1440×900–2295), is **not** specced here.

Every frame was screenshotted at 1440 px wide, and the screenshots are the source of truth. Copy in "quotes" is exact; it was taken from `get_design_context` where available, otherwise read off the screenshots. Layer names are often stale and do **not** match the rendered text (e.g. the question-title layer is named "Shared engineering capacity is over-subscribed"), so never copy a layer name as UI text. "~x/y" values are approximate pixel positions in the 1440-wide frame.

Sticky-note labels on the canvas (design annotations, not UI): "System Confidence Sidebar" (`85:156958`), "Collapsed" (`85:156959`, over `85:156961`), "Expanded" (`85:156960`, over `85:157926` + `85:158973`). Planning groups stickies: "Under consideration", "Created new group", "Moved to existing group", "All reports". **No DEV NOTE callouts exist in either sub-section.** The only behaviour annotations are the magenta prototype connectors (see §4.8).

---

## 1. Frames found

| Node | Name | State |
|---|---|---|
| `85:156961` | Investment / Data readiness | Data readiness tab, **System confidence collapsed** to a rail |
| `85:157926` | Investment / Data readiness | Data readiness tab, **System confidence expanded**, Open questions tab (the target) |
| `85:158973` | sidebar-organism (380×1136, loose) | System confidence panel, **Warnings** tab selected |
| `85:158979` | Default | Planning groups tab: "Under consideration" (question 1 open) |
| `85:162182` | Investment / Planning groups | "Created new group" (solution 1 applied) |
| `85:160926` | Investment / Planning groups | "Moved to existing group" (solution 2 applied) |
| `85:161557` | Investment / Planning groups | "All reports" (the "All" list view of the 7 questions) |
| `85:160232` | Default | Planning groups: group-row "⋯" menu open (Rename / Delete) |
| `85:159619` | Default | Planning groups: "Required by management" group expanded (description + principles) |

**Not designed in Figma** (any of these would be invention and must be tagged `[Assumed]`):
- the result of "Accept all" or "Review individually" on the Data readiness tab;
- the result of the per-row "Fix with Cooper" / "Leave out from this plan";
- a resolved or excluded investment row;
- readiness at 100% / all gates passed, and the "Optimize" result.

The Planning groups tab shows the applied-solution pattern ("APPLIED" + undo, a green check and "% resolved" in the pager), which is the closest designed analogue.

---

## 2. Shared shell (every Setup frame)

Dark theme throughout: a black page surface, cards on `surface/secondary-alpha` (very dark grey), 1px `border/base` hairlines, white primary text, grey secondary text and darker grey tertiary text.

### 2.1 NavBar (`nav-bar-organism`, h 48) — DS `NavBar`
- Left: the IFS Copperleaf logo. Items: "Command", "Value", "Explore", "Build", **"Plan" (active: grey pill)**, "Results".
- Right: search, settings (gear), and a bell with a red dot (notification icon-button), then the avatar "JP".

### 2.2 Page header (`page-header`, h 40, bottom hairline) — DS `PageHeader`
- **Left (breadcrumb):** a ghost chevron-left icon button, "Electrical distribution" (white, label M), "FY27" (tertiary grey) and a ghost chevron-down icon button. Then an `indicator-molecule` with a **purple/blue dot + "Planning"**.
- **Centre (stepper, `stepper-organism`, 3 × 88px steps)** — DS `Stepper`:
  - "Setup" is the active step: a sun/spinner icon on an `elevation-1/secondary` background, with a hatched (striped) progress underline.
  - "Compare" and "Approve" are inactive: dotted-circle icon, secondary text, and a plain 4px `white-strong` underline.
- **Right:**
  - a tertiary button with the users-group icon and "3/5" (collaborators);
  - the comment icon button (`icon-button-comment`, no new-comment dot);
  - a thin vertical divider;
  - **"Optimize"**, a primary button (white fill, black text, small).

### 2.3 Page title + tabs (x 12, y ~100–172)
- "Setup" (headline, ~20px, white).
- Tabs (DS `Tabs`, underline style): "Data readiness", "Planning groups", "Scenarios" with a counter "3". The active tab has white text and a white underline; inactive tabs are secondary grey. A hairline runs under the tab row only (~x12–324).

### 2.4 Bottom bar (`Evidence-strip-bar/all actions`, h 40, top hairline, `surface/primary-alpha` with blur)
- **Data readiness frames:**
  - Left: "COOPER'S CONTEXT" (H4 uppercase, secondary), a tertiary button with a file icon and "16 Documents", and a 32px tertiary upload icon button.
  - Right: `prompt-button` pills (DS `PromptButton`, secondary fill, full radius, drop shadow) reading "Explain why these are outliers" and "Summarize data readiness", then the Cooper orb (`FTA button`, DS `FtaButton`).
- **Planning groups frames:** **no left "COOPER'S CONTEXT" cluster.** Chips "Compare to peer" and "Compare to best practice", then the orb.

---

## 3. Data readiness tab

### 3.1 `85:157926` — Expanded (target, default state)

Layout: the main column is x 12–1048 (1060 wide incl. padding), and the System confidence panel is x 1060–1440 (380 wide, `border/base` left border, black surface).

#### 3.1.1 KPI row (y 191–262) — 4 equal stat cards. DS `StatCardsRow` / `StatCard`.
Each card has a dark card background, a 1px border and radius 4. The label (secondary, ~12px) sits on top. Below it are the value (large, ~20px, white) and an inline caption (tertiary, small).

| # | Label | Value | Caption |
|---|---|---|---|
| 1 | "With inconsistency" | "47" | "/ 4500" |
| 2 | "Outliers" | "23" | "/ 4500" |
| 3 | "Cost at risk" | "$41M" | "tied to open issues" |
| 4 | "Ready to optimize" | "98%" | — |

#### 3.1.2 Outlier chart card (`data-viz-card-organism` `85:158189`, y 282–690) — DS `DataVizCard` + `ScatterChart`
- Header: "OUTLIER INVESTMENTS" (Label L uppercase semibold, tertiary grey). The 24px header slot on the right is empty.
- Plot area: 328px tall.
  - **Y axis:** rotated label "Forecast value"; ticks "12", "10", "8", "6", "4", "2", "0" (tertiary, label M).
  - **X axis:** ticks "0", "5", "10", "15", "20", "25", "30"; axis title "Forecast cost ($M)".
  - Horizontal dashed gridlines sit at each y tick.
- **Expected-value band:** a translucent dark-indigo/navy parallelogram rising from bottom-left (~y 0–3 at x 0) to top-right (~y 6–12 at x 30). In-band investments are **blue/indigo dots of varying size** (bubble-like; drawn as one SVG, `Frame 2147228288`).
- **Outliers:** small 6px **red** dots (`indicator-atom`) above the band (high value for cost) and below it (low value for cost, cost ~17–28). **34 red dots are drawn: 24 above and 10 below** (see §6).
- **Median cost:** a solid vertical grey line at x ≈ 5.4–5.8, label "Median cost $5.4M" (secondary, label M) at its top right.
- **Median value:** a solid horizontal grey line at y ≈ 2.2–2.6. Its label "Median value 2.6" is placed at the right end. **In the expanded frame the label is clipped (not visible)**; it only shows in the collapsed frame (wider chart).
- No legend and no tooltips are drawn.

#### 3.1.3 Investments card (`content-card-organism` `85:158760`, y 710–1305)
- **Header:** "INVESTMENTS" (uppercase, secondary), then a hairline. Right: a round Cooper-evidence icon button.
- **Toolbar row (y ~776–814):**
  - Left: a segmented control (DS `SegmentedControl` with `Counter`s, the `segmented-control-organism`) with 3 segments:
    - **"All" + counter "4500"** (selected: lighter fill, border)
    - "With inconsistency" + "47"
    - "Outliers" + "23"
  - Right (~x 674–1034): DS `SmartSearch` pill, outlined: Cooper sparkle-search icon, placeholder "Ask anything about investments" and a mic icon.
- **Column headers** (uppercase, secondary, label M; the filter-lines icon is a `TableFilterAtom`, DS `ColumnFilter`):
  - "INVESTMENTS" ▾filter (~x 32)
  - "INCONSISTENCY" ▾filter (~x 336)
  - "SOLUTION" (no filter, ~x 536)
  - "COST" ▾filter (~x 736)
  - "VALUE" ▾filter (~x 816)
  - "SCHEDULE" ▾filter (~x 896)
- **Rows:** `content-row-molecule`, 48px, `surface/secondary-alpha`, radius 4, 4px gap.
  - Cell 1 (two lines): the name (white, body M medium, ellipsis) and the code (secondary).
  - A status icon right-aligned in the name cell: red `status-error-filled` "!" or amber `status-warning-filled`.
  - The inconsistency cell holds a `badge-atom` (grey pill, white text; DS `Badge`).
  - The solution cell holds a ghost button (DS `Button` ghost/tertiary, small, icon + text).

| # | Investment | Code | Status icon | Inconsistency chip | Solution | Cost | Value | Schedule |
|---|---|---|---|---|---|---|---|---|
| 1 | "West Corridor Protection Relay Upgrade" | "INV-2026-0910" | red error "!" | "Cost has no estimate basis" | Cooper dots icon + **"Fix with Cooper"** (Cooper orange-gradient text) | "$3.4M" | "2.3M" | "Jan 2026 – Jun 2026" |
| 2 | "Ridgeview Village Backup Tie to Feeder 5" | "INV-2026-0910" | amber warning | "Cost 71% below the class median" (truncated here to "Cost 71% below the class...") | circle-slash (`decline`) icon + **"Leave out from this plan"** (white) | "$12.7M" | "2.3M" | "Mar 2026 – Dec 2026" |
| 3 | "Cedar Park Feeder Hardening Program" | "INV-2026-0910" | — | — | — | "$8.9M" | "2.3M" | "May 2026 – Aug 2027" |
| 4 | "Southern Feeder Replacement — Circuit 17C" | "INV-2026-0910" | — | — | — | "$1.2M" | "2.3M" | "Jul 2026 – Oct 2026" |
| 5 | "Elmwood Feeder 2 Underground Cable Renewal" | "INV-2026-0910" | — | — | — | "$650K" | "2.3M" | "Sep 2026 – Mar 2027" |
| 6 | "Flood Erosion Protection at River Crossing Structure" (truncated "…Stru…") | "INV-2026-0910" | — | — | — | "$22.3M" | "2.3M" | "Nov 2026 – Dec 2027" |
| 7 | "Elmwood Feeder 2 Underground Cable Renewal" | "INV-2026-0910" | — | — | — | "$480K" | "2.3M" | "Feb 2026 – May 2026" |
| 8 (faded) | "Elmwood Feeder 2 Underground Cable Renewal" | (cut off) | — | — | — | "$480K" | "2.3M" | "Feb 2026 – May 2026" |

- Row 8 fades out under a gradient overlay, followed by a ghost button **"Show more ▾"** (caret-down filled) at the bottom left.
- Hidden layer leftovers clipped below row 8 (not visible; don't build):
  - "Battery Storage at Northgate to Defer Feeder Upgrade" INV-2026-0913 $900K, Jun 2026 – Sep 2026, with a progress ring;
  - "Recloser Swap-outs on Northgate Leftovers (F2, F7)" INV-2026-0930, a checkbox row;
  - 2× "Northgate Substation Transformer Replacement" INV-2026-0912, with lock/eye icons.

  These come from an older table layout.

#### 3.1.4 System confidence panel (`sidebar-organism` `85:158864`) — DS `SystemConfidence` (Panel + ConfidenceGates + IssueKindSwitch + IssueNavigator)
1. **Panel header** (bottom hairline, pb 12): "SYSTEM CONFIDENCE" (H3 uppercase, secondary). Right: a 24px round tertiary icon button with the cooper-evidence icon (DS `EvidenceButton` / `IconButton`), then a ghost "|→" (`arrow-bar-right`) collapse button.
2. **Content card** (`surface/secondary-alpha`, radius 4, p 8):
   - **Gates (DS `ConfidenceGates`, label overridden):**
     - "Optimization readiness" (body L medium, white), with a 16px `ProgressRing` (green arc, ~35%) and "35%" on the right.
     - Checklist rows, 32px each (DS `ReadinessStatus`):

       | Icon | Label | Right |
       |---|---|---|
       | dashed circle (in-progress) | "Data readiness" (secondary) | red dot "0/3", then amber dot "1/2" (XS `Indicator`s) |
       | green filled check (done) | "Planning groups" (white) | "Passed" (secondary) |
       | dashed circle | "Scenarios setup" (secondary) | amber dot "0/2" |

   - **Issue-kind switch** (DS `IssueKindSwitch` = `SegmentedControl` S with counters, between top and bottom hairlines, h 56): **"Open questions" + "2" (selected)** | "Warnings" + "2".
   - **Pager row** (DS `ProgressPager`): "1" (white) + " / 3" (disabled grey) + "(0% resolved)" (tertiary). Right: a tertiary button with a list icon and **"All questions"**, then a ‹ › paired button (56×28).
   - **Question:** title **"31 of 47 inconsistencies are safe to ignore"** (H2 medium, 16px, white); body "Cooper's seen this pattern before." (body L, secondary).
   - "SOLUTIONS" (caption uppercase, 10px).
   - Solution cards (DS `IssueSolution`, radius 8, p 12, border/base):
     - **Recommended:** `cooper-base` warm fill, Cooper dots icon, gradient Cooper text **"Accept all"**. Title only, no description.
     - Plain: `elevation-1/secondary` fill, **"Review individually"**. Title only.
   - Footer (pt 8): two equal tertiary buttons, upload icon + **"Upload file"** and plus icon + **"My answer"** (DS `IssueAnswerField` entry points).
3. The panel is fixed full-height. Below the card it is empty black.

### 3.2 `85:156961` — Collapsed
Identical to §3.1 except:
- The System confidence panel is replaced by a **48px right rail** (DS `PanelRail`) with a "←|" expand icon at the top (~x 1416, y 115) and a **red status dot** (= open questions/errors). A prototype hotspot (pink circle + hand cursor) sits on it, so **click opens → `85:157926`**.
- The main column spans to ~x 1380, and the KPI cards widen to ~334px each.
- The chart is wider and the label **"Median value 2.6"** is visible at the right end of the median-value line.
- Row 2's chip shows in full: "Cost 71% below the class median".
- Row 6 shows in full: "Flood Erosion Protection at River Crossing Structure".
- **Row 8 differs:** "West Corridor Protection Relay Upgrade", "$5.6M", "2.3M", "Apr 2026 – Jul 2027" (faded), whereas the expanded frame shows Elmwood $480K.
- The investments table shows a vertical scrollbar on the right of the card.

### 3.3 `85:158973` — System confidence, Warnings tab (loose panel next to Expanded)
- Header and gates are identical to §3.1.4: 35%; Data readiness 0/3 · 1/2; Planning groups Passed; Scenarios setup 0/2.
- Switch: "Open questions 2" | **"Warnings 2" (selected)**.
- Pager: "1 / 4 (0% resolved)". The button reads **"All warnings"**, followed by ‹ ›.
- Warning title: **"Min Cost Scenario constraints are too tight"**. Body: "There is not enough room for the optimizer to move the investments so the optimization can fail".
- "SOLUTIONS":
  - Recommended (Cooper): **"Relax the SAIDI constraint to 0.5%"**
  - "Relax the budget constraint slightly to $12.5M"
  - "Relax the resource constraint with one more technician"
- Footer: "Upload file" and "My answer".
- Note: this warning is about **Scenarios**, not data readiness. The warnings list spans all gates.

---

## 4. Planning groups tab (sub-section `85:158974`, frames 1440×1068)

Shell as in §2, with the "Planning groups" tab active and the Planning-groups bottom bar. The System confidence panel is always expanded.

### 4.1 `85:158979` — Under consideration (default)
**Chart card "INVESTMENTS COUNT BY PLANNING GROUP"** (y 191–408) — DS `DataVizCard` + stacked horizontal `BarChart`:

| Row label | Bar | Total |
|---|---|---|
| "Under Consideration" | stacked: Initial (purple, short), Long Term Planning (teal, ~half), Short Term Planning (pink/magenta, ~half) | "1417" |
| "Required by management" | teal (short) | "14" |
| "Executing" | indigo/blue | "61" |

Legend (square swatches, centred): "Initial", "Long Term Planning", "Short Term Planning", "Executing".

**Card "INVESTMENT GROUPS"** (y 428–1027, Cooper-evidence icon button at top right). It has two panes.

Left pane (x 24–290):
- Header: grid icon + "Groups", with a "←|" collapse icon.
- Accordion group rows (caret ▸, name in body L, counter on the right):
  - **"Under consideration" "1417"** (selected: 1px light border)
  - "Required by management" "14"
  - "Executing" "61"

Right pane:
- DS `SmartSearch`: "Ask anything about investments" + mic.
- Columns: "INVESTMENT", "COST", "VALUE", "SCHEDULE", each with a filter icon.
- Rows (48px, two-line name + code):
  - The first 3 rows are **highlighted** (lighter fill): these are the matched "storm jobs". A **dashed orange divider** follows, then the remaining rows (normal fill).
    - "West Corridor Protection Relay Upgrade" / "INV-2026-0910" / "$3.4M" / "2.3M" / "Jan 2026 – Jun 2026"
    - "Northern Substation Transformer Replacement" / "INV-2025-1147" / "$8.1M" / "5.7M" / "Mar 2025 – Dec 2025"
    - "East Grid Battery Storage Installation" / "INV-2027-0233" / "$12.6M" / "9.1M" / "Apr 2027 – Feb 2028"
  - Below the divider, the same three investments repeat (West Corridor ×2, Northern Substation ×2, East Grid ×2, …), cut off at the bottom.

**System confidence panel:** gates as in §3.1.4.
- Switch: "Open questions 2" (selected) | "Warnings 2".
- Pager: "1 / 7 (0% resolved)". The button reads just **"All"** (list icon), followed by ‹ ›.
- Question: **"3 storm jobs form one programme"**. Body: "Share the coastal corridor, chain in schedule from Apr 2026 to Nov 2027, and carry the same value driver. Funded apart they leave gaps in the same feeder run."
- "SOLUTIONS" (each card has a title and a description line):
  1. Recommended (Cooper): **"Create a group from this match"** / "They stop competing for funding and forced into every scenario."
  2. **"Move to “Required by management”"** / "Forced in. Stops competing for funding."
  3. **"Leave them competing"** / "The optimizer may fund some and drop the others."
- There is **no Upload file / My answer footer** on this tab.

### 4.2 `85:162182` — Created new group (after solution 1)
- Left groups list adds a 4th row: **"Coastal storm programme" "6"**. "Under consideration" stays "1417".
- The table loses the highlight and the dashed divider; all rows are plain.
- Panel pager: **green check + "1 / 7 (15% resolved)"**.
- The caption changes from "SOLUTIONS" to **"APPLIED"**. A single applied card shows: Cooper dots icon, "Create a group from this match" (Cooper gradient) and an **undo icon button (↶)** on the right. This is DS `IssueSolution` with `onUndo`.
- The chart still shows 1417 / 14 / 61 (unchanged).

### 4.3 `85:160926` — Moved to existing group (after solution 2)
- Groups: **"Under consideration" "1414"**, **"Required by management" "17"**, "Executing" "61". There is no new group.
- The table is plain (no highlight).
- Pager: green check + "1 / 7 (15% resolved)". "APPLIED" card: "Move to “Required by management”" (white, no Cooper icon) + ↶ undo.
- The chart still shows 1417 / 14 (unchanged).

### 4.4 `85:161557` — All reports (the "All" list)
- Groups state as in §4.3 (1414 / 17 / 61).
- The panel replaces the question view with a numbered list (DS `IssueListItem` rows inside a darker inset, each a bordered card with a small counter):
  1. "3 storm jobs form one programme" (green check at the right = resolved)
  2. "Executive mandate cited for 2 investments"
  3. "Purchase order raised for 7 investments"
  4. "2 small cable jobs could share a mobilisation"
  5. "No signal at all"
  6. "Regulatory letter, no mandate record"
  7. "No estimate basis"
- The pager row and "All" button are not shown in this view.

### 4.5 `85:160232` — Group row menu
- State as §4.1, plus a 4th group "Coastal storm programme" hovered. Its row shows a **"⋯" icon button** (pressed, grey square).
- A menu below it (DS `Menu` / `ActionMenu`) offers pencil "Rename" and trash "Delete".
- Panel: as §4.1 (0% resolved, 3 solutions). This is inconsistent: the group exists but question 1 is unresolved.

### 4.6 `85:159619` — Group expanded
- "Required by management" is expanded (caret ▾, bordered box). Text: "Decided outside the plan. The optimizer skips these — their alternative, start date and funding stay exactly as the scenario holds them."
- Inset "GROUPING PRINCIPLES" (caption uppercase), three rows each with a left rule: "Mandate record exists", "No purchase order raised", "Approved cost estimate present".
- "Executing 61" moves down. The table and panel are as in §4.1.

### 4.7 Planning groups numbers
| | Default | After "Create group" | After "Move to Required" |
|---|---|---|---|
| Under consideration | 1417 | 1417 | 1414 |
| Required by management | 14 | 14 | 17 |
| Executing | 61 | 61 | 61 |
| Coastal storm programme | — | 6 | — |
| Pager | 1 / 7 (0% resolved) | ✓ 1 / 7 (15% resolved) | ✓ 1 / 7 (15% resolved) |

### 4.8 Prototype connectors (magenta arrows on the canvas)
- §4.1 "Create a group from this match" → `85:162182` (Created new group).
- §4.1 "Move to “Required by management”" → `85:160926` (Moved to existing group).
- §4.3 pager "All" button → `85:161557` (All reports).
- The left-pane group row "Required by management" in `85:160232` → `85:159619` (expanded). The connector runs down the left edge.
- Connector frame names on the canvas read "button <-> Case 3 — Warnings only". This is a reused markup label, not a spec.

---

## 5. State transitions (summary)

| From | Click | To |
|---|---|---|
| `85:156961` Collapsed | rail "←|" (red dot) | `85:157926` Expanded |
| `85:157926` Expanded | panel "|→" | `85:156961` Collapsed (implied) |
| `85:157926` | switch "Warnings 2" | panel `85:158973` |
| `85:157926` | tab "Planning groups" | `85:158979` |
| `85:158979` | "Create a group from this match" | `85:162182` |
| `85:158979` | "Move to “Required by management”" | `85:160926` |
| `85:162182` / `85:160926` | ↶ undo on the APPLIED card | back to `85:158979` (implied by DS `IssueSolution`) |
| `85:160926` | "All" | `85:161557` |
| `85:161557` | a list row | that question's detail (implied by DS `IssueNavigator`) |
| group row hover | "⋯" | `85:160232` menu |
| group row | click caret/row | `85:159619` expanded |
| any | ‹ › | previous / next question (not drawn) |

Not drawn, but needed for a Data readiness flow (tag `[Assumed]` if built):
- **Accept all**: the APPLIED pattern, with the 31 safe inconsistencies cleared. The "With inconsistency" count and the "Data readiness" red indicator would drop.
- **Review individually**: probably filters the table to "With inconsistency".
- **Fix with Cooper** / **Leave out from this plan** per row: the row is resolved or excluded.
- Readiness rising, and "Optimize" becoming the next step.

---

## 6. Ambiguities / inconsistencies

1. **Tab counts vs pager totals:**
   - "Open questions 2" but the pager reads "1 / 3" (Data readiness) and "1 / 7" (Planning groups).
   - "Warnings 2" but the pager reads "1 / 4".
   - The gate indicators ("0/3", "1/2", "0/2") don't obviously map to either.
2. **Gate label:** the panel says "Optimization readiness". DS `ConfidenceGates` defaults to "Approval readiness" (pass a label).
3. **"Planning groups — Passed"** while the Planning groups tab still has 7 open questions at 0% resolved.
4. **Outlier count:** the KPI and filter say 23 outliers, but 34 red dots are drawn (24 above the band, 10 below). The inconsistency count (47) also appears in the Cooper question ("31 of 47").
5. **"Ready to optimize 98%" vs "Optimization readiness 35%"**: two different readiness numbers on the same screen.
6. **Placeholder data:**
   - Every Data readiness row has code "INV-2026-0910" and value "2.3M".
   - Elmwood Feeder 2 appears 3× with different costs.
   - Planning groups rows repeat 3 investments.
   - Map all of these to real Whistler records instead of copying them.
7. **Row 8** differs between the Collapsed (West Corridor $5.6M) and Expanded (Elmwood $480K) frames.
8. **Only rows 1–2 carry an issue chip and solution**, though 47 have inconsistencies. Which solution label appears (Fix with Cooper vs Leave out) presumably depends on the issue type, but no rule is given.
9. **"Created new group" shows "Coastal storm programme 6"** for a 3-investment match, and "Under consideration" stays 1417 (the move frame does subtract: 1414). The bar chart never updates after either action.
10. **Group menu frame `85:160232`** shows the new group existing while the question is still unresolved (0%).
11. **Solution card anatomy differs by tab.** Data readiness and Warnings cards are title-only and have an Upload file / My answer footer. Planning groups cards have title + description and no footer. The pager button reads "All questions" / "All warnings" / "All".
12. **The bottom bar differs by tab:** "COOPER'S CONTEXT · 16 Documents · upload" appears on Data readiness only.
13. **Clipped hidden rows** in the Data readiness table (Battery Storage, Recloser Swap-outs, Northgate Substation) are layer leftovers.
14. **The Warnings-tab panel exists only as a loose `sidebar-organism`**, not as a full frame.
15. **Grammar in Figma copy:** "They stop competing for funding and forced into every scenario." (sic). Keep it verbatim, or flag it to the designer.
