/* Build › Refine (J08 Alternatives & Forecast, J09 Value & Business Case) for the pad-mount program (investment 8380).
   REAL: alternatives, spend by year and account (CAPEX / OPEX), value by measure, baseline and residual risk, milestones, assets.
   [Added] / [Assumed]: stages of the cost plan, customers per alternative, comments, dependency type and progress, value models,
   questionnaire, documents. Rules in context/logic/refine.md. */

const RF_INV = invById(CLUSTER.ideaInvestmentId);
const RF_RISK_YEARS = ['2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'];
const RF_ALT_RAW = WHISTLER_ALTERNATIVES.filter(a => a.investmentId === CLUSTER.ideaInvestmentId);
const rfSpan = a => { const x = a.firstSpendDate.slice(0, 4), y = a.lastSpendDate.slice(0, 4); return x === y ? x : `${x}–${y}`; };
const rfSum = o => Object.values(o || {}).reduce((t, v) => t + v, 0);
const rfPadmounts = ASSETS.filter(a => a.investmentId === CLUSTER.ideaInvestmentId);
const rfCustomers = rfPadmounts.reduce((t, a) => t + a.customers, 0);
const rfMaxSpend = Math.max(...RF_ALT_RAW.map(a => a.spendTotal));
const RF_ALTS = RF_ALT_RAW.map(a => {
  const base = rfSum(a.riskBaselineByYear), resid = rfSum(a.riskResidualByYear);
  const reduced = base ? 1 - resid / base : 0;                                                  // [Whistler] risk profile, 2026–2035
  const end = (a.riskResidualByYear || {})['2035'] / ((a.riskBaselineByYear || {})['2035'] || 1);
  const scope = /Aggressive/.test(a.name) ? rfPadmounts.length : /Median/.test(a.name) ? 6 : 3;   // [Added] units replaced: the same numbers as the alternative descriptions (ALT_DESC)
  return { id: a.id, name: a.name, type: a.type, cost: a.spendTotal, years: rfSpan(a), first: a.firstSpendDate, last: a.lastSpendDate,
    capex: rfSum((a.spendByAccountByYear || {}).CAPEX), opex: rfSum((a.spendByAccountByYear || {}).OPEX), value: a.valueTotal, bcr: bcrOf(a.valueTotal, a.spendTotal),
    reduced, residual2035: (a.riskResidualByYear || {})['2035'], riskLevel: end < 0.2 ? 'low' : end < 0.5 ? 'medium' : 'high',
    scope, customers: Math.round(rfCustomers * scope / rfPadmounts.length), recommendedInData: a.isRecommended, selectedInData: a.isSelected,
    spendByYear: a.spendByYear, valueByMeasure: a.valueByMeasure, milestones: a.milestones,
    baselineByYear: a.riskBaselineByYear, residualByYear: a.riskResidualByYear };
});
const rfAlt = id => RF_ALTS.find(a => a.id === id);
const RISK_LEVEL = { low: { type: 'green', label: 'Low' }, medium: { type: 'orange', label: 'Medium' }, high: { type: 'red', label: 'High' } };

