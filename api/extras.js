// Vercel Edge API Route for extras
import { readFileSync } from 'fs';
import { join } from 'path';

// Vercel serverless function - uses Node.js 20.x by default

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Load extras data efficiently from attached_assets
    const dataPath = join(process.cwd(), 'attached_assets', 'extra_prisady.json');
    const extrasData = JSON.parse(readFileSync(dataPath, 'utf8'));

    // Normalize extras data structure for consistent API response
    const normalizedExtras = extrasData.map(extra => ({
      id: extra.id,
      name: extra.name,
      price: extra.price,
      category: extra.category || 'Ostatné'
    }));

    return res.status(200).json(normalizedExtras);
  } catch (error) {
    console.error('Error loading extras:', error);
    return res.status(500).json({ error: 'Failed to load extras' });
  }
}