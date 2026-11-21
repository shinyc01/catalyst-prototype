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
  const [tried, setTried] = useState(false);   // rule 7.4: validate on submit, never disable the primary action
  useEffect(() => setTried(false), [decide]);
  const decideNow = () => {
    const k = decide, n = note.trim(); setDecide(null); setNote('');
    setGates(gs => ({ ...gs, [myGate.id]: gs[myGate.id].map(r => r.id === me ? { ...r, status: k === 'approve' ? 'success' : 'revisions', comment: n || r.comment } : r) }));
    toast({ title: k === 'approve' ? 'You approved the plan' : 'You requested changes', description: n ? `Comment: “${n}”` : `${myGate.label} gate` });
    onDecided && onDecided(k, n);
  };
  const c = compareScenarios().find(x => x.id === final) || COMPARE_SCENARIOS[1];
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
  const push = (gid, a) => setTimeout(() => setGates(gs => ({ ...gs, [gid]: gs[gid].map(r => r.id === a.id ? { ...r, status: 'success' } : r) })), 3000);
  const change = (gid, r) => setGates(gs => ({ ...gs, [gid]: gs[gid].map(x => x.id === r.id ? { ...paRow('MD', 'Mara Delgado', 'VP of Planning', 'awaiting'), replaced: { name: x.name, avatar: x.avatar } } : x) }));
  const [onTitleMenu, activityPanel] = useActivity('plan', planVersions(stage, true), PA_GATES.flatMap(g => gates[g.id] || []));
  const header = <PageHeader title={PLAN_PORTFOLIO.name} id={PLAN_CYCLE} onBack={onBack} onTitleMenu={onTitleMenu} status={stage === 'published' ? <Indicator type="green">Published</Indicator> : stage === 'scheduled' ? <Indicator type="blue">Scheduled</Indicator> : <Indicator type="blue">Planning</Indicator>}
    center={<Stepper current={all ? 3 : 2} steps={[{ label: 'Setup' }, { label: 'Compare' }, { label: 'Approve' }]} />}
    actions={<Inline gap="200" align="center"><Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      {myRow && paOpen(myGate.id, gates) && (myRow.status === 'awaiting'
        ? <SplitButton size="s" onClick={() => setDecide('approve')} menuLabel="More decisions" items={[{ label: 'Approve', description: 'Approve the plan at this gate.', onClick: () => setDecide('approve') },
            { label: 'Request changes', description: 'Send it back with what needs to change.', onClick: () => setDecide('request') }]}>Decide</SplitButton>
        : <Button type="secondary" size="s" iconLeft={myRow.status === 'success' ? 'system-check' : undefined} disabled>{myRow.status === 'success' ? 'Approved' : 'Changes requested'}</Button>)}
      <Button type="primary" size="s" disabled={!all || stage === 'published'} onClick={() => setPub(true)}>{stage === 'scheduled' ? 'Re-schedule' : stage === 'published' ? 'Published' : 'Publish'}</Button></Inline>} />;
  return (
    <AppShell navBar={navBar} header={header} bottom={<BottomSheet type="documents" documents={{ label: '16 Documents', onClick: () => toast({ title: 'Cooper’s context: 16 documents' }) }} onUpload={() => toast({ title: 'Upload' })} prompts={['Compare to peer', 'Compare to best practice']} onPrompt={p => setAnswer(planCooperAnswer(/peer/.test(p) ? 'peer' : 'best', { final }))} />}>
      <div className="page">
        <Stack gap="100">
          <Inline gap="200" align="center"><h3 className="t-heading-h3-medium" style={{ margin: 0 }}>Approval</h3><Badge size="s" color="white">{c.short}</Badge>
            <span style={{ flex: 1 }} />{onCompare && <Button type="tertiary" size="s" iconLeft="compare" onClick={onCompare}>Open the comparison</Button>}</Inline>
          <span className="t-body-m-regular sec t-measure">{stage === 'published' ? `${PLAN_CYCLE} is the budget baseline. Translating it into spend authority per business unit isn’t designed yet (J21 gap).`
            : stage === 'scheduled' ? `${PLAN_CYCLE} publishes on ${gates.scheduledAt || 'the chosen date'} and becomes the budget baseline.`
            : 'Reviewers and approvers are preconfigured by your administrator based on your role and plan type.'}</span>
        </Stack>
        <div className="ifs-grid">{[['Cost', fmtMoney(c.capex), `${c.name}`], ['Retained risk (2032)', c.risk2032 == null ? '—' : fmtCompact(c.risk2032), 'aggregate risk'], ['Investments funded', String(c.onSchedule), `of ${PLAN_INVESTMENTS.length} · ${c.deferred} deferred`]]
          .map(([t, v, d]) => <div key={t} className="ifs-span-4"><StatCard size="s" title={t} value={v} description={d} /></div>)}</div>
        {/* rule 7.9 / Approval chain rule 10: one ApprovalChainTable with a stage per gate (Executive opens first; Technical and Financial together after it).
            The kit reads a stage's fold on mount, so the key remounts it when a stage unlocks and the newly open stages unfold. */}
        <IFS.ApprovalChainTable key={PA_GATES.map(g => paOpen(g.id, gates) ? 1 : 0).join('')} view="full" details currentUserId={me || 'OF'} ownerId="OF" className="pa-chain"
          stages={PA_GATES.map(g => { const avail = paOpen(g.id, gates);
            return { id: g.id, label: g.label, locked: !avail, note: avail ? undefined : 'Opens when Executive is approved', collapsed: !avail,   // the kit also folds a fully approved stage
              approvers: gates[g.id].map(r => g.id === 'executive' && r.id === 'TQ' && r.status !== 'success' ? { ...r, action: { label: 'Change reviewer', icon: 'users-group', onClick: () => change(g.id, r) } } : r) }; })}
          onStagesChange={st => {
            setGates(gs => ({ ...gs, ...Object.fromEntries(st.map(x => [x.id, x.approvers.map(a => { const r = { ...a }; delete r.action; return r; })])) })); }}
          onPush={a => { const g = PA_GATES.find(x => gates[x.id].some(r => r.id === a.id)); g && push(g.id, a); }} />
      </div>
      {answer && <div className="rec-evidence"><AgentWindow text={answer} onClose={() => setAnswer(null)} onAsk={() => {}} /></div>}
      <Modal open={decide !== null} onOpenChange={o => !o && setDecide(null)} title={decide === 'approve' ? 'Approve the Plan' : 'Request Changes'} width="var(--overlay-width-m)"
        secondaryAction={{ label: 'Cancel', onClick: () => setDecide(null) }}
        primaryAction={{ label: decide === 'approve' ? 'Approve plan' : 'Request changes', onClick: () => decide === 'request' && !note.trim() ? setTried(true) : decideNow() }}>
        <IFS.TextArea size="m" label="Comment" error={tried && decide === 'request' && !note.trim() ? 'Comment is required' : undefined} placeholder={decide === 'approve' ? 'Optional. Everyone in the approval chain sees it.' : 'Required: what needs to change?'} value={note}
          onChange={e => setNote(e && e.target ? e.target.value : e)} />
      </Modal>
      <PaPublish open={pub} onClose={() => setPub(false)} onDone={(kind, when) => { setPub(false); if (kind === 'schedule') setGates(gs => ({ ...gs, scheduledAt: when })); onPublish(kind === 'schedule' ? 'scheduled' : 'published', when); }} />
      {activityPanel}
    </AppShell>
  );
}

