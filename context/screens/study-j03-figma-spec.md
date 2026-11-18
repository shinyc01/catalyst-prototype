# Study for J03 (Asset Manager · Condition Assessment & Risk Scoring): delta Figma spec

This spec lists only what is **new or different** from what is already built and documented:
- `study.md` and `app/screens/study.jsx`: the Study panel, the lens list, Overview, Base, the lens view, Horizon, Create idea via Cooper;
- `command.md`, `command-figma-spec.md` §10 and `app/screens/command.jsx`: the Asset Manager Decisions tab;
- `explore-j02-figma-spec.md`: hierarchy, lasso, search, Asset details and the Trace Report (§5).

Sources:
- Command handover `QSh5FbHQ86rlWo0ViZCIDR`;
- Explore handover `RIgfAXt18AXHLu8s0wuvQ1`, section "Lens" `29:187613`.

All frames are 1440 × 810 and were screenshotted. Copy in **"quotes"** is exact:
- for the toasts, the menu, the delete modal, the snackbar and the dev notes, it comes from `get_design_context`;
- everywhere else it was read off the screenshots.

Layer names are stale in places. For example, the System Confidence pager layer says "(10% resolved)", but the screen renders "(0% resolved)". Never copy a layer name as UI text. Real-looking person names are written as "[person name]".

**Persona note:** every Explore frame here shows the **"JP"** avatar (Investment Owner). The Command frame shows "PA". The journey is Asset Manager, so keep the persona's own avatar `[Assumed]`.

---

## 1. Frames

| Node | File | Name (sticky label) | Role in J03 |
|---|---|---|---|
| `26:72978` | Command | "Decisions — Default" (Asset Manager) | Start: the Decisions card → Explore |
| `26:63249` | Command | "Decisions — Default + Dev Notes" | Only the dev note on the source tag applies |
| `29:191921` | Explore | section "Enter study" | Five entry routes into the Study |
| `29:187614` | Explore | section "Tabs" (parent of `29:187620`) | Study tabs: Overview / Baseline / Individual lens / **System Confidence** |
| `29:187620` | Explore | "Lens on" (sticky "Study Overview") | The default Study state (already built) |
| `29:189379` + `29:189852` | Explore | "Lens on" + panel "Study - Individual Lens" (sticky **"Study - System Confidence"**) | **NEW:** the System Confidence tab |
| `29:221451` | Explore | section "Create Idea" | Only checked for the split button. The Cooper flow is already built. |
| `29:239507` | Explore | section "save study" (stickies "Default", "Drop down", "Saved") | **NEW:** Save study |
| `29:101050` | Explore | section "From Study Library" (stickies "Start", "Open Library", "Study Opened", "Smth Edited", "Saved") | **NEW:** the Studies library |

---

## 2. Command: the Asset Manager card → Explore (`26:72978`, `26:63249`)

**Nothing new to build.** This frame is already specced in `command-figma-spec.md` §10:
- Health index and Risk metrics;
- the six rows (titles reused from Investment Owner);
- dev note `26:72668`.

The code has its own data-driven version (`AM_DECISIONS` in `shared/whistler-command.js`). Its row 1 is the cluster card with `open: 'explore'`.

What J03 relies on:
- **Row 1 (featured)** in the frame:
  - title "Northgate Cluster · 7 aging feeders replacement", tag **"Explore"**;
  - sub-line "7 aging feeders serving Ridgeview Village and ~9,400 customers — reliabilit…";
  - metrics "2.1" "Health index" and "$28M ±14%" "Risk";
  - the map thumbnail shows "Recloser R-1", "Demeter SS" and an "88%" pill;
  - the arrow (→) button opens Explore.
- **Dev note on `26:63249`** (on the tag): "Tag in the card shows where this item came from". The tag only labels the source; the arrow is what navigates.
- The greeting in the frame is "Welcome back, [person name]." (Asset Manager persona).

