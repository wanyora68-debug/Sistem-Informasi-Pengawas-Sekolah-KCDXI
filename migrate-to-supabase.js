#!/usr/bin/env node

/**
 * 🔄 Migration Script: Neon → Supabase
 * Script sederhana untuk memindahkan data
 */

import 'dotenv/config';
import postgres from 'postgres';
import fs from 'fs';

console.log('🔄 Starting Neon → Supabase Migration...\n');

const NEON_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.SUPABASE_DATABASE_URL;

if (!NEON_URL) {
  console.error('❌ ERROR: DATABASE_URL (Neon) not found in .env');
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error('❌ ERROR: SUPABASE_DATABASE_URL not found in .env');
  console.log('💡 Please update SUPABASE_DATABASE_URL in .env file');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('📡 Neon URL:', NEON_URL.substring(0, 30) + '...');
console.log('📡 Supabase URL:', SUPABASE_URL.substring(0, 30) + '...');
console.log('🔍 Full Supabase URL:', SUPABASE_URL);
console.log('');

const neonClient = postgres(NEON_URL);
const supabaseClient = postgres(SUPABASE_URL);

async function main() {
  try {
    // Test connections
    console.log('🔗 Testing connections...');
    await neonClient`SELECT 1`;
    console.log('✅ Neon connection OK');
    
    await supabaseClient`SELECT 1`;
    console.log('✅ Supabase connection OK\n');
    
    // Fetch data from Neon
    console.log('📥 Fetching data from Neon...');
    const [users, schools, tasks, events, supervisions, additionalTasks] = await Promise.all([
      neonClient`SELECT * FROM users ORDER BY created_at`,
      neonClient`SELECT * FROM schools ORDER BY created_at`,
      neonClient`SELECT * FROM tasks ORDER BY created_at`,
      neonClient`SELECT * FROM events ORDER BY created_at`,
      neonClient`SELECT * FROM supervisions ORDER BY created_at`,
      neonClient`SELECT * FROM additional_tasks ORDER BY created_at`
    ]);
    
    console.log('📊 Data counts:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Schools: ${schools.length}`);
    console.log(`   Tasks: ${tasks.length}`);
    console.log(`   Events: ${events.length}`);
    console.log(`   Supervisions: ${supervisions.length}`);
    console.log(`   Additional Tasks: ${additionalTasks.length}\n`);
    
    // Create backup
    const backup = {
      timestamp: new Date().toISOString(),
      data: { users, schools, tasks, events, supervisions, additionalTasks }
    };
    
    if (!fs.existsSync('backups')) fs.mkdirSync('backups');
    const backupFile = `backups/neon-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`💾 Backup saved: ${backupFile}\n`);
    
    // Migrate to Supabase
    console.log('📤 Migrating to Supabase...');
    
    // Users (skip admin to avoid conflict)
    const nonAdminUsers = users.filter(u => u.username !== 'admin');
    if (nonAdminUsers.length > 0) {
      await supabaseClient`INSERT INTO users ${supabaseClient(nonAdminUsers)}`;
      console.log(`✅ Users: ${nonAdminUsers.length} migrated (skipped admin)`);
    }
    
    if (schools.length > 0) {
      await supabaseClient`INSERT INTO schools ${supabaseClient(schools)}`;
      console.log(`✅ Schools: ${schools.length} migrated`);
    }
    
    if (tasks.length > 0) {
      await supabaseClient`INSERT INTO tasks ${supabaseClient(tasks)}`;
      console.log(`✅ Tasks: ${tasks.length} migrated`);
    }
    
    if (events.length > 0) {
      await supabaseClient`INSERT INTO events ${supabaseClient(events)}`;
      console.log(`✅ Events: ${events.length} migrated`);
    }
    
    if (supervisions.length > 0) {
      await supabaseClient`INSERT INTO supervisions ${supabaseClient(supervisions)}`;
      console.log(`✅ Supervisions: ${supervisions.length} migrated`);
    }
    
    if (additionalTasks.length > 0) {
      await supabaseClient`INSERT INTO additional_tasks ${supabaseClient(additionalTasks)}`;
      console.log(`✅ Additional Tasks: ${additionalTasks.length} migrated`);
    }
    
    // Verify
    console.log('\n🔍 Verifying migration...');
    const [vUsers, vSchools, vTasks, vEvents, vSupervisions, vAdditionalTasks] = await Promise.all([
      supabaseClient`SELECT COUNT(*) as count FROM users`,
      supabaseClient`SELECT COUNT(*) as count FROM schools`,
      supabaseClient`SELECT COUNT(*) as count FROM tasks`,
      supabaseClient`SELECT COUNT(*) as count FROM events`,
      supabaseClient`SELECT COUNT(*) as count FROM supervisions`,
      supabaseClient`SELECT COUNT(*) as count FROM additional_tasks`
    ]);
    
    console.log('📊 Supabase counts:');
    console.log(`   Users: ${vUsers[0].count}`);
    console.log(`   Schools: ${vSchools[0].count}`);
    console.log(`   Tasks: ${vTasks[0].count}`);
    console.log(`   Events: ${vEvents[0].count}`);
    console.log(`   Supervisions: ${vSupervisions[0].count}`);
    console.log(`   Additional Tasks: ${vAdditionalTasks[0].count}`);
    
    console.log('\n🎉 MIGRATION SUCCESSFUL! 🎉');
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

main();