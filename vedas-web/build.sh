#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
npm ci
npm run build
echo "Built to dist/vedas-web/browser"
