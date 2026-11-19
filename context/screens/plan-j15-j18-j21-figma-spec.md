# Plan: J15 · J18 · J21 — Figma DELTA spec (Portfolio Owner)

Source: Plan handover `Dv3HzkcFTTrb4E34zLF7cy`. **This file lists only what is new or different from what is already specced and built.** Read first: `plan-home-figma-spec.md`, `plan-setup-figma-spec.md`, `plan-scenarios-figma-spec.md`, `plan-compare-figma-spec.md` (its §7 only sketched Approve), `plan-setup.md`. Code: `app/screens/plan.jsx` (601 lines), `app/main.jsx`.

Method: one screenshot per key frame at 1440 wide; copy is read from the screenshots (never layer names). Real-looking person names are written "[person name]". Local PNGs (not in the repo): `/private/tmp/claude-503/-Users-schu-Documents-CLAUDE-NEW-CODE-Catalyst-prototype/ace79f5e-35e0-4abb-8fb9-fe85df86f85d/scratchpad/*.png`. The User Flow frame `103:63527` was not re-read: `plan-scenarios-figma-spec.md` §3 already covers it.

Tags: [Figma] seen in a frame · [Assumed] needs confirming · [Added] invented data.

## 1. Frames

| Journey | Node | Frame | State in the prototype |
|---|---|---|---|
| J15 | `84:277329` (1440×1504) | Plan Home FY27 "Time to Plan" (copy at `85:175923`, `85:176903`) | Built (tile phases), see 2.1 for the deltas |
| J15 | `85:174964` "Entry point" | Plan home click on "Continue planning" → `85:174967` Setup, Data readiness | Built |
| J15 | `85:158974` | Planning groups (7 frames, `85:158979` … `85:159619`) | Specced (`plan-setup-figma-spec.md` §4); **tab is read-only in code** |
| J15 | `85:177903` "Create New Scenario" | 7 frames 1440×900: `85:179629`, `85:183971`, `85:180458`, `85:181298`, `85:182137`, `85:182985`, `85:177904` | **Not built** ("New scenario isn't part of this flow") |
| J15 | `85:162876` | Scenarios | Built; the new scenario row is the only delta |
| J18 | `85:55947` | Compare, Cooper's evaluation | Toast only, panel specced in compare §5.3 |
| J18 | `85:58438` "Evidence chain" | `85:58439`, `85:59501`, drawers `85:60797` (396×934), `85:61034` (396×844) | **Not built** (toast "Evidence chain") |
| J18 | `85:61393` "Scenario Details" | `85:61394` (cards), `85:62481` (1440×2055 page) | **Not built** |
| J18 | Compare tabs | Value measures and constraints, Investments | Tab 2 built; **tab 3 is an EmptyState** |
| J21 | `84:108435` "Workspace" | `84:108440` Executive · `84:108560` Changed reviewer · `84:108777` Other gates opened · `84:108685` All approved (all 1440×900) | **Not built.** "Send for approval" only toasts and sets `stage='approval'` |
| J21 | `84:115108` "Stakeholders › Types" | Executive `84:115112` · Technical `84:116447` · Financial `84:115875` (≈1440×1300 each) | Not built |
| J21 | `84:108890` "Approved" | `84:108894` Ready · `84:110957` Publish modal · `84:111994` calendar · `84:113032` time list · `84:114070` Scheduling · `84:109926` Scheduled | Not built |

Sticky labels on the canvas (not UI): "Ready", "Schedule", "Scheduled", "Executive", "Changed reviewer", "Other gates opened", "All approved".

## 2. J15 deltas

### 2.1 Plan Home "Time to Plan" (`84:277329`) vs the built Home
Everything in `plan-home-figma-spec.md` holds. Differences:
1. **FY27 tile** reads "Time to Plan" (NEXT, orange), button **"Continue planning"** (the Optimizing frame had "Compare results"). The prototype also has a first phase "Start planning" `[Assumed]`; keep it.
2. **CYCLE PROGRESS, SETUP expanded** (spinner icon): "Scenarios built" **"Feb 12"** (green check), "Open questions" **"• 1/2 (50%)"** (red dot), "Warnings" **"• 1/2 (50%)"** (amber dot). COMPARE and APPROVE show "• Queued". The prototype already follows this with live counts; the date is `[Added]` (use the story date).
3. **YEARLY FORECAST VS BUDGET** has two views in the toggle (bar chart, table). In the table view the columns are STAGE, FY25 … FY29, TOTAL with rows Initial, Long-term planning, Short-term planning, **Executing** (a 4th stage not in the chart legend). The year range here (FY25–29) differs from the chart (FY27–31). Both views need the same record. Per-stage figures are `[Added]` unless `whistler-plan.js` gives CAPEX by stage.
4. Left tree and header are unchanged. The owner line shows a name and "UN" initials; use the Portfolio Owner's name and initials.
5. Click map: "Continue planning" → Setup (`85:174967`, Data readiness, "Scenarios 3", **Optimize** disabled until ready).

