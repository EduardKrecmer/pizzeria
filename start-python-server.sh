#!/bin/bash

# Skript pre spustenie rýchleho Python HTTP servera
# Python servery sa zvyčajne spúšťajú rýchlejšie než Node.js
# Optimalizované pre Replit prostredie (spustenie <20s)

echo "Pizza Ordering App - Python Server"
echo "--------------------------------"

# Ukončíme existujúce procesy
echo "Ukončujem existujúce Python procesy..."
pkill -f python || true

# Počkáme chvíľu
sleep 1

# Spustíme Python server
echo "Spúšťam Python HTTP server na porte 5000..."
python3 python-server.py