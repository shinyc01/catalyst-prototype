/* Whistler ADDITIONS — everything the prototypes need that the Whistler demo data doesn't have.
   [Added] = invented for the prototypes, in the Whistler style. Documented in context/data/whistler.md.
   Load order: whistler-data.js (real) → whistler-additions.js (this) → catalyst-model.js.
   Coordinates are [lat, lng] in the real Whistler, BC valley (Alpine Meadows, Nesters, Pine Ridge on the west slopes). */

/* ---------- people ---------- */
// One consistent user per Catalyst persona. Names are invented demo users (see shared/names.js); roles, titles and initials are [Added].
const PERSONAS = {
  owner:     { key: 'owner',     role: 'Investment Owner', id: 'hgrant',     name: 'Hollis Grant',   first: 'Hollis',  initials: 'HG', title: 'Investment Owner, Electrical Distribution', why: 'owns 17 Whistler investments, incl. the Pad-Mount program' },
  asset:     { key: 'asset',     role: 'Asset Manager',    id: 'mdelgado',   name: 'Mara Delgado', first: 'Mara', initials: 'MD', title: 'Asset Manager, Alpine Meadows & Nesters',  why: 'manager on 27 Whistler investments, incl. Alpine Meadows Station, Pine Ridge and Nester' },
  portfolio: { key: 'portfolio', role: 'Portfolio Owner',  id: 'ofitch', name: 'Owen Fitch',  first: 'Owen',    initials: 'OF', title: 'Portfolio Owner, Electrical',              why: 'Whistler administrator; owns the Electrical portfolio [Added role]' },
};
// The Explore → Build flow is the Investment Owner's journey
const PERSONA = PERSONAS.owner;

/* ---------- the cluster ---------- */
const CLUSTER = {
  id: 'alpine-meadows', name: 'Alpine Meadows cluster', short: 'Alpine Meadows',
  station: 'Alpine Meadows Substation', customers: 6200,                         // [Added] customers served by the station
  investments: [8380, 2891, 104860, 2892, 2893],                                 // real investments that touch these assets
  ideaInvestmentId: 8380,                                                        // the idea Cooper drafts in Build (real, stage Initial)
};
const SS = [50.1372, -122.9712];                                                 // [Added] Alpine Meadows Substation location
const NESTERS = [50.1262, -122.9548];                                            // [Added] Nesters substation location
const PINE_RIDGE = [[50.1050, -122.9990], [50.1120, -122.9945], [50.1190, -122.9895], [50.1255, -122.9840], [50.1315, -122.9775], SS];
const PADMOUNT_GRID = [50.1395, 50.1415, 50.1435].flatMap(lat => [-122.9745, -122.9715, -122.9685, -122.9655].map(lng => [lat, lng]));

// Per-kind additions: label, tolerance (intervention threshold), failure cost, customers, sensitivity to each lens
const KINDS = {
  bank:     { label: 'Substation transformer (230 kV)', tolerance: 45, costM: 2.5,  sens: { flood: 0.7, heat: 0.9, oil: 0.9, ev: 0.6 } },
  padmount: { label: 'Pad-mount transformer',           tolerance: 35, costM: 0.06, sens: { flood: 0.9, heat: 0.7, oil: 0.4, ev: 0.9 } },
  line:     { label: 'Overhead transmission line',      tolerance: 40, costM: 0.6,  sens: { flood: 0.3, heat: 0.8, oil: 0,   ev: 0.3 } },
  breaker:  { label: 'Circuit breaker (132 kV)',        tolerance: 40, costM: 0.35, sens: { flood: 0.6, heat: 0.3, oil: 0.2, ev: 0.3 } },
};
const TOLERANCE = Object.fromEntries(Object.entries(KINDS).map(([k, v]) => [k, v.tolerance]));
const TYPE_LABEL = Object.fromEntries(Object.entries(KINDS).map(([k, v]) => [k, v.label]));

