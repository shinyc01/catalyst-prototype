# Catalyst — working prototype

A working mock of **Catalyst** (IFS Copperleaf) that grows flow by flow, for usability tests, demos and marketing. It is built with **Catalyst Design System 2.0** on one consistent set of demo data (Alder Ridge Energy).

**Live:** https://shinyc01.github.io/catalyst-prototype/ — share this link for tests and demos (updates about a minute after each publish)

## Using it
- **Prototype settings** open from the **gear icon** in the top bar. They hold:
  - **Persona**: Investment Owner (Hollis Grant), Asset Manager (Mara Delgado) or Portfolio Owner (Owen Fitch).
  - **Flows and guided tours**: every mini flow added so far. Press **Start tour** to be guided through one step by step.
  - **Show non-DS parts**: off by default. Turn it on to outline the parts that aren't in the design system yet.
  - **Reset demo**: clears everything you changed in this browser (snoozed cards, added events, created ideas).
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
