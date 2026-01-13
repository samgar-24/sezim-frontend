import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Компоненты
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';

// Страницы (убедитесь, что пути верны)
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TrackOrder from './pages/TrackOrder';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';

function App() {
  // Извлекаем isAuthenticated и user из контекста для защиты роутов
  const { isAuthenticated, user, loading } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Ждем окончания загрузки пользователя, чтобы не редиректить раньше времени
  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
      {/* Передаем функцию открытия в Header */}
      <Header onOpenAuth={() => setIsAuthOpen(true)} />

      <main className="flex-grow relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Маршруты для авторизованных пользователей */}
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/" />} 
          />
          <Route 
            path="/my-orders" 
            element={isAuthenticated ? <MyOrders /> : <Navigate to="/" />} 
          />

          {/* Маршрут для админа */}
          <Route 
            path="/admin-panel" 
            element={isAuthenticated && (user?.is_staff || user?.username === 'admin') 
              ? <AdminPanel /> 
              : <Navigate to="/" />
            } 
          />
        </Routes>
      </main>

      <CartDrawer />

      {/* Теперь модалка рендерится здесь — вне контекста хедера */}
      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
    </div>
  );
}

export default App;