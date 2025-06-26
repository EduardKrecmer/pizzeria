#!/bin/bash

# Jednoduchý skript na spustenie frontendového Vite servera
# Použije samostatnú klientskú Vite konfiguráciu

echo "Spúšťam Pizza aplikáciu - Frontend Only..."

# Skúsime najprv zastaviť všetky bežiace Node procesy
echo "Ukončujem existujúce Node procesy..."
pkill -f node || true

# Počkáme chvíľu
sleep 2

# Spustíme frontend workflow
echo "Spúšťam Vite server s klientskou konfiguráciou..."
node frontend-workflow.js