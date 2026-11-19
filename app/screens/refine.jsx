/* Build › Refine — J08 (alternatives, cost & schedule, dependencies, comments) and J09 (value, overview, attachments).
   Figma Build handover: compare 48:59236, comments 55:52663, alternative details 53:201387, cost table 76:8792, Gantt 96:80712,
   dependencies 43:303888, value 48:146320, overview 58:31703, system confidence 43:229806, attachments 53:230306.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
const { SideNav: RfSideNav, CommentsPanel: RfCommentsPanel, CommentCallout: RfCommentCallout, StatCardsRow: RfStats, TimelineChart: RfTimeline,
  Checkbox: RfCheckbox, Popover: RfPopover, Tabs: RfTabs, Table: RfTable, ConfidenceGates: RfGates, IssueKindSwitch: RfKinds, IssueNavigator: RfNavigator,
  RecommendationGroup: RfRecGroup, RecommendationItem: RfRecItem, RecommendationDetail: RfRecDetail } = IFS;

// A Refine card: the Build card header (H4 title + actions + Cooper icon), as on Shape
const RfCard = ({ title, actions, children, className }) => (
  <ContentCard className={className} top={<div className="row" style={{ width: '100%', justifyContent: 'space-between', gap: 'var(--space-200)' }}>
    <span className="t-heading-h4-semibold">{title}</span>
    <div className="row" style={{ gap: 'var(--space-100)' }}>{actions}<IconButton icon="cooper-system-icon" type="tertiary" shape="circle" size="s" label={`Ask Cooper about ${title}`} onClick={() => toast({ title: `Cooper: ${title}` })} /></div>
  </div>} bottom={<div style={{ width: '100%' }}>{children}</div>} />
);
const RfTitle = ({ title, text, right }) => (
  <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--space-300)', alignItems: 'flex-end' }}>
    <div className="col" style={{ gap: 'var(--space-100)' }}><span className="t-heading-h2-medium">{title}</span><span className="t-body-m-regular sec">{text}</span></div>
    {right && <div className="row" style={{ gap: 'var(--space-200)' }}>{right}</div>}
  </div>
);

function Refine({ navBar, page, setPage, refine, setRefine, onBack, onSendForApproval }) {
  const recId = refine.recommended, alts = RF_ALTS, rec = rfAlt(recId);
  const toPlan = id => refine.toPlan[id] !== false, compared = id => refine.compare[id] !== false;
  const c = IFS.useIssueReport({ issues: useMemo(() => refineIssues(), []), gates: RF_GATES });
  const [side, setSide] = useState('confidence');        // right panel: confidence | comments | null
  const [thread, setThread] = useState(null);           // open comment thread id
  const [cooper, setCooper] = useState(null);           // Cooper window: { kind: 'recs' | 'detail' | 'text', ... }
  const threads = refine.threads;
  const openCount = threads.filter(t => !t.resolved).length;
  const altPage = page.startsWith('alt-') ? { id: +page.split('-')[1], tab: page.split('-')[2] } : null;
  const wide = altPage && altPage.tab === 'cost';
  const nav = [
    { type: 'section', label: 'Investment', items: [{ id: 'overview', label: 'Overview' }, { id: 'details', label: 'Details' }, { id: 'compare', label: 'Alternative comparison' }, { id: 'value', label: 'Value' }] },
    { type: 'section', label: 'Alternatives', action: { label: 'Add alternative', onClick: () => toast({ title: 'Add alternative isn’t designed yet', description: 'Figma has no frame for it' }) },
      items: alts.filter(a => toPlan(a.id)).map(a => ({ type: 'submenu', id: `alt-${a.id}`, label: a.name, defaultOpen: altPage && altPage.id === a.id,
        items: [{ id: `alt-${a.id}-details`, label: 'Details', cooper: a.id === recId }, { id: `alt-${a.id}-cost`, label: 'Cost & Schedule' }, { id: `alt-${a.id}-value`, label: 'Value' }] })) },
    ...(alts.some(a => !toPlan(a.id)) ? [{ type: 'section', label: 'Excluded alternatives', items: alts.filter(a => !toPlan(a.id)).map(a => ({ id: `alt-${a.id}-details`, label: a.name })) }] : []),
  ];
  const resolveThread = (id, reply) => setRefine(r => ({ ...r, threads: r.threads.map(t => t.id === id ? { ...t, resolved: true, unread: false,
    comments: reply ? [...t.comments, { id: `r${Date.now()}`, name: 'Cooper', avatar: { type: 'cooper' }, time: 'Just now', text: reply }] : t.comments } : t) }));
  const shapeWithCooper = t => { setThread(null); setCooper({ kind: 'recs', thread: t }); };
  const header = <PageHeader title={RF_INV.name} id={RF_INV.code} onBack={onBack}
    status={<Indicator type={refine.status === 'approval' ? 'orange' : 'purple'}>{refine.status === 'approval' ? 'In approval' : 'Refining'}</Indicator>}
    center={<Stepper current={2} steps={[{ label: 'Shape' }, { label: 'Review' }, { label: 'Refine' }, { label: 'Approve' }]} />}
    actions={<div className="row" style={{ gap: 'var(--space-200)' }}>
      <Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      <span className="rf-comment-btn"><IconButton icon="system-comment" type={side === 'comments' ? 'secondary' : 'tertiary'} size="s" label="Comments" onClick={() => setSide(s => s === 'comments' ? 'confidence' : 'comments')} />
        {openCount > 0 && <span className="ifs-navbar__dot" aria-hidden="true" />}</span>
      <Button type="secondary" size="s" onClick={() => toast({ title: 'Dismiss is on Shape', description: 'An investment in Refine is withdrawn from Approve' })}>Dismiss</Button>
      <Button type="primary" size="s" disabled={refine.status === 'approval'} onClick={onSendForApproval}>{refine.status === 'approval' ? 'Sent for approval' : 'Send for approval'}</Button>
    </div>} />;
  const prompts = page === 'compare' || altPage?.tab === 'details' ? ['Explain gaps in confidence', 'Why this alternative?'] : wide ? ['Increase budget by 15%', 'Create new phase']
    : page === 'value' || altPage?.tab === 'value' ? ['Explain these value models', 'Explain the baseline value'] : ['Generate Annualized outcome risk by risk type chart', 'Compare to best practice'];
  return (
    <AppShell navBar={navBar} header={header}
      sideNav={<RfSideNav title="Investment" items={nav} value={page} onSelect={id => !/^alt-\d+$/.test(id) && setPage(id)} defaultCollapsed={wide} />}
      bottom={<BottomSheet type="value" documents={{ label: `${refine.docs.length} Documents`, onClick: () => setRefine(r => ({ ...r, docsOpen: !r.docsOpen })) }}
        onUpload={() => { setRefine(r => ({ ...r, docs: [...r.docs, { id: `d${r.docs.length}`, name: 'Alpine Meadows outage calendar 2028.xlsx', date: 'Nov 17, 2026' }] })); toast({ title: 'Document added', description: 'Cooper’s context now has one more source' }); }}
        prompts={prompts} onPrompt={p => { if (/^Generate Annualized/.test(p)) { setRefine(x => ({ ...x, widgets: [...new Set([...(x.widgets || []), 'risk-type'])], shared: true })); setPage('overview'); toast({ title: 'Cooper generated a widget', description: 'Annualized outcome risk by risk type' }); }
          else toast({ title: `Cooper: ${p}` }); }} />}>
      <div className="page-row">
        <div className="page">
          {page === 'compare' && <RfCompare refine={refine} setRefine={setRefine} toPlan={toPlan} compared={compared} onOpen={id => setPage(`alt-${id}-details`)}
            onEvaluate={() => setCooper({ kind: 'text', text: `I compared the ${alts.length} alternatives on cost, risk reduced and value. ${rec.name} reduces ${rfPct(rec.reduced)} of the scored risk for ${fmtMoney(rec.cost)} (BCR ${rec.bcr ?? '—'}). ${[...alts].sort((a, b) => b.reduced - a.reduced)[0].name} reduces the most risk but costs ${fmtMoney([...alts].sort((a, b) => b.reduced - a.reduced)[0].cost)}. I’d keep ${rec.name} as recommended.` })} />}
          {altPage && altPage.tab === 'details' && <RfAltDetails alt={rfAlt(altPage.id)} recId={recId} toPlan={toPlan(altPage.id)} />}
          {altPage && altPage.tab === 'cost' && <RfCost alt={rfAlt(altPage.id)} refine={refine} setRefine={setRefine} />}
          {altPage && altPage.tab === 'value' && <RfValue refine={refine} setRefine={setRefine} alt={rfAlt(altPage.id)} />}
          {page === 'details' && <RfInvDetails onCooper={t => setCooper({ kind: 'text', text: t })} />}
          {page === 'value' && <RfValue refine={refine} setRefine={setRefine} />}
          {page === 'overview' && <RfOverview refine={refine} setRefine={setRefine} />}
        </div>
        {side && <div className="page-dock" style={{ height: 'calc(100vh - var(--proto-sticky-offset))' }}>
          {side === 'comments' ? <RfCommentsPanel threads={threads} selectedId={thread} onOpen={t => setThread(t.id || t)} onResolve={t => resolveThread(t.id || t)}
              onClose={() => setSide('confidence')} currentUser={{ name: PERSONAS.owner.name }} style={{ height: '100%' }} />
            : <Panel title="System confidence" expanded={!wide && refine.panel !== false} onExpandedChange={v => setRefine(r => ({ ...r, panel: v }))} dot={c.dot || undefined}
                onEvidence={() => toast({ title: 'Evidence chain' })} className="ifs-trc-panel" style={{ height: '100%' }}>
                <ContentCard className="ifs-trc-card" title={<RfGates controller={c} label="Approval readiness" />}
                  bottom={<div className={`ifs-trc-card__issues ${c.present.length > 1 ? 'has-kinds' : ''}`}>
                    {c.present.length > 1 && <div className="ifs-trc-card__kinds"><RfKinds controller={c} /></div>}
                    <RfNavigator controller={c} />
                  </div>} />
              </Panel>}
        </div>}
      </div>
      {thread && (() => { const t = threads.find(x => x.id === thread); return t && <div className="rf-callout">
        <RfCommentCallout thread={t} currentUser={{ name: PERSONAS.owner.name, avatar: { initials: PERSONAS.owner.initials } }}
          onCommentsChange={cm => setRefine(r => ({ ...r, threads: r.threads.map(x => x.id === t.id ? { ...x, comments: cm } : x) }))}
          onResolve={() => resolveThread(t.id)} onUnresolve={() => setRefine(r => ({ ...r, threads: r.threads.map(x => x.id === t.id ? { ...x, resolved: false } : x) }))}
          onClose={() => setThread(null)} cooperSuggestion={t.type === 'action' && !t.resolved ? { label: 'Shape with Cooper', onClick: () => shapeWithCooper(t) } : undefined} />
      </div>; })()}
      {cooper && <div className="rf-cooper">
        {cooper.kind === 'text' && <AgentWindow text={cooper.text} onClose={() => setCooper(null)} onAsk={() => toast({ title: 'Cooper chat isn’t part of this step' })} />}
        {cooper.kind === 'recs' && (() => { const alt = rfAlt(cooper.thread.altId), r = rfShapeRecs(alt); return (
          <AgentWindow text={`After analyzing comment #${cooper.thread.number}, I’ve generated a set of recommended actions to address this issue.`} onClose={() => setCooper(null)} onAsk={() => {}}>
            <RfRecGroup title="Recommended" count={1}><RfRecItem title={r.recommended.title} description={r.recommended.description} impact={r.recommended.impact} defaultExpanded
              action={{ label: 'See details', onClick: () => setCooper({ ...cooper, kind: 'detail' }) }} /></RfRecGroup>
            <RfRecGroup title="Other" count={r.other.length}>{r.other.map(o => <RfRecItem key={o.id} title={o.title} description={o.description}
              action={{ label: 'See details', onClick: () => toast({ title: o.title, description: 'Only the recommended action is scripted' }) }} />)}</RfRecGroup>
          </AgentWindow>); })()}
        {cooper.kind === 'detail' && (() => { const alt = rfAlt(cooper.thread.altId), r = rfShapeRecs(alt).recommended; return (
          <AgentWindow onClose={() => setCooper(null)} onAsk={() => {}}>
            <RfRecDetail title={r.title} description={r.description} impact={r.impact} onBack={() => setCooper({ ...cooper, kind: 'recs' })} onDecline={() => setCooper(null)}
              onApply={() => { resolveThread(cooper.thread.id, `${alt.name} has been refined. Procurement starts a quarter earlier, so the replacement stage fits the outage windows. Cost and scope are unchanged.`);
                setRefine(r2 => ({ ...r2, refined: { ...r2.refined, [alt.id]: true } })); setCooper(null); toast({ title: `Comment #${cooper.thread.number} resolved`, description: `${alt.name} schedule refined` }); }} />
          </AgentWindow>); })()}
      </div>}
      {refine.docsOpen && <div className="rf-docs"><RfPopover inline title="Documents" count={refine.docs.length} search onOpenChange={o => !o && setRefine(r => ({ ...r, docsOpen: false }))}>
        <div className="col" style={{ gap: 'var(--space-100)' }}>{refine.docs.map(d => <div key={d.id} className="row rf-doc"><Icon name="system-file" size={16} /><span className="t-body-m-regular plan-ellipsis" style={{ flex: 1 }}>{d.name}</span><span className="t-body-m-regular muted">{d.date}</span></div>)}</div>
      </RfPopover></div>}
    </AppShell>
  );
}

/* ---------------------------------------------------------------- Alternative comparison (J08 steps 2, 4, 8) */
function RfCompare({ refine, setRefine, toPlan, compared, onOpen, onEvaluate }) {
  const shown = RF_ALTS.filter(a => compared(a.id) && toPlan(a.id)), excluded = RF_ALTS.filter(a => !toPlan(a.id));
  const setRec = id => { setRefine(r => ({ ...r, recommended: id })); toast({ title: `${rfAlt(id).name} is now recommended` }); };
  const rows = [
    { group: 'Financial', items: [['CAPEX', a => fmtMoney(a.capex)], ['ROI', () => '—'], ['Payback period', () => '—'], ['NPV', () => '—'], ['IRR', () => '—'], ['OPEX impact', a => fmtMoney(a.opex)]] },
    { group: 'Reliability', items: [['Risk level', a => <Indicator type={RISK_LEVEL[a.riskLevel].type}>{RISK_LEVEL[a.riskLevel].label}</Indicator>], ['Failure reduction', a => rfPct(a.reduced)],
      ['Residual risk 2035', a => Math.round(a.residual2035).toLocaleString()], ['Units replaced', a => `${a.scope} of ${rfPadmounts.length}`], ['Customers protected', a => `~${a.customers.toLocaleString()}`]] },
    { group: 'Value', items: [['Value', a => fmtValue(a.value)], ['Benefit-cost ratio', a => a.bcr ?? '—']] },
  ];
  const [open, setOpen] = useState({ Financial: true, Reliability: true, Value: true });
  return <>
    <RfTitle title="Alternative comparison" text="Investment alternatives evaluated against risk and return criteria" right={<>
      <RfPopover align="end" title="Alternatives" trigger={<Button type="tertiary" size="s" iconRight="arrow-caret-down-filled">{`${shown.length} selected`}</Button>} showClose={false}>
        <NDS label="Send to plan / Compare columns" className="rf-pick">
          <span className="t-label-m-medium muted">Send to plan</span><span /><span className="t-label-m-medium muted">Compare</span>
          {RF_ALTS.map(a => <React.Fragment key={a.id}>
            <RfCheckbox checked={toPlan(a.id)} aria-label={`Send ${a.name} to plan`} onChange={v => { setRefine(r => ({ ...r, toPlan: { ...r.toPlan, [a.id]: v } })); if (!v) toast({ title: `${a.name} removed from going to Plan`, description: 'It stays in the investment record' }); }} />
            <span className="t-body-m-regular">{a.name}</span>
            <Switch size="s" checked={compared(a.id)} aria-label={`Compare ${a.name}`} onChange={() => setRefine(r => ({ ...r, compare: { ...r.compare, [a.id]: !compared(a.id) } }))} />
          </React.Fragment>)}
        </NDS>
      </RfPopover>
      <Button type="secondary" size="s" iconLeft="system-plus" onClick={() => toast({ title: 'Add alternative isn’t designed yet', description: 'Figma has no frame for it' })}>New</Button>
      <Button type="secondary" size="s" iconLeft="cooper-system-icon" onClick={onEvaluate}>Cooper’s evaluation</Button>
    </>} />
    {excluded.length > 0 && <IFS.Alert type="info" title={`${excluded.map(a => a.name).join(', ')} excluded`}>Excluded from Plan and Compare, but still available in the investment record.</IFS.Alert>}
    <div className="ifs-grid">{shown.map(a => {
      const isRec = a.id === refine.recommended;
      return <div key={a.id} className="ifs-span-4"><ContentCard className={isRec ? 'rf-card--rec' : undefined} title={a.name} onClick={() => onOpen(a.id)}
        bottom={<div className="col" style={{ gap: 'var(--space-stack)', width: '100%' }}>
          <div className="row" style={{ gap: 'var(--space-200)', alignItems: 'baseline' }}><span className="t-heading-h2-medium t-numeric">{fmtMoney(a.cost)}</span><span className="t-body-m-regular sec">{a.years}{refine.refined[a.id] ? ' · refined' : ''}</span></div>
          <div className="row" style={{ gap: 'var(--space-200)', flexWrap: 'wrap' }}><Badge size="s" color="white">{`${a.scope} of ${rfPadmounts.length} pad-mounts`}</Badge><span className="t-body-m-regular sec">{`~${a.customers.toLocaleString()} customers protected`}</span></div>
          <div className="box col" style={{ gap: 'var(--space-50)' }}><span className="t-body-m-regular sec">Risk reduced</span><span className="t-heading-h3-medium t-numeric">{rfPct(a.reduced)}</span><span className="t-body-m-regular muted">of scored risk, 2026–2035</span></div>
          {isRec ? <Button type="secondary" size="m" iconLeft="system-check" disabled>Recommended</Button>
            : <Button type="tertiary" size="m" onClick={e => { e.stopPropagation(); setRec(a.id); }}>Set as recommended</Button>}
        </div>} /></div>; })}</div>
    <NDS label="Comparison grid (DS Table can't hold card columns)" className="rf-grid" style={{ '--rf-cols': shown.length }}>
      {rows.map(g => <React.Fragment key={g.group}>
        <button className="rf-grid__group" onClick={() => setOpen(o => ({ ...o, [g.group]: !o[g.group] }))} aria-expanded={open[g.group]}>
          <Icon name={open[g.group] ? 'arrow-caret-down-filled' : 'arrow-caret-right-filled'} size={16} /><span className="t-label-m-medium">{g.group}</span><IFS.Counter>{g.items.length}</IFS.Counter></button>
        {open[g.group] && g.items.map(([label, f]) => <div key={label} className="rf-grid__row">
          <span className="t-body-m-regular sec">{label}</span>{shown.map(a => <span key={a.id} className="t-label-m-medium t-numeric">{f(a)}</span>)}</div>)}
      </React.Fragment>)}
    </NDS>
  </>;
}

