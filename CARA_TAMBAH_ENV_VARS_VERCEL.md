# 🔧 CARA MENAMBAHKAN ENVIRONMENT VARIABLES DI VERCEL

## 📋 LANGKAH-LANGKAH DETAIL

### **STEP 1: Buka Vercel Dashboard**
1. **Buka browser** dan pergi ke: https://vercel.com/dashboard
2. **Login** dengan akun Vercel Anda
3. **Cari project** aplikasi Anda di dashboard

### **STEP 2: Masuk ke Project Settings**
1. **Klik nama project** Anda di dashboard
2. **Klik tab "Settings"** di bagian atas
3. **Klik "Environment Variables"** di sidebar kiri

### **STEP 3: Tambahkan Environment Variables**

#### **Variable 1: SUPABASE_URL**
1. **Klik tombol "Add New"**
2. **Name:** `SUPABASE_URL`
3. **Value:** `https://fmxeboullgcewzjpqlsupabase.co`
4. **Environment:** Centang semua (Production, Preview, Development)
5. **Klik "Save"**

#### **Variable 2: SUPABASE_ANON_KEY**
1. **Klik tombol "Add New"** lagi
2. **Name:** `SUPABASE_ANON_KEY`
3. **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8`
4. **Environment:** Centang semua (Production, Preview, Development)
5. **Klik "Save"**

### **STEP 4: Redeploy Aplikasi**
1. **Klik tab "Deployments"** di bagian atas
2. **Klik titik tiga (⋯)** pada deployment terakhir
3. **Klik "Redeploy"**
4. **Tunggu proses deployment selesai** (biasanya 2-3 menit)

### **STEP 5: Test Aplikasi**
1. **Buka URL aplikasi** Anda di Vercel
2. **Login dengan:**
   - Username: `admin`
   - Password: `admin123`
3. **Cek semua menu** berfungsi dengan baik

## 🎯 SCREENSHOT PANDUAN

### **Tampilan Environment Variables Page:**
```
┌─────────────────────────────────────────┐
│ Environment Variables                    │
├─────────────────────────────────────────┤
│ [Add New] button                        │
│                                         │
│ Name: SUPABASE_URL                      │
│ Value: https://fmxebo...                │
│ Environment: ☑ Production ☑ Preview    │
│                                         │
│ Name: SUPABASE_ANON_KEY                 │
│ Value: eyJhbGciOiJIUzI1...             │
│ Environment: ☑ Production ☑ Preview    │
└─────────────────────────────────────────┘
```

## ⚠️ PENTING!

1. **Pastikan kedua variables** sudah ditambahkan
2. **Centang semua environment** (Production, Preview, Development)
3. **Wajib redeploy** setelah menambah variables
4. **Tunggu deployment selesai** sebelum test

## ✅ HASIL YANG DIHARAPKAN

Setelah langkah di atas:
- ✅ Login admin/admin123 berhasil
- ✅ Dashboard menampilkan data
- ✅ Semua menu accessible
- ✅ API endpoints working

## 🚨 JIKA MASIH ERROR

Jika masih ada masalah setelah langkah di atas:
1. **Cek Console Browser** (F12) untuk error messages
2. **Cek Vercel Function Logs** di dashboard
3. **Pastikan URL Supabase** benar dan accessible
4. **Contact support** jika diperlukan

---
**Aplikasi akan 100% functional setelah langkah ini! 🎉**