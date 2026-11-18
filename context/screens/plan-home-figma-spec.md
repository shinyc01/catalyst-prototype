# Plan Home, the Optimizing badge and the Compare header: Figma screen spec

Source: Figma file `Dv3HzkcFTTrb4E34zLF7cy`, section **85:83781** "Entry point" (5193×3309). The section holds three labelled columns: sticky 85:83782 "Entry point" (an empty phone-like gradient card), sticky 85:87502 "Plan Home" and sticky 85:83783 "Compare".

Every frame was screenshotted at 1440 px wide, and the screenshots are the source of truth. Dev-note text and the popover copy were taken verbatim from `get_design_context`. Copy in "quotes" is exact. "~x/y" values are approximate pixel positions in the frame. Chart values marked "≈" were read off the pixels and are **not** data; they must come from `shared/` and be tagged `[Figma]` as approximate.

Local screenshots (not part of the repo): `/private/tmp/claude-503/cat/plan/*.png` (`home.png`, `compare900.png`, `cmp2.png`, `snack.png`, `collapsed.png`, `section.png`).

| Node | Frame | Size |
|---|---|---|
| 85:86495 | Plan home | 1440×1492 (Container 85:86496 is 1452 tall, plus the bottom bar 85:87501) |
| 85:83784 | Scenario compare: collapsed progress snackbar (long scroll) | 1440×2921 |
| 85:85442 | Scenario compare: expanded progress popover | 1440×900 |
| 85:84740 | "Collapsed": snackbar dismissed, so only the NavBar badge is left | 549×144 crop of the Compare top-right |
| 85:87510 | Dev note (on the NavBar badge of Plan home) | 356 wide |
| 85:87503 | Annotation text above the Compare frame | text |

---

## 1. Shared shell

The theme is dark: a black page, cards on `elevation-1` (~rgba white 5%), white primary text, `text/secondary` #ccc, and `text/tertiary` #8c8c8c.

### 1.1 NavBar: `nav-bar-organism` 85:86511 (48 px, bottom hairline, blurred)
- **Left:** `logo` (IFS Copperleaf). Pages slot with `nav-bar-page-atom` items: "Command", "Value", "Explore", "Build", "Plan" (active: `element/header-item/fill/active` grey pill), "Results".
- **Actions slot (right):**
  1. **Optimizing badge.** `badge-atom` I85:86511;3412:29465;85:86498 is a 103×24 pill with fill `element/button/secondary/fill/default`, `radius-full`, left padding 4 and right padding 8. It holds a `progress-ring-molecule` (16 px, spinning ring) and the label "Optimizing..." (Label/M medium, 12 px, white). The label uses three ASCII dots.
  2. `icon-button` system-search, then `icon-button` system-settings.
  3. `icon-button-notification` (bell with a red `status-indicator-atom` Error + stroke dot).
  4. `avatar-organism` "JP".
- **Badge rule (dev note 85:87510, verbatim):** "Visible across all sections while optimization is running. Once it finishes, the badge disappears and a notification links to the results."
  - The note's dotted purple connector points down at the badge.
  - The note uses the standard style: white box, 2px dashed `border/accent-purple`, radius 12, "DEV NOTE" label.

### 1.2 Bottom bar: `Evidence-strip-bar/all actions` 85:87501 (40 px, top hairline)
- **Left:** "COOPER'S CONTEXT", a "16 Documents" button (doc icon) and an upload icon button.
- **Right on Plan home:** chips "What needs my attention?" and "Are we on track against strategy?", then the Cooper orb.
- **Right on Compare:** chips "Explain gaps in confidence" and "Why this scenario?", then the orb.

### 1.3 Right rail: `sidebar-organism` 85:87500 (48 px wide, collapsed)
- At the top is a "←|" expand icon with a small red dot. This is the same as the Compare frames, where it is the collapsed comments/Cooper panel.

---

## 2. Plan home: 85:86495

