const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'GET') {
      const { data: supervisions, error } = await supabase
        .from('supervisions')
        .select(`
          *,
          schools (
            id,
            name,
            address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supervisions GET error:', error);
        return res.status(500).json({ error: 'Failed to fetch supervisions' });
      }

      res.json(supervisions || []);

    } else if (req.method === 'POST') {
      const { 
        schoolId, 
        date, 
        type, 
        findings, 
        recommendations, 
        followUpActions,
        status 
      } = req.body;

      if (!schoolId || !date || !type) {
        return res.status(400).json({ error: 'School ID, date, and type are required' });
      }

      const { data: supervision, error } = await supabase
        .from('supervisions')
        .insert({
          school_id: schoolId,
          date,
          type,
          findings,
          recommendations,
          follow_up_actions: followUpActions,
          status: status || 'completed'
        })
        .select()
        .single();

      if (error) {
        console.error('Supervisions POST error:', error);
        return res.status(500).json({ error: 'Failed to create supervision' });
      }

      res.status(201).json(supervision);

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Supervisions API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}