No Command frame shows where in Explore the card lands. `[Assumed]`: Explore with the ASSETS panel open at the cluster, as built today. The Enter-study frames start one level deeper, at Demeter SS (§3.1).

---

## 3. Enter study: five entry routes (section `29:191921`)

Row labels (stickies, left): "Select from hierarchy", "Lasso Select", "Select from search/ filter", "Select from study library", "Select from no selection".

**Every route ends in the same frame:** "Lens on" (`29:191934`, `29:192572`, `29:193210`, `29:201684`, `29:195044`). They are pixel-identical copies of `29:187620`.

### 3.0 Shared destination: "Lens on"
This is what `study.md` already describes. The details below are the ones that differ from the build:

- **Study panel** (`Study - Lens Overview`, 536 × 698, x 58, y 100):
  - Header: **"DEMETER SS STUDY"** (H3, uppercase), subtitle **"Demeter SS"**. On the right: a round **Cooper evidence button** (dots icon), a divider, collapse (↘↖, `arrow-diagonal-collapse`), and close ✕.
    - The build passes `showEvidence={false}`. Figma **shows** the Cooper button. There is no frame for what it does.
  - Tabs (SegmentedControl, full width): "Lenses" | "System Confidence".
  - Lens column header: "LENSES" with a **"|→" collapse icon** (collapses the lens column). It is not built, and no frame shows the collapsed state.
  - "CUSTOM" with "+". Lenses: "Flood Risk", "Extreme Heat", "Oil Containment", "Critical Habitat", each with a switch (all on).
  - Overview:
    - "RISK & CONDITION" and "CHANGE SUMMARY" have **collapse carets** (▴) on their section labels. They aren't built.
    - The four StatCards: "Risk score 600 vs. 458 ▲31" · "Value at stake $12.5M vs. $8.4M ▲48 %" · "At-risk assets 6/8 vs. 2/8 ▲4" · "Threshold year 2032 vs. 2039 -7 yrs".
    - The risk-score bar: **"Tolerance 415"** marker in red under the bar (missing in the build; see `study.md` Known mismatches). Legend rows: "Base condition 458", "Extreme Heat +64", "Flood Risk +41", "Oil Containment +19", … The numbers are placeholders; drive them from `shared/`.
- **FloatingBar** (x 606, y 103):
  - "DEMETER SS" (caption with a folder icon), "Selected 7", red badge "2";
  - **"View details"** (secondary);
  - **"Create idea" + ▾** (split button);
  - ✕.
- **Left map rail** (`map-action-bar-molecule`, 3 icons): while the Study is open, the **third icon (open book) is active**.
- **Horizon** (`simulate-tool-bar`, x 618 → 1364): "HORIZON", "2026" pill, ticks "2031", "2036", "2045". `[Figma]` END = 2045.
- **Map:** the heat grid, Demeter SS (red pin), Greenfield Solar Farm, the feeder with poles 1–6, Transformer T-904 and a "12%" pill.
- **Dev note `29:191882`** (under "Study Overview"): **"When viewing Overview, the map shows the aggregate of all the lenses in the applied section."**

### 3.1 Route A: from the hierarchy
1. **`29:193848`** "Navigating the asset hierarchy - Leaf level":
   - The ASSETS panel ("ASSETS 926", tree/list toggle, collapse, ✕) is drilled down: Whistler Company › Electrical › Distribution › Pacific North region › Wylam D.S. 115 kV › Northgate cluster › **Demeter SS** (selected row).
   - Children: Pole 1 (red dot), Pole 2 (red), Transformer T-904 (orange), Demeter SS, Pole 3, Pole 4, Pole 5.
   - Siblings: South Ridge Substation, Tin Mill Rd cluster, Wylam D.S. 33 kV, Pacific South region.
   - FloatingBar: "DEMETER SS" / "Selected 7" ●2 · **"View details"** (secondary) · **"Study area"** (primary, white) · ✕.
   - Hotspot on **"Study area"**.
