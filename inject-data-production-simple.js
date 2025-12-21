// Script Sederhana untuk Inject Data ke Production
// Copy-paste script ini di Console browser production

console.log('🚀 Memulai inject data...');

// Data Schools dari localhost (17 sekolah)
const schools = [
  {"id":"1762699563468","name":"SDN 1 Garut","address":"Jl. Raya Garut No. 1","principal":"Drs. Ahmad Suryadi","phone":"0262-123456","email":"sdn1garut@gmail.com","created_at":"2024-11-09T14:39:23.468Z"},
  {"id":"1762699623789","name":"SMPN 2 Garut","address":"Jl. Pendidikan No. 15","principal":"Dra. Siti Nurhasanah","phone":"0262-234567","email":"smpn2garut@gmail.com","created_at":"2024-11-09T14:40:23.789Z"},
  {"id":"1762699683901","name":"SMAN 1 Garut","address":"Jl. Ahmad Yani No. 50","principal":"Dr. Budi Santoso, M.Pd","phone":"0262-345678","email":"sman1garut@gmail.com","created_at":"2024-11-09T14:41:23.901Z"},
  {"id":"1762699744012","name":"SMKN 4 Garut","address":"Jl. Raya Garut No. 200, Garut","principal":"Drs. Asep Wijaya, M.Pd","phone":"0262-234578","email":"smkn4garut@gmail.com","created_at":"2024-11-09T14:42:24.012Z"},
  {"id":"1762699804123","name":"SDN 2 Garut","address":"Jl. Merdeka No. 10","principal":"Dra. Rina Marlina","phone":"0262-456789","email":"sdn2garut@gmail.com","created_at":"2024-11-09T14:43:24.123Z"},
  {"id":"1762699864234","name":"SMPN 1 Garut","address":"Jl. Cimanuk No. 25","principal":"Drs. Hendra Gunawan","phone":"0262-567890","email":"smpn1garut@gmail.com","created_at":"2024-11-09T14:44:24.234Z"},
  {"id":"1762699924345","name":"SMAN 2 Garut","address":"Jl. Veteran No. 30","principal":"Dr. Andi Wijaya, M.Pd","phone":"0262-678901","email":"sman2garut@gmail.com","created_at":"2024-11-09T14:45:24.345Z"},
  {"id":"1762699984456","name":"SMKN 1 Garut","address":"Jl. Industri No. 40","principal":"Drs. Dedi Supriadi","phone":"0262-789012","email":"smkn1garut@gmail.com","created_at":"2024-11-09T14:46:24.456Z"},
  {"id":"1762700044567","name":"SDN 3 Garut","address":"Jl. Pahlawan No. 5","principal":"Dra. Yuli Astuti","phone":"0262-890123","email":"sdn3garut@gmail.com","created_at":"2024-11-09T14:47:24.567Z"},
  {"id":"1762700104678","name":"SMPN 3 Garut","address":"Jl. Sudirman No. 20","principal":"Drs. Eko Prasetyo","phone":"0262-901234","email":"smpn3garut@gmail.com","created_at":"2024-11-09T14:48:24.678Z"},
  {"id":"1762700164789","name":"SMAN 3 Garut","address":"Jl. Gatot Subroto No. 35","principal":"Dr. Firman Hidayat, M.Pd","phone":"0262-012345","email":"sman3garut@gmail.com","created_at":"2024-11-09T14:49:24.789Z"},
  {"id":"1762700224890","name":"SMKN 2 Garut","address":"Jl. Diponegoro No. 45","principal":"Drs. Gunawan Setiawan","phone":"0262-123457","email":"smkn2garut@gmail.com","created_at":"2024-11-09T14:50:24.890Z"},
  {"id":"1762700284901","name":"SDN 4 Garut","address":"Jl. Kartini No. 8","principal":"Dra. Sari Dewi","phone":"0262-234568","email":"sdn4garut@gmail.com","created_at":"2024-11-09T14:51:24.901Z"},
  {"id":"1762700345012","name":"SMPN 4 Garut","address":"Jl. Cut Nyak Dien No. 12","principal":"Drs. Hadi Purnomo","phone":"0262-345679","email":"smpn4garut@gmail.com","created_at":"2024-11-09T14:52:25.012Z"},
  {"id":"1762700405123","name":"SMAN 4 Garut","address":"Jl. RA Kartini No. 18","principal":"Dr. Iwan Setiawan, M.Pd","phone":"0262-456780","email":"sman4garut@gmail.com","created_at":"2024-11-09T14:53:25.123Z"},
  {"id":"1762700465234","name":"SMKN 3 Garut","address":"Jl. Dewi Sartika No. 22","principal":"Drs. Joko Widodo","phone":"0262-567891","email":"smkn3garut@gmail.com","created_at":"2024-11-09T14:54:25.234Z"},
  {"id":"1762700525345","name":"SDN 5 Garut","address":"Jl. Teuku Umar No. 7","principal":"Dra. Kartika Sari","phone":"0262-678902","email":"sdn5garut@gmail.com","created_at":"2024-11-09T14:55:25.345Z"}
];

// Data Users dari localhost (10 users)
const users = [
  {"id":"1762696424712","username":"admin","name":"Administrator","role":"admin","nip":"","position":"Pengawas Sekolah","photo":"/uploads/1762984516465-513200650.jpg","created_at":"2025-11-09T13:53:44.712Z"},
  {"id":"1762696525337","username":"wawan","name":"H. Wawan Yogaswara, S.Pd, M.Pd","role":"user","nip":"196805301994121001","position":"Pembina Utama Muda, IV/c","photo":"/uploads/1762830374284-750171039.jpg","created_at":"2025-11-09T13:55:25.337Z"},
  {"id":"1762837068152","username":"yenihandayani","name":"Yeni Handayani","role":"user","nip":"197707282003122004","position":"Pembina Utama Muda/ IV/c","photo":"/uploads/1762837258917-674271850.png","created_at":"2025-11-11T04:57:48.152Z"},
  {"id":"1763344071064","username":"Itasdik","name":"Iman tasdik","role":"user","nip":"197202231996031002","position":"Pembina Tk. I/IV B","photo":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...","created_at":"2025-11-15T01:47:51.064Z"}
];

// Simpan ke localStorage
localStorage.setItem('schools_data', JSON.stringify(schools));
localStorage.setItem('users_data', JSON.stringify(users));

console.log('✅ Data schools disimpan:', schools.length, 'records');
console.log('✅ Data users disimpan:', users.length, 'records');

// Cek apakah data tersimpan
console.log('');
console.log('📊 Verifikasi data tersimpan:');
console.log('- schools_data:', localStorage.getItem('schools_data') ? 'OK' : 'GAGAL');
console.log('- users_data:', localStorage.getItem('users_data') ? 'OK' : 'GAGAL');

console.log('');
console.log('🎉 SELESAI! Refresh halaman untuk melihat data real.');
console.log('Tekan Ctrl+R atau F5 untuk refresh');
