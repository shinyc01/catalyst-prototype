/* Plan: Setup (Data readiness · Planning groups · Scenarios), the optimisation run, and Plan home.
   Figma: Plan handover Dv3HzkcFTTrb4E34zLF7cy — Setup 85:157926 / 85:158979 / 85:162876, Optimizing 85:83781. Constraint editing
   follows "Send to Plan" U7AUNbrWHYuX3E0O4GbfEx 103:63527. Data and rules: shared/whistler-plan.js + shared/plan-model.js.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
const { useIssueReport, ConfidenceGates, IssueKindSwitch, IssueNavigator, ScatterChart, Table, Tabs, SmartSearch, SideNavTree,
  StatCardsRow, ReadinessStatus, Counter, NotificationCard, GroupedColumnChart, ColumnChart, Checkbox, ProgressRing, Snackbar, Timeline, TimelineItem, IconButton: IB, BarChart } = IFS;

const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
const fmtPct = v => `${Math.round(v * 100)}%`;
const fmtNum = v => Math.round(v).toLocaleString('en-US');
const fmtUnit = (v, unit) => v == null ? '—' : unit === '$' ? fmtMoney(v) : fmtCompact(v);
const PLAN_TITLE = PLAN_PORTFOLIO.name;
const ownerName = k => (PEOPLE[k] || {}).name || k;

// Card with the Figma header: H4 title (DS 2.0.1, was uppercase) on the left, Cooper icon-button on the right
const PSec = ({ title, extra, children, style }) => (
  <ContentCard style={style} top={
    <div className="row" style={{ width: '100%', justifyContent: 'space-between', padding: 'var(--space-100) var(--space-150) 0' }}>
      <div className="row" style={{ gap: 'var(--space-400)' }}><span className="t-heading-h4-semibold">{title}</span>{extra}</div>
      <IB icon="cooper-system-icon" type="tertiary" shape="circle" size="s" label="Ask Cooper" onClick={() => toast({ title: `Cooper: ${title.toLowerCase()}` })} />
    </div>} bottom={<div style={{ width: '100%' }}>{children}</div>} />
);

/* ============================================================ the questions System confidence asks (built from the real rows) */
function planIssues(rowState, saved) {
  const n = t => planRowsWith(t).length, total = PLAN_ROWS.filter(r => r.issue).length;
  const minS = SETUP_SCENARIOS[0], gap = PLAN_PEAK_GAP;
  const list = [
    { id: 'q-safe', kind: 'question', gate: 'data', title: `${n('study')} of ${total} inconsistencies are safe to ignore`,
      description: 'They are studies, surveys and inspections with no cost or value yet. Cooper’s seen this pattern before.',
      solutions: [{ id: 'accept', title: 'Accept all', recommended: true }, { id: 'review', title: 'Review individually' }], upload: true, answer: true },
    { id: 'q-basis', kind: 'question', gate: 'data', title: `${n('noBasis')} costs have no estimate basis`,
      description: 'Capital work with $0 CAPEX. Cooper can estimate each one from the median cost of the same kind of work.',
      solutions: [{ id: 'fix', title: 'Fix with Cooper', recommended: true }, { id: 'route', title: 'Send to the investment owners' }], upload: true, answer: true },
    { id: 'q-below', kind: 'question', gate: 'data', title: `${n('below')} costs are far below their class`,
      description: 'Each is more than 95% below the median of its alternative type, so the optimizer would fund it almost for free.',
      solutions: [{ id: 'leave', title: 'Leave them out from this plan', recommended: true }, { id: 'keep', title: 'Keep them in as costed' }], upload: true, answer: true },
    { id: 'q-value', kind: 'question', gate: 'data', title: `${n('negValue')} investments have a negative value`,
      description: 'Only their owners know whether the value scoring is wrong. Cooper can send each one to its owner to fix in Build.',
      solutions: [{ id: 'route', title: 'Send to their owners', recommended: true }, { id: 'keep', title: 'Keep them as they are' }], upload: true, answer: true },
    { id: 'w-min', kind: 'warning', gate: 'scen', title: `${minS.short} caps CAPEX at $0 from ${MIN_CAPEX_FROM}`,
      description: 'There is not enough room for the optimizer to move the investments, so the optimization can fail.',
      solutions: [{ id: 'relax', title: 'Relax the CAPEX cap to the Baseline envelope', recommended: true }, { id: 'keep', title: 'Keep it: this scenario asks for the least CAPEX' }] },
    { id: 'w-gap', kind: 'warning', gate: 'scen', title: `Requested CAPEX in ${gap.year} is ${fmtMoney(gap.requested)} against a ${fmtMoney(gap.cap)} cap`,
      description: `Every scenario has to defer or re-scope about ${fmtMoney(gap.gap)} of ${gap.year} work. Letting start dates shift gives the optimizer room.`,
      solutions: [{ id: 'shift', title: 'Let start dates shift by up to 3 years', recommended: true }, { id: 'keep', title: 'Keep start dates fixed' }] },
  ];
  return list.map(i => saved[i.id] ? { ...i, status: saved[i.id] } : i);
}
const planGroupIssues = saved => PLAN_GROUP_ISSUES.map(i => saved[i.id] ? { ...i, status: saved[i.id] } : i);
// One System confidence for the three gates: Data readiness + Scenarios come from c, Planning groups from g (Figma: each tab has its own questions)
const mergeConfidence = (c, g) => {
  const gates = c.gates.map((x, k) => g.issues.some(i => i.gate === x.id) ? g.gates[k] : x);
  return { ...c, gates, readiness: Math.round(gates.filter(x => x.done).length / gates.length * 100), allResolved: c.allResolved && g.allResolved };
};

