export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query; // User ID
    const { newPassword, confirmPassword } = req.body;

    // Validate input
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Password baru dan konfirmasi password wajib diisi' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Password dan konfirmasi password tidak cocok' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    // Get user
    const user = getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    // Reset password
    const success = resetUserPassword(id, newPassword);
    
    if (success) {
      return res.status(200).json({ 
        message: `Password user ${user.fullName} berhasil direset` 
      });
    } else {
      return res.status(500).json({ error: 'Gagal mereset password' });
    }

  } catch (error) {
    console.error('Reset Password API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function getUserById(userId) {
  // In a real app, this would query the database
  // Return sample user for demonstration
  const users = [
    {
      id: '1',
      username: 'admin',
      fullName: 'Administrator',
      role: 'admin'
    },
    {
      id: '2',
      username: 'wawan',
      fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
      role: 'pengawas'
    }
  ];

  return users.find(user => user.id === userId);
}

function resetUserPassword(userId, newPassword) {
  try {
    // In a real app, this would:
    // 1. Hash the new password
    // 2. Update the user record in database
    // 3. Log the password reset event
    // 4. Optionally send notification email
    
    console.log(`Resetting password for user ${userId}`);
    
    // Simulate password hashing and database update
    const hashedPassword = hashPassword(newPassword);
    console.log('New password hash:', hashedPassword);
    
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
}

function hashPassword(password) {
  // In a real app, use proper password hashing like bcrypt
  // This is just for demonstration
  return `hashed_${password}_${Date.now()}`;
}