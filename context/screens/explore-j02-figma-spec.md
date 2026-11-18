# Explore for J02 (Asset Manager · Asset Data Ingestion & Validation) — Figma screen spec

Journey J02 cites six frames in two files. This spec covers only what is **new** compared with `explore.md` (arrival map, FloatingBar, AgentWindow, Asset details flagged `[Assumed]`) and `study.md` (lenses, Horizon). Asset details **is** designed in these frames (§4), so the `[Assumed]` flag in `explore.md` can be replaced by this spec.

Sources:
- Global Search handover `acAfLbn5qy49dNNMouadUR`, page "1️⃣ Global Search" (`2:61`), section "2 · Find a known item" (`2:21346`).
- Explore handover `RIgfAXt18AXHLu8s0wuvQ1`, pages "↪ Navigation" (`9:60`) and "↪ Trace Report" (`29:343014`).

Every frame was screenshotted at 1440 px. Copy in "quotes" is exact: it comes from `get_design_context` where available, otherwise it was read off the screenshots. **Layer names are often stale and differ from the rendered text** (see §5.6), so never copy a layer name as UI text. Real-looking person names in Figma copy are replaced with "[person name]" (the repo is public).

---

## 1. Frames found

| Node | File | Name | What it shows |
|---|---|---|---|
| `2:21957` | Search | "Best match" | Command home + Global Search dropdown, query "SUB-2210", best-match row preselected |
| `2:22235` | Search | "Open item" | Placeholder: "Asset · Substation North A" / "Opens in the owning area" |
| `2:22250` | Search | "Code prefix" | Same dropdown for a code prefix "INV-" (investments) |
| `9:11634` | Explore | "Explore - Investments panel - Role-based context note" | Globe + INVESTMENTS panel + DEV NOTE on role-based context |
| `9:13044` | Explore | section "Hierarchy" (14,433 × 5,284) | 30+ frames: navigating the ASSETS tree (root → branches → leaf), tree/list, risk tabs |
| `9:64501` | Explore | section "Entry points to Asset details" | 9 frames: from hierarchy, from search, smart lasso/box selection |
| `9:79016` | Explore | "note" (702 × 342) | DEV NOTE "Multi-Asset Selection via Lasso / Box" (sits next to `9:64501`) |
| `29:345530` | Explore | "Default" in section "Apply Solution" (`29:345354`) | Trace Report with question 1 **APPLIED** |
| `29:343426` | Explore | section "Trace Report" (parent of `29:345530`) | 4 sub-sections: Panel Behavior, Types, Apply Solution, Add my answer |

**Not designed** (tag `[Assumed]` if built):
- the Asset details view of the owning area after "Open" in Global Search (only the placeholder `2:22235`);
- details, solutions or applied states for Trace Report questions 2 and 3, and for Warning 2;
- any numeric "confidence" readout besides "% resolved" and the Warning 1 body text;
- how the Trace Report opens from the collapsed right rail (there is no connector on it).

---

## 2. Global Search: find a known item (`2:21957`)

### 2.1 Layout (1440 × 900)
- **NavBar** (DS `NavBar`), "Command" active. The right side differs from other frames: the search icon has expanded into a **600 px search field** (`search-regular-organism`, x 732–1332, focused, blue border). Its content: search icon, a removable filter chip **"Type: Assets ×"**, then the typed query **"SUB-2210"** with the caret, and a clear "×" at the right end. Then the gear, the bell with a red dot, and the avatar "JP".
- Behind it is the Command home (unchanged, dimmed only by the overlay): "Welcome back, [person name]." and "3 things deserve your attention this week, and I've drafted responses to two of them. Planning closes in 41 days". This is not new; see the Command spec.
- **Dropdown** (`global-search — 7 · Best match`, 600 × 333, x 732, y 44, directly under the field). It has an 8 px radius, a 1 px `border/base` border, a dark elevated fill and a heavy drop shadow.

### 2.2 Dropdown contents, top to bottom
1. **Title row** (h 48, p 12):
   - Left, type chips (DS `Chip` with `Counter`):
     - "All" + "4" (off: outlined)
     - **"Assets" + "3" (on: white fill, black text, dark counter)**
     - "Investments" + "1" (off)
   - Right: a tertiary select **"Match: Any ▾"** ("Any" in tertiary grey) and a 24 px filter icon button (`system-filter`).
2. **"BEST MATCH"** (caption, uppercase, secondary). The layer name is "Best match · 3" but the rendered text has no count.
3. **Best-match row** (`search-result-row`, h 52, **selected state**: `card/state/fill/selected` + 1 px `card/state/border/selected` light border, radius 4):
   - a 32 px leading tile with the asset (pin) icon;
   - line 1: "Substation North A" (secondary, medium) + **"SUB-2210"** (white, semibold);
   - line 2: "Power transformer · Ridgeview · North District" (tertiary);
   - right: status pill (secondary fill, full radius) with a green 4 px dot + "Healthy".