// ---- Cost & Schedule. [Added] stages: the plan's share of each year's spend; dates split the alternative's spend period
const RF_STAGES_MAIN = [
  { id: 'design', name: 'Design & engineering', type: 'Internal', share: 0.08, from: 0, to: 0.2, color: 'teal' },
  { id: 'procure', name: 'Procurement & long-lead units', type: 'External', share: 0.22, from: 0.1, to: 0.45, color: 'muted-purple' },
  { id: 'replace', name: 'Pad-mount replacement', type: 'External', share: 0.58, from: 0.3, to: 0.92, color: 'rose' },
  { id: 'close', name: 'Commissioning & closeout', type: 'Internal', share: 0.12, from: 0.85, to: 1, color: 'steel-blue' },
];
const rfDay = d => new Date(`${d.slice(0, 10)}T12:00:00`);
const rfIso = t => new Date(t).toISOString().slice(0, 10);
function costPlan(alt, adjust = {}, RF_STAGES = RF_STAGES_MAIN) {
  const byYear0 = alt.costByYear || alt.spendByYear, years = Object.keys(byYear0).sort(), spent = years.filter(y => byYear0[y]);
  // the plan's window: the alternative's spend dates, widened to every year that has spend (some records spend outside their own dates)
  const t0 = Math.min(rfDay(alt.first).getTime(), spent.length ? rfDay(`${spent[0]}-01-01`).getTime() : Infinity),
    t1 = Math.max(rfDay(alt.last).getTime() + 30 * 864e5, spent.length ? rfDay(`${spent[spent.length - 1]}-12-31`).getTime() : -Infinity);
  const yearSpan = y => [rfDay(`${y}-01-01`).getTime(), rfDay(`${y}-12-31`).getTime()];
  return RF_STAGES.map(st => {
    const s = t0 + (t1 - t0) * st.from, e = t0 + (t1 - t0) * st.to, k = 1 + (adjust[st.id] || 0) / 100;
    // the stage's cost each year: its share of the year's spend, weighted by how much of the stage falls in that year
    const w = years.map(y => { const [a, b] = yearSpan(y); return Math.max(0, Math.min(b, e) - Math.max(a, s)); });
    const wy = years.map((y, i) => { const [a, b] = yearSpan(y); const tot = RF_STAGES.reduce((t, x) => t + x.share * Math.max(0, Math.min(b, t0 + (t1 - t0) * x.to) - Math.max(a, t0 + (t1 - t0) * x.from)), 0);
      return tot ? byYear0[y] * st.share * w[i] / tot : 0; });
    const byYear = Object.fromEntries(years.map((y, i) => [y, Math.round(wy[i] * k)]));
    return { ...st, start: rfIso(s), end: rfIso(e), days: Math.round((e - s) / 864e5), byYear, total: rfSum(byYear) };
  });
}

// J10: the cost lines Cooper couldn't estimate from the unit cost model and routed to the estimator [Added]
const RF_ESTIMATE_STAGES = ['procure', 'close'];
// ---- Comments on the investment [Added] (Figma 55:52663: a reviewer questions an alternative's timeline)
const RF_THREADS = () => {
  const min = RF_ALTS.find(a => /Minimal/.test(a.name)) || RF_ALTS[RF_ALTS.length - 1], med = RF_ALTS.find(a => /Median/.test(a.name)) || RF_ALTS[1];
  return [
    { id: 't54', number: 54, place: min.name, type: 'action', unread: true, resolved: false, altId: min.id,
      comments: [{ id: 'c1', name: PEOPLE.LF.name, avatar: { initials: 'LF', type: PEOPLE.LF.type }, time: '30 min ago',
        text: `Is ${min.years} realistic for ${min.name}? Crew availability in ${min.first.slice(0, 4)} is tight, and outage windows in Alpine Meadows are short.` }] },
    { id: 't56', number: 56, place: `${med.name} · Cost & Schedule`, type: 'action', unread: true, resolved: false, altId: med.id, forEstimator: true,
      comments: [{ id: 'c3', name: 'Hollis Grant', avatar: { initials: 'HG', type: 'blue' }, time: '1 h ago',
        text: `@Noah Lindgren Cooper filled 3 of the 5 cost lines for ${med.name} from the unit cost model. ${RF_ESTIMATE_STAGES.map(id => RF_STAGES_MAIN.find(x => x.id === id).name).join(' and ')} need a person: can you check them?` }] },
    { id: 't55', number: 55, place: med.name, type: 'question', unread: false, resolved: false, altId: med.id,
      comments: [{ id: 'c2', name: PEOPLE.NL.name, avatar: { initials: 'NL', type: PEOPLE.NL.type }, time: '2 h ago',
        text: `Can we check the unit costs for ${med.name} against the 2025 actuals before this goes to approval?` }] },
  ];
};
// Cooper's actions for comment #54 (Figma "Shape with Cooper": 1 recommended + 3 other). Impact rows [Assumed]
const rfShapeRecs = alt => ({
  recommended: { id: 'refine', title: `Refine ${alt.name} schedule`, description: `Start procurement a quarter earlier so the replacement stage fits the outage windows. Total cost and scope stay the same.`,
    impact: [{ label: 'Schedule', value: alt.years, delta: '−3 mo', down: true }, { label: 'Risk reduced', value: rfPct(alt.reduced), delta: '+1%' }, { label: 'Estimated cost', value: fmtMoney(alt.cost), delta: 'no change' }] },
  other: [
    { id: 'windows', title: 'Review outage windows', description: 'Ask operations for the 2028–2030 outage calendar and plan the replacements around it.' },
    { id: 'scope', title: 'Reduce delivery scope', description: `Replace the worst ${Math.max(1, alt.scope - 2)} units first and move the rest to the next cycle.` },
    { id: 'recalc', title: 'Recalculate cost and risk impact', description: 'Re-run the estimate with this year’s crew rates and the latest risk outlook.' },
  ],
});
const rfPct = v => `${Math.round(v * 100)}%`;

