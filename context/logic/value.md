# Logic: Value (J12 Framework design, J13 Validation & handoff, J14 Calibration)

Code: `shared/value-model.js`, `app/screens/value.jsx`. NavBar **Value** opens the active framework's Overview.

## What is real and what is not
- **Real** `[Whistler]`: the value measures (47 of the 69, those a model scores, with their real categories → type Risk / Benefit / Cost / Condition score, mapping `[Assumed]`), the 296 Demo Portfolio investments (capex, value), total capital ($4.80B), the enterprise goals (Figma copy, `[Added]` earlier).
- **Not in the data** `[Added]`: frameworks and their statuses, objectives and weights (40 / 35 / 13 / 7 / 5, Figma's Overview), value models (Figma names), formulas (Figma copy), approvers (invented people), peer figures and industry position (62nd, Figma), recommendations (Figma copy).

## Rules `[Assumed]`
- **Objective profile per investment:** a keyword profile from its name (wildfire → environment; safety → social; transformer / substation → reliability…), varied by a stable hash of its id, summing to 1. Score = value × Σ profile × weight.
- **Re-score (Review):** the draft's weights (Reliability ×1.18, Safety ×0.93, Environment 18, Financial 28 — Figma's "+18% / −7%") re-score all 296 investments. Gained / lost = ±1%. Buckets: ±1%, ±5%, ±15%. Funding line = 60% of requested capex, ranked by score per capex. With these weights no investment crosses the line, and the summary says so.
- **Models' investments** = investments with at least 15% of their profile in the model's objective.
- **Capital flow:** each investment's capex split by its profile → objectives; an objective's capital shared equally by its models.
- **Input context:** text +40%, a document +30%, a prompt answer +30%; 100% = Ready (Shape unlocks). Goals appear two per input (the 5 enterprise goals).
- **Shape:** adding an objective gives it 100 ÷ n %, so the total passes 100% → Trace report error; **Rebalance** rescales all weights to 100%. Dropping an objective outside the Strategic Objectives column is refused.
- **Automated checks:** 2 errors (wildfire over-weighted → hybrid / faithful / skip restore; uncovered governance measures → map to ESG-Rep), 1 warning, 1 note. Send for approval unlocks when both errors are solved. Resolved checks are remembered.
- **Approval:** Send → after 3 s Ravi Banerjee approves and Luca Ferri asks for revisions (Shape from his row) → Send again → after 3 s all approve → Publish ▾ (Publish now / Schedule: Jan 1, 2027 9:30, the cycle start) → the Library row reads Scheduled.
- **Recommendations:** Do it on "Add Carbon Intensity Measure" adds it to the map; on "Update Risk Calculation Inputs" opens WDRM v4. Model **Edit** makes a "Copy of …" draft in Shape with the recalculation note, then the same Review and approval.