4. **"OTHER MATCHES · 2"** (caption uppercase).
5. Row: "Substation North A — T1" + "**SUB-2210**-T1" (the matching part is bold white, the remainder tertiary) · "Power transformer · Ridgeview · North District" · green "Healthy".
6. Row: "Substation North A — T2" + "**SUB-2210**-T2" · same line 2 · **red** dot "Critical".
7. **Keyboard hints** (top hairline, 12 px text): "↑↓ Navigate", "↵ Open", "⌘↵ New tab", "Tab Type", "Esc Close". The key glyphs are in disabled grey.

Component description in Figma (search-result-row), verbatim: "Global Search result row. Name + code (never truncated) on line 1, details that tell similar items apart on line 2, status badge. Swap the leading instance Type for the entity. Selected = keyboard focus; Hover = mouse. Best match is preselected. Inactive = Retired/Archived, still clickable."

Kit status: there is no SearchModal / search-result-row in the pinned DS 2.0 kit that we know of. Check with `scripts/entry.sh search` before building; otherwise wrap it in `NDS`.

### 2.3 Transitions (flow connectors on the canvas)
"Pressed" (`2:21348`, Recent) → "Typing · Loading" (`2:21670`) → **"Best match"** (`2:21957`) → **"Open item"** (`2:22235`). "Typing · Loading" also branches to "Code prefix", "Duplicate names" and "Typo corrected".

"Open item" is a blank dark frame with only the centred text "Asset · Substation North A" / "Opens in the owning area". **The destination is not designed.** For J02 the owning area of an asset is Explore with that asset's Asset details open (§4.2). That routing is `[Assumed]`.

### 2.4 DEV NOTEs (verbatim)
- Best match (`2:22223`): "An exact code or name match becomes Best match and is already selected — one Enter opens it."
- Type chips (`2:22523`): "Once the user types, type chips show only All, the chosen type and types with results; the rest disappear. Chips sit in a sideways carousel that fades at the edge — no More menu."
- Open item (`2:22238`): "Enter or click opens the item. ⌘/Ctrl+Enter opens it in a new tab."
- Typing · Loading (`2:23394`):
  - "Loading timing (first search, no results yet)
  - • Debounce: search runs 250 ms after the user stops typing, not on every keystroke.
  - • If the response takes longer than 300 ms, the results list shows 3 skeleton rows. Responses under 300 ms show no loading state.
  - • Skeleton rows match the result row layout (icon, title, subtitle, status). Tabs, filters and keyboard hints stay real.
  - • Once shown, the skeleton stays for at least 300 ms, even if results arrive sooner, to avoid flicker.
  - • Loading → results is a direct replace, with no empty frame in between.
  - • No response after 10 s → Error state with Retry (see 8 · Slow or failing search).
  - • "No results" shows only after the response returns 0 items. Never while a request is still running."

### 2.5 Variant: code prefix (`2:22250`, for reference)
- Chips: "All 3" and **"Investments 3"** (on).
- Header: "RESULTS · 3" plus a ghost button "View all in Build →".
- Rows: "Ridgeline protection upgrade **INV-**2291" · "Grid Resilience 2027 · Owner: [person name]" · "In review" (blue dot); "Harbor substation protection **INV-**2307" · "Coastal Portfolio · Owner: [person name]" · "Approved" (green); "West substation SCADA **INV-**2312" · "Western Portfolio · Owner: [person name]" · "Draft" (grey).
- The prefix "INV-" is bold; the rest of the code is tertiary.

### 2.6 Data notes
"SUB-2210", "Substation North A" and "Ridgeview · North District" are Figma demo values. They do not match the Explore frames, where the asset is "Demeter SS" in "Northgate cluster". Map them to a real Whistler record in `shared/` and tag `[Figma]`/`[Added]`. Do not hard-code them.

---

## 3. Explore: ASSETS hierarchy (section `9:13044`)

### 3.1 Shell (all Explore frames, 1440 × 810)
- **NavBar**, with "Explore" active. Right: search, gear, bell (red dot) and "JP". The search lives in the ExploreHeader here, not the NavBar.
- **ExploreHeader** (h 40):
  - left: an optional back link "‹ Northgate cluster" (only at leaf level), then a search pill "Search for…" with a Cooper sparkle and a mic, then a filter icon button;
  - right: "3/5" collaborators and a comment icon button.
- **Left map rail** (top, `map-action-bar-molecule`, 3 icons): **asset structure (pin, active when ASSETS is open)**, studies library, book.
- **Bottom-left tools:** zoom + / −; comment, lasso/box select (dashed square), layers, map settings.
- **Right rail:** a 48 px `sidebar-organism` with a "←|" expand icon at top right (collapsed Trace Report / right panel). When expanded it is the 380 px Trace Report (§5).
- FtaButton (Cooper orb) bottom-right.

