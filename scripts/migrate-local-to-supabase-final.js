/**
 * Script untuk migrate data dari local-database.json ke Supabase
 * Jalankan: node scripts/migrate-local-to-supabase-final.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Warna untuk console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NzY0NzI3LCJleHAiOjIwNTAzNDA3Mjd9.Ql9QZqZ9QmZ9QmZ9QmZ9QmZ9QmZ9QmZ9QmZ9QmZ9Qm';

async function migrateData() {
  log('\n🚀 Starting Migration: Local Database → Supabase\n', 'cyan');

  try {
    // 1. Load local database
    log('📂 Loading local database...', 'blue');
    const localDbPath = path.join(__dirname, '..', 'local-database.json');
    
    if (!fs.existsSync(localDbPath)) {
      log('❌ local-database.json not found!', 'red');
      log('   Please make sure the file exists at: ' + localDbPath, 'yellow');
      process.exit(1);
    }

    const localData = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    log('✅ Local database loaded successfully', 'green');
    log(`   Users: ${localData.users?.length || 0}`, 'cyan');
    log(`   Schools: ${localData.schools?.length || 0}`, 'cyan');
    log(`   Supervisions: ${localData.supervisions?.length || 0}`, 'cyan');
    log(`   Tasks: ${localData.tasks?.length || 0}`, 'cyan');

    // 2. Initialize Supabase client
    log('\n🔌 Connecting to Supabase...', 'blue');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    log('✅ Connected to Supabase', 'green');

    // 3. Migrate Users
    if (localData.users && localData.users.length > 0) {
      log('\n👥 Migrating users...', 'blue');
      
      for (const user of localData.users) {
        const { error } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            username: user.username,
            password: user.password || '$2b$10$default',
            full_name: user.fullName,
            role: user.role,
            nip: user.nip || null,
            rank: user.rank || null,
            phone: user.phone || null,
            email: user.email || null,
            department: user.department || null,
            status: user.status || 'active',
            last_login: user.lastLogin || null,
            created_at: user.createdAt || new Date().toISOString(),
            updated_at: user.updatedAt || new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          log(`   ⚠️  Error migrating user ${user.username}: ${error.message}`, 'yellow');
        } else {
          log(`   ✅ Migrated: ${user.username} (${user.role})`, 'green');
        }
      }
      log(`✅ Users migration completed: ${localData.users.length} users`, 'green');
    }

    // 4. Migrate Schools
    if (localData.schools && localData.schools.length > 0) {
      log('\n🏫 Migrating schools...', 'blue');
      
      for (const school of localData.schools) {
        const { error } = await supabase
          .from('schools')
          .upsert({
            id: school.id,
            name: school.name,
            address: school.address || null,
            principal: school.principal || null,
            phone: school.phone || null,
            email: school.email || null,
            type: school.type || null,
            status: school.status || 'active',
            created_at: school.createdAt || new Date().toISOString(),
            updated_at: school.updatedAt || new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          log(`   ⚠️  Error migrating school ${school.name}: ${error.message}`, 'yellow');
        } else {
          log(`   ✅ Migrated: ${school.name}`, 'green');
        }
      }
      log(`✅ Schools migration completed: ${localData.schools.length} schools`, 'green');
    }

    // 5. Migrate Supervisions
    if (localData.supervisions && localData.supervisions.length > 0) {
      log('\n📋 Migrating supervisions...', 'blue');
      
      for (const supervision of localData.supervisions) {
        const { error } = await supabase
          .from('supervisions')
          .upsert({
            id: supervision.id,
            user_id: supervision.userId,
            school_id: supervision.schoolId,
            date: supervision.date,
            type: supervision.type,
            notes: supervision.notes || null,
            status: supervision.status || 'completed',
            created_at: supervision.createdAt || new Date().toISOString(),
            updated_at: supervision.updatedAt || new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          log(`   ⚠️  Error migrating supervision: ${error.message}`, 'yellow');
        } else {
          log(`   ✅ Migrated supervision: ${supervision.id}`, 'green');
        }
      }
      log(`✅ Supervisions migration completed: ${localData.supervisions.length} records`, 'green');
    }

    // 6. Migrate Tasks
    if (localData.tasks && localData.tasks.length > 0) {
      log('\n📝 Migrating tasks...', 'blue');
      
      for (const task of localData.tasks) {
        const { error } = await supabase
          .from('tasks')
          .upsert({
            id: task.id,
            user_id: task.userId,
            school_id: task.schoolId,
            title: task.title,
            description: task.description || null,
            type: task.type,
            status: task.status || 'pending',
            due_date: task.dueDate || null,
            completed_at: task.completedAt || null,
            created_at: task.createdAt || new Date().toISOString(),
            updated_at: task.updatedAt || new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          log(`   ⚠️  Error migrating task: ${error.message}`, 'yellow');
        } else {
          log(`   ✅ Migrated task: ${task.title}`, 'green');
        }
      }
      log(`✅ Tasks migration completed: ${localData.tasks.length} tasks`, 'green');
    }

    // 7. Summary
    log('\n' + '='.repeat(60), 'cyan');
    log('🎉 MIGRATION COMPLETED SUCCESSFULLY!', 'green');
    log('='.repeat(60), 'cyan');
    log('\n📊 Migration Summary:', 'cyan');
    log(`   ✅ Users: ${localData.users?.length || 0}`, 'green');
    log(`   ✅ Schools: ${localData.schools?.length || 0}`, 'green');
    log(`   ✅ Supervisions: ${localData.supervisions?.length || 0}`, 'green');
    log(`   ✅ Tasks: ${localData.tasks?.length || 0}`, 'green');
    log('\n🚀 Next Steps:', 'cyan');
    log('   1. Verify data in Supabase dashboard', 'blue');
    log('   2. Test application with production database', 'blue');
    log('   3. Deploy to Vercel', 'blue');
    log('\n');

  } catch (error) {
    log('\n❌ Migration failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    log('\nStack trace:', 'yellow');
    console.error(error);
    process.exit(1);
  }
}

// Run migration
migrateData();
