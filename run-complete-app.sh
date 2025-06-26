#!/bin/bash

# Tento skript spúšťa kompletnú Pizzeria aplikáciu:
# 1. Port opener na porte 5000
# 2. Vite s jednoduchšou konfiguráciou na porte 5173

# Ukončí všetky bežiace Python procesy pre port opener
pkill -f "python3 port_opener.py" || true

# Spustí port opener v pozadí
echo "🍕 Spúšťam Pizzeria aplikáciu..."
echo "📝 Otvára sa port 5000 pre Replit..."
python3 port_opener.py &
PORT_OPENER_PID=$!

# Počkáme na inicializáciu port openera
sleep 1
echo "✅ Port 5000 je otvorený"

# Spustíme Vite s jednoduchšou konfiguráciou
echo "🚀 Spúšťam Vite na porte 5173..."
echo "⌛ Prosím, počkajte kým sa aplikácia načíta..."
./run-with-simple-vite.sh

# Keď sa Vite ukončí, ukončíme aj port opener
kill $PORT_OPENER_PID || true