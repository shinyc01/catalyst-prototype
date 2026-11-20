/* Plan › Approve (J21 · Approval workflow management) and Publish / Schedule.
   Figma Plan handover: Executive gate 84:108440, workspace (changed reviewer / all approved) 84:108435, Publish / Schedule 84:108890.
   Gates and reviewers are [Added] (invented people, Figma roles); the numbers are the chosen scenario's real record.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
const PA_GATES = [{ id: 'executive', label: 'Executive' }, { id: 'technical', label: 'Technical' }, { id: 'financial', label: 'Financial' }];
const paRow = (id, name, role, status, extra = {}) => ({ id, name, role, avatar: { initials: id, type: (PEOPLE[id] || {}).type || 'blue' }, status, ...extra });
const paInitialGates = () => ({
  executive: [paRow('TM', 'Theo Marsh', 'CFO', 'awaiting', { lastNotified: 'Nov 17, 2026' }), paRow('KM', 'Kenji Mori', 'Director of Capital Planning', 'awaiting'),
    paRow('TQ', 'Tara Quinn', 'COO', 'awaiting', { comment: 'The cost range needs a clearer benchmark before I can sign off.' })],
  technical: [paRow('RB', 'Ravi Banerjee', 'VP of Operations', 'awaiting'), paRow('LF', 'Luca Ferri', 'Field Engineering Lead', 'awaiting')],
  financial: [paRow('NL', 'Noah Lindgren', 'Capital Finance Analyst', 'awaiting'), paRow('PI', 'Priyanka Iyer', 'Controller', 'awaiting')],
});
// Executive opens first; Technical and Financial open together once it is approved (Figma 84:108777, not strictly sequential)
const PA_OPENS_AFTER = { technical: 'executive', financial: 'executive' };
// [Assumed] who answers on their own and who waits for the owner: the CFO and the COO (Executive) and the Field Engineering Lead (Technical) need a push or a change
const PA_SLOW = { TM: true, TQ: true, LF: true };
const paApproved = rows => rows.every(r => r.status === 'success');
const paOpen = (g, gates) => !PA_OPENS_AFTER[g] || paApproved(gates[PA_OPENS_AFTER[g]]);

function PlanApprove({ navBar, final, gates, setGates, stage, onBack, onPublish, persona, onCompare, onDecided }) {
  // J22: a signed-in reviewer (the CFO, or the Director of Capital Planning) decides in place
  const me = (PERSONAS[persona] || {}).initials, myGate = PA_GATES.find(g => (gates[g.id] || []).some(r => r.id === me));
  const myRow = myGate && gates[myGate.id].find(r => r.id === me);
  const [decide, setDecide] = useState(null), [note, setNote] = useState(''), [answer, setAnswer] = useState(null);
  const decideNow = () => {
    const k = decide, n = note.trim(); setDecide(null); setNote('');
    setGates(gs => ({ ...gs, [myGate.id]: gs[myGate.id].map(r => r.id === me ? { ...r, status: k === 'approve' ? 'success' : 'revisions', comment: n || r.comment } : r) }));
    toast({ title: k === 'approve' ? 'You approved the plan' : 'You requested changes', description: n ? `Comment: “${n}”` : `${myGate.label} gate` });
    onDecided && onDecided(k, n);
  };
  const c = compareScenarios().find(x => x.id === final) || COMPARE_SCENARIOS[1];
  const [open, setOpen] = useState({ executive: true });
  const [pub, setPub] = useState(false);
  const all = PA_GATES.every(g => paApproved(gates[g.id]));
  // [Assumed] reviewers answer on their own a few seconds after a gate opens, except PA_SLOW
  useEffect(() => {
    const t = setTimeout(() => setGates(gs => {
      const n = { ...gs };
      PA_GATES.forEach(g => { if (paOpen(g.id, gs)) n[g.id] = gs[g.id].map(r => r.status === 'awaiting' && !PA_SLOW[r.id] && !r.replaced ? { ...r, status: 'success' } : r); });
      return n;
    }), 4000);
    return () => clearTimeout(t);
  }, [JSON.stringify(PA_GATES.map(g => paOpen(g.id, gates)))]);
  useEffect(() => { if (all && stage === 'approval') onPublish('approved'); }, [all]);
  useEffect(() => { PA_GATES.forEach(g => { if (paOpen(g.id, gates) && !paApproved(gates[g.id])) setOpen(o => ({ ...o, [g.id]: true })); }); }, [JSON.stringify(PA_GATES.map(g => paOpen(g.id, gates)))]);
  const push = (gid, a) => setTimeout(() => setGates(gs => ({ ...gs, [gid]: gs[gid].map(r => r.id === a.id ? { ...r, status: 'success' } : r) })), 3000);
  const change = (gid, r) => setGates(gs => ({ ...gs, [gid]: gs[gid].map(x => x.id === r.id ? { ...paRow('MD', 'Mara Delgado', 'VP of Planning', 'awaiting'), replaced: { name: x.name, avatar: x.avatar } } : x) }));
  const header = <PageHeader title={PLAN_PORTFOLIO.name} id={PLAN_CYCLE} onBack={onBack} status={<Indicator type="blue">Planning</Indicator>}
    center={<Stepper current={all ? 3 : 2} steps={[{ label: 'Setup' }, { label: 'Compare' }, { label: 'Approve' }]} />}
    actions={<div className="row" style={{ gap: 'var(--space-200)' }}><Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      {myRow && paOpen(myGate.id, gates) && (myRow.status === 'awaiting'
        ? <SplitButton size="s" onClick={() => setDecide('approve')} menuLabel="More decisions" items={[{ label: 'Approve', description: 'Approve the plan at this gate.', onClick: () => setDecide('approve') },
            { label: 'Request changes', description: 'Send it back with what needs to change.', onClick: () => setDecide('request') }]}>Decide</SplitButton>
        : <Button type="secondary" size="s" iconLeft={myRow.status === 'success' ? 'system-check' : undefined} disabled>{myRow.status === 'success' ? 'Approved' : 'Changes requested'}</Button>)}
      <Button type="primary" size="s" disabled={!all || stage === 'published'} onClick={() => setPub(true)}>{stage === 'scheduled' ? 'Re-schedule' : stage === 'published' ? 'Published' : 'Publish'}</Button></div>} />;
  return (
    <AppShell navBar={navBar} header={header} bottom={<BottomSheet prompts={['Compare to peer', 'Compare to best practice']} onPrompt={p => setAnswer(planCooperAnswer(/peer/.test(p) ? 'peer' : 'best', { final }))} />}>
      <div className="page">
        <div className="col" style={{ gap: 'var(--space-100)' }}>
          <div className="row" style={{ gap: 'var(--space-200)' }}><span className="t-heading-h2-medium">Approval</span><Badge size="s" color="white">{c.short}</Badge>
            <span style={{ flex: 1 }} />{onCompare && <Button type="tertiary" size="s" iconLeft="compare" onClick={onCompare}>Open the comparison</Button>}</div>
          <span className="t-body-m-regular sec">Reviewers and approvers are preconfigured by your administrator based on your role and plan type.</span>
        </div>
        <div className="ifs-grid">{[['Cost', fmtMoney(c.capex), `${c.name}`], ['Retained risk (2032)', c.risk2032 == null ? '—' : fmtCompact(c.risk2032), 'aggregate risk'], ['Investments funded', String(c.onSchedule), `of ${PLAN_INVESTMENTS.length} · ${c.deferred} deferred`]]
          .map(([t, v, d]) => <div key={t} className="ifs-span-4"><StatCard size="s" title={t} value={v} description={d} /></div>)}</div>
        {stage === 'scheduled' && <IFS.Alert type="info" title="Publication scheduled">{`${PLAN_CYCLE} publishes on ${gates.scheduledAt || 'the chosen date'} and becomes the budget baseline.`}</IFS.Alert>}
        {stage === 'published' && <IFS.Alert type="success" title="Published">{`${PLAN_CYCLE} is the budget baseline. Translating it into spend authority per business unit isn’t designed yet (J21 gap).`}</IFS.Alert>}
        <ContentCard bottom={<div className="col" style={{ gap: 'var(--space-100)', width: '100%' }}>{PA_GATES.map(g => {
          const rows = gates[g.id], ok = paApproved(rows), avail = paOpen(g.id, gates), isOpen = avail && open[g.id];
          return <div key={g.id} className="col" style={{ gap: 'var(--space-100)' }}>
            <button className="pa-gate" data-gate={g.id} disabled={!avail} aria-expanded={!!isOpen} onClick={() => setOpen(o => ({ ...o, [g.id]: !o[g.id] }))}>
              <Icon name={!avail ? 'lock' : isOpen ? 'arrow-caret-down-filled' : 'arrow-caret-right-filled'} size={16} />
              <span className="t-label-m-medium" style={{ flex: 1 }}>{g.label}</span>
              {avail && (ok ? <Indicator type="green">Approved</Indicator> : <span className="row" style={{ gap: 'var(--space-150)' }}><Indicator type="orange">Under review</Indicator><IFS.Counter>{`${rows.filter(r => r.status === 'success').length}/${rows.length}`}</IFS.Counter></span>)}
              {!avail && <span className="t-body-m-regular muted">Opens when Executive is approved</span>}
            </button>
            {isOpen && <IFS.ApprovalChainTable view="full" details currentUserId={me || 'OF'} ownerId="OF" onChange={a => setGates(gs => ({ ...gs, [g.id]: a.map(x => { const r = { ...x }; delete r.action; return r; }) }))}
              approvers={rows.map(r => g.id === 'executive' && r.id === 'TQ' && r.status !== 'success' ? { ...r, action: { label: 'Change reviewer', icon: 'users-group', onClick: () => change(g.id, r) } } : r)}
              onPush={a => push(g.id, a)} />}
          </div>; })}</div>} />
      </div>
      {answer && <div className="rec-evidence"><AgentWindow text={answer} onClose={() => setAnswer(null)} onAsk={() => {}} /></div>}
      <Modal open={decide !== null} onOpenChange={o => !o && setDecide(null)} title={decide === 'approve' ? 'Approve the plan' : 'Request changes'} width="var(--overlay-width-m)"
        secondaryAction={{ label: 'Cancel', onClick: () => setDecide(null) }}
        primaryAction={{ label: decide === 'approve' ? 'Approve' : 'Request changes', disabled: decide === 'request' && !note.trim(), onClick: decideNow }}>
        <IFS.TextArea size="l" label="Comment" placeholder={decide === 'approve' ? 'Optional. Everyone in the approval chain sees it.' : 'Required: what needs to change?'} value={note}
          onChange={e => setNote(e && e.target ? e.target.value : e)} />
      </Modal>
      <PaPublish open={pub} onClose={() => setPub(false)} onDone={(kind, when) => { setPub(false); if (kind === 'schedule') setGates(gs => ({ ...gs, scheduledAt: when })); onPublish(kind === 'schedule' ? 'scheduled' : 'published', when); }} />
    </AppShell>
  );
}

// Publish / Schedule modal (Figma 84:110957 → 84:114070). No DS time picker: a Select of quarter hours (non-DS composition)
const PA_TIMES = Array.from({ length: 40 }, (_, k) => { const m = 7 * 60 + k * 15, h = Math.floor(m / 60), mm = m % 60; return `${(h + 11) % 12 + 1}:${String(mm).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; });
function PaPublish({ open, onClose, onDone }) {
  const [date, setDate] = useState(null), [time, setTime] = useState(null);
  const when = date && `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${time ? ` · ${time}` : ''}`;
  return <Modal open={open} onOpenChange={o => !o && onClose()} title={date ? 'Scheduling' : 'Publish'} width="var(--overlay-width-m)"
    secondaryAction={{ label: 'Cancel', onClick: onClose }}
    primaryAction={date ? { label: 'Schedule', disabled: !time, onClick: () => onDone('schedule', when) } : { label: 'Publish now', onClick: () => onDone('now') }}>
    <div className="row" style={{ gap: 'var(--space-stack)', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}><DatePicker label="Date" placeholder="Select a date" value={date} onChange={setDate} showApply /></div>
      <NDS label="Time picker (no DS TimePicker)" style={{ flex: 1 }}><Select label="Time" placeholder="Select a time" value={time} onChange={setTime} options={PA_TIMES} /></NDS>
    </div>
  </Modal>;
}
