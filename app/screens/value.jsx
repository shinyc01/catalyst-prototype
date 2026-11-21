/* Value — J12 (library, create, map, shape), J13 (review, approval, overview, capital flow), J14 (value models, recalibration).
   Figma Strategy Framework handover 8VmjGH9Ihg8TFzDQiKTPpi: library 2340:56647, create 2646:49149, map 2011:61558, shape 2841:29115,
   Cooper 2365:48305, review 2761:256237, approval 2838:96751, overview 784:43771, capital flow 2011:137249, value models 2456:2307.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
const { NodeCard: VfNode, CanvasBackground: VfCanvas, CanvasConnector: VfEdge, CanvasHeader: VfColumns, ValueMapButton: VfMapButton, Sankey: VfSankey,
  StatCard: VfStat, ApprovalChainTable: VfApprovals, SidebarNodeCard: VfPick, Table: VfTable, ConfidenceGates: VfGates, IssueKindSwitch: VfKinds,
  IssueNavigator: VfNavigator, RecommendationGroup: VfRecGroup, RecommendationItem: VfRecItem, RecommendationDetail: VfRecDetail, BarChart: VfBarChart } = IFS;

// ---- canvas layout (world px: canvas geometry, the documented exception like map paint) ----------------------------------
const VF_COL = 280, VF_ROW = 92, VF_TOP = 24;                                                                  // tokens-ok: canvas world geometry
const vfAt = (col, row) => ({ position: 'absolute', left: col * VF_COL + 24, top: VF_TOP + row * VF_ROW, width: 200 });   // tokens-ok: canvas world geometry
const vfEdgeOf = (a, b) => ({ from: { x: a.col * VF_COL + 224, y: VF_TOP + a.row * VF_ROW + 39 }, to: { x: b.col * VF_COL + 24, y: VF_TOP + b.row * VF_ROW + 39 } });   // tokens-ok: canvas world geometry

// The framework as columns: goals → framework → objectives → models → measures (only the expanded columns show children)
function vfGraph(objectives, extraMeasures = []) {
  const n = [], e = [];
  const goals = VF_GOALS.map((g, i) => ({ id: `g${i}`, type: 'enterprise-goal', title: g, col: 0, row: i }));
  const fw = { id: 'fw', type: 'value-framework', title: 'Value Framework v12', caption: 'Active', col: 1, row: 2 };
  const objs = objectives.map((o, i) => ({ id: `o-${o.id}`, type: 'strategic-objective', title: o.name, caption: o.weight != null ? `Weight ${o.weight}%` : 'No weight yet', col: 2, row: i, obj: o }));
  let r = 0;
  const models = VF_MODEL_ROWS.map(m => ({ id: `m-${m.id}`, type: 'value-model', title: m.name, caption: `${m.investments} investments`, col: 3, row: r++, model: m }));
  let mr = 0;
  const measures = [...VF_MODEL_ROWS.flatMap(m => m.measures.slice(0, 4).map(x => ({ ...x, mid: m.id }))), ...extraMeasures].map(x => ({ id: `x-${x.id || x.name}`, type: 'measure', title: x.name, caption: x.type, col: 4, row: mr++, mid: x.mid }));
  n.push(...goals, fw, ...objs, ...models, ...measures);
  goals.forEach(g => e.push([g, fw])); objs.forEach(o => e.push([fw, o]));
  models.forEach(m => { const o = objs.find(x => x.obj.id === m.model.objective); if (o) e.push([o, m]); });
  measures.forEach(x => { const m = models.find(y => y.model.id === x.mid); if (m) e.push([m, x]); });
  return { nodes: n, edges: e, height: Math.max(goals.length, objs.length, models.length, measures.length) * VF_ROW + 80 };
}

function VfMap({ objectives, extraMeasures, onNode, selected, outOfFocus }) {
  const g = useMemo(() => vfGraph(objectives, extraMeasures), [objectives, extraMeasures]);
  const api = useRef(null);
  const path = selected ? new Set([selected, ...g.edges.filter(([a, b]) => a.id === selected || b.id === selected).flatMap(([a, b]) => [a.id, b.id])]) : null;
  return <div className="vf-canvas">
    <VfColumns columns={['Enterprise goals', 'Value framework', 'Strategic objectives', 'Value models', 'Measure output']} />
    <VfCanvas apiRef={api} defaultView={{ x: 0, y: 0, zoom: 0.8 }} style={{ flex: 1 }} overlay={<div className="vf-canvas__fit"><VfMapButton type="shape" onFit={() => api.current?.fit({ x: 0, y: 0, width: 1420, height: g.height })} onExpand={() => {}} onCollapse={() => {}} /></div>}>
      {g.edges.map(([a, b], k) => { const ed = vfEdgeOf(a, b); return <VfEdge key={k} from={ed.from} to={ed.to} highlighted={path && path.has(a.id) && path.has(b.id)} />; })}
      {g.nodes.map(nd => <div key={nd.id} style={vfAt(nd.col, nd.row)}>
        <VfNode type={nd.type} title={nd.title} caption={nd.caption} stackIcons={false} selected={selected === nd.id} outOfFocus={(path && !path.has(nd.id)) || (outOfFocus && outOfFocus(nd))} onClick={() => onNode && onNode(nd)} />
      </div>)}
    </VfCanvas>
  </div>;
}

// The detail panel for a node (Figma "Details | Evidence Chain"); model formulas are Figma copy [Added]
function VfNodePanel({ node, onClose }) {
  if (!node) return null;
  const m = node.model;
  return <div className="vf-panel"><Panel title={node.title} actions={<PanelClose onClose={onClose} />} className="proto-fill">
    <div className="col" style={{ gap: 'var(--space-stack)' }}>
      {m ? <>
        <span className="t-label-m-medium">Description</span>
        <span className="t-body-m-regular sec">{`${m.name} scores ${m.measures.length} of the framework’s measures for the ${VF_OBJECTIVES.find(o => o.id === m.objective).name} objective, across ${m.investments} investments.`}</span>
        <span className="t-label-m-medium">Measure calculation</span>
        <NDS label="Formula tokens" className="rf-formula col" style={{ alignItems: 'flex-start', padding: 'var(--space-200) var(--space-300)' }}>
          <span className="t-code-m-regular">{`${m.measures[0] ? m.measures[0].name : 'Risk'} = Risk consequence × Risk likelihood`}</span>
          <span className="t-code-m-regular muted">Value = Baseline − Outcome</span></NDS>
        <span className="t-label-m-medium">Measures</span>
        <div className="row" style={{ gap: 'var(--space-100)', flexWrap: 'wrap' }}>{m.measures.map(x => <Badge key={x.id} size="s" color="white">{x.name}</Badge>)}</div>
      </> : node.obj ? <>
        <span className="t-body-m-regular sec">{`${node.obj.name}: ${node.obj.weight != null ? `${node.obj.weight}% of the framework’s weight` : 'no weight yet'}. Its models: ${VF_MODEL_ROWS.filter(x => x.objective === node.obj.id).map(x => x.name).join(', ') || 'none yet'}.`}</span>
      </> : <span className="t-body-m-regular sec">{node.type === 'measure' ? `${node.title} is a ${node.caption.toLowerCase()} measure in the demo data.` : `${node.title}.`}</span>}
      <span className="t-label-m-medium">Evidence chain</span>
      <span className="t-body-m-regular sec">Activity: approved in the Q1 2026 cycle. Usage: scored on every investment in the Demo Portfolio.</span>
    </div>
  </Panel></div>;
}

/* ============================================================ the Value screen (one component, several pages) */
function Value({ navBar, page, setPage, draft, setDraft, recsDone, setRecsDone, persona }) {
  const [node, setNode] = useState(null);
  const [cooper, setCooper] = useState(null);                 // { kind: 'recs' | 'detail' | 'text', id, text }
  const libraryPage = page.startsWith('library');
  const canvasPage = !libraryPage && !page.startsWith('model-');
  const openRecs = VF_RECS.filter(r => !recsDone.includes(r.id));
  const nav = [{ id: 'overview', label: 'Active Framework' }, { type: 'section', label: 'Library', items: [{ id: 'library', label: 'Strategy Frameworks' }, { id: 'library-vf', label: 'Value Frameworks' }, { id: 'library-models', label: 'Value Models' }] },
    { id: 'human', label: 'Human Performance', disabled: true }];
  const navValue = ['overview', 'map', 'flow'].includes(page) ? 'overview' : page.startsWith('model-') ? 'library-models' : page;
  const draftStage = ['input', 'shape', 'review', 'approval'].includes(page);
  const activeHeader = ['overview', 'map', 'flow'].includes(page);
  // Figma 2761:256320: an icon-only segmented control (overview · node-map · capital flow) in the header's views slot, after the status
  const views = <SegmentedControl size="s" value={page} onChange={setPage} options={[{ value: 'overview', iconLeft: 'overview', ariaLabel: 'Overview' }, { value: 'map', iconLeft: 'node-map', ariaLabel: 'Map' }, { value: 'flow', iconLeft: 'capital-flow', ariaLabel: 'Capital Flow' }]} />;
  // [Assumed] framework versions for the title menu ▾ (rule 5.1)
  const [onTitleMenu, activityPanel] = useActivity('framework', activityVersions(draftStage
    ? [{ text: `${draft.name} created with Cooper.`, by: 'cooper', day: STORY_DAY }]
    : [{ text: 'Q1 2026 Strategy Framework drafted.', by: { name: ownerName('NL'), initials: 'NL' }, day: '2026-01-08' }, { text: 'Approved and made active.', by: { name: ownerName('NL'), initials: 'NL' }, day: '2026-01-15' }]));
  const header = activeHeader ? <PageHeader title="Q1 2026 Strategy Framework" onTitleMenu={onTitleMenu} status={<Indicator type="green">Active</Indicator>} views={views}
      actions={openRecs.length ? <IFS.CooperChip onClick={() => setCooper({ kind: 'recs' })}>{`${openRecs.length} Recommendation${openRecs.length > 1 ? 's' : ''}`}</IFS.CooperChip> : undefined} />
    : draftStage ? <PageHeader title={draft.name} onBack={() => setPage('library')} onTitleMenu={onTitleMenu} status={<Indicator type={VF_STATUS[draft.status].type}>{draft.stage === 'input' ? 'Draft' : VF_STATUS[draft.status].label}</Indicator>}
      center={<Stepper current={['input', 'shape', 'review', 'approval'].indexOf(page)} steps={[{ label: 'Input' }, { label: 'Shape' }, { label: 'Review' }, { label: 'Approve' }]} />}
      actions={<div className="row" style={{ gap: 'var(--space-200)' }}><Button type="tertiary" size="s" iconLeft="users-group">1/1</Button>
        {page === 'input' && (draft.ctx < 100 ? <Tooltip content="Cooper needs full context first: answer its questions or add documents"><span><Button type="primary" size="s" disabled>Shape</Button></span></Tooltip> : <Button type="primary" size="s" onClick={() => { setDraft(d => ({ ...d, stage: 'shape' })); setPage('shape'); }}>Shape</Button>)}
        {page === 'shape' && ((draft.trace || []).some(t => t.kind === 'error' && !(draft.traceDone || {})[t.id]) ? <Tooltip content="Fix the errors in the Trace Report first"><span><Button type="primary" size="s" disabled>Review</Button></span></Tooltip> : <Button type="primary" size="s" onClick={() => { setDraft(d => ({ ...d, stage: 'review' })); setPage('review'); }}>Review</Button>)}
        {page === 'review' && (!draft.checksPassed ? <Tooltip content="Resolve the automated checks first"><span><Button type="primary" size="s" disabled>Send for approval</Button></span></Tooltip> : <Button type="primary" size="s" onClick={() => { setDraft(d => ({ ...d, stage: 'approval' })); setPage('approval'); }}>Send for approval</Button>)}
      </div>} />
    : undefined;
  const prompts = libraryPage ? ['Walk me through this framework', 'What hasn’t been updated in a while?'] : page === 'flow' ? ['Which goals are underserved?', 'Explain this framework to me']
    : page === 'overview' ? ['Compare to peer', 'Compare to best practice'] : ['review', 'approval'].includes(page) ? ['Explain me the value impact', 'Evaluate publish risk'] : ['Walk me through this framework', 'What hasn’t been updated in a while?'];
  const walk = () => setCooper({ kind: 'text', text: `I’ll walk you through your Q1 2026 Strategy Framework. Enterprise goals (${VF_GOALS.length}): your top priorities. Value framework: the foundation. Strategic objectives (${VF_OBJECTIVES.length}): how goals become direction, weighted ${VF_OBJECTIVES.map(o => `${o.short} ${o.weight}%`).join(', ')}. Value models (${VF_MODEL_ROWS.length}): the calculation engine. Measures (${VF_MEASURES.length}): what you actually track, all from the demo data.` });
  return (
    <AppShell navBar={navBar} header={header}
      // rule 7.23: the stage's side nav, open by default; inside a draft framework (thin header + stepper) there is none
      sideNav={draftStage ? undefined : <IFS.SideNav title="Value" items={nav} value={navValue} onSelect={id => id !== 'human' && setPage(id)} />}
      // rule 7.22: base Cooper bar on the libraries (PageTop); the documents bar inside a framework; an active framework is read-only (no upload)
      bottom={libraryPage ? <BottomSheet prompts={prompts} onPrompt={p => /^Walk me through/.test(p) ? walk() : toast({ title: `Cooper: ${p}` })} />
        : <BottomSheet type="documents" documents={{ label: `${draftStage ? (draft.docs || 0) : 16} Documents` }} onUpload={activeHeader ? undefined : () => draftStage && page === 'input' ? setDraft(d => vfAddInput(d, 'doc')) : toast({ title: 'Upload' })}
        prompts={prompts} onPrompt={p => /^Walk me through/.test(p) ? walk() : toast({ title: `Cooper: ${p}` })} />}>
      {libraryPage && <VfLibrary page={page} setPage={setPage} draft={draft} onNew={() => { setDraft(vfNewDraft()); setPage('input'); }} />}
      {page === 'overview' && <VfOverview />}
      {page === 'map' && <><VfMap objectives={VF_OBJECTIVES} extraMeasures={recsDone.includes('carbon') ? [{ id: 'ci', name: 'Carbon Intensity', type: 'Benefit', mid: 'carbon' }] : []} selected={node && node.id} onNode={setNode} /><VfNodePanel node={node} onClose={() => setNode(null)} /></>}
      {page === 'flow' && <VfFlow />}
      {page === 'input' && <VfInput draft={draft} setDraft={setDraft} />}
      {page === 'shape' && <VfShape draft={draft} setDraft={setDraft} />}
      {page === 'review' && <VfReview draft={draft} setDraft={setDraft} />}
      {page === 'approval' && <VfApproval draft={draft} setDraft={setDraft} setPage={setPage} />}
      {page.startsWith('model-') && <VfModel id={page.slice(6)} onEdit={m => { setDraft({ ...vfNewDraft(), name: `Copy of ${m.name}`, kind: 'model', modelId: m.id, started: true, stage: 'shape', ctx: 100,
        trace: vfRecalTrace(m), traceDone: {} }); setPage('shape'); }} />}
      {cooper && <div className="rf-cooper">
        {cooper.kind === 'text' && <AgentWindow text={cooper.text} onClose={() => setCooper(null)} onAsk={() => {}} />}
        {cooper.kind === 'recs' && <AgentWindow text={`I’ve found ${openRecs.length} recommendation${openRecs.length > 1 ? 's' : ''} that could improve how investments are evaluated, prioritized, and aligned with organizational goals.`} onClose={() => setCooper(null)} onAsk={() => {}}
          tertiaryAction={{ label: 'Decline all', onClick: () => { setRecsDone(VF_RECS.map(r => r.id)); setCooper(null); } }}>
          {['Strategic objectives', 'Measures', 'Value models'].map(gr => { const items = openRecs.filter(r => r.group === gr); return items.length ? <VfRecGroup key={gr} title={gr} count={items.length}>
            {items.map(r => <VfRecItem key={r.id} title={r.title} description={r.description} impact={r.impact} action={{ label: 'Explore', onClick: () => setCooper({ kind: 'detail', id: r.id }) }} />)}</VfRecGroup> : null; })}
        </AgentWindow>}
        {cooper.kind === 'detail' && (() => { const r = VF_RECS.find(x => x.id === cooper.id); return <AgentWindow onClose={() => setCooper(null)} onAsk={() => {}}>
          <VfRecDetail title={r.title} description={r.description} impact={r.impact} onBack={() => setCooper({ kind: 'recs' })}
            onDecline={() => { setRecsDone(d => [...d, r.id]); setCooper(openRecs.length > 1 ? { kind: 'recs' } : null); }}
            onApply={() => { setRecsDone(d => [...d, r.id]); toast({ title: `${r.title}: done`, description: r.id === 'carbon' ? 'Carbon Intensity is on the map under Carbon footprint v4' : r.id === 'inputs' ? 'A draft of WDRM v4 opens in Value Models' : 'Added to the framework draft' });
              if (r.id === 'carbon') setPage('map'); if (r.id === 'inputs') setPage('model-wdrm'); setCooper(openRecs.length > 1 ? { kind: 'recs' } : null); }} />
        </AgentWindow>; })()}
      </div>}
      {activityPanel}
    </AppShell>
  );
}

