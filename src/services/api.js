import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
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
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
//en caso queramos cambiar y poner ya el backend pues solo cambiamos el baseURL a la url del backend y ya no se tendria que cambiar nada mas//