### 3.2 ASSETS panel (`modal-hierarchy`, 404 wide, x 48, y 88)
- **Header:** "ASSETS" (H3 uppercase) + counter "926". Right side:
  - a 2-segment icon control: **tree** (hierarchy icon, selected) | **list**;
  - a collapse "↘↖" icon button;
  - a close "×".
- **Root level** (`9:13065`): two rows, each with a caret ▸, a folder icon and a name.
  - "Whistler Company", with a **red 6 px dot** at the right (inherited criticality).
  - "DC Water Capital". The globe label reads "DC Water capital" (lowercase c); the copy is inconsistent in Figma.
  - The globe shows two cluster pins: "456" with a red badge "3" (Whistler Company) and "470" (DC Water capital). Other frames show "1,234" and "765" (§3.6), so these counts are not consistent.
- **Branches level** (`9:24616`, "Electrical category selected"):
  - "Whistler Company" is expanded and outlined (selected focus);
  - children "Electrical" (red dot, hover) and "Water";
  - "DC Water Capital" is **tertiary** (greyed).
  - The map zooms to the company polygon with white outline. The FloatingBar reads "WHISTLER COMPANY · Selected 656 · ●3" with "View details", "Study area" and "×".
- **Electrical selected** (`9:26051`):
  - Electrical is outlined;
  - children "Transmission", "Distribution" (red dot, hover) and "Generation" (red dot);
  - then "Water", and "DC Water Capital" (tertiary).
  - Map clusters: "Transmission" 544, "Distribution" 377 (badge 3), "Generation" 322 (badge 3, amber). The FloatingBar reads "ELECTRICAL · Selected 377 · ●3".
- **Leaf level** ("From hierarchy", `9:64506`). The full chain, with 1 px tree guide lines:
  - "Whistler Company" ▾
  - "Electrical" ▾
    - "Transmission" ▸ (tertiary)
    - "Distribution" ▾
      - "Pacific North region" ▾
        - "Wylam D.S. 115 kV" ▾
          - "Northgate cluster" ▾
            - **"Demeter SS" ▾ (selected: outlined row)**, whose leaves are:
              - "Pole 1" (red dot)
              - "Pole 2" (red dot)
              - "Transformer T-904" (amber dot)
              - "Demeter SS"
              - "Pole 3"
              - "Pole 4"
              - "Pole 5"
            - "South Ridge Substation" (tertiary)
            - "Tin Mill Rd cluster" ▸ (tertiary)
        - "Wylam D.S. 33 kV" ▸
      - "Pacific South region" ▸

  The panel grows to full height (722) with a scrollbar. The map shows the Demeter SS 3D site, poles 1–6 on a dashed line with arrows, a "12%" pill on the span, "Transformer T-904" and "Greenfield Solar Farm". The FloatingBar reads "DEMETER SS · Selected 7 · ●2" with **"View details"** (hotspot) and "Study area".
- **List view** (segment 2): a header "N assets match search results" and risk tabs (DS `SegmentedControl` + counters) "All risk", "High 1", "Moderate 1", "Low 6". Rows are grouped by type with counts: "Poles 6", "Transformers 1", "Substations 1". Each row shows name/number, "ID-546829" and a risk dot. The ID is the same placeholder on every row in Figma, so replace it with real IDs.

