# Flow: J05 · Explore · Predictive analytics results review

**Source:** JTBD journey **J05 — Asset Manager — Predictive Analytics: Results Review** (asked for by Shiny, 2026-11-18). Tour: `app/flows/005-results-review.js`. Persona: **Mara Delgado, Asset Manager**. Delta frame spec: `screens/explore-j05-figma-spec.md`. Logic: `logic/recommendations.md`.

## Story `[Confluence]` journey, `[Whistler]` data
Mara opens Explore and Cooper's window lists **5 recommendations** (Figma's 7 are placeholders). There's one for each real cluster investment that has assets at or past tolerance, grouped as Highest-risk items, Highest-value opportunities, Largest potential impact and Immediate review required.
1. She expands "2 of 3 transformer banks over tolerance — Alpine Meadows Station". It shows what's included (the worst asset marked Root), the three metrics (replacement cost $13.9M, risk reduced 80% if actioned, failure likelihood 55%) and what happens if no action is taken. The map dims everything else.
2. **Take me there** shows "Taking you there…" while the map flies in.
3. **Live signal** has three sections. Risk drivers shows the worst asset, its main driver and its failure-likelihood chart from the outlook. Affected areas shows the customers. Recent outages lists 3. The evidence chain gives the sources and Cooper's confidence.
4. **Create idea** shows the recommended intervention (the investment's real recommended alternative: Replace Transformer) and the 2 others, each with its cost, value score, timeline and risk reduced.
5. **Create idea** again sends the strategies to Build: a snackbar "3 strategies sent to Build for Alpine Meadows Station" with View in Build, and the chip drops to "4 risks surfaced".
6. She opens Vantage Bank 11, takes **View in Study** (a study on just that asset) and plays the horizon.

## Steps and deep links
| # | J05 step | Where | Deep link |
|---|---|---|---|
| 1 | See what Cooper found | Explore: the "N risks surfaced" chip → grouped list | `#explore-recs?persona=asset` |
| 2 | Locate the issue | Take me there → fly-in | same |
| 3 | Understand why now | Live signal: Risk drivers / Affected areas / Recent outages, evidence chain | same |
| 4 | Review intervention options | Create idea → Recommended intervention + Other interventions | same |
| 5 | Test against more context | View in Study → a study on the recommendation's assets | `#study?persona=asset` |
| 6 | Compare timing | Play the horizon | same |
| 7 | Decide what to act on | Create idea → sent to Build; the list updates | `#explore-recs?persona=asset` |

## Assumed or not built `[Assumed]`
- **The numbers are rules over real data** (`logic/recommendations.md`): risk reduced, failure likelihood, the emergency premium (+64%, Figma copy), and the evidence confidence.
- **The recent outages are invented by kind,** because the demo data has no outage history.
- **"View in Build"** opens the idea for the pad-mount program (the only investment with a Build screen); the others show a message.
- **Not built:** the Hierarchy impact branch (29:354216), the peer benchmark (shown as "not available"), and dismissing or "not now" (J05 lists it as not designed). The per-asset optimal-date charts (OID vs RID) and ArcGIS publishing have no design (J05 gaps).

## Source mini flow (verbatim)
    LINKS
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=9-33730
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-354522
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-357809
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-228366
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-351117
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-187620
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-352263
      https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-358931
    
    TEXT
    J05 · Predictive Analytics: Results Review
    Asset Manager  ·  Phase 1 — Asset Assessment & Strategy  ·  Journey status: Designed
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Asset Manager
    Job to be done | Review intervention results by asset, compare optimal versus recommended intervention dates and intervention types, read aggregate trends, and see the geographic risk distribution.  Source: Workflow_Asset_Assessment_and_Strategy.md — Asset Manager — Predictive Analytics: Results Review
    Agentic re-frame | From ‘run PA, then dig through result tabs and dashboards’ to ‘review the recommendations Cooper has already surfaced on the map, with risk drivers, impact and interventions explained’.
    Trigger | A load-forecast signal pushes West District assets past a critical condition threshold; Cooper surfaces ‘7 risks surfaced’.
    Starting context | Priya opens Explore; the Cooper panel is speaking with grouped recommendations.
    Completed outcome | Priya understands which assets need intervention, why now, and what the recommended intervention is, and has decided which recommendations to act on.
    Product areas involved | Explore, Command, Notifications
    Journey status | Designed
    
    Use case (for design and testing)
    Cooper opens with ‘I’ve surfaced 7 recommendations that need your attention’. The top one is 3 risky assets in West District: a $4.2M replacement that reduces risk by 31%, against a 62% failure likelihood. Clicking Northgate shows the risk driver, the Demeter SS → Recloser R-1 segment at 88% load spilling onto Feeders 12 and 17. Cooper’s recommended intervention is Full Replacement of 7 feeders: ~$4.2M, 9,400 customers protected, reliability risk 88% → 12%.
    Journey steps
    Evidence mix: Designed 7 · Specified 0 · Inferred 0 · Missing 0  (of 7 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Explore › Cooper Recommendations | See what Cooper found | Reviews grouped recommendations (risk, value, impact) | Cards with 3 backend-chosen metrics and ‘if no action’ consequences | Designed | Explore: Cooper — '7 risks surfaced' [29:352263] Explore: Cooper Recommendations — overview [29:351117]
    2 | Explore › Map | Locate the issue | ‘Take me there’ | Map flies to the asset group with a Cooper pin | Designed | Explore: Cooper — '7 risks surfaced' [29:352263]
    3 | Explore › Live Signal | Understand why now | Opens Risk drivers / Affected areas / Recent outages | Overloaded segment, load at risk, failure likelihood chart | Designed | Explore: Live Signal — Northgate risk drivers [29:354522] Explore: Select Assets — Live signal substation close-up [9:33730]
    4 | Explore › Investment draft | Review intervention options | Opens recommended intervention and ‘Other interventions (2)’ | Cost, value, timeline, risk reduced per intervention | Designed | Explore: Investment draft — recommended intervention [29:358931]
    5 | Explore › Study | Test the recommendation against more context | ‘View in Study’ | Study opens with lenses for the group | Designed | Explore: Live Signal — Northgate risk drivers [29:354522] Explore: Lens on — Demeter SS Study [29:187620]
    6 | Explore › Horizon | Compare timing | Plays horizon to see consequences of acting later | Timing delta on the lens panel | Designed | Explore: Lens — Horizon scrubber [29:228366] claude/Explore_Study_Lenses_Consolidated_Summary.md §4.4–4.5 Lens panel / Cooper
    7 | Explore › Recommendations list | Decide what to act on | Creates an idea for chosen items or returns to the list | List updates (‘6 recommendations…’) | Designed | Explore: Send to build — '3 strategies sent to Build' [29:357809]
    
    Alternatives and exception paths
    The same recommendation can arrive as a Command decision card (Northgate Cluster, source tag Explore).
    Strategy-alternative comparison dashboards (workflow step 6) are routed to Results, which has no designs.
    Definition of done
    Priya has reviewed the recommendation’s drivers and interventions and either created an idea from it or deliberately set it aside.
    Design gaps, conflicts and blockers
    No designed equivalent of OID vs RID per-asset charts, asset demographics or ArcGIS publication (workflow steps 2, 5, 7).
    Recommendation dismissal or ‘not now’ handling inside Explore is not shown.
    Validation questions
    Which three metrics does the backend choose per recommendation, and who governs that (dev note 29:357176)?
    Sources cited in this journey
    Workflow_Asset_Assessment_and_Strategy.md
    Explore Handover › Cooper — '7 risks surfaced' [29:352263]
    Explore Handover › Cooper Recommendations — overview [29:351117]
    Explore Handover › Live Signal — Northgate risk drivers [29:354522]
    Explore Handover › Select Assets — Live signal substation close-up [9:33730]
    Explore Handover › Investment draft — recommended intervention [29:358931]
    Explore Handover › Lens on — Demeter SS Study [29:187620]
    Explore Handover › Lens — Horizon scrubber [29:228366]
    claude/Explore_Study_Lenses_Consolidated_Summary.md §4.4–4.5 Lens panel / Cooper
    Explore Handover › Send to build — '3 strategies sent to Build' [29:357809]