/* ---------------------------------------------------------------- Library (Strategy Frameworks, Value Frameworks, Value Models) */
function VfLibrary({ page, setPage, draft, onNew }) {
  const [tab, setTab] = useState('all');
  if (page === 'library-models') {
    const rows = VF_MODEL_ROWS;
    return <div className="page">
      <PageTop title="Value Models" description="Published, archived, draft and individual value models" actions={<Button type="secondary" size="m" iconLeft="system-pencil-plus" onClick={() => toast({ title: 'Create Value Model isn’t part of this flow', description: 'Recalibrate an active model instead' })}>New</Button>}
        tabs={{ items: [{ value: 'all', label: 'All', count: rows.length }, { value: 'active', label: 'Active', count: rows.filter(r => r.status === 'active').length }, { value: 'pending', label: 'Pending Approval', count: rows.filter(r => r.status === 'pending').length }], value: tab, onChange: setTab }}
        search={{ placeholder: 'Ask anything about value models' }} />
      <VfTable rowProps={r => ({ 'data-vm': r.id })} onRowClick={r => setPage(`model-${r.id}`)} rows={rows.filter(r => tab === 'all' || r.status === tab)} defaultSort={{ key: 'investments', dir: 'desc' }} columns={[
        { key: 'name', title: 'Value model', width: '1.6fr', primary: true }, { key: 'status', title: 'Status', width: '1fr', render: r => <Indicator type={VF_STATUS[r.status].type}>{VF_STATUS[r.status].label}</Indicator> },
        { key: 'modified', title: 'Last modified', width: '1fr', sortable: true, sortValue: r => r.modified, render: r => ideaDay(r.modified) }, { key: 'version', title: 'Version', width: 'var(--table-col-number-min)', render: r => `Version ${r.version}` },
        { key: 'investments', title: 'Investments', type: 'number', width: 'var(--table-col-number-min)', sortable: true }]} />
    </div>;
  }
  if (page === 'library-vf') {
    const rows = [{ id: 'v12', name: 'Value Framework v12', status: 'active', models: VF_MODEL_ROWS.length, measures: VF_MEASURES.length, modified: '2026-01-15' },
      { id: 'v13', name: 'Value Framework v13', status: 'pending', models: VF_MODEL_ROWS.length, measures: VF_MEASURES.length + 1, modified: '2026-01-10' }, { id: 'v11', name: 'Value Framework v11', status: 'archived', models: 6, measures: 39, modified: '2025-04-18' }];
    return <div className="page">
      <PageTop title="Value Frameworks" description="Published, archived and draft value frameworks" actions={<Button type="secondary" size="m" iconLeft="system-pencil-plus" onClick={() => toast({ title: 'Create Value Framework isn’t part of this flow' })}>New</Button>} search={{ placeholder: 'Ask anything about value frameworks' }} />
      <VfTable onRowClick={r => r.status === 'active' ? setPage('map') : toast({ title: r.name, description: 'Only the active value framework opens in this flow' })} rows={rows} columns={[
        { key: 'name', title: 'Value framework', width: '1.6fr', primary: true }, { key: 'status', title: 'Status', width: '1fr', render: r => <Indicator type={VF_STATUS[r.status].type}>{VF_STATUS[r.status].label}</Indicator> },
        { key: 'modified', title: 'Last modified', width: '1fr', render: r => ideaDay(r.modified) }, { key: 'models', title: 'Models', type: 'number' }, { key: 'measures', title: 'Value measures', type: 'number' }]} />
    </div>;
  }
  const mine = draft.started || draft.status !== 'draft' || draft.rounds ? [{ id: 'draft', name: draft.name, status: draft.status, stage: draft.status === 'draft' ? { input: 'Input', shape: 'Shape', review: 'Review', approval: 'Approve' }[draft.stage] : null,
    approvals: draft.status === 'pending' ? [draft.approvers.filter(a => a.status === 'success').length, draft.approvers.length] : draft.status === 'revisions' ? [0, 1] : null, modified: STORY_DAY, by: 'IC', scheduled: draft.scheduled }] : [];
  const rows = [...mine, ...VF_FRAMEWORKS.filter(f => !(mine.length && f.status === 'pending' && false))];
  const count = s => rows.filter(r => r.status === s).length;
  return <div className="page">
    <PageTop title="Strategy Framework" description="Published, archived, and draft strategy frameworks" actions={<Button type="secondary" size="m" iconLeft="system-pencil-plus" onClick={onNew}>New</Button>}
      tabs={{ items: [{ value: 'all', label: 'All', count: rows.length }, { value: 'active', label: 'Active', count: count('active') }, { value: 'pending', label: 'Pending Approval', count: count('pending') }, { value: 'archived', label: 'Archived', count: count('archived') }, { value: 'draft', label: 'Draft', count: count('draft') }], value: tab, onChange: setTab }}
      search={{ placeholder: 'Ask anything about strategy frameworks' }} />
    <VfTable rowProps={r => ({ 'data-fw': r.id })} rows={rows.filter(r => tab === 'all' || r.status === tab)}
      onRowClick={r => r.id === 'draft' ? setPage(r.status === 'draft' ? draft.stage : r.status === 'revisions' ? 'shape' : 'approval') : r.status === 'active' ? setPage('overview') : toast({ title: r.name, description: 'Only the active framework and your draft open in this flow' })}
      columns={[{ key: 'name', title: 'Strategy framework', width: '2fr', primary: true },
        { key: 'status', title: 'Status', width: '1.2fr', render: r => <span className="row" style={{ gap: 'var(--space-150)' }}><Indicator type={VF_STATUS[r.status].type}>{VF_STATUS[r.status].label}</Indicator>
          {r.approvals && <IFS.Counter>{`${r.approvals[0]}/${r.approvals[1]}`}</IFS.Counter>}{r.stage && <Badge size="s" color="white">{r.stage}</Badge>}{r.scheduled && <span className="t-body-m-regular muted">{r.scheduled}</span>}</span> },
        { key: 'modified', title: 'Last modified', width: '1fr', sortable: true, sortValue: r => r.modified, render: r => ideaDay(r.modified) },
        { key: 'by', title: 'Created by', width: '1fr', render: r => <span className="row" style={{ gap: 'var(--space-200)' }}><Avatar size="s" initials={r.by} type={(PEOPLE[r.by] || {}).type} /><span>{(PEOPLE[r.by] || {}).name}</span></span> }]} />
  </div>;
}

