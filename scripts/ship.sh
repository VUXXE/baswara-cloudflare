#!/usr/bin/env bash
# One-command full deploy: routes -> D1/R2 -> migrations -> secrets -> build -> deploy
# Usage: npm run ship
set -euo pipefail
cd "$(dirname "$0")/.."

DB_NAME="baswara-db"
BUCKET_NAME="baswara-assets"

echo "==> 1/6 Generating routes"
npm run generate-routes

echo "==> 2/6 Ensuring D1 database ($DB_NAME)"
DB_ID=$(node -p "JSON.parse(require('fs').readFileSync('wrangler.jsonc','utf8')).d1_databases[0].database_id")
if [ "$DB_ID" = "placeholder" ] || [ -z "$DB_ID" ]; then
  CREATE_OUT=$(wrangler d1 create "$DB_NAME" 2>&1 || true)
  DB_ID=$(echo "$CREATE_OUT" | grep -o '"database_id": "[a-f0-9-]*"' | grep -o '[a-f0-9-]\{36\}' | head -1 || true)
  if [ -z "$DB_ID" ]; then
    echo "    D1 already exists, looking it up..."
    DB_ID=$(wrangler d1 list --json | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).find(d=>d.name==='$DB_NAME')?.uuid ?? ''")
  fi
  if [ -z "$DB_ID" ]; then
    echo "    ERROR: could not create or find D1 database '$DB_NAME'" >&2
    exit 1
  fi
  node -e "
    const fs = require('fs');
    const cfg = JSON.parse(fs.readFileSync('wrangler.jsonc','utf8'));
    cfg.d1_databases[0].database_id = '$DB_ID';
    fs.writeFileSync('wrangler.jsonc', JSON.stringify(cfg, null, 2) + '\n');
  "
  echo "    D1 bound: $DB_ID"
else
  echo "    D1 already bound: $DB_ID"
fi

echo "==> 3/6 Ensuring R2 bucket ($BUCKET_NAME)"
if wrangler r2 bucket list 2>/dev/null | grep -q "$BUCKET_NAME"; then
  echo "    R2 bucket already exists"
else
  wrangler r2 bucket create "$BUCKET_NAME"
fi

echo "==> 4/6 Applying D1 migrations (remote)"
wrangler d1 migrations apply "$DB_NAME" --remote

echo "==> 5/6 Ensuring secrets"
SECRETS=$(wrangler secret list 2>/dev/null || true)
if echo "$SECRETS" | grep -q "BETTER_AUTH_SECRET"; then
  echo "    BETTER_AUTH_SECRET already set"
else
  echo "    Generating BETTER_AUTH_SECRET..."
  openssl rand -base64 32 | wrangler secret put BETTER_AUTH_SECRET
fi
if echo "$SECRETS" | grep -q "BETTER_AUTH_URL"; then
  echo "    BETTER_AUTH_URL already set"
else
  echo "    NOTE: BETTER_AUTH_URL not set — Better Auth will infer origin from requests."
  echo "    Set it after first deploy: wrangler secret put BETTER_AUTH_URL  (value: https://<worker>.workers.dev)"
fi
if echo "$SECRETS" | grep -q "R2_PUBLIC_URL"; then
  echo "    R2_PUBLIC_URL already set"
else
  echo "    NOTE: R2_PUBLIC_URL not set — uploads will use placeholder domain until you"
  echo "    attach a public domain to the bucket and run: wrangler secret put R2_PUBLIC_URL"
fi

echo "==> 6/6 Building & deploying"
npm run build
wrangler deploy

echo ""
echo "Done. If this was the first deploy, finish with:"
echo "  wrangler secret put BETTER_AUTH_URL   # https://<worker>.workers.dev"
echo "  wrangler secret put R2_PUBLIC_URL     # public bucket domain"
echo "  npm run deploy                        # redeploy to pick up secrets"
