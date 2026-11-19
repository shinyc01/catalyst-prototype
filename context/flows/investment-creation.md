# Flow: J07 · Build · Investment creation

Tour: `app/flows/006-investment-creation.js` · Persona: Investment Owner (Hollis Grant) · Figma spec: `context/screens/build-j07-figma-spec.md` · Logic: `context/logic/build.md`

## The journey, verbatim (JTBD document J07)

    J07 · Investment Creation
    Investment Owner  ·  Phase 2 — Investment Identification & Proposal  ·  Journey status: Designed
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Investment Owner
    Job to be done | Create a new investment proposal with the right details, assets and initial costs, and confirm it is complete.  Source: Workflow_Investment_Identification_and_Proposal.md — Investment Owner — Investment Creation
    Agentic re-frame | From ‘pick a Capture guide and populate fields’ to ‘describe the need (or select assets on the map) and let Cooper build the idea, then review what it drafted’.
    Trigger | Jeff needs to address aging feeders serving Ridgeview Village; or Cooper has drafted an idea for him.
    Starting context | Jeff (Investment Owner) is in Build › Idea Pad.
    Completed outcome | A shaped idea (Southern Feeder Replacement — Circuit 14B) with need, aligned goals, affected assets and a recommended alternative, ready to send for review.
    Product areas involved | Build, Command, Notifications, Explore (map)
    Journey status | Designed
    
    Use case (for design and testing)
    Jeff clicks New, then Start with Ideas, and types ‘I want to look at investment opportunities for the feeders serving Ridgeview Village’. He lasso-selects 5 assets on the area map. Cooper’s context bar turns READY and he moves to Shape. The idea overview shows the need (‘likely in-service failure within 18–30 months’), strategic relevance (Reliability 40) and Targeted Hardening as the recommended alternative.
    Journey steps
    Evidence mix: Designed 8 · Specified 0 · Inferred 0 · Missing 0  (of 8 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Command — My works / Decisions | Pick up today’s work | Sees ‘Cooper finished your draft’ or decides to start new | Cards link into Build | Designed | Command: Command Center — Investment Owner (Jeff) [26:62181] Global Search and Notifications: All card states [2:118507]
    2 | Build › Idea Pad | Start a new investment | Clicks New | Chooser: Start with Ideas / Duplicate Investment | Designed | Build: Build Library — Idea Pad (default) [564:91122] Build: Create new — chooser (Start with Ideas / Duplicate) [73:115860]
    3 | Build › New investment — Input | Give Cooper enough context | Describes the need in chat, uses a starter prompt, uploads a file, or lasso-selects on the map | Cooper’s context % rises; area map shows the selection | Designed | Build: New investment — Input step (Cooper chat + area map) [73:116169] Build: Input — Build from map selection (5 assets) [73:121453]
    4 | Build › Input — READY | Know when Cooper has enough | Sees the READY badge; clicks Shape | Shape enabled (context is a threshold, not a hard limit) | Designed | Build: Input — no-GIS variant, READY [73:117925]
    5 | Build › Shape — Idea overview | Review what Cooper drafted | Reads need, goals, strategic relevance, affected assets, recommended alternative | Idea overview with evidence chain per card | Designed | Build: Idea overview (Shape) [73:118240] Build: Shape — Rationale / evidence chain [43:62691]
    6 | Build › Shape — sidebar | Fill only what Cooper flags | Answers Cooper’s questions (My answer / Upload file) | Answered items resolve | Designed | Build: Shape — Cooper question sidebar (My answer / Upload) [43:76732]
    7 | Build › Shape — edit | Steer the draft | Edits a card manually or ‘Edit with Cooper’ | Changes applied to the idea | Designed | Build: Shape — Edit types (manual / Cooper) [43:68623]
    8 | Build › Shape | Decide whether to pursue | Sends for review (J11) or Dismisses | Dismiss returns to Idea Pad with Undo toast | Designed | Build: Shape — Dismiss idea [43:84874] Build: Review — approval chain (owner) [43:124632]
    
    Alternatives and exception paths
    Duplicate Investment: pick an existing investment (Cooper suggests one), name the copy, land in Shape with Cooper’s ‘Shape me’ prompt.
    Idea arrives from Explore (J06) — landing not designed.
    No GIS connected: chat-only Input.
    Definition of done
    A shaped idea exists in Build with Cooper’s draft reviewed, flagged questions answered, and the owner has chosen to send it for review.
    Design gaps, conflicts and blockers
    Duplicate flow data inconsistency: dialog copies ‘Circuit 14B’ but Cooper says it duplicated ‘Transformer Upgrade — Eastgate T2’.
    Shape CTA reads ‘Send for review’ in some frames and ‘Send for approval’ in others.
    Workflow-inbox notification on creation (workflow step 5) is replaced by Notifications/Command; not shown for creation specifically.
    Validation questions
    Should Explore-originated ideas skip Input (Build flow says ‘no Cooper draft step’)?
