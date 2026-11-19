/* Build Library (Idea Pad / Investments) and New investment (Input step) — J07 · Investment Creation.
   Figma Build handover: Idea Pad 564:91122, chooser 73:115860, Input 73:116169 / no-GIS 73:116266, box selection 73:121453, READY 73:117925.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */

/* ============================================================ Build Library */
function BuildLibrary({ navBar, ideas, setIdeas, onOpenIdea, onOpenRefine, onNew }) {
  const [tab, setTab] = useState('ideas');
  const [kind, setKind] = useState('all');
  const rows = ideaPadRows(ideas);
  const n = { all: rows.length, Project: rows.filter(r => r.type !== 'Program').length, Program: rows.filter(r => r.type === 'Program').length };
  const shown = rows.filter(r => kind === 'all' || (kind === 'Program' ? r.type === 'Program' : r.type !== 'Program'));
  const ideaCols = [
    { key: 'name', title: 'Ideas', width: '2fr', primary: true, render: r => <span className="row" style={{ gap: 'var(--space-200)', minWidth: 0 }}>
      {r.type === 'Program' && <Icon name="chat-folder" size={16} />}<span className="plan-ellipsis">{r.name}</span></span> },
    { key: 'status', title: 'Status', width: '1fr', render: r => <span className="row" style={{ gap: 'var(--space-200)' }}>
      <Indicator type={IDEA_STATUS[r.status].type}>{IDEA_STATUS[r.status].label}</Indicator>{r.reviewers && <IFS.Counter>{`${r.reviewers.done}/${r.reviewers.total}`}</IFS.Counter>}</span> },
    { key: 'horizon', title: 'Horizon', width: '1fr' },
    { key: 'modified', title: 'Modified', width: '1fr', sortable: true, sortValue: r => r.modified, render: r => ideaDay(r.modified) },
    { key: 'collab', title: 'Collaboration', width: '1.2fr', render: r => r.collab ? <IFS.CollaborationBadge label={r.collab.label} avatar={{ initials: r.collab.by, type: PEOPLE[r.collab.by].type }}
      request={{ name: PEOPLE[r.collab.by].name, role: PEOPLE[r.collab.by].role, time: '2h ago', text: `“${r.collab.text}”`, meta: r.code }}
      onOpen={() => toast({ title: `${PEOPLE[r.collab.by].name}: ${r.collab.label.toLowerCase()}`, description: 'Collaboration requests aren’t part of this flow' })} /> : null },
  ];
  const invRows = WHISTLER_INVESTMENTS.map(i => ({ id: i.id, name: i.name, code: i.code, stage: STAGE_TO_CATALYST[i.stage] || 'Plan', owner: i.owner, cost: i.totalSpend, value: i.totalValue }));
  const invCols = [
    { key: 'name', title: 'Investment', width: '2fr', primary: true },
    { key: 'code', title: 'ID', width: 'var(--table-col-short-min)' },
    { key: 'stage', title: 'Stage', width: 'var(--table-col-short-min)', render: r => <Badge size="s" color="white">{r.stage}</Badge> },
    { key: 'owner', title: 'Owner', width: '1fr' },
    { key: 'cost', title: 'Cost', type: 'number', width: 'var(--table-col-number-min)', render: r => fmtMoney(r.cost) },
    { key: 'value', title: 'Value', type: 'number', width: 'var(--table-col-number-min)', render: r => fmtValue(r.value) },
  ];
  return (
    <AppShell navBar={navBar} bottom={<BottomSheet prompts={['Brief me', 'What needs my input first?']} onPrompt={p => toast({ title: `Cooper: ${p}` })} />}>
      <div className="page">
        <PageTop title="Build" actions={<Button type="secondary" size="m" iconLeft="system-pencil-plus" onClick={onNew}>New</Button>}
          tabs={{ size: 'l', items: [{ value: 'ideas', label: 'Idea Pad' }, { value: 'inv', label: 'Investments' }], value: tab, onChange: setTab }} />
        {tab === 'ideas' ? (
          <IFS.Table className="build-ideas" columns={ideaCols} rows={shown} defaultSort={{ key: 'modified', dir: 'desc' }}
            tabs={<SegmentedControl size="s" value={kind} onChange={setKind} options={[{ value: 'all', label: `All ideas ${n.all}` }, { value: 'Project', label: `Project ideas ${n.Project}` }, { value: 'Program', label: `Program ideas ${n.Program}` }]} />}
            search={<IFS.SmartSearch placeholder="Ask anything about idea pad" />}
            onRowClick={r => r.mine || canOpenIdea(r.id) ? onOpenIdea(r) : toast({ title: r.name, description: 'Only the first three ideas and the pad-mount idea open in this prototype' })} />
        ) : (
          <IFS.Table columns={invCols} rows={invRows} defaultSort={{ key: 'cost', dir: 'desc' }} rowProps={r => ({ 'data-inv': r.id })}
            tabs={<SegmentedControl size="s" value="all" onChange={() => {}} options={[{ value: 'all', label: `All investments ${invRows.length}` }]} />}
            search={<IFS.SmartSearch placeholder="Ask anything about investments" />}
            onRowClick={r => canOpenInvestment(r.id) ? onOpenRefine(r) : toast({ title: r.name, description: 'Only the first three investments and the pad-mount program open in this prototype' })} />
        )}
      </div>
    </AppShell>
  );
}

