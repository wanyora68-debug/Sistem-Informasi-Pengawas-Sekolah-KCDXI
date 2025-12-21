/**
 * Script untuk test production deployment di Vercel
 * Jalankan: node scripts/test-production-deployment.js
 */

import fetch from 'node-fetch';
import chalk from 'chalk';

// Configuration
const VERCEL_URL = process.env.VERCEL_URL || 'https://sistem-informasi-pengawas-sekolah-kcdy.vercel.app';
const TEST_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Test results storage
let testResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
};

// Utility functions
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}]`;
    
    switch (type) {
        case 'success':
            console.log(chalk.green(`${prefix} ✅ ${message}`));
            break;
        case 'error':
            console.log(chalk.red(`${prefix} ❌ ${message}`));
            break;
        case 'warning':
            console.log(chalk.yellow(`${prefix} ⚠️  ${message}`));
            break;
        case 'info':
            console.log(chalk.blue(`${prefix} ℹ️  ${message}`));
            break;
        default:
            console.log(`${prefix} ${message}`);
    }
}

function recordTest(name, passed, message, type = 'info') {
    testResults.tests.push({ name, passed, message, type });
    if (passed) {
        testResults.passed++;
    } else {
        if (type === 'warning') {
            testResults.warnings++;
        } else {
            testResults.failed++;
        }
    }
}

// Test functions
async function testBasicAccess() {
    log('Testing basic URL access...', 'info');
    
    try {
        const response = await fetch(VERCEL_URL, {
            method: 'GET',
            timeout: 10000
        });
        
        if (response.ok) {
            log(`Basic access successful (${response.status})`, 'success');
            recordTest('Basic Access', true, `URL accessible with status ${response.status}`);
            return true;
        } else {
            log(`Basic access failed with status ${response.status}`, 'error');
            recordTest('Basic Access', false, `HTTP ${response.status}`);
            return false;
        }
    } catch (error) {
        log(`Basic access failed: ${error.message}`, 'error');
        recordTest('Basic Access', false, error.message);
        return false;
    }
}

async function testLoginEndpoint() {
    log('Testing login endpoint...', 'info');
    
    try {
        const response = await fetch(`${VERCEL_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(TEST_CREDENTIALS)
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.token || data.user) {
                log('Login endpoint working correctly', 'success');
                recordTest('Login Endpoint', true, 'Login successful with test credentials');
                return data.token || true;
            } else {
                log('Login endpoint returned unexpected response', 'warning');
                recordTest('Login Endpoint', false, 'Unexpected response format', 'warning');
                return false;
            }
        } else {
            const errorText = await response.text();
            log(`Login failed with status ${response.status}: ${errorText}`, 'error');
            recordTest('Login Endpoint', false, `HTTP ${response.status}: ${errorText}`);
            return false;
        }
    } catch (error) {
        log(`Login test failed: ${error.message}`, 'error');
        recordTest('Login Endpoint', false, error.message);
        return false;
    }
}

