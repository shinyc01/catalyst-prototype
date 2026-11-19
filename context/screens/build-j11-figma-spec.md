# Build J11 (Investment Owner · Data Quality Validation & Submission): Figma screen spec

Source: Build handover `BmOuH8YCHltiitqwNW2ARt` (plus the Command handover dev note `26:70319`, text only). Every frame is 1440 x 900 and was screenshotted once. Copy in **"quotes"** was read off the screenshots (never off layer names). Dev-note text was read from the file.

Figma copy is an old story (Southern Feeder Replacement, Circuit 14B, `INV-2025-0842`, Ridgeview Village, Targeted Hardening, "Jeff Pauska (You)", Tom Nguyen, John Thomson, James R., Isabella Grant). The prototype keeps the copy *patterns* and fills names, numbers and ids from `shared/` (section 5). Real-looking person names are written "[person name]". Owner persona avatar "JP"; reviewer avatar "IG" (purple).

DS names were looked up in `vendor/ds2/api.md`. "non-DS" means no kit component, so wrap it in `NDS`.

**Already built (do not redo):** Build Library (Idea Pad already shows UNDER REVIEW with an "n/m" `Counter`, DEFERRED, REJECTED), Shape / Idea overview with the System confidence sidebar and "Send for review" button (`app/screens/build.jsx`), Refine pages with System confidence (`app/screens/refine.jsx`). J11 adds what happens *after* "Send for review" and *after* readiness reaches 100%.

## 1. Frames found

| Node | Name / sticky | Use in J11 |
|---|---|---|
| `43:124632` | Review: approval chain (owner) | Owner view after Send for review, status "Under review 0/3" |
| `43:141215` | Reviewer: Readiness Evaluation + Decide | Reviewer lands on the idea, Decide split button |
| `43:128734` | Reviewer: Proceed to investment modal | Proceed confirmation with note |
| `43:128039` | Reviewer: investment approved toast | After approve, status 2/4, "Proceed" disabled |
| `43:125157` | Section "Statuses" (4 frames below) | Owner's approval chain per outcome |
| `43:125351` | "More information requested" | Revisions required (header "Shaping") |
| `43:125158` | "Stopped idea" | Rejected (menu Activity, Restore idea) |
| `43:125291` | "Approved idea" | Approved (header "Refining") |
| `43:125231` | "Parked idea" | Deferred (header "Deferred") |
| `58:31702` | Section "Approve": Entry point | Refine at readiness 100% with **Send for approval**, then chain opens |
| `58:33560` | Section "Approve": Navigate to other pages | Collapsed / Expanded chain beside Overview, Other page opened (Details) |
| `43:127104` | Dev note, reviewer push notification | Text read, see 3.4 |
| Command `26:70319` | Dev note, push and reminder logic | Same rules, longer text |

Not drawn: the Decide menu open, the Request info / Park / Stop dialogs, the Send for review dialog where the owner "adds notes per reviewer" (only the empty "+ Add note" rows are drawn), the bell notification and email for a push, comments panel states. See section 6.

## 2. Screens

### 2.1 Owner: Review, approval chain `43:124632`

**What:** the page the owner lands on after **Send for review**. The Shape canvas is replaced by a full-width approval chain.

**Layout (1440):**
- NavBar 48 px (Build active, bell red dot, avatar "JP").
- Page header 40 px: back chevron + title (**"Southern Feeder Replacem..."** truncated) · id `INV-2025-0842` with a caret · status **"Under review"** (orange dot) + `Counter` **"0/3"** · centred Stepper of 4: **Shape** (done, check), **Review** (current, hatched bar), **Refine**, **Approve** · right: collaborators chip **"3/5"** (people icon), comment icon button, divider, **"Dismiss"** (secondary), **"Refine"** (primary, disabled).
- Panel **"APPROVAL CHAIN"** (title row 40 px, right: expand/collapse diagonal icon and "bar-arrow" collapse icon). Card inset 12 px, radius 12.
- Table (compact view): header **USER** (filter icon) · **NOTE**. Rows 48 px with a left status rail (32 px mark + dashed connector):
  1. Owner row, green check: avatar "JP" **"Jeff Pauska (You)"** / "Investment owner". No note cell.
  2. Reviewer, empty circle: avatar "TN" **"Tom Nguyen"** / "Finance Lead" · **"+ Add note"**
  3. Reviewer, empty circle: photo avatar **"John Thomson"** / "Field Team Lead" · **"+ Add note"**
  4. Reviewer, empty circle: avatar "UN" **"James R."** / "Value Framework Owner" · **"+ Add note"**
