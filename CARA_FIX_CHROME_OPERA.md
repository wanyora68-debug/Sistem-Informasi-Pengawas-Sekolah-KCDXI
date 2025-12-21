# 🔧 Cara Fix Dashboard Kosong di Chrome/Opera

## 🚨 Masalah
Dashboard kosong di Chrome/Opera, tapi normal di Edge.

## ✅ Solusi Tercepat (3 Langkah)

### Langkah 1: Buka File HTML
1. Buka file **`FORCE_CREATE_DATA_CHROME_OPERA.html`** di Chrome atau Opera
2. File ini ada di folder project Anda

### Langkah 2: Force Create Data
1. Klik tombol **"🔍 Periksa Data Saat Ini"** untuk melihat status
2. Klik tombol **"💥 FORCE CREATE SEMUA DATA"**
3. Tunggu sampai muncul pesan sukses

### Langkah 3: Buka Aplikasi
1. Klik tombol **"🌐 Buka Aplikasi (localhost:5000)"**
2. Atau buka manual: `http://localhost:5000`
3. Dashboard akan menampilkan data lengkap!

## 📊 Data yang Akan Muncul

Setelah force create, dashboard akan menampilkan:
- **Total Tugas:** 3
- **Tugas Selesai:** 1
- **Sekolah Binaan:** 3
- **Supervisi Bulan Ini:** 3

## 🔍 Jika Masih Kosong

Jika setelah langkah di atas masih kosong:

1. **Buka Console Browser** (tekan F12)
2. **Paste script ini** di tab Console:

```javascript
// Quick fix - paste di console Chrome/Opera
localStorage.setItem('schools_data', JSON.stringify([
  {id:"school-1",name:"SMKN 4 Garut",type:"SMK",studentCount:850},
  {id:"school-2",name:"SMKN 14 Garut",type:"SMK",studentCount:720},
  {id:"school-3",name:"SMA Negeri 1 Garut",type:"SMA",studentCount:960}
]));

localStorage.setItem('tasks_data', JSON.stringify([
  {id:"task-1",title:"Supervisi SMKN 14 Garut",completed:true,date:"2025-01-15"},
  {id:"task-2",title:"Evaluasi program sekolah penggerak",completed:false,date:"2025-01-18"},
  {id:"task-3",title:"Monitoring kurikulum merdeka",completed:false,date:"2025-01-20"}
]));

localStorage.setItem('supervisions_data', JSON.stringify([
  {id:"supervision-1",school:"SMKN 4 Garut",type:"Akademik",date:"2025-01-15"},
  {id:"supervision-2",school:"SMKN 14 Garut",type:"Manajerial",date:"2025-01-18"},
  {id:"supervision-3",school:"SMA Negeri 1 Garut",type:"Akademik",date:"2025-01-20"}
]));

console.log('✅ Data created! Refresh halaman (F5)');
```

3. **Tekan Enter**
4. **Refresh halaman** (F5)

## 💡 Penjelasan Masalah

- **Penyebab:** Setiap browser memiliki localStorage terpisah
- **Edge punya data:** Karena sudah pernah digunakan sebelumnya
- **Chrome/Opera kosong:** Belum pernah create data
- **Solusi:** Force create data di browser yang kosong

## ✅ Verifikasi Berhasil

Dashboard berhasil diperbaiki jika menampilkan:
- ✅ Statistik di card atas (bukan 0 semua)
- ✅ Aktivitas terkini ada isinya
- ✅ Jadwal mendatang ada isinya
- ✅ Nama pengawas muncul di header

## 📝 Catatan

- Solusi ini hanya untuk development (localhost)
- Di production, data disimpan di database server
- Tidak perlu khawatir data hilang setelah fix ini