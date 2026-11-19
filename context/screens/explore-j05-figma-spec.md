# Explore for J05 (Asset Manager · Predictive Analytics: Results Review) — Figma screen spec

Journey J05 starts from Cooper's proactive recommendations on the Explore map, walks into one recommendation (live signal → risk drivers / affected areas / recent outages → evidence), drafts the investment, and sends it to Build. This spec covers only what is **new or different** compared with `explore.md` (arrival map, "Cooper found" FloatingBar, AgentWindow with `ClusterDetails`), `study.md` (lenses, Horizon, Save study) and `explore-j02-figma-spec.md` (hierarchy, Asset details, Trace Report).

Source: Explore handover `RIgfAXt18AXHLu8s0wuvQ1`:
- section **"Cooper Recommendations - overview"** `29:351117` (two rows: "Cooper Recommendations" and "Risk details");
- section **"Send to build"** `29:357809`;
- frame `9:33730` (map-only close-up, page "↪ Navigation").

Every frame was screenshotted at 1440 px. Copy in "quotes" is exact: from `get_design_context` for the agent windows of `29:352263` and `29:357164` / `29:359076`; everything else was read off screenshots. **Layer names are stale** (text layers are called "title", "Value", or carry an old quote: "Safety incidents must be treated with equal urgen…"), so never copy a layer name as UI text. Real-looking person names are replaced with "[person name]".

> **Data conflict (raise before building).** The Figma copy is written for the retired **Northgate** story (Northgate cluster, Demeter SS, West District, Ridgeview Village, Feeder 1231D2, ~9,400 customers). `decisions.md` (2026-11-16) says Northgate is retired and every number comes from the Whistler dataset (Alpine Meadows cluster). Build the **layout and copy patterns** from this spec, but fill names and numbers from `shared/` and tag what is invented `[Added]` / `[Assumed]`. Every number below is `[Figma]` copy, not data.

---

## 1. Frames found

| Node | Section · canvas label | What it shows |
|---|---|---|
| `29:351120` | overview · "Empty" | Explore map, cluster pins; "7 risks surfaced" chip in the explore-header; no window |
| `29:351488` | overview · "Hover" | Same; cursor hovering the chip |
| `29:351865` | overview · "Clicked" | Chip selected (blue outline) → AgentWindow with the **grouped list, all collapsed** |
| `29:352263` | overview · "Explore - Critical" | First recommendation **expanded** (card anatomy, 3 metrics, if-no-action, "Take me there"); map highlights its area |
| `29:352944` | overview · (below "Explore - Critical") | Same window **scrolled** to the bottom: rest of the groups |
| `29:357176` | overview · note | DEV NOTE: backend chooses the 3 metrics (§3.4) |
| `29:353625` | overview · "Loading" | After "Take me there": Cooper "Taking you there…" one-liner, map flying in, header back-link "Northgate cluster" |
| `29:354522` | overview · "Station details" | **Live signal** close-up + AgentWindow, Risk drivers open, cursor on "Create idea" |
| `29:357164` | overview · (loose agent-window) | The same agent window full height (373 × 773): shows the collapsed "Affected areas" and "Recent outages 3" below |
| `29:354868` | overview · (below "Station details") | Same + **Evidence chain** drawer open (Rationale) |
| `29:355433` | overview · modal | Evidence chain, Rationale tab, full length (396 × 1050) |
| `29:355670`, `29:355979`, `29:356285`, `29:356613` | overview · modals | Evidence chain, **Peer benchmark** tab (scrolled / tooltip variants) |
| `29:354046` | overview · "Idea draft" | After "Create idea": map turns green, single button **"View in Build"** |
| `29:354216` | overview · "Hierarchy" | Map rail icon 1 → ASSETS tree on Demeter SS + FloatingBar + Cooper "Hierarchy impact" |
| `29:357194` | overview, row 2 · "Risk drivers" | Live signal, Risk drivers section open (same content as `29:354522`) |
| `29:357508` | overview, row 2 · "Affected areas" | Affected areas section open; Customers tooltip |
| `29:357675` | overview, row 2 · "Recent outages" | Recent outages section open (3 collapsed items) |
| `9:33730` | Navigation page · "Select Assets - Live signal substation close-up" | Map only (no window): Demeter SS close-up, segment shown neutral "12%" |
| `29:358931` | Send to build · "Strategies" | **Investment draft**: recommended intervention + "Other interventions 2"; "View in Study" / "Create idea" |
| `29:358554` | Send to build · "Back to Recommendations" (1) | Window closed; **Snackbar** "3 strategies sent to Build for West District"; chip now **"6 risks surfaced"** |
| `29:357810` | Send to build · "Back to Recommendations" (2) | Chip clicked → list "I've surfaced 6 recommendations…" (6 items) |

