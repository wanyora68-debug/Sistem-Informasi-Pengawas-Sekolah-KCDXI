// Simple test endpoint to debug login issues
module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Test login endpoint hit');
    console.log('Method:', req.method);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);

    if (req.method === 'GET') {
      return res.json({ 
        message: 'Test endpoint working',
        timestamp: new Date().toISOString(),
        env: {
          supabaseUrl: process.env.SUPABASE_URL || 'not set',
          supabaseKeyExists: !!process.env.SUPABASE_ANON_KEY,
          jwtSecret: process.env.JWT_SECRET || 'not set'
        }
      });
    }

    if (req.method === 'POST') {
      const { username, password } = req.body || {};
      
      // Simple hardcoded test
      if (username === 'admin' && password === 'admin123') {
        return res.json({
          success: true,
          message: 'Test login successful',
          token: 'test-token-123',
          user: {
            id: '1',
            username: 'admin',
            role: 'admin',
            full_name: 'Administrator'
          }
        });
      }

      return res.status(401).json({
        error: 'Invalid test credentials',
        received: { username, password }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Test login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    });
  }
}