// ---- Dependencies: the other investments in the cluster, linked by Cooper. Type and progress [Added]
const RF_DEPENDENCIES = CLUSTER.investments.filter(id => id !== CLUSTER.ideaInvestmentId).map((id, k) => {
  const i = invById(id);
  return { id, name: i.name, code: i.code, type: ['Timing and milestone', 'Value', 'Program', 'Timing and milestone'][k % 4], progress: [68, 35, 12, 50][k % 4], cost: i.totalSpend, value: i.totalValue,
    why: ['Its outages share the Alpine Meadows feeders, so the two schedules must not overlap.', 'Part of its value comes from the same reliability measure; counting both would double it.',
      'Both sit in the Alpine Meadows asset program and are reviewed together.', 'It upgrades the upstream breakers the new pad-mounts depend on.'][k % 4] };
});

// ---- System confidence on Refine (Figma "Approval readiness": 4 gates) [Assumed]
const RF_GATES = [{ id: 'ready', label: 'Investment readiness' }, { id: 'path', label: 'Path forward' }, { id: 'assume', label: 'Assumption consistency' }, { id: 'block', label: 'Review blockers' }];
function refineIssues() {
  const rec = RF_ALTS.find(a => a.recommendedInData) || RF_ALTS[0];
  return [
    { id: 'contingency', kind: 'question', gate: 'assume', title: 'What contingency should be carried on this estimate?', description: `${rec.name} is estimated at ${fmtMoney(rec.cost)} with no contingency line.`, answer: true,
      solutions: [{ id: 'c10', title: 'Carry 10% contingency', description: 'Typical for a replacement program at this estimate class.', recommended: true }, { id: 'c5', title: 'Carry 5% contingency', description: 'The unit costs are recent and the scope is fixed.' }, { id: 'c15', title: 'Carry 15% contingency', description: 'Procurement prices are still moving.' }] },
    { id: 'schedule', kind: 'question', gate: 'path', title: 'Schedule challenged by a reviewer', description: 'Comment #54 questions whether the timeline is realistic. Resolve it in Comments, or answer here.', answer: true,
      solutions: [{ id: 'keep', title: 'Keep the schedule', description: 'The outage windows have been checked with operations.' }] },
    { id: 'values', kind: 'warning', gate: 'assume', title: '2 questionnaire answers need input', description: 'Two value-model questions are waiting for you in Value › Questionnaire answers.', okay: true },
    { id: 'deps', kind: 'warning', gate: 'block', title: 'A dependency overlaps the outage windows', description: `${RF_DEPENDENCIES[0] ? RF_DEPENDENCIES[0].name : 'A linked investment'} uses the same feeders in the same years.`, okay: true },
  ];
}