### 2.2 Planning groups: Cooper-detected groupings (`85:158979` → `85:160926`)
The tab exists but only shows the chart and a table. **Add (as specced in setup §4, not yet built):**
- **"3 storm jobs form one programme"** question in System confidence, 3 solutions: "Create a group from this match" (Cooper-recommended), "Move to “Required by management”", "Leave them competing". Pager "1 / 7 (0% resolved)", "All" list of 7 questions.
- **Applied state:** caption "APPLIED", the chosen card with an undo icon, pager "✓ 1 / 7 (15% resolved)". Group list and counters change as in setup §4.7 (the "move" case: Under consideration −3, Required by management +3).
- Group row menu: "Rename" / "Delete" on the user-created group. Expanded "Required by management": "Decided outside the plan…" text and GROUPING PRINCIPLES (3 rows).
- **Delta to setup §4:** the J15 goal is "move items e.g. to Required by management", so this is the primary path; "Create a group" is secondary.
- Acceptance for the prototype: the move actually changes `planningGroup` for those 3 investments in the persisted store, the chart and counters follow, and Undo restores. Scenarios' "Investment groups" checkboxes (Setup › Scenarios) must read the same groups.
- Real data: groups are Under Consideration 178 · New to Scenario 34 · Required by Management 8 · Executing 72 · Blankets 4 (296). Figma shows 1417 / 14 / 61 (placeholder scale; the real list is smaller). Use the real counts and show the Figma deltas (−3 / +3, new group of 3 not 6). The "3 storm jobs" must be 3 real investments `[Added]` chosen from Under Consideration (e.g. by shared substation or start window). Tag the grouping rule `[Assumed]`.

### 2.3 Create New Scenario (Cooper chat) `85:177903` — all new
**Entry:** the "New scenario" button on the Scenarios tab (tabs row). Figma shows the panel already open at the bottom right on the Scenarios tab (page state: tab "Scenarios 5"). The first frame opens it by default; build it as a click on "New scenario" (not drawn: `[Assumed]`).

**Panel:** bottom-right floating window, 320 wide, anchored at x 1108–1428, bottom 12 px above the bottom bar; height grows with the conversation (350 → 408). Warm Cooper gradient background, 1 px border, radius `radius-300`. DS `ChatCompactPanel` (floating 320 wide, type text) with `CooperMessage` / `UserMessage`. Header: Cooper dots icon, title **"NEW SCENARIO"**, icon buttons (new chat, history, resize, more "⋯", minimise "—"). The Scenarios tab keeps scrolling behind it.

**Conversation (copy as drawn; every step has suggestion chips with a "↳" icon, a divider between them):**
| # | Cooper | Chips | User picks |
|---|---|---|---|
| 1 | "What do you want to explore in FY27? I've read the portfolio, value framework, and last cycle's plan. 3 things stand out that no scenario currently tests." + caption "START WITH" | "Stress the FY29 cap" · "Protect cost first" · "Cheapest plan that still clear every obligation" (sic) | "Stress the FY29 cap" |
| 2 | "Should I start from MID, or build the assumptions fresh?" | "Start from MID" · "Build it fresh" | "Start from MID" |
| 3 | "How hard should FY29 be held? Today it is capped at $13.5M, and that cap is what deferred fourteen investments." | "Hold it flat at FY28 level" · "Cut it 10%" · "Let it grow 5%" | "Cut FY29 by 10%." (free text; the chip text differs, `[Figma]` quirk) |
| 4 | "If the work no longer fits, may I move dates further out?" | "Yes, up to 3 years" · "No, keep the 2-year limit" | "Yes, up to 3 years" |
| 5 | Progress line with Cooper dots: "Cooper is working on it (Step 1/3): Analyzing context…" then "(Step 2/3): Building new scenario…" | none | none |
| 6 | "I've created “FY29 cap cut 10%” scenario as a draft — run Optimize when you are ready." | none | none |

Input at the foot: "+" attach, "Describe your idea…", mic. Free text is allowed at any step.

**Page behaviour during build (`85:182985`):** a new row is inserted at the **top** of the list: title "FY29 CAP CUT 10%", an orange 1 px outline, skeleton bars in description, Budget, Resources and Enterprise goal, a spinner instead of the Cooper icon, and a small "Cooper" cursor chip near the middle (a collaborator-style cursor). The tab counter shows 3 in this frame (see gaps), **6** in the final frame.

**Done (`85:177904`):** the row is expanded and shows: description "FY29 cost constraint is 10% lower than Baseline; resource and strategic constraints stay the same. Restrictions allow alternative and timing changes."; Budget **"FY29 cap $7.2M → $6.5M"**; Resources "20,000 T&D crew hours"; Enterprise goal "+3% SAIDI year by year". Restrictions copy MID: Investments adjustable 1,417 · Planning groups enabled 1/3 · Max date shift **3yr** (from answer 4) · Alternative changes Allowed · Interpolation Off. Constraints tabs Cost 3 / Resource hours 30 / Strategic 7. Header: stepper Setup active, "New scenario" back on the tabs row, Cancel gone, **Optimize** enabled. The chat stays open.