- BottomSheet: **"COOPER'S CONTEXT"** · **"16 Documents"** button · upload icon · prompts **"Find similar past ideas"**, **"What could block this idea?"** · Cooper orb.

**Clicks:** **+ Add note** opens an inline text area on that row (rules from the DS: the owner can add a note to any reviewer; a reviewer only to their own row; only the author edits or deletes it). Filter icon on USER shows only when more than 3 reviewers (here 4 rows incl. owner, so DS `filterable` default is on). **Dismiss** as in J07 (Idea Pad + Undo toast). **Refine** stays disabled until approved (2.6). Diagonal icon toggles compact to full view (adds COMMENT, LAST NOTIFIED, action).

**DS map:** PageHeader (title, id, `Indicator` + `Counter`) · Stepper (current=1) · CollaboratorsButton (3/5) · IconButton · Button · **ApprovalChainPanel** (`mode="full"`) containing **ApprovalChainTable** (`view="compact"`, `currentUserId`, `ownerId`) · BottomSheet with DocumentsContext · PromptButton. Rows use ApprovalStatus (`empty`, `success`).

### 2.2 Reviewer: Readiness Evaluation and Decide `43:141215`

**What:** a reviewer opens the idea from a notification or the Command inbox. Same Idea overview as Shape, read-only, plus the evaluation sidebar and the Decide action.

**Layout (1440):**
- Header: back + title/id · **"Under review"** + counter **"1/4"** · Stepper of **3** only (**Review** current, Refine, Approve; no Shape) · right: **"3/5"** chip, comment icon, divider, **"Approval chain"** (secondary), **"Decide ▾"** (primary SplitButton, white). Avatar "IG" (purple) in the NavBar.
- Content x 12-1048, scrolls: IDEA OVERVIEW (title "Southern Feeder Replacement — Circuit 14B" + one-line summary) · THE NEED · ALIGNED ENTERPRISE GOALS (chips) · STRATEGIC RELEVANCE (5 coloured segments 40/35/13/7/5 %, legend Reliability, Financial, Environment, Social, Governance) · AFFECTED ASSETS & AREA (map) · RECOMMENDED ALTERNATIVE ("Targeted Hardening", BCR 2.5, Cost range $2.4M-$3.8M, Timing ~ 8 months, Potential value 6M-9M) · OTHER OPTIONS. Every card has the Cooper dot icon top right. This is the Shape page already built (`build.jsx`), read-only.
- Right panel **"READINESS EVALUATION"** (x 1060-1428, header 48 px, Cooper dot):
  - Summary card: **"Strong Investment Need"** + 3-line text ("This ladders cleanly to a top-three objective, the consequence of inaction is high and near-term, and the indicative cost is modest against the risk removed.").
  - Collapsed `ReadinessSection` rows (40 px): **"Strategic alignment"** badge **STRONG** (green) · **"Worth pursuing"** **FAVOURABLE** (green) · **"Portfolio fit"** **1 OVERLAP** (grey) · **"Red flags"** **1 TO NOTE** (grey).
  - Open section **"Approval notes"** with `Counter` **2**: one card per note, avatar + name, quote in a left-ruled block: John Thomson "7 feeder sections show deteriorating condition indicators and increasing likelihood of reliability issues." and James R. "Current feeder loading is approaching operational limits, reducing flexibility during future demand growth or outages." These are the notes the owner added per reviewer in 2.1 (journey step "adds notes per reviewer"); the reviewer sees the notes of the others, not their own empty row.

