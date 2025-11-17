# 🔧 Cara Cek & Perbaiki DATABASE_URL

**Panduan lengkap untuk memastikan aplikasi terkoneksi ke database Neon**

---

## 🎯 Kenapa Ini Penting?

Jika DATABASE_URL tidak terkonfigurasi dengan benar:
- ❌ Data akan hilang setelah restart server
- ❌ Foto profil akan hilang setelah refresh
- ❌ Aplikasi akan pakai local storage (temporary)

Jika DATABASE_URL sudah benar:
- ✅ Data tersimpan permanent di Neon
- ✅ Foto tidak hilang
- ✅ Data aman meskipun server restart

---

## 📋 Langkah 1: Ambil Connection String dari Neon

### A. Buka Neon Console
```
1. Buka browser
2. Ke: https://console.neon.tech
3. Login dengan akun Neon Anda
```

### B. Pilih Project
```
1. Cari project: "pengawas-sekolah"
2. Klik project tersebut
```

### C. Copy Connection String
```
1. Scroll ke bawah sampai ketemu "Connection Details"
2. Cari bagian "Connection string"
3. Klik "Copy" atau select dan copy manual
4. Format akan seperti ini:
   
   postgresql://neondb_owner:npg_xxxxxxxxxxxxx@ep-xxxxx-xxxxx.aws.neon.tech/neondb?sslmode=require
   
5. SIMPAN connection string ini (paste ke notepad dulu)
```

**PENTING:** Connection string ini berisi password database, jangan share ke orang lain!

---

## 📋 Langkah 2: Cek DATABASE_URL di Render

### A. Buka Render Dashboard
```
1. Buka: https://dashboard.render.com
2. Login dengan akun Render Anda
```

### B. Pilih Service
```
1. Cari service: "sistem-informasi-pengawas-sekolah-kcdxi-1"
2. Klik service tersebut
```

### C. Buka Environment Variables
```
1. Klik tab "Environment" di menu kiri
2. Lihat daftar environment variables
```

### D. Cek DATABASE_URL

#### Scenario 1: DATABASE_URL TIDAK ADA ❌
```
Jika tidak ada variable dengan key "DATABASE_URL":

1. Klik tombol "Add Environment Variable"
2. Isi:
   - Key: DATABASE_URL
   - Value: (paste connection string dari Neon)
3. Klik "Save Changes"
4. Tunggu redeploy (~3-5 menit)
5. ✅ SELESAI!
```

#### Scenario 2: DATABASE_URL SUDAH ADA ✅
```
Jika sudah ada variable "DATABASE_URL":

1. Klik "Edit" di sebelah DATABASE_URL
2. Bandingkan value-nya dengan connection string dari Neon
3. Jika BERBEDA:
   - Ganti dengan connection string yang baru dari Neon
   - Klik "Save Changes"
   - Tunggu redeploy
4. Jika SAMA:
   - ✅ Sudah benar, tidak perlu diubah
   - Klik "Cancel"
```

---

## 📋 Langkah 3: Verify Koneksi Database

### A. Tunggu Deploy Selesai
```
1. Setelah save changes, Render akan redeploy
2. Lihat di bagian "Events" atau "Logs"
3. Tunggu sampai status "Live" dengan warna hijau
4. Biasanya 3-5 menit
```

### B. Cek Logs
```
1. Klik tab "Logs"
2. Scroll ke bagian paling bawah
3. Cari log startup (ada tulisan "Server running on port...")
4. Pastikan TIDAK ada warning:
   ❌ "Using local file-based storage"
   ❌ "DATABASE_URL is not properly configured"
5. Jika tidak ada warning tersebut:
   ✅ Database sudah terkoneksi dengan benar!
```

### C. Test di Aplikasi
```
1. Buka aplikasi: 
   https://sistem-informasi-pengawas-sekolah-kcdxi-1.onrender.com
2. Login dengan admin/admin
3. Upload foto profil
4. Refresh halaman (F5)
5. ✅ Foto harus TETAP ADA (tidak hilang)
```

---

## 🔍 Troubleshooting

### Masalah 1: Logs Masih Ada Warning "local storage"

**Penyebab:**
- DATABASE_URL tidak valid
- Format connection string salah
- Password expired

**Solusi:**
1. Ambil connection string BARU dari Neon
2. Update DATABASE_URL di Render
3. Save dan tunggu redeploy
4. Cek logs lagi

### Masalah 2: Error "Connection timeout"

**Penyebab:**
- Neon database sleep (free tier)
- Network issue

**Solusi:**
1. Tunggu 1-2 menit (database akan wake up)
2. Refresh aplikasi
3. Jika masih error, cek connection string

### Masalah 3: Foto/Data Masih Hilang

**Penyebab:**
- DATABASE_URL belum tersimpan
- Redeploy belum selesai

**Solusi:**
1. Cek lagi DATABASE_URL di Render Environment
2. Pastikan sudah save changes
3. Tunggu redeploy selesai (status "Live")
4. Clear browser cache (Ctrl+Shift+Delete)
5. Test lagi

---

## ✅ Checklist Verifikasi

Setelah setup DATABASE_URL, pastikan:

- [ ] DATABASE_URL ada di Render Environment Variables
- [ ] Value DATABASE_URL sama dengan connection string dari Neon
- [ ] Deploy status "Live" di Render
- [ ] Logs tidak ada warning "local storage"
- [ ] Upload foto → Refresh → Foto tetap ada
- [ ] Tambah data → Refresh → Data tetap ada

Jika semua checklist ✅, maka:
**DATABASE_URL sudah terkonfigurasi dengan benar!** 🎉

---

## 📝 Format DATABASE_URL yang Benar

```
postgresql://[username]:[password]@[host]/[database]?sslmode=require
```

Contoh:
```
postgresql://neondb_owner:npg_abc123xyz@ep-cool-sound-12345.aws.neon.tech/neondb?sslmode=require
```

**Komponen:**
- `neondb_owner` = username
- `npg_abc123xyz` = password
- `ep-cool-sound-12345.aws.neon.tech` = host
- `neondb` = database name
- `?sslmode=require` = SSL mode (wajib untuk Neon)

---

## 🔒 Keamanan

### DO:
✅ Simpan connection string di environment variable  
✅ Gunakan connection string dari Neon Console  
✅ Update jika password berubah  

### DON'T:
❌ Jangan commit connection string ke Git  
❌ Jangan share connection string ke orang lain  
❌ Jangan hardcode di source code  

---

## 💡 Tips

### Tip 1: Bookmark Neon Console
Simpan link Neon Console untuk akses cepat:
```
https://console.neon.tech
```

### Tip 2: Bookmark Render Dashboard
Simpan link Render Dashboard:
```
https://dashboard.render.com
```

### Tip 3: Screenshot Connection String
Ambil screenshot connection string dari Neon (blur password) untuk referensi.

### Tip 4: Test Setelah Update
Setiap kali update DATABASE_URL, selalu test:
1. Upload foto profil
2. Refresh halaman
3. Foto harus tetap ada

---

## 📞 Jika Masih Bermasalah

Screenshot dan kirim:
1. **Render Environment Variables** (blur password)
2. **Render Logs** (bagian startup)
3. **Error message** yang muncul
4. **Connection string format** (blur password)

---

**Ikuti panduan ini step by step, DATABASE_URL pasti berhasil dikonfigurasi!** 💪

