/* Build: idea overview (Shape).
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
/* ============================================================ Screen 5 — Build (idea, Shaping) — Figma 43:65022 "Idea overview / Investment owner review" */
// Alternatives are the idea investment's real Whistler alternatives (spend, value, dates); BCR is [Added] via bcrOf()
const ALTERNATIVES = IDEA_ALTS.map(a => ({ id: a.id, name: a.name, desc: ALT_DESC[a.name], bcr: bcrOf(a.valueTotal, a.spendTotal), value: a.valueTotal,
  cost: fmtMoney(a.spendTotal), time: spanYears(a), valueLabel: fmtValue(a.valueTotal), valueByMeasure: a.valueByMeasure, recommendedInData: a.isRecommended }));
// The portfolio to compare against: the other real Whistler investments with spend and value
const PORTFOLIO = WHISTLER_INVESTMENTS.filter(i => i.id !== IDEA_INV.id).map(i => ({ name: i.name, bcr: bcrOf(i.totalValue, i.totalSpend), value: i.totalValue }))
  .filter(p => p.bcr !== null);
const BINS = {
  bcr: [[0, 0.5, '< 0.5'], [0.5, 1, '0.5–1'], [1, 1.5, '1–1.5'], [1.5, 2, '1.5–2'], [2, 3, '2–3'], [3, 5, '3–5'], [5, 1e9, '5+']],
  value: [[0, 2e3, '< 2K'], [2e3, 5e3, '2K–5K'], [5e3, 15e3, '5K–15K'], [15e3, 30e3, '15K–30K'], [30e3, 60e3, '30K–60K'], [60e3, 150e3, '60K–150K'], [150e3, 1e12, '150K+']],
};
// Strategic relevance = share of the recommended alternative's value by measure category (cost measures excluded)
function relevance(alt) {
  const cats = ['Reliability', 'Financial', 'Environment', 'Social', 'Governance'], tot = Object.fromEntries(cats.map(c => [c, 0]));
  (alt.valueByMeasure || []).forEach(m => { const c = MEASURE_CATEGORY[m.measure]; if (c && m.value > 0) tot[c] += m.value; });
  const sum = Object.values(tot).reduce((a, b) => a + b, 0) || 1;
  return cats.map(c => [c, Math.round(tot[c] / sum * 100)]);
}

// Card with the Figma header: H4 title (DS 2.0.1, was uppercase) (+ optional extra) on the left, Cooper icon-button on the right
const Sec = ({ title, extra, children, style }) => (
  <ContentCard style={style} top={
    <div className="row" style={{ width: '100%', justifyContent: 'space-between', padding: 'var(--space-100) var(--space-150) 0' }}>
      <div className="row" style={{ gap: 'var(--space-400)' }}><span className="t-heading-h4-semibold">{title}</span>{extra}</div>
      <IconButton icon="cooper-system-icon" type="tertiary" shape="circle" size="s" label="Ask Cooper" onClick={() => toast({ title: `Cooper: ${title}` })} />
    </div>} bottom={<div style={{ width: '100%' }}>{children}</div>} />
);
const SubHead = ({ children }) => <span className="t-label-m-medium" style={{ display: 'block', padding: 'var(--space-100) 0 var(--space-200)' }}>{children}</span>;