// ---- Documents in Cooper's context [Added] (Figma shows 16)
const RF_DOCS = ['Pad-mount condition assessment 2025.pdf', 'Alpine Meadows feeder single-line diagram.pdf', 'Unit cost estimate 2028.xlsx', 'Outage history Alpine Meadows 2020–2025.xlsx',
  'Asset health scores export.csv', 'Replacement program charter.docx', 'Crew availability plan 2028.xlsx', 'Environmental screening memo.pdf', 'Customer impact summary.docx',
  'Vendor quote: pad-mount transformers.pdf', 'Inspection photos index.pdf', 'Load forecast Whistler 2026–2036.xlsx', 'Wildfire season outlook.pdf', 'Safety review notes.docx',
  'Capital plan guidance 2028.pdf', 'Reviewer checklist.docx'].map((name, i) => ({ id: `d${i}`, name, date: ['Jan 15, 2026', 'Mar 2, 2026', 'Jun 11, 2026', 'Sep 30, 2026'][i % 4] }));

// ---- J09 Value: one value model per real measure of the alternatives (valueByMeasure + residual risk by measure) [Whistler]
// Baseline by measure = the 2026 residual (before any spend the residual equals the baseline) scaled by the real baseline total per year.
const RF_RISK_MEASURES = Object.keys((RF_ALT_RAW[0] || {}).riskResidualByMeasure || {});
function measureBaseline(alt, m) {
  const r = alt.riskResidualByMeasure || {}, share = (r[m] || {})['2026'] / (rfSum(Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v['2026']]))) || 1);
  return Object.fromEntries(RF_RISK_YEARS.map(y => [y, (alt.riskBaselineByYear || {})[y] * share]));
}
const measureReduced = (alt, m) => { const b = rfSum(measureBaseline(alt, m)), r = rfSum((alt.riskResidualByMeasure || {})[m]); return b ? Math.max(0, 1 - r / b) : 0; };
// [Added] model names, measure counts and outputs (Figma "Selected models"); the measure names and numbers are real
const RF_MODEL_META = {
  'Reliability Risk': { name: 'Reliability benefit', measures: 12, output: ['SAIDI / SAIFI improvement', 'Customer minutes avoided'] },
  'Safety Risk': { name: 'Safety risk', measures: 2, output: ['Public & crew safety exposure', 'Incident likelihood'], needs: 2 },
  'Environmental Risk': { name: 'Environmental risk', measures: 4, output: ['Oil spill exposure', 'Fire ignition likelihood'] },
  'Financial Risk': { name: 'Simple financial risk', measures: 3, output: ['Expected financial risk', 'Avoided failure cost'] },
  'Electrical Delivery Capacity Risk': { name: 'Delivery capacity', measures: 2, output: ['Load at risk'] },
  'Public Safety Risk': { name: 'Public safety risk', measures: 2, output: ['Public safety exposure'] },
};
const RF_MODELS = RF_RISK_MEASURES.map(m => ({ id: m, measure: m, ...(RF_MODEL_META[m] || { name: m, measures: 1, output: [m] }) }));
// Models you can add (Figma drawer "MODELS") [Added]
const RF_MODEL_LIBRARY = [['Public Safety Risk', 'Expected harm to the public from asset failure.'], ['Employee Safety Risk', 'Expected harm to crews working on or near the asset.'],
  ['Asset Integrity Risk', 'Likelihood of structural or insulation failure.'], ['Outage / Service Interruption Risk', 'Customer minutes lost to unplanned outages.'],
  ['Emissions Reduction', 'Greenhouse gas avoided over the asset life.'], ['Capital Carbon', 'Embodied carbon of the new equipment.']].map(([name, text]) => ({ id: `lib-${name}`, name, text }));
