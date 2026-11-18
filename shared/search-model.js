/* Global Search: the index of every searchable record and the search rules (Figma Global Search handover acAfLbn5qy49dNNMouadUR, page 2:61).
   Records are REAL (assets, curated investments, portfolios, named scenarios, value measures); a few fields are [Added] and say so.
   Rules come from the Figma dev notes (context/screens/global-search-spec-*.md); where Figma is silent they are [Assumed] and noted.
   Plain JS, loaded before the app. Logic notes: context/logic/global-search.md. */

/* ---------------------------------------------------------------- types (Figma chip order) */
const SEARCH_TYPES = [
  { key: 'asset', label: 'Assets', one: 'asset', icon: 'map-pin', area: 'Explore', prefixes: ['asset', 'assets', 'a'] },
  { key: 'investment', label: 'Investments', one: 'investment', icon: 'currency-dollar', area: 'Build', prefixes: ['inv', 'investment', 'investments', 'i'] },
  { key: 'portfolio', label: 'Portfolios', one: 'portfolio', icon: 'chat-folder', area: null, prefixes: ['pf', 'portfolio', 'portfolios'] },
  { key: 'scenario', label: 'Scenarios', one: 'scenario', icon: 'map-layers', area: null, prefixes: ['scn', 'scenario', 'scenarios'] },
  { key: 'study', label: 'Studies', one: 'study', icon: 'map-location', area: 'Explore', prefixes: ['study', 'studies'] },
  { key: 'framework', label: 'Value frameworks', one: 'value framework', icon: 'chat-logic-tree', area: 'Value', prefixes: ['vf', 'framework'] },
  { key: 'model', label: 'Value models', one: 'value model', icon: 'chat-logic-tree', area: 'Value', prefixes: ['vm', 'model'] },
  { key: 'location', label: 'Locations', one: 'location', icon: 'map-location', area: 'Explore', prefixes: ['loc', 'location', 'locations'] },
];
const searchType = k => SEARCH_TYPES.find(t => t.key === k);

/* ---------------------------------------------------------------- [Added] dates (the demo data has no edit history) */
const SEARCH_TODAY = new Date('2026-11-18T12:00:00');
const srDaysAgo = n => new Date(SEARCH_TODAY.getTime() - n * 864e5);
const seedDays = (id, max) => { let h = 0; String(id).split('').forEach(c => { h = (h * 31 + c.charCodeAt(0)) % 9973; }); return h % max; };

/* ---------------------------------------------------------------- the index */
const portfolioById = id => SEARCH_PORTFOLIOS.find(p => p.id === id);
const topRegion = p => { let x = p; while (x && x.parentId && portfolioById(x.parentId)?.parentId) x = portfolioById(x.parentId); return x && x.parentId ? x.name : '—'; };
const assetCondition = a => { const r = assess(a, NOW, []).risk, t = TOLERANCE[a.type]; return r >= t ? 'Critical' : r >= 0.8 * t ? 'Moderate' : 'Healthy'; };
// [Assumed] workflow status from the investment's real stage (the demo has no workflow history)
const INV_STATUS = { 'Initial': 'Draft', 'Long Term Planning': 'In review', 'Short Term Planning': 'Approved', 'Executing': 'Approved' };
const MEASURE_FRAMEWORK = { 1: 'Risk value framework', 2: 'Benefit value framework', 3: 'Cost value framework' };   // [Added] one framework per real measure category
const SEARCH_LOCATIONS = [                                                                                        // [Added] from the real Whistler geography the map uses
  { id: 'whistler', name: 'Whistler', level: 'Region', region: 'Sea-to-Sky' },
  { id: 'village', name: 'Whistler Village', level: 'District', region: 'Sea-to-Sky' },
  { id: 'alpine', name: 'Alpine Meadows', level: 'District', region: 'Sea-to-Sky' },
  { id: 'nesters', name: 'Nesters', level: 'District', region: 'Sea-to-Sky' },
  { id: 'greenlake', name: 'Green Lake', level: 'District', region: 'Sea-to-Sky' },
  { id: 'cluster', name: CLUSTER.name, level: 'Cluster', region: 'Sea-to-Sky' },
  { id: 'pineridge', name: 'Pine Ridge corridor', level: 'Cluster', region: 'Sea-to-Sky' },
];