/* ---------------------------------------------------------------- Active framework · Overview (Figma 2029:7675) */
function VfOverview() {
  const [mix, setMix] = useState('weight'), [split, setSplit] = useState('budget');   // Figma header toggles: By weight | By budget · By budget | By investment
  const cap = vfCapitalBy(), bcr = bcrOf(VF_TOTAL_VALUE, VF_TOTAL_CAPITAL), scored = PLAN_INVESTMENTS.filter(i => i.value > 0).length / PLAN_INVESTMENTS.length;
  const peer = { reliability: 35, financial: 25, environment: 16, social: 8, governance: 16 }, best = { reliability: 38, financial: 28, environment: 19, social: 4, governance: 11 };   // [Added] Figma peer figures
  const bar = (label, w) => <div key={label} className="row" style={{ gap: 'var(--space-300)' }}><span className="t-body-m-regular sec" style={{ width: 'var(--proto-detail-nav-w)' }}>{label}</span>
    <div className="row" style={{ gap: 'var(--space-50)', flex: 1 }}>{VF_OBJECTIVES.map(o => <BarChartItem key={o.id} fill={`var(--data-viz-data-${o.color})`} style={{ flex: w[o.id] }} title={`${o.short} ${w[o.id]}%`}>{`${Math.round(w[o.id])}%`}</BarChartItem>)}</div></div>;
  const capShare = Object.fromEntries(VF_OBJECTIVES.map(o => [o.id, cap[o.id] / VF_TOTAL_CAPITAL * 100]));
  // [Assumed] what the 100% columns split each objective by: investment size (capital bands), as a share of its budget or of its investments
  const BANDS = [{ key: 's', label: 'Under $10M', max: 1e7 }, { key: 'm', label: '$10M–$50M', max: 5e7 }, { key: 'l', label: '$50M and over', max: Infinity }];
  const band = i => BANDS.find(b => i.capex < b.max).key;
  const breakdown = VF_OBJECTIVES.map(o => { const t = { s: 0, m: 0, l: 0 };
    PLAN_INVESTMENTS.forEach(i => { const sh = vfProfile(i)[o.id] || 0; t[band(i)] += split === 'budget' ? i.capex * sh : sh; });
    const sum = t.s + t.m + t.l || 1; return { label: o.short, s: t.s / sum * 100, m: t.m / sum * 100, l: t.l / sum * 100 }; });
  const byType = Object.entries(VF_MEASURES.reduce((t, m) => ({ ...t, [m.type]: (t[m.type] || 0) + 1 }), {})).map(([label, value]) => ({ label, value }));
  const top = [...PLAN_INVESTMENTS].sort((a, b) => b.capex - a.capex).slice(0, 8);
  return <div className="page">
    <div className="ifs-grid">{[['Portfolio Benefit-Cost Ratio', bcr ?? '—', 'value per $1M ÷ 2,000'], ['Total capital', fmtMoney(VF_TOTAL_CAPITAL), `${PLAN_INVESTMENTS.length} investments`], ['Risk coverage', `${Math.round(scored * 100)}%`, 'of investments scored'], ['Industry position', '62nd', 'percentile among peer utilities 31 / 50']]
      .map(([t, v, d]) => <div key={t} className="ifs-span-3"><VfStat size="m" title={t} value={String(v)} description={d} badge={t === 'Industry position' ? { size: 's', color: 'white', children: '2nd Quartile' } : undefined} /></div>)}</div>
    <DataVizCard title="Portfolio Under This Framework" header={{ segments: [{ value: 'weight', label: 'By weight' }, { value: 'budget', label: 'By budget' }], segmentValue: mix, onSegmentChange: setMix }}><div className="col" style={{ gap: 'var(--space-stack)', width: '100%' }}>{bar(COMPANY.name, mix === 'weight' ? VF_WEIGHTS : capShare)}{bar('Peer avg', peer)}{bar('Best in class', best)}
      <div className="row" style={{ gap: 'var(--space-400)', flexWrap: 'wrap' }}>{VF_OBJECTIVES.map(o => <LegendSwatch key={o.id} label={o.short} color={`var(--data-viz-data-${o.color})`} />)}</div></div></DataVizCard>
    <div className="ifs-grid">
      <div className="ifs-span-8"><DataVizCard title="Strategic Objectives Breakdown" header={{ segments: [{ value: 'budget', label: 'By budget' }, { value: 'investment', label: 'By investment' }], segmentValue: split, onSegmentChange: setSplit }}><div style={{ width: '100%' }}><IFS.StackedColumnChart data={breakdown} series={BANDS.map(b => ({ key: b.key, label: b.label }))} format={v => `${Math.round(v)}%`} onEditWithCooper={false} /></div></DataVizCard></div>
      <div className="ifs-span-4"><DataVizCard title="Framework Coverage by Measure Type"><div style={{ width: '100%' }}><IFS.DonutChart onEditWithCooper={false} data={byType} valueLabel="Measures" centerValue={String(VF_MEASURES.length)} centerLabel="measures" /></div></DataVizCard></div>
    </div>
    <DataVizCard title="Investments by Strategic Objective"><div className="col" style={{ gap: 'var(--space-200)', width: '100%' }}>{top.map(i => { const p = vfProfile(i); return <div key={i.id} className="row" style={{ gap: 'var(--space-300)' }}>
      <span className="t-body-m-regular plan-ellipsis" style={{ width: 'var(--proto-plan-side-w)' }}>{i.name}</span>
      <div className="row" style={{ gap: 'var(--space-50)', flex: 1 }}>{VF_OBJECTIVES.map(o => <BarChartItem key={o.id} fill={`var(--data-viz-data-${o.color})`} number={p[o.id] > 0.12} style={{ flex: p[o.id] }} title={`${o.short} ${Math.round(p[o.id] * 100)}%`}>{`${Math.round(p[o.id] * 100)}%`}</BarChartItem>)}</div>
      <span className="t-label-m-medium t-numeric">{fmtMoney(i.capex)}</span></div>; })}</div></DataVizCard>
  </div>;
}

