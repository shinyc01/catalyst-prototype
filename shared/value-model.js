/* Value area (J12 Framework specification & design, J13 Validation & handoff, J14 Maintenance & calibration).
   REAL: the 69 value measures (names, categories), the 296 Plan investments (capex, value), the 5 enterprise goals (Figma copy, [Added] earlier).
   [Added] / [Assumed]: frameworks, objectives and weights, value models, formulas, the re-score rule, checks, approvers, versions,
   peer figures. Rules in context/logic/value.md. */

// ---- Library rows [Added] (Figma 2340:56647); created by invented people
const VF_FRAMEWORKS = [
  { id: 'q1-2026', name: 'Q1 2026 Strategy Framework', status: 'active', modified: '2026-01-15', by: 'NL' },
  { id: 'q2-2026', name: 'Q2 2026 Strategy Framework', status: 'pending', approvals: [5, 8], modified: '2026-01-10', by: 'NL' },
  { id: 'cost-2026', name: 'Cost Optimization 2026', status: 'draft', stage: 'Input', modified: '2025-12-18', by: 'RB' },
  { id: 'v6-2025', name: '2025 Strategy Framework v6', status: 'draft', stage: 'Shape', modified: '2025-12-05', by: 'KM' },
  { id: 'decarb-2026', name: 'Decarbonization Review 2026', status: 'draft', stage: 'Review', modified: '2025-11-22', by: 'NL' },
  { id: 'v3-2025', name: '2025 Strategy Framework v3', status: 'archived', modified: '2025-10-02', by: 'KM' },
  { id: 'v2-2025', name: '2025 Strategy Framework v2', status: 'archived', modified: '2025-04-18', by: 'RB' },
  { id: 'v1-2024', name: '2024 Strategy Framework v1', status: 'archived', modified: '2024-11-10', by: 'KM' },
];
const VF_STATUS = { active: { type: 'green', label: 'Active' }, pending: { type: 'orange', label: 'Pending approval' }, draft: { type: 'grey', label: 'Draft' },
  archived: { type: 'grey', label: 'Archived' }, revisions: { type: 'red', label: 'Revisions required' }, ready: { type: 'blue', label: 'Ready to publish' }, scheduled: { type: 'blue', label: 'Scheduled' } };

// ---- The active framework's structure. Objectives and weights [Added] (Figma Overview "By weight": 40 / 35 / 13 / 7 / 5)
const VF_OBJECTIVES = [
  { id: 'reliability', name: 'Reliability & service continuity', short: 'Reliability', weight: 40, color: 4 },
  { id: 'financial', name: 'Financial', short: 'Financial', weight: 35, color: 5 },
  { id: 'environment', name: 'Environmental', short: 'Environment', weight: 13, color: 3 },
  { id: 'social', name: 'Social', short: 'Social', weight: 7, color: 6 },
  { id: 'governance', name: 'Governance', short: 'Governance', weight: 5, color: 2 },
];
const VF_GOALS = ENTERPRISE_GOALS;
// Value models [Added] names (Figma); each owns real measures picked by keyword; investment counts are derived below
const VF_MODELS = [
  { id: 'wdrm', name: 'WDRM v4', objective: 'environment', match: /wildfire|ignition|fire/i, version: 4 },
  { id: 'saidi', name: 'SAIDI / SAIFI v1', objective: 'reliability', match: /reliab|outage|interrupt|saidi|saifi|capacity/i, version: 1 },
  { id: 'capex', name: 'CapEx v3', objective: 'financial', match: /cost|capex|opex|financial|budget/i, version: 4 },
  { id: 'carbon', name: 'Carbon footprint v4', objective: 'environment', match: /co2|carbon|emission|environment/i, version: 3 },
  { id: 'safety', name: 'Public Safety v2', objective: 'social', match: /safety|injur|health/i, version: 2 },
  { id: 'community', name: 'Community impact v7', objective: 'social', match: /community|customer|equity|hardship/i, version: 7 },
  { id: 'esg', name: 'ESG-Rep v4', objective: 'governance', match: /compliance|regulat|governance|reput/i, version: 4 },
];
// Measure type from the real numeric category [Assumed mapping]
const VF_MEASURE_TYPE = { 1: 'Risk', 2: 'Benefit', 3: 'Cost', 6: 'Condition score' };
const VF_MEASURES = SEARCH_MEASURES.map(m => ({ ...m, type: VF_MEASURE_TYPE[m.category] || 'Service measure',
  model: (VF_MODELS.find(x => x.match.test(m.name)) || {}).id })).filter(m => m.model);

