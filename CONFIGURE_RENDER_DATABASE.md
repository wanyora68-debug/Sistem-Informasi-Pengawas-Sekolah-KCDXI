# ⚙️ Configure Database di Render - Panduan Visual

## Prerequisites

✅ Anda sudah punya **Connection String** dari Neon
   
Contoh:
```
postgresql://neondb_owner:npg_abc123xyz@ep-cool-morning-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Step 1: Buka Render Dashboard

1. **Buka Browser** dan kunjungi:
   ```
   https://dashboard.render.com
   ```

2. **Login** dengan account Anda

3. **Cari service "pengawas-sekolah"** di dashboard

4. **Klik** pada service tersebut

## Step 2: Add Environment Variable

Setelah masuk ke halaman service:

1. **Klik tab "Environment"** di menu sebelah kiri
   - Atau scroll ke section "Environment Variables"

2. **Klik tombol "Add Environment Variable"**

3. **Isi Form:**
   - **Key:** `DATABASE_URL`
   - **Value:** (paste connection string dari Neon)
   
   Contoh value:
   ```
   postgresql://neondb_owner:npg_abc123xyz@ep-cool-morning-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

4. **Klik "Save Changes"** atau "Add"

## Step 3: Tunggu Auto-Redeploy

Setelah save:

1. **Render akan otomatis redeploy** service Anda

2. **Monitor di tab "Logs"** atau "Events"

3. **Tunggu ~3-5 menit** sampai deploy selesai

4. **Cari log:**
   ```
   ✓ Server running on port 10000
   ```

## Step 4: Verify

Setelah deploy selesai:

1. **Buka URL production:**
   ```
   https://pengawas-sekolah.onrender.com
   ```

2. **Coba login** dengan:
   - Username: `admin`
   - Password: `admin123`

3. **Jika berhasil login** → Database sudah terkoneksi! ✅

## ⚠️ Troubleshooting

### Error: "Database connection failed"

**Cek:**
1. Connection string benar (tidak ada spasi extra)
2. Password tidak ada karakter special yang perlu di-encode
3. Database di Neon masih aktif

### Error: "Invalid credentials"

**Normal!** Database masih kosong, belum ada data user.

**Next step:** Migrate data dari localhost

## ✅ Checklist

- [ ] DATABASE_URL sudah ditambahkan di Render
- [ ] Render sudah redeploy
- [ ] Service running (cek logs)
- [ ] URL production bisa diakses

## 🎯 Next Step

Setelah database terkoneksi, lanjut ke:
**RUN_MIGRATION.md**

---

**Butuh bantuan? Screenshot error yang muncul!** 📸
