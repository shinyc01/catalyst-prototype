# Overnight build, 18–19 Nov 2026

Built from the JTBD journey documents, Build and Value first. Live: https://shinyc01.github.io/catalyst-prototype/ (gear → Guided tours). Every journey has a tour; the open questions are numbered in `open-questions.md` (35–63).

| Set | Journey | Tour | Start here | State |
|---|---|---|---|---|
| 1 | **J07** Investment creation | 006 | [`#build-library`](https://shinyc01.github.io/catalyst-prototype/#build-library) | Built |
| 1 | **J08** Alternatives & forecast | 007 | [`#build-refine-compare`](https://shinyc01.github.io/catalyst-prototype/#build-refine-compare) | Built |
| 1 | **J09** Value & business case | 008 | [`#build-refine-value`](https://shinyc01.github.io/catalyst-prototype/#build-refine-value) | Built |
| 2 | **J12** Framework design | 009 | [`#value-library?persona=consultant`](https://shinyc01.github.io/catalyst-prototype/#value-library?persona=consultant) | Built |
| 2 | **J13** Framework validation & handoff | 010 | [`#value-review?persona=consultant`](https://shinyc01.github.io/catalyst-prototype/#value-review?persona=consultant) | Built |
| 2 | **J14** Framework calibration | 011 | [`#value?persona=consultant`](https://shinyc01.github.io/catalyst-prototype/#value?persona=consultant) | Built |
| 3 | **J10** Cost estimation support | 012 | [`#build-refine-compare?persona=estimator`](https://shinyc01.github.io/catalyst-prototype/#build-refine-compare?persona=estimator) | Built |
| 3 | **J11** Validation & submission | 013 | [`#build`](https://shinyc01.github.io/catalyst-prototype/#build) | Built |
| 3 | **J25** Execution tracking | — | — | **Skipped** (question 57: no execution data in the records) |
| 4 | **J21** Approval workflow (Plan) | 014 | [`#plan-approve?persona=portfolio`](https://shinyc01.github.io/catalyst-prototype/#plan-approve?persona=portfolio) | Built |
| 4 | **J18** Results & scenario comparison | 015 | [`#plan-compare?persona=portfolio&demo=optimized`](https://shinyc01.github.io/catalyst-prototype/#plan-compare?persona=portfolio&demo=optimized) | Built |
| 5 | **J17** In-cycle re-optimization | 017 | [`#plan-compare?persona=portfolio&demo=reopt`](https://shinyc01.github.io/catalyst-prototype/#plan-compare?persona=portfolio&demo=reopt) | Built 2026-11-20 |
| 5 | **J19** Recommendation and hand-off | 018 | [`#plan-compare?persona=portfolio&demo=reopt`](https://shinyc01.github.io/catalyst-prototype/#plan-compare?persona=portfolio&demo=reopt) | Tour over existing screens; Results parts not built (no Figma) |
| 6 | **J20** Consolidation and sensitivities | 019 | [`#plan?persona=cpm&demo=final`](https://shinyc01.github.io/catalyst-prototype/#plan?persona=cpm&demo=final) | Built; Results not built (no Figma) |
| 6 | **J22** Executive review and approval | 020 | [`#command?persona=cfo&demo=approval`](https://shinyc01.github.io/catalyst-prototype/#command?persona=cfo&demo=approval) | Built |
| 6 | **J23** Publish the baseline | 021 | [`#plan-approve?persona=cpm&demo=approved`](https://shinyc01.github.io/catalyst-prototype/#plan-approve?persona=cpm&demo=approved) | Built; Result Pack not built (no Figma) |
| 7 | **J04** Act on a coverage gap | 022 | [`#command?persona=asset`](https://shinyc01.github.io/catalyst-prototype/#command?persona=asset) | Built; PA run and model stewardship not designed |
| 7 | **J27** Feedback loop and next-cycle prep | 023 | [`#command?persona=asset`](https://shinyc01.github.io/catalyst-prototype/#command?persona=asset) | Built |
| 7 | **J24**, **J26** | — | — | **Held** (question 79: Plan › Execution vs Results) |
| 7 | **J01**, **J28** | — | — | **Skipped**: no Figma links in the journeys |
| 4 | **J15** Planning groups & scenario setup | 016 | [`#plan-groups?persona=portfolio`](https://shinyc01.github.io/catalyst-prototype/#plan-groups?persona=portfolio) | Built 2026-11-20 |

**New personas** (Prototype settings): Ines Calder, CX Consultant (Value) and Noah Lindgren, Estimator / Cost Modeller (also the Finance Lead reviewer in J11). Both `[Added]`: no Figma persona owns them.

**Checks added:** duplicate top-level names across files, and object-rest destructuring (both crash the shared-scope app).

**Decisions waiting for you** (details in `open-questions.md`):
- 46–47: who owns Value, and where objective weights are edited (no control in Figma).
- ~~54: the Build → Plan hand-off~~ answered: approved investments join Plan under New to Scenario.
- 57: J25 needs execution data, and a decision on which area owns executing investments.
- 58–59: the plan approver "(You)", and sequential vs parallel gates.
