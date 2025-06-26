#!/bin/bash

# Skript pre spustenie rýchleho Express servera v Replit
# Optimalizovaný pre rýchle spustenie v rámci 20-sekundového limitu

echo "Pizza Ordering App - Express Server Štart"
echo "---------------------------------------"

# Ukončíme existujúce procesy
echo "Ukončujem existujúce Node.js procesy..."
pkill -f node || true

# Počkáme chvíľu
sleep 1

# Spustíme Express server
echo "Spúšťam Express server na porte 5000..."
node express-app.cjs