/* ============================================================ Setup */
function PlanSetup({ navBar, tab, setTab, rows, setRows, saved, setSaved, setup, setSetup, onOptimize, run, onHome, reopt, setReopt, onReoptCancel, onReoptRun }) {
  const reMode = reopt && ['building', 'draft'].includes(reopt.status);
  const issues = useMemo(() => planIssues(rows, saved), []);
  const c = useIssueReport({ issues, gates: PLAN_GATES });
  const g = useIssueReport({ issues: useMemo(() => planGroupIssues(saved), []), gates: PLAN_GATES });
  const all = mergeConfidence(c, g), panelCtl = tab === 'groups' ? g : c;
  const [chat, setChat] = useState(false);
  useEffect(() => { setSaved(st => ({ ...st, ...g.status })); }, [g.status]);
  const [panel, setPanel] = useState(true);
  const [filter, setFilter] = useState('all');
  const prev = useRef(c.status);

  // Persist what was resolved, and carry each solution through to the table and the scenarios
  useEffect(() => {
    const before = prev.current; prev.current = c.status; setSaved(st => ({ ...st, ...c.status }));
    const ids = new Set([...Object.keys(before), ...Object.keys(c.status)]);
    ids.forEach(id => {
      const a = (c.status[id] || {}), b = (before[id] || {});
      const nowOn = a.applied || a.answer || a.file, wasOn = b.applied || b.answer || b.file;
      if (nowOn === wasOn) return;
      const type = { 'q-safe': 'study', 'q-basis': 'noBasis', 'q-below': 'below', 'q-value': 'negValue' }[id];
      if (type) {
        if (a.applied === 'review') { c.undo(id); setFilter('inconsistent'); toast({ title: 'Review each one in the table', description: 'Showing investments with an inconsistency' }); return; }
        const to = !nowOn ? 'open' : a.applied === 'accept' ? 'ignored' : a.applied === 'fix' ? 'fixed' : a.applied === 'leave' ? 'excluded'
          : a.applied === 'keep' ? 'kept' : a.applied === 'route' ? 'sent' : 'ignored';
        setRows(st => { const n = { ...st }; planRowsWith(type).forEach(r => {
          const cur = n[r.id] || 'open';
          if (!nowOn) { if (cur !== 'ownerFixed') delete n[r.id]; } else if (cur === 'open') n[r.id] = to;
        }); return n; });
        if (to === 'sent') toast({ title: `Sent to ${[...new Set(planRowsWith(type).map(r => ownerName(r.owner)))].join(', ')}`, description: 'Each owner gets a notification to fix it in Build' });
      }
      if (id === 'w-min') setSetup(s => ({ ...s, relaxMin: a.applied === 'relax' }));
      if (id === 'w-gap') setSetup(s => ({ ...s, shiftAll: a.applied === 'shift' }));
    });
  }, [c.status]);

  // A question handled row by row in the table resolves itself
  useEffect(() => {
    Object.entries({ 'q-safe': 'study', 'q-basis': 'noBasis', 'q-below': 'below', 'q-value': 'negValue' }).forEach(([id, type]) => {
      const rs = planRowsWith(type), done = rs.every(r => (rows[r.id] || 'open') !== 'open');
      if (done && !c.resolved(id)) c.answer(id, 'Handled one by one in the table');
    });
  }, [rows]);

  const waiting = PLAN_ROWS.filter(r => rows[r.id] === 'sent').length;
  const ready = all.allResolved && !waiting && !run;
  const header = <PageHeader title={PLAN_TITLE} onBack={onHome} onTitleMenu={() => toast({ title: 'Switch plans isn’t part of this flow' })}
    status={<Indicator type="blue">Planning</Indicator>}
    center={<Stepper current={0} steps={[{ label: 'Setup' }, { label: 'Compare' }, { label: 'Approve' }]} />}
    actions={reMode ? <div className="row" style={{ gap: 'var(--space-200)' }}>
      <Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      <Button type="secondary" size="s" onClick={onReoptCancel}>Cancel</Button>
      <Button type="primary" size="s" disabled={reopt.status !== 'draft'} onClick={onReoptRun} aria-label="Optimize">Optimize</Button>
    </div> : <div className="row" style={{ gap: 'var(--space-200)' }}>
      <Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      <IB icon="system-comment" type="tertiary" size="s" label="Comments" onClick={() => toast({ title: 'Comments aren’t part of this flow' })} />
      <Tooltip content={run ? 'Optimization is running' : waiting ? `Waiting for ${waiting} owner fix${waiting > 1 ? 'es' : ''}` : ready ? 'Optimize the scenarios' : 'Resolve System confidence first'} type="bottom">
        <span><Button type="primary" size="s" disabled={!ready} onClick={onOptimize} aria-label="Optimize">Optimize</Button></span>
      </Tooltip>
    </div>} />;

  return (
    <AppShell navBar={navBar} header={header}
      bottom={<BottomSheet type="value" documents={{ label: '16 Documents', onClick: () => toast({ title: 'Cooper’s context: 16 documents' }) }} onUpload={() => toast({ title: 'Upload' })}
        prompts={tab === 'readiness' ? ['Explain why these are outliers', 'Summarize data readiness'] : ['Compare to peer', 'Compare to best practice']} onPrompt={p => toast({ title: `Cooper: ${p}` })} />}>
      <div className="page-row">
        <div className="page">
          <span className="t-heading-h2-medium">Setup</span>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <Tabs value={tab} onChange={setTab} aria-label="Setup" items={[{ value: 'readiness', label: 'Data readiness' }, { value: 'groups', label: 'Planning groups' },
              { value: 'scenarios', label: 'Scenarios', count: reMode ? 1 : SETUP_SCENARIOS.length + (setup.created || []).length }]} />
            {tab === 'scenarios' && <Button type="secondary" size="s" iconLeft="system-plus" onClick={() => setChat(true)}>New scenario</Button>}
          </div>
          {tab === 'readiness' && <Readiness rows={rows} setRows={setRows} filter={filter} setFilter={setFilter} />}
          {tab === 'groups' && <Groups g={g} saved={saved} />}
          {tab === 'scenarios' && (reMode ? <Scenarios setup={setup} setSetup={setSetup} only={reopt.status === 'draft' ? [planReoptScenario(reopt)] : []} building={reopt.status === 'building' && planReoptScenario(reopt).name} />
            : <Scenarios setup={setup} setSetup={setSetup} building={chat && chat.building} />)}
          {reopt && reopt.status !== 'done' && reopt.status !== 'running' && <ReoptChat reopt={reopt} setReopt={setReopt} />}
          {tab === 'scenarios' && chat && <ScenarioChat chat={chat} setChat={setChat} setSetup={setSetup} />}
        </div>
        <div className="page-dock" style={{ height: 'calc(100vh - var(--proto-sticky-offset))' }}>
          <Panel title="System confidence" expanded={panel} onExpandedChange={setPanel} dot={c.dot || g.dot || undefined} onEvidence={() => toast({ title: 'Evidence chain' })}
            className={panel ? 'ifs-trc-panel' : undefined} style={{ height: '100%' }}>
            <ContentCard className="ifs-trc-card" title={<ConfidenceGates controller={all} label="Optimization readiness" />}
              bottom={<div className={`ifs-trc-card__issues ${panelCtl.present.length > 1 ? 'has-kinds' : ''}`}>
                {panelCtl.present.length > 1 && <div className="ifs-trc-card__kinds"><IssueKindSwitch controller={panelCtl} /></div>}
                <IssueNavigator controller={panelCtl} />
              </div>} />
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------ Setup › Data readiness */
function Readiness({ rows, setRows, filter, setFilter }) {
  const [more, setMore] = useState(false);
  const [q, setQ] = useState('');
  const open = PLAN_ROWS.filter(r => planRowOpen(r, rows) || rows[r.id] === 'sent');
  const live = PLAN_ROWS.filter(r => rows[r.id] !== 'excluded');
  const atRisk = open.reduce((s, r) => s + (r.capex || 0), 0);
  const withIssue = PLAN_ROWS.filter(r => r.issue), outliers = PLAN_ROWS.filter(r => r.outlier);
  const pts = PLAN_ROWS.filter(r => r.capex > 0 && r.value > 0 && r.capex <= 100e6 && r.value <= 300e3)
    .map(r => ({ label: r.name, x: r.capex / 1e6, y: r.value / 1e3, series: r.outlier ? 'out' : 'in' }));
  const set = (id, v) => setRows(st => ({ ...st, [id]: v }));
  const rank = r => (planRowOpen(r, rows) ? 0 : r.issue ? 1 : 2);
  let list = filter === 'inconsistent' ? withIssue : filter === 'outliers' ? outliers : PLAN_ROWS;
  if (q) list = list.filter(r => (r.name + r.code).toLowerCase().includes(q.toLowerCase()));
  list = [...list].sort((a, b) => rank(a) - rank(b));
  const shown = more ? list.slice(0, 60) : list.slice(0, 8);

  const solution = r => {
    const st = rows[r.id] || 'open';
    if (!r.issue) return null;
    if (st === 'fixed') return <Badge color="green" size="s">Cooper estimate {fmtMoney(r.estimate)}</Badge>;
    if (st === 'excluded') return <Badge color="false" size="s">Left out of this plan</Badge>;
    if (st === 'ignored' || st === 'kept') return <Badge color="false" size="s">{st === 'ignored' ? 'Ignored' : 'Kept as is'}</Badge>;
    if (st === 'sent') return <Badge color="orange" size="s">Sent to {ownerName(r.owner)}</Badge>;
    if (st === 'ownerFixed') return <Badge color="green" size="s">Fixed by {ownerName(r.owner)}</Badge>;
    const a = ISSUE_TYPES[r.issue.type].action;
    if (a === 'fix') return <Button type="ghost" size="s" iconLeft="cooper-system-icon" className="plan-cooper-btn" onClick={() => set(r.id, 'fixed')}>Fix with Cooper</Button>;
    if (a === 'leave') return <Button type="ghost" size="s" iconLeft="system-minus" onClick={() => set(r.id, 'excluded')}>Leave out from this plan</Button>;
    if (a === 'route') return <Button type="ghost" size="s" iconLeft="system-mail-message" onClick={() => { set(r.id, 'sent'); toast({ title: `Sent to ${ownerName(r.owner)}`, description: 'They get a notification to fix it in Build' }); }}>{`Send to ${ownerName(r.owner)}`}</Button>;
    return null;
  };
  const cols = [
    { key: 'name', title: 'Investments', width: '1.6fr', render: r => (
      <div className="row" style={{ gap: 'var(--space-200)', minWidth: 0, width: '100%' }}>
        <div className="col" style={{ minWidth: 0, flex: 1 }}>
          <span className="t-label-m-medium plan-ellipsis">{r.name}</span><span className="t-body-s-regular sec">{r.code}</span>
        </div>
        {planRowOpen(r, rows) && <Icon name={r.issue.type === 'noBasis' || r.issue.type === 'negValue' ? 'status-error-filled' : 'status-warning-filled'} size={16} className={r.issue.type === 'noBasis' || r.issue.type === 'negValue' ? 'plan-ic-err' : 'plan-ic-warn'} />}
      </div>) },
    { key: 'issue', title: 'Inconsistency', width: '1.1fr', render: r => r.issue ? <span className="plan-clip" title={r.issue.label}><Badge size="s" color="white">{r.issue.label}</Badge></span> : (r.outlier ? <Badge size="s" color="false">Outlier</Badge> : null) },
    { key: 'solution', title: 'Solution', width: '1.1fr', render: solution },
    { key: 'capex', title: 'Cost', width: 'var(--table-col-number-min)', render: r => rows[r.id] === 'fixed' ? fmtMoney(r.estimate) : fmtMoney(r.capex) },
    { key: 'value', title: 'Value', width: 'var(--table-col-number-min)', render: r => fmtValue(r.value) },
    { key: 'start', title: 'Schedule', width: 'var(--table-col-date)', render: r => fmtDate(r.startDate) },
  ];
  return (
    <div className="col" style={{ gap: 'var(--space-500)' }}>
      <StatCardsRow cards={[
        { title: 'With inconsistency', value: String(open.length), description: `/ ${live.length}`, descriptionPosition: 'inline' },
        { title: 'Outliers', value: String(outliers.length), description: `/ ${PLAN_ROWS.length}`, descriptionPosition: 'inline' },
        { title: 'Cost at risk', value: fmtMoney(atRisk), description: 'tied to open issues', descriptionPosition: 'inline' },
        { title: 'Ready to optimize', value: fmtPct((live.length - open.length) / live.length) },
      ]} />
      <ScatterChart title="Outlier investments" data={pts} xLabel="Forecast cost ($M)" yLabel="Forecast value (K)" xFormat={v => `${Math.round(v)}`} format={v => `${Math.round(v)}`}
        series={[{ key: 'in', label: 'Within the expected range', color: 'steel-blue' }, { key: 'out', label: 'Outlier', color: 'alert' }]}
        xReference={PLAN_MEDIAN_COST / 1e6} yReference={PLAN_MEDIAN_VALUE / 1e3} referenceLabel={`Median cost ${fmtMoney(PLAN_MEDIAN_COST)} · median value ${fmtValue(PLAN_MEDIAN_VALUE)}`} />
      <PSec title="Investments">
        <div className="col" style={{ gap: 'var(--space-300)', padding: 'var(--space-200) var(--space-150) var(--space-150)' }}>
          <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--space-300)' }}>
            <SegmentedControl value={filter} onChange={v => { setFilter(v); setMore(false); }} options={[
              { value: 'all', label: 'All', counter: PLAN_ROWS.length }, { value: 'inconsistent', label: 'With inconsistency', counter: withIssue.length },
              { value: 'outliers', label: 'Outliers', counter: outliers.length }]} />
            <SmartSearch placeholder="Ask anything about investments" value={q} onChange={setQ} onSubmit={setQ} onClear={() => setQ('')} />
          </div>
          <Table columns={cols} rows={shown} rowHeight={48} />
          {list.length > 8 && <div><Button type="ghost" size="s" iconRight={more ? 'arrow-caret-up-filled' : 'arrow-caret-down-filled'} onClick={() => setMore(!more)}>{more ? 'Show less' : 'Show more'}</Button></div>}
        </div>
      </PSec>
    </div>
  );
}

/* ------------------------------------------------------------ Setup › Planning groups (J15: Cooper-detected groupings, Figma 85:158974) */
function Groups({ g, saved }) {
  const extra = planFromBuild(Store.get('build.refine'), Store.get('build.refineOther'));          // an investment approved in Build joins New to Scenario
  const [, force] = useState(0);
  const groups = planGroups(extra, saved), all = planInvestmentsWith(extra, saved), { matched } = planGrouping(saved);
  const [sel, setSel] = useState('Under Consideration');
  const [open, setOpen] = useState(null);
  const cur = groups.find(x => x.id === sel) ? sel : groups[0].id;
  const inGroup = all.filter(i => i.planningGroup === cur);
  const hi = cur === 'Under Consideration' ? inGroup.filter(i => matched.includes(i.id)) : [];      // Cooper's match sits on top, highlighted (Figma 85:158979)
  const rows = hi.concat(inGroup.filter(i => !hi.includes(i))).slice(0, 12).map((r, k) => ({ ...r, _hi: k < hi.length, _last: k === hi.length - 1 }));
  const [renaming, setRenaming] = useState(null);                                                   // { id, text }
  const rename = () => {
    const name = (renaming.text || '').trim(), id = renaming.id; setRenaming(null);
    if (!name || name === id) return;
    Store.set('plan.groupNames', { ...Store.get('plan.groupNames', {}), [PLAN_PROGRAMME.label]: name }); setSel(name); force(n => n + 1);
    toast({ title: `Renamed to ${name}` });
  };
  const remove = id => { g.undo('g-prog'); setSel('Under Consideration'); toast({ title: `${id} deleted`, description: 'Its investments are back in Under consideration' }); };
  return (
    <div className="col" style={{ gap: 'var(--space-500)' }}>
      <BarChart title="Investments count by planning group" data={groups.map(x => ({ label: x.label, value: x.count }))} valueLabel="Investments" labelWidth={220} height={220} />
      <PSec title="Investment Groups">
        <div style={{ display: 'grid', gridTemplateColumns: 'var(--proto-plan-side-w) 1fr', gap: 'var(--space-300)', padding: 'var(--space-200) var(--space-150) var(--space-150)' }}>
          <div className="col" style={{ gap: 'var(--space-100)' }}>
            {groups.map(x => <ContentCard key={x.id} size="s" iconLeft={open === x.id ? 'arrow-caret-down-filled' : 'arrow-caret-right-filled'} selected={cur === x.id}
              onClick={() => { if (renaming) return; setSel(x.id); setOpen(open === x.id ? null : x.id); }}
              title={renaming && renaming.id === x.id ? <div onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === 'Enter') rename(); if (e.key === 'Escape') setRenaming(null); }}>
                <TextField size="m" autoFocus value={renaming.text} onChange={t => setRenaming(r => ({ ...r, text: t }))} onBlur={rename} aria-label="Group name" /></div> : x.label}
              control={<div className="row" style={{ gap: 'var(--space-100)' }} onClick={e => e.stopPropagation()}><Counter>{x.count}</Counter>
                {x.created && <Menu more label={`${x.label} actions`} items={[{ label: 'Rename', icon: 'system-edit-rename', onClick: () => setRenaming({ id: x.id, text: x.label }) },
                  { label: 'Delete', icon: 'system-trash-delete', destructive: true, onClick: () => remove(x.id) }]} />}</div>}
              bottom={open === x.id ? <div className="col" style={{ gap: 'var(--space-200)', width: '100%' }}>
                <span className="t-body-m-regular">{x.desc}</span>
                <NDS label="Grouping principles inset" className="col plan-principles"><span className="t-label-m-medium sec">Grouping principles</span>
                  {x.principles.map(p => <span key={p} className="t-body-m-regular plan-principle">{p}</span>)}</NDS>
              </div> : undefined} />)}
          </div>
          <Table rowHeight={48} rows={rows} rowProps={r => ({ className: `${r._hi ? 'plan-row-match' : ''}${r._last ? ' plan-row-match--last' : ''}` })} columns={[
            { key: 'name', title: 'Investment', width: '1.6fr', render: r => <div className="col" style={{ minWidth: 0 }}><span className="t-label-m-medium plan-ellipsis">{r.name}</span><span className="t-body-s-regular sec">{r.code}</span></div> },
            { key: 'stage', title: 'Stage', width: 'calc(var(--table-col-short-min) + var(--space-700))' }, { key: 'capex', title: 'Cost', width: 'var(--table-col-number-min)', render: r => fmtMoney(r.capex) },
            { key: 'value', title: 'Value', width: 'var(--table-col-number-min)', render: r => fmtValue(r.value) }, { key: 'start', title: 'Schedule', width: 'var(--table-col-date)', render: r => fmtDate(r.startDate) }]} />
        </div>
      </PSec>
    </div>
  );
}

