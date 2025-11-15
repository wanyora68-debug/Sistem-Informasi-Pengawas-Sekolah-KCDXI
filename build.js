#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔨 Starting build process...\n');

try {
  // Build client with vite
  console.log('📦 Building client with Vite...');
  
  // Try multiple ways to run vite
  const vitePaths = [
    './node_modules/vite/bin/vite.js',
    './node_modules/.bin/vite'
  ];
  
  let viteCmd = 'npx vite build';
  for (const vitePath of vitePaths) {
    if (existsSync(vitePath)) {
      viteCmd = `node ${vitePath} build`;
      break;
    }
  }
  
  execSync(viteCmd, {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✅ Client build completed!\n');

  // Build server with esbuild
  console.log('📦 Building server with esbuild...');
  
  // Try multiple ways to run esbuild
  const esbuildPaths = [
    './node_modules/esbuild/bin/esbuild',
    './node_modules/.bin/esbuild'
  ];
  
  let esbuildCmd = 'npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist';
  for (const esbuildPath of esbuildPaths) {
    if (existsSync(esbuildPath)) {
      esbuildCmd = `node ${esbuildPath} server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`;
      break;
    }
  }
  
  execSync(esbuildCmd, {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✅ Server build completed!\n');

  console.log('🎉 Build process completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
