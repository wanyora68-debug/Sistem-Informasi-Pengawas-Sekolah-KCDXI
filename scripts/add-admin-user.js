#!/usr/bin/env node

/**
 * Add Admin User to Supabase
 * Script untuk menambahkan user admin dengan password yang diketahui
 */

import 'dotenv/config';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const SUPABASE_URL = process.env.SUPABASE_DATABASE_URL;

if (!SUPABASE_URL) {
  console.error('❌ ERROR: SUPABASE_DATABASE_URL not found in .env');
  process.exit(1);
}

const sql = postgres(SUPABASE_URL);

async function addAdminUser() {
  try {
    console.log('🔗 Connecting to Supabase...');
    
    // Hash password "admin123"
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('🔐 Password hashed successfully');

    // Delete existing admin user if exists
    await sql`DELETE FROM users WHERE username = 'admin'`;
    console.log('🗑️ Removed existing admin user');

    // Insert new admin user
    const result = await sql`
      INSERT INTO users (username, password, full_name, role)
      VALUES ('admin', ${hashedPassword}, 'Administrator', 'admin')
      RETURNING id, username, full_name, role
    `;

    console.log('✅ Admin user created successfully:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log('   ID:', result[0].id);

    await sql.end();
    console.log('\n🎉 Setup complete! You can now login with admin/admin123');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addAdminUser();