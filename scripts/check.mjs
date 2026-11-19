#!/usr/bin/env node
// Safety checks for the prototype. Run before every save/merge (scripts/sync.sh does) and on GitHub for every pull request.
//   node scripts/check.mjs
// 1) the mock data layer loads and is consistent (links resolve, numbers are sane, invented names applied)
// 2) the flow files are valid and listed in app/flows/index.js
// 3) app code uses design tokens only: no hex / rgba colours, no raw px, font numbers or z-index numbers, no retired DS tokens or type styles
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import crypto from 'node:crypto'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [], warn = [];
const err = m => errors.push(m);

// ---------- 1. data layer ----------
const ctx = { console, Math, JSON, Date, Object, Array, Number, String, Set, Map, RegExp, isNaN, parseInt, parseFloat,
  getComputedStyle: () => ({ getPropertyValue: () => '' }), document: { documentElement: {} } };
ctx.window = ctx; vm.createContext(ctx);
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const APP = JSON.parse(html.match(/<script id="app-files" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const shared = APP.js.filter(f => f.startsWith('shared/'));
APP.js.concat(APP.css, APP.babel).forEach(f => fs.existsSync(path.join(ROOT, f)) || err(`index.html lists ${f}, but the file doesn't exist`));
try { vm.runInContext(shared.map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n;\n') + `
  ;globalThis.__ = { ASSETS, WHISTLER_INVESTMENTS, WHISTLER_ALTERNATIVES, WHISTLER_USERS, PERSONAS, PEOPLE, COMMAND, INVENTED_PEOPLE, CLUSTER, TOLERANCE, cluster, NOW, END, activeOf, INITIAL_LENSES };`, ctx); }
catch (e) { err(`data layer failed to load: ${e.message}`); }
const D = ctx.__;
if (D) {
  const invIds = new Set(D.WHISTLER_INVESTMENTS.map(i => i.id));
  D.ASSETS.forEach(a => {
    if (!invIds.has(a.investmentId)) err(`asset ${a.label}: investment ${a.investmentId} does not exist`);
    if (!(a.at || a.line)) err(`asset ${a.label}: no map position`);
    if (!(a.type in D.TOLERANCE)) err(`asset ${a.label}: no tolerance for kind "${a.type}"`);
    if (a.lof.some(v => !(v >= 0 && v <= 1))) err(`asset ${a.label}: likelihood outside 0–1`);
  });
  D.CLUSTER.investments.forEach(id => invIds.has(id) || err(`cluster investment ${id} does not exist`));
  D.WHISTLER_ALTERNATIVES.forEach(a => invIds.has(a.investmentId) || err(`alternative ${a.name}: investment ${a.investmentId} does not exist`));
  for (let y = D.NOW; y <= D.END; y++) {
    const c = D.cluster(y, D.activeOf(D.INITIAL_LENSES));
    c.rows.forEach(r => { if (!(r.risk >= 0 && r.risk <= 100)) err(`risk out of range: ${r.a.label} ${y}`); });
  }
  // invented names only: every person shown must be an invented demo person
  const known = new Set(D.INVENTED_PEOPLE);
  const shown = [...D.WHISTLER_INVESTMENTS.flatMap(i => [i.owner, i.manager]), ...D.WHISTLER_USERS.map(u => u.displayName),
    ...Object.values(D.PEOPLE).map(p => p.name), ...Object.values(D.PERSONAS).map(p => p.name)].filter(Boolean);
  [...new Set(shown)].forEach(n => known.has(n) || err(`person "${n}" is not in INVENTED_PEOPLE (shared/names.js)`));
  // Command content: every person exists, no broken numbers
  for (const [k, c] of Object.entries(D.COMMAND)) {
    if (!D.PERSONAS[k]) err(`COMMAND.${k}: no persona`);
    [...c.decisions, ...c.convos].forEach(x => { const p = x.collaborator || x.person; if (p && !D.PEOPLE[p]) err(`COMMAND.${k}: unknown person "${p}"`); });
    const txt = JSON.stringify(c);
    if (/NaN|undefined|Infinity/.test(txt)) err(`COMMAND.${k}: contains NaN / undefined / Infinity`);
  }
}

// ---------- 2. flows ----------
const flowDir = path.join(ROOT, 'app/flows');
const flowFiles = fs.readdirSync(flowDir).filter(f => f.endsWith('.js') && f !== 'index.js').sort();
const manifest = fs.readFileSync(path.join(flowDir, 'index.js'), 'utf8');
const listed = JSON.parse((manifest.match(/FLOW_FILES = (\[.*?\]);/) || [, '[]'])[1]);
if (JSON.stringify(listed) !== JSON.stringify(flowFiles)) err('app/flows/index.js is out of date — run: python3 -I scripts/manifest.py');
const fctx = { window: {} }; fctx.window.FLOWS = []; vm.createContext(fctx);
flowFiles.forEach(f => { try { vm.runInContext(fs.readFileSync(path.join(flowDir, f), 'utf8'), fctx); } catch (e) { err(`flow file ${f}: ${e.message}`); } });
const ids = new Set();
fctx.window.FLOWS.forEach(fl => {
  if (!fl.id || ids.has(fl.id)) err(`flow "${fl.title}": missing or duplicate id "${fl.id}"`); ids.add(fl.id);
  if (!fl.title || !fl.summary) err(`flow ${fl.id}: needs a title and summary`);
  if (D && fl.persona && !D.PERSONAS[fl.persona]) err(`flow ${fl.id}: unknown persona "${fl.persona}"`);
  if (!fl.steps?.length) err(`flow ${fl.id}: no steps`);
  if (fl.steps?.[0] && !fl.steps[0].hash) err(`flow ${fl.id}: the first step needs a hash (where the tour starts)`);
  fl.steps?.forEach((s, i) => { if (!s.title) err(`flow ${fl.id} step ${i + 1}: needs a title`); if (s.hash && !s.hash.startsWith('#')) err(`flow ${fl.id} step ${i + 1}: hash must start with #`); });
});

// ---------- 2b. no real CLTDEMO person anywhere in the repo (names are matched by fingerprint, so none is stored) ----------
const REAL = new Set(['1c72e4e3267a4ca5', '19a636ea629a5a12', 'd36efafda7c3a59c', 'e319be5d2c314b2a', 'e2dce057e7568f5f', '22949abae0c6cc59',
  'e76721114f778526', '6f4fb9058eb9bd5a', 'c3750a6d016c3903']);       // keep in sync with PEOPLE_BY_HASH in scripts/make-whistler-data.py
const fp = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const SKIP = new Set(['.git', 'vendor', 'node_modules', 'share', 'prototypes']);
const files = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => SKIP.has(e.name) ? [] : e.isDirectory() ? files(path.join(d, e.name)) : [path.join(d, e.name)]);
files(ROOT).filter(f => /\.(js|jsx|mjs|py|md|html|css|json|yml|sh|txt)$/.test(f)).forEach(f => {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/\b[A-Z][a-zA-Z'-]+ [A-Z][a-zA-Z'-]+\b/g)) if (REAL.has(fp(m[0]))) { err(`${path.relative(ROOT, f)}: contains a real demo person's name — use the invented name`); break; }
});

