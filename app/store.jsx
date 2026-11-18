/* Demo state that survives a reload (snoozed / archived cards, re-ranked lists, added events, reminders, created ideas).
   Stored in the browser only (localStorage), per person testing. "Reset demo" in the prototype controls clears it.
   Use usePersisted(key, initial) instead of useState for anything a tester changes that should stick. */
const STORE_KEY = 'catalyst-prototype:v1';
const Store = {
  state: (() => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } })(),
  get(k, d) { return k in this.state ? this.state[k] : d; },
  set(k, v) { this.state[k] = v; try { localStorage.setItem(STORE_KEY, JSON.stringify(this.state)); } catch (e) { /* private mode: keep in memory */ } },
  reset() { this.state = {}; try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ } },
};
function usePersisted(key, initial) {
  const [v, setV] = useState(() => Store.get(key, typeof initial === 'function' ? initial() : initial));
  const set = x => setV(prev => { const n = typeof x === 'function' ? x(prev) : x; Store.set(key, n); return n; });
  return [v, set];
}
