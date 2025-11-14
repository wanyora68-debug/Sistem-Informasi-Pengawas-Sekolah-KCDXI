# ⚡ QUICK SUPABASE SETUP

**Setup Database Supabase dalam 10 Menit**

---

## 🚀 Langkah Cepat

### **1. Buat Project** (2 menit)
```
1. Login ke https://supabase.com
2. Klik "New Project"
3. Isi:
   - Name: pengawas-sekolah
   - Password: [buat password kuat]
   - Region: Southeast Asia (Singapore)
4. Klik "Create new project"
5. Tunggu ~2 menit
```

### **2. Buat Tables** (3 menit)
```
1. Klik "SQL Editor"
2. Klik "New query"
3. Copy SQL dari SETUP_SUPABASE.md
4. Paste & Run
5. ✅ Tables created!
```

### **3. Get Credentials** (2 menit)
```
1. Settings → Database
2. Copy "Connection string"
3. Settings → API
4. Copy "service_role key"
```

### **4. Update .env** (1 menit)
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
SUPABASE_SERVICE_KEY=[YOUR-SERVICE-KEY]
```

### **5. Migrasi Data** (2 menit)
```bash
# Install pg
npm install pg

# Run migration
export DATABASE_URL="postgresql://..."
node scripts/migrate-to-supabase.js
```

### **6. Test** (1 menit)
```bash
npm run dev
# Login & test CRUD operations
```

---

## ✅ Done!

Database Supabase siap digunakan!

**Total waktu: ~10 menit**

---

## 📚 Dokumentasi Lengkap

Lihat **SETUP_SUPABASE.md** untuk:
- SQL schema lengkap
- RLS configuration
- Troubleshooting
- Backup & restore
- Dan lainnya

---

**Free Tier:** 500 MB database, 2 GB bandwidth  
**Upgrade:** $25/month untuk 8 GB database
