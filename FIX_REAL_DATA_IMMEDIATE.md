# 🚀 FIX DATA SAMPEL - SOLUSI LANGSUNG

## ❌ MASALAH
Aplikasi menampilkan data sampel karena:
1. Supabase URL tidak valid/tidak ada
2. Environment variables tidak terkonfigurasi dengan benar
3. Fallback ke sample data

## ✅ SOLUSI LANGSUNG (5 MENIT)

### Opsi 1: Setup Supabase Real (Recommended)

1. **Buat Supabase Project:**
   - Buka https://supabase.com
   - Sign up/Login
   - Create New Project
   - Nama: `school-guard-manager`
   - Password: `yogaswara6` (atau password lain)

2. **Copy Credentials:**
   - Project URL: `https://[your-project-ref].supabase.co`
   - Anon Key: (dari Settings → API)

3. **Update Environment Variables:**
   ```env
   VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
   VITE_SUPABASE_ANON_KEY=[your-anon-key]
   ```

4. **Setup Database Schema:**
   ```sql
   -- Run di Supabase SQL Editor
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     name TEXT NOT NULL,
     role TEXT NOT NULL DEFAULT 'user',
     nip TEXT,
     position TEXT,
     photo TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE schools (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     address TEXT NOT NULL,
     principal TEXT NOT NULL,
     phone TEXT,
     email TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Insert sample data
   INSERT INTO users (username, password, name, role, nip, position) VALUES
   ('admin', '$2a$10$hash', 'Administrator', 'admin', '196501011990031001', 'Pengawas Sekolah'),
   ('wawan', '$2a$10$hash', 'Wawan Yogaswara', 'user', '197505152008011002', 'Pengawas Sekolah');

   INSERT INTO schools (name, address, principal, phone) VALUES
   ('SMKN 4 Garut', 'Jl. Raya Garut No. 200, Garut', 'Drs. Asep Wijaya, M.Pd', '0262-234578'),
   ('SDN 1 Garut', 'Jl. Pendidikan No. 1, Garut', 'Dra. Sri Mulyani, M.Pd', '0262-111111'),
   ('SMPN 1 Garut', 'Jl. Ahmad Yani No. 50, Garut', 'Dra. Bambang Surianto, M.Pd', '0262-222222');
   ```

### Opsi 2: Fix Immediate dengan LocalStorage Enhanced

Jika tidak mau setup Supabase sekarang, saya akan fix aplikasi untuk menggunakan data real dari localStorage:

1. **Populate Real Data:**
   - Buka Developer Console (F12)
   - Jalankan script untuk populate data real

2. **Update API untuk Prioritas LocalStorage:**
   - Ubah fallback logic
   - Gunakan localStorage sebagai primary storage

## 🔧 IMPLEMENTASI SEKARANG

Mau pilih opsi mana?
1. **Setup Supabase Real** (15 menit, permanent solution)
2. **Fix LocalStorage** (2 menit, quick fix)

Beri tahu pilihan Anda dan saya akan implementasikan sekarang!