/* ---------------------------------------------------------------- Alternative › Details (J08 step 5) */
function RfAltDetails({ alt, recId, toPlan }) {
  const rank = 1 + RF_ALTS.filter(a => a.reduced > alt.reduced).length;
  const [allowRec, setAllowRec] = useState(true), [allowShift, setAllowShift] = useState(true);
  const scopeRows = rfPadmounts.slice(0, alt.scope).map(a => { const r = assess(a, NOW, activeOf(INITIAL_LENSES)); const tol = TOLERANCE[a.type];
    return { id: a.id, asset: a.label, segment: a.parent, status: r.risk >= tol ? 'Critical' : r.risk >= tol * 0.75 ? 'Moderate' : 'Healthy', score: Math.round(r.risk) }; });
  const field = (l, v) => <><span className="t-body-m-regular sec">{l}</span><span className="t-body-m-regular">{v}</span></>;
  return <>
    <RfTitle title="Alternative details" text="Alternative details, scope, cost, risk reduction, and expected value" />
    {!toPlan && <IFS.Alert type="info" title="Excluded alternative">Excluded from Plan and Compare, but still available in the investment record.</IFS.Alert>}
    <RfStats cards={[{ size: 's', title: 'Rank', value: `#${rank}`, caption: alt.id === recId ? 'Recommended' : 'by risk reduced' },
      { size: 's', title: 'Risk reduced', value: rfPct(alt.reduced), caption: 'of scored risk' }, { size: 's', title: 'Customers protected', value: `~${alt.customers.toLocaleString()}` },
      { size: 's', title: 'Scope', value: `${alt.scope} of ${rfPadmounts.length}`, caption: 'pad-mounts' }]} />
    <RfCard title="Identity & Classification" actions={<Button type="secondary" size="s" iconLeft="cooper-system-icon" onClick={() => toast({ title: 'Edit with Cooper', description: 'Works as on Shape: tell Cooper what to change' })}>Edit with Cooper</Button>}>
      <div className="ad-field rf-fields">{field('Name', alt.name)}{field('Description', ALT_DESC[alt.name] || '—')}{field('Code', `ALT-${alt.id}`)}{field('Type', alt.type || '—')}
        {field('Creator', 'Cooper')}{field('Created date', fmtDate(RF_INV.createdDate))}</div>
    </RfCard>
    <RfCard title="Dates"><div className="ad-field rf-fields">{field('Start of alternative', fmtDate(alt.first))}{field('End of alternative', fmtDate(alt.last))}{field('Pause date', '—')}{field('Resume date', '—')}</div></RfCard>
    <RfCard title="Restrictions"><div className="col" style={{ gap: 'var(--space-stack)' }}>
      <ContentCard size="s" title="Allow alternative to be chosen as recommended" description="Allows this alternative to be selected as the recommended option for the investment." control={<Switch size="s" checked={allowRec} onChange={setAllowRec} aria-label="Allow recommended" />} />
      <ContentCard size="s" title="Allow alternative to be shifted" description="Allows this alternative to be moved to a different year or planning period." control={<Switch size="s" checked={allowShift} onChange={setAllowShift} aria-label="Allow shift" />} />
    </div></RfCard>
    <RfCard title="Scope"><RfTable rowHeight={52} columns={[{ key: 'asset', title: 'Asset', width: '1.4fr', primary: true }, { key: 'segment', title: 'Segment', width: '1fr' },
      { key: 'status', title: 'Status', width: '1fr', render: r => <Indicator type={r.status === 'Critical' ? 'red' : r.status === 'Moderate' ? 'orange' : 'green'}>{r.status}</Indicator> },
      { key: 'score', title: 'Risk score', type: 'number', width: 'var(--table-col-number-min)' }]} rows={scopeRows} defaultSort={{ key: 'score', dir: 'desc' }} /></RfCard>
  </>;
}

