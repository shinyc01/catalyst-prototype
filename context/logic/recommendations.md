# Logic: Cooper recommendations (J05)

Code: `shared/recommend-model.js`. Records are real: the cluster's 5 investments, their 23 assets and 14 alternatives (`shared/whistler-data.js`). Rules are `[Assumed]`.

- **One recommendation per cluster investment** whose assets reach tolerance within the horizon (all 5 do). Its interventions are the investment's **real alternatives**, recommended first.
- **Title:** "n of N <kind> over tolerance — <area>" when some are already over, or "n <kind> cross tolerance by <year> — <area>". A single asset is named.
- **Includes:** the investment's assets; **Root** = the asset with the highest risk.
- **The three metrics** (Figma dev note: the backend picks the 3 most affected measures; here they're fixed):
  - replacement cost = the recommended alternative's real spend;
  - risk reduced = 1 − the group's risk after the intervention ÷ before;
  - failure likelihood = the group's average likelihood now.
- **Risk after an intervention:** the assets return to as-new condition (5% likelihood), scaled by the alternative's value against the best alternative of the same investment.
- **If no action:**
  - the first or worst crossing;
  - the customers served (the Pine Ridge corridor counts the station once);
  - emergency replacement = the assets' failure cost × 1.64 (Figma's "+64% vs plan").
- **Groups:**
  - highest risk = anything over tolerance now;
  - highest value = the most value per dollar;
  - largest impact = the most customers;
  - the rest go to immediate review.
- **Live signal:** the worst asset, the factor adding most risk (a lens if it adds over 15% of the base risk, otherwise condition), and its failure likelihood by year with and without the lenses.
- **Recent outages:** 3 per asset kind `[Added]`.
- **Evidence confidence:** 70 + 25 × the average likelihood.
- **Sending to Build** removes the recommendation (persisted; Reset demo restores it) and adds a notification.
