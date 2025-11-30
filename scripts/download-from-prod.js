#!/usr/bin/env node

/**
 * Download Data Script: Production to Localhost
 * 
 * This script downloads all data from production database (Neon)
 * and saves it to local-database.json for offline use
 * 
 * Run: node scripts/download-from-prod.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const { Client } = pg;

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Check if DATABASE_URL is configured
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('example')) {
  console.error('❌ DATABASE_URL is not configured!');
  console.error('Please configure DATABASE_URL in .env file');
  process.exit(1);
}

async function downloadData() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✓ Connected to production database (Neon)\n');

    // Backup existing local database
    const localDbPath = join(rootDir, 'local-database.json');
    if (existsSync(localDbPath)) {
      const backupPath = join(rootDir, `local-database.backup-${Date.now()}.json`);
      const existingData = readFileSync(localDbPath, 'utf-8');
      writeFileSync(backupPath, existingData);
      console.log(`✓ Backed up existing local database to: ${backupPath}\n`);
    }

    console.log('📥 Downloading data from production...\n');

    // Download Users
    console.log('👥 Downloading users...');
    const usersResult = await client.query('SELECT * FROM users ORDER BY id');
    const users = usersResult.rows.map(row => ({
      id: row.id,
      username: row.username,
      password: row.password,
      fullName: row.full_name,
      role: row.role,
      nip: row.nip,
      rank: row.rank,
      officeName: row.office_name,
      officeAddress: row.office_address,
      homeAddress: row.home_address,
      phone: row.phone,
      photoUrl: row.photo_url,
      createdAt: row.created_at.toISOString(),
    }));
    console.log(`   ✓ Downloaded ${users.length} users`);

    // Download Schools
    console.log('🏫 Downloading schools...');
    const schoolsResult = await client.query('SELECT * FROM schools ORDER BY id');
    const schools = schoolsResult.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      address: row.address,
      contact: row.contact,
      principalName: row.principal_name,
      principalNip: row.principal_nip,
      createdAt: row.created_at.toISOString(),
    }));
    console.log(`   ✓ Downloaded ${schools.length} schools`);

    // Download Tasks
    console.log('📋 Downloading tasks...');
    const tasksResult = await client.query('SELECT * FROM tasks ORDER BY id');
    const tasks = tasksResult.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      category: row.category,
      description: row.description,
      completed: row.completed,
      photo1: row.photo1,
      photo2: row.photo2,
      date: row.date.toISOString(),
      createdAt: row.created_at.toISOString(),
    }));
    console.log(`   ✓ Downloaded ${tasks.length} tasks`);

    // Download Supervisions
    console.log('📝 Downloading supervisions...');
    const supervisionsResult = await client.query('SELECT * FROM supervisions ORDER BY id');
    const supervisions = supervisionsResult.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      schoolId: row.school_id,
      type: row.type,
      date: row.date.toISOString(),
      teacherName: row.teacher_name,
      teacherNip: row.teacher_nip,
      findings: row.findings,
      recommendations: row.recommendations,
      photo1: row.photo1,
      photo2: row.photo2,
      createdAt: row.created_at.toISOString(),
    }));
    console.log(`   ✓ Downloaded ${supervisions.length} supervisions`);

    // Download Additional Tasks
    console.log('📌 Downloading additional tasks...');
    const additionalTasksResult = await client.query('SELECT * FROM additional_tasks ORDER BY id');
    const additionalTasks = additionalTasksResult.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      date: row.date.toISOString(),
      location: row.location,
      organizer: row.organizer,
      description: row.description,
      photo1: row.photo1,
      photo2: row.photo2,
      createdAt: row.created_at.toISOString(),
    }));
    console.log(`   ✓ Downloaded ${additionalTasks.length} additional tasks`);

    // Download Events
    console.log('📅 Downloading events...');
    const eventsResult = await client.query('SELECT * FROM events ORDER BY id');
    const events = eventsResult.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      schoolId: row.school_id,
      title: row.title,
      date: row.date.toISOString(),
      time: row.time,
      description: row.description,
      reminded: row.reminded,
      createdAt: row.created_at.toISOString(),
    }));
    console.log(`   ✓ Downloaded ${events.length} events`);

    // Create local database object
    const localDatabase = {
      users,
      schools,
      tasks,
      supervisions,
      additionalTasks,
      events,
    };

    // Save to local-database.json
    writeFileSync(localDbPath, JSON.stringify(localDatabase, null, 2));
    console.log(`\n✅ Successfully downloaded all data to local-database.json!\n`);

    // Summary
    console.log('📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Schools: ${schools.length}`);
    console.log(`   Tasks: ${tasks.length}`);
    console.log(`   Supervisions: ${supervisions.length}`);
    console.log(`   Additional Tasks: ${additionalTasks.length}`);
    console.log(`   Events: ${events.length}`);
    console.log('');
    console.log('🎉 You can now use localhost with production data!');
    console.log('   Run: npm start');
    console.log('   Open: http://localhost:5000');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run download
downloadData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