### 2.1 Left Plan sidebar: `sidebar-organism` 85:86697 (240 px, border-right `border/base`, padding 12)

**Title row:** "Plan" (H3 uppercase, `text/secondary`) plus an `icon-button` arrow-bar-left "←|" (collapse).

**Tree** (32 px rows, caret 12 px plus `chat-folder` icon 16 px, Body/M medium 12 px). Expanded rows have a 1px `border/base` outline with radius 4. Indent is 18 px per level, and child lists have a curved vertical guide line.

| Level | Row | State |
|---|---|---|
| 0 | ▸ folder "DC Water Capital Improvement Prforgram" | Collapsed. The source has the typo "Prforgram" and renders truncated as "DC Water Capital Improvem...". |
| 0 | ▾ folder "Whistler Americas" | Expanded, outlined, white text |
| 1 | "Claude optimisation test" | Leaf (`content-row-molecule`), no icon |
| 1 | ▸ folder "Demo portfolio" | Collapsed |
| 1 | ▾ folder "Electrical" | Expanded, outlined, white |
| 2 | **"Electrical Distribution"** | **Selected.** Fill `background/elevation-1/secondary`, white text. |
| 2 | "Electrical Transmission" | Leaf |
| 1 | ▸ folder "Electrical Generation" | Collapsed |
| 0 | ▸ folder "Distribution" | Collapsed |

**Section "AD HOC PLANS":**
- H4 uppercase heading in `text/disabled`, with a hairline above it, and an `icon-button` "+" (system-plus) on the right.
- Rows: "All Transformer Investments", "Ridgeview Village — All Infrastructure Work" (white, truncated to "Ridgeview Village — All Infrastruct..."), "Pluto Unit 4 Outage — 2026", "My investments".
- Hidden layers in the tree use the placeholder names "Hydro" and "Description". They don't render.

### 2.2 Page header (content column x 252–1380)
- **Title:** "Electrical Distribution" (~20 px, white).
- **Description** (2 lines, grey 12–13 px): "Distribution network capital plan for the Whistler Americas service territory — feeders, transformers, reclosers and reliability upgrades that keep power flowing to end customers."
- **Right, baseline-aligned:** "Owner" (grey), then an avatar "UN" (outlined circle) and "[a placeholder owner name]" (shown in the prototype as the invented Portfolio Owner, Owen Fitch). The initials don't match the name; see §6.
- A hidden "Cooper" eyebrow (85:86703, cooper-icons plus "Cooper") exists in the layer tree but is not visible.

### 2.3 PLANNING CYCLES card (`content-card-organism`, y~145–312)
- **Header:** "PLANNING CYCLES" (grey uppercase). At the right is a pager: an outlined pair of buttons "‹" (enabled) and "›" (disabled/dim).
- **Horizontal row of cycle tiles** (~200×90, dark, 1px border). The row is clipped on the left, where a partial tile shows "…CHIVED", so it scrolls with the pager.
- Each tile has three lines:
  - top line: the cycle on the left and a status on the right (uppercase, small);
  - big value (~20 px);
  - range (grey, small).

| Tile | Status (right) | Big value | Range |
|---|---|---|---|
| (partial, cut off) | "…CHIVED" | — | — |
| "FY23" | "ARCHIVED" (grey) | "100%" | "FY23-FY27" |
| "FY24" | "ARCHIVED" | "93%" | "FY24-FY28" |
| "FY25" | "ARCHIVED" | "78%" | "FY25-FY29" |
| "FY26" | "ACTIVE" (green) | "56%" | "FY25-FY29" (sic; see §6) |
| **"FY27"** (selected: lighter fill, light border) | "NEXT" (orange) | "Optimizing" | "FY27-FY31" |

### 2.4 FY27 cycle header (y~340–405)
- "FY27 cycle" (~16 px, white).
- **Tabs** (`tab`, underline style): "Overview" (active, white underline) | "Scenario library".
- **Right:** an outlined square icon button (bar-chart icon, which opens widgets), a thin vertical divider, and "Compare results" (primary white button, black text).
- A click markup (pink "Focus Click" hand) sits on "Compare results". A purple connector 85:87507 runs from it to the Compare frame 85:83784. **Clicking "Compare results" opens Scenario comparison.**

