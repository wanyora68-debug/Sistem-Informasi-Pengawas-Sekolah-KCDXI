# Panduan Lengkap Manajemen User

## Daftar Isi
1. [Overview](#overview)
2. [Fitur Web Interface](#fitur-web-interface)
3. [API Endpoints](#api-endpoints)
4. [Command Line Tools](#command-line-tools)
5. [Struktur Data](#struktur-data)
6. [Keamanan](#keamanan)
7. [Troubleshooting](#troubleshooting)

## Overview

Sistem manajemen user telah diperluas dengan fitur-fitur komprehensif untuk mengelola user sistem pengawas sekolah. Sistem ini menyediakan interface web, API endpoints, dan command line tools.

## Fitur Web Interface

### 1. Dashboard Statistik
- **Total User**: Jumlah keseluruhan user
- **User Aktif/Tidak Aktif**: Status user
- **Breakdown Role**: Admin vs Pengawas

### 2. Pencarian dan Filter
```typescript
// Pencarian multi-field
searchTerm: string // Nama, username, NIP, email

// Filter berdasarkan role
roleFilter: "all" | "admin" | "pengawas"

// Filter berdasarkan status
statusFilter: "all" | "active" | "inactive"
```

### 3. Tampilan Data
- **List View**: Tampilan detail dengan semua informasi
- **Grid View**: Tampilan kartu yang compact
- **Bulk Selection**: Pilih multiple user

### 4. Operasi User

#### Tambah User Baru
```typescript
const newUser = {
  username: string,      // Wajib, unik
  password: string,      // Wajib, min 6 karakter
  fullName: string,      // Wajib
  role: "admin" | "pengawas",
  nip?: string,
  rank?: string,
  phone?: string,
  email?: string,
  department?: string,
  status: "active" | "inactive"
}
```

#### Edit User
- Semua field dapat diedit kecuali untuk user admin
- Validasi input otomatis
- Tracking perubahan dengan timestamp

#### Reset Password
- Password baru minimal 6 karakter
- Konfirmasi password wajib
- Toggle show/hide password

#### Kelola Aktivitas
- Lihat semua aktivitas user
- Hapus aktivitas tertentu
- Kategorisasi dalam tabs

### 5. Bulk Operations
- Pilih multiple user
- Hapus massal (kecuali admin)
- Export data (placeholder)

## API Endpoints

### User Management API

#### GET /api/users
```javascript
// Response
{
  "users": [
    {
      "id": "string",
      "username": "string",
      "fullName": "string",
      "role": "admin" | "pengawas",
      "status": "active" | "inactive",
      // ... other fields
    }
  ]
}
```

#### POST /api/users
```javascript
// Request Body
{
  "username": "string",
  "password": "string", 
  "fullName": "string",
  "role": "admin" | "pengawas",
  "email": "string",
  // ... other optional fields
}

// Response
{
  "id": "string",
  "message": "User berhasil ditambahkan"
}
```

#### PUT /api/users/[id]
```javascript
// Request Body - partial update
{
  "fullName": "string",
  "status": "active" | "inactive",
  // ... other fields to update
}
```

#### DELETE /api/users/[id]
```javascript
// Response
{
  "message": "User berhasil dihapus"
}
```

### User Activities API

#### GET /api/users/[id]/activities
```javascript
// Response
{
  "tasks": [...],
  "supervisions": [...], 
  "events": [...],
  "additionalTasks": [...]
}
```

### Password Reset API

#### POST /api/users/[id]/reset-password
```javascript
// Request Body
{
  "newPassword": "string",
  "confirmPassword": "string"
}

// Response
{
  "message": "Password berhasil direset"
}
```

## Command Line Tools

### Node.js Script

#### Menjalankan Script
```bash
node scripts/manage-users.js
```

#### Menu Interaktif
1. Lihat Daftar User
2. Tambah User Baru
3. Hapus User
4. Update Status User
5. Reset Password
6. Ekspor Data User
7. Statistik User

### PowerShell Script (Windows)

#### Menjalankan Script
```powershell
# Menu interaktif
.\manage-users.ps1

# Command line dengan parameter
.\manage-users.ps1 -Action list
.\manage-users.ps1 -Action add -Username "john" -FullName "John Doe"
.\manage-users.ps1 -Action delete -UserId "123"
.\manage-users.ps1 -Action export
```

#### Actions Tersedia
- `list`: Tampilkan daftar user
- `add`: Tambah user baru
- `delete`: Hapus user
- `status`: Update status user
- `export`: Ekspor ke CSV
- `stats`: Statistik user
- `help`: Bantuan

## Struktur Data

### User Object
```typescript
interface User {
  id: string;                    // Unique identifier
  username: string;              // Login username (unique)
  fullName: string;              // Full display name
  role: 'admin' | 'pengawas';    // User role
  nip?: string;                  // Employee ID
  rank?: string;                 // Job rank/grade
  phone?: string;                // Phone number
  email?: string;                // Email address
  department?: string;           // Work unit
  status: 'active' | 'inactive'; // Account status
  lastLogin?: string;            // Last login timestamp
  createdAt: string;             // Creation timestamp
  updatedAt?: string;            // Last update timestamp
}
```

### Database Structure
```json
{
  "users": [
    {
      "id": "1",
      "username": "admin",
      "fullName": "Administrator",
      "role": "admin",
      "status": "active",
      "email": "admin@disdik.jabar.go.id",
      "department": "Cabang Dinas Pendidikan Wilayah XI",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "schools": [],
  "tasks": [],
  "supervisions": [],
  "events": [],
  "additionalTasks": []
}
```

## Keamanan

### 1. Proteksi Admin
```typescript
// User admin tidak dapat:
- Dihapus
- Dinonaktifkan  
- Username diubah
- Role diubah

// Validasi di frontend dan backend
if (user.username === 'admin') {
  throw new Error('User admin tidak dapat dimodifikasi');
}
```

### 2. Validasi Input
```typescript
// Username validation
if (!username || username.length < 3) {
  throw new Error('Username minimal 3 karakter');
}

// Password validation  
if (!password || password.length < 6) {
  throw new Error('Password minimal 6 karakter');
}

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (email && !emailRegex.test(email)) {
  throw new Error('Format email tidak valid');
}
```

### 3. Authorization
```typescript
// Check user role
const currentUser = getCurrentUser();
if (currentUser.role !== 'admin') {
  throw new Error('Akses ditolak - hanya admin');
}

// API token validation
const token = req.headers.authorization?.split(' ')[1];
if (!token || !verifyToken(token)) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

## Troubleshooting

### 1. User Tidak Bisa Login
**Kemungkinan Penyebab:**
- Status user inactive
- Password salah
- Username tidak ditemukan

**Solusi:**
```bash
# Cek status user
node scripts/manage-users.js
# Pilih menu 1 untuk lihat daftar

# Aktifkan user jika inactive
# Pilih menu 4 untuk update status

# Reset password jika lupa
# Pilih menu 5 untuk reset password
```

### 2. Tidak Bisa Hapus User
**Kemungkinan Penyebab:**
- User adalah admin
- User sedang login
- Ada aktivitas terkait

**Solusi:**
```typescript
// Cek apakah user admin
if (user.username === 'admin') {
  console.log('User admin tidak dapat dihapus');
}

// Hapus aktivitas user terlebih dahulu
DELETE /api/users/{id}/activities
```

### 3. Data User Hilang
**Kemungkinan Penyebab:**
- File database corrupt
- localStorage terhapus
- Error saat save

**Solusi:**
```bash
# Restore dari backup
cp local-database.backup.json local-database.json

# Atau buat user admin baru
node scripts/manage-users.js
# Pilih menu 2 untuk tambah user admin
```

### 4. Export CSV Gagal
**Kemungkinan Penyebab:**
- Permission file system
- Path tidak valid
- Data corrupt

**Solusi:**
```powershell
# Windows - cek permission
Get-Acl .\users_export_*.csv

# Jalankan sebagai administrator
Start-Process PowerShell -Verb RunAs
.\manage-users.ps1 -Action export
```

### 5. API Error 500
**Kemungkinan Penyebab:**
- Database connection error
- Invalid data format
- Server error

**Solusi:**
```javascript
// Cek log error
console.error('API Error:', error);

// Validasi data input
if (!req.body.username) {
  return res.status(400).json({ error: 'Username required' });
}

// Handle database errors
try {
  const result = await database.query();
} catch (error) {
  return res.status(500).json({ error: 'Database error' });
}
```

## Best Practices

### 1. Backup Data
```bash
# Backup otomatis sebelum operasi penting
cp local-database.json local-database.backup.json
```

### 2. Validasi Input
```typescript
// Selalu validasi di frontend dan backend
const validateUser = (user) => {
  if (!user.username) throw new Error('Username required');
  if (!user.fullName) throw new Error('Full name required');
  if (user.password && user.password.length < 6) {
    throw new Error('Password too short');
  }
};
```

### 3. Error Handling
```typescript
// Gunakan try-catch untuk semua operasi
try {
  const result = await userOperation();
  showSuccess('Operasi berhasil');
} catch (error) {
  showError(error.message);
  console.error('Operation failed:', error);
}
```

### 4. Logging
```typescript
// Log semua operasi penting
console.log(`User ${username} created by ${currentUser.username}`);
console.log(`User ${username} deleted by ${currentUser.username}`);
console.log(`Password reset for user ${username}`);
```

## Pengembangan Selanjutnya

### 1. Fitur Tambahan
- [ ] Audit log aktivitas user
- [ ] Role-based permissions yang lebih detail
- [ ] Bulk import dari CSV/Excel
- [ ] Email notifications
- [ ] Two-factor authentication

### 2. Integrasi
- [ ] LDAP/Active Directory integration
- [ ] Single Sign-On (SSO)
- [ ] External database support
- [ ] API rate limiting
- [ ] Caching layer

### 3. UI/UX Improvements
- [ ] Advanced filtering options
- [ ] Sortable columns
- [ ] Pagination for large datasets
- [ ] Mobile-responsive design
- [ ] Dark mode support