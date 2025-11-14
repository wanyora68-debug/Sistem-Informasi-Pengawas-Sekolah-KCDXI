# 🚀 Quick Start - Setup Database (5 Menit)

## ✅ Langkah 1: Buat Database di Neon

Browser sudah terbuka ke https://neon.tech

1. **Sign Up** → Pilih "Continue with GitHub" atau "Continue with Google"
2. **Create Project** → Klik tombol hijau "Create Project"
3. **Project Name**: Ketik "SchoolGuardManager"
4. **Region**: Pilih "AWS US East (N. Virginia)" atau terdekat
5. **Klik "Create Project"** → Tunggu 10 detik

## ✅ Langkah 2: Copy Connection String

Setelah project dibuat, Anda akan melihat halaman dengan **Connection String**.

Cari bagian yang bertuliskan:
```
Connection string
postgresql://...
```

**COPY** seluruh string tersebut (klik icon copy di sebelahnya)

Contoh connection string:
```
postgresql://neondb_owner:AbC123XyZ@ep-cool-morning-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## ✅ Langkah 3: Paste Connection String

Sekarang ada 2 cara:

### Cara A: Menggunakan Script (Mudah)
1. Buka terminal/PowerShell di folder project
2. Jalankan: `.\setup-database.ps1`
3. Ketik `y` dan Enter
4. Paste connection string yang sudah di-copy
5. Ketik `y` untuk menjalankan db:push
6. Selesai!

### Cara B: Manual
1. Buka file `.env` di root project
2. Cari baris yang dimulai dengan `DATABASE_URL=`
3. Ganti dengan connection string dari Neon
4. Save file
5. Buka terminal dan jalankan: `npm run db:push`
6. Restart server: `npm run dev`

## ✅ Langkah 4: Verifikasi

Setelah restart server, cek console. Anda akan melihat:
```
✓ Admin user created
[express] serving on port 5000
```

**TIDAK ADA** lagi warning "DATABASE_URL is not properly configured"

## 🎉 Selesai!

Sekarang:
- ✅ Database sudah terkonfigurasi
- ✅ Registrasi berfungsi
- ✅ Data tersimpan permanen
- ✅ Login dengan admin/admin

## 📝 Catatan

**Connection String Anda RAHASIA!** Jangan share ke orang lain.

Jika lupa connection string:
1. Login ke https://console.neon.tech
2. Pilih project "SchoolGuardManager"
3. Klik "Connection Details"
4. Copy connection string lagi

## ❓ Butuh Bantuan?

Jika ada error, cek file `SETUP_DATABASE.md` untuk troubleshooting.
