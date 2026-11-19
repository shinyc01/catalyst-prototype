# Layout — Catalyst Design System 2.0.1

Tokens: `src/foundations/layout.css`. Spacing roles: `guide/spacing.md`.

## 1. Breakpoints and grid (by screen width, never density)
| Name | Width | Columns | Page margin | Gutter |
|---|---|---|---|---|
| xs | < 600 | 4 | 16 | 16 |
| sm | 600–1023 | 8 | 24 | 16 |
| md | 1024–1439 | 12 | 24 | 16 |
| lg | 1440–1919 | 12 | 24 | 20 |
| xl | 1920+ | 12 | 32 | 32 |

Content is capped at 1600 and centred. The grid is measured in the content area (beside the side nav and any docked panel).

## 2. What snaps to the columns
Cards and page regions: `.ifs-grid` with `.ifs-span-N` children (`.ifs-span-panel` / `.ifs-span-rest` for a side column that is part of the page: 3 columns, 4 below 1440). Below 1024 quarters become halves and wider spans go full width; below 600 everything is full width. Content inside a card (table columns, metric rows) follows the card, not the grid.

## 3. Panels: fixed sizes (hybrid)
| | Width |
|---|---|
| Side panel / drawer | 380 (`--region-panel`, min 320, max 50%) |
| Large panel | 600 (`--region-panel-l`) |
| Modal | 440 / 600 (`--overlay-width-m` / `-l`), centred |
| Popover | 320 (`--overlay-width-s`), 4px from its trigger |

Docked panels sit flush against the content-area edge; the page beside them keeps its margin and reflows onto its own columns.

## 4. Map slots
On a map or canvas, floating panels are placed in slots, never pinned (`.ifs-slots` on the map container, `.has-left` / `.has-right` when filled):
- Tools: left corner. Left slot: the large panel, next to the tools. Right slot: the side panel.
- Top and bottom slots: centre their content in the space between the left and right slots.
- Every slot sits the page margin from the map edge and the page gap from its neighbours, so nothing overlaps or needs dragging.
- Below 1024: the left slot becomes a bottom sheet; the right slot overlays the map.
