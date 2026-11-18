/* Flows: Command for the Asset Manager and the Portfolio Owner. Spec: command-figma-spec.md sections 10–11 */
(window.FLOWS = window.FLOWS || []).push({
  id: 'command-asset-manager',
  title: 'Command · Asset Manager',
  summary: 'See asset health and risk on each decision, and follow asset cohorts against their useful life.',
  persona: 'asset', added: '2026-11-17', addedBy: 'Shiny',
  sources: [{ label: 'Figma', url: 'https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR' }],
  steps: [
    { hash: '#command?persona=asset', target: '.cmd-row.featured', title: 'Health index and risk', body: 'For the asset manager, each decision shows the health index (0–10) and the expected cost of failure with its uncertainty.', advance: 'next' },
    { target: { text: 'Following' }, title: 'Followed asset cohorts', body: 'Pad-mounts, Pine Ridge spans and the station banks, with age against useful life.' },
    { target: { text: 'Conversations' }, title: 'Field updates', body: 'Inspections and backfills from the field crews.' },
  ],
}, {
  id: 'command-portfolio-owner',
  title: 'Command · Portfolio Owner',
  summary: 'Approve funding and check each plan’s 2028 CAPEX against its cap.',
  persona: 'portfolio', added: '2026-11-17', addedBy: 'Shiny',
  sources: [{ label: 'Figma', url: 'https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR' }],
  steps: [
    { hash: '#command?persona=portfolio', target: '.cmd-row.featured', title: 'Approvals to decide', body: 'Forecast against constraint, and the total value at stake.', advance: 'next' },
    { target: { text: 'Following' }, title: 'Followed plans', body: 'Each plan’s 2028 CAPEX against the cap, and the value kept versus deferred.' },
  ],
});
