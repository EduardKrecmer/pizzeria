/**
 * Replit CORS Proxy Server (ES Modules)
 * 
 * Tento server vyriešuje problém s CORS blokovaním požiadaviek v Replit prostredí.
 */

import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 5000;
const vitePort = 5173;
const apiPort = 3000;

// Vytvoríme jednoduchý API server
console.log('🍕 Vytváram jednoduchý API server...');

const apiApp = express();
apiApp.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// NAČÍTAVAM PIZZE Z VÁŠHO JSON SÚBORU
let pizzasData = [];

try {
  const pizzasPath = path.join(process.cwd(), 'client/src/data/pizzas.json');
  
  if (fs.existsSync(pizzasPath)) {
    const fileContent = fs.readFileSync(pizzasPath, 'utf-8');
    const pizzasFromFile = JSON.parse(fileContent);
    
    pizzasData = pizzasFromFile.map(pizza => ({
      id: pizza.id,
      name: pizza.name,
      weight: pizza.weight || "450g",
      allergens: pizza.allergens || "1,7",
      ingredients: Array.isArray(pizza.ingredients) ? pizza.ingredients.join(', ') : pizza.ingredients,
      price: `${pizza.price} €`,
      tags: pizza.tags || ["Klasické"]
    }));
    
    console.log(`🍕 PROXY-SERVER: Úspešne načítaných ${pizzasData.length} pizz z JSON súboru`);
    console.log(`🍕 PROXY-SERVER: Prvé 5 pizz: ${pizzasData.slice(0, 5).map(p => p.name).join(', ')}`);
    console.log(`🍕 PROXY-SERVER: Posledné 5 pizz: ${pizzasData.slice(-5).map(p => p.name).join(', ')}`);
  } else {
    console.error('❌ PROXY-SERVER: JSON súbor s pizzami sa nenašiel na ceste:', pizzasPath);
    pizzasData = []; // Prázdne pole ako fallback
  }
} catch (error) {
  console.error('❌ PROXY-SERVER: Chyba pri načítaní pizz z JSON:', error);
  pizzasData = []; // Prázdne pole ako fallback
}

const extrasData = {
  "Syry": [
    {
      "nazov": "Gorgonzola",
      "mnozstvo": "50g",
      "cena": 1.2
    },
    {
      "nazov": "Parmezán",
      "mnozstvo": "50g",
      "cena": 1.2
    },
    {
      "nazov": "Niva",
      "mnozstvo": "50g",
      "cena": 0.7
    },
    {
      "nazov": "Mozzarella",
      "mnozstvo": "50g",
      "cena": 0.6
    }
  ],
  "Mäso": [
    {
      "nazov": "Šunka",
      "mnozstvo": "50g",
      "cena": 1.6
    },
    {
      "nazov": "Štipľavá saláma",
      "mnozstvo": "50g",
      "cena": 1.6
    },
    {
      "nazov": "Slanina",
      "mnozstvo": "50g",
      "cena": 1.6
    },
    {
      "nazov": "Kuracie mäso",
      "mnozstvo": "80g",
      "cena": 1.6
    }
  ],
  "Zelenina": [
    {
      "nazov": "Cibuľa",
      "mnozstvo": "15g",
      "cena": 0.3
    },
    {
      "nazov": "Šampiňóny",
      "mnozstvo": "50g",
      "cena": 0.5
    },
    {
      "nazov": "Kukurica",
      "mnozstvo": "50g",
      "cena": 0.5
    },
    {
      "nazov": "Rukola",
      "mnozstvo": "30g",
      "cena": 0.4
    }
  ],
  "Iné": [
    {
      "nazov": "Olivy",
      "mnozstvo": "30g",
      "cena": 0.5
    },
    {
      "nazov": "Cesnak",
      "mnozstvo": "5g",
      "cena": 0.2
    },
    {
      "nazov": "Chilli",
      "mnozstvo": "5g",
      "cena": 0.2
    },
    {
      "nazov": "Ananás",
      "mnozstvo": "50g",
      "cena": 0.6
    }
  ]
};

// API endpointy
apiApp.get('/api/pizzas', (req, res) => {
  console.log(`🍕 Priama obsluha: GET /api/pizzas - vraciam ${pizzasData.length} pizz`);
  res.setHeader('Cache-Control', 'no-cache');
  res.json(pizzasData);
});

apiApp.get('/api/extras', (req, res) => {
  console.log('📞 API Request: GET /api/extras');
  res.json(extrasData);
});

// Spustenie API servera
const apiServer = apiApp.listen(apiPort, '0.0.0.0', () => {
  console.log(`🍕 API server beží na porte ${apiPort}`);
});

