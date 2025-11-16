# 🗄️ Setup Neon Database - Panduan Visual

## Step 1: Buat Account Neon

1. **Buka Browser** dan kunjungi:
   ```
   https://neon.tech
   ```

2. **Klik "Sign Up"** di pojok kanan atas

3. **Pilih Sign Up Method:**
   - Pilih "Continue with GitHub" (recommended)
   - Atau "Continue with Google"
   - Atau gunakan email

4. **Authorize** jika diminta

## Step 2: Create Project

Setelah login, Anda akan melihat dashboard Neon:

1. **Klik tombol "Create Project"** (tombol besar di tengah atau pojok kanan atas)

2. **Isi Form:**
   - **Project Name:** `pengawas-sekolah`
   - **Region:** Pilih `Asia Pacific (Singapore)` atau `AWS Asia Pacific (Singapore)`
   - **Postgres Version:** Biarkan default (16)
   - **Compute Size:** Biarkan default (0.25 CU)

3. **Klik "Create Project"**

4. **Tunggu ~10 detik** sampai project selesai dibuat

## Step 3: Copy Connection String

Setelah project dibuat, Anda akan melihat halaman project:

1. **Cari section "Connection Details"** atau "Connection String"

2. **Pilih "Pooled connection"** (recommended)

3. **Copy Connection String** yang terlihat seperti ini:
   ```
   postgresql://username:password@ep-cool-morning-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

4. **SIMPAN** connection string ini! Kita akan pakai di step berikutnya.

## ✅ Checklist

- [ ] Account Neon sudah dibuat
- [ ] Project "pengawas-sekolah" sudah dibuat
- [ ] Connection string sudah di-copy

## 📝 Connection String Format

Connection string akan terlihat seperti ini:
```
postgresql://[username]:[password]@[host]/[database]?sslmode=require
```

Contoh:
```
postgresql://neondb_owner:npg_abc123xyz@ep-cool-morning-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## 🎯 Next Step

Setelah dapat connection string, lanjut ke:
**CONFIGURE_RENDER_DATABASE.md**

---

**Butuh bantuan? Screenshot halaman yang Anda lihat dan tanyakan!** 📸
