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
    const response = await fetch(`${API_BASE}/tasks`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },
  
  create: async (formData: FormData) => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
      credentials: 'include',
    });
    return handleResponse(response);
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Supervisions API
export const supervisionsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/supervisions`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },
  
  create: async (formData: FormData) => {
    const response = await fetch(`${API_BASE}/supervisions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
      credentials: 'include',
    });
    return handleResponse(response);
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/supervisions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Additional Tasks API
export const additionalTasksApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/additional-tasks`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },
  
  create: async (formData: FormData) => {
    const response = await fetch(`${API_BASE}/additional-tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
      credentials: 'include',
    });
    return handleResponse(response);
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/additional-tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },
};
