#!/bin/bash
# Hlavný spúšťací skript pre pizzeria aplikáciu v Replit

# Vyčistiť existujúce procesy
echo "🧹 Čistím porty a procesy..."
pkill -f node || true
pkill -f python || true
sleep 1

# Aktualizácia typu modulu pre server
echo "⚙️ Nastavujem typ modulov pre spustenie..."
node -e "
const fs = require('fs');
const path = require('path');
const packageJsonPath = path.resolve('./package.json');

try {
  const packageJson = require(packageJsonPath);
  
  // Nastavíme typ na commonjs pre server
  const originalType = packageJson.type;
  delete packageJson.type;

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('✅ Úspešne upravený package.json');
} catch (error) {
  console.error('❌ Chyba pri úprave package.json:', error);
  process.exit(1);
}
"

# Rýchle otvorenie portu
echo "🔓 Otváram port 5000 pomocou Python servera..."
python3 -c '
import http.server
import socketserver
import threading

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(b"<html><body><h1>Pizzeria app sa spusta...</h1></body></html>")

def run_server():
    with socketserver.TCPServer(("0.0.0.0", 5000), Handler) as httpd:
        print("Port 5000 otvoreny!")
        httpd.serve_forever()

server_thread = threading.Thread(target=run_server)
server_thread.daemon = True
server_thread.start()

print("Python server pripraveny")
' &

# Počkať chvíľu na spustenie servera
sleep 2

# Spustenie API servera
echo "🍕 Spúšťam API server..."
node api-server.cjs &
API_PID=$!

# Počkať chvíľu na spustenie API servera
echo "⏳ Čakám 2 sekundy na spustenie API servera..."
sleep 2

# Spustenie Vite servera
echo "🌐 Spúšťam Vite development server..."
cd client && exec npx vite --host 0.0.0.0 --port 5000