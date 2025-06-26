#!/bin/bash

# Tento skript je určený na spustenie aplikácie v Replit prostredí
# Rieši problém s 20-sekundovým časovým limitom na otvorenie portu 5000

echo "🍕 Spúšťam Pizzeria aplikáciu v Replit prostredí..."

# 1. Spustíme Python HTTP server pre otvorenie portu 5000
echo "📝 Spúšťam rýchly HTTP server na porte 5000..."
python3 simple_http_server.py