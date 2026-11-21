/* Build › Refine — J08 (alternatives, cost & schedule, dependencies, comments) and J09 (value, overview, attachments).
   Figma Build handover: compare 48:59236, comments 55:52663, alternative details 53:201387, cost table 76:8792, Gantt 96:80712,
   dependencies 43:303888, value 48:146320, overview 58:31703, system confidence 43:229806, attachments 53:230306.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
const { SideNav: RfSideNav, CommentsPanel: RfCommentsPanel, CommentCallout: RfCommentCallout, StatCardsRow: RfStats, TimelineChart: RfTimeline,
  Checkbox: RfCheckbox, Popover: RfPopover, Tabs: RfTabs, Table: RfTable, ConfidenceGates: RfGates, IssueKindSwitch: RfKinds, IssueNavigator: RfNavigator,
  RecommendationGroup: RfRecGroup, RecommendationItem: RfRecItem, RecommendationDetail: RfRecDetail } = IFS;

// A Refine card: the Build card header (H4 title + actions + Cooper icon), as on Shape
const RfCard = ({ title, actions, children, className }) => (
  <ContentCard className={className} top={<Inline justify="between" gap="200" align="center" style={{ width: '100%' }}>
    <span className="t-heading-h4-semibold">{title}</span>
    <Inline gap="100" align="center">{actions}<IconButton icon="cooper-system-icon" type="tertiary" shape="circle" size="s" label={`Ask Cooper about ${title}`} onClick={() => toast({ title: `Cooper: ${title}` })} /></Inline>
  </Inline>} bottom={<div style={{ width: '100%' }}>{children}</div>} />
);
const RfTitle = ({ title, text, right }) => (
  <Inline justify="between" gap="300" align="end">
    <Stack gap="100"><h3 className="t-heading-h3-medium" style={{ margin: 0 }}>{title}</h3><span className="t-body-m-regular sec">{text}</span></Stack>
    {right && <Inline gap="200" align="center">{right}</Inline>}
  </Inline>
);

function Refine({ navBar, page, setPage, refine, setRefine, onBack, onSendForApproval, onOpenPlan, onApproved, persona = 'owner', invId }) {
  const me = PERSONAS[persona] || PERSONAS.owner;
  const R = rfContext(invId);                            // this investment's record, alternatives and content (shared/refine-model.js)
  const recId = refine.recommended, alts = R.alts, rec = R.alt(recId) || alts[0];
  const toPlan = id => refine.toPlan[id] !== false, compared = id => refine.compare[id] !== false;
  const c = IFS.useIssueReport({ issues: useMemo(() => R.issues(), [invId]), gates: RF_GATES });
  // J11 final approval: after Send for approval the right panel shows the approval chain. [Assumed] two approvers answer within seconds;
  // Luca Ferri stays awaiting until the owner pushes a reminder
  useEffect(() => {
    if (refine.status !== 'approval') return;
    const t = setTimeout(() => setRefine(r => r.status !== 'approval' ? r : { ...r, approvers: r.approvers.map(a => ['MD', 'KM'].includes(a.id) ? { ...a, status: 'success' } : a) }), 4000);
    return () => clearTimeout(t);
  }, [refine.status]);
  useEffect(() => {
    if (refine.status === 'approval' && refine.approvers && refine.approvers.every(a => a.status === 'success')) {
      setRefine(r => ({ ...r, status: 'approved' })); onApproved && onApproved(R.inv); toast({ title: 'Investment approved at every gate', description: `Plan lists it under New to Scenario for the next cycle`, primaryAction: { label: 'Open in Plan', onClick: onOpenPlan }, duration: 8000 });   // rule 7.12: news is a live snackbar, not a success alert
    }
  }, [refine.approvers]);
  const [side, setSide] = useState('confidence');        // right panel: confidence | comments | null
  const [thread, setThread] = useState(null);           // open comment thread id
  const [cooper, setCooper] = useState(null);           // Cooper window: { kind: 'recs' | 'detail' | 'text', ... }
  // J10: the estimator sees the request addressed to him first
  const threads = persona === 'estimator' ? [...refine.threads].sort((a, b) => (b.forEstimator ? 1 : 0) - (a.forEstimator ? 1 : 0)) : refine.threads;
  const openCount = threads.filter(t => !t.resolved).length;
  const altPage = page.startsWith('alt-') ? { id: +page.split('-')[1], tab: page.split('-')[2] } : null;
  const wide = altPage && altPage.tab === 'cost';
  const nav = [
    { type: 'section', label: 'Investment', items: [{ id: 'overview', label: 'Overview' }, { id: 'details', label: 'Details' }, { id: 'compare', label: 'Alternative comparison' }, { id: 'value', label: 'Value' }] },
    { type: 'section', label: 'Alternatives', action: { label: 'Add alternative', onClick: () => toast({ title: 'Add alternative isn’t designed yet', description: 'Figma has no frame for it' }) },
      items: alts.filter(a => toPlan(a.id)).map(a => ({ type: 'submenu', id: `alt-${a.id}`, label: a.name, cooper: a.id === recId, defaultOpen: altPage && altPage.id === a.id,
        items: [{ id: `alt-${a.id}-details`, label: 'Details', cooper: a.id === recId }, { id: `alt-${a.id}-cost`, label: 'Cost & Schedule' }, { id: `alt-${a.id}-value`, label: 'Value' }] })) },
    ...(alts.some(a => !toPlan(a.id)) ? [{ type: 'section', label: 'Excluded alternatives', items: alts.filter(a => !toPlan(a.id)).map(a => ({ id: `alt-${a.id}-details`, label: a.name })) }] : []),
  ];
  const resolveThread = (id, reply) => setRefine(r => ({ ...r, threads: r.threads.map(t => t.id === id ? { ...t, resolved: true, unread: false,
    comments: reply ? [...t.comments, { id: `r${Date.now()}`, name: 'Cooper', avatar: { type: 'cooper' }, time: 'Just now', text: reply }] : t.comments } : t) }));
  const shapeWithCooper = t => { setThread(null); setCooper({ kind: 'recs', thread: t }); };
  const [activity, setActivity] = useState(false);       // Activity drawer (Figma 55:85304), from the chevron after the code
  const header = <PageHeader title={R.inv.name} id={R.inv.code} onBack={onBack} onTitleMenu={() => setActivity(a => !a)}
    status={<span className="row" style={{ gap: 'var(--space-150)' }}><Indicator type={refine.status === 'approval' ? 'orange' : refine.status === 'approved' ? 'green' : refine.status === 'executing' ? 'blue' : 'purple'}>{refine.status === 'approval' ? 'Under review' : refine.status === 'approved' ? 'Approved' : refine.status === 'executing' ? 'Executing' : 'Refining'}</Indicator>{refine.status === 'approval' && refine.approvers && <IFS.Counter>{reviewCount(refine.approvers)}</IFS.Counter>}</span>}
    center={<Stepper current={refine.status === 'executing' ? 4 : ['approval', 'approved'].includes(refine.status) ? 3 : 2} steps={[{ label: 'Shape' }, { label: 'Review' }, { label: 'Refine' }, { label: 'Approve' }]} />}
    actions={<Inline gap="200" align="center">
      <Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      <IFS.CommentButton type={side === 'comments' ? 'secondary' : 'tertiary'} hasNew={openCount > 0} onClick={() => setSide(s => s === 'comments' ? 'confidence' : 'comments')} />
      <Button type="secondary" size="s" onClick={() => toast({ title: 'Dismiss is on Shape', description: 'An investment in Refine is withdrawn from Approve' })}>Dismiss</Button>
      <Button type="primary" size="s" disabled={['approval', 'approved', 'executing'].includes(refine.status)} onClick={onSendForApproval}>{refine.status === 'approved' ? 'Approved' : refine.status === 'approval' ? 'Sent for approval' : 'Send for approval'}</Button>
    </Inline>} />;
  const prompts = page === 'compare' || altPage?.tab === 'details' ? ['Explain gaps in confidence', 'Why this alternative?'] : wide ? ['Increase budget by 15%', 'Create new phase']
    : page === 'value' || altPage?.tab === 'value' ? ['Explain these value models', 'Explain the baseline value'] : page === 'details' ? ['Explain gaps in confidence', 'Draft value assessment']
    : ['Generate annualized outcome risk by risk type chart', 'Compare to best practice'];
  return (
    <AppShell navBar={navBar} header={header}
      sideNav={<RfSideNav title="Investment" items={nav} value={page} onSelect={id => !/^alt-\d+$/.test(id) && setPage(id)} defaultCollapsed={wide} />}
      bottom={<BottomSheet type="documents" documents={{ label: `${refine.docs.length} Documents`, onClick: () => setRefine(r => ({ ...r, docsOpen: !r.docsOpen })) }}
        onUpload={() => { setRefine(r => ({ ...r, docs: [...r.docs, { id: `d${r.docs.length}`, name: R.upload, date: 'Nov 17, 2026' }] })); toast({ title: 'Document added', description: 'Cooper’s context now has one more source' }); }}
        prompts={prompts} onPrompt={p => { if (/^Generate annualized/.test(p)) { setRefine(x => ({ ...x, widgets: [...new Set([...(x.widgets || []), 'risk-type'])], shared: true })); setPage('overview'); toast({ title: 'Cooper generated a widget', description: 'Annualized outcome risk by risk type' }); }
          else toast({ title: `Cooper: ${p}` }); }} />}>
      <div className="page-row">
        <div className="page">
          
          {page === 'compare' && <RfCompare R={R} refine={refine} setRefine={setRefine} toPlan={toPlan} compared={compared} onOpen={id => setPage(`alt-${id}-details`)}
            onEvaluate={() => setCooper({ kind: 'text', text: R.hasRisk ? `I compared the ${alts.length} alternatives on cost, risk reduced and value. ${rec.name} reduces ${rfPct(rec.reduced)} of the scored risk for ${fmtMoney(rec.cost)} (BCR ${rec.bcr ?? '—'}). ${[...alts].sort((a, b) => b.reduced - a.reduced)[0].name} reduces the most risk but costs ${fmtMoney([...alts].sort((a, b) => b.reduced - a.reduced)[0].cost)}. I’d keep ${rec.name} as recommended.`
              : `I compared the ${alts.length} alternatives on cost and value. ${rec.name} creates ${fmtValue(rec.value)} of value for ${fmtMoney(rec.cost)} (BCR ${rec.bcr ?? '—'}). ${[...alts].sort((a, b) => (b.bcr || 0) - (a.bcr || 0))[0].name} has the best return per dollar. This investment has no risk profile in the demo data, so risk isn’t compared.` })} />}
          {altPage && altPage.tab === 'details' && <RfAltDetails R={R} alt={R.alt(altPage.id)} recId={recId} toPlan={toPlan(altPage.id)} />}
          {altPage && altPage.tab === 'cost' && <RfCost R={R} alt={R.alt(altPage.id)} refine={refine} setRefine={setRefine} />}
          {altPage && altPage.tab === 'value' && <RfValue R={R} refine={refine} setRefine={setRefine} alt={R.alt(altPage.id)} />}
          {page === 'details' && <RfInvDetails R={R} refine={refine} onCooper={t => setCooper({ kind: 'text', text: t })} />}
          {page === 'value' && <RfValue R={R} refine={refine} setRefine={setRefine} />}
          {page === 'overview' && <RfOverview R={R} refine={refine} setRefine={setRefine} />}
        </div>
        {side && <div className="page-dock" style={{ height: 'calc(100vh - var(--proto-sticky-offset))' }}>
          {side !== 'comments' && refine.approvers && ['approval', 'approved'].includes(refine.status) ? <IFS.ApprovalChainPanel mode="sidebar" title="Approval chain" style={{ height: '100%', width: 'var(--region-panel-l)' }}>
              <IFS.ApprovalChainTable view="full" details currentUserId="HG" ownerId="HG" approvers={refine.approvers} onChange={a => setRefine(r => ({ ...r, approvers: a }))}
                onPush={a => setTimeout(() => setRefine(r => ({ ...r, approvers: r.approvers.map(x => x.id === a.id ? { ...x, status: 'success' } : x) })), 3000)} />
            </IFS.ApprovalChainPanel>
          : side === 'comments' ? <RfCommentsPanel threads={threads} selectedId={thread} onOpen={t => setThread(t.id || t)} onResolve={t => resolveThread(t.id || t)}
              onClose={() => setSide('confidence')} currentUser={{ name: me.name }} style={{ height: '100%' }} />
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
        <RfCommentCallout thread={t} currentUser={{ name: me.name, avatar: { initials: me.initials } }}
          onCommentsChange={cm => setRefine(r => ({ ...r, threads: r.threads.map(x => x.id === t.id ? { ...x, comments: cm } : x) }))}
          onResolve={() => resolveThread(t.id)} onUnresolve={() => setRefine(r => ({ ...r, threads: r.threads.map(x => x.id === t.id ? { ...x, resolved: false } : x) }))}
          onClose={() => setThread(null)} cooperSuggestion={t.type === 'action' && !t.resolved ? { label: 'Shape with Cooper', onClick: () => shapeWithCooper(t) } : undefined} />
      </div>; })()}
      {cooper && <div className="rf-cooper">
        {cooper.kind === 'text' && <AgentWindow text={cooper.text} onClose={() => setCooper(null)} onAsk={() => toast({ title: 'Cooper chat isn’t part of this step' })} />}
        {cooper.kind === 'recs' && (() => { const alt = R.alt(cooper.thread.altId), r = rfShapeRecs(alt); return (
          <AgentWindow text={`After analyzing comment #${cooper.thread.number}, I’ve generated a set of recommended actions to address this issue.`} onClose={() => setCooper(null)} onAsk={() => {}}>
            <RfRecGroup title="Recommended" count={1}><RfRecItem title={r.recommended.title} description={r.recommended.description} impact={r.recommended.impact} defaultExpanded
              action={{ label: 'See details', onClick: () => setCooper({ ...cooper, kind: 'detail' }) }} /></RfRecGroup>
            <RfRecGroup title="Other" count={r.other.length}>{r.other.map(o => <RfRecItem key={o.id} title={o.title} description={o.description}
              action={{ label: 'See details', onClick: () => toast({ title: o.title, description: 'Only the recommended action is scripted' }) }} />)}</RfRecGroup>
          </AgentWindow>); })()}
        {cooper.kind === 'detail' && (() => { const alt = R.alt(cooper.thread.altId), r = rfShapeRecs(alt).recommended; return (
          <AgentWindow onClose={() => setCooper(null)} onAsk={() => {}}>
            <RfRecDetail title={r.title} description={r.description} impact={r.impact} onBack={() => setCooper({ ...cooper, kind: 'recs' })} onDecline={() => setCooper(null)}
              onApply={() => { resolveThread(cooper.thread.id, `${alt.name} has been refined. Procurement starts a quarter earlier, so the replacement stage fits the outage windows. Cost and scope are unchanged.`);
                setRefine(r2 => ({ ...r2, refined: { ...r2.refined, [alt.id]: true } })); setCooper(null); toast({ title: `Comment #${cooper.thread.number} resolved`, description: `${alt.name} schedule refined` }); }} />
          </AgentWindow>); })()}
      </div>}
      {activity && <div className="rf-cooper"><IFS.ActivityPanel layout="static" title="Activity" recordLabel="investment" defaultVersions={rfVersions(R, refine)}
        approvals={refine.approvers} onOpenChange={o => !o && setActivity(false)} onOpenVersion={v => toast({ title: v.title || 'Version', description: 'Opening an older version isn’t part of this flow' })} /></div>}
      {refine.docsOpen && <div className="rf-docs"><RfPopover inline title="Documents" count={refine.docs.length} search onOpenChange={o => !o && setRefine(r => ({ ...r, docsOpen: false }))}>
        <Stack gap="100">{refine.docs.map(d => <div key={d.id} className="row rf-doc"><Icon name="system-file" size={16} /><span className="t-body-m-regular plan-ellipsis" style={{ flex: 1 }}>{d.name}</span><span className="t-body-m-regular muted">{d.date}</span></div>)}</Stack>
      </RfPopover></div>}
    </AppShell>
  );
}

/* ---------------------------------------------------------------- shared field layouts (Figma: label over value, two per row) */
const RfPairs = ({ rows, full = [], render }) => <div className="rf-pairs">{rows.map(([l, v]) => <div key={l} className={`col rf-pair${full.includes(l) ? ' is-full' : ''}`}>
  <span className="t-body-m-regular sec">{l}</span><span className="t-body-m-regular">{render ? render(l, v) : v}</span></div>)}</div>;
