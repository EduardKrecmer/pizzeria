#!/bin/bash

# Skript pre spustenie jednoduchej statickej verzie Pizza aplikácie
# Optimalizovaný pre Replit prostredie (spustenie <20s)

echo "Pizza Ordering App - spúšťanie jednoduchého servera v Replit"

# Ukončenie existujúcich procesov
echo "Ukončovanie existujúcich Node.js procesov..."
pkill -f node || true

# Počkáme chvíľu
sleep 1

# Spustíme jednoduchý server
echo "Spúšťam jednoduchý server na porte 5000..."
node simple-server.cjs