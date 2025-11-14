# Script untuk menjalankan server Aplikasi Pengawas Sekolah
# Cara menggunakan: .\start-server.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  APLIKASI PENGAWAS SEKOLAH" -ForegroundColor Cyan
Write-Host "  Starting Server..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules tidak ditemukan!" -ForegroundColor Yellow
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Set environment
$env:NODE_ENV = "development"

Write-Host "🚀 Starting server..." -ForegroundColor Green
Write-Host "📍 URL: http://localhost:5000" -ForegroundColor Green
Write-Host "🔐 Login: admin / admin" -ForegroundColor Green
Write-Host "`n⏹️  Tekan Ctrl+C untuk stop server`n" -ForegroundColor Yellow

# Start server
npx tsx server/index.ts
