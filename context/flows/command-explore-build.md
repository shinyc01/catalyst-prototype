# Flow: Command → Explore → Build

**Source:** Confluence "Command - Explore - Build" (PM space, page 5570592781). Built as `prototypes/command-explore-build.src.html`.

## Story `[Confluence]` flow, `[Whistler]` data
Cooper flags the **Alpine Meadows cluster** in Whistler, BC as the #1 critical decision. The cluster has 23 real assets across 5 investments, serving ~6,200 customers:
- Alpine Meadows Substation's 230 kV banks;
- 12 pad-mount transformers from 1944–45;
- the Pine Ridge corridor lines;
- the Nesters substation breakers.

Hollis Grant explores it on the map, studies it with risk lenses, and adds a custom lens (EV load growth) through Cooper. Cooper then turns the study into the **Pad-Mount Transformer Replacement Program V2** idea (DIST000246), which opens in Build at the Shape step. The recommended alternative (Aggressive, Median or Minimal Replacement) follows the intent Hollis picks.

## Steps and transitions
| # | Screen | User does | Goes to | Deep link |
|---|---|---|---|---|
| 1 | Command | Opens the Alpine Meadows card (rank 1, Critical) | Explore | `#command` |
| 2 | Explore | Sees "Cooper found: Alpine Meadows cluster"; can click **View details** (Cooper window) or click assets | – | `#explore`, `#explore-details` |
| 3 | Explore | **Study area** | Study | `#study` |
| 4 | Study | Toggles lenses, picks a lens, changes its data source, plays the horizon, clicks squares and assets | – | `#study`, `#study-flood`, `?year=…&asset=…` |
| 5 | Study | **+ Custom** → Cooper chat → picks *EV load growth* and a forecast source → lens added and switched on | – | `#study-lens-chat`, `#study-lens-added` |
| 6 | Study | **Create idea** → Cooper asks intent, horizon and trade-off → drafts the idea → **Open in Build** | Build | `#study-idea`, `#study-idea-done` |
| 7 | Build | Reviews the drafted idea (Shape step) | – | `#build` |

Stages outside the flow (Value, Plan, Results) show a toast. Only the Alpine Meadows card is wired up on Command; the other cards are real Whistler investments.

## Prototype decisions for this flow `[Confirmed]`
- **Hybrid build:** DS kit components, plus Figma-matched custom parts flagged as non-DS.
- **One dataset:** Whistler demo data plus labelled additions (see `data/whistler.md`).
- **Scripted Cooper chats.**
- **Working logic** instead of click-through screens: lenses, the area risk grid, horizon playback, asset details and zoom all work.
