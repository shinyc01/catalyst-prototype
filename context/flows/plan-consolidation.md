# Flow: J20 · Plan · Consolidation and sensitivities

**Source:** JTBD journey **J20 — Capital Planning Manager — Plan Consolidation and Narrative Development**. Tour: `app/flows/019-plan-consolidation.js`. Persona: **Kenji Mori, Director of Capital Planning** `[Added]` (new persona `cpm`; no Figma persona). Built 2026-11-20.

## Built
- Plan home (`#plan?persona=cpm&demo=final`: results in, final scenario chosen, not yet sent): portfolio tree, cycle progress, forecast vs budget (existing).
- **Cooper on Plan home** (journey step 2, Inferred): the prompts "What needs my attention?" and "Are we on track against strategy?" now answer in Cooper's window, from the real results (`planCooperAnswer` in `shared/plan-model.js`, `[Assumed]` wording), with "Open the comparison".
- Compare (sensitivities) and Send for approval (existing).

## Not built
- Results › Result Pack (regulator narrative) and living dashboards: no Figma (open question 76).
- Cross-portfolio roll-up: the data has one portfolio (Demo Portfolio); the tree's other portfolios have no plan data.

## Source mini flow (verbatim)
```
LINKS
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-177903
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-55947
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=84-290876
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=84-277329
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=84-108440

TEXT
J20 · Plan Consolidation & Narrative Development
Capital Planning Manager  ·  Phase 5 — Plan Development & Approval  ·  Journey status: Partial
Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
Journey summary
Persona | Capital Planning Manager
Job to be done | Consolidate portfolio recommendations into an enterprise view, compare scenarios across objectives, build the regulatory narrative with linked evidence, and run plan-level sensitivities.  Source: Workflow_Plan_Development_and_Approval.md — Capital Planning Manager — Plan Consolidation & Narrative Development
Agentic re-frame | From ‘roll up portfolios, compare in BI, wire a Report Builder narrative by hand’ to ‘review the enterprise plan and the narrative Cooper drafts from the consolidated evidence chain, and steer the sensitivities’.
Trigger | Portfolio Owners have selected final scenarios for their portfolios for FY27.
Starting context | Tom Nguyen (Director of Capital Planning) opens Plan Home.
Completed outcome | An enterprise-level draft plan with a curated narrative and sensitivity scenarios, ready to route through approval gates.
Product areas involved | Plan, Results, Command
Journey status | Partial

Use case (for design and testing)
Tom opens Plan Home and moves through the portfolio tree (Electrical Distribution, Transmission, Generation) to check each cycle’s progress. He asks Cooper ‘Are we on track against strategy?’ and compares a CAPEX-reduced scenario with the full-funded one. Per the Results spec, Cooper drafts the regulator narrative from the evidence chain and Tom curates it.
Journey steps
Evidence mix: Designed 3 · Specified 2 · Inferred 1 · Missing 0  (of 6 steps)
# | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
1 | Plan › Plan Home — portfolio tree | See every portfolio’s status | Browses portfolios and cycles; Portfolio view | Cycle progress per portfolio; totals | Designed | Plan: Plan Home — Electrical Distribution, FY27 'Time to Plan' [84:277329] Plan: Plan Home — Portfolio view [84:290876]
2 | Plan › Plan Home — Cooper | Check strategic alignment | Asks ‘Are we on track against strategy?’ / ‘What needs my attention?’ | Cooper answer (content not designed) | Inferred | Plan: Plan Home — Electrical Distribution, FY27 'Time to Plan' [84:277329]
3 | Plan › Compare | Run sensitivities | Creates or reviews CAPEX-reduced vs full-funded vs target-driven scenarios | Scenario cards and value comparison | Designed | Plan: Compare — Scenario comparison [85:55947] Plan: Setup — Create New Scenario (Cooper chat) [85:177903]
4 | Results › Result Pack | Build the regulatory narrative | Reviews Cooper-drafted narrative linked to investments, risk data and optimisation logic | Pack with needs-you flags | Specified | claude/Results_One_Pager.md — What Results entails
5 | Results › Living dashboards | Compare scenarios across objectives | Uses scenario comparison dashboards | Cooper-annotated dashboard | Specified | claude/Results_One_Pager.md — What Results entails
6 | Plan › Send for approval | Move to governance | Sends the enterprise plan for approval (J21) | Approval workspace | Designed | Plan: Approve — Executive gate [84:108440]

Alternatives and exception paths
No alternative paths are evidenced; none are invented here.
Definition of done
The consolidated plan, its sensitivity scenarios and a curated narrative exist and are ready to route through the gates.
Design gaps, conflicts and blockers
Capital Planning Manager is a non-target in Command v2 §3 (‘future gate-and-exception executive variant’) and has no persona section in any Figma file.
Enterprise roll-up across BUs (workflow step 1) is shown only as a portfolio tree; no cross-portfolio consolidation screen.
Results (Report Builder successor) has no Figma.
Validation questions
Does the Capital Planning Manager have a distinct Command variant, or use Plan Home as their home?
Sources cited in this journey
Workflow_Plan_Development_and_Approval.md
Plan Handover › Plan Home — Electrical Distribution, FY27 'Time to Plan' [84:277329]
Plan Handover › Plan Home — Portfolio view [84:290876]
Plan Handover › Compare — Scenario comparison [85:55947]
Plan Handover › Setup — Create New Scenario (Cooper chat) [85:177903]
claude/Results_One_Pager.md — What Results entails
Plan Handover › Approve — Executive gate [84:108440]

```
