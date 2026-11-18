/* Shared UI: kit imports, NDS flag, flow-level data (Cooper scripts, idea alternatives).
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
const {
  AppShell, NavBar, PageTop, HomeRowCard, SegmentedControl, IconButton, Button, ProgressBar, Calendar, BottomSheet,
  ExploreHeader, MapToolbar, MapToolCluster, MapToolButton, FtaButton, FloatingBar, AgentWindow, Badge, StatCard,
  ContentCard, Panel, NavItem, NavSubtitle, Switch, Select, LineChart, BarChartItem, InfoHintItem, ChatCompactPanel,
  UserMessage, CooperMessage, CooperProgress, PageHeader, Stepper, Indicator, Slider, EmptyState, SplitButton, DataVizCard, VerticalBarChartItem,
  Icon, Tooltip, Menu, ActionMenu, Modal, Drawer, Chip, Avatar, TextField, DatePicker,
} = IFS;
const { useState, useEffect, useRef, useMemo } = React;
const toast = IFS.toast;

/* Risk model, area grid, lens catalogue and study helpers live in ../shared/catalyst-model.js (Whistler demo data in ../shared/whistler-data.js; additions in ../shared/whistler-additions.js). */

/* ============================================================ Command data */
const STAGES = ['Command', 'Value', 'Explore', 'Build', 'Plan', 'Results'].map(l => ({ value: l.toLowerCase(), label: l }));
// Formatting (money in whole dollars → $20.4M / $860K; value is a framework score, never $)
// fmtMoney / fmtValue / invById come from shared/whistler-command.js
const spanYears = alt => { const a = alt.firstSpendDate.slice(0, 4), b = alt.lastSpendDate.slice(0, 4); return a === b ? a : `${a}–${b}`; };
const IDEA_INV = invById(CLUSTER.ideaInvestmentId);                                   // Pad-Mount Transformer Replacement Program V2
const IDEA_ALTS = WHISTLER_ALTERNATIVES.filter(a => a.investmentId === IDEA_INV.id);   // Aggressive / Median / Minimal (real)
const ALT_DESC = {                                                                     // [Added] one-line descriptions
  'Aggressive Replacement': 'Replaces all 12 pad-mount transformers in Alpine Meadows over three years. Highest cost and the largest risk reduction.',
  'Median Replacement': 'Replaces the 6 units in the worst condition first, starting with PM-0010 and PM-0006, and monitors the rest.',
  'Minimal Replacement': 'Replaces only the 3 most critical units and monitors the rest. Lowest cost, but most of the aging fleet stays in service.',
};

// Command content per persona lives in shared/whistler-command.js (COMMAND, PERSONAS)

/* ============================================================ Cooper scripts */
const LENS_SCRIPT = [
  { text: 'Which risk or what-if should I add to the Alpine Meadows study? Pick a suggestion or describe your own lens.',
    options: { title: 'Suggested lenses', items: ['EV load growth · 4 similar studies', 'Wildfire hazard · 3 similar studies', 'Vegetation encroachment'] } },
  { steps: ['Finding comparable studies', 'Checking forecast sources'], total: 3,
    text: 'I found 4 similar studies. To model this I need a load forecast. Which source should I use?',
    options: { title: 'Forecast source', items: ['ICE-to-EV forecast v4 (feeder level)', 'CER Energy Futures 2026 (national)'] } },
  { steps: [`Applying lens to ${ASSETS.length} assets`], start: 3, total: 3, final: true },
];
const IDEA_SCRIPT = [
  { text: 'Let’s turn this study into an investment idea. What should it set out to do?',
    options: { title: 'Intent', items: ['Replace all 12 pad-mounts before failure', 'Replace the worst units first', 'Minimal replacement, monitor the rest'] } },
  { steps: ['Reading your study'], total: 1, text: 'Over what horizon — and is there a spend limit?',
    options: { title: 'Horizon', items: ['10 years', 'As fast as budget allows', 'Best risk-per-dollar'] } },
  { steps: ['Checking budget envelope'], total: 1, text: 'If the budget gets tight, what gives?',
    options: { title: 'Trade-off', items: ['Defer volume rather than breach the envelope', 'Hold the pace', 'Cut scope to the worst units'] } },
  { steps: ['Gathering study findings', 'Matching enterprise goals', 'Drafting the idea'], total: 3, final: true },
];
const EV_ANSWERS = ['EV load growth · 4 similar studies', 'ICE-to-EV forecast v4 (feeder level)'];
const IDEA_ANSWERS = ['Replace the worst units first', '10 years', 'Defer volume rather than breach the envelope'];
// First answer → which real alternative Cooper recommends
const altForIntent = t => IDEA_ALTS.find(a => a.name.startsWith(/all 12|before failure/i.test(t || '') ? 'Aggressive' : /worst/i.test(t || '') ? 'Median' : 'Minimal'));

function finalOr(kind, step, answers, lenses) {
  if (!step.final) return { text: step.text, options: step.options };
  if (kind === 'lens') {
    const before = lenses.filter(l => l.id !== 'ev');
    const a = study(lenses, END), b = study(before, END);
    const moved = a.now.rows.filter((r, i) => r.band.min > b.now.rows[i].band.min).map(r => r.a.label);
    return { text: `I’ve added EV load growth as a custom lens and switched it on. By ${END} it adds ${a.now.score - b.now.score} points to the Alpine Meadows risk score${moved.length ? ` and moves ${moved.join(', ')} up a risk band` : ''}. ${a.now.over} assets are now over tolerance by ${END}, up from ${b.now.over}.`,
      metrics: [{ category: `Risk score ${END}`, value: `${b.now.score} → ${a.now.score}` }, { category: `Over tolerance ${END}`, value: `${b.now.over} → ${a.now.over}` }],
      followUps: ['Compare with Extreme Heat', 'What if growth is 30%?'] };
  }
  const a = study(lenses, END);
  return { text: `Your idea is ready: “${IDEA_INV.name}”, recommending ${altForIntent(answers[0]).name}. I’ve carried over the study’s ${a.act.length} lenses, the ${a.now.over} assets over tolerance by ${END}, and your answers, and drafted the need, goals and a recommended alternative.`,
    metrics: [{ category: `Risk score ${END}`, value: String(a.now.score) }, { category: 'Over tolerance', value: `${a.now.over}/${ASSETS.length}` }], openBuild: true };
}
function replay(kind, answers, lenses) {
  const script = kind === 'lens' ? LENS_SCRIPT : IDEA_SCRIPT;
  const msgs = [{ role: 'cooper', ...script[0] }];
  answers.forEach((a, i) => { msgs.push({ role: 'user', text: a }); msgs.push({ role: 'cooper', ...finalOr(kind, script[i + 1], answers, lenses) }); });
  return { kind, msgs, i: answers.length, busy: false, done: true, answers };
}

/* ============================================================ non-DS flag */
const NDS = ({ label, children, style, className = '' }) => <div className={`nds ${className}`} data-label={label} style={style}>{children}</div>;