2. Connector `29:194174` → **"Lens on"** `29:191934`.
   - The ASSETS panel is replaced by the Study panel.
   - The "Study area" button becomes the **"Create idea ▾"** split button.

The build already does this (`onStudy`).

### 3.2 Route B: lasso
1. **`29:194286`** "Analyzing selected area": a lasso shape (orange fill) around Riverside Village and Demeter SS, with clusters "2" and "43" (red badge 3). The Cooper agent-window, top right, shows "COOPER · Speaking ▮▮ · Ask" and **"Opening details for the selected assets…"**.
2. **`29:194178`** "Navigating the asset hierarchy - Leaf level": the zoomed Demeter SS view, without the ASSETS panel. FloatingBar "Selected 7" · "View details" · **"Study area"** (hotspot).
3. → "Lens on" `29:192572` (sticky "Select from hierarchy"; the same destination).

The lasso already exists from J02 (`explore-j02-figma-spec.md` §6.5). **New:** "Study area" from the lasso result goes straight into the Study.

### 3.3 Route C: search / filter
1. **`29:209201`** "Search - Search icon hover state": the globe, with the Explore search ("Search for…") hovered.
2. **`29:209250`** "Search - Typing query": the field shows "Show|me" with a caret and a clear ✕.
3. **`29:208327`** "Search results - List view with all results":
   - Query: "Show me all assets older than…" (truncated).
   - ASSETS 926 in **list view** (list toggle active), header "11 assets match search results".
   - Risk filter chips: "All risk" (selected) · "High 1" · "Moderate 1" · "Low 4".
   - Groups:
     - "Distribution Transformers" (count 1): row "1 · ID-546829 ●orange", selected (outlined);
     - "Poles" (count 5): rows 1–10, all "ID-546829", rows 1–2 orange dots, the rest grey. The count says 5 but 10 rows are shown.
   - FloatingBar (search variant): **"1 / 11 results"** · "All risk" (list icon) · ‹ › · title **"Distribution Transformer 1"** ●orange · "View details" · **"Study area"** · ✕.
   - The map shows "Demeter SS group", "Transformer 1" (outlined 3D building), and poles 1 and 2.
4. → "Lens on" `29:193210` (sticky "Select from search"). It is **still "DEMETER SS STUDY" / "Selected 7"**, even though the selection was "Distribution Transformer 1" (see Ambiguities).

The search results list is J02 territory. **New for J03:** "Study area" on the search-result FloatingBar opens the Study.

### 3.4 Route D: from the study library
1. **`29:194716`**: the globe with the **STUDIES panel** open (§6). Hover on the first row "Demeter Station · 7 assets" shows the edit and delete icons. The cursor is on the row.
2. Connector `29:208324` → "Lens on" `29:201684`. **Clicking a row opens that study.**

### 3.5 Route E: no selection
1. **`29:194995`**: the globe, nothing selected and no panel open. Hotspot on the **third rail icon (open book)**.
2. Connector `29:209290` → "Lens on" `29:195044`: the Demeter SS Study opens.

No frame explains which study opens without a selection. `[Assumed]`: the most recent study, or the current cluster.

### 3.6 Left map rail: what Figma says vs the build
| Icon (top → bottom) | Figma (active when…) | Build (`app/map.jsx` `MapTools`) |
|---|---|---|
| 1 (pin) | ASSETS hierarchy panel open (`29:193848`, `29:208327`) | `map-compass` "Fit to cluster" |
| 2 (stacked books) | **STUDIES library panel** open (`29:194716`, `29:101096`) | `asset-structure` "Asset structure" |
| 3 (open book) | **Study panel** open (all "Lens on" frames); opens the Study from no selection (§3.5) | `system-book` "Studies library" (toast) |

