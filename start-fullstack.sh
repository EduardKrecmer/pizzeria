#!/bin/bash

# Skript pre spustenie celej aplikácie (server aj client)

# Ukončíme všetky procesy, ktoré môžu blokovať porty
echo "Ukončujem existujúce procesy na portoch..."
npx kill-port 5000 5001 5173 5174 2>/dev/null || true
sleep 1

# Spustíme server v pozadí
echo "Spúšťam server..."
NODE_ENV=development node server/index.ts &
SERVER_PID=$!

# Spustíme klientskú aplikáciu
echo "Spúšťam klientskú aplikáciu..."
cd client && npx vite --host 0.0.0.0 --port 5000 --strictPort

# Po ukončení klientskej aplikácie ukončíme aj server
kill $SERVER_PID