#!/usr/bin/env node

/**
 * 🔄 Migration Script: Local JSON → Supabase
 * Migrate data dari local-database.json ke Supabase
 */

import 'dotenv/config';
import postgres from 'postgres';
import fs from 'fs';

console.log('🔄 Starting Local → Supabase Migration...\n');

const SUPABASE_URL = process.env.SUPABASE_DATABASE_URL;

if (!SUPABASE_URL) {
  console.error('❌ ERROR: SUPABASE_DATABASE_URL not found in .env');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('📡 Supabase URL:', SUPABASE_URL.substring(0, 50) + '...\n');

const supabaseClient = postgres(SUPABASE_URL);

async function main() {
  try {
    // Test Supabase connection
    console.log('🔗 Testing Supabase connection...');
    await supabaseClient`SELECT 1`;
    console.log('✅ Supabase connection OK\n');
    
    // Read local data
    console.log('📥 Reading local data...');
    const localData = JSON.parse(fs.readFileSync('local-database.json', 'utf8'));
    
    console.log('📊 Local data counts:');
    console.log(`   Users: ${localData.users?.length || 0}`);
    console.log(`   Schools: ${localData.schools?.length || 0}`);
    console.log(`   Tasks: ${localData.tasks?.length || 0}`);
    console.log(`   Events: ${localData.events?.length || 0}`);
    console.log(`   Supervisions: ${localData.supervisions?.length || 0}`);
    console.log(`   Additional Tasks: ${localData.additionalTasks?.length || 0}\n`);
    
    // Create backup
    const backup = {
      timestamp: new Date().toISOString(),
      source: 'local-database.json',
      data: localData
    };
    
    if (!fs.existsSync('backups')) fs.mkdirSync('backups');
    const backupFile = `backups/local-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`💾 Backup saved: ${backupFile}\n`);
    
    // Transform and migrate data
    console.log('📤 Migrating to Supabase...');
    
    // Users (skip admin to avoid conflict)
    if (localData.users && localData.users.length > 0) {
      const users = localData.users
        .filter(u => u.username !== 'admin')
        .map(u => ({
          id: u.id,
          username: u.username,
          password: u.password,
          full_name: u.fullName,
          role: u.role,
          nip: u.nip || null,
          rank: u.rank || null,
          office_name: u.officeName || null,
          office_address: u.officeAddress || null,
          home_address: u.homeAddress || null,
          phone: u.phone || null,
          photo_url: u.photoUrl || null,
          created_at: u.createdAt ? new Date(u.createdAt) : new Date()
        }));
      
      if (users.length > 0) {
        await supabaseClient`INSERT INTO users ${supabaseClient(users)}`;
        console.log(`✅ Users: ${users.length} migrated (skipped admin)`);
      }
    }
    
    // Schools
    if (localData.schools && localData.schools.length > 0) {
      const schools = localData.schools.map(s => ({
        id: s.id,
        user_id: s.userId,
        name: s.name,
        address: s.address,
        contact: s.contact,
        principal_name: s.principalName || null,
        principal_nip: s.principalNip || null,
        created_at: s.createdAt ? new Date(s.createdAt) : new Date()
      }));
      
      await supabaseClient`INSERT INTO schools ${supabaseClient(schools)}`;
      console.log(`✅ Schools: ${schools.length} migrated`);
    }
    
    // Tasks
    if (localData.tasks && localData.tasks.length > 0) {
      const tasks = localData.tasks.map(t => ({
        id: t.id,
        user_id: t.userId,
        title: t.title,
        category: t.category,
        description: t.description || null,
        completed: t.completed || false,
        photo1: t.photo1 || null,
        photo2: t.photo2 || null,
        date: t.date ? new Date(t.date) : new Date(),
        created_at: t.createdAt ? new Date(t.createdAt) : new Date()
      }));
      
      await supabaseClient`INSERT INTO tasks ${supabaseClient(tasks)}`;
      console.log(`✅ Tasks: ${tasks.length} migrated`);
    }
    
    // Events
    if (localData.events && localData.events.length > 0) {
      const events = localData.events.map(e => ({
        id: e.id,
        user_id: e.userId,
        school_id: e.schoolId || null,
        title: e.title,
        date: new Date(e.date),
        time: e.time,
        description: e.description || null,
        reminded: e.reminded || false,
        created_at: e.createdAt ? new Date(e.createdAt) : new Date()
      }));
      
      await supabaseClient`INSERT INTO events ${supabaseClient(events)}`;
      console.log(`✅ Events: ${events.length} migrated`);
    }
    
    // Supervisions
    if (localData.supervisions && localData.supervisions.length > 0) {
      const supervisions = localData.supervisions.map(s => ({
        id: s.id,
        user_id: s.userId,
        school_id: s.schoolId,
        type: s.type,
        date: s.date ? new Date(s.date) : new Date(),
        teacher_name: s.teacherName || null,
        teacher_nip: s.teacherNip || null,
        findings: s.findings,
        recommendations: s.recommendations || null,
        photo1: s.photo1 || null,
        photo2: s.photo2 || null,
        created_at: s.createdAt ? new Date(s.createdAt) : new Date()
      }));
      
      await supabaseClient`INSERT INTO supervisions ${supabaseClient(supervisions)}`;
      console.log(`✅ Supervisions: ${supervisions.length} migrated`);
    }
    
    // Additional Tasks
    if (localData.additionalTasks && localData.additionalTasks.length > 0) {
      const additionalTasks = localData.additionalTasks.map(t => ({
        id: t.id,
        user_id: t.userId,
        name: t.name,
        date: new Date(t.date),
        location: t.location,
        organizer: t.organizer,
        description: t.description,
        photo1: t.photo1 || null,
        photo2: t.photo2 || null,
        created_at: t.createdAt ? new Date(t.createdAt) : new Date()
      }));
      
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
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await supabaseClient.end();
  }
}

main();