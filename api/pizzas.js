// Vercel Edge API Route for pizzas
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
    // Load pizzas data efficiently from attached_assets
    const dataPath = join(process.cwd(), 'attached_assets', 'pizzas_1750846224905.json');
    const pizzasData = JSON.parse(readFileSync(dataPath, 'utf8'));

    // Normalize pizza data for consistent API response
    const normalizedPizzas = pizzasData.map(pizza => ({
      id: pizza.id,
      name: pizza.name,
      description: pizza.description,
      price: pizza.price,
      image: pizza.image,
      tags: pizza.tags || [],
      ingredients: pizza.ingredients || [],
      weight: pizza.weight,
      allergens: pizza.allergens || []
    }));

    return res.status(200).json(normalizedPizzas);
  } catch (error) {
    console.error('Error loading pizzas:', error);
    return res.status(500).json({ error: 'Failed to load pizzas' });
  }
}