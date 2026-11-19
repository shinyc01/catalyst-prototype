# Flow: J21 · Plan · Approval workflow management

Tour: `app/flows/014-approval-workflow.js` · Persona: Portfolio Owner (Owen Fitch) standing in for the Capital Planning Manager · Figma spec: `context/screens/plan-j15-j18-j21-figma-spec.md` §4 · Logic: `context/logic/plan.md` → Approve

## The journey, verbatim (JTBD document J21)

    J21 · Approval Workflow Management
    Capital Planning Manager  ·  Phase 5 — Plan Development & Approval  ·  Journey status: Designed
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Capital Planning Manager
    Job to be done | Route the draft plan through technical, financial and executive gates, track approvals, manage comments and revisions, and finalise budget allocation.  Source: Workflow_Plan_Development_and_Approval.md — Capital Planning Manager — Approval Workflow Management
    Agentic re-frame | From ‘configure routing, chase reviewers, re-submit’ to ‘use preconfigured gates and recommended reviewers, nudge with one click, and fix revision requests in place’.
    Trigger | The final scenario was sent for approval from Plan Compare.
    Starting context | Tom is in Plan › Approve, or receives reviewer replies in Command Conversations.
    Completed outcome | All gates approved and the plan ready to publish as the budget baseline.
    Product areas involved | Plan, Command, Notifications
    Journey status | Designed
    
    Use case (for design and testing)
    ‘Approval · Max cost’ shows the Executive gate at 1/3: the CFO has approved, while the Director of Capital Planning and the COO are pending with comments asking for a clearer cost-range benchmark. A reviewer is swapped (Changed reviewer) and the Technical and Financial gates open. Once all three gates are approved, Publish becomes active.
    Journey steps
    Evidence mix: Designed 6 · Specified 0 · Inferred 0 · Missing 1  (of 7 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Plan › Approve — workspace | See where approval stands | Reviews gates (Executive / Technical / Financial) and reviewer statuses | Gate cards; reviewers preconfigured by admin per role and plan type | Designed | Plan: Approve — Executive gate [84:108440] Plan: Approve — Stakeholder types [84:115108]
    2 | Plan › Approve | Respond to reviewer comments | Reads comments (e.g. benchmark needed); addresses evidence | Comment thread per reviewer | Designed | Plan: Approve — Executive gate [84:108440]
    3 | Plan › Approve — Changed reviewer | Adjust who reviews | Changes a reviewer | Reviewer list updates | Designed | Plan: Approve — workspace (changed reviewer / all approved) [84:108435]
    4 | Command — Conversations | Chase slow approvers | Uses ‘Wait for reply’ bell / Push | Reviewer nudged (1/24h; auto day 3/5/7) | Designed | Command: Responses (Conversations) — Default [26:67077] Command: Dev note — push & reminder logic [26:70319]
    5 | Plan › Approve — Other gates opened | Progress through gates | Watches sequential gates unlock | Technical and Financial gates open | Designed | Plan: Approve — workspace (changed reviewer / all approved) [84:108435]
    6 | Plan › Approve — All approved | Finalise | Sees all gates approved; Publish enabled | Ready to publish (J23) | Designed | Plan: Approve — workspace (changed reviewer / all approved) [84:108435] Plan: Approved — Publish / Schedule [84:108890]
    7 | Plan › Budget allocation | Translate approved plan into spend authority per BU/year | — | No designed budget/spend-authority step | Missing | Workflow_Plan_Development_and_Approval.md claude/Study_Elimination_and_Core_Process_Map.md §5 Object paths / §5.5 compare & approve
    
    Alternatives and exception paths
    Revision requested → re-optimise or edit plan in Compare and re-send (User Flow Plan board ‘Edits plan’).
    Definition of done
    All three gates show Approved, comments are resolved, and Publish is enabled.
    Design gaps, conflicts and blockers
    Reviewer recommendation with reasoning (System Settings §5.2) is not visible in the Plan approval designs.
    No designed spend-authority / fund-release step (workflow step 4).
    Persona conflict: in Plan Approve, ‘Jeff Pauska (You)’ is the CFO, while in Command and Build Jeff is the Investment Owner.
    Validation questions
    Does the approver experience for a plan happen in Plan, in Command, or on mobile (Vision principle 6)?
