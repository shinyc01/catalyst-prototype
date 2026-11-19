# Flow: J08 · Build · Alternatives and forecast development

Tour: `app/flows/007-alternatives-forecast.js` · Persona: Investment Owner (Hollis Grant) · Figma spec: `context/screens/build-refine-j08-j09-figma-spec.md` · Logic: `context/logic/refine.md`

## The journey, verbatim (JTBD document J08)

    J08 · Alternatives & Forecast Development
    Investment Owner  ·  Phase 2 — Investment Identification & Proposal  ·  Journey status: Designed
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Investment Owner
    Job to be done | Define alternatives (repair vs replace vs defer), build cost forecasts and milestones for each, and set the recommended alternative.  Source: Workflow_Investment_Identification_and_Proposal.md — Investment Owner — Alternatives & Forecast Development
    Agentic re-frame | From ‘enter spend lines, generate UCM costs, set milestones’ to ‘review the alternatives and cost/schedule Cooper modelled, adjust by exception, and pick the recommendation’.
    Trigger | The idea was approved to proceed and is now an investment in Refine (J11 gate 0).
    Starting context | Jeff opens the investment in Build › Refine, usually from Command (Following or My works).
    Completed outcome | Alternatives compared, recommended alternative set, cost and schedule reviewed per alternative, and alternatives selected to go to Plan.
    Product areas involved | Build, Command
    Journey status | Designed
    
    Use case (for design and testing)
    Jeff opens Compare Alternatives: Full Replacement ($4.2M, 76% risk reduced, Recommended), Targeted Hardening ($2.6M, ~8 months, 5 of 7 high-risk feeders) and Reactive Repair ($0.6M). A reviewer comment questions the 3–5 year timeline. Cooper recommends ‘Refine Targeted Hardening Schedule’, and Jeff sets Targeted Hardening as recommended. He shifts dates on the Gantt, then excludes Reactive Repair from Plan.
    Journey steps
    Evidence mix: Designed 8 · Specified 0 · Inferred 0 · Missing 0  (of 8 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Command — Following / My works | Resume the investment | Clicks → on the card | Opens the investment in Build at Refine | Designed | Command: Following — Projects I Follow [26:65462] Command: Investment overview / System confidence (Command → Build) [26:72160]
    2 | Build › Refine — Compare Alternatives | See all options side by side | Reviews alternative cards and comparison chart; opens Cooper’s evaluation | Recommended badge, cost, risk reduced per alternative | Designed | Build: Compare Alternatives [48:59236]
    3 | Build › Comments | Respond to a reviewer’s concern | Opens comment (e.g. timeline viability) → ‘Shape with Cooper’ | Cooper proposes actions: recommended + 3 others | Designed | Command: Comment Focus — Action Required (Command → Build) [26:69635] Build: Comments — 'Shape with Cooper' [55:52663]
    4 | Build › Compare | Set the recommendation | Clicks ‘Set as recommended’ / Change recommended | Recommendation updated | Designed | Command: Comment Focus — Action Required (Command → Build) [26:69635] Build: Compare Alternatives [48:59236]
    5 | Build › Add / edit alternative | Add a missing option | Adds an alternative with Cooper or button; edits details with Cooper | New alternative modelled | Designed | Build: Compare Alternatives [48:59236] Build: Alternative Details — edit with Cooper [53:201387]
    6 | Build › Alternatives Cost & Schedule | Check costs and timing | Reviews table and Gantt; adjusts by %, shifts dates, Edit with Cooper | Spend lines and schedule update | Designed | Build: Alternatives Cost & Schedule — table [76:8792] Build: Alternatives Cost & Schedule — Gantt [96:80712]
    7 | Build › Investment Details — Dependencies | Capture dependencies | Reviews Cooper-linked dependent investments (value, timing, program) | Dependencies table with Cooper’s explanation | Designed | Build: Investment Details — Dependencies (Cooper-linked) [43:303888]
    8 | Build › Compare — select for Plan | Choose which alternatives go to Plan | ‘Remove from going to plan’ / ‘Hide from comparison’ | Excluded alternatives stay in the record | Designed | Build: Compare — 'Option 2' select alternatives to Plan [48:57677]
    
    Alternatives and exception paths
    Cost lines that need specialist estimation route to the Estimator (J10).
    Definition of done
    Each alternative has a reviewed cost and schedule, the recommended alternative is set, and the alternatives going to Plan are selected.
    Design gaps, conflicts and blockers
    ‘Select alternatives to Plan’ is labelled ‘Option 2’, so it may not be the final design.
    Multi-currency, exchange rates and inflation per spend line (workflow step 4) are not visible in indexed frames.
    Milestone dependencies between investments are shown as Cooper-linked dependencies; milestone authoring is not designed.
    ID mismatch in mockups (INV-2025-0842 header vs INV-2026-0418 details).
    Validation questions
    Is ‘Option 2’ (separate comparison from Plan selection) the chosen pattern?
