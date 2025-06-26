#!/bin/bash

# Skript pre spustenie statickej HTML aplikácie
echo "Spúšťam jednoduchý HTTP server na porte 5000..."

# Ukončíme všetky existujúce procesy na portoch, ktoré budeme používať
pkill -f node || true
pkill -f python || true
npx kill-port 5000 5173 3000 8080 8000 2>/dev/null || true

# Krátke čakanie pre uvoľnenie portov
sleep 1

# Kopírujeme HTML súbor pre jednoduché načítanie
cp replit-app.html index.html

# Spustíme Python pre jednoduchý HTTP server
python3 -m http.server 5000 --bind 0.0.0.0