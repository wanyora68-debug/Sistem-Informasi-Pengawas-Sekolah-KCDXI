# Script untuk melihat daftar user di local-database.json

$dbFile = "local-database.json"

# Check if file exists
if (-not (Test-Path $dbFile)) {
    Write-Host "Error: File $dbFile tidak ditemukan!" -ForegroundColor Red
    exit 1
}

# Read database
$data = Get-Content $dbFile -Raw | ConvertFrom-Json

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DAFTAR USER TERDAFTAR" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($data.users.Count -eq 0) {
    Write-Host "Tidak ada user terdaftar." -ForegroundColor Yellow
    exit 0
}

Write-Host "Total user: $($data.users.Count)`n" -ForegroundColor Green

# Display users in table format
$data.users | ForEach-Object {
    Write-Host "Username    : $($_.username)" -ForegroundColor White
    Write-Host "Nama Lengkap: $($_.fullName)" -ForegroundColor White
    Write-Host "Role        : $($_.role)" -ForegroundColor White
    Write-Host "ID          : $($_.id)" -ForegroundColor Gray
    Write-Host "Dibuat      : $($_.createdAt)" -ForegroundColor Gray
    
    if ($_.nip) {
        Write-Host "NIP         : $($_.nip)" -ForegroundColor White
    }
    if ($_.rank) {
        Write-Host "Pangkat     : $($_.rank)" -ForegroundColor White
    }
    if ($_.photoUrl) {
        Write-Host "Foto        : $($_.photoUrl)" -ForegroundColor White
    }
    
    Write-Host "----------------------------------------" -ForegroundColor Gray
}

Write-Host "`nCara menghapus user:" -ForegroundColor Yellow
Write-Host "  .\delete-user.ps1 -username ""nama_user""" -ForegroundColor Cyan
Write-Host ""
