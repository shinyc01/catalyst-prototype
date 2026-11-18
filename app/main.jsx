/* App shell: URL ↔ state, routing between screens, render.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
/* ============================================================ hash ↔ state */
function initialFromHash(h) {
  const [name, q] = h.split('?');
  const s = { tab: 'readiness', persona: 'owner', screen: 'command', details: false, sel: 'overview', lenses: INITIAL_LENSES, chat: null, idea: null, asset: null, year: NOW };
  const p = new URLSearchParams(q || '');
  if (p.get('asset') && assetById(p.get('asset'))) s.asset = p.get('asset');
  if (p.get('persona') && PERSONAS[p.get('persona')]) s.persona = p.get('persona');
  if (p.get('year')) s.year = Math.min(END, Math.max(NOW, +p.get('year') || NOW));
  if (name.startsWith('explore')) { s.screen = 'explore'; s.details = name === 'explore-details'; }
  if (name.startsWith('study')) s.screen = 'study';
  if (name === 'study-flood') s.sel = 'flood';
  if (name === 'study-lens-chat') s.chat = { kind: 'lens', msgs: [{ role: 'cooper', ...LENS_SCRIPT[0] }], i: 0, busy: false, answers: [] };
  if (name === 'study-lens-added') { s.lenses = withEv(INITIAL_LENSES); s.chat = replay('lens', EV_ANSWERS, s.lenses); }
  if (name === 'study-idea') { s.lenses = withEv(INITIAL_LENSES); s.chat = { kind: 'idea', msgs: [{ role: 'cooper', ...IDEA_SCRIPT[0] }], i: 0, busy: false, answers: [] }; }
  if (name === 'study-idea-done') { s.lenses = withEv(INITIAL_LENSES); s.chat = replay('idea', IDEA_ANSWERS, s.lenses); }
  if (name === 'plan') s.screen = 'plan';
  if (name === 'plan-compare') s.screen = 'plan-compare';
  if (name.startsWith('plan-') && name !== 'plan-compare') { s.screen = 'plan-setup'; s.tab = { 'plan-setup': 'readiness', 'plan-groups': 'groups', 'plan-scenarios': 'scenarios' }[name] || 'readiness'; }
  if (name === 'build') { s.lenses = withEv(INITIAL_LENSES); s.screen = 'build'; s.idea = { answers: IDEA_ANSWERS }; }
  return s;
}

