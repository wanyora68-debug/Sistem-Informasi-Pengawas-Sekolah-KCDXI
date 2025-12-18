import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmxeboullgcewzjpql.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

async function testSupabase() {
  try {
    console.log('🔗 Testing Supabase SDK connection...');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test simple query
    const { data, error } = await supabase
      .from('users')
      .select('id, username')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase error:', error.message);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Sample data:', data);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testSupabase();