// ---------- 3. tokens only ----------
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
walk(path.join(ROOT, 'app')).filter(f => /\.(jsx|css|js)$/.test(f)).forEach(f => {
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const code = line.replace(/\/\*.*?\*\/|\/\/.*$/g, '');
    if (/tokens-ok/.test(line)) return;                                          // explicit, reviewed exception
    if (/#[0-9a-fA-F]{3,8}\b(?![\w-])/.test(code.replace(/'#[a-z][\w-]*'|"#[a-z][\w-]*"|`#[^`]*`/gi, '')) || /\brgba?\(\s*\d/.test(code))
      err(`${path.relative(ROOT, f)}:${i + 1}: hard-coded colour — use a token (var(--…))`);
  });
});

// ---------- 3b. foundations only (DS 2.0.2: spacing, layout, typography) ----------
// Every padding, gap, size, offset, text style and layer comes from a token: DS 2.0.2 (--space-*, --size-*, --region-*, --text-*, --z-index-*)
// or a prototype token in the :root block of app/styles.css (built on the DS unit). Map/chart geometry drawn in WebGL or SVG is exempt.
const RETIRED_TOKEN = /--(paddings-padding|gaps-gap|margins-layout-margin|gutters-gutter|size-ruler-master|spacing-(card|table|panel|modal|popover|form))\b/;
const RETIRED_CLASS = /\bt-(label-m-upper|label-s-[a-z]+|label-l-upper|label-l-semibold|label-m-semibold|heading-h3-uppercase|heading-h4-upper|heading-h4-medium|body-m-medium|body-l-medium|caption-[a-z-]+|code-regular|code-medium)\b/;
const STYLE_NUM = /\b(gap|rowGap|columnGap|padding\w*|margin\w*|top|left|right|bottom|inset|width|height|minWidth|maxWidth|minHeight|maxHeight|flexBasis|borderRadius|fontSize|lineHeight|letterSpacing|zIndex)\s*:\s*-?[1-9]\d*(\.\d+)?\s*[,}]/;
walk(path.join(ROOT, 'app')).filter(f => /\.(jsx|css)$/.test(f)).forEach(f => {
  const css = f.endsWith('.css'), rel = path.relative(ROOT, f);
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/tokens-ok/.test(line)) return;
    const code = line.replace(/\/\*.*?\*\/|\/\/.*$/g, '');
    const at = `${rel}:${i + 1}`;
    if (RETIRED_TOKEN.test(code)) err(`${at}: retired DS token ${code.match(RETIRED_TOKEN)[0]} — use --space-* / --space-inset / --space-stack / --page-margin`);
    if (RETIRED_CLASS.test(code)) err(`${at}: retired type style ${code.match(RETIRED_CLASS)[0]} — see vendor/ds2/typography.md`);
    if (/text-transform\s*:\s*uppercase|textTransform\s*:\s*'uppercase'/.test(code)) err(`${at}: uppercase text — DS 2.0.1 has no uppercase style`);
    if (css) {
      if (/(^|[^\w-])\d+(\.\d+)?px\b/.test(code)) err(`${at}: raw px — use a token`);
      if (/(font-size|font-weight|line-height|letter-spacing)\s*:\s*\d/.test(code)) err(`${at}: raw font value — use a --text-* style`);
      if (/z-index\s*:\s*-?\d/.test(code)) err(`${at}: raw z-index — use --z-index-* or a --proto-z-* token`);
      // a space after the colon (".row: hover") makes the selector invalid, and the browser drops the whole rule
      if (/[\w)\]]: (hover|focus|focus-visible|focus-within|active|disabled|checked|first-child|last-child|not|nth-child|before|after)\b[^;]*\{/.test(code)) err(`${at}: broken pseudo-class (space after the colon) — the browser ignores this rule`);
    } else {
      for (const m of code.matchAll(/style=\{\{(.*?)\}\}/g)) {
        if (STYLE_NUM.test(m[1] + '}')) err(`${at}: raw number in an inline style — use a token ('var(--space-…)')`);
        if (/'[^']*\b\d+(\.\d+)?px\b[^']*'/.test(m[1])) err(`${at}: raw px in an inline style — use a token`);
      }
    }
  });
});

