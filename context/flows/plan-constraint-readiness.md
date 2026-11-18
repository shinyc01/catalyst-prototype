# Flow: Plan · Constraints and readiness before optimizing (J16)

**Source:** JTBD journey **J16 — Portfolio Owner — Constraint Definition and Pre-Optimization Validation** (CPLF Product Management, JTBD Journeys; Word document given by Shiny on 2026-11-18). Tour: `app/flows/002-plan-constraint-readiness.js`. Persona: **Owen Fitch, Portfolio Owner** (the journey's "Dana" is our invented Portfolio Owner).

Figma (from the document): https://www.figma.com/design/U7AUNbrWHYuX3E0O4GbfEx/?node-id=103-63527, https://www.figma.com/design/U7AUNbrWHYuX3E0O4GbfEx/?node-id=77-36753, https://www.figma.com/design/U7AUNbrWHYuX3E0O4GbfEx/?node-id=122-39936, https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-83781, https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-157926, https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-162876. Frame specs: `screens/plan-setup-figma-spec.md`, `screens/plan-scenarios-figma-spec.md`, `screens/plan-home-figma-spec.md`, and the user flow `flows/plan-portfolio-manager-userflow.md`.

## Story `[Confluence]` journey, `[Whistler]` data
Owen opens **Plan › Setup › Data readiness** for the **Demo Portfolio 2028 Plan** (296 real investments, North and South regions). Optimization readiness is 33%: 48 investments carry an inconsistency, and two scenario warnings are open.
- Cooper says 29 of the 48 are safe to ignore (studies with no cost yet). Owen clicks **Accept all**.
- 6 capital investments have $0 CAPEX: **Fix with Cooper** fills in the class median.
- 9 costs sit more than 95% below their class: **Leave out from this plan**.
- 4 have a negative value: Owen **sends them to their owners**, who fix them in Build (simulated: they come back after 6 seconds, each with a notification).
- On the **Warnings** tab, Owen relaxes Min CAPEX's $0 cap and lets start dates shift.
- On **Scenarios**, Owen checks each scenario's restrictions, constraints (edit, add with Cooper, delete) and investment groups.
- Readiness passes, Owen clicks **Optimize**. Plan home shows the cycle as Optimizing, the NavBar badge shows progress everywhere, and when the run finishes a notification links to the results.

## Steps and deep links
| # | J16 step | Where | Deep link |
|---|---|---|---|
| 1 | See how ready the portfolio is | Plan › Setup › Data readiness | `#plan-setup?persona=portfolio` |
| 2 | Clear low-stakes issues fast | System confidence: Accept all / Review individually / Upload file / My answer | same |
| 3 | Decide per problem investment | Table: Fix with Cooper / Leave out from this plan | same |
| 4 | Route to the owner | Table or panel: Send to owner → notification → fixed in Build `[Assumed]` | same |
| 5 | Confirm constraints per scenario | Plan › Setup › Scenarios | `#plan-scenarios?persona=portfolio` |
| 6 | Optimize | Optimize → Plan home "Optimizing", NavBar badge, progress | `#plan?persona=portfolio` |
| 7 | Get told when it finishes | Bell → notification → results | `#plan` |

The Planning groups tab is `#plan-groups` (its gate passes; J16 doesn't touch it).

## What is assumed or not designed `[Assumed]`
- The result of Accept all, Fix with Cooper, Leave out, and readiness passing aren't drawn in Figma. The prototype uses the DS System confidence "Applied" pattern and badges in the Solution column.
- "Review individually" filters the table to the inconsistencies instead of resolving the question.
- The routed fix: the owner's notification and Build landing aren't designed (J16 lists this as a gap). Fixes come back on their own after 6 s.
- The optimization run is a mock: it takes about 24 s, and its results are the real optimized scenarios (02_Optimized for Plan home). Edits to constraints don't change the results.
- Compare isn't built: "Compare results" shows a toast.

## Source mini flow (verbatim)
    J16 · Constraint Definition & Pre-Optimization Validation
    Portfolio Owner  ·  Phase 4 — Portfolio Optimization  ·  Journey status: Designed
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona
    Portfolio Owner
    Job to be done
    Configure constraints, define dependencies, confirm the data is optimisation-ready, apply fix/ignore policies in bulk, and get Investment Owners to fix what only they can fix.  Source: Workflow_Portfolio_Optimization.md — Portfolio Owner — Constraint Definition & Pre-Optimization Validation
    Agentic re-frame
    From ‘run Optimize Ready, read breach counts, apply policies, email owners’ to ‘accept Cooper’s safe-to-ignore and fix suggestions in bulk, route the rest to owners, and optimise when readiness passes’.
    Trigger
    Setup shows Optimization readiness at 35% with 47 investments carrying inconsistencies.
    Starting context
    Dana is in Plan › Setup › Data readiness.
    Completed outcome
    Readiness passes, routed fixes are back from owners, constraints are confirmed per scenario, and optimisation is running.
    Product areas involved
    Plan, Build, Notifications, Command
    Journey status
    Designed
    Use case (for design and testing)
    Cooper says ‘31 of 47 inconsistencies are safe to ignore — Cooper’s seen this pattern before.’ Dana clicks Accept all. For West Corridor Protection Relay Upgrade (‘Cost has no estimate basis’) she clicks Fix with Cooper. Ridgeview Village Backup Tie, costed 71% below its class, she leaves out of this plan. A remaining item is routed to its Investment Owner, who fixes it in Build. Readiness passes and Dana clicks Optimize.
    Journey steps
    Evidence mix: Designed 5 · Specified 2 · Inferred 0 · Missing 0  (of 7 steps)
    #
    Where (area / location)
    User goal
    User action
    System response / resulting state
    Evidence
    References
    1
    Plan › Setup — Data readiness
    See how ready the portfolio is
    Reviews KPIs (inconsistencies, outliers, cost at risk) and outlier scatter
    System confidence: optimisation readiness %
    Designed
    Plan: Setup — Data readiness (Fix with Cooper) [85:157926]
    claude/OptimizeReady_PortfolioOwner_Dashboard_Spec.md §5 Variant A (hybrid)
    2
    Plan › System confidence
    Clear low-stakes issues fast
    Accept all / Review individually / Upload file / My answer
    Safe-to-ignore issues cleared
    Designed
    Plan: Setup — Data readiness (Fix with Cooper) [85:157926]
    3
    Plan › Data readiness — per investment
    Decide per problem investment
    Fix with Cooper / Leave out from this plan
    Row resolved or excluded
    Designed
    Plan: Setup — Data readiness (Fix with Cooper) [85:157926]
    4
    Plan → Build (routed fix)
    Get the owner to fix what only they know
    Routes flagged investment to its owner
    Owner notified; fixes in Build
    Specified
    User Flow: End to end — Portfolio Manager: Plan [122:39936]
    User Flow: Flow — PLAN: Portfolio Manager [77:36753]
    claude/OptimizeReady_PortfolioOwner_Dashboard_Spec.md §5 Variant A (hybrid)
    5
    Plan › Setup — Scenarios / constraints
    Confirm constraints per scenario
    Reviews and edits constraints (add/edit/delete row)
    Constraint set per scenario
    Designed
    User Flow: 12 Screens #8 — Send to Plan (constraints) [103:63527]
    Plan: Setup — Scenarios [85:162876]
    6
    Plan › Optimize
    Run optimisation when ready
    Clicks Optimize
    Readiness check → Solving → Validating; Plan Home shows ‘Optimizing’
    Designed
    Plan: Optimizing — entry (badge + notification) [85:83781]
    7
    Notifications
    Get told when it finishes
    — notification links to results
    Badge disappears; notification posted
    Specified
    Plan: Optimizing — entry (badge + notification) [85:83781]
    claude/PRD_Notifications.md §5 The Solution
    Alternatives and exception paths
    Optimization fails (e.g. ‘1 of 5 scenarios failed’); Cooper suggests asking the Field Team Lead to confirm the action window or marking urgency as provisional.
    Optimize Ready Variant B (fully agentic decision queue) per spec §6.
    Definition of done
    Optimisation readiness passes, every flagged item is fixed, excluded or deliberately ignored, and optimisation is running on the defined scenarios.
    Design gaps, conflicts and blockers
    Milestone dependencies across the portfolio (workflow step 3) not designed in Plan.
    The routed-fix notification to the Investment Owner and its Build landing are not designed.
    Optimize Ready spec places entry on Scenario Planning / Portfolio Hierarchy toolbars; the Plan handover integrates it into Setup › Data readiness — confirm the spec is superseded.
    Validation questions
    Which Optimize Ready variant (A hybrid / B agentic) does Plan Setup implement?
    Sources cited in this journey
    Workflow_Portfolio_Optimization.md
    Plan Handover › Setup — Data readiness (Fix with Cooper) [85:157926]
    claude/OptimizeReady_PortfolioOwner_Dashboard_Spec.md §5 Variant A (hybrid)
    User Flow › End to end — Portfolio Manager: Plan [122:39936]
    User Flow › Flow — PLAN: Portfolio Manager [77:36753]
    User Flow › 12 Screens #8 — Send to Plan (constraints) [103:63527]
    Plan Handover › Setup — Scenarios [85:162876]
    Plan Handover › Optimizing — entry (badge + notification) [85:83781]
    claude/PRD_Notifications.md §5 The Solution
