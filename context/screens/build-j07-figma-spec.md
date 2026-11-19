# Build J07 (Investment Owner · Investment Creation): Figma screen spec

Source: Build handover `BmOuH8YCHltiitqwNW2ARt`. Every frame is 1440 x 900 (a few 1448 wide) and was screenshotted once. Copy in **"quotes"** was read off the screenshots (never off layer names). Sticky-note and dev-note text was read from the file.

Figma copy uses an old story (Ridgeview Village, Circuit 14B, Northgate, Demeter SS, Recloser R-1, "Catskills · Hudson Valley, NY"). The prototype keeps the copy *patterns* and fills names, numbers, counts and ids from its own data layer (`shared/`). Real-looking person names are written "[person name]". Persona in every frame: Investment Owner, avatar "JP".

DS names below were looked up in `vendor/ds2/api.md`. "non-DS" means no kit component, so wrap it in `NDS`.

## 1. Frames found

Pages: "Build Library" `16:2` (section `564:68021`), "Create New Investment" `34:145558` (section `73:113637`), "1 Idea - Shape" `43:3` (section `43:62690`).

| Node | Name / sticky | Use in J07 |
|---|---|---|
| `564:91122` | Default, Idea Pad | Library start (section `564:91119`) |
| `73:115860` | Create new (sticky "Choose option") | Chooser modal |
| `73:116169` | New investment (sticky "Cooper asking you what your idea is") | Input step S1, with area map |
| `73:116266` | New investment, "User has no GIS connected, no map widget" | Input step S1, no map |
| `73:121453` | New investment, "Change selection / Box" (Build from selection, 5 assets, READY) | Box-lasso result |
| `73:121297` | New investment, in the Box row (not screenshotted) | Box selection, earlier state [inferred from position] |
| `73:117925` | New investment, "Cooper's answer: enough context to move to Shape", no GIS | READY, no map |
| `73:118240` | Idea overview / Investment owner review (sticky "Shape") | Shape landing |
| `43:76732` | Section "Sidebar" | System Confidence panel: Expanded / Collapsed / My answer / Upload file |
| `43:68623` | Section "Edit" | Edit types 1, 2, 3 |
| `43:84874` | Section "Dismiss idea" (frames `43:84875`, `43:85895`, `564:175746`) | Dismiss, modal, Idea Pad + toast |

**Other frames in the same file (not asked for, listed for the build):**

| Area | Nodes |
|---|---|
| Duplicate Investment, section `73:113638` | `73:114496` Create new, "Choose option" · `73:113639` list, "Choose investments" · `73:113963` Duplicate modal · `73:114811` Shape of the copy ("investment page") · `564:138589` Idea Pad start |
| Input, "Start with ideas" section `73:115540`, no-GIS prompts | row 1: `73:118120`, `73:118166` (user explains the need) · `73:117164`, `73:117315` (Cooper analysing) · `73:117466` (not enough context) |
| Input, "Use Cooper's prompt" (GIS) | `73:116310` (hover) · `73:116416`, `73:116522` (analysing) · `73:117525`, `73:117730` (Cooper answer, user has GIS) · `73:117660` (user has no GIS, list of 3 assets) |
| Input, upload a file | `73:116628` · `73:117208`, `73:117359` (analysing) · `73:117968` (enough context) |
| Input, map resize | `73:116730` · `73:116837` (Expand) · `73:117019`, `73:117125` (Collapsed) |
| Input, map selection | Lasso `73:119607`...`73:121136` (rows y=5934); Box `73:119122`...`73:121453` (rows y=7073) |
| Shape after Input | `73:121633`, `73:122350` (Shape landing, from lasso and box) |
| Library tabs | Idea Pad `564:89777` · Investments `564:90079` · All / Project / Program investments `564:92208`, `564:92527`, `564:92763` · Investments row menu `564:91917` |
| Library states | Segmented control (`564:68028`, `564:68490`, `564:68330`) · Sorting (`564:77335`...) · Filtering (`564:78568`...) · Search (`564:80969`...) · Table configuration (`564:82232`...) · Ranking (`564:68709`...) · Pin (`564:70285`...) · Preview (`564:72431`...) · Activity (`564:73668`...) · Collaboration badge (`564:75687`...) · Row menu (`564:69957`) · Row "Duplicate" modal (`564:75371`, result `564:74656`) |
| Shape detail | Collaboration `43:84152` · Rationale `43:62694`, `43:63507` · Compare `43:65022` |