/* ---------------------------------------------------------------- Active framework · Capital Flow (Figma 2011:150042) */
function VfFlow() {
  const cap = vfCapitalBy(), B = v => fmtMoney(v);
  const nodes = [{ id: 'goals', column: 'g', label: `${VF_GOALS.length} Goals`, type: 'source' }, { id: 'fw', column: 'f', label: `Q1 2026 Value Framework ${B(VF_TOTAL_CAPITAL)}` },
    ...VF_OBJECTIVES.map(o => ({ id: o.id, column: 'o', label: `${o.short} ${B(cap[o.id])}` })),
    ...VF_MODEL_ROWS.map(m => ({ id: m.id, column: 'm', label: m.name })),
    ...VF_MODEL_ROWS.map(m => ({ id: `ms-${m.id}`, column: 'x', label: m.measures[0] ? m.measures[0].name : m.name, type: 'measure' }))];
  const perModel = m => { const sibs = VF_MODEL_ROWS.filter(x => x.objective === m.objective); return cap[m.objective] / sibs.length; };
  const links = [{ source: 'goals', target: 'fw', value: VF_TOTAL_CAPITAL }, ...VF_OBJECTIVES.map(o => ({ source: 'fw', target: o.id, value: cap[o.id] })),
    ...VF_MODEL_ROWS.map(m => ({ source: m.objective, target: m.id, value: perModel(m) })), ...VF_MODEL_ROWS.map(m => ({ source: m.id, target: `ms-${m.id}`, value: perModel(m) }))];
  return <div className="page">
    <div className="ifs-grid">{[['Industry position', '62nd'], ['Risk coverage', `${Math.round(PLAN_INVESTMENTS.filter(i => i.value > 0).length / PLAN_INVESTMENTS.length * 100)}%`], ['Total capital', B(VF_TOTAL_CAPITAL)], ['Portfolio Benefit-Cost Ratio', String(bcrOf(VF_TOTAL_VALUE, VF_TOTAL_CAPITAL) ?? '—')]]
      .map(([t, v]) => <div key={t} className="ifs-span-3"><VfStat size="m" title={t} value={v} description="Q1 2026" /></div>)}</div>
    <ContentCard bottom={<div style={{ width: '100%' }}><VfSankey columns={[{ id: 'g', label: 'Goals' }, { id: 'f', label: 'Value framework' }, { id: 'o', label: 'Strategic objectives' }, { id: 'm', label: 'Models' }, { id: 'x', label: 'Measure output' }]}
      nodes={nodes} links={links} onNodeClick={n => toast({ title: n.label })} /></div>} />
  </div>;
}

