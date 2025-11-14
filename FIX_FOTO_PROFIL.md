# 🔧 Fix: Foto Profil Tidak Muncul

## 🎯 Masalah

Foto profil yang sudah diupload tidak muncul di halaman profil dan dashboard.

## ✅ Solusi

Masalah ini terjadi karena **token authentication yang invalid** setelah server di-restart. 

### Langkah Perbaikan:

#### 1. **Logout dan Login Ulang** (WAJIB)

```
1. Buka aplikasi: http://localhost:5000
2. Klik tombol "Keluar" di sidebar bawah
3. Anda akan diarahkan ke halaman login
4. Login kembali dengan username dan password Anda
5. Foto profil akan muncul!
```

#### 2. **Atau Clear Browser Cache**

Jika masih belum muncul:

```
1. Tekan F12 (buka Developer Tools)
2. Klik tab "Application" atau "Storage"
3. Klik "Local Storage" > http://localhost:5000
4. Hapus item "auth_token"
5. Refresh halaman (F5)
6. Login ulang
```

#### 3. **Hard Refresh Browser**

```
Windows: Ctrl + Shift + R atau Ctrl + F5
Mac: Cmd + Shift + R
```

---

## 📊 Verifikasi Data

### Cek Data di Database

Foto profil sudah tersimpan dengan benar:

```json
{
  "id": "1762696525337",
  "username": "wawan",
  "fullName": "H. Wawan Yogaswara, S.Pd, M.Pd",
  "photoUrl": "/uploads/1762830374284-750171039.jpg"
}
```

### Cek File Foto

File foto ada di folder `uploads/`:
- File: `1762830374284-750171039.jpg`
- Size: 121 KB
- Status: ✅ Tersimpan

---

## 🔍 Penyebab Masalah

### 1. Token Invalid
- Server di-restart dengan SESSION_SECRET yang sama
- Token lama di browser menjadi invalid
- API menolak request dengan error "Invalid token"
- Data tidak bisa di-fetch

### 2. Browser Cache
- Browser mungkin cache response lama
- Perlu hard refresh atau clear cache

---

## ✅ Cara Upload Foto yang Benar

Setelah login ulang:

### Upload Foto Profil:

```
1. Login dengan username dan password
2. Klik menu "Profil Pengawas"
3. Klik tombol "Upload Foto Profil" atau icon camera 📷
4. Pilih foto (JPG/PNG, max 5MB)
5. Tunggu proses upload
6. Foto akan muncul di avatar
7. Cek juga di Dashboard - foto harus muncul di header
```

### Verifikasi Upload Berhasil:

1. ✅ Toast notification "Berhasil - Foto profil berhasil diperbarui"
2. ✅ Foto muncul di avatar halaman profil
3. ✅ Foto muncul di header dashboard
4. ✅ Refresh halaman - foto tetap muncul

---

## 🧪 Testing

### Test Upload Foto:

```
1. Login sebagai user "wawan" atau user lain
2. Buka halaman profil
3. Upload foto baru
4. Verifikasi foto muncul
5. Buka dashboard
6. Verifikasi foto muncul di header
7. Logout dan login ulang
8. Verifikasi foto masih muncul
```

### Test Fallback (Tanpa Foto):

```
1. Login sebagai user yang belum upload foto
2. Harus tampil inisial nama (2 huruf)
3. Background warna
4. Styling yang menarik
```

---

## 📝 Catatan Penting

### Token Authentication

- Token JWT expires dalam 7 hari
- Setelah server restart, token lama tetap valid (jika SESSION_SECRET sama)
- Jika ada error "Invalid token", logout dan login ulang

### File Upload

- Format: JPG, PNG
- Max size: 5MB
- Disimpan di: `uploads/` folder
- URL format: `/uploads/filename.jpg`

### Browser Cache

- Browser bisa cache foto lama
- Gunakan hard refresh (Ctrl+Shift+R)
- Atau clear browser cache

---

## 🔧 Troubleshooting

### Foto Tidak Muncul Setelah Upload

**Solusi:**
1. Cek toast notification (harus "Berhasil")
2. Refresh halaman (F5)
3. Hard refresh (Ctrl+Shift+R)
4. Clear browser cache
5. Logout dan login ulang

### Error "Invalid token"

**Solusi:**
1. Logout dari aplikasi
2. Login ulang
3. Token baru akan di-generate

### Upload Gagal

**Solusi:**
1. Cek ukuran file (max 5MB)
2. Cek format file (JPG/PNG only)
3. Cek koneksi internet
4. Cek server masih running
5. Cek browser console untuk error

### Foto Muncul di Profil tapi Tidak di Dashboard

**Solusi:**
1. Hard refresh dashboard (Ctrl+Shift+R)
2. Clear browser cache
3. Logout dan login ulang

---

## ✅ Checklist Perbaikan

- [ ] Logout dari aplikasi
- [ ] Login ulang dengan username/password
- [ ] Buka halaman profil
- [ ] Verifikasi foto muncul di profil
- [ ] Buka dashboard
- [ ] Verifikasi foto muncul di header
- [ ] Test upload foto baru
- [ ] Verifikasi upload berhasil
- [ ] Refresh halaman
- [ ] Verifikasi foto tetap muncul

---

## 🎉 Hasil Akhir

Setelah login ulang:

### Halaman Profil:
```
┌─────────────────────────────┐
│                             │
│      ┌─────────────┐        │
│      │             │        │
│      │   [FOTO]    │ 📷     │
│      │             │        │
│      └─────────────┘        │
│                             │
│  H. Wawan Yogaswara        │
│      Pengawas              │
└─────────────────────────────┘
```

### Dashboard Header:
```
┌────────────────────────────────┐
│  ┌────┐                        │
│  │FOTO│  Dashboard             │
│  │    │  Selamat datang...     │
│  └────┘                        │
└────────────────────────────────┘
```

---

## 📞 Support

Jika masih ada masalah:
1. Cek server logs
2. Cek browser console (F12)
3. Cek file `local-database.json`
4. Cek folder `uploads/`
5. Restart server dan browser

---

**Solusi: LOGOUT dan LOGIN ULANG untuk mendapatkan token baru!** 🔐✅

---

**Last Updated:** 11 November 2025
