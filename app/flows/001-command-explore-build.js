/* Flow: Command → Explore → Build (the original journey). Spec: context/flows/command-explore-build.md
   Step fields: hash (screen to open first), target (CSS selector or { text: 'Button text' }), title, body,
   advance: 'click' (default when there is a target: clicking the target moves on) or 'next' (only the Next button). */
(window.FLOWS = window.FLOWS || []).push({
  id: 'command-explore-build',
  title: 'Command → Explore → Build',
  summary: 'From Cooper’s #1 decision to a drafted investment idea: explore the Alpine Meadows cluster, study it with risk lenses, add a custom lens, and let Cooper draft the idea.',
  persona: 'owner', added: '2026-11-16', addedBy: 'Shiny',
  sources: [
    { label: 'Confluence', url: 'https://copperleaf.atlassian.net/wiki/spaces/PM/pages/5570592781/Command+-+Explore+-+Build' },
    { label: 'Figma', url: 'https://www.figma.com/design/RIgfAXt18AXHLu8s0wuvQ1' },
  ],
  steps: [
    { hash: '#command', target: '.cmd-row.featured', title: 'Cooper’s #1 decision', body: 'Cooper flagged the Alpine Meadows cluster: 23 aging assets, two transformers already past tolerance. Open it.' },
    { target: { text: 'Study area' }, title: 'Explore the cluster', body: 'The map shows the network coloured by asset risk. Study the area to see what drives the risk.' },
    { target: '[aria-label="Include Extreme Heat"]', title: 'Lenses are external influences', body: 'Switch Extreme Heat off and on. The squares and the numbers change, because every lens adds to the total risk.' },
    { target: '[aria-label="Play horizon"]', title: 'Play the 10-year horizon', body: 'Watch the risk grow year by year. A notification appears when an asset crosses its intervention tolerance.' },
    { target: '[aria-label="Add custom lens"]', title: 'Add your own lens', body: 'Ask Cooper for a what-if lens.' },
    { target: { text: 'EV load growth' }, title: 'Pick EV load growth', body: 'Cooper suggests lenses used in similar studies.' },
    { target: { text: 'ICE-to-EV forecast v4' }, title: 'Choose a forecast source', body: 'The lens is added and switched on, and the map updates.' },
    { target: { text: 'Create idea' }, title: 'Turn the study into an idea', body: 'Cooper asks three questions and drafts the investment idea.' },
    { target: { text: 'Replace the worst units first' }, title: 'What should it do?', body: 'Your answer picks the recommended alternative.' },
    { target: { text: '10 years' }, title: 'Horizon', body: '' },
    { target: { text: 'Defer volume' }, title: 'If the budget is tight', body: '' },
    { target: { text: 'Open in Build' }, title: 'Open the idea', body: 'The idea carries the study’s lenses and results into Build.' },
    { title: 'The idea in Build', body: 'The need, affected assets, the recommended alternative and how it compares with the rest of the portfolio — all from the same data you just studied.', advance: 'next' },
  ],
});
