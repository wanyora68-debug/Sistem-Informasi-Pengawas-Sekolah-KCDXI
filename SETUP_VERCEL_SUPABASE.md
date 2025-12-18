# 🚀 Panduan Migrasi ke Vercel + Supabase

## 📋 Overview
Migrasi dari Render + Neon ke Vercel + Supabase untuk mengatasi pembatasan bulanan dan mendapatkan performa yang lebih baik.

## 🎯 Keuntungan Vercel + Supabase
- ✅ **Vercel**: Gratis unlimited, global CDN, auto-deploy
- ✅ **Supabase**: 2 projects gratis, 500MB database, 5GB bandwidth/bulan
- ✅ **Zero downtime**: Render tetap jalan selama migrasi
- ✅ **Better performance**: Loading lebih cepat

---

## 🗄️ Step 1: Setup Supabase Database

### 1.1 Buat Akun Supabase
1. Buka https://supabase.com
2. Klik **"Start your project"**
3. Sign up dengan GitHub/Google (recommended)
4. Verifikasi email jika diperlukan

### 1.2 Buat Project Baru
1. Klik **"New Project"**
2. Pilih **Organization** (buat baru jika belum ada)
3. Isi detail project:
   - **Name**: `school-guard-manager`
   - **Database Password**: [Buat password yang kuat, simpan baik-baik]
   - **Region**: `Southeast Asia (Singapore)` [terdekat dengan Indonesia]
   - **Pricing Plan**: `Free` ✅
4. Klik **"Create new project"**
5. Tunggu 2-3 menit sampai database ready

### 1.3 Dapatkan Database URL
1. Setelah project ready, masuk ke **Settings** → **Database**
2. Scroll ke **Connection string**
3. Pilih **URI** tab
4. Copy connection string yang seperti ini:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. **SIMPAN URL INI** - akan digunakan nanti

### 1.4 Setup Database Schema
1. Masuk ke **SQL Editor** di dashboard Supabase
2. Klik **"New query"**
3. Jalankan script SQL untuk membuat tables (akan saya berikan scriptnya)

---

## 📊 Step 2: Migrate Data dari Neon ke Supabase

### 2.1 Backup Data dari Neon
- Export semua data dari database Neon
- Simpan dalam format SQL dump

### 2.2 Import Data ke Supabase
- Import data yang sudah di-backup
- Verifikasi semua data berhasil ter-migrate

---

## ⚙️ Step 3: Update Konfigurasi

### 3.1 Update Environment Variables
- Ganti `DATABASE_URL` dari Neon ke Supabase
- Update file `.env` dan konfigurasi production

### 3.2 Test Koneksi Database
- Test koneksi ke Supabase dari local
- Pastikan semua query berfungsi normal

---

## 🌐 Step 4: Deploy ke Vercel

### 4.1 Setup Vercel Account
- Buat akun di https://vercel.com
- Connect dengan GitHub repository

### 4.2 Configure Deployment
- Setup environment variables di Vercel
- Configure build settings
- Deploy aplikasi

---

## 🧪 Step 5: Testing & Verifikasi

### 5.1 Functional Testing
- Test semua fitur aplikasi
- Verifikasi PDF generation
- Test upload foto

### 5.2 Performance Testing
- Bandingkan speed dengan Render
- Monitor resource usage

---

## 📝 Checklist Migrasi

### Pre-Migration
- [ ] Backup data dari Neon
- [ ] Setup Supabase project
- [ ] Test database connection

### Migration
- [ ] Import data ke Supabase
- [ ] Update environment variables
- [ ] Deploy ke Vercel

### Post-Migration
- [ ] Functional testing
- [ ] Performance verification
- [ ] DNS/domain setup (jika perlu)

---

## 🆘 Troubleshooting

### Common Issues
1. **Connection timeout**: Check firewall/network
2. **Migration errors**: Verify SQL syntax
3. **Vercel build fails**: Check environment variables

### Support
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Contact support jika ada masalah

---

**Status**: 🟡 In Progress
**Next**: Setup Supabase Database