const RF_STATUS_IND = { Critical: 'red', Moderate: 'orange', Healthy: 'green' };
const rfStatusCell = r => <Indicator type={RF_STATUS_IND[r.status]}>{r.status}</Indicator>;
const RfToggle = ({ title, text, def = true }) => { const [on, setOn] = useState(def);
  return <ContentCard size="s" title={title} description={text} control={<Switch size="s" checked={on} onChange={setOn} aria-label={title} />} />; };

/* ---------------------------------------------------------------- Alternative comparison (Figma 48:56129 table, 48:29450 chart; J08 steps 2, 4, 8) */
function RfCompare({ R, refine, setRefine, toPlan, compared, onOpen, onEvaluate }) {
  const shown = R.alts.filter(a => compared(a.id) && toPlan(a.id)), excluded = R.alts.filter(a => !toPlan(a.id));
  const [view, setView] = useState('table'), [hub, setHub] = useState('financial');
  const setRec = id => { setRefine(r => ({ ...r, recommended: id })); toast({ title: `${R.alt(id).name} is now recommended` }); };
  const ind = (lvl, label) => lvl ? <Indicator type={{ low: 'green', medium: 'orange', high: 'red' }[lvl]}>{label || RISK_LEVEL[lvl].label}</Indicator> : '—';
  const pctOr = v => v == null ? '—' : `+${Math.round(v * 100)}%`;
  // [Added] the pad-mount program's planned outage per unit replaced (6 h); the data has no outage or vendor fields
  const rows = [
    { group: 'Financial', items: [['CAPEX', a => fmtMoney(a.capex)], ['ROI', () => '—'], ['Payback period', () => '—'], ['NPV', () => '—'], ['IRR', () => '—'], ['OPEX impact', a => fmtMoney(a.opex)]] },
    { group: 'Reliability', items: [['Risk level', a => ind(a.riskLevel)], ['Failure reduction', a => a.reduced == null ? '—' : rfPct(a.reduced)],
      ['Reliability', a => pctOr(rfMeasureCut(R, a, /Reliab/))], ['Safety', a => { const l = rfLevel(rfMeasureCut(R, a, /Safety/)); return l ? <Indicator type={/High/.test(l) ? 'green' : 'orange'}>{l}</Indicator> : '—'; }],
      ['Regulatory', a => { const l = rfLevel(rfMeasureCut(R, a, /Compliance|Regulat/)); return l || 'Minimal'; }]] },
    { group: 'Delivery', items: [['Duration', a => `${rfMonthsOf(a)} mo`], ['Outage', a => R.main && a.scope ? `${a.scope * 6} h` : '—'],
      ['Schedule risk', a => ind(rfScheduleRisk(a))], ['Vendor', () => '—']] },
    { group: 'Portfolio fit', items: [['Capital year', a => `FY${a.first.slice(0, 4)}`], ['Budget fit', () => '—'], ['Priority', () => '—'], ['Ranking', a => ind(rfRanking(R, a), { high: 'High', medium: 'Medium', low: 'Low' }[rfRanking(R, a)])]] },
  ];
  const [open, setOpen] = useState({ Financial: true, Reliability: true, Delivery: true, 'Portfolio fit': true });
  const card = a => { const isRec = a.id === refine.recommended;
    return <ContentCard key={a.id} className={isRec ? 'rf-card--rec' : undefined} title={a.name} onClick={() => onOpen(a.id)}
      bottom={<Stack gap="stack" style={{ width: '100%' }}>
        <Inline gap="200" align="baseline" wrap><span className="t-heading-h3-medium t-numeric">{fmtMoney(a.cost)}</span><span className="t-body-m-regular sec">{`~ ${a.years}`}{refine.refined[a.id] ? ' · refined' : ''}</span></Inline>
        <Inline gap="200" wrap align="center">{a.added ? <Badge size="s" color="white">Suggested by Cooper</Badge> : a.scope ? <Badge size="s" color="white">{`${a.scope} of ${R.assets.length} ${R.unit}`}</Badge> : <Badge size="s" color="white">{a.type || 'Alternative'}</Badge>}
          <span className="t-body-m-regular sec">{a.customers ? `${a.customers.toLocaleString()} customers protected` : `BCR ${a.bcr ?? '—'}`}</span></Inline>
        <div className="box col" style={{ gap: 'var(--space-50)' }}><span className="t-body-m-regular sec">Risk reduced</span>
          <span className="row" style={{ gap: 'var(--space-150)', alignItems: 'baseline' }}><span className="t-heading-h3-medium t-numeric">{a.reduced == null ? '—' : rfPct(a.reduced)}</span><span className="t-body-m-regular muted">{a.reduced == null ? 'no risk profile in the demo data' : 'of scored risk'}</span></span></div>
        {isRec ? <Button type="secondary" size="m" iconLeft="system-check" disabled>Recommended</Button>
          : <Button type="tertiary" size="m" onClick={e => { e.stopPropagation(); setRec(a.id); }}>Set as recommended</Button>}
      </Stack>} />; };
  // Chart view: the Figma radar has no DS chart, so the Comparison hub uses the kit's GroupedColumnChart (scores relative to the best alternative)
  const HUB = { financial: [['CAPEX', a => a.capex, true], ['OPEX impact', a => a.opex, true], ['Total cost', a => a.cost, true]],
    reliability: [['Failure reduction', a => a.reduced], ['Reliability', a => rfMeasureCut(R, a, /Reliab/)], ['Safety', a => rfMeasureCut(R, a, /Safety/)]],
    delivery: [['Duration', a => rfMonthsOf(a), true], ['Benefit-cost ratio', a => a.bcr]] };
  const hubData = HUB[hub].map(([label, f, lower]) => { const vs = shown.map(f), max = Math.max(...vs.filter(v => v != null), 0) || 1, min = Math.min(...vs.filter(v => v != null && v > 0), max);
    return { label, ...Object.fromEntries(shown.map((a, k) => [String(a.id), vs[k] == null ? 0 : Math.round((lower ? min / (vs[k] || max) : vs[k] / max) * 100)])) }; });
  return <>
    <RfTitle title={<span className="row" style={{ gap: 'var(--space-200)' }}>Alternative comparison<SegmentedControl size="s" value={view} onChange={setView}
        options={[{ value: 'table', iconLeft: 'layout-list', ariaLabel: 'Table view' }, { value: 'chart', iconLeft: 'system-radar-graph', ariaLabel: 'Chart view' }]} /></span>}
      text="Investment alternatives evaluated against risk and return criteria" right={<>
      <RfPopover align="end" title="Alternatives" trigger={<Button type="tertiary" size="s" iconRight="arrow-caret-down-filled">{`${shown.length} selected`}</Button>} showClose={false}>
        <NDS label="Send to plan / Compare columns" className="rf-pick">
          <span className="t-label-m-medium muted">Send to plan</span><span /><span className="t-label-m-medium muted">Compare</span>
          {R.alts.map(a => <React.Fragment key={a.id}>
            <RfCheckbox checked={toPlan(a.id)} aria-label={`Send ${a.name} to plan`} onChange={v => { setRefine(r => ({ ...r, toPlan: { ...r.toPlan, [a.id]: v } })); if (!v) toast({ title: `${a.name} removed from going to Plan`, description: 'It stays in the investment record' }); }} />
            <span className="t-body-m-regular">{a.name}</span>
            <Switch size="s" checked={compared(a.id)} aria-label={`Compare ${a.name}`} onChange={() => setRefine(r => ({ ...r, compare: { ...r.compare, [a.id]: !compared(a.id) } }))} />
          </React.Fragment>)}
        </NDS>
      </RfPopover>
      <Button type="secondary" size="s" iconLeft="system-pencil-plus" onClick={() => toast({ title: 'Add alternative isn’t designed yet', description: 'Figma has no frame for it' })}>New</Button>
      <Button type="cooper" size="s" iconLeft="cooper-system-icon" onClick={onEvaluate}>Cooper’s evaluation</Button>
    </>} />
    {excluded.length > 0 && <span className="t-body-m-regular sec t-measure">{`${excluded.map(a => a.name).join(', ')} ${excluded.length > 1 ? 'are' : 'is'} excluded from Plan and Compare, but still in the investment record.`}</span>}
    {view === 'table' ? <NDS label="Comparison grid (DS Table can't hold card columns)" className="rf-grid" style={{ '--rf-cols': shown.length }}>
      <span className="rf-grid__corner" />{shown.map(a => <div key={a.id} className="rf-grid__card">{card(a)}</div>)}
      {rows.map(g => <React.Fragment key={g.group}>
        <button className="rf-grid__group" onClick={() => setOpen(o => ({ ...o, [g.group]: !o[g.group] }))} aria-expanded={open[g.group]}>
          <Icon name={open[g.group] ? 'arrow-caret-down-filled' : 'arrow-caret-right-filled'} size={16} /><span className="t-label-m-medium">{g.group}</span><IFS.Counter>{g.items.length}</IFS.Counter></button>
        {open[g.group] && g.items.map(([label, f]) => <div key={label} className="rf-grid__row">
          <span className="t-body-m-regular sec">{label}</span>{shown.map(a => <span key={a.id} className={`t-label-m-medium t-numeric${a.id === refine.recommended ? ' is-rec' : ''}`}>{f(a)}</span>)}</div>)}
      </React.Fragment>)}
    </NDS> : <>
      <div className="ifs-grid">{shown.map(a => <div key={a.id} className="ifs-span-4">{card(a)}</div>)}</div>
      <DataVizCard title="Comparison Hub" header={{ segments: [{ value: 'financial', label: 'Financial' }, { value: 'reliability', label: 'Reliability' }, { value: 'delivery', label: 'Delivery' }], segmentValue: hub, onSegmentChange: setHub }}>
        <div style={{ width: '100%' }}><GroupedColumnChart data={hubData} series={shown.map(a => ({ key: String(a.id), label: a.name }))} format={v => `${v}`} /></div>
        <span className="t-body-m-regular muted">Score out of 100 against the best alternative on each measure (lower cost and duration score higher).</span>
      </DataVizCard>
      <RfCard title="Trade-offs"><div className="ifs-grid">{[['Capital cost', 'Lower is better', a => a.cost, v => fmtMoney(v)], ['Risk reduction', 'Higher is better', a => a.reduced == null ? 0 : Math.round(a.reduced * 100), v => `${v}%`],
        ['Value', 'Higher is better', a => Math.round(a.value), v => fmtValue(v)]].map(([t, hint, f, fmt]) => <div key={t} className="ifs-span-4 col" style={{ gap: 'var(--space-200)' }}>
          <span className="row" style={{ gap: 'var(--space-200)' }}><span className="t-label-m-medium">{t}</span><span className="t-body-m-regular muted">{hint}</span></span>
          <IFS.BarChart data={shown.map(a => ({ label: a.name, value: f(a) }))} valueLabel={t} format={fmt} labelWidth={140} /></div>)}</div></RfCard>
    </>}
  </>;
}