/* ---------------------------------------------------------------- Create: chooser + Start from Enterprise Goals (Input) */
function vfAddInput(d, kind, text) {
  const gain = { text: 40, doc: 30, answer: 30 }[kind];
  const k = (d.inputs || []).length;
  const input = { id: `i${k}`, kind, title: kind === 'doc' ? ['2026 Board planning.pdf', 'Alder Ridge strategy memo.docx', 'Regulatory outlook.pptx'][k % 3] : (text || 'Message').split(' ').slice(0, 3).join(' '), caption: kind === 'doc' ? 'Document' : 'Message' };
  const goals = VF_GOALS.slice(0, Math.min(VF_GOALS.length, (d.goals || 0) + (kind === 'answer' ? 1 : 2)));
  return { ...d, inputs: [...(d.inputs || []), input], goals: goals.length, ctx: Math.min(100, (d.ctx || 0) + gain), docs: (d.docs || 0) + (kind === 'doc' ? 1 : 0) };
}
const VF_PROMPTS = [{ id: 'p1', title: 'Strategic priorities', q: 'What are the top 2–3 outcomes the enterprise is driving toward this year?' }, { id: 'p2', title: 'Portfolio focus', q: 'Which areas, products, or markets are you investing in versus scaling back?' },
  { id: 'p3', title: 'Starting point', q: 'Any current baselines or targets I should anchor to?' }];
