#!/bin/bash

echo "=== PRÍPRAVA ČISTÉHO PROJEKTU PRE GITHUB ==="

# Vytvoríme nový adresár pre GitHub
GITHUB_DIR="github-ready"
rm -rf $GITHUB_DIR
mkdir -p $GITHUB_DIR

# Kopírujeme len potrebné súbory projektu
echo "Kopírujem zdrojový kód a konfiguračné súbory..."

# Hlavné adresáre
cp -r api $GITHUB_DIR/
cp -r client $GITHUB_DIR/
cp -r server $GITHUB_DIR/
cp -r shared $GITHUB_DIR/
cp -r scripts $GITHUB_DIR/

# JSON dáta a konfiguračné súbory
echo "Kopírujem dátové súbory a konfigurácie..."
cp *.json $GITHUB_DIR/ 2>/dev/null || :
cp *.js $GITHUB_DIR/ 2>/dev/null || :
cp *.ts $GITHUB_DIR/ 2>/dev/null || :
cp *.md $GITHUB_DIR/ 2>/dev/null || :
cp .gitignore $GITHUB_DIR/ 2>/dev/null || :
cp run-server.sh $GITHUB_DIR/
cp vercel-deploy.sh $GITHUB_DIR/
cp deploy-to-vercel.sh $GITHUB_DIR/ 2>/dev/null || :
cp prepare-vercel.sh $GITHUB_DIR/ 2>/dev/null || :

# Inicializujeme nový Git repozitár
echo "Inicializujem nový Git repozitár..."
cd $GITHUB_DIR
git init

# Vytvoríme nový .gitignore
cat > .gitignore << 'EOF'
# Štandardné ignorované súbory
node_modules/
.DS_Store
dist/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.vscode/
.idea/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnp/
.pnp.js
coverage/
build/
*.tsbuildinfo

# Replit špecifické
.replit
replit.nix
.cache/
.upm/
.config/

# Vercel špecifické
.vercel/
vercel-deployment/

# Dočasné súbory
*.swp
*.swo
*~
EOF

# Pridáme README.md, ak ešte neexistuje
if [ ! -f "README.md" ]; then
  cat > README.md << 'EOF'
# Pizzeria Janíček - Online objednávkový systém

Webová aplikácia pre online objednávky pizze s podporou prispôsobenia a doručenia.

## 🚀 Spustenie

```bash
# Inštalácia závislostí
npm install

# Vývojové prostredie
npm run dev

# Produkčné zostavenie
npm run build
```

## 📦 Nasadenie na Vercel

Najlepšie je použiť skript vercel-deploy.sh:

```bash
./vercel-deploy.sh
```

Tento skript vytvorí čistú verziu projektu v adresári vercel-deployment, ktorú môžete nahrať na Vercel.

## 📄 Licencia

MIT
EOF
fi

# Pridáme všetko do Git
git add .
git commit -m "Prvotné nahratie: Kompletná verzia Pizzeria Janíček"

echo ""
echo "=== PRÍPRAVA DOKONČENÁ ==="
echo "Projekt je pripravený v adresári '$GITHUB_DIR'."
echo ""
echo "Pre nahratie na GitHub postupujte takto:"
echo ""
echo "1. Vytvorte nový repozitár na GitHub (bez inicializácie)"
echo "2. Použite tieto príkazy (nahraďte URL vašim repozitárom):"
echo ""
echo "   cd $GITHUB_DIR"
echo "   git remote add origin https://github.com/vas-username/pizzeria-web.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "ℹ️ Nahrávaný projekt bude mať len jeden commit bez histórie."

# Nastavíme súbor ako spustiteľný
chmod +x "../$0"

exit 0