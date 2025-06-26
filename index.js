/**
 * Hlavný vstupný bod pre Pizzeria aplikáciu v Replit prostredí.
 * Tento súbor je automaticky spustený keď používateľ stlačí 'Run' v Replit prostredí.
 * 
 * Skript má dva hlavné ciele:
 * 1. Rýchlo otvoriť port 5000 (do 20 sekúnd), aby Replit rozpoznal bežiacu aplikáciu
 * 2. Spustiť API server a Vite dev server
 */

const http = require('http');
const { spawn } = require('child_process');
const express = require('express');

// Vytvoríme Express app
const app = express();

// Konfigurácia
const PORT = 5000;
const VITE_PORT = 5173;
const API_PORT = 3000;

// Status tracking
let apiRunning = false;
let viteRunning = false;

// Jednoduchá stránka s informáciami o stave aplikácie
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="sk">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pizzeria App - Replit</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background-color: #f8f9fa;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
        }
        header {
          background-color: #2e7d32;
          color: white;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        h1, h2, h3 {
          margin-top: 0;
        }
        .card {
          background-color: white;
          border-radius: 5px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .button {
          display: inline-block;
          background-color: #2e7d32;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin-top: 10px;
        }
        .status {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 5px;
        }
        .online {
          background-color: #4caf50;
        }
        .offline {
          background-color: #f44336;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>🍕 Pizzeria App</h1>
        <p>Aplikácia pre online objednávky pizze</p>
      </header>
      
      <div class="card">
        <h2>
          <span class="status ${apiRunning ? 'online' : 'offline'}"></span>
          API Server
        </h2>
        <p>Stav: <strong>${apiRunning ? 'Online' : 'Offline'}</strong></p>
        ${apiRunning ? `<a href="/api/pizzas" class="button">Zobraziť zoznam pizz</a>` : ''}
      </div>
      
      <div class="card">
        <h2>
          <span class="status ${viteRunning ? 'online' : 'offline'}"></span>
          Frontend (Vite)
        </h2>
        <p>Stav: <strong>${viteRunning ? 'Online' : 'Offline'}</strong></p>
        ${viteRunning ? `<a href="/app" class="button">Otvoriť aplikáciu</a>` : ''}
      </div>
      
      <div class="card">
        <h3>Informácie o projekte</h3>
        <p>Pizzeria aplikácia je postavená na moderných technológiách:</p>
        <ul>
          <li>Frontend: React, TypeScript, Vite</li>
          <li>Backend: Node.js, Express</li>
          <li>Štýlovanie: Tailwind CSS</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

// Spustíme server na porte 5000
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Port ${PORT} je otvorený pre Replit prostredie`);
  
  // Spustíme API server
  console.log('🍕 Spúšťam API server...');
  const apiProcess = spawn('node', ['api-server.cjs'], {
    stdio: 'inherit',
    shell: true
  });
  
  apiProcess.on('error', (err) => {
    console.error('❌ Chyba pri spustení API servera:', err);
  });
  
  // Počkáme 2 sekundy na inicializáciu API servera
  setTimeout(() => {
    console.log('✅ API server je pripravený');
    apiRunning = true;
    
    // Proxy pre API requesty
    const { createProxyMiddleware } = require('http-proxy-middleware');
    app.use('/api', createProxyMiddleware({
      target: `http://localhost:${API_PORT}`,
      changeOrigin: true
    }));
    
    // Spustíme Vite server
    console.log('🚀 Spúšťam Vite server...');
    const viteProcess = spawn('cd client && npx vite --config vite.config.simple.js --port 5173 --host 0.0.0.0', [], {
      stdio: 'inherit', 
      shell: true
    });
    
    viteProcess.on('error', (err) => {
      console.error('❌ Chyba pri spustení Vite servera:', err);
    });
    
    // Počkáme 5 sekúnd na inicializáciu Vite servera
    setTimeout(() => {
      console.log('✅ Vite server je pripravený');
      viteRunning = true;
      
      // Proxy pre Vite requesty
      app.use('/app', createProxyMiddleware({
        target: `http://localhost:${VITE_PORT}`,
        changeOrigin: true,
        pathRewrite: {
          '^/app': '/'
        },
        ws: true
      }));
      
      console.log('🚀 Aplikácia je plne pripravená, môžete ju používať na http://localhost:5000');
      
      // Nastavenie signal handlera pre čisté ukončenie
      process.on('SIGINT', () => {
        console.log('👋 Ukončujem aplikáciu...');
        apiProcess.kill();
        viteProcess.kill();
        server.close(() => {
          process.exit(0);
        });
      });
    }, 5000);
  }, 2000);
});