#!/bin/bash
set -e

echo "[ENTRYPOINT] Dev mode: watching for file changes..."

# Ensure go.sum exists, or fetch deps
if [ ! -f go.sum ]; then
  echo "[ENTRYPOINT] go.sum not found. Running 'go mod tidy'..."
  go mod tidy
fi

# Run Air for live-reload
exec air