/* ------------------------------------------------------------ Setup › Scenarios (restrictions + constraints, editable) */
function Scenarios({ setup, setSetup, building, only }) {
  const made = only || (setup.created || []).map(planCreatedScenario);
  const [open, setOpen] = useState(made.length ? made[0].id : SETUP_SCENARIOS[0].id);
  useEffect(() => { if (made.length) setOpen(made[0].id); }, [made.length]);
  return (
    <div className="col" style={{ gap: 'var(--space-200)' }}>
      {building && <NDS label="Scenario being built (skeleton row + Cooper cursor)" className="plan-scen-building">
        <ContentCard className="plan-scen" top={<div className="row" style={{ width: '100%', gap: 'var(--space-400)', padding: 'var(--space-100) var(--space-150)' }}>
          <IFS.Spinner text="Cooper is building the scenario" showText={false} />
          <div className="col" style={{ flex: 1, gap: 'var(--space-100)' }}><span className="t-heading-h4-semibold">{building}</span><IFS.Skeleton width="60%" /></div>
          {['Budget', 'Resources', 'Enterprise goal'].map(l => <div key={l} className="col plan-metric"><span className="t-body-s-regular sec">{l}</span><IFS.Skeleton width="80%" /></div>)}
        </div>} />
        <IFS.CollaboratorCursor user="cooper" name="Cooper" className="plan-scen-cursor" />
      </NDS>}
      {(only ? made : made.concat(SETUP_SCENARIOS)).map(s => <ScenarioCard key={s.id} s={s} open={open === s.id} onToggle={() => setOpen(open === s.id ? null : s.id)} setup={setup} setSetup={setSetup} />)}
    </div>
  );
}
const scenConstraints = (setup, s) => {
  if (s.adjust) return setup.constraints?.[s.id] || s.adjust(planConstraintsOf(s.from).map(r => ({ ...r, id: `${s.id}-${r.measureId}` })));
  if (s.created) return setup.constraints?.[s.id] || planConstraintsOf(s.from).map(r => r.measureId === 37
    ? { ...r, id: `${s.id}-${r.measureId}`, changed: [s.capYear], years: { ...r.years, [s.capYear]: { ...r.years[s.capYear], max: s.capTo } } } : { ...r, id: `${s.id}-${r.measureId}` });
  let rows = setup.constraints?.[s.id] || planConstraintsOf(s.id);
  if (s.id === 54824 && setup.relaxMin && !setup.constraints?.[s.id]) {                  // warning solved: Min CAPEX takes the Baseline CAPEX caps
    const base = planConstraintsOf(PLAN_BASELINE_ID).find(r => r.measureId === 37);
    rows = rows.map(r => r.measureId === 37 ? { ...r, years: base.years } : r);
  }
  return rows;
};
const scenRestrictions = (setup, s) => ({ ...SETUP_RESTRICTIONS, ...(setup.shiftAll ? { shiftDates: true } : {}), ...(s.created ? { shiftDates: s.maxShift > 0, maxShift: s.maxShift } : {}), ...(setup.restrictions?.[s.id] || {}) });
function ScenarioCard({ s, open, onToggle, setup, setSetup }) {
  const cons = scenConstraints(setup, s), res = scenRestrictions(setup, s);
  const capex = cons.find(r => r.measureId === 37), pm = cons.find(r => r.measureId === 181), rel = cons.find(r => r.measureId === 67);
  const budget = capex ? SETUP_YEARS.reduce((t, y) => t + (capex.years[y].max || 0), 0) : null;
  const Metric = ({ label, value }) => <div className="col plan-metric"><span className="t-body-s-regular sec">{label}</span><span className="t-label-m-medium">{value}</span></div>;
  return (
    <ContentCard className="plan-scen" top={
      <div className="row" style={{ width: '100%', gap: 'var(--space-400)', padding: 'var(--space-100) var(--space-150)' }}>
        <IB icon={open ? 'arrow-caret-down-filled' : 'arrow-caret-right-filled'} type="ghost" size="s" label={open ? `Collapse ${s.name}` : `Expand ${s.name}`} onClick={onToggle} />
        <div className="col" style={{ flex: 1, minWidth: 0, gap: 'var(--space-100)' }}>
          <span className="row" style={{ gap: 'var(--space-200)' }}><span className="t-heading-h4-semibold">{s.name}</span>{s.created && <Indicator type="purple">Draft</Indicator>}</span>
          <span className="t-body-m-regular">{s.desc}</span>
        </div>
        <Metric label="Budget" value={s.budgetLabel || (s.created ? `${s.capYear} cap ${fmtMoney(s.capFrom)} → ${fmtMoney(s.capTo)}` : budget == null ? '—' : `${fmtMoney(budget)} CAPEX`)} />
        <Metric label="Resources" value={pm ? `${fmtNum(pm.years[2028].max)} PM hours` : '—'} />
        <Metric label="Enterprise goal" value={rel ? `Reliability risk ≤ ${fmtCompact(rel.years[2028].max)}` : '—'} />
        <IB icon="cooper-system-icon" type="tertiary" shape="circle" size="s" label="Ask Cooper" onClick={() => toast({ title: `Cooper: explain ${s.short}` })} />
      </div>}
      bottom={open && <div className="col" style={{ gap: 'var(--space-300)', width: '100%', padding: 'var(--space-200) var(--space-150) var(--space-150)' }}>
        <Restrictions s={s} res={res} setSetup={setSetup} />
        <Constraints s={s} rows={cons} setSetup={setSetup} />
        <InvestmentGroups s={s} res={res} setSetup={setSetup} />
      </div>} />
  );
}
/* ------------------------------------------------------------ J17 · Re-optimize a Compare scenario with Cooper (Figma 85:75447) */
function ReoptChat({ reopt, setReopt }) {
  const src = SETUP_SCENARIOS.find(x => x.id === reopt.from) || SETUP_SCENARIOS[2];
  const [input, setInput] = useState('');
  const ans = reopt.answers || [];
  const send = text => {
    if (!text || !text.trim() || reopt.status !== 'chat') return;
    const t = text.trim(); setInput('');
    if (!ans.length) { setReopt(r => ({ ...r, answers: [t], kind: reoptKind(t) })); return; }
    setReopt(r => ({ ...r, answers: [...ans, t], adjust: /adjust/i.test(t), status: 'building' }));            // main moves to Setup › Scenarios
    setTimeout(() => setReopt(r => r && r.status === 'building' ? { ...r, status: 'draft' } : r), 2600);
  };
  const k = REOPT_KINDS[reopt.kind] || REOPT_KINDS.budget;
  return (
    <div className="plan-chat">
      <ChatCompactPanel type="text" title={`Re-optimize · ${src.short}`} newChat={false} inputValue={input} onInputChange={setInput} onSend={() => send(input)}
        analyzing={reopt.status === 'building'} onStop={() => {}} onClose={() => setReopt(r => r && r.status === 'chat' ? null : { ...r, chatClosed: true })}
        style={{ height: 'calc(100vh - var(--proto-chat-offset))', maxHeight: 'var(--proto-chat-max-h)' }}>
        <CooperMessage status="answered" text={`What would you like to change in ${src.short}? Tell me what you want to adjust. I’ll update this scenario’s settings and prepare it for a new optimization run.`}
          options={!ans.length ? { intro: 'Start with', items: Object.values(REOPT_KINDS).map(x => x.label) } : undefined} onOption={send} />
        {ans[0] && <UserMessage>{ans[0]}</UserMessage>}
        {ans[0] && <CooperMessage status="answered" text="I can set up a new scenario, but I need one more decision before I finish the configuration."
          options={ans.length === 1 ? { title: 'Planning groups and constraints', intro: 'Should a new scenario use the same planning groups and constraints, or should I adjust them?', items: ['Keep them the same', 'Let Cooper adjust them'] } : undefined} onOption={send} />}
        {ans[1] && <UserMessage>{ans[1]}</UserMessage>}
        {reopt.status === 'building' && <CooperProgress step={1} total={3} label="Analyzing context…" />}
        {['draft', 'running', 'done'].includes(reopt.status) && <CooperMessage status="answered" text={`Based on what you asked, I’ve prepared a ${k.what} scenario. Everything is ready — you can now run the optimization.`}
          followUps={['Show me what changed', Object.values(REOPT_KINDS).find(x => x !== k).label, Object.values(REOPT_KINDS).filter(x => x !== k)[1].label]}
          onFollowUp={f => toast({ title: 'Cooper', description: /changed/.test(f) ? `${k.budget}; the changed cells are orange in Constraints.` : 'Cancel this draft first to try another change.' })} />}
      </ChatCompactPanel>
    </div>
  );
}

