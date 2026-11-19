# Spec: J25 Investment Execution Tracking (Notifications tray, item opened, My Works resume)

**Figma:** Global Search and Notifications handover `acAfLbn5qy49dNNMouadUR` (frames below) and Command handover `QSh5FbHQ86rlWo0ViZCIDR`. **These frames are the spec.** Sizes are px at 1440 x 900. Copy is the Figma copy (old story: "Southern Feeder Replacement", "Eastern Substation T-14", Ridgeview). The prototype keeps the Figma *pattern* and fills names and numbers from `shared/` (section 7). Real-looking person names are written `[person name]`. Tags: `[Figma]`, `[Assumed]`, `[Added]`, `[Whistler]`.

Journey: Investment Owner. Notification "Cooper revised the schedule" -> card (link only) -> Build opens on the changed section -> Cost & Schedule (adjust) -> Value impact of the delay -> Send for approval (resubmit) -> Command My works shows "Resubmission — stage gate 2".

## 1. Frames found
| Node | What it holds | Used for |
|---|---|---|
| `2:115638` | "Cooper Summary — grouped card": Command with the tray open, filter All, list of 4 cards | tray layout, grouped card |
| `2:118507` | "notification-card v2 — all possible states" (2904 x 898 matrix: rows All / My work / Mentions / Collaboration / Follows, columns Unread / Read / Grouped with Cooper summary / Grouped no Cooper summary / Hover / Item deleted) | card states |
| `2:118632` | Section "4 · Notifications vs Command": three 1440 frames (`2:118633` tray over Command, `2:118889` item opened, `2:119630` Command) + 8 dev notes (`2:119865`..`2:119921`, `2:119932`) | rules, tray vs Command |
| `2:115886` | "Item opened — focused on changed section": Build > Shape idea page, one stat card outlined | highlight |
| `2:118889` | Same step in the section 4 variant: Build > Shape page for another story, scrolled content 1392 x 1665 | highlight (variant) |
| `26:65162` | Command "My Works — Where You Left Off" | My Works cards |
| `26:66380` | Dev note, My Works resume behaviour (text only) | resume rule |

Not found: a frame for the filter ("Sort & filter") popover, a "Mark all as read" result, an empty tray, a Date = All time view, or the Group expanded state. The only trigger to open the tray is the NavBar bell (no frame for its hover or badge, apart from the red dot, see 2.1). Flagged in section 8.

## 2. Notifications tray `2:115638`, `2:118633`
### 2.1 Shell
- **NavBar** 48 px: Command (active here) · Value · Explore · Build · Plan · Results; search, settings, **bell** (highlighted/active while the tray is open; a red dot on the bell in the Command frame `26:65162`), avatar. DS `NavBar` (the app already draws the dot, `app/main.jsx`).
- **Tray** = right drawer 440 x 828 at x 988-1428, y 60-888, inside a 1 px border, rounded, dark glass background; the page behind is **not dimmed** and stays readable. No close X is visible; it closes with the bell, Esc or a click outside `[Assumed]`. DS `Drawer` (`side="right"`, `overlay="none"`, `collapsible={false}`; the app already uses it).
- **Header** (48): title **NOTIFICATIONS** (uppercase label, left) · right stack: **Mark all as read** button (secondary, 24 high, 108 wide) · **filter icon button** (24, "Sort & filter"; a small number shows how many filters are active, 2:119932). DS `Drawer` header slot + `Button` + `IconButton` (the `title` is the DS Drawer title; the two header buttons need the header slot, check `Drawer` props, `[Assumed]` NDS if there is no slot).
- **Tabs** (52 high, x 12-426): **All · My work · Mentions · Collaboration · Follows**, one segmented control, five equal segments, "All" selected. No counters on the tabs. DS `SegmentedControl` (`options`, `size="s"`, `fullWidth`).
- **List** (scrolls, scrollbar 8 wide on the right): cards 414 wide at x 12, gap 12; newest first, one continuous list. Last row (32 high, centred, tertiary text): **That's everything from the last 30 days.** A card has no date separators in the frames. A top fade at the bottom edge of the tray shows the list continues.
- **Rules** `[Figma]` dev notes: not an inbox, not a task list; no backlog, no unread counters, nothing to "get to zero"; cards are history; default view 30 days, **Date = All time** shows everything (a Date filter lives in "Sort & filter"); no buttons on cards; no deadlines, overdue or priority sorting (those live in Command); a notification can tell about an item that also appears in Command but never replaces it.
- **Two numbers that are not unread counters:** the number on a group avatar (total updates on that item, never goes down when read) and the number next to the filter button (active filters).