`explore-j02-figma-spec.md` reads icon 1 as asset structure and icons 2–3 as "studies library, book", which agrees with this table. **The build's icon roles are shifted by one.** Fix it in the J03 build: 1 = Asset structure, 2 = Studies library, 3 = Study.

---

## 4. Study panel: System Confidence tab (`29:189379`, panel `29:189852`)

Sticky: **"Study - System Confidence"**. The build currently shows an EmptyState ("Not part of this flow.").

### 4.1 Layout
The panel **narrows to 356 px** on this tab (x 58 → 414). There is no lens column. Horizon starts at x ~350, and the map behind it widens.

From top to bottom:
1. **Header:** unchanged ("DEMETER SS STUDY" / "Demeter SS", Cooper button, collapse, ✕).
2. **Tabs:** "Lenses" | **"System Confidence"** (selected).
3. **Confidence threshold bar:** DS **`EvidenceStrength`** (evidence-strength-bar-molecule) with **no title**. It is a three-band bar:
   - red dashed band, then a solid orange band (active), then a green dashed band;
   - captions **"<70% REJECT"** · **"87% REVIEW"** · **">90% APPROVE"** (layer text "<70% Reject", "87% Review", ">90% Approve", rendered uppercase);
   - value **87%** `[Figma]`, thresholds [70, 90] (the DS defaults).
4. **Issue-kind switch** (`IssueKindSwitch`): **"Open questions 3"** (selected) | **"Warnings 2"**.
5. **Pager** (`IssueNavigator`): "1 / 3 (0% resolved)" · **"All risk"** (list icon, tertiary) · ‹ ›.
6. **Question:**
   - title **"Flood extent binds the floor at 2 km"**;
   - body **"Spans 12-04 and 12-05 sit inside one FEMA cell, so they cannot be told apart spatially. Their order comes from asset attributes, which are exact."**
7. **"SOLUTIONS"**, then three cards:
   - **"Swap to First Street, 30 m"**: Cooper-recommended, warm fill with the Cooper dots icon;
   - "Swap to Second Street, 60 m": plain;
   - "Accept the cap": plain.

### 4.2 Not shown (unlike the Trace Report §5)
- **No "+ My answer"** and **no Upload**.
- **No gates** ("Approval readiness") and no Cooper-evidence button inside the tab. The bar is the only readiness readout.
- Questions 2 and 3, the Warnings content, the applied state and "All risk" have **no frames in this tab**.

`[Assumed]`: reuse the Trace Report copy and behaviour (`explore-j02-figma-spec.md` §5.3–5.4):
- Q2 "5 spans have no clearance data" and Q3 "Wildfire hazard is vendor-tier";
- Warning 1 "468 values are not measured" with "Apply 71%" / "Apply 88%";
- apply → "APPLIED", a green check, "(N% resolved)" and an undo icon.

It is also unknown whether applying a solution moves the 87% bar. `[Assumed]`: yes, computed from the risk model, never typed in.

### 4.3 Build notes
- Use the DS pattern pieces `IssueKindSwitch`, `IssueNavigator` and `EvidenceStrength`, with the `useIssueReport` controller (as `plan.jsx` does), inside the Study panel body.
- Don't use the full `SystemConfidence` / `TraceReport` panels: the Study panel already provides the shell.
- Hide "+ My answer" (the issue has no `answer` flag).

---

## 5. "Create idea ▾" split button and Save study (section `29:239507`)

### 5.1 The split button
- In the FloatingBar: "Create idea" (secondary-style main button) plus a ▾ caret segment. It is DS **`SplitButton`**.
- **Main button** → the Cooper "Create idea" chat (Create Idea section `29:221457`: the hotspot is on the label; connector `29:226287` → "Answer"). This is already built.
- **Caret ▾ menu** (`single-select-list-molecule` `29:240310`, 124 × 36, at x 860, y 148 under the caret). It has **one item**: a save icon + **"Save study"**.
  - The build's menu has "Create idea with Cooper" / "Create blank idea", which are **not in Figma**. Replace them with the single "Save study" item.
  - While the menu is open, the caret shows ▲.

