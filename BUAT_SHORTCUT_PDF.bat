@echo off
echo Membuat shortcut PDF Export Enhanced di Desktop...

set "desktop=%USERPROFILE%\Desktop"
set "target=%CD%\client\public\PDF_EXPORT_ENHANCED.html"

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%temp%\shortcut.vbs"
echo sLinkFile = "%desktop%\Export PDF Laporan Enhanced.lnk" >> "%temp%\shortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%temp%\shortcut.vbs"
echo oLink.TargetPath = "%target%" >> "%temp%\shortcut.vbs"
echo oLink.Description = "Export PDF Laporan Pengawas dengan Cover dan Foto" >> "%temp%\shortcut.vbs"
echo oLink.Save >> "%temp%\shortcut.vbs"

cscript "%temp%\shortcut.vbs" >nul
del "%temp%\shortcut.vbs"

echo.
echo ✅ Shortcut "Export PDF Laporan Enhanced" berhasil dibuat di Desktop!
echo.
echo 🎨 Fitur Baru:
echo    ✓ Cover halaman yang menarik dengan gradient biru
echo    ✓ Galeri foto maksimal 6 foto per bulan
echo    ✓ Layout profesional dengan statistik visual
echo    ✓ Tanda tangan kepala dinas dan pengawas
echo    ✓ Auto-load data dari aplikasi utama
echo.
echo 💡 Cara pakai:
echo    1. Double-click shortcut di Desktop
echo    2. Klik "Generate PDF" untuk refresh data
echo    3. Klik "Print/Save" untuk export PDF
echo.
pause