#!/bin/sh
set -e

# Ensure data dir exists
mkdir -p /data

# Link DB file inside the app folder to the persistent volume under /data
if [ ! -e /app/meals.db ]; then
  ln -s /data/meals.db /app/meals.db 2>/dev/null || true
fi

# Initialize DB on the first run
if [ ! -f /data/meals.db ]; then
  echo "[entrypoint] Initializing SQLite DB at /data/meals.db (first run)"
  if [ -f /app/initdb.js ]; then
    node /app/initdb.js || echo "[entrypoint] Warning: initdb.js failed; continuing"
  else
    echo "[entrypoint] Warning: /app/initdb.js not found; skipping initialization"
  fi
fi

exec "$@"
