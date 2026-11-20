/* Plan logic: data readiness, outliers, scenario setup and the optimisation run, for the Demo Portfolio 2028 Plan.
   Records are REAL (shared/whistler-plan.js). Everything here is a rule over them; the rules are [Assumed] and documented in
   context/logic/plan.md. Hand-added facts are tagged [Added]. Plain JS, no JSX: loaded before the app. */

const PLAN_CYCLE = '2028 Plan';                                   // [Whistler] every scenario in the set is a "2028 Plan"
const PLAN_OWNER = 'OF';                                          // [Added] Owen Fitch (Portfolio Owner) owns the plan
const PLAN_BASELINE_ID = 1684;                                    // [Whistler] 01_Requested 2028 Plan = what was asked for

/* ---------------------------------------------------------------- the investments as requested */
const CAPITAL_ALTS = ['Replace', 'Refurbish', 'Upgrade', 'Upgrade existing', 'Option A', 'Upgrade (Scope 1)'];
const STUDY_ALTS = ['Investigation', 'Survey', 'Inspection', 'Study', 'Recommended'];
// Class median = the median CAPEX of investments with the same alternative type (only classes with 5+ costed members)
const PLAN_CLASS_MEDIAN = (() => {
  const by = {};
  PLAN_INVESTMENTS.forEach(i => { if (i.capex > 0) (by[i.alternative] = by[i.alternative] || []).push(i.capex); });
  const out = {};
  Object.entries(by).forEach(([k, v]) => { if (v.length >= 5) { const s = [...v].sort((a, b) => a - b); out[k] = s[s.length >> 1]; } });
  return out;
})();

// [Added] Investment owners. The Demo Portfolio has no owners in the source; owners come from the invented people list,
// assigned by a stable rule (investment id), so the same investment always shows the same owner.
const PLAN_OWNERS = ['HG', 'RB', 'KM', 'PI', 'TM', 'LF'];
const planOwnerOf = inv => PLAN_OWNERS[inv.id % PLAN_OWNERS.length];

/* ---------------------------------------------------------------- inconsistencies (data readiness) */
// One issue type per investment (first rule that matches). Each type maps to one Cooper question in System confidence.
const ISSUE_TYPES = {
  study: { label: 'Study work has no cost or value', question: 'q-safe', safe: true },
  noBasis: { label: 'Cost has no estimate basis', question: 'q-basis', action: 'fix' },
  below: { label: null, question: 'q-below', action: 'leave' },                       // label is per investment: "Cost 93% below the class median"
  negValue: { label: 'Value is negative', question: 'q-value', action: 'route' },
};
function planIssueOf(i) {
  if (i.capex === 0 && i.value === 0 && STUDY_ALTS.includes(i.alternative)) return { type: 'study', label: ISSUE_TYPES.study.label };
  if (i.capex === 0 && CAPITAL_ALTS.includes(i.alternative)) return { type: 'noBasis', label: ISSUE_TYPES.noBasis.label };
  const med = PLAN_CLASS_MEDIAN[i.alternative];
  if (med && i.capex > 0 && i.capex < 0.05 * med) return { type: 'below', label: `Cost ${Math.round((1 - i.capex / med) * 100)}% below the class median` };
  if (i.value < 0) return { type: 'negValue', label: ISSUE_TYPES.negValue.label };
  return null;
}

