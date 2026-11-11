import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('astro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      const isAuthEndpoint = error.config.url.includes('/auth/executive/login') ||
                             error.config.url.includes('/auth/user/login');
      if (!isAuthEndpoint) {
        localStorage.removeItem('astro_token');
        localStorage.removeItem('astro_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
