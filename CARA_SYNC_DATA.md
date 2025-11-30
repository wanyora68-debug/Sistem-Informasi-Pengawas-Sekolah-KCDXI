# 🔄 Cara Sinkronisasi Data Production ke Localhost

## 📖 Penjelasan

Script ini akan **download semua data** dari database production (Neon) dan menyimpannya ke `local-database.json` di komputer Anda.

Setelah download, Anda bisa:
- ✅ Cetak PDF dengan data terbaru dari online
- ✅ Kerja offline tanpa internet
- ✅ Data tetap aman di komputer lokal

## 🚀 Cara Menggunakan

### 1. Pastikan DATABASE_URL Sudah Dikonfigurasi

Buka file `.env` dan pastikan `DATABASE_URL` sudah terisi:

```env
DATABASE_URL=postgresql://neondb_owner:npg_UECqsl5kG7MP@ep-frosty-grass-a42zb4yz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Jalankan Script Download

Buka terminal/command prompt dan jalankan:

```bash
node scripts/download-from-prod.js
```

### 3. Tunggu Proses Selesai

Script akan:
1. ✓ Connect ke database production
2. ✓ Backup file `local-database.json` yang lama (jika ada)
3. ✓ Download semua data (users, schools, tasks, supervisions, photos, dll)
4. ✓ Simpan ke `local-database.json`

### 4. Restart Server Localhost

Setelah download selesai, restart server localhost:

```bash
npm start
```

### 5. Buka Aplikasi Localhost

Buka browser dan akses:

```
http://localhost:5000
```

Sekarang localhost Anda sudah punya data yang sama dengan online! 🎉

## 📋 Kapan Perlu Sync Data?

Jalankan script ini ketika:
- ✅ Setelah input data baru di aplikasi online
- ✅ Sebelum cetak laporan PDF di localhost
- ✅ Ingin backup data terbaru ke komputer lokal
- ✅ Setiap minggu/bulan untuk update data

## ⚠️ Catatan Penting

1. **Backup Otomatis**: Script akan otomatis backup file lama sebelum download data baru
2. **Tidak Affect Online**: Download data tidak mengubah data di online
3. **Perlu Internet**: Harus ada koneksi internet untuk download dari Neon
4. **Data Foto**: Semua foto (base64) juga ikut ter-download

## 🔄 Workflow Recommended

**Untuk Input Data:**
1. Input data di aplikasi **online** (bisa diakses dari mana saja)
2. Data tersimpan di database Neon (cloud)

**Untuk Cetak PDF:**
1. Jalankan `node scripts/download-from-prod.js` untuk sync data
2. Buka localhost (http://localhost:5000)
3. Cetak PDF dengan data terbaru
4. PDF akan menampilkan foto dengan sempurna!

## 💡 Tips

- Buat shortcut/batch file untuk mempermudah sync
- Sync data setiap pagi sebelum mulai kerja
- Backup file `local-database.json` secara berkala

## 🆘 Troubleshooting

**Error: DATABASE_URL is not configured**
- Pastikan file `.env` ada dan `DATABASE_URL` sudah terisi

**Error: Cannot connect to database**
- Cek koneksi internet
- Pastikan DATABASE_URL benar

**Data tidak berubah di localhost**
- Restart server localhost setelah download
- Hard refresh browser (Ctrl+F5)

---

**Selamat menggunakan! Jika ada pertanyaan, silakan hubungi developer.** 😊
