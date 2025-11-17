# 🚀 Panduan Setup Render + Neon Database (Gratis Selamanya!)

## 🎯 Apa yang Akan Kita Lakukan?

Kita akan pindahkan database dari Render PostgreSQL (90 hari) ke Neon (gratis selamanya), tapi aplikasi tetap di Render.

**Keuntungan:**
- ✅ Database gratis selamanya (0.5GB)
- ✅ Aplikasi tetap di Render (gratis)
- ✅ Data tidak akan hilang
- ✅ Tidak perlu bayar

**Total waktu:** ~15 menit

---

## 📋 LANGKAH 1: Buat Akun Neon (3 menit)

### A. Daftar Neon

1. **Buka browser** (Chrome/Edge/Firefox)

2. **Ketik di address bar:**
   ```
   https://neon.tech
   ```

3. **Klik tombol "Sign Up"** (pojok kanan atas)

4. **Pilih salah satu cara daftar:**
   - **GitHub** (paling mudah - klik "Continue with GitHub")
   - **Google** (klik "Continue with Google")
   - **Email** (isi email dan password)

5. **Ikuti proses verifikasi** (jika diminta)

6. **Anda akan masuk ke Neon Console**

---

## 📋 LANGKAH 2: Buat Database di Neon (5 menit)

### A. Create New Project

1. **Setelah login**, Anda akan lihat halaman "Projects"

2. **Klik tombol "New Project"** (tombol biru)

3. **Akan muncul form**, isi seperti ini:
   ```
   Project name: pengawas-sekolah
   PostgreSQL version: 16 (biarkan default)
   Region: Singapore (pilih yang terdekat)
   ```

4. **Klik tombol "Create Project"**

5. **Tunggu ~30 detik** (akan ada loading)

### B. Copy Connection String

6. **Setelah selesai**, Anda akan lihat halaman project

7. **Lihat section "Connection Details"** (biasanya di tengah halaman)

8. **Pastikan dropdown "Database" menunjukkan:** `neondb`

9. **Pastikan dropdown "Role" menunjukkan:** `neondb_owner`

10. **Lihat "Connection string"** - ada kotak dengan text panjang

11. **Klik tombol "Copy"** di sebelah kanan connection string

12. **PENTING:** Paste di Notepad dulu untuk backup
    - URL akan terlihat seperti: 
    ```
    postgresql://neondb_owner:abc123xyz@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
    ```

---

## 📋 LANGKAH 3: Update Render Environment Variable (3 menit)

### A. Buka Render Dashboard

1. **Buka tab baru**, ketik:
   ```
   https://dashboard.render.com
   ```

2. **Login** jika diminta

3. **Klik service Anda:** `sistem-informasi-pengawas-sekolah-kcdxi-1`

### B. Update DATABASE_URL

4. **Klik tab "Environment"** di menu sebelah kiri

5. **Cari variable `DATABASE_URL`** (scroll jika perlu)

6. **Klik tombol "Edit"** (icon pensil) di sebelah kanan DATABASE_URL

