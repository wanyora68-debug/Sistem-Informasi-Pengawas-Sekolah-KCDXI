# ⚡ Panduan Verifikasi Cepat

**Ikuti langkah ini untuk memastikan semua perbaikan berfungsi!**

---

## 🎯 Langkah 1: Cek Status Deploy (2 menit)

### A. Buka Render Dashboard
```
1. Buka browser
2. Ke: https://dashboard.render.com
3. Login dengan akun Render Anda
```

### B. Cek Service Status
```
1. Cari service: "sistem-informasi-pengawas-sekolah-kcdxi-1"
2. Lihat status di bagian atas:
   ✅ Harus ada tulisan "Live" dengan warna hijau
   ✅ Deploy terakhir harus selesai (tidak ada "Deploying...")
```

### C. Cek Logs
```
1. Klik tab "Logs" di menu kiri
2. Scroll ke bagian paling bawah
3. Cari log startup (biasanya ada "Server running on port...")
4. PENTING: Pastikan TIDAK ada tulisan:
   ❌ "Using local file-based storage"
   ❌ "DATABASE_URL is not properly configured"
```

**Jika ada warning di atas, lanjut ke "Perbaikan DATABASE_URL" di bawah.**

---

## 🎯 Langkah 2: Test Aplikasi (5 menit)

### A. Buka Aplikasi
```
URL: https://sistem-informasi-pengawas-sekolah-kcdxi-1.onrender.com
```

### B. Login
```
Username: admin
Password: admin
```

### C. Test Upload Foto Profil
```
1. Klik menu "Profil Pengawas"
2. Klik tombol "Upload Foto Profil"
3. Pilih foto dari komputer (JPG/PNG, max 5MB)
4. Tunggu upload selesai
5. Foto harus muncul di avatar
6. REFRESH HALAMAN (F5)
7. ✅ Foto harus TETAP ADA (tidak hilang)
```

**Jika foto hilang setelah refresh, ada masalah database!**

### D. Test Tambah Data
```
1. Klik menu "Sekolah Binaan"
2. Klik "Tambah Sekolah"
3. Isi form:
   - Nama: SDN Test
   - Alamat: Jl. Test
   - Kontak: 08123456789
4. Klik "Simpan Sekolah"
5. Data harus muncul di list
6. REFRESH HALAMAN (F5)
7. ✅ Data harus TETAP ADA
```

**Jika data hilang setelah refresh, ada masalah database!**

---

## 🎯 Langkah 3: Verify Database (3 menit)

### A. Buka Neon Console
```
1. Buka: https://console.neon.tech
2. Login dengan akun Neon Anda
3. Klik project: "pengawas-sekolah"
```

### B. Cek Data di Database
```
1. Klik "SQL Editor" di menu kiri
2. Copy-paste query ini:

SELECT COUNT(*) as total_users FROM users;

3. Klik "Run" atau tekan Ctrl+Enter
4. ✅ Harus ada hasil (minimal 1 user)
```

```
5. Copy-paste query ini:

SELECT username, "fullName", "photoUrl" 
FROM users 
WHERE "photoUrl" IS NOT NULL;

6. Klik "Run"
7. ✅ Jika sudah upload foto, harus muncul di sini
```

---

## ✅ Hasil yang Diharapkan

### Jika Semua Berhasil:
```
✅ Deploy status "Live" di Render
✅ Logs tidak ada warning tentang local storage
✅ Foto profil tidak hilang setelah refresh
✅ Data sekolah tidak hilang setelah refresh
✅ Data ada di Neon database
```

**SELAMAT! Aplikasi sudah berfungsi dengan baik!** 🎉

---

## ❌ Jika Ada Masalah

### Masalah: Foto/Data Hilang Setelah Refresh

**Penyebab:** DATABASE_URL tidak terkonfigurasi di Render

**Solusi:**

#### 1. Ambil Connection String dari Neon
```
1. Di Neon Console (https://console.neon.tech)
2. Klik project "pengawas-sekolah"
3. Scroll ke bawah, cari "Connection Details"
4. Copy "Connection string" (yang ada tulisan "Internal Database URL")
5. Contoh format:
   postgresql://neondb_owner:xxxxx@ep-xxxxx.aws.neon.tech/neondb?sslmode=require
```

#### 2. Tambahkan ke Render
```
1. Buka Render Dashboard
2. Klik service Anda
3. Klik tab "Environment" di menu kiri
4. Cek apakah ada variable "DATABASE_URL"
   
   JIKA TIDAK ADA:
   - Klik "Add Environment Variable"
   - Key: DATABASE_URL
   - Value: (paste connection string dari Neon)
   - Klik "Save Changes"
   
   JIKA SUDAH ADA:
   - Klik "Edit" di sebelah DATABASE_URL
   - Pastikan value-nya benar (sama dengan dari Neon)
   - Klik "Save Changes"
```

#### 3. Tunggu Redeploy
```
1. Render akan otomatis redeploy (~3-5 menit)
2. Tunggu sampai status "Live" lagi
3. Ulangi test dari Langkah 2
```

---

## 🔄 Jika Perlu Migrate Data

**Jika database Neon kosong atau data tidak lengkap:**

### 1. Update .env di Localhost
```
1. Buka file .env di folder project
2. Pastikan DATABASE_URL mengarah ke Neon:
   DATABASE_URL=postgresql://neondb_owner:xxxxx@ep-xxxxx.aws.neon.tech/neondb?sslmode=require
3. Save file
```

### 2. Jalankan Migration
```
1. Buka PowerShell di folder project
2. Jalankan:
   npm run db:push
3. Tunggu selesai
4. Jalankan:
   npm run migrate:local-to-prod
5. Tunggu sampai muncul "Migration completed successfully!"
```

### 3. Verify di Neon
```
1. Buka Neon SQL Editor
2. Jalankan:
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM schools;
3. Data harus ada
```

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah, screenshot dan kirim:

1. **Render Logs** (bagian startup)
2. **Render Environment Variables** (blur password)
3. **Error message** yang muncul
4. **Hasil query** di Neon SQL Editor

---

**Ikuti langkah demi langkah, pasti berhasil!** 💪

