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
      <button className="ad-sec__head t-label-m-medium muted" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Icon name={open ? 'arrow-caret-up-filled' : 'arrow-caret-down-filled'} size={12} />{title}</button>
      {open && <div className="col" style={{ gap: 'var(--space-200)' }}>{children}</div>}
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
    <Field label="Status" value={<span className="row" style={{ gap: 'var(--space-150)' }}><Indicator size="xs" type="green">Active</Indicator>{a.inServiceDate}</span>} />
    <Field label="In service" value={a.install} />
    <div style={{ height: 'var(--proto-chart-m)', flex: 'none', overflow: 'hidden' }}>
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
      <div className="col" style={{ gap: 'var(--space-300)', height: '100%', minHeight: 0 }}>
        <span className="t-body-s-regular muted" style={{ marginTop: 'calc(-1 * var(--space-200))' }}>{a.code}</span>
        <SegmentedControl size="s" fullWidth value={tab} onChange={setTab} options={[{ value: 'details', label: 'Details' }, { value: 'docs', label: 'Documentation' }, { value: 'history', label: 'History' }]} />
        {tab !== 'details' ? <EmptyState cause="empty-container" size="section" heading={tab === 'docs' ? 'Documentation' : 'History'} body="Not part of this flow." /> :
        <NDS label="Two-column asset details (hierarchy list + sections)" className="ad-cols">
          {left && <div className="col ad-left">
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-label-m-medium muted">Asset hierarchy</span>
              <IconButton icon="arrow-bar-right" type="ghost" size="s" label="Hide the list" onClick={() => setLeft(false)} /></div>
            {leftList}
          </div>}
          <div className="col scroll ad-right">
            {!left && <div><Button type="ghost" size="s" iconLeft="arrow-bar-left" onClick={() => setLeft(true)}>Asset hierarchy</Button></div>}
            {warnings.map(w => <Indicator key={w} type="orange">{w}</Indicator>)}
            <DSec title="Risk & condition">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-200)' }}>
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
      <div className="col" style={{ gap: 'var(--space-300)', height: '100%', minHeight: 0 }}>
        <span className="t-body-s-regular muted" style={{ marginTop: 'calc(-1 * var(--space-200))' }}>{rows.length}/{rows.length} assets selected · {TYPE_LABEL[first.type]}</span>
        <SegmentedControl size="s" fullWidth value="details" onChange={() => toast({ title: 'Not part of this flow' })} options={[{ value: 'details', label: 'Details' }, { value: 'docs', label: 'Documentation' }, { value: 'history', label: 'History' }]} />
        <NDS label="Two-column asset details (hierarchy list + sections)" className="ad-cols">
          <div className="col ad-left">
            <span className="t-label-m-medium muted">Asset hierarchy</span>
            <button className="ad-item is-on"><Icon name="chat-folder" size={14} /><span className="plan-ellipsis">{group.label} group</span></button>
            {rows.map(x => <button key={x.a.id} className="ad-item" onClick={() => onAsset(x.a.id)}><span className="plan-ellipsis">{shortLabel(x.a)}</span>
              {riskDot(x.a) && <span className={`ad-dot ad-dot--${riskDot(x.a)}`} />}</button>)}
          </div>
          <div className="col scroll ad-right">
            <DSec title="Risk & condition">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-200)' }}>
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
      <div className={`tree-row${on ? ' is-on' : ''}`} style={{ paddingLeft: `calc(var(--space-200) + ${depth} * var(--proto-tree-indent))` }}>
        {!isAsset ? <button className="tree-caret" aria-label={exp ? `Collapse ${n.label}` : `Expand ${n.label}`} onClick={() => toggle(n.id)}>
          <Icon name={exp ? 'arrow-caret-down-filled' : 'arrow-caret-right-filled'} size={12} /></button> : <span style={{ width: 'var(--size-16)' }} />}
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
        <span className="t-heading-h4-semibold">Assets</span><Counter>{ASSETS.length}</Counter>
        <span style={{ flex: 1 }} />
        <SegmentedControl size="s" value={view} onChange={setView} options={[{ value: 'tree', iconLeft: 'asset-structure', label: '' }, { value: 'list', iconLeft: 'layout-list', label: '' }]} aria-label="Tree or list" />
        <IconButton icon="arrow-diagonal-collapse" type="ghost" size="s" label="Collapse the tree" onClick={() => setOpen(new Set(['co']))} />
        <IconButton icon="system-close" type="ghost" size="s" label="Close assets" onClick={onClose} />
      </div>
      <NDS label="Asset hierarchy rows" className="col scroll assets-panel__body">
        {view === 'tree' ? ASSET_TREE.map(n => <Node key={n.id} n={n} depth={0} />) : <>
          <span className="t-body-s-regular muted" style={{ padding: '0 var(--space-200)' }}>{listRows.length} assets</span>
          <div style={{ padding: '0 var(--space-200)' }}><SegmentedControl size="s" value={risk} onChange={setRisk} options={[{ value: 'all', label: 'All risk' },
            { value: 'high', label: 'High', counter: ASSETS.filter(a => riskDot(a) === 'red').length }, { value: 'moderate', label: 'Moderate', counter: ASSETS.filter(a => riskDot(a) === 'orange').length },
            { value: 'low', label: 'Low', counter: ASSETS.filter(a => !riskDot(a)).length }]} /></div>
          {ASSET_GROUPS.map(g => { const rs = listRows.filter(a => g.assets.includes(a.id)); return rs.length ? <div key={g.id} className="col">
            <span className="t-label-m-medium muted" style={{ padding: 'var(--space-200) var(--space-200) var(--space-50)' }}>{g.label} · {rs.length}</span>
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

// Studies library (Figma 29:101050): left panel from the map rail. Rows "name · N assets · time"; hover → rename / delete; click → open.
function StudiesPanel({ studies, setStudies, onOpen, onClose }) {
  const [edit, setEdit] = useState(null);                 // { id, text }
  const [del, setDel] = useState(null);
  const list = [...studies].sort((a, b) => b.savedAt - a.savedAt);
  const remove = st => { const before = studies; setStudies(l => l.filter(x => x.id !== st.id)); setDel(null);
    toast({ title: 'The study has been removed', secondaryAction: { label: 'Undo', iconLeft: 'arrow-back-up', onClick: () => setStudies(before) }, duration: 5000 }); };
  return (
    <div className="assets-panel">
      <div className="row assets-panel__head">
        <span className="t-heading-h4-semibold">Studies</span><Counter>{studies.length}</Counter><span style={{ flex: 1 }} />
        <IconButton icon="system-close" type="ghost" size="s" label="Close studies" onClick={onClose} />
      </div>
      <NDS label="Study library rows (hover actions, inline rename)" className="col scroll assets-panel__body">
        {!list.length && <EmptyState cause="empty-container" size="section" heading="No saved studies yet" body="Open a study and use Create idea ▾ → Save study." />}
        {list.map(st => edit && edit.id === st.id
          ? <div key={st.id} className="study-row" onKeyDown={e => { if (e.key === 'Escape') setEdit(null); }}>
              <div style={{ flex: 1 }}><TextField size="m" autoFocus value={edit.text} onChange={v => setEdit({ ...edit, text: v })} aria-label="Study name" /></div>
              <IconButton icon="system-close" type="ghost" size="s" label="Cancel rename" onClick={() => setEdit(null)} />
              <IconButton icon="system-check" type="ghost" size="s" label="Save name" onClick={() => { if (edit.text.trim()) setStudies(l => l.map(x => x.id === st.id ? { ...x, name: edit.text.trim() } : x)); setEdit(null); }} />
            </div>
          : <div key={st.id} className="study-row is-click" role="button" tabIndex={0} aria-label={`Open ${st.name} study`} onClick={() => onOpen(st)} onKeyDown={e => e.key === 'Enter' && onOpen(st)}>
              <span className="plan-ellipsis" style={{ flex: 1 }}>{st.name} <span className="sec">· {studyCount(st)} assets</span></span>
              <span className="t-body-s-regular muted study-time">{ago(st.savedAt)}</span>
              <span className="study-acts" onClick={e => e.stopPropagation()}>
                <IconButton icon="system-edit-rename" type="ghost" size="s" label={`Rename ${st.name}`} onClick={() => setEdit({ id: st.id, text: st.name })} />
                <IconButton icon="system-trash-delete" type="ghost" size="s" label={`Delete ${st.name}`} onClick={() => setDel(st)} />
              </span>
            </div>)}
      </NDS>
      <Modal open={!!del} onOpenChange={o => !o && setDel(null)} title={del ? `Remove “${del.name}” study?` : ''} width="var(--overlay-width-m)">
        <div className="col" style={{ gap: 'var(--space-400)' }}>
          <span className="t-body-m-regular sec">This will remove the saved study from your library. You’ll be able to undo this for a few seconds after.</span>
          <div className="row" style={{ gap: 'var(--space-200)' }}>
            <div style={{ flex: 1 }}><Button type="secondary" size="m" style={{ width: '100%' }} onClick={() => setDel(null)}>Cancel</Button></div>
            <div style={{ flex: 1 }}><Button type="primary" size="m" style={{ width: '100%' }} onClick={() => remove(del)}>Remove</Button></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ============================================================ J05 · Cooper recommendations (Figma 29:351117, 29:352263, 29:354522, 29:358931, 29:357809)
   list (grouped) → Take me there (fly-in) → Live signal (risk drivers · affected areas · recent outages) → Create idea (interventions) → sent to Build */
const { RecommendationGroup, RecommendationItem, RecommendationImpact, CooperChip, EvidenceButton, EvidenceChainDrawer } = IFS;
function Collapse({ title, count, open, onToggle, children }) {
  return (
    <div className="col rec-sec">
      <button className="ad-sec__head t-label-m-medium muted" onClick={onToggle} aria-expanded={open}>
        <Icon name={open ? 'arrow-caret-up-filled' : 'arrow-caret-down-filled'} size={12} />{title}{count != null && <Counter>{count}</Counter>}</button>
      {open && <div className="col" style={{ gap: 'var(--space-200)' }}>{children}</div>}
    </div>
  );
}
function RecsWindow({ open: openIds, mode, recId, setMode, onClose, onFocus, onFly, onStudy, onCreate }) {
  const r = RECOMMENDATIONS.find(x => x.id === recId);
  const [exp, setExp] = useState(null);
  const [sec, setSec] = useState('drivers');
  const [others, setOthers] = useState(false);
  const [evid, setEvid] = useState(false);
  const groups = recGroups(openIds), n = openIds.length;
  if (mode === 'loading') return <AgentWindow text="Taking you there: Bringing the assets into view…" onClose={onClose} />;
  const evidence = r && <div className="rec-evidence"><EvidenceChainDrawer open={evid} onOpenChange={setEvid} value={Math.round(70 + r.pof * 25)} rationale={r.evidence}
    benchmark={{ empty: true }} /></div>;
  if (mode === 'signal' && r) return <>
    {evid && evidence}
    <AgentWindow onClose={onClose} secondaryAction={{ label: 'Create idea', onClick: () => setMode('draft') }} tertiaryAction={{ label: 'View in Study', onClick: () => onStudy(r) }}>
      <div className="col" style={{ gap: 'var(--space-300)' }}>
        <div className="row" style={{ gap: 'var(--space-200)', justifyContent: 'space-between' }}><span className="t-heading-h2">{r.signal.title}</span><EvidenceButton active={evid} onClick={() => setEvid(!evid)} /></div>
        <span className="t-body-m-regular sec">{r.signal.text}</span>
        <Collapse title="Risk drivers" open={sec === 'drivers'} onToggle={() => setSec(sec === 'drivers' ? null : 'drivers')}>
          <ContentCard size="s" title={r.signal.driver.title} description={r.signal.driver.text} bottom={<div style={{ width: '100%' }}>
            <RecommendationImpact rows={r.signal.driver.rows} />
            <div style={{ height: 'var(--proto-chart-s)', overflow: 'hidden' }}><LineChart data={r.signal.chart} series={[{ key: 'pof', label: 'Failure likelihood' }, { key: 'base', label: 'Condition only', dashed: true }]} format={v => `${v}%`} zeroBased /></div>
          </div>} />
        </Collapse>
        <Collapse title="Affected areas" open={sec === 'areas'} onToggle={() => setSec(sec === 'areas' ? null : 'areas')}>
          <ContentCard size="s" title={r.area} description={r.signal.areaText} bottom={<div style={{ width: '100%' }}><RecommendationImpact rows={r.signal.areaRows} /></div>} />
        </Collapse>
        <Collapse title="Recent outages" count={r.signal.outages.length} open={sec === 'outages'} onToggle={() => setSec(sec === 'outages' ? null : 'outages')}>
          {r.signal.outages.map((o, i) => <ContentCard key={o} size="s" iconLeft="arrow-caret-right-filled" title={`${i + 1}. ${o}`} onClick={() => toast({ title: o, description: 'Outage records aren’t part of this prototype yet' })} />)}
        </Collapse>
      </div>
    </AgentWindow>
  </>;
  if (mode === 'draft' && r) { const rec = r.interventions[0], alts = r.interventions.slice(1);
    const rows = x => [{ label: 'Cost', value: `~${fmtMoney(x.cost)}` }, { label: 'Value', value: `${fmtValue(x.value)} value score` }, { label: 'Timeline', value: x.timeline }, { label: 'Risk reduced', value: `${pctTxt(x.reduced)} of the group’s risk` }];
    return <>
      {evid && evidence}
      <AgentWindow onClose={onClose} secondaryAction={{ label: 'Create idea', onClick: () => onCreate(r) }} tertiaryAction={{ label: 'View in Study', onClick: () => onStudy(r) }}>
        <div className="col" style={{ gap: 'var(--space-300)' }}>
          <div><Button type="ghost" size="s" iconLeft="arrow-left" onClick={() => setMode('signal')}>Back</Button></div>
          <div className="row" style={{ gap: 'var(--space-200)', justifyContent: 'space-between' }}><span className="t-heading-h2">{r.signal.title}</span><EvidenceButton active={evid} onClick={() => setEvid(!evid)} /></div>
          <Collapse title="Recommended intervention" open onToggle={() => {}}>
            <ContentCard size="s" title={rec.name} description={`Cooper’s pick for ${r.inv.name}: the recommended alternative in the investment.`}
              control={<Badge size="s" color="white">{`${r.assets.length} assets`}</Badge>} bottom={<div style={{ width: '100%' }}><RecommendationImpact rows={rows(rec)} /></div>} />
          </Collapse>
          <Collapse title="Other interventions" count={alts.length} open={others} onToggle={() => setOthers(!others)}>
            {alts.map(x => <ContentCard key={x.id} size="s" title={x.name} bottom={<div style={{ width: '100%' }}><RecommendationImpact rows={rows(x)} /></div>} />)}
          </Collapse>
        </div>
      </AgentWindow>
    </>; }
  return (
    <AgentWindow onClose={onClose} onAsk={() => toast({ title: 'Cooper chat isn’t part of this flow' })}
      text={`I’ve surfaced ${n} recommendation${n === 1 ? '' : 's'} that need your attention — grouped by risk, value and impact.`}>
      <div className="col" style={{ gap: 'var(--space-300)' }}>
        {groups.map(g => (
          <RecommendationGroup key={g.title} title={g.title} count={g.items.length}>
            {g.items.map(x => (
              <RecommendationItem key={x.id} title={x.title} impact={x.impact} expanded={exp === x.id}
                description={<span className="col" style={{ gap: 'var(--space-200)' }}><span>{x.description}</span>
                  <NDS label="Includes + If no action is taken" className="col rec-extra">
                    <span className="t-label-m-medium muted">Includes</span>
                    {x.includes.map(i => <span key={i.label} className="row t-body-m-regular" style={{ gap: 'var(--space-150)' }}>• {i.label}{i.root && <Badge size="s" color="black">Root</Badge>}</span>)}
                    <span className="t-label-m-medium muted">If no action is taken</span>
                    {x.ifNoAction.map(i => <span key={i} className="t-body-m-regular sec">• {i}</span>)}
                  </NDS></span>}
                onExpandedChange={o => { setExp(o ? x.id : null); onFocus(o ? x.assets : null); }} action={{ label: 'Take me there', onClick: () => onFly(x) }} />
            ))}
          </RecommendationGroup>
        ))}
        {!groups.length && <EmptyState cause="empty-container" size="section" heading="Nothing needs your attention" body="Every recommendation has been sent to Build." />}
      </div>
    </AgentWindow>
  );
}

/* ============================================================ Screen 2 — Explore arrival */
function Explore({ navBar, lenses, year, asset, setAsset, details, setDetails, onStudy, onBack, persona, trace, setTrace, searchCtx, setSearchCtx, studies, setStudies, onOpenStudy,
  recsOpenIds = [], setRecsOpenIds, onSendToBuild, recsAtStart }) {
  const [recs, setRecs] = useState(!!recsAtStart);              // J05: the Cooper recommendations window
  const [recMode, setRecMode] = useState('list');               // list | loading | signal | draft
  const [recId, setRecId] = useState(null);
  const [recFocus, setRecFocus] = useState(null);
  const [libOpen, setLibOpen] = useState(false);
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
  const flyTo = r => { setRecMode('loading'); setRecId(r.id); setRecFocus(r.assets); setTreeOpen(false); setAsset(null); setGroupOpen(false);
    r.assets.forEach((id, i) => i === 0 && api.current?.flyTo(id)); setTimeout(() => setRecMode('signal'), 1600); };
  const recR = recId && RECOMMENDATIONS.find(x => x.id === recId);
  const header = <ExploreHeader search={{ placeholder: 'Search for…', ...(fromSearch ? { value: `${assetById(asset).label} details`, onClear: () => setSearchCtx(null) } : {}) }}
    actions={am ? <div className="row" style={{ gap: 'var(--space-200)' }}>
      {recs && recMode !== 'list' ? null : <CooperChip selected={recs} onClick={() => { setRecs(!recs); setRecMode('list'); setRecFocus(null); }}>{`${recsOpenIds.length} risk${recsOpenIds.length === 1 ? '' : 's'} surfaced`}</CooperChip>}
      <Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      <IconButton icon="system-comment" type="tertiary" size="s" label="Comments" onClick={() => toast({ title: 'Comments aren’t part of this flow' })} />
    </div> : undefined}>
    {!am && <Button type="ghost" size="s" iconLeft="arrow-left" onClick={onBack}>{CLUSTER.name}</Button>}
    {am && recs && recMode !== 'list' && recR && <Button type="ghost" size="s" iconLeft="arrow-left" onClick={() => { setRecMode('list'); setRecFocus(null); }}>{recR.area}</Button>}
  </ExploreHeader>;
  const right = !!(details || asset || (am && groupOpen));
  const ri = fromSearch ? searchCtx.ids.indexOf(asset) : -1;
  const stepResult = d => { const n = searchCtx.ids[(ri + d + searchCtx.ids.length) % searchCtx.ids.length]; setAsset(n); setGroup(groupOfAsset(n).id); api.current?.flyTo(n); };
  return (
    <AppShell navBar={navBar} header={header}>
      <div style={{ display: 'flex', height: '100%', minHeight: 'var(--proto-page-min-h)' }}>
      <div className="ifs-slots" style={{ position: 'relative', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <NDS label="3D map (MapLibre + OpenFreeMap)" className="fill">
          <MapView lenses={lenses} year={END} selected={asset} focus={recs ? recFocus : null} onSelect={id => { if (am && id) pick(id); else { setAsset(id); if (id) setDetails(false); } }} apiRef={api}
            pad={{ tl: [am && treeOpen ? 460 : 80, 120], br: [right ? 640 : 240, 60] }} />{/* map camera padding: MapLibre takes px (exception, context/decisions.md) */}
        </NDS>
        <MapTools api={api} assetsOpen={am && treeOpen && !libOpen} onAssets={am ? () => { setLibOpen(false); setTreeOpen(o => !o); } : undefined}
          libraryOpen={libOpen} onLibrary={am ? () => { setLibOpen(o => !o); } : undefined} onStudy={() => onStudy(am && g ? g : null)} />
        {am && libOpen && <StudiesPanel studies={studies} setStudies={setStudies} onOpen={onOpenStudy} onClose={() => setLibOpen(false)} />}
        {am && recs && <div className="recs-wrap"><RecsWindow open={recsOpenIds} mode={recMode} recId={recId} setMode={setRecMode} onFocus={setRecFocus} onFly={flyTo}
          onClose={() => { setRecs(false); setRecMode('list'); setRecFocus(null); }}
          onStudy={r => onStudy({ id: r.id, label: r.area === 'Alpine Meadows Station' && r.assets.length === 1 ? r.inv.name : r.area, assets: r.assets })}
          onCreate={r => { onSendToBuild(r); setRecs(false); setRecMode('list'); setRecFocus(null); }} /></div>}
        {am && treeOpen && !libOpen && !recs && !(traceOpen && right) && <AssetsPanel value={asset} group={group} onSelect={pick} onClose={() => setTreeOpen(false)} />}
        {am ? <>
          {fromSearch && <FloatingBar style={{ top: 'var(--space-300)', zIndex: 'var(--proto-z-map-ui)' }} open category={`${ri + 1} / ${searchCtx.ids.length} results`} item={assetById(asset).label}
              actions={<div className="row" style={{ gap: 'var(--space-200)' }}>
                <Button type="tertiary" size="s" iconLeft="layout-list" onClick={() => setTreeOpen(true)}>All risk</Button>
                <IconButton icon="arrow-left" type="secondary" size="s" label="Previous result" onClick={() => stepResult(-1)} />
                <IconButton icon="arrow-right" type="secondary" size="s" label="Next result" onClick={() => stepResult(1)} />
                <Button type="primary" size="s" onClick={() => onStudy(groupOfAsset(asset))}>Study area</Button></div>}
              onClose={() => { setSearchCtx(null); setAsset(null); }} />}
          {!fromSearch && g && !groupOpen && !asset && <FloatingBar style={{ top: 'var(--space-300)', zIndex: 'var(--proto-z-map-ui)' }} open={barOpen} category={g.label} categoryIcon="map-location" item={`Selected ${g.assets.length}`}
              badge={<Badge color="red" size="s" indicator="error">{overOf(g.assets)}</Badge>}
              secondaryAction={{ label: 'View details', onClick: () => { setAsset(null); setGroupOpen(true); } }} primaryAction={{ label: 'Study area', onClick: () => onStudy(g) }}
              onClose={() => { setGroup(null); setGroupOpen(false); }} />}
        </> : <FloatingBar style={{ top: 'var(--proto-under-header)', zIndex: 'var(--proto-z-map-ui)' }} open={barOpen} category="Cooper found" categoryIcon="cooper-system-icon" item={`${CLUSTER.name} · ${ASSETS.length} assets`}
          badge={<Badge color="red" size="s">{s.now.over} over tolerance by {END}</Badge>}
          secondaryAction={{ label: 'View details', onClick: () => setDetails(true) }} primaryAction={{ label: 'Study area', onClick: () => onStudy(null) }}
          onClose={() => { setBarOpen(false); toast({ title: 'Selection cleared', primaryAction: { label: 'Undo', onClick: () => setBarOpen(true) } }); }} />}
        {details && (
          <div className="ifs-slot-right" style={{ width: 'auto' }}>
            <AgentWindow style={{ maxHeight: '100%' }} text={`${CLUSTER.name} — ${CLUSTER.station}, its 12 pad-mount transformers, the Pine Ridge lines and Nesters substation, serving ~${CLUSTER.customers.toLocaleString()} customers. With today’s lenses, ${s.now.over} of ${ASSETS.length} assets are over their intervention tolerance by ${END}. Start with the pad-mount program, which is ready to shape.`}
              onAsk={() => toast({ title: 'Cooper chat isn’t part of this step' })} onClose={() => setDetails(false)}
              tertiaryAction={{ label: 'Close', onClick: () => setDetails(false) }} secondaryAction={{ label: 'Study area', onClick: () => onStudy(null) }}>
              <ClusterDetails s={s} onAsset={id => { setDetails(false); setAsset(id); api.current?.flyTo(id); }} />
            </AgentWindow>
          </div>
        )}
        {am && g && groupOpen && !asset && (
          <div className="ad-wrap"><GroupDetails group={g} lenses={lenses} year={END} onClose={() => setGroupOpen(false)} onAsset={id => { setAsset(id); api.current?.flyTo(id); }} /></div>
        )}
        {asset && !details && (
          <div className={am ? 'ad-wrap' : 'ifs-slot-right'} style={am ? {} : undefined}>
            <AssetDetails id={asset} lenses={lenses} year={END} warnings={am ? warn(assetById(asset)) : []} group={am && groupOpen ? g : null}
              onAsset={id => id ? setAsset(id) : setAsset(null)} onClose={() => { setAsset(null); setSearchCtx && setSearchCtx(null); }} onAsk={() => toast({ title: 'Cooper chat isn’t part of this step' })} />
          </div>
        )}
        {!right && <>
          <MapLegend grid={false} style={{ position: 'absolute', right: 'var(--page-margin)', bottom: 'var(--space-1000)', zIndex: 'var(--proto-z-map-ui)' }} />
          <div style={{ position: 'absolute', right: 'var(--page-margin)', bottom: 'var(--space-300)', zIndex: 'var(--proto-z-map-ui)' }}><FtaButton onClick={() => toast({ title: 'Cooper' })} /></div>
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
  <NDS label="Clickable asset list" className="col" style={{ gap: 'var(--space-50)' }}>
    {rows.slice(0, limit).map(r => (
      <div key={r.a.id} className="click row" style={{ padding: 'var(--space-100) var(--space-150)', justifyContent: 'space-between' }} onClick={() => onAsset(r.a.id)}>
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
    <div className="col" style={{ gap: 'var(--space-300)' }}>
      <span className="t-label-m-medium muted">Recommended intervention</span>
      <ContentCard size="s" title={`${IDEA_INV.name} · ${alt.name}`} description={ALT_DESC[alt.name]} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-200)' }}>
        <StatCard size="s" title="Cost" value={fmtMoney(alt.spendTotal)} />
        <StatCard size="s" title="Value" value={fmtValue(alt.valueTotal)} description="value score" />
        <StatCard size="s" title="Timeline" value={spanYears(alt)} />
        <StatCard size="s" title="At-risk assets" value={`${s.now.over}/${ASSETS.length}`} description={`by ${END}`} />
      </div>
      <span className="t-label-m-medium muted">If no action is taken</span>
      <div className="col t-body-m-regular sec" style={{ gap: 'var(--space-100)' }}>
        <span>{overNowRows.map(r => r.a.label).join(' and ')} are already past tolerance</span>
        <span>Outage risk for ~{CLUSTER.customers.toLocaleString()} Alpine Meadows customers keeps rising</span>
        <span>Pine Ridge corridor wildfire exposure grows every year</span>
      </div>
    </div>
  );
}
