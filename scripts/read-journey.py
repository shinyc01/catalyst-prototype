#!/usr/bin/env python3
"""Read a JTBD journey document (Word .docx, e.g. "J16 - Portfolio Owner - ….docx") into plain text.

  python3 -I scripts/read-journey.py "<path to .docx>" [--out context/flows/<id>.source.txt]

Prints every link in the document first (the Figma frames live there as hyperlinks), then the text, with table rows
joined by " | " so the "Journey steps" table stays readable. Used by the catalyst-flow-builder skill
(references/journeys.md). Standard library only; the document is read, never changed.
"""
import html, re, sys, zipfile

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'


def text_of(el):
    return ''.join(t.text or '' for t in el.iter(W + 't'))


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    import xml.etree.ElementTree as ET
    with zipfile.ZipFile(sys.argv[1]) as z:
        doc = ET.fromstring(z.read('word/document.xml'))
        rels = z.read('word/_rels/document.xml.rels').decode('utf-8')
    links = [html.unescape(m) for m in re.findall(r'Target="([^"]+)"[^>]*TargetMode="External"', rels)]
    out = ['LINKS'] + [f'  {l}' for l in dict.fromkeys(links)] + ['', 'TEXT']
    body = doc.find(W + 'body')
    for el in body:
        if el.tag == W + 'p':
            t = text_of(el).strip()
            if t:
                out.append(t)
        elif el.tag == W + 'tbl':
            for row in el.iter(W + 'tr'):
                cells = [' '.join(text_of(p).strip() for p in c.iter(W + 'p') if text_of(p).strip()) for c in row.iter(W + 'tc')]
                out.append(' | '.join(cells))
            out.append('')
    text = '\n'.join(out) + '\n'
    if '--out' in sys.argv:
        open(sys.argv[sys.argv.index('--out') + 1], 'w', encoding='utf-8').write(text)
    print(text)


if __name__ == '__main__':
    main()
