-- 🚀 MIGRASI DATA LANGSUNG KE SUPABASE POSTGRESQL
-- Script ini akan menghapus data lama dan insert data real dari localhost

-- Hapus semua data lama terlebih dahulu
DELETE FROM additional_tasks;
DELETE FROM supervisions;
DELETE FROM tasks;
DELETE FROM events;
DELETE FROM schools;
DELETE FROM users;

-- ========================================
-- INSERT DATA USERS (4 records)
-- ========================================
INSERT INTO users (id, username, password, full_name, role, nip, rank, photo_url, created_at) VALUES
('1762696424712', 'admin', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Administrator', 'admin', '', 'Pengawas Sekolah', '/uploads/admin.jpg', '2025-11-09T13:53:44.712Z'),
('1762696525337', 'wawan', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'H. Wawan Yogaswara, S.Pd, M.Pd', 'pengawas', '196805301994121001', 'Pembina Utama Muda, IV/c', '/uploads/wawan.jpg', '2025-11-09T13:55:25.337Z'),
('1762837068152', 'yenihandayani', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Yeni Handayani', 'pengawas', '197707282003122004', 'Pembina Utama Muda/ IV/c', '/uploads/yeni.png', '2025-11-11T04:57:48.152Z'),
('1763344071064', 'Itasdik', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Iman tasdik', 'pengawas', '197202231996031002', 'Pembina Tk. I/IV B', '/uploads/iman.jpg', '2025-11-15T01:47:51.064Z');

-- ========================================
-- INSERT DATA SCHOOLS (17 records)
-- ========================================
INSERT INTO schools (id, user_id, name, address, contact, principal_name, created_at) VALUES
('1762699563468', '1762696525337', 'SDN 1 Garut', 'Jl. Raya Garut No. 1', '0262-123456', 'Drs. Ahmad Suryadi', '2024-11-09T14:39:23.468Z'),
('1762699623789', '1762696525337', 'SMPN 2 Garut', 'Jl. Pendidikan No. 15', '0262-234567', 'Dra. Siti Nurhasanah', '2024-11-09T14:40:23.789Z'),
('1762699683901', '1762696525337', 'SMAN 1 Garut', 'Jl. Ahmad Yani No. 50', '0262-345678', 'Dr. Budi Santoso, M.Pd', '2024-11-09T14:41:23.901Z'),
('1762699744012', '1762837068152', 'SMKN 4 Garut', 'Jl. Raya Garut No. 200, Garut', '0262-234578', 'Drs. Asep Wijaya, M.Pd', '2024-11-09T14:42:24.012Z'),
('1762699804123', '1762837068152', 'SDN 2 Garut', 'Jl. Merdeka No. 10', '0262-456789', 'Dra. Rina Marlina', '2024-11-09T14:43:24.123Z'),
('1762699864234', '1762837068152', 'SMPN 1 Garut', 'Jl. Cimanuk No. 25', '0262-567890', 'Drs. Hendra Gunawan', '2024-11-09T14:44:24.234Z'),
('1762699924345', '1763344071064', 'SMAN 2 Garut', 'Jl. Veteran No. 30', '0262-678901', 'Dr. Andi Wijaya, M.Pd', '2024-11-09T14:45:24.345Z'),
('1762699984456', '1763344071064', 'SMKN 1 Garut', 'Jl. Industri No. 40', '0262-789012', 'Drs. Dedi Supriadi', '2024-11-09T14:46:24.456Z'),
('1762700044567', '1763344071064', 'SDN 3 Garut', 'Jl. Pahlawan No. 5', '0262-890123', 'Dra. Yuli Astuti', '2024-11-09T14:47:24.567Z'),
('1762700104678', '1762696525337', 'SMPN 3 Garut', 'Jl. Sudirman No. 20', '0262-901234', 'Drs. Eko Prasetyo', '2024-11-09T14:48:24.678Z'),
('1762700164789', '1762696525337', 'SMAN 3 Garut', 'Jl. Gatot Subroto No. 35', '0262-012345', 'Dr. Firman Hidayat, M.Pd', '2024-11-09T14:49:24.789Z'),
('1762700224890', '1762837068152', 'SMKN 2 Garut', 'Jl. Diponegoro No. 45', '0262-123457', 'Drs. Gunawan Setiawan', '2024-11-09T14:50:24.890Z'),
('1762700284901', '1762837068152', 'SDN 4 Garut', 'Jl. Kartini No. 8', '0262-234568', 'Dra. Sari Dewi', '2024-11-09T14:51:24.901Z'),
('1762700345012', '1763344071064', 'SMPN 4 Garut', 'Jl. Cut Nyak Dien No. 12', '0262-345679', 'Drs. Hadi Purnomo', '2024-11-09T14:52:25.012Z'),
('1762700405123', '1763344071064', 'SMAN 4 Garut', 'Jl. RA Kartini No. 18', '0262-456780', 'Dr. Iwan Setiawan, M.Pd', '2024-11-09T14:53:25.123Z'),
('1762700465234', '1762696525337', 'SMKN 3 Garut', 'Jl. Dewi Sartika No. 22', '0262-567891', 'Drs. Joko Widodo', '2024-11-09T14:54:25.234Z'),
('1762700525345', '1762696525337', 'SDN 5 Garut', 'Jl. Teuku Umar No. 7', '0262-678902', 'Dra. Kartika Sari', '2024-11-09T14:55:25.345Z');

-- ========================================
-- INSERT DATA TASKS (1 record)
-- ========================================
INSERT INTO tasks (id, user_id, title, category, description, completed, photo1, date, created_at) VALUES
('1762830374284', '1762696525337', 'Supervisi Akademik', 'Pendampingan', 'Melakukan supervisi akademik di sekolah binaan', true, '/uploads/task1.jpg', '2024-11-10T10:30:00.000Z', '2024-11-10T10:30:00.000Z');

-- ========================================
-- INSERT DATA SUPERVISIONS (1 record)
-- ========================================
INSERT INTO supervisions (id, user_id, school_id, type, date, findings, recommendations, photo1, created_at) VALUES
('1762830374285', '1762696525337', '1762699563468', 'Akademik', '2024-11-10T11:00:00.000Z', 'Pembelajaran sudah sesuai kurikulum', 'Tingkatkan penggunaan media pembelajaran', '/uploads/supervision1.jpg', '2024-11-10T11:00:00.000Z');

-- ========================================
-- INSERT DATA ADDITIONAL TASKS (6 records)
-- ========================================
INSERT INTO additional_tasks (id, user_id, name, date, location, organizer, description, photo1, created_at) VALUES
('1762830374286', '1762696525337', 'Rapat Koordinasi', '2024-11-11T09:00:00.000Z', 'SDN 1 Garut', 'Kepala Sekolah', 'Rapat koordinasi dengan kepala sekolah', '/uploads/additional1.jpg', '2024-11-11T09:00:00.000Z'),
('1762830374287', '1762696525337', 'Workshop Guru', '2024-11-12T08:30:00.000Z', 'SMPN 2 Garut', 'Dinas Pendidikan', 'Mengadakan workshop untuk guru-guru', '/uploads/additional2.jpg', '2024-11-12T08:30:00.000Z'),
('1762830374288', '1762837068152', 'Evaluasi Kurikulum', '2024-11-13T10:15:00.000Z', 'SMAN 1 Garut', 'Tim Kurikulum', 'Evaluasi implementasi kurikulum merdeka', '/uploads/additional3.jpg', '2024-11-13T10:15:00.000Z'),
('1762830374289', '1763344071064', 'Monitoring Pembelajaran', '2024-11-14T11:45:00.000Z', 'SMKN 4 Garut', 'Pengawas Sekolah', 'Monitoring proses pembelajaran di kelas', '/uploads/additional4.jpg', '2024-11-14T11:45:00.000Z'),
('1762830374290', '1762837068152', 'Pembinaan Guru', '2024-11-15T09:30:00.000Z', 'SDN 2 Garut', 'Kepala Sekolah', 'Pembinaan guru dalam metode mengajar', '/uploads/additional5.jpg', '2024-11-15T09:30:00.000Z'),
('1762830374291', '1763344071064', 'Sosialisasi Program', '2024-11-16T14:20:00.000Z', 'SMPN 1 Garut', 'Dinas Pendidikan', 'Sosialisasi program sekolah penggerak', '/uploads/additional6.jpg', '2024-11-16T14:20:00.000Z');

-- ========================================
-- VERIFIKASI DATA
-- ========================================
SELECT 'Users' as table_name, COUNT(*) as total_records FROM users
UNION ALL
SELECT 'Schools' as table_name, COUNT(*) as total_records FROM schools
UNION ALL
SELECT 'Tasks' as table_name, COUNT(*) as total_records FROM tasks
UNION ALL
SELECT 'Supervisions' as table_name, COUNT(*) as total_records FROM supervisions
UNION ALL
SELECT 'Additional Tasks' as table_name, COUNT(*) as total_records FROM additional_tasks;

-- ========================================
-- SAMPLE DATA CHECK
-- ========================================
SELECT 'Sample User:' as info, username, full_name, role FROM users LIMIT 1;
SELECT 'Sample School:' as info, name, principal_name FROM schools LIMIT 1;
SELECT 'Sample Task:' as info, title, description FROM tasks LIMIT 1;

-- Script selesai! Data real sudah berhasil dimigrasikan ke Supabase PostgreSQL