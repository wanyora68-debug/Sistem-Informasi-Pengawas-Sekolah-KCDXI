# 🚀 Deploy ke Vercel + Supabase - Panduan Lengkap

## 🎯 Overview
Kita akan deploy aplikasi SchoolGuardManager ke production dengan:
- **Frontend + API**: Vercel (gratis)
- **Database**: Supabase (gratis)
- **File Storage**: Supabase Storage (gratis)

## 📋 Persiapan

### ✅ Checklist Sebelum Deploy
- [x] Aplikasi berjalan di localhost:5000
- [x] Admin features aktif
- [x] Data local tersimpan dengan baik
- [x] Build berhasil (`npm run build`)

## 🗄️ Step 1: Setup Supabase Database

### 1.1 Buat Project Supabase
1. **Buka**: https://supabase.com
2. **Sign up/Login** dengan GitHub
3. **Klik**: "New Project"
4. **Isi**:
   - Project Name: `schoolguard-manager`
   - Database Password: `yogaswara123` (simpan password ini!)
   - Region: `Southeast Asia (Singapore)`
5. **Klik**: "Create new project"
6. **Tunggu** ~2 menit hingga project siap

### 1.2 Setup Database Schema
1. **Masuk ke project** Supabase
2. **Klik**: "SQL Editor" di sidebar
3. **Klik**: "New query"
4. **Copy paste script** berikut:

```sql
-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'pengawas',
  nip TEXT,
  rank TEXT,
  phone TEXT,
  email TEXT,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schools table
CREATE TABLE schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  principal TEXT,
  phone TEXT,
  email TEXT,
  type TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supervisions table
CREATE TABLE supervisions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  school_id TEXT REFERENCES schools(id),
  date DATE NOT NULL,
  type TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  school_id TEXT REFERENCES schools(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activities table
CREATE TABLE user_activities (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO users (
  id, username, password, full_name, role, email, department, status
) VALUES (
  'admin-1',
  'admin',
  '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu',
  'Administrator',
  'admin',
  'admin@disdik.jabar.go.id',
  'Cabang Dinas Pendidikan Wilayah XI',
  'active'
);

-- Insert sample pengawas user
INSERT INTO users (
  id, username, password, full_name, role, nip, rank, phone, email, department, status
) VALUES (
  'wawan-123',
  'wawan',
  '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu',
  'H. Wawan Yogaswara, S.Pd, M.Pd',
  'pengawas',
  '196805301994121001',
  'Pembina Utama Muda, IV/c',
  '087733438282',
  'wawan.yogaswara@disdik.jabar.go.id',
  'Cabang Dinas Pendidikan Wilayah XI',
  'active'
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON schools FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON supervisions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON user_activities FOR ALL USING (true);
```

5. **Klik**: "Run" untuk execute script
6. **Verifikasi**: Cek di "Table Editor" bahwa semua table sudah dibuat

### 1.3 Get Database URL
1. **Klik**: "Settings" → "Database"
2. **Scroll ke**: "Connection string"
3. **Copy**: Connection string (format: `postgresql://postgres:[password]@[host]:5432/postgres`)
4. **Simpan** URL ini untuk step selanjutnya

## 🌐 Step 2: Setup Vercel Deployment

### 2.1 Persiapan Repository
1. **Pastikan** semua file sudah di-commit ke Git
2. **Push** ke GitHub repository

### 2.2 Deploy ke Vercel
1. **Buka**: https://vercel.com
2. **Sign up/Login** dengan GitHub
3. **Klik**: "New Project"
4. **Import** repository SchoolGuardManager
5. **Configure Project**:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

### 2.3 Setup Environment Variables
Di Vercel dashboard:
1. **Klik**: "Settings" → "Environment Variables"
2. **Tambahkan** variables berikut:

```
DATABASE_URL = [paste Supabase connection string]
JWT_SECRET = schoolguard-secret-key-2024
SESSION_SECRET = schoolguard-secret-key-2024
NODE_ENV = production
USE_LOCAL_STORAGE = false
```

3. **Klik**: "Save" untuk setiap variable

### 2.4 Deploy
1. **Klik**: "Deployments" tab
2. **Klik**: "Redeploy" jika perlu
3. **Tunggu** hingga deployment selesai
4. **Klik** URL production untuk test

## 🔧 Step 3: Migrate Data Local ke Supabase

### 3.1 Buat Script Migration
Saya akan buat script untuk migrate data dari `local-database.json` ke Supabase.

### 3.2 Test Connection
1. **Buka** production URL
2. **Login** dengan:
   - Username: `admin`
   - Password: `admin123`
3. **Cek** semua fitur berfungsi

## 🧪 Step 4: Testing Production

### 4.1 Test Checklist
- [ ] Login admin berhasil
- [ ] Dashboard menampilkan data
- [ ] CRUD users berfungsi
- [ ] CRUD schools berfungsi
- [ ] Upload foto berfungsi
- [ ] Export PDF berfungsi
- [ ] Responsive di mobile

### 4.2 Performance Check
- [ ] Loading time < 3 detik
- [ ] Database queries cepat
- [ ] File upload lancar

## 🔒 Step 5: Security & Optimization

### 5.1 Database Security
- [ ] Row Level Security enabled
- [ ] Proper policies configured
- [ ] Sensitive data encrypted

### 5.2 Environment Security
- [ ] Environment variables aman
- [ ] No hardcoded secrets
- [ ] HTTPS enforced

## 📱 Step 6: Domain & SSL (Opsional)

### 6.1 Custom Domain
1. **Beli domain** (opsional)
2. **Setup** di Vercel Settings → Domains
3. **Configure** DNS records

### 6.2 SSL Certificate
- Vercel otomatis provide SSL certificate
- HTTPS akan aktif secara otomatis

## 🎉 Hasil Akhir

Setelah semua step selesai, Anda akan memiliki:
- ✅ **Production URL**: https://schoolguard-manager.vercel.app
- ✅ **Database**: Supabase PostgreSQL
- ✅ **File Storage**: Supabase Storage
- ✅ **SSL**: Otomatis dari Vercel
- ✅ **Monitoring**: Vercel Analytics
- ✅ **Backup**: Supabase automatic backup

## 🚨 Troubleshooting

### Build Errors
```bash
# Jika ada error saat build
npm run build
# Check error dan fix
```

### Database Connection Issues
```bash
# Test connection
node -e "console.log(process.env.DATABASE_URL)"
```

### Environment Variables
- Pastikan semua env vars sudah di-set di Vercel
- Restart deployment setelah update env vars

---

**🎯 Next Steps**: Setelah deploy berhasil, kita bisa setup monitoring, backup, dan optimasi performance lebih lanjut!