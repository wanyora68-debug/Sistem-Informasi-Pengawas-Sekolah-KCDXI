# Script untuk menghentikan server yang berjalan di port 5000
# Cara menggunakan: .\stop-server.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STOP SERVER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Find process using port 5000
$port = 5000
Write-Host "🔍 Mencari process di port $port..." -ForegroundColor Yellow

try {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($connections) {
        foreach ($conn in $connections) {
            $processId = $conn.OwningProcess
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            
            if ($process) {
                Write-Host "📍 Ditemukan: $($process.ProcessName) (PID: $processId)" -ForegroundColor Yellow
                Write-Host "⏹️  Menghentikan process..." -ForegroundColor Red
                
                Stop-Process -Id $processId -Force
                
                Write-Host "✅ Server berhasil dihentikan!" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "ℹ️  Tidak ada server yang berjalan di port $port" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