### 3.3 Hierarchy DEV NOTEs (verbatim)
- Tree panel (`9:13158`): "By default, visible hierarchy nodes use **primary colors** because they represent the current map context. / Expanding the tree is only a navigation action and does not change the map state. A node becomes the active focus when selected, updating the map to that context and highlighting its related nodes. / Nodes outside the current map focus remain tertiary — they are still available in the hierarchy but are not currently visible on the map. / • **Primary** = currently visible on the map • **Tertiary** = exists in the hierarchy but is outside the current map focus"
- Criticality inheritance (`9:23437`): "Each time we move down the hierarchy, the highest criticality level from the assets below is inherited by the parent group. For example, a red Critical asset takes priority over a yellow Severe asset, so the group will be marked as Critical. / The same logic applies in reverse."
- Company level (`9:24609`): "**Tertiary — Available but not in map focus** / The item exists in the hierarchy but is not currently visible on the map. Users can expand and explore its structure (it's tertiary as well), but the map will only move to this context after selection."
- Expanded with overlap (`9:25507`): "A possible edge case: **Water** may partially overlap with the selected **Electrical** area. In this case, it should remain primary because it is still visible within the current map context. / **The background highlight and bright white branch lines** clarify what belongs to the selected context and prevent confusion with elements that are only visible on the map. / **Tertiary** is reserved for nodes completely outside the current map view."
- Leaf auto-scroll (`9:19149`): "**Leaf level automatic scroll** / As users drill deeper into the hierarchy, the tree may exceed the available modal width. To preserve space and keep context visible, intermediate levels can collapse into a "+3 more levels" row instead of creating large empty gaps. / 1. Middle levels collapse: hidden ancestor levels between the root and the current parent chain are grouped into a single expandable row. Clicking it reveals the hidden levels in place. 2. Compressed indentation: nodes after the collapsed section shift closer instead of keeping their full hierarchy depth. Full indentation returns when hidden levels are expanded. 3. Context stays visible: the last 2–3 parent levels and the current node remain expanded, with children shown below."
- Locate in hierarchy (`9:28103`): "Additional functionality: allow users to locate and view a specific asset directly in the hierarchy tree. / The logic should be: • Clicking a list item: selects the asset and changes the map focus. • Clicking the hierarchy button: only shows the asset's position in the hierarchy. • If the asset is not selected, opening the hierarchy should not change the map focus."
- Further notes exist but were not transcribed (resize min/max width, list ordering, high-risk tab, filtered-from-branch): `9:20209`, `9:20577`, `9:20583`, `9:14593`, `9:15933`, `9:17341`, `9:18904`, `9:23720`, `9:24217`, `9:24611`, `9:25531`.

### 3.4 Hierarchy transitions
Sticky rows in the section:
- "Navigation - Clicking on branches": Default (collapsed) → Root level → Branches level (×6 frames) → Leaf level.
- "Navigation - Expanding branches without clicking on them": hover + click caret only; the map does not change.
- "Resize & Change Position".
- "Tree/List": Tree, List, Risk tabs, List filtered by hierarchy context, Open hierarchy context from list.

The rules:
- Clicking a **row name** selects it: the map flies to that context, the FloatingBar updates and the row is outlined.
- Clicking the **caret** only expands; the map does not change.

### 3.5 Role-based context (`9:11634`)
- The globe with the left rail's top icon set to a **briefcase** (investments).
- An **INVESTMENTS** panel (`modal`, 400 wide): "INVESTMENTS" + "3", with collapse and close. Columns "INVESTMENTS" ▾filter and "STATUS" ▾filter. Rows:
  - "Demeter Station Transformer…" / "INV-2026-1234" — amber "UNDER REVIEW" + chip "0/4";
  - "Birchwood Feeder Hardening…" / "INV-2026-1234" — purple "REFINING";
  - "110/10 kV Substation Central…" / "INV-2026-1234" — green "SUBMITTED".

  The full name of row 1 is "Demeter Station Transformer Cluster Modernization".
- Map pins: briefcase "1,234" Whistler Company, briefcase "765" DC Water capital.
- DEV NOTE (verbatim): "**Role-based Explore context** / The Explore context changes depending on the user's role: • Asset Manager: Assets are the primary context. Investments are secondary and accessible through map layers and asset details. • Investment Owner: Investments are the primary context, while assets become secondary."
- **For J02 (Asset Manager): open Explore with the ASSETS panel (§3.2), not INVESTMENTS.** `[Figma]`

---

## 4. Asset details (section `9:64501` + note `9:79016`)

The stickies over the section are "From hierarchy" (`9:64506`), "From search" (`9:64832`) and "Smart Lasso/box selection" (the 7 remaining frames, left to right: `9:69165` → `9:65295` → `9:68717` → `9:69569` → `9:65727` → `9:66433` → `9:67830`).

### 4.1 Entry points
1. **From hierarchy:** select a leaf group in the tree, and the FloatingBar shows "DEMETER SS · Selected 7 · ●2". Click **"View details"** to open the Asset details panel.
2. **From search** (`9:64832`):
   - The ExploreHeader search holds "Pole 4 details" with a clear "×". The ASSETS panel is closed.
   - The FloatingBar is in **results mode**: "1 / 11 results" + "All risk" (list-icon tertiary button) + ‹ › paired arrows, then "Pole 4 ●", then "Study area" and "×". There is **no "View details"**: the panel is already open.
   - The **Asset details panel** for Pole 4 sits on the right (§4.2). The map has zoomed to Pole 4, which is highlighted.
