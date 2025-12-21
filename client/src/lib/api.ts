// API client for backend communication

const API_BASE = '/api';

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      throw new Error('Silakan login terlebih dahulu');
    }
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'An error occurred');
  }
  return response.json();
}

// Tasks API
export const tasksApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        return handleResponse(response);
      }
    } catch (error) {
      console.log('Tasks API failed, using localStorage fallback');
    }
    
    // Fallback to localStorage
    const tasksData = localStorage.getItem('tasks_data');
    return tasksData ? JSON.parse(tasksData) : [];
  },
  
  create: async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
        credentials: 'include',
      });
      if (response.ok) {
        return handleResponse(response);
      }
    } catch (error) {
      console.log('Tasks API failed, using localStorage fallback');
    }
    
    // Fallback to localStorage
    const tasksData = localStorage.getItem('tasks_data');
    const currentTasks = tasksData ? JSON.parse(tasksData) : [];
    
    // Convert FormData to object with proper async file handling
    const taskData: any = {};
    const filePromises: Promise<void>[] = [];
    
    formData.forEach((value, key) => {
      if (key.startsWith('photo') && value instanceof File) {
        // Convert file to base64 for localStorage
        const promise = new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            taskData[key] = reader.result;
            resolve();
          };
          reader.readAsDataURL(value);
        });
        filePromises.push(promise);
      } else {
        taskData[key] = value;
      }
    });
    
    // Wait for all file conversions to complete
    await Promise.all(filePromises);
    
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      date: taskData.date || new Date().toISOString().split('T')[0],
      completed: taskData.completed === 'true',
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...currentTasks, newTask];
    localStorage.setItem('tasks_data', JSON.stringify(updatedTasks));
    
    return newTask;
  },
  
  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (response.ok) {
        return handleResponse(response);
      }
    } catch (error) {
      console.log('Tasks API failed, using localStorage fallback');
    }
    
    // Fallback to localStorage
    const tasksData = localStorage.getItem('tasks_data');
    const currentTasks = tasksData ? JSON.parse(tasksData) : [];
    
    const updatedTasks = currentTasks.filter((task: any) => task.id !== id);
    localStorage.setItem('tasks_data', JSON.stringify(updatedTasks));
    
    return { success: true };
  },
};

// Supervisions API - DISABLED: Using localStorage only to prevent 405 errors
export const supervisionsApi = {
  getAll: async () => {
    // Direct localStorage only - no API calls
    const supervisionsData = localStorage.getItem('supervisions_data');
    return supervisionsData ? JSON.parse(supervisionsData) : [];
  },
  
  create: async (formData: FormData) => {
    // Direct localStorage only - no API calls
    const supervisionsData = localStorage.getItem('supervisions_data');
    const currentSupervisions = supervisionsData ? JSON.parse(supervisionsData) : [];
    
    // Convert FormData to object with proper async file handling
    const supervisionData: any = {};
    const filePromises: Promise<void>[] = [];
    
    formData.forEach((value, key) => {
      if (key.startsWith('photo') && value instanceof File) {
        // Convert file to base64 for localStorage
        const promise = new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            supervisionData[key] = reader.result;
            resolve();
          };
          reader.readAsDataURL(value);
        });
        filePromises.push(promise);
      } else {
        supervisionData[key] = value;
      }
    });
    
    // Wait for all file conversions to complete
    await Promise.all(filePromises);
    
    const newSupervision = {
      id: Date.now().toString(),
      ...supervisionData,
      createdAt: new Date().toISOString()
    };
    
    const updatedSupervisions = [...currentSupervisions, newSupervision];
    localStorage.setItem('supervisions_data', JSON.stringify(updatedSupervisions));
    localStorage.setItem('supervisions_data_backup', JSON.stringify(updatedSupervisions));
    
    return newSupervision;
  },
  
  delete: async (id: string) => {
    // Direct localStorage only - no API calls
    const supervisionsData = localStorage.getItem('supervisions_data');
    const currentSupervisions = supervisionsData ? JSON.parse(supervisionsData) : [];
    
    const updatedSupervisions = currentSupervisions.filter((supervision: any) => supervision.id !== id);
    localStorage.setItem('supervisions_data', JSON.stringify(updatedSupervisions));
    localStorage.setItem('supervisions_data_backup', JSON.stringify(updatedSupervisions));
    
    return { success: true };
  },
};

// Additional Tasks API - DISABLED: Using localStorage only to prevent 405 errors
export const additionalTasksApi = {
  getAll: async () => {
    // Direct localStorage only - no API calls
    const additionalTasksData = localStorage.getItem('additional_tasks_data');
    return additionalTasksData ? JSON.parse(additionalTasksData) : [];
  },
  
  create: async (formData: FormData) => {
    // Direct localStorage only - no API calls
    const additionalTasksData = localStorage.getItem('additional_tasks_data');
    const currentAdditionalTasks = additionalTasksData ? JSON.parse(additionalTasksData) : [];
    
    // Convert FormData to object with proper async file handling
    const taskData: any = {};
    const filePromises: Promise<void>[] = [];
    
    formData.forEach((value, key) => {
      if (key.startsWith('photo') && value instanceof File) {
        // Convert file to base64 for localStorage
        const promise = new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            taskData[key] = reader.result;
            resolve();
          };
          reader.readAsDataURL(value);
        });
        filePromises.push(promise);
      } else {
        taskData[key] = value;
      }
    });
    
    // Wait for all file conversions to complete
    await Promise.all(filePromises);
    
    const newAdditionalTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString()
    };
    
    const updatedAdditionalTasks = [...currentAdditionalTasks, newAdditionalTask];
    localStorage.setItem('additional_tasks_data', JSON.stringify(updatedAdditionalTasks));
    localStorage.setItem('additional_tasks_data_backup', JSON.stringify(updatedAdditionalTasks));
    
    return newAdditionalTask;
  },
  
  delete: async (id: string) => {
    // Direct localStorage only - no API calls
    const additionalTasksData = localStorage.getItem('additional_tasks_data');
    const currentAdditionalTasks = additionalTasksData ? JSON.parse(additionalTasksData) : [];
    
    const updatedAdditionalTasks = currentAdditionalTasks.filter((task: any) => task.id !== id);
    localStorage.setItem('additional_tasks_data', JSON.stringify(updatedAdditionalTasks));
    localStorage.setItem('additional_tasks_data_backup', JSON.stringify(updatedAdditionalTasks));
    
    return { success: true };
  },
};
