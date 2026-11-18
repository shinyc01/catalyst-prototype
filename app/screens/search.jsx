/* Global Search (NavBar): find a known item. Figma Global Search handover acAfLbn5qy49dNNMouadUR, frame 2:21957 "Best match".
   The search icon expands into a 600 px field in the NavBar, with the dropdown attached below it:
   type chips (All / Assets / Investments + counts) · Match: Any · filter | BEST MATCH (preselected) | OTHER MATCHES · n | keyboard hints.
   DEV NOTE (Figma): "An exact code or name match becomes Best match and is already selected — one Enter opens it."
   Not in DS: the expanded field and the search-result-row (built from DS Chip, Select, IconButton, Badge, Icon). */
function GlobalSearch({ open, onClose, onOpenAsset }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [active, setActive] = useState(0);
  const input = useRef(null);
  useEffect(() => { if (open) { setQ(''); setType('all'); setActive(0); setTimeout(() => input.current?.focus(), 30); } }, [open]);
  if (!open) return null;
  const r = globalSearch(q);
  const all = type === 'assets' ? r.assets : type === 'investments' ? r.investments : [...r.assets, ...r.investments].sort((x, y) => y.s - x.s);
  const list = all.slice(0, 6), best = list[0], others = list.slice(1);
  const openItem = x => {
    if (!x) return;
    onClose();
    if (x.kind === 'asset') onOpenAsset(x.id, q, r.assets.map(a => a.id));
    else toast({ title: `${x.code} · ${x.name}`, description: 'Investments open in Build — not part of this flow' });
  };
  const key = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, list.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    if (e.key === 'Enter') openItem(list[active]);
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab') { e.preventDefault(); setType(t => ({ all: 'assets', assets: 'investments', investments: 'all' })[t]); setActive(0); }
  };
  const status = x => {
    if (x.kind !== 'asset') return { label: x.stage || 'Investment', dot: 'gray' };
    const v = assess(x.a, NOW, []).risk, crit = v >= TOLERANCE[x.a.type];
    return { label: crit ? 'Critical' : 'Healthy', dot: crit ? 'red' : 'green' };
  };
  const hl = (code) => {                                                   // the matching part of the code in white, the rest tertiary (Figma)
    const i = code.toLowerCase().indexOf(q.trim().toLowerCase());
    if (i < 0 || !q.trim()) return <b>{code}</b>;
    return <><span className="gs-dim">{code.slice(0, i)}</span><b>{code.slice(i, i + q.trim().length)}</b><span className="gs-dim">{code.slice(i + q.trim().length)}</span></>;
  };
  const Row = ({ x, i }) => {
    const st = status(x);
    return (
      <div role="option" aria-selected={i === active} tabIndex={-1} className={`gs-row${i === active ? ' is-active' : ''}${i === 0 ? ' gs-best' : ''}`}
        onMouseEnter={() => setActive(i)} onClick={() => openItem(x)}>
        <span className="gs-tile"><Icon name={x.kind === 'asset' ? 'map-pin' : 'chat-folder'} size={16} /></span>
        <span className="col" style={{ flex: 1, minWidth: 0 }}>
          <span className="t-body-m-medium"><span className="sec">{x.name}</span>&nbsp;&nbsp;{hl(x.code)}</span>
          <span className="t-body-s-regular muted plan-ellipsis">{x.detail}</span>
        </span>
        <Badge size="s" color="black" indicator={st.dot === 'red' ? 'error' : st.dot === 'green' ? 'success' : undefined}>{st.label}</Badge>
      </div>
    );
  };
  return (
    <div className="gs-layer" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <NDS label="Global search (expanded field + result rows)" className="gs">
        <div className="gs-field" onClick={() => input.current?.focus()}>
          <Icon name="system-search" size={16} />
          {type !== 'all' && <Chip selected onRemove={() => setType('all')}>{`Type: ${type === 'assets' ? 'Assets' : 'Investments'}`}</Chip>}
          <input ref={input} className="gs-input t-body-m-regular" value={q} placeholder="Search assets, investments, plans…" aria-label="Global search"
            onChange={e => { setQ(e.target.value); setActive(0); }} onKeyDown={key} />
          {q && <IconButton icon="system-close" type="ghost" size="s" label="Clear search" onClick={() => { setQ(''); input.current?.focus(); }} />}
        </div>
        {q.trim() && <div className="gs-drop" role="listbox" aria-label="Search results">
          <div className="row gs-head">
            <div className="row" style={{ gap: 6, flex: 1 }}>
              <Chip selected={type === 'all'} counter={r.assets.length + r.investments.length} onChange={() => setType('all')}>All</Chip>
              <Chip selected={type === 'assets'} counter={r.assets.length} onChange={() => setType('assets')}>Assets</Chip>
              <Chip selected={type === 'investments'} counter={r.investments.length} onChange={() => setType('investments')}>Investments</Chip>
            </div>
            <Select size="s" value="any" clearable={false} onChange={() => {}} options={[{ value: 'any', label: 'Match: Any' }, { value: 'code', label: 'Match: Code' }, { value: 'name', label: 'Match: Name' }]} aria-label="Match" />
            <IconButton icon="system-filter" type="secondary" size="s" label="Filters" onClick={() => toast({ title: 'Search filters aren’t part of this flow' })} />
          </div>
          {best ? <>
            <span className="t-label-m-upper muted gs-cap">Best match</span>
            <Row x={best} i={0} />
            {others.length > 0 && <span className="t-label-m-upper muted gs-cap">Other matches · {others.length}</span>}
            {others.map((x, i) => <Row key={x.kind + x.id} x={x} i={i + 1} />)}
          </> : <span className="t-body-m-regular sec gs-cap">No matches for “{q}”. Try an asset code, e.g. NT11 or PM-0005.</span>}
          <div className="row gs-keys t-body-s-regular">
            <span><b>↑↓</b> Navigate</span><span><b>↵</b> Open</span><span><b>Tab</b> Type</span><span><b>Esc</b> Close</span>
          </div>
        </div>}
      </NDS>
    </div>
  );
}
