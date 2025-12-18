# 🚀 Deploy ke Vercel - Step by Step

## 📋 Panduan Lengkap Deploy Vercel

### Step 1: Setup Vercel Account

1. **Buka** https://vercel.com
2. **Sign up** dengan GitHub account Bapak
3. **Authorize Vercel** untuk akses GitHub repositories

### Step 2: Push Code ke GitHub

Pastikan code sudah di-push ke GitHub repository:

```bash
# Add semua perubahan
git add .

# Commit perubahan
git commit -m "feat: Setup for Vercel deployment with local storage"

# Push ke GitHub
git push origin main
```

### Step 3: Import Project ke Vercel

1. **Login ke Vercel** → https://vercel.com/dashboard
2. **Klik "New Project"**
3. **Import dari GitHub** → Pilih repository "SchoolGuardManager"
4. **Configure Project:**
   ```
   Framework Preset: Other
   Build Command: npm run build
   Output Directory: dist/public
   Install Command: npm install
   Root Directory: ./
   ```

### Step 4: Setup Environment Variables

Di Vercel dashboard, masuk ke **Settings** → **Environment Variables**, tambahkan:

```bash
# Production Environment Variables
NODE_ENV=production
JWT_SECRET=schoolguard-secret-key-2024
SESSION_SECRET=schoolguard-secret-key-2024

# Database URL (kosongkan untuk menggunakan local storage)
# DATABASE_URL=
```

**PENTING:** Jangan isi `DATABASE_URL` supaya aplikasi menggunakan local storage!

### Step 5: Deploy

1. **Klik "Deploy"**
2. **Tunggu build process** (2-3 menit)
3. **Dapatkan URL deployment** (misal: https://school-guard-manager.vercel.app)

### Step 6: Test Deployment

1. **Buka URL Vercel**
2. **Login dengan:**
   - Username: `admin`
   - Password: `admin`
3. **Test semua fitur:**
   - ✅ Dashboard
   - ✅ CRUD data
   - ✅ Upload foto
   - ✅ Generate PDF

---

## 🔧 Troubleshooting

### Build Error: "Module not found"
- Pastikan semua dependencies ada di `package.json`
- Jalankan `npm install` di local

### Runtime Error: "Cannot read property"
- Check environment variables di Vercel
- Pastikan `NODE_ENV=production`

### PDF Generation Error
- PDF generation mungkin perlu adjustment untuk serverless
- Monitor function logs di Vercel dashboard

---

## 📊 Monitoring

### Vercel Dashboard
- **Functions**: Monitor serverless function performance
- **Analytics**: Track usage dan performance
- **Logs**: Debug errors dan issues

### Performance Tips
- Monitor function execution time
- Check memory usage
- Optimize large files jika perlu

---

## 🎯 Next Steps Setelah Deploy

1. **Test thoroughly** di production
2. **Monitor performance** selama beberapa hari
3. **Setup custom domain** (optional)
4. **Migrate ke Supabase** setelah stabil
5. **Shutdown Render** setelah yakin Vercel OK

---

## ✅ Checklist Deploy

- [ ] Code di-push ke GitHub
- [ ] Vercel account setup
- [ ] Project imported ke Vercel
- [ ] Environment variables configured
- [ ] Build & deploy successful
- [ ] Application accessible via Vercel URL
- [ ] Login & basic functions working
- [ ] PDF generation working
- [ ] Performance acceptable

**🎉 Selamat! Aplikasi sekarang running di Vercel!**