### 5.2 Save study sequence
1. **Default** `29:239512`: the hotspot is on the **caret** (frame `29:241442`); connector `29:241439` → Drop down.
2. **Drop down** `29:240150`: the menu with "Save study" is open; connector `29:241451` (from the menu item) → Saved.
3. **Saved** `29:240800` (frame name "Lens off", but the content is unchanged): a toast, top right (x 1125, y 100, 303 × 106).
   - It is DS **`Alert` type success** (alert-organism: black fill, green inner glow `inner-shadow/map-highlight/resolved`, close ✕):
     - title **"SAVED TO STUDY LIBRARY"** (H4, uppercase);
     - body **"DEMETER SS exploration is saved to Study Library"**;
     - action **"View in Study Library"** (Primary S) → open the STUDIES panel (§6) `[Assumed]`; there is no connector.

**There is no naming step.** The study is saved straight away under the area name ("DEMETER SS"; it shows in the library as "Demeter Station · 7 assets"). Nothing asks for a name. Renaming happens later, in the library (§6.3).

**What is saved** is not stated in Figma. `[Assumed]`: the selection (area plus its N assets), the lens set with on/off state and sources, and the horizon year. It shows in the library as "<name> · N assets" with "1h ago"-style recency.

The DS `toast()` renders a Snackbar, not an Alert. This toast needs the Alert look: either `toast` with a custom body, or an `Alert` placed top right under the header. Flag it as NDS if the kit can't place it.

---

## 6. Studies Library (section `29:101050`, plus `29:194716`)

### 6.1 Location
- It is a **left floating panel** (`modal-hierarchy`, 404 × ~713, x 50, y 88: the same slot and size as the ASSETS panel) over the globe.
- It opens from the **second left-rail icon** (stacked books); that icon is active while the panel is open.
- It is **not a full page**, and it is not on the right rail.
- Flow: Start `29:101056` (globe; hotspot on rail icon 2; connector `29:122369`) → Open Library `29:101096`.

### 6.2 Layout and list
- Header: **"STUDIES"** + count badge **"108"** · collapse (↘↖) · ✕.
- The list is **single-line rows**, not cards or a table. Name, " · ", "N assets" (secondary), and a right-aligned relative time (tertiary). There is a scrollbar. 20 rows are visible:

| Name · assets | Time |
|---|---|
| Demeter Station · 7 assets | 1h ago |
| Northshore Feeders · 11 assets | 3h ago |
| Ridgeview Village · 22 assets | 5h ago |
| Feeder 1231D2 · 2 assets | 8h ago |
| Coastal Flood Exposure · 34 assets | 1d ago |
| Willow Creek Substation · 15 assets | 1d ago |
| Eastbrook Transformer · 9 assets | 2d ago |
| Harbor Point Grid · 18 assets | 2d ago |
| Pine Valley Corridor · 5 assets | 3d ago |
| Summit Ridge Relay · 12 assets | 4d ago |
| Lakefront Distribution · 28 assets | 5d ago |
| Copper Basin Network · 6 assets | 1w ago |
| Maplewood Junction · 41 assets | 1w ago |
| Irongate Capacitor Bank · 3 assets | 2w ago |
| Riverside Load Center · 19 assets | 2w ago |
| Quarry Hill Switchyard · 8 assets | 3w ago |
| Cedarwood Recloser · 14 assets | 1mo ago |
| Bayshore Tie Line · 26 assets | 1mo ago |
| Greystone Lateral · 10 assets | 2mo ago |
| Ashland Peak Feeder · 4 assets | 3mo ago |

