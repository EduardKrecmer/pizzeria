#!/bin/bash

# Skript pre spustenie jednoduchého HTTP servera so statickou stránkou
# Tento skript je optimalizovaný pre Replit prostredie a mal by sa spustiť rýchlo

echo "Spúšťam jednoduchú statickú stránku pre pizzeriu..."

# Ukončíme existujúce procesy
echo "Ukončujem existujúce Node procesy..."
pkill -f node || true

# Počkáme chvíľu
sleep 1

# Spustíme server
echo "Spúšťam HTTP server na porte 5000..."
node simple-static-server.js