### 2.2 Card anatomy `2:118507` (all cards 414 x 86, group lead 98)
Left to right, top to bottom:
1. **Avatar** 32 circle at x 12. Cooper = the round Cooper orb. A person = black circle with white initials ("MS", "JC", "AK", "TR", "LN"). DS `Avatar` (the Cooper orb is the NotificationCard default).
2. **Title** (14, medium, white): the event, e.g. "Cooper revised the schedule", "M. Soto approved the cost estimate" (name shortened to initial + surname). One line.
3. **Details** (12, secondary): the what, e.g. "Energization Mar 2027 -> Jun 2027 (+3 months)" (the Figma render drops the arrow glyph; show a right arrow), "Step 2 of 3 · Finance review passed", "$2M -> $4M (+100%)".
4. **Meta** (12, tertiary): "INV-2025-0642 · Eastern Substation T-14" (code · name, truncated with an ellipsis), **time** right-aligned (24-hour "16:05" for today, weekday "Tue" for older).
5. **Category chip** (top right, in the All tab only): "My work", "Collaboration", "Follows", "Unavailable". Mentions cards show none in the matrix; on category tabs the chip is hidden. DS `Badge` white S (inside `NotificationCard type="all"`; in `type="specific"` the DS hides it, so keep `all` for chips).
6. **Unread dot**: red 6 px at the far right of the title row. Read cards have no dot.
DS: `NotificationCard` (`type` all | specific | grouped, `read`, `title`, `details`, `meta`, `time`, `avatar`, `count`, `actionRequired`, `onClick`). **Critical status, status badge and `actions` are not drawn: leave off.** The prototype's current card passes `actions` (a "View results" button) and `actionRequired={false}`: for J25 the card must have **no buttons**, so use `onClick` only (card is a focusable link).

### 2.3 Grouped card with Cooper summary `2:115638`
First card: **Your summary** · "Cost, schedule & scope changed" · "INV-2025-0842 · Southern Feeder Replacement" · 11:20 · "My work" chip · unread dot. The Cooper orb has a **grey count bubble (3)** at its top left. Two thin card edges peek out below the card (stacked, 12 px inset each side) to show it is a group of 3. The summary text names the dimensions that changed (cost, schedule, scope), not each change. DS `NotificationCard type="grouped"` (`count`).
- **No-Cooper-summary variant:** same stack, but the lead is the **latest** update by a person: "[person name] changed the cost range" · "$2M -> $4M (+100%)" · avatar initials with the count bubble.
- **Group expand** is not drawn (the stack has no chevron). `[Assumed]` clicking opens the item like any card; no expanded list.

## 3. Card states `2:118507`
Columns of the matrix: **Unread** (red dot, title white) · **Read** (no dot; text and title unchanged in brightness) · **Grouped with Cooper summary** · **Grouped no Cooper summary** · **Hover** (card fill lightens, dot stays, no button) · **Item deleted** (dimmed: title, details and meta at about 50 %, chip "Unavailable" in the All tab, details "Removed from the plan", time is the weekday, the card is not a link `[Assumed]`).
Rows = categories: All (Cooper finished your draft, My work chip), My work (the same without chip), Mentions ("[person name] mentioned you" · quoted text · "PBR-0219 · Pump station" style meta; no grouped cell, shown "—"), Collaboration, Follows. A "—" cell means the state does not exist for that category.
- **Marked read** when the card is opened (dev note 2:119889) or by **Mark all as read**; opening the tray alone does not mark them. (The prototype currently marks all read when the drawer closes: change to the Figma rule, `[Gap]`.)
- **J25 card** = the Follows row: "Cooper revised the schedule" · "Energization Mar 2027 -> Jun 2027 (+3 months)" · "INV-2025-0642 · Eastern Substation T-14" · 16:05 · **Follows** chip · unread dot.