// ---------- 3c. one global scope: shared/*.js and app/*.jsx run as plain scripts, so a top-level name may be declared only once ----------
{
  const seen = new Map();
  APP.js.concat(APP.babel).filter(f => /^(shared|app)\//.test(f) && !/flows\//.test(f)).forEach(f => {
    fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n').forEach((line, i) => {
      // Babel turns object-rest destructuring into a top-level `_excluded` helper per file; two of them crash the app
      if (f.endsWith('.jsx') && f !== 'app/ui.jsx' && /(\b(const|let|var)\s*\{[^{}]*\.\.\.[A-Za-z_$][\w$]*\s*\}\s*=)|(\(\{[^{}()]*\.\.\.[A-Za-z_$][\w$]*\s*\}\)\s*=>)|(function\s*[\w$]*\s*\(\{[^{}()]*\.\.\.[A-Za-z_$][\w$]*\s*\}\))/.test(line.replace(/\/\/.*$/, ''))) err(`${f}:${i + 1}: object-rest destructuring ({ ...rest }) — copy and delete instead (Babel _excluded clash)`);
      const m = line.match(/^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/) || line.match(/^const \{([^}]*)\}\s*=/);
      if (!m) return;
      const names = m[0].startsWith('const {') ? m[1].split(',').map(x => x.split(':').pop().trim()).filter(Boolean) : [m[1]];
      names.forEach(n => { if (seen.has(n)) err(`${f}:${i + 1}: "${n}" is already declared in ${seen.get(n)} (all app files share one scope)`); else seen.set(n, `${f}:${i + 1}`); });
    });
  });
}

// ---------- report ----------
if (warn.length) console.log('Warnings:\n  ' + warn.join('\n  '));
if (errors.length) { console.log(`✗ ${errors.length} problem(s):\n  ` + errors.join('\n  ')); process.exit(1); }
console.log(`✓ checks passed — ${D ? D.ASSETS.length : 0} assets, ${D ? D.WHISTLER_INVESTMENTS.length : 0} investments, ${fctx.window.FLOWS.length} flows`);