- These names are Figma placeholders `[Figma]`. Only "Demeter Station" maps to real prototype data. `[Assumed]`: generate the list in `shared/` from real clusters and areas (Whistler data), plus the studies the user saves. Never hard-code 108.
- Sorting is most recent first (implied by the times). There are **no** search, filter, sort control, columns or empty state in the frames. **Empty state: not designed.** `[Assumed]`: DS `EmptyState` "No saved studies yet" plus a hint to use "Create idea ▾ → Save study"; flag it as non-Figma.

### 6.3 Row actions
- **Hover** (`29:101364`, `29:194716`): the row gets a lighter fill, the time is hidden, and two ghost icon buttons appear: **edit (pencil)** and **delete (trash)**.
- **Open:** click the row → the Study opens on the map for that population (`29:102436` "Study Opened"). This is the same "Lens on" state as §3.0. The flow diagram `29:122372` "Case 1: Flow starts in study library" reads:
  - "User sees existing studies library"
  - → "User opens existing study and gets directed to the map area of the asset population"
  - → "Already exists →" "system auto opens the Study feature (previously referred to as Lens)"
  - → "User creates a new study (via CTA)"
  - → "Study Saved notification".

  The first box is labelled "New →".
- **Rename** (pencil) `29:101643`: the row turns into an inline text field. It holds "Demeter Station" with a caret, a clear **×** and a confirm **✓**, the same pattern as the Trace Report "My answer" field.
  - ✓ saves the name and × cancels `[Assumed]`; there is no frame after the rename.
  - There is no separate "edit study" mode: editing a study means opening it and changing lenses (§6.4).
- **Delete** (trash):
  1. `29:101902`: `overlay-background` plus a modal (`DeleteChatModal`, 403 × 170, centred over the map). It is DS **`Modal`**:
     - title **"REMOVE "DEMETER STATION" STUDY?"** (layer text: `Remove "Demeter station" study?`);
     - body **"This will remove the saved study from your library. You’ll be able to undo this for a few seconds after."**;
     - buttons **"Cancel"** (secondary) | **"Remove"** (primary), equal width.
  2. Remove → `29:102174`: the row is gone from the list, and a **Snackbar** appears bottom centre (x 560, y 750, 320 × 48): **"The study has been removed"** + **"Undo"** (arrow-back-up icon, tertiary).
  3. **Dev note `29:122373`** (on the snackbar):
     - **"UI/UX Spec: Toast Notification Timeout"**
     - **"Duration: 5000ms (5 seconds)"**
     - **"Behavior: Auto-dismiss after 5s. Pause timer on hover."**

  `toast()` gives top-right placement; Figma puts the snackbar bottom centre. This is the same known mismatch as on Command.

### 6.4 Open, edit, save (re-save)
1. **Study Opened** `29:102436`: "DEMETER SS STUDY" / "Demeter SS", the Lenses tab and Overview. The FloatingBar shows "DEMETER SS · Selected 7 ●2 · View details · Create idea ▾".
2. **Smth Edited** `29:109076`:
   - The "Create idea ▾" menu is open (▲) with **"Save study"** (`29:115727`).
   - A collapsed **Cooper agent-window** sits top right (380 × 40): "COOPER" · speaking waves **"Speaking"** · pause · **"Ask"** · expand · ✕. It has no message text.
   - The edit itself isn't visible: the panel content is the same as in "Study Opened". `[Assumed]`: any lens toggle, source change or new lens marks the study as edited.
3. **Saved** `29:115728`: an Alert success toast top right (x 1125, y 100, 303 × 58):
   - title **"STUDY SAVED TO LIBRARY"**;
   - body **"DEMETER SS exploration is saved"**;
   - close ✕ and **no action button**, because the user is already working from the library.
   - This differs from the first save (§5.2): there the title is "SAVED TO STUDY LIBRARY", the body ends "…saved to Study Library", and there is a "View in Study Library" button.

Re-saving overwrites the same library entry and doesn't ask for a name `[Assumed]`. There is no "Save as new" option.

