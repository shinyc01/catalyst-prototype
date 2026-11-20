/* Command (Home) content per persona — built from Whistler data, with [Added] items where the demo set has nothing
   (collaborators' messages, work items, dates, calendar events, priorities). Load after catalyst-model.js.
   Figma spec: context/screens/command-figma-spec.md. Data notes: context/data/whistler.md. */

const STORY_DATE = new Date(2026, 10, 17);                                          // [Added] story "today": Nov 17, 2026
const DISCOUNT = 0.06;                                                              // [Added] CPV discount rate
const invById = id => WHISTLER_INVESTMENTS.find(i => i.id === id);
const fmtMoney = v => { const a = Math.abs(v), s = v < 0 ? '−' : ''; return a >= 1e9 ? `${s}$${(a / 1e9).toFixed(2)}B` : a >= 1e6 ? `${s}$${(a / 1e6).toFixed(1)}M` : a >= 1e3 ? `${s}$${Math.round(a / 1e3)}K` : `${s}$${Math.round(a)}`; };
const fmtValue = v => (v < 0 ? '−' : '') + Math.round(Math.abs(v)).toLocaleString();
const fmtCompact = v => Math.abs(v) >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : fmtValue(v);           // 16.0M for big value scores
const fmtM = v => fmtMoney(v).replace('.0M', 'M').replace('.0B', 'B');                               // $425M

// CPV = present value of the selected alternative's spend (6%/yr from 2026). V/C = value per $1K of CPV. Both derived from real data.
function cpvOf(id) {
  const s = WHISTLER_SELECTED_SPEND[id]; if (!s) return invById(id)?.totalSpend || 0;
  return Object.entries(s.spendByYear).reduce((t, [y, v]) => t + v / Math.pow(1 + DISCOUNT, Math.max(0, +y - NOW)), 0);
}
const vcOf = id => { const c = cpvOf(id); return c > 0 ? invById(id).totalValue / (c / 1000) : 0; };
const vcLabel = v => `${Math.abs(v) < 100 ? v.toFixed(1) : Math.round(v).toLocaleString()} V/$K`;
const firstSentence = t => (t || '').split(/(?<=\.)\s/)[0];

// Asset-manager metrics, from the model at NOW with the default lenses: health index 0–10 and risk $ ± uncertainty
const UNCERTAINTY = { bank: 12, padmount: 18, line: 22, breaker: 15 };                // [Added] ± % per asset kind
function assetMetrics(assetIds) {
  const act = activeOf(INITIAL_LENSES), rows = assetIds.map(id => ({ a: assetById(String(id)), r: assess(assetById(String(id)), NOW, act) }));
  const hi = 10 * (1 - rows.reduce((t, x) => t + x.r.pof, 0) / rows.length);
  const risk = rows.reduce((t, x) => t + x.r.pof * x.a.costM * 1e6, 0);
  const unc = Math.round(rows.reduce((t, x) => t + UNCERTAINTY[x.a.type] * x.r.pof * x.a.costM, 0) / Math.max(1e-9, rows.reduce((t, x) => t + x.r.pof * x.a.costM, 0)));
  return { hi: hi.toFixed(1), risk: `${fmtMoney(risk)} ±${unc}%` };
}
const assetsOfInv = id => ASSETS.filter(a => a.investmentId === id).map(a => a.id);
const clusterIds = ASSETS.map(a => a.id);

// Age vs useful life: pad-mounts from the real normalized age (life = age ÷ normalized age); others use [Added] design lives
const DESIGN_LIFE = { bank: 40, line: 45, breaker: 50 };
function ageVsLife(kind) {
  const a = ASSETS.find(x => x.type === kind), age = NOW - a.install;
  const life = kind === 'padmount' ? Math.round(a.outlook['Asset Age'][0] / a.outlook['Normalized Age'][0]) : DESIGN_LIFE[kind];
  return `${age} of ${life} yrs`;
}

