# 🧪 Testing Guide

Panduan untuk testing Aplikasi Pengawas Sekolah.

## 📋 Manual Testing Checklist

### 1. Autentikasi ✅

#### Login
- [ ] Buka http://localhost:5000/login
- [ ] Login dengan admin/admin
- [ ] Verifikasi redirect ke dashboard
- [ ] Cek nama pengawas muncul di dashboard

#### Register
- [ ] Klik tab "Daftar"
- [ ] Isi form registrasi
- [ ] Verifikasi auto-switch ke tab login
- [ ] Login dengan akun baru
- [ ] Verifikasi berhasil masuk

#### Logout
- [ ] Klik tombol logout
- [ ] Verifikasi redirect ke login
- [ ] Coba akses halaman lain (harus redirect ke login)

---

### 2. Dashboard 📊

- [ ] Verifikasi nama pengawas muncul
- [ ] Cek statistik cards (Tugas, Supervisi, Sekolah, Kegiatan)
- [ ] Cek grafik aktivitas bulanan
- [ ] Verifikasi data real (bukan dummy)
- [ ] Cek responsive design (mobile/tablet)

---

### 3. Tugas Pokok 📝

#### Tambah Tugas
- [ ] Klik "Tambah Tugas"
- [ ] Isi semua field:
  - Judul tugas
  - Deskripsi
  - Tanggal
  - Status
  - Upload foto
- [ ] Submit form
- [ ] Verifikasi tugas muncul di list
- [ ] Cek foto ter-upload di folder uploads/

#### Edit Tugas
- [ ] Klik edit pada tugas
- [ ] Ubah data
- [ ] Save
- [ ] Verifikasi perubahan tersimpan

#### Hapus Tugas
- [ ] Klik hapus pada tugas
- [ ] Konfirmasi hapus
- [ ] Verifikasi tugas terhapus

#### Filter Status
- [ ] Filter "Semua"
- [ ] Filter "Selesai"
- [ ] Filter "Belum Selesai"
- [ ] Verifikasi hasil filter benar

---

### 4. Supervisi Sekolah 🏫

#### Tambah Supervisi
- [ ] Klik "Tambah Supervisi"
- [ ] Pilih sekolah dari dropdown
- [ ] Isi data guru:
  - Nama guru
  - Mata pelajaran
  - Kelas
- [ ] Isi catatan supervisi
- [ ] Pilih tanggal
- [ ] Upload foto
- [ ] Submit
- [ ] Verifikasi supervisi tersimpan

#### Lihat Detail
- [ ] Klik card supervisi
- [ ] Verifikasi semua data tampil
- [ ] Cek foto muncul

#### Hapus Supervisi
- [ ] Klik hapus
- [ ] Konfirmasi
- [ ] Verifikasi terhapus

---

### 5. Kegiatan Tambahan 📋

#### Tambah Kegiatan
- [ ] Klik "Tambah Kegiatan"
- [ ] Isi form lengkap
- [ ] Upload foto
- [ ] Submit
- [ ] Verifikasi tersimpan

#### Update Status
- [ ] Ubah status kegiatan
- [ ] Verifikasi status berubah

#### Hapus Kegiatan
- [ ] Hapus kegiatan
- [ ] Verifikasi terhapus

---

### 6. Kalender 📅

#### Tambah Event
- [ ] Klik "Tambah Jadwal"
- [ ] Isi judul event
- [ ] Pilih tanggal
- [ ] Pilih sekolah (optional)
- [ ] Submit
- [ ] Verifikasi event muncul di kalender

#### Navigasi Kalender
- [ ] Klik prev/next month
- [ ] Verifikasi bulan berubah
- [ ] Cek event tetap muncul di tanggal yang benar

#### Hapus Event
- [ ] Klik hapus pada event
- [ ] Konfirmasi
- [ ] Verifikasi event terhapus

---

### 7. Data Sekolah 🏢

#### Tambah Sekolah
- [ ] Klik "Tambah Sekolah"
- [ ] Isi form:
  - Nama sekolah
  - Alamat
  - Nama kepala sekolah
  - NIP/NUPTK
- [ ] Submit
- [ ] Verifikasi sekolah tersimpan

#### Edit Sekolah
- [ ] Klik edit
- [ ] Ubah data
- [ ] Save
- [ ] Verifikasi perubahan tersimpan

#### Hapus Sekolah
- [ ] Klik hapus
- [ ] Konfirmasi
- [ ] Verifikasi terhapus

---

### 8. Laporan 📄

#### Laporan Tugas
- [ ] Pilih bulan dan tahun
- [ ] Klik "Tampilkan Laporan"
- [ ] Verifikasi data tugas muncul
- [ ] Cek foto muncul
- [ ] Klik "Cetak Laporan"
- [ ] Verifikasi print preview
- [ ] Test save as PDF

