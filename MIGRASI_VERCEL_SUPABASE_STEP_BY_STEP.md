# 🚀 Panduan Migrasi ke Vercel + Supabase
## Step-by-Step Guide

---

## 🎯 **STEP 1: Setup Supabase Database**

### 1.1 Buat Akun Supabase
1. **Buka browser** → https://supabase.com
2. **Klik "Start your project"**
3. **Sign up** dengan GitHub (recommended) atau email
4. **Verifikasi email** jika diminta

### 1.2 Buat Project Baru
1. **Klik "New Project"**
2. **Pilih Organization** (buat baru jika belum ada)
3. **Isi form project:**
   ```
   Name: school-guard-manager
   Database Password: [Buat password kuat - SIMPAN BAIK-BAIK!]
   Region: Southeast Asia (Singapore)
   Pricing Plan: Free
   ```
4. **Klik "Create new project"**
5. **Tunggu 2-3 menit** sampai database ready

### 1.3 Setup Database Schema
1. **Masuk ke SQL Editor** di dashboard Supabase
2. **Klik "New query"**
3. **Copy-paste** isi file `scripts/setup-supabase-schema.sql`
4. **Klik "Run"** untuk execute script
5. **Pastikan** semua tables berhasil dibuat

### 1.4 Dapatkan Database URL
1. **Masuk ke Settings** → **Database**
2. **Scroll ke "Connection string"**
3. **Pilih tab "URI"**
4. **Copy URL** yang seperti ini:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. **SIMPAN URL INI** untuk step berikutnya

---

## 🔄 **STEP 2: Migrate Data dari Neon**

### 2.1 Persiapan Environment
1. **Buka terminal** di folder project
2. **Buat file `.env.migration`:**
   ```bash
   # Current Neon database
   DATABASE_URL=postgresql://[neon-connection-string]
   
   # New Supabase database
   SUPABASE_DATABASE_URL=postgresql://[supabase-connection-string]
   ```

### 2.2 Jalankan Migration Script
```bash
# Load environment variables
cp .env.migration .env

# Install dependencies (jika belum)
npm install

# Jalankan migration script
node scripts/migrate-neon-to-supabase.js
```

### 2.3 Verifikasi Migration
Script akan otomatis:
- ✅ **Backup** data dari Neon
- ✅ **Migrate** ke Supabase  
- ✅ **Verify** data counts
- ✅ **Report** hasil migration

---

## ⚙️ **STEP 3: Update Konfigurasi**

### 3.1 Update Environment Variables
1. **Edit file `.env`:**
   ```bash
   # Ganti DATABASE_URL ke Supabase
   DATABASE_URL=postgresql://[supabase-connection-string]
   
   # Environment lainnya tetap sama
   NODE_ENV=development
   JWT_SECRET=your-jwt-secret
   ```

### 3.2 Test Local dengan Supabase
```bash
# Build aplikasi
npm run build

# Jalankan server
npm run dev

# Test di browser: http://localhost:5000
# Pastikan semua fitur berfungsi normal
```

---

## 🌐 **STEP 4: Deploy ke Vercel**

### 4.1 Setup Vercel Account
1. **Buka** https://vercel.com
2. **Sign up** dengan GitHub
3. **Connect** repository GitHub Anda

### 4.2 Import Project ke Vercel
1. **Klik "New Project"**
2. **Pilih repository** aplikasi Anda
3. **Configure project:**
   ```
   Framework Preset: Other
   Build Command: npm run build
   Output Directory: dist/public
   Install Command: npm install
   ```

### 4.3 Setup Environment Variables di Vercel
1. **Masuk ke Settings** → **Environment Variables**
2. **Tambahkan variables:**
   ```
   DATABASE_URL = [supabase-connection-string]
   NODE_ENV = production
   JWT_SECRET = [your-jwt-secret]
   ```

### 4.4 Deploy
1. **Klik "Deploy"**
2. **Tunggu build** selesai (2-3 menit)
3. **Dapatkan URL** deployment (misal: https://your-app.vercel.app)

---

## 🧪 **STEP 5: Testing & Verifikasi**

### 5.1 Test Aplikasi di Vercel
1. **Buka URL** Vercel deployment
2. **Login** dengan akun admin
3. **Test semua fitur:**
   - ✅ Login/logout
   - ✅ CRUD data (sekolah, tugas, supervisi)
   - ✅ Upload foto
   - ✅ Generate PDF laporan
   - ✅ Dashboard statistics

### 5.2 Performance Check
1. **Bandingkan speed** dengan Render
2. **Monitor** resource usage
3. **Check** error logs di Vercel dashboard

### 5.3 Backup & Rollback Plan
- **Render + Neon** masih aktif sebagai backup
- **Bisa rollback** kapan saja jika ada masalah
- **Data sync** bisa dilakukan berkala

---

## 📋 **Checklist Migrasi**

### ✅ Pre-Migration
- [ ] Akun Supabase dibuat
- [ ] Database schema di-setup
- [ ] Connection string didapat
- [ ] Backup data Neon

### ✅ Migration
- [ ] Data berhasil di-migrate
- [ ] Verification passed
- [ ] Local testing OK
- [ ] Environment variables updated

### ✅ Deployment
- [ ] Vercel account setup
- [ ] Project imported
- [ ] Environment variables configured
- [ ] Build & deploy successful

### ✅ Post-Migration
- [ ] Functional testing passed
- [ ] Performance acceptable
- [ ] Error monitoring setup
- [ ] Backup strategy confirmed

---

## 🆘 **Troubleshooting**

### Database Connection Issues
```bash
# Test Supabase connection
psql "postgresql://[supabase-url]"
```

### Migration Errors
- Check SQL syntax in schema file
- Verify foreign key constraints
- Check data types compatibility

### Vercel Build Failures
- Check environment variables
- Verify build command
- Check Node.js version compatibility

### Performance Issues
- Enable Supabase connection pooling
- Optimize database queries
- Check Vercel function timeout

---

## 📞 **Support**

### Documentation
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs

### Community
- **Supabase Discord**: https://discord.supabase.com
- **Vercel Discord**: https://discord.gg/vercel

---

**🎉 Selamat! Aplikasi Anda sekarang berjalan di Vercel + Supabase!**

**Next Steps:**
1. Monitor performance selama beberapa hari
2. Setup custom domain (optional)
3. Configure backup strategy
4. Shutdown Render setelah yakin stabil