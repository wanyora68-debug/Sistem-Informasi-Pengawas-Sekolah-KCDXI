# 🚀 START HERE: Migrate Data Localhost ke Production

## 📋 Overview

Panduan ini akan membantu Anda migrate data dari localhost ke production dalam **3 langkah mudah** (~10-15 menit).

## 🎯 Apa yang Akan Dimigrate?

Dari `local-database.json` Anda:
- ✅ **5 Users** (admin, wawan, Undang, yenihandayani, Dede66)
- ✅ **17 Schools** (sekolah binaan)
- ✅ **1 Task** (Input Data Sekolah Binaan)
- ✅ **1 Supervision** (SMKS PLUS SUKARAJA)
- ✅ **3 Additional Tasks** (Apel Pagi, Silaturahmi, Pisah sambut)
- ✅ **2 Events** (Input data, Monitoring KBM)

## 📚 Panduan Step-by-Step

### 🔹 Step 1: Setup Database Neon (5 menit)

**Baca:** `SETUP_NEON_DATABASE.md`

**Ringkasan:**
1. Buka https://neon.tech
2. Sign up dengan GitHub/Google
3. Create Project: "pengawas-sekolah"
4. Copy Connection String

**Output:** Connection string PostgreSQL

---

### 🔹 Step 2: Configure Render (3 menit)

**Baca:** `CONFIGURE_RENDER_DATABASE.md`

**Ringkasan:**
1. Buka https://dashboard.render.com
2. Pilih service "pengawas-sekolah"
3. Add Environment Variable:
   - Key: `DATABASE_URL`
   - Value: (connection string dari Neon)
4. Tunggu auto-redeploy

**Output:** Render terkoneksi ke database Neon

---

### 🔹 Step 3: Run Migration (5 menit)

**Baca:** `RUN_MIGRATION.md`

**Ringkasan:**
1. Update `.env` di localhost
2. Run: `npm run db:push`
3. Run: `npm run migrate:local-to-prod`
4. Verify di production

**Output:** Semua data sudah ada di production!

---

## ⚡ Quick Commands

Setelah setup database, jalankan di terminal:

```bash
# 1. Push schema ke database
npm run db:push

# 2. Migrate data
npm run migrate:local-to-prod
```

## ✅ Verification Checklist

Setelah migration selesai, cek di production:

- [ ] Bisa login dengan user "wawan"
- [ ] 17 sekolah muncul di "Sekolah Binaan"
- [ ] 1 task muncul di "Tugas Pokok"
- [ ] 1 supervisi muncul di "Supervisi"
- [ ] 3 tasks muncul di "Tugas Tambahan"
- [ ] 2 events muncul di "Kalender"

## 🎯 Production URL

```
https://pengawas-sekolah.onrender.com
```

**Login:**
- Username: `wawan`
- Password: (sama seperti di localhost)

## 📖 Dokumentasi Lengkap

### Panduan Visual (Recommended):
1. **SETUP_NEON_DATABASE.md** - Setup database gratis
2. **CONFIGURE_RENDER_DATABASE.md** - Configure Render
3. **RUN_MIGRATION.md** - Migrate data

### Panduan Detail:
- **QUICK_MIGRATION_GUIDE.md** - Quick reference
- **MIGRATE_LOCAL_TO_PRODUCTION.md** - Detailed guide

## 🐛 Troubleshooting

### Masalah Umum:

**1. Error: "DATABASE_URL not configured"**
- Cek file `.env` sudah diupdate
- Restart terminal

**2. Error: "Connection refused"**
- Cek connection string benar
- Cek database Neon aktif

**3. Data tidak muncul**
- Tunggu 1-2 menit
- Hard refresh (Ctrl+Shift+R)
- Logout dan login ulang

**4. Migration error**
- Screenshot error
- Cek logs detail
- Tanyakan untuk bantuan

## 💡 Tips

1. **Backup Data:**
   - `local-database.json` sudah otomatis backup
   - Simpan copy jika perlu

2. **Password Tetap Sama:**
   - User bisa login dengan password yang sama
   - Tidak perlu reset password

3. **Foto Perlu Upload Ulang:**
   - Foto lama tidak bisa dimigrate
   - Upload ulang setelah migration
   - Foto baru tidak akan hilang

4. **Database Gratis:**
   - Neon: 0.5 GB gratis
   - Cukup untuk aplikasi ini
   - Tidak perlu kartu kredit

## 🎉 Setelah Migration Berhasil

1. ✅ Test semua fitur di production
2. ✅ Upload foto profil user
3. ✅ Upload foto dokumentasi (jika perlu)
4. ✅ Share URL untuk uji coba lebih luas
5. ✅ Setup UptimeRobot (prevent sleep)

## 📞 Butuh Bantuan?

Jika ada error atau masalah:
1. Screenshot error yang muncul
2. Copy paste error message
3. Sebutkan di step mana error terjadi
4. Tanyakan untuk bantuan

---

## 🚀 Mulai Sekarang!

**Langkah pertama:** Buka `SETUP_NEON_DATABASE.md`

**Atau langsung ke:** https://neon.tech

**Estimasi waktu total:** 10-15 menit

**Tingkat kesulitan:** ⭐⭐☆☆☆ (Mudah)

---

**Good luck! Saya siap membantu jika ada kendala!** 🎊
