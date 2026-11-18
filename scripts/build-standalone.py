#!/usr/bin/env python3
"""Build one self-contained HTML file of the whole app, for sharing offline or attaching to an email.
   python3 -I scripts/build-standalone.py [out.html]      (default: share/catalyst-prototype.html)
Everything local (DS 2.0, data layer, flows, app code) is inlined, in the order index.html lists it (#app-files).
React, Babel, MapLibre and the map tiles still load from the internet. The live site doesn't need this file."""
import json, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'share' / 'catalyst-prototype.html'
html = (ROOT / 'index.html').read_text(encoding='utf-8')
files = json.loads(re.search(r'<script id="app-files" type="application/json">(.*?)</script>', html, re.S).group(1))
read = lambda p: (ROOT / p).read_text(encoding='utf-8').replace('</script', '<\\/script')
flows = sorted(p.name for p in (ROOT / 'app/flows').glob('*.js') if p.name != 'index.js')
def js(p):
    if p == 'app/flows/index.js':
        return '<script>window.FLOWS = window.FLOWS || [];\n' + '\n'.join(read('app/flows/' + f) for f in flows) + '\n</script>'
    return '<script>\n/* ' + p + ' */\n' + read(p) + '\n</script>'
head = ''.join('<style>\n/* ' + p + ' */\n' + read(p) + '\n</style>\n' for p in files['css']) + '\n'.join(js(p) for p in files['js'])
body = '\n'.join('<script type="text/babel" data-presets="react">\n/* ' + p + ' */\n' + read(p) + '\n</script>' for p in files['babel'])
html = re.sub(r'<script id="app-files".*?</script>\s*<script>.*?</script>', lambda m: head, html, count=1, flags=re.S)
html = re.sub(r'<script>\s*// Catalyst Design System 2\.0.*?</script>', lambda m: body, html, count=1, flags=re.S)
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html, encoding='utf-8')
print(f'built {out.relative_to(ROOT) if out.is_relative_to(ROOT) else out} ({out.stat().st_size // 1024} KB)')