/* ---------------------------------------------------------------- outliers: value for cost */
// Fit log(value) = a + b·log(capex) over costed, valued investments; an outlier sits more than 1.5 standard deviations off the line.
const PLAN_FIT = (() => {
  const pts = PLAN_INVESTMENTS.filter(i => i.capex > 0 && i.value > 0).map(i => ({ id: i.id, x: Math.log(i.capex), y: Math.log(i.value) }));
  const n = pts.length, mx = pts.reduce((s, p) => s + p.x, 0) / n, my = pts.reduce((s, p) => s + p.y, 0) / n;
  const b = pts.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) / pts.reduce((s, p) => s + (p.x - mx) ** 2, 0), a = my - b * mx;
  const sd = Math.sqrt(pts.reduce((s, p) => s + (p.y - (a + b * p.x)) ** 2, 0) / n);
  const off = Object.fromEntries(pts.map(p => [p.id, (p.y - (a + b * p.x)) / sd]));
  return { a, b, sd, off, k: 1.5 };
})();
const planIsOutlier = i => Math.abs(PLAN_FIT.off[i.id] || 0) > PLAN_FIT.k;
const median = arr => { const s = [...arr].sort((a, b) => a - b); return s.length ? s[s.length >> 1] : 0; };
const PLAN_MEDIAN_COST = median(PLAN_INVESTMENTS.filter(i => i.capex > 0).map(i => i.capex));
const PLAN_MEDIAN_VALUE = median(PLAN_INVESTMENTS.filter(i => i.value > 0).map(i => i.value));

// The rows Setup shows: every requested investment with its issue, outlier flag, owner and schedule
const PLAN_ROWS = PLAN_INVESTMENTS.map(i => ({ ...i, issue: planIssueOf(i), outlier: planIsOutlier(i), owner: planOwnerOf(i),
  estimate: PLAN_CLASS_MEDIAN[i.alternative] || null }));          // Cooper's estimate for a cost with no basis = the class median [Assumed]
const planRowsWith = type => PLAN_ROWS.filter(r => r.issue && r.issue.type === type);

// Row state (what a tester did): open | ignored | fixed | excluded | kept | sent | ownerFixed
const ROW_RESOLVED = ['ignored', 'fixed', 'excluded', 'kept', 'ownerFixed'];
const planRowOpen = (r, st) => r.issue && !ROW_RESOLVED.includes(st[r.id] || 'open');

/* ---------------------------------------------------------------- System confidence: gates, questions, warnings */
const PLAN_GATES = [{ id: 'data', label: 'Data readiness' }, { id: 'groups', label: 'Planning groups' }, { id: 'scen', label: 'Scenarios setup' }];

/* ---------------------------------------------------------------- scenarios to optimise (Setup › Scenarios) */
// [Whistler] five real scenarios of the 2028 Plan, from least to most spend. Descriptions are [Added] plain-language summaries.
const SETUP_SCENARIOS = [
  { id: 54824, short: 'Min CAPEX', desc: 'Spends as little capital as possible while still meeting the risk and reliability targets. CAPEX is capped at zero from 2027, so the optimizer looks for the cheapest way to meet them.' },
  { id: 1685, short: 'CAPEX −5%', desc: 'The Baseline envelope with the CAPEX cap lowered by 5% from 2028 to 2032. Resource and risk limits stay the same.' },
  { id: 6864, short: 'Optimized', desc: 'The Baseline envelope: CAPEX, OPEX, project manager hours and the risk caps as the plan sets them. Alternatives and timing may change.' },
  { id: 7286, short: 'Add. CAPEX', desc: 'Same limits as Optimized, tuned to show how much extra capital it takes to meet every target.' },
  { id: 54504, short: 'Decarbonization', desc: 'Same limits as Optimized, with value weighted towards emissions reduction.' },
].map(s => ({ ...s, ...PLAN_SCENARIOS.find(x => x.id === s.id) }));

// Constraint categories for the table's filter chips
const CONSTRAINT_CATEGORY = { 'CAPEX Cost': 'cost', 'OPEX Cost': 'cost', 'Total Investment Cost': 'cost', 'Maintenance-Cost (OPEX)': 'cost',
  'Project Manager Hours Required': 'resource', 'Field Crew Hours.': 'resource', 'Aggregate Risk': 'strategic', 'Reliability-Risk': 'strategic',
  'CMI.': 'strategic', 'GHG Emissions Reduction.': 'strategic', 'Field Crew Hours': 'resource', 'CMI': 'strategic', 'GHG Emissions Reduction': 'strategic' };