3. **Lasso / box selection:**
   1. `9:69165`: the lasso tool is active (bottom-left, hotspot). The FloatingBar reads "NORTHGATE CLUSTER · Selected 1,243 · ●9". Clusters: Transmission 544 (3), Distribution 377 (3), Generation 322 (3).
   2. `9:65295`: the user draws a lasso (blue translucent shape with handles) around part of Distribution. The FloatingBar reads "NORTHGATE CLUSTER · Selected 14 · ●3", and the lassoed cluster pill shows "14" (badge 3). Hotspot on **"View details"**.
   3. `9:68717`: the lasso turns **Cooper orange** (analysing). A compact Cooper window at top-right: "COOPER", "Speaking ▮▮", "Ask", collapse, close, with the text "Opening details for the selected assets…".
   4. `9:69569`: the camera flies to the Demeter SS site. The ExploreHeader shows "‹ Northgate cluster". The Cooper window (top-left, 380 wide) reads: "I've mapped your selection to the hierarchy. 14 assets are selected in total. Demeter SS is fully selected, while the other groups are partially selected."

      Below the text are 4 collapsible rows: "Demeter SS group" (hotspot), "South Ridge group", "Tin Mill Rd cluster", "Wylam D.S. 115 kV". The map labels match these groups.
   5. `9:65727`: "Demeter SS group" is expanded: "SELECTED 8/8", "RISK SCORE $6M", and a white button "Study area". The **group Asset details panel** opens on the right (§4.3).
   6. `9:66433`: the Cooper window collapses to its 40 px header. An ASSETS panel opens in **list** mode: "8 assets match search results". Risk tabs: "All risk", "High 1", "Moderate 1", "Low 6". Groups:
      - "Poles 6": 2 (red), 1, 3, 4, 5, 6, each "ID-546829";
      - "Transformers 1": "Transformer T-904" (amber);
      - "Substations 1": "Demeter SS".

      Hotspot on the tree toggle.
   7. `9:67830`: the same panel in **tree** mode, still "8 assets match search results". The chain runs Whistler Company › Electrical › Distribution › Pacific North region › Wylam D.S. 115 kV › Northgate cluster › **"Demeter SS group"** (outlined). Its children are "Pole 2" (red), "Transformer T-904" (amber), "Demeter SS", "Pole 1", "Pole 3", "Pole 4", "Pole 5", "Pole 6".

DEV NOTE `9:79016` (verbatim): "**Multi-Asset Selection via Lasso / Box** / For Lasso / Box selection, follow the same principle as Search: selection creates a filtered list of asset details. Users can navigate between selected assets using arrows or through the list / hierarchy on the left. / Details Logic • Fully selected group: show group details. ◦ Example: Demeter SS (8/8 assets selected) → show Demeter SS details. • Partially selected group: show individual asset details only. ◦ Example: ◦ Ridgeview Village (5/6 selected) → show details for the 5 selected assets. ◦ Tin Mill Rd cluster (1/10 selected) → show details for the 1 selected asset."

Note the counts don't add up: the Cooper text says 14 selected, but Demeter SS group is 8/8, and the FloatingBar in `9:64506` says "Selected 7" for Demeter SS. Flag it; don't invent a reconciliation.

### 4.2 Single asset details panel ("Pole 4", `9:64904`, 536 × 638, x 844, y 100)
- **Header:** "POLE 4" (H3 uppercase) / "Structure ID_30" (tertiary). Right: collapse "↘↖" and close "×".
- **Tabs** (DS `Tabs` segmented, full width): **"Details"** (selected) | "Documentation" | "History".
- **Body, two columns:**
  - **Left column (~180 px), "ASSET HIERARCHY"**, with a "|→" collapse icon. For a single pole this is a list of **attribute sections**, not assets: "General" (selected, outlined), "Maintenance", "Supports", "Insulators", "Guying", "Attachments", "Shield Wire", "Grounding", "Switches", "Sensors", "Drawings/Permits", "Images", "Arresters", "Additional info", "Engineering", "Paint", "Special Indicators", "Conductor", "Fiber Optic", "Marker", "Pole Mount Xfrm", "Species", "Multi Circuit".
  - **Right column (scrolls), collapsible sections (▴ caption headers):**
    1. **"RISK & CONDITION"**: a 2×2 StatCard grid (DS `StatCard`, label + value + optional `Badge`):
       - "Risk score" + badge "Healthy" → "32M"
       - "Condition" → "32%"
       - "Age" → "6 y.o"
       - "Failure likelihood" + green badge "Low" → "11%"
    2. **"LIFECYCLE"**:
       - "Status": green dot + "ACTIVE" + "11/07/2019";
       - "In service": "04/23/2020";
       - a **condition-trajectory line chart** (y "100% 75% 50% 25% 0%"; x "-6MO", "NOW", "+3 MO", "+12 MO", "+21 MO"). It has a tooltip "Now — 52%" on a grey point at NOW, a blue flag marker at ~+12 MO (dashed vertical), and a red point with label "Failure" at ~+18 MO, followed by a **red hatched failure zone** to +21 MO.
    3. **"IDENTITY"**: "Type" Single pole · 1STVBP; "Manufacturer" Valmont; "Material" Galvanized steel; "Design voltage" 115 kV.
    4. **"TECHNICAL"**: "Maint code" SES; "Span length" 436 ft; "Station" 483 · 4+83.00.
    5. **"LOCATION & SITE"**: "Coordinates" 33.47580, −86.95085; "Area" Birmingham; "Land cover" Forest; "Terrain slope" 6.5°; "Elevation" 411 m; "Easement likelihood" 62%.
