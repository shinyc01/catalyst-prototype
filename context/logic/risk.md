# Risk logic

Implemented in `shared/catalyst-model.js` (the `RISK MODEL` and `AREA RISK GRID` blocks). Data: `shared/whistler-data.js` + `shared/whistler-additions.js` (see `data/whistler.md`).

## Rules `[Confirmed]`
1. **Risk = likelihood of failure × consequence of failure.**
2. **The base condition** is the asset on its own: likelihood from its age and condition, and consequence from what its failure impacts. No external influence.
3. **Lenses are external influences**, from outside data sources:
   - **Likelihood lenses** ask "would this asset fail if this happens, and how likely is it to happen here?" Examples:
     - **Flood:** how likely the area is to flood, × whether the asset would survive it.
     - **Extreme Heat:** projected heat over the coming years (e.g. a wildfire-prone region); heat-sensitive assets become more likely to fail.
   - **Consequence lenses** make the same failure worse in this place. Example: **Critical Habitat**, where an asset on an endangered-species habitat has a much higher consequence than the same asset elsewhere.
4. **Aggregation:** the risk from every active lens is added into one total. The map colour **always shows the total**, so a low (green) area can turn red when a lens is switched on.
5. **Risk belongs to the area:** the map shows a grid of small squares over the location, each coloured by its total risk (red = high, green = low).
6. **Horizon:** 10 years from the current year, playable year by year.
7. **Tolerance:**
   - It is the company's intervention threshold, not the failure point.
   - It is customised per company and differs per asset type, with a default around "high".
   - Crossing it notifies the user to act.

## How the prototype implements it `[Assumed]`: numbers to confirm
**Scales.** Per asset, per year: `risk = LoF (0–1) × CoF (1–10, capped) × 10` → 0–100.

**Base likelihood and consequence** come from each asset's **Whistler outlook**: condition, normalized age, health score and reliability risk by year. The per-kind mapping is in `data/whistler.md`.

**Threshold year** = the first *new* crossing: the earliest year an asset that isn't already over tolerance today (on condition alone) crosses it.

**Likelihood lenses** (each combined as `1 − (1−p)(1−q)`):
- **Flood:** `P(area floods in year) × P(asset fails | flood)`. The area hazard is 0.10 a year before 2029 and 0.22 + 0.012 a year after (re-delineated floodplain).
- **Extreme Heat:** heat stress rises 0.15 + 0.07 a year and adds to likelihood: `combine(LoF, exposure × hazard × 0.45)`. The heat field is highest on the dry west slopes.
- **EV load growth** (custom): peak load +2% a year, up to +20%. It overloads heavily loaded feeders and transformers.

**Consequence lenses:**
- **Oil Containment:** `CoF × (1 + exposure × 1.0)`, for sites with no secondary containment.
- **Critical Habitat:** `CoF × (1 + exposure × 1.2)`.

**Data sources.** Each lens has 2 sources with a multiplier `k`; switching source changes results. Examples: NOAA SSP2-4.5 = 1.0 vs SSP5-8.5 = 1.4; FEMA NFHL = 1.0 vs First Street = 1.3.

**Area grid:**
- Squares are ~110 m (0.001° lat × 0.00128° lng) over the Alpine Meadows area.
- Each square has static exposure fields: floodplain polygons, a west-slope heat gradient, habitat polygons, distance to the substation (oil), feeder load (EV), and people/critical-load density for consequence.
- Base likelihood comes from nearby ageing assets, plus background noise.
- The same lens formulas then apply. Clicking a square shows base + each lens's contribution.

**Colour ramp** (blue → green → yellow → red → dark red), with thresholds:

| Band | Area risk from | Token |
|---|---|---|
| Very low | 0 | `data-viz-data-6` |
| Low | 10 | `element-map-pin-fill-success` |
| Moderate | 22 | `element-map-pin-fill-warning` |
| High | 40 | `background-system-danger` |
| Critical | 60 | `data-viz-alert-data-7` |

**Asset bands:** Low < 20 ≤ Moderate < 40 ≤ High < 60 ≤ Critical.

**Tolerance defaults** (per kind, `[Added]`): bank 45, pad-mount 35, line 40, breaker 40.

**Cluster metrics:**

| Metric | How it's worked out |
|---|---|
| Risk score | Sum of asset risks |
| Value at stake | Σ LoF × failure cost ($M) |
| At-risk assets | Assets ≥ tolerance in the selected year |
| Threshold year | First year any asset crosses its tolerance |

**Playback.** One year per second; a toast appears when an asset newly crosses its tolerance.

## Known gaps
See `open-questions.md`, in particular what *cluster-level* tolerance means (Figma shows "Tolerance 415" on the cluster risk bar).
