# Flow: J15 · Plan · Planning groups and scenario setup

**Source:** JTBD journey **J15 — Portfolio Owner — Planning Group Assembly and Scenario Setup** (CPLF Product Management, JTBD Journeys). Tour: `app/flows/016-planning-group-setup.js`. Persona: **Owen Fitch, Portfolio Owner** (the journey's "Dana"). Built 2026-11-20 at Shiny's request ("build out the rest of the flows").

Frame specs: `screens/plan-setup-figma-spec.md` §4 (Planning groups), `screens/plan-j15-j18-j21-figma-spec.md` §2 (J15 deltas, Create New Scenario).

## Story `[Confluence]` journey, `[Whistler]` data, `[Added]` matches
Owen starts the planning cycle from Plan home (**Start planning**). On **Setup › Planning groups**, System confidence asks two questions Cooper found in the real Under Consideration list:
- **3 Neptune Station jobs form one programme** (`[Added]` match: P3772/P3773/P3774-14, "Extend capacity" of units 12, 9 and 21, all starting Jun 2028). Solutions as in Figma: **Create a group from this match** (Cooper's pick), **Move to “Required by management”**, **Leave them competing**.
- **Executive mandate cited for 2 investments** (`[Added]`: P9500-1 Primary SCADA system upgrade and P9912-1 Training & Change Management (SCADA upgrade)). Solutions: **Move to “Required by management”** (Cooper's pick) or **Leave them competing**.
The answer really moves the investments: the group list, counters, chart and the Scenarios tab's investment groups all follow; Undo on the applied card puts them back. A created group has a ⋯ menu (**Rename** inline, **Delete** = undo). Each group expands to its description and grouping principles (Figma text for Required by management; the others `[Added]`).

On **Scenarios**, **New scenario** opens Cooper's chat (Figma 85:177903). Cooper asks four questions with suggestion options (what to test; start from Optimized or fresh; how hard to hold the 2029 cap — quoting the real Optimized cap $437.8M and its 85 deferrals; may dates move further). It then shows "Analyzing context… / Building new scenario…", a skeleton row with Cooper's cursor, and adds the draft (e.g. **2029 cap cut 10%**: cap $437.8M → $394.0M, the changed cell in orange) at the top of the list.

## Steps and deep links
| # | J15 step | Where | Deep link |
|---|---|---|---|
| 1 | Know the cycle needs her | Command (Portfolio Owner) | `#command?persona=portfolio` |
| 2 | See the portfolio and cycle status | Plan home, "Time to Plan" | `#plan?persona=portfolio&demo=planning` (resets Plan) |
| 3 | Start the cycle | Start planning → Setup | `#plan-setup?persona=portfolio` |
| 4 | Put investments in the right groups | Setup › Planning groups + System confidence | `#plan-groups?persona=portfolio` |
| 5 | Define what to test | Setup › Scenarios › New scenario (Cooper chat) | `#plan-scenarios?persona=portfolio` |
| 6 | Anchor scenarios to strategy | The new draft row: copied constraints with the changed cap | same |

## Not built / assumed
- The Planning groups gate now has two questions, so Optimize waits for them too; tour 002 (J16) accepts Cooper's picks on the way.
- Figma's "1 / 7" list has seven questions; the five without a real basis in the data are not built (purchase orders, shared mobilisation, no signal, regulatory letter, no estimate basis).
- A Cooper-built scenario is a **draft in Setup**: the optimisation results are the real five scenarios, so it doesn't appear on Compare (open question 72).
- Constraints translated from strategic objectives (step 6) have no frame; the draft copies Optimized's strategic constraints unchanged.

## Source mini flow (verbatim)
```
LINKS
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=84-275329
  https://www.figma.com/design/U7AUNbrWHYuX3E0O4GbfEx/?node-id=103-63527
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=84-277329
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-162876
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-177903
  https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR/?node-id=26-62181
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-158974
  https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR/?node-id=26-73841
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-174964

TEXT
J15 · Planning Group Assembly & Scenario Setup
Portfolio Owner  ·  Phase 4 — Portfolio Optimization  ·  Journey status: Designed
Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
Journey summary
Persona | Portfolio Owner
Job to be done | Assemble the investments for the planning cycle into the right planning groups and set up named scenarios over the right fiscal range.  Source: Workflow_Portfolio_Optimization.md — Portfolio Owner — Planning Group Assembly & Scenario Setup
Agentic re-frame | From ‘browse the hierarchy, assign groups, create scenarios by hand’ to ‘review the groupings and scenarios Cooper has already set up, then steer the exceptions’.
Trigger | FY27 planning opens: Plan Home shows ‘Time to Plan’ for the next cycle.
Starting context | Dana (Portfolio Owner) opens Plan Home for Electrical Distribution.
Completed outcome | Planning groups confirmed and 2–3 scenarios defined for the FY27 cycle, ready for readiness checks and optimization.
Product areas involved | Command, Plan, Notifications
Journey status | Designed

Use case (for design and testing)
Plan Home shows FY27 as NEXT, ‘Time to Plan’. Dana clicks Start planning. On Planning groups, Cooper has spotted that ‘3 storm jobs form one programme’ and ‘Executive mandate cited for 2 investments’. Dana moves the mandated two to ‘Required by management’ and accepts the programme grouping. In Scenarios, Cooper asks what she wants to test and builds a capital-disciplined and a risk-max setup.
Journey steps
Evidence mix: Designed 6 · Specified 0 · Inferred 0 · Missing 0  (of 6 steps)
# | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
1 | Command — Portfolio Owner | Know the cycle needs her | Sees milestone/gate countdown and decision cards | Calendar milestone (e.g. SG2 window, 9d left) | Designed | Command: Command Center — Portfolio Owner (Dana) [26:73841] Command: Command Center — Investment Owner (Jeff) [26:62181]
2 | Plan › Plan Home | See the portfolio and cycle status | Reviews planning cycles (FY23–FY27), KPIs, cycle progress | FY27 ‘Time to Plan’ with Start/Continue planning | Designed | Plan: Plan Home — Electrical Distribution, FY27 'Time to Plan' [84:277329] Plan: Plan Home v1 (scenario library) [84:275329]
3 | Plan › Setup (entry) | Start the cycle | Clicks Start planning | Setup opens (Data readiness / Planning groups / Scenarios) | Designed | Plan: Setup — entry (Start / Continue planning) [85:174964]
4 | Plan › Setup — Planning groups | Put investments in the right groups | Reviews Cooper-detected groupings; moves items (e.g. to ‘Required by management’) | Groups updated; forced-in items stop competing for funding | Designed | Plan: Setup — Planning groups [85:158974]
5 | Plan › Setup — Scenarios | Define what to test | Opens Create New Scenario; answers Cooper’s questions | Cooper analyses/builds and adds scenario rows | Designed | Plan: Setup — Create New Scenario (Cooper chat) [85:177903] Plan: Setup — Scenarios [85:162876]
6 | Plan › Setup — Scenarios | Anchor scenarios to strategy | Reviews constraints Cooper translated from strategic objectives | Draft setups (capital-disciplined, risk-max, defer-tolerant) with needs-you where no target exists | Designed | User Flow: 12 Screens #8 — Send to Plan (constraints) [103:63527] Plan: Setup — Scenarios [85:162876]

Alternatives and exception paths
Ad hoc plans (e.g. ‘All Transformer Investments’) from Plan Home.
Global Search for portfolios/scenarios has no ‘View all’ into Plan (‘Plan has no search and filters yet’).
Definition of done
The cycle’s investments are grouped, and at least two scenarios with constraints exist and are ready to optimise.
Design gaps, conflicts and blockers
Scenario naming conventions / protecting critical scenarios (workflow step 3) not designed.
Command → Plan destination not prototyped.
Plan has no search & filters yet (Search dev note 2:24000).
Validation questions
Does Plan own the fiscal range / display settings, or System Settings planning calendar?
Sources cited in this journey
Workflow_Portfolio_Optimization.md
Command Handover › Command Center — Portfolio Owner (Dana) [26:73841]
Command Handover › Command Center — Investment Owner (Jeff) [26:62181]
Plan Handover › Plan Home — Electrical Distribution, FY27 'Time to Plan' [84:277329]
Plan Handover › Plan Home v1 (scenario library) [84:275329]
Plan Handover › Setup — entry (Start / Continue planning) [85:174964]
Plan Handover › Setup — Planning groups [85:158974]
Plan Handover › Setup — Create New Scenario (Cooper chat) [85:177903]
Plan Handover › Setup — Scenarios [85:162876]
User Flow › 12 Screens #8 — Send to Plan (constraints) [103:63527]

```
