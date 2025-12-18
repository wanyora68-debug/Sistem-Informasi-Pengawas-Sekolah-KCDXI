// API endpoint to reset user password
const bcrypt = require('bcryptjs');
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
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    console.log(`Resetting password for user: ${username}`);
    
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, username, full_name')
      .eq('username', username)
      .single();

    if (checkError || !existingUser) {
      console.log('User not found, creating new user...');
      
      // Create new user
      const userData = {
        username: username,
        password: hashedPassword,
        role: 'pengawas'
      };

      // Add specific data for known users
      if (username === 'wawan') {
        userData.full_name = 'H. Wawan Yogaswara, S.Pd, M.Pd';
        userData.nip = '196805301994121001';
        userData.rank = 'Pembina Utama Muda, IV/c';
        userData.office_name = 'Cabang Dinas Pendidikan Wilayah XI';
        userData.office_address = 'Jl. A.Yani No. 23 Kel. Paminggir Kec. Garut Kota';
        userData.home_address = 'Griya Surya Indah No. 50';
        userData.phone = '087733438282';
      } else {
        userData.full_name = username;
        userData.nip = '';
        userData.rank = '';
        userData.office_name = 'Cabang Dinas Pendidikan Wilayah XI';
        userData.office_address = 'Jl. A.Yani No. 23';
        userData.home_address = '';
        userData.phone = '';
      }

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ 
          error: 'Failed to create user', 
          details: createError.message 
        });
      }

      return res.json({
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          full_name: newUser.full_name
        },
        credentials: {
          username: username,
          password: password
        }
      });
    } else {
      // Update existing user password
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('username', username)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating password:', updateError);
        return res.status(500).json({ 
          error: 'Failed to update password', 
          details: updateError.message 
        });
      }

      return res.json({
        success: true,
        message: 'Password updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          full_name: updatedUser.full_name
        },
        credentials: {
          username: username,
          password: password
        }
      });
    }

  } catch (error) {
    console.error('Reset user error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}