/* ============================================================ app */
function App() {
  const init = useRef(initialFromHash(location.hash.slice(1))).current;
  const [screen, setScreen] = useState(init.screen);
  const [details, setDetails] = useState(init.details);
  const [sel, setSel] = useState(init.sel);
  const [lenses, setLenses] = useState(init.lenses);
  const [chat, setChat] = useState(init.chat);
  const [idea, setIdea] = usePersisted('idea', init.idea);
  const [asset, setAsset] = useState(init.asset);
  const [year, setYear] = useState(init.year);
  const [persona, setPersona] = useState(init.persona);
  const [flags, setFlags] = usePersisted('nds', false);                    // non-DS flags: off by default
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tour, setTour] = useState(null);                                   // { flow, step }
  // Plan (J16): row decisions, System confidence answers, scenario edits, the optimisation run, notifications — all survive a reload
  const [tab, setTab] = useState(init.tab);
  const [planRows, setPlanRows] = usePersisted('plan.rows', {});
  const [planSaved, setPlanSaved] = usePersisted('plan.confidence', {});
  const [planSetup, setPlanSetup] = usePersisted('plan.setup', {});
  const [run, setRun] = usePersisted('plan.run', null);                    // { startedAt, scenarios, done }
  const [sentAt, setSentAt] = usePersisted('plan.sentAt', {});
  const [planStage, setPlanStage] = usePersisted('plan.stage', 'time');   // time → setup → (run) → approval
  const [finalPlan, setFinalPlan] = usePersisted('plan.final', null);     // scenario id chosen on Compare
  useEffect(() => { if (screen === 'plan-setup' && planStage === 'time') setPlanStage('setup'); }, [screen]);
  const [notes, setNotes] = usePersisted('notifications', []);
  const [notesOpen, setNotesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchCtx, setSearchCtx] = useState(null);                        // { query, ids }: Explore shows the results bar after a search
  const [searchNetwork, setSearchNetwork] = usePersisted('search.network', 'normal');   // prototype setting: normal | slow | error (Figma 8)
  // Search opens from the icon, ⌘K / Ctrl+K, or / on any screen (Figma 1 · Start)
  useEffect(() => {
    const k = e => {
      const typing = /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
      else if (e.key === '/' && !typing) { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  const [trace, setTrace] = usePersisted('explore.trace', {});           // J02 Trace Report answers (the flood fix changes the lens source)
  const [showRun, setShowRun] = useState(true);
  const [, setTick] = useState(0);
  const notify = n => setNotes(l => [{ id: Date.now() + Math.random(), time: Date.now(), ...n }, ...l]);

  // Following a link or a tour step changes the hash: apply it to the app (replaceState below doesn't fire this)
  useEffect(() => {
    const apply = () => {
      const n = initialFromHash(location.hash.slice(1));
      setScreen(n.screen); setTab(n.tab); setDetails(n.details); setSel(n.sel); setLenses(n.lenses); setChat(n.chat); setAsset(n.asset); setYear(n.year); setPersona(n.persona);
      if (n.idea) setIdea(n.idea);
    };
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  // Routed fixes: each investment sent to its owner comes back fixed a few seconds later [Assumed: the owner's Build side isn't designed]
  useEffect(() => {
    const sent = PLAN_ROWS.filter(r => planRows[r.id] === 'sent');
    sent.forEach(r => { if (!sentAt[r.id]) setSentAt(m => ({ ...m, [r.id]: Date.now() })); });
    if (!sent.length) return;
    const iv = setInterval(() => {
      const due = sent.filter(r => sentAt[r.id] && Date.now() - sentAt[r.id] > OWNER_FIX_MS);
      if (!due.length) return;
      setPlanRows(st => { const n = { ...st }; due.forEach(r => { n[r.id] = 'ownerFixed'; }); return n; });
      due.forEach(r => { const who = (PEOPLE[r.owner] || {}).name;
        notify({ title: `${who} fixed ${r.code} in Build`, details: `${r.name}: ${r.issue.label.toLowerCase()} — corrected by the owner`, meta: `${r.code} · Build`, avatar: { initials: r.owner } });
        toast({ title: `${who} fixed ${r.code}`, description: 'The fix is back in Plan › Setup' }); });
    }, 1000);
    return () => clearInterval(iv);
  }, [planRows, sentAt]);
  // The optimisation run finishes on its own; then the badge goes and a notification links to the results
  useEffect(() => {
    if (!run || run.done) return;
    const iv = setInterval(() => {
      setTick(t => t + 1);
      if (runProgress(run) >= 1) {
        setRun(r => ({ ...r, done: true }));
        notify({ title: `Optimization finished: ${run.scenarios.length} scenarios ready`, details: `${PLAN_PORTFOLIO.name} · ${PLAN_CYCLE}. Compare the results to choose the final plan.`, meta: `${PLAN_CYCLE} · Plan`, cooper: true, link: 'plan' });
        toast({ title: 'Optimization finished', description: `${run.scenarios.length} scenarios are ready to compare`, primaryAction: { label: 'View results', onClick: () => { location.hash = '#plan'; } }, duration: 8000 });
      }
    }, 500);
    return () => clearInterval(iv);
  }, [run]);

  useEffect(() => {
    let h = screen;
    if (screen === 'plan-setup') h = { readiness: 'plan-setup', groups: 'plan-groups', scenarios: 'plan-scenarios' }[tab];
    if (screen === 'explore' && details) h = 'explore-details';
    if (screen === 'study') {
      if (chat?.kind === 'lens') h = chat.done ? 'study-lens-added' : 'study-lens-chat';
      else if (chat?.kind === 'idea') h = chat.done ? 'study-idea-done' : 'study-idea';
      else if (sel === 'flood') h = 'study-flood';
    }
    const q = new URLSearchParams();
    if (asset && screen !== 'command' && screen !== 'build') q.set('asset', asset);
    if (year !== NOW && screen === 'study') q.set('year', year);
    if (persona !== 'owner') q.set('persona', persona);
    const full = h + (q.toString() ? '?' + q : '');
    if (location.hash.slice(1) !== full) history.replaceState(null, '', '#' + full);
  }, [screen, details, sel, chat, asset, year, persona, tab]);

  // Opening a search result in its owning area (Figma "Opens in the owning area"); ⌘↵ opens it in a new tab
  const openFromSearch = (r, o = {}) => {
    const hashOf = x => x.open.screen === 'explore' ? `#explore${x.open.asset ? `?asset=${x.open.asset}&` : '?'}persona=${persona}` : `#${x.open.screen}${persona !== 'owner' ? `?persona=${persona}` : ''}`;
    if (o.viewAll) {
      const area = searchType(o.viewAll).area;
      if (area === 'Explore') { go('explore'); setSearchCtx(o.ids.length ? { query: o.query, ids: o.ids } : null); if (o.ids[0]) setAsset(o.ids[0]); }
      else toast({ title: `${area}: the full list of ${searchType(o.viewAll).label.toLowerCase()} for “${o.query}”`, description: `${area}’s library isn’t part of this prototype yet` });
      return;
    }
    if (r.open.toast) { toast({ title: `${r.code} · ${r.name}`, description: `Opens in ${r.open.toast} — not part of this prototype yet` }); return; }
    if (o.newTab) { window.open(location.pathname + hashOf(r), '_blank'); return; }
    if (r.open.screen === 'build') { setIdea(i => i || { answers: IDEA_ANSWERS }); go('build'); return; }
    go(r.open.screen);
    if (r.open.asset) { setAsset(r.open.asset); setSearchCtx({ query: o.query, ids: o.ids && o.ids.includes(r.open.asset) ? o.ids : [r.open.asset] }); }
  };
  const sendForApproval = () => {
    setPlanStage('approval');
    notify({ title: `${PLAN_CYCLE} sent for approval`, details: `${PLAN_SCENARIOS.find(x => x.id === finalPlan)?.name} · ${PLAN_PORTFOLIO.name}. Approvers are notified.`, meta: `${PLAN_CYCLE} · Plan`, link: 'plan' });
    toast({ title: 'Sent for approval', description: 'Approve is the next flow — the approvers are notified' });
    go('plan');
  };
  const go = s => { setScreen(s); setDetails(false); setAsset(null); if (s !== 'study') setChat(null); };
  const onStage = v => {
    if (v === 'command') go('command');
    else if (v === 'explore') go('explore');
    else if (v === 'build' && idea) go('build');
    else if (v === 'plan') go('plan');
    else toast({ title: `${v[0].toUpperCase() + v.slice(1)} isn’t part of this flow` });
  };
  const stage = screen === 'study' ? 'explore' : screen.startsWith('plan') ? 'plan' : screen;
  const running = run && !run.done;
  const navBar = <NavBar stages={STAGES} value={stage} onChange={onStage} user={{ initials: PERSONAS[persona].initials, name: PERSONAS[persona].name }}
    actions={<>
      {running && <OptimizingBadge onClick={() => { setShowRun(true); go('plan'); }} />}
      <IconButton icon="system-search" label="Search" size="s" onClick={() => setSearchOpen(true)} />
      <IconButton icon="system-settings" label="Settings" size="s" onClick={() => setSettingsOpen(true)} />
      <span className="ifs-navbar__notify"><IconButton icon="system-notification" label="Notifications" size="s" onClick={() => setNotesOpen(true)} />
        {notes.some(n => !n.read) && <span className="ifs-navbar__dot" aria-hidden="true" />}</span>
    </>} />;
  const effLenses = lensesWithTrace(lenses, trace);
  const shared = { navBar, lenses: effLenses, year, asset, setAsset };

  return (
    <div className={flags ? 'nds-on' : ''} style={{ height: '100%' }}>
      <SettingsPanel searchNetwork={searchNetwork} setSearchNetwork={setSearchNetwork} open={settingsOpen} onClose={() => setSettingsOpen(false)} persona={persona} setPersona={setPersona} flags={flags} setFlags={setFlags}
        onStart={f => { setSettingsOpen(false); setTour({ flow: f, step: 0 }); }} />
      {tour && <Tour flow={tour.flow} step={tour.step} setStep={n => setTour(t => ({ ...t, step: n }))}
        onExit={done => { setTour(null); if (done) toast({ title: `Flow complete: ${tour.flow.title}`, description: 'Open Flows to try another one.' }); }} />}
      {screen === 'command' && <Command key={persona} navBar={navBar} lenses={lenses} persona={persona} onOpen={d => {
        if (d.open === 'explore') go('explore');
        else if (d.open === 'study') go('study');
        else if (d.open === 'build') { setIdea(i => i || { answers: IDEA_ANSWERS }); go('build'); }
        else toast({ title: d.title.replace(/^.*? · /, ''), description: 'Opens its page — not part of this prototype yet' }); }} />}
      {screen === 'explore' && <Explore {...shared} key={persona} persona={persona} trace={trace} setTrace={setTrace} searchCtx={searchCtx} setSearchCtx={setSearchCtx} details={details} setDetails={d => { setDetails(d); if (d) setAsset(null); }} onStudy={() => { go('study'); }} onBack={() => go('command')} />}
      {screen === 'study' && <Study {...shared} {...{ sel, setSel, setLenses, chat, setChat, setYear }}
        onClose={() => go('explore')}
        onBuild={answers => { setIdea({ answers }); go('build'); toast({ title: 'Idea created', description: 'From the Alpine Meadows study — lenses and your answers carried over' }); }} />}
      <GlobalSearch open={searchOpen} network={searchNetwork} onClose={() => setSearchOpen(false)} onOpen={openFromSearch} />
      <Notifications open={notesOpen} notes={notes} onClose={() => { setNotesOpen(false); setNotes(l => l.map(n => ({ ...n, read: true }))); }}
        onOpen={n => { setNotesOpen(false); if (n.link) { go(n.link); } }} />
      {screen === 'plan-setup' && <PlanSetup navBar={navBar} tab={tab} setTab={setTab} rows={planRows} setRows={setPlanRows} saved={planSaved} setSaved={setPlanSaved}
        setup={planSetup} setSetup={setPlanSetup} run={running} onHome={() => go('plan')}
        onOptimize={() => { setRun({ startedAt: Date.now(), scenarios: SETUP_SCENARIOS.map(s => s.id), investments: PLAN_ROWS.filter(r => planRows[r.id] !== 'excluded').length,
          constraints: SETUP_SCENARIOS.reduce((t, s) => t + scenConstraints(planSetup, s).length, 0) }); setShowRun(true); go('plan'); }} />}
      {screen === 'plan' && <PlanHome navBar={navBar} run={running ? run : null} done={!!(run && run.done)} showRun={showRun} setShowRun={setShowRun}
        stage={planStage} final={finalPlan} saved={planSaved}
        onStart={() => { setPlanStage('setup'); setTab('readiness'); go('plan-setup'); }}
        onSetup={() => { setTab('readiness'); go('plan-setup'); }} onCompare={() => go('plan-compare')}
        onApproval={() => sendForApproval()} />}
      {screen === 'plan-compare' && <PlanCompare navBar={navBar} run={running ? run : null} done={!!(run && run.done)} final={finalPlan} stage={planStage}
        onSelect={id => { setFinalPlan(id); toast({ title: `${PLAN_SCENARIOS.find(x => x.id === id).name} is the final plan`, description: 'Send it for approval when you’re ready', secondaryAction: { label: 'Undo', iconLeft: 'arrow-back-up', onClick: () => setFinalPlan(null) } }); }}
        onSendApproval={() => sendForApproval()} onBack={() => go('plan')} onSetup={() => { setTab('readiness'); go('plan-setup'); }} />}
      {screen === 'build' && <Build navBar={navBar} lenses={lenses} idea={idea} onBack={() => go('study')} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
