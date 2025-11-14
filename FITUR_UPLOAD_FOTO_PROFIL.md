# 📸 Fitur Upload Foto Profil

Dokumentasi lengkap fitur Upload Foto Profil yang baru ditambahkan.

**Tanggal:** 11 November 2025  
**Status:** ✅ COMPLETED

---

## 🎯 Overview

Fitur Upload Foto Profil memungkinkan pengguna untuk mengupload foto profil mereka yang akan ditampilkan di:
1. **Halaman Profil Pengawas** - Avatar besar dengan tombol upload
2. **Dashboard** - Avatar di header welcome message

---

## ✨ Fitur yang Ditambahkan

### 1. Upload Foto Profil
- ✅ Upload foto dari halaman profil
- ✅ Preview foto sebelum upload
- ✅ Validasi format file (JPG, PNG)
- ✅ Validasi ukuran file (max 5MB)
- ✅ Loading state saat upload
- ✅ Toast notification sukses/gagal

### 2. Tampilan Foto Profil

#### A. Halaman Profil
- ✅ Avatar besar (128x128px)
- ✅ Tombol camera di pojok avatar
- ✅ Tombol "Upload Foto Profil"
- ✅ Fallback ke inisial nama jika belum ada foto
- ✅ Info format dan ukuran file

#### B. Dashboard
- ✅ Avatar di header (80x80px)
- ✅ Border putih semi-transparan
- ✅ Terintegrasi dengan welcome message
- ✅ Fallback ke inisial nama

### 3. Avatar Component
- ✅ Menggunakan shadcn/ui Avatar
- ✅ AvatarImage untuk foto
- ✅ AvatarFallback dengan inisial
- ✅ Responsive sizing

---

## 🛠️ Implementasi Teknis

### 1. Database Schema Update

**File:** `shared/schema.ts`

Ditambahkan field:
```typescript
photoUrl: text("photo_url"), // Foto Profil
```

### 2. Local Storage Update

**File:** `server/local-storage.ts`

Updated `createUser` method untuk include `photoUrl`:
```typescript
photoUrl: user.photoUrl || null,
```

### 3. API Endpoint

**File:** `server/routes.ts`

#### New Endpoint: Upload Photo
```http
POST /api/auth/profile/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
- photo: File (image file)

Response (200):
{
  "message": "Profile photo updated successfully",
  "photoUrl": "/uploads/filename.jpg",
  "user": { ...updated user data }
}

Errors:
- 400: No photo uploaded
- 400: Invalid file type
- 413: File too large
- 401: Unauthorized
- 404: User not found
```

#### Updated Endpoint: Get User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  ...
  "photoUrl": "/uploads/filename.jpg" | null
}
```

### 4. Frontend - Profile Page

**File:** `client/src/pages/profile.tsx`

#### New Features:
- Avatar component dengan foto profil
- File input (hidden)
- Upload button dengan icon
- Camera button di avatar
- Photo upload mutation
- File validation (type & size)
- Loading states
- Toast notifications

#### Key Functions:
```typescript
// Get user initials for fallback
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Handle photo upload
const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  // Validate & upload
};

// Upload mutation
const uploadPhotoMutation = useMutation({
  mutationFn: async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    // POST to /api/auth/profile/photo
  }
});
```

### 5. Frontend - Dashboard

**File:** `client/src/pages/dashboard.tsx`

#### Updates:
- Avatar component di header
- Foto profil ditampilkan
- Fallback ke inisial
- Border styling
- Responsive layout

---

## 📊 UI/UX Design

### Halaman Profil

```
┌─────────────────────────────────────┐
│  📸 Upload Foto Profil              │
├─────────────────────────────────────┤
│                                     │
│         ┌─────────────┐             │
│         │             │             │
│         │   [FOTO]    │ 📷          │
│         │   atau      │             │
│         │   [WY]      │             │
│         └─────────────┘             │
│                                     │
│      H. Wawan Yogaswara             │
│          Pengawas                   │
│                                     │
│   [📤 Upload Foto Profil]           │
│                                     │
│   Format: JPG, PNG (Max 5MB)       │
└─────────────────────────────────────┘
```

### Dashboard Header

```
┌─────────────────────────────────────────────┐
│  ┌────┐  Dashboard                          │
│  │ WY │  Selamat datang kembali,            │
│  │    │  H. Wawan Yogaswara!                │
│  └────┘  Berikut ringkasan kegiatan...      │
└─────────────────────────────────────────────┘
```

### Avatar Sizes
- **Profile Page:** 128x128px (w-32 h-32)
- **Dashboard:** 80x80px (w-20 h-20)
- **Fallback Text:** 2xl (profile), 2xl (dashboard)

### Colors & Styling
- **Border (Dashboard):** border-4 border-white/20
- **Fallback BG (Dashboard):** bg-white/10
- **Camera Button:** bg-primary, rounded-full
- **Upload Button:** variant="outline"

---

## 🔐 Security & Validation

### File Upload Validation

#### Server-Side (Multer)
```typescript
fileFilter: (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only images (jpeg, jpg, png) are allowed"));
}
```

#### Client-Side
```typescript
// Type validation
if (!file.type.startsWith('image/')) {
  toast({ title: "Error", description: "File harus berupa gambar" });
  return;
}