/* ---------------------------------------------------------------- Alternative › Cost & Schedule (J08 step 5) */
function RfCost({ alt, refine, setRefine }) {
  const [view, setView] = useState('table');
  const [sel, setSel] = useState(null);                 // { stage, year }
  const [adj, setAdj] = useState(null);                 // Adjust by % dialog value
  const plan = costPlan(alt, refine.adjust[alt.id] || {});
  const years = Object.keys(alt.spendByYear).sort(), total = plan.reduce((t, s) => t + s.total, 0);
  const yearTot = y => plan.reduce((t, s) => t + s.byYear[y], 0);
  let run = 0;
  const cum = years.map(y => (run += yearTot(y)));
  const st = sel && plan.find(s => s.id === sel.stage);
  const shortDate = d => fmtDate(d);
  const q0 = +years[0], slots = years.length * 4, slotOf = d => { const t = rfDay(d); return (t.getFullYear() - q0) * 4 + t.getMonth() / 3; };
  return <>
    <RfTitle title="Alternative cost & schedule" text={`${alt.name}: ${fmtMoney(total)} over ${alt.years}, by stage`}
      right={<SegmentedControl size="s" value={view} onChange={setView} options={[{ value: 'gantt', label: 'Gantt' }, { value: 'table', label: 'Table' }]} />} />
    <ContentCard top={<div className="row" style={{ width: '100%', justifyContent: 'space-between' }}>
      <div className="row" style={{ gap: 'var(--space-200)' }}>
        {view === 'table' && <Button type="tertiary" size="s" iconRight="arrow-caret-down-filled" onClick={() => toast({ title: 'Columns aren’t part of this flow' })}>Columns</Button>}
        <Button type="tertiary" size="s" iconRight="arrow-caret-down-filled" onClick={() => toast({ title: 'Views aren’t part of this flow' })}>View</Button></div>
      <SegmentedControl size="s" value="year" onChange={v => v !== 'year' && toast({ title: 'Quarter and month scales aren’t part of this flow', description: 'The demo data has yearly spend' })}
        options={[{ value: 'year', label: 'Year' }, { value: 'quarter', label: 'Quarter' }, { value: 'month', label: 'Month' }]} />
    </div>} bottom={<div className="col" style={{ width: '100%', gap: 'var(--space-200)' }}>
      {view === 'table' ? <>
        <NDS label="Formula bar" className="rf-formula row">
          <span className="t-code-m-regular muted">ƒx</span>
          <span className="t-code-m-regular" style={{ flex: 1 }}>{st ? `${st.name} ${sel.year} = Σ spend ${sel.year} ${fmtMoney(alt.spendByYear[sel.year])} × ${Math.round(st.share * 100)}% stage share${(refine.adjust[alt.id] || {})[st.id] ? ` × ${100 + refine.adjust[alt.id][st.id]}%` : ''} = ${fmtMoney(st.byYear[sel.year])}` : ''}</span>
          {st && <><Button type="tertiary" size="s" onClick={() => setAdj('10')}>Adjust by %</Button>
            <Button type="tertiary" size="s" onClick={() => toast({ title: 'Shift dates isn’t part of this flow', description: 'Ask Cooper to shift stages' })}>Shift dates</Button></>}
        </NDS>
        <NDS label="Cost & schedule grid (spreadsheet: not in DS)" className="rf-sheet" style={{ '--rf-years': years.length }}>
          {['Stage', 'Total cost', 'Days', 'Type', 'Start date', 'End date', ...years].map(h => <span key={h} className="rf-sheet__h t-label-m-medium">{h}</span>)}
          {plan.map(s => <React.Fragment key={s.id}>
            <span className="t-label-m-medium">{s.name}</span><span className="t-numeric">{fmtMoney(s.total)}</span><span className="t-numeric">{s.days}</span><span>{s.type}</span>
            <span>{shortDate(s.start)}</span><span>{shortDate(s.end)}</span>
            {years.map(y => <button key={y} className={`rf-cell t-numeric${sel && sel.stage === s.id && sel.year === y ? ' is-on' : ''}`} onClick={() => setSel({ stage: s.id, year: y })}>{s.byYear[y] ? fmtMoney(s.byYear[y]) : '—'}</button>)}
          </React.Fragment>)}
          <span className="t-label-m-medium">Total cost</span><span className="t-label-m-medium t-numeric">{fmtMoney(total)}</span><span /><span /><span /><span />
          {years.map((y, i) => <span key={y} className="col t-numeric"><span className="t-label-m-medium">{fmtMoney(yearTot(y))}</span><span className="muted">{`Σ ${fmtMoney(cum[i])}`}</span></span>)}
        </NDS>
      </> : <RfTimeline title="Stage" groups={years.map(y => ({ label: y, slots: ['Q1', 'Q2', 'Q3', 'Q4'] }))}
          phases={plan.map(s => ({ id: s.id, title: s.name, subtitle: `${s.type} · ${fmtMoney(s.total)}`, color: s.color, start: Math.max(0, slotOf(s.start)), end: Math.min(slots, slotOf(s.end) + 0.34),
            tasks: alt.milestones.filter(m => m.forecastDate >= s.start && m.forecastDate <= s.end).map(m => ({ title: m.name, label: fmtDate(m.forecastDate), start: slotOf(m.forecastDate), end: slotOf(m.forecastDate) + 0.2 })) }))} />}
    </div>} />
    <Modal open={adj !== null} onOpenChange={o => !o && setAdj(null)} title="Adjust by %" width="var(--overlay-width-s)"
      secondaryAction={{ label: 'Cancel', onClick: () => setAdj(null) }}
      primaryAction={{ label: 'Apply', onClick: () => { const v = parseFloat(adj) || 0; setRefine(r => ({ ...r, adjust: { ...r.adjust, [alt.id]: { ...(r.adjust[alt.id] || {}), [st.id]: v } } })); setAdj(null); toast({ title: `${st.name} adjusted by ${v}%`, description: 'Every year of the stage changes' }); } }}>
      <TextField label={st ? `${st.name}: change every year by` : ''} value={adj || ''} onChange={e => setAdj(e.target ? e.target.value : e)} suffix="%" />
    </Modal>
  </>;
}

