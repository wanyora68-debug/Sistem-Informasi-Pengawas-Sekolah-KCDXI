export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    
    // In a real app, verify the token here
    // For now, we'll use localStorage simulation
    
    if (req.method === 'GET') {
      // Get all users
      const users = getUsers();
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      // Create new user
      const { username, password, fullName, role, nip, rank, phone, email, department, status } = req.body;

      if (!username || !password || !fullName) {
        return res.status(400).json({ error: 'Username, password, dan nama lengkap wajib diisi' });
      }

      const users = getUsers();
      
      // Check if username exists
      if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: 'Username sudah digunakan' });
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        fullName,
        role: role || 'pengawas',
        nip: nip || '',
        rank: rank || '',
        phone: phone || '',
        email: email || '',
        department: department || '',
        status: status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      return res.status(201).json(newUser);
    }

    if (req.method === 'PUT') {
      // Update user
      const { id } = req.query;
      const updateData = req.body;

      const users = getUsers();
      const userIndex = users.findIndex(user => user.id === id);

      if (userIndex === -1) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }

      // Prevent updating admin username
      if (users[userIndex].username === 'admin' && updateData.username !== 'admin') {
        return res.status(400).json({ error: 'Username admin tidak dapat diubah' });
      }

      users[userIndex] = {
        ...users[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      saveUsers(users);

      return res.status(200).json(users[userIndex]);
    }

    if (req.method === 'DELETE') {
      // Delete user
      const { id } = req.query;

      const users = getUsers();
      const user = users.find(u => u.id === id);

      if (!user) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }

      if (user.username === 'admin') {
        return res.status(400).json({ error: 'User admin tidak dapat dihapus' });
      }

      const filteredUsers = users.filter(u => u.id !== id);
      saveUsers(filteredUsers);

      return res.status(200).json({ message: 'User berhasil dihapus' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Users API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper functions to simulate database operations
function getUsers() {
  try {
    // In a real app, this would query the database
    // For now, return default users
    return [
      {
        id: '1',
        username: 'admin',
        fullName: 'Administrator',
        role: 'admin',
        nip: '',
        rank: '',
        phone: '',
        email: 'admin@disdik.jabar.go.id',
        department: 'Cabang Dinas Pendidikan Wilayah XI',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        username: 'wawan',
        fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
        role: 'pengawas',
        nip: '196805301994121001',
        rank: 'Pembina Utama Muda, IV/c',
        phone: '087733438282',
        email: 'wawan.yogaswara@disdik.jabar.go.id',
        department: 'Cabang Dinas Pendidikan Wilayah XI',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

function saveUsers(users) {
  try {
    // In a real app, this would save to database
    console.log('Saving users:', users.length);
  } catch (error) {
    console.error('Error saving users:', error);
  }
}