- Observations:
  - "Risk score 32M" with "Healthy" next to "Condition 32%" is odd: the same numbers are reused on the group panel.
  - **No "baseline risk" label exists in these frames.** The closest is "Risk score".
  - The "Failure" point on the chart plays the role of the crossing year in `explore.md`.

### 4.3 Group details panel ("Demeter SS", fully selected 8/8; `9:65804`)
Same shell as §4.2, with these differences:
- **Header:** "DEMETER SS" / "Structure ID_30" (the same placeholder ID). Right: a round **Cooper-evidence icon button**, a divider, collapse, close.
- **Left column "ASSET HIERARCHY" lists the group's assets:** "Demeter SS group" (selected, folder icon, outlined), "Demeter SS", "Transformer T-904", "Pole 1" … "Pole 6". Clicking an asset presumably switches the panel to that asset (`[Assumed]`; there is no frame for it).
- **"RISK & CONDITION"** 2×2:
  - "Risk score" + "Healthy" → "32M"
  - **"At-risk assets" → "2/8"**
  - "Condition" + **amber badge "Poor"** → "32%"
  - "Failure likelihood" + green "Low" → "11%"
- **"LIFECYCLE"**: the same as single (ACTIVE 11/07/2019, In service 04/23/2020, the same chart).
- **"IDENTIFICATION"** (not "IDENTITY"): "Operating voltage" 115 kV; "Line type" Radial; "Class of property" Transmission line; "Owner" APCO; "CPR location" A3711.
- **"LINE LENGTH"**: "Total 5.13 mi"; "In service" 4.31 mi; "In design" 0.82 mi; "In construction" 0 mi; "Idle" 0 mi.
- The Cooper card's "RISK SCORE $6M" contradicts the panel's "Risk score 32M". Flag it.

### 4.4 Kit mapping
- Asset details panel: `Panel` + `Tabs` + `StatCard` grid + collapsible sections + `LineChart`. Check `scripts/entry.sh` for "AssetDetails"; otherwise compose it from kit parts and wrap the gaps in `NDS`.
- ASSETS tree: DS `SideNavTree` / hierarchy (check `entry.sh tree`), with risk dots as `Indicator`.
- FloatingBar results mode (`1 / 11 results`, `All risk`, ‹ ›): the same `ProgressPager` pattern as the Trace Report.
- Cooper compact window: `AgentWindow` (compact) with "Speaking" + "Ask".

### 4.5 Panel behaviour DEV NOTE (Trace Report page, `29:346563`, verbatim)
"**Panel Logic on Multiple Panels** • Panels remain open while users zoom and navigate the map. • On zoom in/out, panels should collapse to their compact state when needed to reduce clutter. • If multiple panels overlap or reduce the map view too much, stack them automatically to keep the map usable. • The most recently opened panel stays expanded and on top. • Users can close or reposition panels manually; their positions are preserved while navigating. **Panel repositioning** • When a panel expands, other open panels move to avoid overlap. • When it collapses, displaced panels return to their previous positions. • Panels should not permanently shift because of another panel's temporary expansion."

---

## 5. Trace Report (page `29:343014`, section `29:343426`)

### 5.1 Where it opens
It is the **right sidebar** (`sidebar-organism`, 380 × 722, x 1060, y 88, full height under the ExploreHeader, `border/base` left border, black). It is a docked panel, not a drawer over the map: the map viewport ends at x 1060 and the FtaButton moves to x 1000. Collapsed, it is the 48 px right rail with "←|" seen in every other Explore frame. It collapses with the "|→" (`arrow-bar-right`) icon button in its header. It can coexist with the ASSETS panel (left) and the Asset details panel (sticky "Extensive Panel Collection", `29:343604`). In that frame the asset panel sits at x ~844 and the Trace Report at x 1060.

The sub-sections and their stickies:
- "Panel Behavior": "Limited Number of Panels" `29:343430` | "Extensive Panel Collection" `29:343604`
- "Types": "Open questions" `29:344998` | "Warnings" `29:345170`
- "Apply Solution": "Start" `29:345358` | **"Applied" `29:345530`** | "All risk" `29:345699`
- "Add my answer": "Start" `29:345866` | "Answer" ×3 `29:346038`, `29:346210`, `29:346388`

The map behind it is the globe with the ASSETS root panel ("Whistler Company" with a red dot, "DC Water capital").

