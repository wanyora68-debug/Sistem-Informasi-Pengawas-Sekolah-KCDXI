// Script untuk mengekstrak data dari local-database.json
// dan membuat script migrasi untuk production

import fs from 'fs';

// Baca file local-database.json
const rawData = fs.readFileSync('local-database.json', 'utf8');
const localhostData = JSON.parse(rawData);

console.log('📊 Data yang ditemukan:');
console.log('- Users:', localhostData.users?.length || 0);
console.log('- Schools:', localhostData.schools?.length || 0);
console.log('- Tasks:', localhostData.tasks?.length || 0);
console.log('- Supervisions:', localhostData.supervisions?.length || 0);
console.log('- Additional Tasks:', localhostData.additionalTasks?.length || 0);

// Konversi data users
const convertedUsers = (localhostData.users || []).map(user => ({
  id: user.id,
  username: user.username,
  name: user.fullName || user.name,
  role: user.role === 'pengawas' ? 'user' : user.role,
  nip: user.nip || '',
  position: user.rank || user.position || 'Pengawas Sekolah',
  photo: user.photoUrl,
  created_at: user.createdAt || new Date().toISOString()
}));

// Konversi data schools
const convertedSchools = (localhostData.schools || []).map(school => ({
  id: school.id,
  name: school.name,
  address: school.address,
  principal: school.principal,
  phone: school.phone,
  email: school.email,
  created_at: school.createdAt || new Date().toISOString()
}));

// Konversi data tasks
const convertedTasks = (localhostData.tasks || []).map(task => ({
  id: task.id,
  user_id: task.userId || task.user_id,
  title: task.title,
  description: task.description,
  date: task.date,
  completed: task.completed || false,
  photo: task.photoUrl || task.photo,
  created_at: task.createdAt || new Date().toISOString()
}));

// Konversi data supervisions
const convertedSupervisions = (localhostData.supervisions || []).map(supervision => ({
  id: supervision.id,
  user_id: supervision.userId || supervision.user_id,
  school_id: supervision.schoolId || supervision.school_id,
  type: supervision.type || 'academic',
  date: supervision.date,
  findings: supervision.findings,
  recommendations: supervision.recommendations,
  photo: supervision.photoUrl || supervision.photo,
  created_at: supervision.createdAt || new Date().toISOString()
}));

// Konversi data additional tasks
const convertedAdditionalTasks = (localhostData.additionalTasks || []).map(task => ({
  id: task.id,
  user_id: task.userId || task.user_id,
  school_id: task.schoolId || task.school_id,
  title: task.title,
  description: task.description,
  date: task.date,
  status: task.status || 'completed',
  photo: task.photoUrl || task.photo,
  created_at: task.createdAt || new Date().toISOString()
}));

// Buat script untuk browser
const browserScript = `
// Script Migrasi Data Localhost ke Production
// Generated automatically - DO NOT EDIT

console.log('🚀 Memulai migrasi data...');

// Data Users (${convertedUsers.length} records)
const users = ${JSON.stringify(convertedUsers, null, 2)};
localStorage.setItem('users_data', JSON.stringify(users));
console.log('✅ Users migrated:', users.length, 'records');

// Data Schools (${convertedSchools.length} records)
const schools = ${JSON.stringify(convertedSchools, null, 2)};
localStorage.setItem('schools_data', JSON.stringify(schools));
console.log('✅ Schools migrated:', schools.length, 'records');

// Data Tasks (${convertedTasks.length} records)
const tasks = ${JSON.stringify(convertedTasks, null, 2)};
localStorage.setItem('tasks_data', JSON.stringify(tasks));
console.log('✅ Tasks migrated:', tasks.length, 'records');

// Data Supervisions (${convertedSupervisions.length} records)
const supervisions = ${JSON.stringify(convertedSupervisions, null, 2)};
localStorage.setItem('supervisions_data', JSON.stringify(supervisions));
console.log('✅ Supervisions migrated:', supervisions.length, 'records');

// Data Additional Tasks (${convertedAdditionalTasks.length} records)
const additionalTasks = ${JSON.stringify(convertedAdditionalTasks, null, 2)};
localStorage.setItem('additional_tasks_data', JSON.stringify(additionalTasks));
console.log('✅ Additional Tasks migrated:', additionalTasks.length, 'records');

console.log('');
console.log('🎉 MIGRASI SELESAI!');
console.log('📊 Total data yang dipindahkan:');
console.log('   - Users:', users.length);
console.log('   - Schools:', schools.length);
console.log('   - Tasks:', tasks.length);
console.log('   - Supervisions:', supervisions.length);
console.log('   - Additional Tasks:', additionalTasks.length);
console.log('');
console.log('🔄 Refresh halaman untuk melihat data real!');

// Auto refresh setelah 2 detik
setTimeout(() => {
  window.location.reload();
}, 2000);
`;

// Simpan script ke file
fs.writeFileSync('script-migrasi-production.js', browserScript);

console.log('');
console.log('✅ Script migrasi berhasil dibuat!');
console.log('📄 File: script-migrasi-production.js');
console.log('');
console.log('📋 Cara menggunakan:');
console.log('1. Buka aplikasi production di browser');
console.log('2. Buka Developer Console (F12)');
console.log('3. Copy-paste isi file script-migrasi-production.js');
console.log('4. Tekan Enter');
console.log('5. Tunggu hingga selesai dan halaman refresh otomatis');
