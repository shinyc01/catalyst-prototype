/* Explore arrival + asset details + cluster details.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
/* ============================================================ Asset details (shared by Explore + Study)
   Figma Explore: single asset 9:64904 ("Pole 4"), group 9:65804 ("Demeter SS", fully selected), panel 536 wide:
   header (name / code) · Details | Documentation | History · two columns: ASSET HIERARCHY (sections, or the group's assets) | sections. */
const { TraceReport: DSTraceReport, useIssueReport: useIssues } = IFS;
const pctOf = v => `${Math.round(v * 100)}%`;
const likelihoodBadge = p => p >= 0.5 ? { color: 'red', children: 'High' } : p >= 0.25 ? { color: 'orange', children: 'Medium' } : { color: 'green', children: 'Low' };
const riskBadge = (risk, tol) => risk >= tol ? { color: 'red', children: 'Critical' } : risk >= tol * 0.8 ? { color: 'orange', children: 'At risk' } : { color: 'green', children: 'Healthy' };
const shortLabel = a => a.label.replace(/^(Pad-mount|Pine Ridge|Alpine Meadows|Nesters) /, '');
const riskDot = a => { const act = activeOf(INITIAL_LENSES), r = assess(a, END, act).risk, t = TOLERANCE[a.type]; return r >= t ? 'red' : crossYear(a, act) ? 'orange' : null; };
function DSec({ title, children, open: o = true }) {
  const [open, setOpen] = useState(o);
  return (
    <div className="col ad-sec">
      <button className="ad-sec__head t-label-m-upper muted" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Icon name={open ? 'arrow-caret-up-filled' : 'arrow-caret-down-filled'} size={12} />{title}</button>
      {open && <div className="col" style={{ gap: 8 }}>{children}</div>}
    </div>
  );
}
const Field = ({ label, value }) => <div className="ad-field"><span className="t-body-m-regular sec">{label}</span><span className="t-body-m-regular">{value}</span></div>;
const SECTIONS = { bank: ['General', 'Maintenance', 'Cooling', 'Bushings', 'Oil analysis', 'Protection', 'Drawings/Permits', 'Images', 'Additional info'],
  padmount: ['General', 'Maintenance', 'Enclosure', 'Connections', 'Drawings/Permits', 'Images', 'Additional info'],
  line: ['General', 'Maintenance', 'Supports', 'Insulators', 'Conductor', 'Vegetation', 'Drawings/Permits', 'Images', 'Additional info'],
  breaker: ['General', 'Maintenance', 'Mechanism', 'Protection', 'Drawings/Permits', 'Images', 'Additional info'] };      // [Added] attribute sections per kind
