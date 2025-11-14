# 📖 Cara Penggunaan Aplikasi Pengawas Sekolah

## 🚀 Menjalankan Aplikasi

### 1. Start Server
```bash
npm run dev
```

Server akan berjalan di: **http://localhost:5000**

### 2. Buka Browser
Akses aplikasi di: **http://localhost:5000**

---

## 🔐 Login Pertama Kali

### Akun Admin Default
- **Username:** `admin`
- **Password:** `admin`

> ⚠️ **PENTING:** Setelah login pertama kali, token lama akan otomatis dibersihkan. Jika mengalami error "Invalid token", cukup refresh halaman login dan login kembali.

---

## 👥 Membuat Akun Baru

1. Di halaman login, klik tab **"Daftar"**
2. Isi form:
   - Nama Lengkap
   - Username (pilih username unik)
   - Password
3. Klik **"Daftar"**
4. Setelah berhasil, otomatis pindah ke tab **"Masuk"**
5. Login dengan username dan password yang baru dibuat

---

## 📊 Fitur-Fitur Aplikasi

### 1. Dashboard
- Lihat statistik total tugas, supervisi, sekolah, dan kegiatan
- Grafik aktivitas bulanan
- Ringkasan data terbaru

### 2. Tugas Pokok
- Tambah tugas baru dengan foto
- Edit dan hapus tugas
- Filter berdasarkan status (Selesai/Belum Selesai)
- Upload foto dokumentasi

### 3. Supervisi Sekolah
- Catat hasil supervisi ke sekolah
- Tambahkan data guru yang disupervisi
- Upload foto dokumentasi
- Pilih sekolah dari dropdown

### 4. Kegiatan Tambahan
- Catat kegiatan di luar tugas pokok
- Upload foto kegiatan
- Kelola status kegiatan

### 5. Kalender
- Jadwalkan kegiatan mendatang
- Lihat kalender bulanan
- Tambah/hapus event

### 6. Data Sekolah
- Kelola data sekolah binaan
- Tambah informasi kepala sekolah
- Edit dan hapus data sekolah

### 7. Laporan
- Cetak laporan tugas dengan foto
- Cetak laporan supervisi dengan foto
- Export ke PDF (gunakan Print > Save as PDF)

---

## 💾 Penyimpanan Data

### Local Storage (Default)
- Data tersimpan di file: **`local-database.json`**
- Data persisten (tidak hilang setelah restart)
- Tidak perlu setup database
- Foto tersimpan di folder: **`uploads/`**

### Backup Data
Untuk backup data, cukup copy file:
- `local-database.json` (data aplikasi)
- Folder `uploads/` (foto-foto)

---

## 🔧 Troubleshooting

### Error "Invalid token"
**Solusi:**
1. Buka halaman login: http://localhost:5000/login
2. Token lama akan otomatis dibersihkan
3. Login kembali dengan username dan password

### Server tidak bisa diakses
**Solusi:**
1. Pastikan server masih running
2. Cek terminal, seharusnya ada pesan: `serving on port 5000`
3. Jika tidak, jalankan ulang: `npm run dev`

### Foto tidak muncul
**Solusi:**
1. Pastikan folder `uploads/` ada
2. Cek ukuran file (maksimal 5MB)
3. Format yang didukung: JPG, JPEG, PNG

### Data hilang
**Solusi:**
1. Cek file `local-database.json` masih ada
2. Jangan hapus file tersebut
3. Untuk restore, copy backup file `local-database.json`

---

## 📝 Tips Penggunaan

1. **Backup Rutin:** Copy file `local-database.json` secara berkala
2. **Foto Berkualitas:** Upload foto dengan resolusi yang baik untuk laporan
3. **Status Tugas:** Update status tugas secara berkala agar dashboard akurat
4. **Kalender:** Manfaatkan fitur kalender untuk planning kegiatan
5. **Laporan:** Cetak laporan secara berkala untuk dokumentasi

---

## 🆘 Bantuan Lebih Lanjut

Jika mengalami masalah:
1. Cek file `CHANGELOG.md` untuk update terbaru
2. Cek file `QUICK_START.md` untuk panduan cepat
3. Restart server dan browser
4. Clear browser cache jika diperlukan

---

**Selamat menggunakan Aplikasi Pengawas Sekolah! 🎉**
