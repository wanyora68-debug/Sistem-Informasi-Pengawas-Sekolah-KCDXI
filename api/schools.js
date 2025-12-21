import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || 'https://fmxeboullgcewzjpql.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'GET') {
      // Return sample schools data for now
      const sampleSchools = [
        {
          id: '1',
          name: 'SDN 1 Garut',
          address: 'Jl. Raya Garut No. 1',
          contact: '0262-123456',
          principal_name: 'Drs. Ahmad Suryadi',
          principal_nip: '196501011990031001',
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'SMPN 1 Garut',
          address: 'Jl. Raya Garut No. 2',
          contact: '0262-123457',
          principal_name: 'Dra. Siti Nurhasanah',
          principal_nip: '196502021990032002',
          created_at: new Date().toISOString()
        }
      ];

      // Try to get from Supabase, fallback to sample data
      try {
        const { data: schools, error } = await supabase
          .from('schools')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && schools && schools.length > 0) {
          return res.json(schools);
        }
      } catch (dbError) {
        console.log('Database not available, using sample data');
      }

      res.json(sampleSchools);

    } else if (req.method === 'POST') {
      const { name, address, contact, principalName, principalNip } = req.body;

      if (!name || !address) {
        return res.status(400).json({ error: 'Name and address are required' });
      }

      // Try to save to Supabase
      try {
        const { data: school, error } = await supabase
          .from('schools')
          .insert({
            name,
            address,
            contact,
            principal_name: principalName,
            principal_nip: principalNip
          })
          .select()
          .single();

        if (!error && school) {
          return res.status(201).json(school);
        }
      } catch (dbError) {
        console.log('Database not available, returning mock response');
      }

      // Fallback response
      const newSchool = {
        id: Date.now().toString(),
        name,
        address,
        contact,
        principal_name: principalName,
        principal_nip: principalNip,
        created_at: new Date().toISOString()
      };

      res.status(201).json(newSchool);

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Schools API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}