// Questionnaire answers [Added]: 2 need input (Safety risk), 5 answered by Cooper from the documents
const RF_QUESTIONS = [
  { id: 'q1', q: 'How many people live or work within 10 m of the units?', kind: 'Consequence · Required', model: 'Safety risk', answer: null, by: 'you' },
  { id: 'q2', q: 'Have any of the units had an oil leak in the last 5 years?', kind: 'Likelihood · Required', model: 'Safety risk', answer: null, by: 'you' },
  { id: 'q3', q: 'What is the average customer count per unit?', kind: 'Consequence · Required', model: 'Reliability benefit', answer: `${Math.round(rfCustomers / rfPadmounts.length)} customers`, by: 'cooper' },
  { id: 'q4', q: 'What is the restoration time after a failure?', kind: 'Consequence · Required', model: 'Reliability benefit', answer: '6 hours (outage history 2020–2025)', by: 'cooper' },
  { id: 'q5', q: 'Is the unit inside a wildfire risk zone?', kind: 'Likelihood · Required', model: 'Environmental risk', answer: 'Yes, 4 of 12 units', by: 'cooper' },
  { id: 'q6', q: 'What is the replacement cost after a failure?', kind: 'Consequence · Required', model: 'Simple financial risk', answer: 'From the 2028 unit cost estimate', by: 'cooper' },
  { id: 'q7', q: 'What is the peak load on the units?', kind: 'Scope · Required', model: 'Delivery capacity', answer: 'From the Whistler load forecast', by: 'cooper' },
];

// ---- Any Build investment (Shiny, 2026-11-19: the first three ideas and investments open too). rfContext(id) is everything Refine shows
// for one investment. The pad-mount program keeps its full scripted content; any other investment gets its real record and alternatives
// (altsOf: at least three) and [Added] generic content: generic stages, a few documents, no comments, no dependencies, no questionnaire.
const RF_STAGES_GENERIC = RF_STAGES_MAIN.map(st => st.id === 'replace' ? { ...st, name: 'Delivery' } : st.id === 'procure' ? { ...st, name: 'Procurement' } : st);
const RF_MAIN = { main: true, inv: RF_INV, raw: RF_ALT_RAW, alts: RF_ALTS, alt: rfAlt, assets: rfPadmounts, unit: 'pad-mounts', stages: RF_STAGES_MAIN,
  threads: RF_THREADS, deps: RF_DEPENDENCIES, docs: RF_DOCS, models: RF_MODELS, measures: RF_RISK_MEASURES, questions: RF_QUESTIONS, issues: refineIssues,
  estimate: RF_ESTIMATE_STAGES, upload: 'Alpine Meadows outage calendar 2028.xlsx', hasRisk: true };
// Cost by year = every account except Revenue (CLTDEMO nets Revenue, an income, into spendByYear; spendTotal is CAPEX + OPEX)
const rfCostByYear = a => { const acc = a.spendByAccountByYear || {}, keys = Object.keys(acc).filter(k => k !== 'Revenue'); if (!keys.length) return a.spendByYear;
  const out = {}; keys.forEach(k => Object.entries(acc[k]).forEach(([y, v]) => { out[y] = (out[y] || 0) + v; })); return out; };
