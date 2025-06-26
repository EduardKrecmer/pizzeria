#!/bin/bash

# Ukončenie všetkých node procesov
pkill node || true

# Spustenie proxy servera
echo "🍕 Spúšťam Pizza aplikáciu s proxy serverom..."
exec node proxy-server.mjs