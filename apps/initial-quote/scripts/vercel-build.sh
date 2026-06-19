#!/bin/bash
set -e

pnpm build

rm -rf .vercel/output
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions/ssr.func

cp -r dist/client/* .vercel/output/static/
cp -r dist/server/* .vercel/output/functions/ssr.func/

cat > .vercel/output/functions/ssr.func/index.js << 'ENTRY'
import server from "./server.js"

export default async function handler(req) {
  return server.fetch(req)
}
ENTRY

cat > .vercel/output/functions/ssr.func/.vc-config.json << 'CONFIG'
{
  "runtime": "nodejs22.x",
  "handler": "index.js",
  "launcherType": "Nodejs",
  "shouldAddHelpers": false,
  "supportsResponseStreaming": true
}
CONFIG

cat > .vercel/output/functions/ssr.func/package.json << 'PKG'
{ "type": "module" }
PKG

cat > .vercel/output/config.json << 'ROUTES'
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/ssr" }
  ]
}
ROUTES

echo "Build output created at .vercel/output"
