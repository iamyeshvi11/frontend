import axios from 'axios';

const API_URL = '/api/auth';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get user data
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get current user from API
  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};
