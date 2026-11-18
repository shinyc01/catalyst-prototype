# Screen: Study (lenses)

**Figma:** Explore handover `RIgfAXt18AXHLu8s0wuvQ1`. Sections:
- Lens 29:187613
- Enter study 29:191921 (map frame 29:191936)
- Include or exclude lens 29:211317
- Add Lens 29:216872
- Create Idea 29:221451
- Change source 29:226290
- Horizon 29:228366
- Send to build 29:357809

## Layout `[Figma]`
- **Left Panel**, "<Area> Study", with Lenses / System Confidence tabs.
  - **Lens list (left column):**
    - LENSES: Overview, Base Condition;
    - CUSTOM with **+** (add a custom lens through Cooper);
    - one row per lens, with an include Switch.
  - **Content (right column):**
    - **Overview:**
      - RISK & CONDITION: four StatCards (Risk score, Value at stake, At-risk assets, Threshold year), each "vs." base with a trend;
      - CHANGE SUMMARY text;
      - a risk-score bar split by base and each lens, with a tolerance marker and a legend with each lens's contribution.
    - **Lens view:** title, include switch, data-source Select, stats, change summary, trajectory chart.
- **FloatingBar:** "<Area> · Selected N (red badge) · View details · Create idea ▾".
- **Map:** a tilted 3D heat grid, blue → green → yellow → red, with dark gaps; the network on top.
- **Horizon:** round play button · HORIZON · year pill · slider · year ticks.
- **Cooper ChatCompactPanel** on the right (Add lens / Create idea).

## Logic `[Confirmed]` rules, `[Assumed]` numbers (see `logic/risk.md`)
- Switching a lens recalculates every square and every asset. The map shows the **aggregate**.
- Playback steps through the years; a toast appears when an asset crosses its tolerance.
- Clicking a square shows base + each lens's contribution. Clicking an asset opens Asset details.
- **View details** opens Cooper's recommendation window.

## Added for J03 (2026-11-18), see `flows/condition-risk-study.md`
- The study covers a **population** (a group from the hierarchy, a search result's group, a saved study, or the whole cluster). The title, "Selected N" and every number follow it.
- **System Confidence** tab: EvidenceStrength bar + open questions / warnings for the study's assets (the panel narrows to 356 px).
- **Create idea ▾ → Save study**, the success Alert, and the **Studies library** panel from map rail icon 2.

## Known mismatches
- The tolerance marker on the risk bar is missing; its meaning is still open.
- The Figma map draws 3D asset models (pylons, substation), which the real map can't show.
