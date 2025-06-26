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

# Rýchlo otvoríme port pre Replit
echo "Rýchle otvorenie portu 5000..."
(
  python3 -c "
import socket, threading, time
def server():
  s = socket.socket()
  s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
  s.bind(('0.0.0.0', 5000))
  s.listen(1)
  print('Port 5000 je otvorený')
  time.sleep(2)
  s.close()
  print('Dočasný socket zatvorený')
threading.Thread(target=server).start()
  " &
)

# Počkáme chvíľu
sleep 2

# Prejdeme do klientského adresára a spustíme Vite
cd client
echo "Aktuálny adresár: $(pwd)"
echo "Spúšťam: npx vite --host 0.0.0.0 --port 5000"
npx vite --host 0.0.0.0 --port 5000