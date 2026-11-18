# Flow: J03 · Explore · Condition assessment and risk scoring

**Source:** JTBD journey **J03 — Asset Manager — Condition Assessment and Risk Scoring** (chosen by Claude as the next Asset Manager journey, 2026-11-18). Tour: `app/flows/004-condition-risk-study.js`. Persona: **Mara Delgado, Asset Manager** (the journey's "Priya"). Delta frame spec: `screens/study-j03-figma-spec.md`; existing Study spec: `screens/study.md`.

## Story `[Confluence]` journey, `[Whistler]` data
Mara opens Cooper's #1 decision (the Alpine Meadows cluster) and lands in Explore with assets first. In the hierarchy she selects **Alpine Meadows**, the 12 pad-mount transformers, and clicks **Study area**. The study covers exactly that group: risk score, value at stake, at-risk assets and threshold year against condition alone. She switches lenses, opens the Flood Risk lens and its source, and plays the horizon. On **System Confidence** the study reads 86% (Review): one open question (the flood data) and one warning (estimated condition). She applies "Swap to First Street, 30 m" and confidence rises to 92%. **Create idea ▾ → Save study** saves it, and "View in Study Library" opens the library with the new study on top.

## Steps and deep links
| # | J03 step | Where | Deep link |
|---|---|---|---|
| 1 | See which assets need a decision | Command (Asset Manager), Decisions | `#command?persona=asset` |
| 2 | Open the flagged item in context | Card → Explore (assets first) | `#explore?persona=asset` |
| 3 | Start a study on the right population | Hierarchy group → Study area; also the search results bar's Study area, the Studies library, or the rail's Study icon with nothing selected | `#study?persona=asset` |
| 4–6 | Risk vs tolerance, steer lenses and sources, play the horizon | Study › Lenses (existing) | same |
| 7 | Check how far to trust the score | Study › System Confidence | same |
| 8 | Keep the work | Create idea ▾ → Save study → Alert → View in Study Library | same |

## What changed in the app
- **A study has a population.** The risk model takes the study's asset ids (`study(lenses, year, ids)`), so every number covers only that group. The whole cluster is still the default (the J03 + J06 tour is unchanged).
- **Map rail, as in Figma:** 1 = Asset structure, 2 = Studies library, 3 = Study. It used to be shifted by one.
- **System Confidence tab** (it was an empty state): the DS EvidenceStrength bar, then the open questions and warnings that affect the study's assets. These are the same items as Explore's Trace Report, so a fix in either place shows in both.
- **Create idea ▾** has one item, **Save study** (Figma). The old "Create idea with Cooper / Create blank idea" items weren't in Figma.
- **Studies library:** a left panel with "STUDIES n" and rows "name · N assets · time". Hover shows rename (inline field, ✓ / ×) and delete (Modal → "The study has been removed" + Undo). Clicking a row opens the study with its population, lenses, sources and year. Saving again overwrites it ("Study saved to library").

## Assumed `[Assumed]`
- **Seed studies:** the library starts with one study per real asset group plus the whole cluster. The pad-mount group is left out, so the tour saves a new one. The Figma names ("Demeter Station", 108 studies) are placeholders.
- **Confidence:** 96% minus 6 points per open question and 4 per open warning that affects the study's assets. Figma shows only 87% with no rule.
- **What a saved study keeps:** the population, the lens set (on / source) and the horizon year.
- **The rail's Study icon with nothing selected** opens the whole-cluster study.
- **Not built:**
  - **Horizon to 2045** (the data runs to 2036);
  - **lasso entry** and **the lens-column collapse**;
  - the alternatives "raise a risk" and "save as a watch" (Specified only).

## Source mini flow (verbatim)
    LINKS
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-191921
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-345530
      https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR/?node-id=26-63249
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-228366
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-216872
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-101050
      https://www.figma.com/design/U7AUNbrWHYuX3E0O4GbfEx/?node-id=200-79
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-226290
      https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR/?node-id=26-72978
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-239507
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-187620
    
    TEXT
    J03 · Condition Assessment & Risk Scoring
    Asset Manager  ·  Phase 1 — Asset Assessment & Strategy  ·  Journey status: Designed
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Asset Manager
    Job to be done | Rate asset health, score risk (PoF × CoF) with the value framework, maintain risk associations, and see how baseline risk develops over time across the fleet.  Source: Workflow_Asset_Assessment_and_Strategy.md — Asset Manager — Condition Assessment & Risk Scoring
    Agentic re-frame | From ‘apply frameworks and score each asset manually’ to ‘open a study where Cooper has pre-applied relevant lenses, read the deltas, and steer which factors count’.
    Trigger | A load-forecast signal pushes a substation’s risk up; Cooper surfaces ‘Demeter Station — critical condition’ among its recommendations.
    Starting context | Priya is in Explore with the Cooper recommendations list open.
    Completed outcome | A saved study for the asset group with agreed lenses, risk score versus tolerance, and threshold year, stored in the Study Library for reuse.
    Product areas involved | Explore, Command
    Journey status | Designed
    
    Use case (for design and testing)
    Priya enters a study on Demeter SS. Base condition alone crosses the 415 tolerance in 2039. Turning on Extreme Heat, Flood Risk and Oil Containment lifts the risk score from 458 to 600 and pulls the threshold year forward to 2032, with 6 of 8 assets at risk. She checks the flood lens source (FEMA), plays the horizon scrubber to 2045, and saves the study.
    Journey steps
    Evidence mix: Designed 7 · Specified 0 · Inferred 0 · Missing 1  (of 8 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Command — Asset Manager Decisions | See which assets need a decision | Reviews ranked decision cards with Health index / Risk score | Cards tagged by source (Explore/Build/Plan) | Designed | Command: Asset Manager — Decisions (Health index / Risk score) [26:72978] claude/PRD_Command_Center_full_v2.md §5 The Solution (responsibility model, anatomy, persona parameterization)
    2 | Command → Explore | Open the flagged item in context | Clicks → on a card | Explore opens on the flagged asset | Missing | User Flow: Flow — COMMAND: All users [200:79] Command: Decisions — Default + Dev Notes [26:63249]
    3 | Explore › Enter study | Start a study on the right population | Enters study via hierarchy, lasso, search/filter, study library or no-selection | Study panel opens (e.g. ‘Demeter SS Study’) | Designed | Explore: Enter study — five entry routes [29:191921]
    4 | Explore › Lens panel | Understand risk versus tolerance | Reviews Lenses tab: risk score, value at stake, at-risk assets, threshold year | Delta cards versus baseline; risk bar against tolerance; contribution by lens | Designed | Explore: Lens on — Demeter SS Study [29:187620] claude/Explore_Study_Lenses_Consolidated_Summary.md §4.4–4.5 Lens panel / Cooper
    5 | Explore › Lens panel | Steer which factors count | Toggles custom lenses on/off; includes or excludes from aggregation; changes a lens source | Scores recalculate; source citation updates | Designed | Explore: Lens on — Demeter SS Study [29:187620] Explore: Lens — Change source for a lens [29:226290] Explore: Lens — Add Lens [29:216872]
    6 | Explore › Horizon | See how risk develops over time | Plays the horizon scrubber (2026 → 2045) | Map and KPIs animate across years | Designed | Explore: Lens — Horizon scrubber [29:228366] claude/Explore_Context_Layers_Exposure_Lens_Feature_Definition.md §1.1 / §7 Horizons
    7 | Explore › System Confidence tab | Check how much to trust the score | Opens System Confidence / Trace Report | Open questions and warnings for this study | Designed | Explore: Lens on — Demeter SS Study [29:187620] Explore: Trace Report — open questions / applied fix [29:345530]
    8 | Explore › Save study | Keep the work for review and reuse | Create idea ▾ → Save study | Toast ‘Saved to Study Library’ with View in Study Library | Designed | Explore: Save study → Study Library [29:239507] Explore: Studies Library — open / edit / save [29:101050]
    
    Alternatives and exception paths
    Raise a risk into Risk Manager (Explore exit ‘raise a risk’) — Specified only (Feature Definition §8.3).
    Save as a watch so Command delivers future changes (‘Explore defines; Command Center delivers’) — Specified only.
    Definition of done
    A named study exists in the Study Library with the agreed lenses, a risk score against tolerance and a threshold year that Priya trusts.
    Design gaps, conflicts and blockers
    The Command → Explore destination is not prototyped; only Command → Build frames exist.
    Risk Register association (workflow step 3) and fleet-level risk dashboards (step 4) have no Catalyst designs; Results holds dashboards (One-Pager) but has no Figma.
    The PRD’s flagship wildfire lens is not among the designed lenses (Flood, Extreme Heat, Oil Containment, Critical Habitat).
    Validation questions
    Does a lens modify inside or beside the value framework (PRD_Explore Q1)?
    Is the Risk Register a separate destination or absorbed as Explore’s Risks entity context (24 Aug direction §3)?
    Sources cited in this journey
    Workflow_Asset_Assessment_and_Strategy.md
    Command Handover › Asset Manager — Decisions (Health index / Risk score) [26:72978]
    claude/PRD_Command_Center_full_v2.md §5 The Solution (responsibility model, anatomy, persona parameterization)
    User Flow › Flow — COMMAND: All users [200:79]
    Command Handover › Decisions — Default + Dev Notes [26:63249]
    Explore Handover › Enter study — five entry routes [29:191921]
    Explore Handover › Lens on — Demeter SS Study [29:187620]
    claude/Explore_Study_Lenses_Consolidated_Summary.md §4.4–4.5 Lens panel / Cooper
    Explore Handover › Lens — Change source for a lens [29:226290]
    Explore Handover › Lens — Add Lens [29:216872]
    Explore Handover › Lens — Horizon scrubber [29:228366]
    claude/Explore_Context_Layers_Exposure_Lens_Feature_Definition.md §1.1 / §7 Horizons
    Explore Handover › Trace Report — open questions / applied fix [29:345530]
    Explore Handover › Save study → Study Library [29:239507]
    Explore Handover › Studies Library — open / edit / save [29:101050]
