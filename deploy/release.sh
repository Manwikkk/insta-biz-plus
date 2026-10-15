#!/usr/bin/env bash
# Runs on the server, fed over SSH by .github/workflows/deploy.yml:
#   bash -s -- <app dir> <release id> <pm2 name> <port>  (the release tarball waits in /tmp)
# Unpacks the release next to the others, points <app dir>/current at it, reloads PM2, and checks
# the site answers; if it does not, the previous release is put back. Keeps the five newest.
set -euo pipefail
DIR=$1 ID=$2 NAME=${3:-instabizweb} PORT=${4:-3000}
REL="$DIR/releases/$ID"
TGZ="/tmp/instabizweb-$ID.tgz"

# node and pm2 from nvm, for a non-interactive shell
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
command -v pm2 >/dev/null || { echo "pm2 is not installed on the server (npm i -g pm2)" >&2; exit 1; }

mkdir -p "$DIR/releases" "$DIR/shared"
rm -rf "$REL" && mkdir -p "$REL"
tar -xzf "$TGZ" -C "$REL"
rm -f "$TGZ"

switch() { ln -sfn "$1" "$DIR/current.next" && mv -Tf "$DIR/current.next" "$DIR/current"; }
PREV=$(readlink "$DIR/current" || true)
switch "$REL"
export APP_DIR="$DIR" APP_NAME="$NAME" APP_PORT="$PORT"
pm2 startOrReload "$REL/ecosystem.config.cjs" --update-env

ok=
for _ in $(seq 1 40); do
  if curl -fsS -o /dev/null --max-time 5 "http://127.0.0.1:$PORT/"; then ok=1 && break; fi
  sleep 1
done
if [ -z "$ok" ]; then
  echo "release $ID did not answer on port $PORT; putting back ${PREV:-nothing}" >&2
  if [ -n "$PREV" ]; then
    switch "$PREV"
    pm2 startOrReload "$PREV/ecosystem.config.cjs" --update-env
  fi
  exit 1
fi

pm2 save >/dev/null
ls -1dt "$DIR"/releases/*/ | tail -n +6 | xargs -r rm -rf
echo "live: $ID"
