import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT/Firebase token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent response unwrapping
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred.',
      code: error.response?.data?.error_code || 'API_ERROR',
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

// Helper API services
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  createOpportunity: (data) => api.post('/admin/opportunities', data),
  updateOpportunity: (id, data) => api.put(`/admin/opportunities/${id}`, data),
  deleteOpportunity: (id) => api.delete(`/admin/opportunities/${id}`),
  createEvent: (data) => api.post('/admin/events', data),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
  getReports: () => api.get('/admin/reports'),
};

export const opportunitiesAPI = {
  getAll: (params) => api.get('/opportunities', { params }),
  getById: (id) => api.get(`/opportunities/${id}`),
  save: (id) => api.post('/opportunities/save', { opportunity_id: id }),
  getSaved: () => api.get('/opportunities/saved'),
  removeSaved: (id) => api.delete(`/opportunities/saved/${id}`),
};

export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  getUpcoming: (limit) => api.get('/events/upcoming', { params: { limit } }),
  save: (id) => api.post('/events/save', { event_id: id }),
  getSaved: () => api.get('/events/saved'),
  removeSaved: (id) => api.delete(`/events/saved/${id}`),
};

export default api;
