#!/bin/bash
# Tento skript spúšťa Vite priamo s potrebnými parametrami pre Replit

# Vyčistenie procesov a portov
echo "🧹 Čistenie procesov a portov..."
pkill -f node || true
pkill -f python || true
npx kill-port 5000 || true
npx kill-port 5173 || true

# Prejdenie do adresára client
cd client

# Spustenie Vite s parametrami --host a --port
echo "🚀 Spúšťam Vite s parametrami --host 0.0.0.0 --port 5000..."
exec npx vite --host 0.0.0.0 --port 5000