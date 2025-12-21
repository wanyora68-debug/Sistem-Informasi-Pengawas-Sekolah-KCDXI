# 🚀 Deploy ke Vercel + Supabase - Step by Step

## 🎯 Tujuan
Deploy aplikasi ke production dengan:
- **Vercel**: Hosting aplikasi
- **Supabase**: Database cloud

## 📋 Langkah 1: Setup Supabase Database

### 1.1 Buat Akun Supabase
1. Buka https://supabase.com
2. Sign up dengan GitHub/Google
3. Create New Project
4. Pilih region: **Southeast Asia (Singapore)**
5. Tunggu database siap (~2 menit)

### 1.2 Get Database URL
1. Di dashboard Supabase → Settings → Database
2. Copy **Connection string** → **URI**
3. Replace `[YOUR-PASSWORD]` dengan password project

### 1.3 Setup Database Schema
1. Di Supabase → SQL Editor
2. Run script untuk create tables

## 📋 Langkah 2: Setup Vercel

### 2.1 Buat Akun Vercel
1. Buka https://vercel.com
2. Sign up dengan GitHub
3. Import repository ini

### 2.2 Configure Environment Variables
Di Vercel dashboard → Settings → Environment Variables:
```
DATABASE_URL=postgresql://[supabase-connection-string]
```

### 2.3 Deploy Settings
- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

## 📋 Langkah 3: Migration Data

### 3.1 Migrate Local Data ke Supabase
```bash
node scripts/migrate-to-supabase.js
```

### 3.2 Test Production
1. Akses URL Vercel
2. Login dengan user: `wawan`
3. Cek data muncul dengan benar

## ✅ Hasil Akhir:
- ✅ Aplikasi live di Vercel
- ✅ Database di Supabase
- ✅ Data real tersinkronisasi
- ✅ Hanya 1 URL production

## 🔧 Files yang Dibutuhkan:
- `vercel.json` ✅ (sudah ada)
- `scripts/migrate-to-supabase.js` ✅ (sudah ada)
- `.env` untuk DATABASE_URL

Mari kita mulai dengan setup Supabase dulu!