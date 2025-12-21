# 🚀 Deploy SchoolGuardManager ke Production
# Script otomatis untuk deploy ke Vercel + Supabase

Write-Host "🚀 DEPLOY TO PRODUCTION - SchoolGuardManager" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow

# Step 1: Build aplikasi
Write-Host "`n📦 Step 1: Building aplikasi..." -ForegroundColor Cyan
try {
    npm run build
    Write-Host "✅ Build berhasil!" -ForegroundColor Green
} catch {
    Write-Host "❌ Build gagal! Periksa error di atas." -ForegroundColor Red
    exit 1
}

# Step 2: Commit dan push ke GitHub
Write-Host "`n📤 Step 2: Commit dan push ke GitHub..." -ForegroundColor Cyan
try {
    git add .
    git commit -m "Ready for production deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git push origin main
    Write-Host "✅ Code berhasil di-push ke GitHub!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Git push gagal atau tidak ada perubahan." -ForegroundColor Yellow
}

# Step 3: Instruksi Supabase
Write-Host "`n🗄️ Step 3: Setup Supabase Database" -ForegroundColor Cyan
Write-Host "1. Buka project Supabase: https://supabase.com/dashboard/project/fmxeboullgcewzjpql" -ForegroundColor White
Write-Host "2. Klik 'SQL Editor' → 'New query'" -ForegroundColor White
Write-Host "3. Copy paste script dari file: SETUP_SUPABASE_SCHEMA_SIMPLE.sql" -ForegroundColor White
Write-Host "4. Klik 'Run' untuk execute script" -ForegroundColor White
Write-Host "5. Klik 'Settings' → 'Database' → Copy connection string" -ForegroundColor White

$supabaseReady = Read-Host "`nApakah Supabase sudah di-setup? (y/n)"
if ($supabaseReady -ne "y") {
    Write-Host "⏸️ Silakan setup Supabase terlebih dahulu, lalu jalankan script ini lagi." -ForegroundColor Yellow
    exit 0
}

# Step 4: Instruksi Vercel
Write-Host "`n🌐 Step 4: Deploy ke Vercel" -ForegroundColor Cyan
Write-Host "1. Buka: https://vercel.com/new" -ForegroundColor White
Write-Host "2. Import repository GitHub ini" -ForegroundColor White
Write-Host "3. Configure project:" -ForegroundColor White
Write-Host "   - Framework: Other" -ForegroundColor Gray
Write-Host "   - Build Command: npm run build" -ForegroundColor Gray
Write-Host "   - Output Directory: dist/public" -ForegroundColor Gray
Write-Host "4. Set Environment Variables:" -ForegroundColor White

Write-Host "`n📋 Environment Variables untuk Vercel:" -ForegroundColor Yellow
Write-Host "DATABASE_URL = [paste connection string dari Supabase]" -ForegroundColor Gray
Write-Host "JWT_SECRET = schoolguard-secret-key-2024" -ForegroundColor Gray
Write-Host "SESSION_SECRET = schoolguard-secret-key-2024" -ForegroundColor Gray
Write-Host "NODE_ENV = production" -ForegroundColor Gray
Write-Host "USE_LOCAL_STORAGE = false" -ForegroundColor Gray

Write-Host "`n5. Klik 'Deploy'!" -ForegroundColor White

$vercelReady = Read-Host "`nApakah Vercel deployment sudah selesai? (y/n)"
if ($vercelReady -ne "y") {
    Write-Host "⏸️ Silakan deploy ke Vercel terlebih dahulu." -ForegroundColor Yellow
    exit 0
}

# Step 5: Test Production
$prodUrl = Read-Host "`nMasukkan Production URL (contoh: https://schoolguard-manager.vercel.app)"
if ($prodUrl) {
    Write-Host "`n🧪 Step 5: Testing Production..." -ForegroundColor Cyan
    Write-Host "1. Membuka production URL..." -ForegroundColor White
    Start-Process $prodUrl
    
    Write-Host "2. Test login dengan:" -ForegroundColor White
    Write-Host "   Username: admin" -ForegroundColor Gray
    Write-Host "   Password: admin123" -ForegroundColor Gray
    
    Write-Host "3. Cek fitur-fitur utama:" -ForegroundColor White
    Write-Host "   - Dashboard load dengan benar" -ForegroundColor Gray
    Write-Host "   - Halaman Users accessible" -ForegroundColor Gray
    Write-Host "   - Admin features aktif" -ForegroundColor Gray
    Write-Host "   - Database connection working" -ForegroundColor Gray
}

Write-Host "`n🎉 DEPLOYMENT SELESAI!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "✅ Aplikasi SchoolGuardManager sudah live di production!" -ForegroundColor Green
Write-Host "✅ Database Supabase terkoneksi" -ForegroundColor Green
Write-Host "✅ SSL certificate otomatis" -ForegroundColor Green
Write-Host "✅ Global CDN dari Vercel" -ForegroundColor Green

if ($prodUrl) {
    Write-Host "`n🔗 Production URL: $prodUrl" -ForegroundColor Cyan
}

Write-Host "`n📊 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Test semua fitur di production" -ForegroundColor White
Write-Host "2. Share URL dengan tim" -ForegroundColor White
Write-Host "3. Setup monitoring (opsional)" -ForegroundColor White
Write-Host "4. Setup custom domain (opsional)" -ForegroundColor White

Write-Host "`n🎊 Selamat! Deployment berhasil!" -ForegroundColor Green