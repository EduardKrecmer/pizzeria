#!/bin/bash

# Tento script spúšťa API server a Vite server s korektnými nastaveniami pre CORS
# a host parametre, ktoré sú potrebné pre správne fungovanie aplikácie v Replit

# Nastavenie pracovného adresára
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Export portov pre Replit
export PORT=5000
export REPL_SLUG=$(basename $(pwd))

# Otvorenie portu pre Replit
echo "Otváram port 5000 pre Replit..."
node -e "
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*'
    });
    res.end('<html><body><h1>Pizzeria App sa spúšťa...</h1><p>Prosím čakajte...</p></body></html>');
  });
  server.listen(5000, '0.0.0.0', () => {
    console.log('Port 5000 je otvorený');
  });

  // Po 5 sekundách spustíme hlavnú aplikáciu
  setTimeout(() => {
    console.log('Spúšťam Vite s host=0.0.0.0...');
    const { exec } = require('child_process');
    exec('npm run dev -- --host 0.0.0.0', (error, stdout, stderr) => {
      if (error) {
        console.error(\`Chyba: \${error.message}\`);
        return;
      }
      console.log(\`stdout: \${stdout}\`);
      console.error(\`stderr: \${stderr}\`);
    });
  }, 5000);
"