Canvas group labels (sticky notes) left of the rows: "Cooper Recommendations", "Risk details", "Recommendation Applied/Sent to build".

**Not designed** (tag `[Assumed]` if built):
- the content of the **"Other interventions (2)"** section (only the collapsed header with counter "2" exists);
- the expanded content of every recommendation other than "3 risky assets — West District";
- the bodies of the three Recent outages items;
- what "View in Study", "View in Build" (snackbar or window), "Ask", the "Includes" rows and the "Root" badge do on click;
- an error / empty state for the list (no recommendations), and a real loading skeleton.

---

## 2. Interaction sequence (connectors on the canvas)

1. **Empty** `29:351120` → hover the chip (**Hover** `29:351488`) → click it (connector `29:357191`) → **Clicked** `29:351865`: chip goes to selected, the AgentWindow opens top-right with the grouped list collapsed.
2. Click a list item's caret/title → it expands in place (**Explore - Critical** `29:352263`). No connector; the item is an accordion. The map highlights that recommendation's area (§3.3). The window body scrolls (`29:352944`; scrollbar connector `29:357179`).
3. **"Take me there"** (connector `29:357182`) → **Loading** `29:353625`: window collapses to a one-line Cooper message, the map flies to the area, the explore-header gains a back-link "‹ Northgate cluster" and loses the risks chip.
4. Loading → **Station details / Live signal** `29:354522` (no connector; automatic when the fly-in ends).
5. In the Live signal window: the three section headers are an **accordion** — Risk drivers `29:357194` → click "Affected areas" (connector `29:357803`) → `29:357508` → click "Recent outages" (connector `29:357806`) → `29:357675`. Each opened section shows the matching map layer (§3.5).
6. The **evidence button** (round icon right of the title) → Evidence chain drawer floats left of the window (`29:354868`; connector `29:357188`). Rationale | Peer benchmark tabs.
7. **"Create idea"** (connector `29:357185`) → **Idea draft** `29:354046`: window becomes "‹ Back · title · Recommended intervention · Other interventions 2", map turns green, footer is one **"View in Build"** button.
   - The Send-to-build section shows the same window *before* applying (`29:358931` "Strategies": footer still "View in Study" / "Create idea").
8. **"Create idea"** in `29:358931` (connector `29:359083`) → `29:358554`: window closes, **Snackbar** bottom-centre "3 strategies sent to Build for West District" + "View in Build"; chip shows **"6 risks surfaced"** (not selected); the Distribution cluster pin badge drops 3 → 2.
9. Click the chip (connector `29:359080`) → `29:357810`: list re-opens with **6** recommendations; the applied one is gone.
10. Side branch: map rail icon 1 (asset structure) from the Live signal → **Hierarchy** `29:354216` (cursor on the rail icon in `29:354046`).

---

## 3. Frames in detail

### 3.1 Chip in the explore-header (`29:351120` / `29:351488` / `29:351865`)
- Explore-header right side, before the collaborators button "3/5" and the comment icon: a pill **"7 risks surfaced"** with the Cooper dots icon, orange text.
  - Default: no border. Hover (`29:351488`): cursor over it. Selected (`29:351865`): **blue outline** while the window is open.
  - After applying one recommendation it reads **"6 risks surfaced"** (`29:358554`). The count = number of open recommendations.
