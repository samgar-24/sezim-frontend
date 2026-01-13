import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Устанавливаем базовый URL, чтобы не повторять его в каждом запросе
axios.defaults.baseURL = 'https://sezim-backend-production.up.railway.app';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchMe = async (currentToken) => {
    try {
      // Исправлено: теперь используем относительный путь /api/me/
      const res = await axios.get('/api/me/', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Ошибка загрузки профиля", err);
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  // Проверка токена при обновлении страницы
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      fetchMe(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Исправлено: теперь используем относительный путь /api/login/
      const res = await axios.post('/api/login/', { 
        username: email, 
        password: password 
      });
      
      const newToken = res.data.access;
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);
      await fetchMe(newToken);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Неверный логин или пароль' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/';
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);