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
    if (req.method === 'GET') {
      // Return sample tasks data
      const sampleTasks = [
        {
          id: '1',
          title: 'Supervisi Akademik SDN 1 Garut',
          description: 'Melakukan supervisi akademik untuk meningkatkan kualitas pembelajaran',
          category: 'Pendampingan',
          completed: false,
          date: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Penyusunan Laporan Bulanan',
          description: 'Menyusun laporan kegiatan supervisi bulan ini',
          category: 'Pelaporan',
          completed: true,
          date: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ];

      res.json(sampleTasks);

    } else if (req.method === 'POST') {
      const { title, description, category, date } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const newTask = {
        id: Date.now().toString(),
        title,
        description: description || '',
        category: category || 'Perencanaan',
        completed: false,
        date: date || new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      res.status(201).json(newTask);

    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;

      // Mock update response
      const updatedTask = {
        id,
        ...updateData,
        updated_at: new Date().toISOString()
      };

      res.status(200).json(updatedTask);

    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      res.status(200).json({ message: 'Task deleted successfully' });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Tasks API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}