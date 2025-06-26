#!/bin/bash

# Spustíme Vite server na pozadí
npm run dev &
VITE_PID=$!

# Počkáme chvíľu, aby Vite server stihol naštartovať
sleep 5

# Spustíme proxy server
node proxy-server.js

# Ak sa proxy server ukončí, ukončíme aj Vite server
kill $VITE_PID