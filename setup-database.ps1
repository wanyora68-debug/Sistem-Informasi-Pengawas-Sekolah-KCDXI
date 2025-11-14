# Database Setup Script for SchoolGuardManager
# This script will help you configure the database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SchoolGuardManager - Database Setup  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Untuk menggunakan database, Anda perlu:" -ForegroundColor Yellow
Write-Host "1. Membuat database gratis di Neon (https://neon.tech)" -ForegroundColor White
Write-Host "2. Mendapatkan connection string" -ForegroundColor White
Write-Host "3. Memasukkan connection string ke file .env" -ForegroundColor White
Write-Host ""

Write-Host "Apakah Anda sudah memiliki connection string dari Neon? (y/n): " -ForegroundColor Green -NoNewline
$hasConnectionString = Read-Host

if ($hasConnectionString -eq "y" -or $hasConnectionString -eq "Y") {
    Write-Host ""
    Write-Host "Silakan paste connection string Anda di bawah ini:" -ForegroundColor Green
    Write-Host "(Format: postgresql://username:password@host/database?sslmode=require)" -ForegroundColor Gray
    Write-Host ""
    $connectionString = Read-Host "Connection String"
    
    if ($connectionString -match "^postgresql://") {
        # Update .env file
        $envContent = Get-Content .env -Raw
        $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=$connectionString"
        Set-Content .env -Value $envContent
        
        Write-Host ""
        Write-Host "✓ File .env berhasil diupdate!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
        Write-Host "1. Jalankan: npm run db:push" -ForegroundColor White
        Write-Host "2. Restart server" -ForegroundColor White
        Write-Host ""
        
        $runDbPush = Read-Host "Apakah Anda ingin menjalankan 'npm run db:push' sekarang? (y/n)"
        
        if ($runDbPush -eq "y" -or $runDbPush -eq "Y") {
            Write-Host ""
            Write-Host "Menjalankan database migration..." -ForegroundColor Cyan
            npm run db:push
            
            Write-Host ""
            Write-Host "✓ Database berhasil dikonfigurasi!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Silakan restart server dengan:" -ForegroundColor Yellow
            Write-Host "  npm run dev" -ForegroundColor White
            Write-Host ""
        }
    } else {
        Write-Host ""
        Write-Host "✗ Connection string tidak valid!" -ForegroundColor Red
        Write-Host "Format harus: postgresql://username:password@host/database?sslmode=require" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Silakan ikuti langkah berikut untuk membuat database:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Buka browser dan kunjungi: https://neon.tech" -ForegroundColor White
    Write-Host "2. Klik 'Sign Up' dan login dengan GitHub/Google" -ForegroundColor White
    Write-Host "3. Klik 'Create Project'" -ForegroundColor White
    Write-Host "4. Beri nama: SchoolGuardManager" -ForegroundColor White
    Write-Host "5. Pilih region terdekat (AWS US East)" -ForegroundColor White
    Write-Host "6. Klik 'Create Project'" -ForegroundColor White
    Write-Host "7. Copy connection string yang muncul" -ForegroundColor White
    Write-Host "8. Jalankan script ini lagi dan paste connection string" -ForegroundColor White
    Write-Host ""
    Write-Host "Membuka browser ke Neon.tech..." -ForegroundColor Cyan
    Start-Process "https://neon.tech"
    Write-Host ""
    Write-Host "Setelah mendapatkan connection string, jalankan script ini lagi!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Tekan Enter untuk keluar..." -ForegroundColor Gray
Read-Host
