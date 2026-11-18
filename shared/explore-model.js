/* Explore for the Asset Manager (J02): the asset hierarchy, the Trace Report (data-quality questions) and Global Search.
   Assets are REAL (whistler-data.js via whistler-additions.js). Groups use the real parent of each asset; the tree above them
   is [Added]. The Trace Report items are [Assumed] rules over the real data, with Figma's wording (Explore 29:345530).
   Plain JS, loaded before the app. Logic notes: context/logic/explore-data.md. */

/* ---------------------------------------------------------------- hierarchy */
// Groups = the real `parent` of each asset in the demo data
const ASSET_GROUPS = [
  { id: 'g-banks', label: 'Alpine Meadows Station', branch: 'Substations', kind: 'bank' },
  { id: 'g-cb', label: 'Whistler Substations (HV)', branch: 'Substations', kind: 'breaker' },
  { id: 'g-pm', label: 'Alpine Meadows', branch: 'Distribution', kind: 'padmount' },
  { id: 'g-lines', label: 'Transmission Lines', branch: 'Transmission', kind: 'line' },
].map(g => ({ ...g, assets: ASSETS.filter(a => a.type === g.kind).map(a => a.id) }));
const groupById = id => ASSET_GROUPS.find(g => g.id === id);
const groupOfAsset = id => ASSET_GROUPS.find(g => g.assets.includes(id));
// [Added] the levels above the groups
const ASSET_TREE = [{ id: 'co', label: COMPANY.name, children: [{ id: 'elec', label: 'Electrical', children:
  ['Transmission', 'Distribution', 'Substations'].map(b => ({ id: `b-${b}`, label: b, children: ASSET_GROUPS.filter(g => g.branch === b)
    .map(g => ({ id: g.id, label: g.label, folder: true, children: g.assets.map(id => ({ id, label: assetById(id).label.replace(/^(Pad-mount|Pine Ridge|Alpine Meadows|Nesters) /, '') })) })) })) }] }];
const ASSET_TREE_PATH = id => { const g = groupById(id) || groupOfAsset(id); return g ? ['co', 'elec', `b-${g.branch}`, g.id] : ['co', 'elec']; };

/* ---------------------------------------------------------------- Trace Report (Explore › data quality) */
const LINES = ASSETS.filter(a => a.type === 'line'), PADMOUNTS = ASSETS.filter(a => a.type === 'padmount'), BANKS = ASSETS.filter(a => a.type === 'bank');
// The assets the flood lens actually moves (≥ 2 risk points by the horizon), worked out from the risk model
const FLOOD_ASSETS = ASSETS.filter(a => (drivers(a, END, activeOf(INITIAL_LENSES)).find(d => d.id === 'flood') || {}).delta >= 2);
const WILDFIRE_LAPSED = { vendor: 'Verisk FireLine', since: '14 Mar', weeksOld: 11 };    // [Assumed] from the Figma layer copy (29:345530)
const TRACE_ISSUES = [
  { id: 'q-flood', kind: 'question', title: 'Flood extent binds the floor at 2 km',
    description: `${FLOOD_ASSETS.map(a => a.label).join(', ')} sit inside one 2 km cell of the ${LENS_INFO.flood.sources[0].label}, so they can’t be told apart spatially. Their order comes from asset attributes, which are exact.`,
    solutions: [{ id: 'swap', title: 'Swap to First Street, 30 m', recommended: true }, { id: 'accept', title: 'Accept the cap' }], answer: true },
  { id: 'q-spans', kind: 'question', title: `${LINES.length} spans have no clearance data`,
    description: `${LINES[0].code} to ${LINES[LINES.length - 1].code} on the Pine Ridge corridor have no vegetation-clearance inspection on record, so their wildfire exposure uses the corridor default.`,
    solutions: [{ id: 'default', title: 'Keep the corridor default' }], upload: true, answer: true },
  { id: 'q-fire', kind: 'question', title: 'Wildfire hazard is vendor-tier',
    description: `The ${WILDFIRE_LAPSED.vendor} licence lapsed ${WILDFIRE_LAPSED.since}. Wildfire hazard has been drawing a cached tile since. It still renders, so the map looks normal, but the numbers behind it are ${WILDFIRE_LAPSED.weeksOld} weeks old.`,
    solutions: [{ id: 'renew', title: 'Renew it in System Settings › Data Marketplace' }], answer: true },
  { id: 'w-estimated', kind: 'warning', title: `${PADMOUNTS.length * YEARS.length} values are not measured`,
    description: `Cooper drafted the condition of the ${PADMOUNTS.length} pad-mounts from their normalised age (no inspection on record) and marked each one. The ranking runs on them.`, okay: true },
];
// Short label shown on an affected asset while the item is open (degraded confidence stated where it applies)
const TRACE_SHORT = { 'q-flood': 'Flood data: one 2 km cell', 'q-spans': 'No clearance data', 'q-fire': `Wildfire data ${WILDFIRE_LAPSED.weeksOld} weeks old`, 'w-estimated': 'Condition estimated from age' };
// Which open items weaken which assets' numbers (shown on their details)
const TRACE_AFFECTS = { 'q-fire': a => a.type === 'line', 'q-spans': a => a.type === 'line', 'q-flood': a => FLOOD_ASSETS.includes(a), 'w-estimated': a => a.type === 'padmount' };
const traceDone = st => !!(st && (st.applied || st.answer || st.file || st.viewed));
// The flood fix really changes the lens source, so every risk number recalculates
const lensesWithTrace = (lenses, trace) => (trace['q-flood'] || {}).applied === 'swap'
  ? lenses.map(l => l.id === 'flood' ? { ...l, src: Math.max(0, l.sources.findIndex(s => /First Street/.test(s.label))) } : l) : lenses;