// ---- Portfolio re-scoring [Assumed]: each Plan investment gets an objective profile from what it is (name keywords),
// so its value can be re-weighted when the framework's weights change. Profiles sum to 1.
const vfProfile = inv => {
  const n = inv.name.toLowerCase(), p = { reliability: 0.45, financial: 0.3, environment: 0.1, social: 0.1, governance: 0.05 };
  if (/wildfire|vegetation|fire/.test(n)) Object.assign(p, { reliability: 0.25, environment: 0.4, social: 0.2 });
  else if (/safety|fence|security/.test(n)) Object.assign(p, { reliability: 0.2, social: 0.45, financial: 0.2 });
  else if (/\bmeter|\bsoftware\b|\bscada\b/.test(n)) Object.assign(p, { reliability: 0.15, financial: 0.6, governance: 0.15 });
  else if (/transformer|breaker|substation/.test(n)) Object.assign(p, { reliability: 0.55, financial: 0.25 });
  // a stable per-investment mix (from its id), so investments of the same kind still differ [Assumed]
  const h = k => ((inv.id * (k + 7) * 2654435761) % 1000) / 1000;
  Object.keys(p).forEach((k, i) => { p[k] = p[k] * (0.5 + h(i)); });
  const s = Object.values(p).reduce((t, v) => t + v, 0); return Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v / s]));
};
const vfScore = (inv, w) => { const p = vfProfile(inv); return inv.value * Object.keys(p).reduce((t, k) => t + p[k] * (w[k] || 0), 0) / 20; };
const VF_WEIGHTS = Object.fromEntries(VF_OBJECTIVES.map(o => [o.id, o.weight]));
// The draft's proposal (Figma Review: "increases Reliability influence by 18%, decreases Safety influence by 7%") [Added]
const VF_PROPOSED = { ...VF_WEIGHTS, reliability: VF_WEIGHTS.reliability * 1.18, social: VF_WEIGHTS.social * 0.93, environment: 18, financial: 28 };
function vfImpact(proposed = VF_PROPOSED) {
  const budget = PLAN_INVESTMENTS.reduce((t, i) => t + i.capex, 0) * 0.6;          // [Assumed] the funding line: 60% of requested capex
  const rank = w => { const r = [...PLAN_INVESTMENTS].map(i => ({ i, v: vfScore(i, w) })).sort((a, b) => b.v / b.i.capex - a.v / a.i.capex); let c = 0;
    return Object.fromEntries(r.map((x, k) => { c += x.i.capex; return [x.i.id, { rank: k + 1, funded: c <= budget, v: x.v }]; })); };
  const a = rank(VF_WEIGHTS), b = rank(proposed);
  const rows = PLAN_INVESTMENTS.map(i => { const x = a[i.id], y = b[i.id], d = (y.v - x.v) / (x.v || 1);
    return { id: i.id, name: i.name, code: i.code, capex: i.capex, before: x.v, after: y.v, change: d, rankBefore: x.rank, rankAfter: y.rank, fundedBefore: x.funded, fundedAfter: y.funded,
      type: Object.entries(vfProfile(i)).sort((p, q) => q[1] - p[1])[0][0] }; });
  const bucket = d => d <= -0.15 ? 0 : d <= -0.05 ? 1 : d <= -0.01 ? 2 : d < 0.01 ? 3 : d < 0.05 ? 4 : d < 0.15 ? 5 : 6;
  const buckets = ['Major loss', 'Moderate loss', 'Minor loss', 'No material change', 'Minor gain', 'Moderate gain', 'Major gain'].map((label, k) => ({ label, value: rows.filter(r => bucket(r.change) === k).length }));
  const sum = (f, rs = rows) => rs.reduce((t, r) => t + f(r), 0);
  return { rows, buckets, gained: rows.filter(r => r.change >= 0.01).length, lost: rows.filter(r => r.change <= -0.01).length, unchanged: rows.filter(r => Math.abs(r.change) < 0.01).length,
    tierIn: rows.filter(r => !r.fundedBefore && r.fundedAfter).length, tierOut: rows.filter(r => r.fundedBefore && !r.fundedAfter).length,
    material: rows.filter(r => Math.abs(r.change) >= 0.05).length, before: sum(r => r.before), after: sum(r => r.after),
    executing: rows.filter(r => r.fundedBefore && !r.fundedAfter && /Executing/.test((PLAN_INVESTMENTS.find(i => i.id === r.id) || {}).stage || '')).length };
}
const VF_TYPE_LABEL = { reliability: 'Reliability', financial: 'Cost', environment: 'Environment', social: 'Safety', governance: 'Governance' };

