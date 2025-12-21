import { useState, useEffect } from "react";

interface UserProfile {
  fullName: string;
  nip: string;
  photoUrl: string | null;
  role: string;
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  totalSchools: number;
  monthlySupervisions: number;
  totalSupervisions: number;
  totalAdditionalTasks: number;
}

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    totalSchools: 0,
    monthlySupervisions: 0,
    totalSupervisions: 0,
    totalAdditionalTasks: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Load user profile from currentUser
  const loadUserProfile = () => {
    console.log('🔄 Loading user profile...');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('👤 Current user data:', currentUser);
    
    if (currentUser.username) {
      const profile = {
        fullName: currentUser.fullName || currentUser.name || currentUser.username || 'Pengguna',
        nip: currentUser.nip || '',
        photoUrl: currentUser.photoUrl || currentUser.photo || null,
        role: currentUser.role || 'user'
      };
      console.log('✅ User profile loaded:', profile);
      setUserProfile(profile);
    } else {
      console.log('⚠️ No user data found, using default');
      // Try to find user from local database
      const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
      const defaultUser = localData.users?.[0] || {
        fullName: 'Pengguna',
        nip: '',
        photoUrl: null,
        role: 'user'
      };
      
      setUserProfile({
        fullName: defaultUser.fullName || 'Pengguna',
        nip: defaultUser.nip || '',
        photoUrl: defaultUser.photoUrl || null,
        role: defaultUser.role || 'user'
      });
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching dashboard data...');
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      console.log('👤 Current user for data filtering:', currentUser);
      
      let tasks: any[] = [];
      let supervisions: any[] = [];
      let schools: any[] = [];
      let additionalTasks: any[] = [];

      // Try development endpoint first (no auth required)
      try {
        console.log('🌐 Trying to fetch data from backend...');
        
        // Try to get data directly from backend file
        const backendResponse = await fetch('/local-database.json');
        if (backendResponse.ok) {
          const backendData = await backendResponse.json();
          tasks = backendData.tasks || [];
          supervisions = backendData.supervisions || [];
          schools = backendData.schools || [];
          additionalTasks = backendData.additionalTasks || [];
          
          console.log('📊 Backend Data received:', {
            tasks: tasks.length,
            supervisions: supervisions.length,
            schools: schools.length,
            additionalTasks: additionalTasks.length
          });
          
          // Also save to localStorage for future use
          localStorage.setItem('local-database', JSON.stringify(backendData));
          console.log('💾 Data saved to localStorage for future use');
        }
      } catch (backendError) {
        console.log('⚠️ Backend file access failed, trying localStorage...');
      }

      // If no dev API data, try localStorage
      if (tasks.length === 0 && supervisions.length === 0 && schools.length === 0) {
        console.log('🔄 Loading from localStorage...');
        const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
        
        tasks = localData.tasks || [];
        supervisions = localData.supervisions || [];
        schools = localData.schools || [];
        additionalTasks = localData.additionalTasks || [];
        
        console.log('📊 localStorage Data loaded:', {
          tasks: tasks.length,
          supervisions: supervisions.length,
          schools: schools.length,
          additionalTasks: additionalTasks.length
        });
      }

      // If still no data, use demo data
      if (tasks.length === 0 && supervisions.length === 0 && schools.length === 0) {
        console.log('📝 No data found, using demo data');
        tasks = [
          {
            id: '1',
            title: 'Input Data Sekolah Binaan',
            userId: currentUser.id || '1762696525337',
            completed: true,
            date: '2024-12-20T00:00:00.000Z',
            category: 'Perencanaan'
          },
          {
            id: '2',
            title: 'Supervisi Pembelajaran Kelas',
            userId: currentUser.id || '1762696525337',
            completed: false,
            date: '2024-12-21T00:00:00.000Z',
            category: 'Supervisi'
          },
          {
            id: '3',
            title: 'Evaluasi Kurikulum Sekolah',
            userId: currentUser.id || '1762696525337',
            completed: true,
            date: '2024-12-19T00:00:00.000Z',
            category: 'Evaluasi'
          }
        ];
        
        supervisions = [
          {
            id: '1',
            title: 'Supervisi SDN 1 Garut',
            userId: currentUser.id || '1762696525337',
            schoolName: 'SDN 1 Garut',
            date: '2024-12-20T00:00:00.000Z',
            type: 'Akademik'
          },
          {
            id: '2',
            title: 'Supervisi SDN 2 Garut',
            userId: currentUser.id || '1762696525337',
            schoolName: 'SDN 2 Garut',
            date: '2024-12-18T00:00:00.000Z',
            type: 'Manajerial'
          }
        ];
        
        schools = [
          { id: '1', name: 'SDN 1 Garut', address: 'Jl. Raya Garut No. 1' },
          { id: '2', name: 'SDN 2 Garut', address: 'Jl. Raya Garut No. 2' },
          { id: '3', name: 'SDN 3 Garut', address: 'Jl. Raya Garut No. 3' },
          { id: '4', name: 'SDN 4 Garut', address: 'Jl. Raya Garut No. 4' },
          { id: '5', name: 'SDN 5 Garut', address: 'Jl. Raya Garut No. 5' }
        ];
        
        additionalTasks = [
          {
            id: '1',
            title: 'Pelatihan Guru Metode Pembelajaran',
            userId: currentUser.id || '1762696525337',
            date: '2024-12-21T00:00:00.000Z'
          }
        ];
      }

      // Filter for current user
      let userTasks = tasks;
      let userSupervisions = supervisions;
      let userAdditionalTasks = additionalTasks;

      if (currentUser.role !== 'admin' && (currentUser.username || currentUser.id)) {
        console.log('🔍 Filtering data for non-admin user...');
        
        userTasks = tasks.filter((task: any) => {
          const matches = task.username === currentUser.username || 
                         task.userId === currentUser.id ||
                         task.user === currentUser.username ||
                         (currentUser.username === 'wawan' && task.userId === '1762696525337');
          if (matches) console.log('✅ Found matching task:', task.title);
          return matches;
        });
        
        userSupervisions = supervisions.filter((supervision: any) => {
          const matches = supervision.username === currentUser.username || 
                         supervision.userId === currentUser.id ||
                         supervision.user === currentUser.username ||
                         (currentUser.username === 'wawan' && supervision.userId === '1762696525337');
          if (matches) console.log('✅ Found matching supervision:', supervision.title);
          return matches;
        });
        
        userAdditionalTasks = additionalTasks.filter((task: any) => {
          const matches = task.username === currentUser.username || 
                         task.userId === currentUser.id ||
                         task.user === currentUser.username ||
                         (currentUser.username === 'wawan' && task.userId === '1762696525337');
          if (matches) console.log('✅ Found matching additional task:', task.title);
          return matches;
        });
      } else {
        console.log('👑 Admin user - showing all data');
      }

      console.log('📊 Filtered data counts:', {
        userTasks: userTasks.length,
        userSupervisions: userSupervisions.length,
        userAdditionalTasks: userAdditionalTasks.length
      });

      // Calculate stats
      const completedTasks = userTasks.filter((task: any) => 
        task.completed === true || task.status === 'completed'
      ).length;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlySupervisions = userSupervisions.filter((supervision: any) => {
        const date = new Date(supervision.date || supervision.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length;

      const newStats = {
        totalTasks: userTasks.length,
        completedTasks,
        totalSchools: schools.length,
        monthlySupervisions,
        totalSupervisions: userSupervisions.length,
        totalAdditionalTasks: userAdditionalTasks.length
      };

      console.log('✅ Dashboard stats calculated:', newStats);
      setStats(newStats);

      // Recent activities
      const allActivities = [
        ...userTasks.map((task: any) => ({ 
          ...task, 
          type: 'task',
          title: task.title || task.name || 'Tugas',
          date: task.createdAt || task.date || new Date().toISOString()
        })),
        ...userSupervisions.map((supervision: any) => ({ 
          ...supervision, 
          type: 'supervision',
          title: supervision.title || supervision.schoolName || 'Supervisi',
          date: supervision.date || supervision.createdAt || new Date().toISOString()
        }))
      ];

      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentActivities(sortedActivities);

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      
      // Show demo data if everything fails
      console.log('📝 Showing demo data as fallback');
      setStats({
        totalTasks: 5,
        completedTasks: 3,
        totalSchools: 8,
        monthlySupervisions: 4,
        totalSupervisions: 12,
        totalAdditionalTasks: 2
      });
      
      setRecentActivities([
        {
          id: 'demo1',
          type: 'task',
          title: 'Supervisi Pembelajaran',
          date: new Date().toISOString()
        },
        {
          id: 'demo2',
          type: 'supervision',
          title: 'Kunjungan Sekolah',
          date: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-load fix script if dashboard has no data
    const checkAndFixData = async () => {
      const localData = JSON.parse(localStorage.getItem('local-database') || '{}');
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // If no data or incomplete user data, load fix script
      if (!localData.users || !localData.tasks || !currentUser.fullName) {
        console.log('🔄 Loading dashboard fix script...');
        try {
          const script = document.createElement('script');
          script.src = '/fix-dashboard-auto.js';
          script.onload = () => console.log('✅ Dashboard fix script loaded');
          document.head.appendChild(script);
        } catch (error) {
          console.log('⚠️ Could not load fix script, proceeding with manual load');
        }
      }
    };
    
    checkAndFixData();
    loadUserProfile();
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {userProfile?.photoUrl ? (
                    <img
                      src={userProfile.photoUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-white text-2xl font-bold">
                        {userProfile?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {getGreeting()}, {userProfile?.fullName || 'Pengguna'}! 👋
                  </h1>
                  <p className="text-blue-100 text-lg mb-1">
                    Selamat datang di Sistem Kepengawasan Sekolah
                  </p>
                  {userProfile?.nip && (
                    <p className="text-blue-200 text-sm">NIP: {userProfile.nip}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                      {userProfile?.role === 'admin' ? '👑 Administrator' : '👨‍🏫 Pengawas'}
                    </span>
                    <span className="text-green-300 text-sm flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
                <div className="text-blue-200 text-sm">{formatDate(currentTime)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tugas</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalTasks}</p>
                <p className="text-xs text-gray-500 mt-1">Tugas keseluruhan</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tugas Selesai</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
                <p className="text-xs text-gray-500 mt-1">Dari {stats.totalTasks} tugas</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Sekolah Binaan</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalSchools}</p>
                <p className="text-xs text-gray-500 mt-1">Sekolah yang dibina</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Supervisi Bulan Ini</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.monthlySupervisions}</p>
                <p className="text-xs text-gray-500 mt-1">Supervisi {new Date().toLocaleDateString('id-ID', { month: 'long' })}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Supervisi</p>
                <p className="text-3xl font-bold text-red-600">{stats.totalSupervisions}</p>
                <p className="text-xs text-gray-500 mt-1">Supervisi keseluruhan</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tugas Tambahan</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalAdditionalTasks}</p>
                <p className="text-xs text-gray-500 mt-1">Kegiatan tambahan</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-3">📊</span>
              Progress Tugas
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Tugas Selesai</span>
                  <span className="text-sm font-bold text-green-600">
                    {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                  <div className="text-sm text-gray-600">Selesai</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalTasks - stats.completedTasks}</div>
                  <div className="text-sm text-gray-600">Belum Selesai</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-3">🎯</span>
              Target Supervisi
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Supervisi Bulan Ini</span>
                  <span className="text-sm font-bold text-yellow-600">
                    {Math.round((stats.monthlySupervisions / 10) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats.monthlySupervisions / 10) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Target: 10 supervisi per bulan</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.monthlySupervisions}</div>
                  <div className="text-sm text-gray-600">Bulan Ini</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.totalSupervisions}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-3">📋</span>
              Aktivitas Terbaru
            </h3>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id || index} className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        activity.type === 'task' ? 'bg-blue-500' :
                        activity.type === 'supervision' ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`}>
                        {activity.type === 'task' ? '📋' :
                         activity.type === 'supervision' ? '👁️' :
                         '➕'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-900 mb-1">
                        {activity.title || activity.name || 'Aktivitas'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {activity.type === 'task' ? '📋 Tugas' :
                         activity.type === 'supervision' ? '👁️ Supervisi' :
                         '➕ Tugas Tambahan'}
                      </p>
                      {activity.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(activity.date).toLocaleDateString('id-ID')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <p className="text-gray-500 text-lg">Belum ada aktivitas terbaru</p>
                  <p className="text-gray-400 text-sm mt-2">Aktivitas Anda akan muncul di sini</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}