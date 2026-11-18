/* Study: lenses, horizon, Cooper chats.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
/* ============================================================ Screen 3 — Study (lenses, horizon, asset details, Cooper) */
function Study({ navBar, sel, setSel, lenses, setLenses, chat, setChat, year, setYear, asset, setAsset, onClose, onBuild,
  scope, persona, trace = {}, setTrace, studies = [], setStudies, onSave, onOpenStudy }) {
  // The study's population (J03): a group entered from Explore / the library, or the whole cluster
  const ids = scope?.ids || null, name = scope?.name || CLUSTER.short, scoped = scope?.ids ? scopeAssets(scope.ids) : ASSETS;
  const [libOpen, setLibOpen] = useState(false);
  const [saved, setSaved] = useState(null);                  // the Alert after Save study
  const conf = useIssueReport({ issues: useMemo(() => studyIssues(ids).map(i => ({ ...i, answer: false, upload: false, ...(trace[i.id] ? { status: trace[i.id] } : {}) })), [scope?.id]) });
  useEffect(() => { setTrace && setTrace(t => ({ ...t, ...conf.status })); }, [conf.status]);
  const saveStudy = () => {
    const prev = studies.find(x => x.id === scope?.studyId);
    const rec = { id: prev ? prev.id : `st-${Date.now()}`, name: prev ? prev.name : name, ids, lenses: lenses.map(l => ({ id: l.id, on: l.on, src: l.src })), year, savedAt: Date.now() };
    setStudies(l => [rec, ...l.filter(x => x.id !== rec.id)]);
    onSave && onSave(rec);
    setSaved(prev ? 'resave' : 'first');
  };
  const [view, setView] = useState('lenses');
  const [input, setInput] = useState('');
  const [playing, setPlaying] = useState(false);
  const [details, setDetails] = useState(false);
  const api = useRef(null);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const s = useMemo(() => study(lenses, year, ids), [lenses, year, ids]);

  // Horizon playback: one year per second, NOW → END
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setYear(y => { if (y >= END) { setPlaying(false); return y; } return y + 1; }), 1000);
    return () => clearInterval(t);
  }, [playing]);
  const play = () => { if (playing) return setPlaying(false); if (year >= END) setYear(NOW); setPlaying(true); };

  // Notify when assets newly cross tolerance during playback
  const prevOver = useRef(null);
  useEffect(() => {
    const overIds = s.now.rows.filter(r => r.over).map(r => r.a.id);
    if (playing && prevOver.current) {
      const fresh = overIds.filter(id => !prevOver.current.includes(id));
      if (fresh.length) toast({ title: `${year}: ${fresh.map(id => assetById(id).name).join(', ')} crossed tolerance`, description: 'High risk — consider intervening' });
    }
    prevOver.current = overIds;
  }, [year, lenses]);

  const toggle = id => setLenses(ls => ls.map(l => l.id === id ? { ...l, on: !l.on } : l));
  const setSrc = (id, label) => setLenses(ls => ls.map(l => l.id === id ? { ...l, src: Math.max(0, l.sources.findIndex(x => x.label === label)) } : l));
  const openChat = kind => { setInput(''); setAsset(null); setDetails(false); setChat({ kind, msgs: [{ role: 'cooper', ...(kind === 'lens' ? LENS_SCRIPT : IDEA_SCRIPT)[0] }], i: 0, busy: false, answers: [] }); };
  const selectAsset = id => { setAsset(id); if (id) { setChat(null); setDetails(false); } };
  const showAsset = id => { selectAsset(id); api.current?.flyTo(id); };

  const send = text => {
    if (!chat || chat.busy || chat.done || !text.trim()) return;
    const script = chat.kind === 'lens' ? LENS_SCRIPT : IDEA_SCRIPT;
    const step = script[chat.i + 1];
    const answers = [...(chat.answers || []), text];
    setInput('');
    setChat(c => ({ ...c, busy: true, answers, msgs: [...c.msgs, { role: 'user', text }, { role: 'progress', n: step.start || 1, total: step.total, label: step.steps[0] }] }));
    step.steps.forEach((label, k) => {
      if (k === 0) return;
      timers.current.push(setTimeout(() => setChat(c => ({ ...c, msgs: [...c.msgs.slice(0, -1), { role: 'progress', n: (step.start || 1) + k, total: step.total, label }] })), 900 * k));
    });
    timers.current.push(setTimeout(() => {
      let next = lenses;
      if (step.final && chat.kind === 'lens') { next = withEv(lenses); setLenses(next); setSel('ev'); }
      const msg = finalOr(chat.kind, step, answers, next);
      setChat(c => ({ ...c, busy: false, i: c.i + 1, done: !!step.final, msgs: [...c.msgs.slice(0, -1), { role: 'cooper', ...msg }] }));
    }, 900 * step.steps.length));
  };

  const selected = lenses.find(l => l.id === sel);
  const right = !!(chat || asset || details);
  return (
    <AppShell navBar={navBar} header={<ExploreHeader search={{ placeholder: 'Search for…' }}><Button type="ghost" size="s" iconLeft="arrow-left" onClick={onClose}>{scope ? name : CLUSTER.name}</Button></ExploreHeader>}>
      <div style={{ position: 'relative', height: '100%', minHeight: 700, overflow: 'hidden' }}>
        <NDS label="3D risk map (MapLibre + OpenFreeMap)" className="fill">
          <MapView grid lenses={lenses} year={year} selected={asset} onSelect={selectAsset} apiRef={api}
            focus={selected && selected.on ? scoped.filter(a => drivers(a, year, s.act).find(d => d.id === selected.id && d.delta >= 1)).map(a => a.id) : null}
            pad={{ tl: [660, 80], br: [right ? 400 : 200, 90] }} />
        </NDS>
        <MapTools api={api} studyOpen={!libOpen} libraryOpen={libOpen} onLibrary={() => setLibOpen(o => !o)} onStudy={() => setLibOpen(false)}
          onAssets={() => onClose()} />
        {libOpen && <StudiesPanel studies={studies} setStudies={setStudies} onOpen={st => { setLibOpen(false); onOpenStudy(st); }} onClose={() => setLibOpen(false)} />}
        {saved && <div className="study-alert"><IFS.Alert type="success" title={saved === 'first' ? 'Saved to Study Library' : 'Study saved to library'}
          action={saved === 'first' ? 'View in Study Library' : undefined} onAction={() => { setSaved(null); setLibOpen(true); }} onClose={() => setSaved(null)}>
          {saved === 'first' ? `${name.toUpperCase()} exploration is saved to Study Library` : `${name.toUpperCase()} exploration is saved`}</IFS.Alert></div>}
        <FloatingBar style={{ top: 100, zIndex: 500, left: 'calc(50% + 160px)' }} category={scope ? name : CLUSTER.name} categoryIcon="map-location" item={`Selected ${scoped.length}`}
          badge={<Badge color="red" size="s">{s.now.over}</Badge>}
          actions={<div className="row" style={{ gap: 8 }}>
            <Button type="tertiary" size="m" onClick={() => { setChat(null); setAsset(null); setDetails(true); }}>View details</Button>
            <SplitButton size="m" onClick={() => openChat('idea')} menuLabel="More create options"
              items={[{ label: 'Save study', onClick: saveStudy }]}>Create idea</SplitButton>
          </div>}
          onClose={onClose} />

        <div style={{ position: 'absolute', left: 60, top: 12, bottom: 12, width: view === 'conf' ? 356 : 580, zIndex: 600, display: libOpen ? 'none' : 'flex' }}>
          <Panel title={`${name} Study`} onEvidence={() => toast({ title: 'Evidence chain' })} onClose={onClose} style={{ width: '100%', height: '100%' }}>
            <div className="col" style={{ gap: 12, height: '100%', minHeight: 0 }}>
              <SegmentedControl size="s" fullWidth value={view} onChange={setView} options={[{ value: 'lenses', label: 'Lenses' }, { value: 'conf', label: 'System Confidence' }]} />
              {view === 'conf' ? <StudyConfidence c={conf} value={studyConfidence(ids, { ...trace, ...conf.status })} /> : (
                <div style={{ display: 'flex', gap: 12, minHeight: 0, flex: 1 }}>
                  <NDS label="Map layer (lens) list" className="col" style={{ width: 200, flex: 'none', gap: 2 }}>
                    <NavSubtitle>Lenses</NavSubtitle>
                    <NavItem type="parent" active={sel === 'overview'} onClick={() => setSel('overview')}>Overview</NavItem>
                    <NavItem type="parent" active={sel === 'base'} onClick={() => setSel('base')}>Base Condition</NavItem>
                    <NavSubtitle action={{ icon: 'system-plus', label: 'Add custom lens', onClick: () => openChat('lens') }}>Custom</NavSubtitle>
                    {lenses.map(l => (
                      <div key={l.id} className="row" style={{ gap: 4 }}>
                        <div style={{ flex: 1, minWidth: 0 }}><NavItem type="parent" cooper={l.custom} active={sel === l.id} onClick={() => setSel(l.id)}>{l.label}</NavItem></div>
                        <Switch size="s" checked={l.on} onChange={() => toggle(l.id)} aria-label={`Include ${l.label}`} />
                      </div>
                    ))}
                  </NDS>
                  <div className="col scroll" style={{ flex: 1, gap: 12, paddingRight: 4 }}>
                    {sel === 'overview' && <Overview s={s} lenses={lenses} year={year} onAsset={showAsset} />}
                    {sel === 'base' && <BaseView year={year} ids={ids} onAsset={showAsset} />}
                    {selected && <LensView lens={selected} lenses={lenses} year={year} ids={ids} onToggle={() => toggle(selected.id)} onSource={v => setSrc(selected.id, v)} onAsset={showAsset} />}
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </div>

        <NDS label="Horizon player (IconButton + Slider + ticks)" className="row box glass" style={{ position: 'absolute', left: 660, right: right ? 404 : 200, bottom: 12, gap: 12, zIndex: 500 }}>
          <IconButton icon={playing ? 'player-pause-filled' : 'arrow-caret-right-filled'} type="secondary" shape="circle" size="m" label={playing ? 'Pause' : 'Play horizon'} onClick={play} />
          <span className="t-label-m-upper muted">Horizon</span>
          <Badge size="s" color="white">{year}</Badge>
          <div className="col" style={{ flex: 1, gap: 2 }}>
            <Slider min={NOW} max={END} step={1} value={year} onChange={v => { setPlaying(false); setYear(v); }} showValue={false} />
            <div className="horizon-ticks t-body-s-regular muted">{[NOW, NOW + 5, END].map(y => <span key={y}>{y}</span>)}</div>
          </div>
        </NDS>
        {!right && <MapLegend style={{ position: 'absolute', right: 12, bottom: 64, zIndex: 500 }} />}

        {details && (
          <div style={{ position: 'absolute', right: 12, top: 64, bottom: 12, zIndex: 600, display: 'flex' }}>
            <AgentWindow style={{ maxHeight: '100%' }} text={`${scope ? name : CLUSTER.name} — with the ${s.act.length} lenses applied, ${s.now.over} of ${s.count} assets are over their intervention tolerance in ${year}.`}
              onAsk={() => openChat('idea')} onClose={() => setDetails(false)}
              tertiaryAction={{ label: 'Close', onClick: () => setDetails(false) }} secondaryAction={{ label: 'Create idea', onClick: () => openChat('idea') }}>
              <ClusterDetails s={s} />
            </AgentWindow>
          </div>
        )}
        {asset && (
          <div style={{ position: 'absolute', right: 12, top: 64, bottom: 12, width: 380, zIndex: 600, display: 'flex' }}>
            <AssetDetails id={asset} lenses={lenses} year={year} compact extra={<Drivers id={asset} lenses={lenses} year={year} />} onClose={() => setAsset(null)} onAsk={() => openChat('lens')} />
          </div>
        )}
        {chat && (
          <div style={{ position: 'absolute', right: 12, top: 64, zIndex: 600 }}>
            <ChatCompactPanel type="text" title={chat.kind === 'idea' ? 'Create idea' : (chat.done ? 'EV load growth lens' : 'New chat')} newChat={!chat.done}
              inputValue={input} onInputChange={setInput} onSend={send} analyzing={chat.busy} onStop={() => {}}
              onClose={() => setChat(null)} onNewChat={() => openChat(chat.kind)} style={{ height: 'calc(100vh - 180px)', maxHeight: 620 }}>
              {chat.msgs.map((m, k) => m.role === 'user' ? <UserMessage key={k}>{m.text}</UserMessage>
                : m.role === 'progress' ? <CooperProgress key={k} step={m.n} total={m.total} label={m.label} />
                : <CooperMessage key={k} status="answered" text={m.text} metrics={m.metrics}
                    options={k === chat.msgs.length - 1 && !chat.busy ? m.options : undefined} onOption={send}
                    followUps={m.followUps} onFollowUp={t => toast({ title: `Follow-up: ${t}`, description: 'Not scripted in this prototype' })}>
                    {m.openBuild && <div style={{ marginTop: 8 }}><Button type="primary" size="m" iconRight="arrow-right" onClick={() => onBuild(chat.answers)}>Open in Build</Button></div>}
                  </CooperMessage>)}
            </ChatCompactPanel>
          </div>
        )}
        {!right && <div style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 500 }}><FtaButton onClick={() => openChat('lens')} label="Cooper" /></div>}
      </div>
    </AppShell>
  );
}