- During Loading and on the Live-signal / Investment frames the chip is **gone** and the header shows a back-link **"‹ Northgate cluster"** left of the search field.
- Map (Empty): cluster pins with counters and red/amber badges: "544" Transmission (badge 3), "377" Distribution (badge 3), "322" Generation (amber badge 1); place labels "Orlando River", "West District", "Pine Basin Rese…". FTA (Cooper) button bottom-right. No "Cooper found" FloatingBar in any J05 frame.

### 3.2 Grouped list, collapsed (`29:351865`)
AgentWindow, 380 wide, top 100 / right 60 (left of the 48 px right sidebar).
- Header: Cooper icon + "COOPER" · speaking control "Speaking" + pause · **"Ask"** button (tertiary, only on the list frames) · collapse icon · close ✕.
- Insight text (Body L): **"I've surfaced 7 recommendations that need your attention — grouped by risk, value and impact."**
- Groups (Caption UPPER title + counter, 1 px top rule), each with collapsed list items (caret ▸ + title, Body L medium, filled row):
  1. "HIGHEST-RISK ITEMS" **2** — "3 risky assets — West District"; "Demeter SS → South Ridge — 115 kV line critical"
  2. "HIGHEST-VALUE OPPORTUNITIES" **1** — "Willow Creek Dam — condition drifting"
  3. "IMMEDIATE REVIEW REQUIRED" **3** — "Greenfield Solar — new candidate"; "Orlando River crossing — easement risk"; "South Ridge regulator — load-forecast spike"
  4. "LARGEST POTENTIAL IMPACT" **1** — "Demeter SS → Riverside village"
- No footer buttons.

### 3.3 Expanded recommendation (`29:352263`, scrolled `29:352944`)
Same window; body scrolls (scrollbar right). Map: the recommended area (small polygon next to the Distribution pin) is **highlighted orange** with a **Cooper cursor** ("Cooper" pill) pointing at it; the other cluster pins (Transmission, Generation) are **dimmed**; Distribution pin stays bright with badge 3.

Exact copy, top to bottom (from `get_design_context` `29:352907`):
- Insight: "I've surfaced 7 recommendations that need your attention — grouped by risk, value and impact."
- Group title **"Highest value opportunity"** · counter "1" (see §6: differs from §3.2)
- **Expanded item** (caret ▾):
  - Title: **"3 risky assets — West District"**
  - Paragraph: "Condition crossed critical threshold after load-forecast signal. Worth grouping into one plan now."
  - "INCLUDES" (caption) — bullet list: "West District Feeder 12" · "West District Feeder 17" · "Hunter–West Tie Transformer" + badge **"Root"**
  - "POTENTIAL IMPACT" (caption) — table of 3 rows (header cell UPPER tertiary left, value right):
    - "REPLACEMENT COST" — "$4.2M"
    - "RISK REDUCED" — "31% if actioned"
    - "FAILURE LIKELIHOOD" — "62%"
  - "IF NO ACTION IS TAKEN" (caption) — bullets, the consequence value in medium weight:
    - "Failure cascades to Feeders 12 & 17"
    - "West District outage **~8.4K customers**"
    - "Emergency replacement **~$6.9M(+64% vs plan)**" (no space before "(" in Figma)
  - Full-width tertiary button **"Take me there"**
- Collapsed: "Demeter Station — critical condition"
- "Highest-value opportunities" 1 — "Willow Creek Dam — condition drifting"
- "Immediate review Required" 3 — "Greenfield Solar — new candidate" · "Orlando River crossing — easement risk" · "South Ridge regulator — load-forecast spike"
- "largest potential impact" 1 — "Riverside Flood Wall" (screenshot `29:352944` shows "Demeter SS → Riverside village" here; see §6)

Group titles render UPPERCASE (Caption/regular-UPPER), whatever their casing in the layer.

### 3.4 DEV NOTE `29:357176` (verbatim)
"the 3 metrics shown in the card are driven by which measures are most relevant to that specific recommendation. Backend logic should determine which 3 metrics to surface (i.e., the measures most materially impacted by applying that recommendation). The UI just renders whichever 3 are passed"