// Spustenie Vite servera s povolenými externými doménami
console.log('🍕 Spúšťam Vite dev server...');
const viteServer = spawn('npm', ['run', 'dev', '--', '--host', '0.0.0.0', '--port', vitePort.toString()], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true,
  env: { 
    ...process.env, 
    VITE_ALLOW_EXTERNAL: 'true',
    VITE_ALLOWED_HOSTS: '.replit.app,.replit.dev,pizza-order-pro-krecmereduard.replit.app,localhost'
  }
});

viteServer.stdout.on('data', (data) => {
  console.log(`[Vite] ${data.toString().trim()}`);
});

viteServer.stderr.on('data', (data) => {
  console.error(`[Vite Error] ${data.toString().trim()}`);
});

// Počkať, kým sa servery načítajú
setTimeout(() => {
  // CORS middleware
  app.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  });

  // Explicitné endpointy pre pizze a extra prísady
  app.get('/api/pizzas', (req, res) => {
    console.log('🍕 Priama obsluha: GET /api/pizzas');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json');
    res.json(pizzasData);
  });
  
  app.get('/api/extras', (req, res) => {
    console.log('🍕 Priama obsluha: GET /api/extras');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json');
    res.json(extrasData);
  });

  // JSON middleware pre POST požiadavky
  app.use(express.json());

  // API endpoint pre objednávky s emailom
  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = req.body;
      console.log('📝 Prijatá objednávka cez proxy:', orderData);
      
      // Validate required fields
      if (!orderData.customerName || !orderData.customerPhone) {
        return res.status(400).json({ 
          error: 'Chýbajú povinné údaje (meno a telefón)' 
        });
      }

      // Simulujeme vytvorenie objednávky
      const order = {
        id: Date.now(),
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail || null,
        customerPhone: orderData.customerPhone,
        deliveryAddress: orderData.deliveryAddress || null,
        deliveryCity: orderData.deliveryCity || null,
        deliveryPostalCode: orderData.deliveryPostalCode || null,
        deliveryType: orderData.deliveryType || 'DELIVERY',
        deliveryFee: orderData.deliveryFee || 0,
        items: orderData.items || [],
        notes: orderData.notes || null,
        status: 'pending',
        totalAmount: orderData.totalAmount || 0,
        createdAt: new Date().toISOString()
      };

      console.log('✅ Objednávka spracovaná:', order);

      // Pošleme email na pizzeria
      try {
        // Dynamický import email modulu
        const { sendOrderNotificationToRestaurant } = await import('./server/email.js');
        await sendOrderNotificationToRestaurant(order);
        console.log('📧 Email odoslaný na pizza.objednavka@gmail.com');
      } catch (emailError) {
        console.error('❌ Chyba pri odosielaní emailu:', emailError);
        // Pokračujeme aj bez emailu
      }

      res.json({ 
        success: true, 
        id: order.id,
        message: 'Objednávka bola úspešne prijatá'
      });
    } catch (error) {
      console.error('❌ Chyba pri spracovaní objednávky:', error);
      res.status(500).json({ 
        error: 'Chyba pri spracovaní objednávky',
        details: error instanceof Error ? error.message : 'Neznáma chyba'
      });
    }
  });
  
  // Proxy pre ostatné API požiadavky
  app.use('/api', createProxyMiddleware({
    target: `http://localhost:${apiPort}`,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.removeHeader('host');
      proxyReq.setHeader('host', `localhost:${apiPort}`);
      console.log(`🍳 API Proxy: ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
  }));

  // Proxy pre všetky ostatné požiadavky na Vite server (vrátane koreňovej cesty)
  app.use('/', createProxyMiddleware({
    target: `http://localhost:${vitePort}`,
    changeOrigin: true,
    ws: true,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.removeHeader('host');
      proxyReq.setHeader('host', `localhost:${vitePort}`);
      console.log(`🍕 Vite Proxy: ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
  }));

  // Spustenie proxy servera
  app.listen(port, '0.0.0.0', () => {
    console.log(`🍕 Proxy server beží na porte ${port}`);
    console.log(`🍕 Aplikácia je dostupná na: http://localhost:${port}`);
  });
}, 3000);

// Ukončenie pri zatvorení
process.on('SIGINT', () => {
  console.log('Ukončujem všetky procesy...');
  if (apiServer?.close) apiServer.close();
  if (viteServer?.kill) viteServer.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Ukončujem všetky procesy...');
  if (apiServer?.close) apiServer.close();
  if (viteServer?.kill) viteServer.kill();
  process.exit();
});