const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'GET') {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Tasks GET error:', error);
        return res.status(500).json({ error: 'Failed to fetch tasks' });
      }

      res.json(tasks || []);

    } else if (req.method === 'POST') {
      const { title, description, dueDate, priority, schoolId } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          title,
          description,
          due_date: dueDate,
          priority: priority || 'medium',
          school_id: schoolId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Tasks POST error:', error);
        return res.status(500).json({ error: 'Failed to create task' });
      }

      res.status(201).json(task);

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Tasks API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}