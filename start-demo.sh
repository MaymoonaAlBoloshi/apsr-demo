#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
if [[ ! -d node_modules ]]; then
  npm ci
fi
if [[ ! -f dist/index.html ]]; then
  npm run build
fi
exec npm start
