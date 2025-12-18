#!/usr/bin/env node

/**
 * Migrate Local Data to Supabase
 * Script untuk migrasi data dari local-database.json ke Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  try {
    console.log('🚀 Starting data migration to Supabase...');
    
    // Read local database
    const localDbPath = path.join(path.dirname(__dirname), 'local-database.json');
    if (!fs.existsSync(localDbPath)) {
      console.log('❌ local-database.json not found');
      return;
    }

    const localData = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    console.log('📖 Local database loaded');

    // 1. Migrate Users (skip admin as it already exists)
    if (localData.users && localData.users.length > 0) {
      console.log('\\n👥 Migrating users...');
      
      for (const user of localData.users) {
        if (user.username === 'admin') {
          console.log('⏭️ Skipping admin user (already exists)');
          continue;
        }

        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('username', user.username)
          .single();

        if (existingUser) {
          console.log(`⏭️ User ${user.username} already exists`);
          continue;
        }

        const { error } = await supabase
          .from('users')
          .insert({
            id: user.id,
            username: user.username,
            password: user.password,
            full_name: user.fullName,
            role: user.role,
            nip: user.nip || '',
            rank: user.rank || '',
            office_name: user.officeName || '',
            office_address: user.officeAddress || '',
            home_address: user.homeAddress || '',
            phone: user.phone || '',
            photo_url: user.photoUrl || '',
            created_at: user.createdAt || new Date().toISOString()
          });

        if (error) {
          console.error(`❌ Error migrating user ${user.username}:`, error.message);
        } else {
          console.log(`✅ User ${user.username} migrated successfully`);
        }
      }
    }

    // 2. Migrate Schools
    if (localData.schools && localData.schools.length > 0) {
      console.log('\\n🏫 Migrating schools...');
      
      for (const school of localData.schools) {
        const { data: existingSchool } = await supabase
          .from('schools')
          .select('id')
          .eq('id', school.id)
          .single();

        if (existingSchool) {
          console.log(`⏭️ School ${school.name} already exists`);
          continue;
        }

        const { error } = await supabase
          .from('schools')
          .insert({
            id: school.id,
            name: school.name,
            address: school.address,
            contact: school.contact || '',
            principal_name: school.principalName || '',
            principal_nip: school.principalNip || '',
            created_at: school.createdAt || new Date().toISOString()
          });

        if (error) {
          console.error(`❌ Error migrating school ${school.name}:`, error.message);
        } else {
          console.log(`✅ School ${school.name} migrated successfully`);
        }
      }
    }

    // 3. Migrate Tasks
    if (localData.tasks && localData.tasks.length > 0) {
      console.log('\\n📋 Migrating tasks...');
      
      for (const task of localData.tasks) {
        const { data: existingTask } = await supabase
          .from('tasks')
          .select('id')
          .eq('id', task.id)
          .single();

        if (existingTask) {
          console.log(`⏭️ Task ${task.title} already exists`);
          continue;
        }

        const { error } = await supabase
          .from('tasks')
          .insert({
            id: task.id,
            title: task.title,
            description: task.description || '',
            due_date: task.dueDate,
            priority: task.priority || 'medium',
            status: task.status || 'pending',
            school_id: task.schoolId,
            created_at: task.createdAt || new Date().toISOString()
          });

        if (error) {
          console.error(`❌ Error migrating task ${task.title}:`, error.message);
        } else {
          console.log(`✅ Task ${task.title} migrated successfully`);
        }
      }
    }

    // 4. Migrate Supervisions
    if (localData.supervisions && localData.supervisions.length > 0) {
      console.log('\\n🔍 Migrating supervisions...');
      
      for (const supervision of localData.supervisions) {
        const { data: existingSupervision } = await supabase
          .from('supervisions')
          .select('id')
          .eq('id', supervision.id)
          .single();

        if (existingSupervision) {
          console.log(`⏭️ Supervision ${supervision.id} already exists`);
          continue;
        }

        const { error } = await supabase
          .from('supervisions')
          .insert({
            id: supervision.id,
            school_id: supervision.schoolId,
            date: supervision.date,
            type: supervision.type,
            findings: supervision.findings || '',
            recommendations: supervision.recommendations || '',
            follow_up_actions: supervision.followUpActions || '',
            status: supervision.status || 'completed',
            created_at: supervision.createdAt || new Date().toISOString()
          });

        if (error) {
          console.error(`❌ Error migrating supervision ${supervision.id}:`, error.message);
        } else {
          console.log(`✅ Supervision ${supervision.id} migrated successfully`);
        }
      }
    }

    console.log('\\n🎉 Data migration completed successfully!');
    console.log('\\n📊 Summary:');
    console.log(`   Users: ${localData.users?.length || 0}`);
    console.log(`   Schools: ${localData.schools?.length || 0}`);
    console.log(`   Tasks: ${localData.tasks?.length || 0}`);
    console.log(`   Supervisions: ${localData.supervisions?.length || 0}`);

  } catch (error) {
    console.error('❌ Migration error:', error.message);
  }
}

migrateData();