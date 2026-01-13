import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Импортируем хук авторизации

import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
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
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
      <Header />

      {/* Добавляем flex-grow, чтобы контент занимал всё пространство, 
          и relative, чтобы дочерние абсолютные элементы не вылетали */}
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
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-orders" 
            element={isAuthenticated ? <MyOrders /> : <Navigate to="/login" />} 
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
    </div>
  );
}

export default App;