**Clicks:**
- **Decide ▾** opens a menu. Items per the journey: **Proceed**, **Request info**, **Park**, **Stop**. Menu is not drawn; the SplitButton primary part does the first item. `[Assumed]` which is primary: Proceed.
- **Approval chain** opens a popover under the button (DS `ApprovalChainPanel mode="popover"`) showing the compact chain.
- Section caret expands the section (single or multi open: DS supports an array).
- Chips "Find similar past ideas", "What could block this idea?".

**DS map:** PageHeader · Stepper · **SplitButton** (`items` = the four decisions, with description lines per Figma) · Button · **Panel + ReadinessEvaluation** (`summary`, `sections`, `ReadinessSection` with badge or `count`, `ReadinessFacts` for the body of a section) · CollaboratorsButton · Cooper dot = CooperIcon. The idea cards are the existing Shape cards. Do not use the Shape page's `ConfidenceGates` here: Readiness Evaluation shows no "Approval readiness" gate list in this frame (the summary head is the title), so omit `readiness`.

### 2.3 Reviewer: Proceed to investment modal `43:128734`

**What:** Decide > Proceed. Overlay dims the page; the evaluation panel collapses to a 24 px rail (arrow-left icon at the right).

**Layout:** Modal 400 x 350, at x 525-924, y 275-625, radius 12, elevated.
- Title **"PROCEED TO INVESTMENT"** (uppercase).
- Body: **"This idea will leave Shape and become an investment. Its context, history, and approvals stay attached."**
- Label **"Note"**, text area 378 x 142 with placeholder **"Add a short approval note for the investment record."** (optional, no counter).
- Footer right: **"Cancel"** (secondary) · **"Approve investment"** (primary, white).
- Under the overlay the header still shows **"Under review" "1/4"** and the SplitButton caret flipped up (**"Decide ▴"**, menu closed).