Note: the DS `RecommendationImpact` description says "the two metrics the backend marks as most affected". This J05 frame uses **three**. The component renders `rows` as given, so pass 3.

### 3.5 Loading (`29:353625`)
- AgentWindow shrinks to header + one line: **"Taking you there: Bringing the assets into view…"**. The header still shows "Ask" + collapse + ✕.
- Map: the highlighted polygon is still orange, Cooper cursor moves with it; Transmission / Generation pins dimmed; camera begins the fly-in.
- Explore-header: back-link "‹ Northgate cluster"; risks chip hidden.

### 3.6 Live signal — Station details (`29:354522`, full window `29:357164`)
Map (3D close-up): Demeter SS substation drawn as an **orange 3D volume**; red MapPin "Demeter SS" above it; circuit **Demeter SS → Transformer T-904 (amber dot) → poles 1 … 6 → Feeder 1231D2** drawn **red** with flow arrows; a red badge on the segment between poles 1 and 2: **"⚡ 88% ▲"**; place label "Ridgeview Village"; Cooper cursor near the segment. Feeder 1231D2 also has an orange 3D volume.

AgentWindow (header: COOPER · Speaking · collapse · ✕; **no Ask**):
- Title (H2): **"Northgate Cluster — 7 aging feeders replacement"** + round **evidence button** at the right.
- Paragraph: "7 aging feeders serving Ridgeview Village and ~9,400 customers — reliability risk rising, flagged before failure, with an investment idea already drafted."
- Section header ▴ **"RISK DRIVERS"** (open) — card:
  - "Demeter SS → Recloser R-1" (H3)
  - "I found the segment that appears to be driving the corridor risk. It looks overloaded, and the excess load may be spilling onto Feeders 12 and 17."
  - "IMPACT" caption, then rows:
    - "EXPECTED FAILURE" — "Feeder failure"
    - "LOADING" — "88% of rated capacity"
    - "LOAD AT RISK" — "~40 MW"
    - "FAILURE LIKELIHOOD" — "High — ≤18mo to failure", with a chart inside the same row:
      - y-axis "100%", "75%", "50%", "25%", "0%"; x-axis "-6mo", "Now", "+3 mo", "+12 mo", "+21 mo" (render uppercase: "-6MO", "NOW" bold, "+3 MO" …);
      - grey history line up to Now, then a red line with a red area fill below;
      - tooltip on the Now point **"Now — 52%"**; a blue **flag** marker (dashed vertical) between +3 and +12 mo; red point + tooltip **"Failure"** near +18 mo, then a **hatched red zone** to the end.
- Section header ▾ **"AFFECTED AREAS"** (collapsed)
- Section header ▾ **"RECENT OUTAGES"** + counter **"3"** (collapsed)
- Footer, sticky: **"View in Study"** (tertiary) · **"Create idea"** (primary)

#### Affected areas open (`29:357508`)
- Map: **Ridgeview Village** polygon filled orange with dashed outline and red dots on the corners, red pin icon above the label; Recloser R-1 grey MapPin (substation glyph) with red dot; Demeter SS grey pin; red segment Recloser R-1 → Demeter SS with "⚡ 88% ▲".
- Window: "RISK DRIVERS" collapsed ▾; ▴ "AFFECTED AREAS" open — card:
  - "Ridgeview Village"
  - "If the cluster fails, Ridgeview Village takes the worst of it — it runs on a single feed with no backfeed, so an outage there can't be rerouted. It's the most exposed of ~9,400 customers served off the Northgate cluster, and home to 2 critical-care facilities."
  - "IMPACT": "CUSTOMERS" — ⓘ "9,400" (hover ⓘ → Tooltip "Residential 78%" / "Commercial 18%" / "Industrial 4%"); "OUTAGE DURATION" — "~6h"; "REDUNDANCY" — "Not available"
  - ▾ "RECENT OUTAGES" 3 (cursor on it)