## 4. Item opened: focused on the changed section `2:115886`, `2:118889`
Click on the card: tray closes, **Build opens on the page of the item** (here the Shape/idea overview, stepper on Shape, status "Shaping"; for J25 the investment is already submitted, so the prototype opens the Refine page that holds the change, `[Assumed]`). Nothing else on the page changes: the NavBar, PageHeader, stepper, Cooper context bar are the normal ones; no banner, toast, badge, "Updated" tag or scroll animation is drawn.
**How the changed section is highlighted (exactly):**
- In `2:115886` the **"Cost range" stat card** (`$2.4M-$3.8M`, inside RECOMMENDED ALTERNATIVE > Targeted Hardening, row of 4: BCR · Cost range · Timing · Potential value) gets a **1 px solid blue outline, 4 px radius, on the card edge only**, same size as its siblings (no glow, no fill change, no label). The BCR card keeps its own copper tint (recommended); the other two stay un-outlined. Token: a blue border (`--border-blue` / `--border-info` exist in `vendor/ds2`; confirm against the frame with `scripts/entry.sh StatCard`).
- The page is **scrolled so the changed card is visible** at the lower part of the first screen (y about 540-585 of 640 at screenshot scale); the sections above (Idea overview, The need, Goals, Strategic relevance, Affected assets map) are unchanged and fully visible.
- Variant `2:118889` (section 4): the same page for another story: the page text itself carries the change ("Revised outage window: 14-18 Mar 2027, 02:00-06:00 …" inside THE NEED), and lower down a COMPARE TO OTHER INVESTMENTS card (stats Rate #4 of 35 · Percentile 75th · Standing Top quartile · Alternative Targeted Hardening; scatter "Investment position"; "Why this investment matters"; "Similar investments by BCR" with the current one at a lighter row fill). **No outline is visible in the crop of this variant.** Treat `2:115886` as the highlight spec (see 8).
- **The highlight clears** `[Assumed]` when the user edits the card or leaves the page; the notification is already marked read on click.
- The dev note says the card "only a link to the object. It opens the section that changed and marks the card read" and "never acts": no Approve/Reject buttons anywhere in the tray.
**DS:** outline on `StatCard` is not a prop: NDS wrapper `.is-changed` (outline with a border token, radius 4). No outline variant exists in `entry.sh StatCard`.

## 5. Command > My Works "Where you left off" `26:65162`, `26:66380`
- Command header "Welcome back, [person name]." and subtitle; tabs **My works 3** (active) · Decisions 6 · Conversations 3 · Following 3; Cooper ask field right of tabs; section title **WHERE YOU LEFT OFF**; right: priority segment Normal · High · **Critical** (selected) and a filter icon. Right column: COOPER'S WORK RESULTS ring and a Milestone / calendar card (Draft, Re-submit, SG2 window, Gate; "9d left"). DS `HomeRowCard` (row), `Tabs`, `SegmentedControl`.
- **Row 1 (primary, orange/copper outline, 124 high, map media on the right):** rank 1 · "Grid lines — substation retrofit" · Build badge · clock + "Yesterday" · **Updated** pill (blue) + "Cooper filed 3 of 5 line edits you were away" · arrow button.
- **Row 3 = the J25 card (secondary, 72 high):** rank 3 · **"Resubmission — stage gate 2"** · **Build** badge · clock + "Sep 1" · status **Updated** (blue pill) in the status column · note "Diana received her open comment on line 18." (old story; the prototype fills `[person name]`) · arrow button. Row 2 shows **Draft** (plain text, no pill): "Untouched since you left off · resume at § b."
- **Resume rule (dev note):** My Work has 2 card statuses: **Updated** (someone changed something while you were away) and **Draft** (nothing changed while you were away). The **arrow button takes you to the page where you left off.** The date is the last time you touched the item. A card whose item was resubmitted stays in the list `[Assumed]` as "Resubmission — stage gate 2" with status **Updated** until the gate decision; it is a work item, so it stays until done (dev note 2:119897).
- **After "Send for approval" (J25 step 5):** the item appears (or is promoted) as row 1, `Updated`, badge Build, "Resubmission — stage gate 2", date "Just now"/today, note text `[Assumed]` "Waiting on stage gate 2". Command keeps the Decisions/Following lists as they are; it does **not** get a notification for the user's own resubmission.

## 6. Navigation
1. Bell (NavBar, any page) -> tray (Drawer). Tab / filter changes stay inside the tray.
2. Card -> **Build**, Refine area of the investment, with the changed card outlined (section 4); card becomes read; tray closes. (Hash `#build-refine?...&focus=cost` `[Assumed]`; no deep link exists in Figma.)
3. In Build, the owner adjusts **Cost & Schedule** (table or Gantt, already built), then **Value** (impact of the delay: the value measures move because benefit dates move, already built), then the PageHeader **Send for approval** (same button as J08/J09; the Stepper shows Refine then Approve).
4. **Send for approval** -> a toast/confirmation as in J08 (no new frame) -> Command, tab **My works**, row **Resubmission — stage gate 2** (arrow returns to Build).
5. Command -> arrow on a row -> the page where you left off (resume rule above).
6. Tray and Command stay separate: the tray says what happened (history), Command says what to do next (work).

## 7. Data mapping
- **Investments:** only 3 Whistler records have stage `Executing` in `shared/whistler-data.js`: `79614` "Automation Systems" (CA23031, owner Priyanka Iyer), `79610` "Deploying upgraded technology infrastructure" (CA23027, Theo Marsh), `79603` "Engineering Design Unit 3" (CA23020, Ravi Banerjee). **None of them has alternatives or milestones in the data** (alternatives and milestones exist only for 104860, 2891, 2892, 2893, 8380; milestones only for 104860, 2891, 8380, and `isRecommended` marks the alternative). STAGE_TO_CATALYST maps Executing to **Results**, not Build.
- **Proposal** `[Added]`: use an `Executing` record (e.g. `79603` Engineering Design Unit 3, with the owner overridden to the persona Hollis Grant, `[Assumed]`) and generate alternatives and milestones for it from the pattern of `2891` "Replace Transformer" (Project Start · Removal Complete · First/Second/Third Replaced · Project End). Or re-stage `2891` as Executing in `whistler-additions.js` (it already has real milestones and a recommended alternative). Needs a decision (section 8).
- **The revision:** one milestone `[Added]` named "Energization" with forecast **Mar 2027 -> Jun 2027 (+3 months)** (Figma copy); the notification title/details come from it, not typed in a screen. The Cost & Schedule table/Gantt shows the milestone moved plus the downstream shift of spend by year `[Assumed]` rule: spend after the milestone moves by the same months; `spendByYear` and `spendByAccountByYear` come from the alternative.
- **Value impact of the delay:** benefit dates shift by 3 months, so value by measure and residual risk by year (`riskResidualByYear`, `riskResidualByMeasure`, `valueByMeasure` on the alternative) change by the shift `[Assumed]` rule in `shared/refine-model.js`; the Value page shows the new figures (already built, needs the re-timed inputs).
- **Notification records** `[Added]` in the same `notes` store (`usePersisted('notifications')`): `{ id, cooper: true, title, details, meta: "{code} · {name}", time, read, category: 'follows' | 'my-work' | …, link: 'build-refine?…', count }`. Group "Your summary" count = number of updates on the item (kept in the data, never decreases).
- **My Works records** in `shared/whistler-command.js` (`OWNER_WORKS`): an item `{ id, title: 'Resubmission — stage gate 2', badge: 'Build', when, status: 'Updated', note, open: 'build-refine…' }`. The existing `w-poles` item ("Resubmission — {invById(2889).name}", Updated) already has this shape; the title is **different** from the Figma text (stage gate 2).
- **Names:** `[person name]` -> the invented names in `shared/names.js` (Hollis Grant is the persona). Meta shows the real code and name (e.g. CA23020 · Engineering Design Unit 3).

## 8. Gaps and conflicts (non-DS or need confirming)
1. **Tray header buttons:** "Mark all as read" + filter icon sit in the header next to the title; the DS `Drawer` header takes `title` only (a slot is not documented). Possibly NDS. Also **"Sort & filter" popover** is not drawn (Category, Date = Last 30 days / All time, Unread only?). `[Assumed]` only; the filter count number is the only hint.
2. **Tabs vs filters:** the tray has both tabs (All / My work / Mentions / Collaboration / Follows) and "Sort & filter". The existing app tray (`Notifications`) has neither; both need building. Where a card belongs (Follows) is a rule: `[Assumed]` follows = items you follow, my work = items you own, collaboration = approvals/changes by others on shared items, mentions = @ in a comment.
3. **Card actions conflict:** the app card passes a "View results" action button; Figma says no buttons ever. The current Plan "run finished" notification then needs the whole card as the link.
4. **Read rule conflict:** the app marks all read when the drawer closes; Figma marks read on open (and "Mark all as read").
5. **The highlight:** only `2:115886` shows it (a 1 px blue outline on one stat card, no label). The section-4 variant `2:118889` shows no outline in its crop; the page content there changes instead. No frame for highlight clearing, for a non-stat section (e.g. a table row or Gantt bar) or for the Refine pages. For J25 the changed element is a milestone on Cost & Schedule `[Assumed]`: outline the changed row (table) or milestone bar (Gantt).
6. **Stage mismatch:** Executing records map to Results; J25 opens Build and "resubmits" at stage gate 2. Needs a product decision (is an executing investment editable in Build?). No stage gate model in the data.
7. **No "Energization" milestone and no alternatives on Executing investments** (section 7).
8. **Group expand, empty state, date separators, "All time"** not drawn.
9. **My Works:** no frame of the resubmitted card right after "Send for approval", nor the "Waiting on stage gate 2" note (`[Assumed]`). Figma row 3 uses "Sep 1" and an old story note.
10. Figma list shows copy "Your summary" for a Cooper group. It is a title on the grouped card (not a section header).

## Summary
1. The tray is a 440 x 828 right drawer: NOTIFICATIONS, Mark all as read + filter icon, 5-tab segmented control, history cards (avatar, title, details, meta, time, chip, red unread dot), grouped stack with a count bubble, end line "That's everything from the last 30 days."
2. Cards have no buttons; a click opens the object and marks the card read; the J25 card is a Follows card from Cooper.
3. The changed section is shown by a 1 px blue outline on the changed card, with the page scrolled to it and nothing else added (only in `2:115886`; the other variant is unclear).
4. My Works row 3 "Resubmission — stage gate 2" (Build, Updated, arrow resumes where you left off) is the card after "Send for approval".
5. Biggest gaps: no alternatives or milestones for the 3 Executing investments, stage Executing maps to Results, and the filter popover plus group-expand are not drawn.
