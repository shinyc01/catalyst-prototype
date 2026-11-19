# What lives where: a map of the prototype

Use this page to find out how anything in the prototype works, or where to change it. You don't need to open these files yourself: ask Claude Code ("How does the readiness % work?", "Where does the 48 come from?") and it reads them for you. This page is the index it starts from.

**Live site:** https://shinyc01.github.io/catalyst-prototype/

## Screen by screen

| Screen (deep link) | Flow and tour | What it shows / the logic | Data | Figma (the spec) | Code | Open questions |
|---|---|---|---|---|---|---|
| **Command** [`#command`](https://shinyc01.github.io/catalyst-prototype/#command) (add `?persona=asset` or `?persona=portfolio`) | J03 + J06, J02 (start) | `screens/command.md`, `screens/command-figma-spec.md` | `shared/whistler-command.js` (per persona) | `QSh5FbHQ86rlWo0ViZCIDR` | `app/screens/command.jsx` | — |
| **Explore** (the map) [`#explore`](https://shinyc01.github.io/catalyst-prototype/#explore) | J03 + J06 (Investment Owner) | `screens/explore.md`, `logic/risk.md` (area risk grid) | `data/whistler.md` (Alpine Meadows cluster) | `RIgfAXt18AXHLu8s0wuvQ1` | `app/screens/explore.jsx`, `app/map.jsx` | 1, 5, 9 |
| **Study** (lenses, System Confidence, Save study, Studies library) [`#study`](https://shinyc01.github.io/catalyst-prototype/#study) | J03 + J06; **J03** (Asset Manager, tour 004) | `screens/study.md`, `logic/risk.md` (risk = likelihood × consequence, lenses, tolerance, horizon) | `data/whistler.md`, `shared/catalyst-model.js` | `RIgfAXt18AXHLu8s0wuvQ1` | `app/screens/study.jsx` | 1–6, 8 |
| **Build** (idea) [`#build`](https://shinyc01.github.io/catalyst-prototype/#build) | J03 + J06 | `screens/build-idea.md`, `logic/investments.md` (alternatives, BCR) | `data/whistler.md` | `BmOuH8YCHltiitqwNW2ARt` frame 43:65022 | `app/screens/build.jsx` | 7 |
| **Global Search** (NavBar icon, ⌘K, `/`) — the whole handover, not a flow; also step 1 of J02 | — | `logic/global-search.md`, `screens/global-search-spec-1-open-find.md`, `-2-narrow.md`, `-3-results.md` | 8 types: real assets, investments, portfolios, scenarios, value measures + `[Added]` study, frameworks, locations (`shared/search-model.js`, `shared/whistler-search.js`) | `acAfLbn5qy49dNNMouadUR` page 2:61 | `app/screens/search.jsx` | 21, 25–27 |
| **Explore as Asset Manager** [`#explore?persona=asset`](https://shinyc01.github.io/catalyst-prototype/#explore?persona=asset): ASSETS tree, asset and group details, Trace Report | J02 | `logic/explore-data.md`, `screens/explore-j02-figma-spec.md` | real asset groups, `shared/explore-model.js` | `RIgfAXt18AXHLu8s0wuvQ1` 9:13044, 9:64501, 29:345530 | `app/screens/explore.jsx` | 22–24 |
| **Cooper recommendations** (Explore, Asset Manager: the "N risks surfaced" chip) [`#explore-recs?persona=asset`](https://shinyc01.github.io/catalyst-prototype/#explore-recs?persona=asset) | J05 (tour 005) | `flows/results-review.md`, `logic/recommendations.md`, `screens/explore-j05-figma-spec.md` | the 5 real cluster investments, their assets and alternatives (`shared/recommend-model.js`) | `RIgfAXt18AXHLu8s0wuvQ1` 29:351117, 29:354522, 29:358931 | `app/screens/explore.jsx` (`RecsWindow`) | 32–34 |
| **Plan home** [`#plan?persona=portfolio`](https://shinyc01.github.io/catalyst-prototype/#plan?persona=portfolio) | J16 (entry and exit) | `screens/plan-setup.md` → "Plan home" (the cycle: Start planning → Continue planning → Compare results → Send for approval) | `data/whistler.md` → "Plan data" | `Dv3HzkcFTTrb4E34zLF7cy` 84:276350, 85:83781 | `app/screens/plan.jsx` (`PlanHome`) | 17 |
| **Plan › Setup › Data readiness** [`#plan-setup?persona=portfolio`](https://shinyc01.github.io/catalyst-prototype/#plan-setup?persona=portfolio) | J16 | `screens/plan-setup.md`, `logic/plan.md` (inconsistencies, outliers, readiness, System confidence) | `shared/whistler-plan.js` (296 real investments), `shared/plan-model.js` | 85:157926 | `app/screens/plan.jsx` (`Readiness`) | 11, 12, 13, 15 |
| **Plan › Setup › Planning groups** [`#plan-groups?persona=portfolio`](https://shinyc01.github.io/catalyst-prototype/#plan-groups?persona=portfolio) | J16 | `screens/plan-setup.md` | real planning groups | 85:158979 | `app/screens/plan.jsx` (`Groups`) | — |
| **Plan › Setup › Scenarios** [`#plan-scenarios?persona=portfolio`](https://shinyc01.github.io/catalyst-prototype/#plan-scenarios?persona=portfolio) | J16 | `screens/plan-setup.md`, `logic/plan.md` (scenarios, constraints, warnings), `screens/plan-scenarios-figma-spec.md` | 5 real scenarios and their real constraints | 85:162876 + 103:63527 | `app/screens/plan.jsx` (`Scenarios`) | 10, 14, 16 |
| **The optimization run** (NavBar badge, progress, notification) | J16 | `screens/plan-setup.md` → "The run", `logic/plan.md` → "The run" | real optimized results | 85:83781 | `app/screens/plan.jsx` (`RunProgress`), `app/main.jsx` | — |
| **Plan › Compare** [`#plan-compare?persona=portfolio`](https://shinyc01.github.io/catalyst-prototype/#plan-compare?persona=portfolio) | after J16 (summary level) | `screens/plan-setup.md` → "Compare", `screens/plan-compare-figma-spec.md` | real optimized scenarios | 85:65862 | `app/screens/plan.jsx` (`PlanCompare`) | 18, 19 |

All paths are inside `context/` unless they start with `app/`, `shared/` or `scripts/`.

## The other files
- `product.md`: what Catalyst is, its stages, and Cooper.
- `glossary.md`: the terms (asset, cluster, lens, tolerance, scenario…).
- `flows/`: one file per mini flow, with the original journey document saved word for word at the end. `command-explore-build.md` (J03 + J06), `asset-data-validation.md` (J02), `condition-risk-study.md` (J03), `results-review.md` (J05), `plan-constraint-readiness.md` (J16), and `plan-portfolio-manager-userflow.md` (the Plan user-flow diagrams).
- `decisions.md`: everything settled, newest first, with who decided it.
- `open-questions.md`: everything not settled yet, numbered. Answer one by saying "Answer open question 10: …".
- `data/whistler.md`: where the demo data comes from (Alder Ridge Energy, the real CLTDEMO demo records) and what was added.

## How to read the tags
Every fact in these files carries a tag saying where it came from:

| Tag | Means |
|---|---|
| `[Whistler]` | Real demo data from the CLTDEMO instance |
| `[Figma]` / `[Confluence]` | Taken from that source |
| `[Confirmed]` | Decided by a designer (Shiny or Mahsa) |
| `[Assumed]` | Invented by Claude to make it work: **needs confirming**, usually with an open question |
| `[Added]` | Data filled in where the demo data had none (names, owners, geography…) |

## Things you can ask
- **Explain:** "How is Optimization readiness worked out?" · "Why are there 24 outliers?" · "What's assumed on the Compare screen?" · "Which Figma frame is Setup built from?"
- **Change:** "Rename the Optimize button to Run optimization" · "Make an outlier 2 standard deviations off, not 1.5" · "The run should take 10 seconds" · "Move Warnings above Open questions"
- **Decide:** "Answer open question 17: use Start planning" · "We decided the final plan defaults to Cooper's pick"
- **Add:** "Add this flow to the prototype", with the journey document (e.g. `J17 - … .docx`) attached or its path
- **Review:** "Review the prototype and tell me what looks off"

Every change goes through the same safe publish, so it never overwrites the other person's work.
