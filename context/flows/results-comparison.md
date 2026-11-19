# Flow: J18 · Plan · Results analysis and scenario comparison

Tour: `app/flows/015-results-comparison.js` (deep link `#plan-compare?demo=optimized` starts with a finished run) · Persona: Portfolio Owner (Owen Fitch) · Figma spec: `context/screens/plan-j15-j18-j21-figma-spec.md` §3 · Logic: `context/logic/plan.md` → Compare (J18)

## The journey, verbatim (JTBD document J18)

    J18 · Results Analysis & Scenario Comparison
    Portfolio Owner  ·  Phase 4 — Portfolio Optimization  ·  Journey status: Designed
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Portfolio Owner
    Job to be done | Interpret optimisation results, compare scenarios (cost, risk, value, timing, GHG), understand what shifted and why, and select a recommended plan.  Source: Workflow_Execution_and_Monitoring.md — Portfolio Owner — Results Analysis & Scenario Comparison
    Agentic re-frame | From ‘toggle compare mode, filter waterfalls, open Scenario Viewer’ to ‘read Cooper’s evaluation of the scenarios, interrogate the evidence chain, and choose’.
    Trigger | Notification: optimisation finished for the FY27 scenarios.
    Starting context | Dana opens the notification or Plan Home (‘Compare results’).
    Completed outcome | A final scenario is selected with its trade-offs understood and evidence attached, ready to send for approval.
    Product areas involved | Notifications, Plan
    Journey status | Designed
    
    Use case (for design and testing)
    Compare shows Baseline $41.3M (‘leaves Wildfire gap open’, retained risk $11.0M) against Max cost $45.0M (‘closes the Wildfire gap’, retained risk $6.9M, 194 of 200 funded). Dana opens Cooper’s evaluation and asks ‘Why this scenario?’. The evidence chain asks whether the retained risk is acceptable and flags that the 12–18 month action window needs supporting evidence. She selects Max cost as the final plan.
    Journey steps
    Evidence mix: Designed 6 · Specified 0 · Inferred 0 · Missing 0  (of 6 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Notifications / Plan Home | Know results are ready | Opens the completion notification or ‘Compare results’ | Plan Compare opens | Designed | Plan: Optimizing — entry (badge + notification) [85:83781] Plan: Plan Home — Electrical Distribution, FY27 'Time to Plan' [84:277329]
    2 | Plan › Compare — Overview | See scenarios side by side | Reviews scenario cards (cost, funded, retained risk) and value comparison | Cards with ‘Select as final plan’ | Designed | Plan: Compare — Scenario comparison [85:55947]
    3 | Plan › Compare — Cooper’s evaluation | Get the expert read | Opens Cooper’s evaluation; asks ‘Why this scenario?’ / ‘Explain gaps in confidence’ | Narrative with trade-offs | Designed | Plan: Compare — Scenario comparison [85:55947]
    4 | Plan › Compare — Evidence chain | Check the reasoning behind the numbers | Reviews evidence items and open questions | Questions with solutions (e.g. ask field team) | Designed | Plan: Compare — Evidence chain [85:58438]
    5 | Plan › Compare — tabs | Drill into constraints and investments | Opens Value measures and constraints / Investments tabs; Scenario Details | Investment list for specific edits to alternative or start date | Designed | Plan: Compare — Scenario comparison [85:55947] Plan: Compare — Scenario Details [85:61393]
    6 | Plan › Compare | Choose | Select as final plan | Card marked Final plan; Send for approval enabled | Designed | Plan: Compare — Scenario comparison [85:55947]
    
    Alternatives and exception paths
    New scenario or exclude from comparison / choose another scenario.
    Risk-matrix animation, Gantt of shifts, value-by-start-date (Scenario Viewer) are not designed in Catalyst.
    Definition of done
    One scenario is marked final with Cooper’s evaluation and evidence reviewed, and the open evidence questions are answered or accepted.
    Design gaps, conflicts and blockers
    No designed Gantt of investment shifts, risk-matrix animation or GHG/decarbonisation view (workflow steps 4, 5, 7).
    Compare sub-sections (Exclude, Choose another, System Evidence) were indexed from layer names only.
    Validation questions
    Do detailed comparison views move to Results (Command v2 non-goals route ‘scenario comparison’ to Results)?
