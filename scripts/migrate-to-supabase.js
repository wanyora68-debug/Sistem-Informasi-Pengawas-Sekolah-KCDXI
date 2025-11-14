/**
 * Script untuk migrasi data dari local-database.json ke Supabase
 * 
 * Usage:
 * 1. Set DATABASE_URL di environment variable
 * 2. Run: node scripts/migrate-to-supabase.js
 */

const fs = require('fs');
const { Client } = require('pg');

async function migrateData() {
  console.log('🚀 Starting migration to Supabase...\n');

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('Please set DATABASE_URL first:');
    console.log('export DATABASE_URL="postgresql://postgres:password@..."');
    process.exit(1);
  }

  // Read local database
  let localData;
  try {
    localData = JSON.parse(fs.readFileSync('local-database.json', 'utf8'));
    console.log('✅ Local database loaded');
    console.log(`   Users: ${localData.users?.length || 0}`);
    console.log(`   Schools: ${localData.schools?.length || 0}`);
    console.log(`   Tasks: ${localData.tasks?.length || 0}`);
    console.log(`   Events: ${localData.events?.length || 0}`);
    console.log(`   Supervisions: ${localData.supervisions?.length || 0}`);
    console.log(`   Additional Tasks: ${localData.additionalTasks?.length || 0}\n`);
  } catch (error) {
    console.error('❌ Failed to read local-database.json:', error.message);
    process.exit(1);
  }

  // Connect to Supabase
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase\n');

    // Migrate users
    console.log('📤 Migrating users...');
    let userCount = 0;
    for (const user of localData.users || []) {
      try {
        await client.query(
          `INSERT INTO users (id, username, password, full_name, role, nip, rank, office_name, office_address, home_address, phone, photo_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (username) DO UPDATE SET
           full_name = EXCLUDED.full_name,
           role = EXCLUDED.role,
           nip = EXCLUDED.nip,
           rank = EXCLUDED.rank,
           phone = EXCLUDED.phone,
           photo_url = EXCLUDED.photo_url`,
          [
            user.id,
            user.username,
            user.password,
            user.fullName,
            user.role,
            user.nip,
            user.rank,
            user.officeName,
            user.officeAddress,
            user.homeAddress,
            user.phone,
            user.photoUrl,
            user.createdAt
          ]
        );
        userCount++;
      } catch (error) {
        console.error(`   ❌ Failed to migrate user ${user.username}:`, error.message);
      }
    }
    console.log(`✅ Migrated ${userCount} users\n`);

    // Migrate schools
    console.log('📤 Migrating schools...');
    let schoolCount = 0;
    for (const school of localData.schools || []) {
      try {
        await client.query(
          `INSERT INTO schools (id, user_id, name, address, contact, principal_name, principal_nip, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           address = EXCLUDED.address,
           contact = EXCLUDED.contact,
           principal_name = EXCLUDED.principal_name,
           principal_nip = EXCLUDED.principal_nip`,
          [
            school.id,
            school.userId,
            school.name,
            school.address,
            school.contact,
            school.principalName,
            school.principalNip,
            school.createdAt
          ]
        );
        schoolCount++;
      } catch (error) {
        console.error(`   ❌ Failed to migrate school ${school.name}:`, error.message);
      }
    }
    console.log(`✅ Migrated ${schoolCount} schools\n`);

    // Migrate tasks
    console.log('📤 Migrating tasks...');
    let taskCount = 0;
    for (const task of localData.tasks || []) {
      try {
        await client.query(
          `INSERT INTO tasks (id, user_id, title, category, description, completed, photo1, photo2, date, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           category = EXCLUDED.category,
           description = EXCLUDED.description,
           completed = EXCLUDED.completed`,
          [
            task.id,
            task.userId,
            task.title,
            task.category,
            task.description,
            task.completed,
            task.photo1,
            task.photo2,
            task.date,
            task.createdAt
          ]
        );
        taskCount++;
      } catch (error) {
        console.error(`   ❌ Failed to migrate task ${task.title}:`, error.message);
      }
    }
    console.log(`✅ Migrated ${taskCount} tasks\n`);

    // Migrate events
    console.log('📤 Migrating events...');
    let eventCount = 0;
    for (const event of localData.events || []) {
      try {
        await client.query(
          `INSERT INTO events (id, user_id, school_id, title, date, time, description, reminded, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           date = EXCLUDED.date,
           time = EXCLUDED.time,
           description = EXCLUDED.description`,
          [
            event.id,
            event.userId,
            event.schoolId,
            event.title,
            event.date,
            event.time,
            event.description,
            event.reminded,
            event.createdAt
          ]
        );
        eventCount++;
      } catch (error) {
        console.error(`   ❌ Failed to migrate event ${event.title}:`, error.message);
      }
    }
    console.log(`✅ Migrated ${eventCount} events\n`);

    // Migrate supervisions
    console.log('📤 Migrating supervisions...');
    let supervisionCount = 0;
    for (const supervision of localData.supervisions || []) {
      try {
        await client.query(
          `INSERT INTO supervisions (id, user_id, school_id, type, date, teacher_name, teacher_nip, findings, recommendations, photo1, photo2, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO UPDATE SET
           type = EXCLUDED.type,
           findings = EXCLUDED.findings,
           recommendations = EXCLUDED.recommendations`,
          [
            supervision.id,
            supervision.userId,
            supervision.schoolId,
            supervision.type,
            supervision.date,
            supervision.teacherName,
            supervision.teacherNip,
            supervision.findings,
            supervision.recommendations,
            supervision.photo1,
            supervision.photo2,
            supervision.createdAt
          ]
        );
        supervisionCount++;
      } catch (error) {
        console.error(`   ❌ Failed to migrate supervision:`, error.message);
      }
    }
    console.log(`✅ Migrated ${supervisionCount} supervisions\n`);

    // Migrate additional tasks
    console.log('📤 Migrating additional tasks...');
    let additionalTaskCount = 0;
    for (const task of localData.additionalTasks || []) {
      try {
        await client.query(
          `INSERT INTO additional_tasks (id, user_id, name, date, location, organizer, description, photo1, photo2, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           location = EXCLUDED.location,
           organizer = EXCLUDED.organizer,
           description = EXCLUDED.description`,
          [
            task.id,
            task.userId,
            task.name,
            task.date,
            task.location,
            task.organizer,
            task.description,
            task.photo1,
            task.photo2,
            task.createdAt
          ]
        );
        additionalTaskCount++;
      } catch (error) {
        console.error(`   ❌ Failed to migrate additional task ${task.name}:`, error.message);
      }
    }
    console.log(`✅ Migrated ${additionalTaskCount} additional tasks\n`);

    console.log('🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Schools: ${schoolCount}`);
    console.log(`   Tasks: ${taskCount}`);
    console.log(`   Events: ${eventCount}`);
    console.log(`   Supervisions: ${supervisionCount}`);
    console.log(`   Additional Tasks: ${additionalTaskCount}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ Connection closed');
  }
}

// Run migration
migrateData();
