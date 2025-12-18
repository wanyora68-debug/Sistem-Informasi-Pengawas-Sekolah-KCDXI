#!/usr/bin/env node

/**
 * 🔄 Simple Migration Script: Neon → Supabase
 * Script sederhana untuk memindahkan data dari Neon ke Supabase
 */

const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

console.log('🔄 Starting Neon → Supabase Migration...\n');

// Load environment variables
require('dotenv').config();

const NEON_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.SUPABASE_DATABASE_URL;

if (!NEON_URL) {
  console.error('❌ ERROR: DATABASE_URL (Neon) not found');
  console.log('💡 Please set DATABASE_URL in .env file');
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error('❌ ERROR: SUPABASE_DATABASE_URL not found');
  console.log('💡 Please set SUPABASE_DATABASE_URL in .env file');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('📡 Neon URL:', NEON_URL.substring(0, 30) + '...');
console.log('📡 Supabase URL:', SUPABASE_URL.substring(0, 30) + '...\n');

// Create database connections
const neonClient = postgres(NEON_URL);
const supabaseClient = postgres(SUPABASE_URL);

/**
 * Test database connections
 */
async function testConnections() {
  console.log('🔗 Testing database connections...');
  
  try {
    // Test Neon
    await neonClient`SELECT 1 as test`;
    console.log('✅ Neon connection OK');
    
    // Test Supabase
    await supabaseClient`SELECT 1 as test`;
    console.log('✅ Supabase connection OK\n');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    throw error;
  }
}

/**
 * Backup and migrate data
 */
async function migrateData() {
  console.log('📦 Starting data migration...\n');
  
  try {
    // 1. Fetch data from Neon
    console.log('📥 Fetching data from Neon...');
    
    const [users, schools, tasks, events, supervisions, additionalTasks] = await Promise.all([
      neonClient`SELECT * FROM users ORDER BY created_at`,
      neonClient`SELECT * FROM schools ORDER BY created_at`,
      neonClient`SELECT * FROM tasks ORDER BY created_at`,
      neonClient`SELECT * FROM events ORDER BY created_at`,
      neonClient`SELECT * FROM supervisions ORDER BY created_at`,
      neonClient`SELECT * FROM additional_tasks ORDER BY created_at`
    ]);
    
    console.log('📊 Data fetched:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Schools: ${schools.length}`);
    console.log(`   Tasks: ${tasks.length}`);
    console.log(`   Events: ${events.length}`);
    console.log(`   Supervisions: ${supervisions.length}`);
    console.log(`   Additional Tasks: ${additionalTasks.length}\n`);
    
    // 2. Create backup
    const backup = {
      timestamp: new Date().toISOString(),
      source: 'neon',
      data: { users, schools, tasks, events, supervisions, additionalTasks }
    };
    
    const backupFile = `backups/neon-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    if (!fs.existsSync('backups')) fs.mkdirSync('backups');
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`💾 Backup saved: ${backupFile}\n`);
    
    // 3. Migrate to Supabase (skip admin user to avoid conflict)
    console.log('📤 Migrating data to Supabase...');
    
    // Users (skip admin)
    const nonAdminUsers = users.filter(u => u.username !== 'admin');
    if (nonAdminUsers.length > 0) {
      await supabaseClient`INSERT INTO users ${supabaseClient(nonAdminUsers)}`;
      console.log(`✅ Migrated ${nonAdminUsers.length} users (skipped admin)`);
    }
    
    // Schools
    if (schools.length > 0) {
      await supabaseClient`INSERT INTO schools ${supabaseClient(schools)}`;
      console.log(`✅ Migrated ${schools.length} schools`);
    }
    
    // Tasks
    if (tasks.length > 0) {
      await supabaseClient`INSERT INTO tasks ${supabaseClient(tasks)}`;
      console.log(`✅ Migrated ${tasks.length} tasks`);
    }
    
    // Events
    if (events.length > 0) {
      await supabaseClient`INSERT INTO events ${supabaseClient(events)}`;
      console.log(`✅ Migrated ${events.length} events`);
    }
    
    // Supervisions
    if (supervisions.length > 0) {
      await supabaseClient`INSERT INTO supervisions ${supabaseClient(supervisions)}`;
      console.log(`✅ Migrated ${supervisions.length} supervisions`);
    }
    
    // Additional Tasks
    if (additionalTasks.length > 0) {
      await supabaseClient`INSERT INTO additional_tasks ${supabaseClient(additionalTasks)}`;
      console.log(`✅ Migrated ${additionalTasks.length} additional tasks`);
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

/**
 * Verify migration
 */
async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');
  
  try {
    const [users, schools, tasks, events, supervisions, additionalTasks] = await Promise.all([
      supabaseClient`SELECT COUNT(*) as count FROM users`,
      supabaseClient`SELECT COUNT(*) as count FROM schools`,
      supabaseClient`SELECT COUNT(*) as count FROM tasks`,
      supabaseClient`SELECT COUNT(*) as count FROM events`,
      supabaseClient`SELECT COUNT(*) as count FROM supervisions`,
      supabaseClient`SELECT COUNT(*) as count FROM additional_tasks`
    ]);
    
    console.log('📊 Supabase data counts:');
    console.log(`   Users: ${users[0].count}`);
    console.log(`   Schools: ${schools[0].count}`);
    console.log(`   Tasks: ${tasks[0].count}`);
    console.log(`   Events: ${events[0].count}`);
    console.log(`   Supervisions: ${supervisions[0].count}`);
    console.log(`   Additional Tasks: ${additionalTasks[0].count}`);
    
    console.log('\n✅ Migration verification completed!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await testConnections();
    await migrateData();
    await verifyMigration();
    
    console.log('\n🎊 MIGRATION SUCCESSFUL! 🎊');
    console.log('\nNext steps:');
    console.log('1. Update DATABASE_URL to Supabase in .env');
    console.log('2. Test application locally');
    console.log('3. Deploy to Vercel');
    
  } catch (error) {
    console.error('\n💥 MIGRATION FAILED!');
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await neonClient.end();
    await supabaseClient.end();
  }
}

// Run migration
main();