# Flow: J19 · Plan · Recommendation and hand-off

**Source:** JTBD journey **J19 — Portfolio Owner — Dashboard Reporting and Handoff Prep** (CPLF Product Management, JTBD Journeys; status "Specification only"). Tour: `app/flows/018-dashboard-handoff.js`. Persona: **Owen Fitch, Portfolio Owner**. Built 2026-11-20.

## What is built
Only the journey's **Designed** steps, on screens that already exist (no new UI):
1. Plan › Compare: select the final scenario (`#plan-compare?persona=portfolio&demo=reopt` resets the final plan).
2. Cooper's evaluation (the trade-offs, from the real results) and the Evidence chain.
3. Value › Overview (portfolio under the framework) and Capital Flow.
4. Send for approval → Plan › Approve (J21): the designed hand-off to the Capital Planning Manager and executives.

## Not built (no Figma)
- **Results › living dashboards** and the **Result Pack** (journey steps 2–3) are specified in the Results One-Pager only; Results has no Figma handover. Open question 76.

## Source mini flow (verbatim)
```
LINKS
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=84-108440
  https://www.figma.com/design/8VmjGH9Ihg8TFzDQiKTPpi/?node-id=2011-137249
  https://www.figma.com/design/8VmjGH9Ihg8TFzDQiKTPpi/?node-id=784-43771
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-55947

TEXT
J19 · Dashboard Reporting & Handoff Prep
Portfolio Owner  ·  Phase 6 — Execution & Monitoring  ·  Journey status: Specification only
Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
Journey summary
Persona | Portfolio Owner
Job to be done | Produce scenario comparison and C-suite/ESG views and package the recommended scenario with its trade-off analysis for the Capital Planning Manager.  Source: Workflow_Execution_and_Monitoring.md — Portfolio Owner — Dashboard Reporting & Handoff Prep
Agentic re-frame | From ‘regenerate dashboards and assemble a recommendation package’ to ‘curate the living dashboard and Result Pack Cooper drafts from the plan’s evidence chain’.
Trigger | Dana has selected a final scenario (J18) and must hand a recommendation to the Capital Planning Manager.
Starting context | Dana is in Plan Compare.
Completed outcome | A recommendation package (scenario + trade-offs + evidence) is available to the Capital Planning Manager.
Product areas involved | Plan, Results, Value
Journey status | Specification only

Use case (for design and testing)
Dana wants Tom Nguyen (Director of Capital Planning) to see why Max cost closes the wildfire gap. The Results spec has Cooper draft a Result Pack from the plan’s consolidated evidence chain, which Dana curates. Today’s designs hand over through Send for approval in Plan, where Tom is a reviewer in the Executive gate.
Journey steps
Evidence mix: Designed 3 · Specified 2 · Inferred 0 · Missing 0  (of 5 steps)
# | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
1 | Plan › Compare | Pick what to communicate | Selects final scenario | Final plan marked | Designed | Plan: Compare — Scenario comparison [85:55947]
2 | Results › Living dashboards | Show financial metrics and objective splits | Opens portfolio dashboard (always current) | Cooper annotates what moved and why | Specified | claude/Results_One_Pager.md — What Results entails
3 | Results › Result Pack | Package the recommendation | Reviews Cooper-drafted pack; curates; answers needs-you flags | Pack ready for sign-off | Specified | claude/Results_One_Pager.md — What Results entails
4 | Value › Overview / Capital Flow | Show strategy linkage | Uses framework Overview / Capital Flow views | Portfolio under this framework; capital flow Sankey | Designed | Strategy Framework: Overview — portfolio under framework [784:43771] Strategy Framework: Capital Flow — compare Sankey [2011:137249]
5 | Plan › Send for approval (actual designed hand-off) | Hand to the Capital Planning Manager | Sends final scenario for approval | Approval workspace with reviewers | Designed | Plan: Compare — Scenario comparison [85:55947] Plan: Approve — Executive gate [84:108440]

Alternatives and exception paths
No alternative paths are evidenced; none are invented here.
Definition of done
The Capital Planning Manager can open the recommended scenario with its trade-offs and evidence without the Portfolio Owner assembling a separate package.
Design gaps, conflicts and blockers
Results has no Figma handover in the Cyrano folder, so dashboards and Result Packs are specification only.
No Plan → Results navigation is designed; the 12 Screens storyline puts execution and value realization under a Plan › Execution tab instead of Results.
Persona hand-off conflict: User Flow has the Portfolio Manager send directly for approval, with no separate CPM consolidation step.
Validation questions
Is a separate ‘recommendation package’ still needed if approval happens on the scenario itself in Plan?
First Results audiences: regulator pack + Portfolio Owner dashboard (One-Pager recommendation) — confirm.
Sources cited in this journey
Workflow_Execution_and_Monitoring.md
Plan Handover › Compare — Scenario comparison [85:55947]
claude/Results_One_Pager.md — What Results entails
Strategy Framework Handover › Overview — portfolio under framework [784:43771]
Strategy Framework Handover › Capital Flow — compare Sankey [2011:137249]
Plan Handover › Approve — Executive gate [84:108440]

```
