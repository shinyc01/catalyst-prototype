#!/usr/bin/env python3
"""Generate shared/whistler-data.js from the copperleaf-demo-data skill (Whistler Group, CLTDEMO).

Only REAL demo records go in this file (with invented names for people, the company and made-up stations — the repo is public). Everything the demo data lacks is added by hand in
shared/whistler-additions.js and documented in context/data/whistler.md.

  python3 -I scripts/make-whistler-data.py [path/to/demo_data.py]

Re-run when the skill's dataset changes. Output is deterministic.
"""
import json, subprocess, sys, pathlib

S = sys.argv[1] if len(sys.argv) > 1 else str(pathlib.Path.home() / '.claude/skills/copperleaf-demo-data/scripts/demo_data.py')
ROOT = pathlib.Path(__file__).resolve().parent.parent
YEARS = [str(y) for y in range(2026, 2037)]


def run(*args):
    out = subprocess.run(['python3', '-I', S, *args, '--pretty'], capture_output=True, text=True, check=True).stdout
    return invent(json.loads(out))


# ---------- invented names, applied BEFORE anything is written (the repo is public) ----------
# People are matched by a fingerprint (first 16 hex of sha256 of the full name), so no real name is ever stored in this repo.
# To add a person: python3 -c "import hashlib;print(hashlib.sha256(b'First Last').hexdigest()[:16])" and map it to an invented name.
PEOPLE_BY_HASH = {
    '1c72e4e3267a4ca5': 'Hollis Grant', '19a636ea629a5a12': 'Mara Delgado', 'd36efafda7c3a59c': 'Owen Fitch',
    'e319be5d2c314b2a': 'Ravi Banerjee', 'e2dce057e7568f5f': 'Kenji Mori', '22949abae0c6cc59': 'Theo Marsh',
    'e76721114f778526': 'Priyanka Iyer', '6f4fb9058eb9bd5a': 'Luca Ferri', 'c3750a6d016c3903': 'Noah Lindgren',
}
# Made-up demo station / facility names → invented ones (fictional words, so listing them is fine)
PLACES = {
    'Whistler Group': 'Alder Ridge Energy', 'Whistler University': 'Coast Mountain University', 'Whistler International Airport': 'Coast Mountain Regional Airport',
    'Anubis': 'Kestrel', 'Athena': 'Larkspur', 'Bacchus': 'Fernhill', 'Eldoradoville': 'Cedar Flats', 'Franklin': 'Brightwater',
    'Middlebury': 'Riverbend', 'Mill Creek': 'Stony Creek', 'Palm Grove': 'Willow Bay', 'Demeter': 'Juniper', 'Pollard Park': 'Hawthorn Park',
    'Keaton Avenue': 'Marlow Avenue', 'Gibsonville': 'Ashby', 'Odin': 'Granite', 'Three Rivers': 'Twin Forks', 'Achilles': 'Summit',
    'Ventechi': 'Vantage', 'Wilcox': 'Halden', 'DELL': 'standard-issue',
}
import hashlib, re
_fp = lambda s: hashlib.sha256(s.encode()).hexdigest()[:16]
def _text(s):
    s = re.sub(r"\b[A-Z][a-zA-Z'-]+ [A-Z][a-zA-Z'-]+\b", lambda m: PEOPLE_BY_HASH.get(_fp(m.group(0)), m.group(0)), s)
    for a, b in PLACES.items(): s = re.sub(rf'\b{re.escape(a)}\b', b, s)
    return s
def invent(o):
    if isinstance(o, str): return _text(o)
    if isinstance(o, list): return [invent(x) for x in o]
    if isinstance(o, dict): return {k: invent(v) for k, v in o.items()}
    return o


# The Alpine Meadows cluster: real assets and the investments they belong to
CLUSTER_INVESTMENTS = [8380, 2891, 104860, 2892, 2893]
CLUSTER_ASSET_IDS = [3190, 3192, 3194, 253180,                       # Alpine Meadows Station 230 kV banks (2891, 104860)
                     76500, 76501, 76502, 76503, 76504, 76505, 76506, 76507, 76508, 76509, 76510, 76511,  # pad-mounts (8380)
                     3206, 3208, 3210, 3212, 3214,                    # Pine Ridge overhead line spans (2892)
                     3131, 3128]                                      # Nesters substation circuit breakers (2893)
TYPE = {'230kV Transformer': 'bank', 'EDGTRANS': 'padmount', 'OHL': 'line', 'CB Air Insulated Busbars ID GM 132kV': 'breaker'}

