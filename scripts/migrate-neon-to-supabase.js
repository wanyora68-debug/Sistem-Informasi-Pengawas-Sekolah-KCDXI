#!/usr/bin/env node

/**
 * 🔄 Migration Script: Neon → Supabase
 * 
 * Script untuk memindahkan semua data dari database Neon ke Supabase
 * Dengan backup dan verifikasi data
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

// Import schema
import { users, schools, tasks, events, supervisions, additionalTasks } from '../shared/schema.js';

console.log('🔄 Starting Neon → Supabase Migration...\n');

// Database connections
const NEON_URL = process.env.DATABASE_URL; // Current Neon database
const SUPABASE_URL = process.env.SUPABASE_DATABASE_URL; // New Supabase database

if (!NEON_URL) {
  console.error('❌ ERROR: DATABASE_URL (Neon) not found in environment variables');
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error('❌ ERROR: SUPABASE_DATABASE_URL not found in environment variables');
  console.log('💡 Please add SUPABASE_DATABASE_URL to your .env file');
  process.exit(1);
}

// Create database connections
const neonClient = postgres(NEON_URL);
const supabaseClient = postgres(SUPABASE_URL);

const neonDb = drizzle(neonClient);
const supabaseDb = drizzle(supabaseClient);

/**
 * Backup data to JSON files
 */
async function backupData() {
  console.log('📦 Creating backup of Neon data...');
  
  try {
    // Create backup directory
    const backupDir = 'backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `neon-backup-${timestamp}.json`);
    
    // Fetch all data from Neon
    const [
      usersData,
      schoolsData,
      tasksData,
      eventsData,
      supervisionsData,
      additionalTasksData
    ] = await Promise.all([
      neonDb.select().from(users),
      neonDb.select().from(schools),
      neonDb.select().from(tasks),
      neonDb.select().from(events),
      neonDb.select().from(supervisions),
      neonDb.select().from(additionalTasks)
    ]);
    
    const backup = {
      timestamp: new Date().toISOString(),
      source: 'neon',
      data: {
        users: usersData,
        schools: schoolsData,
        tasks: tasksData,
        events: eventsData,
        supervisions: supervisionsData,
        additionalTasks: additionalTasksData
      },
      counts: {
        users: usersData.length,
        schools: schoolsData.length,
        tasks: tasksData.length,
        events: eventsData.length,
        supervisions: supervisionsData.length,
        additionalTasks: additionalTasksData.length
      }
    };
    
    // Save backup to file
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log('✅ Backup created successfully!');
    console.log(`📁 File: ${backupFile}`);
    console.log('📊 Data counts:');
    Object.entries(backup.counts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} records`);
    });
    
    return backup;
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    throw error;
  }
}

/**
 * Migrate data to Supabase
 */
async function migrateData(backup) {
  console.log('\n🚀 Starting data migration to Supabase...');
  
  try {
    const { data } = backup;
    
    // Migrate in order (respecting foreign key constraints)
    console.log('👤 Migrating users...');
    if (data.users.length > 0) {
      await supabaseDb.insert(users).values(data.users);
      console.log(`✅ Migrated ${data.users.length} users`);
    }
    
    console.log('🏫 Migrating schools...');
    if (data.schools.length > 0) {
      await supabaseDb.insert(schools).values(data.schools);
      console.log(`✅ Migrated ${data.schools.length} schools`);
    }
    
    console.log('📋 Migrating tasks...');
    if (data.tasks.length > 0) {
      await supabaseDb.insert(tasks).values(data.tasks);
      console.log(`✅ Migrated ${data.tasks.length} tasks`);
    }
    
    console.log('📅 Migrating events...');
    if (data.events.length > 0) {
      await supabaseDb.insert(events).values(data.events);
      console.log(`✅ Migrated ${data.events.length} events`);
    }
    
    console.log('🔍 Migrating supervisions...');
    if (data.supervisions.length > 0) {
      await supabaseDb.insert(supervisions).values(data.supervisions);
      console.log(`✅ Migrated ${data.supervisions.length} supervisions`);
    }
    
    console.log('➕ Migrating additional tasks...');
    if (data.additionalTasks.length > 0) {
      await supabaseDb.insert(additionalTasks).values(data.additionalTasks);
      console.log(`✅ Migrated ${data.additionalTasks.length} additional tasks`);
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

/**
 * Verify migrated data
 */
async function verifyData(originalBackup) {
  console.log('\n🔍 Verifying migrated data...');
  
  try {
    // Fetch data from Supabase
    const [
      supabaseUsers,
      supabaseSchools,
      supabaseTasks,
      supabaseEvents,
      supabaseSupervisions,
      supabaseAdditionalTasks
    ] = await Promise.all([
      supabaseDb.select().from(users),
      supabaseDb.select().from(schools),
      supabaseDb.select().from(tasks),
      supabaseDb.select().from(events),
      supabaseDb.select().from(supervisions),
      supabaseDb.select().from(additionalTasks)
    ]);
    
    const supabaseCounts = {
      users: supabaseUsers.length,
      schools: supabaseSchools.length,
      tasks: supabaseTasks.length,
      events: supabaseEvents.length,
      supervisions: supabaseSupervisions.length,
      additionalTasks: supabaseAdditionalTasks.length
    };
    
    console.log('📊 Verification Results:');
    console.log('Table\t\tNeon\tSupabase\tStatus');
    console.log('─'.repeat(50));
    
    let allMatch = true;
    Object.entries(originalBackup.counts).forEach(([table, neonCount]) => {
      const supabaseCount = supabaseCounts[table];
      const status = neonCount === supabaseCount ? '✅ Match' : '❌ Mismatch';
      console.log(`${table.padEnd(15)}\t${neonCount}\t${supabaseCount}\t\t${status}`);
      
      if (neonCount !== supabaseCount) {
        allMatch = false;
      }
    });
    
    if (allMatch) {
      console.log('\n🎉 All data verified successfully!');
      console.log('✅ Migration completed without data loss');
    } else {
      console.log('\n⚠️  Data count mismatch detected!');
      console.log('Please check the migration logs for errors');
    }
    
    return allMatch;
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    throw error;
  }
}

/**
 * Main migration function
 */
async function main() {
  try {
    console.log('🔗 Testing database connections...');
    
    // Test Neon connection
    await neonClient`SELECT 1`;
    console.log('✅ Neon connection OK');
    
    // Test Supabase connection
    await supabaseClient`SELECT 1`;
    console.log('✅ Supabase connection OK');
    
    // Step 1: Backup data from Neon
    const backup = await backupData();
    
    // Step 2: Migrate data to Supabase
    await migrateData(backup);
    
    // Step 3: Verify migration
    const verified = await verifyData(backup);
    
    if (verified) {
      console.log('\n🎊 MIGRATION SUCCESSFUL! 🎊');
      console.log('Next steps:');
      console.log('1. Update DATABASE_URL to point to Supabase');
      console.log('2. Test application with Supabase');
      console.log('3. Deploy to Vercel');
    } else {
      console.log('\n⚠️  MIGRATION COMPLETED WITH WARNINGS');
      console.log('Please review the verification results above');
    }
    
  } catch (error) {
    console.error('\n💥 MIGRATION FAILED!');
    console.error('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check database URLs are correct');
    console.log('2. Ensure Supabase schema is created');
    console.log('3. Check network connectivity');
    process.exit(1);
  } finally {
    // Close connections
    await neonClient.end();
    await supabaseClient.end();
  }
}

// Run migration
main();