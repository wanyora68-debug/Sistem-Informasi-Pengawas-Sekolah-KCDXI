@echo off
REM Script untuk menjalankan server Aplikasi Pengawas Sekolah
REM Double-click file ini untuk start server

echo ========================================
echo   APLIKASI PENGAWAS SEKOLAH
echo   Starting Server...
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [WARNING] node_modules tidak ditemukan!
    echo [INFO] Installing dependencies...
    call npm install
    echo.
)

echo [INFO] Starting server...
echo [INFO] URL: http://localhost:5000
echo [INFO] Login: admin / admin
echo.
echo [INFO] Tekan Ctrl+C untuk stop server
echo.

REM Set environment and start
set NODE_ENV=development
npx tsx server/index.ts

pause
