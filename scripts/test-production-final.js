#!/usr/bin/env node

/**
 * 🚀 Test Production Data Real - Verifikasi Migrasi Supabase
 * Script untuk memverifikasi bahwa data real sudah berhasil dimigrasi ke production
 */

import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PRODUCTION_URL = 'https://school-guard-manager.vercel.app';
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const requestModule = urlObj.protocol === 'https:' ? https : http;
        
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Production-Test-Script/1.0',
                ...options.headers
            }
        };

        const req = requestModule.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
                } catch (error) {
                    resolve({ status: res.statusCode, data: data, headers: res.headers });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

async function testAPIConnection() {
    log('\n🔍 Testing API Connection...', 'cyan');
    try {
        const response = await makeRequest(`${PRODUCTION_URL}/api/auth/me`);
        
        if (response.status === 200 || response.status === 401) {
            log('✅ API Connection: SUCCESS', 'green');
            log(`   Status: ${response.status}`, 'blue');
            log(`   URL: ${PRODUCTION_URL}/api/auth/me`, 'blue');
            return true;
        } else {
            log('❌ API Connection: FAILED', 'red');
            log(`   Status: ${response.status}`, 'red');
            return false;
        }
    } catch (error) {
        log('❌ API Connection: ERROR', 'red');
        log(`   Error: ${error.message}`, 'red');
        return false;
    }
}

async function testUsers() {
    log('\n👥 Testing Users Data...', 'cyan');
    try {
        const response = await makeRequest(`${PRODUCTION_URL}/api/users`);
        
        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
            log('✅ Users Data: SUCCESS', 'green');
            log(`   Total Users: ${response.data.length}`, 'blue');
            
            response.data.forEach((user, index) => {
                log(`   ${index + 1}. ${user.full_name} (${user.username}) - ${user.role}`, 'blue');
            });
            
            return { success: true, count: response.data.length };
        } else {
            log('❌ Users Data: FAILED', 'red');
            log(`   Status: ${response.status}`, 'red');
            log(`   Data: ${JSON.stringify(response.data)}`, 'red');
            return { success: false, count: 0 };
        }
    } catch (error) {
        log('❌ Users Data: ERROR', 'red');
        log(`   Error: ${error.message}`, 'red');
        return { success: false, count: 0 };
    }
}

async function testSchools() {
    log('\n🏫 Testing Schools Data...', 'cyan');
    try {
        const response = await makeRequest(`${PRODUCTION_URL}/api/schools`);
        
        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
            log('✅ Schools Data: SUCCESS', 'green');
            log(`   Total Schools: ${response.data.length}`, 'blue');
            
            // Show first 5 schools
            const schoolsToShow = response.data.slice(0, 5);
            schoolsToShow.forEach((school, index) => {
                log(`   ${index + 1}. ${school.name} - ${school.principal_name}`, 'blue');
            });
            
            if (response.data.length > 5) {
                log(`   ... dan ${response.data.length - 5} sekolah lainnya`, 'blue');
            }
            
            return { success: true, count: response.data.length };
        } else {
            log('❌ Schools Data: FAILED', 'red');
            log(`   Status: ${response.status}`, 'red');
            return { success: false, count: 0 };
        }
    } catch (error) {
        log('❌ Schools Data: ERROR', 'red');
        log(`   Error: ${error.message}`, 'red');
        return { success: false, count: 0 };
    }
}

async function testAdditionalTasks() {
    log('\n📋 Testing Additional Tasks Data...', 'cyan');
    try {
        const response = await makeRequest(`${PRODUCTION_URL}/api/additional-tasks`);
        
        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
            log('✅ Additional Tasks Data: SUCCESS', 'green');
            log(`   Total Tasks: ${response.data.length}`, 'blue');
            
            response.data.forEach((task, index) => {
                const date = new Date(task.date).toLocaleDateString('id-ID');
                log(`   ${index + 1}. ${task.name} - ${task.location} (${date})`, 'blue');
            });
            
            return { success: true, count: response.data.length };
        } else {
            log('❌ Additional Tasks Data: FAILED', 'red');
            log(`   Status: ${response.status}`, 'red');
            return { success: false, count: 0 };
        }
    } catch (error) {
        log('❌ Additional Tasks Data: ERROR', 'red');
        log(`   Error: ${error.message}`, 'red');
        return { success: false, count: 0 };
    }
}