/* ---------- people: real Whistler users + [Added] collaborators ---------- */
const PEOPLE = {
  RB: { name: 'Ravi Banerjee', initials: 'RB', type: 'blue', role: 'Investment Owner, Transmission' },
  KM: { name: 'Kenji Mori', initials: 'KM', type: 'yellow', role: 'Director of Capital Planning' },
  TM: { name: 'Theo Marsh', initials: 'TM', type: 'light-blue', role: 'CFO' },
  PI: { name: 'Priyanka Iyer', initials: 'PI', type: 'dark-pink', role: 'Data Engineer' },
  LF: { name: 'Luca Ferri', initials: 'LF', type: 'green', role: 'Field supervisor' },
  NL: { name: 'Noah Lindgren', initials: 'NL', type: 'purple', role: 'Capital Finance Analyst' },
  HG: { name: 'Hollis Grant', initials: 'HG', type: 'orange', role: 'Investment Owner, Electrical Distribution' },
  MD: { name: 'Mara Delgado', initials: 'MD', type: 'blue', role: 'Asset Manager' },
  OF: { name: 'Owen Fitch', initials: 'OF', type: 'light-purple', role: 'Portfolio Owner, Electrical' },
  IC: { name: 'Ines Calder', initials: 'IC', type: 'purple', role: 'CX Consultant', added: true },
  TQ: { name: 'Tara Quinn', initials: 'TQ', type: 'dark-orange', role: 'Field supervisor', added: true },
};
const short = p => { const [f, ...r] = PEOPLE[p].name.split(' '); return `${f[0]}. ${r.join(' ')}`; };

/* ---------- decisions ---------- */
const CLUSTER_INV = CLUSTER.investments;
const clusterCpv = CLUSTER_INV.reduce((t, id) => t + cpvOf(id), 0), clusterValue = CLUSTER_INV.reduce((t, id) => t + invById(id).totalValue, 0);
const daysAgo = d => new Date(STORY_DATE.getTime() - d * 864e5);

// Investment Owner (Hollis): the cluster, then investments he owns. Priority, date added and collaborator are [Added].
const OWNER_DECISIONS = [
  { id: 'cluster', title: `${CLUSTER.name} · aging transformers and Pine Ridge lines`, badge: 'Explore', priority: 'critical', added: daysAgo(0), collaborator: 'RB', open: 'explore',
    description: `${ASSETS.length} assets across ${CLUSTER_INV.length} investments serving ~${CLUSTER.customers.toLocaleString()} customers — 2 substation transformers are already past their intervention tolerance.`,
    cpv: clusterCpv, vc: clusterValue / (clusterCpv / 1000) },
  ...[[2893, 'critical', 1, 'RB'], [2889, 'critical', 2, 'NL'], [2897, 'critical', 4, 'TM'], [2894, 'critical', 9, 'KM'], [2910, 'critical', 20, 'PI'],
      [2911, 'high', 6, 'NL'], [2905, 'high', 33, 'KM'], [2883, 'normal', 60, 'TM']].map(([id, priority, ago, collaborator]) => {
    const i = invById(id); return { id, rec: i.code, title: i.name, badge: STAGE_TO_CATALYST[i.stage] || 'Plan', priority, added: daysAgo(ago), collaborator,
      description: firstSentence(i.description) || `${i.division} · ${i.stage}`, cpv: cpvOf(id), vc: vcOf(id) }; }),
];
// Asset Manager (Mara): the cluster and the investments on its assets. Health index and risk from the model.
const AM_DECISIONS = [
  { id: 'cluster', title: `${CLUSTER.name} · aging transformers and Pine Ridge lines`, badge: 'Explore', priority: 'critical', added: daysAgo(0), collaborator: 'HG', open: 'explore',
    description: `${ASSETS.length} assets serving ~${CLUSTER.customers.toLocaleString()} customers — condition and wildfire exposure rising.`, ...assetMetrics(clusterIds) },
  ...[[2891, 2, 'RB'], [104860, 3, 'RB'], [2892, 5, 'RB'], [2893, 8, 'HG'], [8380, 1, 'HG']].map(([id, ago, collaborator]) => {
    const i = invById(id); return { id, rec: i.code, title: i.name, badge: STAGE_TO_CATALYST[i.stage] || 'Plan', priority: 'critical', added: daysAgo(ago), collaborator,
      description: firstSentence(i.description), ...assetMetrics(assetsOfInv(id)) }; }),
  // J04 / J27 [Added]: Cooper's coverage-gap finding (a study it framed) and a model recalibration waiting for the Asset Manager's confirmation
  { id: 'coverage', title: `No long-range position on the ${CLUSTER.short} pad-mounts`, badge: 'Explore', priority: 'critical', added: daysAgo(1), collaborator: 'HG', open: 'study',
    description: `No study or strategy covers these ${ASSETS.filter(a => a.kind === 'padmount').length} pad-mount transformers beyond 2028. Cooper framed a 10-year study with the condition outlook and the climate lenses.`,
    ...assetMetrics(ASSETS.filter(a => a.kind === 'padmount').map(a => a.id)) },
  { id: 'recal', title: 'Confirm recalibration · Pine Ridge line failure curves', badge: 'Value', priority: 'critical', added: daysAgo(2), collaborator: 'IC', open: 'recal', verb: 'Confirm recalibration',
    description: 'Observed failures on the Pine Ridge overhead lines diverged from WDRM v4’s predictions. Cooper proposes refreshing the failure curves.',
    ...assetMetrics(ASSETS.filter(a => a.kind === 'line').map(a => a.id)) },
];
// Portfolio Owner (Owen): approvals on the plan. Scenario numbers are real (Demo Portfolio); the cluster reserve is [Added].
const SC = id => WHISTLER_SCENARIOS.find(s => s.id === id);
const clusterSpend2028 = CLUSTER_INV.reduce((t, id) => t + ((WHISTLER_SELECTED_SPEND[id]?.spendByYear || {})['2028'] || 0), 0);
const CLUSTER_RESERVE_2028 = 5e6;                                                    // [Added] emergency reserve
const PO_DECISIONS = [
  { id: 'cluster', title: `Approve emergency funding · ${CLUSTER.short}`, badge: 'Explore', priority: 'critical', added: daysAgo(0), collaborator: 'HG', open: 'explore',
    description: `${CLUSTER_INV.length} investments on the ${CLUSTER.short} cluster need ${fmtMoney(clusterSpend2028)} in 2028 against a ${fmtMoney(CLUSTER_RESERVE_2028)} reserve.`,
    fvc: `${fmtM(clusterSpend2028)} / ${fmtM(CLUSTER_RESERVE_2028)}`, value: fmtCompact(clusterValue) },
  { id: 7244, title: `Approve re-optimized plan · ${SC(7244).name}`, badge: 'Plan', priority: 'critical', added: daysAgo(1), collaborator: 'NL', open: 'reopt',
    description: `${SC(7244).deferredVsRequested} investments deferred and ${SC(7244).advancedVsRequested} brought forward to fit the 2028 CAPEX cap.`,
    fvc: `${fmtM(SC(7244).capex2028)} / ${fmtM(SC(7244).capexMax2028)}`, value: fmtCompact(SC(7244).totalValue) },
  { id: 6924, title: `Review latest actuals · ${SC(6924).name}`, badge: 'Results', priority: 'critical', added: daysAgo(3), collaborator: 'PI',
    description: `Latest actuals push 2028 CAPEX ${fmtMoney(SC(6924).capex2028 - SC(6924).capexMax2028)} over the cap.`,
    fvc: `${fmtM(SC(6924).capex2028)} / ${fmtM(SC(6924).capexMax2028)}`, value: fmtCompact(SC(6924).totalValue) },
];

