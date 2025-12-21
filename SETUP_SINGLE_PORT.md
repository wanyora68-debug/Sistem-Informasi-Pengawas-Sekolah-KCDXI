# 🚀 Setup Single Port - Gunakan localhost:5000 Saja

## 🎯 Tujuan
Menggunakan hanya **localhost:5000** yang sudah memiliki data lengkap, tanpa perlu localhost:5173 yang membingungkan.

## 📋 Langkah Setup:

### 1. Stop Frontend Server
```bash
# Stop vite server (port 5173)
Ctrl+C di terminal vite
```

### 2. Build Frontend ke Backend
```bash
npm run build
```

### 3. Akses Aplikasi
**Gunakan hanya**: http://localhost:5000

## ✅ Keuntungan:
- ✅ Hanya 1 port yang digunakan
- ✅ Data langsung dari backend
- ✅ Tidak ada masalah sinkronisasi
- ✅ Siap untuk deployment

## 🚀 Lanjut ke Deployment:
Setelah ini kita bisa langsung deploy ke:
- **Vercel** (Frontend + API)
- **Supabase** (Database)

Aplikasi akan berjalan di 1 URL production tanpa kebingungan port.