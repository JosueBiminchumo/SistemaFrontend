import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 60000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith('/auth/');
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token');
      localStorage.removeItem('mediturn_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const details = error.response?.data?.details;
    const firstDetail = details && typeof details === 'object' ? Object.values(details)[0] : null;
    const message =
      firstDetail ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      'Ocurrió un error de conexión. Intenta nuevamente.';

    return Promise.reject({ ...error, message });
  }
);

export default api;
