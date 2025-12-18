const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Login attempt started');
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ error: 'Username and password required' });
    }

    console.log('Attempting login for username:', username);

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseKey);
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find user in Supabase
    console.log('Querying user from Supabase...');
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    console.log('Query result:', { users: !!users, error: queryError });

    if (queryError) {
      console.error('Supabase query error:', queryError);
      return res.status(401).json({ error: 'Invalid credentials', debug: queryError.message });
    }

    if (!users) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User found, checking password...');

    // Check password
    const isValid = await bcrypt.compare(password, users.password);
    console.log('Password valid:', isValid);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: users.id, 
        username: users.username, 
        role: users.role 
      },
      process.env.JWT_SECRET || 'schoolguard-secret-key-2024',
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', username);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = users;

    res.json({
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      debug: error.message,
      stack: error.stack 
    });
  }
}