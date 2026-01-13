import { useEffect, useState } from 'react';
import axios from 'axios';

// Базовый URL сервера (убедись, что axios.defaults.baseURL настроен в App.js или AuthContext, 
// но для надежности пропишем константу для картинок)
const API_URL = 'https://sezim-backend-production.up.railway.app';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [trackId, setTrackId] = useState('');
  const [activeOrderId, setActiveOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Проверь, access_token или token ты используешь
        // ИСПРАВЛЕНО: заменено на относительный путь или полный URL Railway
        const res = await axios.get(`${API_URL}/api/my-orders/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) { console.log(err); }
    };
    fetchOrders();
  }, []);

  const toggleOrder = (id) => {
    setActiveOrderId(activeOrderId === id ? null : id);
  };

  return (
    <div className="max-w-[800px] mx-auto p-6 pb-20">
      <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase italic">Мои заказы</h1>

      {/* СЕКЦИЯ ПОИСКА */}
      <div className="mb-12 p-6 bg-zinc-50 rounded-[35px] border border-zinc-200">
        <label className="text-[10px] font-black uppercase tracking-widest ml-2 mb-2 block text-zinc-400">Найти гостевой заказ</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Номер заказа (напр. 2026...)"
            className="flex-1 p-4 rounded-2xl border border-zinc-200 outline-none focus:ring-2 ring-black transition-all"
            onChange={(e) => setTrackId(e.target.value)}
          />
          <button 
            onClick={() => window.location.href = `/track?id=${trackId}`}
            className="bg-black text-white px-6 py-4 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95"
          >
            Найти
          </button>
        </div>
      </div>

      {/* СПИСОК С РАЗВОРОТОМ */}
      <div className="space-y-4">
        {orders.map(order => (
          <div 
            key={order.id} 
            className={`border transition-all duration-300 rounded-[30px] overflow-hidden ${
              activeOrderId === order.id ? 'border-black bg-white shadow-xl' : 'border-zinc-100 bg-zinc-50/50'
            }`}
          >
            {/* Шапка заказа */}
            <div 
              onClick={() => toggleOrder(order.id)}
              className="p-6 cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase">Заказ от {new Date(order.created_at).toLocaleDateString()}</p>
                <p className="font-black text-lg tracking-tight">{order.track_id}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-black text-lg">{order.total_price} ₸</p>
                  <p className="text-[10px] font-bold uppercase text-zinc-500">{order.status}</p>
                </div>
                <div className={`transition-transform duration-300 ${activeOrderId === order.id ? 'rotate-180' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* РАЗВОРАЧИВАЕМАЯ ЧАСТЬ */}
            <div className={`transition-all duration-500 ease-in-out ${
              activeOrderId === order.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="p-6 pt-0 border-t border-zinc-100 mt-2">
                <div className="py-4">
                  <p className="text-[10px] font-black uppercase text-zinc-400 mb-3">Детали доставки:</p>
                  <p className="text-sm font-medium">{order.first_name} {order.last_name}</p>
                  <p className="text-sm text-zinc-500">{order.address}</p>
                </div>
                
                <div className="py-4 border-t border-zinc-50">
                  <p className="text-[10px] font-black uppercase text-zinc-400 mb-4">Состав заказа:</p>
                  <div className="space-y-3">
                    {order.items_details && order.items_details.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-zinc-50 p-2 pr-4 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-zinc-100 flex-shrink-0">
                            {item.image ? (
                              <img 
                                // ИСПРАВЛЕНО: адрес картинки теперь тоже ведет на Railway
                                src={`${API_URL}${item.image}`} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-[8px] font-bold text-zinc-400 uppercase">
                                No Photo
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <p className="text-sm font-black tracking-tight leading-none mb-1">{item.name}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                              Кол-во: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-black italic">{item.price * item.quantity} ₸</p>
                      </div>
                    ))}
                  </div>
                </div>

                <a 
                  href={`/track?id=${order.track_id}`}
                  className="block text-center mt-4 p-4 border-2 border-black rounded-2xl font-black uppercase text-xs hover:bg-black hover:text-white transition-colors"
                >
                  Открыть страницу отслеживания
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}