assets = {a['id']: a for a in run('assets')}
outlook = {o['id']: {r['measure']: r['baselineByYear'] for r in o['riskOutlook'] if r['baselineByYear']}
           for o in run('asset-outlook', '--ids', ','.join(map(str, CLUSTER_ASSET_IDS)))}

clamp = lambda v, lo, hi: max(lo, min(hi, v))
r2 = lambda v: round(v, 3)


def base_lof_cof(kind, m):
    """Whistler measures → the prototype's base likelihood (0–1, per year) and consequence (1–10).
    The mapping is the [Assumed] part; the inputs are real demo values. See context/data/whistler.md."""
    if kind == 'bank':      # condition 4 = good … 0 = end of life; consequence from transmission reliability risk
        lof = [clamp(1 - m['Condition'][y] / 4, 0.05, 0.95) for y in YEARS]
        cof = 4 + 6 * min(1, m['Asset Transmission Reliability Risk']['2026'] / 2400)
    elif kind == 'padmount':  # normalized age (age / design life) drives likelihood; reliability risk drives consequence
        lof = [clamp(0.2 + 1.6 * (m['Normalized Age'][y] - 1.2), 0.05, 0.95) for y in YEARS]
        cof = 1.5 + 1.4 * m['Reliability Risk']['2026']
    elif kind == 'breaker':   # health score (higher = worse) drives likelihood; criticality index drives consequence
        lof = [clamp(m['Health Score'][y] / 14, 0.05, 0.95) for y in YEARS]
        cof = 2.5 * m['Criticality Index']['2026']
    elif kind == 'line':      # transmission reliability risk rises with age; consequence is the station it feeds
        lof = [clamp(m['Electrical Transmission Reliability Risk'][y] / 60, 0.05, 0.95) for y in YEARS]
        cof = 6.0
    return [r2(v) for v in lof], round(min(10, cof), 2)


def pick(m, keys):
    return {k: [r2(m[k][y]) for y in YEARS] for k in keys if k in m}


KEEP = {'bank': ['Condition', 'Asset Transmission Reliability Risk', 'Environmental Risk', 'Financial Risk', 'Safety Risk'],
        'padmount': ['Asset Age', 'Normalized Age', 'Reliability Risk', 'Environmental Risk', 'Public Safety Risk', 'Financial Risk'],
        'breaker': ['Health Score', 'Criticality Index', 'Discounted Probability Of Failure', 'Risk Index'],
        'line': ['Electrical Transmission Reliability Risk', 'OPEX Savings']}

out_assets = []
for aid in CLUSTER_ASSET_IDS:
    a, m = assets[aid], outlook[aid]
    kind = TYPE[a['assetType']]
    lof, cof = base_lof_cof(kind, m)
    out_assets.append({'whistlerId': aid, 'code': a['code'], 'name': a['name'], 'assetType': a['assetType'], 'kind': kind,
                       'inServiceDate': a['inServiceDate'], 'investmentId': a['investmentIds'][0], 'parent': a['hierarchy'][-1],
                       'lof': lof, 'cof': cof, 'outlook': pick(m, KEEP[kind])})

inv_fields = 'id,code,name,type,stage,owner,manager,division,portfolio,totalSpend,totalValue,description,createdDate'
investments = run('investments', '--fields', inv_fields)
alternatives = run('alternatives', '--investment', ','.join(map(str, CLUSTER_INVESTMENTS)))
RISK_PROFILE = {r['alternativeId']: r for r in json.loads((pathlib.Path(S).resolve().parent.parent / 'data' / 'whistler-demo-data.json').read_text(encoding='utf-8'))['riskProfiles']}
detail = {d['id']: d for d in run('investment-detail', '--investment', ','.join(map(str, CLUSTER_INVESTMENTS)))}
for alt in alternatives:
    d = detail[alt['investmentId']]
    full = next(x for x in d['alternatives'] if x['id'] == alt['id'])
    alt['valueByMeasure'] = full.get('valueByMeasure', [])
    alt['milestones'] = [{'name': x['name'], 'forecastDate': x['forecastDate']} for x in full.get('milestones', [])]
    alt['spendByAccountByYear'] = full.get('spendByAccountByYear', {})          # CAPEX / OPEX per year: Build cost lines
    rp = RISK_PROFILE.get(alt['id'])                                            # baseline vs residual risk per year: risk reduced
    if rp:
        alt['riskBaselineByYear'] = {y: r2(v) for y, v in rp['baselineTotal'].items()}
        alt['riskResidualByYear'] = {y: r2(sum(m['decemberValueByYear'].get(y, 0) for m in rp['residualByMeasure'].values())) for y in rp['baselineTotal']}