async function testLogin() {
    log('\n🔐 Testing Login...', 'cyan');
    try {
        const response = await makeRequest(`${PRODUCTION_URL}/api/auth/login`, {
            method: 'POST',
            body: {
                username: 'wawan',
                password: 'admin123'
            }
        });
        
        if (response.status === 200 && response.data.user) {
            log('✅ Login: SUCCESS', 'green');
            log(`   User: ${response.data.user.full_name}`, 'blue');
            log(`   Username: ${response.data.user.username}`, 'blue');
            log(`   Role: ${response.data.user.role}`, 'blue');
            log(`   NIP: ${response.data.user.nip}`, 'blue');
            log(`   Rank: ${response.data.user.rank}`, 'blue');
            log(`   Token: ${response.data.token ? 'YES' : 'NO'}`, 'blue');
            return true;
        } else {
            log('❌ Login: FAILED', 'red');
            log(`   Status: ${response.status}`, 'red');
            log(`   Response: ${JSON.stringify(response.data)}`, 'red');
            return false;
        }
    } catch (error) {
        log('❌ Login: ERROR', 'red');
        log(`   Error: ${error.message}`, 'red');
        return false;
    }
}

async function testSupervisions() {
    log('\n📊 Testing Supervisions Data...', 'cyan');
    try {
        const response = await makeRequest(`${PRODUCTION_URL}/api/supervisions`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
            log('✅ Supervisions Data: SUCCESS', 'green');
            log(`   Total Supervisions: ${response.data.length}`, 'blue');
            
            if (response.data.length > 0) {
                response.data.forEach((supervision, index) => {
                    const date = new Date(supervision.date).toLocaleDateString('id-ID');
                    log(`   ${index + 1}. ${supervision.type} - ${date}`, 'blue');
                });
            }
            
            return { success: true, count: response.data.length };
        } else {
            log('❌ Supervisions Data: FAILED', 'red');
            log(`   Status: ${response.status}`, 'red');
            return { success: false, count: 0 };
        }
    } catch (error) {
        log('❌ Supervisions Data: ERROR', 'red');
        log(`   Error: ${error.message}`, 'red');
        return { success: false, count: 0 };
    }
}

async function runAllTests() {
    log('🚀 PRODUCTION DATA TEST - VERIFIKASI MIGRASI SUPABASE', 'bright');
    log('='.repeat(60), 'yellow');
    log(`Production URL: ${PRODUCTION_URL}`, 'magenta');
    log('='.repeat(60), 'yellow');

    const results = {
        apiConnection: false,
        users: { success: false, count: 0 },
        schools: { success: false, count: 0 },
        additionalTasks: { success: false, count: 0 },
        supervisions: { success: false, count: 0 },
        login: false
    };

    // Run all tests
    results.apiConnection = await testAPIConnection();
    results.users = await testUsers();
    results.schools = await testSchools();
    results.additionalTasks = await testAdditionalTasks();
    results.supervisions = await testSupervisions();
    results.login = await testLogin();

    // Summary
    log('\n📊 TEST SUMMARY', 'bright');
    log('='.repeat(40), 'yellow');
    
    const tests = [
        { name: 'API Connection', result: results.apiConnection },
        { name: 'Users Data', result: results.users.success },
        { name: 'Schools Data', result: results.schools.success },
        { name: 'Additional Tasks', result: results.additionalTasks.success },
        { name: 'Supervisions Data', result: results.supervisions.success },
        { name: 'Login Test', result: results.login }
    ];

    let passedTests = 0;
    tests.forEach(test => {
        const status = test.result ? '✅ PASS' : '❌ FAIL';
        const color = test.result ? 'green' : 'red';
        log(`${status} ${test.name}`, color);
        if (test.result) passedTests++;
    });

    log('\n📈 STATISTICS', 'bright');
    log(`• Users: ${results.users.count}`, 'blue');
    log(`• Schools: ${results.schools.count}`, 'blue');
    log(`• Additional Tasks: ${results.additionalTasks.count}`, 'blue');
    log(`• Supervisions: ${results.supervisions.count}`, 'blue');

    log('\n🎯 FINAL RESULT', 'bright');
    log(`Passed: ${passedTests}/${tests.length}`, passedTests === tests.length ? 'green' : 'yellow');
    
    if (passedTests === tests.length) {
        log('🚀 ALL TESTS PASSED! Production is ready!', 'green');
        log('\n🌐 Access your application at:', 'cyan');
        log(`   ${PRODUCTION_URL}`, 'bright');
        log('\n🔑 Login credentials:', 'cyan');
        log('   Username: wawan | Password: admin123', 'blue');
        log('   Username: yenihandayani | Password: admin123', 'blue');
        log('   Username: itasdik | Password: admin123', 'blue');
        log('   Username: admin | Password: admin123', 'blue');
    } else {
        log('⚠️ Some tests failed. Check the details above.', 'yellow');
    }

    return passedTests === tests.length;
}

// Run the tests
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        log(`Fatal error: ${error.message}`, 'red');
        process.exit(1);
    });
}

export { runAllTests, testAPIConnection, testUsers, testSchools, testAdditionalTasks, testLogin };