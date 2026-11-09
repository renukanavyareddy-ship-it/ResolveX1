import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resolvex_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login/register endpoints
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('resolvex_token');
        localStorage.removeItem('resolvex_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

export const complaintService = {
  create: (formData) => api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => api.get('/complaints', { params }),
  getMy: (params) => api.get('/complaints/my', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  track: (trackingId) => api.get(`/complaints/track/${trackingId}`),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
  assign: (id, data) => api.put(`/complaints/${id}/assign`, data),
  updatePriority: (id, data) => api.put(`/complaints/${id}/priority`, data),
  addResponse: (id, data) => api.post(`/complaints/${id}/response`, data),
  addInternalNote: (id, data) => api.post(`/complaints/${id}/internal-note`, data),
  reopen: (id, data) => api.put(`/complaints/${id}/reopen`, data),
  submitFeedback: (id, data) => api.post(`/complaints/${id}/feedback`, data),
  checkDuplicates: (data) => api.post('/complaints/check-duplicate', data),
  exportCSVUrl: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return `/api/complaints/export/csv${query ? `?${query}` : ''}`;
  }
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`)
};

export const notificationService = {
  getMy: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all')
};

export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard')
};

export default api;
