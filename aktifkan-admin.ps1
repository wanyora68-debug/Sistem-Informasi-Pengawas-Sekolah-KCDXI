# ⚡ Script Aktifkan Admin Langsung
# Mengatasi masalah tombol admin tidak aktif

Write-Host "⚡ AKTIFKAN ADMIN LANGSUNG" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow

# Function to check if server is running
function Test-ServerRunning {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 5 -UseBasicParsing
        return $true
    }
    catch {
        return $false
    }
}

# Check server status
Write-Host "🔍 Memeriksa status server..." -ForegroundColor Cyan
if (Test-ServerRunning) {
    Write-Host "✅ Server berjalan di localhost:5000" -ForegroundColor Green
} else {
    Write-Host "❌ Server tidak berjalan!" -ForegroundColor Red
    Write-Host "Menjalankan server..." -ForegroundColor Yellow
    
    # Start server
    Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow
    
    # Wait for server to start
    Write-Host "⏳ Menunggu server siap..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    if (Test-ServerRunning) {
        Write-Host "✅ Server berhasil dijalankan!" -ForegroundColor Green
    } else {
        Write-Host "❌ Gagal menjalankan server. Silakan jalankan manual: npm start" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🚀 SOLUSI UNTUK MENGAKTIFKAN ADMIN:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. 📁 Buka file: AKTIFKAN_ADMIN_LANGSUNG.html" -ForegroundColor Cyan
Write-Host "2. 🖱️ Klik tombol: ⚡ AKTIFKAN ADMIN SEKARANG" -ForegroundColor Cyan
Write-Host "3. 🔄 Refresh halaman Users" -ForegroundColor Cyan
Write-Host "4. ✅ Cek tombol admin sudah aktif" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 ATAU CARA MANUAL:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. Buka browser ke: http://localhost:5000" -ForegroundColor White
Write-Host "2. Tekan F12 untuk buka Console" -ForegroundColor White
Write-Host "3. Jalankan script berikut:" -ForegroundColor White

$script = @"
// Force login sebagai admin
const adminUser = {
  id: 'admin-1',
  username: 'admin',
  fullName: 'Administrator',
  role: 'admin',
  email: 'admin@disdik.jabar.go.id',
  department: 'Cabang Dinas Pendidikan Wilayah XI',
  status: 'active',
  lastLogin: new Date().toISOString()
};

localStorage.setItem('user_data', JSON.stringify(adminUser));
localStorage.setItem('auth_token', 'admin-token-' + Date.now());
location.reload();
"@

Write-Host $script -ForegroundColor Gray

Write-Host ""
Write-Host "🎯 HASIL YANG DIHARAPKAN:" -ForegroundColor Yellow
Write-Host "✅ Tombol View (👁️) aktif" -ForegroundColor Green
Write-Host "✅ Tombol Edit (✏️) aktif" -ForegroundColor Green
Write-Host "✅ Tombol Activities (📊) aktif" -ForegroundColor Green
Write-Host "✅ Tombol Reset Password (🔑) aktif" -ForegroundColor Green
Write-Host "✅ Tombol Delete (🗑️) aktif (kecuali untuk admin)" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 AKSI CEPAT:" -ForegroundColor Yellow

$choice = Read-Host "Pilih aksi: [1] Buka Helper HTML [2] Buka Halaman Users [3] Exit"

switch ($choice) {
    "1" {
        Write-Host "📁 Membuka AKTIFKAN_ADMIN_LANGSUNG.html..." -ForegroundColor Cyan
        Start-Process "AKTIFKAN_ADMIN_LANGSUNG.html"
    }
    "2" {
        Write-Host "🌐 Membuka halaman Users..." -ForegroundColor Cyan
        Start-Process "http://localhost:5000/users"
    }
    "3" {
        Write-Host "👋 Selesai!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "📁 Membuka helper HTML..." -ForegroundColor Cyan
        Start-Process "AKTIFKAN_ADMIN_LANGSUNG.html"
    }
}

Write-Host ""
Write-Host "✅ Script selesai! Ikuti instruksi di atas untuk mengaktifkan admin." -ForegroundColor Green