/* ---------------------------------------------------------------- Alternative › Details (Figma 53:209948; J08 step 5) */
function RfAltDetails({ R, alt, recId, toPlan }) {
  const rank = 1 + R.alts.filter(a => R.hasRisk ? a.reduced > alt.reduced : (a.bcr || 0) > (alt.bcr || 0)).length;
  const scopeRows = rfAssetRows(R.assets, alt.scope || R.assets.length);
  return <>
    <RfTitle title="Alternative details" text="Alternative details, scope, cost, risk reduction, and expected value"
      right={alt.id === recId ? <Button type="secondary" size="s" iconLeft="system-check" disabled>Recommended</Button> : null} />
    {!toPlan && <span className="t-body-m-regular sec t-measure">Excluded from Plan and Compare, but still in the investment record.</span>}
    <RfStats cards={[{ size: 's', title: 'Rank', value: `#${rank}`, caption: alt.id === recId ? 'Recommended' : R.hasRisk ? 'by risk reduced' : 'by benefit-cost ratio' },
      { size: 's', title: 'Risk reduced', value: alt.reduced == null ? '—' : rfPct(alt.reduced), caption: alt.reduced == null ? 'no risk profile' : 'of scored risk' }, { size: 's', title: 'Customers protected', value: alt.customers ? fmtCompact(alt.customers) : '—' },
      { size: 's', title: 'Scope', value: alt.scope ? (alt.scope === R.assets.length ? `All ${alt.scope} ${R.unit}` : `${alt.scope} of ${R.assets.length}`) : '—' }]} />
    <RfCard title="Identity & Classification" actions={<Button type="cooper" size="s" iconLeft="cooper-system-icon" onClick={() => toast({ title: 'Edit with Cooper', description: 'Works as on Shape: tell Cooper what to change' })}>Edit with Cooper</Button>}>
      <RfPairs full={['Name', 'Description']} rows={[['Name', alt.name], ['Description', altDesc(alt.name)], ['Code', `ALT-${String(alt.id).slice(-6)}`], ['Type', alt.type || '—'],
        ['Creator', alt.added ? 'Cooper (suggested)' : 'Cooper'], ['Created date', rfDayLabel(R.inv.createdDate)]]} />
    </RfCard>
    <RfCard title="Dates"><RfPairs rows={[['End of alternative', rfDayLabel(alt.last)], ['Pause date', '—'], ['Resume date', '—']]} /></RfCard>
    <RfCard title="Restrictions"><Stack gap="stack">
      <RfToggle title="Allow alternative to be chosen as recommended" text="Allows this alternative to be selected as the recommended option for the investment." />
      <RfToggle title="Allow alternative to be shifted" text="Allows this alternative to be moved to a different year or planning period." />
    </Stack></RfCard>
    <RfCard title="Scope"><RfTable rowHeight={52} search={<IFS.SmartSearch placeholder="Ask anything about assets" />} columns={[{ key: 'asset', title: 'Asset', width: '1.4fr', primary: true }, { key: 'segment', title: 'Segment', width: '1fr' },
      { key: 'status', title: 'Status', width: '1fr', render: rfStatusCell }, { key: 'score', title: 'Risk score', type: 'number', width: 'var(--table-col-number-min)' }]} rows={scopeRows} defaultSort={{ key: 'score', dir: 'desc' }} />
      {!scopeRows.length && <EmptyState cause="empty-container" size="section" heading="No assets in scope" body="The demo data links no assets to this investment." />}</RfCard>
  </>;
}

