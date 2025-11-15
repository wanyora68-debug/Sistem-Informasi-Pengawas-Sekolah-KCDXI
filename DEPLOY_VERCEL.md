# 🚀 DEPLOY KE VERCEL

**Panduan Deploy Aplikasi Pengawas Sekolah ke Vercel**

---

## ⚠️ PENTING: Keterbatasan Vercel

### **Masalah dengan Aplikasi Ini:**

Aplikasi ini adalah **full-stack app** dengan:
- ✅ Frontend: React (bisa di Vercel)
- ❌ Backend: Express.js dengan file storage (TIDAK COCOK untuk Vercel)

### **Kenapa Tidak Cocok?**

1. **Serverless Functions** - Vercel menggunakan serverless, tidak support:
   - File uploads (multer)
   - Local JSON database
   - Persistent file storage

2. **File System** - Vercel serverless tidak bisa:
   - Write files (uploads, database)
   - Read/write local-database.json
   - Store uploaded photos

3. **Cold Starts** - Backend akan sleep dan restart, data hilang

---

## 🎯 SOLUSI RECOMMENDED

### **Option 1: Deploy Frontend di Vercel + Backend di VPS** ⭐

**Setup:**
```
Frontend (Vercel):
- Deploy client/ folder
- Static files only
- Fast & free

Backend (VPS):
- Deploy server/ folder
- File storage works
- Database works
```

**Biaya:**
- Frontend: GRATIS (Vercel)
- Backend: Rp 50.000-150.000/bulan (VPS)

---

### **Option 2: Deploy Full-Stack di Railway/Render** ⭐⭐

**Keuntungan:**
- ✅ Support file storage
- ✅ Support persistent database
- ✅ Easy deployment
- ✅ Free tier available

**Platform:**
- **Railway.app** (Recommended)
- **Render.com**
- **Fly.io**

---

### **Option 3: Deploy Full-Stack di VPS** ⭐⭐⭐

**Paling Recommended untuk aplikasi ini!**

Sudah ada panduan lengkap di:
- **PANDUAN_HOSTING.md**
- **QUICK_HOSTING_GUIDE.md**

---

## 📝 Jika Tetap Ingin Pakai Vercel

### **Perlu Perubahan Besar:**

1. **Ganti Database:**
   - Dari: local-database.json
   - Ke: Supabase PostgreSQL
   - Panduan: SETUP_SUPABASE.md

2. **Ganti File Storage:**
   - Dari: Local uploads/
   - Ke: Cloud storage (Cloudinary, AWS S3, Supabase Storage)

3. **Update Backend:**
   - Dari: Express.js traditional
   - Ke: Vercel Serverless Functions

---

## 🔧 Konfigurasi Vercel (Jika Sudah Migrasi)

### **1. vercel.json**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "DATABASE_URL": "@database_url"
  }
}
```

### **2. Environment Variables di Vercel**

Di Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL = postgresql://... (Supabase)
SUPABASE_URL = https://...
SUPABASE_SERVICE_KEY = ...
NODE_ENV = production
```

### **3. Build Settings di Vercel**

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: client/dist
Install Command: npm install
```

---

## 🚀 Deploy ke Railway (RECOMMENDED)

### **Langkah Mudah:**

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect ke Railway**
   - Login ke https://railway.app
   - New Project → Deploy from GitHub
   - Select repository
   - Railway auto-detect & deploy!

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=... (optional, bisa pakai local JSON)
   ```

4. **Done!**
   - Railway generate URL otomatis
   - Aplikasi online!

**Biaya:** Free tier atau $5/month

---

## 📊 Perbandingan Platform

| Platform | Frontend | Backend | File Storage | Database | Biaya |
|----------|----------|---------|--------------|----------|-------|
| **Vercel** | ✅ Excellent | ❌ Serverless only | ❌ No | ❌ External only | Free |
| **Railway** | ✅ Good | ✅ Full support | ✅ Yes | ✅ Yes | $5/mo |
| **Render** | ✅ Good | ✅ Full support | ✅ Yes | ✅ Yes | Free/$7 |
| **VPS** | ✅ Full control | ✅ Full control | ✅ Yes | ✅ Yes | Rp 50k/mo |

---

## 💡 Rekomendasi Saya

### **Untuk Aplikasi Ini:**

1. **Railway.app** ⭐⭐⭐⭐⭐
   - Paling mudah
   - Support semua fitur
   - Auto-deploy dari GitHub
   - Free tier available

2. **VPS (Niagahoster/IDCloudHost)** ⭐⭐⭐⭐
   - Full control
   - Murah (Rp 50k/bulan)
   - Panduan lengkap sudah ada
   - Cocok untuk production

3. **Render.com** ⭐⭐⭐⭐
   - Mirip Railway
   - Free tier
   - Easy setup

4. **Vercel** ⭐⭐
   - Perlu migrasi besar
   - Harus pakai Supabase
   - Harus pakai cloud storage
   - Banyak perubahan code

---

## 🎯 Action Plan

### **Pilihan 1: Railway (Termudah)**

```
1. Push code ke GitHub
2. Connect Railway ke GitHub
3. Deploy (otomatis)
4. Set environment variables
5. Done! (~10 menit)
```

### **Pilihan 2: VPS (Recommended)**

```
1. Sewa VPS (Niagahoster)
2. Follow PANDUAN_HOSTING.md
3. Setup dalam ~45 menit
4. Full control & murah
```

### **Pilihan 3: Vercel (Perlu Migrasi)**

```
1. Setup Supabase (SETUP_SUPABASE.md)
2. Migrasi database
3. Setup cloud storage (Cloudinary)
4. Update code untuk serverless
5. Deploy ke Vercel
6. Waktu: ~3-4 jam
```

---

## 🆘 Masalah Saat Ini

### **Error: Output Directory**

Ini terjadi karena:
1. Vercel tidak tahu struktur monorepo
2. Backend tidak bisa jalan di serverless
3. File storage tidak support

### **Solusi:**

**Jangan deploy ke Vercel!** Gunakan Railway atau VPS.

---

## 📞 Bantuan

Saya bisa membantu:

1. **Setup Railway** - Paling mudah & cepat
2. **Setup VPS** - Follow PANDUAN_HOSTING.md
3. **Migrasi ke Supabase** - Jika tetap mau Vercel

Mau pakai platform mana? Saya siap bantu! 😊

---

**Recommendation: Railway.app atau VPS**  
**Avoid: Vercel (untuk aplikasi ini)**

---

**Last Updated:** 11 November 2025  
**Status:** ⚠️ Vercel tidak cocok untuk aplikasi ini
