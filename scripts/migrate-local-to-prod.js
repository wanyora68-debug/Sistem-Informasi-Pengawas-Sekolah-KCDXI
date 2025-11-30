#!/usr/bin/env node

/**
 * Migration Script: Local Database to Production
 * 
 * This script migrates data from local-database.json to production database
 * Run: node scripts/migrate-local-to-prod.js
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Check if DATABASE_URL is configured
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('example')) {
  console.error('❌ DATABASE_URL is not configured!');
  console.error('');
  console.error('Please configure DATABASE_URL in .env file:');
  console.error('1. Create a free database at https://neon.tech or https://supabase.com');
  console.error('2. Copy the connection string');
  console.error('3. Add to .env file: DATABASE_URL=postgresql://...');
  console.error('');
  process.exit(1);
}

// Read local database
const localDbPath = join(rootDir, 'local-database.json');
if (!existsSync(localDbPath)) {
  console.error('❌ local-database.json not found!');
  process.exit(1);
}

const localData = JSON.parse(readFileSync(localDbPath, 'utf-8'));

console.log('📊 Local Database Summary:');
console.log(`   Users: ${localData.users?.length || 0}`);
console.log(`   Schools: ${localData.schools?.length || 0}`);
console.log(`   Tasks: ${localData.tasks?.length || 0}`);
console.log(`   Supervisions: ${localData.supervisions?.length || 0}`);
console.log(`   Additional Tasks: ${localData.additionalTasks?.length || 0}`);
console.log(`   Events: ${localData.events?.length || 0}`);
console.log('');

// Import database after checking DATABASE_URL
const { db } = await import('../server/db.js');
const schema = await import('../shared/schema.js');
const { users, schools, tasks, supervisions, additionalTasks, events } = schema;

async function migrateData() {
  console.log('🚀 Starting migration...\n');

  try {
    // Migrate Users
    if (localData.users && localData.users.length > 0) {
      console.log('👥 Migrating users...');
      for (const user of localData.users) {
        try {
          // Convert photoUrl from file path to null (will need to re-upload)
          const userData = {
            id: user.id,
            username: user.username,
            password: user.password, // Already hashed
            fullName: user.fullName,
            role: user.role,
            nip: user.nip || null,
            rank: user.rank || null,
            officeName: user.officeName || null,
            officeAddress: user.officeAddress || null,
            homeAddress: user.homeAddress || null,
            phone: user.phone || null,
            photoUrl: null, // Will need to re-upload photos
            createdAt: new Date(user.createdAt),
          };

          await db.insert(users).values(userData).onConflictDoNothing();
          console.log(`   ✓ ${user.username} (${user.fullName})`);
        } catch (error) {
          console.log(`   ⚠️  ${user.username} - ${error.message}`);
        }
      }
      console.log('');
    }

    // Migrate Schools
    if (localData.schools && localData.schools.length > 0) {
      console.log('🏫 Migrating schools...');
      for (const school of localData.schools) {
        try {
          const schoolData = {
            id: school.id,
            userId: school.userId,
            name: school.name,
            address: school.address || null,
            contact: school.contact || null,
            principalName: school.principalName || null,
            principalNip: school.principalNip || null,
            createdAt: new Date(school.createdAt),
          };

          await db.insert(schools).values(schoolData).onConflictDoNothing();
          console.log(`   ✓ ${school.name}`);
        } catch (error) {
          console.log(`   ⚠️  ${school.name} - ${error.message}`);
        }
      }
      console.log('');
    }

    // Migrate Tasks
    if (localData.tasks && localData.tasks.length > 0) {
      console.log('📋 Migrating tasks...');
      for (const task of localData.tasks) {
        try {
          const taskData = {
            id: task.id,
            userId: task.userId,
            title: task.title,
            category: task.category || null,
            description: task.description || null,
            completed: task.completed || false,
            photo1: task.photo1 || null, // Copy base64 photos
            photo2: task.photo2 || null,
            date: new Date(task.date),
            createdAt: new Date(task.createdAt),
          };

          await db.insert(tasks).values(taskData).onConflictDoNothing();
          console.log(`   ✓ ${task.title}`);
        } catch (error) {
          console.log(`   ⚠️  ${task.title} - ${error.message}`);
        }
      }
      console.log('');
    }

    // Migrate Supervisions
    if (localData.supervisions && localData.supervisions.length > 0) {
      console.log('📝 Migrating supervisions...');
      for (const supervision of localData.supervisions) {
        try {
          const supervisionData = {
            id: supervision.id,
            userId: supervision.userId,
            schoolId: supervision.schoolId,
            type: supervision.type,
            date: new Date(supervision.date),
            teacherName: supervision.teacherName || null,
            teacherNip: supervision.teacherNip || null,
            findings: supervision.findings || null,
            recommendations: supervision.recommendations || null,
            photo1: supervision.photo1 || null, // Copy base64 photos
            photo2: supervision.photo2 || null,
            createdAt: new Date(supervision.createdAt),
          };

          await db.insert(supervisions).values(supervisionData).onConflictDoNothing();
          console.log(`   ✓ ${supervision.type} - ${supervision.teacherName}`);
        } catch (error) {
          console.log(`   ⚠️  ${supervision.type} - ${error.message}`);
        }
      }
      console.log('');
    }

    // Migrate Additional Tasks
    if (localData.additionalTasks && localData.additionalTasks.length > 0) {
      console.log('📌 Migrating additional tasks...');
      for (const additionalTask of localData.additionalTasks) {
        try {
          const additionalTaskData = {
            id: additionalTask.id,
            userId: additionalTask.userId,
            name: additionalTask.name,
            date: new Date(additionalTask.date),
            location: additionalTask.location || null,
            organizer: additionalTask.organizer || null,
            description: additionalTask.description || null,
            photo1: additionalTask.photo1 || null, // Copy base64 photos
            photo2: additionalTask.photo2 || null,
            createdAt: new Date(additionalTask.createdAt),
          };

          await db.insert(additionalTasks).values(additionalTaskData).onConflictDoNothing();
          console.log(`   ✓ ${additionalTask.name}`);
        } catch (error) {
          console.log(`   ⚠️  ${additionalTask.name} - ${error.message}`);
        }
      }
      console.log('');
    }

    // Migrate Events
    if (localData.events && localData.events.length > 0) {
      console.log('📅 Migrating events...');
      for (const event of localData.events) {
        try {
          const eventData = {
            id: event.id,
            userId: event.userId,
            schoolId: event.schoolId || null,
            title: event.title,
            date: new Date(event.date),
            time: event.time || null,
            description: event.description || null,
            reminded: event.reminded || false,
            createdAt: new Date(event.createdAt),
          };

          await db.insert(events).values(eventData).onConflictDoNothing();
          console.log(`   ✓ ${event.title}`);
        } catch (error) {
          console.log(`   ⚠️  ${event.title} - ${error.message}`);
        }
      }
      console.log('');
    }

    console.log('✅ Migration completed successfully!\n');
    console.log('📝 Next Steps:');
    console.log('   1. Deploy to Render (git push)');
    console.log('   2. Login with existing credentials');
    console.log('   3. Re-upload profile photos');
    console.log('   4. Re-upload documentation photos (if needed)');
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