/* ---------------------------------------------------------------- Alternative › Cost & Schedule (Figma 96:82370 Gantt, 76:8795 Table; J08 step 5, J10) */
const RF_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function RfCost({ R, alt, refine, setRefine }) {
  const [view, setView] = useState('gantt'), [scale, setScale] = useState('month');
  const [sel, setSel] = useState(null);                 // { stage, period } (stage may be a sub-stage id)
  const [adj, setAdj] = useState(null);                 // Adjust by % dialog value
  const [openStages, setOpenStages] = useState({ design: true });
  const plan = costPlan(alt, refine.adjust[alt.id] || {}, R.stages);
  const rowsOf = st => [st, ...(openStages[st.id] && st.id === 'design' ? rfSubPlan(st).map(x => ({ ...x, sub: true, type: '—' })) : [])];
  const periods = rfPeriods(plan, scale), amount = (st, p) => rfAmount(st, scale, p.key);
  const total = plan.reduce((t, s) => t + s.total, 0), perTot = p => plan.reduce((t, s) => t + amount(s, p), 0);
  let run = 0; const cum = periods.map(p => (run += perTot(p)));
  const all = plan.flatMap(rowsOf), st = sel && all.find(s => s.id === sel.stage), selP = sel && periods.find(p => p.key === sel.period);
  const stageOfSel = st && (st.sub ? plan.find(x => x.id === 'design') : st);
  const pLabel = p => scale === 'year' ? p.label : `${p.label} ${p.group}`;
  const isEst = s => R.estimate.includes(s.id) && alt.id === (R.threads().find(t => t.id === 't56') || {}).altId;
  // timeline axis = the periods; a date's position = its period index + how far into the period it is
  const slotOf = d => { const t = rfDay(d), y = t.getFullYear(), m = t.getMonth(), f = (t.getDate() - 1) / 31;
    const key = scale === 'year' ? String(y) : scale === 'month' ? `${y}-${String(m + 1).padStart(2, '0')}` : `${y}-Q${Math.floor(m / 3) + 1}`;
    const k = periods.findIndex(p => p.key === key), frac = scale === 'year' ? (m + f) / 12 : scale === 'month' ? f : ((m % 3) + f) / 3;
    return k < 0 ? (key < periods[0].key ? 0 : periods.length) : k + frac; };
  const groups = [...new Set(periods.map(p => p.group))].map(g => ({ label: g, slots: periods.filter(p => p.group === g).map(p => scale === 'year' ? `FY${p.key.slice(2)}` : p.label) }));
  const scaleCtl = <SegmentedControl size="s" value={scale} onChange={v => { setScale(v); setSel(null); }} options={[{ value: 'year', label: 'Year' }, { value: 'quarter', label: 'Quarter' }, { value: 'month', label: 'Month' }]} />;
  const cols = ['Stage', 'Total cost', 'Days', 'Type', 'Start date', 'End date'];
  return <>
    <RfTitle title="Alternative cost & schedule" text="Alternative details, scope, cost, risk reduction, and expected value"
      right={<SegmentedControl size="s" value={view} onChange={setView} options={[{ value: 'gantt', label: 'Gantt' }, { value: 'table', label: 'Table' }]} />} />
    <ContentCard top={<div className="row" style={{ width: '100%', justifyContent: 'space-between' }}>
      <Inline gap="200" align="center">
        {view === 'table' && <Button type="tertiary" size="s" iconRight="arrow-caret-down-filled" onClick={() => toast({ title: 'Columns aren’t part of this flow' })}>Columns</Button>}
        <Button type="tertiary" size="s" iconRight="arrow-caret-down-filled" onClick={() => toast({ title: 'Views aren’t part of this flow' })}>View</Button></Inline>
      <Inline gap="200" align="center">{scaleCtl}{view === 'table' && <IconButton icon="system-settings" type="tertiary" size="s" label="Table settings" onClick={() => toast({ title: 'Table settings aren’t part of this flow' })} />}</Inline>
    </div>} bottom={<Stack gap="200" style={{ width: '100%' }}>
      {view === 'table' ? <>
        <NDS label="Formula bar" className="rf-formula row">
          <span className="t-code-m-regular muted">ƒx</span>
          <span className="t-code-m-regular" style={{ flex: 1 }}>{st && selP ? (scale === 'year' && !st.sub
            ? `${st.name} ${selP.key} = Σ spend ${selP.key} ${fmtMoney((alt.costByYear || alt.spendByYear)[selP.key])} × ${Math.round(st.share * 100)}% stage share${(refine.adjust[alt.id] || {})[st.id] ? ` × ${100 + refine.adjust[alt.id][st.id]}%` : ''} = ${fmtMoney(amount(st, selP))}`
            : `${st.name} ${pLabel(selP)} = ${st.sub ? `${Math.round(st.share * 100)}% of ${stageOfSel.name}` : `${st.name} ${selP.group}`} spread linearly over its months = ${fmtMoney(amount(st, selP))}`) : ''}</span>
          {st && !st.sub && <><Button type="tertiary" size="s" onClick={() => setAdj('10')}>Adjust by %</Button>
            <Button type="tertiary" size="s" onClick={() => toast({ title: 'Shift dates isn’t part of this flow', description: 'Ask Cooper to shift stages' })}>Shift dates</Button></>}
        </NDS>
        <NDS label="Cost & schedule grid (spreadsheet: not in DS)" className="rf-sheet" style={{ '--rf-years': periods.length }}>
          <span className="rf-sheet__l" />{[...cols, ...periods].map((h, i) => <span key={`l${i}`} className="rf-sheet__l t-body-m-regular muted">{RF_LETTERS[i] || ''}</span>)}
          <span className="rf-sheet__n" />{cols.map(h => <span key={h} className="rf-sheet__h t-label-m-medium">{h}</span>)}
          {periods.map((p, i) => <span key={p.key} className="rf-sheet__h col t-label-m-medium">{(i === 0 || periods[i - 1].group !== p.group) && scale !== 'year' ? <span className="t-body-m-regular">{p.group}</span> : null}{p.label}</span>)}
          {plan.map((s, n) => rowsOf(s).map(x => <React.Fragment key={x.id}>
            <span className="rf-sheet__n t-body-m-regular muted">{x.sub ? '' : n + 1}</span>
            <span className={`row rf-sheet__stage${x.sub ? ' rf-sheet__sub' : ''}`} style={{ gap: 'var(--space-200)' }}>
              <span className="row" style={{ gap: 'var(--space-100)', flexWrap: 'nowrap' }}>{!x.sub && <IconButton icon={x.id === 'design' ? (openStages.design ? 'arrow-caret-down-filled' : 'arrow-caret-right-filled') : 'arrow-caret-right-filled'} type="ghost" size="s" label={`Expand ${x.name}`}
                onClick={() => x.id === 'design' ? setOpenStages(o => ({ ...o, design: !o.design })) : toast({ title: `${x.name} has no sub-stages yet` })} />}
              <span className="t-label-m-medium">{x.name}</span></span>
              {!x.sub && isEst(x) && (refine.estimated || {})[x.id] ? <Badge size="s" color="white">Estimator reviewed</Badge>
                : !x.sub && isEst(x) ? <button className="rf-needs" onClick={() => { setRefine(r => ({ ...r, estimated: { ...(r.estimated || {}), [x.id]: true } })); toast({ title: `${x.name} estimate confirmed`, description: 'The line now carries the estimator’s basis' }); }}>
                  <Indicator type="orange">Needs estimate</Indicator></button> : null}</span>
            <span className="t-numeric">{fmtMoney(x.total)}</span><span className="t-numeric">{x.days}</span><span>{x.type}</span>
            <span className="t-numeric">{rfDayLabel(x.start)}</span><span className="t-numeric">{rfDayLabel(x.end)}</span>
            {periods.map(p => { const v = amount(x, p); return <button key={p.key} className={`rf-cell t-numeric${sel && sel.stage === x.id && sel.period === p.key ? ' is-on' : ''}`} onClick={() => setSel({ stage: x.id, period: p.key })}>{v >= 1 ? fmtMoney(v) : '—'}</button>; })}
          </React.Fragment>))}
          <span className="rf-sheet__n" /><span className="t-label-m-medium">Total cost</span><span className="t-label-m-medium t-numeric">{fmtMoney(total)}</span><span /><span /><span /><span />
          {periods.map((p, i) => <span key={p.key} className="col t-numeric"><span className="t-label-m-medium">{fmtMoney(perTot(p))}</span><span className="muted">{`Σ ${fmtMoney(cum[i])}`}</span></span>)}
        </NDS>
      </> : <NDS label="Scroll area for the timeline (the kit Gantt fits its width)" className="rf-gantt" style={{ '--rf-slots': periods.length }}><RfTimeline title="Stage" groups={groups}
          phases={plan.map(s => ({ id: s.id, title: s.name, subtitle: `${s.type} · ${rfDayLabel(s.start)} – ${rfDayLabel(s.end)} · ${fmtMoney(s.total)}`, color: s.color,
            start: Math.max(0, slotOf(s.start)), end: Math.min(periods.length, Math.max(slotOf(s.end), slotOf(s.start) + 0.3)), defaultExpanded: s.id === 'design',
            tasks: [...(s.id === 'design' ? rfSubPlan(s).map(x => ({ title: x.name, label: fmtMoney(x.total), start: slotOf(x.start), end: Math.max(slotOf(x.end), slotOf(x.start) + 0.2) })) : []),
              ...alt.milestones.filter(m => m.forecastDate >= s.start && m.forecastDate <= s.end).map(m => ({ title: m.name, label: rfDayLabel(m.forecastDate), start: slotOf(m.forecastDate), end: slotOf(m.forecastDate) + 0.2 }))] }))} /></NDS>}
      {view === 'gantt' && <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-label-m-medium">Total cost</span><span className="t-label-m-medium t-numeric">{fmtMoney(total)}</span></div>}
    </Stack>} />
    <Modal open={adj !== null} onOpenChange={o => !o && setAdj(null)} title="Adjust by %" 
      secondaryAction={{ label: 'Cancel', onClick: () => setAdj(null) }}
      primaryAction={{ label: 'Apply', onClick: () => { const v = parseFloat(adj) || 0; setRefine(r => ({ ...r, adjust: { ...r.adjust, [alt.id]: { ...(r.adjust[alt.id] || {}), [st.id]: v } } })); setAdj(null); toast({ title: `${st.name} adjusted by ${v}%`, description: 'Every year of the stage changes' }); } }}>
      <TextField label={st ? `${st.name}: change every year by` : ''} value={adj || ''} onChange={e => setAdj(e.target ? e.target.value : e)} suffix="%" />
    </Modal>
  </>;
}

/* ---------------------------------------------------------------- Investment details: General · Cost & Schedule · Relationships (Figma 43:301879, 43:302377, 43:302585) */
function RfInvDetails({ R, refine, onCooper }) {
  const [tab, setTab] = useState('general');
  const d = rfInvDetails(R, refine), initials = n => n.split(' ').map(w => w[0]).join('');
  const val = (l, v) => l === 'Owner' || l === 'Creator' ? (v === '—' ? v : <span className="row" style={{ gap: 'var(--space-200)' }}><Avatar size="s" initials={initials(v)} type={l === 'Owner' ? 'blue' : 'light-blue'} />{v}</span>)
    : l === 'Stage' ? <Indicator type={{ Refining: 'purple', 'Under review': 'orange', Approved: 'green', Executing: 'blue' }[v] || 'purple'}>{v}</Indicator>
    : l === 'Must do' || l === 'Forecast has adjustments' ? <Badge size="s" color={v === 'Yes' ? 'green' : 'white'}>{v}</Badge>
    : l === 'Alternatives created' ? <IFS.Counter>{v}</IFS.Counter>
    : l === 'Code' ? <span className="row" style={{ gap: 'var(--space-100)' }}>{v}<IconButton icon="copy" type="ghost" size="s" label="Copy code" onClick={() => toast({ title: 'Code copied', description: v })} /></span>
    : l === 'Percent complete' ? <span className="row" style={{ gap: 'var(--space-200)', width: '100%' }}><ProgressBar value={v} label="Percent complete" /><span className="t-numeric">{`${v}%`}</span></span> : v;
  const assets = rfAssetRows(R.assets), risks = rfRisks(R, refine.recommended);
  return <>
    <RfTitle title="Investment details" text="Core investment details, context, and current status" />
    <RfTabs value={tab} onChange={setTab} items={[{ value: 'general', label: 'General' }, { value: 'cost', label: 'Cost & Schedule' }, { value: 'rel', label: 'Relationships' }]} />
    {tab === 'general' ? <>
      <RfCard title="Identity & Classification" actions={<Button type="cooper" size="s" iconLeft="cooper-system-icon" onClick={() => onCooper(`Tell me what to change in ${R.inv.name}'s details and I’ll draft it for you to accept.`)}>Edit with Cooper</Button>}>
        <RfPairs rows={d.identity} full={['Name', 'Description', 'Alternatives created']} render={val} /></RfCard>
      <RfCard title="Ownership & Organization"><RfPairs rows={d.ownership} render={val} /></RfCard>
      <RfCard title="Dates"><RfPairs rows={d.dates} render={val} /></RfCard>
      <RfCard title="Restrictions"><Stack gap="stack">
        <RfToggle title="Lock forecast and value assessment" text="Prevents edits to the forecast and value assessment while under review." />
        <RfToggle title="Must-do with recommended alternative" text="Bypasses optimization — always funded, using the recommended alternative." def={false} />
      </Stack></RfCard>
    </> : tab === 'cost' ? <RfCard title="Cost & Schedule"><RfPairs rows={d.forecast} render={val} /></RfCard> : <>
      <RfCard title="Dependencies"><RfTable rowHeight={60} onRowClick={r => onCooper(`${r.name} (${r.code}). ${r.why} I linked it because of that, and I’m tracking its status and impact on this investment.`)}
        search={<IFS.SmartSearch placeholder="Ask anything about investments" />}
        columns={[{ key: 'name', title: 'Investment', width: '2fr', primary: true, render: r => <span className="col"><span className="t-label-m-medium">{r.name}</span><span className="t-body-m-regular muted">{r.code}</span></span> },
          { key: 'type', title: 'Dependency type', width: '1.2fr', render: r => <Badge size="s" color="white">{r.type}</Badge> },
          { key: 'progress', title: 'Progress', width: '1fr', render: r => <span className="row" style={{ gap: 'var(--space-200)', width: '100%' }}><ProgressBar value={r.progress} label={`${r.name} progress`} /><span className="t-numeric">{r.progress}%</span></span> },
          { key: 'cost', title: 'Cost', type: 'number', width: 'var(--table-col-number-min)', render: r => fmtMoney(r.cost) },
          { key: 'value', title: 'Value', type: 'number', width: 'var(--table-col-number-min)', render: r => fmtValue(r.value) }]} rows={R.deps} />
        {!R.deps.length && <EmptyState cause="empty-container" size="section" heading="No dependencies" body="Cooper found no linked investments for this one in the demo data." />}</RfCard>
      <RfCard title="Assets Impacted"><RfTable rowHeight={52} columns={[{ key: 'asset', title: 'Asset', width: '1.4fr', primary: true }, { key: 'segment', title: 'Segment', width: '1fr' },
        { key: 'status', title: 'Status', width: '1fr', render: rfStatusCell }, { key: 'score', title: 'Risk score', type: 'number', width: 'var(--table-col-number-min)' }]} rows={assets} defaultSort={{ key: 'score', dir: 'desc' }} />
        {!assets.length && <EmptyState cause="empty-container" size="section" heading="No assets linked" body="The demo data links no assets to this investment." />}</RfCard>
      <RfCard title="Risks Impacted"><RfTable rowHeight={52} columns={[{ key: 'risk', title: 'Risk', width: '1.6fr', primary: true }, { key: 'status', title: 'Status', width: '1fr', render: rfStatusCell },
        { key: 'share', title: 'Risk score', type: 'number', width: 'var(--table-col-number-min)', render: r => rfPct(r.share) }]} rows={risks} />
        {!risks.length && <EmptyState cause="empty-container" size="section" heading="No risk profile" body="The demo data has no risk profile for this investment." />}</RfCard>
    </>}
  </>;
}

/* ---------------------------------------------------------------- J09 · Value: models, a model's measures, questionnaire (Figma 48:146320) */
function RfValue({ R, refine, setRefine, alt: scoped }) {
  const alt = scoped || R.alt(refine.recommended), raw = R.raw.find(a => a.id === alt.id);
  const models = (refine.models || R.models.map(m => m.id)).map(id => R.models.find(m => m.id === id) || (refine.added || []).find(m => m.id === id)).filter(Boolean);
  const answers = refine.answers || {};
  const qs = R.questions.map(q => answers[q.id] ? { ...q, answer: answers[q.id], by: 'you-done' } : q);
  const needs = m => qs.filter(q => q.model === m.name && !q.answer).length;
  const [open, setOpen] = useState(null), [tab, setTab] = useState('measures'), [lib, setLib] = useState(false), [answering, setAnswering] = useState(null);
  const scored = models.filter(m => m.measure), avg = scored.length ? scored.reduce((t, m) => t + measureReduced(raw, m.measure), 0) / scored.length : null;
  const fy = y => `FY${String(y).slice(2)}`, yrs = Object.keys(alt.spendByYear).sort();
  if (open) {
    const m = models.find(x => x.id === open), base = measureBaseline(raw, m.measure);
    const rows = [{ id: 'base', rank: '', name: 'Baseline', note: 'Shared reference', byYear: base },
      ...[...R.alts].sort((a, b) => measureReduced(R.raw.find(x => x.id === b.id), m.measure) - measureReduced(R.raw.find(x => x.id === a.id), m.measure)).map((a, k) => {
        const r = R.raw.find(x => x.id === a.id), b = measureBaseline(r, m.measure);
        return { id: a.id, rank: k + 1, name: a.name, note: 'Change · avoided risk', byYear: Object.fromEntries(RF_RISK_YEARS.map(y => [y, Math.max(0, b[y] - ((r.riskResidualByMeasure[m.measure] || {})[y] || 0))])) }; })];
    const shown = RF_RISK_YEARS.slice(0, 6);
    return <>
      <Inline gap="200" align="center"><IconButton icon="arrow-left" type="ghost" size="s" label="Back to value models" onClick={() => setOpen(null)} />
        <span className="t-heading-h3-medium">{m.name}</span></Inline>
      <span className="t-body-m-regular sec">{`Risk on the ${m.measure.toLowerCase()} measure, before and after each alternative. Change = baseline − outcome.`}</span>
      <RfTabs value={tab} onChange={setTab} items={[{ value: 'measures', label: 'Value measures' }, { value: 'q', label: 'Questionnaire answers', count: qs.filter(q => q.model === m.name).length }]} />
      {tab === 'measures' ? <>
        <RfCard title={`${m.measure}, by year`} actions={<Button type="cooper" size="s" iconLeft="cooper-system-icon" onClick={() => toast({ title: 'Value updated', description: 'Cooper recalculated the measure with the latest answers' })}>Edit with Cooper</Button>}>
          <Stack gap="200">
            <NDS label="Formula line" className="rf-formula row"><span className="t-code-m-regular muted">ƒx</span><span className="t-code-m-regular">Change = Baseline − Outcome, where Outcome = Risk likelihood × Risk consequence</span></NDS>
            <RfTable rowHeight={48} columns={[{ key: 'rank', title: 'Rank', width: 'var(--table-col-check)' }, { key: 'name', title: 'Value', width: '1.6fr', primary: true, render: r => <span className="col"><span className="t-label-m-medium">{r.name}</span><span className="t-body-m-regular muted">{r.note}</span></span> },
              ...shown.map(y => ({ key: y, title: fy(y), type: 'number', render: r => Math.round(r.byYear[y]).toLocaleString() })), { key: 'sum', title: 'Σ', type: 'number', render: r => <span className="t-label-m-medium">{Math.round(rfSum(r.byYear)).toLocaleString()}</span> }]} rows={rows} />
          </Stack>
        </RfCard>
        <RfCard title="Residual Risk"><div style={{ width: '100%' }}><LineChart data={RF_RISK_YEARS.map(y => ({ label: fy(y), base: Math.round(base[y]), ...Object.fromEntries(R.alts.map(a => [a.id, Math.round(((R.raw.find(x => x.id === a.id).riskResidualByMeasure[m.measure]) || {})[y] || 0)])) }))}
          series={[{ key: 'base', label: 'Baseline', dashed: true }, ...R.alts.map(a => ({ key: String(a.id), label: a.name }))]} /></div></RfCard>
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
    <RfStats cards={[{ size: 's', title: 'Total avg value created', value: fmtValue(alt.value / Math.max(1, +RF_RISK_YEARS[RF_RISK_YEARS.length - 1] - +yrs[0] + 1)), caption: 'value score per year' }, { size: 's', title: 'Avg risk reduction', value: avg == null ? '—' : rfPct(avg) },
      { size: 's', title: 'Benefit-cost ratio', value: alt.bcr ? String(alt.bcr) : '—' }, { size: 's', title: 'Evaluation horizon', value: `${fy(yrs[0])}–${fy(RF_RISK_YEARS[RF_RISK_YEARS.length - 1])}` }]} />
    <RfCard title="Selected Models" actions={<Button type="tertiary" size="s" iconLeft="system-plus" onClick={() => setLib(true)}>Add</Button>}>
      <RfTable rowHeight={48} rowProps={r => ({ 'data-model': r.id })} onRowClick={r => { if (!r.measure) { toast({ title: r.name, description: 'This measure has no risk profile in the demo data, so there is nothing to break down by year' }); return; } setOpen(r.id); setTab(needs(r) ? 'q' : 'measures'); }} columns={[
        { key: 'name', title: 'Value model', width: '1.4fr', primary: true },
        { key: 'status', title: 'Status', width: '1fr', render: r => needs(r) ? <span className="row" style={{ gap: 'var(--space-150)' }}><Indicator type="orange">Needs input</Indicator><IFS.Counter>{`0/${needs(r)}`}</IFS.Counter></span> : <Indicator type="green">Ready</Indicator> },
        { key: 'measures', title: 'Measures', type: 'number', width: 'var(--table-col-number-min)' },
        { key: 'output', title: 'Output', width: '1.6fr', render: r => <span className="row" style={{ gap: 'var(--space-100)', minWidth: 0 }}><Badge size="s" color="white">{r.output[0]}</Badge>{r.output.length > 1 && <Badge size="s" color="white">{`+${r.output.length - 1}`}</Badge>}</span> },
        { key: 'red', title: 'Risk reduction', type: 'number', width: 'var(--table-col-number-min)', render: r => r.measure ? rfPct(measureReduced(raw, r.measure)) : '—' },
        { key: 'del', title: '', width: 'var(--table-col-action)', render: r => <IconButton icon="system-trash-delete" type="ghost" size="s" label={`Remove ${r.name}`}
          onClick={e => { e.stopPropagation(); setRefine(x => ({ ...x, models: (x.models || R.models.map(mm => mm.id)).filter(id => id !== r.id) })); toast({ title: `${r.name} removed`, description: 'Cooper recalculated the investment value',
            primaryAction: { label: 'Undo', onClick: () => setRefine(x => ({ ...x, models: [...(x.models || []), r.id] })) } }); }} /> }]} rows={models} />
    </RfCard>
    {lib && <div className="rf-cooper"><Panel title="Models" actions={<PanelClose onClose={() => setLib(false)} />} className="proto-fill">
      <Stack gap="stack">{RF_MODEL_LIBRARY.filter(l => !models.some(m => m.id === l.id)).map(l => <ContentCard key={l.id} size="s" title={l.name} description={l.text} iconRight="system-plus"
        onClick={() => { setRefine(x => ({ ...x, added: [...(x.added || []), { id: l.id, name: l.name, measures: 1, output: [l.name] }], models: [...(x.models || R.models.map(mm => mm.id)), l.id] })); setLib(false); toast({ title: `${l.name} added`, description: 'Cooper will ask for its inputs' }); }} />)}</Stack>
    </Panel></div>}
  </>;
}

/* ---------------------------------------------------------------- J09 · Investment overview, widgets (Figma 58:31703) */
function RfOverview({ R, refine, setRefine }) {
  const alt = R.alt(refine.recommended), widgets = refine.widgets || [];
  const baseRisk = rfSum(alt.baselineByYear);
  const generate = () => { if (!widgets.includes('risk-type')) setRefine(x => ({ ...x, widgets: [...(x.widgets || []), 'risk-type'], shared: true })); };
  const raw = R.raw.find(a => a.id === alt.id);
  const [metric, setMetric] = useState('value'), pos = rfPosition(R, alt);
  const why = `${R.main ? `This program replaces the oldest distribution equipment in Alpine Meadows, protecting ~${CLUSTER.customers.toLocaleString()} customers from outages. ` : ''}${alt.name} costs ${fmtMoney(alt.cost)} over ${alt.years} for a value score of ${fmtValue(alt.value)}${alt.reduced != null ? ` and reduces ${rfPct(alt.reduced)} of the scored risk` : ''}. At a BCR of ${alt.bcr ?? '—'} it ranks #${pos.rank} of ${pos.total} Whistler investments, in the ${pos.standing.toLowerCase()}.`;
  return <>
    <RfTitle title="Investment overview" text="High-level investment summary, key metrics, and current progress"
      right={<Button type="secondary" size="s" iconLeft="system-plus" onClick={generate}>Widgets</Button>} />
    <RfStats cards={[{ size: 's', title: 'Benefit-cost ratio', value: alt.bcr ? String(alt.bcr) : '—', caption: 'Benefit returned per $1 spent' }, { size: 's', title: 'Estimated cost', value: fmtMoney(alt.cost), caption: 'Expected delivery cost' },
      { size: 's', title: 'Investment value', value: fmtValue(alt.value), caption: 'Total expected value' }, { size: 's', title: 'Baseline risk', value: baseRisk ? Math.round(baseRisk).toLocaleString() : '—', caption: baseRisk ? 'Risk before intervention, 2026–2035' : 'No risk profile in the demo data' }]} />
    <div className="ifs-grid is-halves">
      <RfCard title="Investment Details"><div className="ad-field rf-fields">
        {[['Name', R.inv.name], ['Code', R.inv.code], ['Type', R.inv.type || 'Program'], ['Planning portfolio', R.inv.portfolio || '—'], ['Problem statement', R.inv.description || '—']].map(([l, v]) => <React.Fragment key={l}><span className="t-body-m-regular sec">{l}</span><span className="t-body-m-regular">{v}</span></React.Fragment>)}
      </div></RfCard>
      <RfCard title="Affected Assets & Area"><NDS label="3D map (MapLibre)" style={{ position: 'relative', height: 'var(--proto-map-h)', borderRadius: 'var(--radius-radius-200)', overflow: 'hidden' }}>
        {R.assets.length ? <MapView labels={false} lenses={INITIAL_LENSES} year={END} interactive={false} focus={R.assets.map(a => a.id)} />
          : <EmptyState cause="empty-container" size="section" heading="No assets linked" body="The demo data links no assets to this investment, so there is nothing to map." />}</NDS></RfCard>
      <RfCard title="Yearly Forecast"><div style={{ width: '100%' }}><ColumnChart data={Object.entries(alt.costByYear || alt.spendByYear).sort(([a], [b]) => a.localeCompare(b)).filter(([, v]) => v).map(([y, v]) => ({ label: `FY${y.slice(2)}`, value: v }))} valueLabel="Spend" format={v => fmtMoney(v)} /></div></RfCard>
      <RfCard title="Investment Value"><div style={{ width: '100%' }}><IFS.BarChart data={alt.valueByMeasure.map(m => ({ label: m.measure.replace(' Risk', ''), value: Math.round(m.value) }))} valueLabel="Value" labelWidth={160} /></div></RfCard>
      {widgets.includes('risk-type') && R.measures.length > 0 && <RfCard title="Annualized Outcome Risk by Risk Type"><div style={{ width: '100%' }}>
        <LineChart data={RF_RISK_YEARS.map(y => ({ label: `FY${y.slice(2)}`, ...Object.fromEntries(R.measures.map(m => [m, Math.round((raw.riskResidualByMeasure[m] || {})[y] || 0)])) }))} series={R.measures.map(m => ({ key: m, label: m.replace(' Risk', '') }))} /></div></RfCard>}
    </div>
    <RfCard title="Compare to Other Investments" actions={<Select size="s" options={['Portfolio level', 'Region level', 'Asset class']} defaultValue="Portfolio level" clearable={false} onChange={v => toast({ title: v, description: 'Comparison scope is illustrative' })} />}>
      <Stack gap="400">
        <div className="ifs-grid">{[['Rate', `#${pos.rank}`, `of ${pos.total} investments`], ['Percentile', `${pos.pct}th`], ['Standing', pos.standing], ['Alternative', alt.name]]
          .map(([t, v, d]) => <div key={t} className="ifs-span-3"><StatCard size="s" title={t} value={v} description={d} descriptionPosition="inline" /></div>)}</div>
        <DataVizCard title="Investment Position" header={{ segments: [{ value: 'value', label: 'Value vs Cost' }, { value: 'eff', label: 'Efficiency' }], segmentValue: metric, onSegmentChange: setMetric }} onCooper={() => toast({ title: 'Cooper: Investment position' })}>
          <div style={{ width: '100%' }}><IFS.ScatterChart xLabel="Forecast cost" yLabel={metric === 'value' ? 'Forecast value' : 'Benefit-cost ratio'}
            data={pos.points.map(p => ({ label: p.name, x: p.cost, y: metric === 'value' ? p.value : (p.bcr || 0), series: p.me ? 'me' : 'all' }))}
            series={[{ key: 'all', label: 'Whistler investments' }, { key: 'me', label: R.inv.name }]} xFormat={v => fmtMoney(v)} yFormat={v => metric === 'value' ? fmtValue(v) : String(v)}
            xReference={pos.medCost} yReference={metric === 'value' ? pos.medValue : undefined} referenceLabel="Median" /></div>
        </DataVizCard>
      </Stack>
    </RfCard>
    <div className="ifs-grid is-halves">
      <RfCard title="Why This Investment Matters"><p className="t-body-m-regular" style={{ margin: 0 }}>{why}</p></RfCard>
      <RfCard title="Similar Investments by BCR"><NDS label="List rows" className="col" style={{ gap: 'var(--space-100)' }}>
        {pos.similar.map(p => <div key={p.id} className="row box" style={{ justifyContent: 'space-between', padding: 'var(--space-300)', background: p.me ? 'var(--background-elevation-1-tertiary)' : undefined }}>
          <span className="t-body-m-regular plan-ellipsis">{p.name}</span>{!p.me && <span className="t-body-m-regular t-numeric">{`${p.bcr ?? '—'} BCR`}</span>}</div>)}
      </NDS></RfCard>
    </div>
    {refine.shared && <div className="build-snack"><IFS.Snackbar title="Widget shared with your team" onClose={() => setRefine(x => ({ ...x, shared: false }))}>
      {`${PEOPLE.LF.name} · ${PEOPLE.NL.name}`}</IFS.Snackbar></div>}
  </>;
}
