# 🔧 FIX DATA SALAH - STEP BY STEP

## 🎯 MASALAH:
Data yang muncul di PDF adalah "Drs. Ahmad Suryadi, M.Pd" bukan "H. Wawan Yogaswara, S.Pd, M.Pd" yang sedang login.

## 🔍 PENYEBAB:
Data test "Drs. Ahmad Suryadi" tersimpan di localStorage browser dan menimpa data asli Anda.

## 🚀 SOLUSI LANGKAH DEMI LANGKAH:

### **LANGKAH 1: Bersihkan Data Test**
1. **Buka file:** `CLEAR_LOCALSTORAGE_FIX.html` di browser
2. **Klik "Check Data Sekarang"** untuk melihat data yang tersimpan
3. **Klik "Clear Test Data"** untuk menghapus data test
4. **Klik "Check Data Sekarang"** lagi untuk memastikan data sudah bersih

### **LANGKAH 2: Set Data yang Benar**
1. **Di halaman yang sama**, isi form:
   - Nama: `H. Wawan Yogaswara, S.Pd, M.Pd`
   - NIP: `[NIP Anda yang benar]`
2. **Klik "Set Data yang Benar"**

### **LANGKAH 3: Pastikan Login di Aplikasi Utama**
1. **Buka aplikasi utama** (localhost:3000)
2. **Login dengan akun:** H. Wawan Yogaswara
3. **Buka halaman Profil**
4. **Pastikan data profil sudah terisi lengkap:**
   - Nama lengkap: H. Wawan Yogaswara, S.Pd, M.Pd
   - NIP: [NIP yang benar]
   - Email, posisi, dll
5. **Klik Save/Simpan**

### **LANGKAH 4: Test PDF Enhanced**
1. **Buka PDF Enhanced** (shortcut atau localhost:3000/PDF_EXPORT_ENHANCED.html)
2. **Buka Console** (F12 → Console)
3. **Klik "Generate PDF"**
4. **Lihat debug messages:**
   ```
   🔄 Loading report data...
   👤 Current User from API: {...}
   📋 Data Sources:
   - API User: {...}
   ✅ Final Supervisor Data:
   - Name: H. Wawan Yogaswara, S.Pd, M.Pd
   - NIP: [NIP Anda]
   ```

### **LANGKAH 5: Jika Masih Bermasalah**

#### **A. Clear Browser Cache:**
1. **Tekan Ctrl+Shift+Delete**
2. **Pilih "Cached images and files"**
3. **Klik Clear data**
4. **Refresh halaman**

#### **B. Manual Fix di Console:**
**Ketik di Console PDF Enhanced:**
```javascript
// Clear semua data test
localStorage.removeItem('user_profile');
localStorage.removeItem('uploaded_photos');

// Set data yang benar
localStorage.setItem('current_user', JSON.stringify({
  name: 'H. Wawan Yogaswara, S.Pd, M.Pd',
  nip: '[NIP_ANDA]',
  email: 'wawan.yogaswara@disdik.jabar.go.id',
  position: 'Pengawas Sekolah'
}));

// Refresh data
loadReportData();
```

#### **C. Restart Browser:**
1. **Tutup semua tab browser**
2. **Buka browser baru**
3. **Login ulang ke aplikasi**
4. **Test PDF Enhanced lagi**

## 🔍 DEBUG COMMANDS:

### **Check Data Sources:**
```javascript
console.log('API User:', await fetch('/api/auth/me').then(r => r.json()));
console.log('localStorage current_user:', localStorage.getItem('current_user'));
console.log('localStorage user_profile:', localStorage.getItem('user_profile'));
```

### **Force Update Display:**
```javascript
document.getElementById('signature-name').textContent = 'H. Wawan Yogaswara, S.Pd, M.Pd';
document.getElementById('signature-nip').textContent = 'NIP. [NIP_ANDA]';
document.getElementById('cover-supervisor').textContent = 'Pengawas: H. Wawan Yogaswara, S.Pd, M.Pd';
```

## 💡 PENCEGAHAN:

1. **Jangan gunakan file test** saat aplikasi production
2. **Selalu login dengan akun yang benar** sebelum akses PDF
3. **Pastikan data profil lengkap** di aplikasi utama
4. **Clear browser cache** jika ada masalah data

## 🎯 HASIL YANG DIHARAPKAN:

**Setelah langkah di atas:**
- ✅ **Nama:** H. Wawan Yogaswara, S.Pd, M.Pd
- ✅ **NIP:** [NIP yang benar]
- ✅ **Data konsisten** dengan user yang login
- ✅ **Tidak ada data test** yang mengganggu

---

**🚀 Ikuti langkah ini secara berurutan untuk mengatasi masalah data yang salah!**