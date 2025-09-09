#!/bin/sh
set -e

cd /app


# Install deps if missing (works with bind mount)
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
fi

if [ "$NODE_ENV" = "production" ] || [ "$NODE_ENV" = "prod" ]; then
  echo "🏗️ Building Next for production..."
  if [ ! -d ".next" ] || [ "${FORCE_BUILD:-0}" = "1" ]; then
    npm run build
  else
    echo "✅ Using existing .next build."
  fi
  echo "🚀 Starting Next (prod)..."
  exec npm run start
else
  echo "🛠️ Starting Next (dev, hot reload)..."
  exec npm run dev
fi
