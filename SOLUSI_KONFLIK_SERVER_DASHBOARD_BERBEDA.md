# 🚨 Solusi Konflik Server - Dashboard Berbeda

## 🎯 Root Cause Masalah

**Masalah:** Halaman dashboard berbeda tiap server memiliki halaman yang berbeda

**Penyebab:**
1. **Multiple Server Instances** - Ada beberapa `npm run dev` berjalan bersamaan
2. **Port Conflict** - Beberapa server menggunakan port 5000 yang sama
3. **Background Processes** - Server lama masih berjalan di background
4. **Cache/Session Mismatch** - Setiap server instance memiliki data berbeda

## 🔍 Cara Diagnosa

### 1. Check Port Usage
```powershell
netstat -ano | findstr :5000
```

### 2. Check Node.js Processes
```powershell
Get-Process -Name "node"
```

### 3. Check Specific PID
```powershell
tasklist | findstr [PID_NUMBER]
```

## ✅ Solusi Langsung

### Opsi 1: Gunakan Script Otomatis
1. **Jalankan script PowerShell:**
   ```powershell
   .\fix-server-conflict.ps1
   ```

### Opsi 2: Manual Commands

#### Step 1: Kill All Node Processes
```powershell
# Kill semua proses Node.js
taskkill /f /im node.exe

# Atau gunakan PowerShell
Stop-Process -Name "node" -Force
```

#### Step 2: Verify Port is Free
```powershell
netstat -ano | findstr :5000
```
*Seharusnya tidak ada output*

#### Step 3: Start Clean Server
```powershell
npm run dev
```

### Opsi 3: Kill Specific Process
```powershell
# 1. Find PID using port 5000
netstat -ano | findstr :5000

# 2. Kill specific PID
taskkill /f /pid [PID_NUMBER]
```

## 🛡️ Pencegahan

### 1. Always Check Before Starting
```powershell
# Check sebelum menjalankan npm run dev
netstat -ano | findstr :5000
```

### 2. Use Different Ports
```json
// package.json - modify dev script
"scripts": {
  "dev": "tsx server/index.ts --port 5001"
}
```

### 3. Proper Server Shutdown
- Gunakan `Ctrl+C` untuk stop server dengan benar
- Jangan tutup terminal secara paksa

## 🔧 Tools yang Tersedia

1. **DIAGNOSA_KONFLIK_SERVER_MULTIPLE.html** - Web-based diagnosis tool
2. **fix-server-conflict.ps1** - PowerShell script otomatis
3. **Manual commands** - Command line solutions

## 📊 Expected Results

Setelah menjalankan solusi:

1. ✅ **Hanya satu server instance** yang berjalan
2. ✅ **Port 5000 hanya digunakan satu proses**
3. ✅ **Dashboard konsisten** di semua akses
4. ✅ **Data/session unified** - tidak ada perbedaan halaman

## 🎯 Verification

### 1. Check Single Process
```powershell
netstat -ano | findstr :5000
# Should show only ONE process
```

### 2. Test Dashboard Consistency
- Buka `http://localhost:5000` di beberapa tab
- Semua tab harus menampilkan dashboard yang sama
- Data harus konsisten

### 3. Check Server Logs
```
[express] serving on port 5000
✅ Only one instance should be running
```

## ⚠️ Common Mistakes

1. **Multiple Terminal Windows** - Menjalankan `npm run dev` di beberapa terminal
2. **Background Processes** - Server lama tidak di-terminate dengan benar
3. **IDE Integration** - Some IDEs auto-start development servers
4. **Process Persistence** - Node processes sometimes persist after terminal close

## 🚀 Best Practices

1. **One Server Rule** - Hanya jalankan satu development server
2. **Proper Shutdown** - Selalu gunakan `Ctrl+C` untuk stop server
3. **Check Before Start** - Selalu check port sebelum start server baru
4. **Use Process Managers** - Consider using PM2 for production

---

## 🎉 Kesimpulan

Masalah "dashboard berbeda tiap server" disebabkan oleh **multiple server instances** yang berjalan bersamaan. Solusi utama adalah **kill all Node processes** dan **start clean server instance**.

**Quick Fix:**
```powershell
taskkill /f /im node.exe && npm run dev
```