/* Explore arrival + asset details + cluster details.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
/* ============================================================ Asset details (shared by Explore + Study) — Figma Explore 9:64904 (single) / 9:65804 (group) */
const { TraceReport: DSTraceReport, useIssueReport: useIssues, SideNavTree: DSSideNavTree } = IFS;
const pctOf = v => `${Math.round(v * 100)}%`;
const likelihoodBadge = p => p >= 0.5 ? { color: 'red', label: 'High' } : p >= 0.25 ? { color: 'orange', label: 'Medium' } : { color: 'green', label: 'Low' };
const DSec = ({ title, children }) => <div className="col" style={{ gap: 8 }}><span className="t-label-m-upper muted">{title}</span>{children}</div>;
const Field = ({ label, value }) => <div className="row" style={{ justifyContent: 'space-between', gap: 12 }}><span className="t-body-m-regular sec">{label}</span><span className="t-body-m-medium" style={{ textAlign: 'right' }}>{value}</span></div>;
function AssetDetails({ id, lenses, year, onClose, onAsk, warnings = [], group, onAsset }) {
  const a = assetById(id);
  const [tab, setTab] = useState('details');
  const act = activeOf(lenses);
  const r = assess(a, year, act), tol = TOLERANCE[a.type], band = bandOf(r.risk);
  const cross = crossYear(a, act), baseCross = crossYear(a, []);
  const ds = drivers(a, year, act).filter(d => Math.abs(d.delta) >= 0.5).sort((x, y) => y.delta - x.delta);
  const data = YEARS.map(y => ({ label: String(y), risk: Math.round(assess(a, y, act).risk), base: Math.round(assess(a, y, []).risk), tol }));
  const lk = likelihoodBadge(r.pof), inv = invById(a.investmentId);
  return (
    <Panel title={a.label} showEvidence={false} onClose={onClose} style={{ height: '100%' }}
      actions={<Badge size="s" color={band.badge}>{band.label}</Badge>}>
      <div className="col scroll" style={{ gap: 12, height: '100%' }}>
        <span className="t-body-s-regular muted">{a.code} · {TYPE_LABEL[a.type]}</span>
        <IFS.Tabs size="m" value={tab} onChange={setTab} aria-label="Asset details" items={[{ value: 'details', label: 'Details' }, { value: 'docs', label: 'Documentation' }, { value: 'history', label: 'History' }]} />
        {tab !== 'details' ? <EmptyState cause="empty-container" size="section" heading={tab === 'docs' ? 'Documentation' : 'History'} body="Not part of this flow." /> : <>
          {group && <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
            <Button type="ghost" size="s" iconLeft="arrow-left" onClick={() => onAsset(null)}>{group.label}</Button>
            <span className="t-body-s-regular muted">{group.assets.indexOf(id) + 1} of {group.assets.length}</span>
          </div>}
          {warnings.map(w => <Indicator key={w} type="orange">{w}</Indicator>)}
          <DSec title="Risk & condition">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <StatCard size="s" title={`Risk score ${year}`} value={String(Math.round(r.risk))} description={`tolerance ${tol}`} badge={{ color: band.badge, children: band.label }} />
              <StatCard size="s" title="Condition" value={pctOf(1 - r.basePof)} description="from the Whistler outlook" />
              <StatCard size="s" title="Age" value={`${NOW - a.install} y.o`} description={`in service ${a.install}`} />
              <StatCard size="s" title="Failure likelihood" value={pctOf(r.pof)} description={`condition only: ${pctOf(r.basePof)}`} badge={{ color: lk.color, children: lk.label }} />
            </div>
            {r.risk >= tol
              ? <Indicator type="red">Over intervention tolerance in {year} ({Math.round(r.risk)} ≥ {tol})</Indicator>
              : <Indicator type={cross ? 'orange' : 'green'}>{cross ? `Crosses tolerance in ${cross} (condition only: ${baseCross ?? 'no'})` : `Stays under tolerance to ${END}`}</Indicator>}
          </DSec>
          <DSec title={`What’s driving the risk in ${year}`}>
            <InfoHintItem label="Base condition (Whistler outlook)" color="var(--border-grey)" value={String(Math.round(r.baseRisk))} />
            {ds.map(d => <InfoHintItem key={d.id} label={`${LENS_INFO[d.id].label} · ${LENS_DEFS[d.id].kind} · ${lenses.find(l => l.id === d.id)?.sources[lenses.find(l => l.id === d.id)?.src || 0]?.label || ''}`} color={LENS_INFO[d.id].color} value={`+${Math.round(d.delta)}`} />)}
            {!ds.length && <span className="t-body-m-regular muted">No active lens affects this asset.</span>}
          </DSec>
          <DSec title="Lifecycle">
            <Field label="Status" value="Active" /><Field label="In service" value={a.inServiceDate} />
            <div style={{ height: 210, flex: 'none', overflow: 'hidden' }}>
              <LineChart data={data} series={[{ key: 'risk', label: 'With lenses' }, { key: 'base', label: 'Condition only', dashed: true }]} referenceKey="tol" referenceLabel="Tolerance" zeroBased />
            </div>
          </DSec>
          <DSec title="Identity">
            <Field label="Type" value={a.assetType} /><Field label="Code" value={a.code} /><Field label="Group" value={a.parent} />
            <Field label="Investment" value={inv ? inv.name : '—'} /><Field label="Customers" value={a.customers.toLocaleString()} />
          </DSec>
          <div className="row" style={{ gap: 8 }}>
            <Button type="cooper" size="s" iconLeft="cooper-system-icon" onClick={onAsk}>Ask Cooper about this asset</Button>
          </div>
        </>}
      </div>
    </Panel>
  );
}
// Group details: a fully selected group (Figma: "Demeter SS (8/8 assets selected)" → group details)
function GroupDetails({ group, lenses, year, onClose, onAsset }) {
  const act = activeOf(lenses);
  const rows = group.assets.map(id => { const a = assetById(id), r = assess(a, year, act); return { a, r, over: r.risk >= TOLERANCE[a.type] }; });
  const avg = k => rows.reduce((t, x) => t + x.r[k], 0) / rows.length;
  const total = rows.reduce((t, x) => t + x.r.risk, 0), cond = 1 - avg('basePof'), lk = likelihoodBadge(avg('pof'));
  return (
    <Panel title={group.label} showEvidence={false} onClose={onClose} style={{ height: '100%' }}
      actions={<Badge size="s" color="white">{`${rows.length}/${rows.length} assets selected`}</Badge>}>
      <div className="col scroll" style={{ gap: 12, height: '100%' }}>
        <DSec title="Risk & condition">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <StatCard size="s" title={`Risk score ${year}`} value={String(Math.round(total))} description="sum of the group" />
            <StatCard size="s" title="At-risk assets" value={`${rows.filter(x => x.over).length}/${rows.length}`} description="over tolerance" />
            <StatCard size="s" title="Condition" value={pctOf(cond)} badge={cond < 0.5 ? { color: 'orange', children: 'Poor' } : { color: 'green', children: 'Fair' }} />
            <StatCard size="s" title="Failure likelihood" value={pctOf(avg('pof'))} badge={{ color: lk.color, children: lk.label }} />
          </div>
        </DSec>
        <DSec title="Asset hierarchy">
          {rows.map(x => <ContentCard key={x.a.id} size="s" iconRight="arrow-right" onClick={() => onAsset(x.a.id)} title={x.a.label}
            description={`${x.a.code} · risk ${Math.round(x.r.risk)} / ${TOLERANCE[x.a.type]}`} control={x.over ? <Indicator size="xs" type="red">Over</Indicator> : undefined} />)}
        </DSec>
      </div>
    </Panel>
  );
}
// ASSETS panel: the hierarchy, assets first for the Asset Manager (Figma 9:13044 / 9:11634)
function AssetsPanel({ value, onSelect, onClose }) {
  return (
    <div style={{ position: 'absolute', left: 12, top: 12, bottom: 12, zIndex: 600, display: 'flex' }}>
      <DSSideNavTree title={`Assets · ${ASSETS.length}`} tree={ASSET_TREE} value={value} defaultExpanded={value ? ASSET_TREE_PATH(value) : ['co', 'elec']}
        onSelect={id => onSelect(id)} onCollapsedChange={c => c && onClose && onClose()} />
    </div>
  );
}