## 2. Screens

### 2.1 Build Library, Idea Pad `564:91122`

**What:** Build home. The Idea Pad tab is a table of ideas. "New" starts J07.

**Layout (1440):**
- NavBar 48 px: logo · Command, Value, Explore, **Build** (active), Plan, Results · search, gear, bell (red dot), avatar "JP".
- PageTop: title **"Build"**, secondary button **"New"** (pen icon, 70 x 32, top-right).
- Tabs: **"Idea Pad"** (selected) | **"Investments"**.
- Table card, 12 px inset:
  - Bar (40 px): SegmentedControl S **"All ideas 11"** (selected) | **"Project ideas 8"** | **"Program ideas 3"**; right side the Cooper bar **"Ask anything about idea pad"** with mic (360 wide); divider; icon button "table configuration".
  - Header row (32 px): IDEAS, STATUS, HORIZON, MODIFIED, COLLABORATION. Each has a filter icon; MODIFIED also has a sort icon.
  - Rows (60 px). Order: pinned first, then by Modified (default is "manually ranked"). Cell contents:
    - A pin icon appears on hover; a folder icon marks a program idea.
    - STATUS is a StatusIndicator dot + UPPERCASE label: **UNDER REVIEW** (orange, with a "0/4" counter), **NEW** (blue), **DEFERRED** (grey), **SHAPING** (purple), **REJECTED** (dimmed).
    - HORIZON, e.g. "FY29-FY43". MODIFIED, e.g. "Jan 12, 2026".
    - COLLABORATION is a white badge with a "UN" avatar and an action label: **"View reply"**, **"Provide asset health"**, **"Provide asset condition"** (blank when none).
- BottomSheet (base, 40 px): prompts **"Brief me"**, **"What needs my input first?"**, plus the Cooper orb.

**Clicks:**
- New opens the chooser (2.2).
- A row opens that idea or investment (Shape page, see 2.9).
- The Investments tab shows all investments (`564:90079`).
- The row "..." menu offers Duplicate, Pin, Preview, Activity.

**DS map:** NavBar · PageTop (title + action) · Tabs · Table (columns, `tabs` slot = SegmentedControl with counts) · TableToolbar · SmartSearch · StatusIndicator · Counter · CollaborationBadge · ColumnFilter · ColumnSettings · ActionMenu · BottomSheet (base) · PromptButton. The whole screen is the `DataTable` pattern. This is an existing pattern, not new UI.

**States:** the Library has a full state set, in the "Library states" row of the table above. Search shows "Searching" and "No results" (EmptyState). Dismiss lands here with the Undo toast (2.10).

### 2.2 Create new chooser `73:115860`

**What:** modal over the blurred Idea Pad (overlay + backdrop blur).

**Layout:** Modal 440 x 244, centred (x 501, y 328).
- Header: **"HOW WOULD YOU LIKE TO START THE NEW INVESTMENT?"** (uppercase, wraps 2 lines) · close X (24 px).
- Body, two ContentCards (414 x 78, 8 px gap):
  1. **"Start with Ideas"** / "Describe your idea or upload documents. Cooper builds the investment for you" · arrow-right. Hover state is shown (lighter fill).
  2. **"Duplicate Investment"** / "Search any investment. Duplicate it and enhance the copy with new documents and context" (no arrow).

**Clicks:**
- Start with Ideas goes to Input (2.3).
- Duplicate Investment goes to the Duplicate list (2.11).
- X closes the modal and returns to the Idea Pad.

**DS map:** Modal (title, no footer) · ContentCard M (title, description, `iconRight`).

### 2.3 New investment, Input step `73:116169` (and `73:116266`)

**What:** the first step of creation. Cooper asks what the idea is. The page has the J07 header, a chat on the left and an area map on the right.

