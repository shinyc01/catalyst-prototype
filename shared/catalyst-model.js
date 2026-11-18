/* Catalyst model — the shared risk & area-risk logic every prototype uses.
   Rules are explained in context/logic/risk.md (Confirmed rules vs Assumed numbers).
   Needs shared/whistler-data.js (real demo data) and shared/whistler-additions.js (ASSETS, ZONES, AREA, TOLERANCE…) loaded first.
   Plain JS (no JSX): loaded with <script src>, inlined into standalone files by prototypes/build.sh. */
/* ============================================================ RISK MODEL — all the logic lives here; edit numbers freely
   Risk = Likelihood of failure (0–1) × Consequence of failure (1–10) × 10  →  0–100 per asset.
   Base condition = the asset on its own: likelihood by year and consequence come from each asset's Whistler outlook
   (condition, normalized age, health score, reliability risk), mapped in scripts/make-whistler-data.py.
   Lenses = external influences from outside data sources:
     · likelihood lenses (Flood, Extreme Heat, EV load) → would this asset fail when it happens, and how likely is it here?
     · consequence lenses (Oil containment, Critical habitat) → the same failure costs more in this place. */
const NOW = 2026, END = NOW + 10;
const YEARS = Array.from({ length: END - NOW + 1 }, (_, i) => NOW + i);

// Intervention tolerance per asset type — the company's line for "act now" (default ≈ start of High). Crossing it notifies you.
// TOLERANCE and TYPE_LABEL (per asset kind) are defined in whistler-additions.js
const BANDS = [
  { id: 'low', label: 'Low', min: 0, color: 'var(--element-map-pin-fill-success)', badge: 'green' },
  { id: 'moderate', label: 'Moderate', min: 20, color: 'var(--element-map-pin-fill-warning)', badge: 'orange' },
  { id: 'high', label: 'High', min: 40, color: 'var(--data-viz-alert-data-3)', badge: 'red' },
  { id: 'critical', label: 'Critical', min: 60, color: 'var(--data-viz-alert-data-5)', badge: 'red' },
];
const bandOf = r => [...BANDS].reverse().find(b => r >= b.min);

const assetById = id => ASSETS.find(a => a.id === id);
// Lens hazards over time. k = multiplier from the chosen data source.
const LENS_DEFS = {
  flood: { kind: 'likelihood', hazard: y => (y < 2029 ? 0.10 : 0.22 + 0.012 * (y - 2029)) },   // annual chance the area floods; floodplain re-delineated in 2029
  heat: { kind: 'likelihood', hazard: y => 0.15 + 0.07 * (y - NOW) },                          // heat-day stress index from the climate projection
  ev: { kind: 'likelihood', hazard: y => Math.min(0.2, 0.02 * (y - NOW)) },                     // peak-load growth from EV adoption (+20% by 2036)
  oil: { kind: 'consequence', factor: 1.0 },                                                    // a spill without containment
  habitat: { kind: 'consequence', factor: 1.2 },                                                // repairs inside endangered-species habitat
};
const pofFromAge = x => 1 / (1 + Math.exp(-8 * (x - 1.05)));
const combine = (p, q) => 1 - (1 - p) * (1 - q);