users = [{'id': re.sub(r'[^a-z]', '', u['displayName'].lower()), 'displayName': u['displayName'], 'groups': u['groups']} for u in run('users')]

# Selected alternative's spend by year for EVERY curated investment (Command needs CPV = discounted spend, and V/C)
sel_spend = {}
for alt in run('alternatives'):
    if alt.get('isSelected'):
        sel_spend[alt['investmentId']] = {'name': alt['name'], 'spendByYear': alt['spendByYear'],
                                          'firstSpendDate': alt['firstSpendDate'], 'lastSpendDate': alt['lastSpendDate']}

# Portfolio-level scenario facts (Demo Portfolio, a separate set from the 45 curated investments)
SCENARIOS = [1684, 6864, 6924, 7244]
summ = {s['scenarioId']: s for s in run('scenario-summary', '--ids', ','.join(map(str, SCENARIOS)))}
scenarios = []
for sid in SCENARIOS:
    chart = {r['year']: r for r in run('scenario-chart', '--scenario', str(sid), '--measure', '37')}
    rows = run('scenario-investments', '--scenario', str(sid))
    sel = [r for r in rows if r['status'] != 'Deferred']
    dfr = [r for r in rows if r['status'] == 'Deferred']
    s = summ[sid]
    scenarios.append({'id': sid, 'name': s['name'], 'investmentCount': s['investmentCount'], 'capexTotal': s['capexTotal'], 'totalValue': round(s['totalValue']),
                      'capex2028': round(chart[2028]['value']), 'capexMax2028': round(chart[2028]['max']) if chart[2028]['max'] else None,
                      'selectedValue': round(sum(r['value'] for r in sel)), 'selectedCount': len(sel),
                      'deferredValue': round(sum(r['value'] for r in dfr)), 'deferredCount': len(dfr), 'deferredCapex': round(sum(r['capexTotal'] for r in dfr)),
                      'deferredVsRequested': s['deferredVsRequested'], 'advancedVsRequested': s['advancedVsRequested']})

js = ROOT / 'shared' / 'whistler-data.js'
body = [
    '/* GENERATED by scripts/make-whistler-data.py from the copperleaf-demo-data skill (CLTDEMO 26R1W). People, company and made-up station names are already replaced with invented ones.',
    '   REAL demo records only. Do not hand-edit: re-run the script. Hand-made additions live in whistler-additions.js.',
    '   WHISTLER_ASSETS[].lof / .cof are derived from the real outlook measures (mapping in the script and context/data/whistler.md). */',
    f'const WHISTLER_YEARS = {json.dumps([int(y) for y in YEARS])};',
    'const WHISTLER_ASSETS = [\n  ' + ',\n  '.join(json.dumps(a, ensure_ascii=False) for a in out_assets) + '\n];',
    'const WHISTLER_INVESTMENTS = [\n  ' + ',\n  '.join(json.dumps(i, ensure_ascii=False) for i in investments) + '\n];',
    'const WHISTLER_ALTERNATIVES = [\n  ' + ',\n  '.join(json.dumps(a, ensure_ascii=False) for a in alternatives) + '\n];',
    'const WHISTLER_USERS = ' + json.dumps(users, ensure_ascii=False) + ';',
    '// selected alternative per investment: spend by year (for CPV)',
    'const WHISTLER_SELECTED_SPEND = ' + json.dumps(sel_spend, ensure_ascii=False) + ';',
    '// Demo Portfolio scenarios (separate set from the curated investments): 2028 CAPEX vs max, value kept vs deferred',
    'const WHISTLER_SCENARIOS = [\n  ' + ',\n  '.join(json.dumps(s, ensure_ascii=False) for s in scenarios) + '\n];',
]
js.write_text('\n'.join(body) + '\n', encoding='utf-8')
print(f'wrote {js.relative_to(ROOT)}: {len(out_assets)} assets, {len(investments)} investments, {len(alternatives)} alternatives')