### 2.5 KPI row: 4 `stat-card-organism` tiles (y~420–488, equal width)

| Label | Value |
|---|---|
| "Total value" | "7.36M" |
| "BCR" | "7.65" |
| "Total investments" | "39,498" |
| "Horizon" | "FY27-31" |

### 2.6 CYCLE PROGRESS card (left half, x 252–810, y~500–775)
- **Header:** "CYCLE PROGRESS", with a round Cooper icon button (dot-grid) at the right.
- **Stage rows.** Each is a dark row bar (~32 px) with a caret, an uppercase stage label and an action on the right. A status icon sits to the left of the bar, and a vertical connector line joins the icons.
  1. **SETUP.** Icon: green filled check circle (`status-success-filled`). Caret "▸" (collapsed). Label "SETUP". Right: "View details".
  2. **COMPARE.** Icon: spinner ring (in progress). Caret "▴" (expanded). Label "COMPARE". Right: "View details". The expanded sub-items each have a dotted-circle (pending) icon and a value on the right:
     - "Scenarios optimized": "22%"
     - "Final scenario selected": "• Not started" (grey dot)
     - "Approval readiness passed": "• Not started"
  3. **APPROVE.** Icon: dotted circle (queued). Caret "▸". Label "APPROVE". Right: "• Queued".
- The DS pieces look like `status-readiness-molecule` (7 instances) and `status-indicator-atom`, with `indicator-atom` dots.

### 2.7 AFFECTED AREA card (right half, x 822–1380, y~500–775)
- **Header:** "AFFECTED AREA" plus a Cooper icon button.
- **Map image:** a dark 3D substation/streets render with:
  - pins "Recloser R-1" (red, left) and "Demeter SS" (right);
  - a red dashed path through numbered nodes "6", "5", "4", "3", "2", "1";
  - a red "88%" badge between 2 and 1;
  - power poles (`Pole` ×9), `dot-pin` ×16 and `Electric Flow Direction Indicator` ×6 layers.
- A square map-icon button sits at the top right of the map.
- This is the same image as the Command featured card and Investment overview; it is reused.

### 2.8 YEARLY FORECAST VS BUDGET card (full width, y~790–1130)

**Header:**
- "YEARLY FORECAST VS BUDGET", then a `segmented-control-icon` with two icons: bar chart (selected) and table.
- **Right:** a segmented text switcher: "CAPEX" (selected, grey chip), "Capital", "OMA", "OPEX", "Revenue". Then a divider and a Cooper icon button.

**Chart:**
- Y axis: "$50M", "$40M", "$30M", "$20M", "$10M", "$0M". X axis: "FY27", "FY28", "FY29", "FY30", "FY31".
- It is a stacked column chart with full-width columns and small gaps. Bottom to top the stack is Initial (purple), Long-term planning (pink) and Short-term planning (teal).
- A dashed grey **Budget** line has dot markers at each year centre.

| Year | Initial ≈ | Long-term ≈ | Short-term ≈ | Stack top ≈ | Budget point ≈ |
|---|---|---|---|---|---|
| FY27 | $5M | $5M | $5M | $17M | $35M |
| FY28 | $23M | $10M | $3M | $38M | $27M |
| FY29 | $12M | $9M | $1M | $24M | $19M |
| FY30 | $2M | $3M | $1.5M | $7M | $12M |
| FY31 | $1M | $1M | $1M | $4M | $7M |

- **Legend** (centre): "Initial", "Long-term planning", "Short-term planning", "Budget" (dashed outline swatch).

