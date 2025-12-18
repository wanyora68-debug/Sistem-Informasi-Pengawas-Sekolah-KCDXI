#!/usr/bin/env node

/**
 * Reset Password Script
 * 
 * Reset password for a specific user in local-database.json
 * Run: node scripts/reset-password.js <username> <new-password>
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const username = process.argv[2];
const newPassword = process.argv[3];

if (!username || !newPassword) {
  console.error('Usage: node scripts/reset-password.js <username> <new-password>');
  console.error('Example: node scripts/reset-password.js wawan 123456');
  process.exit(1);
}

async function resetPassword() {
  try {
    // Read local database
    const localDbPath = join(rootDir, 'local-database.json');
    const data = JSON.parse(readFileSync(localDbPath, 'utf-8'));

    // Find user
    const user = data.users.find(u => u.username === username);
    if (!user) {
      console.error(`❌ User "${username}" not found!`);
      console.log('\nAvailable users:');
      data.users.forEach(u => console.log(`  - ${u.username} (${u.fullName})`));
      process.exit(1);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;

    // Save back to file
    writeFileSync(localDbPath, JSON.stringify(data, null, 2));

    console.log(`✅ Password for user "${username}" has been reset!`);
    console.log(`   Username: ${username}`);
    console.log(`   New Password: ${newPassword}`);
    console.log('\nYou can now login with the new password.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