/* ---------- my works ([Added] items on real records) ---------- */
const OWNER_WORKS = [
  { id: 'w-idea', title: `${invById(8380).name} — idea`, badge: 'Build', when: 'Yesterday', status: 'Updated', open: 'build', featured: true,
    note: 'Cooper drafted the need and three alternatives from your Alpine Meadows study.' },
  { id: 'w-nester', title: `Justification — ${invById(2893).name}`, badge: 'Explore', when: 'Nov 12', status: 'Draft', note: 'Untouched since you left off · resume at § b.' },
  { id: 'w-poles', title: `Resubmission — ${invById(2889).name}`, badge: 'Build', when: 'Nov 9', status: 'Updated', note: `${short('RB')} left an open comment on line 18.` },
];
const AM_WORKS = [
  { id: 'w-rider', title: 'Study rider — Pine Ridge corridor', badge: 'Build', when: 'Last submitted', status: 'Updated', open: 'study', featured: true,
    note: 'Cooper updated the heat layer with ClimateData.ca SSP5-8.5 while you were away.' },
  { id: 'w-triage', title: 'Coverage triage plan — Alpine Meadows pad-mounts', badge: 'Explore', when: 'Last submitted yesterday', status: 'Draft', note: 'Unmatched error you left off – resolve at § b.' },
  { id: 'w-veg', title: 'Vegetation dispatch notes — OHL-14-2379', badge: 'Build', when: 'Nov 10', status: 'Updated', note: `${PEOPLE.TQ.name.split(' ')[0]} attached two field photos to the open span.` },
];
const PO_WORKS = [
  { id: 'w-reopt', title: 'Re-optimization — CAPEX 2028', badge: 'Plan', open: 'reopt', when: 'Overnight', status: 'Updated', featured: true,
    note: `Cooper re-ran ${SC(7244).name} with the latest actuals while you were away.` },
  { id: 'w-defer', title: `Deferral review — ${SC(6924).name}`, badge: 'Plan', when: 'Yesterday', status: 'Draft', note: 'Unmatched error you left off – resolve at § b.' },
  { id: 'w-opex', title: 'Constraint check — OPEX 2029', badge: 'Plan', when: 'Nov 10', status: 'Draft', note: 'Unmatched error you left off – resolve at § b.' },
];

