# 🔍 DEBUG STEP BY STEP - SEKOLAH & TUGAS TAMBAHAN

## 🎯 TUJUAN
Mencari tahu mengapa data tidak muncul di halaman Sekolah Binaan dan Tugas Tambahan

## 📋 LANGKAH DEBUG

### STEP 1: Test localStorage Direct
1. Buka `test-direct-localStorage.html` di browser
2. Klik "Tambah Sekolah" beberapa kali
3. Klik "Tambah Tugas" beberapa kali
4. Klik "Baca Sekolah" dan "Baca Tugas"
5. **PASTIKAN data tersimpan dengan benar**

### STEP 2: Test di Aplikasi Utama
1. Buka aplikasi utama di tab baru
2. Login dengan akun admin/pengawas
3. **BUKA DEVELOPER TOOLS (F12) - TAB CONSOLE**
4. Buka halaman "Sekolah Binaan"

### STEP 3: Analisis Console Log
**Yang HARUS muncul di console:**
```
🏫 Schools Query Function Called
🏫 Raw schools data: [JSON string atau null]
🏫 Parsed schools: [array atau undefined]
🏫 Schools component render - data: [array] length: X isLoading: false
```

**Yang HARUS muncul di halaman:**
- Jika ada data: Card sekolah muncul
- Jika tidak ada data: "Belum ada sekolah binaan" dengan tombol "Tambah Sekolah Pertama"

### STEP 4: Test Tugas Tambahan
1. Buka halaman "Tugas Tambahan"
2. Lihat console log:
```
📋 Additional Tasks Query Function Called
📋 Raw additional tasks data: [JSON string atau null]
📋 Parsed additional tasks: [array atau undefined]
📋 Additional Tasks component render - data: [array] length: X isLoading: false
```

### STEP 5: Test Tambah Data Baru
1. Di halaman Sekolah Binaan, klik "Tambah Sekolah"
2. Isi form dan klik "Simpan Sekolah"
3. **Lihat console log:**
```
Submitting school: {data}
🏫 Schools Query Function Called (setelah invalidateQueries)
🏫 Raw schools data: [JSON dengan data baru]
🏫 Schools component render - data: [array dengan data baru]
```
4. **Data baru HARUS muncul langsung tanpa refresh**

## 🚨 DIAGNOSIS BERDASARKAN LOG

### SCENARIO A: Query Function Tidak Dipanggil
**Gejala:** Tidak ada log `🏫 Schools Query Function Called`
**Penyebab:** React Query tidak berjalan
**Solusi:** Periksa apakah component ter-mount dengan benar

### SCENARIO B: localStorage Kosong
**Gejala:** Log `🏫 Raw schools data: null`
**Penyebab:** Data tidak tersimpan di localStorage
**Solusi:** Gunakan `test-direct-localStorage.html` untuk menambah data

### SCENARIO C: Data Ada Tapi Tidak Ter-parse
**Gejala:** Log `🏫 Raw schools data: [string]` tapi `🏫 Parsed schools: undefined`
**Penyebab:** JSON parsing error
**Solusi:** Clear localStorage dan mulai fresh

### SCENARIO D: Data Ter-parse Tapi Tidak Render
**Gejala:** Log `🏫 Schools component render - data: [array] length: X` tapi UI kosong
**Penyebab:** JSX rendering issue
**Solusi:** Periksa kondisi render di component

### SCENARIO E: Invalidation Tidak Bekerja
**Gejala:** Setelah save, tidak ada log query function kedua kali
**Penyebab:** `queryClient.invalidateQueries` tidak bekerja
**Solusi:** Periksa queryClient setup

## 🔧 QUICK FIXES

### Fix 1: Clear localStorage
```javascript
// Buka console browser dan jalankan:
localStorage.clear();
location.reload();
```

### Fix 2: Manual Add Data
```javascript
// Buka console browser dan jalankan:
localStorage.setItem('schools_data', JSON.stringify([
  {
    id: "test-1",
    name: "SDN Test Manual",
    address: "Jl. Test",
    contact: "081234567890",
    supervisions: 0,
    createdAt: new Date().toISOString()
  }
]));
location.reload();
```

### Fix 3: Force React Query Refresh
```javascript
// Jika ada akses ke queryClient di console:
queryClient.invalidateQueries({ queryKey: ['schools'] });
queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
```

## 📊 EXPECTED VS ACTUAL

### EXPECTED (Halaman Daftar Tugas - BERFUNGSI)
1. Query function dipanggil saat component mount
2. Data dibaca dari localStorage
3. Data di-render ke UI
4. Setelah save, query function dipanggil lagi
5. UI update dengan data baru

### ACTUAL (Sekolah & Tugas Tambahan - BERMASALAH)
1. ❓ Query function dipanggil? (Cek log)
2. ❓ Data dibaca dari localStorage? (Cek log)
3. ❓ Data di-render ke UI? (Cek visual)
4. ❓ Setelah save, query function dipanggil lagi? (Cek log)
5. ❓ UI update dengan data baru? (Cek visual)

## 🎯 HASIL DEBUG

Setelah mengikuti langkah di atas, catat:

**SCENARIO yang terjadi:** A/B/C/D/E
**Console logs:** [copy paste logs]
**Visual result:** [screenshot atau deskripsi]
**Browser:** [Chrome/Firefox/Edge + versi]

Dengan informasi ini, kita bisa menentukan fix yang tepat.

## 🚀 NEXT STEPS

Jika semua log muncul dengan benar tapi data tetap tidak muncul, kemungkinan masalah ada di:
1. CSS/styling yang menyembunyikan element
2. Conditional rendering yang salah
3. React Query cache issue
4. Component lifecycle issue

Mari debug step by step untuk menemukan akar masalahnya!