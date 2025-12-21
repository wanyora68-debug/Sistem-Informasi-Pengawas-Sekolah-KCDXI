-- 🚀 MIGRASI DATA SIMPLE - TANPA ERROR
-- Script yang kompatibel dengan struktur tabel Supabase yang ada

-- Hapus data lama
TRUNCATE TABLE additional_tasks CASCADE;
TRUNCATE TABLE supervisions CASCADE;
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE schools CASCADE;
TRUNCATE TABLE users CASCADE;

-- ========================================
-- INSERT DATA USERS (4 records)
-- Password untuk semua: admin123
-- ========================================
INSERT INTO users (username, password, full_name, role, nip, rank, photo_url) VALUES
('admin', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Administrator', 'admin', '', 'Pengawas Sekolah', '/uploads/admin.jpg'),
('wawan', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'H. Wawan Yogaswara, S.Pd, M.Pd', 'pengawas', '196805301994121001', 'Pembina Utama Muda, IV/c', '/uploads/wawan.jpg'),
('yenihandayani', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Yeni Handayani', 'pengawas', '197707282003122004', 'Pembina Utama Muda/ IV/c', '/uploads/yeni.png'),
('itasdik', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Iman Tasdik', 'pengawas', '197202231996031002', 'Pembina Tk. I/IV B', '/uploads/iman.jpg');

-- ========================================
-- INSERT DATA SCHOOLS (17 records)
-- Menggunakan user_id dari users yang baru diinsert
-- ========================================
INSERT INTO schools (user_id, name, address, contact, principal_name) 
SELECT 
    u.id,
    s.name,
    s.address,
    s.contact,
    s.principal_name
FROM (VALUES
    ('wawan', 'SDN 1 Garut', 'Jl. Raya Garut No. 1', '0262-123456', 'Drs. Ahmad Suryadi'),
    ('wawan', 'SMPN 2 Garut', 'Jl. Pendidikan No. 15', '0262-234567', 'Dra. Siti Nurhasanah'),
    ('wawan', 'SMAN 1 Garut', 'Jl. Ahmad Yani No. 50', '0262-345678', 'Dr. Budi Santoso, M.Pd'),
    ('yenihandayani', 'SMKN 4 Garut', 'Jl. Raya Garut No. 200, Garut', '0262-234578', 'Drs. Asep Wijaya, M.Pd'),
    ('yenihandayani', 'SDN 2 Garut', 'Jl. Merdeka No. 10', '0262-456789', 'Dra. Rina Marlina'),
    ('yenihandayani', 'SMPN 1 Garut', 'Jl. Cimanuk No. 25', '0262-567890', 'Drs. Hendra Gunawan'),
    ('itasdik', 'SMAN 2 Garut', 'Jl. Veteran No. 30', '0262-678901', 'Dr. Andi Wijaya, M.Pd'),
    ('itasdik', 'SMKN 1 Garut', 'Jl. Industri No. 40', '0262-789012', 'Drs. Dedi Supriadi'),
    ('itasdik', 'SDN 3 Garut', 'Jl. Pahlawan No. 5', '0262-890123', 'Dra. Yuli Astuti'),
    ('wawan', 'SMPN 3 Garut', 'Jl. Sudirman No. 20', '0262-901234', 'Drs. Eko Prasetyo'),
    ('wawan', 'SMAN 3 Garut', 'Jl. Gatot Subroto No. 35', '0262-012345', 'Dr. Firman Hidayat, M.Pd'),
    ('yenihandayani', 'SMKN 2 Garut', 'Jl. Diponegoro No. 45', '0262-123457', 'Drs. Gunawan Setiawan'),
    ('yenihandayani', 'SDN 4 Garut', 'Jl. Kartini No. 8', '0262-234568', 'Dra. Sari Dewi'),
    ('itasdik', 'SMPN 4 Garut', 'Jl. Cut Nyak Dien No. 12', '0262-345679', 'Drs. Hadi Purnomo'),
    ('itasdik', 'SMAN 4 Garut', 'Jl. RA Kartini No. 18', '0262-456780', 'Dr. Iwan Setiawan, M.Pd'),
    ('wawan', 'SMKN 3 Garut', 'Jl. Dewi Sartika No. 22', '0262-567891', 'Drs. Joko Widodo'),
    ('wawan', 'SDN 5 Garut', 'Jl. Teuku Umar No. 7', '0262-678902', 'Dra. Kartika Sari')
) AS s(username, name, address, contact, principal_name)
JOIN users u ON u.username = s.username;

-- ========================================
-- INSERT DATA TASKS (1 record)
-- ========================================
INSERT INTO tasks (user_id, title, category, description, completed, photo1, date)
SELECT 
    u.id,
    'Supervisi Akademik',
    'Pendampingan',
    'Melakukan supervisi akademik di sekolah binaan',
    true,
    '/uploads/task1.jpg',
    '2024-11-10 10:30:00+00'::timestamptz
FROM users u WHERE u.username = 'wawan';

-- ========================================
-- INSERT DATA SUPERVISIONS (1 record)
-- ========================================
INSERT INTO supervisions (user_id, school_id, type, date, findings, recommendations, photo1)
SELECT 
    u.id,
    s.id,
    'Akademik',
    '2024-11-10 11:00:00+00'::timestamptz,
    'Pembelajaran sudah sesuai kurikulum',
    'Tingkatkan penggunaan media pembelajaran',
    '/uploads/supervision1.jpg'
FROM users u, schools s 
WHERE u.username = 'wawan' AND s.name = 'SDN 1 Garut';

-- ========================================
-- INSERT DATA ADDITIONAL TASKS (6 records)
-- ========================================
INSERT INTO additional_tasks (user_id, name, date, location, organizer, description, photo1)
SELECT 
    u.id,
    t.name,
    t.date::timestamptz,
    t.location,
    t.organizer,
    t.description,
    t.photo1
FROM (VALUES
    ('wawan', 'Rapat Koordinasi', '2024-11-11 09:00:00+00', 'SDN 1 Garut', 'Kepala Sekolah', 'Rapat koordinasi dengan kepala sekolah', '/uploads/additional1.jpg'),
    ('wawan', 'Workshop Guru', '2024-11-12 08:30:00+00', 'SMPN 2 Garut', 'Dinas Pendidikan', 'Mengadakan workshop untuk guru-guru', '/uploads/additional2.jpg'),
    ('yenihandayani', 'Evaluasi Kurikulum', '2024-11-13 10:15:00+00', 'SMAN 1 Garut', 'Tim Kurikulum', 'Evaluasi implementasi kurikulum merdeka', '/uploads/additional3.jpg'),
    ('itasdik', 'Monitoring Pembelajaran', '2024-11-14 11:45:00+00', 'SMKN 4 Garut', 'Pengawas Sekolah', 'Monitoring proses pembelajaran di kelas', '/uploads/additional4.jpg'),
    ('yenihandayani', 'Pembinaan Guru', '2024-11-15 09:30:00+00', 'SDN 2 Garut', 'Kepala Sekolah', 'Pembinaan guru dalam metode mengajar', '/uploads/additional5.jpg'),
    ('itasdik', 'Sosialisasi Program', '2024-11-16 14:20:00+00', 'SMPN 1 Garut', 'Dinas Pendidikan', 'Sosialisasi program sekolah penggerak', '/uploads/additional6.jpg')
) AS t(username, name, date, location, organizer, description, photo1)
JOIN users u ON u.username = t.username;

-- ========================================
-- VERIFIKASI DATA BERHASIL DIINSERT
-- ========================================
SELECT 'HASIL MIGRASI DATA' as status;
SELECT '===================' as separator;

SELECT 'Users' as table_name, COUNT(*) as total_records FROM users
UNION ALL
SELECT 'Schools' as table_name, COUNT(*) as total_records FROM schools
UNION ALL
SELECT 'Tasks' as table_name, COUNT(*) as total_records FROM tasks
UNION ALL
SELECT 'Supervisions' as table_name, COUNT(*) as total_records FROM supervisions
UNION ALL
SELECT 'Additional Tasks' as table_name, COUNT(*) as total_records FROM additional_tasks;

-- Sample data check
SELECT 'SAMPLE DATA' as status;
SELECT '============' as separator;

SELECT username, full_name, role FROM users LIMIT 2;
SELECT name, principal_name FROM schools LIMIT 2;

-- ✅ MIGRASI SELESAI!
SELECT '✅ MIGRASI DATA BERHASIL!' as final_status;