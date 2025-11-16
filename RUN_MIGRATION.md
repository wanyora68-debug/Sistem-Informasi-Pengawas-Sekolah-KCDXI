# 🔄 Run Migration - Migrate Data ke Production

## Prerequisites

✅ Database Neon sudah dibuat
✅ DATABASE_URL sudah dikonfigurasi di Render
✅ Render sudah redeploy dan running

## Step 1: Update .env di Localhost

1. **Buka file `.env`** di root project (folder SchoolGuardManager)

2. **Edit baris DATABASE_URL:**
   
   **Before:**
   ```env
   DATABASE_URL=postgresql://user:password@ep-example.us-east-2.aws.neon.tech/schoolguard?sslmode=require
   ```

   **After:**
   ```env
   DATABASE_URL=postgresql://[paste connection string dari Neon]
   ```

   **Contoh:**
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_abc123xyz@ep-cool-morning-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

3. **Save file** (Ctrl+S)

## Step 2: Push Database Schema

Buka **Terminal/PowerShell** di folder project, lalu jalankan:

```bash
npm run db:push
```

**Expected Output:**
```
✓ Pushing schema to database...
✓ Schema pushed successfully!
```

**Ini akan:**
- Membuat semua tabel di database Neon
- Users, Schools, Tasks, Supervisions, Additional Tasks, Events

## Step 3: Run Migration Script

Di terminal yang sama, jalankan:

```bash
npm run migrate:local-to-prod
```

**Expected Output:**
```
📊 Local Database Summary:
   Users: 5
   Schools: 17
   Tasks: 1
   Supervisions: 1
   Additional Tasks: 3
   Events: 2

🚀 Starting migration...

👥 Migrating users...
   ✓ admin (Administrator)
   ✓ wawan (H. Wawan Yogaswara, S.Pd, M.Pd)
   ✓ Undang (Undang)
   ✓ yenihandayani (Yeni Handayani)
   ✓ Dede66 (Dra. Hj. Dede Ikah)

🏫 Migrating schools...
   ✓ SMKN 4 GARUT
   ✓ SMK PLUS GODOG
   ... (17 schools total)

📋 Migrating tasks...
   ✓ Input Data Sekolah Binaan

📝 Migrating supervisions...
   ✓ Akademik - Supyan Sauri

📌 Migrating additional tasks...
   ✓ Apel Pagi
   ✓ Silaturahmi dan perkenalan kepala SMKN 14
   ✓ Pisah sambut Kepala SMKN 14 GArut

📅 Migrating events...
   ✓ Input data sekolah binaan
   ✓ Monitoring KBM

✅ Migration completed successfully!
```

## Step 4: Verify di Production

1. **Buka browser** dan kunjungi:
   ```
   https://pengawas-sekolah.onrender.com
   ```

2. **Login dengan user existing:**
   - Username: `wawan`
   - Password: (password yang sama seperti di localhost)

3. **Cek data:**
   - ✅ Klik "Sekolah Binaan" → Harus ada 17 sekolah
   - ✅ Klik "Tugas Pokok" → Harus ada 1 task
   - ✅ Klik "Supervisi" → Harus ada 1 supervisi
   - ✅ Klik "Tugas Tambahan" → Harus ada 3 tasks
   - ✅ Klik "Kalender" → Harus ada 2 events

## Step 5: Upload Foto Ulang

Karena foto tidak bisa dimigrate otomatis:

1. **Upload foto profil:**
   - Klik nama user di pojok kanan atas
   - Klik "Profil"
   - Upload foto profil baru

2. **Upload foto dokumentasi** (jika perlu):
   - Buka Tasks/Supervisions/Additional Tasks
   - Edit item yang perlu foto
   - Upload foto baru

## ✅ Checklist Verification

- [ ] Schema sudah di-push (npm run db:push)
- [ ] Migration berhasil (npm run migrate:local-to-prod)
- [ ] Bisa login di production dengan user "wawan"
- [ ] 17 sekolah muncul di halaman Sekolah Binaan
- [ ] 1 task muncul di Tugas Pokok
- [ ] 1 supervisi muncul di Supervisi
- [ ] 3 additional tasks muncul di Tugas Tambahan
- [ ] 2 events muncul di Kalender

## 🐛 Troubleshooting

### Error: "DATABASE_URL is not configured"

**Solusi:**
1. Cek file `.env` sudah diupdate
2. Restart terminal
3. Jalankan ulang command

### Error: "Connection refused"

**Solusi:**
1. Cek connection string benar
2. Cek database Neon masih aktif
3. Cek tidak ada typo di connection string

### Error: "duplicate key value"

**Normal!** Artinya data sudah ada di database.

**Solusi:**
- Skip error ini
- Atau hapus data di database dan migrate ulang

### Data tidak muncul di production

**Solusi:**
1. Tunggu 1-2 menit (cache)
2. Hard refresh browser (Ctrl+Shift+R)
3. Logout dan login ulang
4. Cek logs di Render untuk error

## 📝 Notes

**Password Users:**
- Password tetap sama seperti di localhost
- Sudah di-hash, aman
- User bisa langsung login

**Foto:**
- Foto lama tidak bisa dimigrate
- Perlu upload ulang
- Foto baru akan tersimpan sebagai base64 (tidak akan hilang)

**Database:**
- Data sekarang di Neon (cloud)
- Persistent, tidak akan hilang
- Bisa diakses dari mana saja

## 🎉 Success!

Jika semua checklist ✅, maka:
- ✅ Database production sudah setup
- ✅ Data sudah dimigrate
- ✅ Aplikasi siap digunakan
- ✅ Data tidak akan hilang lagi

## 🎯 Next Steps

1. ✅ Test semua fitur di production
2. ✅ Upload foto profil dan dokumentasi
3. ✅ Share URL untuk uji coba
4. ✅ Setup UptimeRobot (prevent sleep)

---

**Selamat! Data localhost sekarang sudah ada di production!** 🎊
