const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { id } = req.query;

    if (req.method === 'DELETE') {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Schools DELETE error:', error);
        return res.status(500).json({ error: 'Failed to delete school' });
      }

      res.json({ message: 'School deleted successfully' });

    } else if (req.method === 'PUT') {
      const { name, address, contact, principalName, principalNip } = req.body;

      const { data: school, error } = await supabase
        .from('schools')
        .update({
          name,
          address,
          contact,
          principal_name: principalName,
          principal_nip: principalNip
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Schools PUT error:', error);
        return res.status(500).json({ error: 'Failed to update school' });
      }

      res.json(school);

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Schools API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}