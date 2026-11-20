# Flow: J23 · Plan · Publish the baseline

**Source:** JTBD journey **J23 — Capital Planning Manager — Regulatory Filing and Plan Baseline**. Tour: `app/flows/021-filing-baseline.js`. Persona: **Kenji Mori** (`cpm`). Built 2026-11-20.

## Built
- Approve with every gate approved (`#plan-approve?persona=cpm&demo=approved`) → **Publish** now or schedule (J21's modal) → Plan home shows the cycle published / scheduled.
- **Owners informed** (journey step 5, Specified): on publish or schedule, a notification "Allocations released / scheduled" with the funded and deferred counts of the final scenario `[Assumed]`.

## Not built
- Results › regulator Result Pack, sign-off with a frozen provenance snapshot, and Word/PDF/Excel exports: no Figma (open question 76).
- Updating investments to the active plan (the user flow's system step) isn't visible in Build.

## Source mini flow (verbatim)
```
LINKS
  https://www.figma.com/design/U7AUNbrWHYuX3E0O4GbfEx/?node-id=122-39936
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=84-108890

TEXT
J23 · Regulatory Filing & Plan Baseline
Capital Planning Manager  ·  Phase 5 — Plan Development & Approval  ·  Journey status: Partial
Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
Journey summary
Persona | Capital Planning Manager
Job to be done | Prepare the regulatory filing package, promote the approved scenario to budget/execution baseline, and communicate allocations to everyone.  Source: Workflow_Plan_Development_and_Approval.md — Capital Planning Manager — Regulatory Filing & Plan Baseline
Agentic re-frame | From ‘export reports, change scenario type, email the release’ to ‘sign off the Cooper-drafted regulator pack, publish the plan on a schedule, and let the platform notify affected owners’.
Trigger | All approval gates passed (J21).
Starting context | Tom is in Plan › Approve with Publish enabled.
Completed outcome | Plan published as the active baseline at the scheduled time, regulator pack signed off with a frozen provenance snapshot, and owners informed.
Product areas involved | Plan, Results, Notifications, Command
Journey status | Partial

Use case (for design and testing)
Tom clicks Publish and schedules it for the first business day of the cycle; Plan Home then shows the FY27 card as ‘Ready v1’. Per the Results spec, Cooper drafts the regulator Result Pack: optimisation logic trail, risk assessments and cost-benefit evidence. Tom curates it and signs it off, which freezes the provenance snapshot.
Journey steps
Evidence mix: Designed 2 · Specified 3 · Inferred 0 · Missing 0  (of 5 steps)
# | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
1 | Plan › Approved — Publish | Make the plan the baseline | Clicks Publish; picks date/time; Schedule | Scheduled; Plan Home shows ‘Ready v1’ | Designed | Plan: Approved — Publish / Schedule [84:108890]
2 | Cooper / system | Update everything downstream | — system updates investments to reflect the active plan | Plan active; investments updated | Designed | User Flow: End to end — Portfolio Manager: Plan [122:39936]
3 | Results › Result Pack (regulator) | Prepare the filing | Reviews Cooper-drafted pack; curates; one-way sign-off | Provenance snapshot frozen | Specified | claude/Results_One_Pager.md — What Results entails
4 | Results › Export / publish | Deliver the filing | Exports Word/PDF/Excel with plan version and evidence links | Files carry as-of and evidence links | Specified | claude/Results_One_Pager.md — What Results entails
5 | Notifications / Command | Tell owners about allocations | — owners notified of plan release and changes | Notifications per owned/watched object | Specified | claude/PRD_Notifications.md §5 The Solution

Alternatives and exception paths
No alternative paths are evidenced; none are invented here.
Definition of done
The approved plan is scheduled or active as the baseline, the regulator pack is signed off, and affected owners have been notified.
Design gaps, conflicts and blockers
No Results design for regulator packs or exports.
Plan release notification to all personas is not designed.
Scenario type progression (Budget → EarnedValueBudget) is not visible in Catalyst; Publish replaces it — confirm.
Validation questions
Is the regulator pack produced in Results, or as part of Plan Approve?
Sources cited in this journey
Workflow_Plan_Development_and_Approval.md
Plan Handover › Approved — Publish / Schedule [84:108890]
User Flow › End to end — Portfolio Manager: Plan [122:39936]
claude/Results_One_Pager.md — What Results entails
claude/PRD_Notifications.md §5 The Solution

```
