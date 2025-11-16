# 🗄️ Setup PostgreSQL Database di Render (Paling Mudah!)

## ✅ Keuntungan Menggunakan Render PostgreSQL

- ✅ **Gratis** (Free tier)
- ✅ **Sudah terintegrasi** dengan service Anda
- ✅ **Tidak perlu account baru** (pakai account Render yang sudah ada)
- ✅ **Otomatis terkoneksi** ke aplikasi Anda

## 🚀 Langkah Setup (5 Menit)

### Step 1: Buka Render Dashboard

1. Buka browser dan kunjungi:
   ```
   https://dashboard.render.com
   ```

2. Login dengan account Anda

### Step 2: Create PostgreSQL Database

1. Di dashboard, klik tombol **"New +"** di pojok kanan atas

2. Pilih **"PostgreSQL"**

3. Isi form:
   - **Name:** `pengawas-sekolah-db`
   - **Database:** `pengawas_sekolah` (otomatis terisi)
   - **User:** `pengawas_sekolah_user` (otomatis terisi)
   - **Region:** Pilih **Singapore** (sama dengan service Anda)
   - **PostgreSQL Version:** Biarkan default (16)
   - **Plan:** Pilih **"Free"**

4. Klik **"Create Database"**

5. Tunggu ~1-2 menit sampai database selesai dibuat

### Step 3: Copy Internal Database URL

Setelah database dibuat:

1. Scroll ke section **"Connections"**

2. Cari **"Internal Database URL"** (BUKAN External!)

3. Klik tombol **"Copy"** di sebelah Internal Database URL

4. URL akan terlihat seperti:
   ```
   postgresql://pengawas_sekolah_user:xxxxx@dpg-xxxxx-a/pengawas_sekolah
   ```

### Step 4: Add ke Service Anda

1. Kembali ke dashboard, klik service **"pengawas-sekolah"**

2. Klik tab **"Environment"**

3. Klik **"Add Environment Variable"**

4. Isi:
   - **Key:** `DATABASE_URL`
   - **Value:** (paste Internal Database URL yang tadi di-copy)

5. Klik **"Save Changes"**

6. Render akan otomatis redeploy (~3 menit)

### Step 5: Verify

Setelah redeploy selesai:

1. Klik tab **"Logs"**

2. Cari log:
   ```
   ✓ Server running on port 10000
   ```

3. Jika ada, berarti database sudah terkoneksi! ✅

## 🎯 Setelah Database Terkoneksi

Lanjut ke migration data dengan mengikuti file:
**RUN_MIGRATION.md**

Atau langsung jalankan di terminal localhost:

```bash
# 1. Update .env dengan Internal Database URL yang sama
# Edit file .env, paste DATABASE_URL

# 2. Push schema
npm run db:push

# 3. Migrate data
npm run migrate:local-to-prod
```

## ⚠️ Penting!

**Gunakan "Internal Database URL", BUKAN "External Database URL"**

- ✅ Internal: `postgresql://user:pass@dpg-xxxxx-a/db`
- ❌ External: `postgresql://user:pass@dpg-xxxxx-a.singapore-postgres.render.com/db`

Internal URL lebih cepat dan tidak kena limit koneksi.

## 📝 Catatan

**Free Tier Limits:**
- Storage: 1 GB (cukup untuk aplikasi ini)
- Expires: 90 hari (bisa diperpanjang gratis)
- Connections: 97 concurrent

**Perpanjang Database:**
- Setiap 90 hari, Render akan kirim email reminder
- Klik link di email untuk perpanjang (gratis)
- Atau set reminder sendiri

## ✅ Checklist

- [ ] Database PostgreSQL sudah dibuat di Render
- [ ] Internal Database URL sudah di-copy
- [ ] DATABASE_URL sudah ditambahkan ke service
- [ ] Service sudah redeploy
- [ ] Logs menunjukkan "Server running"

## 🎯 Next Step

Setelah database terkoneksi, lanjut ke:
**RUN_MIGRATION.md**

---

**Ini cara paling mudah dan aman! Semua di Render, tidak perlu service eksternal!** ✅
