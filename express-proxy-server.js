// Express proxy server na servovanie React aplikácie
// Tento server je optimalizovaný pre Replit prostredie

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Proxy pre Vite dev server
const devProxy = createProxyMiddleware({
  target: 'http://localhost:5173',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug'
});

// Presmerovanie požiadaviek na Vite dev server
app.use('/', devProxy);

// Spustenie servera
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express proxy server beží na http://0.0.0.0:${PORT}`);
  console.log(`Presmerovanie požiadaviek na Vite server (http://localhost:5173)`);
});