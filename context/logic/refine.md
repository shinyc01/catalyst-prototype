# Logic: Build › Refine (J08 Alternatives & Forecast, J09 Value & Business Case)

Code: `shared/refine-model.js`, `app/screens/refine.jsx`. One investment is refined: the pad-mount program (8380), the same idea J07 shapes.

## Shell
- Side navigation (DS SideNav): Investment (Overview, Details, Alternative comparison, Value), Alternatives (each: Details, Cost & Schedule, Value), Excluded alternatives.
- Right panel: System confidence (kit issue report) with 4 gates `[Assumed]`: Investment readiness, Path forward, Assumption consistency, Review blockers. Open questions: contingency, the challenged schedule. Warnings: 2 questionnaire answers, an overlapping dependency. Or the Comments panel.
- Send for approval sets the status to In approval and notifies. Approve is not built.
- The Refine draft (recommended alternative, Send to plan / Compare, stage adjustments, comments, documents) is kept per browser in `build.refine`. **Set as recommended is shared with Shape.**

## Alternatives (all `[Whistler]` unless marked)
- Cost = `spendTotal`; years from first and last spend; CAPEX and OPEX = `spendByAccountByYear`.
- **Cost by year** (cost plan, yearly forecast) = every account except **Revenue**. CLTDEMO nets Revenue (income, negative) into `spendByYear`, while `spendTotal` is CAPEX + OPEX; some Expansion and Modernization records earn revenue for decades after delivery. The cost plan's window also widens to every year with cost, so the plan always adds up to the alternative's cost.
- **Any investment:** `rfContext(id)` in `shared/refine-model.js` holds everything Refine shows for one investment (see logic/build.md › Which rows open). Without a risk profile (the CCS investments), risk reduced, risk level and residual risk show "—", alternatives rank by BCR, and value models are the real value measures (no per-year breakdown).
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

## Value (J09)
- **Value models:** one per real risk measure on the alternatives (Delivery capacity, Environmental, Simple financial, Reliability benefit, Safety). Model names, measure counts and outputs are `[Added]`.
- **Risk reduction per model** `[Whistler]`: baseline by measure = the real baseline total × the measure's share of 2026 residual risk (before any spend the residual equals the baseline). Reduction = 1 − Σ residual ÷ Σ baseline, 2026–2035. Avg risk reduction = the mean over the models.
- **Model page:** baseline and each alternative's avoided risk (baseline − residual, never below 0) per year, and a residual-risk chart.
- **Questionnaire** `[Added]`: 7 questions; 5 answered by Cooper, 2 (Safety risk) need you. My answer or Upload file answers one; upload adds a document (16 → 17). Safety risk turns Ready when both are answered.
- Add a model from the library (drawer); remove one (Undo). "Edit with Cooper" shows "Value updated" (Figma has no frame for the result).

## Overview (J09)
- KPIs: BCR (`[Added]` rule), estimated cost, value (score), baseline risk (Σ real baseline 2026–2035), all for the recommended alternative.
- Cards: investment details (real), affected area (map), yearly forecast (real spend), investment value by measure (real).
- **Generate widget with Cooper** (prompt chip or Widgets): adds "Annualized outcome risk by risk type" (real residual risk by measure) and the snackbar "Widget shared with your team".
- Attachments: the 16 `[Added]` documents in Cooper's context; Upload adds one.

## J10 (estimator)
- Comment #56 (Hollis Grant → Noah Lindgren, action required): Cooper filled 3 of the 5 cost lines of Median Replacement from the unit cost model; Procurement & long-lead units and Commissioning & closeout need a person `[Added]`.
- On that alternative's Cost & Schedule those two stages show **Needs estimate**; the estimator confirms each (→ "Estimator reviewed"), after optionally adjusting it by %. He then resolves #56.
- New persona: Noah Lindgren, Estimator / Cost Modeller `[Added]` (Command shows the Investment Owner's content for him). The finance step in the approval chain (journey step 6, inferred) and the parametric estimation module (step 7, not designed) are not built.

## Pages as Figma draws them (audit 2026-11-19, `screens/build-refine-pages-figma-spec.md`)
- **Details** has three tabs. **General**: Identity & Classification, Ownership & Organisation, Dates, Restrictions. Real: name, description, owner, created date, code, type, portfolio, division, the recommended alternative's dates. `[Added]`: creator = the owner (Cooper drafts for them), group, maintenance category (= division), location type, must do (No), disposition, facility (the assets' area), funding org, operating unit; Required by = end + 6 months, Earliest / Latest start = start ∓ 45 days `[Assumed]`. **Cost & Schedule**: last month of actuals (Oct 2026), percent complete 0%, adjustments (Yes once you Adjust by %), calendarization Linear, interpolation Off `[Added]`. **Relationships**: Dependencies, Assets Impacted (status and risk score from the risk model at the study horizon, as Shape and the map), Risks Impacted (the real risk measures; score = the measure's share of 2026 risk; ≥ 30% Critical, ≥ 15% Moderate `[Assumed]`).
- **Overview** adds Compare to Other Investments (rank, percentile, standing, alternative: the same rule as Shape) with the Investment Position scatter (Value vs Cost / Efficiency, median lines), Why This Investment Matters and Similar Investments by BCR.
- **Alternative comparison**: the cards head the grid's columns; groups Financial (CAPEX, ROI, Payback, NPV, IRR, OPEX) · Reliability (risk level, failure reduction, reliability and safety reduction from the real measures, regulatory) · Delivery (duration from the real dates, outage `[Added]` 6 h per pad-mount, schedule risk `[Assumed]` > 30 months = Medium, vendor —) · Portfolio fit (capital year, budget fit —, priority —, ranking by BCR `[Assumed]`). "—" where the demo data has no source. **Chart view**: Figma's radar has no DS chart, so the Comparison Hub is the kit's GroupedColumnChart (scores out of 100 against the best alternative); Trade-offs = three bar charts (cost, risk reduction, value).
- **Alternative › Cost & Schedule** opens on the **Gantt** (the kit TimelineChart, scrolling, one column per period). **Year / Quarter / Month** all work: the data is yearly, and Quarter / Month spread a stage's yearly cost evenly over the months it runs in that year (`rfMonthly`, the "Linear" calendarization). The first stage (design) has four `[Added]` sub-stages (`RF_SUBSTAGES`), shown expanded in both views. The table is a spreadsheet: lettered columns, numbered rows, formula bar.
- **Alternative › Details**: Dates = End of alternative / Pause / Resume (Figma); Scope has the "Ask anything about assets" search.
- **Activity**: the chevron after the code opens the kit ActivityPanel with this investment's version history `[Added]` (Cooper's draft, approved by reviewers, recommended alternative set, sent for / approved at approval).
- **Value**: the first stat is "Total avg value created" = value score ÷ years in the horizon.
- **System confidence** starts with "Urgency needs confirmation" (investment pages in Figma), then the contingency question (alternative pages).
- **Cooper chips** follow the page: Details "Explain gaps in confidence" · "Draft value assessment"; the others as before.

