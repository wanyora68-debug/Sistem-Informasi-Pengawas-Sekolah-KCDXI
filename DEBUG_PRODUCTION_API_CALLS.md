# 🔍 DEBUG PRODUCTION API CALLS

## ✅ YANG SUDAH WORKING:
- ✅ **Login berhasil** - admin & user wawan
- ✅ **Dashboard statistics** muncul
- ✅ **Routing** working
- ✅ **Environment variables** sudah ditambahkan

## ❌ MASALAH SAAT INI:
- ❌ **Data tidak muncul** di halaman Schools, Users, Reports, dll
- ❌ **API calls** kemungkinan gagal

## 🔍 LANGKAH DEBUG:

### **1. Cek Browser Console**
1. **Buka Developer Tools** (F12)
2. **Klik tab Console**
3. **Navigasi ke halaman Schools/Users**
4. **Lihat error messages** - kemungkinan:
   - `Failed to fetch`
   - `CORS error`
   - `404 Not Found`
   - `Environment variable undefined`

### **2. Cek Network Tab**
1. **Buka tab Network** di Developer Tools
2. **Refresh halaman Schools**
3. **Lihat API requests** - apakah ada yang failed?
4. **Klik request yang failed** untuk lihat detail error

### **3. Kemungkinan Masalah:**

#### **A. Environment Variables Tidak Loaded**
- SUPABASE_URL atau SUPABASE_ANON_KEY undefined
- Solusi: Cek di Netlify Environment Variables

#### **B. API Base URL Salah**
- Frontend mencoba call ke localhost
- Solusi: Update API base URL untuk production

#### **C. CORS Issues**
- Supabase tidak allow requests dari Netlify domain
- Solusi: Update CORS settings di Supabase

#### **D. Database Empty**
- Supabase database tidak ada data
- Solusi: Migrate data dari local ke Supabase

## 🚀 QUICK FIXES:

### **Fix 1: Update API Base URL**
Kemungkinan frontend masih call ke localhost. Perlu update untuk production.

### **Fix 2: Add Sample Data**
Database Supabase mungkin kosong, perlu add sample data.

### **Fix 3: Check Supabase Settings**
- RLS (Row Level Security) mungkin blocking requests
- API keys mungkin salah

---
**Tolong cek Browser Console dan beritahu error message yang muncul!**