# 🎨 DEPLOY KE RENDER.COM (GRATIS!)

**Panduan Deploy Aplikasi Pengawas Sekolah ke Render.com**

---

## ⭐ Kenapa Render?

✅ **100% GRATIS** selamanya (Free tier)  
✅ **Support full-stack** - Frontend + Backend  
✅ **File storage works** - Uploads berfungsi  
✅ **Database works** - Local JSON atau PostgreSQL  
✅ **Auto-deploy** - Push GitHub = auto deploy  
✅ **SSL gratis** - HTTPS otomatis  
✅ **Custom domain gratis** - Bisa pakai domain sendiri  
✅ **Easy setup** - 10 menit selesai  

**Kekurangan:**
⚠️ App sleep setelah 15 menit tidak ada traffic  
⚠️ Cold start ~30 detik saat bangun dari sleep  

**Perfect untuk:** Testing, development, uji coba, low-traffic apps

---

## 🚀 Langkah Deploy (10 Menit)

### **Step 1: Push ke GitHub** (3 menit)

```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Ready for Render deployment"

# Create repo di GitHub
# Lalu push:
git remote add origin https://github.com/username/repo-name.git
git branch -M main
git push -u origin main
```

---

### **Step 2: Buat Akun Render** (2 menit)

1. Buka https://render.com
2. Klik **"Get Started"**
3. Sign up dengan:
   - GitHub (recommended - langsung connect)
   - Atau email

---

### **Step 3: Deploy Web Service** (5 menit)

#### **A. Create New Web Service**

1. Di Render dashboard, klik **"New +"**
2. Pilih **"Web Service"**
3. Connect GitHub repository:
   - Klik **"Connect account"** (jika belum)
   - Pilih repository Anda
   - Klik **"Connect"**

#### **B. Configure Service**

Isi form dengan:

```
Name: pengawas-sekolah
Region: Singapore (terdekat dengan Indonesia)
Branch: main
Root Directory: (kosongkan)
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

#### **C. Select Plan**

```
Plan: Free
✅ 512 MB RAM
✅ Shared CPU
✅ 750 hours/month
✅ Auto-sleep after 15 min
```

Klik **"Free"**

#### **D. Environment Variables**

Scroll ke **"Environment Variables"**, klik **"Add Environment Variable"**:

```
NODE_ENV = production
PORT = 10000
```

**PENTING:** Render menggunakan PORT 10000 secara default!

#### **E. Deploy!**

1. Klik **"Create Web Service"**
2. Render akan otomatis:
   - Clone repository
   - Install dependencies
   - Build aplikasi
   - Deploy!
3. Tunggu ~3-5 menit

---

### **Step 4: Get URL & Test** (2 menit)

1. Setelah deploy selesai, lihat URL di atas:
   ```
   https://pengawas-sekolah.onrender.com
   ```
2. Klik URL atau copy-paste ke browser
3. **Tunggu ~30 detik** (cold start pertama kali)
4. Login dengan: `admin` / `admin123`
5. Test semua fitur!

---

## ✅ Done!

Aplikasi Anda sudah online di Render! 🎉

**URL:** https://pengawas-sekolah.onrender.com  
**Auto-deploy:** Setiap push ke GitHub  
**Biaya:** GRATIS selamanya!

---

## 🔧 Konfigurasi Penting

### **1. Update server/index.ts untuk Render**

Pastikan server listen di PORT yang benar:

```typescript
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

**PENTING:** Gunakan `'0.0.0.0'` sebagai host!

### **2. Build Command**

Di Render dashboard → Settings → Build & Deploy:

```bash
npm install && npm run build
```

### **3. Start Command**

```bash
npm start
```

