#!/bin/bash

# Tento skript spúšťa celú aplikáciu Pizzeria
# 1. Spustí proxy server na porte 5000 pre Replit
# 2. Spustí Node.js aplikáciu na porte 3000
# 3. Spustí Vite vývojový server na porte 5173

# Python proxy server (rýchle otvorenie portu 5000)
echo "🍕 Spúšťam Python proxy server na porte 5000..."
python3 simple_http_server.py &
PROXY_PID=$!

# Počkáme na otvorenie portu 5000
sleep 1

# Spustíme npm run dev
echo "🚀 Spúšťam Vite a API servery..."
npm run dev

# Keď sa ukončí hlavný proces, ukončíme aj proxy server
kill $PROXY_PID