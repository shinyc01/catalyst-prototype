/* Map (MapLibre 3D) + legend + map tools.
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
/* ============================================================ Map (MapLibre GL, 3D) — not in DS
   Styled after the Figma handovers: tilted 3D view, near-black ground with faint road linework and translucent
   extruded buildings, the area-risk grid as a continuous blue → green → yellow → red heat grid with dark gaps,
   white network lines with grey nodes, risk dots on assets, white labels. All colours are read from DS tokens. */
const tok = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const tokVar = v => tok(v.replace(/^var\((.*)\)$/, '$1'));
const toRgb = c => { if (c[0] === '#') { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; } return (c.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number); };
let RAMP = null;
const rampColor = r => {
  RAMP = RAMP || AREA_BANDS.map(b => [b.min, toRgb(tok(b.token))]);
  let k = RAMP.findIndex(s => r < s[0]); if (k === -1) return `rgb(${RAMP[RAMP.length - 1][1]})`; if (k === 0) return `rgb(${RAMP[0][1]})`;
  const [v0, c0] = RAMP[k - 1], [v1, c1] = RAMP[k], t = (r - v0) / (v1 - v0);
  return `rgb(${c0.map((x, i) => Math.round(x + (c1[i] - x) * t))})`;
};
const ll = p => [p[1], p[0]];   // our data is [lat, lng]; MapLibre wants [lng, lat]
const N_LAT = Math.round((AREA.n - AREA.s) / CELL_LAT), N_LNG = Math.round((AREA.e - AREA.w) / CELL_LNG);
const GRID_CELLS = (() => {
  const out = [], gi = 0.09;   // inset → dark gap between squares
  for (let i = 0; i < N_LAT; i++) for (let j = 0; j < N_LNG; j++) {
    const s = AREA.s + i * CELL_LAT, w = AREA.w + j * CELL_LNG, n = s + CELL_LAT, e = w + CELL_LNG, di = CELL_LAT * gi / 2, dj = CELL_LNG * gi / 2;
    out.push({ c: [s + CELL_LAT / 2, w + CELL_LNG / 2], g: { type: 'Polygon', coordinates: [[[w + dj, s + di], [e - dj, s + di], [e - dj, n - di], [w + dj, n - di], [w + dj, s + di]]] } });
  }
  return out;
})();
function areaBreakdown(lat, lng, year, active) {
  const bp = basePofsFor(year), total = areaRisk(lat, lng, year, active, bp), base = areaRisk(lat, lng, year, [], bp);
  return { total, base, parts: active.map(l => ({ id: l.id, delta: total - areaRisk(lat, lng, year, active.filter(o => o.id !== l.id), bp) })) };
}
// Distribution lines, place labels and zones come from shared/whistler-additions.js (DIST_LINES, PLACE_LABELS, ZONES)
const midpoint = line => { const k = Math.floor((line.length - 1) / 2); const a = line[k], b = line[k + 1]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
const fc = features => ({ type: 'FeatureCollection', features });
const VIEW = { pitch: 45, bearing: -14 };

function MapView({ lenses, year, selected, onSelect, interactive = true, grid = false, pad, apiRef, focus, labels = true }) {
  const el = useRef(null), st = useRef({});
  Object.assign(st.current, { onSelect, pad, lenses, year, grid });
  const padding = () => { const p = st.current.pad; return p ? { top: p.tl[1], left: p.tl[0], bottom: p.br[1], right: p.br[0] } : 30; };
  useEffect(() => {
    const c = k => tok(k);
    const map = new maplibregl.Map({
      container: el.current, interactive, attributionControl: { compact: true }, ...VIEW, maxPitch: 70,
      center: ll(SS), zoom: 14, minZoom: interactive && grid ? 13.4 : 12, maxZoom: 17.5, fadeDuration: 0,
      style: { version: 8, sources: { omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet', attribution: '© OpenFreeMap © OpenMapTiles © OpenStreetMap' } }, layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': c('--background-page') } },
        { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': c('--background-elevation-1-secondary') } },
        { id: 'roads', type: 'line', source: 'omt', 'source-layer': 'transportation', paint: { 'line-color': c('--border-medium'), 'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.3, 16, 1.4] } },
      ] },
    });
    el.current.__map = map; // handy for debugging
    const bounds = ASSETS.flatMap(a => a.line || [a.at]).reduce((b, p) => b.extend(ll(p)), new maplibregl.LngLatBounds(ll(SS), ll(SS)));
    const fit = () => map.fitBounds(bounds, { padding: padding(), ...VIEW, duration: 0 });
    st.current.map = map; st.current.fit = fit;
    map.on('load', () => {
      map.addSource('grid', { type: 'geojson', data: fc([]) });
      map.addLayer({ id: 'grid', type: 'fill', source: 'grid', paint: { 'fill-color': ['get', 'c'], 'fill-opacity': 0.55, 'fill-antialias': false } });
      map.addLayer({ id: 'buildings', type: 'fill-extrusion', source: 'omt', 'source-layer': 'building', minzoom: 13,
        paint: { 'fill-extrusion-color': c('--text-disabled'), 'fill-extrusion-opacity': 0.45,
          'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 6], 'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0] } });
      map.addSource('ctx', { type: 'geojson', data: fc(DIST_LINES.map(l => ({ type: 'Feature', geometry: { type: 'LineString', coordinates: l.map(ll) } }))) });
      map.addLayer({ id: 'ctx', type: 'line', source: 'ctx', paint: { 'line-color': c('--border-strong'), 'line-width': 1.2, 'line-dasharray': [3, 2] } });
      map.addSource('net', { type: 'geojson', data: fc([]) });
      map.addLayer({ id: 'net', type: 'line', source: 'net', layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['case', ['get', 'sel'], c('--border-white'), ['get', 'dim'], c('--border-medium'), c('--text-secondary')], 'line-width': ['case', ['get', 'sel'], 4, 2.2] } });
      map.addLayer({ id: 'net-hit', type: 'line', source: 'net', paint: { 'line-color': c('--border-white'), 'line-opacity': 0, 'line-width': 18 } });
      map.addSource('nodes', { type: 'geojson', data: fc(ASSETS.filter(a => a.line).flatMap(a => a.line.slice(1).map(p => ({ type: 'Feature', geometry: { type: 'Point', coordinates: ll(p) } })))) });
      map.addLayer({ id: 'nodes', type: 'circle', source: 'nodes', paint: { 'circle-radius': 3, 'circle-color': c('--text-tertiary'), 'circle-pitch-alignment': 'map' } });
      map.addSource('dots', { type: 'geojson', data: fc([]) });
      map.addLayer({ id: 'dots-halo', type: 'circle', source: 'dots', filter: ['get', 'over'],
        paint: { 'circle-radius': ['+', ['get', 'r'], 7], 'circle-color': ['get', 'c'], 'circle-opacity': 0.5, 'circle-opacity-transition': { duration: 650 }, 'circle-blur': 0.4 } });
      map.addLayer({ id: 'dots', type: 'circle', source: 'dots',
        paint: { 'circle-radius': ['get', 'r'], 'circle-color': ['get', 'c'], 'circle-opacity': ['case', ['get', 'dim'], 0.35, 1],
          'circle-stroke-color': c('--border-white'), 'circle-stroke-width': ['case', ['get', 'sel'], 3.5, 1.5], 'circle-stroke-opacity': ['case', ['get', 'dim'], 0.35, 1] } });
      // labels (HTML, like the Figma white captions)
      if (labels) {
        const mk = (at, text, cls) => { const d = document.createElement('div'); d.className = `map-label ${cls || ''}`; d.textContent = text; new maplibregl.Marker({ element: d, anchor: 'bottom', offset: [0, -10] }).setLngLat(ll(at)).addTo(map); };
        PLACE_LABELS.forEach(p => mk(p.at, p.text, p.cls));
        mk(SS, CLUSTER.station); mk(NESTERS, 'Nesters substation', 'small');
      }
      st.current.ready = true; st.current.assetKey = st.current.gridKey = null;
      fit(); st.current.update?.();
    });
    if (interactive) {
      const tip = new maplibregl.Popup({ closeButton: false, closeOnClick: false, className: 'proto-tip', offset: 12 });
      const hit = e => map.queryRenderedFeatures(e.point, { layers: ['dots', 'net-hit'] })[0];
      map.on('mousemove', e => {
        if (!st.current.ready) return;
        const f = hit(e); map.getCanvas().style.cursor = f ? 'pointer' : 'crosshair';
        if (!f) return tip.remove();
        const r = st.current.rows?.find(x => x.a.id === f.properties.id); if (!r) return;
        tip.setLngLat(e.lngLat).setHTML(`<div class="t-label-m-medium">${r.a.label}</div><div class="t-body-s-regular">${r.band.label} · risk ${Math.round(r.risk)} / tolerance ${r.tol}${r.over ? ' · <b>over</b>' : ''}</div><div class="t-body-s-regular" style="color:var(--text-tertiary)">Click for details</div>`).addTo(map);
      });
      map.on('click', e => {
        if (!st.current.ready) return;
        tip.remove();
        const f = hit(e);
        if (f) { st.current.cellPopup?.remove(); return st.current.onSelect?.(f.properties.id); }
        st.current.onSelect?.(null);
        if (!st.current.grid) return;
        const { lat, lng } = e.lngLat;
        if (lat < AREA.s || lat > AREA.n || lng < AREA.w || lng > AREA.e) return;
        const cLat = AREA.s + (Math.floor((lat - AREA.s) / CELL_LAT) + 0.5) * CELL_LAT, cLng = AREA.w + (Math.floor((lng - AREA.w) / CELL_LNG) + 0.5) * CELL_LNG;
        const b = areaBreakdown(cLat, cLng, st.current.year, activeOf(st.current.lenses)), band = areaBandOf(Math.floor(b.total));
        const row = (name, color, v) => `<div class="tip-row"><i style="background:${color}"></i><span>${name}</span><b>${v}</b></div>`;
        st.current.cellPopup?.remove();
        st.current.cellPopup = new maplibregl.Popup({ closeButton: false, className: 'proto-tip', offset: 6 }).setLngLat([cLng, cLat]).setHTML(
          `<div class="t-label-m-medium">Area risk ${Math.floor(b.total)} · ${band.label}</div><div class="t-body-s-regular" style="color:var(--text-tertiary)">${st.current.year} · this 110 m square</div>` +
          row('Base condition', 'var(--border-grey)', Math.round(b.base)) + b.parts.map(p => row(LENS_INFO[p.id].label, LENS_INFO[p.id].color, `+${Math.round(p.delta)}`)).join('')).addTo(map);
      });
    }
    const pulse = setInterval(() => { if (!st.current.ready) return; st.current.ph = !st.current.ph; map.setPaintProperty('dots-halo', 'circle-opacity', st.current.ph ? 0.05 : 0.55); }, 700);
    if (apiRef) apiRef.current = { zoomIn: () => map.zoomIn({ duration: 250 }), zoomOut: () => map.zoomOut({ duration: 250 }), fit: () => map.fitBounds(bounds, { padding: padding(), ...VIEW, duration: 400 }),
      flyTo: id => { const a = assetById(id); const b = (a.line || [a.at, a.at]).reduce((x, p) => x.extend(ll(p)), new maplibregl.LngLatBounds(ll(a.line ? a.line[0] : a.at), ll(a.line ? a.line[0] : a.at))); map.fitBounds(b, { padding: padding(), maxZoom: 15.5, ...VIEW, duration: 500 }); },
      // where an asset is on screen (px from the map's top-left): used by box selection in Build › Input
      screenPos: id => { const a = assetById(id); const p = map.project(ll(a.line ? a.line[Math.floor(a.line.length / 2)] : a.at)); return { x: p.x, y: p.y }; } };
    const ro = new ResizeObserver(() => map.resize()); ro.observe(el.current);
    return () => { clearInterval(pulse); ro.disconnect(); map.remove(); };
  }, []);
  st.current.update = () => {
    const s = st.current; if (!s.ready) return;
    const act = activeOf(s.lenses), cl = cluster(s.year, act); s.rows = cl.rows;
    const aKey = s.year + JSON.stringify(act) + selected + JSON.stringify(focus || null);
    if (s.assetKey !== aKey) {
      s.assetKey = aKey;
      s.map.getSource('net').setData(fc(cl.rows.filter(r => r.a.line).map(r => ({ type: 'Feature', properties: { id: r.a.id, sel: selected === r.a.id, dim: !!(focus && !focus.includes(r.a.id)) }, geometry: { type: 'LineString', coordinates: r.a.line.map(ll) } }))));
      s.map.getSource('dots').setData(fc(cl.rows.map(r => { const dim = !!(focus && !focus.includes(r.a.id)); return { type: 'Feature',
        properties: { id: r.a.id, c: tokVar(r.band.color), r: r.a.type === 'bank' ? 7 : r.a.type === 'breaker' ? 6 : r.a.line ? 5 : 4.5, sel: selected === r.a.id, dim, over: r.over && !dim },
        geometry: { type: 'Point', coordinates: ll(r.a.line ? midpoint(r.a.line) : r.a.at) } }; })));
    }
    const gKey = s.grid ? s.year + JSON.stringify(act) : 'off';
    if (s.gridKey !== gKey) {
      s.gridKey = gKey; s.cellPopup?.remove();
      const bp = basePofsFor(s.year);
      s.map.getSource('grid').setData(fc(s.grid ? GRID_CELLS.map(g => ({ type: 'Feature', properties: { c: rampColor(areaRisk(g.c[0], g.c[1], s.year, act, bp)) }, geometry: g.g })) : []));
    }
  };
  useEffect(() => { st.current.update(); });
  return <div ref={el} style={{ position: 'absolute', inset: 0 }} />;
}
const MapLegend = ({ style, grid = true }) => (
  <NDS label="Map legend" className="box glass col" style={{ gap: 'var(--space-150)', width: 'var(--proto-legend-w)', ...style }}>
    {grid && <>
      <span className="t-label-m-medium muted">Area risk · all active lenses</span>
      <div style={{ height: 'var(--size-8)', borderRadius: 'var(--radius-radius-100)', background: `linear-gradient(90deg, ${AREA_BANDS.map(b => `var(${b.token})`).join(', ')})` }} />
      <div className="row t-body-s-regular muted" style={{ justifyContent: 'space-between' }}><span>Low</span><span>High</span></div>
      <span className="t-body-s-regular muted">Click a square to see what adds up</span>
    </>}
    <span className="t-label-m-medium muted" style={grid ? { marginTop: 'var(--space-100)' } : undefined}>Asset risk</span>
    <div className="row" style={{ gap: 'var(--space-250)', flexWrap: 'wrap' }}>{BANDS.map(b => <InfoHintItem key={b.id} label={b.label} color={b.color} />)}</div>
    <span className="t-body-s-regular muted">Glowing = over intervention tolerance</span>
  </NDS>
);
const MapTools = ({ api, assetsOpen, onAssets, libraryOpen, onLibrary, studyOpen, onStudy }) => <>
  <div style={{ position: 'absolute', left: 'var(--page-margin)', top: 'var(--space-300)', zIndex: 'var(--proto-z-map-ui)' }}>
    {/* Figma Explore rail (29:191921 / 29:101050): 1 = asset structure, 2 = studies library, 3 = study */}
    <MapToolbar><MapToolCluster label="Map views">
      <MapToolButton icon="asset-structure" label="Asset structure" active={!!assetsOpen} onClick={() => onAssets ? onAssets() : toast({ title: 'Asset structure isn’t part of this flow' })} />
      <MapToolButton icon="system-library" label="Studies library" active={!!libraryOpen} onClick={() => onLibrary ? onLibrary() : toast({ title: 'Studies library isn’t part of this flow' })} />
      <MapToolButton icon="system-book" label="Study" active={!!studyOpen} onClick={() => onStudy ? onStudy() : api.current?.fit()} />
    </MapToolCluster></MapToolbar>
  </div>
  <div style={{ position: 'absolute', left: 'var(--page-margin)', bottom: 'var(--space-300)', zIndex: 'var(--proto-z-map-ui)' }}>
    <MapToolbar onAction={id => id === 'zoom-in' ? api.current?.zoomIn() : id === 'zoom-out' ? api.current?.zoomOut() : toast({ title: `${id} isn’t part of this flow` })} />
  </div>
</>;
