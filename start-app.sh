#!/bin/bash

# Spustí Pizzeria App v Replit prostredí
echo "🍕 Spúšťam Pizzeria aplikáciu..."

# Spustíme port-opener najprv samostatne pre rýchle otvorenie portu 5000
node port-opener.cjs &
OPENER_PID=$!

# Počkáme 1 sekundu, aby sa port stihol otvoriť
sleep 1

# Spustíme plnú Replit proxy službu v pozadí
node replit.cjs &
REPLIT_PID=$!

# Trap pre prípad ukončenia
trap "kill $OPENER_PID $REPLIT_PID; exit" SIGINT SIGTERM

# Počkáme na ukončenie
wait $REPLIT_PID