/**
 * 🧪 Test Supabase Direct API - Tanpa Backend
 * Script untuk test API baru yang langsung akses Supabase
 */

console.log('🚀 TESTING SUPABASE DIRECT API');
console.log('='.repeat(50));

// Test di browser console
const testAPI = async () => {
    try {
        // Test 1: Login
        console.log('\n🔐 Testing Login...');
        const loginResult = await fetch('/client/src/lib/api.ts');
        console.log('API file accessible:', loginResult.ok);
        
        // Test 2: Check localStorage for auth
        const authUser = localStorage.getItem('auth_user');
        const authToken = localStorage.getItem('auth_token');
        
        console.log('Auth User:', authUser ? JSON.parse(authUser) : 'None');
        console.log('Auth Token:', authToken ? 'Present' : 'None');
        
        // Test 3: Manual login test
        console.log('\n👤 Testing Manual Login...');
        
        // Simulate login (you can run this in browser console)
        const testLogin = `
// Copy paste this in browser console after opening the app:

// Test login function
async function testSupabaseLogin() {
    try {
        // Import the API (this will work after the app loads)
        const { authApi } = await import('./src/lib/api.js');
        
        // Test login
        const result = await authApi.login('wawan', 'admin123');
        console.log('✅ Login successful:', result);
        
        // Test get users
        const { usersApi } = await import('./src/lib/api.js');
        const users = await usersApi.getAll();
        console.log('✅ Users loaded:', users.length, 'users');
        
        // Test get schools
        const { schoolsApi } = await import('./src/lib/api.js');
        const schools = await schoolsApi.getAll();
        console.log('✅ Schools loaded:', schools.length, 'schools');
        
        // Test get additional tasks
        const { additionalTasksApi } = await import('./src/lib/api.js');
        const tasks = await additionalTasksApi.getAll();
        console.log('✅ Additional tasks loaded:', tasks.length, 'tasks');
        
        return {
            login: result,
            users: users.length,
            schools: schools.length,
            tasks: tasks.length
        };
    } catch (error) {
        console.error('❌ Test failed:', error);
        return { error: error.message };
    }
}

// Run the test
testSupabaseLogin().then(result => {
    console.log('🎯 Test Results:', result);
});
        `;
        
        console.log('📋 Manual Test Script:');
        console.log(testLogin);
        
        console.log('\n✅ API Test Setup Complete!');
        console.log('📝 Next steps:');
        console.log('1. Run: npm run dev');
        console.log('2. Open browser console');
        console.log('3. Copy-paste the test script above');
        console.log('4. Check if login works with wawan/admin123');
        
    } catch (error) {
        console.error('❌ Test setup failed:', error);
    }
};

// Run test
testAPI();

// Export for use in browser
if (typeof window !== 'undefined') {
    window.testSupabaseAPI = testAPI;
}