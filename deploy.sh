#!/bin/bash
# Publish dist/ to GitHub Pages: https://sindrimar02.github.io/dyrahjalp-preview/ (noindex). Unsold prototype = GitHub Pages, never Cloudflare.
# Pattern: 03-prototypes/snaeland/deploy.sh. Vite build with --base, stage into an isolated tree, gate it, push to gh-pages, rebuild the local copy.
set -e
REPO="$(cd "$(dirname "$0")" && pwd)"
NAME=dyrahjalp-preview
BASE="/$NAME/"
ORIGIN="https://sindrimar02.github.io/$NAME"
cd "$REPO"
npx vite build --base "$BASE" >/dev/null
STAGE="$(mktemp -d)/$NAME"; mkdir -p "$STAGE"
cp -R dist/. "$STAGE/"; touch "$STAGE/.nojekyll"
cd "$STAGE"
leak=$(find . -path ./.git -prune -o \( -name '_*' -o -name '*.mjs' -o -name '*.py' -o -name '*.map' -o -name '*.md' -o -name '.DS_Store' \) -print)
[ -z "$leak" ] || { echo "BLOCKED: internal files staged:"; echo "$leak"; exit 1; }
grep -q 'noindex' index.html || { echo "BLOCKED: index.html missing noindex"; exit 1; }
grep -q 'sndrstudio.is' index.html || { echo "BLOCKED: index.html missing SNDR credit"; exit 1; }
grep -q 'Disallow: /' robots.txt || { echo "BLOCKED: robots.txt"; exit 1; }
bad=$(grep -rIl -e 'klubbr' -e 'kvar\.is' -e 'localhost' -e '127\.0\.0\.1' --include='*.html' --include='*.css' --include='*.js' . || true); [ -z "$bad" ] || { echo "BLOCKED: forbidden address in: $bad"; exit 1; }
abs=$(grep -rIlE "(href|src)=\"/[a-z]" --include='*.html' . | xargs -I{} sh -c "grep -E '(href|src)=\"/[a-z]' '{}' | grep -vE '(href|src)=\"$BASE' >/dev/null && echo {}" || true); [ -z "$abs" ] || { echo "BLOCKED: root-absolute paths outside base: $abs"; exit 1; }
grep -q '"/media' assets/*.js && { echo "BLOCKED: root-absolute media path in JS"; exit 1; }
node "$REPO/tools/runtime-gate.mjs" "$STAGE" "$BASE"
echo "staged: $(find . -type f -not -path './.git/*' | wc -l | tr -d ' ') files"
git init -q -b gh-pages; git remote add origin "https://github.com/SindriMar02/$NAME.git"
if git fetch -q origin gh-pages 2>/dev/null; then git reset -q --soft FETCH_HEAD; fi
git add -A
git -c user.email="SindriMar02@users.noreply.github.com" -c user.name="Sindri Már" commit -q -m "Deploy Dýrahjálp prototype (noindex preview)"
git push -q origin HEAD:gh-pages
echo "published to $ORIGIN/"
cd "$REPO" && npm run build >/dev/null   # restore the root-relative local build
