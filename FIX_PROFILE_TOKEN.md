# 🔐 Fix: Invalid Token pada Simpan Profil

## 🎯 Perbaikan

Masalah "Invalid token" pada simpan profil telah diperbaiki dengan auto-redirect ke halaman login.

**Tanggal:** 11 November 2025  
**Status:** ✅ FIXED

---

## 🐛 Masalah

### Error yang Terjadi:
```
PUT /api/auth/profile 401 :: {"error":"Invalid token"}
```

### Penyebab:
1. **Token Expired** - Token JWT sudah kadaluarsa (> 7 hari)
2. **Token Invalid** - Token tidak valid setelah server restart dengan SESSION_SECRET berbeda
3. **No Auto-Redirect** - User tidak otomatis diarahkan ke login saat token invalid

### Dampak:
- User tidak bisa simpan profil
- User tidak bisa upload foto profil
- Error message tidak jelas
- User bingung harus apa

---

## ✅ Perbaikan yang Dilakukan

### 1. **Auto-Redirect pada 401**

**File:** `client/src/pages/profile.tsx`

#### A. Update Profile Mutation
```typescript
const updateProfileMutation = useMutation({
  mutationFn: async (data: typeof formData) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // ✅ Clear token and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }
    return response.json();
  },
  // ...
});
```

#### B. Upload Photo Mutation
```typescript
const uploadPhotoMutation = useMutation({
  mutationFn: async (file: File) => {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch('/api/auth/profile/photo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // ✅ Clear token and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload photo');
    }
    return response.json();
  },
  // ...
});
```

#### C. Fetch User Query
```typescript
const { data: user, isLoading } = useQuery<UserProfile>({
  queryKey: ["/api/auth/me"],
  queryFn: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // ✅ Clear token and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  },
});
```

---

## 🔄 Flow Perbaikan

### Before (❌):
```
1. User buka halaman profil
2. Token invalid
3. API return 401
4. Error: "Invalid token"
5. User bingung
6. Tidak ada action
```

### After (✅):
```
1. User buka halaman profil
2. Token invalid
3. API return 401
4. Auto clear token
5. Auto redirect ke /login
6. User login ulang
7. Token baru valid
8. Profil bisa disimpan ✅
```

---

## 🎯 Skenario Penggunaan

### Skenario 1: Token Expired
```
1. User sudah login > 7 hari yang lalu
2. Token JWT expired
3. User buka halaman profil
4. Auto redirect ke login
5. User login ulang
6. Token baru di-generate
7. Profil bisa diakses
```

### Skenario 2: Server Restart
```
1. Server restart dengan SESSION_SECRET baru
2. Token lama jadi invalid
3. User coba simpan profil
4. Auto redirect ke login
5. User login ulang
6. Token baru valid
7. Profil bisa disimpan
```

### Skenario 3: Manual Logout
```
1. User logout
2. Token dihapus dari localStorage
3. User coba akses profil (via URL)
4. Auto redirect ke login
5. User harus login dulu
```

---

## 🧪 Testing

### Test Invalid Token:

```
1. Login ke aplikasi
2. Buka Developer Tools (F12)
3. Console tab
4. Jalankan: localStorage.setItem('auth_token', 'invalid-token')
5. Refresh halaman profil
6. Verifikasi:
   ✅ Auto redirect ke /login
   ✅ Token dihapus dari localStorage
   ✅ Tidak ada error di console
```

### Test Expired Token:

```
1. Login ke aplikasi
2. Tunggu token expire (atau ubah expiry di code)
3. Coba simpan profil
4. Verifikasi:
   ✅ Auto redirect ke /login
   ✅ Message: "Sesi Anda telah berakhir"
   ✅ Token dihapus
```

### Test Normal Flow:

```
1. Login dengan token valid
2. Buka halaman profil
3. Ubah data profil
4. Klik "Simpan Profil"
5. Verifikasi:
   ✅ Data tersimpan
   ✅ Toast: "Berhasil"
   ✅ Tidak ada redirect
```