function VfInput({ draft, setDraft }) {
  const [text, setText] = useState('');
  if (!draft.started) return <div className="vf-choose">
    <h1 className="t-heading-h1-medium" style={{ margin: 0 }}>How Would You Like to Start the New Strategy Framework?</h1>
    <ContentCard title="Built by Cooper" description="Cooper has analyzed global market trends, industry shifts, and your context, then built a new Strategy Framework" onClick={() => setDraft(d => ({ ...vfNewDraft(), started: true, stage: 'shape', ctx: 100, docs: 3, goals: VF_GOALS.length, byCooper: true }))} />
    <ContentCard title="Start with Enterprise Goals" description="Upload your documents or describe your context. Cooper builds a Strategy Framework from scratch" iconRight="arrow-right" onClick={() => setDraft(d => ({ ...vfNewDraft(), started: true }))} />
    <ContentCard title="Duplicate Framework" description="Search any framework. Duplicate it and enhance the copy with new documents and context" onClick={() => toast({ title: 'Duplicate Framework isn’t part of this flow' })} />
  </div>;
  const goals = VF_GOALS.slice(0, draft.goals || 0);
  const send = t => { if (!t.trim()) return; setText(''); setDraft(d => vfAddInput(d, draft.inputs.length ? 'answer' : 'text', t)); };
  return <div className="vf-input">
    <VfColumns columns={['Input', 'Enterprise goals']} />
    <div className="vf-input__body">
      <div className="col" style={{ gap: 'var(--space-200)' }}>{draft.inputs.map(i => <VfNode key={i.id} type="measure" title={i.title} caption={i.caption} stackIcons={false} />)}
        {!draft.inputs.length && <span className="t-body-m-regular muted">Speak, type or upload what Cooper should know.</span>}</div>
      <div className="col" style={{ gap: 'var(--space-200)' }}>{goals.map(g => <VfNode key={g} type="enterprise-goal" title={g} stackIcons={false} />)}</div>
    </div>
    <div className="rf-cooper"><AgentWindow title="Create Enterprise Goals" text={draft.inputs.length ? `I added ${goals.length} enterprise goal${goals.length === 1 ? '' : 's'} from what you told me. To make these goals accurate, answer one of these — you don’t have to answer all three.` : 'Tell me about the organisation’s goals for the next cycle: speak, type, or drop in documents.'} onClose={() => {}} onAsk={() => {}}>
      {draft.inputs.length > 0 && draft.ctx < 100 && <div className="col" style={{ gap: 'var(--space-200)' }}>{VF_PROMPTS.filter(p => !(draft.answered || []).includes(p.id)).map(p => <ContentCard key={p.id} size="s" title={p.title} description={p.q}
        onClick={() => setDraft(d => ({ ...vfAddInput(d, 'answer', p.title), answered: [...(d.answered || []), p.id] }))} />)}</div>}
      {draft.ctx >= 100 && <span className="t-label-m-medium">Cooper has enough context. Move to Shape when you’re ready.</span>}
    </AgentWindow></div>
    <div className="vf-composer"><NDS label="Cooper's context progress (Ready badge not in DocumentsContext)" className="row" style={{ gap: 'var(--space-200)' }}>
      {draft.ctx >= 100 ? <Indicator type="green">Ready</Indicator> : <><ProgressBar value={draft.ctx} label="Cooper’s context" /><span className="t-numeric">{draft.ctx}%</span></>}</NDS>
      <IFS.ChatCollapsedBar type="text" value={text} onChange={v => setText(v && v.target ? v.target.value : v)} onSend={() => send(text || 'Grow reliably while keeping bills affordable and cutting wildfire risk')} /></div>
  </div>;
}
// J14: recalibrating an active model makes a draft copy; Shape shows what the change does [Figma copy]
const vfRecalTrace = m => [
  { id: 'recalc', kind: 'note', title: 'Existing investments will be recalculated', description: `${m.investments} investments scored by ${m.name} are re-scored when this version publishes.`, okay: true },
  { id: 'inputs', kind: 'warning', title: 'Failure curves updated from observed outcomes', description: 'Cooper refreshed the probability-of-failure inputs where observed failures diverged from predictions.', okay: true },
];
const vfNewDraft = () => ({ name: 'Q1 2027 Strategy Framework', status: 'draft', stage: 'input', inputs: [], goals: 0, ctx: 0, docs: 0, objectives: VF_OBJECTIVES.map(o => ({ ...o })), trace: [], traceDone: {},
  checksPassed: false, approvers: VF_APPROVERS.map(a => ({ ...a, status: 'empty', note: null })), rounds: 0 });

/* ---------------------------------------------------------------- Shape: add objectives, trace report, rebalance (Figma 2841:29115) */
function VfShape({ draft, setDraft }) {
  const [picker, setPicker] = useState(true), [node, setNode] = useState(null);
  const issues = draft.trace || [];
  const c = IFS.useIssueReport({ issues: useMemo(() => issues, [issues.length]), kinds: IFS.TRACE_KINDS,
    onResolvedAll: () => {} });
  // apply the chosen solution: Rebalance rescales every weight to 100%
  useEffect(() => { const st = c.status || {}; const b = st.balance;
    if (b && b.applied && !(draft.traceDone || {}).balance) setDraft(d => ({ ...d, traceDone: { ...d.traceDone, balance: b.applied },
      objectives: b.applied === 'none' ? d.objectives : vfRebalance(d.objectives.map(o => o.weight == null ? { ...o, weight: Math.round(100 / d.objectives.length) } : o)) })); });
  const add = id => {
    const o = VF_OBJECTIVE_LIBRARY.find(x => x.id === id); if (!o || draft.objectives.some(x => x.id === id)) return;
    setDraft(d => ({ ...d, objectives: [...d.objectives, { id: o.id, name: o.name, short: o.name.split(' ')[0], weight: Math.round(100 / (d.objectives.length + 1)), color: 1 }], trace: vfTraceIssues(o.name), traceDone: {} }));
  };
  const drop = e => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
    if (x < 0.36 || x > 0.62) { toast({ title: 'This item can’t be added here', description: 'Strategic objectives must be added under Strategic Objectives so their measures can be scored correctly.' }); return; } add(id); };
  const total = draft.objectives.reduce((t, o) => t + (o.weight || 0), 0);
  return <>
    {draft.byCooper && !draft.seenIntro && <div className="rf-cooper"><AgentWindow text="I’ve analyzed global market trends, industry shifts, your existing documents, and strategic context and built a complete new Strategy Framework for you. Drop your documents onto the map anytime and I’ll work them in."
      onClose={() => setDraft(d => ({ ...d, seenIntro: true }))} onAsk={() => {}} secondaryAction={{ label: 'Start walkthrough', onClick: () => setDraft(d => ({ ...d, seenIntro: true })) }} /></div>}
    <div className="vf-drop" onDragOver={e => e.preventDefault()} onDrop={drop}>
      <VfMap objectives={draft.objectives} selected={node && node.id} onNode={setNode} />
    </div>
    <NDS label="Weights total (no weight control in Figma)" className="vf-total row"><span className="t-body-m-regular sec">Objective weights</span><span className={`t-label-m-medium t-numeric ${Math.round(total) > 100 ? 'plan-down' : ''}`}>{`${Math.round(total * 10) / 10}%`}</span></NDS>
    {picker && draft.kind !== 'model' && <div className="vf-picker"><Panel title="Strategic Objectives" actions={<PanelClose onClose={() => setPicker(false)} />} className="proto-fill">
      <div className="col" style={{ gap: 'var(--space-200)' }}><IFS.SmartSearch placeholder="Ask anything about strategic objectives" />
        {VF_OBJECTIVE_LIBRARY.filter(o => !draft.objectives.some(x => x.id === o.id)).map(o => <div key={o.id} className="row" style={{ gap: 'var(--space-200)' }}>
          <div style={{ flex: 1, minWidth: 0 }}><VfPick title={o.name} description={o.text} dragData={o.id} /></div>
          <IconButton icon="system-plus" type="tertiary" size="s" label={`Add ${o.name}`} onClick={() => add(o.id)} /></div>)}</div>
    </Panel></div>}
    {issues.length > 0 && Object.keys(draft.traceDone || {}).length < 1 && <div className="vf-trace"><IFS.TraceReport controller={c} type="drawer" title={draft.kind === 'model' ? 'Recalibration' : 'Trace Report'} onUndo={draft.kind === 'model' ? undefined : () => setDraft(d => ({ ...d, objectives: d.objectives.slice(0, -1), trace: [], traceDone: {} }))} /></div>}
    <VfNodePanel node={node} onClose={() => setNode(null)} />
  </>;
}

