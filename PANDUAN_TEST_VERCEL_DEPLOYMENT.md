# 🧪 Panduan Test Vercel Deployment

**Tanggal:** 21 Desember 2025  
**Status:** ✅ READY TO TEST  

---

## 🎯 Tujuan Testing

Memverifikasi bahwa aplikasi SchoolGuardManager sudah berhasil di-deploy ke Vercel dengan:
- ✅ Environment variables configured
- ✅ Database connection working
- ✅ All features functional
- ✅ Performance acceptable

---

## 🔧 Tools yang Tersedia

### **1. HTML Test Suite (Recommended)**
```
File: TEST_VERCEL_DEPLOYMENT.html
Cara: Double-click file atau buka di browser
```

**Features:**
- ✅ Interactive web-based testing
- ✅ Automated tests
- ✅ Manual checklist
- ✅ Real-time results
- ✅ User-friendly interface

### **2. Node.js Test Script**
```bash
# Install dependencies (jika belum)
npm install node-fetch chalk

# Run test script
node scripts/test-production-deployment.js
```

**Features:**
- ✅ Command-line testing
- ✅ Detailed API testing
- ✅ Performance metrics
- ✅ Automated reporting

---

## 🚀 Quick Start Testing

### **Method 1: HTML Test Suite (Easiest)**

**Step 1:** Buka file `TEST_VERCEL_DEPLOYMENT.html` di browser

**Step 2:** Masukkan URL Vercel Anda:
```
https://sistem-informasi-pengawas-sekolah-kcdy.vercel.app
```

**Step 3:** Klik "Run All Tests"

**Step 4:** Ikuti manual checklist

**Step 5:** Review hasil testing

### **Method 2: Manual Testing**

**Step 1:** Buka URL Vercel di browser

**Step 2:** Test login:
```
Username: admin
Password: admin123
```

**Step 3:** Test semua menu:
- Dashboard
- Profil
- Sekolah
- Supervisi
- Tugas
- Laporan
- Manajemen User (Admin only)

**Step 4:** Verifikasi data muncul dengan benar

---

## 📋 Testing Checklist

### **🌐 Basic Access**
- [ ] URL Vercel dapat diakses
- [ ] Halaman loading dengan benar
- [ ] No 404 atau 500 errors
- [ ] Static assets (CSS, JS, images) loaded

### **🔐 Authentication**
- [ ] Halaman login muncul
- [ ] Login dengan admin/admin123 berhasil
- [ ] Redirect ke dashboard setelah login
- [ ] Session management working
- [ ] Logout functionality working

### **📊 Dashboard**
- [ ] Dashboard menampilkan statistik
- [ ] Data real-time muncul
- [ ] Charts/graphs rendering
- [ ] Quick actions working
- [ ] Recent activities displayed

### **👤 Profile Management**
- [ ] Halaman profil dapat diakses
- [ ] Data profil muncul
- [ ] Edit profil working
- [ ] Upload foto profil working
- [ ] Save changes working

### **🏫 School Management**
- [ ] List sekolah muncul
- [ ] Add new school working
- [ ] Edit school working
- [ ] Delete school working
- [ ] Search/filter working

### **📝 Supervision Management**
- [ ] List supervisi muncul
- [ ] Add new supervision working
- [ ] Edit supervision working
- [ ] Delete supervision working
- [ ] Link to schools working

### **✅ Task Management**
- [ ] List tugas muncul
- [ ] Add new task working
- [ ] Edit task working
- [ ] Delete task working
- [ ] Mark as completed working

### **📄 Reports**
- [ ] Generate laporan working
- [ ] Export PDF working
- [ ] Print functionality working
- [ ] Filter by date working
- [ ] Data accuracy correct

### **👥 User Management (Admin)**
- [ ] List users muncul
- [ ] Add new user working
- [ ] Edit user working
- [ ] Delete user working
- [ ] Role management working

