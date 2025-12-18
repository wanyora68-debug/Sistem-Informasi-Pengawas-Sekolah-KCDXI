const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  try {
    // Read local database
    const dbPath = path.join(process.cwd(), 'local-database.json');
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    if (req.method === 'GET') {
      res.json(data.tasks || []);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Tasks API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}