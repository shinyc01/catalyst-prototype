/* Prototype settings (gear in the NavBar) + guided tours.
   Flows are registered by the files in app/flows/*.js (plain JS, one file per mini flow) into window.FLOWS.
   A tour walks a tester through a flow: it moves to the start screen, highlights what to click, explains each step,
   and moves on when they click the highlighted thing (or press Next). Not in DS (the spotlight and tour card are custom). */

// Find a step's target: a CSS selector, or { text } = the visible button / tab / menu item / option whose text starts with it
function findTarget(t) {
  if (!t) return null;
  if (typeof t === 'string') { const el = document.querySelector(t); return el && el.getClientRects().length ? el : null; }
  const want = t.text.toLowerCase();
  const cands = document.querySelectorAll('button, [role=button], [role=tab], [role=menuitem], [role=menuitemradio], [role=option], [role=gridcell], a');
  for (const el of cands) {
    const txt = (el.innerText || el.getAttribute('aria-label') || '').trim().toLowerCase();
    if (txt && (t.exact ? txt === want : txt.startsWith(want)) && el.getClientRects().length) return el;
  }
  return null;
}

function Tour({ flow, step, setStep, onExit }) {
  const s = flow.steps[step], last = step === flow.steps.length - 1;
  const [rect, setRect] = useState(null);
  useEffect(() => { if (s.hash && location.hash !== s.hash) location.hash = s.hash; }, [flow.id, step]);   // go to the step's screen
  useEffect(() => {                                                                                       // follow the target as it moves
    let el = null;
    const tick = () => { el = findTarget(s.target); setRect(el ? el.getBoundingClientRect() : null); };
    tick(); const iv = setInterval(tick, 250);
    let done = false;
    const onClick = e => {
      if (done || s.advance === 'next' || !s.target) return;
      const t = findTarget(s.target) || el;                           // look it up fresh: the screen may have re-rendered
      if (t && t.contains(e.target)) { done = true; setTimeout(() => (last ? onExit(true) : setStep(step + 1)), 350); }
    };
    document.addEventListener('click', onClick, true);
    return () => { clearInterval(iv); document.removeEventListener('click', onClick, true); };
  }, [flow.id, step]);
  const pad = 6, W = 340;
  const box = rect && { left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 };
  let card = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
  if (box) {
    const below = box.top + box.height + 12, left = Math.min(Math.max(12, box.left), window.innerWidth - W - 12);
    card = below + 190 < window.innerHeight ? { left, top: below } : { left, top: Math.max(12, box.top - 200) };
  }
  return (
    <div className="tour-layer" aria-live="polite">
      {box ? <div className="tour-spot" style={box} /> : <div className="tour-dim" />}
      <NDS label="Guided tour" className="tour-card col" style={{ ...card, width: W }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="t-label-m-upper muted">{flow.title} · {step + 1}/{flow.steps.length}</span>
          <IconButton icon="system-close" size="s" label="Exit tour" onClick={() => onExit(false)} />
        </div>
        <span className="t-body-l-medium">{s.title}</span>
        {s.body && <span className="t-body-m-regular sec">{s.body}</span>}
        {s.target && !rect && <span className="t-body-s-regular muted">Looking for the highlighted item… if it doesn’t appear, press Next.</span>}
        <div className="row" style={{ gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          {step > 0 && <Button type="tertiary" size="s" onClick={() => setStep(step - 1)}>Back</Button>}
          <Button type="primary" size="s" onClick={() => (last ? onExit(true) : setStep(step + 1))}>{last ? 'Finish' : (s.target && s.advance !== 'next' ? 'Skip' : 'Next')}</Button>
        </div>
      </NDS>
    </div>
  );
}

// Prototype settings — opened from the gear in the NavBar. Holds everything a tester needs occasionally:
// persona, the flows with their guided tours, the non-DS flags, and resetting the demo data.
function SettingsPanel({ open, onClose, persona, setPersona, flags, setFlags, onStart }) {
  const flows = [...(window.FLOWS || [])].sort((a, b) => (b.added || '').localeCompare(a.added || ''));
  return (
    <Drawer open={open} onOpenChange={o => !o && onClose()} title="Prototype settings" collapsible={false} overlay="base">
      <div className="col" style={{ gap: 20 }}>
        <div className="col" style={{ gap: 8 }}>
          <span className="t-label-m-upper muted">Persona</span>
          <SegmentedControl size="s" fullWidth value={persona} onChange={setPersona} options={Object.values(PERSONAS).map(p => ({ value: p.key, label: p.role }))} />
          <span className="t-body-s-regular muted">Signed in as {PERSONAS[persona].name} · {PERSONAS[persona].title}</span>
        </div>
        <div className="col" style={{ gap: 8 }}>
          <span className="t-label-m-upper muted">Flows and guided tours</span>
          <span className="t-body-m-regular sec">Every mini flow built into this prototype. Start one to be guided through it, step by step.</span>
          {flows.map(f => (
            <ContentCard key={f.id} size="s" title={f.title} description={f.summary}
              bottom={<div className="col" style={{ gap: 8, width: '100%' }}>
                <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                  <Badge size="s" color="white">{PERSONAS[f.persona]?.role || 'Any persona'}</Badge>
                  <Badge size="s" color="false">{f.steps.length} steps</Badge>
                  {f.added && <Badge size="s" color="false">Added {f.added}{f.addedBy ? ` · ${f.addedBy}` : ''}</Badge>}
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <Button type="primary" size="s" iconLeft="arrow-right" onClick={() => onStart(f)}>Start tour</Button>
                  {(f.sources || []).slice(0, 2).map(src => <Button key={src.url} type="tertiary" size="s" onClick={() => window.open(src.url, '_blank', 'noopener')}>{src.label}</Button>)}
                </div>
              </div>} />
          ))}
          {!flows.length && <EmptyState cause="empty-container" size="section" heading="No flows yet" body="Flows appear here as they are added." />}
        </div>
        <div className="col" style={{ gap: 8 }}>
          <span className="t-label-m-upper muted">Prototype</span>
          <Switch size="s" checked={flags} onChange={setFlags}>Show non-DS parts</Switch>
          <span className="t-body-s-regular muted">Outlines the parts that aren’t in Catalyst Design System 2.0 yet.</span>
          <div><Button type="secondary" size="s" iconLeft="arrow-back-up" onClick={() => { Store.reset(); location.hash = '#command'; location.reload(); }}>Reset demo</Button></div>
          <span className="t-body-s-regular muted">Clears everything changed in this browser: snoozed cards, added events, created ideas.</span>
        </div>
      </div>
    </Drawer>
  );
}
