/* Build (J07 · Investment Creation): Idea Pad rows, the Input step's context rules, Shape's open questions.
   Names, codes, types, horizons and dates are REAL Whistler records; statuses, collaboration and the context % rules are [Added] / [Assumed]
   and documented in context/logic/build.md. */

// ---- Idea Pad: the Whistler investments still at the idea stage ("Initial"), plus the ideas this browser created (Build state)
const STORY_DAY = '2026-11-17';                                    // [Added] story today, as an ISO day (STORY_DATE)
const fyOf = d => `FY${String(d).slice(2, 4)}`;
const ideaHorizon = id => { const s = WHISTLER_SELECTED_SPEND[id]; return s ? `${fyOf(s.firstSpendDate)}–${fyOf(s.lastSpendDate)}` : '—'; };
const ideaDay = d => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
// [Added] statuses, in a fixed order so every browser shows the same Idea Pad (Figma: New, Under review 0/4, Shaping, Deferred, Rejected)
const IDEA_STATUS = {
  new: { type: 'blue', label: 'New' }, shaping: { type: 'purple', label: 'Shaping' }, review: { type: 'orange', label: 'Under review' },
  deferred: { type: 'grey', label: 'Deferred' }, rejected: { type: 'grey', label: 'Rejected' }, dismissed: { type: 'grey', label: 'Dismissed' },
};
const SEED_STATUS = ['new', 'review', 'shaping', 'deferred', 'new', 'rejected', 'shaping', 'new', 'review', 'deferred'];
// [Added] who is waiting on what (Figma Collaboration column)
const SEED_COLLAB = { 1: { by: 'LF', label: 'Provide asset condition', text: 'Can you confirm the last inspection dates before I cost this?' },
  3: { by: 'NL', label: 'View reply', text: 'Added the 2025 spend actuals you asked for.' }, 8: { by: 'PI', label: 'Provide asset health', text: 'The health scores for these units are from 2022. Do you have newer ones?' } };
const IDEA_SEEDS = WHISTLER_INVESTMENTS.filter(i => i.stage === 'Initial' && i.id !== CLUSTER.ideaInvestmentId).map((i, k) => ({
  id: i.id, code: i.code, name: i.name, type: i.type || 'Project', status: SEED_STATUS[k % SEED_STATUS.length], horizon: ideaHorizon(i.id),
  modified: i.createdDate, collab: SEED_COLLAB[k] || null, reviewers: SEED_STATUS[k % SEED_STATUS.length] === 'review' ? { done: 0, total: 4 } : null,
}));
// The idea Cooper drafts in the Input step is the pad-mount program (the cluster's idea investment, as in J03 + J06)
const NEW_IDEA = { id: CLUSTER.ideaInvestmentId, code: invById(CLUSTER.ideaInvestmentId).code, name: invById(CLUSTER.ideaInvestmentId).name,
  type: invById(CLUSTER.ideaInvestmentId).type || 'Program', horizon: ideaHorizon(CLUSTER.ideaInvestmentId) };
// ideas = { [id]: { status, modified, created } } kept per browser; seeds + created ideas, minus dismissed ones
function ideaPadRows(ideas) {
  const rows = IDEA_SEEDS.map(r => ({ ...r, ...(ideas[r.id] || {}) }));
  if (ideas[NEW_IDEA.id]) rows.unshift({ ...NEW_IDEA, collab: null, reviewers: null, ...ideas[NEW_IDEA.id], mine: true });
  return rows.filter(r => r.status !== 'dismissed');
}