**Constraints translated from strategic objectives (J15 last step):** Figma has no dedicated frame. What is visible: the new row's **Enterprise goal** (a strategic objective) and the **Strategic** constraint tab (7). Build as: each Enterprise-goal line maps to one or more Strategic-tab constraints (table as in scenarios §2.3); changed cells vs the copied scenario are marked "changed". Mapping rule `[Assumed]`; ask the designer (gap G5).

**Prototype rules:**
- Reuse `SETUP_SCENARIOS`: copy MID's restrictions and constraints, then apply the answers: cap % on the chosen year, date shift years, name from the intent. Scenarios become 6; run Optimize runs 6.
- Start from MID's real numbers: FY29 cap in the real MID scenario (not $13.5M / $7.2M) — compute, show derived values with `[Added]`. "$13.5M … deferred fourteen" uses the Figma values only if the real data agrees; otherwise compute and say so.
- Compare must then show a 7th card (Baseline + 5 + new); see gap G6.
- DS: `ChatCompactPanel`, `CooperMessage`, `UserMessage`, suggestion chips (`PromptButton`? check `scripts/entry.sh`; the "↳" chip rows may be non-DS, wrap in `NDS`), skeleton `ContentCard loading` (already used in Compare), `AgentWindow` is NOT right (that is the proactive window).

## 3. J18 deltas

### 3.1 Compare, right panel: System confidence (`85:59501`)
Not in the built PlanCompare. On Compare the page is 1440 − 380: the right **System confidence** panel (DS `SystemConfidence`) opens at x 1060–1428; the scenario cards cut off at x 1048 (horizontal scroll). Content:
- Header "SYSTEM CONFIDENCE" + Cooper icon button (this opens Evidence chain) + collapse "→|".
- "Approval readiness" ring **35%** (frame `85:58439`) / **100%** (`85:59501`) · "Plan readiness" Passed. Switch "Open questions 2" | "Warnings 2". Pager "1 / 2 (0% resolved)", "All", ‹ ›.
- Question **"Is the retained risk in the recommended scenario acceptable?"** Body: "The recommended scenario still leaves some risk unresolved. Confirm whether that level of exposure is acceptable."
- SOLUTIONS: "Accept retained risk" (Cooper-recommended), "Reduce risk further", "Prioritize critical risk", buttons "Upload file" and "My answer".
- Behaviour: choosing a solution moves readiness up (35% → 100% when both questions are answered) and enables **Send for approval**. Wire it: Send for approval needs a final plan AND open questions answered `[Assumed]`. (Today it only needs a final plan and a finished run.)
- Bottom bar chips on Compare: "Explain gaps in confidence", "Why this scenario?" (already placed). Wire both to the Cooper answers below.

