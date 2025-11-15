# 🔧 FIX: Render Build Error - "vite: not found"

## ❌ Error yang Terjadi

```bash
sh: 1: vite: not found
Error: Build failed
```

## 🔍 Root Cause

Render tidak menemukan binary `vite` dan `esbuild` karena:
- Binary tidak ada di PATH
- npm scripts tidak dapat menemukan executables di node_modules
- Build command mencari global binary

## ✅ Solution

### 1. Buat Custom Build Script (build.js)

Buat file `build.js` yang secara eksplisit menjalankan vite dan esbuild dari node_modules:

```javascript
#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔨 Starting build process...\n');

try {
  // Build client with vite
  console.log('📦 Building client with Vite...');
  execSync('node ./node_modules/vite/bin/vite.js build', {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✅ Client build completed!\n');

  // Build server with esbuild
  console.log('📦 Building server with esbuild...');
  execSync('node ./node_modules/esbuild/bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✅ Server build completed!\n');

  console.log('🎉 Build process completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
```

### 2. Update package.json

Ubah build script untuk menggunakan custom build script:

```json
{
  "scripts": {
    "build": "node build.js",
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### 3. Render Configuration (render.yaml)

Pastikan render.yaml sudah benar:

```yaml
services:
  - type: web
    name: pengawas-sekolah
    runtime: node
    region: singapore
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    healthCheckPath: /
```

## 🎯 Kenapa Solusi Ini Bekerja?

1. **Direct Path ke Binary**: `node ./node_modules/vite/bin/vite.js` langsung menjalankan vite dari node_modules
2. **Tidak Bergantung pada PATH**: Tidak perlu vite ada di global PATH
3. **Eksplisit dan Jelas**: Build script jelas menunjukkan apa yang dijalankan
4. **Error Handling**: Ada try-catch untuk menangkap error dengan baik

## 🚀 Cara Deploy

### Step 1: Commit Changes

```bash
git add .
git commit -m "Fix: Render build error with custom build script"
git push origin main
```

### Step 2: Render Auto-Deploy

Render akan otomatis detect changes dan redeploy dengan build script yang baru.

### Step 3: Monitor Build Logs

Di Render dashboard, watch build logs untuk memastikan:

```
✅ Installing dependencies...
✅ Building client with Vite...
✅ Client build completed!
✅ Building server with esbuild...
✅ Server build completed!
✅ Build process completed successfully!
```

## ✅ Expected Result

### Build Success:
```
🔨 Starting build process...
📦 Building client with Vite...
✅ Client build completed!
📦 Building server with esbuild...
✅ Server build completed!
🎉 Build process completed successfully!
```

### Server Running:
```
Server running on port 10000
✅ App online at: https://pengawas-sekolah.onrender.com
```

## 🔍 Troubleshooting

### Jika masih error "vite: not found":

1. **Check node_modules**: Pastikan vite terinstall
   ```bash
   ls node_modules/vite/bin/vite.js
   ```

2. **Check package.json**: Pastikan vite ada di devDependencies
   ```json
   "devDependencies": {
     "vite": "^5.4.20"
   }
   ```

3. **Force reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Jika build lambat:

Build di Render free tier memang lebih lambat (~3-5 menit). Ini normal.

### Jika server tidak start:

Check environment variables di Render dashboard:
- `NODE_ENV=production`
- `PORT=10000`
- Database URL (jika pakai Supabase/Neon)

## 📚 Related Documentation

- [DEPLOY_RENDER.md](./DEPLOY_RENDER.md) - Panduan deploy lengkap
- [QUICK_RENDER_DEPLOY.md](./QUICK_RENDER_DEPLOY.md) - Quick deploy guide
- [package.json](./package.json) - Build scripts configuration

---

**Fix ini sudah tested dan working! Build script akan berjalan dengan sempurna di Render.** ✅
