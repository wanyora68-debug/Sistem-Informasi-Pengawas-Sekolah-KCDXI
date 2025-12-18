# 🔄 Panduan Migration Manual: Neon → Supabase

## 📋 Step-by-Step Migration

### Step 1: Dapatkan Connection String Supabase

1. **Di dashboard Supabase**, klik **"Settings"** di sidebar kiri
2. **Pilih "Database"**
3. **Scroll ke bawah** sampai menemukan **"Connection string"**
4. **Pilih tab "URI"**
5. **Copy connection string** (akan seperti ini):
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 2: Update File .env

1. **Buka file `.env`** di project Anda
2. **Backup DATABASE_URL yang lama** (Neon):
   ```bash
   # Backup Neon URL (jangan hapus dulu)
   # DATABASE_URL_NEON=postgresql://[neon-connection-string]
   ```
3. **Tambahkan Supabase URL**:
   ```bash
   # Current Neon Database (source)
   DATABASE_URL=postgresql://[neon-connection-string]
   
   # New Supabase Database (destination)
   SUPABASE_DATABASE_URL=postgresql://[supabase-connection-string]
   
   # JWT Secret (tetap sama)
   JWT_SECRET=your-jwt-secret-key
   
   # Node Environment
   NODE_ENV=development
   ```

### Step 3: Install Dependencies (jika belum)

```bash
npm install dotenv postgres drizzle-orm
```

### Step 4: Jalankan Migration Script

```bash
# Jalankan migration
node scripts/migrate-to-supabase-simple.js
```

### Step 5: Verifikasi Migration

Script akan otomatis:
- ✅ Test koneksi ke kedua database
- ✅ Backup data dari Neon
- ✅ Migrate data ke Supabase
- ✅ Verifikasi jumlah data

### Step 6: Update DATABASE_URL

Setelah migration berhasil:

1. **Edit file `.env`**:
   ```bash
   # Ganti DATABASE_URL ke Supabase
   DATABASE_URL=postgresql://[supabase-connection-string]
   
   # Backup Neon (untuk rollback jika perlu)
   # DATABASE_URL_NEON=postgresql://[neon-connection-string]
   
   JWT_SECRET=your-jwt-secret-key
   NODE_ENV=development
   ```

### Step 7: Test Aplikasi

```bash
# Build aplikasi
npm run build

# Jalankan server
npm run dev

# Test di browser: http://localhost:5000
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
- Pastikan connection string benar
- Cek firewall/antivirus

### Error: "relation does not exist"
- Pastikan schema Supabase sudah dibuat
- Jalankan ulang setup-supabase-schema.sql

---

## 📞 Bantuan

Jika ada error atau masalah:
1. Screenshot error message
2. Cek log di terminal
3. Pastikan kedua database bisa diakses

**Setelah migration berhasil, aplikasi akan menggunakan Supabase sebagai database utama!**