#!/bin/bash

# Ultra-jednoduchý skript pre spustenie Express servera
# Optimalizovaný pre Replit prostredie (spustenie <20s)

echo "Pizza Ordering App - Ultra Simple Express"
echo "---------------------------------------"

# Ukončenie existujúcich procesov
echo "Ukončujem existujúce Node.js procesy..."
pkill -f node || true

# Počkáme chvíľu
sleep 1

# Spustíme jednoduchý Express server
echo "Spúšťam Express server na porte 5000..."
node simple-express.cjs