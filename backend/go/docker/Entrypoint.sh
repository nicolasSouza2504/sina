#!/bin/bash
set -euo pipefail

echo "[ENTRYPOINT] starting..."

# Load .env if present (useful in dev with bind mount)
if [ -f .env ]; then
  echo "[ENTRYPOINT] loading .env"
  set -a
  . ./.env
  set +a
fi

# Ensure deps (dev convenience)
if [ ! -f go.sum ]; then
  echo "[ENTRYPOINT] go.sum not found -> running 'go mod tidy'"
  go mod tidy
fi

: "${DATABASE_URL:?DATABASE_URL not set}"

MIGRATIONS_DIR="${MIGRATIONS_DIR:-./migrations}"
SKIP_MIGRATIONS="${SKIP_MIGRATIONS:-0}"

if [ "${SKIP_MIGRATIONS}" != "1" ]; then
  echo "[ENTRYPOINT] waiting for database to be ready..."
  # use goose itself to probe connectivity
  until goose -dir "${MIGRATIONS_DIR}" postgres "${DATABASE_URL}" status >/dev/null 2>&1; do
    echo "[ENTRYPOINT]   ...still waiting"
    sleep 2
  done

  if [ -d "${MIGRATIONS_DIR}" ]; then
    echo "[ENTRYPOINT] running migrations (goose up)"
    goose -dir "${MIGRATIONS_DIR}" postgres "${DATABASE_URL}" up
  else
    echo "[ENTRYPOINT] migrations dir '${MIGRATIONS_DIR}' not found, skipping"
  fi
else
  echo "[ENTRYPOINT] SKIP_MIGRATIONS=1 -> skipping migrations"
fi

# Start dev server with Air (hot reload)
echo "[ENTRYPOINT] starting air"
exec air
