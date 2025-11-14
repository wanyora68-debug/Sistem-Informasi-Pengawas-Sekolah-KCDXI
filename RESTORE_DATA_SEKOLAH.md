# 🏫 Restore Data Sekolah Binaan

## ✅ Status Data

**KABAR BAIK!** Data sekolah binaan **MASIH ADA** dan **LENGKAP** di database!

### 📊 Data Tersimpan:
- **Total Sekolah:** 17 sekolah binaan
- **File Database:** `local-database.json`
- **Status:** ✅ AMAN & LENGKAP

---

## 📋 Daftar Sekolah yang Tersimpan:

1. ✅ SMKN 4 GARUT
2. ✅ SMK PLUS GODOG
3. ✅ SMK IT MUHAJIRIN KARANGPAWITAN
4. ✅ SMKS ISLAM MADINATUL ULUM
5. ✅ SMK IT RABBANY
6. ✅ SMKS ASSHIDDIQIYAH
7. ✅ SMKS PLUS SUKARAJA
8. ✅ SMKS AL AMIN
9. ✅ SMK AL MADANI GARUT
10. ✅ SMK SYIS BADRUZZAMAN
11. ✅ SMK TUNAS NUSANTARA GARUT
12. ✅ SMK PLUS AL ISTIQOMAH SAMARANG
13. ✅ SMK PLUS QURROTA A'YUN SAMARANG
14. ✅ SMKS YPPT GARUT
15. ✅ SMKS WIKRAMA 1 GARUT
16. ✅ SMKS CILEDUG AL MUSADADDIYAH
17. ✅ SMK ASSALAM SAMARANG

**Semua data lengkap dengan:**
- Nama sekolah
- Alamat
- Kontak
- Nama kepala sekolah
- NIP kepala sekolah (jika ada)

---

## 🔧 Cara Menampilkan Data Sekolah:

### Langkah 1: Logout & Login Ulang
Masalah muncul karena token lama yang tidak valid setelah restart server.

1. **Buka aplikasi:** http://localhost:5000
2. **Klik Logout** (jika sudah login)
3. **Buka halaman login:** http://localhost:5000/login
4. **Login dengan:**
   - Username: `wawan`
   - Password: `wawan123` (atau password yang Anda gunakan)
   
   Atau gunakan admin:
   - Username: `admin`
   - Password: `admin`

### Langkah 2: Refresh Browser
Setelah login, refresh halaman dengan:
- **Windows:** `Ctrl + F5` (hard refresh)
- **Mac:** `Cmd + Shift + R`

### Langkah 3: Buka Halaman Sekolah
1. Klik menu **"Sekolah Binaan"**
2. Data sekolah akan muncul

---

## 🔍 Jika Data Masih Tidak Muncul:

### Solusi 1: Clear Browser Cache
```
1. Tekan F12 (buka Developer Tools)
2. Klik kanan pada tombol Refresh
3. Pilih "Empty Cache and Hard Reload"
4. Login ulang
```

### Solusi 2: Clear localStorage
```
1. Tekan F12 (buka Developer Tools)
2. Buka tab "Application" atau "Storage"
3. Klik "Local Storage" > http://localhost:5000
4. Klik kanan > "Clear"
5. Refresh halaman
6. Login ulang
```

### Solusi 3: Restart Server
```bash
# Stop server
Ctrl + C

# Start ulang
npm run dev

# Tunggu sampai muncul: "serving on port 5000"
# Buka browser dan login ulang
```

---

## 🛡️ Backup Data (Opsional)

Untuk keamanan, backup data sekolah:

```bash
# Backup database
copy local-database.json backup-sekolah-$(date +%Y%m%d).json

# Atau di Windows
copy local-database.json backup-sekolah.json
```

---

## 📊 Verifikasi Data

Untuk memastikan data ada, cek file `local-database.json`:

1. Buka file `local-database.json` dengan text editor
2. Cari bagian `"schools": [`
3. Verifikasi ada 17 sekolah

Atau gunakan command:
```bash
# Windows PowerShell
(Get-Content local-database.json | ConvertFrom-Json).schools.Count

# Harusnya output: 17
```

---

## 🔐 Penyebab Masalah

Masalah terjadi karena:
1. ✅ Server di-restart dengan SESSION_SECRET baru
2. ✅ Token lama di browser menjadi tidak valid
3. ✅ API menolak request dengan "Invalid token"
4. ✅ Data tidak bisa ditampilkan

**Solusi:** Login ulang untuk mendapatkan token baru yang valid.

---

## ✅ Konfirmasi Data Aman

Data sekolah **TIDAK HILANG**. Data tersimpan di:
- **File:** `local-database.json`
- **Lokasi:** Root folder proyek
- **Status:** ✅ LENGKAP (17 sekolah)

Hanya perlu **login ulang** untuk mendapatkan token yang valid!

---

## 📞 Troubleshooting

### Error: "Invalid token"
**Solusi:** Logout dan login ulang

### Error: "Unauthorized"
**Solusi:** Clear localStorage dan login ulang

### Data masih kosong
**Solusi:** 
1. Cek file `local-database.json` masih ada
2. Restart server
3. Clear browser cache
4. Login ulang

---

## 🎉 Kesimpulan

✅ **Data sekolah AMAN dan LENGKAP**  
✅ **17 sekolah tersimpan di database**  
✅ **Hanya perlu login ulang**  
✅ **Tidak ada data yang hilang**

**Silakan login ulang dan data akan muncul kembali!** 🏫

---

**Last Updated:** 11 November 2025