// Real assets + added geometry, short labels, customers and notes
const ASSETS = WHISTLER_ASSETS.map((w, i) => {
  const a = { ...w, id: String(w.whistlerId), type: w.kind, costM: KINDS[w.kind].costM };
  if (w.kind === 'bank') {
    const k = ['3190', '3192', '3194', '253180'].indexOf(a.id);
    a.at = [[50.1375, -122.9716], [50.1371, -122.9707], [50.1368, -122.9714], [50.1376, -122.9706]][k];
    a.label = a.id === '253180' ? 'Vantage Bank 11' : `Alpine Meadows Bank ${11 + k}`;
    a.customers = 1550;
    a.note = a.id === '3192' ? 'Condition already 1 of 4 in 2026' : null;
  } else if (w.kind === 'padmount') {
    const k = WHISTLER_ASSETS.filter(x => x.kind === 'padmount').indexOf(w);
    a.at = PADMOUNT_GRID[k];
    a.label = `Pad-mount ${w.code.replace('WD-LV-', '')}`;
    a.customers = Math.round(30 + 12 * w.outlook['Reliability Risk'][0]);       // [Added] homes served, scaled from real reliability risk
    a.note = `In service since ${w.inServiceDate.slice(0, 4)}`;
  } else if (w.kind === 'line') {
    const k = WHISTLER_ASSETS.filter(x => x.kind === 'line').indexOf(w);
    a.line = [PINE_RIDGE[k], PINE_RIDGE[k + 1]];
    a.label = `Pine Ridge ${w.code}`;
    a.customers = CLUSTER.customers;                                            // the corridor feeds the whole station
    a.note = 'Pine Ridge corridor — identified wildfire risk';
  } else {
    const k = WHISTLER_ASSETS.filter(x => x.kind === 'breaker').indexOf(w);
    a.at = [[50.1264, -122.9551], [50.1260, -122.9545]][k];
    a.label = `Nesters CB ${w.code.replace(/\D*(\d+-\d+)$/, '$1')}`;
    a.customers = 1100;
    a.note = 'Nesters substation — near manufacturer end of life';
  }
  a.install = +w.inServiceDate.slice(0, 4);
  return a;
});

/* ---------- geography: zones the lenses use ---------- */
const ZONES = {
  // River of Golden Dreams floodplain (Alta Lake → Green Lake) and Fitzsimmons Creek by Nesters
  flood: [[[50.1250, -122.9835], [50.1330, -122.9745], [50.1400, -122.9665], [50.1455, -122.9580], [50.1430, -122.9545], [50.1375, -122.9630], [50.1300, -122.9710], [50.1220, -122.9785]],
          [[50.1290, -122.9580], [50.1300, -122.9530], [50.1230, -122.9500], [50.1215, -122.9545]]],
  // Green Lake wetlands, and old-growth slopes on the Pine Ridge corridor
  habitat: [[[50.1440, -122.9560], [50.1490, -122.9480], [50.1460, -122.9420], [50.1400, -122.9500]],
            [[50.1040, -123.0040], [50.1150, -122.9990], [50.1160, -122.9900], [50.1050, -122.9930]]],
  // oil-filled equipment sites (substations)
  oil: [SS, NESTERS],
  // where load grows: Alpine Meadows homes
  load: PADMOUNT_GRID,
  // people & critical loads raise consequence
  people: [[50.1163, -122.9574, 500], [50.1415, -122.9700, 350]],                // Whistler Village, Alpine Meadows (radius m)
};
const AREA = { s: 50.098, n: 50.158, w: -123.012, e: -122.928 };                // risk-grid bounds

/* ---------- map context (not assets) ---------- */
const DIST_LINES = [                                                             // [Added] distribution feeders to the pad-mounts
  [SS, [50.1395, -122.9700], [50.1415, -122.9700], [50.1435, -122.9700]],
  ...[50.1395, 50.1415, 50.1435].map(lat => [[lat, -122.9750], [lat, -122.9650]]),
  [NESTERS, [50.1310, -122.9620], SS],
];
const PLACE_LABELS = [
  { at: [50.1452, -122.9700], text: 'Alpine Meadows', cls: 'place' },
  { at: [50.1240, -122.9520], text: 'Nesters', cls: 'place' },
  { at: [50.1163, -122.9574], text: 'Whistler Village', cls: 'place' },
  { at: [50.1130, -122.9960], text: 'Pine Ridge corridor', cls: 'small' },
];

/* ---------- investments: Catalyst fields the demo data lacks ---------- */
// Catalyst stage for each Whistler stage (badge on Command)
const STAGE_TO_CATALYST = { 'Initial': 'Explore', 'Long Term Planning': 'Plan', 'Short Term Planning': 'Build', 'Executing': 'Results' };
// BCR isn't in the demo data. [Added] rule: BCR = value per $M of spend ÷ 2,000 (value is a framework score, not money).
const bcrOf = (value, spend) => spend > 0 && value > 0 ? +(value / (spend / 1e6) / 2000).toFixed(2) : null;
// Value-measure → Strategic relevance category (Figma legend)
const MEASURE_CATEGORY = { 'Reliability Risk': 'Reliability', 'Electrical Delivery Capacity Risk': 'Reliability', 'Financial Risk': 'Financial',
  'Environmental Risk': 'Environment', 'Safety Risk': 'Social', 'Compliance Risk': 'Governance' };
const ENTERPRISE_GOALS = ['Financial stewardship & efficiency', 'Reduce wildfire & emergency risk', 'Maintain public & worker safety', 'Decarbonize grid by 2045', 'Community & equity outcomes']; // [Added] (Figma copy)
