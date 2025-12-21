// Fix Chrome/Opera Data - Jalankan di Console Browser
// Paste script ini di Console (F12) Chrome/Opera, lalu tekan Enter

console.log('🚀 Starting Chrome/Opera data fix...');

try {
    // 1. User Data
    const userData = {
        username: "admin",
        fullName: "H. Wawan Yogaswara, S.Pd, M.Pd",
        role: "pengawas",
        photoUrl: "/images/profile-photo.jpg"
    };
    localStorage.setItem('user_data', JSON.stringify(userData));
    console.log('✅ User data created');

    // 2. Schools Data
    const schoolsData = [
        {
            id: "school-1",
            name: "SMKN 4 Garut",
            address: "Jl. Pembangunan No. 123, Garut",
            principal: "Drs. Ahmad Suryadi, M.Pd",
            phone: "0262-123456",
            email: "smkn4garut@gmail.com",
            type: "SMK",
            accreditation: "A",
            studentCount: 850,
            teacherCount: 45,
            createdAt: new Date().toISOString()
        },
        {
            id: "school-2", 
            name: "SMKN 14 Garut",
            address: "Jl. Raya Garut-Tasikmalaya Km 10",
            principal: "Dra. Siti Nurhasanah, M.Pd",
            phone: "0262-789012",
            email: "smkn14garut@gmail.com",
            type: "SMK",
            accreditation: "A",
            studentCount: 720,
            teacherCount: 38,
            createdAt: new Date().toISOString()
        },
        {
            id: "school-3",
            name: "SMA Negeri 1 Garut",
            address: "Jl. Cimanuk No. 456, Garut",
            principal: "Dr. Bambang Sutrisno, M.Pd",
            phone: "0262-345678",
            email: "sman1garut@gmail.com", 
            type: "SMA",
            accreditation: "A",
            studentCount: 960,
            teacherCount: 52,
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('schools_data', JSON.stringify(schoolsData));
    console.log('✅ Schools data created:', schoolsData.length, 'schools');

    // 3. Tasks Data
    const tasksData = [
        {
            id: "task-1",
            title: "Supervisi dan pembinaan Kepala SMKN 14 Garut",
            description: "Melakukan supervisi pembelajaran mata pelajaran produktif",
            category: "Supervisi Akademik",
            priority: "high",
            date: "2025-01-15",
            completed: true,
            createdAt: new Date().toISOString()
        },
        {
            id: "task-2",
            title: "Evaluasi program sekolah penggerak SMKN 4 Garut",
            description: "Mengevaluasi implementasi program sekolah penggerak",
            category: "Evaluasi Program",
            priority: "medium",
            date: "2025-01-18",
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: "task-3",
            title: "Monitoring pelaksanaan kurikulum merdeka",
            description: "Memantau dan mengevaluasi pelaksanaan kurikulum merdeka",
            category: "Monitoring",
            priority: "high",
            date: "2025-01-20",
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('tasks_data', JSON.stringify(tasksData));
    console.log('✅ Tasks data created:', tasksData.length, 'tasks');

    // 4. Supervisions Data
    const supervisionsData = [
        {
            id: "supervision-1",
            school: "SMKN 4 Garut",
            type: "Akademik",
            date: "2025-01-15",
            findings: "Pembelajaran berjalan dengan baik, namun perlu peningkatan penggunaan teknologi",
            recommendations: "Tingkatkan penggunaan media pembelajaran digital",
            followUpDate: "2025-02-15",
            status: "completed",
            createdAt: new Date().toISOString()
        },
        {
            id: "supervision-2",
            school: "SMKN 14 Garut",
            type: "Manajerial",
            date: "2025-01-18",
            findings: "Manajemen sekolah sudah baik, dokumentasi perlu diperbaiki",
            recommendations: "Perbaiki sistem dokumentasi dan arsip sekolah",
            followUpDate: "2025-02-18",
            status: "completed",
            createdAt: new Date().toISOString()
        },
        {
            id: "supervision-3",
            school: "SMA Negeri 1 Garut",
            type: "Akademik",
            date: "2025-01-20",
            findings: "Kualitas pembelajaran sangat baik, siswa aktif dan antusias",
            recommendations: "Pertahankan kualitas dan tingkatkan inovasi pembelajaran",
            followUpDate: "2025-02-20",
            status: "planned",
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('supervisions_data', JSON.stringify(supervisionsData));
    console.log('✅ Supervisions data created:', supervisionsData.length, 'supervisions');

    // 5. Additional Tasks Data
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    
    const additionalTasksData = [
        {
            id: "additional-1",
            name: "Rapat Koordinasi Pengawas Sekolah",
            date: `${currentYear}-${currentMonth}-15`,
            location: "Kantor Dinas Pendidikan Provinsi Jawa Barat",
            organizer: "Dinas Pendidikan Provinsi Jawa Barat",
            description: "Rapat koordinasi bulanan membahas program supervisi sekolah",
            createdAt: `${currentYear}-${currentMonth}-15T10:00:00.000Z`
        },
        {
            id: "additional-2",
            name: "Workshop Implementasi Kurikulum Merdeka",
            date: `${currentYear}-${currentMonth}-18`,
            location: "LPMP Jawa Barat, Bandung",
            organizer: "LPMP Jawa Barat",
            description: "Workshop pelatihan implementasi kurikulum merdeka untuk pengawas sekolah",
            createdAt: `${currentYear}-${currentMonth}-18T09:00:00.000Z`
        },
        {
            id: "additional-3",
            name: "Supervisi Akademik Terpadu",
            date: `${currentYear}-${currentMonth}-20`,
            location: "SMKN 4 Garut",
            organizer: "Pengawas Sekolah Wilayah III",
            description: "Kegiatan supervisi akademik terpadu melibatkan beberapa pengawas",
            createdAt: `${currentYear}-${currentMonth}-20T08:00:00.000Z`
        },
        {
            id: "additional-4",
            name: "Bimbingan Teknis Penyusunan RPS",
            date: `${currentYear}-${currentMonth}-22`,
            location: "Hotel Savoy Homann, Bandung",
            organizer: "Balai Diklat Keagamaan",
            description: "Bimbingan teknis penyusunan Rencana Pelaksanaan Supervisi (RPS)",
            createdAt: `${currentYear}-${currentMonth}-22T13:00:00.000Z`
        },
        {
            id: "additional-5",
            name: "Evaluasi Program Sekolah Penggerak",
            date: `${currentYear}-${currentMonth}-25`,
            location: "Gedung Sate, Bandung",
            organizer: "Kemendikbudristek",
            description: "Kegiatan evaluasi dan monitoring program sekolah penggerak",
            createdAt: `${currentYear}-${currentMonth}-25T14:00:00.000Z`
        },
        {
            id: "additional-6",
            name: "Sosialisasi Asesmen Nasional",
            date: `${currentYear}-${currentMonth}-28`,
            location: "Aula LPMP Jawa Barat",
            organizer: "Pusat Asesmen dan Pembelajaran",
            description: "Sosialisasi pelaksanaan Asesmen Nasional tahun 2025",
            createdAt: `${currentYear}-${currentMonth}-28T10:00:00.000Z`
        }
    ];
    localStorage.setItem('additional_tasks_data', JSON.stringify(additionalTasksData));
    console.log('✅ Additional tasks data created:', additionalTasksData.length, 'additional tasks');

    // 6. Events Data
    const eventsData = [
        {
            id: "event-1",
            title: "Rapat Koordinasi Bulanan",
            date: "2025-01-25",
            time: "09:00",
            location: "Dinas Pendidikan",
            description: "Rapat koordinasi pengawas sekolah se-kabupaten",
            createdAt: new Date().toISOString()
        },
        {
            id: "event-2",
            title: "Workshop Kurikulum Merdeka",
            date: "2025-01-30",
            time: "08:00",
            location: "LPMP Jawa Barat",
            description: "Pelatihan implementasi kurikulum merdeka",
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('events_data', JSON.stringify(eventsData));
    console.log('✅ Events data created:', eventsData.length, 'events');

    // Create backup
    const allData = {
        user_data: userData,
        schools_data: schoolsData,
        tasks_data: tasksData,
        supervisions_data: supervisionsData,
        additional_tasks_data: additionalTasksData,
        events_data: eventsData
    };
    
    localStorage.setItem('data_backup', JSON.stringify(allData));
    localStorage.setItem('data_created_at', new Date().toISOString());
    localStorage.setItem('data_created_by', 'fix-chrome-opera-script');

    // Success summary
    const totalItems = 1 + schoolsData.length + tasksData.length + supervisionsData.length + additionalTasksData.length + eventsData.length;
    
    console.log('🎉 SUCCESS! All data created successfully!');
    console.log('📊 Summary:');
    console.log('- User:', 1);
    console.log('- Schools:', schoolsData.length);
    console.log('- Tasks:', tasksData.length);
    console.log('- Supervisions:', supervisionsData.length);
    console.log('- Additional Tasks:', additionalTasksData.length);
    console.log('- Events:', eventsData.length);
    console.log('- Total Items:', totalItems);
    console.log('');
    console.log('🔄 NEXT STEPS:');
    console.log('1. Refresh halaman aplikasi (F5)');
    console.log('2. Atau buka: http://localhost:5000');
    console.log('3. Dashboard akan menampilkan data lengkap!');
    console.log('');
    console.log('📊 Expected Dashboard Stats:');
    console.log('- Total Tugas: 3');
    console.log('- Tugas Selesai: 1');
    console.log('- Sekolah Binaan: 3');
    console.log('- Supervisi Bulan Ini: 3');

} catch (error) {
    console.error('❌ Error creating data:', error);
    console.log('💡 Try refreshing this page and run the script again.');
}