const SEARCH_INDEX = [
  ...ASSETS.map(a => ({ type: 'asset', id: a.id, code: a.code.trim(), name: a.label, alt: a.name,
    detail: [TYPE_LABEL[a.type], a.parent, 'Whistler'], status: assetCondition(a),
    f: { 'Asset type': TYPE_LABEL[a.type], 'Area': a.parent, 'Condition': assetCondition(a) }, open: { screen: 'explore', asset: a.id } })),
  ...WHISTLER_INVESTMENTS.map(i => ({ type: 'investment', id: i.id, code: i.code, name: i.name, detail: [i.portfolio || i.division, `Owner: ${i.owner}`], status: INV_STATUS[i.stage] || 'Draft',
    owner: i.owner, f: { 'Status': INV_STATUS[i.stage] || 'Draft', 'Portfolio': i.portfolio || i.division }, open: i.id === CLUSTER.ideaInvestmentId ? { screen: 'build' } : { toast: 'Build' } })),
  ...SEARCH_PORTFOLIOS.map(p => ({ type: 'portfolio', id: p.id, code: `PF-${String(p.id).padStart(4, '0')}`, name: p.name,
    detail: [portfolioById(p.parentId)?.name || 'Top level', `${p.investmentCount.toLocaleString()} investments`],
    status: p.id === PLAN_PORTFOLIO.id ? 'Planning' : p.hasConstraints ? 'Planning' : 'Active',
    f: { 'Type': p.id === PLAN_PORTFOLIO.id || p.hasConstraints ? 'Planning' : 'Ad hoc', 'Region': topRegion(p) }, open: p.id === PLAN_PORTFOLIO.id ? { screen: 'plan' } : { toast: 'Plan' } })),
  ...SEARCH_SCENARIOS.map(s => ({ type: 'scenario', id: s.id, code: `SCN-${String(s.id).padStart(4, '0')}`, name: s.name,
    detail: [portfolioById(s.scopePortfolioId)?.name || 'All portfolios', s.type], status: s.type,
    f: { 'Status': s.type, 'Portfolio': portfolioById(s.scopePortfolioId)?.name || 'All portfolios' },
    open: SETUP_SCENARIOS.some(x => x.id === s.id) || s.id === PLAN_BASELINE_ID ? { screen: 'plan-compare' } : { toast: 'Plan' } })),
  { type: 'study', id: 'alpine-study', code: 'ST-0001', name: `${CLUSTER.short} Study`, detail: [CLUSTER.name, `${ASSETS.length} assets`], status: 'Draft',     // [Added] the study the J03 tour builds
    f: { 'Region': 'Sea-to-Sky' }, owner: PERSONAS.owner.name, open: { screen: 'study' } },
  ...[...new Set(Object.values(MEASURE_FRAMEWORK))].map((n, k) => ({ type: 'framework', id: `vf-${k}`, code: `VF-${String(k + 1).padStart(3, '0')}`, name: n,
    detail: [`${SEARCH_MEASURES.filter(m => MEASURE_FRAMEWORK[m.category] === n).length} value models`], status: 'Active', f: { 'Status': 'Active' }, open: { toast: 'Value' } })),
  ...SEARCH_MEASURES.map(m => ({ type: 'model', id: m.id, code: `VM-${String(m.id).padStart(4, '0')}`, name: m.name, detail: [MEASURE_FRAMEWORK[m.category] || 'Value framework'],
    status: 'Active', f: { 'Framework': MEASURE_FRAMEWORK[m.category] || 'Value framework', 'Status': 'Active' }, open: { toast: 'Value' } })),
  ...SEARCH_LOCATIONS.map(l => ({ type: 'location', id: l.id, code: `LOC-${l.id.slice(0, 3).toUpperCase()}`, name: l.name, detail: [l.level, l.region], status: null,
    f: { 'Region': l.region, 'Level': l.level }, open: { screen: 'explore' } })),
].map(r => ({ ...r, updated: srDaysAgo(seedDays(r.type + r.id, 400)), created: srDaysAgo(400 + seedDays(r.id + r.type, 900)) }));

/* ---------------------------------------------------------------- filters per type (Figma 3.6; values come from the records) */
const SEARCH_FILTERS = { all: [], asset: ['Asset type', 'Area', 'Condition'], investment: ['Status', 'Portfolio'], portfolio: ['Type', 'Region'],
  scenario: ['Status', 'Portfolio'], study: ['Region'], framework: ['Status'], model: ['Framework', 'Status'], location: ['Region', 'Level'] };
const SEARCH_UPDATED = [['any', 'Any time', 1e9], ['7', 'Last 7 days', 7], ['30', 'Last 30 days', 30], ['365', 'Last year', 365]];
const SEARCH_HAS_OWNER = t => ['all', 'investment', 'study'].includes(t);     // the records that carry an owner
const SEARCH_OWNERS = [...new Set(SEARCH_INDEX.map(r => r.owner).filter(Boolean))].sort();
const filterValues = (type, group) => [...new Set(SEARCH_INDEX.filter(r => r.type === type).map(r => r.f[group]).filter(Boolean))].sort();
const SEARCH_SORTS = [['relevance', 'Relevance'], ['name', 'Name A–Z'], ['edited', 'Last edited'], ['created', 'Created date']];

