// src/services/api.js - อัพเดทใหม่
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7218/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Customer API
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Stock API
export const stockAPI = {
  getAll: () => api.get('/stocks'),
  getById: (id) => api.get(`/stocks/${id}`),
  create: (data) => api.post('/stocks', data),
  update: (id, data) => api.put(`/stocks/${id}`, data),
  delete: (id) => api.delete(`/stocks/${id}`),
  getLowStock: () => api.get('/stocks/low-stock'),
  updateQuantity: (id, quantity) => api.patch(`/stocks/${id}/quantity`, quantity),
};

// Product API
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getLowStock: () => api.get('/products/low-stock'),
  updateQuantity: (id, quantity) => api.patch(`/products/${id}/quantity`, quantity),
  updatePrices: (id, prices) => api.patch(`/products/${id}/prices`, prices),
  search: (keyword) => api.get(`/products/search?keyword=${encodeURIComponent(keyword)}`),
  getStatistics: () => api.get('/products/statistics'),
};

// Bill API - อัพเดทใหม่
export const billAPI = {
  getAll: () => api.get('/bills'),
  getById: (id) => api.get(`/bills/${id}`),
  create: (data) => api.post('/bills', data),
  updateStatus: (id, status) => api.patch(`/bills/${id}/status`, JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' }
  }),
  delete: (id) => api.delete(`/bills/${id}`),
  
  // ฟีเจอร์ใหม่
  updatePayment: (id, data) => api.patch(`/bills/${id}/payment`, data),
  updateVat: (id, data) => api.patch(`/bills/${id}/vat`, data),
  updatePeople: (id, data) => api.patch(`/bills/${id}/people`, data),
  recalculate: (id) => api.post(`/bills/${id}/recalculate`),
  search: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/bills/search?${queryString}`);
  },
  getMonthlyStats: (year, month) => api.get(`/bills/monthly-stats?year=${year}&month=${month}`),
  getOverdue: () => api.get('/bills/overdue'),
  exportCSV: (fromDate, toDate) => {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    return api.get(`/bills/export?${params.toString()}`, {
      responseType: 'blob'
    });
  }
};

// Company Settings API - ใหม่
export const companyAPI = {
  getSettings: () => api.get('/companysettings'),
  updateSettings: (data) => api.post('/companysettings', data),
  deleteSettings: (id) => api.delete(`/companysettings/${id}`),
  getStatus: () => api.get('/companysettings/status'),
};

// Payment Method API - ใหม่
export const paymentMethodAPI = {
  getAll: () => api.get('/paymentmethod'),
  getById: (id) => api.get(`/paymentmethod/${id}`),
  getByCode: (code) => api.get(`/paymentmethod/by-code/${code}`),
  create: (data) => api.post('/paymentmethod', data),
  update: (id, data) => api.put(`/paymentmethod/${id}`, data),
  delete: (id) => api.delete(`/paymentmethod/${id}`),
  seedDefault: () => api.post('/paymentmethod/seed-default'),
};

export default api;