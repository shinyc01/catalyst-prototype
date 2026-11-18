# Flow: J02 · Explore · Asset data ingestion and validation

**Source:** JTBD journey **J02 — Asset Manager — Asset Data Ingestion and Validation** (given by Shiny on 2026-11-18). Tour: `app/flows/003-asset-data-validation.js`. Persona: **Mara Delgado, Asset Manager** (the journey's "Priya"). Frame spec: `screens/explore-j02-figma-spec.md`. Logic: `logic/explore-data.md`.

## Story `[Confluence]` journey, `[Whistler]` data
Mara opens **Global Search** and types **PM-0005**. The best match is Pad-mount PM-0005 (WD-LV-PM-0005), and Enter opens it in Explore. As Asset Manager she lands with assets first: the **ASSETS hierarchy** on the left and the asset's details on the right. She selects its group, **Alpine Meadows** (12 pad-mounts, fully selected), and opens the group details. The **Trace Report** rail has a red dot. It holds 3 open questions and 1 warning:
- "Flood extent binds the floor at 2 km": she applies **Swap to First Street, 30 m**. The flood lens switches to First Street v3 and the risk of PM-0004, PM-0005 and PM-0009 recalculates.
- "5 spans have no clearance data": left open.
- "Wildfire hazard is vendor-tier": the Verisk FireLine licence lapsed and the data is 11 weeks old. She leaves it open for the admin, and the Pine Ridge assets keep stating it in their details.

## Steps and deep links
| # | J02 step | Where | Deep link |
|---|---|---|---|
| 1 | Jump to a known asset | NavBar **Search** (expands in the bar) → type a code → Best match → Enter | `#command?persona=asset` |
| 2 | See assets in full context | Explore, Asset Manager: ASSETS tree + map | `#explore?persona=asset` |
| 3 | Inspect condition and baseline | Asset details (single) / group details (whole group) | `#explore?asset=76503&persona=asset` |
| 4 | Find what's wrong | Trace Report (right rail) | same |
| 5 | Resolve gaps in context | Apply Cooper's fix, or My answer | same |
| 6 | Escalate what she can't fix | Leave the licence item open; dependent assets say so | same |
| 7 | Structured import | **Not built** (System Settings, no design) | — |

## Rebuilt to the frames (2026-11-18, after Shiny's review)
The first build didn't match the design: search was a generic dropdown, the tour dimmed it, and the tree and details were generic panels. Now:
- **Global Search (2:21957):** the NavBar search icon expands into a 600 px field. The dropdown has type chips with counts, Match: Any, a filter button, a preselected BEST MATCH row (pin tile, name, code with the match highlighted, detail line, status pill), OTHER MATCHES · n, and keyboard hints (↑↓, ↵, Tab cycles the type, Esc). The tour highlights the whole search and moves on by itself when the asset opens.
- **From search (9:64832):** Explore opens with the ASSETS panel closed, the query in the Explore search ("Pad-mount PM-0005 details"), and the bar in results mode ("1 / n results · All risk · ‹ › · Study area · ×").
- **ASSETS panel (9:64506):** "ASSETS 23" header, a tree | list switch, collapse and close; tree rows with caret, folder and a red / amber risk dot. It's opened from the map rail's Asset structure button. The list view has All risk / High / Moderate / Low.
- **Asset details (9:64904) and group details (9:65804):** 536 px, Details | Documentation | History, two columns. The left ASSET HIERARCHY column holds the attribute sections, or for a group the group's assets with risk dots. The right holds the collapsible RISK & CONDITION, LIFECYCLE (condition over time), IDENTITY / IDENTIFICATION and LOCATION & SITE sections.
- **Panels stack** (dev note 29:346563): with details and the Trace Report both open, the ASSETS panel steps aside (reopen it from the rail).

## What is assumed or not built `[Assumed]`
- Where search opens an asset (Figma: "Opens in the owning area", not designed): Explore with that asset's details.
- The hierarchy levels above the real asset groups (Alder Ridge Energy › Electrical › Transmission / Distribution / Substations).
- Questions 2 and 3 have only titles in Figma. Their text comes from the real data (the 5 Pine Ridge spans) and from Figma's leftover layer copy (the Verisk licence).
- The warning "132 values are not measured" is the pad-mounts' age-based condition (12 assets × 11 years). Figma's "468 values" / "71% vs 88%" copy belongs to other data.
- Resolving 1 of 3 shows 33% (the DS rule), not Figma's 35%.
- Not built: lasso / box selection, Cooper's "Opening details…" window, list view of the tree, Documentation and History tabs, structured import (step 7), and the Command coverage-gap entry (an alternative path).

## Relation to the first flow
The original tour (Command → Explore → Study → Idea) matches **J03** (Command → Explore → Study: lenses, horizon) plus **J06** (Create idea → Build). It is now titled "J03 + J06 · …". Differences still open: J03 and J06 are the Asset Manager's journeys while the tour uses the Investment Owner, and J03's System Confidence and Save study steps, plus J06's "sent to Build" toast and Idea Pad, aren't built (open question 20).

## Source mini flow (verbatim)
    LINKS
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=9-64501
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=9-13044
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=9-11634
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-345530
      https://www.figma.com/design/acAfLbn5qy49dNNMouadUR/?node-id=2-21957
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=9-79016
    
    TEXT
    J02 · Asset Data Ingestion & Validation
    Asset Manager  ·  Phase 1 — Asset Assessment & Strategy  ·  Journey status: Partial
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Asset Manager
    Job to be done | Import asset inventory, condition and age data, reconcile gaps and inconsistencies, and see each asset’s baseline condition, risk and service measures in context.  Source: Workflow_Asset_Assessment_and_Strategy.md — Asset Manager — Asset Data Ingestion & Validation
    Agentic re-frame | From ‘import, read error logs, reconcile by hand’ to ‘review the gaps Cooper surfaces in the Trace Report, accept or answer them, and browse assets on the map with context already applied’.
    Trigger | Cooper’s Trace Report flags open questions on the Demeter SS area (e.g. ‘5 spans have no clearance data’, a lapsed wildfire licence).
    Starting context | Priya (Asset Manager) opens Explore; role-based context shows assets first.
    Completed outcome | Data gaps for the study area are resolved, applied or explicitly accepted, and the asset’s baseline condition and risk are confirmed for downstream analysis.
    Product areas involved | Explore, Command, Global Search, System Settings (import governance)
    Journey status | Partial
    
    Use case (for design and testing)
    Priya searches ‘SUB-2210’ and jumps straight to Substation North A on the map. Selecting the Demeter SS cluster opens asset details; the Trace Report lists three open questions. One says flood extent binds the floor at 2 km; Cooper proposes swapping to First Street 30 m data and Priya applies it. Another flags that the Verisk FireLine licence lapsed, so wildfire numbers are eleven weeks old. Priya leaves that one open and notes it for the admin.
    Journey steps
    Evidence mix: Designed 5 · Specified 2 · Inferred 0 · Missing 0  (of 7 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Global Search (top bar) | Jump to a known asset | Types an asset code (e.g. SUB-2210); opens the best match | Best-match row with live state; opens the asset in the main canvas | Designed | Global Search and Notifications: Find a known item — Best match [2:21957] claude/PRD_Global_Search.md §5 Capabilities
    2 | Explore › Map (role-based context) | See assets in full context | Lands on the map with assets as primary context | Asset clusters, hierarchy tree and investments as a secondary layer | Designed | Explore: Investments panel — role-based context note [9:11634] Explore: Navigation — Hierarchy [9:13044]
    3 | Explore › Asset details | Inspect condition and baseline | Opens asset details from hierarchy, search or lasso | Single-asset or group details (e.g. ‘Demeter SS (8/8 assets selected)’) | Designed | Explore: Entry points to Asset details [9:64501] Explore: Dev note — multi-asset selection (lasso/box) [9:79016]
    4 | Explore › Trace Report | Find what is wrong or missing in the data | Opens Trace Report: Open questions / Warnings | List of data-quality items with Cooper-proposed fixes and % resolved | Designed | Explore: Trace Report — open questions / applied fix [29:345530]
    5 | Explore › Trace Report | Resolve gaps without leaving context | Applies Cooper’s fix (‘Swap to First Street, 30 m’) or adds own answer | Item marked APPLIED with undo; confidence updates | Designed | Explore: Trace Report — open questions / applied fix [29:345530]
    6 | Explore › Trace Report | Escalate what she cannot fix | Leaves the licence warning open (vendor-tier data) | Warning remains visible on dependent conclusions (degraded confidence stated) | Specified | Explore: Trace Report — open questions / applied fix [29:345530] claude/PRD_System_Settings.md §5.3 Data Marketplace
    7 | System Settings › Structured import | Bring new inspection/condition data in | — (bulk import handled by admin flow; Cooper validates and previews diff) | Imported data refreshes Explore layers | Specified | claude/PRD_System_Settings.md §5.4 Platform Configuration
    
    Alternatives and exception paths
    Cooper may surface a coverage-gap item in Command that deep-links into Explore with the area pre-framed (User Flow Explore board, ‘Frames the study’).
    Search ‘View all’ for Assets / Locations opens Explore with the query and filters applied.
    Definition of done
    The asset or area’s open data questions are applied, answered or deliberately left as warnings, and its baseline condition and risk are visible and trusted on the map.
    Design gaps, conflicts and blockers
    Asset Registry import results / error logs (workflow steps 1–2) have no Catalyst design; bulk import is specified only in System Settings (no Figma).
    Trace Report appears in Explore designs as a study panel; whether it also covers registry-level data quality (outside a study) is not designed.
    Asset Summary widgets (Condition, Baseline Risk, GIS) are not mapped to a designed Explore asset-details layout beyond the frames indexed.
    Validation questions
    Is data-quality reconciliation an Asset Manager job in Explore or an admin job in System Settings, or both?
    Which system is the record for corrections Priya makes in Explore (PRD_Explore Q8)?
    Sources cited in this journey
    Workflow_Asset_Assessment_and_Strategy.md
    Global Search and Notifications Handover › Find a known item — Best match [2:21957]
    claude/PRD_Global_Search.md §5 Capabilities
    Explore Handover › Investments panel — role-based context note [9:11634]
    Explore Handover › Navigation — Hierarchy [9:13044]
    Explore Handover › Entry points to Asset details [9:64501]
    Explore Handover › Dev note — multi-asset selection (lasso/box) [9:79016]
    Explore Handover › Trace Report — open questions / applied fix [29:345530]
    claude/PRD_System_Settings.md §5.3 Data Marketplace
    claude/PRD_System_Settings.md §5.4 Platform Configuration
