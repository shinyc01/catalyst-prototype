/* Global Search (NavBar): find a known item. Figma Global Search handover acAfLbn5qy49dNNMouadUR, 2:21957 "Best match".
   An exact code becomes the Best match and is already selected: one Enter opens it. Assets open in Explore with their details.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. */
function GlobalSearch({ open, onClose, onOpenAsset }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [active, setActive] = useState(0);
  const box = useRef(null);
  useEffect(() => { if (open) { setQ(''); setActive(0); setTimeout(() => box.current?.querySelector('input')?.focus(), 50); } }, [open]);
  useEffect(() => { if (!open) return; const k = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [open]);
  if (!open) return null;
  const r = globalSearch(q);
  const all = type === 'assets' ? r.assets : type === 'investments' ? r.investments : [...r.assets, ...r.investments];
  const best = all[0], others = all.slice(1, 6);
  const openItem = x => { if (!x) return; onClose(); if (x.kind === 'asset') onOpenAsset(x.id); else toast({ title: `${x.code} · ${x.name}`, description: 'Investments open in Build — not part of this flow' }); };
  const Row = ({ x, i }) => (
    <ContentCard size="s" selected={i === active} onClick={() => openItem(x)} iconLeft={x.kind === 'asset' ? 'map-location' : 'chat-folder'}
      title={`${x.name} · ${x.code}`} description={x.detail}
      control={x.kind === 'asset' ? <Indicator size="xs" type={bandOf(assess(x.a, NOW, []).risk).label === 'Critical' ? 'red' : 'green'}>{bandOf(assess(x.a, NOW, []).risk).label}</Indicator> : undefined} />
  );
  return (
    <div className="gsearch-layer" onClick={onClose}>
      <NDS label="Global search dropdown (search-result-row not in DS)" className="gsearch col" style={{}}>
        <div className="col" style={{ gap: 8 }} ref={box} onClick={e => e.stopPropagation()}
          onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, Math.min(all.length, 6) - 1)); } if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); } }}>
          <IFS.Search placeholder="Search assets, investments, plans…" value={q} aria-label="Global search"
            onChange={v => { setQ(v); setActive(0); }} onSearch={() => openItem(all[active])} />
          {q && <>
            <SegmentedControl size="s" value={type} onChange={setType} options={[{ value: 'all', label: 'All', counter: r.assets.length + r.investments.length },
              { value: 'assets', label: 'Assets', counter: r.assets.length }, { value: 'investments', label: 'Investments', counter: r.investments.length }]} />
            {best ? <>
              <span className="t-label-m-upper muted">Best match</span>
              <Row x={best} i={0} />
              {others.length > 0 && <span className="t-label-m-upper muted">Other matches · {others.length}</span>}
              {others.map((x, i) => <Row key={x.kind + x.id} x={x} i={i + 1} />)}
            </> : <span className="t-body-m-regular sec">No matches for “{q}”. Try an asset code like NT11 or WD-LV-PM-0006.</span>}
            <span className="t-body-s-regular muted">↑↓ Navigate · ↵ Open · Esc Close</span>
          </>}
          {!q && <span className="t-body-s-regular muted">Type an asset or investment code, e.g. NT11, OHL-14-2380 or DIST000246.</span>}
        </div>
      </NDS>
    </div>
  );
}