#### Recent outages open (`29:357675`)
- Map: same view, Ridgeview polygon **no longer filled** (dashed outline only).
- Window: Risk drivers ▾, Affected areas ▾ (shown with ▴ in Figma — likely a slip), ▴ "RECENT OUTAGES" 3 with three collapsed items: "1. Substation fault" · "2. Pole failure" · "3. Planned switching failed". The window shrinks to fit (no scroll).

#### Evidence chain (`29:354868`, full `29:355433`; Peer benchmark `29:356613` et al.)
Floating drawer, 396 wide, left of the AgentWindow; the evidence button shows an active (blue) ring.
- Header "EVIDENCE CHAIN" + ✕
- Confidence bar: "87%" with marker; captions "<70% REJECT" · "87% REVIEW" · ">90% APPROVE"
- SegmentedControl: "Rationale" | "Peer benchmark"
- **Rationale**:
  - "WHY IT'S FLAGGED":
    - "Feeder Condition Assessment" — "\"7 feeder sections show deteriorating condition indicators and increasing likelihood of reliability issues.\"" — tag "Aging asset risk increasing"
    - "Network Capacity Analysis" — "\"Current feeder loading is approaching operational limits, reducing flexibility during future demand growth or outages.\"" — tag "Limited network flexibility"
    - "Financial Risk Model" — "\"Deferring intervention increases exposure to reactive repairs, outage costs, and accelerated replacement needs.\"" — tag "Delay creates financial risk"
  - "DECISIONS":
    - "Southern Feeder Replacement — Circuit 14B" — "Proceed with a proactive feeder replacement investment instead of waiting for asset failure." — tag "Reduced reliability exposure"
    - "Reliability Risk Review — FY27 Capital Planning" — "Prioritize the affected feeder sections due to their increasing failure probability and customer impact." — tag "Focused risk reduction"
  - "CONSIDERED BUT NOT INCLUDED": avatar + "[person name]" — "\"Defer 3 yrs — rejected. The risk trajectory crosses tolerance in roughly 14 months\""
- **Peer benchmark** (`29:356613`):
  - "Based on 341 peer assets, most utilities intervene between 44–51 yr — and the dominant choice at this age is replacement. This asset is 48 yr, putting it in the peak intervention window. Peers who deferred past 53 yr saw a 2.4× higher failure rate."
  - "SUMMARY": "PEER UTILITIES" — "27 — 341 comparable assets"; "TYPICAL INTERVENTION AGE" — "46-51yr"; a third row "MO… — …ole failure" (hidden under the tooltip; read as most common failure = Pole failure `[Assumed]`)
  - Stacked column chart, y "Number of utilities", x "Years": "<40", "40-50", "50-60", ">60", "UNKN"; series Vegetation contact / Pole failure / Transformer failure / Substation fault. Hover tooltip: "40-50yr utilities" · "~100 utilities" · "Vegetation contact 46%" · "Pole failure 28%" · "Transformer failure 16%" · "Substation fault 10%".
  - Variants `29:356285` / `29:355979` carry "45-50yr utilities" and "$1.11bn" (tooltip / scroll variants, not inspected further).

### 3.7 Map-only close-up (`9:33730`)
No window, chip or FloatingBar. Labels "Ridgeview Village", "Demeter SS group" (red MapPin), "Demeter SS", "Transformer T-904" (amber), "Feeder 1231D2", "Greenfield Solar Farm group" (grey MapPin); poles 1–6; the segment is **grey/neutral** with red dots at poles 2 and 3 and a neutral badge **"12%"**; the 3D structures are wireframe grey (no orange or green fill). It reads as the asset-selection base view of the same place; it is not linked to the J05 rows by any connector.

### 3.8 Investment draft — recommended intervention (`29:358931`; applied state `29:354046`)
Map: same close-up, label "Northgate cluster"; the segment Recloser R-1 → Demeter SS is **green** with badge **"12%"**; the Demeter SS volume orange (in `29:358931`) / everything **green** with badge "↘ 12%" (in `29:354046`).