const CONSTRAINT_UNIT = m => /Cost|OPEX|CAPEX/.test(m) ? '$' : /Hours/.test(m) ? 'Hours' : 'Value units';
const SETUP_YEARS = PLAN_YEARS.filter(y => y >= 2028 && y <= 2032);   // [Whistler] the years the constraints are set for (2024–2027 carry only some caps)
// Initial constraint rows of a scenario: its real min/max per year (only measures that have a limit)
function planConstraintsOf(sid) {
  const s = PLAN_SCENARIOS.find(x => x.id === sid);
  return s.outcomes.filter(o => [...o.min, ...o.max].some(v => v != null)).map(o => {
    const def = PLAN_CONSTRAINT_DEFS.find(d => d.valueMeasureId === o.measureId && d.portfolioId === PLAN_PORTFOLIO.id) || {};
    return { id: `${sid}-${o.measureId}`, measureId: o.measureId, measure: o.measure, type: def.type || 'Outcome', unit: CONSTRAINT_UNIT(o.measure),
      years: Object.fromEntries(SETUP_YEARS.map(y => { const k = PLAN_YEARS.indexOf(y); return [y, { min: o.min[k], max: o.max[k] }]; })) };
  });
}
// Real constraint definitions the portfolio has but these scenarios don't set yet (offered when adding a constraint)
const PLAN_UNUSED_DEFS = PLAN_CONSTRAINT_DEFS.filter(d => d.portfolioId === PLAN_PORTFOLIO.id
  && !PLAN_SCENARIOS[0].outcomes.some(o => o.measureId === d.valueMeasureId));
// The scenario's requested outcome by year (to show headroom against a cap)
const planOutcome = (sid, measureId) => (PLAN_SCENARIOS.find(x => x.id === sid).outcomes.find(o => o.measureId === measureId) || {}).byYear;

