#!/bin/bash

# Vypíšeme informáciu o spúšťaní aplikácie
echo "Spúšťam Pizzeria aplikáciu..."

# Spustíme Python port opener v pozadí
echo "Štartujem port opener na porte 5000..."
python3 pizza_port_opener.py &
PYTHON_PID=$!

# Počkáme 2 sekundy aby sa port opener stihol spustiť
sleep 2

# Spustíme hlavnú aplikáciu
echo "Štartujem hlavnú aplikáciu..."
npm run dev

# Po ukončení aplikácie ukončíme aj port opener
echo "Ukončujem port opener..."
kill $PYTHON_PID

echo "Aplikácia bola ukončená."