#!/bin/bash
# Pin a copy of Catalyst Design System 2.0 (shinyc01/catalyst-design-system-2, published on GitHub Pages)
# into vendor/ds2/. The app loads this copy, so a change in the design system never breaks the prototype
# without us noticing. Run it on purpose to take a newer version, then check the screens and commit.
#   bash scripts/update-ds.sh
set -euo pipefail
cd "$(dirname "$0")/.."
BASE="https://shinyc01.github.io/catalyst-design-system-2"
OUT="vendor/ds2"
mkdir -p "$OUT"
for f in dist/ifs-ds.js dist/ifs-ds.css dist/api.md dist/examples.md dist/icons.txt dist/tokens.txt guide/rules.md guide/components.md guide/usage.md; do
  curl -fsSL "$BASE/$f" -o "$OUT/$(basename "$f")"
done
SHA=$(gh api repos/shinyc01/catalyst-design-system-2/commits/HEAD --jq .sha 2>/dev/null || echo unknown)
printf 'Catalyst Design System 2.0 snapshot\nsource: %s\nrepo commit: %s\ntaken: %s\n' "$BASE" "$SHA" "$(date -u +%Y-%m-%dT%H:%MZ)" > "$OUT/VERSION.txt"
cat "$OUT/VERSION.txt"
