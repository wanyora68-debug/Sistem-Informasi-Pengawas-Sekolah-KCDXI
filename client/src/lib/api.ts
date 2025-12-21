// Direct Supabase API client - No backend needed!
import { supabase } from './supabase';

// Auth API - Direct Supabase Auth
export const authApi = {
  login: async (username: string, password: string) => {
    try {
      // First, get user from database to verify credentials
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError || !users) {
        throw new Error('Username tidak ditemukan');
      }

      // For simplicity, we'll check if password is 'admin123' for all users
      // In production, you'd use proper password hashing
      if (password !== 'admin123') {
        throw new Error('Password salah');
      }

      // Store user data in localStorage (simple session management)
      const userData = {
        id: users.id,
        username: users.username,
        full_name: users.full_name,
        role: users.role,
        nip: users.nip,
        rank: users.rank,
        photo_url: users.photo_url
      };

      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', 'simple-token-' + Date.now());

      return {
        user: userData,
        token: 'simple-token-' + Date.now()
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login gagal');
    }
  },

  logout: async () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    return { success: true };
  },

  getCurrentUser: async () => {
    const userData = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    
    if (!userData || !token) {
      throw new Error('Tidak ada session aktif');
    }

    return JSON.parse(userData);
  }
};

// Users API - Direct Supabase
export const usersApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('✅ Data users dari Supabase:', data?.length || 0, 'records');
      return data || [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      
      // Fallback to localStorage
      const localData = localStorage.getItem('users_data');
      if (localData) {
        const users = JSON.parse(localData);
        console.log('📦 Fallback ke localStorage users:', users.length, 'records');
        return users;
      }
      
      return [];
    }
  },

  create: async (userData: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          password: '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', // admin123
          full_name: userData.full_name,
          role: userData.role,
          nip: userData.nip || '',
          rank: userData.rank || '',
          photo_url: userData.photo_url || ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error('Gagal membuat user');
    }
  }
};

// Schools API - Direct Supabase
export const schoolsApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          users!schools_user_id_fkey (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('✅ Data schools dari Supabase:', data?.length || 0, 'records');
      return data || [];
    } catch (error: any) {
      console.error('Error fetching schools:', error);
      
      // Fallback to localStorage
      const localData = localStorage.getItem('schools_data');
      if (localData) {
        const schools = JSON.parse(localData);
        console.log('📦 Fallback ke localStorage schools:', schools.length, 'records');
        return schools;
      }
      
      return [];
    }
  },

  create: async (schoolData: any) => {
    try {
      // Get current user to set user_id
      const currentUser = await authApi.getCurrentUser();
      
      const { data, error } = await supabase
        .from('schools')
        .insert([{
          user_id: currentUser.id,
          name: schoolData.name,
          address: schoolData.address,
          contact: schoolData.contact || '',
          principal_name: schoolData.principal_name || ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating school:', error);
      throw new Error('Gagal membuat sekolah');
    }
  }
};

// Additional Tasks API - Direct Supabase
export const additionalTasksApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('additional_tasks')
        .select(`
          *,
          users!additional_tasks_user_id_fkey (
            username,
            full_name
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      console.log('✅ Data additional tasks dari Supabase:', data?.length || 0, 'records');
      return data || [];
    } catch (error: any) {
      console.error('Error fetching additional tasks:', error);
      
      // Fallback to localStorage
      const localData = localStorage.getItem('additional_tasks_data');
      if (localData) {
        const tasks = JSON.parse(localData);
        console.log('📦 Fallback ke localStorage additional tasks:', tasks.length, 'records');
        return tasks;
      }
      
      return [];
    }
  },

  create: async (taskData: any) => {
    try {
      // Get current user to set user_id
      const currentUser = await authApi.getCurrentUser();
      
      const { data, error } = await supabase
        .from('additional_tasks')
        .insert([{
          user_id: currentUser.id,
          name: taskData.name,
          date: taskData.date,
          location: taskData.location,
          organizer: taskData.organizer || '',
          description: taskData.description || '',
          photo1: taskData.photo1 || ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating additional task:', error);
      throw new Error('Gagal membuat tugas tambahan');
    }
  },

  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('additional_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting additional task:', error);
      throw new Error('Gagal menghapus tugas tambahan');
    }
  }
};

// Tasks API - Direct Supabase
export const tasksApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          users!tasks_user_id_fkey (
            username,
            full_name
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      console.log('✅ Data tasks dari Supabase:', data?.length || 0, 'records');
      return data || [];
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      
      // Fallback to localStorage
      const localData = localStorage.getItem('tasks_data');
      if (localData) {
        const tasks = JSON.parse(localData);
        console.log('📦 Fallback ke localStorage tasks:', tasks.length, 'records');
        return tasks;
      }
      
      return [];
    }
  },

  create: async (taskData: any) => {
    try {
      // Get current user to set user_id
      const currentUser = await authApi.getCurrentUser();
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          user_id: currentUser.id,
          title: taskData.title,
          category: taskData.category || 'Umum',
          description: taskData.description || '',
          completed: taskData.completed || false,
          date: taskData.date,
          photo1: taskData.photo1 || ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating task:', error);
      throw new Error('Gagal membuat tugas');
    }
  }
};

// Supervisions API - Direct Supabase
export const supervisionsApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('supervisions')
        .select(`
          *,
          users!supervisions_user_id_fkey (
            username,
            full_name
          ),
          schools!supervisions_school_id_fkey (
            name,
            principal_name
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      console.log('✅ Data supervisions dari Supabase:', data?.length || 0, 'records');
      return data || [];
    } catch (error: any) {
      console.error('Error fetching supervisions:', error);
      
      // Fallback to localStorage
      const localData = localStorage.getItem('supervisions_data');
      if (localData) {
        const supervisions = JSON.parse(localData);
        console.log('📦 Fallback ke localStorage supervisions:', supervisions.length, 'records');
        return supervisions;
      }
      
      return [];
    }
  },

  create: async (supervisionData: any) => {
    try {
      // Get current user to set user_id
      const currentUser = await authApi.getCurrentUser();
      
      const { data, error } = await supabase
        .from('supervisions')
        .insert([{
          user_id: currentUser.id,
          school_id: supervisionData.school_id,
          type: supervisionData.type || 'Akademik',
          date: supervisionData.date,
          findings: supervisionData.findings || '',
          recommendations: supervisionData.recommendations || '',
          photo1: supervisionData.photo1 || ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating supervision:', error);
      throw new Error('Gagal membuat supervisi');
    }
  }
};

// Dashboard API - Aggregate data from Supabase
export const dashboardApi = {
  getStats: async () => {
    try {
      const [usersData, schoolsData, tasksData, additionalTasksData] = await Promise.all([
        usersApi.getAll(),
        schoolsApi.getAll(),
        tasksApi.getAll(),
        additionalTasksApi.getAll()
      ]);

      return {
        totalUsers: usersData.length,
        totalSchools: schoolsData.length,
        totalTasks: tasksData.length,
        totalAdditionalTasks: additionalTasksData.length,
        completedTasks: tasksData.filter((task: any) => task.completed).length
      };
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalUsers: 0,
        totalSchools: 0,
        totalTasks: 0,
        totalAdditionalTasks: 0,
        completedTasks: 0
      };
    }
  }
};

// Export all APIs
export {
  authApi,
  usersApi,
  schoolsApi,
  additionalTasksApi,
  tasksApi,
  supervisionsApi,
  dashboardApi
};