// ---- Shape: objectives and models you can add (Figma pickers) [Added]
const VF_OBJECTIVE_LIBRARY = [
  { id: 'safety-obj', name: 'Safety (public & employee)', text: 'Reduce risk to the public and the workforce across every operating and investment decision.' },
  { id: 'customer', name: 'Customer & service experience', text: 'Make service easier, faster and fairer for every customer.' },
  { id: 'regulatory', name: 'Regulatory compliance & mandates', text: 'Meet every mandate on time and keep rate cases approvable.' },
  { id: 'resilience', name: 'Resilience & climate adaptation', text: 'Prepare the network for wildfire, storms and heat.' },
  { id: 'waste', name: 'Waste reduction', text: 'Improve resource efficiency and cut waste across the asset lifecycle.' },
];
// Trace report after adding an objective (Figma 2848:84403…) [Figma copy]
const vfTraceIssues = name => [
  { id: 'balance', kind: 'error', title: 'Weighting is no longer balanced', description: `Adding ${name} increases the total strategic objective weight above 100%.`,
    solutions: [{ id: 'rebalance', title: 'Rebalance all objective weights', description: 'Redistribute the weights across all strategic objectives so the total returns to 100%.', recommended: true },
      { id: 'cooper', title: 'Use Cooper’s suggested weight', description: 'Apply a recommended weight based on the current objective structure.' },
      { id: 'none', title: 'Add without a weight', description: 'Save the objective as a draft and assign its weight before publishing.' }] },
  { id: 'reports', kind: 'warning', title: 'Reports may need updating', description: 'Current dashboards and reports do not include this objective and may show incomplete results until updated.', okay: true },
  { id: 'n1', kind: 'note', title: 'New objective added', description: `${name} is in the draft.`, okay: true },
  { id: 'n2', kind: 'note', title: 'Existing investments will be recalculated', description: 'Every investment scored by this framework is re-scored when it publishes.', okay: true },
];
// Rebalance: scale every weight so the total is 100 (the new objective gets the average of the others) [Assumed]
function vfRebalance(objs) { const total = objs.reduce((t, o) => t + (o.weight || 0), 0) || 1; return objs.map(o => ({ ...o, weight: Math.round(o.weight / total * 1000) / 10 })); }

// ---- Review: automated checks (Figma 2846:136898) [Figma copy, Assumed rules]
const VF_CHECK_GATES = [{ id: 'weights', label: 'Weights balanced' }, { id: 'models', label: 'Models valid' }, { id: 'measures', label: 'Measures covered' }, { id: 'gov', label: 'Governance' }];
const vfChecks = () => [
  { id: 'overweight', kind: 'error', gate: 'weights', title: 'Wildfire risk over-weighted', description: 'The draft pulls capital into ignition mitigation beyond what outcomes support.',
    solutions: [{ id: 'hybrid', title: 'Lock weight at 28%, restore methodology only', description: 'Hybrid restore · Keeps FY26 strategic alignment', recommended: true },
      { id: 'faithful', title: 'Accept the 45% weighting in full', description: 'Faithful restore · Requires Strategy OKR review' },
      { id: 'skip', title: 'Skip restore now, plan for the next release', description: 'Capture the calculation features in the FY27 release plan' }] },
  { id: 'orphan', kind: 'error', gate: 'measures', title: 'Two governance measures are uncovered', description: 'Compliance Risk and Regulatory penalty have no value model scoring them.',
    solutions: [{ id: 'map', title: 'Map them to ESG-Rep v4', description: 'ESG-Rep already scores the other governance measures.', recommended: true }, { id: 'drop', title: 'Remove them from the framework', description: 'They will no longer be reported.' }] },
  { id: 'executing', kind: 'warning', gate: 'gov', title: 'An executing investment loses funding tier', description: 'One investment already in execution drops below the funding line under the proposed weights.', okay: true },
  { id: 'recalc', kind: 'note', title: 'Existing investments will be recalculated', description: 'All 296 investments in the Demo Portfolio are re-scored when this publishes.', okay: true },
];