/* ---------------------------------------------------------------- Investment details › Dependencies (J08 step 6) */
function RfInvDetails({ onCooper }) {
  const [tab, setTab] = useState('general');
  return <>
    <RfTitle title="Investment details" text="Core investment details, context, and current status" />
    <RfTabs value={tab} onChange={setTab} items={[{ value: 'general', label: 'General' }, { value: 'cost', label: 'Cost & Schedule' }, { value: 'rel', label: 'Relationships' }]} />
    {tab === 'general' ? <>
      <RfCard title="Dependencies"><RfTable rowHeight={60} onRowClick={r => onCooper(`${r.name} (${r.code}). ${r.why} I linked it because of that, and I’m tracking its status and impact on this investment.`)}
        search={<IFS.SmartSearch placeholder="Ask anything about investments" />}
        columns={[{ key: 'name', title: 'Investment', width: '2fr', primary: true, render: r => <span className="col"><span className="t-label-m-medium">{r.name}</span><span className="t-body-m-regular muted">{r.code}</span></span> },
          { key: 'type', title: 'Dependency type', width: '1.2fr', render: r => <Badge size="s" color="white">{r.type}</Badge> },
          { key: 'progress', title: 'Progress', width: '1fr', render: r => <span className="row" style={{ gap: 'var(--space-200)', width: '100%' }}><ProgressBar value={r.progress} label={`${r.name} progress`} /><span className="t-numeric">{r.progress}%</span></span> },
          { key: 'cost', title: 'Cost', type: 'number', width: 'var(--table-col-number-min)', render: r => fmtMoney(r.cost) },
          { key: 'value', title: 'Value', type: 'number', width: 'var(--table-col-number-min)', render: r => fmtValue(r.value) }]} rows={RF_DEPENDENCIES} /></RfCard>
      <RfCard title="Assets Impacted"><RfTable rowHeight={52} columns={[{ key: 'label', title: 'Asset', primary: true }, { key: 'parent', title: 'Segment' }, { key: 'customers', title: 'Customers', type: 'number' }]}
        rows={rfPadmounts.map(a => ({ id: a.id, label: a.label, parent: a.parent, customers: a.customers }))} /></RfCard>
    </> : <EmptyState cause="empty-container" size="section" heading={tab === 'cost' ? 'Cost & Schedule is per alternative' : 'No relationships yet'}
        body={tab === 'cost' ? 'Open an alternative in the side navigation to see its cost and schedule.' : 'Relationships to programs and portfolios will show here.'} />}
  </>;
}