function Build({ navBar, lenses, idea, onBack }) {
  const s = study(lenses, END);
  const ans = idea?.answers || [];
  const recAlt = altForIntent(ans[0]) || IDEA_ALTS.find(a => a.isRecommended);
  const rec = ALTERNATIVES.find(a => a.id === recAlt.id), others = ALTERNATIVES.filter(a => a.id !== rec.id);
  const overRows = s.now.rows.filter(r => r.over);
  const [metric, setMetric] = useState('bcr');
  const key = metric === 'bcr' ? 'bcr' : 'value', val = rec[key];
  const all = [...PORTFOLIO.map(p => ({ name: p.name, v: p[key] })), { name: IDEA_INV.name, v: val, me: true }];
  const rank = 1 + all.filter(p => !p.me && p.v > val).length, pct = Math.round((1 - (rank - 1) / all.length) * 100);
  const standing = pct >= 75 ? 'Top quartile' : pct >= 50 ? 'Second quartile' : pct >= 25 ? 'Third quartile' : 'Bottom quartile';
  const counts = BINS[key].map(([lo, hi]) => all.filter(p => p.v >= lo && p.v < hi).length), maxC = Math.max(...counts, 1);
  const myBin = BINS[key].findIndex(([lo, hi]) => val >= lo && val < hi);
  const sorted = [...all].sort((a, b) => b.v - a.v), me = sorted.findIndex(p => p.me);
  const similar = sorted.slice(Math.max(0, me - 3), Math.max(0, me - 3) + 5);
  const unit = metric === 'bcr' ? 'BCR' : 'value';
  const fmtV = v => metric === 'bcr' ? v.toFixed(2) : fmtValue(v);

  const header = <PageHeader title={IDEA_INV.name} id={IDEA_INV.code} onBack={onBack}
    status={<Indicator type="purple">Shaping</Indicator>}
    center={<Stepper current={0} steps={[{ label: 'Shape' }, { label: 'Review' }, { label: 'Refine' }, { label: 'Approve' }]} />}
    actions={<div className="row" style={{ gap: 'var(--space-200)' }}>
      <Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      <IconButton icon="system-comment" type="tertiary" size="s" label="Comments" onClick={() => toast({ title: 'Comments aren’t part of this flow' })} />
      <Button type="secondary" size="s" onClick={() => toast({ title: 'Dismiss isn’t part of this flow' })}>Dismiss</Button>
      <Button type="primary" size="s" onClick={() => toast({ title: 'Sent for review', description: 'Reviewers will be notified' })}>Send for review</Button>
    </div>} />;
  return (
    <AppShell navBar={navBar} header={header}
      bottom={<BottomSheet type="value" documents={{ label: '16 Documents', onClick: () => toast({ title: 'Cooper’s context: 16 documents' }) }} onUpload={() => toast({ title: 'Upload' })}
        prompts={['Find similar past ideas', 'What could block this idea?']} onPrompt={p => toast({ title: `Cooper: ${p}` })} />}>
      <div style={{ display: 'flex', minHeight: '100%' }}>
        <div className="col" style={{ flex: 1, minWidth: 0, padding: 'var(--space-300)', gap: 'var(--space-300)' }}>
          <Sec title="Idea Overview">
            <div className="col" style={{ gap: 'var(--space-150)', padding: '0 var(--space-150) var(--space-150)' }}>
              <span className="t-label-l-medium">{IDEA_INV.name}</span>
              <span className="t-body-m-regular sec">{IDEA_INV.description}</span>
            </div>
          </Sec>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-300)', alignItems: 'stretch' }}>
            <div className="col" style={{ gap: 'var(--space-300)' }}>
              <Sec title="The Need">
                <p className="t-body-m-regular" style={{ margin: 0, padding: 'var(--space-100) var(--space-150) var(--space-150)' }}>The 12 pad-mount transformers in Alpine Meadows have been in service since 1944–45 and are now at {ASSETS.find(a => a.type === 'padmount').outlook['Normalized Age'][0]}× their design life. With the study’s {s.act.length} lenses applied, {s.now.over} of {ASSETS.length} assets in the cluster cross their intervention tolerance by {END}, the next new crossing in {s.first ?? '—'}. Left alone, outages affect ~{CLUSTER.customers.toLocaleString()} Alpine Meadows customers.</p>
              </Sec>
              <Sec title="Aligned Enterprise Goals">
                <div className="row" style={{ gap: 'var(--space-150)', flexWrap: 'wrap', padding: '0 var(--space-150) var(--space-150)' }}>
                  {ENTERPRISE_GOALS.map(g => <Badge key={g} size="s" color="white">{g}</Badge>)}
                </div>
              </Sec>
              <Sec title="Strategic Relevance">
                <div className="col" style={{ gap: 'var(--space-400)', padding: '0 var(--space-150) var(--space-150)' }}>
                  <div className="row" style={{ gap: 'var(--space-50)' }}>
                    {relevance(rec).map(([l, v], i) => v > 0 && <BarChartItem key={l} fill={`var(--data-viz-data-${[4, 5, 3, 6, 6][i]})`} style={{ flex: v }}>{v}%</BarChartItem>)}
                  </div>
                  <div className="row" style={{ gap: 'var(--space-400)', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[['Reliability', 4], ['Financial', 5], ['Environment', 3], ['Social', 6], ['Governance', 6]].map(([l, c]) => <InfoHintItem key={l} label={l} color={`var(--data-viz-data-${c})`} />)}
                  </div>
                </div>
              </Sec>
            </div>
            <Sec title="Affected Assets & area" style={{ height: '100%' }}>
              <NDS label="3D map (MapLibre)" style={{ height: 'var(--proto-map-h)', borderRadius: 'var(--radius-radius-200)', overflow: 'hidden' }}>
                <MapView labels={false} lenses={lenses} year={END} interactive={false} focus={overRows.map(r => r.a.id)} />
                <div style={{ position: 'absolute', right: 'var(--space-200)', top: 'var(--space-200)', zIndex: 'var(--proto-z-raised)' }}><IconButton icon="map" type="tertiary" size="s" label="Open in Explore" onClick={onBack} /></div>
              </NDS>
            </Sec>
          </div>

          <Sec title="Recommended Alternative">
            <div className="col" style={{ gap: 'var(--space-300)' }}>
              <ContentCard title={rec.name} description={rec.desc}
                bottom={<div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-250)' }}>
                  <StatCard size="s" title="BCR" value={String(rec.bcr)} /><StatCard size="s" title="Cost range" value={rec.cost} />
                  <StatCard size="s" title="Timing" value={rec.time} /><StatCard size="s" title="Potential value" value={rec.valueLabel} description="value score" />
                </div>} />
              <div>
                <SubHead>Other options</SubHead>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-300)' }}>
                  {others.map(o => <ContentCard key={o.name} title={o.name} onClick={() => toast({ title: o.name, description: `BCR ${o.bcr} · ${o.cost} · ${o.time} · value ${o.valueLabel}` })}
                    bottom={<div className="row" style={{ gap: 'var(--space-150)', alignItems: 'baseline' }}><span className="t-heading-h1-medium">{o.cost}</span><span className="t-body-s-regular sec">{o.time}</span></div>} />)}
                </div>
              </div>
            </div>
          </Sec>

          <Sec title="Compare to Other Investments" extra={<Select size="s" options={['Portfolio level', 'Region level', 'Asset class']} defaultValue="Portfolio level" clearable={false} onChange={v => toast({ title: `${v}`, description: 'Comparison scope is illustrative' })} />}>
            <div className="col" style={{ gap: 'var(--space-400)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {[['Rate', <><span className="t-heading-h2-medium">#{rank}</span> <span className="t-body-s-regular sec">of {all.length} investments</span></>], ['Percentile', `${pct}th`], ['Standing', standing], ['Alternative', rec.name]].map(([l, v], i) => (
                  <div key={l} className="col" style={{ gap: 'var(--space-100)', padding: 'var(--space-100) var(--space-500)', borderLeft: i ? 'var(--border-widths-border-100) solid var(--border-base)' : 'none' }}>
                    <span className="t-body-s-regular sec">{l}</span><span className="t-heading-h2-medium">{v}</span>
                  </div>))}
              </div>
              <DataVizCard title="Investment position" header={{ segments: [{ value: 'bcr', label: 'Value vs Cost' }, { value: 'eff', label: 'Efficiency' }], segmentValue: metric, onSegmentChange: setMetric }} onCooper={() => toast({ title: 'Cooper: Investment position' })}>
                <NDS label="Histogram (VerticalBarChartItem + axes)" className="col" style={{ gap: 'var(--space-200)', padding: 'var(--space-200) var(--space-300)' }}>
                  <div className="row" style={{ alignItems: 'flex-end', gap: 'var(--space-150)', height: 'var(--proto-bars-h)' }}>
                    {counts.map((c, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <VerticalBarChartItem width="100%" height={180} max={maxC} value={Math.max(c, 0.15)} segments={[{ value: 1, fill: i === myBin ? 'var(--data-viz-muted-purple-data-5)' : 'var(--background-elevation-1-tertiary)' }]} style={{ width: '100%' }} />
                      </div>))}
                  </div>
                  <div className="row" style={{ gap: 'var(--space-150)' }}>{BINS[key].map(b => <span key={b[2]} className="t-body-s-regular sec" style={{ flex: 1, textAlign: 'center' }}>{b[2]}</span>)}</div>
                  <span className="t-body-s-regular sec" style={{ textAlign: 'center' }}>{metric === 'bcr' ? 'Value / Benefit (BCR)' : 'Value score'}</span>
                </NDS>
              </DataVizCard>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-600)' }}>
                <div>
                  <SubHead>Why this investment matters</SubHead>
                  <p className="t-body-m-regular" style={{ margin: 0 }}>This program replaces the oldest distribution equipment in Alpine Meadows, protecting ~{CLUSTER.customers.toLocaleString()} customers from outages. Acting before the next tolerance crossing in {s.first ?? '—'} reduces the cluster’s value at stake (${s.now.valueM}M by {END}) and lowers safety and environmental risk. At a BCR of {rec.bcr} it ranks #{rank} of {all.length} Whistler investments, in the {standing.toLowerCase()}.</p>
                </div>
                <div style={{ borderLeft: 'var(--border-widths-border-100) solid var(--border-base)', paddingLeft: 'var(--space-300)' }}>
                  <SubHead>Similar investments by {metric === 'bcr' ? 'BCR' : 'value'}</SubHead>
                  <NDS label="List rows" className="col" style={{ gap: 'var(--space-100)' }}>
                    {similar.map(p => (
                      <div key={p.name} className="row box" style={{ justifyContent: 'space-between', padding: 'var(--space-400) var(--space-300)', background: p.me ? 'var(--background-elevation-1-tertiary)' : undefined }}>
                        <span className="t-body-m-regular">{p.name}</span><span className="t-body-m-regular">{fmtV(p.v)} {unit}</span>
                      </div>))}
                  </NDS>
                </div>
              </div>
            </div>
          </Sec>
        </div>
        <div style={{ flex: 'none', position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100%' }}>
          <Panel title="Cooper" expanded={false} onExpandedChange={() => toast({ title: 'Cooper side panel isn’t part of this flow' })} dot="error" style={{ height: '100%' }} />
        </div>
      </div>
    </AppShell>
  );
}
