# Flow: J14 · Value · Framework maintenance and calibration

Tour: `app/flows/011-framework-calibration.js` · Persona: CX Consultant (Ines Calder) standing in for the Estimator / Cost Modeller · Figma spec: `context/screens/value-j12-j14-figma-spec.md` · Logic: `context/logic/value.md`

## The journey, verbatim (JTBD document J14)

    J14 · Framework Maintenance & Calibration
    Estimator / Cost Modeller  ·  Phase 3 — Value Framework & Modeling  ·  Journey status: Partial
    Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
    Journey summary
    Persona | Estimator / Cost Modeller
    Job to be done | Monitor model outputs against actual outcomes, recalibrate parameters, maintain the unit cost model library and data tables, and help Investment Owners interpret scores.  Source: Workflow_Value_Framework_and_Modeling.md — Estimator / Cost Modeller — Ongoing Framework Maintenance & Calibration
    Agentic re-frame | From ‘monitor reports for drift and edit models’ to ‘act on Cooper’s drift recommendations, review the revision’s impact, and re-publish through governance’.
    Trigger | Cooper recommends ‘Wildfire risk over-weighted’ or ‘Update Risk Calculation Inputs’ based on outcomes versus predictions.
    Starting context | The modeller sees the Recommendation badge in Value.
    Completed outcome | A revised value model (or framework) is approved and published, and affected investments are rescored.
    Product areas involved | Value, Build, Command
    Journey status | Partial
    
    Use case (for design and testing)
    Cooper’s recommendation says wildfire risk is over-weighted against observed outcomes. The modeller opens the model in Shape mode and reviews the impact warning (‘Existing investments will be recalculated’). They pick the ‘Lock weight at 28%, restore methodology only’ option, run Review and send for approval. Separately, an Investment Owner asks why a score looks wrong, and the modeller answers in the comment thread.
    Journey steps
    Evidence mix: Designed 5 · Specified 0 · Inferred 1 · Missing 1  (of 7 steps)
    # | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
    1 | Value › Recommendations badge | Learn where models drift | Opens Cooper recommendations | Cards with evidence and citations | Designed | Strategy Framework: Full Flow — Active framework + Library [102:144302] Strategy Framework: Cooper — Ask / Walkthrough / Recommendation [2365:48305]
    2 | Value › Library: Value Models | Open the model to revise | Selects model (Active / Revisions Required) | Model detail | Designed | Strategy Framework: Library: Value Models [2456:2307]
    3 | Value › Shape mode | Recalibrate | Edits parameters / weights; reads impact warnings | Draft revision with version history | Designed | Strategy Framework: Shape mode — weights, models, impact warnings [2841:29115]
    4 | Value › Review | Check consequences | Reviews portfolio impact and automated checks | Impact preview | Designed | Strategy Framework: Review — portfolio impact + automated checks [2761:256237]
    5 | Value › Send for Approval | Re-publish through governance | Sends for approval → schedule publish | Scheduled version | Designed | Strategy Framework: Send for Approval → Schedule → Scheduled [2838:96751]
    6 | Build › Comments (support) | Help an Investment Owner interpret a score | Replies in the investment’s comment thread | Thread resolved | Inferred | Build: Comments — 'Shape with Cooper' [55:52663] Build: Value — value models, questionnaire, edit with Cooper [48:146320]
    7 | UCM library / Data tables | Maintain unit prices and formula tables | — | No Catalyst design | Missing | Workflow_Value_Framework_and_Modeling.md claude/PRD_System_Settings.md §5.4 Platform Configuration
    
    Alternatives and exception paths
    No alternative paths are evidenced; none are invented here.
    Definition of done
    The revised model version is approved and published, and its impact on rankings is understood.
    Design gaps, conflicts and blockers
    No designed surface for the Unit Cost Model library or Data Tables (System Settings §5.4 lists value framework structures under configuration).
    Drift monitoring against actual outcomes depends on Results outcome tracking, which is not designed.
    Estimator persona is not named in Figma.
    Validation questions
    Where do UCM tables and data tables live: Value library or System Settings?
