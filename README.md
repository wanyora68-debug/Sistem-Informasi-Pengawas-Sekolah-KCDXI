# 🏫 Aplikasi Pengawas Sekolah

Aplikasi manajemen tugas dan supervisi untuk pengawas sekolah dengan fitur lengkap untuk mengelola tugas pokok, supervisi sekolah, kegiatan tambahan, dan pelaporan.

---

## 🎯 **DOKUMENTASI LENGKAP - BACA INI DULU!**

### 📋 [FINAL_PROJECT_SUMMARY.md](FINAL_PROJECT_SUMMARY.md)
**Dokumentasi LENGKAP semua yang sudah dikerjakan dalam proyek ini!**

Berisi:
- ✅ Ringkasan 10+ fitur utama
- ✅ Arsitektur sistem lengkap
- ✅ Database schema & API endpoints
- ✅ Testing checklist
- ✅ Deployment guide
- ✅ Troubleshooting
- ✅ Best practices

### 🚀 [START_HERE_FINAL.md](START_HERE_FINAL.md)
**Panduan cepat untuk memulai aplikasi!**

### 📊 [PROJECT_COMPLETION_REPORT.md](PROJECT_COMPLETION_REPORT.md)
**Laporan penyelesaian proyek lengkap!**

---

## ✨ Fitur Utama

- 🔐 **Sistem Autentikasi** - Login/Register dengan JWT token
- 📊 **Dashboard Interaktif** - Statistik dan grafik aktivitas
- 📝 **Manajemen Tugas** - CRUD tugas pokok dengan foto
- 🏫 **Supervisi Sekolah** - Catat hasil supervisi dengan data guru
- 📅 **Kalender Kegiatan** - Jadwalkan dan kelola event
- 🏢 **Data Sekolah** - Kelola informasi sekolah binaan
- 📄 **Laporan** - Cetak laporan dengan foto dokumentasi
- 💾 **Local Storage** - Data tersimpan di file JSON (no database setup required)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd SchoolGuardManager
```

2. Install dependencies
```bash
npm install
```

3. Jalankan aplikasi
```bash
npm run dev
```

4. Buka browser
```
http://localhost:5000
```

5. Login dengan akun default
```
Username: admin
Password: admin
```

## 📁 Struktur Proyek

```
SchoolGuardManager/
├── client/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # API client & utilities
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express + TypeScript
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication logic
│   ├── local-storage.ts  # Local JSON storage
│   └── storage.ts        # Database storage (optional)
├── shared/               # Shared types & schemas
├── uploads/              # Uploaded photos
├── local-database.json   # Local data storage
└── .env                  # Environment variables
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching & caching
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Charts & graphs
- **Lucide React** - Icons

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing
- **Drizzle ORM** - Database ORM (optional)

## 📖 Dokumentasi

- [CARA_PENGGUNAAN.md](CARA_PENGGUNAAN.md) - Panduan lengkap penggunaan aplikasi
- [QUICK_START.md](QUICK_START.md) - Panduan cepat memulai
- [CHANGELOG.md](CHANGELOG.md) - Riwayat perubahan
- [DESIGN_IMPROVEMENTS.md](DESIGN_IMPROVEMENTS.md) - Dokumentasi perbaikan desain
- [FIX_SAVE_DATA.md](FIX_SAVE_DATA.md) - Dokumentasi perbaikan save data

## 💾 Data Storage

### Local Storage (Default)
Aplikasi menggunakan file JSON untuk menyimpan data:
- **File:** `local-database.json`
- **Foto:** Folder `uploads/`
- **Persistent:** Data tidak hilang setelah restart
- **No Setup:** Tidak perlu install database

### Database (Optional)
Untuk production, bisa menggunakan PostgreSQL:
1. Buat database di [Neon.tech](https://neon.tech) (gratis)
2. Update `DATABASE_URL` di file `.env`
3. Restart server

## 🔐 Keamanan

- Password di-hash dengan bcrypt
- JWT token untuk autentikasi
- Token expires dalam 7 hari
- File upload validation (max 5MB, hanya gambar)
- Protected API routes dengan middleware

## 📊 Fitur Detail

### Dashboard
- Total tugas, supervisi, sekolah, kegiatan
- Grafik aktivitas bulanan
- Daftar tugas terbaru
- Status completion rate

### Tugas Pokok
- Tambah/edit/hapus tugas
- Upload foto dokumentasi
- Status tracking (Selesai/Belum Selesai)
- Filter dan search

### Supervisi Sekolah
- Form supervisi lengkap
- Data guru yang disupervisi
- Pilih sekolah dari dropdown
- Upload foto dokumentasi
- Catatan dan rekomendasi

### Kegiatan Tambahan
- Catat kegiatan di luar tugas pokok
- Upload foto kegiatan
- Status management
- Deskripsi lengkap

### Kalender
- View bulanan
- Tambah/hapus event
- Jadwalkan kegiatan
- Visual calendar

### Data Sekolah
- Nama sekolah
- Alamat lengkap
- Data kepala sekolah
- CRUD operations

### Laporan
- Cetak laporan tugas
- Cetak laporan supervisi
- Include foto dokumentasi
- Export to PDF

## 🔧 Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Production
```bash
npm start
```

### Type Checking
```bash
npm run check
```

## 🐛 Troubleshooting

### Error "Invalid token"
- Buka halaman login
- Token lama akan otomatis dibersihkan
- Login kembali

### Server tidak bisa diakses
- Pastikan port 5000 tidak digunakan aplikasi lain
- Restart server: `npm run dev`

### Data hilang
- Cek file `local-database.json` masih ada
- Restore dari backup jika ada

## 📝 Environment Variables

```env
# Database (optional)
DATABASE_URL=postgresql://user:password@host/database

# JWT Secret
SESSION_SECRET=your-secret-key

# Admin Password (optional)
ADMIN_PASSWORD=admin
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Dibuat untuk membantu pengawas sekolah dalam mengelola tugas dan supervisi dengan lebih efisien.

---

**Happy Managing! 🎉**