AgentWindow (380 × 554), exact copy (from `get_design_context` `29:359076`):
- "← Back" (ghost S button)
- Title "Northgate Cluster — 7 aging feeders replacement" + evidence button
- "RECOMMENDED INTERVENTION" ▴ (open) — card:
  - "Full Replacement" + badge "7 feeders"
  - "Replaces all end-of-life units across the 7 feeders. Balances cost, supply chain capacity and risk reduction. Clears the Ridgeview hazard and the recurring failure mode."
  - rows: "COST" — "~$4.2M"; "VALUE" — "9,400 customers protected"; "TIMELINE" — "3–5 years"; "RISK REDUCED" — "Reliability 88% → 12%"
- "OTHER INTERVENTIONS" ▾ + counter **"2"** (collapsed; contents not designed)
- Footer: "View in Study" (tertiary) · "Create idea" (primary)
- Applied (`29:354046`): footer replaced by one full-width tertiary **"View in Build"**; the "Other interventions" caret is shown ▾ beside the title.

### 3.9 Hierarchy branch (`29:354216`)
- Left: **ASSETS 926** panel (tree/list toggle, collapse, ✕). Tree: Whistler Company › Electrical › Transmission (dimmed) / Distribution › Pacific North region › Wylam D.S. 115 kV › Northgate cluster › **Demeter SS** (selected) › Pole 1 (red dot) · Pole 2 (red) · Transformer T-904 (amber) · Demeter SS · Pole 3 · Pole 4 · Pole 5.
- Top-centre FloatingBar: category "DEMETER SS" (folder icon) · "Selected 7" · red badge "2" · "View details" · ✕.
- Cooper window: "← Back" · "Hierarchy impact" + evidence button · "I found a reliability risk within the Northgate Cluster hierarchy. The issue is centered around Demeter SS and affects multiple assets in this branch." · "HIGH-RISK ITEMS" 2: "Pole 1 — critical condition", "Pole 2 — critical condition" · "MEDIUM-RISK ITEMS" 1: "Transformer T-904 — warning condition" · full-width "View in Build".
- Already covered structurally by J02 (hierarchy, FloatingBar); new is the Cooper "Hierarchy impact" window.