/* ---------------------------------------------------------------- query parsing */
const FILLER = new Set(['a', 'an', 'the', 'of', 'in', 'on', 'at', 'for', 'to', 'and', 'or', 'with', 'are', 'is', 'which', 'what', 'who', 'where', 'show', 'me', 'my', 'all', 'find', 'any', 'q1', 'q2', 'q3', 'q4', 'that', 'by']);
const stem = w => w.replace(/(ies)$/, 'y').replace(/(es|s)$/, '').replace(/ing$/, '');
const words = s => s.toLowerCase().replace(/[“”"?!.,;:()]/g, ' ').split(/\s+/).flatMap(w => /\d/.test(w) ? [w] : w.split('-')).filter(Boolean);
// Attribute words in a question are offered as filters (Narrow with), not matched as text (Figma 6 · Question)
const ATTRIBUTE_WORDS = new Set(['risk', 'risky', 'critical', 'healthy', 'moderate', 'condition', 'status', 'draft', 'approved']);
// A code matches exactly when it equals the query, ignoring spaces, or when the query is its last part ("PM-0005" → WD-LV-PM-0005)
const codeKey = c => c.toLowerCase().replace(/\s+/g, '');
const codeExact = (code, q) => { const k = codeKey(code), t = codeKey(q); return !!t && (k === t || (t.length >= 4 && /\d/.test(t) && (k.endsWith('-' + t) || k.split(/-(?=[a-z])/).slice(1).join('-') === t || k.startsWith(t + '-') && !/\d/.test(k.slice(t.length + 1))))); };
const isQuestion = q => /\?\s*$/.test(q) || /^(which|what|who|where|when|why|how|show me|find)\b/i.test(q.trim());
// Prefixes typed at the start: "asset:" → type pill; "code:" / "name:" → Match
function parsePrefix(q) {
  const m = q.match(/^\s*([a-z]+):\s*/i);
  if (!m) return null;
  const p = m[1].toLowerCase(), rest = q.slice(m[0].length);
  if (p === 'code' || p === 'id') return { match: 'code', rest };
  if (p === 'name') return { match: 'name', rest };
  const t = SEARCH_TYPES.find(x => x.prefixes.includes(p));
  return t ? { type: t.key, rest } : null;
}
// A code prefix alone ("OHL-", "DIST", "SCN-") sets the type: every match is a code prefix of one type, and no name matches
function codePrefixType(q) {
  const t = q.trim().toLowerCase();
  if (t.length < 2 || /\s/.test(t)) return null;
  const hits = SEARCH_INDEX.filter(r => r.code.toLowerCase().startsWith(t));
  const types = [...new Set(hits.map(r => r.type))];
  const nameHit = SEARCH_INDEX.some(r => !r.name.toLowerCase().includes(r.code.toLowerCase()) && r.name.toLowerCase().split(/\s+/).some(w => w.startsWith(t)));
  const exact = SEARCH_INDEX.some(r => r.code.toLowerCase() === t);
  return types.length === 1 && hits.length >= 2 && !nameHit && !exact ? types[0] : null;
}
// Words that name a known filter value (an owner's first name, an area, a portfolio, a status, an asset type)
function valueWords(q, type) {
  const out = [];
  words(q).forEach(w => {
    if (FILLER.has(w) || w.length < 3) return;
    const cands = [];
    SEARCH_OWNERS.forEach(o => { if (o.toLowerCase().split(' ').some(p => p === w)) cands.push({ group: 'Owner', value: o, type: 'all' }); });
    SEARCH_TYPES.forEach(t => (SEARCH_FILTERS[t.key] || []).forEach(g => filterValues(t.key, g).forEach(v => {
      if (v.toLowerCase().split(/[\s()]+/).some(p => stem(p) === stem(w) && p.length >= 3)) cands.push({ group: g, value: v, type: t.key });
    })));
    if (stem(w) === 'risk' || w === 'critical') cands.push({ group: 'Condition', value: 'Critical', type: 'asset' });
    const uniq = cands.filter((c, i) => cands.findIndex(d => d.group === c.group && d.value === c.value) === i);
    if (uniq.length) out.push({ word: w, cands: uniq, unique: uniq.length === 1 && (uniq[0].type === 'all' || uniq[0].type === type) });
  });
  return out;
}

/* ---------------------------------------------------------------- matching and ranking */
const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
const VOCAB = [...new Set(SEARCH_INDEX.flatMap(r => words(`${r.name} ${r.code} ${r.detail.join(' ')}`)))];
function scoreOf(r, ws, raw, match) {
  const code = r.code.toLowerCase(), name = r.name.toLowerCase(), hay = `${name} ${(r.alt || '').toLowerCase()} ${r.detail.join(' ').toLowerCase()}`, q = raw.trim().toLowerCase();
  if (match !== 'name' && codeExact(r.code, raw)) return 100;
  if (match !== 'code' && name === q) return 90;
  if (match !== 'name' && q && code.startsWith(q)) return 70;
  if (match !== 'name' && q.length >= 2 && code.replace(/\D/g, '').includes(q.replace(/\D/g, '')) && /\d/.test(q) && match === 'code') return 60;
  if (match === 'code') return code.includes(q) && q ? 50 : 0;
  if (!ws.length) return 0;
  const inName = ws.filter(w => name.split(/[\s\-–—·()]+/).some(p => p.startsWith(w) || stem(p) === stem(w)));
  if (match === 'name') return inName.length === ws.length ? 40 + inName.length : 0;
  const inAny = ws.filter(w => hay.split(/[\s\-–—·()]+/).some(p => p.startsWith(w) || stem(p) === stem(w)) || code.includes(w));
  return inAny.length === ws.length ? 20 + inName.length * 5 : 0;
}
// The whole search. state = { q, type, match, filters: { group: value }, owners: [..] | null, updated, sort }
function runSearch(state) {
  const { q, type = 'all', match = 'any', filters = {}, owners = null, updated = 'any', sort = 'relevance' } = state;
  const ws = words(q).filter(w => !FILLER.has(w) && !ATTRIBUTE_WORDS.has(w));
  let corrected = null;
  const score = ws2 => SEARCH_INDEX.map(r => ({ r, s: scoreOf(r, ws2, q, match) })).filter(x => x.s > 0);
  let hits = score(ws);
  if (!hits.length && ws.length && match !== 'code') {                                  // typo tolerance: nearest known word within 2 edits
    const fixed = ws.map(w => VOCAB.includes(w) ? w : (VOCAB.map(v => [v, lev(w, v)]).filter(([v, d]) => d <= (w.length > 5 ? 2 : 1) && Math.abs(v.length - w.length) <= 2).sort((a, b) => a[1] - b[1])[0] || [w])[0]);
    if (fixed.join(' ') !== ws.join(' ')) { const h2 = score(fixed); if (h2.length) { hits = h2; corrected = fixed.join(' '); } }
  }
  const counts = Object.fromEntries(SEARCH_TYPES.map(t => [t.key, hits.filter(x => x.r.type === t.key).length]));   // chip counts ignore filters
  const days = (SEARCH_UPDATED.find(u => u[0] === updated) || SEARCH_UPDATED[0])[2];
  let rows = hits.filter(x => (type === 'all' || x.r.type === type)
    && Object.entries(filters).every(([g, v]) => !v || x.r.f[g] === v)
    && (!owners || !x.r.owner || owners.includes(x.r.owner))
    && (SEARCH_TODAY - x.r.updated) / 864e5 <= days);
  const cmp = { relevance: (a, b) => b.s - a.s || a.r.name.localeCompare(b.r.name), name: (a, b) => a.r.name.localeCompare(b.r.name),
    edited: (a, b) => b.r.updated - a.r.updated, created: (a, b) => b.r.created - a.r.created }[sort];
  rows = rows.sort(cmp).map(x => x.r);
  // Best match: only an exact code or name match, and only if it's unique (no best match for duplicates or a code prefix)
  const exact = hits.filter(x => x.s >= 90);
  const best = exact.length === 1 && rows[0] && rows[0] === exact[0].r ? rows[0] : null;
  const dupes = exact.length > 1;
  return { rows, counts, total: Object.values(counts).reduce((a, b) => a + b, 0), best, dupes, corrected, question: isQuestion(q) };
}
// What would widen an empty result (Figma 6): only options that find something, with their counts
function widenOptions(state) {
  const out = [];
  if (state.match !== 'any') { const n = runSearch({ ...state, match: 'any' }).rows.length; if (n) out.push({ id: 'match', label: 'Match any field instead', n }); }
  if (Object.values(state.filters || {}).some(Boolean) || state.owners || state.updated !== 'any') {
    const n = runSearch({ ...state, filters: {}, owners: null, updated: 'any' }).rows.length; if (n) out.push({ id: 'filters', label: 'Remove filters', n }); }
  if (state.type !== 'all') { const n = runSearch({ ...state, type: 'all', filters: {} }).rows.length; if (n) out.push({ id: 'types', label: 'Show all types', n }); }
  return out;
}
const SEARCH_STATUS_DOT = { Healthy: 'success', Approved: 'success', Planning: 'success', Moderate: 'warning', Critical: 'error', 'In review': 'blue' };
