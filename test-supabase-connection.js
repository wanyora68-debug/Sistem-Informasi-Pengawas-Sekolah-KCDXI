#!/usr/bin/env node

/**
 * 🔗 Test Supabase Connection
 * Simple test untuk koneksi Supabase
 */

import postgres from 'postgres';

// Hardcode connection string untuk testing
const SUPABASE_URL = 'postgresql://postgres:yogaswara6@db.fmxeboullgcewzjpql.supabase.co:5432/postgres';

console.log('🔗 Testing Supabase connection...');
console.log('📡 URL:', SUPABASE_URL.substring(0, 50) + '...');

const client = postgres(SUPABASE_URL);

async function test() {
  try {
    const result = await client`SELECT 1 as test`;
    console.log('✅ Connection successful!');
    console.log('📊 Result:', result);
    
    // Test tables
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('📋 Tables found:');
    tables.forEach(t => console.log(`   - ${t.table_name}`));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await client.end();
  }
}

test();