---

## 7. J03 interaction sequence (stitched)
1. **Command** (Asset Manager): Decisions, row 1 (the Northgate / cluster card, "Explore" tag) → **→** opens Explore.
2. **Explore:** drill the ASSETS tree to **Demeter SS** (or lasso, or search). FloatingBar "Selected 7 ●2" → **Study area**.
3. **Study opens** ("DEMETER SS STUDY"; the rail's book icon is active). Overview shows the four lenses aggregated (dev note). Toggle lenses and play the Horizon (already built).
4. Switch to **System Confidence**: the bar reads 87% REVIEW; Open questions 3 / Warnings 2. Q1 "Flood extent binds the floor at 2 km" → pick a solution (applied state `[Assumed]`, as in the Trace Report).
5. **Create idea ▾ → Save study** → toast "SAVED TO STUDY LIBRARY" → **View in Study Library**.
6. **Studies library** (rail icon 2): "STUDIES 108". Hover a row for edit and delete, rename inline, or delete (modal → snackbar + Undo, 5 s). Click a row to reopen the study, edit it, then **Create idea ▾ → Save study** → "STUDY SAVED TO LIBRARY".
7. **Create idea** (main button) → the Cooper idea chat → Build (already built).

---

## 8. What's new vs the current build
1. The **System Confidence tab** content (§4) replaces the EmptyState. The panel narrows to 356 px.
2. The **"Create idea ▾" menu** becomes a single item, "Save study" (§5.1).
3. **Save study** (§5.2) and its Alert-success toast with "View in Study Library".
4. The **Studies library panel** (§6): list, hover actions, inline rename, delete modal + Undo snackbar, open a study, re-save toast.
5. **Left-rail icon roles** fixed (§3.6), with a working icon 3 (Study, from no selection) and icon 2 (library).
6. **"Study area" from the search-result and lasso FloatingBars** goes straight to the Study (§3.2–3.3), if those routes aren't already wired.
7. Smaller items:
   - the Cooper evidence button in the Study panel header;
   - the "|→" collapse on the lens column;
   - collapsible section labels;
   - the "Tolerance 415" marker.

   None of them has a frame showing what it does.
8. A demo-state store for saved studies (`usePersisted`), so that saves, renames and deletes survive reloads and "Reset demo" clears them.

---

## 9. Ambiguities to raise with the designer
1. **No-selection route:** which study opens when the user clicks the book icon with nothing selected? The frame jumps to Demeter SS.
2. **Search route:** the selection is "Distribution Transformer 1" (1 of 11 results), but the Study opens as "DEMETER SS STUDY · Selected 7". Does a study take the selected asset's parent area, or all 11 results?
3. **Names:** the Study is "DEMETER SS", the library row is "Demeter Station", and the delete modal says "Demeter station". Is the library name editable, with a default taken from the area?
4. **Save toasts differ:** "SAVED TO STUDY LIBRARY / …saved to Study Library" + "View in Study Library" (first save) vs "STUDY SAVED TO LIBRARY / …is saved" with no button (re-save). Is this intentional?
5. **What a study stores:** lenses and on/off state, sources, horizon year, System Confidence answers?
6. **System Confidence:** does resolving questions move the 87% bar? What happens at ≥90% APPROVE (is anything unlocked)? Q2, Q3 and the Warnings have no study-specific content.
7. **"Create idea" menu:** is "Save study" the only item? Is there also a save shortcut or button anywhere?
8. **Studies library:** search, sort, empty state and pagination are not designed, and the 108 count is a placeholder.
9. **"Smth Edited":** what Cooper says while "Speaking" (no text), and whether an unsaved-changes indicator exists.
10. **Persona:** the Explore frames use "JP" (Investment Owner), but the journey is Asset Manager.
11. **Search list:** the "Poles" group count says 5 but shows 10 rows. All IDs are "ID-546829" (a placeholder).
