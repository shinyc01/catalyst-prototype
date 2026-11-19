# Flow: J11 · Build · Data quality validation and submission

Tour: `app/flows/013-validation-submission.js` · Personas: Investment Owner (Hollis Grant) and reviewer Noah Lindgren · Figma spec: `context/screens/build-j11-figma-spec.md` · Logic: `context/logic/build.md` → J11

## The journey, verbatim (JTBD document J11)

    J11 · Data Quality Validation & Submission
    Investment Owner  ·  Phase 2 — Investment Identification & Proposal  ·  Journey status: Partial
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Investment Owner
    Job to be done | Make sure the investment passes data-quality criteria, take it through stage-gate approval, respond to reviewer feedback, and get it into the planning cycle.  Source: Workflow_Investment_Identification_and_Proposal.md — Investment Owner — Data Quality Validation & Submission
    Agentic re-frame | From ‘read AI reviewer output and fix fields, then push through workflow’ to ‘accept Cooper’s fixes from System confidence, send for review/approval, and let Cooper hand the approved investment to Plan’.
    Trigger | The idea is shaped (J07) and later refined (J08–J09); System confidence shows approval readiness below 100%.
    Starting context | Jeff is on the investment in Build (Shape or Refine).
    Completed outcome | The investment passes gate 0 (idea → investment) and final approval, and is added to the upcoming planning cycle in Plan.
    Product areas involved | Build, Command, Notifications, Plan
    Journey status | Partial
    
    Use case (for design and testing)
    System confidence shows 35% approval readiness. The blocker is ‘Urgency needs confirmation’. Jeff picks Cooper’s solution ‘Ask field team to confirm urgency’ and John Thomson confirms. Readiness reaches 100% and Jeff clicks Send for approval. Tom Nguyen hasn’t acted after 3 days, so Jeff pushes a reminder. Once everyone has approved, Cooper sends the investment to Plan for the FY27 cycle.
    Journey steps
    Evidence mix: Designed 7 · Specified 1 · Inferred 0 · Missing 1  (of 9 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Build › Shape | Get a go/no-go on the idea | Clicks Send for review; adds notes per reviewer | Approval chain opens (Under review 0/3) | Designed | Build: Review — approval chain (owner) [43:124632]
    2 | Build › Review (reviewer) | Reviewer decides on the idea | — reviewer reads Cooper’s Readiness Evaluation; Decide ▾ → Proceed / Request info / Park / Stop | Proceed: ‘This idea will leave Shape and become an investment’ | Designed | Build: Reviewer — Cooper Readiness Evaluation + Decide [43:141215] Build: Reviewer — Proceed to investment modal [43:128734] Build: Reviewer — investment approved toast [43:128039]
    3 | Build › Refine — System confidence | See what blocks approval | Reviews approval readiness, errors, open questions | Issue list with Cooper solutions | Designed | Build: Refine — System confidence ('Urgency needs confirmation') [43:229806] Command: Investment overview / System confidence (Command → Build) [26:72160]
    4 | Build › System confidence | Fix by accepting, not authoring | Picks a Cooper solution, uploads a file or adds own answer | Readiness % rises; checks pass | Designed | Build: Refine — System confidence ('Urgency needs confirmation') [43:229806] Build: Refine — Investment Overview (readiness 100%) [58:31703]
    5 | Build › Refine → Approve | Submit for final approval | Clicks Send for approval | Approval chain opens; statuses: Revisions required / Rejected / Approved / Deferred | Designed | Build: Approve — entry (Send for approval) [58:31702] Build: Approve — approval chain open [58:33560] Build: Review — statuses [43:125157]
    6 | Command — Conversations / Build | Chase a slow reviewer | Push reminder (1 per 24h; auto at day 3/5/7) | Reviewer notified in-app and by email, deep-linked to approve/request changes | Designed | Command: Dev note — push & reminder logic [26:70319] Build: Dev note — reviewer push notification [43:127104] Command: Responses (Conversations) — Default [26:67077]
    7 | Build › Comments | Respond to feedback | Addresses comments, resubmits if revisions required | Comment resolved; status updates | Designed | Build: Comments — 'Shape with Cooper' [55:52663]
    8 | Build → Plan | Hand the approved investment to planning | — Cooper sends the investment to Plan’s upcoming cycle | No designed end state / ‘Submit to Plan’ in Build | Missing | User Flow: End to end — Investment Manager: Build [122:39897] claude/Study_Elimination_and_Core_Process_Map.md §5 Object paths / §5.5 compare & approve
    9 | Plan › Setup — Data readiness (loop) | Fix issues found later by the Portfolio Owner | — notified of a flagged investment; fixes it in Build | Flag clears in Plan readiness | Specified | User Flow: End to end — Portfolio Manager: Plan [122:39936] Plan: Setup — Data readiness (Fix with Cooper) [85:157926]
    
    Alternatives and exception paths
    Reviewer selects Request more information / Park / Stop; owner can request restore on a rejected item.
    Dismiss the idea at Shape (closes it with Undo).
    Definition of done
    The investment is approved at all gates, has no open readiness errors, and appears as a candidate in Plan’s next planning cycle.
    Design gaps, conflicts and blockers
    No Build → Plan submission is designed: no ‘Submit/Send to Plan’ CTA and no end state after final approval.
    The reviewer-side Decide at the final Approve stage is not designed (only gate 0 Decide).
    Approver lists differ between Review (Tom Nguyen) and Approve (Isabella Grant).
    Stepper label inconsistency: ‘Decide’ vs ‘Approve’.
    How multi-year program bundles enter a single planning cycle is undefined (User Flow Plan board note).
    Validation questions
    Is hand-off to Plan automatic on final approval (Cooper ‘Sends investment off to Plan’) or an explicit owner action?  → Answered 2026-11-19 (Shiny): automatic. Created = in a portfolio; approved = ready for the planning cycle, listed in Plan under New to Scenario.
    Does ‘submitted (to Plan)’ assign a planning group (Under Consideration / Required) per Study_Elimination §5.1?
