// 🚀 AUTO FIX DASHBOARD - INJECT REAL DATA
console.log('🔄 Starting automatic dashboard data injection...');

// Function to inject real data
async function autoFixDashboard() {
    try {
        console.log('📂 Loading real data from local-database.json...');
        
        // Load real data from local-database.json
        const response = await fetch('/local-database.json');
        const realData = await response.json();
        
        console.log('✅ Real data loaded:', {
            users: realData.users?.length || 0,
            tasks: realData.tasks?.length || 0,
            supervisions: realData.supervisions?.length || 0,
            schools: realData.schools?.length || 0,
            additionalTasks: realData.additionalTasks?.length || 0
        });
        
        // Inject to localStorage
        localStorage.setItem('local-database', JSON.stringify(realData));
        console.log('💾 Data injected to localStorage');
        
        // Setup current user with complete data
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        console.log('👤 Current user before update:', currentUser);
        
        // Find complete user data from realData
        const fullUserData = realData.users?.find(user => 
            user.username === currentUser.username || 
            user.id === currentUser.id ||
            user.username === 'wawan' // Default to wawan if no match
        );
        
        if (fullUserData) {
            const updatedUser = {
                ...currentUser,
                ...fullUserData,
                fullName: fullUserData.fullName || fullUserData.name || currentUser.username,
                photoUrl: fullUserData.photoUrl || fullUserData.photo || null
            };
            
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            console.log('✅ Current user updated with full data:', updatedUser);
        } else {
            // Set default user if no match found
            const defaultUser = {
                id: '1762696525337',
                username: 'wawan',
                fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
                nip: '196805301994121001',
                role: 'pengawas',
                photoUrl: '/uploads/1762830374284-750171039.jpg'
            };
            localStorage.setItem('currentUser', JSON.stringify(defaultUser));
            console.log('✅ Default user set:', defaultUser);
        }
        
        // Trigger dashboard refresh
        console.log('🔄 Refreshing dashboard...');
        
        // Dispatch custom event to trigger dashboard reload
        window.dispatchEvent(new CustomEvent('dashboardDataUpdated'));
        
        // Force reload if needed
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('❌ Error in auto fix:', error);
        
        // Fallback with demo data
        console.log('⚠️ Using fallback demo data...');
        
        const demoData = {
            users: [
                {
                    id: '1762696525337',
                    username: 'wawan',
                    fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
                    nip: '196805301994121001',
                    role: 'pengawas',
                    photoUrl: '/uploads/1762830374284-750171039.jpg'
                }
            ],
            tasks: [
                { id: '1', title: 'Input Data Sekolah Binaan', userId: '1762696525337', completed: true, date: '2024-12-20', category: 'Perencanaan' },
                { id: '2', title: 'Supervisi Pembelajaran', userId: '1762696525337', completed: false, date: '2024-12-21', category: 'Supervisi' },
                { id: '3', title: 'Evaluasi Kurikulum', userId: '1762696525337', completed: true, date: '2024-12-19', category: 'Evaluasi' }
            ],
            supervisions: [
                { id: '1', title: 'Supervisi SDN 1 Garut', userId: '1762696525337', schoolName: 'SDN 1 Garut', date: '2024-12-20', type: 'Akademik' },
                { id: '2', title: 'Supervisi SDN 2 Garut', userId: '1762696525337', schoolName: 'SDN 2 Garut', date: '2024-12-18', type: 'Manajerial' }
            ],
            schools: [
                { id: '1', name: 'SDN 1 Garut', address: 'Jl. Raya No. 1' },
                { id: '2', name: 'SDN 2 Garut', address: 'Jl. Raya No. 2' },
                { id: '3', name: 'SDN 3 Garut', address: 'Jl. Raya No. 3' },
                { id: '4', name: 'SDN 4 Garut', address: 'Jl. Raya No. 4' },
                { id: '5', name: 'SDN 5 Garut', address: 'Jl. Raya No. 5' }
            ],
            additionalTasks: [
                { id: '1', title: 'Pelatihan Guru', userId: '1762696525337', date: '2024-12-21', description: 'Pelatihan metode pembelajaran' }
            ]
        };
        
        localStorage.setItem('local-database', JSON.stringify(demoData));
        
        // Set current user
        const currentUser = {
            id: '1762696525337',
            username: 'wawan',
            fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
            nip: '196805301994121001',
            role: 'pengawas',
            photoUrl: '/uploads/1762830374284-750171039.jpg'
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        console.log('✅ Demo data injected successfully!');
        window.location.reload();
        
        return false;
    }
}

// Auto-execute when script loads
autoFixDashboard().then(success => {
    if (success) {
        console.log('🎉 Dashboard auto-fix completed successfully!');
    } else {
        console.log('⚠️ Dashboard auto-fix completed with fallback data');
    }
});