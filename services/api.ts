import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const api = axios.create({
  baseURL: 'http://192.168.0.4:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — injetar JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — tratar 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      useAuthStore.getState().logout();
    }
    const message = error.response?.data?.mensagem || 'Erro de conexão';
    throw new Error(message);
  },
);

export default api;