**Layout (1448 x 900):**
- PageHeader row (40 px): back chevron + **"New investment"** (no ID, no status) · centred Stepper of 5: **Input** (selected, hatched progress bar), Shape, Review, Refine, Approve · right: disabled button **"Shape"** (grey, 56 x 24).
- Left half (about 0 to 720): the Cooper chat card floats, vertically centred in the empty canvas, 522 wide, with an elevated panel style.
  - Header: Cooper dots + **"NEW INVESTMENT"** · icons (new chat, history, resize or open, "...", minimise).
  - Cooper greeting: "What would you like to look into? Start with an area, asset, risk, or question — I'll help you understand what's changing and where attention may be needed."
  - Caption **"START WITH"**, then 3 rows with a return arrow: **"Areas with outdated information"**, **"Areas where risks are increasing"**, **"Areas with changing conditions"**.
  - Input: "+" attach · **"Describe the need..."** · mic.
- Right half (720 to 1448): panel **"AREA OVERVIEW"** (header 48 px with resize and collapse icons).
  - A 3D terrain map shows the region zoomed out, "covering all areas this investment owner is responsible for" (dev note).
  - Left rail with 5 map tools: lasso, box select, eye, layers, map settings.
  - Legend (bottom-right): CLUSTERS, TRANSMISSION LINES, DISTRIBUTION LINES.
  - Footer bar: REGION (dropdown) · CENTER (coordinates, dropdown) · SCALE (slider) · compass, locate, globe.
- BottomSheet strip: **"COOPER'S CONTEXT"** · progress bar · **"0%"** · upload icon.

**No-GIS variant `73:116266`:** there is no map panel and no map tools. The same chat card is centred horizontally (460 to 980). Sticky: "User has no GIS connected, no map widget".

**States:**

| State | Frame | What changes |
|---|---|---|
| Hover on a start row | `73:116310` | Row highlighted |
| Typing | `73:118120` | The message sits in a multi-line field, the send arrow appears, context 0% |
| Cooper analysing | `73:117164` | Not screenshotted, see section 4 |
| Prompt answered with GIS | `73:117525` | User bubble "Show me areas with outdated information" · Cooper: "I found 12 areas with outdated asset information across your portfolio. The biggest gaps are in [site names] … I'm highlighting these areas on the map." The map zooms in, areas are highlighted in copper, a "Cooper" cursor chip appears, context **20%** |
| Prompt answered, no GIS | `73:117660` | "I found 3 assets with outdated information in your portfolio…" plus 3 rows (asset name left, date right: "Feb 2019", "Jul 2020", "May 2021"), context **55%** |
| Upload | `73:116628`, `73:117208` | The whole canvas gets a dashed purple drop outline. The file chip reads "Investment goal / PDF" |
| Not enough context | `73:117466` | Cooper keeps asking questions. The Shape button stays disabled |
| Enough context | `73:117925` | See 2.5 |

**Dev note (file):** until Cooper has enough context to form an idea, he asks clarifying questions or requests more inputs (documents, notes, other supporting information).

**Three ways to add a file (dev note, `73:118225`):** drag and drop into the chat · "+" button · Upload button in the footer.

**Map resize:** `73:116837` Expand (the map takes the full width, chat stays), `73:117019` Collapsed (the map hides, only the collapse arrow remains).

