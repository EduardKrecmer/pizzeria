/**
 * CORS middleware pre Express server
 * Tento middleware povoľuje všetky cross-origin požiadavky
 * pre lepšiu kompatibilitu s Replit prostredím.
 */

function corsMiddleware(req, res, next) {
  // Povolenie všetkých pôvodov
  res.header('Access-Control-Allow-Origin', '*');
  
  // Povolenie bežných hlavičiek
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Povolenie bežných metód
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
}

module.exports = corsMiddleware;