/* ---------------------------------------------------------------- J09 · Value: models, a model's measures, questionnaire (Figma 48:146320) */
function RfValue({ refine, setRefine, alt: scoped }) {
  const alt = scoped || rfAlt(refine.recommended), raw = RF_ALT_RAW.find(a => a.id === alt.id);
  const models = (refine.models || RF_MODELS.map(m => m.id)).map(id => RF_MODELS.find(m => m.id === id) || (refine.added || []).find(m => m.id === id)).filter(Boolean);
  const answers = refine.answers || {};
  const qs = RF_QUESTIONS.map(q => answers[q.id] ? { ...q, answer: answers[q.id], by: 'you-done' } : q);
  const needs = m => qs.filter(q => q.model === m.name && !q.answer).length;
  const [open, setOpen] = useState(null), [tab, setTab] = useState('measures'), [lib, setLib] = useState(false), [answering, setAnswering] = useState(null);
  const avg = models.length ? models.reduce((t, m) => t + (m.measure ? measureReduced(raw, m.measure) : 0), 0) / models.filter(m => m.measure).length : 0;
  const fy = y => `FY${String(y).slice(2)}`, yrs = Object.keys(alt.spendByYear).sort();
  if (open) {
    const m = models.find(x => x.id === open), base = measureBaseline(raw, m.measure);
    const rows = [{ id: 'base', rank: '', name: 'Baseline', note: 'Shared reference', byYear: base },
      ...[...RF_ALTS].sort((a, b) => measureReduced(RF_ALT_RAW.find(x => x.id === b.id), m.measure) - measureReduced(RF_ALT_RAW.find(x => x.id === a.id), m.measure)).map((a, k) => {
        const r = RF_ALT_RAW.find(x => x.id === a.id), b = measureBaseline(r, m.measure);
        return { id: a.id, rank: k + 1, name: a.name, note: 'Change · avoided risk', byYear: Object.fromEntries(RF_RISK_YEARS.map(y => [y, Math.max(0, b[y] - ((r.riskResidualByMeasure[m.measure] || {})[y] || 0))])) }; })];
    const shown = RF_RISK_YEARS.slice(0, 6);
    return <>
      <div className="row" style={{ gap: 'var(--space-200)' }}><IconButton icon="arrow-left" type="ghost" size="s" label="Back to value models" onClick={() => setOpen(null)} />
        <span className="t-heading-h2-medium">{m.name}</span></div>
      <span className="t-body-m-regular sec">{`Risk on the ${m.measure.toLowerCase()} measure, before and after each alternative. Change = baseline − outcome.`}</span>
      <RfTabs value={tab} onChange={setTab} items={[{ value: 'measures', label: 'Value measures' }, { value: 'q', label: 'Questionnaire answers', count: qs.filter(q => q.model === m.name).length }]} />
      {tab === 'measures' ? <>
        <RfCard title={`${m.measure}, by year`} actions={<Button type="secondary" size="s" iconLeft="cooper-system-icon" onClick={() => toast({ title: 'Value updated', description: 'Cooper recalculated the measure with the latest answers' })}>Edit with Cooper</Button>}>
          <div className="col" style={{ gap: 'var(--space-200)' }}>
            <NDS label="Formula line" className="rf-formula row"><span className="t-code-m-regular muted">ƒx</span><span className="t-code-m-regular">Change = Baseline − Outcome, where Outcome = Risk likelihood × Risk consequence</span></NDS>
            <RfTable rowHeight={48} columns={[{ key: 'rank', title: 'Rank', width: 'var(--table-col-check)' }, { key: 'name', title: 'Value', width: '1.6fr', primary: true, render: r => <span className="col"><span className="t-label-m-medium">{r.name}</span><span className="t-body-m-regular muted">{r.note}</span></span> },
              ...shown.map(y => ({ key: y, title: fy(y), type: 'number', render: r => Math.round(r.byYear[y]).toLocaleString() })), { key: 'sum', title: 'Σ', type: 'number', render: r => <span className="t-label-m-medium">{Math.round(rfSum(r.byYear)).toLocaleString()}</span> }]} rows={rows} />
          </div>
        </RfCard>
        <RfCard title="Residual Risk"><div style={{ height: 'var(--proto-chart-l)' }}><LineChart data={RF_RISK_YEARS.map(y => ({ label: fy(y), base: Math.round(base[y]), ...Object.fromEntries(RF_ALTS.map(a => [a.id, Math.round(((RF_ALT_RAW.find(x => x.id === a.id).riskResidualByMeasure[m.measure]) || {})[y] || 0)])) }))}
          series={[{ key: 'base', label: 'Baseline', dashed: true }, ...RF_ALTS.map(a => ({ key: String(a.id), label: a.name }))]} /></div></RfCard>
      </> : <RfCard title="Questionnaire Answers">
        <RfTable rowHeight={60} groupBy={r => r.answer ? 'Ready' : 'Need input'} columns={[{ key: 'q', title: 'Question', width: '2fr', primary: true, render: r => <span className="col"><span className="t-label-m-medium">{r.q}</span><span className="t-body-m-regular muted">{r.kind}</span></span> },
          { key: 'model', title: 'Value model', width: '1fr', render: r => <Badge size="s" color="white">{r.model}</Badge> },
          { key: 'answer', title: 'Answer', width: '1.4fr', render: r => r.answer ? <span className="row" style={{ gap: 'var(--space-150)' }}>{r.answer}{r.by === 'cooper' && <Badge size="s" color="white">Cooper</Badge>}</span>
            : answering === r.id ? <IFS.IssueAnswerField onSubmit={t => { setRefine(x => ({ ...x, answers: { ...(x.answers || {}), [r.id]: t } })); setAnswering(null); toast({ title: 'Value updated', description: `${r.model} recalculated with your answer` }); }} onCancel={() => setAnswering(null)} />
            : <span className="row" style={{ gap: 'var(--space-200)' }}><Button type="secondary" size="s" onClick={() => setAnswering(r.id)}>My answer</Button><Button type="tertiary" size="s" iconLeft="system-upload"
                onClick={() => { setRefine(x => ({ ...x, answers: { ...(x.answers || {}), [r.id]: 'From Safety review notes.docx' }, docs: [...x.docs, { id: `d${x.docs.length}`, name: 'Field safety report — Alpine Meadows.pdf', date: 'Nov 17, 2026' }] })); toast({ title: 'Value updated', description: 'Cooper read the file and answered the question' }); }}>Upload file</Button></span> }]}
          rows={qs.filter(q => q.model === m.name)} />
      </RfCard>}
    </>;
  }
  return <>
    <RfTitle title={scoped ? 'Alternative value' : 'Value'} text={scoped ? `${alt.name}: the value models applied to this alternative.` : 'Shows the investment value model baseline and the value models assigned to this investment.'} />
    <RfStats cards={[{ size: 's', title: 'Total value created', value: fmtValue(alt.value), caption: 'framework score' }, { size: 's', title: 'Avg risk reduction', value: rfPct(avg) },
      { size: 's', title: 'Benefit-cost ratio', value: alt.bcr ? `${alt.bcr}x` : '—' }, { size: 's', title: 'Evaluation horizon', value: `${fy(yrs[0])}–${fy(RF_RISK_YEARS[RF_RISK_YEARS.length - 1])}` }]} />
    <RfCard title="Selected Models" actions={<Button type="tertiary" size="s" iconLeft="system-plus" onClick={() => setLib(true)}>Add</Button>}>
      <RfTable rowHeight={48} rowProps={r => ({ 'data-model': r.id })} onRowClick={r => { setOpen(r.id); setTab(needs(r) ? 'q' : 'measures'); }} columns={[
        { key: 'name', title: 'Value model', width: '1.4fr', primary: true },
        { key: 'status', title: 'Status', width: '1fr', render: r => needs(r) ? <span className="row" style={{ gap: 'var(--space-150)' }}><Indicator type="orange">Needs input</Indicator><IFS.Counter>{`0/${needs(r)}`}</IFS.Counter></span> : <Indicator type="green">Ready</Indicator> },
        { key: 'measures', title: 'Measures', type: 'number', width: 'var(--table-col-number-min)' },
        { key: 'output', title: 'Output', width: '1.6fr', render: r => <span className="row" style={{ gap: 'var(--space-100)', minWidth: 0 }}><Badge size="s" color="white">{r.output[0]}</Badge>{r.output.length > 1 && <Badge size="s" color="white">{`+${r.output.length - 1}`}</Badge>}</span> },
        { key: 'red', title: 'Risk reduction', type: 'number', width: 'var(--table-col-number-min)', render: r => r.measure ? rfPct(measureReduced(raw, r.measure)) : '—' },
        { key: 'del', title: '', width: 'var(--table-col-action)', render: r => <IconButton icon="system-trash-delete" type="ghost" size="s" label={`Remove ${r.name}`}
          onClick={e => { e.stopPropagation(); setRefine(x => ({ ...x, models: (x.models || RF_MODELS.map(mm => mm.id)).filter(id => id !== r.id) })); toast({ title: `${r.name} removed`, description: 'Cooper recalculated the investment value',
            primaryAction: { label: 'Undo', onClick: () => setRefine(x => ({ ...x, models: [...(x.models || []), r.id] })) } }); }} /> }]} rows={models} />
    </RfCard>
    {lib && <div className="rf-cooper"><Panel title="Models" collapsible={false} onClose={() => setLib(false)}>
      <div className="col" style={{ gap: 'var(--space-stack)' }}>{RF_MODEL_LIBRARY.filter(l => !models.some(m => m.id === l.id)).map(l => <ContentCard key={l.id} size="s" title={l.name} description={l.text} iconRight="system-plus"
        onClick={() => { setRefine(x => ({ ...x, added: [...(x.added || []), { id: l.id, name: l.name, measures: 1, output: [l.name] }], models: [...(x.models || RF_MODELS.map(mm => mm.id)), l.id] })); setLib(false); toast({ title: `${l.name} added`, description: 'Cooper will ask for its inputs' }); }} />)}</div>
    </Panel></div>}
  </>;
}