---

## 📊 Error Handling

### HTTP Status Codes:

| Status | Action | Message |
|--------|--------|---------|
| 200 | Success | "Profil berhasil diperbarui" |
| 401 | Redirect to login | "Sesi Anda telah berakhir" |
| 400 | Show error | Error message from server |
| 500 | Show error | "Terjadi kesalahan server" |

### User Experience:

#### Before (❌):
- Error: "Invalid token"
- User tidak tahu harus apa
- Harus manual logout
- Harus manual login

#### After (✅):
- Auto redirect ke login
- Message jelas: "Sesi Anda telah berakhir"
- Token otomatis dihapus
- User tinggal login ulang

---

## 🔐 Security Benefits

### 1. **Auto Token Cleanup**
- Token invalid otomatis dihapus
- Tidak ada token sampah di localStorage
- Security lebih baik

### 2. **Clear User Feedback**
- Message yang jelas
- User tahu harus login ulang
- Tidak ada confusion

### 3. **Consistent Behavior**
- Semua endpoint handle 401 sama
- Predictable user experience
- Easy to maintain

---

## 💡 Best Practices

### Token Management:

```typescript
// ✅ Good: Check 401 and redirect
if (response.status === 401) {
  localStorage.removeItem('auth_token');
  window.location.href = '/login';
  throw new Error('Sesi Anda telah berakhir');
}

// ❌ Bad: Just throw error
if (!response.ok) {
  throw new Error('Failed');
}
```

### Error Messages:

```typescript
// ✅ Good: User-friendly message
throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');

// ❌ Bad: Technical message
throw new Error('Invalid token');
```

---

## 🔄 Consistency

Perbaikan ini konsisten dengan error handling di `client/src/lib/api.ts`:

```typescript
async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      throw new Error('Silakan login terlebih dahulu');
    }
    // ...
  }
  return response.json();
}
```

Sekarang semua endpoint (tasks, supervisions, profile, dll) handle 401 dengan cara yang sama.

---

## 📝 Catatan Penting

### Token Expiry:
- **Default:** 7 hari
- **Configurable:** Di `server/auth.ts`
- **Recommendation:** 7 hari untuk user experience

### Session Secret:
- **Location:** `.env` file
- **Key:** `SESSION_SECRET`
- **Important:** Jangan ganti di production (akan invalidate semua token)

### localStorage:
- **Key:** `auth_token`
- **Value:** JWT token string
- **Cleared on:** Logout, 401 error, manual clear

---

## ✅ Checklist Perbaikan

- [x] Add 401 check in updateProfileMutation
- [x] Add 401 check in uploadPhotoMutation
- [x] Add 401 check in user query
- [x] Clear token on 401
- [x] Redirect to login on 401
- [x] User-friendly error message
- [x] Test invalid token
- [x] Test expired token
- [x] Test normal flow
- [x] Documentation

---

## 🎉 Summary

Masalah "Invalid token" pada simpan profil telah diperbaiki dengan:

✅ **Auto-redirect** ke login saat token invalid  
✅ **Auto-clear** token dari localStorage  
✅ **User-friendly message** yang jelas  
✅ **Consistent behavior** di semua endpoint  
✅ **Better security** dengan token cleanup  
✅ **Better UX** dengan auto-redirect  

**User sekarang tidak perlu bingung lagi saat token invalid!** 🔐✨

---

## 🚀 Cara Menggunakan

### Jika Muncul Error "Invalid Token":

1. **Jangan panik!** ✅
2. **Aplikasi akan auto-redirect** ke halaman login
3. **Login ulang** dengan username dan password
4. **Token baru** akan di-generate
5. **Profil bisa disimpan** dengan normal

### Jika Ingin Logout Manual:

1. Klik tombol "Keluar" di sidebar
2. Token akan dihapus
3. Redirect ke login
4. Login ulang kapan saja

---

**Last Updated:** 11 November 2025  
**Status:** ✅ FIXED & TESTED