/* ------------------------------------------------------------ Setup › New scenario: Cooper builds it from a conversation (J15, Figma 85:177903) */
const SC_SOURCE = () => SETUP_SCENARIOS.find(x => x.id === PLAN_NEW_FROM);
const SC_STEPS = [
  () => ({ text: `What do you want to explore in ${PLAN_NEW_YEAR}? I’ve read the portfolio, the value framework and last cycle’s plan. 3 things stand out that no scenario tests yet.`,
    intro: 'Start with', items: [`Stress the ${PLAN_NEW_YEAR} cap`, 'Protect cost first', 'Cheapest plan that still clears every obligation'] }),
  () => ({ text: `Should I start from ${SC_SOURCE().short}, or build the assumptions fresh?`, items: [`Start from ${SC_SOURCE().short}`, 'Build it fresh'] }),
  () => ({ text: `How hard should ${PLAN_NEW_YEAR} be held? Today ${SC_SOURCE().short} caps ${PLAN_NEW_YEAR} CAPEX at ${fmtMoney(planCapOf(PLAN_NEW_FROM, PLAN_NEW_YEAR))}, and that envelope defers ${SC_SOURCE().deferredVsRequested} investments across the plan.`,
    items: Object.values(PLAN_NEW_CAPS).map(c => c.label) }),
  () => ({ text: 'If the work no longer fits, may I move dates further out?', items: ['Yes, up to 3 years', 'No, keep the 2-year limit'] }),
];
const scCap = t => /flat|hold/i.test(t) ? 'flat' : /grow|\+|up|rais|more/i.test(t) && !/cut|lower|less|-/i.test(t) ? 'grow' : 'cut';
function ScenarioChat({ chat, setChat, setSetup }) {
  const st = chat === true ? { msgs: [{ role: 'cooper', step: 0 }], step: 0, answers: [] } : chat;
  const [input, setInput] = useState('');
  useEffect(() => { if (chat === true) setChat(st); }, []);
  const send = text => {
    if (!text || !text.trim() || st.busy || st.done) return;
    const answers = [...st.answers, text.trim()], step = st.step + 1, msgs = [...st.msgs, { role: 'user', text: text.trim() }];
    setInput('');
    if (step < SC_STEPS.length) { setChat({ ...st, answers, step, msgs: [...msgs, { role: 'cooper', step }] }); return; }
    const spec = { id: `new-${Date.now()}`, cap: scCap(answers[2]), shift: /no|keep/i.test(answers[3]) ? 2 : 3 };
    const made = planCreatedScenario(spec);
    setChat({ ...st, answers, step, msgs, busy: 1 });
    setTimeout(() => setChat(c => c && ({ ...c, busy: 2, building: made.name })), 1200);
    setTimeout(() => {
      setSetup(s => ({ ...s, created: [spec, ...(s.created || [])] }));
      setChat(c => c && ({ ...c, busy: 0, building: null, done: true, msgs: [...c.msgs, { role: 'cooper', text: `I’ve created “${made.name}” scenario as a draft — run Optimize when you are ready.` }] }));
    }, 2800);
  };
  if (chat === true) return null;
  return (
    <div className="plan-chat">
      <ChatCompactPanel type="text" title="New scenario" newChat={false} inputValue={input} onInputChange={setInput} onSend={() => send(input)} analyzing={!!st.busy} onStop={() => {}}
        onNewChat={() => setChat(true)} onClose={() => setChat(false)} style={{ height: 'calc(100vh - var(--proto-chat-offset))', maxHeight: 'var(--proto-chat-max-h)' }}>
        {st.msgs.map((m, k) => {
          if (m.role === 'user') return <UserMessage key={k}>{m.text}</UserMessage>;
          if (m.text) return <CooperMessage key={k} status="answered" text={m.text} />;
          const q = SC_STEPS[m.step](), last = k === st.msgs.length - 1 && !st.busy;
          return <CooperMessage key={k} status="answered" text={q.text} options={last ? { intro: q.intro, items: q.items } : undefined} onOption={send} />;
        })}
        {st.busy ? <CooperProgress step={st.busy} total={3} label={st.busy === 1 ? 'Analyzing context…' : 'Building new scenario…'} /> : null}
      </ChatCompactPanel>
    </div>
  );
}
function Restrictions({ s, res, setSetup }) {
  const set = patch => setSetup(st => ({ ...st, restrictions: { ...st.restrictions, [s.id]: { ...res, ...patch } } }));
  const GROUPS = planGroups(planFromBuild(Store.get('build.refine'), Store.get('build.refineOther')));     // follows the J15 moves
  const adjustable = GROUPS.filter(g => (res.groups || GROUPS.filter(x => x.adjustable).map(x => x.id)).includes(g.id));
  const Row = ({ title, desc, k }) => (
    <div className="row" style={{ gap: 'var(--space-400)', justifyContent: 'space-between', padding: 'var(--space-200) 0' }}>
      <div className="col" style={{ gap: 'var(--space-50)' }}><span className="t-label-m-medium">{title}</span><span className="t-body-s-regular sec">{desc}</span></div>
      <Switch size="s" checked={res[k]} onChange={v => set({ [k]: v })} aria-label={title} />
    </div>);
  return (
    <PSec title="Restrictions">
      <div className="col" style={{ gap: 'var(--space-200)', padding: 'var(--space-200) var(--space-150) var(--space-150)' }}>
        <StatCardsRow cards={[
          { size: 's', title: 'Investments adjustable', value: fmtNum(adjustable.reduce((t, g) => t + g.count, 0)) },
          { size: 's', title: 'Planning groups enabled', value: `${adjustable.length}`, description: `/ ${GROUPS.length}`, descriptionPosition: 'inline' },
          { size: 's', title: 'Max date shift', value: res.shiftDates ? `${res.maxShift}yr` : 'None' },
          { size: 's', title: 'Alternative changes', value: res.altChanges ? 'Allowed' : 'Off' },
          { size: 's', title: 'Interpolation', value: res.interpolate ? 'On' : 'Off' }]} />
        <Row k="altChanges" title="Change recommended alternatives" desc="Optimization can switch to another alternative of an investment to maximize portfolio value." />
        <Row k="interpolate" title="Interpolate investments configured for interpolation" desc="The optimizer may calculate interpolated alternatives. Other investments are optimized as usual." />
        <Row k="shiftDates" title="Shift start dates from alternatives’ earliest start dates" desc={`Optimization can defer or advance a start date, by up to ${res.maxShift} years, to maximize portfolio value.`} />
      </div>
    </PSec>
  );
}
function InvestmentGroups({ s, res, setSetup }) {
  const on = res.groups || PLAN_GROUPS.filter(g => g.adjustable).map(g => g.id);
  const [sel, setSel] = useState(on[0] || PLAN_GROUPS[0].id);
  const toggle = id => setSetup(st => ({ ...st, restrictions: { ...st.restrictions, [s.id]: { ...res, groups: on.includes(id) ? on.filter(x => x !== id) : [...on, id] } } }));
  const extra = planFromBuild(Store.get('build.refine'), Store.get('build.refineOther')), groups = planGroups(extra);
  const rows = planInvestmentsWith(extra).filter(i => i.planningGroup === sel).slice(0, 8);
  return (
    <PSec title="Investment Groups">
      <div style={{ display: 'grid', gridTemplateColumns: 'var(--proto-plan-side-w) 1fr', gap: 'var(--space-300)', padding: 'var(--space-200) var(--space-150) var(--space-150)' }}>
        <div className="col" style={{ gap: 'var(--space-100)' }}>
          {groups.map(g => <ContentCard key={g.id} size="s" selected={sel === g.id} onClick={() => setSel(g.id)} title={g.label}
            control={<Checkbox checked={on.includes(g.id)} onChange={() => toggle(g.id)} aria-label={`Let the optimizer change ${g.label}`} />} iconRight={undefined}
            description={`${g.count} investments`} />)}
        </div>
        <Table rowHeight={48} rows={rows} columns={[
          { key: 'name', title: 'Investments', width: '1.6fr', render: r => <div className="col" style={{ minWidth: 0 }}><span className="t-label-m-medium plan-ellipsis">{r.name}</span><span className="t-body-s-regular sec">{r.code}</span></div> },
          { key: 'stage', title: 'Status', width: 'calc(var(--table-col-short-min) + var(--space-700))' }, { key: 'capex', title: 'Cost', width: 'var(--table-col-number-min)', render: r => fmtMoney(r.capex) },
          { key: 'value', title: 'Value', width: 'var(--table-col-number-min)', render: r => fmtValue(r.value) }, { key: 'start', title: 'Schedule', width: 'var(--table-col-date)', render: r => fmtDate(r.startDate) }]} />
      </div>
    </PSec>
  );
}
function Constraints({ s, rows, setSetup }) {
  const [cat, setCat] = useState('cost');
  const [edit, setEdit] = useState(null);                       // { id, year, k }
  const [adding, setAdding] = useState(false);
  const save = next => setSetup(st => ({ ...st, constraints: { ...st.constraints, [s.id]: next } }));
  const count = k => rows.filter(r => (CONSTRAINT_CATEGORY[r.measure] || 'strategic') === k).length;
  const shown = rows.filter(r => (CONSTRAINT_CATEGORY[r.measure] || 'strategic') === cat);
  const used = new Set(rows.map(r => r.measureId));
  const offer = PLAN_UNUSED_DEFS.filter(d => !used.has(d.valueMeasureId));
  const add = text => {
    const d = offer.find(o => text.toLowerCase().includes(o.valueMeasure.replace('.', '').toLowerCase().split(' ')[0])) || null;
    if (!d) { toast({ title: 'Cooper couldn’t match that to a value measure', description: `Try ${offer.map(o => o.valueMeasure.replace('.', '')).join(', ')}` }); return; }
    const num = parseFloat((text.match(/[\d.,]+/) || [''])[0].replace(/,/g, ''));
    const lim = isNaN(num) ? null : num, key = d.hasMax ? 'max' : 'min';
    setAdding(true);
    setTimeout(() => {
      setAdding(false);
      save([...rows, { id: `${s.id}-${d.valueMeasureId}`, measureId: d.valueMeasureId, measure: d.valueMeasure.replace(/\.$/, ''), type: d.type, unit: CONSTRAINT_UNIT(d.valueMeasure), added: true,
        years: Object.fromEntries(SETUP_YEARS.map(y => [y, { min: key === 'min' ? lim : null, max: key === 'max' ? lim : null }])) }]);
      setCat(CONSTRAINT_CATEGORY[d.valueMeasure] || 'strategic');
      toast({ title: `Constraint added to ${s.short}`, description: lim == null ? `${d.valueMeasure.replace(/\.$/, '')}: Cooper needs you to set the limit` : `${d.valueMeasure.replace(/\.$/, '')} ${key === 'max' ? '≤' : '≥'} ${fmtNum(lim)} a year` });
    }, 1400);
  };
  const cell = (r, y, k) => {
    const v = r.years[y][k];
    if (edit && edit.id === r.id && edit.year === y && edit.k === k) {
      const commit = () => { const t = String(edit.text ?? '').trim(), n = t === '' ? null : parseFloat(t.replace(/[^\d.-]/g, ''));
        save(rows.map(x => x.id === r.id ? { ...x, years: { ...x.years, [y]: { ...x.years[y], [k]: isNaN(n) ? null : n } } } : x)); setEdit(null); };
      return (
        <div style={{ width: 'var(--proto-cell-edit-w)' }} onBlur={commit} onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEdit(null); }}>
          <TextField size="m" autoFocus value={edit.text ?? (v == null ? '' : String(v))} onChange={t => setEdit(ed => ({ ...ed, text: t }))} aria-label={`${r.measure} ${y} ${k}`} />
        </div>);
    }
    return <NDS label="Inline edit cell"><button className="plan-cell" aria-label={`Edit ${r.measure} ${y} ${k}`} onClick={() => setEdit({ id: r.id, year: y, k })}>
      {k === 'max' && (r.changed || []).includes(y) ? <Tooltip content="Changed by Cooper from the copied scenario" type="top"><span className="plan-changed">{fmtUnit(v, r.unit)}</span></Tooltip> : fmtUnit(v, r.unit)}
      <Icon name="system-edit-rename" size={16} /></button></NDS>;
  };
  return (
    <PSec title="Constraints">
      <div className="col" style={{ gap: 'var(--space-300)', padding: 'var(--space-200) var(--space-150) var(--space-150)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <SegmentedControl size="s" value={cat} onChange={setCat} options={[{ value: 'cost', label: 'Cost', counter: count('cost') },
            { value: 'resource', label: 'Resource hours', counter: count('resource') }, { value: 'strategic', label: 'Strategic', counter: count('strategic') }]} />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <Table rowHeight={48} rows={shown} columns={[
            { key: 'measure', title: 'Constraint', width: 'var(--table-col-primary-min)', render: r => <span className="t-label-m-medium">{r.measure}</span> },
            { key: 'type', title: 'Type', width: 'var(--table-col-number-min)', render: r => <Badge size="s" color="white">{r.type}</Badge> },
            { key: 'unit', title: 'Unit', width: 'var(--table-col-number-min)' },
            ...SETUP_YEARS.flatMap(y => [{ key: `${y}min`, title: `${y} min`, width: 'calc(var(--table-col-number-min) + var(--space-200))', render: r => cell(r, y, 'min') },
              { key: `${y}max`, title: `${y} max`, width: 'calc(var(--table-col-number-min) + var(--space-200))', render: r => cell(r, y, 'max') }]),
            { key: 'del', title: '', width: 'var(--table-col-action)', render: r => <IB icon="system-trash-delete" type="ghost" size="s" label={`Delete ${r.measure}`}
              onClick={() => { save(rows.filter(x => x.id !== r.id)); toast({ title: `${r.measure} removed from ${s.short}`, secondaryAction: { label: 'Undo', iconLeft: 'arrow-back-up', onClick: () => save(rows) } }); }} /> }]} />
        </div>
        {!shown.length && <span className="t-body-m-regular sec">No {cat} constraints in this scenario.</span>}
        {offer.length > 0 && <SmartSearch placeholder={adding ? 'Cooper is analysing…' : 'Add a constraint, e.g. “Field crew hours under 12,000 a year”'} disabled={adding} width="100%"
          suggestions={offer.map(o => `${o.valueMeasure.replace(/\.$/, '')} ${o.hasMax ? 'at most' : 'at least'} …`)} suggestionsTitle="Constraints this portfolio defines" onSubmit={add} />}
      </div>
    </PSec>
  );
}