// [Added] restriction defaults per scenario (the source holds no optimizer settings)
const SETUP_RESTRICTIONS = { altChanges: true, interpolate: false, shiftDates: true, maxShift: 3, granularity: 'Years' };
// Planning groups: the real groups of the Requested scenario, and which are open to the optimizer by default [Added]
const PLAN_BASE_GROUPS = ['Under Consideration', 'New to Scenario', 'Required by Management', 'Executing', 'Blankets'];
const PLAN_ADJUSTABLE = ['Under Consideration', 'New to Scenario'];
const PLAN_GROUP_INFO = {                                            // [Figma] 85:159619 text for Required by management; the others [Added]
  'Under Consideration': { desc: 'Competing for funding. The optimizer may fund, defer or drop each one.', principles: ['No mandate record', 'Has an estimate basis', 'Not yet executing'] },
  'New to Scenario': { desc: 'Approved in Build this cycle. They compete for funding like Under consideration.', principles: ['Approved in Build', 'Recommended alternative set'] },
  'Required by Management': { desc: 'Decided outside the plan. The optimizer skips these — their alternative, start date and funding stay exactly as the scenario holds them.', principles: ['Mandate record exists', 'No purchase order raised', 'Approved cost estimate present'] },
  'Executing': { desc: 'Already under way. Kept as the scenario holds them.', principles: ['Purchase order raised', 'Execution has started'] },
  'Blankets': { desc: 'Recurring budget lines (emergency capital). Kept as the scenario holds them.', principles: ['Blanket budget line'] },
};
// J15 · Cooper-detected groupings [Added] from real Under Consideration records; the matching rules are [Assumed] (open question 71).
//  - Programme: three Neptune Station capacity jobs, consecutive project numbers (P3772–P3774), all start Jun 2028.
//  - Mandate: the primary SCADA upgrade and its training programme cite the SCADA mandate [Added].
const PLAN_PROGRAMME = { ids: [137729, 137730, 137731], label: 'Neptune Station capacity programme' };
const PLAN_MANDATE = { ids: [137611, 137781] };
const PLAN_GROUP_ISSUES = [
  { id: 'g-prog', kind: 'question', gate: 'groups', title: '3 Neptune Station jobs form one programme',
    description: 'They share Neptune Station, start together in Jun 2028 and carry the same value driver. Funded apart they leave gaps in the same station’s capacity.',
    solutions: [{ id: 'group', title: 'Create a group from this match', description: 'They stop competing for funding and forced into every scenario.', recommended: true },
      { id: 'move', title: 'Move to “Required by management”', description: 'Forced in. Stops competing for funding.' },
      { id: 'leave', title: 'Leave them competing', description: 'The optimizer may fund some and drop the others.' }] },
  { id: 'g-mandate', kind: 'question', gate: 'groups', title: 'Executive mandate cited for 2 investments',
    description: 'The primary SCADA system upgrade and its training and change management cite the SCADA mandate, but they sit in Under consideration, so the optimizer may drop them.',
    solutions: [{ id: 'move', title: 'Move to “Required by management”', description: 'Forced in. Stops competing for funding.', recommended: true },
      { id: 'leave', title: 'Leave them competing', description: 'The optimizer may fund or drop them like any other.' }] },
];
// What the answers did (derived from the saved System confidence state, so Undo restores it): moved investments and created groups
const planStore = () => (typeof Store !== 'undefined' ? Store.get('plan.confidence', {}) : {}) || {};
function planGrouping(saved = planStore()) {
  const moves = {}, created = [], names = (typeof Store !== 'undefined' && Store.get('plan.groupNames', {})) || {};
  const p = (saved['g-prog'] || {}).applied, m = (saved['g-mandate'] || {}).applied;
  if (p === 'group') { const label = names[PLAN_PROGRAMME.label] || PLAN_PROGRAMME.label; created.push(label); PLAN_PROGRAMME.ids.forEach(id => { moves[id] = label; }); }
  if (p === 'move') PLAN_PROGRAMME.ids.forEach(id => { moves[id] = 'Required by Management'; });
  if (m === 'move') PLAN_MANDATE.ids.forEach(id => { moves[id] = 'Required by Management'; });
  return { moves, created, matched: p ? [] : PLAN_PROGRAMME.ids };
}
const planInvestmentsWith = (extra = [], saved) => { const { moves } = planGrouping(saved); return extra.concat(PLAN_INVESTMENTS).map(i => moves[i.id] ? { ...i, planningGroup: moves[i.id] } : i); };
const planGroups = (extra = [], saved) => {
  const all = planInvestmentsWith(extra, saved), { created } = planGrouping(saved);
  return PLAN_BASE_GROUPS.concat(created).map(g => ({ id: g, label: g, count: all.filter(i => i.planningGroup === g).length,
    adjustable: PLAN_ADJUSTABLE.includes(g), created: created.includes(g),
    ...(PLAN_GROUP_INFO[g] || { desc: 'Created from Cooper’s match. Funded together and forced into every scenario.', principles: ['Same station', 'Same start window', 'Same value driver'] }) }));
};
const PLAN_GROUPS = planGroups([], {});
// Build → Plan hand-off [Confirmed] (Shiny, 2026-11-19): an investment belongs to a portfolio (the company structure) from the moment it is created,
// but it joins the planning cycle only once it is approved. The approved Build investment (refine.status 'approved') joins as "New to Scenario",
// the real group new investments sit in, with its recommended alternative. The optimisation results stay those of the real run [Assumed].
const planFromBuild = (refine, others = {}) => [[CLUSTER.ideaInvestmentId, refine], ...Object.entries(others || {}).map(([id, r]) => [+id, r])]
  .filter(([, r]) => r && r.status === 'approved').map(([id, r]) => {
    const R = rfContext(id), a = R.alt(r.recommended) || R.rec || R.alts[0];
    return { id: R.inv.id, code: R.inv.code, name: R.inv.name, stage: R.inv.stage, portfolio: R.inv.portfolio, planningGroup: 'New to Scenario',
      alternative: a.name, startDate: a.first, capex: a.cost, value: a.value, fromBuild: true };
  });