function assess(a, year, active) {
  const on = id => active.find(l => l.id === id);
  const basePof = a.lof[Math.max(0, Math.min(a.lof.length - 1, year - NOW))];             // from the Whistler outlook
  let pof = basePof, cof = a.cof;
  const heat = on('heat');   if (heat) pof = combine(pof, a.exp.heat * LENS_DEFS.heat.hazard(year) * heat.k * 0.45);    // heat stress on heat-sensitive kit
  const flood = on('flood'); if (flood) pof = combine(pof, LENS_DEFS.flood.hazard(year) * flood.k * a.exp.flood);        // P(flood here) × P(fails | flood)
  const ev = on('ev');       if (ev) pof = combine(pof, LENS_DEFS.ev.hazard(year) * ev.k * a.exp.ev * 1.6);                // overload on peak evenings
  ['oil', 'habitat'].forEach(id => { const l = on(id); if (l) cof *= 1 + a.exp[id] * LENS_DEFS[id].factor * l.k; });
  cof = Math.min(10, cof);
  return { pof, cof, risk: Math.min(100, pof * cof * 10), basePof, baseCof: a.cof, baseRisk: basePof * a.cof * 10 };
}
const drivers = (a, year, active) => {
  const all = assess(a, year, active).risk;
  return active.map(l => ({ id: l.id, delta: all - assess(a, year, active.filter(o => o.id !== l.id)).risk }));
};
function cluster(year, active) {
  const rows = ASSETS.map(a => { const r = assess(a, year, active); return { a, ...r, band: bandOf(r.risk), tol: TOLERANCE[a.type], over: r.risk >= TOLERANCE[a.type] }; });
  return { rows, score: Math.round(rows.reduce((s, r) => s + r.risk, 0)), valueM: +rows.reduce((s, r) => s + r.pof * r.a.costM, 0).toFixed(1), over: rows.filter(r => r.over).length };
}
const crossYear = (a, active) => YEARS.find(y => assess(a, y, active).risk >= TOLERANCE[a.type]) ?? null;
// Threshold year = the first NEW crossing: the earliest year an asset that is not already over tolerance today (on condition alone)
// crosses its tolerance. Assets already over in NOW are flagged separately — they need action now.
const overNow = ASSETS.filter(a => assess(a, NOW, []).risk >= TOLERANCE[a.type]).map(a => a.id);
const firstCrossing = active => { const ys = ASSETS.filter(a => !overNow.includes(a.id)).map(a => crossYear(a, active)).filter(y => y !== null); return ys.length ? Math.min(...ys) : null; };

const M_LAT = 111000, M_LNG = 111000 * Math.cos((AREA.s + AREA.n) / 2 * Math.PI / 180);
/* ============================================================ AREA RISK GRID
   The map is covered by small squares. Each square has its own risk = base + the risk each active lens adds.
   The colour always shows the total, so turning on a lens can push a green square to red. */
const CELL_LAT = 0.001, CELL_LNG = +(0.001 * M_LAT / M_LNG).toFixed(5);   // ≈ 110 m squares at this latitude
const AREA_BANDS = [   // Figma heat-grid ramp: blue → green → yellow → red
  { id: 'vlow', label: 'Very low', min: 0, token: '--data-viz-data-6' },
  { id: 'low', label: 'Low', min: 10, token: '--element-map-pin-fill-success' },
  { id: 'moderate', label: 'Moderate', min: 22, token: '--element-map-pin-fill-warning' },
  { id: 'high', label: 'High', min: 40, token: '--background-system-danger' },
  { id: 'critical', label: 'Critical', min: 60, token: '--data-viz-alert-data-7' },
];
const areaBandOf = r => [...AREA_BANDS].reverse().find(b => r >= b.min);

