# Flow: J27 · Command · Feedback loop and next-cycle prep

**Source:** JTBD journey **J27 — Asset Manager — Feedback Loop - Next Cycle Preparation**. Tour: `app/flows/023-feedback-next-cycle.js`. Persona: **Mara Delgado, Asset Manager**. Built 2026-11-20.

## Built
- **Command (Asset Manager):** a new decision `[Added]` "Confirm recalibration · Pine Ridge line failure curves", whose button reads **Confirm recalibration** (the persona verb). The journey's cohort is underground cable; the data has no cable assets, so it uses the 5 real Pine Ridge overhead lines. Value's recommendation copy now says the same (was "underground cable").
- It opens Value with Cooper's recommendation **Update Risk Calculation Inputs** → evidence → **Do it** → WDRM v4 in Value Models (the governed draft is J14).
- Next cycle: Cooper's recommendations (J05) → Take me there → Create idea → Send to Build (J06).
- `demo=recal` and `demo=recs` reopen the recalibration and the recommendations, so J14, J05 and J27 tours replay.

## Not built
- Inspection data import and the recalibration editor (not designed); Cooper's voice "next assignment" (User Flow #12) is not built.

## Source mini flow (verbatim)
```
LINKS
  https://www.figma.com/design/U7AUNbrWHYuX3E0O4GbfEx/?node-id=103-109375
  https://www.figma.com/design/8VmjGH9Ihg8TFzDQiKTPpi/?node-id=2456-2307
  https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR/?node-id=26-73195
  https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-357809
  https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR/?node-id=26-72978
  https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-352263

TEXT
J27 · Feedback Loop: Next Cycle Preparation
Asset Manager  ·  Phase 6 — Execution & Monitoring  ·  Journey status: Partial
Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
Journey summary
Persona | Asset Manager
Job to be done | Compare asset performance with predictions, feed actual failures back into degradation models, flag assets nearing thresholds for the next cycle, and prepare evidence for Investment Owners.  Source: Workflow_Portfolio_Optimization.md — Asset Manager — Feedback Loop: Next Cycle Preparation
Agentic re-frame | From ‘update condition data, recalibrate models, assemble data packages’ to ‘confirm Cooper’s recalibration proposals and let Cooper carry flagged needs into the next round of recommendations’.
Trigger | Command decision: Cooper proposes a recalibration on the UG cable cohort after observed failures diverged from predictions.
Starting context | Priya opens Command.
Completed outcome | Recalibration confirmed, and next-cycle needs surfaced as Cooper recommendations in Explore.
Product areas involved | Command, Explore, Value, Build
Journey status | Partial

Use case (for design and testing)
Priya’s Command shows that a colleague approved the recalibration on the UG cable cohort and that the inspection backfill for Feeder 12 is in. She confirms Cooper’s recalibration. Then she tells Cooper by voice: ‘Start working on the West Corridor and create some investment ideas… I’ll check in tomorrow.’ The next day Explore shows new recommendations for the West Corridor.
Journey steps
Evidence mix: Designed 4 · Specified 1 · Inferred 1 · Missing 0  (of 6 steps)
# | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
1 | Command — Asset Manager | See divergence and pending confirmations | Reviews Decisions and Collaborations (recalibration, inspection backfill) | Cards with Health index / Risk score | Designed | Command: Asset Manager — Decisions (Health index / Risk score) [26:72978] Command: Asset Manager — Collaborations / Responses [26:73195]
2 | Command (decision) | Confirm recalibration | ‘Confirm recalibration’ (persona verb) | Recalibration applied | Specified | claude/PRD_Command_Center_full_v2.md §5 The Solution (responsibility model, anatomy, persona parameterization)
3 | Value › Value Models | Model update recorded | — model revision through governance (J14) | Revised model | Inferred | Strategy Framework: Library: Value Models [2456:2307]
4 | Explore / Cooper voice | Set up the next cycle’s work | Gives Cooper a one-line voice instruction | Cooper analyses overnight | Designed | User Flow: 12 Screens #12 — Cooper next assignment (West Corridor) [103:109375]
5 | Explore › Cooper Recommendations | Review next-cycle needs | Reviews new recommendations | Recommendations list (J05) | Designed | Explore: Cooper — '7 risks surfaced' [29:352263]
6 | Explore → Build | Pass evidence to Investment Owners | Create idea / Send to Build (J06) | Ideas in Build with asset evidence | Designed | Explore: Send to build — '3 strategies sent to Build' [29:357809]

Alternatives and exception paths
No alternative paths are evidenced; none are invented here.
Definition of done
Model recalibration is confirmed, and next-cycle needs are visible as recommendations or ideas carrying asset evidence.
Design gaps, conflicts and blockers
E2E Asset Manager board stage 5 ‘Learn & Repeat’ has no flow cards or screens.
Inspection data import and model recalibration UI are not designed.
Autonomous overnight work (12 Screens #12) conflicts with System Settings §5.5 ‘authority allowances off by default’ — confirm.
Validation questions
How much may Cooper do unattended (Command v2 Q5 / System Settings §5.5)?
Sources cited in this journey
Workflow_Portfolio_Optimization.md
Command Handover › Asset Manager — Decisions (Health index / Risk score) [26:72978]
Command Handover › Asset Manager — Collaborations / Responses [26:73195]
claude/PRD_Command_Center_full_v2.md §5 The Solution (responsibility model, anatomy, persona parameterization)
Strategy Framework Handover › Library: Value Models [2456:2307]
User Flow › 12 Screens #12 — Cooper next assignment (West Corridor) [103:109375]
Explore Handover › Cooper — '7 risks surfaced' [29:352263]
Explore Handover › Send to build — '3 strategies sent to Build' [29:357809]

```
