#!/usr/bin/env bash
# Install the release in ~/labs/site.tgz into ~/labs/dist, keeping the hashed
# bundles of the releases before it.
#
# Run on the server by .github/workflows/deploy.yml (`ssh … 'bash -s' < this`).
# Simulated locally, never against the server, by tools/simulate-deploy.mjs.
#
# ## Why old bundles stay
#
# A visitor who loaded a page before a deploy still runs that release's
# JavaScript, and it asks for its lazy chunks — a lab, a language, the finder —
# by their hashed names, minutes or days later. Deleting every file the new
# release does not have (what `rsync --delete-after` did) answered those with
# 404s, and only the error screen's "reload" got the visitor out. So files
# under assets/ stay for as long as a release that shipped them is kept:
#
#   - the newest KEEP_RELEASES releases (2: this one and the one before), and
#   - every release installed in the last KEEP_DAYS days (7),
#
# and are deleted once no kept release has them. Everything outside assets/ —
# pages, the sitemap, icons — is exactly the new release's: a page that is
# gone should 404, and nothing hashed lives there.
#
# ## Why dist/ is written into, never replaced
#
# The web server's container mounts dist/, and a mount holds the directory it
# was given, not its name (docs/DEPLOY.md: this took the site down on
# 2026-10-12). The new bundles are copied in first, then the pages, and stale
# files are removed only after everything new has arrived, so a page never
# points at a bundle that is not there yet. `set -e` stops at the first failure with the old version live.
#
# ## rsync or cp
#
# Both only add and overwrite; the deletion is the same step below for either,
# so the two produce the same dist/. DEPLOY_COPY=rsync|cp forces one (the
# simulation runs both).
#
# Each release's file list is kept in releases/<seconds since epoch>.list.
set -euo pipefail

LABS_DIR=${LABS_DIR:-$HOME/labs}
KEEP_RELEASES=${KEEP_RELEASES:-2}
KEEP_DAYS=${KEEP_DAYS:-7}
NOW=${NOW:-$(date +%s)}
DEPLOY_COPY=${DEPLOY_COPY:-auto}
export LC_ALL=C

cd "$LABS_DIR"
[ -f site.tgz ] || { echo "install-release: no site.tgz in $LABS_DIR" >&2; exit 1; }

# Every regular file under a directory, relative to it, sorted.
list_files() { (cd "$1" && find . -type f | sed 's|^\./||' | sort); }

rm -rf dist-next
mkdir dist-next
tar -xzf site.tgz -C dist-next
[ -f dist-next/index.html ] || { echo "install-release: the release has no index.html" >&2; exit 1; }
mkdir -p dist releases

# The first release installed this way has no list for the one before it,
# which is live right now: record what is in dist/ as that release, so its
# bundles get the same grace as any other.
if ! ls releases/*.list >/dev/null 2>&1 && [ -n "$(ls -A dist)" ]; then
  list_files dist > "releases/$((NOW - 1)).list"
fi

id=$NOW
while [ -e "releases/$id.list" ]; do id=$((id + 1)); done
list_files dist-next > "releases/$id.list.partial"

if [ "$DEPLOY_COPY" = auto ]; then
  if command -v rsync >/dev/null 2>&1; then DEPLOY_COPY=rsync; else DEPLOY_COPY=cp; fi
fi
# Bundles first, then pages: a new page is never served before every bundle
# it names is in place. Neither tool promises an order within one pass.
copy() {
  case "$DEPLOY_COPY" in
    rsync) rsync -a "$1/" "$2/" ;;
    cp) cp -a "$1/." "$2/" ;;
    *) echo "install-release: DEPLOY_COPY must be rsync, cp or auto" >&2; exit 1 ;;
  esac
}
if [ -d dist-next/assets ]; then
  mkdir -p dist/assets
  copy dist-next/assets dist/assets
fi
copy dist-next dist
# Recorded only once every file of it is in place.
mv "releases/$id.list.partial" "releases/$id.list"

# The releases whose bundles are kept: the newest KEEP_RELEASES, and any
# installed within KEEP_DAYS. The rest are forgotten.
cutoff=$((NOW - KEEP_DAYS * 86400))
kept=()
rank=0
for list in $(ls releases/*.list | sed 's|^releases/||; s|\.list$||' | sort -rn); do
  rank=$((rank + 1))
  if [ "$rank" -le "$KEEP_RELEASES" ] || [ "$list" -ge "$cutoff" ]; then
    kept+=("releases/$list.list")
  else
    rm -f "releases/$list.list"
  fi
done

# What dist/ may hold: all of this release, and the bundles of the kept ones.
keep=$(mktemp)
have=$(mktemp)
trap 'rm -f "$keep" "$have"' EXIT
{
  cat "releases/$id.list"
  grep -h '^assets/' "${kept[@]}" || true
} | sort -u > "$keep"
list_files dist > "$have"
comm -23 "$have" "$keep" | while IFS= read -r file; do rm -f -- "dist/$file"; done
find dist -mindepth 1 -type d -empty -delete

rm -rf dist-next site.tgz
echo "install-release: release $id installed; bundles kept from ${#kept[@]} release(s)"