/* ---------------------------------------------------------------- warnings computed from the scenarios */
const BASE = PLAN_SCENARIOS.find(s => s.id === PLAN_BASELINE_ID);
const capexIdx = y => PLAN_YEARS.indexOf(y);
const BASE_CAPEX = BASE.outcomes.find(o => o.measureId === 37);
// The year requested CAPEX overshoots its cap the most
const PLAN_PEAK_GAP = (() => {
  let best = null;
  PLAN_YEARS.forEach((y, k) => { const cap = BASE_CAPEX.max[k]; if (cap && BASE_CAPEX.byYear[k] - cap > (best ? best.gap : 0)) best = { year: y, requested: BASE_CAPEX.byYear[k], cap, gap: BASE_CAPEX.byYear[k] - cap }; });
  return best;
})();
// J15 · a scenario Cooper builds from a conversation (Setup › New scenario). [Added]: copies a real scenario's constraints and changes
// one year's CAPEX cap; the source scenario is the real "02_Optimized 2028 Plan" (Figma says MID, which this plan doesn't have).
const PLAN_NEW_FROM = 6864, PLAN_NEW_YEAR = 2029;
const planCapOf = (sid, year) => { const o = PLAN_SCENARIOS.find(x => x.id === sid).outcomes.find(o => o.measureId === 37); return o.max[PLAN_YEARS.indexOf(year)]; };
const PLAN_NEW_CAPS = { cut: { pct: -0.1, label: 'Cut it 10%', name: y => `${y} cap cut 10%` }, flat: { flat: true, label: 'Hold it flat at the 2028 level', name: y => `${y} cap held flat` },
  grow: { pct: 0.05, label: 'Let it grow 5%', name: y => `${y} cap +5%` } };
function planCreatedScenario(spec) {                     // spec = { id, cap: 'cut'|'flat'|'grow', shift, from, year }
  const from = spec.from || PLAN_NEW_FROM, year = spec.year || PLAN_NEW_YEAR, rule = PLAN_NEW_CAPS[spec.cap] || PLAN_NEW_CAPS.cut;
  const capFrom = planCapOf(from, year), capTo = Math.round(rule.flat ? planCapOf(from, year - 1) : capFrom * (1 + rule.pct));
  const src = SETUP_SCENARIOS.find(x => x.id === from) || {};
  const how = rule.flat ? `held flat at the ${year - 1} level` : `${Math.abs(rule.pct * 100)}% ${rule.pct < 0 ? 'lower' : 'higher'} than ${src.short}`;
  return { id: spec.id, created: true, from, capYear: year, capFrom, capTo, maxShift: spec.shift, short: rule.name(year), name: rule.name(year),
    desc: `${year} CAPEX cap ${how}; resource and strategic constraints stay the same. Restrictions allow alternative and timing changes.` };
}
const MIN_CAPEX_FROM = (() => { const o = PLAN_SCENARIOS.find(s => s.id === 54824).outcomes.find(o => o.measureId === 37); const k = o.max.findIndex(v => v === 0); return PLAN_YEARS[k]; })();

/* ---------------------------------------------------------------- the optimisation run */
// A run is a mock: the results are the real optimised scenarios. Timing and steps are [Assumed] (Figma 85:86349 shows the steps).
const RUN_STEPS = [
  { id: 'check', title: 'Checking readiness before spending compute', until: 0.3,
    subs: c => [`Validating ${c.constraints} constraints`, `Checking data quality across ${c.investments} investments`, 'Preparing the solver'] },
  { id: 'solve', title: 'Solving', until: 0.85 },
  { id: 'validate', title: 'Validating', until: 1 },
];
const RUN_SECONDS = 24;                                            // demo length of a run [Assumed]
const runProgress = run => run ? Math.min(1, (Date.now() - run.startedAt) / (RUN_SECONDS * 1000)) : 0;

/* ---------------------------------------------------------------- Plan home */
// [Added] planning cycles of the Demo Portfolio: the real set has an "Optimized 2025 Plan" and the 2028 Plan scenarios
const PLAN_CYCLES = [{ id: '2025', label: '2025 Plan', status: 'Archived', range: '2025–2029' }, { id: '2028', label: '2028 Plan', status: 'Next', range: '2028–2032' }];
const OWNER_FIX_MS = 6000;                                         // how long an owner takes to fix a routed investment in the demo [Assumed]

