#!/bin/bash

# Tento skript je určený pre Replit workflow
# Rýchlo otvorí port 5000 a potom spustí npm run dev

# Otvoríme port 5000 hneď na začiatku cez Python (najrýchlejšie)
python3 -c 'import http.server, socketserver, threading; handler = http.server.BaseHTTPRequestHandler; handler.do_GET = lambda self: (self.send_response(200), self.send_header("Content-type", "text/html"), self.end_headers(), self.wfile.write(b"<h1>Port Opener</h1>")); handler.log_message = lambda self, *args: None; s = socketserver.TCPServer(("0.0.0.0", 5000), handler); threading.Thread(target=s.serve_forever, daemon=True).start(); print("Port 5000 open")'

# Počkáme krátku chvíľu
sleep 1

# Spustíme npm run dev
npm run dev