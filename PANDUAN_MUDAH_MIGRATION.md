# 🎯 Panduan Paling Mudah: Migration Data (Tidak Akan Salah!)

## 📋 Yang Akan Kita Lakukan

Kita akan pindahkan data dari localhost ke Render dalam **3 langkah sederhana**.

**Jangan khawatir salah!** Saya akan kasih instruksi yang sangat detail.

---

## 🔹 LANGKAH 1: Buat Database di Render (5 menit)

### A. Buka Render Dashboard

1. **Buka browser** (Chrome/Edge/Firefox)

2. **Ketik di address bar:**
   ```
   dashboard.render.com
   ```

3. **Tekan Enter**

4. **Login** jika diminta

### B. Create Database Baru

5. **Lihat pojok kanan atas**, ada tombol biru **"New +"**

6. **Klik tombol "New +"**

7. **Akan muncul menu dropdown**, pilih **"PostgreSQL"**

8. **Akan muncul form**, isi seperti ini:
   ```
   Name: pengawas-sekolah-db
   Database: pengawas_sekolah (biarkan otomatis)
   User: pengawas_sekolah_user (biarkan otomatis)
   Region: Singapore
   PostgreSQL Version: 16 (biarkan default)
   ```

9. **Scroll ke bawah**, cari **"Instance Type"**

10. **Pilih "Free"** (yang paling atas, gratis)

11. **Klik tombol biru "Create Database"** di bawah

12. **Tunggu 1-2 menit** (akan ada loading/progress bar)

### C. Copy Database URL

13. **Setelah selesai**, Anda akan melihat halaman database

14. **Scroll ke bawah**, cari section **"Connections"**

15. **Lihat "Internal Database URL"** (ada tulisan "Internal" di depannya)

16. **Klik tombol "Copy"** di sebelah kanan URL tersebut

17. **PENTING:** Paste URL ini di Notepad dulu untuk backup
    - URL akan terlihat seperti: `postgresql://pengawas_sekolah_user:abc123@dpg-xxxxx-a/pengawas_sekolah`

---

## 🔹 LANGKAH 2: Hubungkan Database ke Aplikasi (3 menit)

### A. Buka Service Anda

1. **Klik "Dashboard"** di pojok kiri atas (untuk kembali ke dashboard)

2. **Cari dan klik** service **"pengawas-sekolah"** (aplikasi Anda)

### B. Add Environment Variable

3. **Klik tab "Environment"** di menu sebelah kiri

4. **Klik tombol "Add Environment Variable"**

5. **Akan muncul 2 kotak input:**
   - **Kotak pertama (Key):** ketik `DATABASE_URL`
   - **Kotak kedua (Value):** paste URL yang tadi di-copy (dari Notepad)

6. **Klik tombol "Save Changes"** atau "Add"

### C. Tunggu Redeploy

7. **Render akan otomatis redeploy** aplikasi Anda

8. **Klik tab "Logs"** untuk monitor progress

9. **Tunggu ~3-5 menit** sampai muncul log:
   ```
   ✓ Server running on port 10000
   ```

10. **Jika sudah muncul**, berarti database sudah terkoneksi! ✅

---

## 🔹 LANGKAH 3: Pindahkan Data (5 menit)

### A. Update File .env di Localhost

1. **Buka folder project** di komputer Anda (SchoolGuardManager)

2. **Cari file `.env`** (di root folder, sejajar dengan package.json)

3. **Buka file `.env`** dengan Notepad atau text editor

4. **Cari baris yang ada tulisan `DATABASE_URL=`**

5. **Ganti** dengan URL yang sama dari Render (yang tadi di-copy)
   
   **Contoh:**
   ```env
   DATABASE_URL=postgresql://pengawas_sekolah_user:abc123@dpg-xxxxx-a/pengawas_sekolah
   ```

6. **Save file** (Ctrl+S)

### B. Buka Terminal/PowerShell

7. **Buka folder project** di File Explorer

8. **Klik di address bar** (tempat path folder)

9. **Ketik:** `powershell` lalu **Enter**

10. **Akan muncul jendela PowerShell** berwarna biru

### C. Jalankan Migration

11. **Di PowerShell, ketik command ini** (copy paste):
    ```bash
    npm run db:push
    ```

12. **Tekan Enter**

13. **Tunggu** sampai muncul:
    ```
    ✓ Schema pushed successfully!
    ```

14. **Ketik command kedua** (copy paste):
    ```bash
    npm run migrate:local-to-prod
    ```

15. **Tekan Enter**

16. **Akan muncul banyak output**, tunggu sampai muncul:
    ```
    ✅ Migration completed successfully!
    ```

---

## 🎉 SELESAI! Verify Hasilnya

### Cek di Production

1. **Buka browser**

2. **Buka URL production:**
   ```
   https://pengawas-sekolah.onrender.com
   ```

3. **Login dengan:**
   - Username: `wawan`
   - Password: (password yang sama seperti di localhost)

4. **Cek data:**
   - Klik "Sekolah Binaan" → Harus ada **17 sekolah** ✅
   - Klik "Tugas Pokok" → Harus ada **1 task** ✅
   - Klik "Supervisi" → Harus ada **1 supervisi** ✅
   - Klik "Tugas Tambahan" → Harus ada **3 tasks** ✅
   - Klik "Kalender" → Harus ada **2 events** ✅

### Jika Semua Data Muncul

**SELAMAT!** 🎊 Migration berhasil!

Data localhost sekarang sudah ada di production dan tidak akan hilang lagi!

---

## ❓ Jika Ada Masalah

### Masalah 1: Tidak bisa buat database di Render

**Solusi:**
- Coba refresh halaman
- Coba logout dan login ulang
- Screenshot halaman dan tanyakan

### Masalah 2: Error saat npm run db:push

**Solusi:**
- Cek file .env sudah diupdate
- Cek DATABASE_URL tidak ada spasi extra
- Copy paste ulang DATABASE_URL

### Masalah 3: Error saat npm run migrate

**Solusi:**
- Screenshot error yang muncul
- Copy paste error message
- Tanyakan untuk bantuan

### Masalah 4: Data tidak muncul di production

**Solusi:**
- Tunggu 1-2 menit
- Refresh browser (Ctrl+Shift+R)
- Logout dan login ulang
- Cek logs di Render untuk error

---

## 📝 Catatan Penting

1. **Foto perlu upload ulang:**
   - Foto lama tidak bisa dimigrate
   - Upload ulang foto profil di production
   - Upload ulang foto dokumentasi jika perlu

2. **Password tetap sama:**
   - Semua user bisa login dengan password yang sama
   - Tidak perlu reset password

3. **Database gratis:**
   - 1 GB storage (cukup untuk aplikasi ini)
   - Expires 90 hari (bisa diperpanjang gratis)
   - Render akan kirim email reminder

---

## 🎯 Ringkasan Singkat

Jika Anda bingung dengan panduan panjang di atas, ini ringkasannya:

1. **Buat database PostgreSQL di Render** (tombol New + → PostgreSQL → Free)
2. **Copy Internal Database URL**
3. **Add DATABASE_URL ke service** (Environment → Add Variable)
4. **Update .env di localhost** (paste DATABASE_URL yang sama)
5. **Run 2 command:**
   ```bash
   npm run db:push
   npm run migrate:local-to-prod
   ```
6. **Cek data di production** (login dengan user wawan)

---

**Ikuti langkah demi langkah, tidak akan salah!** 

**Jika ada yang tidak jelas, screenshot dan tanyakan!** 📸

**Saya siap membantu di setiap langkah!** 🚀
