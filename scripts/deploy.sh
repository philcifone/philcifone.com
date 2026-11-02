#!/usr/bin/env bash
# Build the site and copy it to resilvr, the same way the other sites go up.
#
#   npm run deploy               build, then upload
#   npm run deploy -- --dry-run  build, then list what would change (uploads nothing)
#
# Do a dry run first, the first time especially: rsync --delete removes
# anything in DEST that isn't in dist/, so DEST has to be the right folder.
set -euo pipefail

HOST=resilvr                       # ssh alias from ~/.ssh/config
DEST=/var/www/philcifone.com/      # matches `root` in deploy/nginx/philcifone.com.conf (checked on resilvr 2026-10-31)

cd "$(dirname "$0")/.."

# Astro 7 needs Node 24 (.nvmrc); the default nvm version is too old.
source "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
nvm use >/dev/null

npm run build

# Refuse to sync an empty or broken build, since --delete would mirror it.
[[ -f dist/index.html ]] || { echo "dist/index.html missing; not deploying." >&2; exit 1; }

# -c compares checksums rather than timestamps: every build rewrites every
# file, so timestamps would make rsync upload the whole site each time.
rsync -avzc --delete "$@" dist/ "$HOST:$DEST"

if [[ " $* " == *" --dry-run "* ]]; then
	echo "Dry run: nothing was uploaded."
else
	echo "Deployed to https://philcifone.com"
fi
