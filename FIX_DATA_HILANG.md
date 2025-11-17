# 🔧 Fix: Data Hilang Setelah Restart

## 🎯 Masalah

- Data yang diupdate kemarin hilang
- Foto profil menghilang
- Setelah server restart, data kembali ke state awal

## 🔍 Penyebab

Kemungkinan besar **DATABASE_URL di Render tidak tersimpan** atau **aplikasi menggunakan local storage** bukan database Neon.

---

## ✅ Solusi: Pastikan Database Neon Terkoneksi

### LANGKAH 1: Cek DATABASE_URL di Render

1. **Buka Render Dashboard:**
   ```
   https://dashboard.render.com
   ```

2. **Klik service:** `sistem-informasi-pengawas-sekolah-kcdxi-1`

3. **Klik tab "Environment"** di menu kiri

4. **Cek apakah ada variable `DATABASE_URL`:**
   - ✅ **Jika ADA** → Lanjut ke Langkah 2
   - ❌ **Jika TIDAK ADA** → Lanjut ke Langkah 1B

### LANGKAH 1B: Tambah DATABASE_URL (Jika Tidak Ada)

1. **Buka Neon Console:**
   ```
   https://console.neon.tech
   ```

2. **Klik project:** `pengawas-sekolah` (atau nama project Anda)

3. **Scroll ke bawah**, cari **"Connection Details"**

4. **Copy "Connection string"** (yang ada tulisan "Internal Database URL")

5. **Kembali ke Render Dashboard** → Tab "Environment"

6. **Klik "Add Environment Variable"**

7. **Isi:**
   - Key: `DATABASE_URL`
   - Value: (paste connection string dari Neon)

8. **Klik "Save Changes"**

9. **Tunggu redeploy** (~3-5 menit)

---

### LANGKAH 2: Cek Logs Render

1. **Di Render Dashboard**, klik tab **"Logs"**

2. **Cari log saat startup**, perhatikan:

   **✅ BENAR (Database terkoneksi):**
   ```
   ✓ Using database: Neon PostgreSQL
   ✓ Server running on port 10000
   ```

   **❌ SALAH (Menggunakan local storage):**
   ```
   ⚠️  DATABASE_URL is not properly configured
   ✓ Using local file-based storage
   ```

3. **Jika muncul warning "DATABASE_URL not configured":**
   - Berarti DATABASE_URL tidak valid
   - Ulangi Langkah 1B dengan connection string yang benar

---

### LANGKAH 3: Verify Data di Neon

1. **Buka Neon Console:**
   ```
   https://console.neon.tech
   ```

2. **Klik project Anda**

3. **Klik "SQL Editor"** di menu kiri

4. **Jalankan query untuk cek data:**
   ```sql
   -- Cek jumlah users
   SELECT COUNT(*) FROM users;
   
   -- Cek jumlah sekolah
   SELECT COUNT(*) FROM schools;
   
   -- Cek user dengan foto
   SELECT username, "fullName", "photoUrl" FROM users WHERE "photoUrl" IS NOT NULL;
   ```

5. **Jika data kosong atau tidak sesuai:**
   - Database Neon belum ada data
   - Perlu migrate ulang dari localhost

---

## 🔄 LANGKAH 4: Migrate Data Ulang (Jika Perlu)

Jika data di Neon kosong atau tidak lengkap, migrate ulang:

### A. Update .env di Localhost

1. **Buka file `.env`** di folder project

2. **Pastikan DATABASE_URL mengarah ke Neon:**
   ```env
   DATABASE_URL=postgresql://neondb_owner:xxxxx@ep-xxxxx.aws.neon.tech/neondb?sslmode=require
   ```

3. **Save file**

### B. Jalankan Migration

1. **Buka PowerShell** di folder project

2. **Push schema:**
   ```bash
   npm run db:push
   ```

3. **Migrate data:**
   ```bash
   npm run migrate:local-to-prod
   ```

4. **Tunggu sampai selesai** (muncul "Migration completed successfully!")

---

## 🎯 LANGKAH 5: Test di Production

1. **Buka aplikasi production:**
   ```
   https://sistem-informasi-pengawas-sekolah-kcdxi-1.onrender.com
   ```

2. **Login dengan user wawan**

3. **Cek data:**
   - ✅ Sekolah binaan (harus ada 17 sekolah)
   - ✅ Tugas, supervisi, dll
   - ✅ Foto profil (jika sudah diupload)

4. **Test tambah data baru:**
   - Tambah sekolah baru
   - Refresh halaman
   - **Data harus tetap ada** (tidak hilang)

---

## 📝 Catatan Penting

### Perbedaan Local Storage vs Database:

| Aspek | Local Storage (File) | Database (Neon) |
|-------|---------------------|-----------------|
| **Persistensi** | ❌ Hilang saat restart | ✅ Permanent |
| **Lokasi** | File `local-database.json` | PostgreSQL Neon |
| **Production** | ❌ Tidak cocok | ✅ Cocok |
| **Indikator** | Log: "Using local file-based storage" | Log: "Using database" |

### Kenapa Data Bisa Hilang?

1. **Render free tier restart** setiap ~15 menit idle
2. **Jika pakai local storage**, file akan reset saat restart
3. **Jika pakai database Neon**, data tetap aman

### Solusi Permanent:

✅ **Pastikan DATABASE_URL terkonfigurasi di Render**
✅ **Aplikasi harus connect ke Neon, bukan local storage**
✅ **Cek logs untuk memastikan database terkoneksi**

---

## ❓ Troubleshooting

### Masalah 1: DATABASE_URL sudah ada tapi data tetap hilang

**Solusi:**
- Cek format DATABASE_URL (harus lengkap dengan password)
- Cek logs Render untuk error koneksi
- Pastikan Neon database tidak sleep (free tier bisa sleep)

### Masalah 2: Error "Connection timeout" di logs

**Solusi:**
- Neon database mungkin sleep
- Tunggu 1-2 menit, database akan wake up
- Refresh aplikasi

### Masalah 3: Data ada di Neon tapi tidak muncul di aplikasi

**Solusi:**
- Clear browser cache (Ctrl+Shift+Delete)
- Logout dan login ulang
- Cek apakah userId di data sesuai dengan user yang login

---

## 🎯 Checklist Verifikasi

Sebelum selesai, pastikan:

- [ ] DATABASE_URL ada di Render Environment Variables
- [ ] Logs Render tidak ada warning "DATABASE_URL not configured"
- [ ] Data ada di Neon (cek via SQL Editor)
- [ ] Data muncul di aplikasi production
- [ ] Data tidak hilang setelah refresh
- [ ] Foto profil muncul (jika sudah diupload)

---

## 📞 Jika Masih Bermasalah

Screenshot dan kirim:
1. **Render Environment Variables** (blur password)
2. **Render Logs** (bagian startup)
3. **Neon SQL Editor** (hasil query COUNT)
4. **Error message** (jika ada)

Saya akan bantu troubleshoot lebih lanjut!

---

**Ikuti langkah demi langkah, data akan kembali aman!** 🚀
