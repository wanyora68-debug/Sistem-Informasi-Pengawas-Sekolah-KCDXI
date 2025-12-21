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
  
  // Use vite build directly
  execSync('vite build', {
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✅ Client build completed!\n');

  console.log('🎉 Build process completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
