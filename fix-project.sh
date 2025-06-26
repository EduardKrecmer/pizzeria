#!/bin/bash

echo "===== Opravujem štruktúru projektu ====="

# Kontrola, či existuje client/src
if [ ! -d "client/src" ]; then
  echo "Vytváram adresár client/src"
  mkdir -p client/src
fi

# Kontrola, či existujú potrebné súbory v client/src
if [ ! -f "client/src/App.tsx" ] || [ ! -f "client/src/main.tsx" ]; then
  echo "Kopírujem súbory z attached_assets do client/src"
  
  # Skopírovať všetky súbory z attached_assets do client/src
  cp -r attached_assets/* client/src/
  
  echo "Súbory boli skopírované"
fi

# Upraviť client/vite.config.js, ak existuje
if [ -f "client/vite.config.js" ]; then
  echo "Aktualizujem client/vite.config.js"
  
  # Zálohovať pôvodný súbor
  cp client/vite.config.js client/vite.config.js.bak
  
  # Vytvoriť nový súbor
  cat > client/vite.config.js << 'EOL'
// Ďalšia Vite konfigurácia, ktorá povolí prístup z Replit domény
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    // Povoľujeme prístup z akejkoľvek Replit domény
    hmr: {
      clientPort: 443
    },
    // Povoľujeme všetkých hostiteľov (najmä pre Replit)
    cors: true,
    // Povolenie všetkých hostov
    allowedHosts: "all"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "..", "attached_assets"),
    },
  },
});
EOL

  echo "client/vite.config.js bol aktualizovaný"
fi

echo "===== Príprava dokončená ====="
echo "Teraz môžete spustiť './run.sh' pre spustenie aplikácie"