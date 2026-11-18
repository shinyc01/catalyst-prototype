/* Explore arrival + asset details + cluster details.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
/* ============================================================ Asset details (shared by Explore + Study) */
function AssetDetails({ id, lenses, year, onClose, onAsk }) {
  const a = assetById(id);
  const act = activeOf(lenses);
  const r = assess(a, year, act), tol = TOLERANCE[a.type], band = bandOf(r.risk);
  const cross = crossYear(a, act), baseCross = crossYear(a, []);
  const ds = drivers(a, year, act).filter(d => Math.abs(d.delta) >= 0.5).sort((x, y) => y.delta - x.delta);
  const data = YEARS.map(y => ({ label: String(y), risk: Math.round(assess(a, y, act).risk), base: Math.round(assess(a, y, []).risk), tol }));
  const pct = v => `${Math.round(v * 100)}%`;
  return (
    <Panel title={a.label} showEvidence={false} onClose={onClose} style={{ height: '100%' }}
      actions={<Badge size="s" color={band.badge}>{band.label}</Badge>}>
      <div className="col scroll" style={{ gap: 12, height: '100%' }}>
        <span className="t-body-m-regular sec">{TYPE_LABEL[a.type]} · {a.code} · in service since {a.install} · {a.customers.toLocaleString()} customers{a.note ? ` · ${a.note}` : ''}</span>
        <span className="t-body-s-regular muted">{a.name} · {invById(a.investmentId)?.name}</span>
        {r.risk >= tol
          ? <Indicator type="red">Over intervention tolerance in {year} ({Math.round(r.risk)} ≥ {tol})</Indicator>
          : <Indicator type={cross ? 'orange' : 'green'}>{cross ? `Crosses tolerance in ${cross}` : `Stays under tolerance to ${END}`}</Indicator>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <StatCard size="s" title={`Risk ${year}`} value={String(Math.round(r.risk))} description={`tolerance ${tol}`} />
          <StatCard size="s" title="Crosses tolerance" value={cross ? String(cross) : 'No'} description={`condition only: ${baseCross ?? 'no'}`} />
          <StatCard size="s" title="Likelihood of failure" value={pct(r.pof)} description={`condition only: ${pct(r.basePof)}`} />
          <StatCard size="s" title="Consequence" value={`${r.cof.toFixed(1)}/10`} description={`condition only: ${a.cof}/10`} />
        </div>
        <span className="t-label-m-upper muted">What’s driving the risk in {year}</span>
        <div className="col" style={{ gap: 8 }}>
          <InfoHintItem label="Base condition (Whistler outlook)" color="var(--border-grey)" value={String(Math.round(r.baseRisk))} />
          {ds.map(d => <InfoHintItem key={d.id} label={`${LENS_INFO[d.id].label} · ${LENS_DEFS[d.id].kind}`} color={LENS_INFO[d.id].color} value={`+${Math.round(d.delta)}`} />)}
          {!ds.length && <span className="t-body-m-regular muted">No active lens affects this asset.</span>}
        </div>
        <span className="t-label-m-upper muted">Risk over the next 10 years</span>
        <div style={{ height: 210, flex: 'none', overflow: 'hidden' }}>
          <LineChart data={data} series={[{ key: 'risk', label: 'With lenses' }, { key: 'base', label: 'Condition only', dashed: true }]} referenceKey="tol" referenceLabel="Tolerance" zeroBased />
        </div>
        <div className="row" style={{ gap: 8 }}>
          <Button type="cooper" size="s" iconLeft="cooper-system-icon" onClick={onAsk}>Ask Cooper about this asset</Button>
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================ Screen 2 — Explore arrival */
function Explore({ navBar, lenses, year, asset, setAsset, details, setDetails, onStudy, onBack }) {
  const [barOpen, setBarOpen] = useState(true);
  const api = useRef(null);
  const s = study(lenses, END);
  const header = <ExploreHeader search={{ placeholder: 'Search for…' }}>
    <Button type="ghost" size="s" iconLeft="arrow-left" onClick={onBack}>{CLUSTER.name}</Button>
  </ExploreHeader>;
  const right = !!(details || asset);
  return (
    <AppShell navBar={navBar} header={header}>
      <div style={{ position: 'relative', height: '100%', minHeight: 700, overflow: 'hidden' }}>
        <NDS label="3D map (MapLibre + OpenFreeMap)" className="fill">
          <MapView lenses={lenses} year={END} selected={asset} onSelect={id => { setAsset(id); if (id) setDetails(false); }} apiRef={api}
            pad={{ tl: [80, 120], br: [right ? 420 : 220, 60] }} />
        </NDS>
        <MapTools api={api} />
        <FloatingBar style={{ top: 100, zIndex: 500 }} open={barOpen} category="Cooper found" categoryIcon="cooper-system-icon" item={`${CLUSTER.name} · ${ASSETS.length} assets`}
          badge={<Badge color="red" size="s">{s.now.over} over tolerance by {END}</Badge>}
          secondaryAction={{ label: 'View details', onClick: () => setDetails(true) }} primaryAction={{ label: 'Study area', onClick: onStudy }}
          onClose={() => { setBarOpen(false); toast({ title: 'Selection cleared', primaryAction: { label: 'Undo', onClick: () => setBarOpen(true) } }); }} />
        {details && (
          <div style={{ position: 'absolute', right: 12, top: 64, bottom: 12, zIndex: 600, display: 'flex' }}>
            <AgentWindow style={{ maxHeight: '100%' }} text={`${CLUSTER.name} — ${CLUSTER.station}, its 12 pad-mount transformers, the Pine Ridge lines and Nesters substation, serving ~${CLUSTER.customers.toLocaleString()} customers. With today’s lenses, ${s.now.over} of ${ASSETS.length} assets are over their intervention tolerance by ${END}. Start with the pad-mount program, which is ready to shape.`}
              onAsk={() => toast({ title: 'Cooper chat isn’t part of this step' })} onClose={() => setDetails(false)}
              tertiaryAction={{ label: 'Close', onClick: () => setDetails(false) }} secondaryAction={{ label: 'Study area', onClick: onStudy }}>
              <ClusterDetails s={s} onAsset={id => { setDetails(false); setAsset(id); api.current?.flyTo(id); }} />
            </AgentWindow>
          </div>
        )}
        {asset && !details && (
          <div style={{ position: 'absolute', right: 12, top: 64, bottom: 12, width: 380, zIndex: 600, display: 'flex' }}>
            <AssetDetails id={asset} lenses={lenses} year={END} onClose={() => setAsset(null)} onAsk={() => toast({ title: 'Cooper chat isn’t part of this step' })} />
          </div>
        )}
        {!right && <>
          <MapLegend grid={false} style={{ position: 'absolute', right: 12, bottom: 64, zIndex: 500 }} />
          <div style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 500 }}><FtaButton onClick={() => toast({ title: 'Cooper' })} /></div>
        </>}
      </div>
    </AppShell>
  );
}
const AssetList_unused = ({ rows, onAsset, limit = 6 }) => (
  <NDS label="Clickable asset list" className="col" style={{ gap: 2 }}>
    {rows.slice(0, limit).map(r => (
      <div key={r.a.id} className="click row" style={{ padding: '4px 6px', justifyContent: 'space-between' }} onClick={() => onAsset(r.a.id)}>
        <InfoHintItem label={r.a.name} color={r.band.color} />
        <span className="t-body-m-regular sec">{Math.round(r.risk)} / {r.tol}</span>
      </div>
    ))}
  </NDS>
);
function ClusterDetails({ s }) {
  const alt = IDEA_ALTS.find(a => a.isRecommended) || IDEA_ALTS[0];
  const overNowRows = s.now.rows.filter(r => overNow.includes(r.a.id));
  return (
    <div className="col" style={{ gap: 12 }}>
      <span className="t-label-m-upper muted">Recommended intervention</span>
      <ContentCard size="s" title={`${IDEA_INV.name} · ${alt.name}`} description={ALT_DESC[alt.name]} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <StatCard size="s" title="Cost" value={fmtMoney(alt.spendTotal)} />
        <StatCard size="s" title="Value" value={fmtValue(alt.valueTotal)} description="value score" />
        <StatCard size="s" title="Timeline" value={spanYears(alt)} />
        <StatCard size="s" title="At-risk assets" value={`${s.now.over}/${ASSETS.length}`} description={`by ${END}`} />
      </div>
      <span className="t-label-m-upper muted">If no action is taken</span>
      <div className="col t-body-m-regular sec" style={{ gap: 4 }}>
        <span>{overNowRows.map(r => r.a.label).join(' and ')} are already past tolerance</span>
        <span>Outage risk for ~{CLUSTER.customers.toLocaleString()} Alpine Meadows customers keeps rising</span>
        <span>Pine Ridge corridor wildfire exposure grows every year</span>
      </div>
    </div>
  );
}
