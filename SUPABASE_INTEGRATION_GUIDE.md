# 🚀 Panduan Integrasi Supabase

## ✅ Status Integrasi

### Database Setup
- ✅ Schema sudah dibuat di Supabase
- ✅ Admin user sudah dibuat (username: `admin`, password: `admin123`)
- ✅ Environment variables sudah dikonfigurasi di Vercel

### API Endpoints
- ✅ `/api/auth/login` - Login dengan Supabase SDK
- ✅ `/api/auth/me` - Get current user
- ✅ `/api/schools` - CRUD sekolah
- ✅ `/api/schools/[id]` - Update/Delete sekolah
- ✅ `/api/tasks` - CRUD tugas
- ✅ `/api/supervisions` - CRUD supervisi

## 🔑 Kredensial Login

**Admin:**
- Username: `admin`
- Password: `admin123`

## 🛠️ Troubleshooting

### 1. Login Gagal

**Gejala:** Error "Invalid credentials" atau "Internal server error"

**Solusi:**
```bash
# Reset password admin
node scripts/reset-admin-password-supabase.js
```

### 2. Data Tidak Muncul

**Gejala:** Dashboard kosong atau data tidak ter-load

**Solusi:**
```bash
# Tambahkan sample data
node scripts/add-sample-data.js
```

### 3. API Error 500

**Gejala:** Error 500 saat mengakses API

**Kemungkinan Penyebab:**
- Environment variables belum diset di Vercel
- Supabase anon key salah
- Database schema belum dibuat

**Solusi:**
1. Cek environment variables di Vercel:
   - `SUPABASE_URL`: `https://fmxeboullgcewzjpql.supabase.co`
   - `SUPABASE_ANON_KEY`: (lihat di Supabase Dashboard → Settings → API)

2. Cek database schema:
   - Buka Supabase Dashboard → Table Editor
   - Pastikan tabel `users`, `schools`, `tasks`, `supervisions` sudah ada

### 4. Deployment Gagal

**Gejala:** Build error di Vercel

**Solusi:**
1. Pastikan `@supabase/supabase-js` ada di `api/package.json`
2. Redeploy dari Vercel dashboard

## 📊 Verifikasi Integrasi

### Test Login
1. Buka aplikasi di browser
2. Login dengan `admin` / `admin123`
3. Jika berhasil, akan redirect ke dashboard

### Test CRUD Operations
1. **Schools:**
   - Tambah sekolah baru
   - Edit sekolah
   - Hapus sekolah

2. **Tasks:**
   - Buat task baru
   - Update status task
   - Hapus task

3. **Supervisions:**
   - Tambah supervisi baru
   - Lihat detail supervisi
   - Generate laporan PDF

## 🔧 Scripts Utility

### Reset Admin Password
```bash
node scripts/reset-admin-password-supabase.js
```
Reset password admin menjadi `admin123`

### Add Sample Data
```bash
node scripts/add-sample-data.js
```
Menambahkan data sample untuk testing:
- 3 sekolah
- 3 tasks
- 1 supervisi

### Migrate Local Data
```bash
node scripts/migrate-local-data-to-supabase.js
```
Migrasi data dari `local-database.json` ke Supabase

## 📝 Environment Variables

### Vercel Production
```env
SUPABASE_URL=https://fmxeboullgcewzjpql.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=schoolguard-secret-key-2024
```

### Local Development
File `.env`:
```env
SUPABASE_URL=https://fmxeboullgcewzjpql.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=schoolguard-secret-key-2024
```

## 🎯 Next Steps

1. **Test semua fitur** di production
2. **Migrate data** dari local ke Supabase (jika ada)
3. **Backup database** secara berkala
4. **Monitor logs** di Vercel untuk error

## 📞 Support

Jika masih ada masalah:
1. Cek Vercel logs untuk error details
2. Cek Supabase logs di Dashboard → Logs
3. Buka Developer Tools (F12) → Console untuk client-side errors

## 🎉 Selamat!

Aplikasi Anda sekarang sudah fully integrated dengan Supabase database! 
Data tersimpan permanen di cloud dan bisa diakses dari mana saja.
