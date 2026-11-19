(window.FLOWS = window.FLOWS || []).push({
  id: 'results-comparison',
  title: 'J18 · Plan · Results analysis and scenario comparison',
  summary: 'The optimization has finished. The Portfolio Owner compares the scenarios side by side, reads Cooper’s evaluation and its evidence, checks what changes per investment, clears the open questions and selects the final plan.',
  persona: 'portfolio',
  added: '2026-11-19', addedBy: 'Shiny',
  sources: [
    { label: 'Journey J18 (Portfolio Owner) — saved verbatim', url: 'context/flows/results-comparison.md' },
    { label: 'Figma · Compare — Scenario comparison', url: 'https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-55947' },
    { label: 'Figma · Compare — Evidence chain', url: 'https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=85-58438' },
  ],
  steps: [
    { hash: '#plan-compare?persona=portfolio&demo=optimized', target: '.plan-cards', advance: 'next', title: 'See the scenarios side by side',
      body: 'The requested plan and the optimized scenarios: CAPEX, investments on schedule, value and retained risk, all from the real Demo Portfolio runs.' },
    { target: { text: 'Cooper’s evaluation' }, title: 'Get the expert read', body: 'Cooper says which scenario it would pick and why.' },
    { target: { text: 'Evidence chain', exact: true }, title: 'Check the reasoning', body: 'The evidence behind the evaluation, and how strong it is.' },
    { target: '.page-dock .ifs-trc-solution__title--cooper', title: 'Answer the open questions',
      body: 'Is the retained risk acceptable? Accept it, reduce it further, or prioritize critical risk.' },
    { target: { text: 'Investments', exact: true }, title: 'Drill into the investments',
      body: 'What moves in the chosen scenario: deferred, advanced or on a different alternative, grouped by how much they shift.' },
    { target: '[aria-label^="Select Min"]', title: 'Choose', body: 'Select Cooper’s pick as the final plan. Send for approval unlocks (J21 takes it from there).' },
  ],
});