**DS map:**
- PageHeader (back, title, no id) + Stepper (5 steps, `current=0`; note the kit Stepper "shows progress only", but the Figma here only shows state, which matches) + Button primary (disabled).
- Chat: **ChatCompactPanel** (type text, title "NEW INVESTMENT", the 3 start rows = CooperRecommendations or PromptButtons; confirm which), CooperMessage, UserMessage, TextMessageInput, Attachment, DropZone / DocumentsDropArea.
- Bottom strip: BottomSheet with `left` = **DocumentsContext** (Cooper's Context, ProgressBar, upload icon).
- Map: the shared MapLibre map in a Panel (non-DS wrapper for the AREA OVERVIEW header), MapToolbar (5 tools), map legend, region/centre/scale footer. The footer bar and the region dropdown are non-DS (as on Explore).

### 2.4 Map selection `73:121453` (Box), Lasso `73:119607` and neighbours

**What:** the user picks assets on the map. The chat shows the result as a user message.

**Behaviour (sticky + dev notes):**
- **Lasso** selects any area in free-form mode. **Box** selects in rectangular mode. Each tool changes the cursor, and the legend disappears while a tool is active.
- A toast over the map reads **"Start selecting"** with an X (`73:119607`).
- After the shape closes, selected assets are highlighted in copper with numbers (6, 5, 4, 3), a copper frame with 4 corner handles, and Recloser and Demeter SS pins stay.
- The tool in use stays highlighted in the rail (`73:121453`: box tool).
- "Change selection" means the shape can be redrawn (sticky "Change selection / Lasso" and "/ Box").

**Result (`73:121453`):**
- A user bubble in the chat: **"Build from selection (5 assets)"**.
- Cooper answers: "I have enough context to create an investment idea for the [site] feeders. I've captured the condition concerns and the outcome you're looking to achieve. / Anything else you'd like to add, or shall we move to Shape?"
- Footer: **"COOPER'S CONTEXT"** · green dot · **"READY"** (bold) · upload icon. The progress bar has been replaced by the badge.
- Header button **"Shape"** becomes white and active (dev note: "Button becomes active").
- The map is now zoomed in: region label **"RIDGEVIEW VILLAGE"** (was "CATSKILLS · HUDSON VALLEY, NY"), scale **1:20K** (was 1:15K).

**Where the "Build from selection (N assets)" bubble comes from:** it looks like a generated chip from the lasso. [Assumed] it is not typed. The prototype should count assets from the selected shape.

**DS map:** MapToolbar / MapToolButton · Snackbar or toast for "Start selecting" · MapPin (pins) · UserMessage + CooperMessage. The copper selection polygon with handles is non-DS (the kit has CollaboratorCursor and CanvasBackground, not a map selection overlay).

### 2.5 READY and no-GIS `73:117925`

- Chat card centred, no map. User bubble: "I want to look at investment opportunities for the feeders serving [site]. Recent inspections show their condition is getting worse."
- Cooper: "I have enough context to create an investment idea for the [site] feeders. I've captured the condition concerns and the outcome you're looking to achieve. / Anything else you'd like to add, or shall we move to Shape?"
- Footer **COOPER'S CONTEXT · READY** (green dot). Header **Shape** button active (white).
- Dev note: when context hits 100% the progress bar changes to a **Ready badge**. "Context completeness is a threshold for moving to Shape, not a hard limit on user input. Cooper can proceed at 100% even if additional context could still be added later."
- Dev note: "No input step once moved to Shape" (the Stepper has no Input step on the Shape page, see 2.6).

**DS map:** DocumentsContext (ProgressBar then a ready indicator, i.e. Badge green or StatusIndicator; confirm in DocumentsContext whether it already has a Ready state: grep found no ready state, so treat as non-DS or extend) · Button primary.

### 2.6 Idea overview (Shape) `73:118240`: differences from `build-idea.md` only

The frame is the top 900 px of the page, so only the top half can be compared. The top half matches the built screen. Differences and additions:

1. **Stepper:** 4 steps only (Shape, Review, Refine, Approve), Shape selected. The Input step is gone (dev note "No input step once moved to Shape"). `build-idea.md` has the same 4 steps, so this is no change. The Input page shows 5 steps.
2. **Header right:** `3/5` collaborators, a comment icon (a circle), then **Dismiss** (secondary) and **Send for review** (white). Same as built. In the Duplicate flow (`73:114811`) the primary reads **"Send for approval"** instead of **"Send for review"**; flag it as a Figma inconsistency. Use "Send for review".
3. **Sidebar:** 48 px rail. The collapsed icon shows a red dot when open questions exist (dev note "Red dot for open questions, orange dot for warnings, no dot if all is ok"). `73:118240` shows no dot. The built version should drive the dot from the issue counts.
4. **Bottom sheet:** the left shows "COOPER'S CONTEXT · 16 Documents · upload". Prompts are **"Find similar past ideas"** and **"What could block this idea?"**. The Duplicate-flow Shape shows **"2 Documents"**, so the document count depends on how the idea was created.
5. **Map card:** no change (map icon at top-right of the map).
6. **"Potential value":** `73:118240` shows **"$6M-$9M"** (dollar signs), while the Edit frames show **"6M-9M"** (no dollars). Use dollars.
7. **THE NEED / goals:** copy is the same. Goals are 5 badges in 2 rows.

No other layout difference was found in the visible half.

### 2.7 Shape sidebar: System Confidence `43:76732`

**What:** the right-hand panel on Shape, the "Cooper question sidebar". It is the same pattern as the Review screens.

**Layout:** 380 px panel to the right of the cards (the cards shrink: left column about 510, map about 510). Panel header: **"SYSTEM CONFIDENCE"** · Cooper icon button · collapse arrow. Under it:
- **"Review readiness"** with a ring and **"50%"**.
- Gates (4 rows): **"Idea completeness"** Passed (green tick), **"Asset alignment"** Passed, **"Need & urgency"** red dot "1/2", **"Cooper's context"** orange dot "1/2".
- Segmented control: **"Open questions 2"** | **"Warnings 2"**.
- List view: numbered rows, "1 Urgency needs confirmation", "2 Cost needs confirmation" (a green tick when resolved).
- Detail view (a click on a row): pager **"1 / 2 (50% resolved)"** · **"All errors"** list button · prev/next · title **"Urgency needs confirmation"** · text "The 12-18 month action window needs supporting evidence." · caption **"SOLUTIONS"** · three cards:
  1. recommended by Cooper (copper outline, Cooper icon): **"Ask field team to confirm urgency"** / "Ask the Field Team Lead to confirm the 12-18 month action window."
  2. **"Adjust urgency to lower confidence"** / "Keep the action window as an early estimate and mark urgency as provisional until more evidence is added."
  3. **"Use peer benchmark"** / "Compare this action window against similar feeder investments to confirm urgency." + button **"Review details"**.
- **My answer** field (typing): text field with focus ring, placeholder **"My answer"**, X and tick.

**States:**
- *Expanded / Collapsed:* collapsed is the 48 px rail (Figma frame `43:82672`, the collapse arrow with a red dot).
- *My answer, Hover / Typing / Answered:* Answered shows the caption **"ANSWERED"** and a row **"1 year"** with an undo arrow. The Cooper window opens (AgentWindow) saying a short confirmation, and the question counts as resolved.
- *Upload file, Hover / Analyzing / Answered:* Analyzing shows the Cooper window with "analyzing" text (`43:81186`). Answered (`43:80442`): the AgentWindow shows **"COOPER · Speaking"**, **Ask**, resize, close, and the text **"Done — I've updated the solution based on the file you provided."** The bottom sheet count goes from **16 to 17 Documents**. The answered row shows "1 year".

**DS map:** this is the kit's **SystemConfidence** pattern (Panel + ContentCard + ConfidenceGates + IssueKindSwitch + IssueNavigator + IssueSolution + IssueAnswerField + ProgressPager) with `useIssueReport`. The Cooper window is **AgentWindow**. Document count is DocumentsContext. Nothing new is non-DS.

### 2.8 Edit types `43:68623`

Three ways to edit a card. All use the Shape page.

1. **Manual simple edit** (`43:68625` hover, `43:69347` edit, `43:70078` applying, `43:70850` after):
   - Hover on a card shows a pen-style control next to the Cooper icon.
   - Click puts the text in an editable field (blue focus ring, caret). A secondary button **"Edit with Cooper"** (Cooper dots) sits in the card header next to the card's Cooper icon.
   - Applying edits: while Cooper applies the change, the Cooper window shows "Applying..." (small). Once done, "Cooper starts explaining the updates and the frame with the copper colour gradient appears to highlight the changes. The frame remains visible while Cooper is speaking. If the user turns off Cooper's voice, the frame disappears after 5 seconds. Animated stroke. Animation: gradient overflow." (dev note `43:71624`). A **Reliability priority increased** style change list appears in the Cooper window (1 to 3 rows with from > to).
   - A sub-variant, "Ask Cooper" (`43:72351`), starts from the same edit.
2. **Edit with Cooper button** (`43:73812` hover, `43:74542` chat): clicking the **Edit with Cooper** button on the card highlights the card (copper outline) and opens the Cooper bar bottom-right: placeholder **"What do you want to change?"** (+ attach, keyboard icon). Dev note "Section modification via Cooper conversation — standard interaction pattern".
3. **Edit with Cooper chat** (`43:75273` hover, `43:76003` chat): the same bar opens from the card's round Cooper icon. Dev note "Edit via Cooper conversation — standard interaction pattern".

**DS map:** ContentCard (`cooper` state = copper outline; `iconButton` = round Cooper button) · TextArea or inline editor · ChatCollapsedBar / CooperChat for the bottom-right "What do you want to change?" bar · AgentWindow · Button secondary S with Cooper icon (**"Edit with Cooper"**; non-DS unless it maps to FtaButton: check `bash scripts/entry.sh FtaButton`). The copper animated stroke highlight is non-DS.

### 2.9 Collaboration `43:84152` (adjacent, not in the ask)

One frame in section "Collaboration": "Full collaboration experience is here". Not specced here.

### 2.10 Dismiss idea `43:84874`

Three frames, left to right:
1. `43:84875` Shape page, **Dismiss** button hovered.
2. `43:85895` modal. Shape page dimmed (the page stays visible, **Send for review** goes grey). Modal about 400 wide, centred (x 525, y 285):
   - Title **"DISMISS IDEA"** (uppercase).
   - Body: "Close this idea. No further work or approval is needed."
   - Label **"Note"** and a textarea (about 380 x 140), placeholder **"Add a note explaining why this idea should not move forward."**
   - Footer: secondary **"Cancel"** | primary white **"Dismiss idea"**.
3. `564:175746` Idea Pad with a toast centred at the bottom-left of the table (about x 560 to 880, y 790 to 840): **"The idea has been stopped."** with a tertiary **"Undo"** (undo icon). The dismissed idea moves out (the Idea Pad row count is still 11 in the frame).
   - Dev note: toast timeout **5000 ms**, auto-dismiss after 5 s, **pause the timer on hover**.

**Clicks:** Dismiss opens the modal; Cancel closes; **Dismiss idea** closes the idea, returns to the Idea Pad and shows the toast; **Undo** restores it.

**DS map:** Modal (title, children, secondaryAction "Cancel", primaryAction "Dismiss idea") · TextArea · Snackbar or `toast({title, primaryAction: {label:'Undo'}, duration: 5000})`. Does the kit toast pause on hover? Check `vendor/ds2/api.md` line about `duration`; add a note if not.

### 2.11 Duplicate Investment (adjacent)

- `73:114496`: same chooser, with the Duplicate card active.
- `73:113639` **"CHOOSE THE INVESTMENT YOU WOULD LIKE TO DUPLICATE"** (Modal about 800 wide, x 320 to 1120):
  - Bar: SmartSearch **"Ask anything about investments"** (mic).
  - Section **"SUGGESTED INVESTMENT BY COOPER"** (Cooper dots): one card with name, id, "In progress" (orange dot), badge (**Decide**) and a one-line reason ("Your closest structural match. Same intervention type and asset class as the [site] feeders — aging 13.8 kV distribution — and you own it, so the case data carries over directly.").
  - Section **"ALL INVESTMENTS"**: rows (48 px) with name · id · "In progress" · stage Badge (Shape, Review, Decide); a copy icon appears at the right on hover.
- `73:113963` **"DUPLICATE INVESTMENT"** modal on top of the list: "This creates a new draft you can shape. The original stays untouched." · field **"Investment name"** prefilled **"Copy of [investment name]"** · **Cancel** | **Create**.
- `73:114811` Shape of the copy: a Cooper window **"COOPER · Speaking"** says "Done — I've duplicated [investment] into a new draft. You didn't add any context — that's fine, the copy is an exact match of the original. Whenever you're ready, I can help you reshape it: retarget it to a different asset, refresh cost and schedule against current figures, or rework the value case. Just tell me what to change." with a button **"Shape me"**. Documents **"2 Documents"**. The primary shows **"Send for approval"** (see 2.6, item 2).

**DS map:** Modal · SmartSearch · ContentCard / row list (Table or a list; the Cooper suggestion block = RecommendationItem or ContentCard cooper) · Badge · StatusIndicator · TextField · AgentWindow. The list rows with a hover copy icon are a ContentCard S with `iconButton` or non-DS if unclear.

## 3. Navigation map

```
Idea Pad (564:91122) --New--> Chooser (73:115860)
  |- Start with Ideas --> Input S1 (73:116169 / no-GIS 73:116266)
  |     |- type / pick a start row / upload / lasso or box select
  |     |- context 0 -> 100% => "READY" badge + header "Shape" active
  |     '- Shape button --> Idea overview (73:118240)  [stepper drops Input]
  '- Duplicate Investment --> list (73:113639) --row--> name modal (73:113963)
        --Create--> Shape of the copy (73:114811)
Idea overview: sidebar (System Confidence) -> My answer / Upload; cards -> edit types 1/2/3
  |- Dismiss --> modal (43:85895) --Dismiss idea--> Idea Pad + toast "The idea has been stopped." (Undo)
  '- Send for review --> Review stage (not in this journey's frames)
Back chevron on Input -> Idea Pad. X on chooser/modals -> previous screen.
```

## 4. Gaps and conflicts

1. **Send for review vs Send for approval.** The Duplicate Shape frame says "Send for approval". Use "Send for review" (the built label and the main Shape frames). Ask the designers.
2. **No frame for "Send for review".** Only a toast exists in the prototype today ("Sent for review"). The Figma frames show no confirmation. Keep the toast and flag it `[Assumed]`.
3. **Dismiss in the prototype is a stub.** `build.jsx` line 56 shows a toast "Dismiss isn't part of this flow". J07 needs the modal, the removal from the Idea Pad (status becomes dismissed or stopped; the row stays in the Figma frame with count 11, so check) and Undo for 5 s with pause on hover.
4. **READY badge** has no kit equivalent in DocumentsContext (it has a ProgressBar only). Treat the green "READY" as non-DS, or ask for a kit update.
5. **Lasso and box selection overlay** (copper polygon, handles, numbered assets, "Start selecting" toast, cursor changes, legend hides) is non-DS. J02 already builds a lasso on Explore (`explore-j02-figma-spec.md`), so reuse it if the interaction matches.
6. **"Build from selection (N assets)"** is a bubble the user did not type. Decide whether it is auto-added after the lasso closes, or a chip the user taps. `[Assumed]`: auto-added.
7. **Context % rules** are not in the file beyond examples (0%, 20%, 55%, READY). Needs a rule for how each input moves the percentage (question answered, file uploaded, selection made). `[Assumed]`.
8. **Map regions:** the Input map starts zoomed out at a region name ("CATSKILLS · HUDSON VALLEY, NY") that is not Whistler. Use the data layer's Whistler region and the Ridgeview-like cluster.
9. **Old story copy:** "Jeff", Ridgeview Village, Circuit 14B, Northgate, Demeter SS, Recloser R-1, INV-2025-0842, 13.8 kV. Replace with Whistler data. Ids like INV-2026-0098 repeat in the Duplicate list (the same id appears for two rows: `73:113639`), so use unique ids.
10. **Duplicate list** shows the same investment ("Full Replacement — South Loop Feeder 5") twice (suggested + list). In the prototype, suggested is a pick from the list, and the list should exclude or mark it.
11. **Document count:** 16 in the main Shape frames, 2 for a duplicate, 17 after an upload. Derive from the idea (uploads + data sources).
12. **Stepper on Input** is 5 steps (Input, Shape, ...), while on Shape it is 4. The Input step is only shown during creation.
13. **Edit frames show a different top area:** the Edit frames' right rail has a red dot (open questions) while `73:118240` has none. Drive from the issue list.
14. **Not captured:** the Input frames with analysing and Cooper's "Analyzed your request" reasoning rows were not screenshotted (`73:117164`, `73:117315`, `73:116416`, `73:116522`, `73:117208`, `73:117359`). Screenshot them before building the analysing state, or use CooperProgress ("Step n/total") from the kit.
15. **Not read:** copy for the Library states (filter menus, table configuration, ranking, preview, activity, row menu items), and the Collaboration and Rationale sections. These are existing patterns; spec them only if J07 needs them.
