# Logic: Explore data quality (J02)

Code: `shared/explore-model.js`. Assets are real (`shared/whistler-data.js`). Rules are `[Assumed]` unless marked.

## Hierarchy
- **Groups** are each asset's real `parent`: Alpine Meadows Station (4 transformer banks), Whistler Substations (HV) (2 Nesters breakers), Alpine Meadows (12 pad-mounts), Transmission Lines (5 Pine Ridge spans). `[Whistler]`
- The levels above are `[Added]`: Alder Ridge Energy › Electrical › Transmission / Distribution / Substations.
- Selecting a group selects all of it, so its details are the group's (Figma dev note: a fully selected group shows group details). Selecting an asset shows that asset.

## Asset and group details (Figma 9:64904 / 9:65804)
- Risk score = the risk model at the horizon (`logic/risk.md`), with its band.
- Condition = 1 − the condition-only likelihood of failure.
- Age = 2026 − in-service year.
- Failure likelihood = likelihood with the active lenses. Badge: High ≥ 50%, Medium ≥ 25%, else Low.
- Group: risk = sum; at-risk = over tolerance; condition and likelihood = averages. Condition badge "Poor" under 50%.

## Trace Report (Figma 29:345530)
| Item | Rule | Effect |
|---|---|---|
| Flood extent binds the floor at 2 km | The assets the flood lens moves by ≥ 2 points (PM-0004, PM-0005, PM-0009) | **Swap to First Street, 30 m** switches the flood lens source to First Street v3 (×1.3) everywhere: map, details, Study |
| 5 spans have no clearance data | The 5 Pine Ridge lines | Keep the default, upload or answer |
| Wildfire hazard is vendor-tier | Verisk FireLine licence lapsed 14 Mar, 11 weeks old `[Assumed]` from the Figma layer copy | Renew in System Settings (admin), or answer |
| 132 values are not measured (warning) | 12 pad-mounts × 11 years of age-based condition | Acknowledge |

While an item is open, the assets it affects show a short note in their details ("Wildfire data 11 weeks old"). Answers survive a reload; Reset demo clears them.

## Global Search
An exact code match scores highest, then a code prefix, then a match anywhere in the code or name. The best match is preselected; Enter opens it. Assets open in Explore with their details; investments show a toast.