// Publish / Schedule modal (Figma 84:110957 → 84:114070). No DS time picker: a Select of quarter hours (non-DS composition)
const PA_TIMES = Array.from({ length: 40 }, (_, k) => { const m = 7 * 60 + k * 15, h = Math.floor(m / 60), mm = m % 60; return `${(h + 11) % 12 + 1}:${String(mm).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; });
function PaPublish({ open, onClose, onDone }) {
  const [date, setDate] = useState(null), [time, setTime] = useState(null);
  const [tried, setTried] = useState(false);
  const when = date && `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${time ? `, ${time}` : ''}`;   // rule 8.30: Nov 12, 2026, 3:44 AM
  return <Modal open={open} onOpenChange={o => !o && onClose()} title={date ? 'Scheduling' : 'Publish'} width="var(--overlay-width-m)"
    secondaryAction={{ label: 'Cancel', onClick: onClose }}
    primaryAction={date ? { label: 'Schedule', onClick: () => time ? onDone('schedule', when) : setTried(true) } : { label: 'Publish now', onClick: () => onDone('now') }}>
    <Inline gap="stack" align="start">
      <div style={{ flex: 1 }}><DatePicker label="Date" placeholder="Select a date" value={date} onChange={setDate} showApply /></div>
      <NDS label="Time picker (no DS TimePicker)" style={{ flex: 1 }}><Select label="Time" placeholder="Select a time" value={time} onChange={setTime} options={PA_TIMES} error={tried && !time ? 'Select a time' : undefined} /></NDS>
    </Inline>
  </Modal>;
}
