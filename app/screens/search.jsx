/* Global Search — the whole handover (Figma acAfLbn5qy49dNNMouadUR, page 2:61), not a flow.
   Specs: context/screens/global-search-spec-1-open-find.md (open, recent, find a known item, clear / open from searches),
   -2-narrow.md (types, Sort & filter, Match, filters from the query, result counts), -3-results.md (All vs one type, View all,
   no results, Ask Cooper, limit to one type, slow / failing search). Engine and records: shared/search-model.js.
   Not in DS (NDS): the expanded NavBar field with its inline pill, the result row and its leading tile, the grouped layout,
   the "Filled from …  ↶ Undo" lines and the keyboard-hints bar. Everything else is DS 2.0. */
const SEARCH_MAX_H = 804;                                  // Figma: the popup grows with content to 804 px, then the list scrolls
const PAGE = 20;                                           // one-type list: no row cap, loads more as you scroll

function GlobalSearch({ open, onClose, onOpen, network = 'normal' }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [match, setMatch] = useState('any');
  const [filters, setFilters] = useState({});
  const [owners, setOwners] = useState(null);
  const [updated, setUpdated] = useState('any');
  const [sort, setSort] = useState('relevance');
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(-1);
  const [pop, setPop] = useState(false);
  const [fills, setFills] = useState([]);                  // [{ word, group, value, how: 'Filled' | 'Applied', type }]
  const [noRefill, setNoRefill] = useState([]);
  const [cleared, setCleared] = useState(null);            // "Asset filters cleared …"
  const [cq, setCq] = useState('');                        // the query results are shown for (debounced)
  const [phase, setPhase] = useState('idle');              // idle | loading | error
  const [limit, setLimit] = useState(PAGE);
  const [searches, setSearches] = usePersisted('search.recent', []);   // [{ q, type }]  last 5, newest first, no duplicates
  const [opened, setOpened] = usePersisted('search.opened', []);       // [{ type, id }] last 6 opened
  const [cooper, setCooper] = useState(null);              // the Cooper panel: { text }
  const input = useRef(null), list = useRef(null), timer = useRef(null);

  const reset = () => { setQ(''); setCq(''); setType('all'); setMatch('any'); setFilters({}); setOwners(null); setUpdated('any'); setSort('relevance');
    setActive(0); setHover(-1); setPop(false); setFills([]); setNoRefill([]); setCleared(null); setPhase('idle'); setLimit(PAGE); };
  useEffect(() => { if (open) { reset(); setTimeout(() => input.current?.focus(), 30); } }, [open]);

  // Debounce 250 ms; a slow network shows skeletons (only past 300 ms, at least 300 ms); an error network fails (Figma 8)
  const runLater = (text, st = {}) => {
    clearTimeout(timer.current);
    if (!text.trim()) { setCq(''); setPhase('idle'); return; }
    timer.current = setTimeout(() => {
      if (network === 'normal') { setCq(text); setPhase('idle'); setActive(0); setLimit(PAGE); return; }
      setPhase('loading');
      timer.current = setTimeout(() => {
        if (network === 'error') { setPhase('error'); saveSearch(text, st.type ?? type); }
        else { setCq(text); setPhase('idle'); setActive(0); setLimit(PAGE); }
      }, network === 'slow' ? 1600 : 1200);
    }, 250);
  };
  const saveSearch = (text, t) => { const s = text.trim(); if (!s) return; setSearches(l => [{ q: s, type: t }, ...l.filter(x => x.q.toLowerCase() !== s.toLowerCase())].slice(0, 5)); };

  const onText = v => {
    const p = parsePrefix(v);                                // "asset:" → pill, "code:" / "name:" → Match (Figma 3.4, 3.5, 7)
    if (p) { if (p.type) chooseType(p.type, true); if (p.match) setMatch(p.match); v = p.rest; }
    setQ(v); setCleared(null);
    if (!v.trim()) { setFills([]); setNoRefill([]); }
    runLater(v);
  };
  const chooseType = (t, keepFilters) => {
    if (t === type) return;
    const had = Object.values(filters).some(Boolean);
    if (!keepFilters && had && type !== 'all') setCleared(`${searchType(type).label.replace(/s$/, '')} filters cleared — each type has its own filters`);
    setType(t); setFilters({}); setActive(0); setLimit(PAGE); setFills(f => f.filter(x => x.type === 'all'));
    list.current && (list.current.scrollTop = 0);
  };

  // Results
  const st = { q: cq, type, match, filters, owners, updated, sort };
  const res = cq ? runSearch(st) : null;
  // A code prefix alone sets the type (Figma 2 · Code prefix)
  useEffect(() => { if (cq && type === 'all') { const t = codePrefixType(cq); if (t) chooseType(t, true); } }, [cq]);
  // Words that name exactly one valid value are filled in; others are offered under NARROW WITH (Figma 3.5)
  const vw = cq ? valueWords(cq, type) : [];
  useEffect(() => {
    if (!cq || type === 'all') return;
    const auto = vw.filter(v => v.unique && !noRefill.includes(v.word) && (v.cands[0].group === 'Owner' ? SEARCH_HAS_OWNER(type) : (SEARCH_FILTERS[type] || []).includes(v.cands[0].group)));
    if (!auto.length) return;
    auto.forEach(v => applyValue(v.word, v.cands[0], 'Filled'));
  }, [cq, type]);
  const applyValue = (word, c, how) => {
    if (c.group === 'Owner') setOwners([c.value]); else { if (c.type !== 'all' && c.type !== type) setType(c.type); setFilters(f => ({ ...f, [c.group]: c.value })); }
    const nq = q.replace(new RegExp(`\\b${word}\\b\\s*`, 'i'), '').replace(/\s+/g, ' ').trimStart();
    setQ(nq); setCq(nq); setFills(f => [...f.filter(x => x.word !== word), { word, group: c.group, value: c.value, how, type: c.group === 'Owner' ? 'all' : c.type }]);
  };
  const undoFill = fl => {
    if (fl.group === 'Owner') setOwners(null); else setFilters(f => { const n = { ...f }; delete n[fl.group]; return n; });
    const nq = `${fl.word} ${q}`.trim(); setQ(nq); setCq(nq); setNoRefill(n => [...n, fl.word]); setFills(f => f.filter(x => x !== fl));
  };

  const openItem = (r, newTab) => {
    if (!r) return;
    saveSearch(q || cq, type);
    setOpened(l => [{ type: r.type, id: r.id }, ...l.filter(x => !(x.type === r.type && x.id === r.id))].slice(0, 6));
    onClose();
    onOpen(r, { newTab, query: cq, ids: res ? res.rows.filter(x => x.type === 'asset').map(x => x.id) : [r.id] });
  };
  const viewAll = () => { saveSearch(cq, type); onClose(); onOpen(null, { viewAll: type, query: cq, ids: res.rows.filter(x => x.type === 'asset').map(x => x.id) }); };
  const askCooper = text => { saveSearch(text, type); onClose(); setCooper({ text: res && res.rows.length ? text.replace(/^./, c => c.toUpperCase()) : `Help me find “${text}”` }); };

  // What's on screen as a flat, navigable list
  const recentRows = opened.map(o => SEARCH_INDEX.find(r => r.type === o.type && String(r.id) === String(o.id))).filter(Boolean);
  const mode = !q.trim() ? 'recent' : phase === 'loading' ? 'loading' : phase === 'error' ? 'error' : !res ? 'loading' : res.rows.length ? 'results' : 'none';
  let groups = [], flat = [];
  if (mode === 'recent') { flat = recentRows.filter(r => type === 'all' || r.type === type); }
  if (mode === 'results') {
    if (type === 'all') {
      const ordered = SEARCH_TYPES.filter(t => res.rows.some(r => r.type === t.key)).sort((a, b) => res.rows.findIndex(r => r.type === a.key) - res.rows.findIndex(r => r.type === b.key));
      groups = ordered.map(t => ({ t, rows: res.rows.filter(r => r.type === t.key).slice(0, 3), n: res.rows.filter(r => r.type === t.key).length }));
      flat = groups.flatMap(g => g.rows);
    } else flat = res.rows.slice(0, limit);
  }
  const askRow = (mode === 'none' || (mode === 'results' && res.question)) ? { ask: true } : null;
  const nav = askRow ? [...flat, askRow] : flat;
  const count = nav.length;

  const key = e => {
    const mod = e.metaKey || e.ctrlKey;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => count ? (a + 1) % count : 0); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => count ? (a - 1 + count) % count : 0); }
    else if (e.key === 'Enter') { e.preventDefault(); const r = nav[active]; if (r?.ask) askCooper(cq || q); else if (r) openItem(r, mod); }
    else if (e.key === 'Escape') { e.preventDefault(); if (q) { setQ(''); setCq(''); setPhase('idle'); } else if (type !== 'all' || Object.values(filters).some(Boolean) || owners) { setType('all'); setFilters({}); setOwners(null); setFills([]); } else onClose(); }
    else if (e.key === 'Tab') { e.preventDefault(); const keys = ['all', ...SEARCH_TYPES.map(t => t.key)].filter(k => k === 'all' || k === type || (mode === 'recent' ? recentRows.some(r => r.type === k) : res && res.counts[k]));
      const i = keys.indexOf(type); chooseType(keys[(i + (e.shiftKey ? -1 : 1) + keys.length) % keys.length]); }
    else if (e.key === 'Backspace' && input.current?.selectionStart === 0 && input.current?.selectionEnd === 0) {
      if (fills.length) { e.preventDefault(); undoFill(fills[fills.length - 1]); } else if (!q && type !== 'all') { e.preventDefault(); chooseType('all', true); } }
    else if (e.altKey && /^(Digit[123]|KeyF)$/.test(e.code)) { e.preventDefault(); if (e.code === 'KeyF') setPop(p => !p); else setMatch({ Digit1: 'any', Digit2: 'name', Digit3: 'code' }[e.code]); }
  };
  useEffect(() => { const el = list.current?.querySelector('.gs-row.is-active'); el && el.scrollIntoView({ block: 'nearest' }); }, [active]);

  const cooperPanel = cooper && (
    <div className="gs-cooper">
      <AgentWindow title="Cooper" text={null} onClose={() => setCooper(null)} onAsk={() => toast({ title: 'Cooper chat isn’t part of this prototype yet' })}>
        <div className="col" style={{ gap: 'var(--space-250)' }}>
          <UserMessage>{cooper.text}</UserMessage>
          <span className="row t-body-m-regular muted" style={{ gap: 'var(--space-150)' }}><Icon name="cooper-system-icon" size={16} />Cooper is working on it…</span>
        </div>
      </AgentWindow>
    </div>
  );
  if (!open) return cooperPanel || null;

  // ---------- pieces
  const hl = (text, isCode) => {                          // matched words in primary semibold (Figma); with Match: ID code only the code fragment
    const ws = words(cq).filter(w => !FILLER.has(w));
    if (!cq || (match === 'code' && !isCode) || (match === 'name' && isCode)) return text;
    const parts = text.split(/(\s+|-)/);
    return parts.map((p, i) => ws.some(w => p.toLowerCase().startsWith(w) || stem(p.toLowerCase()) === stem(w)) || (isCode && cq && p.toLowerCase().includes(cq.toLowerCase().trim())) ? <b key={i}>{p}</b> : p);
  };
  const Row = ({ r, i, showType }) => (
    <div role="option" aria-selected={i === active} className={`gs-row${i === active ? ' is-active' : ''}${i === hover && i !== active ? ' is-hover' : ''}`}
      onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)} onClick={e => openItem(r, e.metaKey || e.ctrlKey)}>
      <span className="gs-tile"><Icon name={searchType(r.type).icon} size={16} /></span>
      <span className="col" style={{ flex: 1, minWidth: 0 }}>
        <span className="t-label-m-medium gs-l1"><span>{mode === 'recent' ? r.name : hl(r.name)}</span><span className="gs-code">{mode === 'recent' ? r.code : hl(r.code, true)}</span></span>
        <span className="t-body-m-regular muted plan-ellipsis">{[showType ? searchType(r.type).one.replace(/^./, c => c.toUpperCase()) : null, ...r.detail].filter(Boolean).join(' · ')}</span>
      </span>
      {r.status && <Badge size="s" color="black" indicator={SEARCH_STATUS_DOT[r.status]}>{r.status}</Badge>}
    </div>
  );
  const AskRow = ({ i }) => (
    <div role="option" aria-selected={i === active} className={`gs-row gs-ask${i === active ? ' is-active' : ''}`} onMouseEnter={() => setHover(i)} onClick={() => askCooper(cq || q)}>
      <Icon name="cooper-system-icon" size={16} /><span className="t-body-m-regular">Ask Cooper</span><span className="t-body-m-regular gs-cooper-q">“{cq || q}”</span>
    </div>
  );
  const chipKeys = mode === 'recent'
    ? SEARCH_TYPES.map(t => ({ k: t.key, label: t.label, n: recentRows.filter(r => r.type === t.key).length, dim: !recentRows.some(r => r.type === t.key) }))
    : mode === 'none' ? [] : SEARCH_TYPES.filter(t => t.key === type || (res && res.counts[t.key])).map(t => ({ k: t.key, label: t.label, n: res ? res.counts[t.key] : null }));
  const allN = mode === 'recent' ? recentRows.length : res ? res.total : null;
  const nFilters = Object.values(filters).filter(Boolean).length + (owners ? 1 : 0) + (updated !== 'any' ? 1 : 0);
  const loadingChips = mode === 'loading';
  const groupsFor = type === 'all' ? [] : (SEARCH_FILTERS[type] || []);
  const popover = (
    <IFS.Popover open={pop} onOpenChange={setPop} align="end" width="var(--overlay-width-s)" showClose={false}
      trigger={<span className="gs-filter-btn"><IconButton icon="system-filter" type={pop ? 'secondary' : 'tertiary'} size="s" label="Sort & filter" />{nFilters > 0 && <span className="gs-dot" />}</span>}>
      <div className="col" style={{ gap: 'var(--space-300)', padding: 'var(--space-100)' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="row" style={{ gap: 'var(--space-150)' }}><span className="t-label-m-medium muted">Sort & filter</span>{nFilters > 0 && <Counter>{nFilters}</Counter>}</span>
          <Button type="ghost" size="s" onClick={() => { setFilters({}); setOwners(null); setUpdated('any'); setFills([]); }}>Clear all</Button>
        </div>
        <Select size="m" iconLeft="arrow-sort" clearable={false} value={sort} onChange={setSort} options={SEARCH_SORTS.map(([v, l]) => ({ value: v, label: `Sort by: ${l}` }))} aria-label="Sort by" />
        {groupsFor.map(g => (
          <div key={g} className="col" style={{ gap: 'var(--space-150)' }}>
            <span className="t-label-m-medium muted">{g}</span>
            <div className="row" style={{ gap: 'var(--space-150)', flexWrap: 'wrap' }}>
              <Chip selected={!filters[g]} onChange={() => setFilters(f => ({ ...f, [g]: null }))}>All</Chip>
              {filterValues(type, g).map(v => <Chip key={v} selected={filters[g] === v} onChange={() => setFilters(f => ({ ...f, [g]: f[g] === v ? null : v }))}>{v}</Chip>)}
            </div>
          </div>
        ))}
        {(type === 'all' || type === 'study') && <div className="col" style={{ gap: 'var(--space-150)' }}>
          <span className="t-label-m-medium muted">Updated</span>
          <div className="row" style={{ gap: 'var(--space-150)', flexWrap: 'wrap' }}>{SEARCH_UPDATED.filter(u => type === 'all' || u[0] !== '365').map(([v, l]) => <Chip key={v} selected={updated === v} onChange={() => setUpdated(v)}>{l}</Chip>)}</div>
        </div>}
        {SEARCH_HAS_OWNER(type) && <div className="col" style={{ gap: 'var(--space-150)' }}>
          <span className="t-label-m-medium muted">Owner</span>
          <IFS.MultiSelect size="m" value={owners || SEARCH_OWNERS} onChange={v => setOwners(!v.length || v.length === SEARCH_OWNERS.length ? null : v)} listTitle="Owners"
            placeholder="Anyone" options={SEARCH_OWNERS.map(o => ({ value: o, label: o }))} aria-label="Owner" />
          <span className="t-body-m-regular muted">{owners ? `${owners.length} collaborator${owners.length > 1 ? 's' : ''}` : 'Anyone'}</span>
        </div>}
      </div>
    </IFS.Popover>
  );
  const searchedLine = () => {
    const bits = [];
    if (type !== 'all') bits.push(`in ${searchType(type).label.toLowerCase()}`);
    bits.push(match === 'code' ? 'in codes' : match === 'name' ? 'in names' : 'in every field');
    if (nFilters) bits.push(`with ${nFilters} filter${nFilters > 1 ? 's' : ''}`);
    return `Searching ${bits.join(', ')}.`;
  };
  const widen = mode === 'none' ? widenOptions(st) : [];
  const narrow = mode === 'results' ? vw.filter(v => !(type !== 'all' && v.unique && !noRefill.includes(v.word))).flatMap(v => v.cands.filter(c => c.group === 'Owner' || type === 'all' || c.type === type).map(c => ({ word: v.word, c,
    n: runSearch({ ...st, ...(c.group === 'Owner' ? { owners: [c.value] } : { type: c.type === 'all' ? type : c.type, filters: c.type === type ? { ...filters, [c.group]: c.value } : { [c.group]: c.value } }) }).rows.length }))).filter(x => x.n) : [];
  let idx = 0;

  return (
    <div className="gs-layer" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      {cooperPanel}
      <NDS label="Global search (expanded field, result rows, grouped layout)" className="gs">
        <div className="gs-field" onClick={() => input.current?.focus()}>
          <Icon name="system-search" size={16} />
          {type !== 'all' && <Chip selected onRemove={() => chooseType('all', true)}>{`Type: ${searchType(type).label}`}</Chip>}
          <input ref={input} className="gs-input t-body-m-regular" value={q} placeholder="Search by name or ID" aria-label="Global search" onChange={e => onText(e.target.value)} onKeyDown={key} />
          {(q || type !== 'all' || nFilters > 0) && <IconButton icon="system-close" type="ghost" size="s" label="Clear search" onClick={() => { reset(); input.current?.focus(); }} />}
        </div>
        <div className="gs-drop" role="listbox" aria-label="Search results" style={{ maxHeight: SEARCH_MAX_H }}>
          {!(mode === 'recent' && !recentRows.length && !searches.length) && <div className="row gs-head">
            <div className="gs-chips">
              {mode === 'none' ? <Chip selected>All</Chip> : <>
                <Chip selected={type === 'all'} counter={loadingChips ? undefined : allN} onChange={() => chooseType('all')}>All</Chip>
                {chipKeys.map(c => <span key={c.k} className={c.dim ? 'gs-dim-chip' : ''}><Chip selected={type === c.k} counter={loadingChips ? undefined : c.n} onChange={() => chooseType(c.k)}>{c.label}</Chip></span>)}
              </>}
            </div>
            <Select size="s" clearable={false} value={match} onChange={setMatch} aria-label="Match"
              options={[{ value: 'any', label: 'Match: Any' }, { value: 'name', label: 'Match: Name' }, { value: 'code', label: 'Match: ID code' }]} />
            {popover}
          </div>}
          <div className="gs-body" ref={list} onScroll={e => { const el = e.currentTarget; if (type !== 'all' && mode === 'results' && el.scrollTop + el.clientHeight > el.scrollHeight - 80 && limit < res.rows.length) setLimit(l => l + PAGE); }}>
            {cleared && <div className="gs-note t-body-m-regular sec">{cleared}</div>}
            {fills.map(fl => <div key={fl.word} className="gs-note row t-body-m-regular sec">{fl.how} from “{fl.word}”: <b>{fl.group}: {fl.value}.</b>
              <Button type="ghost" size="s" iconLeft="arrow-back-up" onClick={() => undoFill(fl)}>Undo</Button></div>)}
            {mode === 'results' && res.corrected && <div className="gs-note t-body-m-regular sec">No exact matches for “{cq}”. Showing results for <b>{res.corrected}</b>.</div>}
            {narrow.length > 0 && <div className="gs-narrow col">
              <span className="t-label-m-medium muted">Narrow with</span>
              <div className="row" style={{ gap: 'var(--space-150)', flexWrap: 'wrap' }}>{narrow.map(x => <Chip key={x.c.group + x.c.value} counter={x.n} onChange={() => applyValue(x.word, x.c, 'Applied')}>{`${x.c.group}: ${x.c.value}`}</Chip>)}</div>
            </div>}

            {mode === 'recent' && (!recentRows.length && !searches.length
              ? <EmptyState cause="first-run" size="section" heading="No Recent Items" body="Items you open appear here." />
              : <>
                {type === 'all' && searches.length > 0 && <div className="gs-searches col">
                  <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-label-m-medium">Your searches</span>
                    <Button type="ghost" size="s" onClick={() => setSearches([])}>Clear all</Button></div>
                  <div className="row gs-chips">{searches.map(s => <Chip key={s.q} iconLeft="system-clock-time" onRemove={() => setSearches(l => l.filter(x => x.q !== s.q))}
                    onChange={() => { setType(s.type || 'all'); setQ(s.q); runLater(s.q, { type: s.type }); }}>{s.q}</Chip>)}</div>
                </div>}
                {flat.length > 0 && <span className="t-label-m-medium gs-cap">Recently opened</span>}
                {flat.map((r, i) => <Row key={r.type + r.id} r={r} i={i} showType={type === 'all'} />)}
              </>)}

            {mode === 'loading' && [0, 1, 2].map(i => <div key={i} className="gs-row"><IFS.Skeleton width="var(--size-32)" height="var(--size-32)" shape="block" />
              <span className="col" style={{ flex: 1, gap: 'var(--space-150)' }}><IFS.Skeleton width="40%" height="var(--size-10)" /><IFS.Skeleton width="70%" height="var(--size-10)" /></span><IFS.Skeleton width="var(--size-56)" height="var(--size-18)" /></div>)}

            {mode === 'error' && <div className="gs-empty"><span className="gs-warn"><Icon name="status-warning-filled" size={24} /></span>
              <span className="t-label-m-medium">Couldn’t Load Results</span>
              <span className="t-body-m-regular sec" style={{ maxWidth: 'var(--text-measure)', textAlign: 'center' }}>The search service didn’t respond. Your search is saved in Your searches, so you can try it again later.</span>
              <Button type="secondary" size="s" iconLeft="arrow-refresh" onClick={() => { setPhase('loading'); setTimeout(() => { setCq(q); setPhase('idle'); }, 900); }}>Try again</Button></div>}

            {mode === 'none' && <>
              <div className="gs-empty"><span className="t-label-m-medium">{`No Matches for “${cq}”`}</span>
                <span className="t-body-m-regular sec">{widen.length ? searchedLine() : 'Check the spelling, try fewer words, or search by code.'}</span></div>
              {widen.length > 0 && <div className="col" style={{ gap: 'var(--space-150)' }}><span className="t-label-m-medium gs-cap">Widen the search</span>
                {widen.map(w => <button key={w.id} className="gs-option" onClick={() => { if (w.id === 'match') setMatch('any'); if (w.id === 'filters') { setFilters({}); setOwners(null); setUpdated('any'); } if (w.id === 'types') chooseType('all', true); }}>
                  <span className="t-label-m-medium">{w.label}</span><span className="t-body-m-regular muted">{w.n} result{w.n > 1 ? 's' : ''}</span></button>)}</div>}
            </>}

            {mode === 'results' && type === 'all' && groups.map(g => (
              <div key={g.t.key} className="col gs-group">
                {res.best && g.rows[0] === res.best ? <span className="t-label-m-medium muted gs-cap">Best match</span> : <span className="t-label-m-medium muted gs-cap">{g.t.label} · {g.n}</span>}
                {g.rows.map(r => { const i = idx++; return <Row key={r.type + r.id} r={r} i={i} showType />; })}
                {g.n > 3 && <div><Button type="ghost" size="s" iconRight="arrow-right" onClick={() => chooseType(g.t.key)}>{`Show all ${g.n} ${g.t.label.toLowerCase()}`}</Button></div>}
              </div>
            ))}
            {mode === 'results' && type !== 'all' && <>
              <div className="row gs-cap" style={{ justifyContent: 'space-between' }}>
                <span className="t-label-m-medium muted">{res.best ? 'Best match' : `Results · ${res.rows.length}`}</span>
                {searchType(type).area && <Button type="ghost" size="s" iconRight="arrow-right" onClick={viewAll}>{`View all in ${searchType(type).area}`}</Button>}
              </div>
              {flat.map((r, i) => <Row key={r.type + r.id} r={r} i={i} />)}
            </>}
            {askRow && <AskRow i={count - 1} />}
          </div>
          <div className="row gs-keys t-body-s-regular">
            <span><b>↑↓</b> Navigate</span><span><b>↵</b> Open</span><span><b>⌘↵</b> New tab</span><span><b>Tab</b> Type</span><span><b>Esc</b> Close</span>
          </div>
        </div>
      </NDS>
    </div>
  );
}