**Clicks:** **Cancel** or Esc closes, no change. **Approve investment** closes, updates the chain (reviewer row turns green, note saved on the reviewer's row), counter 1/4 to 2/4, shows the toast (2.4).

**DS map:** **Modal** (title, body, `footer` with two Buttons) + TextArea (label "Note") . Shape: DS Modal size S.

### 2.4 Reviewer: investment approved toast `43:128039`

**What:** the same page after approving, no overlay. Header counter **"2/4"**; the SplitButton is replaced by a disabled **"✓ Proceed"** button (check icon, grey); **"Approval chain"** remains.

**Toast:** bottom centre, at x 560-880, y 792-840. Text **"The investment has been approved."** · **Undo** (icon arrow-back-up + label, secondary S). No close X, no title.

**Clicks:** **Undo** reverts the decision (row back to empty, counter 1/4, **Decide ▾** returns). Toast auto-dismisses.

**DS map:** `IFS.toast({ description, secondaryAction: { label: 'Undo', iconLeft: 'arrow-back-up' }, showClose: false })` (Snackbar). Note the kit toast appears top-right; Figma places it bottom centre: same conflict J07 already raised for the Dismiss toast, follow whatever J07 chose. Disabled "Proceed": Button secondary, disabled, `iconLeft="check"`.

### 2.5 Owner: statuses `43:125157`

Same screen as 2.1, **full view** (COMMENT, LAST NOTIFIED and action columns present). Section has four frames, one per outcome. Common layout: header status + stepper + chain; rows 48 px (or taller when the note wraps); the status rail marks: green check (approved), orange clock (awaiting a reply), red cross (rejected or revisions), empty circle (not acted). Note and comment cells show full text (wrapping, up to 190 px tall). Bottom prompts change to **"Prepare decision summary"** and **"Summarize unresolved gaps"**.

| Frame | Header status | Stepper | Header buttons | Chain rows |
|---|---|---|---|---|
| **Revisions required** `43:125351` | "Shaping" (purple dot, no counter) | Shape done, Review hatched (current), Refine and Approve off | Dismiss, Refine (disabled) | Owner green · reviewer 1 orange clock, NOTE (long text), COMMENT "The cost range needs a clearer benchmark before I can sign off.", LAST NOTIFIED "Feb 15, 2025", button **"Notified"** (disabled, bell icon) · reviewer 2 **red cross**, COMMENT "The cost range needs a clearer benchmark before this idea can move forward.", button **"Shape"** (frame icon) · reviewer 3 green |
| **Rejected** `43:125158` | "Rejected" (grey, dimmed) with caret up | same, Refine/Approve dimmed | Dismiss, Refine (disabled) | Reviewer 2 red cross, COMMENT "I don't think this idea should move forward in its current form. The need is valid, but the asset scope is too broad overl…" (truncated); no action button. Caret opens a menu: **"Activity"** (history icon), **"Restore idea"** (arrow-up icon) |
| **Deferred** `43:125231` | "Deferred" (grey dot) | Review done (check) | Dismiss, Refine (disabled) | Reviewer 2 red cross, COMMENT "We should revisit this idea after the next field inspection.", button **"Set reminder"** (calendar-bell icon) |
| **Approved** `43:125291` | "Refining" (purple dot) | Shape and Review done, **Refine** current | Dismiss, **Refine** (enabled, white) | All four rows green; reviewer 2 comment kept; LAST NOTIFIED still "Feb 15, 2025" |

**Clicks:**
- **Shape** (Revisions required): return to Shape (2.7) with the reviewer's comment attached; status goes back to "Shaping"; the chain is kept, so Send for review starts a new round `[Assumed]`.
- **Restore idea** (Rejected): idea goes back to "Shaping" and Shape page `[Assumed]`; **Activity** opens the activity panel (DS `ActivityPanel`) with the approval entries.
- **Set reminder** (Deferred): sets a revisit date `[Assumed]`: DS `DatePicker` popover; at the date the idea returns to the owner's Command inbox. Not drawn.
- **Refine** (Approved): opens Refine (2.8) for the new investment.
- **Notified**: disabled; tooltip shows the live countdown (3.4).

**DS map:** same as 2.1 with `view="full"` and approvers carrying `status` (`success | awaiting | rejected | revisions | empty`), `comment`, `lastNotified`, `action: { label, icon }`. Header status: `Indicator` type per state. `"Rejected"` caret menu: `ActionMenu`. No kit part for the "Stopped idea" caret on the status text: header title dropdown is the same one the id shows (id has a caret), so use the PageHeader id menu. Confirm in build.

### 2.6 Owner: Refine, Entry point `58:31702` (left frame)

**What:** Refine Investment overview (already built in J09) with readiness at **100%** and **Send for approval** enabled.

- Header: status "Refining"; Stepper Shape, Review done, Refine current (hatched), Approve; right: "3/5", comment icon, **"Dismiss"**, **"Send for approval"** (primary, white, cursor on it).
- Panel **"SYSTEM CONFIDENCE"**: "Approval readiness" ring **100%**, four gates **Passed** (Investment readiness, Path forward, Assumption consistency, Review blockers); Open questions **2**, Warnings **2**, both items with green dots ("WDRM v4 concentration above cap", "Affordability under intended target").
- Content: the J09 Overview page. Bottom prompts: "Generate Annualized outcome risk by risk type chart", "Compare to best practice".

**Clicks:** **Send for approval** opens the approval chain (2.7). With readiness under 100% the button is disabled `[Assumed]`: the frame shows only the enabled state. "System confidence" gate labels are hard-coded in the DS (see decisions 2026-11-18), reuse the Plan composition (Panel + ConfidenceGates) if "Approval readiness" needs a different label.

### 2.7 Owner: Approve, approval chain open `58:31702` (right frame) and `58:33560`

**What:** after **Send for approval** the right panel swaps to **"APPROVAL CHAIN"**; the page stays on Overview.

- Header: **"Under review"** (orange) + counter **"0/3"**; Stepper Shape, Review, Refine done, **Approve** current (hatched); buttons **Dismiss**, **"Pro..."** (disabled, white-grey; text clipped, probably "Proceed" or "Publish": the label cannot be read, see section 6).
- Panel (right, 340 wide, compact view): USER · NOTE; rows: owner "(You)" green · **"Isabella Grant"** (purple avatar "IG") / "Asset Manager" · **"John Thomson"** / "Field Team Lead" · **"James R."** / "Value Framework Owner" ; each reviewer **"+ Add note"**.
- Panel behaviours (`58:33560`, three frames): **Collapsed** (84 px rail with the bar-arrow icon, page uses full width), **Expanded** (panel visible beside Overview), and **Other page opened** (sidebar nav shows Overview, Details, Alternative comparison, Value, ALTERNATIVES list; the chain stays on the right while the user opens Details).

**Clicks:** bar-arrow icon collapses to a rail or opens it; the diagonal icon expands to the full-width view (as 2.1); **+ Add note** as in 2.1. Notifications go to the reviewers on send.

**DS map:** `ApprovalChainPanel` `mode="sidebar"` (`collapsed`, `onCollapsedChange`, `onExpandedChange`) with `ApprovalChainTable view="compact"`. The sidebar nav (Overview, Details, ...) is the existing Refine sidebar.

### 2.8 Comments (journey end)

No frame in the nine read. The header comment icon exists on every screen (2.1, 2.2, 2.5, 2.7) and the J08 comments panel (`55:52663`) is already built in Refine; reuse it, scoped to the idea (Shape) or the investment (Refine). `[Assumed]`.

## 3. Status model

### 3.1 Idea / investment status (header, Library)

| Status | Dot | Shown when | Stepper | Header buttons |
|---|---|---|---|---|
| Shaping | purple | owner is editing; also after a reviewer asks for revisions | Shape current | Dismiss, Send for review |
| Under review `n/m` | orange | after Send for review (Review) or Send for approval (Approve) | Review or Approve current | Dismiss, Refine / Proceed disabled |
| Refining | purple | all reviewers approved the idea | Refine current | Dismiss, **Refine** enabled |
| Deferred | grey | a reviewer chose Park | Review done | Dismiss, Refine disabled |
| Rejected | grey, dimmed | a reviewer chose Stop | Review dimmed | Dismiss, Refine disabled |
| Approved (investment) | n/a | after the Approve round completes | Approve done | not drawn |

### 3.2 Reviewer row status (ApprovalStatus)

`empty` (not acted) → `success` (approved), `rejected` (Stop, Park, or Request info with a comment), `awaiting` (overdue: orange clock, "time to notify"), `revisions` (Request info). The Figma "Revisions required" frame draws John with a red cross, so revisions and rejection share the red cross: the difference is the header status and the **Shape** action.

### 3.3 Decide menu to outcome (journey, not drawn)

| Decide | Dialog | Idea status | Row |
|---|---|---|---|
| Proceed | "PROCEED TO INVESTMENT" (2.3) | counter +1; when all approve: Refining | green check |
| Request info | note/comment required `[Assumed]` | Shaping, owner gets **Shape** action | red cross + COMMENT |
| Park | comment + revisit date `[Assumed]` | Deferred, owner gets **Set reminder** | red cross + COMMENT |
| Stop | reason `[Assumed]` | Rejected, menu **Restore idea** | red cross + COMMENT |

Counter: `approved / total reviewers`. Figma shows 0/3 (owner view, 3 reviewers) but 1/4 and 2/4 on the reviewer frames: count the owner or not? The prototype counts the **3 reviewers** (0/3 → 3/3), as the Library does today; flag in section 6.

### 3.4 Push and reminders (dev notes `43:127104`, `26:70319`)

- Trigger: a reviewer has a pending approval and has not acted for N days (e.g. 3).
- Two sources, not merged:
  - **Manual push:** owner clicks the row action in the chain (frame shows the disabled **"Notified"** state after use). Attributed to the owner ("[person name] nudged you"). Fires immediately, no threshold. **Max 1 per reviewer per 24 h**; DS `pushCooldownHours=24`, `onPush` shows the "Reminder sent." toast, stamps LAST NOTIFIED and disables the button with a countdown tooltip.
  - **Auto-reminder:** system-sent, impersonal, references elapsed time; at day **3, 5, 7**, then stops (cap). Dev note says "after 7 days of inactivity" and also "day 3, 5, 7": contradiction, see section 6.
- Both channels: in-app notification (bell + toast) and email, deep-linked to the reviewer's approve / request-changes action. Respect per-user preferences (email off → in-app only).
- Stop conditions: reviewer acts, owner withdraws, reviewer replaced, approval closed. Cancel queued reminders.
- Log each push in the Activity log: "{[person name] pushed [person name]}".
- Prototype: no real clock. Add a "Skip 3 days" control in the Prototype settings drawer (non-DS) that advances a demo date so rows turn `awaiting` and auto-reminders can be shown. The first row in 2.5 is already `awaiting` with LAST NOTIFIED "Feb 15, 2025" (a date, not "N days ago").

## 4. Navigation

1. Build Library (Idea Pad) → row → Shape (built) → **Send for review** → Review chain (2.1), Library row shows UNDER REVIEW 0/3.
2. Reviewer: bell / Command inbox → idea (2.2) → **Decide** → Proceed → modal (2.3) → toast (2.4). Persona switch in Prototype settings (Reviewer view). `[Assumed]`: the prototype switches persona to the reviewer for this step, with a visible "Viewing as [person name]" label.
3. Owner returns: chain shows statuses (2.5) → **Refine** → Refine Overview (built) → readiness 100% → **Send for approval** (2.6) → chain open (2.7).
4. Entry points not in the frames (wire them, per project memory): Library row of an UNDER REVIEW idea opens 2.1; the Collaboration badge "View reply" opens 2.5 for a revisions or deferred idea; header "Approval chain" button on Refine reopens the panel.
5. Back chevron → Build Library. Top-level NavBar Build → Library. Each state has a deep link, e.g. `#build-review?…`, `#build-reviewer?…` (names set in the build).

## 5. Data mapping

- **Investment:** real `8380 Pad-Mount Transformer Replacement Program V2` (`DIST000246`, Electrical Distribution, stage Initial), owner Hollis Grant `[Added]` (title). The id/code in the header comes from the real record, not `INV-2025-0842`.
- **Recommended alternative card (2.2):** real alternatives of 8380 (`IDEA_ALTS`): Aggressive Replacement, **Median Replacement** (recommended, 6 units), Minimal Replacement. BCR, cost range, timing and potential value come from `shared/` (`ALT_DESC`, `RF_ALTS`, BCR rule in `whistler-additions.js`), not "2.5 / $2.4M-$3.8M / ~8 months / 6M-9M".
- **Reviewers (invented, `shared/whistler-command.js` PEOPLE; roles `[Assumed]`):**
  - Finance Lead → **Noah Lindgren** (Capital Finance Analyst)
  - Field Team Lead → **Luca Ferri** (Field supervisor)
  - Value Framework Owner → **Kenji Mori** (Product Lead) `[Assumed]`; or the Review round could use **Owen Fitch** (Portfolio Owner)
  - Approve round Asset Manager → **Mara Delgado**. Mara is already the Asset Manager persona in Command, whose inbox contains 8380.
  - Reviewer view persona: Noah Lindgren (avatar `NL`, purple). Owner: Hollis Grant (avatar `HG`).
- **Notes and comments:** write new `[Added]` text tied to real numbers, e.g. a Finance Lead comment on the cost range of the Median Replacement, a Field Team Lead note on pad-mount condition (12 pad-mounts 1944-45, normalized age 1.26 to 1.41). Never reuse the feeder sentences. LAST NOTIFIED = demo date minus N days, not "Feb 15, 2025".
- **Readiness Evaluation (2.2):** summary title and the badges (STRONG, FAVOURABLE, 1 OVERLAP, 1 TO NOTE) are `[Assumed]` rules; derive them from existing model values: alignment from strategic relevance, overlap from the other investments on the same assets (2891, 104860, 2892, 2893 touch the cluster), red flag from open System confidence warnings. Put them in a new `shared/review-model.js`.
- **Collaborators chip "3/5":** keep the pattern, count from the people list. Documents "16 Documents": use the idea's real documents count already in `build.jsx`.
- **State:** per-idea review record (reviewers, notes, comments, decisions, lastNotified, pushedAt) persisted with `usePersisted`; Library status and counter read it so every screen agrees.

## 6. Gaps and conflicts

1. **Decide menu not drawn.** Items Proceed / Request info / Park / Stop come from the journey only. Dialogs for Request info, Park, Stop, and the Send for review dialog are not in the frames (only "Approve investment" modal).
2. **Counter 0/3 vs 1/4 and 2/4.** Owner frames count 3 reviewers; reviewer frames count 4 (including the owner?). Prototype: 3 reviewers, owner never counted.
3. **Reviewer sets differ** between the Review chain (Tom Nguyen, John Thomson, James R.) and the Approve chain (Isabella Grant, John Thomson, James R.). The prototype uses one set of three for Review and replaces the first with the Asset Manager for Approve, or confirm that one set serves both.
4. **Rejected vs Revisions vs Deferred** all show a red cross; only header text, caption and the action button differ. A distinct mark for Deferred (grey) would help; not in the Figma.
5. **Header buttons on Approve** (`58:31702` right frame): the disabled button reads "Pro..." and cannot be read; the left frame shows "Refine" as primary at 100%. Assumed "Proceed" (same as the reviewer's disabled "✓ Proceed"). `[Assumed]`
6. **"Send for review" vs "Send for approval"** (open question 35). J11 uses review for idea → investment (Shape → Review) and approval for investment (Refine → Approve), as the frames show.
7. **Push button not drawn** in the active state: only the disabled "Notified" is visible. The DS `ApprovalChainTable` supplies the active "Notify" row action; label to confirm.
8. **Auto-reminder timing** in the dev note: "after 7 days of inactivity" vs "day 3, 5, 7". Prototype: day 3, 5, 7 then stop.
9. **Toast position and chrome**: Figma places the toast bottom centre with Undo and no close; the kit toast appears top-right. Follow the J07 decision.
10. **Reviewer panel when the owner views the chain in the sidebar** (2.7) is 340 wide; the DS panel width may differ. Check in the build.
11. **Real names:** all Figma names are real-looking. Do not copy them.
12. **Stepper on the reviewer page has 3 steps** (no Shape); the DS Stepper accepts any `steps` array. Non-DS: the "Viewing as" persona label.

## Summary
1. J11 adds the approval chain and reviewer side after Send for review, plus Send for approval after Refine; nine frames read once each.
2. Built from DS `ApprovalChainPanel` + `ApprovalChainTable`, `ReadinessEvaluation`, `SplitButton`, `Modal`, `toast`; only the "Viewing as" label and the demo-clock control are non-DS.
3. Status model: Shaping, Under review n/m, Refining, Deferred, Rejected; row marks empty, success, awaiting, rejected/revisions; Decide outcomes mapped (some `[Assumed]`).
4. Push: manual max 1 per reviewer per 24 h (DS built in), auto day 3, 5, 7, both bell + email, logged to Activity.
5. Data: investment 8380, Median Replacement recommended, reviewers from invented PEOPLE; 12 gaps listed, main ones are the undrawn Decide menu, counter 0/3 vs 1/4, and differing reviewer sets.
