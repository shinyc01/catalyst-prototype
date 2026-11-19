# Flow: J13 · Value · Framework validation, approval and handoff

Tour: `app/flows/010-framework-validation.js` · Persona: CX Consultant (Ines Calder) · Figma spec: `context/screens/value-j12-j14-figma-spec.md` · Logic: `context/logic/value.md`

## The journey, verbatim (JTBD document J13)

    J13 · Framework Validation, Import & Handoff
    CX Consultant  ·  Phase 3 — Value Framework & Modeling  ·  Journey status: Partial
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | CX Consultant
    Job to be done | Validate and test the framework, move it into the client instance, walk stakeholders through it, and publish a version so Investment Owners can score against it.  Source: Workflow_Value_Framework_and_Modeling.md — CX Consultant — Validation, Import & Handoff
    Agentic re-frame | From ‘run validation reports, export YAML, import and resolve conflicts’ to ‘review Cooper’s automated checks and portfolio-impact preview, send for approval, and schedule publication’.
    Trigger | The draft framework (J12) is shaped and the consultant wants it live for the next cycle.
    Starting context | The consultant opens the draft framework in Value.
    Completed outcome | The framework is approved by all approvers and scheduled to publish; Investment Owners score against it from the publish date.
    Product areas involved | Value, Notifications, Command, Build, Plan
    Journey status | Partial
    
    Use case (for design and testing)
    Review warns that ‘519 investments dropped in rank’ and ‘12 investments fell out of funding’, and that one model now carries most of the portfolio’s value. The consultant reviews the impact table and resolves an automated-check error with a Cooper solution. Then they send for approval with a note. One approver rejects, so the framework returns to Shape. Once fixed and approved, publication is scheduled for the cycle start.
    Journey steps
    Evidence mix: Designed 6 · Specified 1 · Inferred 0 · Missing 1  (of 8 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Value › Review | Know what this framework will change | Reviews Portfolio Impact table (ranks, funding changes) | Impact rows with expand-unchanged | Designed | Strategy Framework: Review — portfolio impact + automated checks [2761:256237]
    2 | Value › Review — Automated checks | Catch errors before approval | Reviews errors / warnings / notes; selects a solution | Checks resolve | Designed | Strategy Framework: Review — portfolio impact + automated checks [2761:256237] Strategy Framework: Shape mode — weights, models, impact warnings [2841:29115]
    3 | Value › Overview / Capital Flow | Walk stakeholders through it | Uses Overview dashboard and Capital Flow Sankey; Cooper ‘Walk me through this framework’ | Interactive walkthrough | Designed | Strategy Framework: Overview — portfolio under framework [784:43771] Strategy Framework: Capital Flow — compare Sankey [2011:137249] Strategy Framework: Cooper — Ask / Walkthrough / Recommendation [2365:48305]
    4 | Value › Send for Approval | Get formal sign-off | Adds note → Send approval | Approvers notified (push) | Designed | Strategy Framework: Send for Approval → Schedule → Scheduled [2838:96751]
    5 | Value › Send for Approval — Rejected | Respond to rejection | Returns to Shape, revises | Framework back in Shape | Designed | Strategy Framework: Send for Approval → Schedule → Scheduled [2838:96751]
    6 | Value › Send for Approval — Schedule | Publish at the right moment | All approved → schedules publish | Library row shows Scheduled / Ready to publish | Designed | Strategy Framework: Send for Approval → Schedule → Scheduled [2838:96751] Strategy Framework: Library: Strategy Framework (status lifecycle) [2340:56647]
    7 | Build / Plan (downstream) | Investment Owners score against the new framework | — investments rescored; objectives become Plan constraints | Rescoring / constraints update | Specified | User Flow: 12 Screens #8 — Send to Plan (constraints) [103:63527] Strategy Framework: Shape mode — weights, models, impact warnings [2841:29115]
    8 | C55 instance — YAML import | Move configuration into the client instance | — | No Catalyst design | Missing | Workflow_Value_Framework_and_Modeling.md
    
    Alternatives and exception paths
    Revisions Required status with restore options (‘Faithful restore’, ‘Hybrid restore’, ‘Lock weight at 28%’).
    Definition of done
    The framework version is approved, scheduled or published, and its portfolio impact is understood and accepted by approvers.
    Design gaps, conflicts and blockers
    YAML export/import and conflict resolution (workflow step 3) have no Catalyst design; may be a System Settings / implementation concern.
    Test mode with sample data (step 2) is replaced by the impact preview — confirm that is sufficient.
    No notification of rescoring to affected Investment Owners is designed, though PRD Value-framework maintenance lists ‘Affected Investment Notifications’.
    Validation questions
    Is framework publication a Value-area job, or an implementation step in System Settings?
    Who approves a framework (role list is generic ‘Approvers’)?
