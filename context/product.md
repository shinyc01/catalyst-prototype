# Catalyst: product overview

**Catalyst** is IFS Copperleaf's decision platform for asset-intensive organisations (utilities). It helps asset managers find risk in their network, study it, and turn it into investment ideas that move through review and approval. `[Confirmed]`

## Stages (top navigation) `[Figma]`
| Stage | Purpose | Covered so far |
|---|---|---|
| **Command** | Home. Cooper surfaces decisions that need the user's attention, ranked by priority. | Yes: `screens/command.md` |
| **Value** | The value framework: how the organisation scores benefit. | No |
| **Explore** | A map of the network. Find at-risk areas, open studies, apply lenses. | Yes: `screens/explore.md`, `screens/study.md` |
| **Build** | Shape an investment idea, then take it through Shape → Review → Refine → Approve. | Shape only: `screens/build-idea.md` |
| **Plan** | Portfolio planning across investments and budgets. | No |
| **Results** | Outcomes after delivery. | No |

## Cooper `[Figma]`
Cooper is Catalyst's AI agent and appears throughout the product:
- proactive recommendations (AgentWindow), e.g. "Cooper found: Alpine Meadows cluster";
- chat (ChatCompactPanel) for guided tasks such as adding a custom lens or creating an idea from a study;
- Cooper icon buttons on cards ("ask Cooper about this");
- "Cooper's context" (documents) on Build pages.

In prototypes, Cooper's conversations are **scripted** (fixed questions with option chips), but its answers use numbers computed by the model. `[Confirmed]`

## Users `[Assumed]`
- **Asset manager / planner** (prototype persona: Hollis Grant, owner of the Pad-Mount program; see data/whistler.md): looks after a region's network, decides when to intervene.
- **Investment owner / reviewers**: shape and approve ideas in Build.