#### Laporan Supervisi
- [ ] Pilih bulan dan tahun
- [ ] Klik "Tampilkan Laporan"
- [ ] Verifikasi data supervisi muncul
- [ ] Cek foto dan data guru muncul
- [ ] Test print/PDF

---

## 🔍 Testing Scenarios

### Scenario 1: New User Journey
1. Register akun baru
2. Login dengan akun baru
3. Tambah sekolah binaan
4. Tambah tugas pertama
5. Tambah supervisi pertama
6. Lihat dashboard (statistik harus update)
7. Cetak laporan

### Scenario 2: Data Persistence
1. Tambah beberapa data (tugas, supervisi, sekolah)
2. Restart server
3. Login kembali
4. Verifikasi semua data masih ada
5. Cek file local-database.json
6. Cek folder uploads/

### Scenario 3: Error Handling
1. Submit form kosong (harus ada validasi)
2. Upload file > 5MB (harus error)
3. Upload file bukan gambar (harus error)
4. Login dengan password salah (harus error)
5. Register dengan username yang sudah ada (harus error)

### Scenario 4: Token Expiry
1. Login
2. Tunggu 7 hari (atau ubah expiry di code)
3. Coba akses halaman
4. Harus redirect ke login
5. Login ulang harus berhasil

---

## 🐛 Bug Testing

### Common Issues to Test

#### Invalid Token
- [ ] Clear localStorage
- [ ] Refresh halaman
- [ ] Login ulang
- [ ] Verifikasi token baru valid

#### Data Not Saving
- [ ] Cek network tab (F12)
- [ ] Verifikasi API response 200
- [ ] Cek local-database.json updated
- [ ] Refresh halaman, data harus muncul

#### Photo Upload Failed
- [ ] Cek ukuran file < 5MB
- [ ] Cek format JPG/PNG
- [ ] Cek folder uploads/ exists
- [ ] Cek permissions folder

#### Dashboard Stats Wrong
- [ ] Tambah data baru
- [ ] Refresh dashboard
- [ ] Verifikasi count bertambah
- [ ] Hapus data
- [ ] Verifikasi count berkurang

---

## 📱 Responsive Testing

### Desktop (1920x1080)
- [ ] Layout proper
- [ ] Sidebar visible
- [ ] Cards grid 3 columns
- [ ] Forms readable

### Tablet (768x1024)
- [ ] Layout adjust
- [ ] Sidebar collapsible
- [ ] Cards grid 2 columns
- [ ] Touch-friendly buttons

### Mobile (375x667)
- [ ] Layout mobile-first
- [ ] Sidebar drawer
- [ ] Cards stack vertical
- [ ] Forms full width
- [ ] Touch targets adequate

---

## 🔒 Security Testing

### Authentication
- [ ] Cannot access pages without login
- [ ] Token expires properly
- [ ] Password hashed in database
- [ ] No sensitive data in localStorage

### File Upload
- [ ] Only images allowed
- [ ] File size limited
- [ ] No script execution
- [ ] Files stored securely

### API Security
- [ ] All routes protected
- [ ] Token validation works
- [ ] No SQL injection possible
- [ ] Input validation works

---

## ⚡ Performance Testing

### Load Time
- [ ] Dashboard loads < 2s
- [ ] API responses < 500ms
- [ ] Images load progressively
- [ ] No memory leaks

### Data Volume
- [ ] Test with 100+ tasks
- [ ] Test with 50+ supervisions
- [ ] Test with 20+ schools
- [ ] Pagination works (if implemented)

---

## 📊 Test Results Template

```
Date: [Date]
Tester: [Name]
Version: [Version]

✅ Passed: X/Y tests
❌ Failed: Y tests
⚠️  Warnings: Z issues

Critical Issues:
- [Issue 1]
- [Issue 2]

Minor Issues:
- [Issue 1]
- [Issue 2]

Notes:
[Additional notes]
```

---

## 🔄 Regression Testing

After each update, test:
- [ ] Login/Logout
- [ ] Add/Edit/Delete operations
- [ ] File uploads
- [ ] Reports generation
- [ ] Data persistence

---

## 🆘 Troubleshooting Tests

### If Test Fails

1. **Check Logs**
   ```bash
   # Server logs
   pm2 logs schoolguard
   
   # Browser console
   F12 > Console
   ```

2. **Check Network**
   ```
   F12 > Network tab
   Check API responses
   ```

3. **Check Database**
   ```bash
   cat local-database.json
   ```

4. **Restart Everything**
   ```bash
   pm2 restart schoolguard
   # Clear browser cache
   # Clear localStorage
   ```

---

**Happy Testing! 🧪**
