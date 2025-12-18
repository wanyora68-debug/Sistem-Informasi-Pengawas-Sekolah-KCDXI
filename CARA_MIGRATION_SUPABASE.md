# 🚀 Cara Migration ke Supabase

## 📋 Langkah-langkah Migration

### Step 1: Update File .env

1. **Buka file `.env`** di project
2. **Ganti `[PASSWORD-ANDA]`** dengan password Supabase yang Bapak buat
3. **Simpan file**

Contoh:
```bash
# Dari:
SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD-ANDA]@db.mweboullgcewzjpql.supabase.co:5432/postgres

# Menjadi (contoh):
SUPABASE_DATABASE_URL=postgresql://postgres:MyPassword123@db.mweboullgcewzjpql.supabase.co:5432/postgres
```

### Step 2: Jalankan Migration Script

Buka terminal di folder project, lalu jalankan:

```bash
node migrate-to-supabase.js
```

### Step 3: Tunggu Proses Selesai

Script akan otomatis:
- ✅ Test koneksi ke Neon dan Supabase
- ✅ Backup data dari Neon
- ✅ Migrate semua data ke Supabase
- ✅ Verifikasi jumlah data

### Step 4: Update DATABASE_URL

Setelah migration berhasil, edit file `.env`:

```bash
# Ganti DATABASE_URL ke Supabase
DATABASE_URL=postgresql://postgres:[PASSWORD-ANDA]@db.mweboullgcewzjpql.supabase.co:5432/postgres

# Backup Neon URL (untuk rollback jika perlu)
# DATABASE_URL_NEON=postgresql://neondb_owner:npg_UECqsl5kG7MP@ep-frosty-grass-a42zb4yz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

JWT_SECRET=schoolguard-secret-key-2024
SESSION_SECRET=schoolguard-secret-key-2024
NODE_ENV=development
```

### Step 5: Test Aplikasi

```bash
# Build aplikasi
npm run build

# Jalankan server
npm run dev

# Buka browser: http://localhost:5000
# Login dengan akun yang ada
# Test semua fitur
```

---

## 🆘 Troubleshooting

### Error: "Cannot find module 'postgres'"
```bash
npm install postgres
```

### Error: "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### Error: Connection timeout
- Cek internet connection
- Pastikan password Supabase benar
- Cek firewall/antivirus

### Error: "Please replace [PASSWORD-ANDA]"
- Buka file `.env`
- Ganti `[PASSWORD-ANDA]` dengan password Supabase yang sebenarnya
- Simpan file dan jalankan ulang

---

## ✅ Checklist

- [ ] File `.env` sudah diupdate dengan password Supabase
- [ ] Migration script berhasil dijalankan
- [ ] Backup data tersimpan di folder `backups/`
- [ ] DATABASE_URL sudah diganti ke Supabase
- [ ] Aplikasi berhasil ditest di localhost
- [ ] Semua fitur berfungsi normal

---

## 🎯 Setelah Migration Berhasil

Aplikasi sekarang menggunakan Supabase sebagai database!

**Next Steps:**
1. Deploy ke Vercel (akan saya bantu)
2. Test di production
3. Monitor performance

**Render + Neon tetap aktif sebagai backup sampai Bapak yakin Vercel + Supabase stabil!**