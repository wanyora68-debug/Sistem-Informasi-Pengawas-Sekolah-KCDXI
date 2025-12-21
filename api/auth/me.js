import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'schoolguard-secret-key-2024');
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Return user info from token
    const user = {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      fullName: decoded.username === 'admin' ? 'Administrator' : 'H. Wawan Yogaswara, S.Pd, M.Pd',
      email: decoded.username === 'admin' ? 'admin@disdik.jabar.go.id' : 'wawan.yogaswara@disdik.jabar.go.id'
    };

    res.status(200).json({ user });

  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}