/* ---------------------------------------------------------------- Review: portfolio impact + automated checks (Figma 2846:134531) */
function VfReview({ draft, setDraft }) {
  const w = Object.fromEntries(draft.objectives.map(o => [o.id, o.weight || 0]));
  const proposed = { ...VF_PROPOSED, ...Object.fromEntries(Object.entries(w).filter(([k]) => !(k in VF_WEIGHTS))) };
  const imp = useMemo(() => vfImpact(proposed), [JSON.stringify(proposed)]);
  // checks remember what was resolved (draft.checkStatus), so a trip back to Shape after a rejection doesn't reset them
  const c = IFS.useIssueReport({ issues: useMemo(() => vfChecks().map(i => (draft.checkStatus || {})[i.id] ? { ...i, status: draft.checkStatus[i.id] } : i), []), kinds: IFS.TRACE_KINDS, gates: VF_CHECK_GATES });
  useEffect(() => { const ok = ['overweight', 'orphan'].every(id => c.status && c.status[id] && (c.status[id].applied || c.status[id].answer));
    if (ok !== !!draft.checksPassed || JSON.stringify(c.status || {}) !== JSON.stringify(draft.checkStatus || {})) setDraft(d => ({ ...d, checksPassed: ok, checkStatus: c.status || {} })); });
  const pctCh = (imp.after - imp.before) / imp.before;
  const sorted = [...imp.rows].sort((a, b) => b.change - a.change);
  const rows = [...sorted.slice(0, 3).map(r => ({ ...r, grp: 'Biggest gainers' })), ...sorted.slice(-3).reverse().map(r => ({ ...r, grp: 'Lost the most value' })), ...imp.rows.filter(r => Math.abs(r.change) < 0.01).map(r => ({ ...r, grp: 'Unchanged' }))];
  const relUp = Math.round((proposed.reliability / VF_WEIGHTS.reliability - 1) * 100), socDown = Math.round((1 - proposed.social / VF_WEIGHTS.social) * 100);
  return <div className="page-row"><div className="page">
    <RfTitle title="Executive Summary" text={`Applying this change increases Reliability influence by ${relUp}%, decreases Safety influence by ${socDown}%, and changes the value of ${imp.gained + imp.lost} investments. ${imp.tierIn || imp.tierOut ? `${imp.tierIn} investments move into the funding tier; ${imp.tierOut} drop out of it.` : 'No investment moves across the funding line.'}`} />
    <div className="ifs-grid">{[['Portfolio value', `${(imp.before / 1e6).toFixed(1)}M → ${(imp.after / 1e6).toFixed(1)}M`, `${pctCh >= 0 ? '▲' : '▼'} ${Math.abs(Math.round(pctCh * 1000) / 10)}%`],
      ['Investments re-scored', String(imp.rows.length), `${imp.gained} gained · ${imp.lost} lost · ${imp.unchanged} unchanged`], ['Funding tier changes', String(imp.tierIn + imp.tierOut), `${imp.tierIn} gained · ${imp.tierOut} lost`],
      ['Governance flags', String(imp.executing), 'executing investment affected']].map(([t, v, d]) => <div key={t} className="ifs-span-3"><VfStat title={t} value={v} description={d} /></div>)}</div>
    <RfTabs value="impact" onChange={v => v !== 'impact' && toast({ title: 'Strategic Alignment isn’t part of this flow' })} items={[{ value: 'impact', label: 'Portfolio Impact' }, { value: 'align', label: 'Strategic Alignment' }]} />
    <DataVizCard title="Investment Value Impact"><div className="col" style={{ gap: 'var(--space-stack)', width: '100%' }}>
      <span className="t-body-m-regular sec">{`Re-scored ${imp.rows.length} · net value change ${pctCh >= 0 ? '+' : ''}${Math.round(pctCh * 1000) / 10}% · materially impacted ${imp.material}. Value change is measured as % of each investment’s value under the proposed framework vs. current.`}</span>
      <ColumnChart data={imp.buckets} valueLabel="Investments" /></div></DataVizCard>
    <ContentCard bottom={<div style={{ width: '100%' }}><VfTable groupBy="grp" defaultCollapsed={['Unchanged']} rows={rows} columns={[
      { key: 'name', title: 'Investment', width: '2fr', primary: true }, { key: 'type', title: 'Type', width: '1fr', render: r => <Badge size="s" color="white">{VF_TYPE_LABEL[r.type]}</Badge> },
      { key: 'after', title: 'Total value', type: 'number', width: '1.2fr', render: r => `${fmtValue(r.before)} → ${fmtValue(r.after)}` },
      { key: 'change', title: 'Value change', type: 'number', width: '1fr', render: r => <span className={r.change >= 0 ? 'plan-up' : 'plan-down'}>{`${r.change >= 0 ? '▲ +' : '▼ '}${Math.round(r.change * 1000) / 10}%`}</span> },
      { key: 'ratio', title: 'Value / cost ratio', type: 'number', width: '1fr', render: r => `${(r.before / (r.capex / 1e6)).toFixed(0)} → ${(r.after / (r.capex / 1e6)).toFixed(0)}` }]} /></div>} />
  </div>
  <div className="page-dock" style={{ height: 'calc(100vh - var(--proto-sticky-offset))' }}><Panel title="Automated Checks" className="ifs-trc-panel" style={{ height: '100%' }}>
    <ContentCard className="ifs-trc-card" title={<VfGates controller={c} label="Checks" />} bottom={<div className="ifs-trc-card__issues has-kinds"><div className="ifs-trc-card__kinds"><VfKinds controller={c} /></div><VfNavigator controller={c} /></div>} />
  </Panel></div></div>;
}

