import axios from 'axios';

// Единое место для ссылки на бэкенд
export const BACKEND_URL = 'https://sezim-backend-production.up.railway.app';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`, // Автоматически добавляет /api ко всем запросам
});

// Добавляем перехватчик, чтобы автоматически подставлять токен, если он есть
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;