/* ============================================================ the run: NavBar badge + progress snackbar */
function OptimizingBadge({ onClick }) {
  return <button className="plan-badge" onClick={onClick} aria-label="Optimizing — show progress"><Badge color="black" size="m"><span className="row" style={{ gap: 'var(--space-150)' }}><span className="plan-spin"><ProgressRing value={70} size={16} label="Optimizing" /></span>Optimizing...</span></Badge></button>;
}
function RunProgress({ run, onClose }) {
  const [, tick] = useState(0);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => { const iv = setInterval(() => tick(t => t + 1), 500); return () => clearInterval(iv); }, []);
  const p = runProgress(run), el = Math.round((Date.now() - run.startedAt) / 1000), left = Math.max(0, RUN_SECONDS - el);
  const stepIdx = RUN_STEPS.findIndex(s => p < s.until);
  const ctx = { constraints: run.constraints, investments: run.investments };
  const mm = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  return (
    <div className="plan-run">
      <Snackbar title={`Optimizing ${run.scenarios.length} scenarios`} onClose={onClose}
        secondaryAction={{ label: expanded ? 'Hide progress' : 'Show progress', onClick: () => setExpanded(!expanded) }}>
        <div className="col" style={{ gap: 'var(--space-200)' }}>
          <span className="t-body-m-regular sec">{mm(el)} / ~{left}s remaining</span>
          <div className="row" style={{ gap: 'var(--space-200)' }}><div style={{ flex: 1 }}><ProgressBar value={Math.round(p * 100)} label="Optimization progress" /></div><span className="t-heading-h3">{Math.round(p * 100)}%</span></div>
        </div>
      </Snackbar>
      {expanded && <ContentCard className="plan-run-steps" bottom={<Timeline items={RUN_STEPS.map((s, i) => ({ key: s.id, title: s.title, icon: i < stepIdx || stepIdx < 0 ? 'status-success-filled' : i === stepIdx ? 'system-loader' : 'system-clock-time',
            time: i === stepIdx ? mm(el) : undefined, children: i === stepIdx && s.subs ? <div className="col" style={{ gap: 'var(--space-50)' }}>{s.subs(ctx).map(t => <span key={t} className="row t-label-m-regular sec" style={{ gap: 'var(--space-100)' }}><Icon name="arrow-corner-down-right" size={12} />{t}</span>)}</div> : null }))} />} />}
    </div>
  );
}

