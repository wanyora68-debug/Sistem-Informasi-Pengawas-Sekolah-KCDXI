// Test Supabase connection from production
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing Supabase connection...');
    
    const supabaseUrl = process.env.SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseKey);
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test simple query
    console.log('Querying users table...');
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('id, username, role')
      .limit(5);

    if (queryError) {
      console.error('Supabase query error:', queryError);
      return res.status(500).json({
        error: 'Supabase query failed',
        details: queryError,
        config: {
          url: supabaseUrl,
          keyExists: !!supabaseKey
        }
      });
    }

    console.log('Query successful, users found:', users?.length || 0);

    return res.json({
      success: true,
      message: 'Supabase connection successful',
      config: {
        url: supabaseUrl,
        keyExists: !!supabaseKey,
        keyLength: supabaseKey?.length || 0
      },
      data: {
        usersCount: users?.length || 0,
        users: users || []
      }
    });

  } catch (error) {
    console.error('Supabase test error:', error);
    return res.status(500).json({
      error: 'Supabase connection failed',
      message: error.message,
      stack: error.stack
    });
  }
}