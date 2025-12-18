// Simple login endpoint without Supabase dependency
module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body || {};
    
    console.log('Simple login attempt:', { username, hasPassword: !!password });

    // Hardcoded users for immediate functionality
    const users = {
      admin: { 
        password: 'admin123', 
        role: 'admin', 
        fullName: 'Administrator',
        id: '1'
      },
      wawan: { 
        password: 'wawan123', 
        role: 'pengawas', 
        fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
        id: '2'
      }
    };
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password required' 
      });
    }

    const user = users[username.toLowerCase()];
    
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generate simple token
    const token = `${username}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Login successful for:', username);

    return res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user.id,
        username: username,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Simple login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}