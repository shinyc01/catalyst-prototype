# Catalyst — working prototype

A working mock of **Catalyst** (IFS Copperleaf) that grows flow by flow, for usability tests, demos and marketing. It is built with **Catalyst Design System 2.0** on one consistent set of demo data (Alder Ridge Energy).

**Live:** https://shinyc01.github.io/catalyst-prototype/ (updates about a minute after each publish)

## Using it
- **Prototype controls** sit at the bottom centre:
  - **Persona**: Investment Owner (Hollis Grant), Asset Manager (Mara Delgado) or Portfolio Owner (Owen Fitch).
  - **Flows** lists every mini flow added so far. Pick one and press **Start tour** to be guided through it step by step.
  - **Present** hides the prototype controls and the "Not in DS" flags. To exit, click the small dot at the bottom left.
  - **Reset demo** clears everything you changed (snoozed cards, added events, created ideas).
  - **Non-DS** shows or hides the flags on parts that aren't in the design system yet.
- **Links** point to a single screen and state, e.g. `#study?year=2031` or `#command?persona=asset`.

## Adding a flow (Shiny, Mahsa)
Open this folder in Claude Code and say, for example: *"Add this flow to the prototype"*. Then paste the mini flow and its Figma links. The **catalyst-flow-builder** skill does everything else:
- builds the screens, data and guided tour;
- tests them;
- updates the context;
- publishes safely to GitHub without overwriting anyone's work.

**First time on a new computer:** ask Claude Code to *"set up the Catalyst prototype on this computer"*. It installs and checks what's needed. You'll be asked to log in to GitHub once in your browser.

## What's where (for Claude)
See `CLAUDE.md`.