/* ---------- conversations ([Added] messages from real/added people) ---------- */
const CONVO = (k, person, title, message, status, extra = {}) => ({ id: k, person, title, message, status, ...extra });
const OWNER_CONVOS = [
  CONVO('c1', 'RB', `${PEOPLE.RB.name} · Confirm ${CLUSTER.short} intervention scope`, 'Shaped the Median Replacement across 6 pad-mounts and ran it past Cost and Risk.', '@you', { open: 'build' }),
  CONVO('c2', 'KM', `${short('KM')} replied to your comment on the Wildfire Resilience weight`, 'He’ll back lifting it to 0.30 but wants the trade-off against Reliability spelled out before he signs off. A worked example would help.', 'Rejected'),
  CONVO('c3', 'TM', `${short('TM')} replied to your comment on the Wildfire Resilience weight`, 'He’ll back lifting it to 0.30 but wants the trade-off against Reliability spelled out before he signs off. A worked example would help.', 'Approved'),
  CONVO('c4', 'TM', `${short('TM')} replied to your comment on the Wildfire Resilience weight`, 'He’ll back lifting it to 0.30 but wants the trade-off against Reliability spelled out before he signs off. A worked example would help.', 'Confirm viability'),
  CONVO('c5', 'PI', `${short('PI')} sent the load data you asked for`, 'PM-0010 and PM-0006 are running 88% and 91% — both over band, confirms the study read. I can re-run the transfer if you want.', 'Wait for reply'),
];
const AM_CONVOS = [
  CONVO('c1', 'TQ', `${PEOPLE.TQ.name} · Tara updated the inspection batch on Pine Ridge OHL-14-2381`, 'Status: batch confirmed — the span clearance is within limits. No violation, to 20 cm.', '@you'),
  CONVO('c2', 'HG', `${PEOPLE.HG.name} · Hollis approved the recalibration on the pad-mount cohort`, 'Recalibration approved. The Alpine Meadows pad-mounts are cleared for the next inspection cycle.', 'Approved'),
  CONVO('c3', 'NL', `${PEOPLE.NL.name} · Noah rejected the crew pre-staging budget for Nesters`, 'Threshold hit: deviation hits the cost limits — a stakeholder issue. Under $400K is acceptable, re-submit with the revised crew plan.', 'Rejected'),
  CONVO('c4', 'RB', `${PEOPLE.RB.name} · Ravi mentioned you on the study rider for Pine Ridge`, `@${PERSONAS.asset.first} can you action the scale to reflect the adjusted gross before the approval gate closes?`, 'mention'),
  CONVO('c5', 'LF', `${PEOPLE.LF.name} · Luca is completing the inspection backfill at Alpine Meadows Station`, 'Backfill in progress — 2 of 4 banks complete. Waiting on crew availability for the remaining banks.', 'Wait for reply'),
];
const PO_CONVOS = [
  CONVO('c1', 'HG', `${PEOPLE.HG.name} · Hollis approved the recalibration on the pad-mount cohort`, 'Recalibration approved. The Alpine Meadows pad-mounts are cleared for the next inspection cycle.', 'Approved'),
  CONVO('c2', 'NL', `${PEOPLE.NL.name} · Noah is checking the 2028 CAPEX deferrals`, `Reviewing the ${SC(6924).deferredCount} deferred investments in ${SC(6924).name}. Waiting on division sign-off for the rest.`, 'Wait for reply'),
];

/* ---------- following ---------- */
const OWNER_FOLLOWING = [2891, 104860, 2892].map(id => { const i = invById(id); return { id, title: i.name, description: firstSentence(i.description),
  full: i.description, metrics: [[fmtMoney(cpvOf(id)), 'CPV'], [fmtValue(i.totalValue), 'Total investment value'], [vcLabel(vcOf(id)), 'V/C']] }; });
const AM_FOLLOWING = [
  { id: 'f-pm', title: 'Alpine Meadows pad-mount cohort', description: '12 units at 1.26× design life — reliability risk spread 0.78–4.57.', kind: 'padmount' },
  { id: 'f-ohl', title: 'Pine Ridge corridor spans', description: '5 overhead spans — wildfire risk identified, transmission reliability risk rising.', kind: 'line' },
  { id: 'f-bank', title: 'Alpine Meadows Station banks', description: '4 × 230 kV transformers — Bank 12 and Vantage Bank 11 past tolerance.', kind: 'bank' },
].map(f => { const m = assetMetrics(ASSETS.filter(a => a.type === f.kind).map(a => a.id));
  return { ...f, full: f.description, metrics: [[m.hi, 'Health index'], [m.risk, 'Risk'], [ageVsLife(f.kind), 'Age vs useful life']] }; });