function Stats({ now, base, first, baseFirst, year }) {
  const d = (n, unit = '') => n === 0 ? undefined : `${n > 0 ? '+' : ''}${n}${unit}`;
  const yrs = first && baseFirst ? first - baseFirst : 0;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <StatCard size="s" title="Risk score" value={String(now.score)} description={`vs. ${base.score}`} descriptionPosition="inline" trend={d(now.score - base.score)} trendDirection="up" />
      <StatCard size="s" title="Value at stake" value={`$${now.valueM}M`} description={`vs. $${base.valueM}M`} descriptionPosition="inline" trend={d(Math.round((now.valueM - base.valueM) / Math.max(0.1, base.valueM) * 100), ' %')} trendDirection="up" />
      <StatCard size="s" title="At-risk assets" value={`${now.over}/${now.rows.length}`} description={`vs. ${base.over}/${base.rows.length}`} descriptionPosition="inline" trend={d(now.over - base.over)} trendDirection="up" />
      <StatCard size="s" title="Threshold year" value={first ? String(first) : '—'} description={`vs. ${baseFirst ?? '—'}`} descriptionPosition="inline" trend={yrs ? `${yrs} yrs` : undefined} trendDirection="down" />
    </div>
  );
}
function Overview({ s, lenses, year, onAsset }) {
  const pos = s.contrib.filter(c => c.delta > 0);
  const worst = [...s.now.rows].sort((x, y) => (y.risk / y.tol) - (x.risk / x.tol));
  return <>
    <span className="t-body-l-medium">Overview</span>
    <span className="t-label-m-upper muted">Risk &amp; condition</span>
    <Stats {...s} year={year} />
    <span className="t-label-m-upper muted">Change summary</span>
    <p className="t-body-m-regular sec" style={{ margin: 0 }}>{overviewText(s, year)}</p>
    <div className="box col" style={{ gap: 10 }}>
      <div className="row" style={{ gap: 8 }}>
        <span className="t-body-m-medium">Risk score</span>
        <div className="row" style={{ flex: 1, gap: 2 }}>
          <BarChartItem number={false} fill="var(--border-grey)" style={{ flex: Math.max(1, s.base.score) }} />
          {pos.map(c => <BarChartItem key={c.id} number={false} fill={LENS_INFO[c.id].color} style={{ flex: c.delta }} />)}
        </div>
        <span className="t-body-m-medium">{s.now.score}</span>
      </div>
      <InfoHintItem label="Base condition" color="var(--border-grey)" value={String(s.base.score)} />
      {s.contrib.map(c => <InfoHintItem key={c.id} label={LENS_INFO[c.id].label} color={LENS_INFO[c.id].color} value={`+${c.delta}`} />)}
      {lenses.filter(l => !l.on).map(l => <InfoHintItem key={l.id} label={`${l.label} (off)`} neutral value="—" />)}
    </div>
  </>;
}
function BaseView({ year, ids, onAsset }) {
  const s = study([], year, ids);
  return <>
    <span className="t-body-l-medium">Base Condition</span>
    <span className="t-label-m-upper muted">Risk &amp; condition</span>
    <Stats {...s} year={year} />
    <p className="t-body-m-regular sec" style={{ margin: 0 }}>Condition only — no external influences, straight from each asset’s Whistler outlook. Substation transformers by condition score, pad-mounts by normalized age ({ASSETS.find(a => a.type === 'padmount').outlook['Normalized Age'][year - NOW]}× design life in {year}), breakers by health score, and the Pine Ridge lines by transmission reliability risk. {overNow.length} assets are already past tolerance today.</p>
  </>;
}
function LensView({ lens, lenses, year, ids, onToggle, onSource, onAsset }) {
  const act = activeOf(lenses.map(l => l.id === lens.id ? { ...l, on: true } : l));
  const without = act.filter(l => l.id !== lens.id);
  const traj = YEARS.map(y => ({ label: String(y), lens: cluster(y, act, ids).score, base: cluster(y, without, ids).score }));
  const a = cluster(year, act, ids), b = cluster(year, without, ids);
  const affected = a.rows.map((r, i) => ({ ...r, delta: r.risk - b.rows[i].risk })).filter(r => r.delta >= 1).sort((x, y) => y.delta - x.delta);
  return <>
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span className="t-body-l-medium">{lens.label}</span>
      <Switch size="s" checked={lens.on} onChange={onToggle}>Include</Switch>
    </div>
    <span className="t-body-m-regular sec">{lens.how}</span>
    <Select size="m" options={lens.sources.map(x => x.label)} value={lens.sources[lens.src].label} clearable={false} onChange={onSource} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <StatCard size="s" title={`Adds in ${year}`} value={`+${a.score - b.score}`} description="risk points" />
      <StatCard size="s" title="Affects" value={lens.kind === 'likelihood' ? 'Likelihood' : 'Consequence'} description={`${affected.length} of ${scopeAssets(ids).length} assets`} />
    </div>
    <span className="t-label-m-upper muted">Change summary</span>
    <p className="t-body-m-regular sec" style={{ margin: 0 }}>{lensSummary(lens, lenses, year, ids)}{!lens.on && ' (Lens is off — numbers show what it would add.)'}</p>
    <span className="t-label-m-upper muted">Cluster risk with and without this lens</span>
    <div style={{ height: 210, flex: 'none', overflow: 'hidden' }}><LineChart data={traj} series={[{ key: 'lens', label: `With ${lens.label}` }, { key: 'base', label: 'Without', dashed: true }]} /></div>
  </>;
}

// System Confidence tab (Figma 29:189379): the confidence bar (DS EvidenceStrength), then the open questions / warnings for this study.
// Same items as Explore's Trace Report, filtered to the study's assets. The % is a rule, not typed in (shared/explore-model.js).
function StudyConfidence({ c, value }) {
  const { IssueKindSwitch: Kinds, IssueNavigator: Nav, EvidenceStrength: Strength } = IFS;
  return (
    <div className="col scroll" style={{ gap: 12, flex: 1, minHeight: 0 }}>
      <Strength value={value} title="" labels={[value < 70 ? `${value}% Reject` : '<70% Reject', value >= 70 && value <= 90 ? `${value}% Review` : 'Review', value > 90 ? `${value}% Approve` : '>90% Approve']} />
      {c.issues.length ? <>{c.present.length > 1 && <Kinds controller={c} />}<Nav controller={c} /></>
        : <EmptyState cause="empty-container" size="section" heading="No open questions" body="Cooper found nothing to check in this study’s data." />}
    </div>
  );
}