/* ---------------------------------------------------------------- Global Search */
function globalSearch(q) {
  const t = q.trim().toLowerCase();
  if (!t) return { assets: [], investments: [] };
  const score = (code, name) => { const c = code.toLowerCase(), n = name.toLowerCase();
    return c === t ? 3 : c.startsWith(t) || c.replace(/\s/g, '').startsWith(t.replace(/\s/g, '')) ? 2 : (c.includes(t) || n.includes(t)) ? 1 : 0; };
  const assets = ASSETS.map(a => ({ kind: 'asset', id: a.id, code: a.code.trim(), name: a.label, detail: `${TYPE_LABEL[a.type]} · ${a.parent}`, a, s: score(a.code, `${a.label} ${a.name}`) }))
    .filter(x => x.s).sort((x, y) => y.s - x.s || x.code.localeCompare(y.code));
  const investments = WHISTLER_INVESTMENTS.map(i => ({ kind: 'investment', id: i.id, code: i.code, name: i.name, detail: `${i.stage} · ${i.portfolio || i.division || ''}`, s: score(i.code, i.name) }))
    .filter(x => x.s).sort((x, y) => y.s - x.s);
  return { assets, investments };
}

/* ---------------------------------------------------------------- studies (J03: Study Library) */
// A study = a name, a population (asset ids), its lens set (on / source) and a horizon year.
// The library starts with one study per real asset group plus the whole cluster [Added]; saved studies are added on top (persisted).
const STUDY_SEEDS = [
  { id: 'st-cluster', name: CLUSTER.name, ids: null, hoursAgo: 26 },
  ...ASSET_GROUPS.filter(g => g.id !== 'g-pm').map((g, k) => ({ id: `st-${g.id}`, name: g.label, ids: g.assets, hoursAgo: [3, 49, 120][k] })),   // the pad-mount group is left for the J03 tour to save
].map(s => ({ ...s, lenses: INITIAL_LENSES.map(l => ({ id: l.id, on: l.on, src: l.src })), year: NOW, savedAt: Date.now() - s.hoursAgo * 36e5, seed: true }));
const studyCount = st => st.ids ? st.ids.length : ASSETS.length;
const ago = t => { const m = Math.max(1, Math.round((Date.now() - t) / 6e4)); return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : m < 10080 ? `${Math.round(m / 1440)}d ago` : `${Math.round(m / 10080)}w ago`; };
// System Confidence for a study [Assumed]: 96% minus 6 points per open question and 4 per open warning that affects its assets.
// Same Trace Report items as Explore (TRACE_ISSUES), so answering one in either place shows in both.
const studyIssues = ids => TRACE_ISSUES.filter(i => scopeAssets(ids).some(a => TRACE_AFFECTS[i.id](a)));
const studyConfidence = (ids, trace) => Math.max(50, 96 - studyIssues(ids).reduce((t, i) => t + (traceDone(trace[i.id]) ? 0 : i.kind === 'question' ? 6 : 4), 0));
