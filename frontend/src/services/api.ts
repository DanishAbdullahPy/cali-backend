import axios from 'axios';
import { getApiBaseUrl, getCorsConfig } from '../utils/env';

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: getCorsConfig().credentials === 'include',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData (let browser set it with boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Response interceptor to handle token expiry and CORS errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CORS errors
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.error('Network or CORS error detected. Please check server configuration.');
      // You might want to show a user-friendly message here
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    }
    
    // Handle token expiry or invalid token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle server errors
    if (error.response && error.response.status >= 500) {
      console.error('Server error detected:', error.response.data);
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    return Promise.reject(error);
  }
);

export default api;
