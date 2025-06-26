#!/bin/bash
# Štartovací skript pre Replit prostredie
echo "🚀 Spúšťam Pizza aplikáciu v Replit prostredí..."

# Vymažeme všetky procesy blokujúce porty
echo "🧹 Čistenie procesov a portov..."
pkill -f node || true
pkill -f python || true
npx kill-port 5000 || true
npx kill-port 5173 || true
npx kill-port 3000 || true

# Kontrola, či treba vytvoriť build
if [ ! -d "client/dist" ]; then
  echo "📦 Vytváranie produkčného buildu pre front-end..."
  cd client && npm run build && cd ..
  echo "✅ Build úspešne vytvorený"
fi

# Spustenie aplikácie v vývojovom režime
echo "🌐 Spúšťam vývojový server s parametrami pre Replit..."
cd client && npx vite --host 0.0.0.0 --port 5000