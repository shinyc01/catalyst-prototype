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
    let el = null, scrolled = null;
    const tick = () => {
      el = findTarget(s.target);
      if (el && el !== scrolled) {                                          // bring the target on screen once, so testers don't have to look for it
        scrolled = el;
        const r = el.getBoundingClientRect();
        if (r.top < tokenPx('--size-60') || r.bottom > window.innerHeight - tokenPx('--size-60') || r.left < 0 || r.right > window.innerWidth) el.scrollIntoView({ block: 'center', inline: 'nearest' });
      }
      setRect(el ? el.getBoundingClientRect() : null);
      // `until`: the step moves on by itself once the app reaches that screen (e.g. search opens an asset in Explore)
      if (s.until && !done && location.hash.startsWith(s.until)) { done = true; setTimeout(() => (last ? onExit(true) : setStep(step + 1)), 350); }
    };
    let done = false;
    tick(); const iv = setInterval(tick, 250);
    const onClick = e => {
      if (done || s.advance === 'next' || s.until || !s.target) return;
      const t = findTarget(s.target) || el;                           // look it up fresh: the screen may have re-rendered
      if (t && t.contains(e.target)) { done = true; setTimeout(() => (last ? onExit(true) : setStep(step + 1)), 350); }
    };
    document.addEventListener('click', onClick, true);
    return () => { clearInterval(iv); document.removeEventListener('click', onClick, true); };
  }, [flow.id, step]);
  // Geometry from DS tokens (read at runtime, so the card moves with the system): spotlight padding, gap, card width
  const pad = tokenPx('--space-150'), gap = tokenPx('--space-300'), W = tokenPx('--overlay-width-s');
  const cardH = document.querySelector('.tour-card')?.offsetHeight || W / 2;
  const box = rect && { left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 };
  let card = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
  if (box) {
    const below = box.top + box.height + gap, left = Math.min(Math.max(gap, box.left), window.innerWidth - W - gap);
    card = below + cardH + gap < window.innerHeight ? { left, top: below } : { left, top: Math.max(gap, box.top - cardH - gap) };
  }
  return (
    <div className="tour-layer" aria-live="polite">
      {box ? <div className="tour-spot" style={box} /> : <div className="tour-dim" />}
      <NDS label="Guided tour" className="tour-card col" style={{ ...card, width: 'var(--overlay-width-s)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="t-label-m-medium muted">{flow.title} · {step + 1}/{flow.steps.length}</span>
          <IconButton icon="system-close" size="s" label="Exit tour" onClick={() => onExit(false)} />
        </div>
        <span className="t-label-l-medium">{s.title}</span>
        {s.body && <span className="t-body-m-regular sec">{s.body}</span>}
        {s.target && !rect && <span className="t-body-s-regular muted">Looking for the highlighted item… if it doesn’t appear, press Next.</span>}
        <div className="row" style={{ gap: 'var(--space-200)', justifyContent: 'flex-end', marginTop: 'var(--space-100)' }}>
          {step > 0 && <Button type="tertiary" size="s" onClick={() => setStep(step - 1)}>Back</Button>}
          <Button type="primary" size="s" onClick={() => (last ? onExit(true) : setStep(step + 1))}>{last ? 'Finish' : (s.target && s.advance !== 'next' ? 'Skip' : 'Next')}</Button>
        </div>
      </NDS>
    </div>
  );
}

// Prototype settings — opened from the gear in the NavBar. Everything a tester needs now and then, as simple card rows:
// who you're signed in as, the guided tours, the non-DS outlines, and resetting the demo data.
const SettingsSection = ({ title, children }) => (
  <section className="col" style={{ gap: 'var(--space-200)' }}>
    <span className="t-label-m-medium muted">{title}</span>
    <div className="col" style={{ gap: 'var(--space-100)' }}>{children}</div>
  </section>
);
function SettingsPanel({ open, onClose, persona, setPersona, flags, setFlags, onStart, searchNetwork, setSearchNetwork }) {
  const flows = [...(window.FLOWS || [])].sort((a, b) => (a.added || '').localeCompare(b.added || ''));
  const reset = () => { Store.reset(); location.hash = '#command'; location.reload(); };
  return (
    <Drawer open={open} onOpenChange={o => !o && onClose()} title="Prototype settings" collapsible={false} overlay="none">{/* overlay="none": DS 2.0 bug — the Drawer scrim (z 500) sits above the drawer (z 200) */}
      <div className="col" style={{ gap: 'var(--space-stack)', padding: '0 var(--space-inset) var(--space-inset)' }}>
        <span className="t-body-m-regular sec">Tools for testing and demos. They aren’t part of Catalyst.</span>

        <SettingsSection title="Signed in as">
          {Object.values(PERSONAS).map(p => (
            <ContentCard key={p.key} size="s" selected={persona === p.key} onClick={() => setPersona(p.key)}
              avatar={{ initials: p.initials, type: (PEOPLE[p.initials] || {}).type || 'blue' }} title={p.name} description={p.role} />
          ))}
        </SettingsSection>

        <SettingsSection title="Guided tours">
          {flows.map(f => (
            <ContentCard key={f.id} size="s" iconRight="arrow-right" onClick={() => onStart(f)}
              title={f.title} description={`${f.steps.length} steps · ${PERSONAS[f.persona]?.role || 'Any persona'}`} />
          ))}
          {!flows.length && <span className="t-body-m-regular muted">No tours yet. They appear here as flows are added.</span>}
        </SettingsSection>

        <SettingsSection title="Display">
          <ContentCard size="s" title="Show non-DS parts" description="Outline what isn’t in Catalyst Design System 2.0 yet"
            control={<Switch size="s" checked={flags} onChange={setFlags} aria-label="Show non-DS parts" />} onClick={() => setFlags(!flags)} />
        </SettingsSection>

        <SettingsSection title="Global Search network">
          <ContentCard size="s" title="Simulate the search connection" description="Slow shows the loading skeleton; Error shows Couldn’t load results with Retry"
            bottom={<SegmentedControl size="s" fullWidth value={searchNetwork} onChange={setSearchNetwork} options={[{ value: 'normal', label: 'Normal' }, { value: 'slow', label: 'Slow' }, { value: 'error', label: 'Error' }]} />} />
        </SettingsSection>

        <SettingsSection title="Demo data">
          <ContentCard size="s" iconRight="arrow-back-up" onClick={reset} title="Reset demo" description="Undo everything changed in this browser" />
        </SettingsSection>
      </div>
    </Drawer>
  );
}
