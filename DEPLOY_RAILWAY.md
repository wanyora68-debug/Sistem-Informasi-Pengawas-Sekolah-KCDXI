# 🚂 DEPLOY KE RAILWAY (RECOMMENDED)

**Cara Termudah Deploy Aplikasi Pengawas Sekolah**

---

## ⭐ Kenapa Railway?

✅ **Support full-stack** - Frontend + Backend  
✅ **File storage works** - Uploads berfungsi  
✅ **Database works** - Local JSON atau PostgreSQL  
✅ **Auto-deploy** - Push GitHub = auto deploy  
✅ **Free tier** - $5 credit gratis/bulan  
✅ **Easy setup** - 10 menit selesai  

---

## 🚀 Langkah Deploy (10 Menit)

### **Step 1: Push ke GitHub** (3 menit)

```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Ready for deployment"

# Create repo di GitHub
# Lalu push:
git remote add origin https://github.com/username/repo-name.git
git branch -M main
git push -u origin main
```

### **Step 2: Connect ke Railway** (2 menit)

1. Buka https://railway.app
2. Klik **"Start a New Project"**
3. Login dengan GitHub
4. Klik **"Deploy from GitHub repo"**
5. Pilih repository Anda
6. Klik **"Deploy Now"**

Railway akan otomatis:
- ✅ Detect Node.js app
- ✅ Install dependencies
- ✅ Build aplikasi
- ✅ Deploy!

### **Step 3: Set Environment Variables** (2 menit)

Di Railway dashboard:

1. Klik project Anda
2. Klik tab **"Variables"**
3. Add variables:

```
NODE_ENV = production
PORT = 5000
```

Optional (jika pakai Supabase):
```
DATABASE_URL = postgresql://...
SUPABASE_URL = https://...
SUPABASE_SERVICE_KEY = ...
```

4. Klik **"Save"**
5. Railway auto-redeploy

### **Step 4: Get URL & Test** (3 menit)

1. Klik tab **"Settings"**
2. Scroll ke **"Domains"**
3. Klik **"Generate Domain"**
4. Copy URL: `https://your-app.up.railway.app`
5. Buka di browser
6. Test login & fitur!

---

## ✅ Done!

Aplikasi Anda sudah online di Railway! 🎉

**URL:** https://your-app.up.railway.app  
**Auto-deploy:** Setiap push ke GitHub  
**Biaya:** Free ($5 credit/bulan)

---

## 🔧 Konfigurasi Tambahan

### **Custom Domain** (Optional)

1. Beli domain (Niagahoster, dll)
2. Di Railway → Settings → Domains
3. Add custom domain
4. Update DNS di domain provider:
   ```
   CNAME: your-domain.com → your-app.up.railway.app
   ```
5. Wait for DNS propagation (~1-24 jam)

### **Database Supabase** (Optional)

Jika ingin pakai PostgreSQL:

1. Setup Supabase (SETUP_SUPABASE.md)
2. Get connection string
3. Add ke Railway environment variables
4. Redeploy

### **Monitoring**

Railway dashboard menampilkan:
- ✅ Deployment logs
- ✅ Build logs
- ✅ Runtime logs
- ✅ Metrics (CPU, Memory)
- ✅ Crash reports

---

## 💰 Pricing

### **Free Tier:**
```
$5 credit/bulan (gratis)
~500 jam runtime
Cukup untuk aplikasi kecil-menengah
```

### **Hobby Plan ($5/month):**
```
$5 credit + $5 usage
~1000 jam runtime
Unlimited projects
```

### **Pro Plan ($20/month):**
```
$20 credit + usage
Priority support
Team features
```

**Estimasi:** Aplikasi ini ~$0-5/bulan

---

## 🔄 Auto-Deploy

Setiap kali Anda push ke GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

Railway otomatis:
1. Detect changes
2. Build aplikasi
3. Deploy
4. Update URL

**Tidak perlu manual deploy!**

---

## 📊 Monitoring

### **View Logs:**

Di Railway dashboard:
1. Klik project
2. Klik tab **"Deployments"**
3. Klik deployment terbaru
4. View logs real-time

### **Check Metrics:**

Tab **"Metrics"** menampilkan:
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 🆘 Troubleshooting

### **Build Failed:**

```
Error: Build failed
```

**Solution:**
1. Check build logs
2. Pastikan `npm run build` works di local
3. Check package.json scripts

### **App Crashed:**

```
Error: Application error
```

**Solution:**
1. Check runtime logs
2. Pastikan PORT environment variable set
3. Check server/index.ts listen on process.env.PORT

### **Database Error:**

```
Error: Cannot connect to database
```

**Solution:**
1. Check DATABASE_URL environment variable
2. Jika pakai local JSON, pastikan file ada
3. Jika pakai Supabase, check connection string

---

## 🎯 Best Practices

### **1. Environment Variables**

Jangan hardcode sensitive data:
```typescript
// ❌ Bad
const dbUrl = "postgresql://user:pass@...";

// ✅ Good
const dbUrl = process.env.DATABASE_URL;
```

### **2. Logging**

Gunakan console.log untuk debugging:
```typescript
console.log('Server started on port', process.env.PORT);
console.log('Database connected');
```

### **3. Error Handling**

Handle errors dengan baik:
```typescript
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
```

### **4. Health Check**

Tambah endpoint health check:
```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

---

## 🔐 Security

### **Environment Variables:**

Jangan commit .env ke Git:
```bash
# .gitignore
.env
.env.local
.env.production
```

### **CORS:**

Update CORS untuk production:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### **Rate Limiting:**

Tambah rate limiting (optional):
```bash
npm install express-rate-limit
```

---

## 📈 Scaling

Jika traffic meningkat:

1. **Upgrade Plan** - Hobby → Pro
2. **Add Database** - Migrate ke Supabase
3. **Add CDN** - Cloudflare
4. **Optimize Code** - Caching, compression

---

## ✅ Checklist

- [ ] Code pushed ke GitHub
- [ ] Railway project created
- [ ] App deployed successfully
- [ ] Environment variables set
- [ ] Custom domain added (optional)
- [ ] Database configured (optional)
- [ ] Tested all features
- [ ] Monitoring setup

---

## 🎉 Selamat!

Aplikasi Anda sudah online di Railway!

**Next Steps:**
1. Share URL ke user
2. Monitor logs & metrics
3. Update fitur (auto-deploy)
4. Scale jika perlu

---

**Platform:** Railway.app  
**Difficulty:** ⭐ Easy  
**Time:** ~10 menit  
**Cost:** $0-5/bulan  
**Recommended:** ⭐⭐⭐⭐⭐

---

**Last Updated:** 11 November 2025  
**Status:** ✅ Recommended untuk aplikasi ini