// "How would you like to start the new investment?" (Figma 73:115860)
function NewChooser({ open, onClose, onIdeas }) {
  return (
    <Modal open={open} onOpenChange={o => !o && onClose()} title="How would you like to start the new investment?">
      <div className="col" style={{ gap: 'var(--space-200)' }}>
        <ContentCard title="Start with Ideas" description="Describe your idea or upload documents. Cooper builds the investment for you" iconRight="arrow-right" onClick={onIdeas} />
        <ContentCard title="Duplicate Investment" description="Search any investment. Duplicate it and enhance the copy with new documents and context"
          onClick={() => toast({ title: 'Duplicate Investment isn’t part of this flow', description: 'Start with Ideas to create one with Cooper' })} />
      </div>
    </Modal>
  );
}

/* ============================================================ New investment · Input (Cooper chat + area map) */
function NewInvestment({ navBar, onBack, onShape }) {
  const [msgs, setMsgs] = useState([{ role: 'cooper', text: INPUT_GREETING, starts: true }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [ctx, setCtx] = useState(0);
  const [docs, setDocs] = useState(0);
  const [focus, setFocus] = useState(null);
  const [tool, setTool] = useState(null);           // 'box' while selecting
  const [drag, setDrag] = useState(null);           // { x0, y0, x1, y1 } in map px
  const [needs, setNeeds] = useState(0);
  const api = useRef(null), mapEl = useRef(null);
  const ready = ctx >= 100;
  const reply = (gain, r, extra = {}) => {
    setBusy(true);
    setTimeout(() => { setBusy(false); setMsgs(m => [...m, { role: 'cooper', text: r.ready ? READY_TEXT : r.text }]); if (r.focus) setFocus(r.focus); setCtx(c => r.ready ? 100 : Math.min(95, c + gain)); }, 900);
  };
  const say = (text, kind, arg) => { setMsgs(m => [...m, { role: 'user', text }]); reply(CONTEXT_GAIN[kind], inputReply(kind, arg)); };
  const send = () => { const t = input.trim(); if (!t || busy) return; setInput(''); const kind = needs ? 'detail' : 'need'; setNeeds(k => k + 1); say(t, kind); };
  const attach = () => { const f = 'Alpine Meadows pad-mount inspection notes.pdf'; setDocs(d => d + 1); say(`Uploaded ${f}`, 'file', f); };
  // Box selection (Figma "Change selection / Box"): drag a rectangle; the assets inside become the idea's scope
  const pt = e => { const r = mapEl.current.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const down = e => { const p = pt(e); setDrag({ x0: p.x, y0: p.y, x1: p.x, y1: p.y }); };
  const move = e => { if (drag) { const p = pt(e); setDrag(d => ({ ...d, x1: p.x, y1: p.y })); } };
  const up = e => {
    if (!drag) return;
    const p = pt(e), d = { ...drag, x1: p.x, y1: p.y };                         // the release point, not the last rendered one
    const [l, r, t, b] = [Math.min(d.x0, d.x1), Math.max(d.x0, d.x1), Math.min(d.y0, d.y1), Math.max(d.y0, d.y1)];
    const ids = ASSETS.map(a => a.id).filter(id => { const p = api.current?.screenPos(id); return p && p.x >= l && p.x <= r && p.y >= t && p.y <= b; });
    setDrag(null); setTool(null);
    if (!ids.length) { toast({ title: 'No assets in that area', description: 'Drag over the assets you want to include' }); return; }
    setFocus(ids);
    setMsgs(m => [...m, { role: 'user', text: `Build from selection (${ids.length} asset${ids.length > 1 ? 's' : ''})` }]);
    reply(CONTEXT_GAIN.selection, inputReply('selection', ids));
  };
  const box = drag && { left: Math.min(drag.x0, drag.x1), top: Math.min(drag.y0, drag.y1), width: Math.abs(drag.x1 - drag.x0), height: Math.abs(drag.y1 - drag.y0) };
  const header = <PageHeader title="New investment" onBack={onBack}
    center={<Stepper current={0} steps={[{ label: 'Input' }, { label: 'Shape' }, { label: 'Review' }, { label: 'Refine' }, { label: 'Approve' }]} />}
    actions={<Button type="primary" size="s" disabled={!ready} onClick={onShape}>Shape</Button>} />;
  const left = ready ? <NDS label="Cooper's context: Ready badge (DocumentsContext has no Ready state)" className="row" style={{ gap: 'var(--space-200)' }}>
    <span className="t-label-m-medium sec">Cooper’s Context</span><Indicator type="green">Ready</Indicator></NDS> : undefined;
  return (
    <AppShell navBar={navBar} header={header}
      bottom={<BottomSheet type="value" inProgress={!ready} coverage={ctx} left={left} documents={docs ? { label: `${docs} Document${docs > 1 ? 's' : ''}` } : undefined}
        onUpload={attach} showPrompts={false} />}>
      <div className="bi-split">
        <div className="bi-chat">
          <ChatCompactPanel type="text" title="New investment" newChat={false} inputValue={input} onInputChange={setInput} onSend={send} analyzing={busy} onStop={() => {}}
            onAttach={attach} onFiles={attach} style={{ width: '100%', height: '100%' }}>
            {msgs.map((m, k) => m.role === 'user' ? <UserMessage key={k}>{m.text}</UserMessage>
              : <CooperMessage key={k} status="answered" text={m.text}
                  options={m.starts && k === msgs.length - 1 && !busy ? { intro: 'Start with', items: INPUT_STARTS } : undefined} onOption={o => say(o, 'start', o)} />)}
          </ChatCompactPanel>
        </div>
        <div className="bi-map">
          <Panel title="Area Overview" collapsible={false} style={{ height: '100%' }}>
            <div ref={mapEl} className="bi-map__view">
              <NDS label="3D map (MapLibre + OpenFreeMap)" className="fill">
                <MapView lenses={INITIAL_LENSES} year={END} focus={focus} onSelect={() => {}} apiRef={api} pad={{ tl: [80, 60], br: [60, 60] }} />
              </NDS>
              <div className="bi-map__tools">
                <MapToolbar><MapToolCluster label="Selection">
                  <MapToolButton icon="map-tool-bar-lasso" label="Lasso select" onClick={() => toast({ title: 'Lasso isn’t part of this flow', description: 'Use Box select' })} />
                  <MapToolButton icon="map-tool-bar-select-area" label="Box select" active={tool === 'box'} onClick={() => { setTool(t => t === 'box' ? null : 'box'); toast({ title: 'Start selecting', description: 'Drag a box over the assets' }); }} />
                  <MapToolButton icon="map-layers" label="Layers" onClick={() => toast({ title: 'Layers aren’t part of this flow' })} />
                </MapToolCluster></MapToolbar>
              </div>
              {tool === 'box' && <NDS label="Box selection overlay" className="bi-map__catch" onMouseDown={down} onMouseMove={move} onMouseUp={up}>
                {box && <div className="bi-map__box" style={box} />}
              </NDS>}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
