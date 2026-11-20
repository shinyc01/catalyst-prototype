# Flow: J22 · Plan · Executive review and approval

**Source:** JTBD journey **J22 — CFO / VP Planning — Executive Review and Plan Approval**. Tour: `app/flows/020-executive-approval.js`. Persona: **Theo Marsh, CFO** `[Added]` (new persona `cfo`; already the CFO reviewer in J21's Executive gate). Built 2026-11-20.

## Built
- **Command (CFO):** the decision "Approve the capital plan · 2028 Plan" first (`[Added]`), then the Portfolio Owner's plan decisions. It opens `#plan-approve?persona=cfo&demo=approval`.
- **Approve as the CFO:** the CFO's row says "(You)"; the header has **Decide** (DS SplitButton: Approve / Request changes, as Build's reviewer Decide) → a modal with a comment (required for Request changes). The row turns Approved (or Revisions) with the comment, and a notification records it. Figma has no action frames (journey gap), so the pattern is `[Assumed]`.
- **Cooper:** "Compare to peer" / "Compare to best practice" answer in Cooper's window. Peer data isn't in the demo data, so the peer answer says so and compares within the plan `[Assumed]`.
- **Evidence on demand:** "Open the comparison" on Approve goes to Compare.

## Not built
- Results C-suite dashboard (no Figma). Executive attestation and approval limits (not designed).

## Source mini flow (verbatim)
```
LINKS
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-58438
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-55947
  https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=84-108440
  https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR/?node-id=26-70319

TEXT
J22 · Executive Review & Plan Approval
CFO / VP Planning  ·  Phase 5 — Plan Development & Approval  ·  Journey status: Partial
Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
Journey summary
Persona | CFO / VP Planning
Job to be done | Review portfolio KPIs and risk mitigation across scenarios, approve the capital plan at the executive gate, and authorise material revisions.  Source: Workflow_Plan_Development_and_Approval.md — CFO / VP Planning — Executive Review & Plan Approval
Agentic re-frame | From ‘review dashboards, then approve in a workflow inbox’ to ‘review a clean executive narrative of the recommended scenario, pull evidence on demand, and approve in place’.
Trigger | The plan reaches the Executive gate; a notification and a Command decision card arrive.
Starting context | The CFO opens the approval request.
Completed outcome | Executive approval recorded (with comment), or revision requested.
Product areas involved | Notifications, Command, Plan, Results
Journey status | Partial

Use case (for design and testing)
The CFO opens ‘Approval · Max cost’: $41.2M, retained risk $8.4M (lowest of 3), 186 of 200 investments funded, 14 deferred. They ask Cooper to ‘Compare to peer’, check the scenario’s retained risk against the reduced-CAPEX alternative, and approve. Their approval shows first in the Executive gate.
Journey steps
Evidence mix: Designed 4 · Specified 2 · Inferred 0 · Missing 0  (of 6 steps)
# | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
1 | Notifications / Command | Know a decision awaits | Opens the approval notification or decision card | Deep link to approval | Specified | claude/PRD_Notifications.md §5 The Solution Command: Dev note — push & reminder logic [26:70319]
2 | Plan › Approve — Executive gate | See the decision in one view | Reviews cost, retained risk, investments funded/deferred | Executive summary on the gate | Designed | Plan: Approve — Executive gate [84:108440]
3 | Plan › Approve — Cooper | Pressure-test the recommendation | ‘Compare to peer’ / ‘Compare to best practice’ | Cooper answer | Designed | Plan: Approve — Executive gate [84:108440]
4 | Plan › Compare (evidence on demand) | Check risk mitigation across scenarios | Opens scenario comparison / evidence chain | Retained risk per scenario | Designed | Plan: Compare — Scenario comparison [85:55947] Plan: Compare — Evidence chain [85:58438]
5 | Plan › Approve | Decide | Approves (or comments / requests changes) | Status Approved; gate count advances | Designed | Plan: Approve — Executive gate [84:108440]
6 | Results › C-suite dashboard | Portfolio KPIs and strategic objective split | — | Specified only (living dashboards, audience lenses) | Specified | claude/Results_One_Pager.md — What Results entails

Alternatives and exception paths
Authorise material in-cycle revisions (J17 approval), same gate pattern.
Definition of done
The executive gate shows the CFO’s decision with an attached comment, visible to all reviewers.
Design gaps, conflicts and blockers
CFO/VP is a non-target in Command v2; no executive Command variant is designed.
Reviewer action controls (approve / request changes) are visible only as statuses in indexed frames; the action frames (‘Stakeholders › Actions’) were not rendered.
Executive attestation and approval limits (workflow step 3) are not shown.
Validation questions
Should executive approval be mobile-first (‘Mobile is for decisions’)?
Sources cited in this journey
Workflow_Plan_Development_and_Approval.md
claude/PRD_Notifications.md §5 The Solution
Command Handover › Dev note — push & reminder logic [26:70319]
Plan Handover › Approve — Executive gate [84:108440]
Plan Handover › Compare — Scenario comparison [85:55947]
Plan Handover › Compare — Evidence chain [85:58438]
claude/Results_One_Pager.md — What Results entails

```
