# ✅ Checklist Sederhana - Verifikasi Aplikasi

**Ikuti checklist ini untuk memastikan aplikasi berfungsi dengan baik!**

---

## 📋 Checklist Utama

### ☐ 1. Cek Status Deploy di Render
```
□ Buka https://dashboard.render.com
□ Login
□ Cari service: sistem-informasi-pengawas-sekolah-kcdxi-1
□ Status harus "Live" (hijau)
□ Tidak ada tulisan "Deploying..."
```

### ☐ 2. Cek Logs Render
```
□ Klik tab "Logs"
□ Scroll ke bawah
□ TIDAK boleh ada warning:
  ❌ "Using local file-based storage"
  ❌ "DATABASE_URL is not properly configured"
```

**Jika ada warning di atas:**
👉 Baca file: **CARA_CEK_DATABASE_URL.md**

---

### ☐ 3. Test Login
```
□ Buka: https://sistem-informasi-pengawas-sekolah-kcdxi-1.onrender.com
□ Login dengan:
  Username: admin
  Password: admin
□ Berhasil masuk ke dashboard
```

---

### ☐ 4. Test Upload Foto Profil
```
□ Klik menu "Profil Pengawas"
□ Klik tombol "Upload Foto Profil"
□ Pilih foto (JPG/PNG, max 5MB)
□ Tunggu upload selesai
□ Foto muncul di avatar
□ REFRESH HALAMAN (tekan F5)
□ ✅ FOTO HARUS TETAP ADA (tidak hilang)
```

**Jika foto hilang setelah refresh:**
👉 DATABASE_URL belum terkonfigurasi!
👉 Baca file: **CARA_CEK_DATABASE_URL.md**

---

### ☐ 5. Test Tambah Data Sekolah
```
□ Klik menu "Sekolah Binaan"
□ Klik "Tambah Sekolah"
□ Isi form:
  - Nama: SDN Test
  - Alamat: Jl. Test No. 1
  - Kontak: 08123456789
□ Klik "Simpan Sekolah"
□ Data muncul di list
□ REFRESH HALAMAN (tekan F5)
□ ✅ DATA HARUS TETAP ADA (tidak hilang)
```

**Jika data hilang setelah refresh:**
👉 DATABASE_URL belum terkonfigurasi!
👉 Baca file: **CARA_CEK_DATABASE_URL.md**

---

### ☐ 6. Test Fitur Edit
```
□ Klik menu "Tugas Pokok"
□ Tambah tugas baru (dengan foto)
□ Klik tombol "Edit" pada tugas
□ Ganti foto
□ Simpan
□ Foto harus terupdate
```

---

### ☐ 7. Verify di Database Neon
```
□ Buka: https://console.neon.tech
□ Login
□ Klik project: pengawas-sekolah
□ Klik "SQL Editor"
□ Jalankan query:
  SELECT COUNT(*) FROM users;
□ Harus ada hasil (minimal 1 user)
```

---

## ✅ Hasil Akhir

Jika SEMUA checklist di atas ✅:

```
🎉 SELAMAT! Aplikasi sudah berfungsi dengan baik!

✅ Database terkoneksi ke Neon
✅ Data tersimpan permanent
✅ Foto tidak hilang
✅ Semua fitur berfungsi
```

---

## ❌ Jika Ada yang Gagal

### Foto/Data Hilang Setelah Refresh:
👉 **Baca:** CARA_CEK_DATABASE_URL.md
👉 **Lakukan:** Setup DATABASE_URL di Render

### Error Saat Login:
👉 **Baca:** FIX_DATA_HILANG.md
👉 **Cek:** User credentials di database

### Menu Admin Tidak Muncul:
👉 **Solusi:** Logout, clear cache, login ulang
👉 **Cek:** Role user di database harus 'admin'

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:

1. **Baca file panduan:**
   - CARA_CEK_DATABASE_URL.md
   - FIX_DATA_HILANG.md
   - PANDUAN_VERIFIKASI_CEPAT.md

2. **Screenshot:**
   - Error message
   - Render logs
   - Render environment variables (blur password)

3. **Laporkan untuk bantuan**

---

## 🎯 Quick Links

- **Aplikasi:** https://sistem-informasi-pengawas-sekolah-kcdxi-1.onrender.com
- **Render:** https://dashboard.render.com
- **Neon:** https://console.neon.tech

---

**Ikuti checklist ini step by step, pasti berhasil!** 💪