/* ---------------------------------------------------------------- Compare (results of the run) */
// Cards: the Baseline (what was requested) plus the five optimised scenarios, with their REAL results.
const compareRow = (id, extra = {}) => {
  const s = PLAN_SCENARIOS.find(x => x.id === id), setup = SETUP_SCENARIOS.find(x => x.id === id);
  const risk = s.outcomes.find(o => o.measureId === 21), last = PLAN_YEARS.indexOf(2032);
  return { id, name: s.name, short: setup ? setup.short : 'Baseline', baseline: id === PLAN_BASELINE_ID, capex: s.capexTotal, value: s.totalValue,
    onSchedule: PLAN_INVESTMENTS.length - s.deferredVsRequested, deferred: s.deferredVsRequested, advanced: s.advancedVsRequested,
    altChanged: s.alternativeChangedVsRequested, risk2032: risk ? risk.byYear[last] : null, ...extra };
};
const COMPARE_SCENARIOS = [PLAN_BASELINE_ID, ...SETUP_SCENARIOS.map(s => s.id)].map(id => compareRow(id));
const COMPARE_BASE = COMPARE_SCENARIOS[0];
// Cooper's pick [Assumed]: the most value per dollar of CAPEX among the optimised scenarios
const COOPER_PICK = COMPARE_SCENARIOS.filter(c => !c.baseline).reduce((b, c) => (c.value / c.capex > b.value / b.capex ? c : b)).id;

/* ---------------------------------------------------------------- J18 · Compare: confidence, Cooper's evaluation, evidence, investments */
// Open questions before approval [Assumed] (Figma 85:59501 copy)
const compareIssues = () => [
  { id: 'retained', kind: 'question', title: 'Is the retained risk in the recommended scenario acceptable?', description: 'The recommended scenario still leaves some risk unresolved. Confirm whether that level of exposure is acceptable.', answer: true, upload: true,
    solutions: [{ id: 'accept', title: 'Accept retained risk', description: 'The remaining exposure is within the risk tolerance for this cycle.', recommended: true },
      { id: 'reduce', title: 'Reduce risk further', description: 'Re-optimize with a tighter aggregate-risk constraint.' }, { id: 'critical', title: 'Prioritize critical risk', description: 'Force the highest-risk investments into the plan.' }] },
  { id: 'deferrals', kind: 'question', title: 'Are the deferred investments safe to defer?', description: 'Some deferred investments carry rising condition risk. Confirm the owners agree.', answer: true,
    solutions: [{ id: 'owners', title: 'Ask the owners to confirm', description: 'Cooper asks each owner of a deferred investment to confirm.', recommended: true }, { id: 'keep', title: 'Keep them deferred', description: 'Revisit them in the next cycle.' }] },
];
// Cooper's evaluation of a scenario (Figma compare §5.3), from the real records
function cooperEvaluation(id) {
  const c = compareScenarios().find(x => x.id === id) || COMPARE_SCENARIOS.find(x => x.id === COOPER_PICK), b = COMPARE_BASE;
  const d = (x, y) => `${x >= y ? '+' : '−'}${Math.abs(Math.round((x / y - 1) * 100))}%`;
  return c.reopt ? `${c.short} is the re-run with the latest actuals: ${fmtCompact(c.value)} of value (${d(c.value, b.value)} vs the requested plan) for ${fmtMoney(c.capex)} of CAPEX (${d(c.capex, b.capex)}). It defers ${c.deferred} investments and brings ${c.advanced} forward; ${c.altChanged} change alternative. Retained risk in 2032 is ${c.risk2032 == null ? 'not reported' : fmtCompact(c.risk2032)}.` : `${c.short} gives the most value per dollar of the optimized scenarios: ${fmtCompact(c.value)} of value (${d(c.value, b.value)} vs the requested plan) for ${fmtMoney(c.capex)} of CAPEX (${d(c.capex, b.capex)}). It keeps ${c.onSchedule} of ${PLAN_INVESTMENTS.length} investments on schedule and defers ${c.deferred}. The trade-off: retained risk in 2032 is ${c.risk2032 == null ? 'not reported' : `${fmtCompact(c.risk2032)} (${d(c.risk2032, b.risk2032)})`}.`;
}
const compareEvidence = id => { const c = compareScenarios().find(x => x.id === id) || COMPARE_SCENARIOS[1];
  return [
    { title: 'Scenario setup', items: [{ type: 'file', title: 'Budget range tested', content: 'quote', children: `${COMPARE_SCENARIOS.length - 1} scenarios were created around the ${fmtMoney(COMPARE_BASE.capex)} requested plan to test lower and higher funding levels.` },
      { type: 'file', title: 'Same optimization scope', content: 'quote', children: `All scenarios use the same ${PLAN_INVESTMENTS.length} investments, planning groups and horizon, so the comparison is consistent.` }] },
    { title: 'System data', items: [{ type: 'file', title: 'Baseline retained risk', content: 'quote', children: `The requested plan’s retained risk (${COMPARE_BASE.risk2032 == null ? '—' : fmtCompact(COMPARE_BASE.risk2032)} in 2032) is the reference point for ${c.short}.` }] },
  ]; };
