// Comprehensive debug endpoint for login issues
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('=== DEBUG LOGIN ENDPOINT ===');
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));

    // Environment check
    const envCheck = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV || 'not set'
    };

    console.log('Environment variables:', envCheck);

    if (req.method === 'GET') {
      return res.json({
        message: 'Debug login endpoint',
        timestamp: new Date().toISOString(),
        environment: envCheck,
        supabaseUrl: process.env.SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co',
        keyLength: (process.env.SUPABASE_ANON_KEY || '').length
      });
    }

    if (req.method === 'POST') {
      const { username, password } = req.body || {};
      
      console.log('Login attempt:', { username, passwordLength: password?.length });

      // Try to load Supabase
      let supabase;
      try {
        const { createClient } = require('@supabase/supabase-js');
        const supabaseUrl = process.env.SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
        const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
        
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client created successfully');
      } catch (supabaseError) {
        console.error('Supabase client creation failed:', supabaseError);
        return res.status(500).json({
          error: 'Supabase initialization failed',
          details: supabaseError.message,
          environment: envCheck
        });
      }

      // Hardcoded test users for debugging
      const testUsers = {
        admin: {
          id: '1',
          username: 'admin',
          password: '$2b$10$nNLmmE3LGFdd6fLaBdCMvObzPpLqeT9UJN0fe/9aM9viOsOc.IAq2', // admin123
          full_name: 'Administrator',
          role: 'admin'
        },
        wawan: {
          id: '2',
          username: 'wawan',
          password: '$2b$10$fjJLf86PdOhugDGcr.HS2etUQSFcO2J4sY/39nuEWQiW4i4DKZrEy', // wawan123
          full_name: 'H. Wawan Yogaswara, S.Pd, M.Pd',
          role: 'pengawas'
        }
      };

      // Try hardcoded login first
      if (testUsers[username]) {
        const user = testUsers[username];
        const isValid = await bcrypt.compare(password, user.password);
        
        console.log('Hardcoded user test:', { username, isValid });
        
        if (isValid) {
          const token = jwt.sign(
            { 
              userId: user.id, 
              username: user.username, 
              role: user.role 
            },
            process.env.JWT_SECRET || 'schoolguard-secret-key-2024',
            { expiresIn: '24h' }
          );

          console.log('Hardcoded login successful');
          
          return res.json({
            success: true,
            source: 'hardcoded',
            token,
            user: {
              id: user.id,
              username: user.username,
              full_name: user.full_name,
              role: user.role
            }
          });
        }
      }

      // Try Supabase login
      try {
        console.log('Attempting Supabase query...');
        const { data: users, error: queryError } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single();

        console.log('Supabase query result:', { 
          hasUser: !!users, 
          error: queryError?.message 
        });

        if (queryError) {
          return res.status(401).json({
            error: 'Database query failed',
            source: 'supabase',
            details: queryError.message,
            environment: envCheck
          });
        }

        if (!users) {
          return res.status(401).json({
            error: 'User not found',
            source: 'supabase',
            username: username
          });
        }

        const isValid = await bcrypt.compare(password, users.password);
        console.log('Supabase password check:', isValid);

        if (!isValid) {
          return res.status(401).json({
            error: 'Invalid password',
            source: 'supabase'
          });
        }

        const token = jwt.sign(
          { 
            userId: users.id, 
            username: users.username, 
            role: users.role 
          },
          process.env.JWT_SECRET || 'schoolguard-secret-key-2024',
          { expiresIn: '24h' }
        );

        console.log('Supabase login successful');

        const { password: _, ...userWithoutPassword } = users;
        return res.json({
          success: true,
          source: 'supabase',
          token,
          user: userWithoutPassword
        });

      } catch (supabaseError) {
        console.error('Supabase operation failed:', supabaseError);
        return res.status(500).json({
          error: 'Supabase operation failed',
          details: supabaseError.message,
          environment: envCheck
        });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Debug login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    });
  }
}