### 2.9 RISK MITIGATED card (left half, y~1145–1430)
- **Header:** "RISK MITIGATED" plus a Cooper icon button.
- Y axis: "100%", "80%", "60%", "40%", "20%", "0". X axis: "FY 27", "FY 28", "FY 29", "FY 30", "FY 31" (with spaces, unlike the forecast chart).
- **Series:**
  - "Residual risk (this plan)": solid purple line with dots, ≈ 43% → 36% → 28% → 18% → 8%.
  - "Baseline risk (no investment)": dashed grey line, ≈ 67% at FY27 rising to ≈ 91% at FY31, with no dots.
- **Legend:** a filled purple swatch for "Residual risk (this plan)" and a dashed-outline swatch for "Baseline risk (no investment)".

### 2.10 VALUE CONTRIBUTION BY MEASURE card (right half, y~1145–1430)
- **Header:** "VALUE CONTRIBUTION BY MEASURE" plus a Cooper icon button.
- It is a horizontal diverging bar chart (`bar-chart-item` bars) with a dashed zero line.
- X axis: "-30k", "-20k", "-10k", "0", "10k", "20k", "30k".

| Row label | Bar | ≈ value |
|---|---|---|
| "Electrical Distribution Reliability" | red, negative | −14k |
| "Electrical Delivery Capacity" | red, negative | −4k |
| "Compliance Risk" | green | +2k |
| "Financial Benefits-OPEX" | green | +4k |
| "Project Execution Risk" | green | +14k |
| "Total Investment Cost" (white/primary label) | green **outlined** bar | +8k |

- This chart matches the "INVESTMENT VALUE" chart on Command → Investment overview. Same labels, same order.

### 2.11 Scroll
- There is a scroll bar (85:87398) on the content column, so the content column scrolls under a fixed NavBar and bottom bar.

---

## 3. Optimizing progress: snackbar and popover states (Compare frames)

These are DS `snackbar-organism` panels: 400 px wide, `surface/secondary-alpha` with strong blur, 1px `border/base`, `radius-200` (8), elevation-1 shadow and padding 12. They are anchored at the top right of the content area (x 980, y 100), below the page header and overlapping the scenario cards.

### 3.1 Collapsed snackbar: 85:84701 in frame 85:83784 (400×86)
- **Row 1:**
  - Left: title "Optimizing 3 scenarios" (H4 medium 12 px, white) over "01:24 / ~1sec remaining" (Body/M regular, `text/secondary`).
  - Right: secondary `button` "Show progress", then an `icon-button` "×" (system-close).
- **Row 2:** `progress-bar-loading`, a 4 px track (`background/elevation-2/primary`) with a white fill, followed by "22%" (H3 medium 14 px).
  - The fill is visually ~35% of the track (padding-right 244 of 376), and the layer is named "80%". See §6.
- **Click markup:**
  - On "Show progress": connector 85:87504 goes to frame 85:85442 (the expanded popover).
  - On "×": connector 85:87515 goes to frame 85:84740, where the snackbar is gone and only the NavBar "Optimizing..." badge remains.
- **Hidden layers** inside the same organism (not rendered): "$3.2M", "2yr" and "saved 3:44 AM" (85:84707/09/11). They are probably a *completed / result* variant of the snackbar, but that is not shown. See §6.

### 3.2 Expanded popover: 85:86349 in frame 85:85442 (400×346)

**Row 1:**
- Title "Optimizing scenario" (singular) over "01:24 / ~1h remaining".
- Right: secondary button "Hide progress" and "×".

**Row 2:** progress bar plus "22%", the same as above.

**Steps list.** This is a `content-card-organism` holding an `activity-timeline` list. Each step has a 16 px status icon plus a vertical line to the next step, a title (H3 medium 14 px) and an optional time on the right.

1. **Active step** (filled/ring icon, white title): "Checking readiness before spending compute", with time "01:24" on the right. Sub-items (`chat-link-item`, ↳ corner-down-right-arrow icon, Label/M, 75% white):
   - "Validating 12 constraints"
   - "Checking data quality across 200 investments"
   - "Verifying the run against the 45M-decision limit"
   - "Preparing the solver"