### 5.2 Layout, top to bottom (DS `SystemConfidence`-style: Panel + IssueKindSwitch + IssueNavigator + IssueSolution)
1. **Header** (bottom hairline, pb 12): **"TRACE REPORT"** (H3 uppercase, secondary). Right: a ghost "|→" collapse icon. There are no gates and no Cooper-evidence button: unlike Plan Setup there is no "Optimization readiness" block.
2. **Issue-kind switch** (h 56, bottom hairline; 2-tab segmented, 8 px radius container): **"Open questions" + "3"** | "Warnings" + "2". The selected tab gets `white-base` fill and a `border/medium` border.
3. **Pager row** (py 8):
   - Left: an optional green check (`status-success-filled`, only once resolved), then "1" (white, label L) + " / 3" (disabled grey) + "(0% resolved)" (tertiary, body L).
   - Right: a tertiary button with list icon + **"All risk"**, then a ‹ › paired button (56 × 24).
4. **Question:** the title (H2 medium, 16 px, white, single line with ellipsis) and the body (body L, secondary).
5. **"SOLUTIONS"** (caption uppercase), then solution cards (radius 8, p 12, `border/base`):
   - **Recommended:** `cooper-base` warm fill + Cooper dots icon + gradient Cooper text (H4 medium 12 px).
   - **Plain:** `elevation-1/secondary` fill, white text.
6. **"+ My answer"** — a full-width tertiary button (system-plus icon), pt 8. There is **no "Upload file"** here, unlike Plan Setup.

### 5.3 Exact items

**Open questions (3)**, listed in the "All risk" view (`29:345699`). Each row is a numbered card (`vdrawer-card`, counter + title, ellipsis), and resolved rows get a green check at the right:
1. "Flood extent binds the floor at 2 km" (resolved ✓ in that frame)
2. "5 spans have no clearance data"
3. "Wildfire hazard is vendor-tier"

Question 1, the only one with detail:
- Title: **"Flood extent binds the floor at 2 km"**
- Body: **"Spans 12-04 and 12-05 sit inside one FEMA cell, so they cannot be told apart spatially. Their order comes from asset attributes, which are exact."**
- Solutions:
  - in "Start" / "Open questions" / "Add my answer" (2 solutions): **"Swap to First Street, 30 m"** (Cooper, recommended) and "Accept the cap";
  - in "Extensive Panel Collection" `29:343604` (3 solutions): "Swap to First Street, 30 m" (Cooper), "Swap to Second Street, 60 m", "Accept the cap".

Questions 2 and 3: **titles only.** No body, solutions or applied state is designed.

**Warnings (2)** (`29:345170`; pager "1 / 2 (0% resolved)"):
- Warning 1:
  - Title: **"468 values are not measured"**
  - Body: **"Cooper drafted them and marked each one. The ranking runs on them, but Whistler Company sits at 71% confidence against 88% for DC Water capital."**
  - Solutions: "Apply 71%" (Cooper, recommended), "Apply 88%". Then "+ My answer".
- Warning 2: not designed.

**The Verisk FireLine copy is NOT rendered UI.** "Verisk FireLine licence lapsed 14 Mar" / "Wildfire hazard has been drawing a cached tile since. It still renders, so the map looks normal, but the numbers behind it are eleven weeks old." exist **only as stale layer names** on the question title and body layers. The rendered overrides are the Flood-extent copy above. The closest designed item is open question 3, "Wildfire hazard is vendor-tier" (title only). If J02 needs the licence-lapsed story, it has to be added as question 3's detail and tagged `[Assumed]` (from the layer name).

### 5.4 Apply a solution (sub-section "Apply Solution")
1. **Start** (`29:345358`): "1 / 3 (0% resolved)". SOLUTIONS lists "Swap to First Street, 30 m" (Cooper) and "Accept the cap", then "+ My answer". A flow connector runs from the Cooper card to "Applied".
2. **Applied** (`29:345530`, the target):
   - The pager shows a **green check** + "1 / 3" + **"(35% resolved)"**.
   - The caption changes from "SOLUTIONS" to **"APPLIED"**.
   - Only the chosen card remains: the same Cooper warm card "Swap to First Street, 30 m", now h 38 with a ghost **undo icon button** (`arrow-back-up`) at the right.
   - "Accept the cap" and "+ My answer" are gone.
   - A connector runs from "All risk" to the next frame.
3. **All risk** (`29:345699`): the pager row and question are replaced by the numbered list of the 3 open questions, and #1 carries a green check. There is no pager here.

Undo (from the icon) presumably returns to Start, with "(0% resolved)" and both solutions. There is no frame for it: `[Assumed]`.

