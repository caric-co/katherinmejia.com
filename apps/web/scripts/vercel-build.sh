#!/bin/bash
set -e

# Build the app
pnpm build

# Create Vercel Build Output API v3 structure
rm -rf .vercel/output
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions/ssr.func

# Copy static assets
cp -r dist/client/* .vercel/output/static/

# Create the serverless function from the SSR bundle
cp -r dist/server/* .vercel/output/functions/ssr.func/

# Create the function entry point that wraps the fetch handler
cat > .vercel/output/functions/ssr.func/index.js << 'ENTRY'
import server from "./server.js"

export default async function handler(req) {
  return server.fetch(req)
}
ENTRY

# Function config
cat > .vercel/output/functions/ssr.func/.vc-config.json << 'CONFIG'
{
  "runtime": "nodejs22.x",
  "handler": "index.js",
  "launcherType": "Nodejs",
  "shouldAddHelpers": false,
  "supportsResponseStreaming": true
}
CONFIG

# Create package.json for ESM
cat > .vercel/output/functions/ssr.func/package.json << 'PKG'
{ "type": "module" }
PKG

# Route config: static assets first, then SSR for everything else
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
