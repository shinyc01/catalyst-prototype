(window.FLOWS = window.FLOWS || []).push({
  id: 'filing-baseline',
  title: 'J23 · Plan · Publish the baseline',
  summary: 'With every gate approved, the Capital Planning Manager publishes the plan as the budget baseline and the owners hear about their allocations. The regulator Result Pack and exports are specification only and not built.',
  persona: 'cpm',
  added: '2026-11-20', addedBy: 'Shiny',
  sources: [
    { label: 'Journey J23 (Capital Planning Manager) — saved verbatim', url: 'context/flows/filing-baseline.md' },
    { label: 'Figma · Approved — Publish / Schedule', url: 'https://www.figma.com/design/Dv3HzkcFTTrb4E34zLF7cy/?node-id=84-108890' },
  ],
  steps: [
    { hash: '#plan-approve?persona=cpm&demo=approved', target: '[data-gate="executive"]', advance: 'next', title: 'Every gate passed',
      body: 'Executive, Technical and Financial have approved. Publish is enabled.' },
    { target: { text: 'Publish', exact: true }, title: 'Publish', body: 'Publish now, or pick a date and time to schedule it for the cycle start.' },
    { target: { text: 'Publish now', exact: true }, title: 'Make it the baseline', body: 'The plan becomes the active budget baseline.' },
    { target: '[aria-label^="Notifications"]', title: 'Owners hear about it', body: 'Cooper tells the owners of the funded and deferred investments about their allocations.' },
    { hash: '#plan?persona=cpm', target: '.page', advance: 'next', title: 'The cycle is published',
      body: 'Plan home shows the cycle as published. The regulator Result Pack (Cooper-drafted, signed off with a frozen provenance snapshot) and exports are specified in Results but not designed yet.' },
  ],
});
