/**
 * Script untuk test otomatis fitur-fitur kritis
 * Jalankan: node scripts/test-critical-features.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class FeatureTester {
  constructor() {
    this.testResults = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  async runTest(testName, testFunction) {
    this.totalTests++;
    log(`\n🧪 Testing: ${testName}`, 'blue');
    
    try {
      const startTime = Date.now();
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      if (result.success) {
        this.passedTests++;
        log(`✅ PASSED: ${testName} (${duration}ms)`, 'green');
        if (result.message) log(`   ${result.message}`, 'cyan');
      } else {
        this.failedTests++;
        log(`❌ FAILED: ${testName} (${duration}ms)`, 'red');
        if (result.message) log(`   ${result.message}`, 'yellow');
      }
      
      this.testResults.push({
        name: testName,
        success: result.success,
        message: result.message || '',
        duration
      });
      
    } catch (error) {
      this.failedTests++;
      log(`❌ ERROR: ${testName}`, 'red');
      log(`   ${error.message}`, 'yellow');
      
      this.testResults.push({
        name: testName,
        success: false,
        message: error.message,
        duration: 0
      });
    }
  }

  // Test 1: Check if all required files exist
  async testRequiredFiles() {
    const requiredFiles = [
      'package.json',
      'vercel.json',
      '.env',
      'local-database.json',
      'client/src/pages/login.tsx',
      'client/src/pages/dashboard.tsx',
      'client/src/pages/users.tsx',
      'client/src/pages/schools.tsx',
      'client/src/pages/tasks.tsx',
      'client/src/pages/supervisions.tsx',
      'client/src/pages/additional-tasks.tsx',
      'client/src/pages/calendar.tsx',
      'client/src/pages/reports.tsx',
      'client/src/pages/profile.tsx',
      'server/index.ts',
      'server/routes.ts',
      'server/storage.ts',
      'api/auth/login.js',
      'api/auth/me.js',
      'api/users.js',
      'api/schools.js',
      'api/tasks.js',
      'api/supervisions.js'
    ];

    const missingFiles = [];
    const rootPath = path.join(__dirname, '..');

    for (const file of requiredFiles) {
      const filePath = path.join(rootPath, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length === 0) {
      return {
        success: true,
        message: `All ${requiredFiles.length} required files exist`
      };
    } else {
      return {
        success: false,
        message: `Missing files: ${missingFiles.join(', ')}`
      };
    }
  }

  // Test 2: Check package.json configuration
  async testPackageJson() {
    const packagePath = path.join(__dirname, '..', 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      return { success: false, message: 'package.json not found' };
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredScripts = ['dev', 'build', 'start'];
    const requiredDependencies = ['react', 'express', '@supabase/supabase-js'];

    const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script]);
    const missingDeps = requiredDependencies.filter(dep => 
      !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );

    if (missingScripts.length === 0 && missingDeps.length === 0) {
      return {
        success: true,
        message: 'Package.json configuration is correct'
      };
    } else {
      return {
        success: false,
        message: `Missing scripts: ${missingScripts.join(', ')}, Missing deps: ${missingDeps.join(', ')}`
      };
    }
  }

  // Test 3: Check environment configuration
  async testEnvironmentConfig() {
    const envPath = path.join(__dirname, '..', '.env');
    
    if (!fs.existsSync(envPath)) {
      return { success: false, message: '.env file not found' };
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = ['JWT_SECRET', 'SESSION_SECRET', 'NODE_ENV'];
    const missingVars = [];

    for (const varName of requiredVars) {
      if (!envContent.includes(varName)) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length === 0) {
      return {
        success: true,
        message: 'Environment configuration is complete'
      };
    } else {
      return {
        success: false,
        message: `Missing environment variables: ${missingVars.join(', ')}`
      };
    }
  }

  // Test 4: Check local database
  async testLocalDatabase() {
    const dbPath = path.join(__dirname, '..', 'local-database.json');
    
    if (!fs.existsSync(dbPath)) {
      return { success: false, message: 'local-database.json not found' };
    }

    try {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const requiredTables = ['users', 'schools', 'tasks', 'supervisions'];
      const missingTables = [];

      for (const table of requiredTables) {
        if (!dbData[table] || !Array.isArray(dbData[table])) {
          missingTables.push(table);
        }
      }

      // Check if admin user exists
      const adminUser = dbData.users?.find(u => u.username === 'admin');
      const wawanUser = dbData.users?.find(u => u.username === 'wawan');

      if (missingTables.length === 0 && adminUser && wawanUser) {
        return {
          success: true,
          message: `Database has ${dbData.users?.length || 0} users, ${dbData.schools?.length || 0} schools, ${dbData.tasks?.length || 0} tasks`
        };
      } else {
        return {
          success: false,
          message: `Missing tables: ${missingTables.join(', ')}, Admin: ${!!adminUser}, Wawan: ${!!wawanUser}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Database JSON parse error: ${error.message}`
      };
    }
  }

  // Test 5: Check Vercel configuration
  async testVercelConfig() {
    const vercelPath = path.join(__dirname, '..', 'vercel.json');
    
    if (!fs.existsSync(vercelPath)) {
      return { success: false, message: 'vercel.json not found' };
    }

    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      
      const hasBuilds = vercelConfig.builds && vercelConfig.builds.length > 0;
      const hasRoutes = vercelConfig.routes && vercelConfig.routes.length > 0;
      const hasApiRoute = vercelConfig.builds?.some(build => build.src?.includes('api'));

      if (hasBuilds && hasRoutes && hasApiRoute) {
        return {
          success: true,
          message: 'Vercel configuration is correct'
        };
      } else {
        return {
          success: false,
          message: `Missing: builds(${hasBuilds}), routes(${hasRoutes}), api(${hasApiRoute})`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Vercel config parse error: ${error.message}`
      };
    }
  }

  // Test 6: Check API endpoints
  async testAPIEndpoints() {
    const apiPath = path.join(__dirname, '..', 'api');
    
    if (!fs.existsSync(apiPath)) {
      return { success: false, message: 'api directory not found' };
    }

    const requiredEndpoints = [
      'auth/login.js',
      'auth/me.js',
      'users.js',
      'schools.js',
      'tasks.js',
      'supervisions.js'
    ];

    const missingEndpoints = [];

    for (const endpoint of requiredEndpoints) {
      const endpointPath = path.join(apiPath, endpoint);
      if (!fs.existsSync(endpointPath)) {
        missingEndpoints.push(endpoint);
      }
    }

    if (missingEndpoints.length === 0) {
      return {
        success: true,
        message: `All ${requiredEndpoints.length} API endpoints exist`
      };
    } else {
      return {
        success: false,
        message: `Missing endpoints: ${missingEndpoints.join(', ')}`
      };
    }
  }

  // Test 7: Check React components
  async testReactComponents() {
    const pagesPath = path.join(__dirname, '..', 'client', 'src', 'pages');
    
    if (!fs.existsSync(pagesPath)) {
      return { success: false, message: 'client/src/pages directory not found' };
    }

    const requiredPages = [
      'login.tsx',
      'dashboard.tsx',
      'users.tsx',
      'schools.tsx',
      'tasks.tsx',
      'supervisions.tsx',
      'additional-tasks.tsx',
      'calendar.tsx',
      'reports.tsx',
      'profile.tsx'
    ];

    const missingPages = [];

    for (const page of requiredPages) {
      const pagePath = path.join(pagesPath, page);
      if (!fs.existsSync(pagePath)) {
        missingPages.push(page);
      }
    }

    if (missingPages.length === 0) {
      return {
        success: true,
        message: `All ${requiredPages.length} React pages exist`
      };
    } else {
      return {
        success: false,
        message: `Missing pages: ${missingPages.join(', ')}`
      };
    }
  }

  // Test 8: Check build configuration
  async testBuildConfig() {
    const buildPath = path.join(__dirname, '..', 'build.js');
    const vitePath = path.join(__dirname, '..', 'vite.config.ts');
    
    const hasBuildScript = fs.existsSync(buildPath);
    const hasViteConfig = fs.existsSync(vitePath);

    if (hasBuildScript && hasViteConfig) {
      return {
        success: true,
        message: 'Build configuration files exist'
      };
    } else {
      return {
        success: false,
        message: `Missing: build.js(${hasBuildScript}), vite.config.ts(${hasViteConfig})`
      };
    }
  }

  // Generate test report
  generateReport() {
    log('\n' + '='.repeat(60), 'cyan');
    log('📊 TEST RESULTS SUMMARY', 'cyan');
    log('='.repeat(60), 'cyan');
    
    const passRate = Math.round((this.passedTests / this.totalTests) * 100);
    
    log(`\n📈 Overall Results:`, 'blue');
    log(`   Total Tests: ${this.totalTests}`, 'cyan');
    log(`   Passed: ${this.passedTests}`, 'green');
    log(`   Failed: ${this.failedTests}`, 'red');
    log(`   Pass Rate: ${passRate}%`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');
    
    if (this.failedTests > 0) {
      log(`\n❌ Failed Tests:`, 'red');
      this.testResults
        .filter(test => !test.success)
        .forEach(test => {
          log(`   • ${test.name}: ${test.message}`, 'yellow');
        });
    }
    
    log(`\n🎯 Recommendation:`, 'blue');
    if (passRate >= 95) {
      log(`   ✅ EXCELLENT! Ready for production deployment.`, 'green');
    } else if (passRate >= 85) {
      log(`   ⚠️  GOOD. Minor fixes recommended before deployment.`, 'yellow');
    } else if (passRate >= 70) {
      log(`   ⚠️  FAIR. Several fixes needed before deployment.`, 'yellow');
    } else {
      log(`   ❌ POOR. Major fixes required before deployment.`, 'red');
    }
    
    log('\n' + '='.repeat(60), 'cyan');
  }

  // Run all tests
  async runAllTests() {
    log('🚀 Starting Critical Features Test Suite', 'magenta');
    log('Testing application readiness for production deployment\n', 'cyan');

    await this.runTest('Required Files Check', () => this.testRequiredFiles());
    await this.runTest('Package.json Configuration', () => this.testPackageJson());
    await this.runTest('Environment Configuration', () => this.testEnvironmentConfig());
    await this.runTest('Local Database', () => this.testLocalDatabase());
    await this.runTest('Vercel Configuration', () => this.testVercelConfig());
    await this.runTest('API Endpoints', () => this.testAPIEndpoints());
    await this.runTest('React Components', () => this.testReactComponents());
    await this.runTest('Build Configuration', () => this.testBuildConfig());

    this.generateReport();
    
    return this.passedTests === this.totalTests;
  }
}

// Run tests
async function main() {
  const tester = new FeatureTester();
  const allTestsPassed = await tester.runAllTests();
  
  process.exit(allTestsPassed ? 0 : 1);
}

main().catch(error => {
  log(`\n💥 Test suite crashed: ${error.message}`, 'red');
  process.exit(1);
});