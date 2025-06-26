// Spúšťací súbor pre API server
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./api');

// Načítaj premenné prostredia
dotenv.config();

// Vytvor Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware pre zabezpečenie správnych JSON hlavičiek pre API odpovede
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
  }
  next();
});

// Pripojenie API routes
app.use('/api', apiRoutes);

// Základná root route pre kontrolu, či server beží
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Pizza API server beží', 
    time: new Date().toISOString() 
  });
});

// Spusti server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🍕 API server beží na porte ${PORT}`);
  console.log(`Čas spustenia: ${new Date().toISOString()}`);
});