# ---------- Plan (Demo Portfolio optimisation set) → shared/whistler-plan.js ----------
# 296 real WG23 investments as requested (01_Requested 2028 Plan), the real optimiser constraint definitions, and each scenario's
# portfolio totals by year against its min/max constraints (2024–2033, where the constraints live).
PLAN_YEARS = [str(y) for y in range(2024, 2034)]
DATA_JSON = pathlib.Path(S).resolve().parent.parent / 'data' / 'demo-portfolio-scenarios.json'
dp = invent(json.loads(DATA_JSON.read_text(encoding='utf-8')))
base = {i['id']: i for i in dp['investments']}
req = {r['id']: r for r in run('scenario-investments', '--scenario', '1684')}
plan_inv = [{'id': i, 'code': b['code'], 'name': b['name'], 'stage': b['stage'], 'flexibility': b['flexibility'],
             'planningGroup': req[i]['planningGroup'], 'alternative': req[i]['alternative'], 'startDate': req[i]['startDate'],
             'capex': req[i]['capexTotal'], 'value': round(req[i]['value'], 2)} for i, b in base.items()]
plan_inv.sort(key=lambda r: r['code'])
plan_scen = []
for r in dp['scenarioResults']:
    plan_scen.append({'id': r['scenarioId'], 'name': r['scenarioName'], **{k: r['summary'][k] for k in ('capexTotal', 'deferredVsRequested', 'advancedVsRequested', 'alternativeChangedVsRequested')},
                      'totalValue': round(r['summary']['totalValue']),
                      'outcomes': [{'measureId': o['valueMeasureId'], 'measure': o['valueMeasure'],
                                    'byYear': [round(o['byYear'].get(y) or 0) for y in PLAN_YEARS],
                                    'min': [(o['constraintByYear'].get(y) or {}).get('min') for y in PLAN_YEARS],
                                    'max': [(o['constraintByYear'].get(y) or {}).get('max') for y in PLAN_YEARS]} for o in r['outcomesVsConstraints']]})
pjs = ROOT / 'shared' / 'whistler-plan.js'
pjs.write_text('\n'.join([
    '/* GENERATED by scripts/make-whistler-data.py — Plan data: the Demo Portfolio optimisation set (CLTDEMO 26R1W). REAL records only; do not hand-edit.',
    '   A separate set from the 45 curated investments in whistler-data.js (the source keeps them apart). Plan additions live in plan-additions.js. */',
    f'const PLAN_YEARS = {json.dumps([int(y) for y in PLAN_YEARS])};',
    f'const PLAN_PORTFOLIO = {json.dumps({"id": dp["portfolioId"], "name": dp["name"], "children": dp["children"]}, ensure_ascii=False)};',
    'const PLAN_INVESTMENTS = [\n  ' + ',\n  '.join(json.dumps(i, ensure_ascii=False) for i in plan_inv) + '\n];',
    'const PLAN_CONSTRAINT_DEFS = ' + json.dumps(dp['constraintDefinitions'], ensure_ascii=False) + ';',
    'const PLAN_SCENARIOS = [\n  ' + ',\n  '.join(json.dumps(s, ensure_ascii=False) for s in plan_scen) + '\n];',
]) + '\n', encoding='utf-8')
print(f'wrote {pjs.relative_to(ROOT)}: {len(plan_inv)} plan investments, {len(plan_scen)} scenarios')

# ---------- Global Search index extras → shared/whistler-search.js ----------
# Real records Global Search lists besides assets and investments: the portfolio tree, the named scenarios and the value measures.
portfolios = run('portfolios')
named_scen = [{k: s[k] for k in ('id', 'name', 'type', 'scopePortfolioId', 'startFiscalYear', 'description')} for s in run('scenarios')]
measures = run('value-measures')
sjs = ROOT / 'shared' / 'whistler-search.js'
sjs.write_text('\n'.join([
    '/* GENERATED by scripts/make-whistler-data.py — extra REAL records for Global Search (CLTDEMO 26R1W): portfolios, named scenarios,',
    '   value measures. Invented names applied. Do not hand-edit. Search rules and [Added] fields live in shared/search-model.js. */',
    'const SEARCH_PORTFOLIOS = [\n  ' + ',\n  '.join(json.dumps({k: p[k] for k in ('id', 'name', 'parentId', 'investmentCount', 'hasConstraints')}, ensure_ascii=False) for p in portfolios) + '\n];',
    'const SEARCH_SCENARIOS = [\n  ' + ',\n  '.join(json.dumps(s, ensure_ascii=False) for s in named_scen) + '\n];',
    'const SEARCH_MEASURES = [\n  ' + ',\n  '.join(json.dumps({k: m[k] for k in ('id', 'name', 'category')}, ensure_ascii=False) for m in measures) + '\n];',
]) + '\n', encoding='utf-8')
print(f'wrote {sjs.relative_to(ROOT)}: {len(portfolios)} portfolios, {len(named_scen)} scenarios, {len(measures)} value measures')
