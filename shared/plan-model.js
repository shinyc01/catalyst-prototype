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
const PLAN_GROUPS = ['Under Consideration', 'New to Scenario', 'Required by Management', 'Executing', 'Blankets']
  .map(g => ({ id: g, label: g, count: PLAN_INVESTMENTS.filter(i => i.planningGroup === g).length, adjustable: ['Under Consideration', 'New to Scenario'].includes(g) }));

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
