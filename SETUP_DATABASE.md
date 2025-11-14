# Setup Database untuk SchoolGuardManager

## Langkah 1: Buat Database di Neon

1. Buka https://neon.tech
2. Sign up dengan GitHub atau Google
3. Klik "Create Project"
4. Nama project: SchoolGuardManager
5. Region: AWS US East (atau terdekat)
6. Klik "Create Project"

## Langkah 2: Copy Connection String

Setelah database dibuat, copy connection string yang muncul.
Format: `postgresql://username:password@host/database?sslmode=require`

## Langkah 3: Update File .env

1. Buka file `.env` di root project
2. Ganti baris DATABASE_URL dengan connection string dari Neon
3. Save file

Contoh:
```
DATABASE_URL=postgresql://alex:AbC123xyz@ep-cool-morning-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Langkah 4: Push Schema ke Database

Jalankan command berikut di terminal:

```bash
npm run db:push
```

Command ini akan membuat semua tabel yang diperlukan di database.

## Langkah 5: Restart Server

Setelah database dikonfigurasi, restart server:

1. Stop server yang sedang berjalan (Ctrl+C)
2. Jalankan lagi: `npm run dev`

## Verifikasi

Jika berhasil, Anda akan melihat di console:
```
✓ Admin user created
[express] serving on port 5000
```

Tidak ada lagi warning "DATABASE_URL is not properly configured"

## Login

Setelah database dikonfigurasi:
- Username: admin
- Password: admin

Sekarang data akan tersimpan di database!

## Troubleshooting

### Error: "password authentication failed"
- Pastikan connection string sudah benar
- Copy ulang dari Neon dashboard
- Pastikan tidak ada spasi di awal/akhir

### Error: "relation does not exist"
- Jalankan: `npm run db:push`
- Restart server

### Masih pakai fallback mode
- Cek file .env sudah di-save
- Restart server
- Pastikan connection string tidak mengandung "user:password" atau "ep-example"
