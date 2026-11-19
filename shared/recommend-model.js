/* J05 · Cooper recommendations in Explore (Predictive Analytics: Results Review). Figma Explore 29:351117 / 29:352263 / 29:354522 / 29:358931.
   One recommendation per REAL cluster investment that has at-risk assets, with its REAL alternatives as the interventions.
   Every number comes from the risk model and the real records; the rules are [Assumed] and documented in context/logic/recommendations.md. */

const REC_ACT = () => activeOf(INITIAL_LENSES);
const pctTxt = v => `${Math.round(v * 100)}%`;
// [Assumed] an intervention brings its assets back to as-new condition (likelihood 5%); a weaker alternative does it in
// proportion to its value against the best alternative of the same investment.
function riskAfter(assets, strength = 1) {
  const act = REC_ACT();
  return assets.reduce((t, a) => { const r = assess(a, NOW, act); const asNew = 0.05 * r.cof * 10; return t + (r.risk - (r.risk - asNew) * strength); }, 0);
}
const riskNow = assets => assets.reduce((t, a) => t + assess(a, NOW, REC_ACT()).risk, 0);
const yearsOf = alt => { const a = alt.firstSpendDate.slice(0, 4), b = alt.lastSpendDate.slice(0, 4); return a === b ? a : `${a}–${b}`; };
// [Added] recent outages by asset kind (the demo data has no outage history)
const OUTAGES = { bank: ['Transformer overheating trip', 'Bushing flashover', 'Planned switching failed'], padmount: ['Pad-mount fuse operation', 'Secondary cable fault', 'Planned switching failed'],
  line: ['Vegetation contact', 'Conductor clash in high wind', 'Pole failure'], breaker: ['Breaker failed to close', 'Substation fault', 'Planned switching failed'] };
const KIND_NOUN = { bank: ['transformer bank', 'transformer banks'], padmount: ['pad-mount', 'pad-mounts'], line: ['line span', 'line spans'], breaker: ['breaker', 'breakers'] };
const KIND_AREA = { bank: 'Alpine Meadows Station', padmount: 'Alpine Meadows', line: 'Pine Ridge corridor', breaker: 'Nesters' };