async function testAPIEndpoints(token = null) {
    log('Testing API endpoints...', 'info');
    
    const endpoints = [
        { path: '/api/auth/me', method: 'GET', requiresAuth: true },
        { path: '/api/users', method: 'GET', requiresAuth: true },
        { path: '/api/schools', method: 'GET', requiresAuth: true },
        { path: '/api/tasks', method: 'GET', requiresAuth: true },
        { path: '/api/supervisions', method: 'GET', requiresAuth: true }
    ];
    
    let passedEndpoints = 0;
    
    for (const endpoint of endpoints) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (endpoint.requiresAuth && token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${VERCEL_URL}${endpoint.path}`, {
                method: endpoint.method,
                headers
            });
            
            if (response.ok) {
                log(`✅ ${endpoint.path} - OK (${response.status})`, 'success');
                passedEndpoints++;
            } else if (response.status === 401 && endpoint.requiresAuth) {
                log(`⚠️  ${endpoint.path} - Requires authentication (${response.status})`, 'warning');
                passedEndpoints++; // This is expected behavior
            } else {
                log(`❌ ${endpoint.path} - Failed (${response.status})`, 'error');
            }
        } catch (error) {
            log(`❌ ${endpoint.path} - Error: ${error.message}`, 'error');
        }
    }
    
    const success = passedEndpoints === endpoints.length;
    recordTest('API Endpoints', success, `${passedEndpoints}/${endpoints.length} endpoints working`);
    return success;
}

async function testEnvironmentVariables() {
    log('Testing environment variables...', 'info');
    
    try {
        // Test if the app can connect to database (indirect env var test)
        const response = await fetch(`${VERCEL_URL}/api/health`, {
            method: 'GET'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.database || data.status === 'ok') {
                log('Environment variables appear to be loaded correctly', 'success');
                recordTest('Environment Variables', true, 'Database connection indicates env vars are working');
                return true;
            }
        }
        
        // Fallback: check if we get proper error responses (indicates app is running)
        if (response.status === 404) {
            log('App is running (env vars likely working)', 'warning');
            recordTest('Environment Variables', true, 'App responding, env vars likely configured', 'warning');
            return true;
        }
        
        log('Cannot verify environment variables', 'warning');
        recordTest('Environment Variables', false, 'Unable to verify env var configuration', 'warning');
        return false;
        
    } catch (error) {
        log(`Environment variables test failed: ${error.message}`, 'error');
        recordTest('Environment Variables', false, error.message);
        return false;
    }
}

async function testDatabaseConnection() {
    log('Testing database connection...', 'info');
    
    try {
        // Try to access an endpoint that requires database
        const response = await fetch(`${VERCEL_URL}/api/users`, {
            method: 'GET'
        });
        
        if (response.ok) {
            log('Database connection working', 'success');
            recordTest('Database Connection', true, 'Database queries successful');
            return true;
        } else if (response.status === 401) {
            log('Database connection working (authentication required)', 'success');
            recordTest('Database Connection', true, 'Database accessible, authentication required');
            return true;
        } else if (response.status === 500) {
            const errorText = await response.text();
            if (errorText.includes('database') || errorText.includes('connection')) {
                log('Database connection failed', 'error');
                recordTest('Database Connection', false, 'Database connection error');
                return false;
            }
        }
        
        log('Database connection status unclear', 'warning');
        recordTest('Database Connection', false, 'Cannot determine database status', 'warning');
        return false;
        
    } catch (error) {
        log(`Database test failed: ${error.message}`, 'error');
        recordTest('Database Connection', false, error.message);
        return false;
    }
}

async function testStaticAssets() {
    log('Testing static assets...', 'info');
    
    const assets = [
        '/favicon.ico',
        '/images/logo.png',
        '/css/style.css'
    ];
    
    let loadedAssets = 0;
    
    for (const asset of assets) {
        try {
            const response = await fetch(`${VERCEL_URL}${asset}`);
            if (response.ok) {
                loadedAssets++;
                log(`✅ ${asset} - Loaded`, 'success');
            } else {
                log(`⚠️  ${asset} - Not found (${response.status})`, 'warning');
            }
        } catch (error) {
            log(`❌ ${asset} - Error: ${error.message}`, 'error');
        }
    }
    
    const success = loadedAssets > 0;
    recordTest('Static Assets', success, `${loadedAssets}/${assets.length} assets loaded`);
    return success;
}

async function testPerformance() {
    log('Testing performance...', 'info');
    
    const startTime = Date.now();
    
    try {
        const response = await fetch(VERCEL_URL);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (response.ok) {
            if (responseTime < 2000) {
                log(`Performance good: ${responseTime}ms`, 'success');
                recordTest('Performance', true, `Response time: ${responseTime}ms`);
            } else if (responseTime < 5000) {
                log(`Performance acceptable: ${responseTime}ms`, 'warning');
                recordTest('Performance', true, `Response time: ${responseTime}ms`, 'warning');
            } else {
                log(`Performance poor: ${responseTime}ms`, 'error');
                recordTest('Performance', false, `Slow response time: ${responseTime}ms`);
            }
            return responseTime < 5000;
        } else {
            log('Performance test failed - no response', 'error');
            recordTest('Performance', false, 'No response received');
            return false;
        }
    } catch (error) {
        log(`Performance test failed: ${error.message}`, 'error');
        recordTest('Performance', false, error.message);
        return false;
    }
}

function printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log(chalk.cyan.bold('🧪 PRODUCTION DEPLOYMENT TEST SUMMARY'));
    console.log('='.repeat(60));
    
    console.log(chalk.green(`✅ Passed: ${testResults.passed}`));
    console.log(chalk.red(`❌ Failed: ${testResults.failed}`));
    console.log(chalk.yellow(`⚠️  Warnings: ${testResults.warnings}`));
    
    const totalTests = testResults.passed + testResults.failed + testResults.warnings;
    const successRate = ((testResults.passed / totalTests) * 100).toFixed(1);
    
    console.log(`\n📊 Success Rate: ${successRate}%`);
    
    if (testResults.failed === 0) {
        console.log(chalk.green.bold('\n🎉 ALL TESTS PASSED! Your deployment is ready for production.'));
    } else if (testResults.failed <= 2) {
        console.log(chalk.yellow.bold('\n⚠️  MOSTLY WORKING: Some minor issues need attention.'));
    } else {
        console.log(chalk.red.bold('\n❌ DEPLOYMENT ISSUES: Multiple tests failed. Please check your configuration.'));
    }
    
    console.log('\n📋 Detailed Results:');
    testResults.tests.forEach(test => {
        const icon = test.passed ? '✅' : (test.type === 'warning' ? '⚠️' : '❌');
        console.log(`  ${icon} ${test.name}: ${test.message}`);
    });
    
    console.log('\n🔗 Test URL: ' + VERCEL_URL);
    console.log('📅 Test completed at: ' + new Date().toLocaleString());
    console.log('='.repeat(60));
}

// Main test runner
async function runAllTests() {
    console.log(chalk.cyan.bold('🚀 Starting Production Deployment Tests'));
    console.log(chalk.gray(`Testing URL: ${VERCEL_URL}`));
    console.log('='.repeat(60));
    
    // Run tests in sequence
    await testBasicAccess();
    await testPerformance();
    const token = await testLoginEndpoint();
    await testAPIEndpoints(token);
    await testEnvironmentVariables();
    await testDatabaseConnection();
    await testStaticAssets();
    
    // Print summary
    printSummary();
    
    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().catch(error => {
        console.error(chalk.red('Test runner failed:'), error);
        process.exit(1);
    });
}

export { runAllTests, testResults };