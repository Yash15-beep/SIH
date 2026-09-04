#!/usr/bin/env bash
# Fresh Vision — starts the FastAPI backend and the React dev server together.
cd "$(dirname "$0")"

API_PORT="${API_PORT:-8010}"

# Kill any lingering processes on our ports before starting
lsof -ti :${API_PORT} | xargs kill -9 2>/dev/null || true
lsof -ti :5180 | xargs kill -9 2>/dev/null || true
sleep 1

if [ ! -d frontend/node_modules ]; then
  echo "Installing frontend dependencies..."
  (cd frontend && npm install)
fi

echo "Starting API on http://127.0.0.1:${API_PORT} ..."
venv/bin/python3 -m uvicorn backend.main:app --host 127.0.0.1 --port "${API_PORT}" &
API_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to start..."
for i in $(seq 1 60); do
  if curl -sf "http://127.0.0.1:${API_PORT}/api/health" > /dev/null 2>&1; then
    echo "Backend is ready!"
    break
  fi
  sleep 2
done

echo "Starting web UI on http://localhost:5180 ..."
echo ""
echo ">>> Open http://localhost:5180 in your browser <<<"
echo ""

trap 'kill ${API_PID} 2>/dev/null || true' EXIT
cd frontend && npm run dev