/* ---------------------------------------------------------------- J09 · Investment overview, widgets (Figma 58:31703) */
function RfOverview({ refine, setRefine }) {
  const alt = rfAlt(refine.recommended), widgets = refine.widgets || [];
  const baseRisk = rfSum(alt.baselineByYear);
  const generate = () => { if (!widgets.includes('risk-type')) setRefine(x => ({ ...x, widgets: [...(x.widgets || []), 'risk-type'], shared: true })); };
  const raw = RF_ALT_RAW.find(a => a.id === alt.id);
  return <>
    <RfTitle title="Investment overview" text="High-level investment summary, key metrics, and current progress"
      right={<Button type="secondary" size="s" iconLeft="system-plus" onClick={generate}>Widgets</Button>} />
    <RfStats cards={[{ size: 's', title: 'Benefit-cost ratio', value: alt.bcr ? `${alt.bcr}x` : '—', caption: 'Benefit returned per $1 spent' }, { size: 's', title: 'Estimated cost', value: fmtMoney(alt.cost), caption: 'Expected delivery cost' },
      { size: 's', title: 'Investment value', value: fmtValue(alt.value), caption: 'Total expected value' }, { size: 's', title: 'Baseline risk', value: Math.round(baseRisk).toLocaleString(), caption: 'Risk before intervention, 2026–2035' }]} />
    <div className="ifs-grid is-halves">
      <RfCard title="Investment Details"><div className="ad-field rf-fields">
        {[['Name', RF_INV.name], ['Code', RF_INV.code], ['Type', RF_INV.type || 'Program'], ['Planning portfolio', RF_INV.portfolio || '—'], ['Problem statement', RF_INV.description]].map(([l, v]) => <React.Fragment key={l}><span className="t-body-m-regular sec">{l}</span><span className="t-body-m-regular">{v}</span></React.Fragment>)}
      </div></RfCard>
      <RfCard title="Affected Assets & area"><NDS label="3D map (MapLibre)" style={{ position: 'relative', height: 'var(--proto-map-h)', borderRadius: 'var(--radius-radius-200)', overflow: 'hidden' }}>
        <MapView labels={false} lenses={INITIAL_LENSES} year={END} interactive={false} focus={rfPadmounts.map(a => a.id)} /></NDS></RfCard>
      <RfCard title="Yearly Forecast"><div style={{ height: 'var(--proto-chart-l)' }}><ColumnChart data={Object.keys(alt.spendByYear).sort().map(y => ({ label: `FY${y.slice(2)}`, value: alt.spendByYear[y] }))} valueLabel="Spend" format={v => fmtMoney(v)} /></div></RfCard>
      <RfCard title="Investment Value"><div style={{ height: 'var(--proto-chart-l)' }}><IFS.BarChart data={alt.valueByMeasure.map(m => ({ label: m.measure.replace(' Risk', ''), value: Math.round(m.value) }))} valueLabel="Value" labelWidth={160} /></div></RfCard>
      {widgets.includes('risk-type') && <RfCard title="Annualized Outcome Risk by Risk Type"><div style={{ height: 'var(--proto-chart-l)' }}>
        <LineChart data={RF_RISK_YEARS.map(y => ({ label: `FY${y.slice(2)}`, ...Object.fromEntries(RF_RISK_MEASURES.map(m => [m, Math.round((raw.riskResidualByMeasure[m] || {})[y] || 0)])) }))} series={RF_RISK_MEASURES.map(m => ({ key: m, label: m.replace(' Risk', '') }))} /></div></RfCard>}
    </div>
    {refine.shared && <div className="build-snack"><IFS.Snackbar title="Widget shared with your team" primaryAction={{ label: 'Okay', onClick: () => setRefine(x => ({ ...x, shared: false })) }} onClose={() => setRefine(x => ({ ...x, shared: false }))}>
      {`${PEOPLE.LF.name} · ${PEOPLE.NL.name}`}</IFS.Snackbar></div>}
  </>;
}
