# Flow: J09 · Build · Value modeling and business case

Tour: `app/flows/008-value-business-case.js` · Persona: Investment Owner (Hollis Grant) · Figma spec: `context/screens/build-refine-j08-j09-figma-spec.md` · Logic: `context/logic/refine.md`

## The journey, verbatim (JTBD document J09)

    J09 · Value Modeling & Business Case
    Investment Owner  ·  Phase 2 — Investment Identification & Proposal  ·  Journey status: Partial
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Investment Owner
    Job to be done | Apply value models, answer questionnaires, review risk reduction and benefit per alternative, compare value profiles, and make the business case defensible.  Source: Workflow_Investment_Identification_and_Proposal.md — Investment Owner — Value Modeling & Business Case
    Agentic re-frame | From ‘select models and answer every questionnaire’ to ‘review Cooper’s applied scoring, answer only what Cooper flags, and inspect the evidence behind each number’.
    Trigger | Alternatives are in place (J08); System confidence shows value-related open questions.
    Starting context | Jeff is in Build › Refine › Value.
    Completed outcome | Value models applied and questionnaire gaps closed for each alternative, with value and risk visible on the overview and evidence attached.
    Product areas involved | Build, Value
    Journey status | Partial
    
    Use case (for design and testing)
    On the Value page Cooper has already applied the reliability and wildfire models, pre-filling the questionnaire answers with its reasoning. Two answers are flagged needs-you. Jeff answers one and uploads a field report for the other. He asks Cooper by voice to generate an ‘annualized outcome risk by risk type’ widget and shares it with Isabella Grant and Lara Green.
    Journey steps
    Evidence mix: Designed 7 · Specified 0 · Inferred 1 · Missing 0  (of 8 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Build › Refine — Value | See which value models apply | Reviews selected value models (Cooper entry point, value list) | Value models with measures and formula | Designed | Build: Value — value models, questionnaire, edit with Cooper [48:146320]
    2 | Build › Value — questionnaire | Answer only what is flagged | Reviews Cooper-answered items; answers needs-you items | Questionnaire answers update the score | Designed | Build: Value — value models, questionnaire, edit with Cooper [48:146320] PROJECT_INSTRUCTIONS.md — governing premise (review-and-steer)
    3 | Build › Value — edit with Cooper | Correct a measure | Edits a measure or cell with Cooper (voice flow) | ‘Value updated’ | Designed | Build: Value — value models, questionnaire, edit with Cooper [48:146320]
    4 | Build › Value — add model | Add a missing benefit | Adds a value model with Cooper or button | Model added to alternative | Designed | Build: Value — value models, questionnaire, edit with Cooper [48:146320]
    5 | Build › Investment Overview | See the business case at a glance | Reviews KPIs (BCR, cost, value, baseline risk) and value-by-measure | Overview widgets | Designed | Build: Refine — Investment Overview (readiness 100%) [58:31703]
    6 | Build › Overview — widgets | Tell the story the reviewers need | Generates or edits a widget by voice with Cooper; shares it | Widget generated; ‘Widget shared with your team’ | Designed | Build: Refine — Investment Overview (readiness 100%) [58:31703] Build: Refine — System confidence ('Urgency needs confirmation') [43:229806]
    7 | Build › Attachments / Comments | Attach supporting evidence | Uploads documents; comments | Cooper’s context document count updates | Designed | Build: Attachments [53:230306] Build: Comments — 'Shape with Cooper' [55:52663]
    8 | Value › Value Models library | Understand the model behind a score | — opens the model definition | Model library (read) | Inferred | Strategy Framework: Library: Value Models [2456:2307]
    
    Alternatives and exception paths
    Unexpected score → ask the Estimator / Value Framework Owner for interpretation (J14).
    Definition of done
    Every alternative has applied value models with no unanswered needs-you items, and the overview shows a defensible BCR and value profile with evidence linked.
    Design gaps, conflicts and blockers
    Value page frames were indexed mostly at layout level, so questionnaire triage states (Cooper-answered / needs-you / user-answered) are not verified visually.
    No Build → Value navigation is designed for inspecting a model.
    Value Comparison across alternatives (workflow step 4) folds into Compare Alternatives; financial metrics (NPV, IRR, payback) are not visible.
    Validation questions
    Should the three-state triage component be the standard for every Value questionnaire?