// Condition over time (Figma lifecycle chart): condition = 1 − likelihood of failure from the real outlook; the tolerance year is the "Failure" mark
function Lifecycle({ a, act }) {
  const data = YEARS.map(y => ({ label: String(y), cond: Math.round((1 - assess(a, y, act).pof) * 100), base: Math.round((1 - assess(a, y, []).pof) * 100) }));
  return <>
    <Field label="Status" value={<span className="row" style={{ gap: 6 }}><Indicator size="xs" type="green">Active</Indicator>{a.inServiceDate}</span>} />
    <Field label="In service" value={a.install} />
    <div style={{ height: 180, flex: 'none', overflow: 'hidden' }}>
      <LineChart data={data} series={[{ key: 'cond', label: 'Condition with lenses' }, { key: 'base', label: 'Condition only', dashed: true }]} format={v => `${v}%`} zeroBased />
    </div>
  </>;
}
function AssetDetails({ id, lenses, year, onClose, onAsk, warnings = [], group, onAsset, extra, compact }) {
  const a = assetById(id);
  const [tab, setTab] = useState('details');
  const [sec, setSec] = useState('General');
  const [left, setLeft] = useState(!compact);
  const act = activeOf(lenses);
  const r = assess(a, year, act), tol = TOLERANCE[a.type];
  const inv = invById(a.investmentId);
  const leftList = group
    ? <>{[{ id: null, label: `${group.label} group` }, ...group.assets.map(x => ({ id: x, label: shortLabel(assetById(x)) }))].map(x =>
        <button key={x.id || 'g'} className={`ad-item${x.id === id ? ' is-on' : ''}`} onClick={() => onAsset(x.id)}>
          {!x.id && <Icon name="chat-folder" size={14} />}<span className="plan-ellipsis">{x.label}</span>
          {x.id && riskDot(assetById(x.id)) && <span className={`ad-dot ad-dot--${riskDot(assetById(x.id))}`} />}</button>)}</>
    : SECTIONS[a.type].map(x => <button key={x} className={`ad-item${sec === x ? ' is-on' : ''}`} onClick={() => setSec(x)}>{x}</button>);
  return (
    <Panel title={a.label} showEvidence={false} onClose={onClose} style={{ height: '100%', width: '100%' }}>
      <div className="col" style={{ gap: 12, height: '100%', minHeight: 0 }}>
        <span className="t-body-s-regular muted" style={{ marginTop: -8 }}>{a.code}</span>
        <SegmentedControl size="s" fullWidth value={tab} onChange={setTab} options={[{ value: 'details', label: 'Details' }, { value: 'docs', label: 'Documentation' }, { value: 'history', label: 'History' }]} />
        {tab !== 'details' ? <EmptyState cause="empty-container" size="section" heading={tab === 'docs' ? 'Documentation' : 'History'} body="Not part of this flow." /> :
        <NDS label="Two-column asset details (hierarchy list + sections)" className="ad-cols">
          {left && <div className="col ad-left">
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-label-m-upper muted">Asset hierarchy</span>
              <IconButton icon="arrow-bar-right" type="ghost" size="s" label="Hide the list" onClick={() => setLeft(false)} /></div>
            {leftList}
          </div>}
          <div className="col scroll ad-right">
            {!left && <div><Button type="ghost" size="s" iconLeft="arrow-bar-left" onClick={() => setLeft(true)}>Asset hierarchy</Button></div>}
            {warnings.map(w => <Indicator key={w} type="orange">{w}</Indicator>)}
            <DSec title="Risk & condition">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <StatCard size="s" title="Risk score" value={String(Math.round(r.risk))} badge={riskBadge(r.risk, tol)} />
                <StatCard size="s" title="Condition" value={pctOf(1 - r.basePof)} />
                <StatCard size="s" title="Age" value={`${NOW - a.install} y.o`} />
                <StatCard size="s" title="Failure likelihood" value={pctOf(r.pof)} badge={likelihoodBadge(r.pof)} />
              </div>
            </DSec>
            {extra}
            <DSec title="Lifecycle"><Lifecycle a={a} act={act} /></DSec>
            <DSec title="Identity">
              <Field label="Type" value={a.assetType} /><Field label="Code" value={a.code} /><Field label="Group" value={a.parent} />
              <Field label="Investment" value={inv ? inv.name : '—'} />
            </DSec>
            <DSec title="Location & site">
              <Field label="Coordinates" value={(a.at || a.line?.[0] || []).map(v => v.toFixed(5)).join(', ')} />
              <Field label="Area" value="Whistler, BC" /><Field label="Customers served" value={a.customers.toLocaleString()} />
            </DSec>
            <div className="row"><Button type="cooper" size="s" iconLeft="cooper-system-icon" onClick={onAsk}>Ask Cooper about this asset</Button></div>
          </div>
        </NDS>}
      </div>
    </Panel>
  );
}
// Group details: a fully selected group (Figma dev note 9:79016: "Fully selected group: show group details")
function GroupDetails({ group, lenses, year, onClose, onAsset }) {
  const act = activeOf(lenses);
  const rows = group.assets.map(id => { const a = assetById(id), r = assess(a, year, act); return { a, r, over: r.risk >= TOLERANCE[a.type] }; });
  const avg = k => rows.reduce((t, x) => t + x.r[k], 0) / rows.length;
  const total = rows.reduce((t, x) => t + x.r.risk, 0), cond = 1 - avg('basePof'), first = rows[0].a;
  const anyOver = rows.some(x => x.over);
  return (
    <Panel title={group.label} onEvidence={() => toast({ title: 'Evidence chain' })} onClose={onClose} style={{ height: '100%', width: '100%' }}>
      <div className="col" style={{ gap: 12, height: '100%', minHeight: 0 }}>
        <span className="t-body-s-regular muted" style={{ marginTop: -8 }}>{rows.length}/{rows.length} assets selected · {TYPE_LABEL[first.type]}</span>
        <SegmentedControl size="s" fullWidth value="details" onChange={() => toast({ title: 'Not part of this flow' })} options={[{ value: 'details', label: 'Details' }, { value: 'docs', label: 'Documentation' }, { value: 'history', label: 'History' }]} />
        <NDS label="Two-column asset details (hierarchy list + sections)" className="ad-cols">
          <div className="col ad-left">
            <span className="t-label-m-upper muted">Asset hierarchy</span>
            <button className="ad-item is-on"><Icon name="chat-folder" size={14} /><span className="plan-ellipsis">{group.label} group</span></button>
            {rows.map(x => <button key={x.a.id} className="ad-item" onClick={() => onAsset(x.a.id)}><span className="plan-ellipsis">{shortLabel(x.a)}</span>
              {riskDot(x.a) && <span className={`ad-dot ad-dot--${riskDot(x.a)}`} />}</button>)}
          </div>
          <div className="col scroll ad-right">
            <DSec title="Risk & condition">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <StatCard size="s" title="Risk score" value={String(Math.round(total))} badge={anyOver ? { color: 'red', children: 'Critical' } : { color: 'green', children: 'Healthy' }} />
                <StatCard size="s" title="At-risk assets" value={`${rows.filter(x => x.over).length}/${rows.length}`} />
                <StatCard size="s" title="Condition" value={pctOf(cond)} badge={cond < 0.5 ? { color: 'orange', children: 'Poor' } : { color: 'green', children: 'Fair' }} />
                <StatCard size="s" title="Failure likelihood" value={pctOf(avg('pof'))} badge={likelihoodBadge(avg('pof'))} />
              </div>
            </DSec>
            <DSec title="Lifecycle">
              <Field label="Status" value={<Indicator size="xs" type="green">Active</Indicator>} />
              <Field label="In service" value={`${Math.min(...rows.map(x => x.a.install))}–${Math.max(...rows.map(x => x.a.install))}`} />
            </DSec>
            <DSec title="Identification">
              <Field label="Group" value={group.label} /><Field label="Asset type" value={first.assetType} />
              <Field label="Assets" value={rows.length} /><Field label="Customers served" value={rows.reduce((t, x) => t + x.a.customers, 0).toLocaleString()} />
            </DSec>
          </div>
        </NDS>
      </div>
    </Panel>
  );
}
// ASSETS panel (Figma 9:64506): "ASSETS 926" header, tree | list, collapse, close; rows with caret, folder and a risk dot
function AssetsPanel({ value, group, onSelect, onClose }) {
  const [view, setView] = useState('tree');
  const [open, setOpen] = useState(() => new Set(value || group ? ASSET_TREE_PATH(value || group) : ['co', 'elec']));
  const [risk, setRisk] = useState('all');
  const toggle = id => setOpen(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const groupDot = n => n.children && n.children.some(c => groupById(c.id) ? groupDot(c) : (assetById(c.id) && riskDot(assetById(c.id)) === 'red')) ? 'red' : null;
  const Node = ({ n, depth }) => {
    const isAsset = !n.children, on = n.id === value || (n.id === group && !value), exp = open.has(n.id);
    const dot = isAsset ? riskDot(assetById(n.id)) : (!exp && groupDot(n));
    return <>
      <div className={`tree-row${on ? ' is-on' : ''}`} style={{ paddingLeft: 8 + depth * 18 }}>
        {!isAsset ? <button className="tree-caret" aria-label={exp ? `Collapse ${n.label}` : `Expand ${n.label}`} onClick={() => toggle(n.id)}>
          <Icon name={exp ? 'arrow-caret-down-filled' : 'arrow-caret-right-filled'} size={12} /></button> : <span style={{ width: 16 }} />}
        <button className="tree-name" onClick={() => { onSelect(n.id); if (!isAsset && !exp) toggle(n.id); }}>
          {!isAsset && <Icon name="chat-folder" size={16} />}<span className="plan-ellipsis">{n.label}</span></button>
        {dot && <span className={`ad-dot ad-dot--${dot}`} />}
      </div>
      {!isAsset && exp && n.children.map(c => <Node key={c.id} n={c} depth={depth + 1} />)}
    </>;
  };
  const listRows = ASSETS.filter(a => risk === 'all' || (risk === 'high' ? riskDot(a) === 'red' : risk === 'moderate' ? riskDot(a) === 'orange' : !riskDot(a)));
  return (
    <div className="assets-panel">
      <div className="row assets-panel__head">
        <span className="t-heading-h3-uppercase sec">Assets</span><Counter>{ASSETS.length}</Counter>
        <span style={{ flex: 1 }} />
        <SegmentedControl size="s" value={view} onChange={setView} options={[{ value: 'tree', iconLeft: 'asset-structure', label: '' }, { value: 'list', iconLeft: 'layout-list', label: '' }]} aria-label="Tree or list" />
        <IconButton icon="arrow-diagonal-collapse" type="ghost" size="s" label="Collapse the tree" onClick={() => setOpen(new Set(['co']))} />
        <IconButton icon="system-close" type="ghost" size="s" label="Close assets" onClick={onClose} />
      </div>
      <NDS label="Asset hierarchy rows" className="col scroll assets-panel__body">
        {view === 'tree' ? ASSET_TREE.map(n => <Node key={n.id} n={n} depth={0} />) : <>
          <span className="t-body-s-regular muted" style={{ padding: '0 8px' }}>{listRows.length} assets</span>
          <div style={{ padding: '0 8px' }}><SegmentedControl size="s" value={risk} onChange={setRisk} options={[{ value: 'all', label: 'All risk' },
            { value: 'high', label: 'High', counter: ASSETS.filter(a => riskDot(a) === 'red').length }, { value: 'moderate', label: 'Moderate', counter: ASSETS.filter(a => riskDot(a) === 'orange').length },
            { value: 'low', label: 'Low', counter: ASSETS.filter(a => !riskDot(a)).length }]} /></div>
          {ASSET_GROUPS.map(g => { const rs = listRows.filter(a => g.assets.includes(a.id)); return rs.length ? <div key={g.id} className="col">
            <span className="t-label-m-upper muted" style={{ padding: '8px 8px 2px' }}>{g.label} · {rs.length}</span>
            {rs.map(a => <div key={a.id} className={`tree-row${a.id === value ? ' is-on' : ''}`}><button className="tree-name" onClick={() => onSelect(a.id)}>
              <span className="col" style={{ minWidth: 0 }}><span className="plan-ellipsis">{a.label}</span><span className="t-body-s-regular muted">{a.code}</span></span></button>
              {riskDot(a) && <span className={`ad-dot ad-dot--${riskDot(a)}`} />}</div>)}
          </div> : null; })}
        </>}
      </NDS>
    </div>
  );
}

// What drives an asset's risk (Study: lens contributions on top of the base condition)
function Drivers({ id, lenses, year }) {
  const a = assetById(id), act = activeOf(lenses), r = assess(a, year, act), tol = TOLERANCE[a.type], cross = crossYear(a, act);
  const ds = drivers(a, year, act).filter(d => Math.abs(d.delta) >= 0.5).sort((x, y) => y.delta - x.delta);
  return (
    <DSec title={`What’s driving the risk in ${year}`}>
      {r.risk >= tol ? <Indicator type="red">Over tolerance in {year} ({Math.round(r.risk)} ≥ {tol})</Indicator>
        : <Indicator type={cross ? 'orange' : 'green'}>{cross ? `Crosses tolerance in ${cross}` : `Under tolerance to ${END}`}</Indicator>}
      <InfoHintItem label="Base condition (Whistler outlook)" color="var(--border-grey)" value={String(Math.round(r.baseRisk))} />
      {ds.map(d => <InfoHintItem key={d.id} label={`${LENS_INFO[d.id].label} · ${LENS_DEFS[d.id].kind}`} color={LENS_INFO[d.id].color} value={`+${Math.round(d.delta)}`} />)}
      {!ds.length && <span className="t-body-m-regular muted">No active lens affects this asset.</span>}
    </DSec>
  );
}

/* ============================================================ Screen 2 — Explore arrival */
function Explore({ navBar, lenses, year, asset, setAsset, details, setDetails, onStudy, onBack, persona, trace, setTrace, searchCtx, setSearchCtx }) {
  const [barOpen, setBarOpen] = useState(true);
  const api = useRef(null);
  const s = study(lenses, END);
  const am = persona === 'asset';                                       // Asset Manager: assets first (role-based context, Figma 9:11634)
  const fromSearch = am && searchCtx && asset && searchCtx.ids.includes(asset);
  const [treeOpen, setTreeOpen] = useState(!fromSearch);              // from search the ASSETS panel is closed (Figma 9:64832)
  const [group, setGroup] = useState(asset ? groupOfAsset(asset)?.id : null);
  const [groupOpen, setGroupOpen] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const issues = useMemo(() => TRACE_ISSUES.map(i => trace[i.id] ? { ...i, status: trace[i.id] } : i), []);
  const c = useIssues({ issues });
  useEffect(() => { setTrace(c.status); }, [c.status]);
  useEffect(() => { if (asset) setTimeout(() => api.current?.flyTo(asset), 600); }, []);
  const g = group && groupById(group);
  const warn = a => TRACE_ISSUES.filter(i => !traceDone(c.status[i.id]) && TRACE_AFFECTS[i.id](a)).map(i => TRACE_SHORT[i.id]);
  const overOf = ids => ids.filter(id => { const a = assetById(id); return assess(a, END, activeOf(lenses)).risk >= TOLERANCE[a.type]; }).length;
  const pick = id => {
    setSearchCtx && setSearchCtx(null);
    if (groupById(id)) { setGroup(id); setGroupOpen(false); setAsset(null); setBarOpen(true); return; }
    if (assetById(id)) { setGroup(groupOfAsset(id).id); setAsset(id); setDetails(false); api.current?.flyTo(id); }
  };
  const header = <ExploreHeader search={{ placeholder: 'Search for…', ...(fromSearch ? { value: `${assetById(asset).label} details`, onClear: () => setSearchCtx(null) } : {}) }}>
    {!am && <Button type="ghost" size="s" iconLeft="arrow-left" onClick={onBack}>{CLUSTER.name}</Button>}
  </ExploreHeader>;
  const right = !!(details || asset || (am && groupOpen));
  const ri = fromSearch ? searchCtx.ids.indexOf(asset) : -1;
  const stepResult = d => { const n = searchCtx.ids[(ri + d + searchCtx.ids.length) % searchCtx.ids.length]; setAsset(n); setGroup(groupOfAsset(n).id); api.current?.flyTo(n); };
  return (
    <AppShell navBar={navBar} header={header}>
      <div style={{ display: 'flex', height: '100%', minHeight: 700 }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <NDS label="3D map (MapLibre + OpenFreeMap)" className="fill">
          <MapView lenses={lenses} year={END} selected={asset} onSelect={id => { if (am && id) pick(id); else { setAsset(id); if (id) setDetails(false); } }} apiRef={api}
            pad={{ tl: [am && treeOpen ? 460 : 80, 120], br: [right ? 580 : 220, 60] }} />
        </NDS>
        <MapTools api={api} assetsOpen={am && treeOpen} onAssets={am ? () => setTreeOpen(o => !o) : undefined} />
        {am && treeOpen && !(traceOpen && right) && <AssetsPanel value={asset} group={group} onSelect={pick} onClose={() => setTreeOpen(false)} />}
        {am ? <>
          {fromSearch && <FloatingBar style={{ top: 12, zIndex: 500 }} open category={`${ri + 1} / ${searchCtx.ids.length} results`} item={assetById(asset).label}
              actions={<div className="row" style={{ gap: 8 }}>
                <Button type="tertiary" size="s" iconLeft="layout-list" onClick={() => setTreeOpen(true)}>All risk</Button>
                <IconButton icon="arrow-left" type="secondary" size="s" label="Previous result" onClick={() => stepResult(-1)} />
                <IconButton icon="arrow-right" type="secondary" size="s" label="Next result" onClick={() => stepResult(1)} />
                <Button type="primary" size="s" onClick={onStudy}>Study area</Button></div>}
              onClose={() => { setSearchCtx(null); setAsset(null); }} />}
          {!fromSearch && g && !groupOpen && !asset && <FloatingBar style={{ top: 12, zIndex: 500 }} open={barOpen} category={g.label} categoryIcon="map-location" item={`Selected ${g.assets.length}`}
              badge={<Badge color="red" size="s" indicator="error">{overOf(g.assets)}</Badge>}
              secondaryAction={{ label: 'View details', onClick: () => { setAsset(null); setGroupOpen(true); } }} primaryAction={{ label: 'Study area', onClick: onStudy }}
              onClose={() => { setGroup(null); setGroupOpen(false); }} />}
        </> : <FloatingBar style={{ top: 100, zIndex: 500 }} open={barOpen} category="Cooper found" categoryIcon="cooper-system-icon" item={`${CLUSTER.name} · ${ASSETS.length} assets`}
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
          <div className="ad-wrap"><GroupDetails group={g} lenses={lenses} year={END} onClose={() => setGroupOpen(false)} onAsset={id => { setAsset(id); api.current?.flyTo(id); }} /></div>
        )}
        {asset && !details && (
          <div className={am ? 'ad-wrap' : ''} style={am ? {} : { position: 'absolute', right: 12, top: 64, bottom: 12, width: 380, zIndex: 600, display: 'flex' }}>
            <AssetDetails id={asset} lenses={lenses} year={END} warnings={am ? warn(assetById(asset)) : []} group={am && groupOpen ? g : null}
              onAsset={id => id ? setAsset(id) : setAsset(null)} onClose={() => { setAsset(null); setSearchCtx && setSearchCtx(null); }} onAsk={() => toast({ title: 'Cooper chat isn’t part of this step' })} />
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