2. Pending step (dotted icon, `text/tertiary` grey): "Checking readiness before spending compute". This is a duplicate title in the source; the brief calls this step "readiness check".
3. Pending: "Solving"
4. Pending: "Validating" (last step, no connector line)

**State model implied by the frames:**
```
[running] NavBar badge "Optimizing..." (all sections)
   └─ on Compare: snackbar collapsed ("Show progress", ×)
        ├─ Show progress → popover expanded (steps; "Hide progress" → back to collapsed)
        └─ × → snackbar closed; badge stays in NavBar (85:84740)
[finished] badge disappears + notification that links to results (dev note; no frame drawn)
```
- Step order: readiness check → solving → validating. The time readout format is "elapsed / ~remaining".

### 3.3 Collapsed state: 85:84740 (crop of the Compare top-right)
- NavBar right: the "Optimizing..." badge (spinner ring), search, gear, bell (red dot) and avatar "JP".
- Page-header right: "3/5" (people icon), comment icon button, divider, and "Send for approval" (disabled).
- Right rail "←|" with a red dot. There is no snackbar.

### 3.4 Notification
- **No notification frame exists in this section.** The only spec is the dev note ("a notification links to the results"). The bell's red dot is present in every frame, both while running and on Plan home.

---

## 4. Compare: header area and scenario cards (summary level)

Frames 85:83784 (long scroll, collapsed snackbar) and 85:85442 (900 tall, expanded popover) have the same layout.

**Annotation above the frame (85:87503, verbatim):** "baseline will already be here, rest of the scenarios get populated as the results come in".

### 4.1 Page header: `page-header` 85:83805 (40 px)
- **Left:** "‹" back, then "Electrical Distribution", "FY27" (grey) with a ▾ chevron (`segmented-control-icon` / dropdown), then "• Planning" (purple/blue dot).
- **Centre:** `stepper-organism` with "✓ Setup" (done, white underline), "Compare" (active, spinner icon, hatched underline) and "Approve" (dotted icon, grey underline).
- **Right:** collaboration "3/5" (people icon), a comment icon button, a divider, and "Send for approval" (disabled, grey).
- A `canvas-header` (1360×39) follows. Hidden text in it reads "While you were away — Portfolio Auctioneer ran 1.4…" (85:84763) and is not rendered.

### 4.2 Title and scenario cards
- "Scenario comparison" (~20 px). Under the title is a thin full-width grey line (probably a loading bar).
- A row of scenario cards (~320 wide). The long frame shows 5 cards, scrolling horizontally; the 900 frame shows 3 plus the popover.
- **Baseline card** (selected: 1px light border, filled):
  - "Baseline"
  - "$41.3M" with "baseline" (grey, small)
  - chip "174 investments"
  - "~3% YoY · leaves Wildfire gap open"
  - inset box: "Retained risk", "$11.0M", "≈27% of exposure"
  - full-width disabled button "✓ Final plan"
- **Other cards** ("Min cost", "Mid", and further cards hidden behind the popover):
  - the title, then skeleton shimmer blocks for the value, chip and sub-line;
  - an inset "Risk reduced" box with a skeleton value;
  - footer: a square refresh icon button plus "Select as final plan" (secondary).
- **Behaviour per the annotation:** baseline is filled immediately, and the other scenario cards fill in as results arrive. Until then they are skeletons.

### 4.3 Below the cards (for orientation only)
- **Tabs:** "Overview" (active) | "Value measures and constraints" | "Investments". A chart icon button sits at the right.
- **VALUE COMPARISON:**
  - KPI tiles: "Baseline" "3M", then "Max cost", "Min cost", "Mid -5%" and "Mid" (skeleton).
  - A diverging stacked bar per scenario: "Baseline", "Min cost", "Mid −5%", "Mid", "Mid +5%", "Max cost". Only Baseline is coloured; the rest are skeleton.
  - X axis "-$6M" to "$6M".
  - Legend: "Total Risk", "CAPEX Cost", "CM", "OPEX Cost", "Project Manager Hours Required", "Total Investment Cost".
