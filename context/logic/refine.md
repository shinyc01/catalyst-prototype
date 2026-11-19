# Logic: Build › Refine (J08 Alternatives & Forecast, J09 Value & Business Case)

Code: `shared/refine-model.js`, `app/screens/refine.jsx`. One investment is refined: the pad-mount program (8380), the same idea J07 shapes.

## Shell
- Side navigation (DS SideNav): Investment (Overview, Details, Alternative comparison, Value), Alternatives (each: Details, Cost & Schedule, Value), Excluded alternatives.
- Right panel: System confidence (kit issue report) with 4 gates `[Assumed]`: Investment readiness, Path forward, Assumption consistency, Review blockers. Open questions: contingency, the challenged schedule. Warnings: 2 questionnaire answers, an overlapping dependency. Or the Comments panel.
- Send for approval sets the status to In approval and notifies. Approve is not built.
- The Refine draft (recommended alternative, Send to plan / Compare, stage adjustments, comments, documents) is kept per browser in `build.refine`. **Set as recommended is shared with Shape.**

## Alternatives (all `[Whistler]` unless marked)
- Cost = `spendTotal`; years from first and last spend; CAPEX and OPEX = `spendByAccountByYear`.
- **Risk reduced** = 1 − Σ residual risk ÷ Σ baseline risk, 2026–2035, from the real risk profile. Risk level = residual ÷ baseline in 2035: under 20% Low, under 50% Medium, else High.
- Units replaced `[Added]`: 12 / 6 / 3, the numbers in the alternative descriptions. Customers protected = the pad-mounts' customers × units ÷ 12 `[Added]`.
- ROI, payback, NPV and IRR show "—": the demo data has no financial model. Value is the framework score; BCR is the existing `[Added]` rule.
- Cooper's evaluation compares risk reduced, cost and BCR.

## Comments `[Added]`
- #54 (Luca Ferri, action required) doubts the Minimal Replacement timeline; #55 (Noah Lindgren) asks to check unit costs.
- Shape with Cooper: 1 recommended action ("Refine … schedule") + 3 others. Do it resolves #54 with Cooper's reply and marks the alternative "refined". Cost and scope do not change (the record stays the record).

## Cost & Schedule `[Added]` stages
- Four stages share each year's real spend: Design & engineering 8%, Procurement 22%, Replacement 58%, Commissioning 12%. Their dates split the alternative's spend period (0–20%, 10–45%, 30–92%, 85–100%). A stage's cost in a year = its share of that year's spend, weighted by how much of the stage falls in the year. Stage totals add up to the real total.
- Adjust by % scales every year of a stage (a draft change). Shift dates, Quarter and Month scales are not built (the data is yearly).
- The Gantt is the kit TimelineChart; milestones are the real ones.

## Dependencies `[Added]` type and progress
- The other 4 Alpine Meadows investments, with their real cost and value. Cooper explains each link.
