/* App shell: URL ↔ state, routing between screens, render.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
/* ============================================================ hash ↔ state */
function initialFromHash(h) {
  const [name, q] = h.split('?');
  const s = { persona: 'owner', screen: 'command', details: false, sel: 'overview', lenses: INITIAL_LENSES, chat: null, idea: null, asset: null, year: NOW };
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
  const [present, setPresent] = usePersisted('present', /[?&]present=1/.test(location.search));
  const [flagsOn, setFlags] = usePersisted('flags', true);
  const flags = flagsOn && !present;
  const [flowsOpen, setFlowsOpen] = useState(false);
  const [tour, setTour] = useState(null);                                   // { flow, step }

  // Following a link or a tour step changes the hash: apply it to the app (replaceState below doesn't fire this)
  useEffect(() => {
    const apply = () => {
      const n = initialFromHash(location.hash.slice(1));
      setScreen(n.screen); setDetails(n.details); setSel(n.sel); setLenses(n.lenses); setChat(n.chat); setAsset(n.asset); setYear(n.year); setPersona(n.persona);
      if (n.idea) setIdea(n.idea);
    };
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  useEffect(() => {
    let h = screen;
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
  }, [screen, details, sel, chat, asset, year, persona]);

  const go = s => { setScreen(s); setDetails(false); setAsset(null); if (s !== 'study') setChat(null); };
  const onStage = v => {
    if (v === 'command') go('command');
    else if (v === 'explore') go('explore');
    else if (v === 'build' && idea) go('build');
    else toast({ title: `${v[0].toUpperCase() + v.slice(1)} isn’t part of this flow` });
  };
  const stage = screen === 'study' ? 'explore' : screen;
  const navBar = <NavBar stages={STAGES} value={stage} onChange={onStage} hasNotifications user={{ initials: PERSONAS[persona].initials, name: PERSONAS[persona].name }} />;
  const shared = { navBar, lenses, year, asset, setAsset };

  return (
    <div className={flags ? 'nds-on' : ''} style={{ height: '100%' }}>
      <ProtoControls persona={persona} setPersona={setPersona} flags={flagsOn} setFlags={setFlags} present={present} setPresent={setPresent} onFlows={() => setFlowsOpen(true)} />
      <FlowsPanel open={flowsOpen} onClose={() => setFlowsOpen(false)} onStart={f => { setFlowsOpen(false); setTour({ flow: f, step: 0 }); }} />
      {tour && <Tour flow={tour.flow} step={tour.step} setStep={n => setTour(t => ({ ...t, step: n }))}
        onExit={done => { setTour(null); if (done) toast({ title: `Flow complete: ${tour.flow.title}`, description: 'Open Flows to try another one.' }); }} />}
      {screen === 'command' && <Command key={persona} navBar={navBar} lenses={lenses} persona={persona} onOpen={d => {
        if (d.open === 'explore') go('explore');
        else if (d.open === 'study') go('study');
        else if (d.open === 'build') { setIdea(i => i || { answers: IDEA_ANSWERS }); go('build'); }
        else toast({ title: d.title.replace(/^.*? · /, ''), description: 'Opens its page — not part of this prototype yet' }); }} />}
      {screen === 'explore' && <Explore {...shared} details={details} setDetails={d => { setDetails(d); if (d) setAsset(null); }} onStudy={() => { go('study'); }} onBack={() => go('command')} />}
      {screen === 'study' && <Study {...shared} {...{ sel, setSel, setLenses, chat, setChat, setYear }}
        onClose={() => go('explore')}
        onBuild={answers => { setIdea({ answers }); go('build'); toast({ title: 'Idea created', description: 'From the Alpine Meadows study — lenses and your answers carried over' }); }} />}
      {screen === 'build' && <Build navBar={navBar} lenses={lenses} idea={idea} onBack={() => go('study')} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
