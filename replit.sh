#!/bin/bash
# Hlavný štartovací skript pre Replit prostredie 
# Spúšťa frontend (Vite) a backend (Express) server súčasne

# Funkcia na rýchle otvorenie portu
quick_port_open() {
  echo "🔓 Rýchlo otváram port 5000..."
  python3 -c '
import http.server
import socketserver
import threading
import time

def start_server():
    class QuickHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(b"<html><body><h1>Aplikacia sa spusta...</h1></body></html>")
            
    with socketserver.TCPServer(("0.0.0.0", 5000), QuickHandler) as httpd:
        print("Server otvoril port 5000")
        httpd.handle_request()

server_thread = threading.Thread(target=start_server)
server_thread.daemon = True
server_thread.start()

print("Python server je pripravený")
  ' &
  
  # Počkáme chvíľu, aby sa otvoril port
  sleep 1
}

# Vyčistenie procesov a portov
echo "🧹 Čistím porty a existujúce procesy..."
pkill -f node || true
pkill -f python || true
npx kill-port 3000 5000 5173 || true
sleep 1

# Rýchlo otvoríme port pre Replit
quick_port_open

# Spustenie API servera na pozadí
echo "🍕 Spúšťam API server na porte 3000..."
node api-server.js &
API_PID=$!

# Počkať chvíľu na spustenie API servera
sleep 2

# Spustenie Vite servera na porte 5000
echo "🚀 Spúšťam Vite frontend na porte 5000..."
cd client && exec npx vite --host 0.0.0.0 --port 5000