### 3.10 Send to build result (`29:358554` → `29:357810`)
- `29:358554`: agent window gone; FTA Cooper button back bottom-right; **Snackbar** bottom-centre (320 × 58, x 560 y 740): "3 strategies sent to Build for West District" + secondary S **"View in Build"** (no close icon visible). Chip "6 risks surfaced". Distribution pin badge **2** (was 3).
- `29:357810` (after clicking the chip): "I've surfaced 6 recommendations that need your attention — grouped by risk, value and impact."
  - "HIGHEST-RISK ITEMS" 1 — "South Ridge Substation — critical condition"
  - "HIGHEST-VALUE OPPORTUNITIES" 1 — "Willow Creek Dam — condition drifting"
  - "IMMEDIATE REVIEW REQUIRED" 3 — "Greenfield Solar — new candidate" · "Orlando River crossing — easement risk" · "South Ridge regulator — load-forecast spike"
  - "LARGEST POTENTIAL IMPACT" 1 — "Riverside Flood Wall"
  - Map: a new orange polygon bottom-left with the Cooper cursor (the next recommendation's area); Transmission / Generation pins dimmed.

---

## 4. DS component mapping (`vendor/ds2/api.md`)

| Figma element | DS 2.0 component | Notes |
|---|---|---|
| Cooper window (all frames) | **`AgentWindow`** (`text`, `children`, `secondaryAction`/`tertiaryAction`, `onAsk`, `onClose`, `view`, `speaking`) | "Ask" only on list frames → pass `onAsk` there only. Footer "View in Study" / "Create idea" = tertiary/secondary actions; check the kit's primary-button support, otherwise put the button row in `children` |
| Grouped list (`29:351865`, `29:357810`) | **`RecommendationGroup`** (`title`, `count`) × N, each with **`RecommendationItem`** children | Matches Figma "Slot with Caption title + counter" |
| Expanded item (`29:352263`) | **`RecommendationItem`** `expanded`, `description`, `impact`, `action={{label:'Take me there'}}` | Kit item has description + impact + action only. **"INCLUDES" list + "Root" badge and "IF NO ACTION IS TAKEN" bullets are not in the kit** → wrap in `NDS` (or pass as children if the item supports them; check `scripts/entry.sh RecommendationItem`) |
| "POTENTIAL IMPACT" table | **`RecommendationImpact`** `rows=[{label,value}]` | Pass **3** rows (DEV NOTE §3.4); kit doc says 2 |
| The whole list → one-by-one flow | `CooperRecommendations` | **Does not match J05.** Its flow is list → Shape mode `RecommendationDetail` (Decline / Do it) → "Working on it…". J05 instead goes "Take me there" → map fly-in → Live signal window. Use the parts (Group/Item/Impact), not the pattern. `RecommendationDetail` is not used in these frames |
| "7 risks surfaced" chip | **`CooperChip`** (`children`, `selected`) placed via `ExploreHeader` `actions`/`children` | Figma CooperChip default text is "1 Recommendation"; selected = blue ring, matches `29:351865` |
| Back-link "‹ Northgate cluster" | `ExploreHeader` `children` (as today) | Already built for J03 |
| Insight sentence, "Taking you there…" | `AgentWindow` `text` | Not `CooperMessage`/`ChatCompactPanel` (those are chat, not used in J05 frames) |
| Live-signal sections (Risk drivers / Affected areas / Recent outages) | Collapsible caption headers — **not Tabs / SegmentedControl** | Same caret-header pattern as `RecommendationGroup`-style slots; if no kit accordion, `NDS` |
| Impact rows (Expected failure, Loading…) and intervention rows (Cost, Value…) | `RecommendationImpact` rows (same "row / tableHeader / tableCell" anatomy) | Not `StatCard` (current `ClusterDetails` uses a StatCard grid → mismatch) |
| Failure-likelihood chart | **`AreaChart`** / `LineChart` (`referenceKey` for the flag) | Tooltips "Now — 52%" and "Failure", hatched failure zone and flag marker are not kit props → `NDS` overlay |
| Customers ⓘ breakdown | `Tooltip` | |
| Recommended intervention card | `ContentCard` size s with `Badge` "7 feeders" + `RecommendationImpact` rows | |
| "Other interventions 2" | caption header + `Counter` | contents not designed |
| Evidence button / drawer | **`EvidenceButton`** (`active`) + **`EvidenceChainDrawer`** (`value=87`, `rationale=[{title, items}]`, `benchmark`) with `EvidenceSection`, `PeerBenchmark` | Fully in kit; the "CONSIDERED BUT NOT INCLUDED" row with avatar is an `EvidenceSection` item |
| Snackbar | **`Snackbar`** (`title`, `secondaryAction={{label:'View in Build'}}`, `showClose={false}`) | Figma places it bottom-centre, not the top-right `IFS.toast` default → place it explicitly |
| Map pins / segment | `MapPinDot` (cluster counters), `MapPin`, `MapPinPole`, `MapPinFlow` (`type=error`), `Badge` "88%" on the segment, `CollaboratorCursor user="cooper"` | 3D volumes / extruded substation can't be drawn (known mismatch in `study.md`) |
| Hierarchy branch | `AssetsPanel` (J02) + `FloatingBar` + `AgentWindow` with `RecommendationGroup`s ("HIGH-RISK ITEMS", "MEDIUM-RISK ITEMS") | |

---

## 5. What is new vs the current build

Current build (`app/screens/explore.jsx`): non-AM personas see a "Cooper found · <cluster> · N assets" `FloatingBar` → "View details" opens an `AgentWindow` with `ClusterDetails` (Recommended intervention `ContentCard` + 4 `StatCard`s Cost / Value / Timeline / At-risk assets + 3 "If no action" lines). AM persona sees the hierarchy / search / Trace Report (J02) and Save study (J03).

New in J05:
1. **Entry point**: a **"N risks surfaced" CooperChip** in the explore-header replaces the "Cooper found" FloatingBar as the way in. Count follows the open recommendations (7 → 6).
2. **Grouped recommendations list** (4 groups, 7 items) in the AgentWindow, with **accordion items**; the expanded card has Includes (+ Root badge), 3-metric Potential impact (backend-chosen), If-no-action consequences with emphasised values, and **"Take me there"**.
3. **Map reacts to the list**: the expanded item's area is highlighted orange with a Cooper cursor, other clusters dim.
4. **"Take me there" transition**: Cooper one-liner "Taking you there…", camera fly-in, back-link to the cluster.
5. **Live signal window**: title + evidence button, summary, three accordion sections (Risk drivers with impact rows + failure-likelihood chart; Affected areas with customers tooltip; Recent outages list), each switching a map layer (red overloaded segment + "88%" badge; affected-area polygon).
6. **Evidence chain drawer** opened from the title (Rationale / Peer benchmark).
7. **Investment draft** reached by "Create idea": Back, recommended intervention (Cost / Value / Timeline / Risk reduced as rows, not StatCards), Other interventions (2); map recolours green with the post-intervention value.
8. **Send to Build** result: window closes, bottom-centre Snackbar with "View in Build", the recommendation disappears from the list, chip and cluster badge decrement.
9. Cooper "Hierarchy impact" window on the asset tree (side branch).

Removed/changed vs `explore.md`: "At-risk assets" StatCard and the StatCard grid have no counterpart in these frames; "View details" / "Study area" FloatingBar is not part of J05.

---

## 6. Ambiguities and conflicts (ask the designer)

1. **Northgate vs Whistler** (see top). The Figma story is the retired Northgate dataset; J05 needs a Whistler/Alpine Meadows mapping for every name and number.
2. **First group title**: collapsed list says "HIGHEST-RISK ITEMS 2" with "3 risky assets — West District" + "Demeter SS → South Ridge — 115 kV line critical"; the expanded frame says "Highest value opportunity 1" holding "3 risky assets — West District" + "Demeter Station — critical condition", and then a *second* "Highest-value opportunities" group. Which is right? (Counts only add up to 7 in the collapsed version.)
3. **Last item**: "Demeter SS → Riverside village" (`29:351865`, `29:352944` screenshot) vs "Riverside Flood Wall" (layer text in `29:352263`, and `29:357810`).
4. **Which item was applied?** After sending, "HIGHEST-RISK ITEMS" drops from 2 to 1 but its remaining item is renamed "South Ridge Substation — critical condition". Confirm the 6 left.
5. **Story continuity**: the card is "3 risky assets — West District" (Feeders 12, 17, Hunter–West Tie Transformer), but "Take me there" lands on "Northgate Cluster — 7 aging feeders replacement" (Demeter SS → Recloser R-1, Feeder 1231D2). Snackbar then says "for West District". Are these the same recommendation?
6. **Numbers disagree across frames**: Failure likelihood "62%" (card) vs chart "Now — 52%"; Risk reduced "31% if actioned" vs "Reliability 88% → 12%" (88% is also the Loading value); customers "~8.4K" vs "~9,400"; Replacement cost "$4.2M" vs Cost "~$4.2M". Peer benchmark "44–51 yr" vs "46-51yr".
7. **"Create idea" vs "3 strategies sent to Build"**: one click on "Create idea" yields "3 strategies". Is "Create idea" = "Send to Build", and why 3 (the 3 alternatives: recommended + 2 others)?
8. **Two different post-"Create idea" states**: `29:354046` keeps the window with "View in Build"; `29:358554` closes it and shows the Snackbar. Which one, or both in sequence?
9. **3 vs 2 metrics**: DEV NOTE says 3; DS `RecommendationImpact` doc says 2. Kit renders whatever is passed, so 3 is fine — the doc should be corrected.
10. **Not designed**: Other interventions content, other recommendations' expanded content, Recent outages item bodies, "View in Study" target (open the Study on this population? `[Assumed]`), "View in Build" target (Build idea for the created investment `[Assumed]`), "Ask", Includes-row clicks, empty list.
11. Recent outages frame shows "Affected areas" with an open caret while collapsed — assume a slip (one section open at a time).
12. The DS `CooperRecommendations` pattern (Shape mode, Decline / Do it, Decline all) is not what these frames show; confirm J05 should not use Decline / Do it.