### **🔧 Technical**
- [ ] Environment variables loaded
- [ ] Database connection working
- [ ] API endpoints responding
- [ ] Error handling working
- [ ] Performance acceptable (<3s load time)

---

## 🔍 Detailed Test Scenarios

### **Test Scenario 1: New User Registration**
```
1. Go to registration page
2. Fill form with test data
3. Submit registration
4. Verify user created
5. Test login with new user
```

### **Test Scenario 2: Data CRUD Operations**
```
1. Login as admin
2. Create new school
3. Create supervision for that school
4. Create task related to supervision
5. Generate report including new data
6. Verify all data appears correctly
```

### **Test Scenario 3: File Upload**
```
1. Login as user
2. Go to profile page
3. Upload profile photo
4. Verify photo appears in sidebar
5. Test photo in different pages
```

### **Test Scenario 4: PDF Export**
```
1. Go to reports page
2. Select date range
3. Click "Export PDF"
4. Verify PDF downloads
5. Check PDF content accuracy
6. Test print functionality
```

---

## 🚨 Common Issues & Solutions

### **Issue 1: 500 Internal Server Error**
**Possible Causes:**
- Database connection failed
- Environment variables missing
- API endpoint errors

**Solutions:**
```
1. Check Vercel logs
2. Verify DATABASE_URL in environment variables
3. Test database connection manually
4. Check Supabase project status
```

### **Issue 2: Login Not Working**
**Possible Causes:**
- JWT_SECRET not configured
- Database user table empty
- Session management issues

**Solutions:**
```
1. Verify JWT_SECRET and SESSION_SECRET in env vars
2. Check if admin user exists in database
3. Test API /auth/login endpoint directly
```

### **Issue 3: Data Not Loading**
**Possible Causes:**
- Database connection issues
- API endpoints not working
- CORS issues

**Solutions:**
```
1. Check browser console for errors
2. Test API endpoints directly
3. Verify database has data
4. Check network tab in dev tools
```

### **Issue 4: Static Assets Not Loading**
**Possible Causes:**
- Build configuration issues
- File paths incorrect
- Vercel routing problems

**Solutions:**
```
1. Check vercel.json configuration
2. Verify build output directory
3. Test asset URLs directly
4. Check Vercel build logs
```

---

## 📊 Performance Benchmarks

### **Acceptable Performance:**
- **Page Load Time:** < 3 seconds
- **API Response Time:** < 1 second
- **Database Query Time:** < 500ms
- **File Upload Time:** < 5 seconds (for 5MB file)

### **Performance Testing:**
```javascript
// Test page load time
const startTime = performance.now();
window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    console.log('Page load time:', loadTime + 'ms');
});

// Test API response time
const testAPI = async () => {
    const start = performance.now();
    await fetch('/api/users');
    const end = performance.now();
    console.log('API response time:', (end - start) + 'ms');
};
```

---

## 🔧 Environment Variables Verification

### **Required Variables:**
```
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
JWT_SECRET=schoolguard-secret-key-2024
SESSION_SECRET=schoolguard-secret-key-2024
NODE_ENV=production
USE_LOCAL_STORAGE=false
```

### **Verification Methods:**

**Method 1: Check Vercel Dashboard**
```
1. Go to Vercel project settings
2. Click "Environment Variables"
3. Verify all 5 variables exist
4. Check values are correct
```

**Method 2: Test API Response**
```javascript
// Test if env vars are loaded
fetch('/api/health')
    .then(response => response.json())
    .then(data => {
        console.log('Environment status:', data);
    });
```

---

## 📱 Mobile Testing

### **Responsive Design Test:**
```
1. Open app on mobile device
2. Test all pages in portrait mode
3. Test all pages in landscape mode
4. Verify touch interactions work
5. Check form inputs on mobile
6. Test file upload on mobile
```

### **Mobile-Specific Issues:**
- Touch targets too small
- Text not readable on small screens
- Forms difficult to fill
- Images not optimized
- Slow loading on mobile networks

