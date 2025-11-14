# 🚀 Panduan Deployment

Panduan untuk deploy Aplikasi Pengawas Sekolah ke production.

## 📋 Persiapan

### 1. Build Aplikasi
```bash
npm run build
```

### 2. Test Production Build
```bash
npm start
```

Aplikasi akan berjalan di port 5000.

---

## 🌐 Deployment Options

### Option 1: VPS / Cloud Server (Recommended)

#### A. Setup Server
1. **Buat VPS** (DigitalOcean, Linode, AWS EC2, dll)
2. **Install Node.js 18+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2** (Process Manager)
   ```bash
   sudo npm install -g pm2
   ```

#### B. Upload Aplikasi
```bash
# Clone atau upload ke server
git clone <repository-url>
cd SchoolGuardManager

# Install dependencies
npm install

# Build aplikasi
npm run build
```

#### C. Setup Environment
```bash
# Buat file .env
nano .env
```

Isi dengan:
```env
NODE_ENV=production
SESSION_SECRET=your-super-secret-key-change-this
ADMIN_PASSWORD=your-admin-password
# Optional: DATABASE_URL jika pakai PostgreSQL
```

#### D. Jalankan dengan PM2
```bash
# Start aplikasi
pm2 start npm --name "schoolguard" -- start

# Setup auto-restart on reboot
pm2 startup
pm2 save

# Monitor aplikasi
pm2 status
pm2 logs schoolguard
```

#### E. Setup Nginx (Reverse Proxy)
```bash
sudo apt install nginx

# Buat config
sudo nano /etc/nginx/sites-available/schoolguard
```

Config Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /path/to/SchoolGuardManager/uploads;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/schoolguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### F. Setup SSL (HTTPS)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

### Option 2: Heroku

#### A. Persiapan
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login
```

#### B. Create App
```bash
heroku create schoolguard-app
```

#### C. Setup Environment
```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret-key
heroku config:set ADMIN_PASSWORD=your-admin-password
```

#### D. Deploy
```bash
git push heroku main
```

#### E. Open App
```bash
heroku open
```

**Note:** Heroku filesystem adalah ephemeral, jadi `local-database.json` akan hilang setiap restart. Gunakan PostgreSQL untuk production di Heroku.

---

### Option 3: Railway

#### A. Persiapan
1. Buat akun di [Railway.app](https://railway.app)
2. Connect GitHub repository

#### B. Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Pilih repository
4. Railway akan auto-detect dan deploy

#### C. Setup Environment
Di Railway dashboard, tambahkan variables:
```
NODE_ENV=production
SESSION_SECRET=your-secret-key
ADMIN_PASSWORD=your-admin-password
```

#### D. Custom Domain (Optional)
1. Di Settings > Domains
2. Add custom domain
3. Update DNS records

---

### Option 4: Vercel (Frontend Only)

Vercel bagus untuk frontend, tapi backend Express perlu dipisah atau gunakan serverless functions.

**Recommended:** Deploy backend di Railway/Heroku, frontend di Vercel.

---

## 🗄️ Database Setup (Production)

### Menggunakan Neon PostgreSQL (Gratis)

#### A. Buat Database
1. Buka [Neon.tech](https://neon.tech)
2. Sign up / Login
3. Create new project
4. Copy connection string

#### B. Update Environment
```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

#### C. Migrate Data
Jika sudah ada data di `local-database.json`, perlu migrate manual atau buat script migration.

---

## 📦 Backup & Restore

### Backup Local Storage
```bash
# Backup data
cp local-database.json backup-$(date +%Y%m%d).json

# Backup uploads
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
```

### Restore
```bash
# Restore data
cp backup-20240101.json local-database.json

# Restore uploads
tar -xzf uploads-backup-20240101.tar.gz
```

### Backup Database (PostgreSQL)
```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## 🔒 Security Checklist

- [ ] Ganti `SESSION_SECRET` dengan random string yang kuat
- [ ] Ganti password admin default
- [ ] Setup HTTPS/SSL
- [ ] Setup firewall (UFW)
- [ ] Regular backup data
- [ ] Update dependencies secara berkala
- [ ] Monitor logs untuk suspicious activity
- [ ] Limit file upload size
- [ ] Validate user input

---

## 📊 Monitoring

### PM2 Monitoring
```bash
# Status
pm2 status

# Logs
pm2 logs schoolguard

# Restart
pm2 restart schoolguard

# Stop
pm2 stop schoolguard
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🔄 Update Aplikasi

### Update di Server
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart
pm2 restart schoolguard
```

---

## 🆘 Troubleshooting

### Port sudah digunakan
```bash
# Cek process di port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### PM2 tidak start
```bash
# Cek logs
pm2 logs schoolguard --lines 100

# Restart
pm2 restart schoolguard
```

### Nginx error
```bash
# Test config
sudo nginx -t

# Restart
sudo systemctl restart nginx
```

### Database connection error
- Cek DATABASE_URL benar
- Cek database masih aktif
- Cek network/firewall

---

## 📞 Support

Jika ada masalah deployment:
1. Cek logs aplikasi
2. Cek logs server (PM2/Nginx)
3. Cek environment variables
4. Restart aplikasi dan server

---

**Good luck with deployment! 🚀**