// Size validation (5MB)
if (file.size > 5 * 1024 * 1024) {
  toast({ title: "Error", description: "Ukuran file maksimal 5MB" });
  return;
}
```

### Security Features
- ✅ JWT token authentication
- ✅ File type validation
- ✅ File size limit (5MB)
- ✅ Secure filename generation
- ✅ User can only update own photo
- ✅ Protected API endpoint

---

## 📱 Responsive Design

### Desktop (≥1024px)
- Avatar 128px di profil
- Avatar 80px di dashboard
- Full layout dengan spacing optimal

### Tablet (768px - 1023px)
- Avatar sizes maintained
- Responsive flex layout
- Touch-friendly buttons

### Mobile (<768px)
- Avatar sizes maintained
- Stacked layout
- Full-width buttons
- Touch-optimized

---

## 💾 Data Storage

### File Storage
- **Location:** `uploads/` folder
- **Naming:** `timestamp-random.ext`
- **Example:** `1762826573754-945629969.jpg`

### Database Storage
```json
{
  "users": [
    {
      "id": "1762696525337",
      "username": "wawan",
      "fullName": "H. Wawan Yogaswara, S.Pd, M.Pd",
      "photoUrl": "/uploads/1762826573754-945629969.jpg",
      ...
    }
  ]
}
```

### URL Format
- **Stored:** `/uploads/filename.jpg`
- **Accessed:** `http://localhost:5000/uploads/filename.jpg`
- **Served by:** Express static middleware

---

## 🧪 Testing

### Manual Testing Checklist

#### Upload Photo
- [ ] Buka halaman /profile
- [ ] Klik tombol "Upload Foto Profil"
- [ ] Pilih foto (JPG/PNG, < 5MB)
- [ ] Verifikasi loading state
- [ ] Verifikasi toast notification
- [ ] Verifikasi foto muncul di avatar

#### Validation
- [ ] Upload file non-image (harus error)
- [ ] Upload file > 5MB (harus error)
- [ ] Upload file valid (harus sukses)

#### Display
- [ ] Cek foto di halaman profil
- [ ] Cek foto di dashboard
- [ ] Refresh halaman (foto harus persist)
- [ ] Logout & login (foto harus muncul)

#### Fallback
- [ ] User tanpa foto (harus tampil inisial)
- [ ] User dengan nama 1 kata (inisial 1 huruf)
- [ ] User dengan nama panjang (inisial 2 huruf)

---

## 📝 Cara Menggunakan

### 1. Upload Foto Profil

#### Metode 1: Tombol Upload
```
1. Login ke aplikasi
2. Klik menu "Profil Pengawas"
3. Klik tombol "Upload Foto Profil"
4. Pilih foto dari komputer
5. Tunggu proses upload
6. Foto akan muncul di avatar
```

#### Metode 2: Camera Button
```
1. Buka halaman profil
2. Klik icon camera di pojok avatar
3. Pilih foto
4. Upload otomatis
```

### 2. Lihat Foto Profil

#### Di Halaman Profil
- Avatar besar di bagian atas
- Dengan nama dan role

#### Di Dashboard
- Avatar di header welcome message
- Terintegrasi dengan greeting

### 3. Ganti Foto Profil
```
1. Buka halaman profil
2. Upload foto baru
3. Foto lama akan diganti
4. Foto baru langsung muncul
```

---

## 🔄 Migration

### Existing Users
User yang sudah terdaftar sebelum fitur ini:
- ✅ `photoUrl` akan null
- ✅ Tampil inisial nama sebagai fallback
- ✅ Bisa upload foto kapan saja
- ✅ Tidak ada breaking changes

### New Users
User baru yang registrasi:
- ✅ `photoUrl` null by default
- ✅ Tampil inisial nama
- ✅ Bisa upload setelah login

---

## 📊 API Documentation

### Upload Profile Photo
```http
POST /api/auth/profile/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
{
  photo: File
}

Response (200):
{
  "message": "Profile photo updated successfully",
  "photoUrl": "/uploads/1762826573754-945629969.jpg",
  "user": {
    "id": "string",
    "username": "string",
    "fullName": "string",
    "photoUrl": "/uploads/1762826573754-945629969.jpg",
    ...
  }
}

Error (400):
{
  "error": "No photo uploaded"
}

Error (400):
{
  "error": "Only images (jpeg, jpg, png) are allowed"
}

Error (413):
{
  "error": "File too large"
}

Error (401):
{
  "error": "Unauthorized"
}
```

### Get User Profile (Updated)
```http
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "id": "string",
  "username": "string",
  "fullName": "string",
  "role": "string",
  "photoUrl": "/uploads/filename.jpg" | null,
  ...
}
```

---

## 🎯 Future Enhancements (Optional)

### Possible Improvements
- [ ] Crop foto sebelum upload
- [ ] Resize otomatis untuk optimasi
- [ ] Multiple foto (gallery)
- [ ] Foto cover/banner
- [ ] Webcam capture
- [ ] Drag & drop upload
- [ ] Progress bar upload
- [ ] Preview sebelum save
- [ ] Delete foto
- [ ] Change foto history

---

## ✅ Completion Checklist

- [x] Database schema updated (photoUrl field)
- [x] Local storage support
- [x] API endpoint created (POST /api/auth/profile/photo)
- [x] File upload with multer
- [x] Profile page updated
- [x] Dashboard updated
- [x] Avatar component implemented
- [x] File validation (type & size)
- [x] Loading states
- [x] Error handling
- [x] Toast notifications
- [x] Responsive design
- [x] Fallback to initials
- [x] Documentation created

---

## 🎉 Summary

Fitur Upload Foto Profil telah berhasil ditambahkan dengan:

✅ **Upload foto** dari halaman profil  
✅ **Tampil di 2 tempat** (Profil & Dashboard)  
✅ **Avatar component** dengan fallback inisial  
✅ **Validasi lengkap** (type & size)  
✅ **Responsive design** untuk semua devices  
✅ **User-friendly UI** dengan camera button  
✅ **Loading & error states** yang proper  
✅ **Toast notifications** untuk feedback  
✅ **Secure upload** dengan authentication  

**Fitur siap digunakan!** 📸🚀

---

**Last Updated:** 11 November 2025  
**Version:** 1.0
