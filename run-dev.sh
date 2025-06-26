#!/bin/bash

# Tento skript spustí vývojový server pre React aplikáciu
# Vite server je nakonfigurovaný s --host, aby bol dostupný z internetu
# Úprava pre Replit - rieši problém s 20 sekundovým timeout-om

# Ukončíme existujúce procesy
echo "Ukončujem existujúce procesy..."
pkill -f node || true
pkill -f npm || true

# Počkáme chvíľu
sleep 1

# Prejdeme do klientského adresára
cd client

# Spustíme Vite v development móde s hostiteľom 0.0.0.0 (dostupné z internetu)
echo "Spúšťam Vite v client adresári..."
npx vite --host 0.0.0.0 --port 5000