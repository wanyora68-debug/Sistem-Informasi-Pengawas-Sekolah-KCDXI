# 🚀 PANDUAN HOSTING APLIKASI PENGAWAS SEKOLAH

**Tanggal:** 11 November 2025  
**Status:** Production Ready

---

## 📋 Daftar Isi

1. [Persiapan Sebelum Hosting](#persiapan)
2. [Pilihan Platform Hosting](#platform)
3. [Hosting di VPS (Recommended)](#vps)
4. [Hosting di Cloud Platform](#cloud)
5. [Konfigurasi Domain](#domain)
6. [SSL Certificate](#ssl)
7. [Backup & Maintenance](#backup)

---

## 🎯 Persiapan Sebelum Hosting {#persiapan}

### 1. **Checklist Aplikasi**

```
✅ Aplikasi berjalan dengan baik di local
✅ Semua fitur sudah ditest
✅ Database sudah ada data (minimal admin user)
✅ File uploads folder sudah ada
✅ Environment variables sudah disiapkan
✅ Build production sudah ditest
```

### 2. **Build Production**

```bash
# Build aplikasi untuk production
npm run build

# Test production build di local
npm start
```

### 3. **Backup Data**

```bash
# Backup database
copy local-database.json local-database-backup-$(date +%Y%m%d).json

# Backup uploads folder
xcopy /E /I uploads uploads-backup
```

---

## 🌐 Pilihan Platform Hosting {#platform}

### **Option 1: VPS (Virtual Private Server)** ⭐ RECOMMENDED
**Pros:**
- ✅ Full control
- ✅ Bisa install apa saja
- ✅ Cocok untuk local JSON database
- ✅ Harga terjangkau (mulai Rp 50.000/bulan)

**Cons:**
- ❌ Perlu setup manual
- ❌ Perlu maintenance sendiri

**Recommended Providers:**
- **Niagahoster** (Indonesia) - Rp 50.000-150.000/bulan
- **IDCloudHost** (Indonesia) - Rp 75.000-200.000/bulan
- **DigitalOcean** (Global) - $5-10/bulan
- **Vultr** (Global) - $5-10/bulan

---

### **Option 2: Cloud Platform (PaaS)**
**Pros:**
- ✅ Setup mudah
- ✅ Auto-scaling
- ✅ Maintenance minimal

**Cons:**
- ❌ Harga lebih mahal
- ❌ Perlu database eksternal (PostgreSQL)

**Recommended Providers:**
- **Railway** - Free tier available
- **Render** - Free tier available
- **Heroku** - $7/bulan
- **Vercel** - Free untuk frontend

---

### **Option 3: Shared Hosting**
**Pros:**
- ✅ Paling murah
- ✅ Setup mudah

**Cons:**
- ❌ Limited resources
- ❌ Tidak support Node.js dengan baik
- ❌ Tidak recommended untuk aplikasi ini

---

## 🖥️ Hosting di VPS (RECOMMENDED) {#vps}

### **Step 1: Sewa VPS**

#### Spesifikasi Minimum:
```
CPU: 1 Core
RAM: 1 GB
Storage: 20 GB SSD
OS: Ubuntu 20.04 atau 22.04 LTS
```

#### Spesifikasi Recommended:
```
CPU: 2 Core
RAM: 2 GB
Storage: 40 GB SSD
OS: Ubuntu 22.04 LTS
```

---

### **Step 2: Setup Server**

#### 1. **Connect ke VPS**
```bash
# Via SSH
ssh root@your-server-ip

# Atau gunakan PuTTY di Windows
```

#### 2. **Update System**
```bash
sudo apt update
sudo apt upgrade -y
```

#### 3. **Install Node.js**
```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### 4. **Install PM2 (Process Manager)**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

#### 5. **Install Nginx (Web Server)**
```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

### **Step 3: Upload Aplikasi ke Server**

#### **Option A: Via Git (Recommended)**

```bash
# Di server, install git
sudo apt install -y git

# Clone repository
cd /var/www
sudo git clone https://github.com/your-username/your-repo.git
cd your-repo

# Install dependencies
npm install

# Build production
npm run build
```

#### **Option B: Via FTP/SFTP**

```bash
# Gunakan FileZilla atau WinSCP
# Upload semua file ke /var/www/your-app

# Di server:
cd /var/www/your-app
npm install
npm run build
```

---

### **Step 4: Setup Environment**

```bash
# Buat file .env
nano .env
```

Isi file `.env`:
```env
NODE_ENV=production
PORT=5000
DATABASE_PATH=/var/www/your-app/local-database.json
UPLOAD_PATH=/var/www/your-app/uploads
```

---

### **Step 5: Setup PM2**

```bash
# Start aplikasi dengan PM2
pm2 start npm --name "pengawas-app" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

# Check status
pm2 status
pm2 logs pengawas-app
```

---

### **Step 6: Setup Nginx**

```bash
# Buat konfigurasi Nginx
sudo nano /etc/nginx/sites-available/pengawas-app
```

Isi konfigurasi:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Upload size limit
    client_max_body_size 10M;
}
```

Enable konfigurasi:
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pengawas-app /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

### **Step 7: Setup Firewall**

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

## 🔒 SSL Certificate (HTTPS) {#ssl}

### **Install Certbot (Let's Encrypt)**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS (recommended)

# Test auto-renewal
sudo certbot renew --dry-run
```

Setelah SSL terinstall, Nginx akan otomatis dikonfigurasi untuk HTTPS!

---

## 🌍 Konfigurasi Domain {#domain}

### **Step 1: Beli Domain**

Providers recommended:
- **Niagahoster** (Indonesia) - Rp 15.000-150.000/tahun
- **IDCloudHost** (Indonesia)
- **Namecheap** (Global)
- **GoDaddy** (Global)

### **Step 2: Setup DNS**

Di control panel domain provider, tambahkan DNS records:

```
Type    Name    Value               TTL
A       @       your-server-ip      3600
A       www     your-server-ip      3600
```

**Tunggu 1-24 jam untuk DNS propagation**

### **Step 3: Verify**

```bash
# Check DNS
nslookup your-domain.com

# Test di browser
http://your-domain.com
```

---

## 💾 Backup & Maintenance {#backup}

### **1. Setup Automatic Backup**

```bash
# Buat script backup
nano /var/www/your-app/backup.sh
```

Isi script:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/pengawas-app"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
cp /var/www/your-app/local-database.json $BACKUP_DIR/database-$DATE.json

# Backup uploads
tar -czf $BACKUP_DIR/uploads-$DATE.tar.gz /var/www/your-app/uploads

# Keep only last 7 days
find $BACKUP_DIR -name "database-*.json" -mtime +7 -delete
find $BACKUP_DIR -name "uploads-*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Buat executable:
```bash
chmod +x /var/www/your-app/backup.sh
```

Setup cron job (daily backup):
```bash
# Edit crontab
crontab -e

# Add line (backup setiap hari jam 2 pagi)
0 2 * * * /var/www/your-app/backup.sh >> /var/log/backup.log 2>&1
```

---

### **2. Monitoring**

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs pengawas-app

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Check memory
free -h
```

---

### **3. Update Aplikasi**

```bash
# Pull latest code
cd /var/www/your-app
git pull

# Install dependencies
npm install

# Build
npm run build

# Restart PM2
pm2 restart pengawas-app

# Check status
pm2 status
```

---

## 🔧 Troubleshooting

### **Aplikasi tidak bisa diakses**

```bash
# Check PM2
pm2 status
pm2 logs pengawas-app

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check firewall
sudo ufw status

# Check port
sudo netstat -tulpn | grep :5000
```

### **Database error**

```bash
# Check file permissions
ls -la /var/www/your-app/local-database.json

# Fix permissions
sudo chown -R www-data:www-data /var/www/your-app
sudo chmod 644 /var/www/your-app/local-database.json
```

### **Upload error**

```bash
# Check uploads folder
ls -la /var/www/your-app/uploads

# Fix permissions
sudo chown -R www-data:www-data /var/www/your-app/uploads
sudo chmod 755 /var/www/your-app/uploads
```

---

## 📊 Estimasi Biaya

### **Setup Awal:**
```
Domain: Rp 15.000 - 150.000/tahun
VPS: Rp 50.000 - 150.000/bulan
SSL: GRATIS (Let's Encrypt)
```

### **Biaya Bulanan:**
```
VPS: Rp 50.000 - 150.000
Total: Rp 50.000 - 150.000/bulan
```

### **Biaya Tahunan:**
```
Domain: Rp 15.000 - 150.000
VPS: Rp 600.000 - 1.800.000
Total: Rp 615.000 - 1.950.000/tahun
```

---

## ✅ Checklist Deployment

### **Pre-Deployment:**
- [ ] Test aplikasi di local
- [ ] Build production berhasil
- [ ] Backup data
- [ ] Siapkan domain (optional)
- [ ] Sewa VPS

### **Deployment:**
- [ ] Setup server (Node.js, PM2, Nginx)
- [ ] Upload aplikasi
- [ ] Install dependencies
- [ ] Build production
- [ ] Setup PM2
- [ ] Setup Nginx
- [ ] Setup firewall
- [ ] Test akses

### **Post-Deployment:**
- [ ] Setup SSL (HTTPS)
- [ ] Konfigurasi domain
- [ ] Setup backup otomatis
- [ ] Setup monitoring
- [ ] Test semua fitur
- [ ] Update DNS

---

## 🎯 Quick Start (Ringkasan)

### **Untuk VPS:**

```bash
# 1. Connect ke VPS
ssh root@your-server-ip

# 2. Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2

# 3. Upload & setup aplikasi
cd /var/www
git clone your-repo
cd your-app
npm install
npm run build

# 4. Start dengan PM2
pm2 start npm --name "pengawas-app" -- start
pm2 save
pm2 startup

# 5. Setup Nginx
sudo nano /etc/nginx/sites-available/pengawas-app
# (paste konfigurasi)
sudo ln -s /etc/nginx/sites-available/pengawas-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 6. Setup SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 7. Done! 🎉
```

---

## 📞 Support

### **Jika Ada Masalah:**

1. Check logs: `pm2 logs pengawas-app`
2. Check Nginx: `sudo nginx -t`
3. Check firewall: `sudo ufw status`
4. Restart services:
   ```bash
   pm2 restart pengawas-app
   sudo systemctl restart nginx
   ```

---

## 🎉 Selamat!

Aplikasi Pengawas Sekolah Anda sekarang sudah online dan bisa diakses dari mana saja!

**URL:** https://your-domain.com  
**Admin:** admin / admin123

---

**Last Updated:** 11 November 2025  
**Status:** ✅ Production Ready  
**Recommended:** VPS dengan Ubuntu 22.04 LTS
