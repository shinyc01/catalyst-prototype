# Flow: J12 · Value · Framework specification and design

Tour: `app/flows/009-framework-design.js` · Persona: CX Consultant (Ines Calder, `[Added]` persona) · Figma spec: `context/screens/value-j12-j14-figma-spec.md` · Logic: `context/logic/value.md`

## The journey, verbatim (JTBD document J12)

    J12 · Framework Specification & Design
    CX Consultant  ·  Phase 3 — Value Framework & Modeling  ·  Journey status: Designed
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | CX Consultant
    Job to be done | Turn a client’s requirements into a value framework: strategic objectives, value measures, risk matrix, value models, configurable fields and curves.  Source: Workflow_Value_Framework_and_Modeling.md — CX Consultant — Framework Specification & Design
    Agentic re-frame | From ‘parse an Excel spec and configure every object in Framework Designer’ to ‘feed Cooper the goals and documents, review the framework it builds on the map, and steer weights and models’.
    Trigger | A client engagement starts or the organisation sets new enterprise goals for the next cycle (e.g. Q1 2026 Strategy Framework).
    Starting context | The consultant opens Value › Library: Strategy Framework.
    Completed outcome | A draft strategy framework (goals → value framework → objectives → models → measures) shaped and ready for review.
    Product areas involved | Value, Command
    Journey status | Designed
    
    Use case (for design and testing)
    The consultant creates a new strategy framework with ‘Build by Cooper’, uploading the client’s goals document and recording a voice note. Cooper asks ‘Any current baselines or targets I should anchor to?’ and drafts the map. In Shape mode the objective weights sum past 100%, so Cooper offers ‘Rebalance all objective weights’. The consultant accepts, then adds a carbon-intensity measure Cooper recommended.
    Journey steps
    Evidence mix: Designed 8 · Specified 0 · Inferred 0 · Missing 0  (of 8 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Value › Library: Strategy Framework | See existing frameworks | Browses library (Active / Pending / Draft / Archived) | Library rows with status and sub-stage chips | Designed | Strategy Framework: Full Flow — Active framework + Library [102:144302] Strategy Framework: Library: Strategy Framework (status lifecycle) [2340:56647]
    2 | Value › Create Strategy Framework | Start without a blank screen | Chooses Build by Cooper / Start from Enterprise Goals / Duplicate | Creation path opens | Designed | Strategy Framework: Create Strategy Framework [2646:49149]
    3 | Value › Create — Input | Give Cooper the context | Adds voice/text/document context; answers Cooper’s prompts | Cooper drafts the framework | Designed | Strategy Framework: Create Strategy Framework [2646:49149]
    4 | Value › Map | See the framework as a system | Reviews Enterprise Goals → Value Framework → Objectives → Models → Measures | Node map with evidence chain | Designed | Strategy Framework: Map — Goals → Objectives → Models → Measures [2011:61558]
    5 | Value › Shape mode | Steer weights and models | Adjusts objective weights, adds models; acts on warnings (‘weights >100%’, incompatible units) | Recommended weights; impact warnings (‘Existing investments will be rescored’) | Designed | Strategy Framework: Shape mode — weights, models, impact warnings [2841:29115]
    6 | Value › Create Value Framework / Value Model | Add missing building blocks | Builds by Cooper, from objectives/outcome, browses library, or Advanced mode (formula, questionnaire) | New value framework or model in draft | Designed | Strategy Framework: Create Value Framework [2761:279007] Strategy Framework: Create Value Model (Advanced mode, questionnaire) [2761:279008]
    7 | Value › Cooper | Get expert recommendations | Reviews Cooper recommendations (‘Add Carbon Intensity Measure’, ‘Wildfire risk over-weighted’) | Recommendation cards with citations | Designed | Strategy Framework: Cooper — Ask / Walkthrough / Recommendation [2365:48305]
    8 | Value › Collaboration / Comments | Work with client stakeholders | Shares the map; comments on nodes | Collaborators and comment threads | Designed | Strategy Framework: Collaboration [2344:65440] Strategy Framework: Comments [2846:238254]
    
    Alternatives and exception paths
    Risk matrix configuration (likelihood × consequence levels, tolerances) — not visible in indexed Value frames.
    Configurable Field Attributes and curves (SpendProfile, ConditionDecay) — not designed.
    Definition of done
    A draft framework exists in the library with objectives, weights, models and measures shaped, and no blocking Shape-mode errors.
    Design gaps, conflicts and blockers
    No persona is named in the Strategy Framework file; ‘CX Consultant’ appears in no Figma file. Ownership of the Value area is unstated.
    Risk matrix, configurable fields and curves (workflow steps 3, 5, 6) have no designed surface.
    C# formula engine authoring is represented only by ‘Advanced Mode (formula settings)’ at layer-name level.
    Validation questions
    Who is the Value area’s primary user in Catalyst: CX Consultant, client value-framework owner, or Portfolio Owner?
    Do curves and configurable fields belong in Value or System Settings › Platform Configuration?
