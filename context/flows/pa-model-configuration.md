# Flow: J04 · Explore · Act on a coverage gap

**Source:** JTBD journey **J04 — Asset Manager — Predictive Analytics - Model Configuration**. Tour: `app/flows/022-pa-model-configuration.js`. Persona: **Mara Delgado, Asset Manager**. Built 2026-11-20.

## Built
- **Command (Asset Manager):** a new decision `[Added]` "No long-range position on the Alpine Meadows pad-mounts" (Cooper's coverage-gap finding; the journey's class is overhead transformers, the data's is pad-mounts). It opens the study Cooper framed (`#study`).
- The rest reuses J03 / J06: the horizon (risk trajectory, threshold year), Create idea with Cooper's questions (sequencing, horizon, budget trade-off), the alternatives, Open in Build.

## Not built
- Model stewardship (degradation curves, PoF/CoF parameters): journey step 6 is Missing in Figma.
- "Scope a PA run": specified, not designed; unattended runs are an open question in the Explore PRD.

## Source mini flow (verbatim)
```
LINKS
  https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-221451
  https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-228366
  https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-187620
  https://www.figma.com/design/8VmjGH9Ihg8TFzDQiKTPpi/?node-id=2456-2307
  https://www.figma.com/design/U7AUNbrWHYuX3E0O4GbfEx/?node-id=1-877
  https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1/?node-id=29-225623

TEXT
J04 · Predictive Analytics: Model Configuration
Asset Manager  ·  Phase 1 — Asset Assessment & Strategy  ·  Journey status: Partial
Built with the catalyst-journey-mapper method: one persona, one trigger, one completed outcome. Every step is tagged Designed (seen in a Figma handover), Specified (in a PRD/study but not in a current handover), Inferred (connective step neither source documents) or Missing / conflicted. Figma references are clickable.
Journey summary
Persona | Asset Manager
Job to be done | Define degradation curves and PoF/CoF parameters, create strategies with horizons, configure strategy alternatives and constraints so PA can recommend interventions.  Source: Workflow_Asset_Assessment_and_Strategy.md — Asset Manager — Predictive Analytics: Model Configuration
Agentic re-frame | From ‘configure curves, strategy alternatives and constraint tabs’ to ‘state the goal and horizon to Cooper, review the alternatives it builds, and steward the models it uses’.
Trigger | Cooper finds a coverage gap: ‘no long-range position on this class’ (e.g. overhead transformers) and frames a study.
Starting context | Priya opens the pre-framed study from Command or starts one on an asset class in Explore.
Completed outcome | A long-term strategy for the asset class with Cooper-built alternatives, saved to Build in ‘exploring/shaping’ status.
Product areas involved | Command, Explore, Build, Value
Journey status | Partial

Use case (for design and testing)
Cooper flags that Priya’s overhead transformer class has no long-range position. In the Demeter SS study she clicks Create idea. Cooper asks about horizon (‘10 years’), sequencing (‘Wildfire-corridor feeders first’) and what gives if the budget tightens (‘Defer volume rather than breach the envelope’), then builds alternatives. Priya plays the horizon and keeps the recommended one.
Journey steps
Evidence mix: Designed 3 · Specified 2 · Inferred 1 · Missing 1  (of 7 steps)
# | Where (area / location) | User goal | User action | System response / resulting state | Evidence | References
1 | Command → Explore | Act on a coverage-gap finding | Opens Cooper’s pre-framed study finding | Explore opens with the study framed | Inferred | User Flow: Flow — EXPLORE: Asset Manager, Investment Manager [1:877] claude/PRD_Command_Center_full_v2.md §6 Path Scenarios
2 | Explore › Lens / study | Ground the strategy in current risk | Reviews lenses and horizon for the class | Risk trajectory and threshold year | Designed | Explore: Lens on — Demeter SS Study [29:187620] Explore: Lens — Horizon scrubber [29:228366]
3 | Explore › Create Idea (Cooper Q&A) | Tell Cooper the intent and horizon | Answers Cooper’s questions with option chips (horizon, sequencing, budget trade-off) | Cooper records the goal and constraints | Designed | Explore: Lens — Create Idea (Cooper Q&A → alternatives) [29:221451] Explore: Create Idea — 'If the budget gets tight, what gives?' [29:225623]
4 | Explore › Create Idea — Alternatives | Compare strategy alternatives | Reviews Cooper-built alternatives; plays horizon | Alternative list with Cooper’s recommendation | Designed | Explore: Lens — Create Idea (Cooper Q&A → alternatives) [29:221451] User Flow: Flow — EXPLORE: Asset Manager, Investment Manager [1:877]
5 | Explore — Strategy CTA ladder | Move the strategy forward | Save in Build → Set goals → Draft alternatives → Send to Build for review | Strategy status: exploring → shaping | Specified | claude/Explore_Study_Lenses_Consolidated_Summary.md §2.6 Strategy CTA ladder
6 | Value › Value Models | Steward the curves and models PA relies on | — (model stewardship: degradation curves, PoF/CoF parameters) | No designed curve/parameter editor | Missing | Strategy Framework: Library: Value Models [2456:2307] claude/Catalyst_Project_Handoff.md §9 Consolidated open questions
7 | Explore → PA run | Run predictive analytics on the scoped population | ‘Scope a PA run’ exit | PA run executes (unattended runs are an open question) | Specified | claude/Explore_Context_Layers_Exposure_Lens_Feature_Definition.md §8.3 The exits claude/PRD_Explore_Context_Layers_Exposure_Lens.md §11 Open Questions

Alternatives and exception paths
Constraint setting (cost max, SAIDI/SAIFI targets) is expressed as Cooper goal questions rather than a constraints tab; formal constraints live in Plan Setup.
Definition of done
A strategy-class object exists with stated goal, horizon and Cooper-built alternatives, and has been sent to Build for review.
Design gaps, conflicts and blockers
No designed surface for degradation curves, PoF/CoF parameters, intelligent bundling or repeated-intervention toggles (workflow steps 1, 3, 5).
‘Scope a PA run’ is specified but not designed; whether PA runs can be unattended is open (PRD_Explore Q9).
Asset Manager survival as ‘model steward + position/study reviewer’ is open (Handoff §9 #14; Command v2 Q8).
Envelope versus constraints is unresolved (Study_Elimination Q6).
Validation questions
Where does model stewardship (curves, CoF tables) live: Value, System Settings or a PA area?
What is the LRP/strategy class called (Study_Elimination Q1, blocking)?
Sources cited in this journey
Workflow_Asset_Assessment_and_Strategy.md
User Flow › Flow — EXPLORE: Asset Manager, Investment Manager [1:877]
claude/PRD_Command_Center_full_v2.md §6 Path Scenarios
Explore Handover › Lens on — Demeter SS Study [29:187620]
Explore Handover › Lens — Horizon scrubber [29:228366]
Explore Handover › Lens — Create Idea (Cooper Q&A → alternatives) [29:221451]
Explore Handover › Create Idea — 'If the budget gets tight, what gives?' [29:225623]
claude/Explore_Study_Lenses_Consolidated_Summary.md §2.6 Strategy CTA ladder
Strategy Framework Handover › Library: Value Models [2456:2307]
claude/Catalyst_Project_Handoff.md §9 Consolidated open questions
claude/Explore_Context_Layers_Exposure_Lens_Feature_Definition.md §8.3 The exits
claude/PRD_Explore_Context_Layers_Exposure_Lens.md §11 Open Questions

```
