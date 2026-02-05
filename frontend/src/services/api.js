import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const companyAPI = {
  getAll: () => api.get('/companies'),
  getById: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  getTheme: (id) => api.get(`/companies/${id}/theme`),
};

export const employeeAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  getAvailability: (id) => api.get(`/employees/${id}/availability`),
  createApplication: (data) => api.post('/employees/applications', data),
  getApplications: (companyId, status) => 
    api.get(`/employees/applications/company/${companyId}`, { params: { status } }),
  approveApplication: (id) => api.post(`/employees/applications/${id}/approve`),
  rejectApplication: (id) => api.post(`/employees/applications/${id}/reject`),
  setAvailability: (id, data) => api.post(`/employees/${id}/availability`, data),
};

export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  getAvailableSlots: (employeeId, date) => 
    api.get(`/appointments/employee/${employeeId}/available-slots`, { params: { date } }),
};

export const tagAPI = {
  getAll: (params) => api.get('/tags', { params }),
  create: (data) => api.post('/tags', data),
  search: (q) => api.get('/tags/search', { params: { q } }),
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export default api;
