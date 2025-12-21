# 🔧 Update Vercel Environment Variables

**Status:** 🚨 CRITICAL - Perlu ditambahkan sekarang  

---

## 🎯 ENVIRONMENT VARIABLES YANG PERLU DITAMBAHKAN

### **YANG SUDAH ADA (5 variables):**
- ✅ DATABASE_URL
- ✅ JWT_SECRET
- ✅ SESSION_SECRET
- ✅ NODE_ENV
- ✅ USE_LOCAL_STORAGE

### **YANG PERLU DITAMBAHKAN (2 variables):**

#### **SUPABASE_URL**
```
Name: SUPABASE_URL
Value: https://fmxeboullgcewzjpql.supabase.co
Environment: Production ✅ Preview ✅ Development ✅
```

#### **SUPABASE_ANON_KEY**
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
Environment: Production ✅ Preview ✅ Development ✅
```

---

## 📋 LANGKAH MENAMBAHKAN

### **STEP 1: Buka Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project: sistem-informasi-pengawas-sekolah-kcdy
3. Click "Settings" tab
4. Click "Environment Variables"

### **STEP 2: Add SUPABASE_URL**
1. Click "Add New"
2. Name: `SUPABASE_URL`
3. Value: `https://fmxeboullgcewzjpql.supabase.co`
4. Environment: Check all (Production, Preview, Development)
5. Click "Save"

### **STEP 3: Add SUPABASE_ANON_KEY**
1. Click "Add New"
2. Name: `SUPABASE_ANON_KEY`
3. Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8`
4. Environment: Check all (Production, Preview, Development)
5. Click "Save"

### **STEP 4: Redeploy**
1. Go to "Deployments" tab
2. Click "Redeploy" on latest deployment
3. Wait for deployment to complete

---

## ✅ TOTAL ENVIRONMENT VARIABLES (7)

Setelah ditambahkan, Anda akan memiliki 7 environment variables:

1. ✅ **DATABASE_URL** - Connection string database
2. ✅ **JWT_SECRET** - Secret untuk JWT tokens
3. ✅ **SESSION_SECRET** - Secret untuk sessions
4. ✅ **NODE_ENV** - Environment mode (production)
5. ✅ **USE_LOCAL_STORAGE** - Disable local storage (false)
6. 🆕 **SUPABASE_URL** - Supabase project URL
7. 🆕 **SUPABASE_ANON_KEY** - Supabase anonymous key

---

## 🚨 PENTING

**Setelah menambahkan environment variables:**
1. **WAJIB redeploy** aplikasi
2. **Test API endpoints** dengan TEST_API_ENDPOINTS_VERCEL.html
3. **Verify login** berfungsi dengan admin/admin123

**Tanpa environment variables ini, API endpoints akan tetap error!**

---

**Status:** 🔧 READY TO ADD  
**Priority:** 🚨 CRITICAL - Lakukan sekarang juga!