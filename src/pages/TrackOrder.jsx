import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function TrackOrder() {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const trackId = new URLSearchParams(location.search).get('id');

  // Определяем этапы и их порядковые номера
  const statuses = [
    { id: 'pending', label: 'Принят', icon: '📝' },
    { id: 'processing', label: 'Сборка', icon: '📦' },
    { id: 'shipped', label: 'В пути', icon: '🚚' },
    { id: 'delivered', label: 'Доставлен', icon: '✅' }
  ];

  useEffect(() => {
    if (trackId) {
      // ИСПРАВЛЕНО: Заменен адрес с 127.0.0.1 на Railway
      axios.get(`https://sezim-backend-production.up.railway.app/api/track/${trackId}/`)
        .then(res => setOrder(res.data))
        .catch(() => setError('Заказ не найден'));
    }
  }, [trackId]);

  if (error) return <div className="p-20 text-center font-black text-red-500">{error}</div>;
  if (!order) return <div className="p-20 text-center font-black italic">Загрузка данных...</div>;

  // Находим индекс текущего статуса для прогресс-бара
  const currentStep = statuses.findIndex(s => s.id === order.status);

  return (
    <div className="max-w-[800px] mx-auto p-6 py-20">
      <div className="text-center mb-16">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Отслеживание заказа</p>
        <h1 className="text-5xl font-black tracking-tighter italic uppercase">{order.track_id}</h1>
      </div>

      {/* ВИЗУАЛЬНЫЙ СТАТУС-БАР */}
      <div className="relative mb-20 px-4">
        {/* Линия фона */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -translate-y-1/2 z-0 rounded-full"></div>
        
        {/* Линия активного прогресса */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 z-0 transition-all duration-1000 rounded-full"
          style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}
        ></div>

        {/* Точки этапов */}
        <div className="relative z-10 flex justify-between">
          {statuses.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                index <= currentStep ? 'bg-black border-black text-white' : 'bg-white border-zinc-100 text-zinc-300'
              }`}>
                <span className="text-sm">{step.icon}</span>
              </div>
              <p className={`mt-3 text-[10px] font-black uppercase tracking-widest ${
                index <= currentStep ? 'text-black' : 'text-zinc-300'
              }`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ДЕТАЛИ ЗАКАЗА */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-50 p-10 rounded-[40px]">
        <div>
          <p className="text-[10px] font-black uppercase text-zinc-400 mb-4">Получатель</p>
          <p className="text-xl font-black">{order.first_name} {order.last_name}</p>
          <p className="text-zinc-500 font-medium">{order.address}</p>
        </div>
        <div className="md:text-right">
          <p className="text-[10px] font-black uppercase text-zinc-400 mb-4">Сумма к оплате</p>
          <p className="text-3xl font-black italic">{order.total_price} ₸</p>
          <p className="text-zinc-400 font-bold uppercase text-[10px] mt-1">Оплата при получении</p>
        </div>
      </div>
    </div>
  );
}