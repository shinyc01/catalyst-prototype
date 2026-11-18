# Logic: Plan readiness, scenarios and the optimization run

Code: `shared/plan-model.js`. Records: `shared/whistler-plan.js` (generated, real). Every rule here is `[Assumed]` unless marked.

## Inconsistencies (one per investment; the first rule that matches)
| Type | Rule over the real record | Cooper question | Fix |
|---|---|---|---|
| Study with no cost or value | CAPEX 0 and value 0, alternative Investigation / Survey / Inspection / Study / Recommended | "29 of 48 inconsistencies are safe to ignore" | Accept all (ignored) |
| Cost has no estimate basis | CAPEX 0 on capital work (Replace, Refurbish, Upgrade…) | "6 costs have no estimate basis" | Fix with Cooper = the class median |
| Cost n% below the class median | CAPEX under 5% of the median CAPEX of the same alternative type (classes with 5+ costed members) | "9 costs are far below their class" | Leave out from this plan |
| Value is negative | value < 0 | "4 investments have a negative value" | Send to the owner → fixed in Build |
These give 48 inconsistencies in 296 investments (29 safe to ignore). Each question can also be answered with Upload file or My answer, and handling every row in the table resolves the question.

## Outliers
Fit log(value) = a + b·log(CAPEX) over the 257 investments with both; an outlier sits more than **1.5 standard deviations** off the line. This gives 24. Median cost $14.5M, median value 26.5K (real medians).

## Readiness
DS rule (`useIssueReport`): readiness % = gates passed ÷ 3 gates (Data readiness, Planning groups, Scenarios setup). Planning groups has no issues, so it starts passed: 33%. **Ready to optimize** % = investments in the plan without an open issue ÷ investments in the plan. **Cost at risk** = CAPEX of investments with an open issue (routed ones count until they're back).

## Scenario warnings (computed from the real constraints)
- 11_Min. CAPEX to meet targets caps CAPEX at **$0 from 2027**. Relaxing it gives that scenario the Baseline CAPEX caps.
- Requested 2029 CAPEX **$807.7M** against a **$437.8M** cap (the year with the biggest overshoot, 01_Requested). Letting start dates shift turns on "Shift start dates" in every scenario.

## Scenarios `[Whistler]`
Five real 2028 Plan scenarios, least to most spend: 11_Min. CAPEX to meet targets · 99_CAPEX reduced by 5% · 02_Optimized 2028 Plan · 22_Add. CAPEX required to meet targets · 30_Decarbonization Plan. Constraints are their real min/max per year (2028–2032). Budget = the sum of CAPEX max 2028–2032; Resources = 2028 project manager hours max; Enterprise goal = 2028 Reliability-Risk max. Constraints that can be added are the portfolio's real definitions not yet set (CMI, GHG Emissions Reduction, Field Crew Hours). Restriction defaults are `[Added]`: alternatives may change, interpolation off, start dates shift up to 3 years, Under Consideration and New to Scenario adjustable.

## The run `[Assumed]`
About 24 s: readiness check to 30%, solving to 85%, validating to 100%. Results are the real optimized scenarios; Plan home shows 02_Optimized 2028 Plan (CAPEX $4.22B, value 15.8M vs requested $4.80B, 14.3M). Owner fixes come back 6 s after routing.
