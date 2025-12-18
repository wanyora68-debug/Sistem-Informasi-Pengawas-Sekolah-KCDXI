#!/usr/bin/env node

/**
 * Add Sample Data to Supabase
 * Script untuk menambahkan data sample ke Supabase untuk testing
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSampleData() {
  try {
    console.log('🚀 Adding sample data to Supabase...');

    // 1. Add sample schools
    console.log('\\n🏫 Adding sample schools...');
    
    const sampleSchools = [
      {
        name: 'SDN 01 Garut',
        address: 'Jl. Ahmad Yani No. 123, Garut',
        contact: '0262-123456',
        principal_name: 'Drs. Ahmad Suryadi, M.Pd',
        principal_nip: '196501011990031001'
      },
      {
        name: 'SMPN 2 Garut',
        address: 'Jl. Pahlawan No. 45, Garut',
        contact: '0262-234567',
        principal_name: 'Hj. Siti Nurhasanah, S.Pd, M.M',
        principal_nip: '197203151998032002'
      },
      {
        name: 'SMKN 1 Garut',
        address: 'Jl. Raya Garut-Bandung Km. 5',
        contact: '0262-345678',
        principal_name: 'Dr. Bambang Sutrisno, M.Pd',
        principal_nip: '196812201994121001'
      }
    ];

    for (const school of sampleSchools) {
      const { data, error } = await supabase
        .from('schools')
        .insert(school)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error adding school ${school.name}:`, error.message);
      } else {
        console.log(`✅ Added school: ${school.name}`);
      }
    }

    // 2. Add sample tasks
    console.log('\\n📋 Adding sample tasks...');
    
    // Get first school ID for tasks
    const { data: schools } = await supabase
      .from('schools')
      .select('id')
      .limit(1);

    if (schools && schools.length > 0) {
      const schoolId = schools[0].id;
      
      const sampleTasks = [
        {
          title: 'Supervisi Pembelajaran',
          description: 'Melakukan supervisi pembelajaran di kelas 1-6',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          priority: 'high',
          status: 'pending',
          school_id: schoolId
        },
        {
          title: 'Evaluasi Kurikulum',
          description: 'Mengevaluasi implementasi kurikulum merdeka',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          priority: 'medium',
          status: 'pending',
          school_id: schoolId
        },
        {
          title: 'Monitoring Sarana Prasarana',
          description: 'Pemeriksaan kondisi sarana dan prasarana sekolah',
          due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
          priority: 'low',
          status: 'pending',
          school_id: schoolId
        }
      ];

      for (const task of sampleTasks) {
        const { data, error } = await supabase
          .from('tasks')
          .insert(task)
          .select()
          .single();

        if (error) {
          console.error(`❌ Error adding task ${task.title}:`, error.message);
        } else {
          console.log(`✅ Added task: ${task.title}`);
        }
      }
    }

    // 3. Add sample supervision
    console.log('\\n🔍 Adding sample supervision...');
    
    if (schools && schools.length > 0) {
      const schoolId = schools[0].id;
      
      const sampleSupervision = {
        school_id: schoolId,
        date: new Date().toISOString().split('T')[0], // Today's date
        type: 'Supervisi Akademik',
        findings: 'Pembelajaran sudah berjalan dengan baik. Guru menggunakan metode yang variatif.',
        recommendations: 'Tingkatkan penggunaan media pembelajaran digital.',
        follow_up_actions: 'Pelatihan penggunaan teknologi dalam pembelajaran.',
        status: 'completed'
      };

      const { data, error } = await supabase
        .from('supervisions')
        .insert(sampleSupervision)
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding supervision:', error.message);
      } else {
        console.log('✅ Added sample supervision');
      }
    }

    console.log('\\n🎉 Sample data added successfully!');
    console.log('\\n📊 You can now test the application with:');
    console.log('   - Login: admin / admin123');
    console.log('   - View schools, tasks, and supervisions');
    console.log('   - Add new data through the UI');

  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
  }
}

addSampleData();