const PO_FOLLOWING = [6864, 6924, 7244].map(id => { const s = SC(id); return { id, title: s.name, full: '',
  description: s.capex2028 > s.capexMax2028 ? `2028 CAPEX ${fmtMoney(s.capex2028 - s.capexMax2028)} over the cap — needs re-optimization.` : `Inside the 2028 CAPEX cap · ${s.deferredVsRequested} deferred vs requested.`,
  metrics: [[`${fmtM(s.capex2028)} / ${fmtM(s.capexMax2028)}`, 'Forecast vs constraint'],
            [`${fmtCompact(s.selectedValue)} · ${s.selectedCount} of ${s.investmentCount}`, 'Total value selected'],
            [`${fmtCompact(s.deferredValue)} · ${s.deferredCount}, ${fmtM(s.deferredCapex)}`, 'Total value unselected']] }; });

/* ---------- calendar ([Added]) ---------- */
const EVENT_TYPES = { milestone: { label: 'Milestone', tone: 'danger' }, scheduled: { label: 'Scheduled event', tone: 'warning' },
  private: { label: 'Private event', tone: 'info' }, regulatory: { label: 'Regulatory events and signals', tone: 'purple' } };
const BASE_EVENTS = [
  { date: '2026-11-04', type: 'private', time: '09:00', lasts: '1 day', by: 'HG' },
  { date: '2026-11-09', type: 'milestone', time: '10:00', lasts: '1 day', by: 'NL', name: 'SG2 draft due' },
  { date: '2026-11-09', type: 'private', time: '14:00', lasts: '1 day', by: 'HG' },
  { date: '2026-11-10', type: 'regulatory', time: '11:15', lasts: '2 days', by: 'KM', name: 'BCUC filing window' },
  { date: '2026-11-10', type: 'scheduled', time: '11:15', lasts: '1 day', by: 'NL' },
  { date: '2026-11-10', type: 'private', time: '11:15', lasts: '2 days', by: 'HG' },
  { date: '2026-11-19', type: 'scheduled', time: '13:00', lasts: '1 day', by: 'NL', name: 'Portfolio review' },
  { date: '2026-11-26', type: 'milestone', time: '09:00', lasts: '1 day', by: 'NL', name: 'SG2 window closes' },
  { date: '2026-11-26', type: 'scheduled', time: '15:00', lasts: '1 day', by: 'OF' },
  { date: '2026-11-26', type: 'private', time: '16:00', lasts: '1 day', by: 'HG' },
];

// J22 [Added]: the CFO's decision queue starts with the plan waiting at the Executive gate; the rest is the Portfolio Owner's portfolio view
const CFO_DECISIONS = [
  { id: 'approve-plan', title: 'Approve the capital plan · 2028 Plan', badge: 'Plan', priority: 'critical', added: daysAgo(0), collaborator: 'OF', open: 'approve',
    description: `${PERSONAS.portfolio.name} sent the 2028 Plan for approval. The Executive gate waits for your decision.`,
    fvc: `${fmtM(SC(6864).capex2028)} / ${fmtM(SC(6864).capexMax2028)}`, value: fmtCompact(SC(6864).totalValue) },
].concat(PO_DECISIONS.filter(d => d.id !== 'cluster'));
const COMMAND = {
  owner: { decisions: OWNER_DECISIONS, works: OWNER_WORKS, convos: OWNER_CONVOS, following: OWNER_FOLLOWING, metrics: 'cpv', followTitle: 'Projects I follow' },
  asset: { decisions: AM_DECISIONS, works: AM_WORKS, convos: AM_CONVOS, following: AM_FOLLOWING, metrics: 'hi', followTitle: 'Projects I follow' },
  portfolio: { decisions: PO_DECISIONS, works: PO_WORKS, convos: PO_CONVOS, following: PO_FOLLOWING, metrics: 'fvc', followTitle: 'Followed works' },
  cfo: { decisions: CFO_DECISIONS, works: PO_WORKS, convos: PO_CONVOS, following: PO_FOLLOWING, metrics: 'fvc', followTitle: 'Followed works' },
  cpm: { decisions: PO_DECISIONS, works: PO_WORKS, convos: PO_CONVOS, following: PO_FOLLOWING, metrics: 'fvc', followTitle: 'Followed works' },
};
