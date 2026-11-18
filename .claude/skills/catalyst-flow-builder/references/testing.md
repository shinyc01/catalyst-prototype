# Testing before publishing

## 1. Automatic checks
Run `node scripts/check.mjs`. It covers the data layer, links, names, the flows and the manifest, and design tokens. It must print ✓. GitHub runs the same checks on every pull request.

## 2. In the browser pane
1. **Serve the repo root** in the background: `python3 -I -m http.server 8766 --bind 127.0.0.1` (Bash with `run_in_background`). Open `http://127.0.0.1:8766/index.html#<screen>`, setting the viewport to 1440×900 first. Stop the server when you're done.
2. **Compare with Figma.** For each new or changed screen, screenshot it and its Figma frame, and compare them region by region: layout, labels, card order, states. Fix the differences.
3. **Click every new interaction**, including the empty states, the disabled states and Undo. Reload the page to check that persisted changes survive, then use "Reset demo".
4. **Walk the new tour and one older tour.** Run the click-through from the browser console script in your notes: find each step's target, click it, and confirm the card advances and the hash is as expected. Long tours take more than 45 s, so start them in the background (`window.__log`) and poll.
5. **Console:** `read_console_messages` with `onlyErrors` must be empty, apart from the Babel "deoptimised" note.
6. **Non-DS flags:** open Prototype settings (gear) and switch "Show non-DS parts" on, check that every new custom part is flagged, then switch it off again.
7. **Screenshots in the pane can lag** while WebGL or the map is drawing. Re-take the screenshot or check the DOM before calling something broken.

## 3. After merge
Open `https://shinyc01.github.io/catalyst-prototype/` about a minute after `finish`, check that the new flow is listed in Prototype settings (gear), then give the user the link.