/* ============================================================ Plan home */
// Where the 2028 Plan cycle is: time to plan → planning (Setup) → optimizing → optimized → final plan chosen (Ready v1) → in approval
function planPhase({ stage, run, done, final }) {
  if (['approval', 'approved', 'scheduled', 'published'].includes(stage)) return stage;
  if (final) return 'final';
  if (done) return 'optimized';
  if (run) return 'optimizing';
  return stage === 'setup' ? 'setup' : 'time';
}
const PHASE = {                                                     // [Figma] Plan — Next cycle 84:276350 tile values and buttons; [Assumed] where noted
  time: { tile: 'Time to Plan', button: 'Start planning' },          // "Start planning" [Assumed]: Figma only draws "Continue planning"
  setup: { tile: 'Time to Plan', button: 'Continue planning' },
  optimizing: { tile: 'Optimizing', button: 'Compare results' },
  optimized: { tile: 'Optimized', button: 'Compare results' },
  final: { tile: 'Ready v1', button: 'Send for approval' },
  approval: { tile: 'In approval', button: 'View approval' },          // J21: Approve workspace
  approved: { tile: 'Ready v1', button: 'Publish' },
  scheduled: { tile: 'Ready v1', button: 'Re-schedule' },
  published: { tile: 'Published', button: 'View approval' },
};
function planConfidenceCounts(saved) {
  const issues = planIssues({}, {}), done = id => { const st = saved[id] || {}; return !!(st.applied || st.answer || st.file || st.viewed); };
  const q = issues.filter(i => i.kind === 'question'), w = issues.filter(i => i.kind === 'warning');
  return { q: [q.filter(i => done(i.id)).length, q.length], w: [w.filter(i => done(i.id)).length, w.length] };
}
function PlanHome({ navBar, run, done, stage, final, saved, onStart, onSetup, onCompare, onApproval, onApprove, showRun, setShowRun, gates }) {
  const [answer, setAnswer] = useState(null);                 // J20: Cooper's answer to a prompt
  const phase = planPhase({ stage, run, done, final }), ph = PHASE[phase];
  const cc = planConfidenceCounts(saved);
  const frac = ([a, b]) => `${a}/${b} (${Math.round(a / b * 100)}%)`;
  const finalS = final && PLAN_SCENARIOS.find(x => x.id === final);
  const [measure, setMeasure] = useState(37);
  const base = BASE, opt = PLAN_SCENARIOS.find(x => x.id === 6864);
  const pct = done ? 100 : Math.round(runProgress(run) * 100);
  const chosen = finalS || opt;
  const o = base.outcomes.find(x => x.measureId === measure), oo = chosen.outcomes.find(x => x.measureId === measure);
  const yrs = PLAN_YEARS.filter(y => y <= 2032);
  const forecast = yrs.map(y => { const k = PLAN_YEARS.indexOf(y); return { label: `${y}`, value: (done ? oo : o).byYear[k], reference: o.max[k] ?? undefined }; });
  const risk = base.outcomes.find(x => x.measureId === 21), riskO = chosen.outcomes.find(x => x.measureId === 21);
  const riskData = yrs.map(y => { const k = PLAN_YEARS.indexOf(y); return { label: `${y}`, req: risk.byYear[k], opt: done ? riskO.byYear[k] : undefined, cap: risk.max[k] ?? undefined }; });
  const scen = done ? chosen : base;
  const header = <PageHeader title={PLAN_TITLE} status={<Indicator type="blue">Planning</Indicator>} actions={<div className="row" style={{ gap: 'var(--space-200)' }}>
    <span className="t-body-m-regular sec">Owner</span><Avatar size="s" initials={PLAN_OWNER} name={ownerName(PLAN_OWNER)} /><span className="t-label-m-medium">{ownerName(PLAN_OWNER)}</span></div>} />;
  return (
    <AppShell navBar={navBar} header={header}
      sideNav={<SideNavTree title="Plan" defaultValue="dp" defaultExpanded={['ar', 'dp']} tree={[{ id: 'ar', label: COMPANY.name, children: [{ id: 'dp', label: PLAN_PORTFOLIO.name, children: PLAN_PORTFOLIO.children.map(c => ({ id: c, label: c })) }] }]}
        sections={[{ label: 'Ad hoc plans', items: [{ id: 'mine', label: 'My investments' }] }]} onSelect={id => id !== 'dp' && toast({ title: 'Only the Demo Portfolio is part of this flow' })} />}
      bottom={<BottomSheet prompts={['What needs my attention?', 'Are we on track against strategy?']} onPrompt={p => setAnswer(planCooperAnswer(/strategy/.test(p) ? 'strategy' : 'attention', { final, gates: stage === 'approval' || ['approved', 'scheduled', 'published'].includes(stage) ? gates : null }))} />}>
      {answer && <div className="rec-evidence"><AgentWindow text={answer} onClose={() => setAnswer(null)} onAsk={() => {}} secondaryAction={{ label: 'Open the comparison', onClick: () => { setAnswer(null); onCompare(); } }} /></div>}
      {run && !done && showRun && <RunProgress run={run} onClose={() => setShowRun(false)} />}
      <div className="page">
        <span className="t-body-m-regular sec">The Demo Portfolio capital plan: {PLAN_INVESTMENTS.length} investments across the {PLAN_PORTFOLIO.children.join(' and ')} regions, optimized against the portfolio’s CAPEX, OPEX, resource and risk constraints.</span>
        <PSec title="Planning Cycles">
          <div className="row" style={{ gap: 'var(--space-200)', padding: 'var(--space-200) var(--space-150) var(--space-150)' }}>
            {PLAN_CYCLES.map(cy => <ContentCard key={cy.id} size="s" style={{ width: 'var(--proto-cycle-card-w)' }} selected={cy.id === '2028'} title={cy.label}
              description={`${cy.id === '2028' ? ph.tile : '100%'} · ${cy.range}`} control={<Indicator size="xs" type={cy.id === '2028' ? 'orange' : 'gray'}>{cy.status}</Indicator>} />)}
          </div>
        </PSec>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="t-heading-h2">{PLAN_CYCLE} cycle</span>
          <Button type="primary" size="s" aria-label={ph.button}
            onClick={phase === 'time' ? onStart : phase === 'setup' ? onSetup : phase === 'final' ? onApproval : ['approval', 'approved', 'scheduled', 'published'].includes(phase) ? onApprove : onCompare}>{ph.button}</Button>
        </div>
        <StatCardsRow cards={[
          { title: done ? `Total value (${finalS ? 'final plan' : 'Optimized'})` : 'Total value (requested)', value: fmtCompact(scen.totalValue) },
          { title: 'CAPEX', value: fmtMoney(scen.capexTotal) },
          { title: 'Total investments', value: fmtNum(PLAN_INVESTMENTS.length) },
          { title: 'Horizon', value: `${PLAN_YEARS[0]}–${PLAN_YEARS[PLAN_YEARS.length - 1]}` }]} />
        <PSec title="Cycle Progress">
          <div className="col" style={{ gap: 'var(--space-100)', padding: 'var(--space-200) var(--space-150) var(--space-150)' }}>
            <ReadinessStatus type={['time'].includes(phase) ? 'in-progress' : phase === 'setup' ? 'active' : 'done'} right={<Button type="ghost" size="s" onClick={phase === 'time' ? onStart : onSetup}>View details</Button>}>Setup</ReadinessStatus>
            {(phase === 'time' || phase === 'setup') && <div className="col plan-subrows">
              <ReadinessStatus type="done" right={`${SETUP_SCENARIOS.length} scenarios`}>Scenarios built</ReadinessStatus>
              <ReadinessStatus type={cc.q[0] === cc.q[1] ? 'done' : 'in-progress'} indicators={[{ type: 'red', label: frac(cc.q) }]}>Open questions</ReadinessStatus>
              <ReadinessStatus type={cc.w[0] === cc.w[1] ? 'done' : 'in-progress'} indicators={[{ type: 'orange', label: frac(cc.w) }]}>Warnings</ReadinessStatus>
            </div>}
            <ReadinessStatus type={['optimizing', 'optimized'].includes(phase) ? 'active' : ['final', 'approval'].includes(phase) ? 'done' : 'in-progress'}
              right={<Button type="ghost" size="s" disabled={!(run || done)} onClick={onCompare}>View details</Button>}>Compare</ReadinessStatus>
            {['optimizing', 'optimized', 'final', 'approval'].includes(phase) && <div className="col plan-subrows">
              <ReadinessStatus type={done ? 'done' : 'in-progress'} right={`${done ? 100 : Math.round(runProgress(run) * 100)}%`}>Scenarios optimized</ReadinessStatus>
              <ReadinessStatus type={final ? 'done' : 'in-progress'} right={finalS ? finalS.name : 'Not started'}>Final scenario selected</ReadinessStatus>
            </div>}
            <ReadinessStatus type={['approved', 'scheduled', 'published'].includes(phase) ? 'done' : phase === 'approval' ? 'active' : 'in-progress'} right={{ approval: 'In approval', approved: 'All gates passed', scheduled: 'Scheduled', published: 'Published', final: 'Ready to send' }[phase] || 'Queued'}>Approve</ReadinessStatus>
          </div>
        </PSec>
        <div className="ifs-grid is-halves">
          <div className="col" style={{ gap: 'var(--space-200)' }}>
            <SegmentedControl size="s" value={measure} onChange={setMeasure} options={[{ value: 37, label: 'CAPEX' }, { value: 167, label: 'OPEX' }, { value: 223, label: 'Total Investment Cost' }]} />
            <ColumnChart title={`Yearly forecast vs budget · ${done ? (finalS ? 'final plan' : 'Optimized') : 'requested'}`} data={forecast} valueLabel={o.measure} referenceLabel="Budget (max)" format={fmtMoney} />
          </div>
          <LineChart title="Aggregate risk" data={riskData} format={v => fmtCompact(v)} zeroBased
            series={[{ key: 'req', label: 'Requested plan', dashed: !!done }, ...(done ? [{ key: 'opt', label: finalS ? 'Final plan' : 'Optimized plan', points: true }] : []), { key: 'cap', label: 'Risk cap', dashed: true }]} />
        </div>
      </div>
    </AppShell>
  );
}

