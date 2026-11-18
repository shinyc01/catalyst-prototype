# Registering a flow and its guided tour

Every mini flow stays a flow: it is listed under **Flows and guided tours** in Prototype settings (the gear in the NavBar), and **Start tour** walks a tester through it.

## File
Create `app/flows/NNN-<id>.js`, using the next free number and a kebab-case id. It is plain JS with no JSX:

```js
(window.FLOWS = window.FLOWS || []).push({
  id: 'build-review-approve',              // unique
  title: 'J12 · Build · Review and approve', // journey ID first (when the mini flow has one), shown in the panel and on the tour card
  summary: 'One sentence: what the user achieves.',
  persona: 'owner',                        // owner | asset | portfolio (PERSONAS in shared/whistler-additions.js)
  added: '2026-11-20', addedBy: 'Mahsa',   // who fed the mini flow
  sources: [{ label: 'Figma', url: '…' }, { label: 'Mini flow', url: '…' }],
  steps: [
    { hash: '#build', target: { text: 'Send for review' }, title: 'Send it for review', body: 'What happens and why it matters.' },
    { target: '[aria-label="Remind Ravi Banerjee"]', title: '…', body: '…' },
    { title: 'Done', body: 'Closing sentence.', advance: 'next' },
  ],
});
```

Then run `python3 -I scripts/manifest.py`. This regenerates `app/flows/index.js`, so never edit that file by hand.

## Steps
- `hash`: where this step starts. The first step must have one; later steps usually follow the user's own navigation.
- `target`: what to highlight. Use one of:
  - a CSS selector, preferring stable attributes: `[aria-label="…"]`, a class you add for the purpose, or `:nth-child`;
  - `{ text: 'Button text' }`, which matches the visible button, tab, menu item, option or day whose text starts with it (add `exact: true` for an exact match).
- `until: '#screen'`: the step moves on by itself once the app reaches that hash (use it when the user must type or do several things, e.g. search → open). Highlight the whole area they work in.
- `advance`: clicking the target moves on (the default). Use `'next'` when the step is only an explanation, or when the click would leave the page in a state the next step can't use.
- **Copy:** short and plain. Say what to do and what to notice: "Switch Extreme Heat off and on. The squares change, because…".
- **Connect the flow into the app.** Build the way in and the way out (the entry button on the screen before, and what the last step leads to), not only the screens the mini flow names. The tour should start from the natural entry point.
- **Targets below the fold** are scrolled into view automatically by the tour; still check each one is reachable.
- **Every step must be reachable** by following the steps from a fresh start: after "Reset demo", using the persona the flow names.
- **Walk the tour** end to end in the browser pane (`references/testing.md`) before publishing. Keep older tours working: if you rename a button or label that an older flow targets, update that flow file too (`grep -rn "<old text>" app/flows`).