7. **Hapus value yang lama** (yang postgresql://... dari Render)

8. **Paste connection string dari Neon** (yang tadi di-copy)

9. **Klik tombol "Save Changes"**

### C. Tunggu Redeploy

10. **Render akan otomatis redeploy** aplikasi

11. **Klik tab "Logs"** untuk monitor progress

12. **Tunggu ~3-5 menit** sampai muncul log:
    ```
    ✓ Server running on port 10000
    ```

---

## 📋 LANGKAH 4: Migrate Data ke Neon (5 menit)

### A. Update .env di Localhost

1. **Buka folder project** di komputer (SchoolGuardManager)

2. **Cari file `.env`** (di root folder)

3. **Buka dengan Notepad** atau text editor

4. **Cari baris `DATABASE_URL=`**

5. **Ganti dengan connection string Neon** (yang sama dari step 3)
   
   **Contoh:**
   ```env
   DATABASE_URL=postgresql://neondb_owner:abc123xyz@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

6. **Save file** (Ctrl+S)

### B. Jalankan Migration

7. **Buka folder project** di File Explorer

8. **Klik di address bar**, ketik `powershell`, tekan Enter

9. **Di PowerShell, ketik command pertama:**
   ```bash
   npm run db:push
   ```

10. **Tekan Enter**, tunggu sampai muncul:
    ```
    ✓ Schema pushed successfully!
    ```

11. **Ketik command kedua:**
    ```bash
    npm run migrate:local-to-prod
    ```

12. **Tekan Enter**, tunggu sampai muncul:
    ```
    ✅ Migration completed successfully!
    ```

---

## 🎉 LANGKAH 5: Verify & Test (2 menit)

### A. Cek Aplikasi Production

1. **Buka browser**

2. **Buka URL production:**
   ```
   https://sistem-informasi-pengawas-sekolah-kcdxi-1.onrender.com
   ```

3. **Login dengan user wawan**

4. **Cek semua data:**
   - ✅ Dashboard → Statistik muncul
   - ✅ Sekolah Binaan → 17 sekolah ada
   - ✅ Tugas Pokok → Data ada
   - ✅ Supervisi → Data ada
   - ✅ Tugas Tambahan → Data ada
   - ✅ Kalender → Events muncul

### B. Test Tambah Data Baru

5. **Coba tambah sekolah baru** atau **tambah tugas baru**

6. **Klik Save**

7. **Refresh halaman** (Ctrl+R)

8. **Cek apakah data tersimpan** ✅

---

## ✅ SELESAI! Apa yang Sudah Berhasil?

1. ✅ Database pindah ke Neon (gratis selamanya)
2. ✅ Aplikasi tetap di Render (gratis)
3. ✅ Semua data sudah termigrate
4. ✅ Aplikasi berfungsi normal
5. ✅ Tidak ada batasan 90 hari lagi!

---

## 🎁 Bonus: Hapus Database Render (Opsional)

Karena database sudah pindah ke Neon, database Render tidak terpakai lagi. Anda bisa hapus untuk membersihkan:

1. **Buka Render Dashboard**
2. **Klik "Databases"** di menu kiri
3. **Klik database `pengawas-sekolah-db`**
4. **Scroll ke bawah**, klik "Delete Database"
5. **Konfirmasi dengan ketik nama database**
6. **Klik "Delete"**

**Catatan:** Ini opsional, tidak wajib. Database Render akan otomatis expire setelah 90 hari.

---

## 📊 Perbandingan Sebelum vs Sesudah

### Sebelum (Render + Render DB)
- ❌ Database expire 90 hari
- ❌ Perlu migrate ulang setiap 3 bulan
- ⚠️ Aplikasi sleep 15 menit

### Sesudah (Render + Neon)
- ✅ Database gratis selamanya
- ✅ Tidak perlu migrate lagi
- ✅ Data aman permanent
- ⚠️ Aplikasi tetap sleep 15 menit (ini dari Render free tier)

---

## 🔍 Informasi Neon Free Tier

### Limits Gratis:
- **Storage:** 0.5 GB (cukup untuk ~50,000 records)
- **Compute:** 191.9 jam/bulan (cukup untuk aplikasi 24/7)
- **Projects:** 1 project
- **Branches:** 10 branches (untuk development)

### Estimasi Kapasitas:
Dengan 0.5GB, Anda bisa simpan:
- ~500 sekolah
- ~5,000 supervisi
- ~10,000 tugas
- ~50,000 aktivitas log

**Lebih dari cukup untuk aplikasi pengawas sekolah!**

---

## ❓ Troubleshooting

### Masalah 1: Error saat npm run db:push

**Error:** `Connection timeout`

**Solusi:**
- Cek connection string sudah benar
- Pastikan ada `?sslmode=require` di akhir URL
- Copy paste ulang dari Neon console

### Masalah 2: Data tidak muncul di production

**Solusi:**
- Tunggu 1-2 menit setelah redeploy
- Refresh browser (Ctrl+Shift+R)
- Logout dan login ulang
- Cek logs di Render untuk error

### Masalah 3: Aplikasi error 500

**Solusi:**
- Buka Render → Logs
- Screenshot error yang muncul
- Biasanya karena DATABASE_URL salah format

### Masalah 4: Migration gagal

**Error:** `Schema already exists`

**Solusi:**
- Ini normal jika database sudah ada schema
- Skip `npm run db:push`
- Langsung jalankan `npm run migrate:local-to-prod`

---

## 📞 Butuh Bantuan?

Jika ada masalah di langkah manapun:

1. **Screenshot halaman yang bermasalah**
2. **Copy paste error message** (jika ada)
3. **Beritahu di langkah mana stuck**

Saya siap membantu! 🚀

---

## 🎯 Ringkasan Singkat

Jika bingung dengan panduan panjang, ini ringkasannya:

1. **Daftar Neon.tech** (pakai GitHub/Google)
2. **Buat project baru** → Copy connection string
3. **Update DATABASE_URL di Render** → Paste connection string Neon
4. **Update .env di localhost** → Paste connection string yang sama
5. **Run 2 command:**
   ```bash
   npm run db:push
   npm run migrate:local-to-prod
   ```
6. **Test aplikasi** → Login dan cek data

**Selesai! Database sekarang gratis selamanya!** 🎉

---

**Ikuti step by step, pasti berhasil!**

**Jika ada yang tidak jelas, tanya saja!** 💬