/* ============================================================ notifications (NavBar bell) */
function Notifications({ open, notes, onClose, onOpen }) {
  const ago = t => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'Just now' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`; };
  return (
    <Drawer open={open} onOpenChange={o => !o && onClose()} title="Notifications" collapsible={false} overlay="none">{/* overlay="none": DS 2.0 bug — the Drawer scrim sits above the drawer */}
      <div className="col" style={{ gap: 'var(--space-stack)', padding: '0 var(--space-inset) var(--space-inset)' }}>
        {!notes.length && <span className="t-body-m-regular sec">Nothing new. Notifications about your plans and investments appear here.</span>}
        {notes.map(n => <NotificationCard key={n.id} type="specific" read={n.read} title={n.title} details={n.details} meta={n.meta} time={ago(n.time)}
          actionRequired={false} avatar={n.cooper ? undefined : n.avatar} actions={n.link ? [{ label: n.action || 'Open', onClick: () => onOpen(n) }] : undefined} />)}
      </div>
    </Drawer>
  );
}

/* ============================================================ Compare (Figma 85:65862; results stream in while optimizing, 85:83784) */
function PlanCompare({ navBar, run, done, final, stage, onSelect, onSendApproval, onBack, onSetup, reopt, setReopt }) {
  const CARDS = compareScenarios(reopt);
  const reRunning = reopt && reopt.status === 'running';
  const [tab, setTab] = useState('overview');
  // J18: System confidence (open questions gate Send for approval), Cooper's evaluation and the evidence chain
  const conf = useIssueReport({ issues: useMemo(() => compareIssues(), []) });
  const [cooperOpen, setCooperOpen] = useState(false), [evid, setEvid] = useState(false), [cmp, setCmp] = useState(null);
  const answered = compareIssues().every(i => { const st = (conf.status || {})[i.id]; return st && (st.applied || st.answer || st.file); });
  const evalId = final || COOPER_PICK;
  const [, tick] = useState(0);
  useEffect(() => { if (!run && !reRunning) return; const iv = setInterval(() => tick(t => t + 1), 500); return () => clearInterval(iv); }, [run, reRunning]);
  const p = done ? 1 : runProgress(run);
  const others = COMPARE_SCENARIOS.filter(c => !c.baseline);
  const ready = c => c.baseline || done || p >= (others.indexOf(c) + 1) / (others.length + 1);   // "baseline will already be here, rest … get populated as the results come in"
  const shown = CARDS.filter(ready);
  const pct = (a, b) => `${a >= b ? '+' : ''}${Math.round((a / b - 1) * 100)}%`;
  const sent = stage === 'approval';
  const header = <PageHeader title={PLAN_TITLE} onBack={onBack} status={<Indicator type="blue">Planning</Indicator>}
    center={<Stepper current={sent ? 2 : 1} steps={[{ label: 'Setup' }, { label: 'Compare' }, { label: 'Approve' }]} />}
    actions={<div className="row" style={{ gap: 'var(--space-200)' }}>
      <Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      <IB icon="system-comment" type="tertiary" size="s" label="Comments" onClick={() => toast({ title: 'Comments aren’t part of this flow' })} />
      <Button type="primary" size="s" disabled={!final || !done || sent} onClick={onSendApproval} aria-label="Send for approval">{sent ? 'Sent for approval' : 'Send for approval'}</Button>
    </div>} />;
  const Card = ({ c }) => {
    const isFinal = final === c.id, pick = c.id === COOPER_PICK && done;
    if (!ready(c)) return <ContentCard className="plan-card" loading title={c.short} />;
    return (
      <ContentCard className={`plan-card${isFinal ? ' is-final' : ''}`} cooper={pick} selected={isFinal}
        top={<div className="col" style={{ gap: 'var(--space-200)', width: '100%' }}>
          <span className="row" style={{ gap: 'var(--space-200)' }}><span className="t-label-l-medium">{c.short}</span>{c.reopt && <Indicator type="purple">Re-optimized</Indicator>}</span>
          <div className="row" style={{ gap: 'var(--space-200)', alignItems: 'baseline' }}>
            <span className="t-heading-h2-medium">{fmtMoney(c.capex)}</span>
            {c.baseline ? <span className="t-label-m-regular muted">baseline</span>
              : <span className={`t-label-m-medium ${c.capex >= COMPARE_BASE.capex ? 'plan-up' : 'plan-down'}`}>{pct(c.capex, COMPARE_BASE.capex)} <span className="t-label-m-regular muted">vs baseline</span></span>}
          </div>
          <div style={{ borderTop: 'var(--border-widths-border-100) solid var(--border-base)' }} />
          <div><Badge size="s" color="black">{c.baseline ? `${PLAN_INVESTMENTS.length} investments` : `${c.onSchedule} of ${PLAN_INVESTMENTS.length} on schedule`}</Badge></div>
          <span className="t-body-m-regular sec">{c.baseline ? `Value ${fmtCompact(c.value)} · as requested` : `Value ${fmtCompact(c.value)} (${pct(c.value, COMPARE_BASE.value)}) · ${c.deferred} deferred, ${c.altChanged} alternatives changed`}{pick ? ' · Cooper’s pick' : ''}{c.reopt ? ` · the real re-run with the latest actuals (asked: ${c.asked})` : ''}</span>
          <StatCard size="s" title="Retained risk (2032)" value={c.risk2032 == null ? '—' : fmtCompact(c.risk2032)} description={c.baseline ? 'aggregate risk' : `${pct(c.risk2032, COMPARE_BASE.risk2032)} vs baseline`} descriptionPosition="inline" />
        </div>}
        bottom={<div className="row" style={{ gap: 'var(--space-200)', width: '100%' }}>
          {!c.baseline && !c.reopt && <IB icon="arrow-refresh" type="tertiary" size="s" label={`Re-optimize ${c.short}`} disabled={!done || sent || (reopt && reopt.status !== 'done')}
            onClick={() => setReopt({ from: c.id, status: 'chat', answers: [] })} />}
          <div style={{ flex: 1 }}>
            {isFinal ? <Button type="secondary" size="s" iconLeft="system-check" disabled style={{ width: '100%' }}>Final plan</Button>
              : <Button type="secondary" size="s" disabled={!done || sent} style={{ width: '100%' }} aria-label={`Select ${c.short} as final plan`} onClick={() => onSelect(c.id)}>Select as final plan</Button>}
          </div>
        </div>} />
    );
  };
  const yrs = PLAN_YEARS.filter(y => y >= 2028 && y <= 2032);
  const series = shown.map(c => ({ key: String(c.id), label: c.short }));
  const capexByYear = yrs.map(y => ({ label: `${y}`, ...Object.fromEntries(shown.map(c => [String(c.id), PLAN_SCENARIOS.find(s => s.id === c.id).outcomes.find(o => o.measureId === 37).byYear[PLAN_YEARS.indexOf(y)]])) }));
  const riskByYear = PLAN_YEARS.filter(y => y <= 2032).map(y => ({ label: `${y}`, ...Object.fromEntries(shown.map(c => [String(c.id), PLAN_SCENARIOS.find(s => s.id === c.id).outcomes.find(o => o.measureId === 21).byYear[PLAN_YEARS.indexOf(y)]])) }));
  return (
    <AppShell navBar={navBar} header={header}
      bottom={<BottomSheet type="value" documents={{ label: '16 Documents', onClick: () => toast({ title: 'Cooper’s context: 16 documents' }) }} onUpload={() => toast({ title: 'Upload' })}
        prompts={['Explain gaps in confidence', 'Why this scenario?']} onPrompt={pr => /^Why/.test(pr) ? setCooperOpen(true) : toast({ title: 'Cooper', description: `${compareIssues().filter(i => !((conf.status || {})[i.id])).length} open question(s) before approval: see System confidence.` })} />}>
      {run && !done && <RunProgress run={run} onClose={() => {}} />}
      <div className="page-row"><div className="page">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="t-heading-h2-medium">Scenario Comparison</span>
          <div className="row" style={{ gap: 'var(--space-200)' }}>
            <Button type="tertiary" size="s" iconLeft="system-plus" onClick={() => toast({ title: 'New scenario isn’t part of this flow' })}>New scenario</Button>
            <Button type="secondary" size="s" iconLeft="cooper-system-icon" disabled={!done} onClick={() => setCooperOpen(true)}>Cooper’s evaluation</Button>
          </div>
        </div>
        <div className="plan-cards">{CARDS.map(c => <Card key={c.id} c={c} />)}
          {reRunning && <ContentCard className="plan-card" loading title={`${planReoptScenario(reopt).short} · ${Math.round(reoptProgress(reopt) * 100)}%`} />}</div>
        <div><Tabs value={tab} onChange={setTab} aria-label="Compare" items={[{ value: 'overview', label: 'Overview' }, { value: 'measures', label: 'Value measures and constraints' }, { value: 'investments', label: 'Investments' }]} /></div>
        {tab === 'overview' && <div className="col" style={{ gap: 'var(--space-300)' }}>
          <PSec title="Value Comparison">
            <div style={{ padding: 'var(--space-200) var(--space-150) var(--space-150)' }}><StatCardsRow cards={shown.map(c => ({ size: 's', title: c.short, value: fmtCompact(c.value),
              ...(c.baseline ? {} : { trend: pct(c.value, COMPARE_BASE.value), trendDirection: c.value >= COMPARE_BASE.value ? 'up' : 'down' }) }))} /></div>
          </PSec>
          <GroupedColumnChart title="Forecast comparison by year · CAPEX" data={capexByYear} series={series} format={fmtMoney} />
          <LineChart title="Aggregate risk by year" data={riskByYear} series={series.map((s, i) => ({ ...s, dashed: i === 0 }))} format={v => fmtCompact(v)} />
        </div>}
        {tab === 'measures' && <PSec title="Value Measures and Constraints">
          <div style={{ padding: 'var(--space-200) var(--space-150) var(--space-150)', overflowX: 'auto' }}>
            <Table rowHeight={48} rows={planConstraintsOf(PLAN_BASELINE_ID).map(r => ({ ...r }))} columns={[
              { key: 'measure', title: 'Measure', width: 'var(--table-col-primary-min)', render: r => <span className="t-label-m-medium">{r.measure}</span> },
              { key: 'cap', title: '2028–32 cap', width: 'var(--table-col-short-min)', render: r => { const m = SETUP_YEARS.reduce((t, y) => t + (r.years[y].max || 0), 0); return m ? fmtUnit(m, r.unit) : '—'; } },
              ...shown.map(c => ({ key: String(c.id), title: c.short, width: 'var(--table-col-short-min)', render: r => {
                const o = PLAN_SCENARIOS.find(s => s.id === c.id).outcomes.find(x => x.measureId === r.measureId);
                const tot = SETUP_YEARS.reduce((t, y) => t + (o.byYear[PLAN_YEARS.indexOf(y)] || 0), 0), cap = SETUP_YEARS.reduce((t, y) => t + (r.years[y].max || 0), 0);
                return <span className={cap && tot > cap ? 'plan-down' : ''}>{fmtUnit(tot, r.unit)}</span>; } }))]} />
          </div>
        </PSec>}
        {tab === 'investments' && (() => { const id = cmp || final || COOPER_PICK, rows = scenarioChanges(id).filter(r => r.band !== 'No shift' || true);
          return <PSec title="Investments">
            <div className="col" style={{ gap: 'var(--space-200)', padding: 'var(--space-200) var(--space-150) var(--space-150)' }}>
              <div className="row" style={{ gap: 'var(--space-300)' }}><span className="t-body-m-regular sec">Baseline</span><span className="t-body-m-regular sec">compared to</span>
                <div style={{ width: 'var(--proto-picker-w)' }}><Select value={id} onChange={setCmp} options={CARDS.filter(c => !c.baseline).map(c => ({ value: c.id, label: c.short }))} /></div>
                <span className="t-body-m-regular muted">Derived from the scenario’s totals</span></div>
              <Table rowHeight={48} groupBy="band" defaultCollapsed={['No shift']} rows={rows} columns={[
                { key: 'name', title: 'Investment', width: '2fr', primary: true, render: r => <span className="col"><span className="t-label-m-medium plan-ellipsis">{r.name}</span><span className="t-body-m-regular muted">{r.code}</span></span> },
                { key: 'alternative', title: 'Alternative', width: '1fr', render: r => r.kind === 'alt' ? <span className="row" style={{ gap: 'var(--space-150)' }}><s className="muted">{r.alternative}</s><span>Alternative 2</span></span> : r.alternative },
                { key: 'start', title: 'Start date', width: '1fr', render: r => <span className="row" style={{ gap: 'var(--space-150)' }}>{fmtDate(r.start)}{r.months ? <Badge size="s" color="white">{`${r.months > 0 ? '+' : '−'}${Math.abs(r.months)}m`}</Badge> : null}</span> },
                { key: 'capex', title: 'Cost', type: 'number', width: 'var(--table-col-number-min)', render: r => fmtMoney(r.capex) }]} />
            </div></PSec>; })()}
      </div>
      <div className="page-dock" style={{ height: 'calc(100vh - var(--proto-sticky-offset))' }}>
        <Panel title="System confidence" collapsible={false} dot={conf.dot || undefined} onEvidence={() => setEvid(true)} className="ifs-trc-panel" style={{ height: '100%' }}>
          <ContentCard className="ifs-trc-card" title={<ConfidenceGates controller={conf} label="Approval readiness" />}
            bottom={<div className="ifs-trc-card__issues"><IssueNavigator controller={conf} /></div>} />
        </Panel>
      </div></div>
      {reopt && reopt.status === 'chat' && <ReoptChat reopt={reopt} setReopt={setReopt} />}
      {cooperOpen && !evid && <div className="rec-evidence"><AgentWindow text={cooperEvaluation(evalId)} onClose={() => setCooperOpen(false)} onAsk={() => {}}
        secondaryAction={{ label: 'Evidence chain', onClick: () => setEvid(true) }} /></div>}
      {evid && <div className="rec-evidence"><IFS.EvidenceChainDrawer open={evid} onOpenChange={setEvid} value={87} rationale={compareEvidence(evalId)} benchmark={{ empty: true }} /></div>}
    </AppShell>
  );
}
