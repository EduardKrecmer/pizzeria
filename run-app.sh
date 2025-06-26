#!/bin/bash

# Otvorí port 5000 pre Replit a slúži ako proxy pre Vite server
echo "🚀 Spúšťam Pizzeria aplikáciu..."

# Spustíme port opener na pozadí 
node port-opener.cjs &
PORT_OPENER_PID=$!

# Spustíme API server na porte 3000
echo "🍕 Spúšťam API server..."
node api-server.cjs

# V produkčnom prostredí by sme teraz spustili ešte Vite server,
# ale kvôli problémom s vite.config.js to teraz preskočíme
# a poskytneme užívateľovi informácie, ako pokračovať

# cd client && npx vite --port 5173 --host

# Cleanup
cleanup() {
  echo "👋 Ukončujem servery..."
  kill $PORT_OPENER_PID
  exit 0
}

trap cleanup SIGINT SIGTERM

# Keďže API server beží na popredí, nemusíme čakať