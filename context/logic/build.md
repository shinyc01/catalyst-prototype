# Logic: Build (J07 · Investment Creation)

Code: `shared/build-model.js` (rules and data), `app/screens/build-library.jsx` (Idea Pad, chooser, Input), `app/screens/build.jsx` (Shape).

## Idea Pad
- **Rows:** the Whistler investments still at the idea stage (`stage: Initial`, 9 records) `[Whistler]`, plus the pad-mount program once you create it in Input. Name, ID, type (Project / Program, folder icon for programs), horizon (FY of the selected alternative's first and last spend) are real.
- **Modified** is the record's created date `[Added]`: the data has no modified date.
- **Status** `[Added]`: a fixed order (New, Under review 0/4, Shaping, Deferred, New, Rejected, …) so every browser shows the same pad. Created ideas start as Shaping; Send for review makes them Under review; Dismiss removes them (Undo for 5 s).
- **Collaboration** `[Added]`: three requests from invented people (asset condition, a reply, asset health).
- **Investments tab:** all 45 real investments with their Catalyst stage, owner, cost and value.

## Input (Cooper's context)
- Context starts at 0% and is a threshold, not a limit (Figma dev note). `[Assumed]` gains: a start prompt +20, the need typed +35, more detail +25, a file +25, a map selection +60. A selection with pad-mount transformers makes Cooper READY (100%) and turns Shape on. A selection without pad-mounts gets a "select the pad-mounts" reply.
- Cooper's replies use the risk model: the same over-tolerance counts and customers as Explore and Study.
- The idea Cooper drafts is always the pad-mount program (investment 8380): it is the cluster's idea investment, the same one J03 + J06 reaches from Study.

## Shape
- **System confidence** (kit SystemConfidence: gates, open questions, warnings, solutions, My answer, Upload). Gates: Idea completeness and Asset alignment pass; Need & urgency has 2 open questions (urgency, cost); Cooper's context has 2 warnings. Review readiness = the kit's gate rule. The question texts quote real facts (the first crossing year, the real cost range of the 3 alternatives) `[Assumed wording]`.
- **Edit The Need:** by hand (pencil → text area → Save) or with Cooper (copper card outline + Cooper's bar; Cooper adds the recommended alternative, its cost and years).
- **Dismiss:** modal with a note → Idea Pad + "The idea has been stopped." with Undo (5 s).
- **Send for review:** status Under review, a notification, the button reads "Sent for review". Review itself is not built yet (J11).

## Review and approval (J11)
- **Gate 0 (Review):** Send for review → the owner sees the approval chain in place of the canvas: Hollis Grant (owner) + 3 reviewers, Noah Lindgren (Finance Lead), Luca Ferri (Field Team Lead), Kenji Mori (Value Framework Owner) `[Added]`. Counter = approved reviewers / 3.
- **Reviewer view** (persona Noah Lindgren): the idea read-only, Cooper's **Readiness Evaluation** (summary + Strategic alignment, Worth pursuing, Portfolio fit, Red flags from the study and the real records; Approval notes = the owner's notes) and **Decide**: Proceed (modal "Proceed to investment" → toast with Undo), Request info (→ Shaping, the owner gets Shape on the row), Park (→ Deferred, Set reminder), Stop (→ Rejected). Only Proceed is drawn in Figma; the other three dialogs are `[Assumed]`.
- `[Assumed]` After Noah proceeds, the other two reviewers approve 4 s later; the idea becomes **Refining** and the owner's Refine button opens it.
- **Final approval (Approve):** Refine › Send for approval → the approval chain (Mara Delgado, Luca Ferri, Kenji Mori) replaces System confidence. Mara and Kenji approve after 4 s; Luca waits until the owner pushes him (kit push, once per 24 h), then approves 3 s later → **Approved at every gate**.
- **Not built:** sending the approved investment to Plan (no design), automatic reminders at day 3 / 5 / 7, Restore idea and Activity on a rejected idea.
