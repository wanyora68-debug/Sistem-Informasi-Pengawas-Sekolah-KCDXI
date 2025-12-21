# 🔧 TROUBLESHOOT: Data Sekolah Tidak Muncul

## 🎯 MASALAH
Data sekolah berhasil disimpan tetapi tidak muncul di halaman Sekolah Binaan

## 🔍 LANGKAH DIAGNOSIS

### Step 1: Test localStorage
1. Buka `test-localStorage-simple.html` di browser
2. Klik "Simpan Sekolah Test"
3. Klik "Baca Data Sekolah"
4. Pastikan data tersimpan dan terbaca dengan benar

### Step 2: Cek Console Browser
1. Buka aplikasi utama
2. Login dan buka halaman Sekolah Binaan
3. Tekan F12 untuk buka Developer Tools
4. Lihat tab Console
5. Cari log dengan emoji 🔍:
   ```
   🔍 Schools Query Function Called
   🔍 Raw schools data: [data]
   🔍 Parsed schools: [array]
   🔍 Schools component render: {schools: [...], isLoading: false, schoolsCount: X}
   ```

### Step 3: Cek localStorage di Browser
1. Di Developer Tools, buka tab Application/Storage
2. Pilih Local Storage → localhost
3. Cari key `schools_data`
4. Pastikan ada data dalam format JSON array

### Step 4: Test Manual Save
1. Di halaman Sekolah Binaan, klik "Tambah Sekolah"
2. Isi form dan klik "Simpan Sekolah"
3. Lihat console untuk log:
   ```
   🔍 Creating school: {data}
   🔍 Current schools before save: [array]
   🔍 Schools after save: [array]
   🔍 School created successfully: {data}
   🔍 Invalidating queries...
   🔍 Force refetch...
   ```

## 🚨 KEMUNGKINAN PENYEBAB & SOLUSI

### 1. React Query Cache Issue
**Gejala:** Data tersimpan di localStorage tapi tidak muncul di UI
**Solusi:**
- Klik tombol "Refresh Data" di debug panel
- Atau refresh halaman browser (F5)

### 2. localStorage Permission Issue
**Gejala:** Error di console tentang localStorage
**Solusi:**
- Pastikan browser mengizinkan localStorage
- Coba buka di incognito/private mode
- Clear browser cache dan cookies

### 3. Data Format Issue
**Gejala:** Data ada tapi tidak ter-parse dengan benar
**Solusi:**
- Cek format data di localStorage harus berupa JSON array
- Hapus data corrupt: `localStorage.removeItem('schools_data')`

### 4. Component Re-render Issue
**Gejala:** Data ada tapi component tidak update
**Solusi:**
- Pastikan React Query invalidation berjalan
- Cek apakah `refetch()` dipanggil setelah mutation

### 5. Browser Compatibility Issue
**Gejala:** Tidak berfungsi di browser tertentu
**Solusi:**
- Test di Chrome/Firefox terbaru
- Pastikan JavaScript enabled

## 🛠️ QUICK FIX

### Fix 1: Force Refresh Data
```javascript
// Buka console browser dan jalankan:
localStorage.setItem('schools_data', JSON.stringify([
  {
    id: "test123",
    name: "SDN Test",
    address: "Jl. Test",
    contact: "081234567890",
    supervisions: 0,
    createdAt: new Date().toISOString()
  }
]));
// Lalu refresh halaman
```

### Fix 2: Clear All Data
```javascript
// Buka console browser dan jalankan:
localStorage.removeItem('schools_data');
// Lalu tambah sekolah baru melalui form
```

### Fix 3: Manual React Query Refresh
- Klik tombol "Refresh Data" di debug panel
- Atau refresh halaman browser

## 📋 CHECKLIST VERIFIKASI

- [ ] localStorage `schools_data` ada dan berisi array
- [ ] Console menampilkan log debug dengan emoji 🔍
- [ ] Tidak ada error di console
- [ ] Toast "Berhasil" muncul setelah save
- [ ] Debug panel menampilkan jumlah sekolah > 0
- [ ] Component render dengan `isLoading: false`

## 🎯 JIKA MASIH BERMASALAH

1. **Hapus semua data dan mulai fresh:**
   ```javascript
   localStorage.clear();
   ```

2. **Test dengan data minimal:**
   - Tambah 1 sekolah dengan nama sederhana
   - Jangan isi field optional dulu

3. **Cek network tab:**
   - Pastikan tidak ada request API yang gagal
   - Semua harus menggunakan localStorage, bukan API

4. **Test di browser lain:**
   - Chrome, Firefox, Edge
   - Mode incognito/private

## 📞 DEBUG INFO YANG DIBUTUHKAN

Jika masih bermasalah, berikan info berikut:
1. Screenshot console browser
2. Isi localStorage `schools_data`
3. Browser dan versi yang digunakan
4. Langkah yang sudah dicoba
5. Error message (jika ada)

## ✅ EXPECTED BEHAVIOR

**Yang HARUS terjadi:**
1. Klik "Simpan Sekolah" → Toast "Berhasil" muncul
2. Dialog tertutup otomatis
3. Data langsung muncul di halaman tanpa refresh
4. Debug panel menampilkan jumlah sekolah bertambah
5. Console menampilkan log success

**Yang TIDAK boleh terjadi:**
1. Perlu refresh manual untuk lihat data
2. Data hilang setelah refresh
3. Error di console
4. Loading terus-menerus
5. Form tidak ter-reset setelah save