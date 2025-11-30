#!/usr/bin/env node

/**
 * Sync Photos Script: Update production database with photos from local
 * 
 * This script reads local-database.json and updates production records with photos
 * Run: node scripts/sync-photos-to-prod.js
 */

import { readFileSync, existsSync } from 'fs';
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
console.log(`   Supervisions with photos: ${localData.supervisions?.filter(s => s.photo1 || s.photo2).length || 0}`);
console.log(`   Tasks with photos: ${localData.tasks?.filter(t => t.photo1 || t.photo2).length || 0}`);
console.log(`   Additional Tasks with photos: ${localData.additionalTasks?.filter(t => t.photo1 || t.photo2).length || 0}`);
console.log('');

async function syncPhotos() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✓ Connected to production database\n');

    let updated = 0;

    // Update Supervisions
    if (localData.supervisions) {
      console.log('📝 Updating supervisions with photos...');
      for (const supervision of localData.supervisions) {
        if (supervision.photo1 || supervision.photo2) {
          try {
            await client.query(
              'UPDATE supervisions SET photo1 = $1, photo2 = $2 WHERE id = $3',
              [supervision.photo1, supervision.photo2, supervision.id]
            );
            console.log(`   ✓ Updated supervision ID ${supervision.id}`);
            updated++;
          } catch (error) {
            console.log(`   ⚠️  Failed to update supervision ID ${supervision.id}`);
          }
        }
      }
    }

    // Update Tasks
    if (localData.tasks) {
      console.log('\n📋 Updating tasks with photos...');
      for (const task of localData.tasks) {
        if (task.photo1 || task.photo2) {
          try {
            await client.query(
              'UPDATE tasks SET photo1 = $1, photo2 = $2 WHERE id = $3',
              [task.photo1, task.photo2, task.id]
            );
            console.log(`   ✓ Updated task ID ${task.id}`);
            updated++;
          } catch (error) {
            console.log(`   ⚠️  Failed to update task ID ${task.id}`);
          }
        }
      }
    }

    // Update Additional Tasks
    if (localData.additionalTasks) {
      console.log('\n📌 Updating additional tasks with photos...');
      for (const additionalTask of localData.additionalTasks) {
        if (additionalTask.photo1 || additionalTask.photo2) {
          try {
            await client.query(
              'UPDATE additional_tasks SET photo1 = $1, photo2 = $2 WHERE id = $3',
              [additionalTask.photo1, additionalTask.photo2, additionalTask.id]
            );
            console.log(`   ✓ Updated additional task ID ${additionalTask.id}`);
            updated++;
          } catch (error) {
            console.log(`   ⚠️  Failed to update additional task ID ${additionalTask.id}`);
          }
        }
      }
    }

    console.log(`\n✅ Successfully updated ${updated} records with photos!\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run sync
syncPhotos()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
