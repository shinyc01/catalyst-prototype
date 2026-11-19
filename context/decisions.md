# Decisions log

Newest first. Each entry gives the date, the decision, who or what it came from, and why.

- **2026-11-18** **J05 built** (tour 005): Cooper's recommendations in the Asset Manager's Explore, one per real cluster investment, using the DS RecommendationGroup / Item / Impact, AgentWindow, CooperChip and EvidenceChainDrawer. Figma's Northgate copy and its 7 recommendations are placeholders; the data gives 5. Source: user ("J05 next").

- **2026-11-18** **J03 built as the Asset Manager's study flow** (tour 004): studies have a population, there's a System Confidence tab, Save study and a Studies library. The map rail follows Figma (1 Asset structure, 2 Studies library, 3 Study). The J03 + J06 tour (Investment Owner, whole cluster) is unchanged. Source: user ("choose whatever Asset Manager flow").
- **2026-11-18** **Create idea ▾ menu = "Save study" only**, as in Figma 29:239507; the earlier "Create idea with Cooper / Create blank idea" items were removed. Source: Figma spec.

- **2026-11-18** **Global Search follows the whole handover** (page 2:61): recent mode, 8 types, grouped / one-type results, Sort & filter per type, Match, query prefixes and filters from the query, typo correction, no results and Ask Cooper, slow / error states, keyboard. It's a feature, not a flow: no tour. A Prototype setting simulates a slow or failing search. Source: user.
- **2026-11-18** **J02 screens rebuilt to their Figma frames** (search 2:21957, from-search 9:64832, hierarchy 9:64506, details 9:64904 / 9:65804), after the first build didn't match. Every new screen gets a side-by-side screenshot comparison with its frame before publishing. Source: user.
- **2026-11-18** **J02 is its own flow** (Asset Manager: Global Search → Explore → asset details → Trace Report). The original tour is titled "J03 + J06 · Command → Explore → Study → Idea", because it matches those two journeys more closely than J02. Source: user.
- **2026-11-18** **Asset details follow the Figma layout** (Explore 9:64904): tabs Details / Documentation / History, then Risk & condition, Lifecycle and Identity. This applies everywhere asset details open, Study included. Source: Figma spec.

- **2026-11-18** **Mini flows are JTBD journey documents** (the J16 format). Every journey follows it; the skill reads them with `scripts/read-journey.py` and maps each section as `.claude/skills/catalyst-flow-builder/references/journeys.md` describes. Source: user.
- **2026-11-18** **The skill also explains, changes and records decisions,** not only adds flows, so Mahsa can review and edit without reading code. `context/README.md` maps every screen; `ONBOARDING.md` gets a new collaborator set up. Source: user.

- **2026-11-18** **Plan home's button follows the cycle:** Start planning → Setup; Continue planning while in Setup; Compare results once optimizing/optimized; Send for approval once a final plan is chosen on Compare; then the cycle is In approval. Source: user (review of J16).
- **2026-11-18** **Flow names keep the journey number** ("J16 · Plan · …"). Source: user.
- **2026-11-18** **Tours scroll their target into view** when it's off screen. Source: user.
- **2026-11-18** **No final plan is preselected on Compare.** Figma shows Baseline / Max cost preselected; the prototype makes the user choose, so Send for approval stays off until they do. Source: Claude, to support the user's "select a final plan → approval" sequence.

- **2026-11-18** **Plan Setup uses the Plan handover (85:162876) for Scenarios, with the add/edit/delete constraint behaviour from "Send to Plan" (103:63527).** The two files are competing designs. The handover matches the Setup shell, and J16 cites both. Source: Claude's default, flagged to the user for confirmation (open question 10).
- **2026-11-18** **Plan data is the Demo Portfolio 2028 Plan** (296 real investments, 14 real scenarios, 12 real constraints), not the Figma placeholders ("Electrical distribution FY27", 4,500 investments, repeated INV-2026-0910 rows). Labels stay as in Figma; only the values change. Source: standing rule (one data layer, real records).
- **2026-11-18** **J16's "Dana" is Owen Fitch**, the invented Portfolio Owner, so the persona stays consistent. Source: standing rule (invented names, used consistently).
- **2026-11-18** **Readiness, outliers and inconsistencies are computed from the real records** with documented rules (`logic/plan.md`), so their counts (48, 24, 29 safe) replace Figma's 47 / 23 / 31. Source: standing rule (never type a number into a screen).
- **2026-11-18** **The Optimization readiness panel is composed from DS parts** (Panel + ConfidenceGates + IssueKindSwitch + IssueNavigator), because DS `SystemConfidence` doesn't pass the gate label ("Approval readiness" is hard-coded). Reported as a DS gap.
- **2026-11-18** **Settings drawer content has 16px padding** on the sides and bottom (also the Command day drawer). Source: user.

