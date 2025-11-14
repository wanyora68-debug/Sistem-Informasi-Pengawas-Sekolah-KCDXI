# 🗑️ Cara Menghapus User dari Database

Panduan lengkap untuk menghapus user yang sudah terdaftar di database.

**Tanggal:** 11 November 2025

---

## 📋 Metode yang Tersedia

### **Metode 1: Edit Manual (Paling Mudah)** ⭐
### **Metode 2: Menggunakan Script PowerShell** 🔧
### **Metode 3: Menggunakan Command Line** 💻

---

## 🎯 Metode 1: Edit Manual File JSON

### Langkah-langkah:

#### 1. **Buka File Database**
```
File: local-database.json
Location: Root folder proyek
```

#### 2. **Cari Bagian Users**
```json
{
  "users": [
    {
      "id": "1762696424712",
      "username": "admin",
      "fullName": "Administrator",
      "role": "admin",
      ...
    },
    {
      "id": "1762836343774",
      "username": "Undang",
      "fullName": "Undang Test",
      "role": "pengawas",
      ...
    }
  ],
  "schools": [...],
  "tasks": [...]
}
```

#### 3. **Hapus User yang Tidak Diinginkan**

Hapus seluruh object user (dari `{` sampai `}`):

```json
{
  "users": [
    {
      "id": "1762696424712",
      "username": "admin",
      "fullName": "Administrator",
      "role": "admin",
      ...
    }
    // User "Undang" sudah dihapus
  ],
  "schools": [...],
  "tasks": [...]
}
```

#### 4. **Save File**
- Pastikan format JSON valid
- Tidak ada koma trailing
- Bracket `[]` dan `{}` seimbang

#### 5. **Restart Server**
```powershell
# Stop server (Ctrl + C)
# Start ulang
npm run dev
```

---

## 🔧 Metode 2: Menggunakan Script PowerShell

### A. Lihat Daftar User

```powershell
.\list-users.ps1
```

**Output:**
```
========================================
  DAFTAR USER TERDAFTAR
========================================

Total user: 3

Username    : admin
Nama Lengkap: Administrator
Role        : admin
ID          : 1762696424712
Dibuat      : 2025-11-09T13:53:44.712Z
----------------------------------------
Username    : wawan
Nama Lengkap: H. Wawan Yogaswara, S.Pd, M.Pd
Role        : pengawas
ID          : 1762696525337
NIP         : 196501011990031001
Pangkat     : Pembina, IV/a
Foto        : /uploads/1762830374284-750171039.jpg
Dibuat      : 2025-11-09T13:55:25.337Z
----------------------------------------
Username    : Undang
Nama Lengkap: Undang Test
Role        : pengawas
ID          : 1762836343774
Dibuat      : 2025-11-11T04:45:43.774Z
----------------------------------------
```

### B. Hapus User Tertentu

```powershell
.\delete-user.ps1 -username "Undang"
```

**Output:**
```
User yang akan dihapus:
  Username: Undang
  Nama: Undang Test
  ID: 1762836343774

Apakah Anda yakin ingin menghapus user ini? (y/n): y

Backup dibuat: local-database.backup.json
User 'Undang' berhasil dihapus!
Total user sekarang: 2

Daftar user yang tersisa:
  - admin (Administrator)
  - wawan (H. Wawan Yogaswara, S.Pd, M.Pd)

Catatan: Restart server untuk menerapkan perubahan.
```

### C. Restart Server

```powershell
# Stop server (Ctrl + C di terminal server)
# Start ulang
npm run dev
```

---

## 💻 Metode 3: Command Line Manual

### A. Lihat Daftar User

```powershell
# PowerShell
$data = Get-Content local-database.json | ConvertFrom-Json
$data.users | Select-Object username, fullName, role | Format-Table
```

**Output:**
```
username fullName                          role
-------- --------                          ----
admin    Administrator                     admin
wawan    H. Wawan Yogaswara, S.Pd, M.Pd   pengawas
Undang   Undang Test                       pengawas
```

### B. Hapus User (Manual)

```powershell
# 1. Backup dulu
Copy-Item local-database.json local-database.backup.json

# 2. Load data
$data = Get-Content local-database.json | ConvertFrom-Json

# 3. Hapus user
$data.users = $data.users | Where-Object { $_.username -ne "Undang" }

# 4. Save
$data | ConvertTo-Json -Depth 10 | Set-Content local-database.json

# 5. Verifikasi
$data.users | Select-Object username, fullName
```

---

## ⚠️ Peringatan Penting

### 1. **Backup Dulu!**
```powershell
Copy-Item local-database.json local-database.backup.json
```

Atau gunakan script yang otomatis backup:
```powershell
.\delete-user.ps1 -username "nama_user"
```

### 2. **Jangan Hapus Admin!**
- User `admin` adalah akun default
- Diperlukan untuk akses pertama kali
- Jika terhapus, buat ulang dengan:
  - Username: `admin`
  - Password: `admin`