const RECOMMENDATIONS = [...new Set(ASSETS.map(a => a.investmentId))].map(invId => {
  const inv = invById(invId), assets = ASSETS.filter(a => a.investmentId === invId), act = REC_ACT();
  const rows = assets.map(a => ({ a, r: assess(a, NOW, act), cross: crossYear(a, act) }));
  const overNowN = rows.filter(x => x.r.risk >= TOLERANCE[x.a.type]).length, overEndN = rows.filter(x => x.cross).length;
  if (!overEndN) return null;
  const alts = WHISTLER_ALTERNATIVES.filter(x => x.investmentId === invId);
  const best = Math.max(...alts.map(x => x.valueTotal));
  const interventions = alts.map(x => ({ id: x.id, name: x.name, recommended: x.isRecommended, cost: x.spendTotal, value: x.valueTotal, timeline: yearsOf(x),
    reduced: 1 - riskAfter(assets, x.valueTotal / best) / Math.max(1, riskNow(assets)) })).sort((p, q) => (q.recommended - p.recommended) || q.value - p.value);
  const rec = interventions[0];
  const pof = rows.reduce((t, x) => t + x.r.pof, 0) / rows.length;
  const worst = [...rows].sort((p, q) => q.r.risk - p.r.risk)[0];
  const customers = assets[0].type === 'line' ? CLUSTER.customers : assets.reduce((t, a) => t + a.customers, 0);   // the corridor feeds the station once
  const firstCross = rows.map(x => x.cross).filter(Boolean).sort()[0];
  const kind = assets[0].type, area = KIND_AREA[kind];
  const failM = assets.reduce((t, a) => t + a.costM, 0);
  // Risk drivers: the factor adding most risk to the worst asset (condition or a lens)
  const ds = drivers(worst.a, NOW, act).sort((p, q) => q.delta - p.delta);
  const top = ds[0] && ds[0].delta > worst.r.baseRisk * 0.15 ? LENS_INFO[ds[0].id].label : 'Condition (Whistler outlook)';
  return {
    id: `rec-${invId}`, invId, inv, assets: assets.map(a => a.id), area, kind,
    title: overNowN ? (assets.length === 1 ? `${assets[0].label} over tolerance — ${area}` : `${overNowN} of ${assets.length} ${KIND_NOUN[kind][1]} over tolerance — ${area}`)
      : `${overEndN} ${KIND_NOUN[kind][overEndN > 1 ? 1 : 0]} cross tolerance by ${firstCross} — ${area}`,
    description: overNowN ? `Condition is already past the intervention tolerance. Worth grouping into one plan now: ${inv.name}.` : `Risk rises past tolerance within the horizon. ${inv.name} is ready to shape.`,
    includes: rows.map(x => ({ label: x.a.label, root: x === worst })),
    impact: [{ label: 'Replacement cost', value: fmtMoney(rec.cost) }, { label: 'Risk reduced', value: `${pctTxt(rec.reduced)} if actioned` }, { label: 'Failure likelihood', value: pctTxt(pof) }],
    ifNoAction: [
      overNowN ? `${worst.a.label} is already past tolerance` : `${overEndN} asset${overEndN > 1 ? 's' : ''} cross tolerance by ${firstCross}`,
      `${area} outage ~${customers.toLocaleString()} customers`,
      `Emergency replacement ~${fmtMoney(failM * 1e6 * 1.64)} (+64% vs plan)`,                          // [Assumed] reactive premium, Figma copy
    ],
    over: overNowN, overEnd: overEndN, pof, customers, firstCross,
    signal: {
      title: `${area} — ${inv.name}`,
      text: `${assets.length} ${KIND_NOUN[kind][assets.length > 1 ? 1 : 0]} serving ~${customers.toLocaleString()} customers — risk rising, flagged before failure, with an investment ready to shape.`,
      driver: { title: `${worst.a.label}`, text: `The worst asset in the group. ${top} adds the most risk; condition alone puts its likelihood of failure at ${pctTxt(worst.r.basePof)}.`,
        rows: [{ label: 'Expected failure', value: { bank: 'Transformer failure', padmount: 'Pad-mount failure', line: 'Span failure', breaker: 'Breaker failure' }[kind] },
          { label: 'Main driver', value: top.replace(' (Whistler outlook)', '') }, { label: 'Risk', value: `${Math.round(worst.r.risk)} vs ${TOLERANCE[kind]}` },
          { label: 'Failure likelihood', value: `${worst.r.pof >= 0.5 ? 'High' : worst.r.pof >= 0.25 ? 'Medium' : 'Low'} · ${worst.r.risk >= TOLERANCE[kind] ? 'over now' : `by ${worst.cross}`}` }] },
      chart: YEARS.map(y => ({ label: String(y), pof: Math.round(assess(worst.a, y, act).pof * 100), base: Math.round(assess(worst.a, y, []).pof * 100) })),
      areaText: `${area} takes the worst of a failure: ~${customers.toLocaleString()} customers are served by these assets.`,
      areaRows: [{ label: 'Customers', value: customers.toLocaleString() }, { label: 'Assets', value: String(assets.length) }, { label: 'Redundancy', value: kind === 'line' ? 'Single corridor' : 'Not available' }],
      outages: OUTAGES[kind],
    },
    interventions,
    evidence: [
      { title: 'Why it’s flagged', items: [
        { type: 'file', title: 'Asset condition outlook (Whistler)', content: 'quote', children: `${overEndN} of ${assets.length} assets reach their intervention tolerance by ${END}; ${worst.a.label} first.`, badge: 'Aging asset risk increasing' },
        { type: 'file', title: 'Risk model with lenses', content: 'quote', children: `${top} is the biggest single driver of the group’s risk.`, badge: 'External influence' }] },
      { title: 'Decisions', items: [{ type: 'file', title: inv.name, content: 'text', children: `Recommended alternative: ${rec.name}, ${fmtMoney(rec.cost)} over ${rec.timeline}.`, badge: 'Reduced reliability exposure' }] },
    ],
  };
}).filter(Boolean);
// Groups, as in Figma: highest risk (over tolerance now), highest value (most value per dollar), immediate review (crosses soon), largest impact (most customers)
function recGroups(open) {
  const left = RECOMMENDATIONS.filter(r => open.includes(r.id)), used = new Set();
  const take = (title, pick) => { const items = pick(left.filter(r => !used.has(r.id))); items.forEach(r => used.add(r.id)); return items.length ? { title, items } : null; };
  return [
    take('Highest-risk items', l => l.filter(r => r.over > 0)),
    take('Highest-value opportunities', l => [...l].sort((a, b) => b.interventions[0].value / b.interventions[0].cost - a.interventions[0].value / a.interventions[0].cost).slice(0, 1)),
    take('Largest potential impact', l => [...l].sort((a, b) => b.customers - a.customers).slice(0, 1)),
    take('Immediate review required', l => l),
  ].filter(Boolean);
}
