# Fix: Halaman Login Tidak Bisa Diakses

## 🚨 Masalah
Halaman login tidak dapat diakses atau tidak muncul.

## 🔧 Solusi Cepat

### 1. Restart Development Server
```bash
# Stop server (Ctrl+C di terminal)
# Kemudian jalankan ulang:
npm run dev
# atau
yarn dev
```

### 2. Periksa Port dan URL
```bash
# Lihat output terminal saat menjalankan npm run dev
# Biasanya menunjukkan:
# Local:   http://localhost:5173/
# Network: http://192.168.x.x:5173/

# Akses login dengan URL lengkap:
http://localhost:5173/login
```

### 3. Clear Browser Cache
```
# Hard refresh
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Atau buka Incognito/Private browsing
Ctrl + Shift + N
```

### 4. Clear localStorage
```javascript
// Buka F12 -> Console, jalankan:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## 🔍 Diagnosis Masalah

### Periksa Console Browser
```
1. Buka F12 (Developer Tools)
2. Lihat tab Console
3. Cari error merah
4. Lihat tab Network untuk failed requests
```

### Periksa Development Server
```bash
# Pastikan server berjalan tanpa error
# Output normal terlihat seperti:
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Test Manual Navigation
```javascript
// Di browser console:
window.location.href = '/login';

// Atau:
history.pushState({}, '', '/login');
window.location.reload();
```

## 🛠️ Solusi Berdasarkan Error

### Error: "Cannot GET /login"
**Penyebab:** Development server tidak berjalan atau routing tidak dikonfigurasi

**Solusi:**
```bash
# 1. Pastikan server berjalan
npm run dev

# 2. Periksa vite.config.ts
# Pastikan ada konfigurasi history mode
```

### Error: Halaman Blank/Kosong
**Penyebab:** JavaScript error atau komponen tidak ter-load

**Solusi:**
```bash
# 1. Periksa console untuk error
F12 -> Console

# 2. Periksa apakah semua dependencies ter-install
npm install

# 3. Clear node_modules jika perlu
rm -rf node_modules
npm install
```

### Error: "Module not found"
**Penyebab:** Import path salah atau dependency hilang

**Solusi:**
```bash
# Install dependencies yang hilang
npm install @radix-ui/react-tabs
npm install lucide-react
npm install wouter

# Atau install semua:
npm install
```

### Error: TypeScript errors
**Penyebab:** Type errors yang memblokir build

**Solusi:**
```bash
# Periksa dan fix TypeScript errors
npm run type-check

# Atau bypass sementara dengan:
# @ts-ignore
```

## 🎯 Test Akses Login

### Manual Test
1. **Buka browser baru/incognito**
2. **Akses:** `http://localhost:5173/login`
3. **Verifikasi:** Halaman login dengan logo Disdik Jabar muncul
4. **Test login:** Username `admin`, Password `admin123`

### Automated Test
```javascript
// Jalankan di browser console
fetch('/login')
  .then(response => {
    console.log('Login page status:', response.status);
    if (response.status === 200) {
      console.log('✅ Login page accessible');
    } else {
      console.log('❌ Login page not accessible');
    }
  })
  .catch(error => {
    console.log('❌ Network error:', error);
  });
```

## 🔄 Reset Lengkap

Jika semua solusi di atas tidak berhasil:

### 1. Reset Project
```bash
# Stop server
Ctrl+C

# Clear cache
rm -rf node_modules
rm -rf dist
rm -rf .vite

# Reinstall
npm install

# Restart
npm run dev
```

### 2. Reset Browser
```bash
# Clear all browser data
F12 -> Application -> Storage -> Clear Storage

# Atau gunakan browser baru/incognito
```

### 3. Check File Integrity
```bash
# Pastikan file login.tsx ada dan tidak corrupt
ls -la client/src/pages/login.tsx

# Pastikan App.tsx ada routing untuk login
grep -n "login" client/src/App.tsx
```

## 📋 Checklist Verifikasi

Pastikan semua ini ✅:

- [ ] Development server berjalan (`npm run dev`)
- [ ] Tidak ada error di terminal
- [ ] Browser mengakses port yang benar (5173)
- [ ] Tidak ada error di browser console (F12)
- [ ] File `client/src/pages/login.tsx` ada
- [ ] File `client/src/App.tsx` ada routing `/login`
- [ ] localStorage bersih (tidak ada token lama)
- [ ] Browser cache sudah di-clear

## 🎉 Verifikasi Sukses

Login berhasil diakses jika:

1. ✅ URL `/login` menampilkan halaman login
2. ✅ Logo Disdik Jabar muncul di atas form
3. ✅ Ada 2 tab: "Masuk" dan "Daftar"
4. ✅ Form login memiliki field username dan password
5. ✅ Tombol "Masuk" berfungsi
6. ✅ Login dengan `admin`/`admin123` berhasil redirect ke dashboard

## 🆘 Bantuan Darurat

### Quick Fix HTML
Jika React app tidak bisa diakses sama sekali, buat file `login.html` sementara:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Login - Disdik Jabar</title>
</head>
<body>
    <h1>Login Sementara</h1>
    <form onsubmit="handleLogin(event)">
        <input type="text" id="username" placeholder="Username" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
    
    <script>
        function handleLogin(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if ((username === 'admin' && password === 'admin123') ||
                (username === 'wawan' && password === 'wawan123')) {
                localStorage.setItem('auth_token', 'temp-token');
                localStorage.setItem('user_data', JSON.stringify({
                    username: username,
                    role: username === 'admin' ? 'admin' : 'pengawas'
                }));
                window.location.href = '/';
            } else {
                alert('Username atau password salah');
            }
        }
    </script>
</body>
</html>
```

### Contact Support
Jika masalah masih berlanjut:
1. Screenshot error di console
2. Copy output terminal
3. Cek versi Node.js: `node --version`
4. Cek versi npm: `npm --version`

## 🔗 File Test
Gunakan file `TEST_LOGIN_AKSES.html` untuk diagnosis otomatis.