### 3. **Data Terkait Akan Terhapus**

Saat user dihapus, data berikut juga akan terhapus (cascade delete):
- ❌ Semua tugas user tersebut
- ❌ Semua supervisi user tersebut
- ❌ Semua kegiatan tambahan user tersebut
- ❌ Semua sekolah binaan user tersebut
- ❌ Semua event user tersebut

**Pastikan backup data penting sebelum menghapus user!**

### 4. **Restart Server Wajib**

Setelah edit `local-database.json`, **WAJIB restart server**:
```powershell
# Stop: Ctrl + C
# Start: npm run dev
```

---

## 🔄 Restore dari Backup

Jika salah hapus user:

```powershell
# Restore dari backup
Copy-Item local-database.backup.json local-database.json

# Restart server
# Stop: Ctrl + C
# Start: npm run dev
```

---

## 📊 Contoh Kasus

### Kasus 1: Hapus User Testing

**Situasi:** Ada user "test123" yang dibuat untuk testing

**Solusi:**
```powershell
# Lihat daftar user
.\list-users.ps1

# Hapus user test
.\delete-user.ps1 -username "test123"

# Restart server
```

### Kasus 2: Hapus Multiple Users

**Situasi:** Ada beberapa user yang perlu dihapus

**Solusi:**
```powershell
# Hapus satu per satu
.\delete-user.ps1 -username "user1"
.\delete-user.ps1 -username "user2"
.\delete-user.ps1 -username "user3"

# Atau edit manual di local-database.json
```

### Kasus 3: Reset Semua User

**Situasi:** Ingin mulai dari awal

**Solusi:**
```powershell
# Backup dulu
Copy-Item local-database.json local-database.backup.json

# Edit local-database.json
# Hapus semua user kecuali admin
# Atau kosongkan array users: "users": []

# Restart server
# Server akan auto-create admin user
```

---

## 🧪 Testing

### Test Hapus User:

```
1. Backup database
2. Lihat daftar user (.\list-users.ps1)
3. Hapus user test (.\delete-user.ps1 -username "test")
4. Verifikasi user terhapus
5. Restart server
6. Login dengan user lain
7. Verifikasi user test tidak bisa login
```

### Test Restore:

```
1. Hapus user
2. Coba restore dari backup
3. Restart server
4. Verifikasi user kembali
```

---

## 📝 Checklist

Sebelum menghapus user:

- [ ] Backup `local-database.json`
- [ ] Pastikan bukan user `admin`
- [ ] Pastikan data user tidak penting
- [ ] Catat username yang akan dihapus
- [ ] Siap restart server

Setelah menghapus user:

- [ ] Verifikasi user terhapus dari JSON
- [ ] Restart server
- [ ] Test login dengan user lain
- [ ] Verifikasi user terhapus tidak bisa login
- [ ] Simpan backup untuk jaga-jaga

---

## 💡 Tips

### 1. **Gunakan Script PowerShell**
- Lebih aman (ada backup otomatis)
- Lebih mudah (tidak perlu edit manual)
- Lebih cepat (satu command)

### 2. **Backup Rutin**
```powershell
# Backup otomatis dengan timestamp
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item local-database.json "backups/local-database-$timestamp.json"
```

### 3. **Jangan Hapus Admin**
- Selalu sisakan minimal 1 admin
- Untuk akses darurat

### 4. **Export Data User Dulu**
Sebelum hapus, export data user:
```powershell
$data = Get-Content local-database.json | ConvertFrom-Json
$user = $data.users | Where-Object { $_.username -eq "nama_user" }
$user | ConvertTo-Json | Out-File "user-backup.json"
```

---

## 🎯 Summary

### Cara Tercepat:
```powershell
.\delete-user.ps1 -username "nama_user"
```

### Cara Teraman:
1. Backup manual
2. Edit `local-database.json`
3. Restart server

### Cara Terbaik:
1. Gunakan script PowerShell (ada auto-backup)
2. Verifikasi dulu dengan `.\list-users.ps1`
3. Hapus dengan `.\delete-user.ps1`
4. Restart server

---

## 📚 File yang Dibuat

1. **list-users.ps1** - Script untuk lihat daftar user
2. **delete-user.ps1** - Script untuk hapus user
3. **CARA_HAPUS_USER.md** - Dokumentasi ini

---

## 🆘 Troubleshooting

### Error: "File not found"
**Solusi:** Pastikan menjalankan script di root folder proyek

### Error: "Invalid JSON"
**Solusi:** Restore dari backup, format JSON rusak

### User masih bisa login setelah dihapus
**Solusi:** Restart server, clear browser cache

### Data user hilang semua
**Solusi:** Restore dari backup

---

**Selamat mengelola user database!** 🗑️✨

---

**Last Updated:** 11 November 2025
