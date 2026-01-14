import axios from 'axios';

const API_URL = 'https://sezim-backend-production.up.railway.app'; // Замените на ваш URL из Railway

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export default api;
export { API_URL };