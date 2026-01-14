import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Получение данных о текущем пользователе
  const fetchMe = async () => {
    try {
      // Благодаря api.js токен прикрепится сам из localStorage
      const res = await api.get('/me/');
      setUser(res.data);
    } catch (err) {
      console.error("Ошибка загрузки профиля:", err.response?.data || err.message);
      // Если токен протух или неверный — разлогиниваем
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Вход
  const login = async (email, password) => {
    try {
      // Django SimpleJWT ожидает 'username'
      const res = await api.post('/login/', { 
        username: email, 
        password: password 
      });
      
      const newToken = res.data.access;
      localStorage.setItem('token', newToken);
      setToken(newToken); // Это сработает useEffect и вызовет fetchMe
      return { success: true };
    } catch (err) {
      console.error("Login error:", err.response?.data);
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Неверный логин или пароль' 
      };
    }
  };

  // Регистрация (добавлена для комплекта)
  const register = async (userData) => {
    try {
      // Предполагаем, что бэкенд ждет first_name, email, password
      const res = await api.post('/register/', {
        username: userData.email, // Используем email как username
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName
      });
      
      // После регистрации сразу логиним
      return await login(userData.email, userData.password);
    } catch (err) {
      console.error("Register error:", err.response?.data);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Ошибка при регистрации' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Не используем window.location.href, чтобы не перезагружать всё приложение жестко, 
    // но если нужно очистить все стейты — можно оставить.
    window.location.href = '/'; 
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
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