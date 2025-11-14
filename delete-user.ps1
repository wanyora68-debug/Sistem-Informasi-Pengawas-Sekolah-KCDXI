# Script untuk menghapus user dari local-database.json
# Cara menggunakan: .\delete-user.ps1 -username "nama_user"

param(
    [Parameter(Mandatory=$true)]
    [string]$username
)

$dbFile = "local-database.json"

# Check if file exists
if (-not (Test-Path $dbFile)) {
    Write-Host "Error: File $dbFile tidak ditemukan!" -ForegroundColor Red
    exit 1
}

# Read database
$data = Get-Content $dbFile -Raw | ConvertFrom-Json

# Find user
$userToDelete = $data.users | Where-Object { $_.username -eq $username }

if (-not $userToDelete) {
    Write-Host "Error: User '$username' tidak ditemukan!" -ForegroundColor Red
    Write-Host "`nDaftar user yang tersedia:" -ForegroundColor Yellow
    $data.users | ForEach-Object { Write-Host "  - $($_.username) ($($_.fullName))" }
    exit 1
}

# Show user info
Write-Host "`nUser yang akan dihapus:" -ForegroundColor Yellow
Write-Host "  Username: $($userToDelete.username)"
Write-Host "  Nama: $($userToDelete.fullName)"
Write-Host "  ID: $($userToDelete.id)"

# Confirm deletion
$confirm = Read-Host "`nApakah Anda yakin ingin menghapus user ini? (y/n)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Penghapusan dibatalkan." -ForegroundColor Yellow
    exit 0
}

# Backup original file
$backupFile = "local-database.backup.json"
Copy-Item $dbFile $backupFile
Write-Host "`nBackup dibuat: $backupFile" -ForegroundColor Green

# Remove user
$data.users = $data.users | Where-Object { $_.username -ne $username }

# Save to file
$data | ConvertTo-Json -Depth 10 | Set-Content $dbFile

Write-Host "User '$username' berhasil dihapus!" -ForegroundColor Green
Write-Host "Total user sekarang: $($data.users.Count)" -ForegroundColor Cyan

# Show remaining users
Write-Host "`nDaftar user yang tersisa:" -ForegroundColor Cyan
$data.users | ForEach-Object { Write-Host "  - $($_.username) ($($_.fullName))" }

Write-Host "`nCatatan: Restart server untuk menerapkan perubahan." -ForegroundColor Yellow