---

## 🔒 Security Testing

### **Basic Security Checks:**
```
1. Test unauthorized access to admin pages
2. Verify JWT token expiration
3. Test SQL injection on forms
4. Check XSS protection
5. Verify file upload restrictions
6. Test CSRF protection
```

### **Security Test Commands:**
```bash
# Test unauthorized access
curl -X GET https://your-app.vercel.app/api/users

# Test with invalid token
curl -X GET https://your-app.vercel.app/api/users \
  -H "Authorization: Bearer invalid-token"

# Test file upload restrictions
curl -X POST https://your-app.vercel.app/api/upload \
  -F "file=@malicious.exe"
```

---

## 📈 Monitoring & Logging

### **Vercel Analytics:**
```
1. Enable Vercel Analytics
2. Monitor page views
3. Check performance metrics
4. Review error rates
5. Analyze user behavior
```

### **Error Monitoring:**
```javascript
// Client-side error tracking
window.addEventListener('error', (event) => {
    console.error('Client error:', event.error);
    // Send to monitoring service
});

// API error tracking
fetch('/api/endpoint')
    .catch(error => {
        console.error('API error:', error);
        // Send to monitoring service
    });
```

---

## 🎯 Success Criteria

### **Deployment is successful if:**
- ✅ All basic functionality working
- ✅ No critical errors
- ✅ Performance within acceptable limits
- ✅ Security measures in place
- ✅ Data integrity maintained
- ✅ User experience smooth

### **Ready for Production if:**
- ✅ 95%+ tests passing
- ✅ No security vulnerabilities
- ✅ Performance benchmarks met
- ✅ Error handling robust
- ✅ Monitoring in place
- ✅ Backup strategy implemented

---

## 📞 Support & Troubleshooting

### **If Tests Fail:**
1. **Check Vercel Logs:**
   - Go to Vercel dashboard
   - Click on your deployment
   - Check "Functions" tab for errors

2. **Check Supabase Status:**
   - Go to Supabase dashboard
   - Verify project is active
   - Check database connection

3. **Verify Environment Variables:**
   - Double-check all 5 variables
   - Ensure no typos in values
   - Verify DATABASE_URL format

4. **Test Locally:**
   - Run app locally with same env vars
   - Compare local vs production behavior
   - Debug specific issues

### **Common Commands:**
```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Test database connection
node scripts/test-supabase-connection.js

# Run local tests
npm test
```

---

## 🎉 Next Steps After Successful Testing

### **1. Documentation:**
- ✅ Update README with production URL
- ✅ Document any configuration changes
- ✅ Create user guide for production

### **2. Monitoring Setup:**
- ✅ Enable Vercel Analytics
- ✅ Set up error monitoring
- ✅ Configure alerts

### **3. Backup Strategy:**
- ✅ Schedule database backups
- ✅ Export configuration
- ✅ Document recovery procedures

### **4. User Training:**
- ✅ Create user accounts
- ✅ Provide training materials
- ✅ Set up support channels

---

## 📋 Test Report Template

```
# Vercel Deployment Test Report

**Date:** [Date]
**Tester:** [Name]
**URL:** [Vercel URL]
**Version:** [App Version]

## Test Results Summary
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Warnings: [Number]

## Critical Issues
- [List any critical issues]

## Performance Metrics
- Page Load Time: [Time]
- API Response Time: [Time]
- Database Query Time: [Time]

## Recommendations
- [List recommendations]

## Sign-off
- [ ] Ready for production
- [ ] Needs fixes before production
- [ ] Requires additional testing

**Tester Signature:** [Name]
**Date:** [Date]
```

---

**🎊 SELAMAT TESTING! 🎊**

Gunakan tools yang tersedia untuk memastikan deployment Vercel Anda berjalan dengan sempurna!

---

**Last Updated:** 21 Desember 2025  
**Version:** 1.0.0  
**Status:** ✅ READY FOR TESTING