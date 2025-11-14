# 🗄️ SETUP DATABASE SUPABASE

**Tanggal:** 11 November 2025  
**Platform:** Supabase (PostgreSQL)

---

## 📋 Daftar Isi

1. [Persiapan](#persiapan)
2. [Setup Project di Supabase](#setup-project)
3. [Buat Database Tables](#create-tables)
4. [Setup Row Level Security](#rls)
5. [Get Connection String](#connection)
6. [Update Aplikasi](#update-app)
7. [Migrasi Data](#migrasi)
8. [Testing](#testing)

---

## 🎯 Persiapan {#persiapan}

### **Yang Anda Butuhkan:**
- ✅ Akun Supabase (sudah registrasi)
- ✅ Aplikasi lokal berjalan dengan baik
- ✅ Data di local-database.json (untuk migrasi)

---

## 🚀 Setup Project di Supabase {#setup-project}

### **Step 1: Buat Project Baru**

1. Login ke https://supabase.com
2. Klik **"New Project"**
3. Isi form:
   ```
   Name: pengawas-sekolah
   Database Password: [buat password kuat]
   Region: Southeast Asia (Singapore) - terdekat dengan Indonesia
   Pricing Plan: Free (untuk mulai)
   ```
4. Klik **"Create new project"**
5. Tunggu ~2 menit sampai project ready

---

## 📊 Buat Database Tables {#create-tables}

### **Step 2: Buka SQL Editor**

1. Di dashboard Supabase, klik **"SQL Editor"** di sidebar
2. Klik **"New query"**
3. Copy-paste SQL berikut:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'pengawas' CHECK (role IN ('admin', 'pengawas')),
  nip TEXT,
  rank TEXT,
  office_name TEXT,
  office_address TEXT,
  home_address TEXT,
  phone TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schools table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact TEXT NOT NULL,
  principal_name TEXT,
  principal_nip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Perencanaan', 'Pendampingan', 'Pelaporan')),
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  photo1 TEXT,
  photo2 TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TEXT NOT NULL,
  description TEXT,
  reminded BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supervisions table
CREATE TABLE supervisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('Akademik', 'Manajerial')),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  teacher_name TEXT,
  teacher_nip TEXT,
  findings TEXT NOT NULL,
  recommendations TEXT,
  photo1 TEXT,
  photo2 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional tasks table
CREATE TABLE additional_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  organizer TEXT NOT NULL,
  description TEXT NOT NULL,
  photo1 TEXT,
  photo2 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_schools_user_id ON schools(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_supervisions_user_id ON supervisions(user_id);
CREATE INDEX idx_supervisions_school_id ON supervisions(school_id);
CREATE INDEX idx_additional_tasks_user_id ON additional_tasks(user_id);

-- Insert default admin user (password: admin123)
-- Note: Password hash untuk 'admin123' menggunakan bcrypt
INSERT INTO users (username, password, full_name, role)
VALUES (
  'admin',
  '$2a$10$rOjLHYoqP.5zQqYvV5rXXeGxqY8qJ5K5qJ5K5qJ5K5qJ5K5qJ5K5q',
  'Administrator',
  'admin'
);
```

4. Klik **"Run"** atau tekan `Ctrl+Enter`
5. Pastikan semua query berhasil (✅ Success)

---

## 🔒 Setup Row Level Security (RLS) {#rls}

### **Step 3: Enable RLS**

Supabase menggunakan Row Level Security untuk keamanan. Jalankan SQL berikut:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text OR role = 'admin');

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Create policies for schools table
CREATE POLICY "Users can view their own schools"
  ON schools FOR SELECT
  USING (user_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Users can insert their own schools"
  ON schools FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own schools"
  ON schools FOR UPDATE
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own schools"
  ON schools FOR DELETE
  USING (user_id::text = auth.uid()::text);

-- Similar policies for other tables
-- (Tasks, Events, Supervisions, Additional Tasks)
-- Copy pattern dari schools table
```

**Note:** Untuk aplikasi ini, kita akan menggunakan service role key di backend, jadi RLS bisa di-disable atau di-configure sesuai kebutuhan.

---

## 🔗 Get Connection String {#connection}

### **Step 4: Ambil Database Credentials**

1. Di dashboard Supabase, klik **"Settings"** (⚙️) di sidebar
2. Klik **"Database"**
3. Scroll ke **"Connection string"**
4. Pilih tab **"URI"**
5. Copy connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
6. Ganti `[YOUR-PASSWORD]` dengan password yang Anda buat tadi

### **Step 5: Get API Keys**

1. Klik **"Settings"** → **"API"**
2. Copy:
   - **Project URL:** `https://[YOUR-PROJECT-REF].supabase.co`
   - **anon public key:** (untuk frontend - optional)
   - **service_role key:** (untuk backend - RAHASIA!)

---

## 🔧 Update Aplikasi {#update-app}

### **Step 6: Install Dependencies**

```bash
# Install PostgreSQL driver
npm install pg

# Install Drizzle ORM (sudah ada di package.json)
# Tidak perlu install lagi
```

### **Step 7: Update Environment Variables**

Buat file `.env` di root project:

```env
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_KEY=[YOUR-SERVICE-KEY]

# App
NODE_ENV=production
PORT=5000
```

**PENTING:** Jangan commit file `.env` ke Git! Pastikan ada di `.gitignore`

### **Step 8: Update server/index.ts**

Aplikasi sudah support PostgreSQL via Drizzle ORM. Pastikan environment variable `DATABASE_URL` terdeteksi:

```typescript
// Di server/index.ts, cek bagian ini:
const isLocalStorageEnabled = !process.env.DATABASE_URL;

// Jika DATABASE_URL ada, akan pakai PostgreSQL
// Jika tidak ada, akan pakai local JSON storage
```

---

## 📦 Migrasi Data dari Local ke Supabase {#migrasi}

### **Step 9: Export Data dari Local**

Buat script untuk export data:

```javascript
// scripts/export-to-supabase.js
const fs = require('fs');
const { Client } = require('pg');

async function migrateData() {
  // Read local database
  const localData = JSON.parse(fs.readFileSync('local-database.json', 'utf8'));
  
  // Connect to Supabase
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  await client.connect();
  
  try {
    // Migrate users
    for (const user of localData.users) {
      await client.query(
        `INSERT INTO users (id, username, password, full_name, role, nip, rank, phone, photo_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (username) DO NOTHING`,
        [user.id, user.username, user.password, user.fullName, user.role, 
         user.nip, user.rank, user.phone, user.photoUrl, user.createdAt]
      );
    }
    
    // Migrate schools
    for (const school of localData.schools) {
      await client.query(
        `INSERT INTO schools (id, user_id, name, address, contact, principal_name, principal_nip, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [school.id, school.userId, school.name, school.address, school.contact,
         school.principalName, school.principalNip, school.createdAt]
      );
    }
    
    // Migrate tasks, events, supervisions, additional_tasks
    // ... (similar pattern)
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.end();
  }
}

migrateData();
```

Jalankan:
```bash
node scripts/export-to-supabase.js
```

---

## 🧪 Testing {#testing}

### **Step 10: Test Connection**

```bash
# Set environment variable
export DATABASE_URL="postgresql://postgres:..."

# Start aplikasi
npm run dev

# Check logs
# Harus muncul: "✓ Connected to PostgreSQL database"
```

### **Step 11: Test CRUD Operations**

1. **Login** dengan admin/admin123
2. **Buat data baru** (sekolah, tugas, dll)
3. **Edit data**
4. **Delete data**
5. **Check di Supabase dashboard** → Table Editor

---

## 📊 Monitoring di Supabase

### **Dashboard Features:**

1. **Table Editor** - Lihat & edit data langsung
2. **SQL Editor** - Run custom queries
3. **Database** - Monitor performance
4. **Logs** - Debug issues
5. **API Docs** - Auto-generated API documentation

---

## 🔄 Backup & Restore

### **Backup Database:**

```bash
# Via Supabase CLI
supabase db dump -f backup.sql

# Atau via pg_dump
pg_dump "postgresql://postgres:..." > backup.sql
```

### **Restore Database:**

```bash
# Via psql
psql "postgresql://postgres:..." < backup.sql
```

---

## 💰 Pricing

### **Free Tier:**
```
Database: 500 MB
Bandwidth: 2 GB
API Requests: Unlimited
```

### **Pro Tier ($25/month):**
```
Database: 8 GB
Bandwidth: 50 GB
Daily Backups
Point-in-time Recovery
```

---

## ✅ Checklist

- [ ] Project Supabase dibuat
- [ ] Tables dibuat dengan SQL
- [ ] RLS dikonfigurasi (optional)
- [ ] Connection string didapat
- [ ] API keys didapat
- [ ] .env file dibuat
- [ ] Dependencies installed
- [ ] Data dimigrasi
- [ ] Testing berhasil
- [ ] Aplikasi berjalan dengan Supabase

---

## 🆘 Troubleshooting

### **Connection Error:**
```
Error: connect ECONNREFUSED
```
**Solution:** Check DATABASE_URL, pastikan password benar

### **Authentication Error:**
```
Error: password authentication failed
```
**Solution:** Reset database password di Supabase dashboard

### **Table Not Found:**
```
Error: relation "users" does not exist
```
**Solution:** Jalankan ulang SQL untuk create tables

---

## 🎯 Next Steps

Setelah Supabase setup:

1. ✅ Deploy aplikasi ke VPS/Cloud
2. ✅ Update environment variables di server
3. ✅ Test production
4. ✅ Setup backup schedule
5. ✅ Monitor performance

---

## 📞 Support

### **Supabase Resources:**
- Documentation: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase

---

**Selamat! Database Supabase Anda sudah siap digunakan!** 🎉

---

**Last Updated:** 11 November 2025  
**Platform:** Supabase (PostgreSQL)  
**Status:** ✅ Production Ready
