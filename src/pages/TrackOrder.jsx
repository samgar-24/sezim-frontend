import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'https://sezim-backend-production.up.railway.app';

export default function TrackOrder() {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const trackId = new URLSearchParams(location.search).get('id');

  const statuses = [
    { id: 'pending', label: 'Принят', icon: '📝' },
    { id: 'processing', label: 'Сборка', icon: '📦' },
    { id: 'shipped', label: 'В пути', icon: '🚚' },
    { id: 'delivered', label: 'Доставлен', icon: '✅' }
  ];

  useEffect(() => {
    if (trackId) {
      axios.get(`${BACKEND_URL}/api/track/${trackId}/`)
        .then(res => setOrder(res.data))
        .catch(() => setError('Заказ не найден'));
    }
  }, [trackId]);

  if (error) return <div className="p-20 text-center font-black text-red-500 uppercase tracking-widest">{error}</div>;
  if (!order) return <div className="p-20 text-center font-black italic animate-pulse">Загрузка данных...</div>;

  const currentStep = statuses.findIndex(s => s.id === order.status);

  return (
    <div className="max-w-[800px] mx-auto p-6 py-10 md:py-20">
      <div className="text-center mb-16">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Отслеживание заказа</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-[#2B2929]">{order.track_id}</h1>
      </div>

      {/* ВИЗУАЛЬНЫЙ СТАТУС-БАР */}
      <div className="relative mb-24 px-4">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-100 -translate-y-1/2 z-0 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-black -translate-y-1/2 z-0 transition-all duration-1000 rounded-full"
          style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}
        ></div>

        <div className="relative z-10 flex justify-between">
          {statuses.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                index <= currentStep ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-zinc-100 text-zinc-300'
              }`}>
                <span className="text-sm md:text-base">{step.icon}</span>
              </div>
              <p className={`mt-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] ${
                index <= currentStep ? 'text-black' : 'text-zinc-300'
              }`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ДЕТАЛИ ЗАКАЗА */}
      <div className="bg-zinc-50 rounded-[40px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 border-b border-zinc-200/50">
          <div>
            <p className="text-[9px] font-black uppercase text-zinc-400 mb-4 tracking-widest">Получатель</p>
            <p className="text-xl font-black text-[#2B2929]">{order.first_name} {order.last_name}</p>
            {/* Исправлено: если в API поля city и street раздельные, склеиваем их */}
            <p className="text-zinc-500 font-medium mt-1">
                {order.address || `${order.city}, ${order.street}`}
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-[9px] font-black uppercase text-zinc-400 mb-4 tracking-widest">К оплате</p>
            <p className="text-3xl font-black italic text-[#2B2929]">{Number(order.total_price).toLocaleString()} ₸</p>
            <p className="text-zinc-400 font-bold uppercase text-[9px] mt-2 tracking-widest">Оплата при получении</p>
          </div>
        </div>

        {/* СОСТАВ ЗАКАЗА (если API возвращает items) */}
        {order.items && order.items.length > 0 && (
          <div className="p-8 md:p-12 bg-white/50">
            <p className="text-[9px] font-black uppercase text-zinc-400 mb-6 tracking-widest">Ваши покупки</p>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
                    <img 
                      src={item.image?.startsWith('http') ? item.image : `${BACKEND_URL}${item.image}`} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black uppercase">{item.name}</p>
                    <p className="text-[10px] text-zinc-400 font-bold">Размер: {item.size} • {item.quantity} шт.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}