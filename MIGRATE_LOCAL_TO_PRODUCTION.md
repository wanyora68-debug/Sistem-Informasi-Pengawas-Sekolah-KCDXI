# 🔄 Migrate Data dari Localhost ke Production

## 📊 Data yang Perlu Dimigrate

Dari `local-database.json` Anda memiliki:
- ✅ **5 Users** (admin, wawan, Undang, yenihandayani, Dede66)
- ✅ **17 Schools** (sekolah binaan)
- ✅ **1 Task** (Input Data Sekolah Binaan)
- ✅ **1 Supervision** (SMKS PLUS SUKARAJA)
- ✅ **3 Additional Tasks** (Apel Pagi, Silaturahmi, Pisah sambut)
- ✅ **2 Events** (Input data, Monitoring KBM)

## 🎯 Langkah-Langkah Migration

### Step 1: Setup Database Production (Pilih Salah Satu)

#### Option A: Neon (Recommended - Gratis)

1. **Buat Account:**
   - Buka: https://neon.tech
   - Sign up dengan GitHub/Google
   - Gratis 0.5 GB storage

2. **Buat Database:**
   - Klik "Create Project"
   - Nama: `pengawas-sekolah`
   - Region: Singapore (terdekat)
   - Klik "Create Project"

3. **Copy Connection String:**
   ```
   postgresql://username:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
   ```

#### Option B: Supabase (Alternative - Gratis)

1. **Buat Account:**
   - Buka: https://supabase.com
   - Sign up dengan GitHub/Google
   - Gratis 500 MB storage

2. **Buat Project:**
   - Klik "New Project"
   - Nama: `pengawas-sekolah`
   - Password: (buat password kuat)
   - Region: Singapore
   - Klik "Create Project"

3. **Copy Connection String:**
   - Settings → Database → Connection String
   - Mode: "Transaction"
   - Copy connection string

### Step 2: Setup Database di Render

1. **Buka Render Dashboard:**
   - https://dashboard.render.com
   - Pilih service "pengawas-sekolah"

2. **Add Environment Variable:**
   - Klik "Environment"
   - Klik "Add Environment Variable"
   - Key: `DATABASE_URL`
   - Value: (paste connection string dari Neon/Supabase)
   - Klik "Save Changes"

3. **Redeploy:**
   - Render akan auto-redeploy
   - Tunggu ~3-5 menit

### Step 3: Push Database Schema

Setelah DATABASE_URL dikonfigurasi, push schema ke database:

```bash
# Di localhost
npm run db:push
```

Ini akan membuat semua tabel yang diperlukan di database production.

### Step 4: Migrate Data

Saya akan buat script untuk migrate data dari `local-database.json` ke database production.

**Script akan:**
1. ✅ Baca data dari local-database.json
2. ✅ Connect ke database production
3. ✅ Insert semua users (dengan password yang sama)
4. ✅ Insert semua schools
5. ✅ Insert semua tasks
6. ✅ Insert semua supervisions
7. ✅ Insert semua additional tasks
8. ✅ Insert semua events
9. ✅ Handle foto (convert ke base64 jika ada)

## ⚠️ Catatan Penting

### Foto Profil & Dokumentasi:

**Masalah:**
- Foto di local-database.json masih path ke folder `uploads/`
- Contoh: `/uploads/1762984516465-513200650.jpg`
- File fisik ada di folder `uploads/` localhost

**Solusi:**
Ada 2 opsi:

**Option A: Upload Ulang Foto (Recommended)**
- Setelah migration, upload ulang foto profil
- Upload ulang foto dokumentasi
- Foto akan tersimpan sebagai base64 di database

**Option B: Convert Foto Existing ke Base64**
- Script akan otomatis convert foto yang ada
- Baca file dari folder `uploads/`
- Convert ke base64
- Simpan ke database

### Password Users:

- Password sudah di-hash dengan bcrypt
- Akan di-copy langsung ke database production
- User bisa login dengan password yang sama

### User IDs:

- ID akan tetap sama (untuk maintain relationships)
- schoolId, userId, dll akan konsisten

## 🚀 Eksekusi Migration

Setelah database setup selesai, jalankan:

```bash
# Di localhost
npm run migrate:local-to-prod
```

Script akan:
1. Konfirmasi data yang akan dimigrate
2. Connect ke database production
3. Insert semua data
4. Report hasil migration

## ✅ Verifikasi

Setelah migration selesai:

1. **Buka Production URL:**
   ```
   https://pengawas-sekolah.onrender.com
   ```

2. **Login dengan User Existing:**
   - Username: `wawan`
   - Password: (password yang sama di localhost)

3. **Cek Data:**
   - ✅ Sekolah binaan muncul
   - ✅ Tasks muncul
   - ✅ Supervisions muncul
   - ✅ Additional tasks muncul
   - ✅ Events muncul

4. **Upload Foto Ulang:**
   - Foto profil
   - Foto dokumentasi (jika perlu)

## 🐛 Troubleshooting

### Error: "DATABASE_URL not configured"
- Pastikan DATABASE_URL sudah diset di Render
- Restart service di Render

### Error: "Connection refused"
- Cek connection string benar
- Cek database masih aktif
- Cek IP whitelist (Neon/Supabase)

### Data tidak muncul:
- Cek migration script berhasil
- Cek logs untuk error
- Cek userId match dengan data

## 📝 Next Steps

1. **Setup Database** (Neon/Supabase)
2. **Configure Render** (Add DATABASE_URL)
3. **Push Schema** (`npm run db:push`)
4. **Run Migration** (script yang akan saya buat)
5. **Verify Data** (login & cek)
6. **Upload Foto** (jika perlu)

Mau saya buatkan script migration-nya sekarang?
