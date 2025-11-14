# ⚡ QUICK HOSTING GUIDE

**Panduan Cepat Hosting Aplikasi Pengawas Sekolah**

---

## 🎯 Langkah Singkat

### **1. Sewa VPS** (Rp 50.000-150.000/bulan)
- Niagahoster, IDCloudHost, atau DigitalOcean
- Spesifikasi: 1 CPU, 1-2 GB RAM, 20 GB SSD
- OS: Ubuntu 22.04 LTS

### **2. Setup Server** (15 menit)
```bash
# Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2
```

### **3. Upload Aplikasi** (10 menit)
```bash
# Via Git
cd /var/www
git clone your-repo
cd your-app
npm install
npm run build
```

### **4. Start Aplikasi** (5 menit)
```bash
# Start dengan PM2
pm2 start npm --name "pengawas-app" -- start
pm2 save
pm2 startup
```

### **5. Setup Nginx** (10 menit)
```bash
# Buat config
sudo nano /etc/nginx/sites-available/pengawas-app
# (paste konfigurasi dari PANDUAN_HOSTING.md)

# Enable
sudo ln -s /etc/nginx/sites-available/pengawas-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **6. Setup SSL** (5 menit)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### **7. Done!** ✅
Aplikasi online di: https://your-domain.com

---

## 💰 Biaya

- **Domain:** Rp 15.000-150.000/tahun
- **VPS:** Rp 50.000-150.000/bulan
- **SSL:** GRATIS
- **Total:** ~Rp 65.000-300.000/bulan

---

## 📚 Dokumentasi Lengkap

Lihat **PANDUAN_HOSTING.md** untuk:
- Setup detail step-by-step
- Troubleshooting
- Backup & maintenance
- Monitoring
- Dan lainnya

---

**Total Waktu Setup: ~45 menit**  
**Difficulty: Medium** 🟡
