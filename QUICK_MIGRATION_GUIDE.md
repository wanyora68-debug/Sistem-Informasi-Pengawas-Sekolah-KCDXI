# 🚀 Quick Guide: Migrate Data Localhost ke Production

## 📋 Ringkasan

Data di localhost (local-database.json) tidak otomatis muncul di Render karena menggunakan database terpisah. Kita perlu migrate data.

## ⚡ Quick Steps (5-10 Menit)

### Step 1: Setup Database Gratis

**Pilih Neon (Recommended):**

1. Buka: https://neon.tech
2. Sign up dengan GitHub/Google
3. Klik "Create Project"
   - Nama: `pengawas-sekolah`
   - Region: Singapore
4. Copy **Connection String** (postgresql://...)

### Step 2: Configure Render

1. Buka: https://dashboard.render.com
2. Pilih service "pengawas-sekolah"
3. Klik tab "Environment"
4. Klik "Add Environment Variable"
   - Key: `DATABASE_URL`
   - Value: (paste connection string dari Neon)
5. Klik "Save Changes"
6. Tunggu auto-redeploy (~3 menit)

### Step 3: Update .env Localhost

Edit file `.env` di localhost:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
```

(Paste connection string yang sama dari Neon)

### Step 4: Push Database Schema

Di terminal localhost:

```bash
npm run db:push
```

Ini akan membuat semua tabel di database production.

### Step 5: Migrate Data

Di terminal localhost:

```bash
npm run migrate:local-to-prod
```

Script akan:
- ✅ Migrate 5 users
- ✅ Migrate 17 schools
- ✅ Migrate 1 task
- ✅ Migrate 1 supervision
- ✅ Migrate 3 additional tasks
- ✅ Migrate 2 events

### Step 6: Verify

1. Buka: https://pengawas-sekolah.onrender.com
2. Login dengan user existing:
   - Username: `wawan`
   - Password: (password yang sama di localhost)
3. Cek data sudah muncul:
   - ✅ Sekolah binaan
   - ✅ Tasks
   - ✅ Supervisions
   - ✅ Additional tasks
   - ✅ Events

### Step 7: Upload Foto Ulang

Karena foto tidak bisa dimigrate otomatis, perlu upload ulang:
- Foto profil user
- Foto dokumentasi (jika perlu)

## ✅ Done!

Data localhost sekarang sudah ada di production! 🎉

## 🐛 Troubleshooting

### Error: "DATABASE_URL not configured"
```bash
# Pastikan .env sudah diupdate
cat .env | grep DATABASE_URL
```

### Error: "Connection refused"
- Cek connection string benar
- Cek database masih aktif di Neon dashboard

### Data tidak muncul di Render
- Tunggu redeploy selesai (~3 menit)
- Refresh halaman
- Clear browser cache (Ctrl+Shift+R)

### Migration script error
```bash
# Cek log detail
npm run migrate:local-to-prod
```

## 📚 Dokumentasi Lengkap

Lihat: `MIGRATE_LOCAL_TO_PRODUCTION.md`

## 💡 Tips

1. **Backup Data:**
   - local-database.json sudah otomatis backup
   - Simpan copy jika perlu

2. **Password Tetap Sama:**
   - User bisa login dengan password yang sama
   - Password sudah di-hash, aman

3. **Foto Perlu Upload Ulang:**
   - Foto lama di folder `uploads/` tidak bisa dimigrate
   - Upload ulang setelah migration

4. **Database Gratis:**
   - Neon: 0.5 GB gratis
   - Supabase: 500 MB gratis
   - Cukup untuk aplikasi ini

## 🎯 Next Steps Setelah Migration

1. ✅ Test semua fitur di production
2. ✅ Upload foto profil
3. ✅ Upload foto dokumentasi
4. ✅ Setup UptimeRobot (prevent sleep)
5. ✅ Share URL untuk uji coba

---

**Butuh bantuan? Laporkan error yang muncul!** 🚀
