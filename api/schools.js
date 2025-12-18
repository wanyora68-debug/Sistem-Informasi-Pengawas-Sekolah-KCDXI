import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Read local database
    const dbPath = path.join(process.cwd(), 'local-database.json');
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    if (req.method === 'GET') {
      res.json(data.schools || []);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Schools API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}