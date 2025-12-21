#!/usr/bin/env node

/**
 * User Management Script
 * Provides command-line interface for managing users
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// File paths
const LOCAL_DB_PATH = path.join(__dirname, '..', 'local-database.json');

// Load database
function loadDatabase() {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error.message);
  }
  
  // Return default structure
  return {
    users: [
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
      }
    ],
    schools: [],
    tasks: [],
    supervisions: [],
    events: [],
    additionalTasks: []
  };
}

// Save database
function saveDatabase(db) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving database:', error.message);
    return false;
  }
}

// List all users
function listUsers() {
  const db = loadDatabase();
  const users = db.users || [];
  
  console.log('\n=== DAFTAR USER ===');
  console.log('ID\tUsername\tNama Lengkap\t\tRole\tStatus');
  console.log('-----------------------------------------------------------');
  
  users.forEach(user => {
    console.log(`${user.id}\t${user.username}\t${user.fullName.padEnd(20)}\t${user.role}\t${user.status}`);
  });
  
  console.log(`\nTotal: ${users.length} user\n`);
}

// Add new user
function addUser() {
  const db = loadDatabase();
  
  console.log('\n=== TAMBAH USER BARU ===');
  
  rl.question('Username: ', (username) => {
    if (!username) {
      console.log('Username wajib diisi!');
      return mainMenu();
    }
    
    // Check if username exists
    if (db.users.some(user => user.username === username)) {
      console.log('Username sudah digunakan!');
      return mainMenu();
    }
    
    rl.question('Nama Lengkap: ', (fullName) => {
      if (!fullName) {
        console.log('Nama lengkap wajib diisi!');
        return mainMenu();
      }
      
      rl.question('Role (admin/pengawas) [pengawas]: ', (role) => {
        role = role || 'pengawas';
        if (!['admin', 'pengawas'].includes(role)) {
          console.log('Role harus admin atau pengawas!');
          return mainMenu();
        }
        
        rl.question('NIP: ', (nip) => {
          rl.question('Pangkat/Golongan: ', (rank) => {
            rl.question('Nomor Telepon: ', (phone) => {
              rl.question('Email: ', (email) => {
                rl.question('Unit Kerja: ', (department) => {
                  
                  const newUser = {
                    id: Date.now().toString(),
                    username,
                    fullName,
                    role,
                    nip: nip || '',
                    rank: rank || '',
                    phone: phone || '',
                    email: email || '',
                    department: department || 'Cabang Dinas Pendidikan Wilayah XI',
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  };
                  
                  db.users.push(newUser);
                  
                  if (saveDatabase(db)) {
                    console.log(`\nUser ${fullName} berhasil ditambahkan!`);
                  } else {
                    console.log('Gagal menyimpan user!');
                  }
                  
                  mainMenu();
                });
              });
            });
          });
        });
      });
    });
  });
}

// Delete user
function deleteUser() {
  const db = loadDatabase();
  
  console.log('\n=== HAPUS USER ===');
  listUsers();
  
  rl.question('Masukkan ID user yang akan dihapus: ', (userId) => {
    const user = db.users.find(u => u.id === userId);
    
    if (!user) {
      console.log('User tidak ditemukan!');
      return mainMenu();
    }
    
    if (user.username === 'admin') {
      console.log('User admin tidak dapat dihapus!');
      return mainMenu();
    }
    
    rl.question(`Yakin ingin menghapus user "${user.fullName}"? (y/N): `, (confirm) => {
      if (confirm.toLowerCase() === 'y') {
        db.users = db.users.filter(u => u.id !== userId);
        
        if (saveDatabase(db)) {
          console.log(`User ${user.fullName} berhasil dihapus!`);
        } else {
          console.log('Gagal menghapus user!');
        }
      } else {
        console.log('Penghapusan dibatalkan.');
      }
      
      mainMenu();
    });
  });
}

// Update user status
function updateUserStatus() {
  const db = loadDatabase();
  
  console.log('\n=== UPDATE STATUS USER ===');
  listUsers();
  
  rl.question('Masukkan ID user: ', (userId) => {
    const userIndex = db.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      console.log('User tidak ditemukan!');
      return mainMenu();
    }
    
    const user = db.users[userIndex];
    
    if (user.username === 'admin') {
      console.log('Status user admin tidak dapat diubah!');
      return mainMenu();
    }
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    rl.question(`Ubah status "${user.fullName}" menjadi ${newStatus}? (y/N): `, (confirm) => {
      if (confirm.toLowerCase() === 'y') {
        db.users[userIndex].status = newStatus;
        db.users[userIndex].updatedAt = new Date().toISOString();
        
        if (saveDatabase(db)) {
          console.log(`Status user ${user.fullName} berhasil diubah menjadi ${newStatus}!`);
        } else {
          console.log('Gagal mengubah status user!');
        }
      } else {
        console.log('Perubahan status dibatalkan.');
      }
      
      mainMenu();
    });
  });
}

// Reset user password
function resetPassword() {
  const db = loadDatabase();
  
  console.log('\n=== RESET PASSWORD ===');
  listUsers();
  
  rl.question('Masukkan ID user: ', (userId) => {
    const user = db.users.find(u => u.id === userId);
    
    if (!user) {
      console.log('User tidak ditemukan!');
      return mainMenu();
    }
    
    rl.question('Password baru: ', (newPassword) => {
      if (!newPassword || newPassword.length < 6) {
        console.log('Password minimal 6 karakter!');
        return mainMenu();
      }
      
      rl.question('Konfirmasi password: ', (confirmPassword) => {
        if (newPassword !== confirmPassword) {
          console.log('Password tidak cocok!');
          return mainMenu();
        }
        
        // In a real app, hash the password
        console.log(`Password user ${user.fullName} berhasil direset!`);
        console.log('(Dalam implementasi nyata, password akan di-hash dan disimpan ke database)');
        
        mainMenu();
      });
    });
  });
}

// Export users to CSV
function exportUsers() {
  const db = loadDatabase();
  const users = db.users || [];
  
  const csvHeader = 'ID,Username,Nama Lengkap,Role,NIP,Pangkat,Telepon,Email,Unit Kerja,Status,Terdaftar,Update Terakhir\n';
  const csvRows = users.map(user => {
    return [
      user.id,
      user.username,
      `"${user.fullName}"`,
      user.role,
      user.nip || '',
      `"${user.rank || ''}"`,
      user.phone || '',
      user.email || '',
      `"${user.department || ''}"`,
      user.status,
      new Date(user.createdAt).toLocaleDateString('id-ID'),
      user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('id-ID') : ''
    ].join(',');
  }).join('\n');
  
  const csvContent = csvHeader + csvRows;
  const filename = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
  
  try {
    fs.writeFileSync(filename, csvContent);
    console.log(`\nData user berhasil diekspor ke: ${filename}`);
    console.log(`Total: ${users.length} user\n`);
  } catch (error) {
    console.log('Gagal mengekspor data user:', error.message);
  }
  
  mainMenu();
}

// Show user statistics
function showStatistics() {
  const db = loadDatabase();
  const users = db.users || [];
  
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    admin: users.filter(u => u.role === 'admin').length,
    pengawas: users.filter(u => u.role === 'pengawas').length
  };
  
  console.log('\n=== STATISTIK USER ===');
  console.log(`Total User: ${stats.total}`);
  console.log(`User Aktif: ${stats.active}`);
  console.log(`User Tidak Aktif: ${stats.inactive}`);
  console.log(`Administrator: ${stats.admin}`);
  console.log(`Pengawas: ${stats.pengawas}`);
  console.log('');
  
  mainMenu();
}

// Main menu
function mainMenu() {
  console.log('\n=== MANAJEMEN USER ===');
  console.log('1. Lihat Daftar User');
  console.log('2. Tambah User Baru');
  console.log('3. Hapus User');
  console.log('4. Update Status User');
  console.log('5. Reset Password');
  console.log('6. Ekspor Data User');
  console.log('7. Statistik User');
  console.log('0. Keluar');
  
  rl.question('\nPilih menu (0-7): ', (choice) => {
    switch (choice) {
      case '1':
        listUsers();
        mainMenu();
        break;
      case '2':
        addUser();
        break;
      case '3':
        deleteUser();
        break;
      case '4':
        updateUserStatus();
        break;
      case '5':
        resetPassword();
        break;
      case '6':
        exportUsers();
        break;
      case '7':
        showStatistics();
        break;
      case '0':
        console.log('Terima kasih!');
        rl.close();
        break;
      default:
        console.log('Pilihan tidak valid!');
        mainMenu();
    }
  });
}

// Start the application
console.log('=== SISTEM MANAJEMEN USER ===');
console.log('Cabang Dinas Pendidikan Wilayah XI');
console.log('Garut, Jawa Barat\n');

mainMenu();