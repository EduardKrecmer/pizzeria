#!/bin/bash

# V prostredí Replit je často potrebné kombinovať rôzne prístupy
# Tento skript pokúsi spustiť náš jednoduchý proxy server

echo "Spúšťam jednoduché proxy riešenie pre Replit..."

# Skúsime najprv zastaviť všetky bežiace Node procesy
echo "Ukončujem existujúce Node procesy..."
pkill -f node || true

# Počkáme chvíľu
sleep 2

# Spustíme náš proxy server
echo "Spúšťam proxy server..."
node start-simple-proxy.js