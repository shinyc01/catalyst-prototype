# Command (Home) — Figma screen spec

Source: Figma file "Command handover", fileKey `QSh5FbHQ86rlWo0ViZCIDR`. Every frame was screenshotted at 1440 px wide, and the screenshots are the source of truth. Dev-note text was taken verbatim from the note nodes. Copy in "quotes" is exact. "~x/y" values are approximate pixel positions in the 1440×900 frame.

Local screenshots (not part of the repo): `/private/tmp/claude-503/cat/cmd/*.png`

---

## 1. Shared shell (Command page)

This is the dark theme throughout: a near-black page background (#000-ish), cards in very dark grey (~#141414 to #1a1a1a), white primary text and grey secondary text.

### 1.1 NavBar (height ~48, full width, bottom hairline)
- Left: the IFS Copperleaf logo (a white burst mark, a vertical divider, then "IFS Copperleaf").
- Primary nav items: "Command" (active: grey pill background, ~x192–280), "Value", "Explore", "Build", "Plan", "Results".
- Right: search icon, settings (gear) icon, bell icon with a red dot, then a circular avatar with initials. The avatar is "JP" for Investment Owner, "PA" for Asset Manager and "DM" for Portfolio Owner.

### 1.2 Left column (x 12–1048)
1. **Cooper eyebrow:** a small Cooper dot-grid logo plus "COOPER" in grey uppercase (y~68).
2. **Greeting:** "Welcome back, Jeff." (large, ~20px, white). The name changes per persona: "Priya." for Asset Manager and "Dana." for Portfolio Owner.
3. **Description:** "2.8M simulations completed while you were away. Here are the items that require your input and attention right now." (grey, ~13px).
4. **Tabs row (y~165)** with a hairline under the whole row. Each tab is a label plus a grey count badge. The active tab is white with a white 2px underline; inactive tabs are lighter grey. Default Investment Owner tabs: "My works 3", "Decisions 6", "Conversations 3", "Following 3".
5. **Ask-anything search (right of tabs, ~x688–1048, pill, outlined):** a Cooper sparkle-search icon, the placeholder "Ask anything about your work", and a mic icon on the right.
6. **Section header row (y~210):** the section title on the left in grey uppercase (e.g. "DECISIONS TO REVIEW"). On the right:
   - a segmented control: "Normal" | "High" | "Critical". "Critical" is selected by default (grey filled chip).
   - a thin vertical divider.
   - a square filter icon button (sliders icon, outlined). When its menu is open the button gets a blue focus outline.
7. **Card list.** The cards are full-width rounded rectangles (~radius 8) with ~8px vertical gap. They have a dark grey background and no border, except the featured card.
   - **Rank badge:** a small square grey number chip ("1", "2", …) at the far left (~x47).
   - **Featured card (rank 1, taller ~122px):** 1px light/orange-tinted border (warm gradient outline). The right half shows a 3D grid/map image fading in from the right: dark substation render, a red path between pins "Recloser R-1" and "Demeter SS", and a red "88%" badge. Metrics sit **below** the title/sub-line on the left. The arrow button is at the bottom right.
   - **Regular card (~72px):** title row (title + source tag) and a grey sub-line under it. Metric columns start at ~x560 and ~x692 (value on top in white, label below in grey). A square outlined arrow button ("→") sits at the far right (~x1020).
   - **Source tag:** small grey pill with white text: "Explore", "Build" or "Plan" (sources also include "Value" and "Results", per the sort-by-source options).
   - **Hover state:** card background lightens. A 6-dot drag handle appears left of the rank (~x23). On Decisions cards (and archived cards) a vertical kebab "⋮" button appears left of the arrow (~x988). On My works / Following / Conversations hover shows the drag handle only, with no kebab.

### 1.3 Right column (x 1072–1428, fixed while the list scrolls; see the dev note)
1. **"COOPER'S WORK RESULTS" card (y 60–328):** title in grey uppercase. Below it is a radial gauge illustration: concentric thin arcs with tick texture and a warm (brown/orange) glow in the centre. In the centre, "1 Year" (large white) over "Time horizon" (grey). Five metric chips (dark grey rounded boxes) sit around the arc, each with a small glowing white dot on the arc below it:
   - "24" / "Days saved" (bottom-left)
   - "12" / "Portfolio changes" (upper-left)
   - "66%" / "Automation" (top centre)
   - "12%" / "Risk reduction" (upper-right)
   - "$120K" / "Budget saved" (bottom-right)
2. **Milestone + Calendar card (y 340–800, single dark grey container):**
   - The header reads "Milestone" (white) on the left and "9d left" (grey) on the right.
   - A progress track with 4 dot nodes, with the first segment filled white (short). Labels: "Drafts", "Re-submit", "SG2 window", "Gate".
   - **Calendar sub-card (inset darker box):**
     - Header: "September 2026" plus a ▾ caret, and square prev "‹" / next "›" buttons.
     - Weekday headers: "MON TUE WED THU FRI SAT SUN".
     - The grid starts with greyed 29, 30, runs 1–31, then greyed 1, 2. Day "8" is in blue text (today).
     - Event markers are short coloured lines under the day number:
       - 4 = blue
       - 9 = red + blue
       - 10 = purple plus a "+2" counter under it
       - 18 = orange
       - 20 = red + orange + blue
     - "+ Add event": a full-width outlined/filled-grey button at the bottom of the calendar box.
   - **Legend** (coloured vertical tick plus label): "Milestone" (red), "Scheduled event" (orange), "Private event" (blue), "Regulatory events and signals" (purple, on a second line).

### 1.4 Bottom bar (y 860–900, full width, top hairline)
Right-aligned outlined pill chips: "Why is Northgate #1?" and "Brief me", followed by the Cooper orb (round, pink/pearl gradient). It is the same in every persona frame.

### 1.5 Investment Owner Decisions data (used by most Decisions frames)

| # | Title | Tag | Sub-line | Metric 1 (CPV) | Metric 2 (V/C) |
|---|---|---|---|---|---|
| 1 (featured) | "Northgate Cluster · 7 aging feeders replacement" | Explore | "7 aging feeders serving Ridgeview Village and ~9,400 customers — reliabilit..." (truncated) | "$18.1M" / "CPV" | "1,345 V/$K" / "V/C" |
| 2 | "EastZone C · Transformer Overload Risk" | Explore | "3 zones over safe capacity ahead of peak" (some frames: "3 zones are already operating above safe capacity and are expected to rema...") | "$12.4M" | "1,986 V/$K" |
| 3 | "Ridgeline Substation · Protection Relay Fault" | Build | "Relay protection upgrade serving West Corridor" | "8.6M" (no $) | "2,092 V/$K" |
| 4 | "Hera SS · Capacitor bank reactive support" | Plan | "Voltage sagging across the South Loop at evening peak" | "$7.3M" | "1,123 V/$K" |
| 5 | "Apollo SS · Tx Bank 1 end-of-life replacement" | Explore | "Lead transformer past expected life with a rising DGA trend" | "$22.6M" | "4,876 V/$K" |
| 6 | "Harbor feeders · Underground cable refurbishment" | Explore | "4 salt-exposed cable sections flagged ahead of storm season" | "$9.8M" | "1,583 V/$K" |

### 1.6 Dev-note callouts (design annotations, not product UI)
These are white boxes with a 2px dashed purple (#8366F7) border and radius 12. Each has a "DEV NOTE" grey uppercase label and body text, and is joined by a dotted purple connector ending in a dot at the element it explains. Do not render them in the prototype unless it has an annotation layer.

---

## 2. Decisions (Investment Owner)

### 26:63249 — Decisions — Default + Dev Notes
- Active tab: "Decisions 6". Section: "DECISIONS TO REVIEW". Rows 1–6 as in §1.5. Row 2 sub-line: "3 zones over safe capacity ahead of peak".
- No hover.
- Dev-note callout over the featured card's map, connected to the "Explore" tag: "Tag in the card shows where this item came from".

### 26:68968 — Decisions — Card Selected
- Same as default, but row 2 (EastZone C) is in the hover/selected state: lighter grey background, 6-dot drag handle left of rank "2", kebab "⋮" before the arrow. The cursor is a pointing hand near the left edge of the card (below the handle).
- No outline or border difference from hover is visible; "selected" looks identical to hover.

### 26:69404 — Decisions — Hover Card 2 (actually the drag in progress)
- Row 2 (EastZone C, still showing rank "2", handle and kebab, lighter background) is lifted and being dragged down. It overlaps the top of the Hera SS card. The cursor is a closed grab hand.
- The list behind has reflowed: 1 Northgate, then "3 Ridgeline Substation…" moved up into slot 2 (still labelled 3), then the dragged card, then "4 Hera SS…", "5 Apollo…", "6 Harbor…".

### 26:69186 — Decisions — Hover Card 3 (after drop)
- New order with re-numbered ranks: 1 Northgate, **2 Ridgeline Substation**, **3 EastZone C** (hovered: handle + kebab), 4 Hera, 5 Apollo, 6 Harbor. Ranks re-number after the drop.

### 26:70101 — Decisions — Hover Card Row
- Row 2 hovered with the cursor on the right side of the card (~x955). The visuals are the same as the Card Selected frame (handle, kebab, lighter background).

### 26:70325 — Decisions — Card Context Menu
- Row 2 hovered. The kebab button is in a pressed state (grey square background) with the cursor on it.
- A dropdown menu opens below it, right-aligned to the kebab (~x840–998, y 426–488). It is a dark panel with a 1px border and two items with icons:
  - clock icon "Remind me later"
  - archive-box icon "Archive"

### 26:70555 — Decisions — Risk Description Expanded
- Row 2 hovered. Its sub-line is the long, truncated version "3 zones are already operating above safe capacity and are expected to rema...".
- With the cursor hovering the sub-line, a tooltip appears below it: black background, white text, ~3 lines, ~290px wide, left-aligned with the sub-line. Text: "3 zones are already operating above safe capacity and are expected to remain overloaded ahead of the upcoming peak demand period."

### 26:70774 — Decisions — Tooltip: CPV
- Row 2 hovered (long sub-line). The cursor is on the "CPV" label, and a tooltip below it (black, one line) reads: "What the investment costs in today's money."

### 26:70993 — Decisions — Tooltip: VIC
- Row 2 hovered. The cursor is on the "V/C" label, and a two-line tooltip reads: "Value generated per $1K of investment — higher means more value for the cost."

### 26:67753 — Decisions — Sort by Urgency
- The filter icon button is active (blue outline). A dropdown under it is right-aligned (~x868–1046, y 230–346) and overlaps the featured card's right side. Items:
  - "Sort by urgency" ✓ (check mark at right)
  - "Sort by date" (hovered by cursor)
  - "Sort by source"
  - "Sort by collaborator"
- Segmented control: "Normal | High | Critical" (Critical selected). Row 2 uses the long sub-line.

### 26:68449 — Decisions — Sort by Date
- The segmented control is replaced by date presets: "Last year" | "Last month" | "Last 7 days" | "Last day" (selected) | "Custom range" (the cursor hovers it).
- The menu is open with "Sort by date" ✓. In this frame the filter button shows no blue outline.

### 26:68681 — Decisions — Date Range Picker
- Presets row with "Custom range" selected (grey text in a chip). A popover anchored under the presets (~x702–1000, y 227–582) contains:
  - Header band: "DATE RANGE" (grey uppercase).
  - A date input with calendar icon, value "13.02.2026 — 17.02.2026" and a text caret. It has a "×" clear icon and a focused blue border.
  - Next to the input, an "Apply" button (grey).
  - A month calendar: "September 2026 ▾" with ‹ › buttons, MON–SUN headers and the same grid as the main calendar. 13 and 17 are range endpoints (lighter grey filled squares); 14–16 are in-range (subtle grey band).

### 26:67985 — Decisions — Sort by Source
- The presets are replaced by source chips: "Value" | "Results" | "Plan" | "Build" | "Explore" (selected).
- The menu is open with "Sort by source" ✓ (cursor on it), and the filter button has a blue outline.

### 26:68217 — Decisions — Sort by Collaborator
- Collaborator chips: "M.Karimi" | "F.Lee" | "T.Williams" | "A.Addams" | "L.King" (selected).
- The menu is open with "Sort by collaborator" ✓, and the filter button has a blue outline.

---

## 3. Responses (Conversations tab) and Comment focus

### Response row anatomy
- Rank chip.
- 32px round avatar with initials (coloured background).
- Title (white). Directly under it, the role (grey). Under that, a message line (grey, single line, truncated with "...").
- A status chip at ~x740 (vertically centred).
- At the right, the arrow button, or a bell button for "Wait for reply".

### 26:66392 — Responses — Default + Dev Notes (frame 1440×1031)
- Active tab: "Conversations 3". Section: "RESPONSES TO REVIEW". The Normal/High/Critical segmented control and filter button are present. **This frame has no Ask-anything search field.**
- Rows:
  1. Avatar "PN" (blue). Title "Priya Nair · Confirm Northgate intervention scope", role "Investment Planner", message "Shaped the $4.2M fix across all 7 feeders and ran it past Cost and Risk". Chip "@you" (grey pill). Arrow button.
  2. Avatar "MR" (amber, dark text). Title "M. Reynolds replied to your comment on the Wildfire Resilience weight", role "Product Lead", message "She'll back lifting it to 0.30 but wants the trade-off against Reliability spelled out before she signs off. A...". Chip "Rejected" (red text on dark-red pill). Arrow button.
  3. Avatar "JR" (blue). Title "J. Reyes replied to your comment on the Wildfire Resilience weight", role "Product Lead", same message as row 2. Chip "Approved" (green text on dark-green pill). Arrow button.
  4. Avatar "JR" (blue). Same title, role and message as row 3. Chip: an outlined pill button containing a mini "JR" avatar and "Confirm viability". Arrow button.
  5. Avatar "SC" (dark red/maroon). Title "S. Chen sent the load-transfer data you asked for", role "Data Engineer", message "Feeders 12 & 17 are running 88% and 91% — both over band, confirms the corridor read. I can re-run the...". Chip "Wait for reply" (grey pill). **Bell icon button** instead of the arrow.
- Dev note (pointing at the "Wait for reply" chip): "Collaboration card statuses: Commented (you can see comment), Approved, Rejected, @you, Wait for reply."
- Dev note (below the frame, pointing at the bottom-left of the list):
  1. "Click the → to open the entity page where the comment was made."
  2. "Click Bell button to send the reviewer an additional item under their Collaboration card list."

### 26:67077 — Responses — Default
- Same rows, with the Ask-anything search present. Row 5 (S. Chen) is hovered: lighter background and drag handle, no kebab. The bell button is still shown.

### 26:67414 — Responses — Wait for Reply: Notified
- Row 5 is hovered. The status area stacks two items: the "Wait for reply" chip, and below it "Last notified: Sep 3" ("Last notified:" in grey, "Sep 3" in white).
- The bell button is replaced by a disabled, greyed pill "🔔 Notified" (~x955–1032).

### 26:66740 — Responses — Hover Confirm Viability
- The cursor is on row 4's arrow button (the "Confirm viability" row). There is no visible change apart from the cursor (the arrow button hover is very subtle or absent). Row 5 shows the bell and no hover.

### 26:71694 — Comment Focus — Question
This frame is an entity page reached from a response card, not the Command shell.

**Header and page:**
- **NavBar:** "Build" is active (instead of Command).
- **Entity header bar (y~67):**
  - Left: "‹ Southern Feeder Replacem..." (truncated), "INV-2025-0842" (grey) with a ▾ chevron, then "• Refining" (purple dot).
  - Centre stepper: "✓ Shape", "✓ Review", "Refine" (active: spinner/sun icon, grey background, hatched underline), "Decide" (dotted-circle icon, inactive). Each step has an underline bar.
  - Right: a "3/5" chip with a people icon; a comment-bubble icon button (white outline, red dot, active); "Dismiss" (grey button); "Send for approval" (white primary button).
- **Left rail:** an expand icon "|→".
- **Page title:** "Alternative comparison", with two small view-toggle icon buttons (list, settings). Subtitle: "Investment alternatives evaluated against risk and return criteria". A partially hidden "3 s…" button sits at the top right of the content.

**Focused column "Full Replacement"** (blue 1px border running the full column height):
- "$4.2M" followed by "~ 3 – 5 years".
- Chip "All 7 feeders", then "9,400 customers protected".
- An inset box: "Risk reduced", "76%" and "of reliability scored".
- A disabled button "✓ Recommended".

The second column is mostly hidden behind the popover; its values are dimmed and its button reads "Set as recommended".

**Comparison table** (sections collapsible with a ▾ caret and a count badge):

| Row | Full Replacement | Column 2 (dimmed) |
|---|---|---|
| **FINANCIAL** (count 6) | | |
| "CAPEX" | "$22.5M" | "$22.5M" |
| "ROI" | "+18.2% ▲" (green) | "+22.4% ▲" |
| "Payback period" | "36 mo" | "28 mo" |
| "NPV" | "$4.2M" | "$5.8M" |
| "IRR" | "10.9%" | "11.4%" |
| "OPEX Impact" | "-210K/yr ▲" (green) | "-245K/yr ▲" |
| **RELIABILITY** (count 5) | | |
| "Risk Level" | "● MEDIUM" (orange dot) | "● LOW" (green) |
| "Failure Reduction" | "85%" | "92%" |
| "Reliabilit…" (cut off) | | |

**Comment popover** (anchored over the column, ~x424–818, y 182–404):
- Header: "COMMENT #52" ("#52" in grey), then "⋯", a ✓-circle (resolve) and "×".
- Body: avatar "JR", "James Reyes", "1d ago" (grey). Text: "The scope covers all 7 feeders, but the timeline is 3–5 years. Can we confirm if this is still viable for the current reliability risk window?"
- Reply row: avatar "JP"; input with placeholder "Add a comment"; a Cooper dots icon, a mic icon and a round send button (disabled).

**Right "COMMENTS" panel** (x 1048–1428, with "×"):
- Tabs: "Unresolved" (active) | "Resolved".
- Search: "Ask anything about comments" with a mic.
- List:
  - Avatar "MC" (pink). Chip "Action required" and a blue unread dot. "#54 • Targeted Hardening". "Maria Chen 30 min ago". Text: "Can we revise this alternative to keep delivery under 12 months and avoid planned outages during peak summer demand?"
  - **Selected item** (lighter background with border; shows "⋯" and ✓-circle): avatar "JR". "#52 • Full Replacement". "James Reyes 1d ago". Same text as the popover.
  - Avatar "LG" (green), blue dot. "#51 • Full Replacement". "Lara Green 1d ago". Text: "Thanks, this option clearly explains the long-term trade-off. Keeping it in the comparison helps show why the faster alternatives are being considered."
  - Avatar "KO" (pink), blue dot. "#52 • Financial comparison". "Katarina Olsson 1d ago" (cut off).

**Bottom bar** (different from Command): on the left, "COOPER'S CONTEXT", a "16 Documents" button (doc icon) and an upload icon button. On the right, chips "Generate Annualized outcome risk by risk type chart" and "Compare to best practice", then the Cooper orb.

### 26:69635 — Comment Focus — Action Required
**Header:** the same entity chrome, but the header title is "‹ Grid lines — substation retr..." (still "INV-2025-0842", "• Refining"). The comments icon has no red dot.

**Columns:**
- "Full Replacement" is dimmed.
- **"Targeted Hardening"** is focused with a warm/orange 1px border: "$2.6M ~ 8 months", chip "5 of 7 high-risk feeders", "Reconductor worst segments only", "Risk reduced 43% of reliability scored", and a "Set as recommended" button (enabled, outlined).
- A third column is cut off by the panel ("Rea…", "$0…", "Fe…", "4,10…").

**Table values:**

| Row | Targeted Hardening | Third column (dimmed) |
|---|---|---|
| CAPEX | "$22.5M" | "$10M" |
| ROI | "+22.4% ▲" | "+8.1% ▲" |
| Payback period | "28 mo" | "48 mo" |
| NPV | "$5.8M" | "$1.4M" |
| IRR | "11.4%" | "11.2%" |
| OPEX Impact | "-245K/yr ▲" | "-95K/yr ▲" |
| Risk Level | "● LOW" (green) | "● HIGH" (red) |
| Failure Reduction | "92%" | "38%" |

**Cooper panel** (top right, x 1048–1428, y 100–460, warm glow background):
- Header: Cooper logo with "COOPER"; "Speaking" with an orange waveform icon and a pause icon; an "Ask" button; a collapse icon; "×".
- Text: "After analyzing comment #54, I've generated a set of recommended actions to address this issue."
- "RECOMMENDED" (count 1): "▸ Refine Targeted Hardening Schedule".
- "OTHER" (count 3): "▸ Review Outage Windows", "▸ Reduce Delivery Scope", "▸ Recalculate Cost and Risk Impact". These are collapsible rows.

---

## 4. My works

### 26:65162 — My Works — Where You Left Off
- Active tab: "My works 3". Section: "WHERE YOU LEFT OFF". The row anatomy is title + tag, then a clock icon with a time stamp under it. Status sits at ~x590 and a note at ~x708 (2 lines).
- Rows:
  1. **Featured** (bordered, with map image; ~104px tall): "Grid lines — substation retrofit" [Build]; clock "Yesterday". Third line: chip "Updated" (blue text on dark-blue pill) followed by "Cooper filed 3 of 5 line edits you were away". Arrow at the bottom right. No metrics.
  2. "Justification — feeder tie-in" [Explore]; clock "Sep 2". Status "Draft" (plain white text, no pill). Note: "Untouched since you left off · resume at § b.". Arrow.
  3. "Resubmission — stage gate 2" [Build]; clock "Sep 1". Status chip "Updated" (blue pill). Note: "Diana received her open comment on line 18.". Arrow.

### 26:66078 — My Works — Hover Card
- Row 1 hovered: lighter background, drag handle and the cursor on the arrow. No kebab.

---

## 5. Following and Investment overview

### 26:65462 — Following — Projects I Follow
- Active tab: "Following 3". Section: "PROJECTS I FOLLOW". There are no source tags and no featured card. There are three metric columns at ~x496, ~x628 and ~x818.
- Rows:
  1. "Feeder tie-in — West Corridor" / "Upstream milestone delayed · shift awaiting your ok". Metrics: "$1.8M" CPV | "2,003" "Total investment value" | "1,024 V/$K" V/C.
  2. "Substation retrofit — Apollo SS" / "Upstream milestone delayed · shift awaiting your ok". Metrics: "$4.4M" | "8,430" | "1,914 V/$K".
  3. "Apollo SS • Tx Bank 1" / "Upstream milestone delayed". Metrics: "$2.8M" | "4,170" | "1,931 V/$K".

### 26:65769 — Following — Hover Card
- Row 1 hovered: drag handle, lighter background and the cursor on the arrow. No kebab.

### 26:72160 — Investment overview / Sidebar expanded
This is the entity page opened from a Following card (the arrow opens the entity homepage).

**Header:**
- NavBar: "Build" active.
- Header bar: "‹ Feeder tie-in — West Corri..." (truncated), "INV-2025-0842" ▾, "• Refining".
- Stepper: "✓ Shape", "✓ Review", "Refine" (active), "Approve" (dotted; the comment frames say "Decide" here).
- Right: "3/5", comment icon (no dot), "Dismiss", "Send for approval".

**Page:**
- Title "Investment overview". Subtitle "High-level investment summary, key metrics, and current progress". A "Widgets" button (bar-chart icon) on the right.
- **KPI cards** (4 across):

| Label | Value | Caption |
|---|---|---|
| "Benefit-cost ratio" | "2.5x" | "BENEFIT RETURNED PER $1 SPENT" |
| "Estimated cost" | "$4.2M" | "EXPECTED DELIVERY COST" |
| "Investment value" | "$23k" | "TOTAL EXPECTED VALUE" |
| "Baseline risk" | "$12.6M" | "RISK BEFORE INTERVENTION" |

- **"INVESTMENT DETAILS"** (Cooper icon button at top right). Key/value rows:
  - "Name": "Feeder tie-in — West Corridor"
  - "Code": "INV-2026-0418"
  - "Type": "Capital Replacement"
  - "Planning portfolio": "FY26–27 Distribution Capital · Northern Region"
  - "Problem statement" (stacked): "7 aging feeders serving Ridgeview Village and ~9,400 customers — reliability risk rising, flagged before failure, with an investment idea already drafted."
- **"AFFECTED ASSETS & AREA"** (Cooper icon button): a 3D dark map with "Ridgeview Village", "Recloser R-1" and "Demeter SS" pins, a red path with numbered nodes 1–6 and an "88%" badge, and a map-icon button at its top right.
- **"YEARLY FORECAST"** (Cooper icon button): purple vertical bar chart with y-axis "$0.5M", "$1M", "$1.5M", "$2M", "$2.5M" and 5 bars. It is cut off at the frame bottom.
- **"INVESTMENT VALUE"** (Cooper icon button): a horizontal diverging bar chart with a dashed zero line. Rows:
  - "Electrical Distribution Reliability" (red, large negative)
  - "Electrical Delivery Capacity" (red, small)
  - "Compliance Risk" (green, tiny)
  - "Financial Benefits-OPEX" (green, small)
  - "Project Execution Risk" (green, medium)
  - "Total Investment Cost" (green outlined bar, bold label)

**Right sidebar "SYSTEM CONFIDENCE"** (Cooper icon, collapse "|→"):
- "Approval readiness" with a ring progress and "35%".
- Checklist:
  - "✓ Investment readiness" — "Passed"
  - "○ Path forward" — "• 1 error" (red)
  - "○ Assumption consistency" — "• 1 error"
  - "○ Review blockers" — "• 1/2" (red) "• 1/3" (orange)
- Tabs: "Open questions 2" (active) | "Warnings 2".
- "2 / 10 (10% resolved)", an "All errors" button (list icon) and ‹ › pager.
- Question: "Urgency needs confirmation" / "The 12–18 month action window needs supporting evidence."
- "SOLUTIONS":
  - Highlighted (warm) card with Cooper icon: "Ask field team to confirm urgency" / "Ask the Field Team Lead to confirm the 12–18 month action window."
  - "Adjust urgency to lower confidence" / "Keep the action window as an early estimate and mark urgency as provisional until more evidence is added."
  - "Use peer benchmark" / "Compare this action window against similar feeder investments to confirm urgency." with a "Review details" button.
- Footer buttons: "Upload file" (upload icon) and "+ My answer".

**Bottom bar:** same as Comment Focus ("COOPER'S CONTEXT", "16 Documents", upload, and the two chips plus orb).

---

## 6. Snooze (Remind me later)

### 26:71226 — Snooze — Card Actions Menu
- Same as the Card Context Menu frame (row 2 EastZone C, short sub-line). The "Remind me later" item is hovered (lighter item background) with the cursor on it.

### 26:71456 — Snooze — Snoozed 7 Days Toast
- EastZone C has been removed from the list, and ranks re-number: 1 Northgate, 2 Ridgeline, 3 Hera, 4 Apollo, 5 Harbor. The tab count still shows "Decisions 6".
- **Toast:** bottom-centre of the left column (~x602–922, y 800–848). It is a dark panel with 1px border and radius 6. Text "Snoozed for 7 days." on the left, and an outlined small button "↶ Undo" on the right.

---

## 7. Archive

### 26:62188 — Archive — Card Actions Menu
- Row 2 kebab menu open; the "Archive" item is hovered.

### 26:62418 — Archive — Archived Section Collapsed
- EastZone C has been removed from the main list, which is now 5 rows (1 Northgate, 2 Ridgeline, 3 Hera, 4 Apollo, 5 Harbor).
- **The featured card now shows a split button "Review | ▾"** (outlined, at the bottom right) instead of the arrow.
- Below the list is a full-width collapsible header bar (grey background, ~32px): "▸" caret, archive-box icon, "ARCHIVED" (grey uppercase) on the left, and a count badge "1" on the right. The cursor is on the caret.

### 26:62704 — Archive — Archived Section Expanded
- The caret changes to "▴". The archived card appears below the header. It has **no rank number and no drag handle**, and the title starts at the left padding (~x28).
- Content: "EastZone C · Transformer Overload Risk" [Explore] / "3 zones over safe capacity ahead of peak"; "$12.4M" CPV; "1,986 V/$K" V/C.
- Kebab and arrow are visible (hovered; the cursor is on the card).

### 26:62963 — Archive — Remind / Unarchive Actions
- The archived card's kebab is pressed. The menu opens below it (~x872–1032, y 790–852) with:
  - clock "Remind me later"
  - archive-box "Unarchive"

---

## 8. Add event (calendar)

### 26:63472 — Add Event — Click Add Event
- Default Decisions page, with the cursor (hand) on "+ Add event". There is no other visible change.

### 26:63958 — Add Event — Modal: Empty
- The page is dimmed by a dark overlay. A centred modal (~394×344, x 522–916, y 278–622) has a dark panel, 1px border and radius 8.
  - Header: "NEW PRIVATE EVENT" (white uppercase) and "×", with a divider below.
  - Text input (filled dark grey) with placeholder "Event name".
  - Two columns: label "Date" with a field (calendar icon) placeholder "Select a date"; label "Time" with a field (clock icon) placeholder "Select a time".
  - Label "Lasts" with chips "1 day" (selected: white background, black text), "2 days", "3 days", "Custom" (outlined dark).
  - Helper text: "Only you see this event. The team timeline is set by your admin and shown to everyone."
  - Divider, then footer right-aligned: "Cancel" (outlined) and "Add" (disabled, grey fill and grey text).

### 26:64195 — Add Event — Modal: Filled
- Values: "Discuss asset strategy", Date "18.09.2026", Time "12:00", Lasts "1 day".
- "Add" is now enabled (white background, black text), and the cursor is on it.

### 26:64433 — Add Event — Created Toast
- The modal has closed. A toast at the same position as the snooze toast reads "Event created" with "↶ Undo".
- Calendar day **18 now shows two lines: orange + blue** (the new private event is added under the existing scheduled event).

### 26:64651 — Add Event — Toast + Calendar Highlight
- The toast is still visible. The cursor hovers day **10**, which gets a rounded 1px outlined box (hover state for the day cell). Day 18 still shows orange + blue.

### 26:64870 — Add Event — Day Detail Panel
- A right-side panel slides over the right column (x 1060–1440, full height including over the NavBar area). The rest of the page is dimmed and the toast remains (dimmed).
- Panel header: "September 10, 2026" and "×", with a divider below.
- Three event cards (dark grey, stacked). Each has a coloured left tick, a type label and a "time · duration" on the right; then a "Created by" row with avatar "JC" (orange) and "J. Carter"; then two equal buttons, "🗑 Remove" (outlined) and "✎ Edit" (filled grey):
  1. Orange tick: "Scheduled event", "11:15 AM · 1 day"
  2. Blue tick: "Private event", "11:15 AM · 2 days"
  3. Purple tick: "Regulatory events and signals", "11:15 AM · 2 days"

---

## 9. Empty state and Explore

### 26:63690 — Decisions — Default + Dev Notes (empty-state row)
- The tabs row has **no "My works" tab**: "Decisions 6" (active, first), "Conversations 3", "Following 3". Everything else is the same as the Decisions default.
- Dev note pointing at the tabs: "If we don’t have “My work” - don’t show it".

### 26:63919 — Explore - Globe view - Pin logic tooltip (frame 1440×810)
- NavBar **without "Command"**: "Value", "Explore" (active), "Build", "Plan", "Results". Avatar "AL".
- Sub-bar: search field "Search for..." with sparkle icon and mic, plus a filter (lines) icon button. On the right, "3/5" (people icon) and a comment icon.
- Left vertical tool rail (3 icons at the top), zoom "+" / "−" buttons, then 4 more icons (comment, select, layers, map).
- A "←|" collapse icon at the top right.
- Dark 3D globe (North America) with two cluster pins:
  - "456" (grey circle) with a red badge "3", label "Whistler Company"
  - "470", label "DC Water capital"
- The Cooper orb with an orange dot sits at the bottom right. **No tooltip is visible in the rendered frame** despite the name.
- Related dev note 26:63913: "If we don’t have anything at all - don’t show Home tab at all".

---

## 10. Asset Manager persona (Priya, avatar "PA")

The shell is identical; only the greeting is "Welcome back, Priya.". Metric labels change from CPV and V/C to **Health index / Risk / Age vs useful life**.

### 26:72678 — My Works — Where You Left Off
- Tabs: **"Discussions 8" (shown active/underlined), "Collaborations 8", "My works 9", "Followed works 3"**. Section: "WHERE YOU LEFT OFF". (The underlined tab does not match the content; see Inconsistencies.)
- Rows:
  1. **Featured:** "Study rider — Feeder 12" [Build]; clock "Last submitted"; chip "Updated" and "Cooper updated the budget layer while you were away."
  2. "Coverage triage plan — UG cables" [Explore]; clock "Last submitted yesterday"; status "Draft"; note "Unmatched error you left off – resolve at § b."
  3. "Vegetation dispatch notes — Feeder 6" [Build]; clock "Sep 1"; chip "Update" (blue; this word differs from "Updated"); note "Jordan attached two field photos to the open span."

### 26:72978 — Decisions — Default
- Tabs as Investment Owner ("My works 3", "Decisions 6" active, "Conversations 3", "Following 3"). Same 6 titles, tags and sub-lines as §1.5 (row 2 uses the long truncated sub-line). Metrics are replaced:

| # | Health index | Risk |
|---|---|---|
| 1 | "2.1" / "Health index" | "$28M ±14%" / "Risk" |
| 2 | "3.8" | "$15M ±22%" |
| 3 | "4.5" | "$12M ±18%" |
| 4 | "5.1" | "$9M ±25%" |
| 5 | "1.8" | "$34M ±12%" |
| 6 | "3.2" | "$18M ±20%" |

- Dev note 26:72668 (metrics):
  - "**Health Index (HI)** means how worn out the asset is, scored from 0–10. **Example:** 4.2 / 10 means the asset is in moderate condition."
  - "**Risk Score** means the expected cost of failure, adjusted for how likely the asset is to fail. **Example:** $675,000 ±18% means the estimated risk exposure is $675K, with an 18% uncertainty range."

### 26:73195 — Collaborations — Responses
- Tabs: "My works 3", "Decisions 6", "Conversations 8" (active), "Following 3". Section: "RESPONSES TO REVIEW".
- Rows:
  1. Avatar "JC" (blue). Title "Jordan Close · Jordan updated the inspection batch on Feeder 12 – Span 7", role "Field supervisor", message "Status: batch confirmed — the span status turned to exist. No violation, to 20 cm.". Chip "@you". Arrow.
  2. Avatar "PN" (amber). Title "Priya Nair · Priya approved the recalibration on the UG cable cohort", role "Product Lead", message "Recalibration approved. The UG cable cohort is cleared for the next inspection cycle.". Chip "Approved". Arrow.
  3. Avatar "SP" (blue). Title "Sam Patel · Sam rejected the crew pre-staging budget for the West feeders", role "Product Lead", message "Threshold hit: deviation hits the cost-limits — a stakeholder issue. Under $400K is acceptable, re-submi...". Chip "Rejected". Arrow.
  4. Avatar "DK" (blue). Title "Dana Kim · Dana mentioned you on the study rider for Feeder 12", role "Product analyst", message "@Priya can you action the scale to reflect the adjusted gross before the approval gate closes?". Chip: outlined pill with mini "DK" avatar and "@Priya can you actio..." (truncated). Arrow.
  5. Avatar "JC" (maroon). Title "Jordan Close · Jordan is completing the inspection backfill on Feeder 12", role "Field supervisor", message "Backfill in progress — 4 of 7 spans complete. Waiting on crew availability for the remaining sections.". Chip "Wait for reply". Bell button.

### 26:73531 — Followed Works — Portfolios
- Tabs: "My works 3", "Decisions 6", "Conversations 8", "Following 3" (active). Section: "PROJECTS I FOLLOW". Rows:

| # | Title / sub-line | Health index | Risk | Age vs useful life |
|---|---|---|---|---|
| 1 | "UG cable cohort" / "Coverage factor stage pending — risk grade shifted since last re..." | "5.1" | "$360K ±31%" | "29 of 45 yrs" |
| 2 | "Feeder 12" / "Completed 2 trade cycle · route cleared for next inspection." | "4.2" | "$670K ±11%" | "38 of 49 yrs" |
| 3 | "OH renewal — North" / "Downgrade within tolerance since March reanalysis." | "6.4" | "$210K ±12%" | "22 of 45 yrs" |

---

## 11. Portfolio Owner persona (Dana, avatar "DM")

The greeting is "Welcome back, Dana.". Metric labels change to **Forecast vs constraint / Total value / Total value selected / Total value unselected**.

### 26:73853 — My Works — Where You Left Off
- Tabs: "My works 3" (active), "Decisions 3", "Conversations 3", "Following 3". Section: "WHERE YOU LEFT OFF".
- Rows:
  1. **Featured:** "Re-optimization —CAPEX 2027" [Build] (no space after the em dash, as in source); clock "Overnight"; chip "Updated" and "Cooper re-ran the draft with Q3 actuals while you were away."
  2. "Coverage triage plan — UG cables" [Explore]; clock "Yesterday"; status "Draft"; note "Unmatched error you left off – resolve at § b."
  3. "Vegetation dispatch notes — Feeder 6" [Build]; clock "Sep 1"; status "Draft"; note "Unmatched error you left off – resolve at § b."

### 26:74153 — Decisions — Default
- Tabs: "My works 3", "Decisions 3" (active), "Conversations 3", "Following 3". Three rows:
  1. **Featured:** "Approve emergency funding · Northgate" [Explore] / "7 aging feeders serving Ridgeview Village and ~9,400 customers — reliabilit...". Metrics: "$11M / $7.4M" "Forecast vs constraint" | "827,229" "Total value".
  2. "Approve drafted re-optimization · CAPEX 2027" [Explore] / "3 zones are already operating above safe capacity and are expected to remain overload...". Metrics: "$8.4M / $0.4M" | "2,138". The metric columns sit further right (~x628, ~x818).
  3. "Review resubmitted fix · Substation refurb" [Build] / "Relay protection upgrade serving West Corridor". Metrics: "$18M / $18.5M" | "324,928".

### 26:74417 — Collaborations — Responses
- Tabs: "My works 3", "Decisions 6", "Conversations 8" (active), "Following 3". Section: "RESPONSES TO REVIEW". Only 2 rows, **with ranks "2" and "5"**:
  - "2": avatar "PN", "Priya Nair · Priya approved the recalibration on the UG cable cohort", "Product Lead", "Recalibration approved. The UG cable cohort is cleared for the next inspection cycle.", chip "Approved", arrow.
  - "5": avatar "JC" (maroon), "Jordan Close · Jordan is completing the inspection backfill on Feeder 12", "Field supervisor", "Backfill in progress — 4 of 7 spans complete. Waiting on crew availability for the remaining sections.", chip "Wait for reply", bell.

### 26:74678 — Followed Works — Portfolios
- Tabs: "My works 3", "Decisions 6", "Conversations 8", "Following 3" (active). Section: **"FOLLOWED WORKS"**. There are three metric columns (~x438, ~x628, ~x818):

| # | Title / sub-line | Forecast vs constraint | Total value selected | Total value unselected |
|---|---|---|---|---|
| 1 | "2027-B" / "Re-ran with Q3 actuals · reviewed against the cap." | "$168M / $150M" | "399,000 · 91 of 134" | "54,000 · 43, $28M" |
| 2 | "Portfolio North" / "Q3 actuals pushed CAPEX scoring ceiling — re-eligible." | "$182M / $150M" | "412,000 · 97 of 134" | "61,000 · 47, $32M" |
| 3 | "Portfolio South" / "Inside all constraints · gate-ready pending reanalysis." | "$96M / $90M" | "233,000 · 52 of 76" | "30,000 · 26, $18M" |

- Dev note 26:73843 (metrics):
  - "**Forecast vs. Constraint** means the gap between expected spending and the available budget. **Example:** $182M / $150M means the forecast is $32M over the available constraint."
  - "**Total Investment Value (selected)** means the total value generated by the selected investments. **Example:** 412,000 across 87 of 134 means the selected investments contribute 412,000 value units."

### Persona differences summary

| | Investment Owner (Jeff, JP) | Asset Manager (Priya, PA) | Portfolio Owner (Dana, DM) |
|---|---|---|---|
| Decisions metrics | CPV, V/C | Health index, Risk (±%) | Forecast vs constraint, Total value |
| Decisions rows | 6 (Northgate…Harbor) | same 6 titles | 3 approval items |
| Following metrics | CPV, Total investment value, V/C | Health index, Risk, Age vs useful life | Forecast vs constraint, Total value selected, Total value unselected |
| Following section title | PROJECTS I FOLLOW | PROJECTS I FOLLOW | FOLLOWED WORKS |
| Following items | projects/investments | asset cohorts/feeders | portfolios (2027-B, North, South) |
| My works featured | Grid lines — substation retrofit | Study rider — Feeder 12 | Re-optimization —CAPEX 2027 |
| Responses | 5 rows (PN, MR, JR, JR, SC) | 5 rows (JC, PN, SP, DK, JC) | 2 rows (PN, JC) |

---

## 12. Behaviour rules from dev notes (verbatim, grouped)

1. **Page behaviour (26:70083):**
   1. "The list can be sorted by urgency or by the date the item was added to the Decision tab."
   2. "Users can filter items by source."
   3. "The list uses infinite scroll."
   4. "The right-side panels — Cooper’s work results and the Milestone/Calendar panel — remain fixed while scrolling."
2. **Source tag (on 26:63249):** "Tag in the card shows where this item came from".
3. **Drag (26:71213):** "Decision cards are draggable so that users can manually adjust the priority". Per the frames, ranks re-number after a drop.
4. **Metrics (26:69623):**
   - "CPV means the present value of the investment cost, with future costs discounted back to today. Example: $3.74M means the investment costs $3.74M in today’s money."
   - "V/C means value generated divided by CPV. Example: 2,251 V/$K means each $1K of investment generates 2,251 value units."
   - Hover tooltips on the labels: CPV → "What the investment costs in today's money."; V/C → "Value generated per $1K of investment — higher means more value for the cost."; truncated sub-line → full text tooltip.
5. **Remind me later (26:70089):** "Remind me later → moves the item to the lowest priority. After [7] days, it returns to the urgency list." The toast reads "Snoozed for 7 days." with Undo.
6. **Archive (26:70095):** "Archive → moves the item to the archive folder at the bottom of the list." The archived section is collapsible ("ARCHIVED" plus count). Archived cards have no rank, and their kebab offers "Remind me later" / "Unarchive".
7. **Toast (26:71673, 26:71680):** "UI/UX Spec: Toast Notification Timeout" — "Duration: 5000ms (5 seconds)" — "Behavior: Auto-dismiss after 5s. Pause timer on hover."
8. **Milestone panel (26:69629):**
   - "Milestone and scheduled events are defined by the admin and appear on the calendars of all users with the same user type."
   - "Private events are created by the user and are not shared."
   - "Events are color-coded."
   - "If multiple events fall on the same day, show up to 4 lines to represent them. 3+ events in a day: show a counter and display the earliest event."
   - "Hover over the dots to see the event names."
   - Line behaviour (26:71687): "3+ events in a day: show a counter and display the earliest event."
9. **Add event:** the modal is "NEW PRIVATE EVENT", and Add is disabled until the fields are filled (frames). Helper text: "Only you see this event. The team timeline is set by your admin and shown to everyone." The new event appears as a blue line on its day. Clicking a day opens the day detail side panel with Remove/Edit per event (frames).
10. **Collaboration statuses (on 26:66392):** "Collaboration card statuses: Commented (you can see comment), Approved, Rejected, @you, Wait for reply."
11. **Response actions (on 26:66392):**
    1. "Click the → to open the entity page where the comment was made."
    2. "Click Bell button to send the reviewer an additional item under their Collaboration card list."
    - After the bell is used, the frame shows "Last notified: Sep 3" and a disabled "Notified" pill.
12. **Push / reminder logic (26:70319):**
    - "Trigger: collaborator has a pending approval and has not acted for N days (e.g. 3 days)."
    - "On trigger, notify the reviewer via BOTH channels: 1. In-app notification (bell + toast) 2. Email"
    - "Two notification sources, do not merge:"
      - "Manual "Push": owner taps Push in the approval chain. Attributed to the owner ("A. Singh nudged you"). Fires immediately, no threshold. Rate-limit: max 1 manual push per reviewer per 24h."
      - "Auto-reminder: system-sent after 7 days of inactivity. Impersonal, references elapsed time. Repeat at intervals (e.g. day 3, 5, 7), then stop (cap total reminders)."
    - "Both channels link to the version in review state, deep-linked to the reviewer's approve / request-changes action."
    - "Stop conditions: reviewer acts, owner withdraws the version, reviewer is replaced, or approval is otherwise closed. Cancel any queued reminders."
    - "Log every push (manual + auto) to the framework Activity log" — "{A. Singh pushed Becky Blackbell}"
    - "Respect per-user notification preferences (a user may have email off → in-app only)."
13. **My works (26:66380):**
    1. "My Work tab has 2 card statuses:" — "Updated: someone changed something while you were away." — "Draft: nothing changed when you are away."
    2. "The → button takes you to the page where you left off."
14. **Followed works (26:66386):**
    1. "Followed works shows key metrics and a short description."
    2. "Hover over the card to see the full description and metric details, including the impact."
    3. "Click → to open the entity homepage."
15. **Tab visibility:**
    - 26:63690: "If we don’t have “My work” - don’t show it"
    - 26:63913: "If we don’t have anything at all - don’t show Home tab at all"
16. **Asset Manager metrics (26:72668):** Health Index (0–10) and Risk Score (expected failure cost ±%); see §10.
17. **Portfolio Owner metrics (26:73843):** Forecast vs. Constraint and Total Investment Value (selected); see §11.

---

## 13. Inconsistencies noticed

1. **Frame names vs content:**
   - "Card Selected" (26:68968) looks identical to hover.
   - "Hover Card 2" (26:69404) actually shows a drag in progress.
   - "Hover Card 3" (26:69186) shows the post-drop order.
   - "Hover Confirm Viability" (26:66740) shows no visible change.
   - "Explore - Globe view - Pin logic tooltip" (26:63919) shows no tooltip.
2. **Tab label vs section name:** the tab is "Conversations" while the section is "RESPONSES TO REVIEW". Persona frames are named "Collaborations", and the Asset Manager My works frame uses tab labels "Discussions / Collaborations / My works / Followed works".
3. **Asset Manager My works (26:72678):** the active (underlined) tab is "Discussions 8", but the content is "WHERE YOU LEFT OFF" (My works). Its tab set and counts ("Discussions 8", "Collaborations 8", "My works 9", "Followed works 3") differ from the other Asset Manager frames ("My works 3 / Decisions 6 / Conversations 8 / Following 3").
4. **Tab counts don't match row counts:**
   - Investment Owner "Conversations 3" shows 5 rows.
   - Portfolio Owner "Conversations 8" shows 2 rows.
   - Portfolio Owner Decisions frame says "Decisions 3", but its other frames say "Decisions 6".
   - After snooze/archive the Decisions count stays "6" with 5 rows.
   - Asset Manager Conversations is 3 in Decisions/My works frames but 8 in its Collaboration/Following frames.
5. **Portfolio Owner Responses (26:74417):** ranks are "2" and "5" (not re-numbered 1, 2).
6. **Responses Default + Dev Notes (26:66392):** this frame lacks the Ask-anything search field; the other Responses frames have it.
7. **EastZone C sub-line:** it varies between "3 zones over safe capacity ahead of peak" (default, archive, snooze, add-event frames) and "3 zones are already operating above safe capacity and are expected to rema..." (risk/tooltip/sort frames, Asset Manager).
8. **Ridgeline CPV:** shown as "8.6M" without "$", while all other CPVs have "$".
9. **Date range picker:** the input shows "13.02.2026 — 17.02.2026" (February), but the calendar is September 2026 with 13–17 highlighted.
10. **Stepper last step:** "Decide" in the Comment Focus frames but "Approve" in Investment overview.
11. **Entity header:** it shows "INV-2025-0842" for three different investments (Southern Feeder Replacement, Grid lines — substation retrofit, Feeder tie-in — West Corridor). Investment overview's details say Code "INV-2026-0418".
12. **Comment ids:** "#52" is used for two different comments (James Reyes on Full Replacement and Katarina Olsson on Financial comparison).
13. **Featured card button:** the Archive frames (26:62418/62704/62963) show a "Review ▾" split button on the featured card; every other Decisions frame shows the plain arrow.
14. **Status wording:** "Update" (Asset Manager My works row 3) vs "Updated" elsewhere.
15. **"Recloser R-1" / "Demeter SS" map image:** it is reused on every featured card, including My works and the Portfolio Owner featured items, regardless of entity.
16. **Calendar dev note:** it says "show up to 4 lines" and also "3+ events in a day: show a counter". Day 20 shows 3 lines with no counter, while day 10 shows 1 line plus "+2". The rule is ambiguous.
17. **Day detail panel (Sept 10):** it lists Scheduled, Private and Regulatory events, but the calendar marker for 10 is a single purple line plus "+2". All three events are "Created by J. Carter", including the "Private event" and the admin-defined types.
18. **Approval/push note (26:70319):** the trigger says "N days (e.g. 3 days)" while the auto-reminder says "after 7 days of inactivity", which conflicts with "Repeat at intervals (e.g. day 3, 5, 7)". It also refers to a "Push" control that does not appear in the Command frames (the frames use a Bell button).
19. **Explore globe frame:** the NavBar omits "Command" and the avatar is "AL", unlike every other frame.
20. **Persona-specific copy reused:** the Asset Manager Decisions frame keeps the Investment Owner investment titles, while only the metrics change. The bottom-bar chip "Why is Northgate #1?" appears for every persona.
