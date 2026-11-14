#!/usr/bin/env bash
set -euo pipefail
if [ -z "${PLAN_STUDIO_HOST:-}" ]; then
  echo "deploy.sh: set PLAN_STUDIO_HOST to the Home Assistant host (ssh as root), e.g. PLAN_STUDIO_HOST=<HA_HOST> bash scripts/deploy.sh" >&2
  exit 1
fi
HOST="$PLAN_STUDIO_HOST"
npm run build
tar -C custom_components --exclude='__pycache__' -cf - plan_studio | \
  ssh "root@$HOST" 'rm -rf /config/custom_components/plan_studio && tar -C /config/custom_components -xf - && ha core restart'
