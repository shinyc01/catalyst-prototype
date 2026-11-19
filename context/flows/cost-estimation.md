# Flow: J10 · Build · Cost estimation support

Tour: `app/flows/012-cost-estimation.js` · Persona: Estimator / Cost Modeller (Noah Lindgren, `[Added]` persona) · Screens: Build › Refine (`context/screens/build-refine-j08-j09-figma-spec.md`) · Logic: `context/logic/refine.md` → J10

## The journey, verbatim (JTBD document J10)

    J10 · Cost Estimation Support
    Estimator / Cost Modeller  ·  Phase 2 — Investment Identification & Proposal  ·  Journey status: Partial
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Estimator / Cost Modeller
    Job to be done | Produce a defensible cost estimate for an investment (asset attributes, loadings, spend profile) and get it approved so it flows into the forecast.  Source: Workflow_Investment_Identification_and_Proposal.md — Estimator / Cost Modeller — Cost Estimation Support
    Agentic re-frame | From ‘build the estimate in a separate tool’ to ‘review Cooper’s generated cost profile when routed a needs-you cost item, adjust the loadings that need judgement, and approve’.
    Trigger | Cooper generated the cost forecast from the unit cost model and filled 3 of 5 open lines; 2 need a person (Command v2 Marcus scenario). The Investment Owner routes them to the Estimator.
    Starting context | The Estimator receives a collaboration request or mention.
    Completed outcome | The flagged cost lines are estimated and approved, and the investment’s cost & schedule reflects them.
    Product areas involved | Command, Notifications, Build
    Journey status | Partial
    
    Use case (for design and testing)
    Jeff’s Targeted Hardening alternative has two cost lines Cooper couldn’t estimate: non-like-for-like poles and permit loadings. He mentions Tom Nguyen (Finance Lead) in a comment. Tom opens it from Notifications and checks Cooper’s cost basis on the Cost & Schedule table. He adjusts the loading by %, replies, and resolves the comment. Tom also approves the Finance step in the approval chain.
    Journey steps
    Evidence mix: Designed 5 · Specified 0 · Inferred 1 · Missing 1  (of 7 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Notifications / Command — Conversations | Know he is needed | Receives a mention or collaboration request | Card: ‘mentioned you’ / ‘Action required’ | Designed | Global Search and Notifications: All card states [2:118507] Command: Responses (Conversations) — Default [26:67077]
    2 | Build › Comments | Understand what is asked | Opens the comment on the investment | Comment focus with context | Designed | Command: Comment Focus — Question (Command → Build) [26:71694] Build: Comments — 'Shape with Cooper' [55:52663]
    3 | Build › Alternatives Cost & Schedule | Review Cooper’s cost basis | Inspects table lines and formula | Spend lines with source | Designed | Build: Alternatives Cost & Schedule — table [76:8792]
    4 | Build › Cost & Schedule | Apply judgement where Cooper lacks context | Adjusts by %, distributes, edits a line or ‘Edit with Cooper’ | Lines updated | Designed | Build: Alternatives Cost & Schedule — table [76:8792] Build: Alternatives Cost & Schedule — Gantt [96:80712]
    5 | Build › Comments | Close the loop | Replies and resolves | Comment resolved; owner notified | Designed | Build: Comments — 'Shape with Cooper' [55:52663]
    6 | Build › Approval chain | Sign off the cost | Approves the finance step when routed (Finance Lead in chain) | Approval status advances | Inferred | Build: Review — approval chain (owner) [43:124632]
    7 | Cost Estimation module (Tessa/UCM) | Run a full parametric estimate (loadings, spend profiles, lifecycle report) | — | No Catalyst design | Missing | Workflow_Investment_Identification_and_Proposal.md
    
    Alternatives and exception paths
    Estimator also maintains the UCM library (J14).
    Definition of done
    The flagged cost lines carry an estimator-reviewed basis, the comment is resolved, and the alternative’s cost & schedule is updated.
    Design gaps, conflicts and blockers
    The Estimator / Cost Modeller is not a named persona in any Figma file; Command v2 §3 lists Estimator as served indirectly via workflow routing.
    No design for the parametric Cost Estimation module (assets tab, loadings, spend profiles, Estimate Manager approval).
    The reviewer-side approval action in Build is not designed (only owner side and stage-gate-0 Decide).
    Validation questions
    Does detailed cost estimation stay in a separate tool (Tessa) with integration, or move into Build?
    Is the Estimator a collaborator role in Build only, or does it need its own Command variant?
