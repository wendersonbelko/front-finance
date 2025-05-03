// src/api.ts
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'https://backend.belko.com.br',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permite o envio de cookies
});

api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = Cookies.get('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const token = Cookies.get('token');
      if (token) {
        // Remove todos os cookies
        document.cookie.split(';').forEach(cookie => {
          const name = cookie.split('=')[0].trim();
          Cookies.remove(name);
        });
        // Recarrega a página
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
