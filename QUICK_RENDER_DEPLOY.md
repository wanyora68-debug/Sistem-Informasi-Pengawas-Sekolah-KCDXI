# ⚡ QUICK DEPLOY RENDER.COM

**Deploy dalam 10 Menit - GRATIS!**

---

## 🚀 4 Langkah Mudah

### **1. Push ke GitHub** (3 menit)
```bash
git init
git add .
git commit -m "Deploy to Render"
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### **2. Create Web Service** (2 menit)
```
1. Login https://render.com (pakai GitHub)
2. New + → Web Service
3. Connect repository
```

### **3. Configure** (3 menit)
```
Name: pengawas-sekolah
Region: Singapore
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Plan: Free

Environment Variables:
NODE_ENV = production
PORT = 10000
```

### **4. Deploy!** (2 menit)
```
Klik "Create Web Service"
Tunggu ~3-5 menit
Done! 🎉
```

---

## ✅ URL Anda

```
https://pengawas-sekolah.onrender.com
```

**Login:** admin / admin123

---

## ⚠️ Penting!

**App sleep setelah 15 menit tidak ada traffic**

**Solusi:** Setup UptimeRobot (gratis)
1. Daftar https://uptimerobot.com
2. Add monitor → URL Anda
3. Interval: 5 minutes
4. App tidak sleep lagi!

---

## 📚 Dokumentasi Lengkap

Lihat **DEPLOY_RENDER.md** untuk:
- Troubleshooting
- Custom domain
- Database setup
- File storage
- Best practices

---

**Total Waktu:** ~10 menit  
**Biaya:** GRATIS selamanya!  
**Perfect untuk:** Uji coba & testing

---

**Butuh bantuan? Tanya saja!** 😊
