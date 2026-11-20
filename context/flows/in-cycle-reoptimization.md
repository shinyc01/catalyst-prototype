# Flow: J17 · Plan · In-cycle re-optimization

**Source:** JTBD journey **J17 — Portfolio Owner — In-Cycle Re-Optimization** (CPLF Product Management, JTBD Journeys). Tour: `app/flows/017-in-cycle-reoptimization.js`. Persona: **Owen Fitch, Portfolio Owner**. Built 2026-11-20.

Figma: Compare — Re-Optimize via Cooper `85:75447` (frames `85:75452` … `85:83439`; canvas note "Trigger cooper, cooper asks user what kind of scenarios they want to run + a few suggestions … once cooper gets enough info, cooper puts together the setting and present them as in set up"). See `screens/plan-compare-figma-spec.md` §1.

## Story `[Confluence]` journey, `[Whistler]` data
- **Command:** the decision "Approve re-optimized plan · 05_Re-Optimized Plan" (and the My works card "Re-optimization — CAPEX 2028") open **Plan › Compare** with the run's results (`#plan-compare?persona=portfolio&demo=reopt`). Before, they only showed a toast.
- **Compare:** each scenario card's ↻ button opens Cooper's **Re-optimize · <scenario>** chat (Figma copy): what to change (Reduce retained risk / Test a 5% lower budget / See what more funding could unlock), then "Planning groups and constraints": Keep them the same / Let Cooper adjust them.
- **Setup:** Cooper moves to Setup › Scenarios, which shows only the draft (skeleton + Cooper's cursor, then the draft with the changed caps in orange). The header is **Cancel / Optimize** (Figma `85:83138`).
- **Run:** Optimize returns to Compare; a loading card fills after about 10 s `[Assumed]`. The result is the **real "05_Re-Optimized Plan"** (Whistler's re-run with the latest actuals): $4.24B CAPEX, value 16.0M, 96 deferred, 103 brought forward, 109 alternatives changed. The card is named "<scenario> re-optimized" and says what was asked.
- **Adopt:** Select as final plan → a notification "Cooper revised the schedule of 199 investments … owners are notified in Build" `[Assumed]`; Send for approval continues as J21.

## Not built / assumed
- The result is the same real re-optimized plan whatever was asked (open question 74). "−5% budget" or "lower risk" don't change the numbers.
- The executing-plan base (actuals as the new base, excluding executing investments) has no design.
- Notifying owners is a Plan notification only; Build doesn't show the change per investment.

## Source mini flow (verbatim)
```
LINKS
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-75447
  https://www.figma.com/design/acAfLbn5qy49dNNMouadUR/?node-id=2-118507
  https://www.figma.com/design/U7AUNbrWHYuX3E0O4GbfEx/?node-id=200-79
  https://www.figma.com/design/U7AUNbrWHYuX3E0O4GbfEx/?node-id=122-39936
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=84-108440
  https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR/?node-id=26-73853
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-55947
  https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR/?node-id=26-74153
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-83781

TEXT
J17 · In-Cycle Re-Optimization
Portfolio Owner  ·  Phase 4/6 — Portfolio Optimization; Execution & Monitoring  ·  Journey status: Partial
Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
Journey summary
Persona | Portfolio Owner
Job to be done | When actuals or conditions change mid-cycle, re-run optimisation on what is still movable, compare against the execution baseline, and communicate plan changes.  Source: Workflow_Portfolio_Optimization.md — Portfolio Owner — In-Cycle Re-Optimization (also in Workflow_Execution_and_Monitoring.md)
Agentic re-frame | From ‘open a 4-step optimisation wizard and configure every setting’ to ‘tell Cooper what has changed, review the re-optimised draft it proposes, and approve or adjust’.
Trigger | Cooper re-ran the CAPEX 2027 draft after actuals moved; Dana’s Command shows ‘Approve drafted re-optimization · CAPEX 2027’.
Starting context | Dana is in Command.
Completed outcome | A re-optimised scenario is compared with the baseline and adopted (or rejected), and affected owners are informed.
Product areas involved | Command, Plan, Notifications, Build
Journey status | Partial

Use case (for design and testing)
Dana’s decision queue shows ‘Approve drafted re-optimization · CAPEX 2027’. She opens Plan Compare and clicks Re-optimize. Cooper asks what kind of scenarios she wants and suggests a few. She picks one; Cooper sets it up and runs it. Afterwards the radar and forecast charts show constraint recovery. She selects the re-optimised scenario as the final plan.
Journey steps
Evidence mix: Designed 5 · Specified 1 · Inferred 0 · Missing 1  (of 7 steps)
# | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
1 | Command — Portfolio Owner Decisions | See that a re-optimisation is waiting | Reviews the decision card | Card tagged Plan/Build | Designed | Command: Portfolio Owner — Decisions (re-optimization, emergency funding) [26:74153] Command: Portfolio Owner — My Works (Re-optimization CAPEX 2027) [26:73853]
2 | Command → Plan | Open the scenario | Clicks → | Plan Compare opens | Missing | User Flow: Flow — COMMAND: All users [200:79] claude/PRD_Command_Center_full_v2.md §6 Path Scenarios
3 | Plan › Compare — Re-Optimize | Re-run on what is movable | Hover → Cooper chat: states what changed; picks a suggested scenario type | Cooper assembles settings as in Setup and runs | Designed | Plan: Compare — Re-Optimize via Cooper [85:75447]
4 | Plan › Optimizing | Track the run | Watches progress (readiness → solving → validating) | Results populate as they arrive | Designed | Plan: Optimizing — entry (badge + notification) [85:83781]
5 | Plan › Compare | Compare against the baseline | Compares re-optimised vs current scenario | Value comparison, retained risk, funded counts | Designed | Plan: Compare — Scenario comparison [85:55947]
6 | Plan › Compare | Adopt the change | Select as final plan → Send for approval if material | Approval routed (J21/J22) | Designed | Plan: Compare — Scenario comparison [85:55947] Plan: Approve — Executive gate [84:108440]
7 | Notifications / Build (owners) | Tell affected Investment Owners | — system updates investments; owners see changes | ‘Cooper revised the schedule’ type notifications | Specified | User Flow: End to end — Portfolio Manager: Plan [122:39936] Global Search and Notifications: All card states [2:118507]

Alternatives and exception paths
Executing-plan scenario with actuals as the new base, and excluding already-executing investments (workflow steps 1–2) — not designed.
Definition of done
A re-optimised scenario has been compared and either adopted (and approved if needed) or deliberately rejected, and owners of changed investments are informed.
Design gaps, conflicts and blockers
No designed ‘executing plan’ / EarnedValueBudget scenario view or actuals import into Plan.
Command → Plan destination is not prototyped.
Variance-threshold-triggered re-plan (Results outcome tracking) is specified only in the Results One-Pager.
Validation questions
Who owns outcome tracking that triggers re-planning: Results or Plan (Results One-Pager open question)?
Sources cited in this journey
Workflow_Portfolio_Optimization.md
Command Handover › Portfolio Owner — Decisions (re-optimization, emergency funding) [26:74153]
Command Handover › Portfolio Owner — My Works (Re-optimization CAPEX 2027) [26:73853]
User Flow › Flow — COMMAND: All users [200:79]
claude/PRD_Command_Center_full_v2.md §6 Path Scenarios
Plan Handover › Compare — Re-Optimize via Cooper [85:75447]
Plan Handover › Optimizing — entry (badge + notification) [85:83781]
Plan Handover › Compare — Scenario comparison [85:55947]
Plan Handover › Approve — Executive gate [84:108440]
User Flow › End to end — Portfolio Manager: Plan [122:39936]
Global Search and Notifications Handover › All card states [2:118507]

```
