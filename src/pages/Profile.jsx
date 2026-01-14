import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import OrderTracker from '../components/OrderTracker';

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [searchId, setSearchId] = useState('');
  const { token, isAuthenticated, user } = useAuth();
  const BACKEND_URL = 'https://sezim-backend-production.up.railway.app';

  useEffect(() => {
    if (isAuthenticated) {
      // Замена 127.0.0.1 на BACKEND_URL
      axios.get(`${BACKEND_URL}/api/my-orders/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
    }
  }, [token, isAuthenticated, BACKEND_URL]);

  if (!isAuthenticated) return (
    <div className="p-10 md:p-20 text-center font-bold text-zinc-400">Войдите в систему</div>
  );

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 md:py-12">
      
      {/* ШАПКА ПРОФИЛЯ */}
      <div className="mb-10 md:mb-16 border-b border-zinc-100 pb-6 md:pb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2">
          {user?.firstName || 'Пользователь'}
        </h1>
        <p className="text-zinc-400 font-bold tracking-widest text-xs md:text-sm">
          {user?.email}
        </p>
      </div>

      {/* ПОИСК ЗАКАЗА (ТЕПЕРЬ ВСЕГДА ТУТ) */}
      <div className="mb-10 bg-zinc-50 rounded-[25px] md:rounded-[40px] p-6 md:p-10 border border-zinc-100">
        <p className="text-[10px] font-black uppercase text-zinc-400 mb-3 ml-2">Найти заказ по номеру</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Номер заказа..." 
            className="flex-1 p-4 rounded-2xl border-none ring-1 ring-zinc-200 outline-none focus:ring-2 focus:ring-black transition bg-white text-sm"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button 
            onClick={() => window.location.href = `/track?id=${searchId}`}
            className="bg-black text-white px-8 py-4 sm:py-0 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            Найти
          </button>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 tracking-tighter uppercase">Мои заказы</h2>
      
      {orders.length === 0 ? (
        <p className="text-zinc-400 font-bold text-center py-10 bg-zinc-50 rounded-3xl">У вас пока нет заказов</p>
      ) : (
        <div className="space-y-6 md:space-y-10">
          {orders.map(order => (
            <div key={order.id} className="border border-zinc-100 rounded-[30px] md:rounded-[40px] p-5 md:p-8 shadow-sm bg-white">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">ID Заказа</span>
                  <span className="text-lg md:text-xl font-black tracking-tighter">#{order.track_id || order.id}</span>
                </div>
                <div className="sm:text-right w-full sm:w-auto">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Итого</span>
                  <span className="text-xl md:text-2xl font-black">{order.total_price.toLocaleString()} ₸</span>
                </div>
              </div>

              {/* ТРЕКЕР (Адаптивный внутри компонента) */}
              <div className="mb-6 overflow-x-hidden">
                <h2 className="text-[10px] font-black uppercase tracking-widest mb-4">Статус: {order.status}</h2>
                <OrderTracker status={order.status} />
              </div>

              {/* СОСТАВ ЗАКАЗА */}
              <div className="mt-8 space-y-2">
                <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Товары</p>
                <div className="grid gap-2">
                  {/* ... твой текущий маппинг товаров (из предыдущих сообщений) ... */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}