/* ---------------------------------------------------------------- Send for approval → rejected → approved → schedule (Figma 2838:96751) */
function VfApproval({ draft, setDraft, setPage }) {
  const sent = draft.status !== 'draft' || draft.approvers.some(a => a.status !== 'empty');
  // [Assumed] approvers answer a few seconds after Send: on the first round Luca Ferri asks for revisions; on the next round everyone approves
  useEffect(() => {
    if (draft.status !== 'pending') return;
    const t = setTimeout(() => setDraft(d => {
      if (d.status !== 'pending') return d;
      const first = d.rounds <= 1;
      const approvers = d.approvers.map(a => first ? (a.id === 'LF' ? { ...a, status: 'rejected', comment: 'Resilience model inputs look complete; flagging it’s not yet peer-reviewed.' } : a.id === 'RB' ? { ...a, status: 'success' } : a) : { ...a, status: 'success', comment: a.comment && a.status === 'rejected' ? 'Peer review attached. Approved.' : a.comment });
      return { ...d, approvers, status: first ? 'revisions' : 'ready' };
    }), 3000);
    return () => clearTimeout(t);
  }, [draft.status, draft.rounds]);
  const send = () => { setDraft(d => ({ ...d, status: 'pending', rounds: d.rounds + 1, approvers: d.approvers.map(a => a.status === 'success' && d.rounds ? a : { ...a, status: 'awaiting', lastNotified: 'Nov 17, 2026' }) }));
    toast({ title: 'Sent for approval', description: 'The approvers are notified' }); };
  const approvers = draft.approvers.map(a => a.status === 'rejected' ? { ...a, action: { label: 'Shape', icon: 'flag', onClick: () => { setDraft(d => ({ ...d, stage: 'shape', status: 'draft' })); setPage('shape'); } } } : a);
  return <div className="page">
    <RfTitle title="Send for Approval" text={`These approvers were added earlier in the framework setup. Notify them or send ${draft.name} for approval — required approvers must respond before it can publish.`}
      right={draft.status === 'ready' ? <Menu label="Publish" trigger={<Button type="primary" size="m" iconRight="arrow-caret-down-filled">Publish</Button>} items={[
        { label: 'Publish now', description: 'Apply this framework immediately.', onClick: () => { setDraft(d => ({ ...d, status: 'active', published: true })); toast({ title: `${draft.name} published`, description: 'Investments are re-scored against it' }); } },
        { label: 'Schedule', description: 'Pick a date and time to publish automatically.', onClick: () => { setDraft(d => ({ ...d, status: 'scheduled', scheduled: 'Jan 1, 2027, 9:30 AM' })); toast({ title: 'Publication scheduled', description: 'Jan 1, 2027 · 9:30 AM, the start of the 2027 cycle' }); } }]} />
        : draft.status === 'scheduled' ? <Badge size="s" color="white">{`Scheduled · ${draft.scheduled}`}</Badge>
        : (draft.status === 'pending' ? <Tooltip content="Waiting for the approvers to respond"><span><Button type="primary" size="m" disabled>{draft.rounds ? 'Send again' : 'Send'}</Button></span></Tooltip>
          : <Button type="primary" size="m" onClick={send}>{draft.rounds ? 'Send again' : 'Send'}</Button>)} />
    {draft.status === 'revisions' && <IFS.Alert type="warning" title="Revisions required">Luca Ferri asked for changes. Open Shape from his row, fix it and send again.</IFS.Alert>}
    <ContentCard bottom={<div style={{ width: '100%' }}><VfApprovals approvers={approvers} currentUserId="IC" ownerId="IC" view={sent ? 'full' : 'compact'}
      onChange={a => setDraft(d => ({ ...d, approvers: a }))} onNoteChange={(a, note) => setDraft(d => ({ ...d, approvers: d.approvers.map(x => x.id === a.id ? { ...x, note } : x) }))} /></div>} />
  </div>;
}

/* ---------------------------------------------------------------- Value Models · model detail (J14, Figma 2456:11636) */
function VfModel({ id, onEdit }) {
  const m = VF_MODEL_ROWS.find(x => x.id === id) || VF_MODEL_ROWS[0];
  const inputs = ['Probability of failure', 'Consequence of failure', 'Weather adjustment factor', 'Currency to value units'];
  return <div className="page">
    <RfTitle title={m.name} text={`${VF_STATUS[m.status].label} · Version ${m.version} · ${m.investments} investments · scores ${m.measures.length} measure${m.measures.length === 1 ? '' : 's'}`}
      right={<Button type="secondary" size="m" iconLeft="system-edit-rename" onClick={() => onEdit(m)}>Edit</Button>} />
    <div className="ifs-grid">
      <div className="ifs-span-8"><ContentCard bottom={<div className="vf-model-flow">
        <div className="col" style={{ gap: 'var(--space-200)' }}><span className="t-label-m-medium sec">Input</span>{inputs.map(x => <VfNode key={x} type="value-model" title={x} stackIcons={false} />)}</div>
        <div className="col" style={{ gap: 'var(--space-200)' }}><span className="t-label-m-medium sec">Measure calculation</span><VfNode type="strategic-objective" title="Risk consequence" stackIcons={false} /><VfNode type="strategic-objective" title="Risk likelihood" stackIcons={false} /></div>
        <div className="col" style={{ gap: 'var(--space-200)' }}><span className="t-label-m-medium sec">Output</span>{m.measures.slice(0, 4).map(x => <VfNode key={x.id} type="measure" title={x.name} caption={x.type} stackIcons={false} />)}</div>
      </div>} /></div>
      <div className="ifs-span-4"><RfCard title="Measure Calculation"><div className="col" style={{ gap: 'var(--space-stack)' }}>
        <NDS label="Formula tokens" className="rf-formula col" style={{ alignItems: 'flex-start', padding: 'var(--space-200) var(--space-300)' }}>
          <span className="t-code-m-regular">Risk = Risk consequence × Risk likelihood</span>
          <span className="t-code-m-regular">Risk likelihood = Probability of failure × Weather adjustment factor</span>
          <span className="t-code-m-regular muted">Risk value = Baseline − Outcome</span></NDS>
        <span className="t-body-m-regular sec">This measure is converted to value units by applying a 1:1000 ratio.</span>
      </div></RfCard></div>
    </div>
  </div>;
}
