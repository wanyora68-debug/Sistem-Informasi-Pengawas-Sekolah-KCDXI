/**
 * 🚀 Test Production Data Real - Verifikasi Migrasi Supabase
 * Script sederhana untuk memverifikasi bahwa data real sudah berhasil dimigrasi ke production
 */

const PRODUCTION_URL = 'https://celadon-chebakia-a3bf18.netlify.app';

console.log('🚀 PRODUCTION DATA TEST - VERIFIKASI MIGRASI SUPABASE');
console.log('='.repeat(60));
console.log(`Production URL: ${PRODUCTION_URL}`);
console.log('='.repeat(60));

async function testProduction() {
    let passedTests = 0;
    let totalTests = 0;

    // Test 1: API Connection
    totalTests++;
    console.log('\n🔍 Testing API Connection...');
    try {
        const response = await fetch(`${PRODUCTION_URL}/api/auth/me`);
        if (response.ok || response.status === 401) {
            console.log('✅ API Connection: SUCCESS');
            console.log(`   Status: ${response.status}`);
            passedTests++;
        } else {
            console.log('❌ API Connection: FAILED');
            console.log(`   Status: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ API Connection: ERROR');
        console.log(`   Error: ${error.message}`);
    }

    // Test 2: Users Data
    totalTests++;
    console.log('\n👥 Testing Users Data...');
    try {
        const response = await fetch(`${PRODUCTION_URL}/api/users`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data) && data.length > 0) {
            console.log('✅ Users Data: SUCCESS');
            console.log(`   Total Users: ${data.length}`);
            data.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.full_name} (${user.username}) - ${user.role}`);
            });
            passedTests++;
        } else {
            console.log('❌ Users Data: FAILED');
            console.log(`   Status: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ Users Data: ERROR');
        console.log(`   Error: ${error.message}`);
    }

    // Test 3: Schools Data
    totalTests++;
    console.log('\n🏫 Testing Schools Data...');
    try {
        const response = await fetch(`${PRODUCTION_URL}/api/schools`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data) && data.length > 0) {
            console.log('✅ Schools Data: SUCCESS');
            console.log(`   Total Schools: ${data.length}`);
            
            // Show first 5 schools
            const schoolsToShow = data.slice(0, 5);
            schoolsToShow.forEach((school, index) => {
                console.log(`   ${index + 1}. ${school.name} - ${school.principal_name}`);
            });
            
            if (data.length > 5) {
                console.log(`   ... dan ${data.length - 5} sekolah lainnya`);
            }
            passedTests++;
        } else {
            console.log('❌ Schools Data: FAILED');
            console.log(`   Status: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ Schools Data: ERROR');
        console.log(`   Error: ${error.message}`);
    }

    // Test 4: Additional Tasks Data
    totalTests++;
    console.log('\n📋 Testing Additional Tasks Data...');
    try {
        const response = await fetch(`${PRODUCTION_URL}/api/additional-tasks`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data) && data.length > 0) {
            console.log('✅ Additional Tasks Data: SUCCESS');
            console.log(`   Total Tasks: ${data.length}`);
            
            data.forEach((task, index) => {
                const date = new Date(task.date).toLocaleDateString('id-ID');
                console.log(`   ${index + 1}. ${task.name} - ${task.location} (${date})`);
            });
            passedTests++;
        } else {
            console.log('❌ Additional Tasks Data: FAILED');
            console.log(`   Status: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ Additional Tasks Data: ERROR');
        console.log(`   Error: ${error.message}`);
    }

    // Test 5: Login
    totalTests++;
    console.log('\n🔐 Testing Login...');
    try {
        const response = await fetch(`${PRODUCTION_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'wawan',
                password: 'admin123'
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.user) {
            console.log('✅ Login: SUCCESS');
            console.log(`   User: ${data.user.full_name}`);
            console.log(`   Username: ${data.user.username}`);
            console.log(`   Role: ${data.user.role}`);
            console.log(`   NIP: ${data.user.nip}`);
            console.log(`   Rank: ${data.user.rank}`);
            console.log(`   Token: ${data.token ? 'YES' : 'NO'}`);
            passedTests++;
        } else {
            console.log('❌ Login: FAILED');
            console.log(`   Status: ${response.status}`);
            console.log(`   Response: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        console.log('❌ Login: ERROR');
        console.log(`   Error: ${error.message}`);
    }

    // Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('='.repeat(40));
    console.log(`Passed: ${passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
        console.log('🚀 ALL TESTS PASSED! Production is ready!');
        console.log('\n🌐 Access your application at:');
        console.log(`   ${PRODUCTION_URL}`);
        console.log('\n🔑 Login credentials:');
        console.log('   Username: wawan | Password: admin123');
        console.log('   Username: yenihandayani | Password: admin123');
        console.log('   Username: itasdik | Password: admin123');
        console.log('   Username: admin | Password: admin123');
    } else {
        console.log('⚠️ Some tests failed. Check the details above.');
    }

    return passedTests === totalTests;
}

// Run the test
testProduction().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
});