// Investments tab [Added]: per-investment changes derived from the real per-scenario counts (deferred, advanced, alternative changed)
function scenarioChanges(id) {
  const c = compareScenarios().find(x => x.id === id); if (!c || c.baseline) return [];
  const order = [...PLAN_INVESTMENTS].sort((a, b) => ((a.id * 2654435761) % 997) - ((b.id * 2654435761) % 997));
  return order.map((inv, k) => {
    const kind = k < c.deferred ? 'deferred' : k < c.deferred + (c.advanced || 0) ? 'advanced' : k < c.deferred + (c.advanced || 0) + c.altChanged ? 'alt' : 'none';
    const months = kind === 'deferred' ? 4 + (inv.id % 21) : kind === 'advanced' ? -(2 + (inv.id % 9)) : 0;
    const band = kind === 'alt' || Math.abs(months) >= 12 ? 'Highest shift' : months ? 'Moderate shift' : 'No shift';
    return { id: inv.id, name: inv.name, code: inv.code, alternative: inv.alternative, start: inv.startDate, months, kind, band, capex: inv.capex };
  });
}

/* ---------------------------------------------------------------- J17 · in-cycle re-optimization */
// [Assumed] Cooper sets up a re-optimization of one Compare scenario from a short chat (Figma 85:75447). Whatever is asked, the result
// shown is the REAL "05_Re-Optimized Plan" (7244): Whistler's re-run with the latest actuals (open question 74). The setup change per answer is [Added].
const PLAN_REOPT_ID = 7244;
const REOPT_SECONDS = 10;                                          // demo length of a re-optimization run [Assumed]
const scaleMax = (rows, measureId, f) => rows.map(r => r.measureId !== measureId ? r : { ...r, changed: SETUP_YEARS.filter(y => r.years[y].max != null),
  years: Object.fromEntries(SETUP_YEARS.map(y => [y, { ...r.years[y], max: r.years[y].max == null ? null : Math.round(r.years[y].max * f) }])) });
