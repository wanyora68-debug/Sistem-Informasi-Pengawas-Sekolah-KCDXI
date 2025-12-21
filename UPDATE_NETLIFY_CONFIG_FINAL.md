# 🚀 Update Konfigurasi Netlify - Final Setup

## 📋 Yang Perlu Dilakukan di Netlify:

### 1. **Update Environment Variables**
Masuk ke Netlify Dashboard → Site Settings → Environment Variables, tambahkan:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Database Configuration  
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# App Configuration
NODE_ENV=production
VITE_APP_TITLE=Sistem Supervisi Pengawas Sekolah
VITE_APP_VERSION=1.0.0
```

### 2. **Update Build Settings**
```bash
# Build Command
npm run build

# Publish Directory
dist

# Node Version
18
```

### 3. **Update netlify.toml**
File sudah ada, pastikan isinya seperti ini:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "api"
  node_bundler = "esbuild"
```

## 🔧 Langkah-Langkah Update:

### **Step 1: Update Supabase Connection**
1. Buka Supabase Dashboard
2. Go to Settings → API
3. Copy Project URL dan anon key
4. Update di Netlify Environment Variables

### **Step 2: Jalankan SQL Script**
1. Buka Supabase Dashboard
2. Go to SQL Editor
3. Copy-paste isi file `MIGRASI_SUPABASE_POSTGRESQL_LANGSUNG.sql`
4. Klik Run untuk execute script
5. Verifikasi data berhasil diinsert

### **Step 3: Update Client Configuration**
File `client/src/lib/supabase.ts` sudah dikonfigurasi dengan benar:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### **Step 4: Deploy ke Netlify**
1. Push changes ke Git repository
2. Netlify akan auto-deploy
3. Atau manual deploy via Netlify Dashboard

### **Step 5: Test Production**
1. Buka aplikasi di Netlify URL
2. Login dengan:
   - Username: `admin` / Password: `admin123`
   - Username: `wawan` / Password: `wawan123`
3. Verifikasi data real muncul di dashboard
4. Test semua fitur (CRUD, PDF export, dll)

## ✅ Checklist Verifikasi:

- [ ] Environment variables sudah diset di Netlify
- [ ] SQL script berhasil dijalankan di Supabase
- [ ] Data real muncul di database Supabase
- [ ] Build berhasil di Netlify
- [ ] Aplikasi bisa diakses di production URL
- [ ] Login berfungsi dengan user real
- [ ] Dashboard menampilkan data real (bukan sample)
- [ ] Semua fitur CRUD berfungsi
- [ ] PDF export berfungsi
- [ ] Tidak ada error di console browser

## 🎯 Expected Results:

Setelah semua langkah selesai:
- ✅ Aplikasi production menggunakan data real dari Supabase
- ✅ Tidak ada lagi data sample/dummy
- ✅ Semua fitur berfungsi dengan database PostgreSQL
- ✅ Performance lebih baik karena menggunakan database real
- ✅ Data persistent dan tidak hilang saat refresh

## 🚨 Troubleshooting:

**Jika masih muncul data sample:**
1. Clear browser cache dan localStorage
2. Hard refresh (Ctrl+F5)
3. Check environment variables di Netlify
4. Verify Supabase connection di Network tab

**Jika build gagal:**
1. Check build logs di Netlify
2. Verify semua dependencies terinstall
3. Check environment variables format

**Jika database connection error:**
1. Verify Supabase URL dan key
2. Check database permissions
3. Verify SQL script berhasil dijalankan

## 📞 Support:

Jika ada masalah, check:
1. Netlify build logs
2. Browser console errors  
3. Supabase logs
4. Network requests di DevTools

Semua konfigurasi sudah dioptimasi untuk production! 🚀