// ---- Approvers (Figma 2841:18349: four roles) [Added] invented people
const VF_APPROVERS = [
  { id: 'RB', name: PEOPLE.RB.name, role: 'Neighbouring Asset Manager', avatar: { initials: 'RB', type: PEOPLE.RB.type } },
  { id: 'MD', name: 'Mara Delgado', role: 'Asset Manager', avatar: { initials: 'MD', type: 'green' } },
  { id: 'LF', name: PEOPLE.LF.name, role: 'Field Team Lead', avatar: { initials: 'LF', type: PEOPLE.LF.type } },
  { id: 'NL', name: PEOPLE.NL.name, role: 'Value Framework Owner', avatar: { initials: 'NL', type: PEOPLE.NL.type } },
];

// ---- Cooper recommendations on the active framework (Figma 2563:140103) [Figma copy, Assumed impact]
const VF_RECS = [
  { id: 'waste', group: 'Strategic objectives', title: 'Add Waste Reduction Objective', description: 'This objective could improve resource efficiency and strengthen sustainability performance across the portfolio.', impact: [{ label: 'Total capital', value: '62nd', delta: '+1' }, { label: 'Risk coverage', value: '94%', delta: '+3%' }] },
  { id: 'carbon', group: 'Measures', title: 'Add Carbon Intensity Measure', description: 'Introduce a Carbon Intensity measure to capture environmental impact more directly at the portfolio level.', impact: [{ label: 'Total capital', value: '62nd', delta: '+1' }, { label: 'Portfolio benefit-cost', value: '2.5', delta: '+0.3' }] },
  { id: 'prior', group: 'Value models', title: 'Refine Investment Prioritization', description: 'Weight reliability outcomes by customer count so dense feeders rank first.', impact: [{ label: 'Risk coverage', value: '94%', delta: '+1%' }] },
  { id: 'inputs', group: 'Value models', title: 'Update Risk Calculation Inputs', description: 'Observed failures on underground cable diverged from predictions; refresh the failure curves in WDRM.', impact: [{ label: 'Risk coverage', value: '94%', delta: '+2%' }] },
];

// ---- Overview / Capital flow: totals from the real Plan investments
const VF_TOTAL_CAPITAL = PLAN_INVESTMENTS.reduce((t, i) => t + i.capex, 0);
const VF_TOTAL_VALUE = PLAN_INVESTMENTS.reduce((t, i) => t + i.value, 0);
// capital by objective = each investment's capex split by its profile [Assumed]
const vfCapitalBy = () => { const o = Object.fromEntries(VF_OBJECTIVES.map(x => [x.id, 0])); PLAN_INVESTMENTS.forEach(i => { const p = vfProfile(i); Object.keys(p).forEach(k => { o[k] += i.capex * p[k]; }); }); return o; };
// Value models library [Added] rows (Figma 2456:10490)
const VF_MODEL_ROWS = VF_MODELS.map((m, k) => ({ ...m, status: m.id === 'community' ? 'pending' : 'active', modified: ['2025-05-13', '2025-04-02', '2025-03-18', '2025-02-27', '2025-02-10', '2025-01-22', '2025-01-08'][k],
  investments: PLAN_INVESTMENTS.filter(i => vfProfile(i)[m.objective] >= 0.15).length,                 // [Assumed] scored by the model = at least 15% of its value in the model's objective
  measures: VF_MEASURES.filter(x => x.model === m.id) }));