- **STRATEGIC OBJECTIVE CONTRIBUTION:**
  - Radar with axes "Reliability", "Wildfire", "Safety", "Compliance", "Load growth".
  - Legend: "Baseline", "Min cost", "Mid −5%", "Mid", "Mid +5%", "Max cost", "100% target" (dashed).
- **FORECAST COMPARISON BY YEAR:**
  - Columns "FY 26" to "FY 30". Each has "Baseline ▾ -$0.5M" (red) plus skeleton rows "Min cost", "Mid −5%", "Mid", "Mid +5%", "Max cost".
  - A grouped bar chart with y axis up to "$2.5M".
- **CUMULATIVE RISK REDUCTION:** line chart, 0–100%, FY 26 to FY 35.
- **ANNUAL RISK REDUCTION - ALL SCENARIOS:** grouped bars, FY 26 to FY 30.

---

## 5. Interactions summary
1. **Plan home → Compare:** "Compare results" opens Scenario comparison (connector 85:87507).
2. **While optimization runs:** the "Optimizing..." NavBar badge (progress ring) shows on every section.
3. **Compare snackbar:** "Show progress" expands to the steps popover, and "Hide progress" collapses it again. "×" closes the snackbar, and the badge remains.
4. **On finish:** the badge disappears, and a notification links to results. The notification is not drawn.
5. **Results stream in:** baseline first, then the other scenario cards replace their skeletons.
6. **Plan sidebar:** the tree expands and collapses with carets, the selected plan is highlighted, "←|" collapses the sidebar, and "+" adds an ad hoc plan. Only the tree behaviour is implied by the frames; "←|" and "+" are not shown being used.
7. **Planning cycles:** the "‹ ›" pager scrolls the cycle tiles, and clicking a tile selects the cycle. Selection is implied by the FY27 highlight.
8. **Charts:**
   - Forecast: the chart/table toggle and the CAPEX/Capital/OMA/OPEX/Revenue switcher.
   - Every card has a Cooper icon button.

---

## 6. Inconsistencies and ambiguities
1. The FY26 tile range reads "FY25-FY29", but the other tiles follow FYn to FYn+4, so it would be FY26-FY30.
2. The owner avatar initials are "UN" but the name is "[a placeholder owner name]" (shown in the prototype as the invented Portfolio Owner, Owen Fitch).
3. The sidebar typo "Prforgram" in the source.
4. The snackbar title changes: "Optimizing 3 scenarios" (collapsed) vs "Optimizing scenario" (expanded). The remaining time also changes: "~1sec remaining" vs "~1h remaining", at the same 01:24 elapsed and 22%.
5. The progress fill is ~35% wide while the label reads "22%", and the layer is named "80%".
6. Steps 1 and 2 have the same title, "Checking readiness before spending compute". The brief lists three phases (readiness check → solving → validating), so step 2 is likely a leftover duplicate.
7. The NavBar badge reads "Optimizing..." (three dots), but the FY27 tile status reads "Optimizing".
8. The Cycle progress row "Scenarios optimized 22%" matches the popover's 22%. Is it the same source of truth?
9. The notification on completion is described in the dev note only; it has no design. The hidden snackbar layers "$3.2M", "2yr" and "saved 3:44 AM" may be its intended content.
10. X-axis labels differ: "FY27" (forecast) vs "FY 27" (risk mitigated, Compare charts).
11. The Compare value-comparison KPI tile order ("Baseline, Max cost, Min cost, Mid -5%, Mid") differs from the bar-row order ("Baseline, Min cost, Mid −5%, Mid, Mid +5%, Max cost").
12. Hidden layers in Plan home (extra `content-card-organism`/`breadcrumb-organism` blocks and the "Cooper" eyebrow) and in Compare ("While you were away — Portfolio Auctioneer ran 1.4…") are not rendered. Ignore them unless the designer confirms.
