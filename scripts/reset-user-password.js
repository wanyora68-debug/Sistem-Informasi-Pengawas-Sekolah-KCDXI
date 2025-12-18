#!/usr/bin/env node

/**
 * Reset User Password in Supabase
 * Script untuk reset password user tertentu di Supabase
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetUserPassword() {
  try {
    const username = process.argv[2] || 'wawan';
    const newPassword = process.argv[3] || 'wawan123';
    
    console.log(`🔗 Resetting password for user: ${username}`);
    console.log(`🔐 New password: ${newPassword}`);
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('🔐 Password hashed successfully');

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, username, full_name')
      .eq('username', username)
      .single();

    if (checkError || !existingUser) {
      console.log('⚠️ User not found. Creating new user...');
      
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          username: username,
          password: hashedPassword,
          full_name: username === 'wawan' ? 'H. Wawan Yogaswara, S.Pd, M.Pd' : username,
          role: 'pengawas',
          nip: username === 'wawan' ? '196805301994121001' : '',
          rank: username === 'wawan' ? 'Pembina Utama Muda, IV/c' : '',
          office_name: 'Cabang Dinas Pendidikan Wilayah XI',
          office_address: 'Jl. A.Yani No. 23 Kel. Paminggir Kec. Garut Kota',
          home_address: username === 'wawan' ? 'Griya Surya Indah No. 50' : '',
          phone: username === 'wawan' ? '087733438282' : ''
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating user:', createError.message);
        return;
      }

      console.log('✅ New user created successfully!');
      console.log('   Username:', username);
      console.log('   Password:', newPassword);
      console.log('   User ID:', newUser.id);
    } else {
      // Update existing user password
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('username', username)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating password:', updateError.message);
        return;
      }

      console.log('✅ Password updated successfully!');
      console.log('   Username:', username);
      console.log('   New Password:', newPassword);
      console.log('   User ID:', updatedUser.id);
      console.log('   Full Name:', updatedUser.full_name);
    }

    console.log('\\n🎉 Setup complete! You can now login with:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${newPassword}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

resetUserPassword();