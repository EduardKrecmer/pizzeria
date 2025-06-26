// start-express-proxy.js - Spustí Vite a proxy server
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('Spúšťam Vite server...');

// Spustíme Vite server ako samostatný proces
const viteProcess = spawn('npm', ['run', 'dev'], { 
  shell: true,
  stdio: 'pipe'
});

// Spracovanie výstupu z Vite servera
viteProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`Vite: ${output}`);
  
  // Ak Vite output obsahuje "ready", pokračujeme so spustením proxy servera
  if (output.includes('ready')) {
    startProxyServer();
  }
});

viteProcess.stderr.on('data', (data) => {
  console.error(`Vite Error: ${data.toString()}`);
});

// Keď sa Vite server ukončí, ukončíme aj skript
viteProcess.on('close', (code) => {
  console.log(`Vite server ukončený s kódom: ${code}`);
  process.exit(code || 0);
});

async function startProxyServer() {
  // Počkáme ešte 2 sekundy, aby sa Vite server stihol úplne inicializovať
  await setTimeout(2000);
  
  console.log('Spúšťam proxy server...');
  
  // Spustíme proxy server ako samostatný proces
  const proxyProcess = spawn('node', ['express-proxy-server.js'], { 
    shell: true,
    stdio: 'pipe'
  });
  
  // Spracovanie výstupu z proxy servera
  proxyProcess.stdout.on('data', (data) => {
    console.log(`Proxy: ${data.toString()}`);
  });
  
  proxyProcess.stderr.on('data', (data) => {
    console.error(`Proxy Error: ${data.toString()}`);
  });
  
  // Keď sa proxy server ukončí, ukončíme aj Vite server
  proxyProcess.on('close', (code) => {
    console.log(`Proxy server ukončený s kódom: ${code}`);
    viteProcess.kill();
  });
  
  // Správne ukončenie pri signáloch
  process.on('SIGINT', () => {
    console.log('Ukončujem všetky procesy...');
    proxyProcess.kill();
    viteProcess.kill();
    process.exit(0);
  });
}