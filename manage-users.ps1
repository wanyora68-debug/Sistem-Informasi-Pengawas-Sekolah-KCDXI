# User Management PowerShell Script
# Provides command-line interface for managing users on Windows

param(
    [string]$Action = "",
    [string]$Username = "",
    [string]$FullName = "",
    [string]$Role = "pengawas",
    [string]$UserId = ""
)

# File paths
$LocalDbPath = Join-Path $PSScriptRoot "local-database.json"

# Load database function
function Load-Database {
    try {
        if (Test-Path $LocalDbPath) {
            $content = Get-Content $LocalDbPath -Raw | ConvertFrom-Json
            return $content
        }
    }
    catch {
        Write-Host "Error loading database: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Return default structure
    return @{
        users = @(
            @{
                id = "1"
                username = "admin"
                fullName = "Administrator"
                role = "admin"
                nip = ""
                rank = ""
                phone = ""
                email = "admin@disdik.jabar.go.id"
                department = "Cabang Dinas Pendidikan Wilayah XI"
                status = "active"
                createdAt = (Get-Date).ToString("o")
                updatedAt = (Get-Date).ToString("o")
            }
        )
        schools = @()
        tasks = @()
        supervisions = @()
        events = @()
        additionalTasks = @()
    }
}

# Save database function
function Save-Database {
    param($Database)
    
    try {
        $Database | ConvertTo-Json -Depth 10 | Set-Content $LocalDbPath
        return $true
    }
    catch {
        Write-Host "Error saving database: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# List all users
function Show-Users {
    $db = Load-Database
    $users = $db.users
    
    Write-Host "`n=== DAFTAR USER ===" -ForegroundColor Cyan
    Write-Host "ID`tUsername`tNama Lengkap`t`t`tRole`tStatus" -ForegroundColor Yellow
    Write-Host "-------------------------------------------------------------------"
    
    foreach ($user in $users) {
        $name = $user.fullName.PadRight(25)
        Write-Host "$($user.id)`t$($user.username)`t$name`t$($user.role)`t$($user.status)"
    }
    
    Write-Host "`nTotal: $($users.Count) user`n" -ForegroundColor Green
}

# Add new user
function Add-User {
    param(
        [string]$Username,
        [string]$FullName,
        [string]$Role = "pengawas"
    )
    
    $db = Load-Database
    
    # Validate input
    if (-not $Username) {
        $Username = Read-Host "Username"
        if (-not $Username) {
            Write-Host "Username wajib diisi!" -ForegroundColor Red
            return
        }
    }
    
    if (-not $FullName) {
        $FullName = Read-Host "Nama Lengkap"
        if (-not $FullName) {
            Write-Host "Nama lengkap wajib diisi!" -ForegroundColor Red
            return
        }
    }
    
    # Check if username exists
    if ($db.users | Where-Object { $_.username -eq $Username }) {
        Write-Host "Username sudah digunakan!" -ForegroundColor Red
        return
    }
    
    # Get additional info
    $nip = Read-Host "NIP (opsional)"
    $rank = Read-Host "Pangkat/Golongan (opsional)"
    $phone = Read-Host "Nomor Telepon (opsional)"
    $email = Read-Host "Email (opsional)"
    $department = Read-Host "Unit Kerja (default: Cabang Dinas Pendidikan Wilayah XI)"
    
    if (-not $department) {
        $department = "Cabang Dinas Pendidikan Wilayah XI"
    }
    
    # Create new user
    $newUser = @{
        id = [string](Get-Date).Ticks
        username = $Username
        fullName = $FullName
        role = $Role
        nip = $nip
        rank = $rank
        phone = $phone
        email = $email
        department = $department
        status = "active"
        createdAt = (Get-Date).ToString("o")
        updatedAt = (Get-Date).ToString("o")
    }
    
    $db.users += $newUser
    
    if (Save-Database $db) {
        Write-Host "`nUser $FullName berhasil ditambahkan!" -ForegroundColor Green
    }
    else {
        Write-Host "Gagal menyimpan user!" -ForegroundColor Red
    }
}

# Delete user
function Remove-User {
    param([string]$UserId)
    
    $db = Load-Database
    
    if (-not $UserId) {
        Show-Users
        $UserId = Read-Host "Masukkan ID user yang akan dihapus"
    }
    
    $user = $db.users | Where-Object { $_.id -eq $UserId }
    
    if (-not $user) {
        Write-Host "User tidak ditemukan!" -ForegroundColor Red
        return
    }
    
    if ($user.username -eq "admin") {
        Write-Host "User admin tidak dapat dihapus!" -ForegroundColor Red
        return
    }
    
    $confirm = Read-Host "Yakin ingin menghapus user '$($user.fullName)'? (y/N)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        $db.users = $db.users | Where-Object { $_.id -ne $UserId }
        
        if (Save-Database $db) {
            Write-Host "User $($user.fullName) berhasil dihapus!" -ForegroundColor Green
        }
        else {
            Write-Host "Gagal menghapus user!" -ForegroundColor Red
        }
    }
    else {
        Write-Host "Penghapusan dibatalkan." -ForegroundColor Yellow
    }
}

# Update user status
function Update-UserStatus {
    param([string]$UserId)
    
    $db = Load-Database
    
    if (-not $UserId) {
        Show-Users
        $UserId = Read-Host "Masukkan ID user"
    }
    
    $userIndex = -1
    for ($i = 0; $i -lt $db.users.Count; $i++) {
        if ($db.users[$i].id -eq $UserId) {
            $userIndex = $i
            break
        }
    }
    
    if ($userIndex -eq -1) {
        Write-Host "User tidak ditemukan!" -ForegroundColor Red
        return
    }
    
    $user = $db.users[$userIndex]
    
    if ($user.username -eq "admin") {
        Write-Host "Status user admin tidak dapat diubah!" -ForegroundColor Red
        return
    }
    
    $newStatus = if ($user.status -eq "active") { "inactive" } else { "active" }
    
    $confirm = Read-Host "Ubah status '$($user.fullName)' menjadi $newStatus? (y/N)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        $db.users[$userIndex].status = $newStatus
        $db.users[$userIndex].updatedAt = (Get-Date).ToString("o")
        
        if (Save-Database $db) {
            Write-Host "Status user $($user.fullName) berhasil diubah menjadi $newStatus!" -ForegroundColor Green
        }
        else {
            Write-Host "Gagal mengubah status user!" -ForegroundColor Red
        }
    }
    else {
        Write-Host "Perubahan status dibatalkan." -ForegroundColor Yellow
    }
}

# Export users to CSV
function Export-Users {
    $db = Load-Database
    $users = $db.users
    
    $filename = "users_export_$(Get-Date -Format 'yyyy-MM-dd').csv"
    
    $csvData = $users | Select-Object @{
        Name = 'ID'; Expression = { $_.id }
    }, @{
        Name = 'Username'; Expression = { $_.username }
    }, @{
        Name = 'Nama Lengkap'; Expression = { $_.fullName }
    }, @{
        Name = 'Role'; Expression = { $_.role }
    }, @{
        Name = 'NIP'; Expression = { $_.nip }
    }, @{
        Name = 'Pangkat'; Expression = { $_.rank }
    }, @{
        Name = 'Telepon'; Expression = { $_.phone }
    }, @{
        Name = 'Email'; Expression = { $_.email }
    }, @{
        Name = 'Unit Kerja'; Expression = { $_.department }
    }, @{
        Name = 'Status'; Expression = { $_.status }
    }, @{
        Name = 'Terdaftar'; Expression = { 
            if ($_.createdAt) { 
                [DateTime]::Parse($_.createdAt).ToString("dd/MM/yyyy") 
            } else { 
                "" 
            }
        }
    }
    
    try {
        $csvData | Export-Csv -Path $filename -NoTypeInformation -Encoding UTF8
        Write-Host "`nData user berhasil diekspor ke: $filename" -ForegroundColor Green
        Write-Host "Total: $($users.Count) user`n" -ForegroundColor Green
    }
    catch {
        Write-Host "Gagal mengekspor data user: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Show statistics
function Show-Statistics {
    $db = Load-Database
    $users = $db.users
    
    $stats = @{
        total = $users.Count
        active = ($users | Where-Object { $_.status -eq "active" }).Count
        inactive = ($users | Where-Object { $_.status -eq "inactive" }).Count
        admin = ($users | Where-Object { $_.role -eq "admin" }).Count
        pengawas = ($users | Where-Object { $_.role -eq "pengawas" }).Count
    }
    
    Write-Host "`n=== STATISTIK USER ===" -ForegroundColor Cyan
    Write-Host "Total User: $($stats.total)" -ForegroundColor White
    Write-Host "User Aktif: $($stats.active)" -ForegroundColor Green
    Write-Host "User Tidak Aktif: $($stats.inactive)" -ForegroundColor Red
    Write-Host "Administrator: $($stats.admin)" -ForegroundColor Yellow
    Write-Host "Pengawas: $($stats.pengawas)" -ForegroundColor Blue
    Write-Host ""
}

# Show help
function Show-Help {
    Write-Host "`n=== BANTUAN MANAJEMEN USER ===" -ForegroundColor Cyan
    Write-Host "Penggunaan: .\manage-users.ps1 -Action <action> [parameters]`n"
    
    Write-Host "Actions yang tersedia:" -ForegroundColor Yellow
    Write-Host "  list          - Tampilkan daftar user"
    Write-Host "  add           - Tambah user baru"
    Write-Host "  delete        - Hapus user"
    Write-Host "  status        - Update status user"
    Write-Host "  export        - Ekspor data user ke CSV"
    Write-Host "  stats         - Tampilkan statistik user"
    Write-Host "  help          - Tampilkan bantuan ini"
    
    Write-Host "`nContoh penggunaan:" -ForegroundColor Yellow
    Write-Host "  .\manage-users.ps1 -Action list"
    Write-Host "  .\manage-users.ps1 -Action add -Username 'john' -FullName 'John Doe'"
    Write-Host "  .\manage-users.ps1 -Action delete -UserId '123'"
    Write-Host "  .\manage-users.ps1 -Action export"
    Write-Host ""
}

# Interactive menu
function Show-Menu {
    do {
        Write-Host "`n=== MANAJEMEN USER ===" -ForegroundColor Cyan
        Write-Host "Cabang Dinas Pendidikan Wilayah XI" -ForegroundColor White
        Write-Host "Garut, Jawa Barat`n" -ForegroundColor White
        
        Write-Host "1. Lihat Daftar User" -ForegroundColor White
        Write-Host "2. Tambah User Baru" -ForegroundColor White
        Write-Host "3. Hapus User" -ForegroundColor White
        Write-Host "4. Update Status User" -ForegroundColor White
        Write-Host "5. Ekspor Data User" -ForegroundColor White
        Write-Host "6. Statistik User" -ForegroundColor White
        Write-Host "7. Bantuan" -ForegroundColor White
        Write-Host "0. Keluar" -ForegroundColor White
        
        $choice = Read-Host "`nPilih menu (0-7)"
        
        switch ($choice) {
            "1" { Show-Users }
            "2" { Add-User }
            "3" { Remove-User }
            "4" { Update-UserStatus }
            "5" { Export-Users }
            "6" { Show-Statistics }
            "7" { Show-Help }
            "0" { 
                Write-Host "Terima kasih!" -ForegroundColor Green
                return
            }
            default { 
                Write-Host "Pilihan tidak valid!" -ForegroundColor Red
            }
        }
        
        if ($choice -ne "0") {
            Read-Host "`nTekan Enter untuk melanjutkan"
        }
        
    } while ($choice -ne "0")
}

# Main execution
if ($Action) {
    switch ($Action.ToLower()) {
        "list" { Show-Users }
        "add" { Add-User -Username $Username -FullName $FullName -Role $Role }
        "delete" { Remove-User -UserId $UserId }
        "status" { Update-UserStatus -UserId $UserId }
        "export" { Export-Users }
        "stats" { Show-Statistics }
        "help" { Show-Help }
        default { 
            Write-Host "Action tidak valid. Gunakan -Action help untuk melihat bantuan." -ForegroundColor Red
        }
    }
}
else {
    Show-Menu
}