const rfCtxCache = {};
function rfContext(id) {
  if (!id || id === CLUSTER.ideaInvestmentId) return RF_MAIN;
  if (rfCtxCache[id]) return rfCtxCache[id];
  const inv = invById(id), raw = altsOf(id), assets = ASSETS.filter(a => a.investmentId === id);
  const customers = assets.reduce((t, a) => t + (a.customers || 0), 0);
  const alts = raw.map(a => {
    const base = rfSum(a.riskBaselineByYear), resid = rfSum(a.riskResidualByYear), has = base > 0;
    const end = has ? ((a.riskResidualByYear || {})['2035'] || 0) / ((a.riskBaselineByYear || {})['2035'] || 1) : null;
    return { id: a.id, name: a.name, type: a.type, cost: a.spendTotal, years: rfSpan(a), first: a.firstSpendDate, last: a.lastSpendDate,
      capex: rfSum((a.spendByAccountByYear || {}).CAPEX), opex: rfSum((a.spendByAccountByYear || {}).OPEX), value: a.valueTotal, bcr: bcrOf(a.valueTotal, a.spendTotal),
      reduced: has ? 1 - resid / base : null, residual2035: has ? (a.riskResidualByYear || {})['2035'] : null, riskLevel: has ? (end < 0.2 ? 'low' : end < 0.5 ? 'medium' : 'high') : null,
      scope: assets.length || null, customers: assets.length ? customers : null, recommendedInData: a.isRecommended, selectedInData: a.isSelected, added: !!a.added,
      spendByYear: a.spendByYear, costByYear: rfCostByYear(a), valueByMeasure: a.valueByMeasure || [], milestones: a.milestones || [], baselineByYear: a.riskBaselineByYear, residualByYear: a.riskResidualByYear };
  });
  const measures = Object.keys((raw.find(a => a.riskResidualByMeasure && Object.keys(a.riskResidualByMeasure).length) || {}).riskResidualByMeasure || {});
  const rec = alts.find(a => a.recommendedInData) || alts.find(a => a.selectedInData) || alts[0];
  const models = measures.length ? measures.map(m => ({ id: m, measure: m, name: m.replace(/ Risk$/, ' risk'), measures: 1, output: [m] }))   // the measure itself; RF_MODEL_META is pad-mount wording
    : rec.valueByMeasure.filter(m => m.value > 0).map(m => ({ id: m.measure, measure: null, name: m.measure, measures: 1, output: [m.measure] }));
  const docs = [`${inv.name} business case.docx`, `${inv.code} cost estimate.xlsx`, 'Capital plan guidance 2028.pdf', 'Reviewer checklist.docx']
    .map((name, i) => ({ id: `d${i}`, name, date: ['Jan 15, 2026', 'Mar 2, 2026', 'Jun 11, 2026', 'Sep 30, 2026'][i] }));
  const issues = () => [{ id: 'contingency', kind: 'question', gate: 'assume', title: 'What contingency should be carried on this estimate?', description: `${rec.name} is estimated at ${fmtMoney(rec.cost)} with no contingency line.`, answer: true,
    solutions: [{ id: 'c10', title: 'Carry 10% contingency', description: 'Typical at this estimate class.', recommended: true }, { id: 'c5', title: 'Carry 5% contingency', description: 'The costs are recent and the scope is fixed.' }, { id: 'c15', title: 'Carry 15% contingency', description: 'Prices are still moving.' }] },
    ...(alts.some(a => a.added) ? [{ id: 'suggested', kind: 'warning', gate: 'ready', title: 'Cooper suggested an alternative', description: `${alts.filter(a => a.added).map(a => a.name).join(' and ')} ${alts.filter(a => a.added).length > 1 ? 'were' : 'was'} added so there are at least ${ALT_MIN} alternatives. Review ${alts.filter(a => a.added).length > 1 ? 'them' : 'it'} before approval.`, okay: true }] : [])];
  return (rfCtxCache[id] = { main: false, inv, raw, alts, alt: x => alts.find(a => a.id === x), rec, assets, unit: 'assets', stages: RF_STAGES_GENERIC,
    threads: () => [], deps: [], docs, models, measures, questions: [], issues, estimate: [], upload: `${inv.name} site notes.pdf`, hasRisk: measures.length > 0 });
}
// The saved Refine draft for a newly opened investment: its recommended alternative; Executing investments are already past Approve
const rfDraft = id => { const R = rfContext(id), seed = (INV_SEEDS.find(r => r.id === id) || {}).status; return { ...(seed === 'approval' ? { approvers: FINAL_APPROVERS() } : {}), recommended: (R.rec || R.alts[0]).id, toPlan: {}, compare: {}, adjust: {}, refined: {}, threads: R.threads(), docs: R.docs,
  status: R.inv.stage === 'Executing' ? 'executing' : ((INV_SEEDS.find(r => r.id === id) || {}).status || 'refining') }; };
