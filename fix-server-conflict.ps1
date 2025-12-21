# Fix Server Conflict Script
# Mengatasi masalah multiple server instances

Write-Host "🔍 DIAGNOSA KONFLIK SERVER" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# 1. Check current processes on port 5000
Write-Host "`n1. Checking processes on port 5000..." -ForegroundColor Yellow
$port5000 = netstat -ano | findstr :5000
if ($port5000) {
    Write-Host "⚠️  CONFLICT DETECTED - Processes using port 5000:" -ForegroundColor Red
    $port5000 | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
} else {
    Write-Host "✅ No processes found on port 5000" -ForegroundColor Green
}

# 2. Check all Node.js processes
Write-Host "`n2. Checking all Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "📊 Found Node.js processes:" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object { 
        Write-Host "   PID: $($_.Id) | Name: $($_.ProcessName)" -ForegroundColor White 
    }
} else {
    Write-Host "✅ No Node.js processes found" -ForegroundColor Green
}

# 3. Ask user if they want to kill all Node processes
if ($nodeProcesses) {
    Write-Host "`n⚠️  MULTIPLE NODE PROCESSES DETECTED!" -ForegroundColor Red
    Write-Host "This is likely causing the dashboard conflict." -ForegroundColor Red
    
    $response = Read-Host "`nDo you want to kill all Node.js processes? (y/n)"
    
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "`n💀 Killing all Node.js processes..." -ForegroundColor Red
        
        try {
            Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
            Write-Host "✅ All Node.js processes terminated!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Error killing processes: $_" -ForegroundColor Red
        }
        
        # Wait a moment
        Start-Sleep -Seconds 2
        
        # Verify processes are killed
        $remainingNodes = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($remainingNodes) {
            Write-Host "⚠️  Some processes may still be running" -ForegroundColor Yellow
        } else {
            Write-Host "✅ All Node.js processes successfully terminated" -ForegroundColor Green
        }
    }
}

# 4. Check if port 5000 is now free
Write-Host "`n4. Rechecking port 5000..." -ForegroundColor Yellow
$port5000After = netstat -ano | findstr :5000
if ($port5000After) {
    Write-Host "⚠️  Port 5000 still in use:" -ForegroundColor Yellow
    $port5000After | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
} else {
    Write-Host "✅ Port 5000 is now free!" -ForegroundColor Green
}

# 5. Offer to start clean server
Write-Host "`n5. Starting clean server..." -ForegroundColor Yellow
$startServer = Read-Host "Do you want to start a clean server instance? (y/n)"

if ($startServer -eq 'y' -or $startServer -eq 'Y') {
    Write-Host "`n🚀 Starting clean server..." -ForegroundColor Green
    Write-Host "Command: npm run dev" -ForegroundColor Cyan
    
    try {
        # Start the server
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
        Write-Host "✅ Server started successfully!" -ForegroundColor Green
        Write-Host "🌐 Access your app at: http://localhost:5000" -ForegroundColor Cyan
        Write-Host "📊 Dashboard should now be consistent" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error starting server: $_" -ForegroundColor Red
        Write-Host "💡 Try running 'npm run dev' manually" -ForegroundColor Yellow
    }
}

Write-Host "`n🎯 SUMMARY:" -ForegroundColor Cyan
Write-Host "- Multiple server instances can cause different dashboards" -ForegroundColor White
Write-Host "- Always kill existing processes before starting new server" -ForegroundColor White
Write-Host "- Use this script when you encounter server conflicts" -ForegroundColor White

Write-Host "`n✅ Script completed!" -ForegroundColor Green
Read-Host "Press Enter to exit"