- **2026-11-18** **Only real mini flows get a guided tour.** Screens added directly (like the three Command persona views) are screens, not flows. The Investment Owner, Asset Manager and Portfolio Owner Command tours were removed; Command → Explore → Build is the only flow so far. Source: user.
- **2026-11-18** **Prototype settings** (the gear in the NavBar) are simple card rows: signed-in person, guided tours, the non-DS switch, Reset demo. Source: user ("freestyle").

- **2026-11-18** **One growing app on GitHub.** The prototype is now one app (`index.html` + `app/` + `shared/`) in the public repo `shinyc01/catalyst-prototype`, served by GitHub Pages with no build step. Shiny and Mahsa (`mkarimi727`) feed mini flows in parallel through the `catalyst-flow-builder` skill. That skill does all the git work with safeguards (`scripts/sync.sh`) and builds without waiting for plan approval; review happens afterwards. Source: user.
- **2026-11-18** **Every mini flow stays a flow.** Each one is listed in the Flows panel, with a guided tour. Source: user.
- **2026-11-18** **Catalyst Design System 2.0 only** (`shinyc01/catalyst-design-system-2`), pinned in `vendor/ds2/`. Source: user.
- **2026-11-18** **Invented demo names** for every person, the company (Alder Ridge Energy) and the made-up station names, used consistently through `shared/names.js`. Real Whistler BC geography stays. Source: user (the repo is public; the prototype is used for marketing).

- **2026-11-18** **One growing app on GitHub.** The prototype is now one app (`index.html` + `app/` + `shared/`) in the public repo `shinyc01/catalyst-prototype`, served by GitHub Pages with no build step. Shiny and Mahsa (`mkarimi727`) feed mini flows in parallel through the `catalyst-flow-builder` skill. That skill does all the git work with safeguards (`scripts/sync.sh`) and builds without waiting for plan approval; review happens afterwards. Source: user.
- **2026-11-18** **Every mini flow stays a flow.** Each one is listed in the Flows panel, with a guided tour. Source: user.
- **2026-11-18** **Catalyst Design System 2.0 only** (`shinyc01/catalyst-design-system-2`), pinned in `vendor/ds2/`. Source: user.
- **2026-11-18** **Invented demo names** for every person, the company (Alder Ridge Energy) and the made-up station names, used consistently through `shared/names.js`. Real Whistler BC geography stays. Source: user (the repo is public; the prototype is used for marketing).

- **2026-11-16** **All prototype data comes from the Whistler demo dataset** (`copperleaf-demo-data` skill). Gaps are filled in `shared/whistler-additions.js`, tagged `[Added]`. Northgate is retired. The cluster is now Alpine Meadows (23 real assets); the persona is Hollis Grant; the Build idea is investment 8380. Source: user. Why: one consistent, holistic dataset across every prototype. (The `catalyst-mock-data` skill, Larchmere Energy, was considered and not used.)

- **2026-11-16** **Shared model:** risk model, area grid and lens catalogue moved to `shared/catalyst-model.js`, and the sample data to `shared/northgate-data.js`. `build.sh` inlines them. Source: agreed with the user. Why: new features reuse one logic source.
- **2026-11-16** **Context folder + git repo** (`Catalyst-prototype`) to hold product knowledge for every future flow. Source: user. Why: build up the whole system gradually and reuse past logic.
- **2026-11-16** **Build idea screen follows frame 43:65022** in full, including Compare to other investments. Source: user.
- **2026-11-16** ~~Keep the 12-asset Northgate model data~~. Superseded by the Whistler dataset (above).
- **2026-11-16** **The Figma frame is the spec.** Logic changes values only; it never adds, renames or moves UI. Source: user, after mismatches ("Worst asset" button, Build layout). Why: prototypes must stay faithful to the wireframes.
- **2026-11-16** **The map is a tilted 3D MapLibre map** with a blue → green → yellow → red risk grid, to match the Figma Lens frames. Source: user ("map looks bad, match Figma").
- **2026-11-16** **Risk is shown per area** as a grid of squares with aggregated totals; a lens can flip an area from green to red. Source: user.
- **2026-11-16** **Risk definitions:** risk = LoF × CoF; lenses = external influences on likelihood and/or consequence; 10-year horizon; tolerance = intervention threshold per asset type. Source: user.
- **2026-11-16** **Working prototype with logic**, not click-through screens: lenses, zoom, asset details and horizon playback work. Source: user.
- **2026-11-16** **Hybrid build** (DS kit + flagged non-DS), **one Northgate story**, **scripted Cooper**. Source: user.
