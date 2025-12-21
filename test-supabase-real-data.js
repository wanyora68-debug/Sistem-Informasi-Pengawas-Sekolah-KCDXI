import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseData() {
  console.log('🔗 Testing Supabase connection and data...');
  
  try {
    // Test schools data
    console.log('\n📚 Testing schools data...');
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('*')
      .limit(5);
    
    if (schoolsError) {
      console.error('❌ Schools error:', schoolsError);
    } else {
      console.log('✅ Schools data:', schools?.length || 0, 'records');
      if (schools && schools.length > 0) {
        console.log('First school:', schools[0]);
      }
    }
    
    // Test users data
    console.log('\n👥 Testing users data...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.error('❌ Users error:', usersError);
    } else {
      console.log('✅ Users data:', users?.length || 0, 'records');
      if (users && users.length > 0) {
        console.log('First user:', users[0]);
      }
    }
    
    // Test tasks data
    console.log('\n📋 Testing tasks data...');
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(5);
    
    if (tasksError) {
      console.error('❌ Tasks error:', tasksError);
    } else {
      console.log('✅ Tasks data:', tasks?.length || 0, 'records');
      if (tasks && tasks.length > 0) {
        console.log('First task:', tasks[0]);
      }
    }
    
    // Test supervisions data
    console.log('\n🔍 Testing supervisions data...');
    const { data: supervisions, error: supervisionsError } = await supabase
      .from('supervisions')
      .select('*')
      .limit(5);
    
    if (supervisionsError) {
      console.error('❌ Supervisions error:', supervisionsError);
    } else {
      console.log('✅ Supervisions data:', supervisions?.length || 0, 'records');
      if (supervisions && supervisions.length > 0) {
        console.log('First supervision:', supervisions[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testSupabaseData();