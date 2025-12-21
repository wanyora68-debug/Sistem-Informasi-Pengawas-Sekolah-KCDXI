# 📖 PANDUAN PENGGUNAAN PDF ENHANCED

## 🎯 Apa itu PDF Enhanced?

**PDF Enhanced** adalah fitur untuk membuat laporan kegiatan pengawas dalam format PDF yang profesional dengan:
- Cover menarik dengan logo sekolah
- Data profil pengawas otomatis
- Galeri foto kegiatan (maksimal 6 foto)
- Layout A4 siap print

## 🚀 CARA MENGGUNAKAN:

### **Langkah 1: Persiapan Data**
1. **Isi profil lengkap** di aplikasi utama:
   - Nama lengkap pengawas
   - NIP pengawas
   - Upload foto profil (opsional)

2. **Upload foto kegiatan** di halaman:
   - Profil (foto profil)
   - Kegiatan/Aktivitas (foto kegiatan)

### **Langkah 2: Generate PDF**

#### **Metode A: Shortcut Desktop (Termudah)**
1. **Double-click** shortcut "Export PDF Laporan Enhanced" di Desktop
2. **Tunggu halaman terbuka** di browser
3. **Klik tombol "Generate PDF"** (warna biru)
4. **Tunggu data loading** (akan muncul nama, NIP, foto)
5. **Klik "Print/Save"** untuk export

#### **Metode B: Manual Browser**
1. **Buka browser** (Chrome/Edge/Firefox)
2. **Ketik alamat:** `localhost:3000/PDF_EXPORT_ENHANCED.html`
3. **Klik "Generate PDF"**
4. **Klik "Print/Save"**

### **Langkah 3: Save PDF**
1. **Pilih "Save as PDF"** di dialog print
2. **Pilih lokasi** penyimpanan
3. **Beri nama file** (contoh: "Laporan_Desember_2024.pdf")
4. **Klik Save**

## 🔍 TROUBLESHOOTING:

### **Jika Nama Masih "Administrator":**
1. **Pastikan profil sudah diisi** di aplikasi utama
2. **Klik "Generate PDF"** lagi untuk refresh
3. **Jika masih bermasalah**, buka Console (F12) dan ketik:
```javascript
localStorage.setItem('user_profile', JSON.stringify({
  name: 'Nama Anda Disini',
  nip: '123456789'
}));
```

### **Jika Foto Tidak Muncul:**
1. **Pastikan foto sudah diupload** di aplikasi
2. **Klik "Generate PDF"** untuk refresh
3. **Jika masih bermasalah**, buka Console (F12) dan ketik:
```javascript
console.log('📸 Check foto:', localStorage.getItem('uploaded_photos'));
```

### **Jika Shortcut Tidak Ada:**
1. **Jalankan file** `BUAT_SHORTCUT_PDF.bat`
2. **Atau buat manual** shortcut ke: `localhost:3000/PDF_EXPORT_ENHANCED.html`

## 💡 TIPS PENGGUNAAN:

### **Untuk Hasil Terbaik:**
1. **Isi data profil lengkap** sebelum generate PDF
2. **Upload foto berkualitas baik** (tidak blur)
3. **Maksimal 6 foto** akan ditampilkan (otomatis dipilih)
4. **Gunakan Chrome/Edge** untuk hasil print terbaik

### **Untuk Print Fisik:**
1. **Set printer** ke "A4" paper size
2. **Pilih "More settings"** → "Options" → "Background graphics"
3. **Print dengan kualitas "High"**

### **Untuk Sharing Digital:**
1. **Save as PDF** dengan kualitas tinggi
2. **Compress jika file terlalu besar** (gunakan online PDF compressor)
3. **Pastikan semua elemen terlihat** sebelum share

## 📋 CHECKLIST SEBELUM GENERATE:

- [ ] Profil pengawas sudah diisi lengkap
- [ ] NIP sudah diisi
- [ ] Foto profil sudah diupload (opsional)
- [ ] Foto kegiatan sudah diupload
- [ ] Server aplikasi sedang berjalan (localhost:3000)
- [ ] Browser sudah terbuka

## 🎯 HASIL YANG DIHARAPKAN:

**PDF dengan struktur:**
1. **Cover Page** - Logo, judul, info pengawas
2. **Statistik** - Ringkasan kegiatan dalam card
3. **Galeri Foto** - Maksimal 6 foto dengan caption
4. **Footer** - Tanda tangan pengawas

---

**🎉 Selamat menggunakan fitur PDF Enhanced!**

*Jika ada kendala, silakan merujuk ke file DEBUG_PDF_ENHANCED.md atau DEBUG_FOTO_PDF.md*