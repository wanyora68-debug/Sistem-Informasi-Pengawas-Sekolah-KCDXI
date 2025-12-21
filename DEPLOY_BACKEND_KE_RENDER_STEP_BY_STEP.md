# 🚀 DEPLOY BACKEND KE RENDER - STEP BY STEP

## 📋 Persiapan

**Yang Sudah Ada:**
- ✅ Frontend di Netlify: https://celadon-chebakia-a3bf18.netlify.app
- ✅ Database di Supabase dengan data real (29 records)
- ✅ Backend Express.js siap deploy

**Yang Akan Dibuat:**
- 🎯 Backend API di Render.com
- 🎯 Koneksi Frontend Netlify → Backend Render → Database Supabase

---

## 🔧 STEP 1: SETUP RENDER ACCOUNT

### 1.1 Buat Akun Render
1. Buka https://render.com
2. Klik **"Get Started for Free"**
3. Sign up dengan GitHub account
4. Authorize Render untuk akses repo

### 1.2 Connect Repository
1. Di Render dashboard, klik **"New +"**
2. Pilih **"Web Service"**
3. Connect GitHub repository: **SchoolGuardManager**
4. Klik **"Connect"**

---

## 🔧 STEP 2: KONFIGURASI WEB SERVICE

### 2.1 Basic Settings
```
Name: school-guard-manager-api
Region: Oregon (US West)
Branch: main
Root Directory: (kosong)
Runtime: Node
```

### 2.2 Build & Deploy Settings
```
Build Command: npm install
Start Command: npm start
```

### 2.3 Environment Variables
Tambahkan environment variables berikut:

```bash
# Database
DATABASE_URL=postgresql://postgres.mwebouligcwzjpqlfed:wanyora68@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Supabase
SUPABASE_URL=https://mwebouligcwzjpqlfed.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWJvdWxpZ2N3empwcWxmZWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDc3NzI5NCwiZXhwIjoyMDUwMzUzMjk0fQ.9c6G0Qr4VzQJhKGxvQJhKGxvQJhKGxvQJhKGxvQJhKG

# Server
PORT=10000
NODE_ENV=production

# Session
SESSION_SECRET=your-super-secret-session-key-here
```

### 2.4 Advanced Settings
```
Auto-Deploy: Yes
Health Check Path: /api/health (opsional)
```

---

## 🔧 STEP 3: DEPLOY & VERIFY

### 3.1 Deploy
1. Klik **"Create Web Service"**
2. Tunggu build process (5-10 menit)
3. Cek logs untuk memastikan tidak ada error

### 3.2 Test Backend API
Setelah deploy selesai, test endpoint:

```bash
# URL akan seperti: https://school-guard-manager-api.onrender.com

# Test basic endpoint
curl https://school-guard-manager-api.onrender.com/api/users

# Test health check
curl https://school-guard-manager-api.onrender.com/api/health
```

---

## 🔧 STEP 4: UPDATE FRONTEND

### 4.1 Update API Configuration
Edit file `client/src/lib/api.ts`:

```typescript
// Ganti URL API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://school-guard-manager-api.onrender.com/api'  // URL Render
  : 'http://localhost:3000/api';                         // Local dev

export const api = {
  // ... rest of the code
};
```

### 4.2 Update CORS di Backend
Edit file `server/index.ts`:

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:5173',                           // Local dev
    'https://celadon-chebakia-a3bf18.netlify.app'     // Netlify production
  ],
  credentials: true
}));
```

### 4.3 Commit & Push
```bash
git add .
git commit -m "Update API URL untuk production Render"
git push origin main
```

Netlify akan auto-deploy dalam 2-3 menit.

---

## 🧪 STEP 5: TESTING LENGKAP

### 5.1 Test API Endpoints
```bash
# Test users
curl https://school-guard-manager-api.onrender.com/api/users

# Test schools  
curl https://school-guard-manager-api.onrender.com/api/schools

# Test additional tasks
curl https://school-guard-manager-api.onrender.com/api/additional-tasks

# Test login
curl -X POST https://school-guard-manager-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wawan","password":"admin123"}'
```

### 5.2 Test Frontend Application
1. Buka https://celadon-chebakia-a3bf18.netlify.app
2. Login dengan: **wawan** / **admin123**
3. Verifikasi:
   - Dashboard menampilkan statistik real
   - Sekolah binaan muncul (7 sekolah untuk wawan)
   - Additional tasks muncul (2 tasks untuk wawan)
   - Semua menu berfungsi

---

## 🔧 STEP 6: TROUBLESHOOTING

### 6.1 Jika Build Gagal
Cek logs di Render dashboard:
- Pastikan `package.json` memiliki `start` script
- Pastikan semua dependencies terinstall
- Cek environment variables

### 6.2 Jika API Tidak Respond
```bash
# Cek health endpoint
curl https://school-guard-manager-api.onrender.com/health

# Cek logs di Render dashboard
# Pastikan PORT=10000 di environment variables
```

### 6.3 Jika CORS Error
Pastikan origin Netlify sudah ditambahkan di CORS settings backend.

---

## 📊 HASIL YANG DIHARAPKAN

### **Arsitektur Final:**
```
Frontend (Netlify) → Backend (Render) → Database (Supabase)
     ↓                    ↓                   ↓
React App            Express.js API      PostgreSQL
(Static)             (Server)            (Data Real)
```

### **URLs:**
- **Frontend:** https://celadon-chebakia-a3bf18.netlify.app
- **Backend:** https://school-guard-manager-api.onrender.com
- **Database:** Supabase PostgreSQL

### **Data:**
- ✅ 4 Users (admin, wawan, yenihandayani, itasdik)
- ✅ 17 Schools (sekolah binaan)
- ✅ 6 Additional Tasks
- ✅ 1 Task, 1 Supervision

---

## ✅ CHECKLIST DEPLOYMENT

- [ ] **Render Account** - Buat akun dan connect repo
- [ ] **Web Service** - Konfigurasi build & start command
- [ ] **Environment Variables** - Set DATABASE_URL, SUPABASE_URL, dll
- [ ] **Deploy Backend** - Tunggu build selesai
- [ ] **Test API** - Verifikasi endpoints berfungsi
- [ ] **Update Frontend** - Ganti API URL ke Render
- [ ] **Deploy Frontend** - Push ke GitHub, Netlify auto-deploy
- [ ] **Test Full App** - Login dan test semua fitur
- [ ] **Verify Data** - Pastikan data real muncul

---

**Estimasi Waktu:** 30-45 menit  
**Status:** 🚀 **READY TO DEPLOY**