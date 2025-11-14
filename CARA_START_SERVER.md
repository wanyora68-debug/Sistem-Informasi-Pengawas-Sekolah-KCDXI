# 🚀 Cara Menjalankan Server

Panduan lengkap untuk menjalankan server Aplikasi Pengawas Sekolah dengan mudah.

**Tanggal:** 11 November 2025

---

## 🎯 Cara Paling Mudah (Recommended)

### **Metode 1: Double-Click File Batch** ⭐

#### Windows:
```
1. Cari file: start.bat
2. Double-click file tersebut
3. Server akan otomatis start
4. Browser akan terbuka (atau buka manual: http://localhost:5000)
```

**Keuntungan:**
- ✅ Paling mudah (1 klik)
- ✅ Tidak perlu buka terminal
- ✅ Auto-check dependencies
- ✅ Tampilan yang jelas

---

### **Metode 2: PowerShell Script** 🔧

#### Langkah:
```powershell
# Di folder proyek
.\start-server.ps1
```

**Keuntungan:**
- ✅ Tampilan berwarna
- ✅ Auto-check dependencies
- ✅ Info lengkap (URL, login)

---

### **Metode 3: NPM Command** 💻

#### Langkah:
```bash
npm run dev
```

**Keuntungan:**
- ✅ Standard npm
- ✅ Cepat
- ✅ Familiar untuk developer

---

### **Metode 4: Manual Command** ⚙️

#### PowerShell:
```powershell
$env:NODE_ENV="development"; npx tsx server/index.ts
```

#### CMD:
```cmd
set NODE_ENV=development && npx tsx server/index.ts
```

---

## ⏹️ Cara Menghentikan Server

### **Metode 1: Keyboard Shortcut** ⭐
```
Tekan: Ctrl + C
(di terminal yang menjalankan server)
```

### **Metode 2: PowerShell Script**
```powershell
.\stop-server.ps1
```

### **Metode 3: Task Manager**
```
1. Tekan: Ctrl + Shift + Esc
2. Cari: node.exe atau tsx
3. Klik kanan > End Task
```

---

## 📋 Perbandingan Metode

| Metode | Kemudahan | Kecepatan | Fitur |
|--------|-----------|-----------|-------|
| start.bat | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Auto-check deps |
| start-server.ps1 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Colored output |
| npm run dev | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Standard |
| Manual command | ⭐⭐ | ⭐⭐⭐⭐⭐ | Full control |

---

## 🔧 Setup Pertama Kali

### 1. Install Dependencies

Jika belum install dependencies:
```bash
npm install
```

### 2. Check Node.js

Pastikan Node.js terinstall:
```bash
node --version
# Harus: v18 atau lebih baru
```

### 3. Check Port 5000

Pastikan port 5000 tidak digunakan:
```powershell
# PowerShell
Get-NetTCPConnection -LocalPort 5000

# Jika ada, stop dengan:
.\stop-server.ps1
```

---

## 🚀 Quick Start Guide

### Untuk Pengguna Baru:

```
1. Buka folder proyek
2. Double-click: start.bat
3. Tunggu server start (muncul: "serving on port 5000")
4. Buka browser: http://localhost:5000
5. Login: admin / admin
6. Selesai! ✅
```

### Untuk Developer:

```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Development work
# (edit code, test, dll)

# Stop server: Ctrl + C di Terminal 1
```

---

## 📊 Output yang Benar

Saat server berhasil start, Anda akan melihat:

```
⚠️  DATABASE_URL is not properly configured. Using fallback mode.
⚠️  To enable database features, configure DATABASE_URL in .env file
⚠️  Get a free database at: https://neon.tech
✓ Local admin user already exists
✓ Using local file-based storage (data persisted in local-database.json)
12:40:54 PM [express] serving on port 5000
```

**Indikator sukses:**
- ✅ `serving on port 5000` muncul
- ✅ Tidak ada error merah
- ✅ Bisa akses http://localhost:5000

---

## 🐛 Troubleshooting

### Error: "Port 5000 already in use"

**Solusi:**
```powershell
# Stop server yang berjalan
.\stop-server.ps1

# Atau manual:
Get-NetTCPConnection -LocalPort 5000 | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force
}
```

### Error: "node_modules not found"

**Solusi:**
```bash
npm install
```

### Error: "tsx not found"

**Solusi:**
```bash
npm install -g tsx
# Atau
npx tsx server/index.ts
```

### Server start tapi tidak bisa diakses

**Solusi:**
1. Cek firewall Windows
2. Cek antivirus
3. Coba akses: http://127.0.0.1:5000
4. Restart server

---

## 💡 Tips & Tricks

### 1. Auto-Start saat Windows Boot

Buat shortcut `start.bat` di folder Startup:
```
1. Tekan: Win + R
2. Ketik: shell:startup
3. Copy shortcut start.bat ke folder tersebut
```

### 2. Buat Desktop Shortcut

```
1. Klik kanan start.bat
2. Send to > Desktop (create shortcut)
3. Rename: "Start Server Pengawas"
4. Double-click dari desktop kapan saja
```

### 3. Custom Port

Edit file `.env`:
```env
PORT=3000
```

Atau edit `server/index.ts`:
```typescript
const PORT = process.env.PORT || 3000;
```

### 4. Background Process

Untuk menjalankan server di background:
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\start-server.ps1" -WindowStyle Minimized
```

---

## 📝 Checklist Start Server

Sebelum start server:
- [ ] Node.js terinstall (v18+)
- [ ] Dependencies terinstall (npm install)
- [ ] Port 5000 tidak digunakan
- [ ] Berada di folder proyek

Setelah start server:
- [ ] Muncul "serving on port 5000"
- [ ] Tidak ada error merah
- [ ] Bisa akses http://localhost:5000
- [ ] Bisa login dengan admin/admin

---

## 🎯 Workflow Harian

### Pagi (Start):
```
1. Buka folder proyek
2. Double-click: start.bat
3. Buka browser: http://localhost:5000
4. Login dan mulai kerja
```

### Siang (Kerja):
```
- Server tetap running
- Buka/tutup browser sesuka hati
- Data tersimpan otomatis
```

### Sore (Stop):
```
1. Logout dari aplikasi
2. Tekan Ctrl + C di terminal
3. Atau jalankan: .\stop-server.ps1
4. Selesai
```

---

## 📚 File Helper yang Tersedia

1. **start.bat** - Start server (double-click)
2. **start-server.ps1** - Start server (PowerShell)
3. **stop-server.ps1** - Stop server
4. **list-users.ps1** - Lihat daftar user
5. **delete-user.ps1** - Hapus user

---

## 🆘 Bantuan Lebih Lanjut

### Dokumentasi:
- `README.md` - Dokumentasi utama
- `QUICK_START.md` - Panduan cepat
- `CARA_PENGGUNAAN.md` - Panduan pengguna

### Jika Ada Masalah:
1. Cek file `CARA_START_SERVER.md` (file ini)
2. Cek logs di terminal
3. Restart server
4. Restart komputer (last resort)

---

## ✅ Summary

### Cara Tercepat:
```
Double-click: start.bat
```

### Cara Termudah:
```powershell
.\start-server.ps1
```

### Cara Standard:
```bash
npm run dev
```

### Cara Stop:
```
Ctrl + C
```

---

**Selamat menggunakan Aplikasi Pengawas Sekolah!** 🚀✨

---

**Last Updated:** 11 November 2025
