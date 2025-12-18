const { Client } = require('pg');

module.exports = async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.SUPABASE_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM tasks ORDER BY created_at DESC');
      res.json(result.rows);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Tasks API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.end();
  }
}