// ---- Input step: Cooper's context. [Assumed] rules: each kind of input adds context; 100% = READY (a threshold, not a limit)
const CONTEXT_GAIN = { start: 20, need: 35, detail: 25, file: 25, selection: 60 };
const INPUT_GREETING = 'What would you like to look into? Start with an area, asset, risk, or question — I’ll help you understand what’s changing and where attention may be needed.';
const INPUT_STARTS = ['Areas with outdated information', 'Areas where risks are increasing', 'Areas with changing conditions'];
const padmounts = () => ASSETS.filter(a => a.type === 'padmount');
// Cooper's replies, built from the risk model so the numbers match Explore and Study
function inputReply(kind, arg) {
  const s = study(INITIAL_LENSES, END), pm = s.now.rows.filter(r => r.a.type === 'padmount'), over = pm.filter(r => r.over).length;
  if (kind === 'start') {
    const ids = arg === 'Areas with outdated information' ? padmounts().map(a => a.id)
      : s.now.rows.filter(r => r.over).map(r => r.a.id);
    const text = arg === 'Areas with outdated information'
      ? `I found ${Math.max(ids.length, 1)} assets in ${CLUSTER.name} whose condition comes from estimates rather than inspections. The biggest gap is the pad-mount transformers in Alpine Meadows. I’m highlighting them on the map.`
      : arg === 'Areas where risks are increasing'
        ? `Risk is rising fastest in ${CLUSTER.name}: ${s.now.over} of ${ASSETS.length} assets cross their intervention tolerance by ${END}, most of them pad-mount transformers. I’m highlighting them on the map. Which outcome matters most to you here?`
        : `Conditions are changing around ${CLUSTER.name}: new load from EV charging and a longer wildfire season. I’m highlighting the assets most affected. Tell me what you’d like to achieve.`;
    return { text, focus: ids.length ? ids : pm.map(r => r.a.id) };
  }
  if (kind === 'need') return { text: `Got it. ${pm.length} pad-mount transformers in Alpine Meadows serve about ${pm.reduce((t, r) => t + r.a.customers, 0).toLocaleString()} customers, and ${over} of them cross tolerance by ${END}. Do you want to replace them, or keep them running longer? You can also select the assets on the map.` };
  if (kind === 'detail') return { text: 'Thanks, that sets the outcome. If you have an inspection report or field notes, add them, or select the assets on the map so I scope the idea to them.' };
  if (kind === 'file') return { text: `I read ${arg}. It confirms the condition concerns for the Alpine Meadows pad-mounts.` };
  if (kind === 'selection') {
    const n = arg.filter(id => assetById(id).type === 'padmount').length;
    return n ? { text: `I have enough context to create an investment idea for the Alpine Meadows pad-mount transformers. I’ve captured the condition concerns and the outcome you’re looking to achieve.\n\nAnything else you’d like to add, or shall we move to Shape?`, ready: true }
      : { text: 'None of those are pad-mount transformers, and the other assets already belong to investments in Plan. Select the pad-mounts in Alpine Meadows and I’ll draft the idea from them.', none: true };
  }
  return { text: '' };
}
const READY_TEXT = 'I have enough context to create an investment idea for the Alpine Meadows pad-mount transformers. I’ve captured the condition concerns and the outcome you’re looking to achieve.\n\nAnything else you’d like to add, or shall we move to Shape?';

// ---- Shape: System confidence (Figma 43:76732). Gates and open questions [Assumed]; their facts come from the risk model and the real alternatives
const SHAPE_GATES = [{ id: 'complete', label: 'Idea completeness' }, { id: 'assets', label: 'Asset alignment' }, { id: 'need', label: 'Need & urgency' }, { id: 'context', label: 'Cooper’s context' }];
function shapeIssues() {
  const s = study(INITIAL_LENSES, END), first = firstCrossing(activeOf(INITIAL_LENSES));
  const alts = WHISTLER_ALTERNATIVES.filter(a => a.investmentId === CLUSTER.ideaInvestmentId), lo = Math.min(...alts.map(a => a.spendTotal)), hi = Math.max(...alts.map(a => a.spendTotal));
  return [
    { id: 'urgency', kind: 'question', gate: 'need', title: 'Urgency needs confirmation', description: `The action window (first asset over tolerance in ${first || END}) comes from estimated condition. It needs supporting evidence.`, answer: true, upload: true,
      solutions: [{ id: 'field', title: 'Ask field team to confirm urgency', description: `Ask ${PEOPLE.LF.name} (field supervisor) to confirm the action window.`, recommended: true },
        { id: 'provisional', title: 'Adjust urgency to lower confidence', description: 'Keep the action window as an early estimate and mark urgency as provisional until more evidence is added.' },
        { id: 'peer', title: 'Use peer benchmark', description: 'Compare this action window against similar pad-mount programs to confirm urgency.' }] },
    { id: 'cost', kind: 'question', gate: 'need', title: 'Cost needs confirmation', description: `The cost range (${fmtMoney(lo)}–${fmtMoney(hi)}) uses unit costs from the 2028 estimate. Confirm they still hold.`, answer: true, upload: true,
      solutions: [{ id: 'estimator', title: 'Ask the estimator to confirm unit costs', description: `Send the unit costs to ${PEOPLE.NL.name} (capital finance) to confirm.`, recommended: true },
        { id: 'escalate', title: 'Apply this year’s escalation', description: 'Escalate the 2028 unit costs by the planning calendar’s inflation rate.' }] },
    { id: 'docs', kind: 'warning', gate: 'context', title: 'Inspection records are older than 3 years', description: `${padmounts().length} pad-mounts have condition from estimates. Newer inspections would raise Cooper’s confidence.`, okay: true },
    { id: 'goals', kind: 'warning', gate: 'context', title: 'One goal has no measure yet', description: 'Maintain public & worker safety is aligned, but no safety measure is filled in this draft.', okay: true },
  ];
}