### 5.5 Add my answer (sub-section "Add my answer")
1. Start: the same as §5.4 Start. Hotspot on "+ My answer".
2. Answer, empty (`29:346038`/`29:346141`): the button turns into a focused text field (blue focus border) with placeholder "My answer", a caret, and "×" (cancel) and "✓" (confirm) icons at the right.
3. Answer, typing (`29:346210`/`29:346313`): the field holds "Swap to" with "×" and "✓". Hotspot on ✓.
4. Answer, applied (`29:346388`/`29:346487`):
   - green check, "1 / 3 (35% resolved)";
   - the caption reads "APPLIED";
   - one **plain** card (`elevation-1/secondary`, no Cooper styling) reads **"Swap to 60m"**, with the undo icon.

   The typed text ("Swap to") and the applied text ("Swap to 60m") differ in Figma. Show what the user typed.

### 5.6 How "confidence" updates
- The only progress readout is the pager's **"(N% resolved)"**: 0% before, **35% after resolving question 1 of 3**, plus a green check before the index. 1 of 3 would be 33%, so the 35% is either weighted or a typo (ask the designer; see Ambiguities). Stale layer names also say "(25% resolved)" and "(10% resolved)". Never copy those.
- Warning 1's body is the only other confidence number: "71% confidence against 88%". Its solutions "Apply 71%" / "Apply 88%" imply that applying one sets the confidence used for ranking. No applied frame exists for it.
- No frame shows the map, Asset details or a StatCard changing after a solution is applied. Any recalculation (e.g. flood-lens values after swapping to the 30 m source) is `[Assumed]` and must come from the risk model in `shared/`.

### 5.7 Other DEV NOTEs
Only `29:346563` (panel logic, §4.5). The Trace Report page has no other DEV NOTE callouts. The magenta connectors are the only behaviour annotations: Warnings tab → Warnings frame; Cooper solution → Applied; All risk → list; My answer → field → typed → applied.

---

## 6. J02 interaction sequence (stitched from the frames)

1. In the NavBar, click search and type the asset code. The **Type: Assets** chip and "SUB-2210" appear; the dropdown shows **BEST MATCH** preselected. Press **Enter** or click the row → Explore at that asset (destination `[Assumed]`).
2. Explore opens in the **Asset Manager** context: the ASSETS panel is open (§3.5 rule).
3. In the tree, drill Whistler Company › Electrical › Distribution › Pacific North region › Wylam D.S. 115 kV › Northgate cluster › **Demeter SS**. The map flies to each level and the FloatingBar shows "Selected N ●k".
4. Click **View details** (FloatingBar) to open the Asset details panel. For the group, the panel shows "At-risk assets 2/8", "Condition Poor 32%" and so on (§4.3). Selecting a single asset (a hierarchy row, the search, or the left list of the panel) shows that asset's details (§4.2).
5. **Alternatively, lasso:** draw around assets → View details → Cooper says "Opening details for the selected assets…" → Cooper lists groups → "Demeter SS group SELECTED 8/8" → group details (§4.3) → ASSETS list/tree filtered to "8 assets match search results".
6. Open the **Trace Report** (right rail): Open questions 3 · Warnings 2. Q1 "Flood extent binds the floor at 2 km" → apply **"Swap to First Street, 30 m"** → **APPLIED**, "(35% resolved)", undo available. Then "All risk" shows Q1 ✓ and Q2/Q3 still open. Warnings tab: "468 values are not measured" → "Apply 71%" / "Apply 88%".

---

## 7. Ambiguities to raise with the designer
1. **The Verisk FireLine copy is only in stale layer names**, not on screen. Is it the intended detail for question 3 ("Wildfire hazard is vendor-tier")?
2. **"35% resolved" after 1 of 3.** Is it weighted, or should it read 33%?
3. **Applied text after My answer:** the user typed "Swap to" but the card reads "Swap to 60m".
4. **Selection counts:** the Cooper text says "14 assets"; the Demeter SS group is "8/8"; the FloatingBar at leaf level says "Selected 7"; the tree under Demeter SS shows 7 leaves in `9:64506` but 8 in `9:67830` (Pole 6 added).
5. **Risk numbers:** the group Cooper card says "RISK SCORE $6M" while the panel says "Risk score 32M"; "32M" + "Healthy" sits beside "Condition 32% Poor". The panel values are placeholders, so drive them from `shared/`.
6. **"Baseline risk"** (named in the J02 brief) is not a label in any frame. Is it "Risk score"?
7. **Global Search demo data** (SUB-2210, Substation North A, Ridgeview · North District) doesn't match the Explore data (Demeter SS, Northgate cluster), and there is no designed destination for "Open item".
8. **Globe counts** differ between frames: 456/470 (assets) vs 1,234/765 (investments). The "DC Water Capital" / "capital" casing is also inconsistent.
9. **Opening the Trace Report:** no frame or connector shows the rail → panel transition. Is there a badge on the rail when questions are open?
10. **Trace Report vs Plan's System confidence:** they share the pattern, but this one has no gates, no Upload file and no Cooper-evidence button. Confirm that it is a separate component variant.
