#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
