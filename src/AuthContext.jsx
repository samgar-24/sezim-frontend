import { createContext, useContext, useState, useEffect } from 'react';
import api from './api'; // Импортируем ваш настроенный экземпляр

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchMe = async (currentToken) => {
    try {
      // Используем api вместо axios
      const res = await api.get('/me/', {
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

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchMe(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // ВАЖНО: Django SimpleJWT ожидает 'username'
      const res = await api.post('/login/', { 
        username: email, 
        password: password 
      });
      
      const newToken = res.data.access;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      await fetchMe(newToken);
      return { success: true };
    } catch (err) {
      // Выводим реальную ошибку в консоль, чтобы не было "тишины"
      console.error("Login detail error:", err.response?.data);
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Ошибка авторизации' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);