#!/bin/bash

# Spustíme port opener na pozadí 
node port-opener.cjs &
PORT_OPENER_PID=$!

# Počkáme, kým sa port otvorí
sleep 1

# Spustíme API server
echo "🍕 Spúšťam API server..."
node api-server.cjs &
API_PID=$!

# Spustíme Vite dev server
echo "🌐 Spúšťam Vite server..."
cd client && npx vite --port 5173 --host &
VITE_PID=$!

# Nastavenie cleanup pri ukončení
cleanup() {
  echo "👋 Ukončujem servery..."
  kill $PORT_OPENER_PID
  kill $API_PID
  kill $VITE_PID
  exit 0
}

# Zachytenie signálov pre graceful ukončenie
trap cleanup SIGINT SIGTERM

# Držíme skript bežiaci
echo "✅ Všetky servery bežia. Stlačte Ctrl+C pre ukončenie."
wait