Pastikan di `package.json` ada:
```json
{
  "scripts": {
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

---

## 🔄 Auto-Deploy

Setiap kali push ke GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

Render otomatis:
1. Detect changes
2. Build aplikasi
3. Deploy
4. Update URL

**Tidak perlu manual deploy!**

---

## 🌐 Custom Domain (Optional)

### **Gratis dengan Render!**

1. Beli domain (Niagahoster, dll)
2. Di Render dashboard → Settings → Custom Domains
3. Klik **"Add Custom Domain"**
4. Masukkan domain: `pengawas.your-domain.com`
5. Update DNS di domain provider:
   ```
   Type: CNAME
   Name: pengawas (atau @)
   Value: pengawas-sekolah.onrender.com
   ```
6. Wait for DNS propagation (~1-24 jam)
7. SSL otomatis aktif!

---

## 📊 Monitoring

### **View Logs:**

1. Di Render dashboard
2. Klik service Anda
3. Tab **"Logs"** - Real-time logs
4. Tab **"Events"** - Deployment history
5. Tab **"Metrics"** - CPU, Memory usage

### **Check Status:**

```
🟢 Live - App running
🟡 Building - Sedang build
🔴 Failed - Build/deploy failed
⚪ Sleeping - App sleep (tidak ada traffic)
```

---

## ⚠️ Penting: Sleep Mode

### **Cara Kerja:**

- App sleep setelah **15 menit** tidak ada traffic
- Saat ada request, app bangun otomatis (~30 detik)
- Request pertama akan lambat (cold start)
- Request berikutnya normal

### **Cara Mengatasi Sleep:**

#### **Option 1: Ping Service (Gratis)**

Gunakan cron job untuk ping setiap 14 menit:

**UptimeRobot.com** (Gratis):
1. Daftar di https://uptimerobot.com
2. Add New Monitor:
   ```
   Type: HTTP(s)
   URL: https://pengawas-sekolah.onrender.com
   Interval: 5 minutes
   ```
3. App tidak akan sleep!

#### **Option 2: Upgrade ke Paid Plan**

```
💰 $7/month
✅ No sleep
✅ Faster performance
✅ More resources
```

---

## 🗄️ Database Options

### **Option 1: Local JSON (Default)** ✅

Sudah berfungsi out-of-the-box!

**Kelebihan:**
- ✅ Tidak perlu setup
- ✅ Gratis
- ✅ Mudah

**Kekurangan:**
- ⚠️ Data hilang saat redeploy
- ⚠️ Tidak scalable

**Solusi:** Backup data secara manual sebelum deploy

### **Option 2: Supabase PostgreSQL** ⭐ (Recommended)

**Kelebihan:**
- ✅ Data persistent
- ✅ Gratis 500 MB
- ✅ Auto-backup
- ✅ Scalable

**Setup:**
1. Follow **SETUP_SUPABASE.md**
2. Get connection string
3. Add ke Render environment variables:
   ```
   DATABASE_URL = postgresql://...
   ```
4. Redeploy

---

## 📁 File Storage

### **Uploads Folder:**

Render support persistent disk (paid) atau gunakan cloud storage:

#### **Option 1: Local Uploads (Default)**

Works untuk testing, tapi:
- ⚠️ Files hilang saat redeploy
- ⚠️ Limited space

#### **Option 2: Cloudinary (Recommended)**

**Gratis 25 GB:**
1. Daftar di https://cloudinary.com
2. Get API credentials
3. Install package:
   ```bash
   npm install cloudinary multer-storage-cloudinary
   ```
4. Update upload logic
5. Add credentials ke environment variables

---

## 🆘 Troubleshooting

### **Build Failed:**

```
Error: Build failed
```

**Solution:**
1. Check build logs di Render
2. Test `npm run build` di local
3. Pastikan semua dependencies di package.json
4. Check Node version compatibility

### **App Crashed:**

```
Error: Application error
```

**Solution:**
1. Check runtime logs
2. Pastikan PORT = process.env.PORT
3. Pastikan listen di '0.0.0.0'
4. Check environment variables

### **Slow Response:**

```
App lambat atau timeout
```

**Solution:**
1. App mungkin sleeping - tunggu 30 detik
2. Setup UptimeRobot untuk prevent sleep
3. Atau upgrade ke paid plan

### **Database Error:**

```
Error: Cannot write to database
```

**Solution:**
1. Jika pakai local JSON, data akan reset setiap deploy
2. Migrate ke Supabase untuk persistent data
3. Follow SETUP_SUPABASE.md

---

## 💰 Pricing

### **Free Tier:**
```
✅ GRATIS selamanya
✅ 512 MB RAM
✅ Shared CPU
✅ 750 hours/month (cukup untuk 1 app 24/7)
✅ 100 GB bandwidth/month
✅ SSL gratis
✅ Custom domain gratis
⚠️ Auto-sleep after 15 min
```

### **Starter Plan ($7/month):**
```
💰 $7/bulan
✅ 512 MB RAM
✅ No sleep
✅ Faster performance
✅ Persistent disk
```

### **Standard Plan ($25/month):**
```
💰 $25/bulan
✅ 2 GB RAM
✅ Dedicated CPU
✅ Better performance
```

**Untuk uji coba:** Free tier sudah cukup!

---

## 🎯 Best Practices

### **1. Environment Variables**

Jangan hardcode sensitive data:
```typescript
// ❌ Bad
const secret = "my-secret-key";

// ✅ Good
const secret = process.env.SECRET_KEY;
```

### **2. Health Check**

Tambah endpoint untuk monitoring:
```typescript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

### **3. Logging**

Gunakan console.log untuk debugging:
```typescript
console.log('Server started on port', process.env.PORT);
console.log('Environment:', process.env.NODE_ENV);
```

### **4. Error Handling**

Handle errors dengan baik:
```typescript
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## 📋 Checklist Deploy

- [ ] Code pushed ke GitHub
- [ ] Render account created
- [ ] Web service created
- [ ] Build command configured
- [ ] Start command configured
- [ ] Environment variables set (NODE_ENV, PORT)
- [ ] Deploy successful
- [ ] URL accessible
- [ ] Login tested
- [ ] All features tested
- [ ] UptimeRobot setup (optional)
- [ ] Custom domain added (optional)

---

## 🎉 Selamat!

Aplikasi Anda sudah online di Render!

**URL:** https://pengawas-sekolah.onrender.com  
**Biaya:** GRATIS  
**Auto-deploy:** ✅  
**SSL:** ✅  

### **Next Steps:**

1. ✅ Share URL untuk testing
2. ✅ Setup UptimeRobot (prevent sleep)
3. ✅ Monitor logs & metrics
4. ✅ Migrate ke Supabase (jika perlu persistent data)
5. ✅ Add custom domain (optional)

---

## 💡 Tips

### **Untuk Testing:**
- Free tier sudah cukup
- Setup UptimeRobot untuk prevent sleep
- Backup data sebelum redeploy

### **Untuk Production:**
- Migrate ke Supabase (database)
- Upgrade ke Starter plan ($7/month)
- Setup Cloudinary (file storage)
- Add custom domain

---

**Platform:** Render.com  
**Difficulty:** ⭐ Easy  
**Time:** ~10 menit  
**Cost:** GRATIS selamanya!  
**Recommended:** ⭐⭐⭐⭐⭐ untuk uji coba

---

**Last Updated:** 11 November 2025  
**Status:** ✅ Perfect untuk uji coba aplikasi!