const REOPT_KINDS = {
  risk: { label: 'Reduce retained risk', name: s => `${s} · lower risk`, what: 'lower-risk', budget: 'Aggregate risk caps −10%', adjust: rows => scaleMax(rows, 21, 0.9) },
  budget: { label: 'Test a 5% lower budget', name: s => `${s} −5% budget`, what: 'lower-budget', budget: 'CAPEX caps −5%', adjust: rows => scaleMax(rows, 37, 0.95) },
  more: { label: 'See what more funding could unlock', name: s => `${s} +5% budget`, what: 'higher-budget', budget: 'CAPEX caps +5%', adjust: rows => scaleMax(rows, 37, 1.05) },
};
const reoptKind = text => /risk/i.test(text || '') ? 'risk' : /more|unlock|\+|higher|increase/i.test(text || '') ? 'more' : 'budget';
function planReoptScenario(ro) {
  const src = SETUP_SCENARIOS.find(x => x.id === ro.from) || SETUP_SCENARIOS[2], k = REOPT_KINDS[ro.kind] || REOPT_KINDS.budget;
  return { id: 'reopt', created: true, reopt: true, from: src.id, short: k.name(src.short), name: k.name(src.short), budgetLabel: k.budget, adjust: k.adjust, maxShift: 3,
    desc: `Re-optimizes ${src.short} with the latest actuals: ${k.budget.replace('−', 'down ').replace('+', 'up ')}; ${ro.adjust ? 'Cooper adjusts planning groups and the other constraints' : 'planning groups and the other constraints stay the same'}. Executing investments keep their schedule.` };
}
const reoptProgress = ro => ro && ro.startedAt ? Math.min(1, (Date.now() - ro.startedAt) / (REOPT_SECONDS * 1000)) : 0;
// The Compare cards: the five real scenarios + the re-optimized one once its run is done
const compareScenarios = (ro = (typeof Store !== 'undefined' ? Store.get('plan.reopt', null) : null)) =>
  ro && ro.status === 'done' ? COMPARE_SCENARIOS.concat(compareRow(PLAN_REOPT_ID, { short: `${(SETUP_SCENARIOS.find(x => x.id === ro.from) || SETUP_SCENARIOS[2]).short} re-optimized`, reopt: true, asked: planReoptScenario(ro).budgetLabel })) : COMPARE_SCENARIOS;

/* ---------------------------------------------------------------- J20 / J22 · Cooper's answers on Plan home and Approve [Assumed] */
// Built from the real scenario results; peer data isn't in the demo set, so "Compare to peer" says so and compares within the plan.
function planCooperAnswer(kind, { final, gates } = {}) {
  const all = compareScenarios(), opt = all.filter(c => !c.baseline), b = COMPARE_BASE;
  const c = all.find(x => x.id === final) || all.find(x => x.id === COOPER_PICK);
  const d = (x, y) => `${x >= y ? '+' : '−'}${Math.abs(Math.round((x / y - 1) * 100))}%`;
  const safest = opt.filter(x => x.risk2032 != null).reduce((m, x) => (x.risk2032 < m.risk2032 ? x : m));
  const rank = [...opt].sort((x, y) => (x.risk2032 ?? Infinity) - (y.risk2032 ?? Infinity)).findIndex(x => x.id === c.id) + 1;
  if (kind === 'strategy') return `Mostly on track. ${c.short}${final ? ' (the final plan)' : ' (Cooper’s pick)'} delivers ${fmtCompact(c.value)} of value, ${d(c.value, b.value)} against the requested plan, for ${d(c.capex, b.capex)} CAPEX. Retained risk in 2032 is ${fmtCompact(c.risk2032)} (${d(c.risk2032, b.risk2032)}). The gap: ${c.deferred} investments are deferred, so their objectives are served later than requested.`;
  if (kind === 'attention') {
    const g = gates ? ['executive', 'technical', 'financial'].filter(k => (gates[k] || []).every(r => r.status === 'success')).length : 0;
    return final ? `The final plan is ${c.short}. ${gates ? `${g} of 3 approval gates have passed.` : ''} ${c.deferred} deferred investments are worth a look before the Executive gate: ${c.altChanged} also change alternative.`
      : `No final plan is chosen yet. Compare the optimized scenarios: ${COMPARE_SCENARIOS.find(x => x.id === COOPER_PICK).short} gives the most value per dollar, ${safest.short} retains the least risk.`;
  }
  if (kind === 'peer') return `I don’t have peer utilities’ plans in this data set, so here is ${c.short} against this plan’s own scenarios: its retained risk ranks ${rank} of ${opt.length} (lowest is ${safest.short}, ${fmtCompact(safest.risk2032)}), and it funds ${c.onSchedule} of ${PLAN_INVESTMENTS.length} investments on schedule.`;
  return `Best practice is to fund the lowest retained risk your budget allows. ${safest.short} retains ${fmtCompact(safest.risk2032)} in 2032 for ${fmtMoney(safest.capex)}; ${c.short} retains ${fmtCompact(c.risk2032)} for ${fmtMoney(c.capex)} (${d(c.capex, safest.capex)} CAPEX).`;
}

