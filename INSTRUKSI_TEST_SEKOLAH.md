# 📋 INSTRUKSI TEST SEKOLAH BINAAN

## 🎯 TUJUAN
Memverifikasi bahwa data sekolah tersimpan dan muncul dengan benar di halaman Sekolah Binaan

## 🔧 PERSIAPAN

### 1. Buka File Test
1. Buka `test-localStorage-simple.html` di browser
2. Klik "Simpan Sekolah Test" beberapa kali
3. Klik "Baca Data Sekolah" - pastikan data terbaca
4. Biarkan tab ini terbuka

### 2. Buka Aplikasi Utama
1. Buka aplikasi di tab baru
2. Login dengan akun admin/pengawas
3. Buka Developer Tools (F12)
4. Pilih tab Console

## 🧪 LANGKAH TEST

### Test 1: Cek Data Existing
1. Di halaman Sekolah Binaan, lihat debug panel
2. Harus menampilkan: "Debug: X sekolah loaded, isLoading: false"
3. Jika X > 0, data sudah ada dan harus muncul di bawah

### Test 2: Tambah Sekolah Baru
1. Klik "Tambah Sekolah"
2. Isi form:
   - Nama: "SDN Test Manual"
   - Alamat: "Jl. Test"
   - Kontak: "081234567890"
3. Klik "Simpan Sekolah"

### Test 3: Verifikasi Console Log
Setelah klik "Simpan Sekolah", console harus menampilkan:
```
🔍 Creating school: {name: "SDN Test Manual", ...}
🔍 Current schools before save: [array]
🔍 Schools after save: [array dengan data baru]
🔍 School created successfully: {data}
🔍 Invalidating queries...
🔍 Force refetch...
🔍 Schools Query Function Called at: [time]
🔍 Raw schools data: [JSON string]
🔍 Parsed schools: [array]
🔍 Array length: X
🔍 Set query data directly: [array]
🔍 Schools component render: {schools: [...], isLoading: false, schoolsCount: X}
```

### Test 4: Verifikasi UI
1. Toast "Berhasil" harus muncul
2. Dialog form harus tertutup otomatis
3. Debug panel harus update: "Debug: X+1 sekolah loaded"
4. Card sekolah baru harus muncul langsung (TANPA refresh)

## 🚨 JIKA GAGAL

### Scenario A: Data Tersimpan Tapi Tidak Muncul
**Gejala:** Console log OK, toast berhasil, tapi UI tidak update
**Solusi:**
1. Klik tombol "Refresh Data" di debug panel
2. Jika muncul → masalah React Query cache
3. Jika tidak muncul → masalah rendering

### Scenario B: Error di Console
**Gejala:** Ada error merah di console
**Solusi:**
1. Screenshot error
2. Clear localStorage: `localStorage.clear()`
3. Refresh halaman dan coba lagi

### Scenario C: Data Tidak Tersimpan
**Gejala:** Console log berhenti di "Creating school"
**Solusi:**
1. Cek localStorage permission
2. Coba di incognito mode
3. Cek browser compatibility

### Scenario D: Loading Terus-menerus
**Gejala:** Debug panel menampilkan "isLoading: true"
**Solusi:**
1. Refresh halaman
2. Clear React Query cache
3. Cek network tab untuk request yang stuck

## 🔍 DEBUG COMMANDS

Buka console browser dan jalankan command ini untuk debug:

### Cek Data localStorage
```javascript
console.log('Schools data:', JSON.parse(localStorage.getItem('schools_data') || '[]'));
```

### Force Refresh React Query
```javascript
// Jika ada akses ke queryClient
queryClient.invalidateQueries({ queryKey: ['schools'] });
```

### Clear All Data
```javascript
localStorage.removeItem('schools_data');
location.reload();
```

### Add Test Data
```javascript
localStorage.setItem('schools_data', JSON.stringify([
  {
    id: "manual-test-" + Date.now(),
    name: "SDN Manual Test",
    address: "Jl. Manual Test",
    contact: "081234567890",
    supervisions: 0,
    createdAt: new Date().toISOString()
  }
]));
location.reload();
```

## ✅ KRITERIA SUKSES

**Test BERHASIL jika:**
- [ ] Console menampilkan semua log debug dengan emoji 🔍
- [ ] Toast "Berhasil" muncul setelah save
- [ ] Dialog tertutup otomatis
- [ ] Debug panel menampilkan jumlah sekolah bertambah
- [ ] Card sekolah baru muncul langsung tanpa refresh
- [ ] Data persisten setelah refresh halaman

**Test GAGAL jika:**
- [ ] Ada error di console
- [ ] Perlu refresh manual untuk lihat data
- [ ] Data hilang setelah refresh
- [ ] Loading tidak berhenti
- [ ] Form tidak ter-reset setelah save

## 📞 LAPORAN HASIL

Setelah test, laporkan:
1. ✅ BERHASIL - semua kriteria terpenuhi
2. ❌ GAGAL - sertakan:
   - Screenshot console
   - Scenario yang terjadi (A/B/C/D)
   - Browser dan versi
   - Langkah yang sudah dicoba

## 🎯 NEXT STEPS

Jika test sekolah berhasil, lanjut test:
1. Tugas Tambahan (sama seperti sekolah)
2. Supervisi (lebih kompleks dengan foto)
3. Integration test semua fitur