// smooth value noise → patchy, natural-looking areas
const hash = (i, j, s) => { const x = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return x - Math.floor(x); };
function noise(lat, lng, scale, seed) {
  const x = (lng - AREA.w) / scale, y = (lat - AREA.s) / scale, i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
  const sm = t => t * t * (3 - 2 * t), a = hash(i, j, seed), b = hash(i + 1, j, seed), c = hash(i, j + 1, seed), d = hash(i + 1, j + 1, seed);
  return a + (b - a) * sm(fx) + (c - a) * sm(fy) + (a - b - c + d) * sm(fx) * sm(fy);
}
const metres = (p, q) => Math.hypot((p[0] - q[0]) * M_LAT, (p[1] - q[1]) * M_LNG);
function distToSeg(p, a, b) {
  const ax = (a[1] - p[1]) * M_LNG, ay = (a[0] - p[0]) * M_LAT, bx = (b[1] - p[1]) * M_LNG, by = (b[0] - p[0]) * M_LAT;
  const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(ax + t * dx, ay + t * dy);
}
const distToAsset = (p, a) => a.line ? Math.min(...a.line.slice(1).map((q, i) => distToSeg(p, a.line[i], q))) : metres(p, a.at);
function inPoly(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [yi, xi] = poly[i], [yj, xj] = poly[j];
    if ((yi > p[0]) !== (yj > p[0]) && p[1] < (xj - xi) * (p[0] - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const distToPoly = (p, poly) => Math.min(...poly.map((q, i) => distToSeg(p, poly[(i + poly.length - 1) % poly.length], q)));
const zoneField = (p, poly, edge) => inPoly(p, poly) ? 1 : Math.max(0, 1 - distToPoly(p, poly) / edge);

// Static fields per square (computed once, cached): how exposed this patch of ground is to each lens
const fieldCache = new Map();
function fields(lat, lng) {
  const key = lat.toFixed(5) + ',' + lng.toFixed(5);
  let f = fieldCache.get(key); if (f) return f;
  const p = [lat, lng], n1 = noise(lat, lng, 0.006, 1), n2 = noise(lat, lng, 0.004, 2), n3 = noise(lat, lng, 0.003, 3);
  const prox = ASSETS.map(a => Math.exp(-distToAsset(p, a) / 160));
  f = {
    prox, n1,
    flood: Math.max(...ZONES.flood.map(z => zoneField(p, z, 250))) * (0.75 + 0.25 * n2),
    heat: Math.min(1, 0.2 + 0.6 * ((AREA.e - lng) / (AREA.e - AREA.w)) + 0.3 * n3),                 // hotter, drier west slopes (wildfire country)
    habitat: Math.max(...ZONES.habitat.map(z => zoneField(p, z, 150))),
    oil: Math.max(...ZONES.oil.map(q => Math.max(0, 1 - metres(p, q) / 320))),
    ev: Math.max(...ZONES.load.map(q => Math.exp(-metres(p, q) / 220))),
    cof: 3.5 + 3 * n1 + Math.max(...ZONES.people.map(([la, ln, r]) => 2.5 * Math.exp(-metres(p, [la, ln]) / r))),  // people & critical loads
  };
  fieldCache.set(key, f); return f;
}
// Risk of one square, one year: likelihood × consequence × 10
function areaRisk(lat, lng, year, active, basePofs) {
  const f = fields(lat, lng), on = id => active.find(l => l.id === id);
  let L = 0.05 + 0.2 * f.n1 * f.n1;
  ASSETS.forEach((a, i) => { L = combine(L, basePofs[i] * f.prox[i] * 0.9); });            // aging equipment nearby
  let C = f.cof;
  const fl = on('flood');   if (fl) L = combine(L, Math.min(0.95, f.flood * LENS_DEFS.flood.hazard(year) / 0.25 * fl.k * 1.0));
  const ht = on('heat');    if (ht) L = combine(L, f.heat * LENS_DEFS.heat.hazard(year) / 0.85 * ht.k * 0.55);
  const ev = on('ev');      if (ev) L = combine(L, f.ev * LENS_DEFS.ev.hazard(year) / 0.2 * ev.k * 0.45);
  const ol = on('oil');     if (ol) C *= 1 + f.oil * ol.k;
  const hb = on('habitat'); if (hb) C *= 1 + f.habitat * 1.3 * hb.k;
  return Math.min(100, L * Math.min(10, C) * 10);
}
const basePofsFor = year => ASSETS.map(a => a.lof[Math.max(0, Math.min(a.lof.length - 1, year - NOW))]);

// Asset exposure to each lens = the ground it stands on (fields above) × how sensitive its kind is (KINDS in additions)
function exposureOf(a) {
  const pts = a.line ? [a.line[0], [(a.line[0][0] + a.line[1][0]) / 2, (a.line[0][1] + a.line[1][1]) / 2], a.line[1]] : [a.at];
  const avg = k => pts.reduce((t, p) => t + fields(p[0], p[1])[k], 0) / pts.length, s = KINDS[a.type].sens;
  return { flood: +(Math.min(1, avg('flood') * 1.2) * s.flood).toFixed(2), heat: +(avg('heat') * s.heat).toFixed(2),
           oil: +(avg('oil') * s.oil).toFixed(2), habitat: +avg('habitat').toFixed(2), ev: +(avg('ev') * s.ev).toFixed(2) };
}
ASSETS.forEach(a => { a.exp = exposureOf(a); });

/* ============================================================ lenses (UI side) */
const LENS_INFO = {
  flood: { label: 'Flood Risk', color: 'var(--data-viz-data-6)', icon: 'map-risk-flood', sources: [{ label: 'RMOW floodplain maps 2024', k: 1 }, { label: 'First Street v3', k: 1.3 }],
    how: 'How likely the area is to flood, times how likely each asset is to fail when it does. The updated River of Golden Dreams floodplain takes effect in 2029.' },
  heat: { label: 'Extreme Heat', color: 'var(--data-viz-data-2)', icon: 'map-risk-heat', sources: [{ label: 'ClimateData.ca SSP2-4.5', k: 1 }, { label: 'ClimateData.ca SSP5-8.5', k: 1.4 }],
    how: 'Projected heat days stress heat-sensitive equipment — substation transformers near their cooling rating and lines on the dry west slopes are hit hardest.' },
  oil: { label: 'Oil Containment', color: 'var(--data-viz-data-8)', icon: 'map-layers', sources: [{ label: 'Site inspection 2025', k: 1 }, { label: 'Environmental register', k: 0.8 }],
    how: 'Raises the consequence, not the likelihood: a failure where there is no secondary containment becomes a spill.' },
  habitat: { label: 'Critical Habitat', color: 'var(--data-viz-data-3)', icon: 'map-layers', sources: [{ label: 'BC Conservation Data Centre 2025', k: 1 }, { label: 'SARA critical habitat', k: 1.2 }],
    how: 'Raises the consequence: repairs inside endangered-species habitat need permits, restoration and carry fines.' },
  ev: { label: 'EV load growth', color: 'var(--data-viz-data-4)', icon: 'map-layers', custom: true, sources: [{ label: 'ICE-to-EV forecast v4', k: 1 }, { label: 'CER Energy Futures 2026', k: 0.6 }],
    how: 'Peak load grows about 2% a year as EVs are adopted; heavily loaded feeders and transformers overload on summer evenings.' },
};
const makeLens = id => ({ id, ...LENS_INFO[id], kind: LENS_DEFS[id].kind, on: true, src: 0 });
const INITIAL_LENSES = ['flood', 'heat', 'oil', 'habitat'].map(makeLens);
const activeOf = lenses => lenses.filter(l => l.on).map(l => ({ id: l.id, k: l.sources[l.src].k }));
const withEv = ls => [...ls.filter(l => l.id !== 'ev'), makeLens('ev')];

// Everything the screens show, for one set of lenses and one year
function study(lenses, year) {
  const act = activeOf(lenses);
  const now = cluster(year, act), base = cluster(year, []);
  const contrib = act.map(l => ({ id: l.id, delta: now.score - cluster(year, act.filter(o => o.id !== l.id)).score }));
  return { act, now, base, contrib, first: firstCrossing(act), baseFirst: firstCrossing([]) };
}
function overviewText(s, year) {
  if (!s.act.length) return `No lenses applied — condition only. In ${year} the cluster scores ${s.now.score}, with ${s.now.over} of ${ASSETS.length} assets over their intervention tolerance. The first crossing on condition alone is ${s.baseFirst ?? 'beyond ' + END}.`;
  const top = [...s.contrib].sort((x, y) => y.delta - x.delta)[0];
  const pct = Math.round((s.now.score - s.base.score) / Math.max(1, s.base.score) * 100);
  return `${s.act.length} lens${s.act.length > 1 ? 'es' : ''} applied. In ${year} they take the cluster from ${s.base.score} to ${s.now.score} (+${pct}%), and ${s.now.over} of ${ASSETS.length} assets are over their intervention tolerance (${s.base.over} on condition alone). The first crossing moves from ${s.baseFirst ?? 'beyond ' + END} to ${s.first ?? 'beyond ' + END}. Most of the movement comes from ${LENS_INFO[top.id].label}.`;
}
function lensSummary(lens, lenses, year) {
  const act = activeOf(lenses.map(l => l.id === lens.id ? { ...l, on: true } : l));
  const without = act.filter(l => l.id !== lens.id);
  const a = cluster(year, act), b = cluster(year, without);
  const moved = a.rows.map((r, i) => ({ r, from: b.rows[i].band })).filter(m => m.r.band.min > m.from.min);
  const newlyOver = a.rows.filter((r, i) => r.over && !b.rows[i].over);
  const list = moved.slice(0, 4).map(m => `${m.r.a.label} (${m.from.label.toLowerCase()} → ${m.r.band.label.toLowerCase()})`).join(', ');
  return `In ${year}, ${lens.label} adds ${a.score - b.score} points across the cluster. ${moved.length ? `It moves ${moved.length} asset${moved.length > 1 ? 's' : ''} up a band: ${list}${moved.length > 4 ? '…' : ''}.` : 'It doesn’t move any asset up a band yet.'} ${newlyOver.length ? `${newlyOver.map(r => r.a.label).join(', ')} cross${newlyOver.length === 1 ? 'es' : ''} the intervention tolerance because of it.` : ''}`;
}

