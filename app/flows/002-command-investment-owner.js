/* Flow: Command for the Investment Owner. Spec: context/screens/command.md + command-figma-spec.md (section 2–8) */
(window.FLOWS = window.FLOWS || []).push({
  id: 'command-investment-owner',
  title: 'Command · Investment Owner',
  summary: 'Prioritise decisions, snooze or archive a card, remind a reviewer, and add a private event to the calendar.',
  persona: 'owner', added: '2026-11-17', addedBy: 'Shiny',
  sources: [{ label: 'Figma', url: 'https://www.figma.com/design/QSh5FbHQ86rlWo0ViZCIDR' }],
  steps: [
    { hash: '#command', target: '.cmd-row:nth-child(2) .cmd-handle', title: 'Re-rank by dragging', body: 'Hover a card to see its handle, then drag it up or down. The ranks renumber.', advance: 'next' },
    { target: '[aria-label="Sort and filter"]', title: 'Sort and filter', body: 'Sort by urgency, date, source or collaborator. The chips next to the title change with the sort.' },
    { target: { text: 'Sort by source' }, title: 'Sort by source', body: 'Shows only the decisions that came from one stage, for example Explore.' },
    { target: '[aria-label="Sort and filter"]', title: 'Back to urgency', body: 'Open the menu again…' },
    { target: { text: 'Sort by urgency' }, title: '…and pick Sort by urgency', body: '' },
    { target: '.cmd-row:nth-child(2) .cmd-kebab button', title: 'Card actions', body: 'Each decision has a menu.' },
    { target: { text: 'Remind me later' }, title: 'Remind me later', body: 'The card is snoozed for 7 days. You can undo it from the toast.' },
    { target: { text: 'Conversations' }, title: 'Conversations', body: 'Responses from your collaborators.' },
    { target: '[aria-label^="Remind "]', title: 'Nudge a reviewer', body: 'The bell sends a reminder and shows when you last notified them.' },
    { target: { text: 'Add event', exact: true }, title: 'Add a private event', body: 'Only you see private events.' },
    { target: '[role=dialog]', title: 'Fill in the event', body: 'Name, date and time are needed before Add is enabled. The new event shows as a blue line on its day.', advance: 'next' },
  ],
});
