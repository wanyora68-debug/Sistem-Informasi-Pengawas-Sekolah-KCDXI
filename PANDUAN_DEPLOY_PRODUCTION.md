# 🚀 Panduan Deploy ke Production - Vercel + Supabase

## ✅ Status Saat Ini:
- ✅ Aplikasi berjalan di **localhost:5000** dengan data lengkap
- ✅ Build sudah berhasil
- ✅ Script migration siap
- ✅ Siap deploy ke production

---

## 📋 LANGKAH 1: Setup Supabase (Database Cloud)

### 1.1 Buat Project Supabase
1. Buka https://supabase.com
2. **Sign Up** dengan GitHub atau Google
3. Klik **"New Project"**
4. Isi form:
   - **Name**: `school-guard-manager`
   - **Database Password**: Buat password kuat (simpan!)
   - **Region**: **Southeast Asia (Singapore)**
5. Klik **"Create new project"**
6. Tunggu ~2 menit sampai database siap

### 1.2 Get Connection String
1. Di Supabase Dashboard → **Settings** → **Database**
2. Scroll ke **Connection string** → **URI**
3. Copy connection string:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
4. Replace `[YOUR-PASSWORD]` dengan password yang tadi dibuat

### 1.3 Setup Database Schema
1. Di Supabase → **SQL Editor**
2. Klik **"New query"**
3. Copy paste script dari `scripts/setup-supabase-schema.sql`
4. Klik **"Run"**
5. Pastikan semua tables berhasil dibuat

---

## 📋 LANGKAH 2: Migrate Data ke Supabase

### 2.1 Set Environment Variable
Di terminal, jalankan:
```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Atau edit file .env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 2.2 Run Migration
```bash
node scripts/migrate-to-supabase.js
```

### 2.3 Verify Data
1. Di Supabase → **Table Editor**
2. Cek tables:
   - `users` → Harus ada data admin & wawan
   - `schools` → Harus ada data sekolah
   - `tasks` → Harus ada data tugas
   - `supervisions` → Harus ada data supervisi

---

## 📋 LANGKAH 3: Deploy ke Vercel

### 3.1 Push ke GitHub (Jika Belum)
```bash
git init
git add .
git commit -m "Ready for production"
git branch -M main
git remote add origin https://github.com/[USERNAME]/[REPO-NAME].git
git push -u origin main
```

### 3.2 Deploy di Vercel
1. Buka https://vercel.com
2. **Sign Up** dengan GitHub
3. Klik **"Add New..."** → **"Project"**
4. **Import** repository GitHub Anda
5. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### 3.3 Set Environment Variables
Di Vercel project settings → **Environment Variables**:
```
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 3.4 Deploy
1. Klik **"Deploy"**
2. Tunggu ~2-3 menit
3. Aplikasi akan live di URL: `https://[project-name].vercel.app`

---

## 📋 LANGKAH 4: Test Production

### 4.1 Akses Aplikasi
1. Buka URL Vercel: `https://[project-name].vercel.app`
2. Login dengan:
   - **Username**: `wawan`
   - **Password**: `wawan123` (atau password yang Anda set)

### 4.2 Verify Features
- ✅ Dashboard menampilkan data real
- ✅ Nama & foto user muncul
- ✅ Data tasks, supervisions, schools tampil
- ✅ Bisa create, edit, delete data
- ✅ Upload foto berfungsi

---

## 🎉 SELESAI!

Aplikasi Anda sekarang live di production dengan:
- ✅ **Frontend + Backend**: Vercel
- ✅ **Database**: Supabase
- ✅ **Data**: Tersinkronisasi
- ✅ **URL**: 1 URL production

---

## 🔧 Troubleshooting

### Jika Migration Gagal:
```bash
# Cek connection
node -e "const {Client}=require('pg');const c=new Client({connectionString:process.env.DATABASE_URL});c.connect().then(()=>console.log('OK')).catch(e=>console.log(e))"
```

### Jika Deploy Gagal:
1. Cek Vercel logs
2. Pastikan DATABASE_URL sudah diset
3. Cek build command benar

### Jika Data Tidak Muncul:
1. Cek Supabase tables ada data
2. Cek environment variable di Vercel
3. Redeploy aplikasi

---

## 📞 Next Steps:
1. Setup custom domain (optional)
2. Setup email notifications (optional)
3. Backup database regular
4. Monitor performance

**Aplikasi Anda siap digunakan di production!** 🚀