### 3.2 Cooper's evaluation and "Why this scenario?"
Panel is specced (compare §5.3); build it (today only a toast). Add: chip **"Why this scenario?"** opens the same panel on the card of the final plan (or Cooper's pick if none); chip **"Explain gaps in confidence"** opens System confidence and reads the open question aloud as a Cooper message. Panel pick must equal `COOPER_PICK` (see compare gap 3).

### 3.3 Evidence chain drawer (`85:60797`, `85:61034`)
Floating drawer, 396 wide, 934 / 844 tall, opened over the cards from the Cooper icon in System confidence (and from any evidence icon). Close ✕ and Esc. DS `EvidenceChainDrawer` (already used in `explore.jsx`; same props: `value`, `rationale`, `benchmark`). Content:
- Title "EVIDENCE CHAIN". `EvidenceStrength` bar with marker **87%**, captions "<70% REJECT", "87% REVIEW", ">90% APPROVE" (dashed red / orange / dashed green).
- Segmented control: **Rationale** | **Peer benchmark**.
- **Rationale**, sections with uppercase captions and `SourceCard`s (a chip title + body):
  - SCENARIO SETUP: "Budget range tested" / "Five scenarios were created around the $41.3M baseline to test lower and higher funding levels."; "Same optimization scope" / "All scenarios use the same 39,123 investments, planning groups, and planning horizon to keep the comparison consistent."
  - SYSTEM DATA: "Baseline retained risk: $11.0M" / "The current plan's retained risk is used as the reference point for measuring scenario improvement."; "Resource capacity loaded" / "Available crew hours and delivery capacity for FY27–FY31 were included in every optimization run."
  - DECISIONS: person cards (avatar, name) with a quote and a blue "Keep critical reliability work funded" / "Hold executing investments in place" chip (a link to the planning-group decision from 2.2). Two people: [person name] and [person name].
- **Peer benchmark** (`85:61034`): lead text "Peer benchmark supports the current scenario range. Similar electrical distribution plans typically balance spend growth against retained risk, with the strongest plans reducing risk materially without moving far outside the baseline budget." SUMMARY rows: SIMILAR PLANS "128 plans" · TYPICAL SPEND VS BASELINE "−5% to +8%" · TYPICAL RETAINED RISK "15–25% of exposure" · TYPICAL FUNDED SHARE "82–95%". Card "SCENARIO POSITIONING": legend chips (Max cost selected, Min cost, Mid −5%, Mid, Mid +5%, Peer plans) and a scatter: x "Spend vs baseline" (−20% … +20%), y "Retained risk (% of exposure)" (0–40%), grey peer dots plus one coloured dot per scenario. DS `PeerBenchmark` / `ScatterChart`.
- Data: use the real cards for the scenario dots (spend vs baseline = `capexTotal / baseline − 1`; retained risk from the card). Peer figures (128 plans, ranges) and peer dots are `[Assumed]`. The baseline "$41.3M", "39,123 investments" and "$11.0M" must come from the record (Figma uses 39,123 while Home says 39,498 and the prototype has 296; show the real 296).
- The "Decisions" must show the real planning-group decisions made in 2.2 (who, what), not fixed text. The persons are invented names from `shared/names.js`.

### 3.4 Tabs: Value measures and constraints / Investments
- **Value measures and constraints**: built; no delta.
- **Investments (replaces the EmptyState)**: as compare §3.2 (two `Select`s "Baseline" / "COMPARE TO", grouped `Table` with HIGHEST / MODERATE / NO SHIFT bands and Counter, struck-through alternative, start date with ±months).
  - **Delta / data decision:** the generated data holds only per-scenario *counts* (e.g. Min CAPEX: 86 deferred, 84 advanced, 87 alternative-changed of 296), not per-investment results. So per-investment rows are `[Added]`, built deterministically from the real counts (so group sizes match the card badges) and the real `alternative` / `startDate` of each investment. State this in the tab with a small caption "Derived from scenario totals" `[Added]`.
  - Band rule `[Assumed]`: HIGHEST = alternative changed or shift ≥ 12 months; MODERATE = shift 4–11; NO SHIFT = 0. Show the shift consistently (later = "+Nm", earlier = "−Nm"; Figma has an earlier date labelled "+5m").
  - Row click opens Scenario details at that investment (3.5) `[Assumed]`.

### 3.5 Scenario Details (`85:62481`, 1440×2055)
Opened from a scenario card name (or a "View details" in the card menu `[Assumed]`; Figma shows no explicit trigger; header breadcrumb "‹ Scenario comparison", "Electrical Distribution FY27", "● Compare"). A full page, **same body as an expanded Setup › Scenarios card** with the scenario as the page title ("Min cost", 20 px). Sections: IDENTITY & CLASSIFICATION (Description, Budget, Resources, Enterprise goal) · RESTRICTIONS (5 stat tiles + 3 switch rows) · CONSTRAINTS (5 tiles: Constraints changed 4, Cost +$3.7M, Resource hours +8%, Strategic —, Years changed 3/6; tabs Cost / Resource hours / Strategic; table FY26–FY29+) · **INVESTMENT GROUPS**.
- **Delta vs Setup:** page header has only "3/5" and comment, no stepper, no Optimize. The stat tiles show change **vs Baseline** (Setup shows absolute). In Investment groups the table has a **GROUP** column (badge "Required by management") instead of the group-list pane; columns INVESTMENT (name + code), GROUP, COST, VALUE, SCHEDULE; SmartSearch above.
- Sticky note on the canvas (verbatim): "Investment list for user to make specific edits to investment alternative or start date". So the table cells ALTERNATIVE and START DATE must be **editable** on this page: click a cell → select / date picker, Enter saves, Esc cancels; an edited row gets a "changed" mark and a Re-optimize prompt (Cooper: "This changes the result. Re-optimize?"). Edit scope = this scenario only; persisted. `[Assumed]` — the frame shows no edit state.
- Real data: reuse the Setup components (`Restrictions`, `Constraints`, `InvestmentGroups`) read-only except the investment table. Constraints changed vs Baseline is computed. The rows repeat each investment twice in the frame (placeholder); show each once.
- "Select as final plan" is not on this page in Figma; add it to the card only (see 3.6).

### 3.6 Select as final plan → Send for approval
Select behaviour is specced (compare §4). **Add:** after selecting, the header button "Send for approval" enables (already), Home tile becomes "Ready v1" (already). No Figma frame for a confirmation: keep the existing toast.

## 4. J21 Approve workspace (full spec)

### 4.1 Page shell (`84:108440`, 1440×900)
Route `#plan-approve`. After "Send for approval" the user lands here (today the app stays on Compare and only toasts).
- **NavBar** 48 px as Plan. **Left rail**: collapsed 48 px "|→" (expands the Plan tree; on Approve the tree is hidden, no sidebar).
- **PageHeader** 40 px: "‹" back (to Compare) · "Electrical Distribution" · "FY27" · chevron · "● Planning" (blue indicator) | **Stepper** centre: "✓ Setup" "✓ Compare" **"Approve"** (active, striped progress underline) | right: "👥 3/5" button, comment icon button, **"Publish"** primary (disabled until all gates are approved; tooltip "All gates must be approved first" `[Assumed]`).
- **Title row** (y 100–132): "Approval" (H2, 24 px) + chip with the final scenario name, e.g. **"Max cost"**. Under it (13 px, secondary): "Reviewers and approvers are preconfigured by your administrator based on your role and plan type."
- **Three stat cards** (y 175–247, equal, gap 10, x 60–1428), `StatCard`: **Cost** "$41.2M" · **Retained risk** "$8.4M" with "Low · lowest of 3" · **Investments funded** "186" with "of 200 · 14 deferred". All three must come from the chosen scenario's record (Compare card): Cost = `capexTotal`, Retained risk = card retained risk, funded = `onSchedule` of 296, deferred = `deferred`. Figma values disagree with its own Compare card ($45.0M · $6.9M · 194/200) and with the Stakeholder frames ($41.2M · $6.9M · 194 · 6 deferred): use the record; flag G3.
- **Gate card** (y 266, bordered container, radius, padding 12, x 60–1428) holding three **gate accordions** (32 px header bars, grey fill `elevation-2`, gap 4 px):
  - header: caret (▸ collapsed / ▾ expanded) + uppercase label "EXECUTIVE" / "TECHNICAL" / "FINANCIAL"; right: state text + dot + counter chip.
- Bottom bar: chips **"Compare to peer"**, **"Compare to best practice"**, Cooper orb. (On the other Plan pages the chips differ; keep these.)

### 4.2 Gates
Fixed set from the "administrator", read from the plan type `[Added]`:
| Gate | Reviewers in Figma | Rule |
|---|---|---|
| **Executive** | 3: CFO ("[person name] (You)"), Director of Capital Planning, COO | Opens first |
| **Technical** | 2: VP of Operations (approved), Field Engineering Lead (pending) | Locked until Executive is approved |
| **Financial** | 2 (names not shown, header "0/2") | Locked until Executive is approved |

**Gate states** (header right side):
- **UNDER REVIEW** — amber dot, bold uppercase text, counter chip "1/3" (approved / reviewers). Expanded by default when it is the active gate.
- **APPROVED** — green dot, no counter. Collapsed by default (still expandable to see the rows).
- **Locked** — lock icon in front of the label, label and bar dimmed, not expandable, tooltip "Opens when Executive is approved" `[Assumed]`.
- Gate is APPROVED when every reviewer is approved. A rejection (a reviewer chooses "Reject / revisions") sets the gate "CHANGES REQUESTED" `[Assumed, no frame]` and Publish stays disabled.
- **Unlock order (`84:108777` "Other gates opened"):** when Executive turns APPROVED, **both** Technical and Financial open at the same time (Technical expanded 1/2, Financial "UNDER REVIEW 0/2" collapsed, neither locked). It is parallel, not sequential after Technical — contradicts the journey wording "sequential gates unlock" (G2). Build as Figma and keep a one-line rule in `plan-model.js` so changing to strictly sequential is easy.

### 4.3 Gate table (expanded)
`ApprovalChainTable view="full"` (DS pattern helper) inside the expanded gate. Header row 36 px, caps labels: **USER** (filter icon; filter shown only when > 3 reviewers) · **NOTE** · **COMMENT** · **LAST NOTIFIED**; action column without a label at the far right. Rows 52 px minimum, growing with the note (long notes wrap, 8+ lines → the row is 180 px).
- **Status rail** (column 1, 32 px): `ApprovalStatus` — green check (approved), amber clock (awaiting, "overdue/notify"), dashed circle (not yet acted).
- **User cell:** Avatar 24 px (initials or photo), name (13 px white, "(You)" after the signed-in user's name), role under it (grey 12 px).
- **NOTE** (x 473): owner's private note about this reviewer? In the DS table a note is `{ text, authorId }`, and only the owner and the author can edit it; the Figma text is a long paragraph written in the reviewer's first-person ("…I understand the reliability risk is increasing…"), so here it is the **reviewer's note** to the plan. Treat NOTE = reviewer's note on the plan; COMMENT = short reply to the plan owner.
- **COMMENT** (x 830): short text, e.g. "The cost range needs a clearer benchmark before I can sign off." Shown for rows that have commented.
- **LAST NOTIFIED**: date text ("Feb 15, 2025") and the push button.
- **Push reminder button** (right, 28 px, outlined): bell icon + "Notified" (disabled look = cool-down running). For a not-yet-notified awaiting row it reads **"Notify"** (enabled) `[from DS ApprovalChainTable onPush]`. Click: toast "Reminder sent.", stamp Last notified, button goes to "Notified" with a live countdown tooltip (default 24 h). Only the **Portfolio Owner** (plan owner) can push; the reviewer cannot.
- **Reviewer rows by state:**
  | State | Rail | Note | Comment | Last notified | Action |
  |---|---|---|---|---|---|
  | Approved | green check | empty | empty | empty | none |
  | Pending, notified | amber clock | long text | short text | date | "Notified" (disabled) |
  | Pending, not commented | amber clock | empty | short text only (COO row: comment, no note, no date) | empty | "Notify" `[Assumed]` |
- **Changed reviewer** (`84:108560`): the COO row becomes a **replaced** row: the old person's avatar (grey, "MK" with a small green dot) → chevron → the new avatar (violet "MS") + "[person name]" + "VP of Planning". Rail stays amber. Comment text of the previous reviewer is cleared. DS prop `replaced: { name, avatar }`. Click on the old avatar shows a tooltip "Replaced [person name] (COO)" `[Assumed]`. How a reviewer is changed (a "Change reviewer" item in the row's `ActionMenu`, Portfolio Owner only) is **not drawn**; add it as `[Assumed]`: menu → modal "Change reviewer" with a Select of users → Save → row becomes replaced, reminder reset, new reviewer gets a notification.
- Note editing (DS): the owner can add/edit a note on an awaiting row (Popover with TextArea). Not drawn in these frames; keep the DS default.

### 4.4 Reviewer side (`84:115108` "Stakeholders › Types") — screen for the reviewer persona
Three frames (one per gate) of the *same* review page, seen by someone who is a reviewer; the nav highlights **Build**, the stepper reads "Review | Approve", header actions "3/5", comment, **"Approval chain"** (opens the chain panel) and **"Decide ▾"** (primary with a menu). Content is a per-type evidence page with a right **READINESS EVALUATION** panel ("Strong Investment Need", rows Strategic alignment STRONG · Worth pursuing FAVOURABLE · Portfolio fit 1 OVERLAP · Red flags 1 TO NOTE · Approval notes 2).
- **Executive:** SELECTED SCENARIO card (Max cost, "−7% YoY · misses Wildfire target", Cost $41.2M, Retained risk $6.9M, Investments funded 194 of 200 · 6 deferred), OTHER OPTIONS (Min cost $37.8M, Budget $40.3M), YEARLY FORECAST VS BUDGET, STRATEGIC OBJECTIVE COVERAGE, CUMULATIVE RISK REDUCTION, VALUE TRACE (Sankey).
- **Technical:** same header cards, then CREW UTILIZATION BY BARN, DEFERRAL FLOW BY YEAR, a stage Gantt (view Year / Quarter / Month).
- **Financial:** same header cards, YEARLY FORECAST VS BUDGET, BUDGET CONSTRAINTS (CAPEX / OPEX columns), BENEFIT-COST RATIO BY STAGE.
- **Scope decision:** this is reviewer content, not Portfolio Owner (G1). For the prototype build the reviewer page as a single view with the gate name in the title, reuse the Build Review screen (`app/screens/build.jsx`, `ApprovalChainPanel`, Decide with Approve / Reject + comment) and show these cards from existing Plan data (CAPEX-by-year, risk-by-year, deferrals from the chosen scenario). The Sankey, crew utilization and Gantt have no data: mark `[Added]` or omit and list under gaps. Read at reduced resolution; re-check with `get_design_context` before building.

### 4.5 Interactions and states (Approve workspace)
| Action | Result |
|---|---|
| Send for approval (Compare, or Home when "Ready v1" is not yet sent) | Go to `#plan-approve`, tile "In approval" (disabled button), Cycle progress APPROVE "In approval" |
| Click a gate header | Expand / collapse (locked gates do nothing) |
| Push on a pending row | toast "Reminder sent.", Last notified set, button "Notified" + 24 h countdown |
| Reviewer approves / rejects (simulated, `[Assumed]` timing as in J11) | Row status changes, gate counter increments; after the last, gate APPROVED, next gates open (4.2) |
| Reviewer comments | COMMENT and NOTE fill; Notification in the bell: "[person name] commented on FY27 plan" |
| All three gates APPROVED | Header **Publish** enables; gates collapse; Stepper "Approve" turns to ✓ (`84:108685`) |
| Click **Publish** | Opens the Publish modal (4.6) |
| Comment (header) | "Comments aren't part of this flow" toast stays |
Persist the state (`usePersisted`) like Build; "Reset demo" clears it. Tours: add a tour 014 (J15 → J18 → J21) and keep 001–013 working.

### 4.6 Publish / Schedule (`84:108890`)
Run on **Plan Home** (not on the Approve page): after all approved, Home shows tile **"Ready v1"** (NEXT) and FY27 cycle buttons **"View details"** (secondary) · **"Update plan"** (secondary) · **"Publish"** (primary), plus the bar-chart icon button. CYCLE PROGRESS: SETUP, COMPARE collapsed with green checks; **APPROVE expanded** with "Executive gate · Passed", "Technical gate · Passed", "Financial gate · Passed" (green check circles). The header Publish on Approve and the Home Publish do the same.
1. **Publish modal** (`84:110957`): centred 393×204 `Modal` over a strong overlay. Title **"PUBLISH"**, ✕. Fields: **Date** "Select a date" (calendar icon, 190 px) and **Time** "Select a time" (clock icon). Footer: "Cancel" (secondary) and **"Publish now"** (primary). Both fields empty = publish immediately.
2. **Pick a date** (`84:111994`): `DatePicker` with `showApply`: the field shows "17.02.2026"; popup under the field, month header "February 2026" with ‹ ›, Mon–Sun grid, today (12) orange, picked day (17) grey chip, full-width **Apply** button. The modal title becomes **"SCHEDULING"** and the primary becomes **"Schedule"** as soon as a date is chosen.
3. **Pick a time** (`84:113032`): a typed combobox; typing "9" shows a list of quarter-hour times 9:00 AM, 9:15 AM, 9:30 AM (highlighted), 9:45 AM. There is no DS `TimePicker`; wrap in `NDS` (a `Select` + `Search` combo).
4. **Scheduling** (`84:114070`): fields "12.02.2026" and "9:00 AM", buttons "Cancel" and **"Schedule"**.
5. **Scheduled** (`84:109926`): modal closed; Home tile still "Ready v1"; the primary button reads **"Re-schedule"** (clicking reopens the modal prefilled). Toast / bell notification "FY27 plan scheduled for 12.02.2026 9:00 AM" `[Assumed]` (not drawn).
6. **Publish now:** tile becomes **"Published"** `[Assumed]` (no frame), cycle progress adds a final "Publish" step `[Assumed]`, bell notification "FY27 plan published".
Rules `[Assumed]`: past dates disabled; Schedule disabled without both a date and a time; Cancel keeps the plan in "Ready v1". "Update plan" (no frame) goes back to Compare so the final scenario can be changed, which resets the approval (confirm in a modal). "View details" opens Approve read-only.

## 5. Navigation
`Home` (Time to Plan) → "Continue planning" → `Setup` Data readiness → Planning groups (resolve the 3-storm-jobs question) → Scenarios → "New scenario" (chat) → Optimize → (run, badge) → `Compare` → Cooper's evaluation / System confidence / Evidence chain → card name or Investments row → `Scenario details` (‹ back to Compare) → "Select as final plan" → "Send for approval" → `Approve` (`#plan-approve`) → (reviewers act; Portfolio Owner pushes / changes reviewer) → all approved → "Publish" (Approve header, or Home) → Publish / Scheduling modal → Home "Ready v1" / "Re-schedule".
Deep links to add: `#plan-approve`, `#plan-approve?gate=technical`, `#plan-scenario?id=<scenario>`, `#plan-compare?evidence=1`. Entry/exit screens to wire (memory rule): Home ↔ Approve (progress "View details"), Approve → Compare (back), Scenario details → Compare, Publish → Home.

## 6. Data mapping
| Figma field | Source | Status |
|---|---|---|
| Plan name, owner, tree | `PLAN_PORTFOLIO`, Portfolio Owner persona (Owen Fitch) | real/invented, built |
| Cycle FY27 tiles, KPI row | built; values from `shared/` | built |
| Planning groups, counts, investments in a group | `PLAN_GROUPS` (178 / 34 / 8 / 72 / 4), `PLAN_INVESTMENTS[].planningGroup` | real. Figma counts (1417 / 14 / 61) not used |
| The 3 "storm jobs" and the grouping rule | 3 real investments of Under Consideration | `[Added]` |
| Scenarios (MID etc.), constraints, restrictions | `SETUP_SCENARIOS`, `whistler-plan.js` | real |
| New scenario row (name, budget "FY29 cap → …", resources, goal) | derived from MID + answers | `[Added]` (derived from real) |
| Chat questions, chips, progress steps | `plan-model.js` script | `[Assumed]` |
| Scenario cards (CAPEX, deltas, retained risk, funded) | `COMPARE_SCENARIOS` | real |
| Evidence chain: baseline retained risk, 39,123 investments | card / `PLAN_INVESTMENTS.length` | real (Figma 39,123 not used) |
| Evidence chain: 87%, peer benchmark (128 plans, ranges, dots), decisions text | none | `[Assumed]` / `[Added]` |
| Investments tab (groups, alternatives, start dates) | counts real; rows | `[Added]` derived |
| Approve stat cards | chosen scenario record | real |
| Gates, reviewers, roles, comments, notes, dates | `shared/plan-model.js` new `PLAN_APPROVALS`; names from `names.js` | `[Added]` |
| Reviewer content (Sankey, crew utilization, Gantt) | none | `[Added]` or omit |
| Publish / schedule dates | story day (Nov 2026) | `[Added]` |

## 7. Gaps and conflicts
- **G1 Persona conflict (CFO vs Portfolio Owner vs Investment Owner).** Approve frames show the signed-in user as "[person name] (You)", **CFO**, initials JP, in the Executive gate (an approver with "approved"), while J15/J18/J21 are the **Portfolio Owner's** journeys and Home shows the Portfolio Owner as owner with initials "UN". Elsewhere the Build review (J11) uses the **Investment Owner** as "(You)" and owner of the chain. The DS table gives owner rights (push reminders, notes) to `ownerId`, approval rights to `currentUserId`. **Proposal for the designer to confirm:** the Portfolio Owner is `ownerId` and `currentUserId` on this page and is **not** a reviewer; the "(You)" CFO row is shown as a regular reviewer without "(You)" in our data. Add a Prototype settings switch "View as reviewer (CFO)" that turns on Approve / Reject and "(You)" on the CFO row, so both views from Figma are reachable. Do not silently reuse the Investment Owner.
- **G2 Gate order:** journey says sequential; Figma opens Technical and Financial together after Executive.
- **G3 Numbers:** Approve cards ($41.2M, $8.4M, 186/14), Stakeholder frames ($41.2M, $6.9M, 194/6) and the Compare card ($45.0M, $6.9M, 194) conflict; "lowest of 3" vs 6 scenarios.
- **G4 Planning-group counts and the "3 storm jobs"** are placeholder scale in Figma; chart 6 vs created group 6 vs "3 storm jobs".
- **G5 "Constraints translated from strategic objectives"** has no dedicated frame; the mapping (Enterprise goal → Strategic constraints) is inferred.
- **G6 Compare with 6+ scenarios:** the new scenario needs a 7th card (the horizontal scroll note) — no frame; Evidence chain positioning legend lists only 5 scenarios.
- **G7 Counter / state mismatches:** Scenarios tab count 5 → 3 → 6 in the build frames; Approval readiness 35% vs 100% vs the evidence 87%; "Open questions 2" in Compare vs "1/2" on Home.
- **G8 Dates:** "Feb 15, 2025" last notified (a year in the past), calendar February 2026 with today = 12, formats "17.02.2026" vs "Feb 12". Use the story date and one format (the prototype's `fmtDate`).
- **G9 Typos / copy:** "Cheapest plan that still clear every obligation" (sic); `NOTE` vs `COMMENT` roles unclear; the user's chip "Cut it 10%" becomes "Cut FY29 by 10%."; "Approval" page says "Reviewers and approvers are preconfigured…" (keep).
- **G10 Not drawn:** change-reviewer action, reject state, locked-gate tooltip, Publish-now result, Update plan / View details targets, confirmation after Send for approval, editing cells on Scenario details.
- **G11 Non-DS:** typed time picker, "↳" suggestion chips (if no DS equivalent), Sankey / crew-utilization / Gantt cards on reviewer pages, Cooper "cursor" chip on the building row — wrap in `NDS`.

## DS 2.0 mapping (new parts)
ApprovalChainTable (+ ApprovalStatus, Avatar, ActionMenu, Popover, Chip, TextArea, Tooltip) for gate tables; gate accordion header = Accordion/`ContentCard` header + `Indicator` + `Counter` (check `scripts/entry.sh Accordion`); ApprovalChain / ApprovalCard are the *timeline* version (Build, Value) and are NOT used here; EvidenceChainDrawer (+ EvidenceStrength, SourceCard, PeerBenchmark, SegmentedControl); SystemConfidence panel on Compare; ChatCompactPanel + CooperMessage + UserMessage (new scenario); Modal + DatePicker (`showApply`) for Publish / Scheduling; StatCard ×3; Stepper; Tabs; Table with group rows (Investments); Select ×2; Button (Cooper accent) for Cooper's evaluation; Toast (reminder sent). AgentWindow is for proactive recommendations only.

## Summary (5 lines)
1. J15 adds the Planning-groups resolution (3 storm jobs → move to "Required by management", live counters, undo) and a Cooper chat that builds a 6th scenario from MID with the real answers; both are new work on top of built Setup.
2. J18 adds the System confidence panel on Compare, Cooper's evaluation, the Evidence chain drawer (Rationale / Peer benchmark), a real Investments tab (derived rows) and an editable Scenario Details page.
3. J21 is a full new Approve page: three stat cards and Executive / Technical / Financial gates with reviewer tables (note, comment, last notified, push, changed reviewer); Technical and Financial open together after Executive; Publish enables when all approved.
4. Publish / Schedule runs on Plan Home ("Ready v1"): Publish modal → date (DatePicker with Apply) and time (non-DS) → Scheduling → "Re-schedule".
5. Open conflicts to confirm: CFO "(You)" vs Portfolio Owner (proposal: Portfolio Owner is the owner, CFO via a "View as reviewer" switch), gate order, mismatched Approve numbers, placeholder group counts.
