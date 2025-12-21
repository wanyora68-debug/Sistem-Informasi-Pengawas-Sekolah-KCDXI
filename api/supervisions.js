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
      // Return sample supervisions data
      const sampleSupervisions = [
        {
          id: '1',
          school_id: '1',
          school_name: 'SDN 1 Garut',
          type: 'Akademik',
          date: new Date().toISOString(),
          teacher_name: 'Ibu Siti Aminah',
          teacher_nip: '196701011990032001',
          findings: 'Pembelajaran sudah sesuai dengan RPP, namun perlu peningkatan dalam penggunaan media pembelajaran',
          recommendations: 'Disarankan untuk menggunakan media pembelajaran yang lebih interaktif',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          school_id: '2',
          school_name: 'SMPN 1 Garut',
          type: 'Manajerial',
          date: new Date().toISOString(),
          teacher_name: 'Bapak Ahmad Fauzi',
          teacher_nip: '196802021990031002',
          findings: 'Administrasi sekolah sudah tertib, dokumentasi lengkap',
          recommendations: 'Pertahankan kualitas administrasi yang sudah baik',
          created_at: new Date().toISOString()
        }
      ];

      res.json(sampleSupervisions);

    } else if (req.method === 'POST') {
      const { school_id, type, date, teacher_name, teacher_nip, findings, recommendations } = req.body;

      if (!school_id || !type || !findings) {
        return res.status(400).json({ error: 'School ID, type, and findings are required' });
      }

      const newSupervision = {
        id: Date.now().toString(),
        school_id,
        type,
        date: date || new Date().toISOString(),
        teacher_name: teacher_name || '',
        teacher_nip: teacher_nip || '',
        findings,
        recommendations: recommendations || '',
        created_at: new Date().toISOString()
      };

      res.status(201).json(newSupervision);

    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;

      // Mock update response
      const updatedSupervision = {
        id,
        ...updateData,
        updated_at: new Date().toISOString()
      };

      res.status(200).json(updatedSupervision);

    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      res.status(200).json({ message: 'Supervision deleted successfully' });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Supervisions API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}