/* ============================================================ Screen 2 — Explore arrival */
function Explore({ navBar, lenses, year, asset, setAsset, details, setDetails, onStudy, onBack, persona, trace, setTrace }) {
  const [barOpen, setBarOpen] = useState(true);
  const api = useRef(null);
  const s = study(lenses, END);
  const am = persona === 'asset';                                       // Asset Manager: assets first (role-based context, Figma 9:11634)
  const [treeOpen, setTreeOpen] = useState(true);
  const [group, setGroup] = useState(null);                            // a fully selected group (ASSETS tree)
  const [groupOpen, setGroupOpen] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const issues = useMemo(() => TRACE_ISSUES.map(i => trace[i.id] ? { ...i, status: trace[i.id] } : i), []);
  const c = useIssues({ issues });
  useEffect(() => { setTrace(c.status); }, [c.status]);
  const g = group && groupById(group);
  const warn = a => TRACE_ISSUES.filter(i => !traceDone(c.status[i.id]) && TRACE_AFFECTS[i.id](a))
    .map(i => TRACE_SHORT[i.id]);
  const pick = id => {
    if (groupById(id)) { setGroup(id); setGroupOpen(false); setAsset(null); setBarOpen(true); return; }
    if (assetById(id)) { setGroup(groupOfAsset(id).id); setAsset(id); setDetails(false); api.current?.flyTo(id); }
  };
  const header = <ExploreHeader search={{ placeholder: 'Search for…' }}>
    <Button type="ghost" size="s" iconLeft="arrow-left" onClick={onBack}>{am ? 'Command' : CLUSTER.name}</Button>
  </ExploreHeader>;
  const right = !!(details || asset || (am && groupOpen));
  return (
    <AppShell navBar={navBar} header={header}>
      <div style={{ display: 'flex', height: '100%', minHeight: 700 }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <NDS label="3D map (MapLibre + OpenFreeMap)" className="fill">
          <MapView lenses={lenses} year={END} selected={asset} onSelect={id => { if (am && id) pick(id); else { setAsset(id); if (id) setDetails(false); } }} apiRef={api}
            pad={{ tl: [am && treeOpen ? 340 : 80, 120], br: [right ? 420 : 220, 60] }} />
        </NDS>
        <MapTools api={api} />
        {am && treeOpen && <AssetsPanel value={asset || group} onSelect={pick} onClose={() => setTreeOpen(false)} />}
        {am && !treeOpen && <div style={{ position: 'absolute', left: 12, top: 12, zIndex: 600 }}><Button type="secondary" size="s" iconLeft="map-location" onClick={() => setTreeOpen(true)}>Assets</Button></div>}
        {am
          ? (g && !groupOpen && !asset && <FloatingBar style={{ top: 100, zIndex: 500 }} open={barOpen} category={g.label} categoryIcon="map-location" item={`Selected ${g.assets.length}`}
              badge={<Badge color="red" size="s">{g.assets.filter(id => { const a = assetById(id); return assess(a, END, activeOf(lenses)).risk >= TOLERANCE[a.type]; }).length}</Badge>}
              secondaryAction={{ label: 'View details', onClick: () => { setAsset(null); setGroupOpen(true); } }} primaryAction={{ label: 'Study area', onClick: onStudy }}
              onClose={() => { setGroup(null); setGroupOpen(false); }} />)
          : <FloatingBar style={{ top: 100, zIndex: 500 }} open={barOpen} category="Cooper found" categoryIcon="cooper-system-icon" item={`${CLUSTER.name} · ${ASSETS.length} assets`}
          badge={<Badge color="red" size="s">{s.now.over} over tolerance by {END}</Badge>}
          secondaryAction={{ label: 'View details', onClick: () => setDetails(true) }} primaryAction={{ label: 'Study area', onClick: onStudy }}
          onClose={() => { setBarOpen(false); toast({ title: 'Selection cleared', primaryAction: { label: 'Undo', onClick: () => setBarOpen(true) } }); }} />}
        {details && (
          <div style={{ position: 'absolute', right: 12, top: 64, bottom: 12, zIndex: 600, display: 'flex' }}>
            <AgentWindow style={{ maxHeight: '100%' }} text={`${CLUSTER.name} — ${CLUSTER.station}, its 12 pad-mount transformers, the Pine Ridge lines and Nesters substation, serving ~${CLUSTER.customers.toLocaleString()} customers. With today’s lenses, ${s.now.over} of ${ASSETS.length} assets are over their intervention tolerance by ${END}. Start with the pad-mount program, which is ready to shape.`}
              onAsk={() => toast({ title: 'Cooper chat isn’t part of this step' })} onClose={() => setDetails(false)}
              tertiaryAction={{ label: 'Close', onClick: () => setDetails(false) }} secondaryAction={{ label: 'Study area', onClick: onStudy }}>
              <ClusterDetails s={s} onAsset={id => { setDetails(false); setAsset(id); api.current?.flyTo(id); }} />
            </AgentWindow>
          </div>
        )}
        {am && g && groupOpen && !asset && (
          <div style={{ position: 'absolute', right: 12, top: 64, bottom: 12, width: 380, zIndex: 600, display: 'flex' }}>
            <GroupDetails group={g} lenses={lenses} year={END} onClose={() => setGroupOpen(false)} onAsset={id => { setAsset(id); api.current?.flyTo(id); }} />
          </div>
        )}
        {asset && !details && (
          <div style={{ position: 'absolute', right: 12, top: 64, bottom: 12, width: 380, zIndex: 600, display: 'flex' }}>
            <AssetDetails id={asset} lenses={lenses} year={END} warnings={am ? warn(assetById(asset)) : []} group={am && groupOpen ? g : null}
              onAsset={id => setAsset(id)} onClose={() => setAsset(null)} onAsk={() => toast({ title: 'Cooper chat isn’t part of this step' })} />
          </div>
        )}
        {!right && <>
          <MapLegend grid={false} style={{ position: 'absolute', right: 12, bottom: 64, zIndex: 500 }} />
          <div style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 500 }}><FtaButton onClick={() => toast({ title: 'Cooper' })} /></div>
        </>}
      </div>
      {am && <div className="explore-trace" style={{ height: '100%' }}>
        <DSTraceReport controller={c} type="sidebar" expanded={traceOpen} onExpandedChange={setTraceOpen} style={{ height: '100%' }} />
      </div>}
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
