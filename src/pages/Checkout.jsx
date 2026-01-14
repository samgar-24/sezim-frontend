import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { BACKEND_URL } from '../api'; // Убедитесь, что путь к api.js верный
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart(); 
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    street: '',
    apartment: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    // Валидация
    if (!formData.firstName || !formData.email || !formData.city) {
        alert("Пожалуйста, заполните основные поля: Имя, Email и Город");
        return;
    }

    setIsSubmitting(true);

    const orderData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        city: formData.city,
        street: formData.street,
        apartment: formData.apartment,
        items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            size: item.size 
        }))
    };

    try {
        // Запрос через централизованный api.js
        const response = await api.post('/orders/', orderData);
        const newTrackId = response.data.track_id;

        alert(`Заказ успешно оформлен! Номер для отслеживания: ${newTrackId}`);
        
        if (clearCart) clearCart(); 
        
        // Перенаправление
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            navigate(`/track?id=${newTrackId}`);
        }
    } catch (error) {
        console.error("Order Submission Error:", error.response?.data);
        const errorMessage = error.response?.data?.error || 'Произошла ошибка при оформлении заказа. Попробуйте позже.';
        alert(errorMessage);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <h2 className="text-3xl font-black uppercase mb-6 tracking-tighter">Ваша корзина пуста</h2>
        <Link to="/" className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-800 transition-all">
          Вернуться в магазин
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-16">
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10">Оформление заказа</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* ЛЕВАЯ ЧАСТЬ: ФОРМА */}
        <div className="flex-1 order-2 lg:order-1">
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">1</div>
                <h2 className="text-lg font-black uppercase tracking-tight">Контактные данные</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 ml-4">Имя *</label>
                  <input name="firstName" required onChange={handleChange} type="text" className="w-full p-5 bg-zinc-50 border-none rounded-[22px] focus:ring-2 ring-black outline-none transition font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 ml-4">Фамилия</label>
                  <input name="lastName" onChange={handleChange} type="text" className="w-full p-5 bg-zinc-50 border-none rounded-[22px] focus:ring-2 ring-black outline-none transition font-medium" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] font-black uppercase text-zinc-400 ml-4">Email для чека *</label>
                  <input name="email" required onChange={handleChange} type="email" className="w-full p-5 bg-zinc-50 border-none rounded-[22px] focus:ring-2 ring-black outline-none transition font-medium" />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">2</div>
                <h2 className="text-lg font-black uppercase tracking-tight">Адрес доставки</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-3 space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 ml-4">Город *</label>
                  <input name="city" required onChange={handleChange} type="text" className="w-full p-5 bg-zinc-50 border-none rounded-[22px] focus:ring-2 ring-black outline-none transition font-medium" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 ml-4">Улица и дом</label>
                  <input name="street" onChange={handleChange} type="text" className="w-full p-5 bg-zinc-50 border-none rounded-[22px] focus:ring-2 ring-black outline-none transition font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 ml-4">Кв / Офис</label>
                  <input name="apartment" onChange={handleChange} type="text" className="w-full p-5 bg-zinc-50 border-none rounded-[22px] focus:ring-2 ring-black outline-none transition font-medium" />
                </div>
              </div>
            </section>

            <button 
              disabled={isSubmitting}
              onClick={handleOrder}
              className={`w-full bg-black text-white py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-zinc-200 flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800 active:scale-[0.97]'}`}
            >
              {isSubmitting ? 'Обработка...' : `Подтвердить заказ • ${totalPrice.toLocaleString()} ₸`}
            </button>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: ИТОГИ */}
        <div className="w-full lg:w-[450px] order-1 lg:order-2">
          <div className="bg-zinc-50 p-6 md:p-10 rounded-[40px] sticky top-28 border border-zinc-100">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-zinc-400">Ваш заказ</h2>
            <div className="space-y-6 mb-8 overflow-y-auto max-h-[40vh] md:max-h-none pr-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-zinc-100 shrink-0">
                    <img 
                      src={item.image?.startsWith('http') ? item.image : `${BACKEND_URL}${item.image}`} 
                      className="w-full h-full object-cover" 
                      alt={item.name} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase truncate leading-tight">{item.name}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">
                      Размер: {item.size} • {item.quantity} шт.
                    </p>
                  </div>
                  <p className="text-sm font-black italic">{(item.price * item.quantity).toLocaleString()} ₸</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-zinc-200 pt-6 space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span>Доставка</span>
                <span className="text-green-500 font-bold">Бесплатно</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-widest">Итого к оплате</span>
                <span className="text-3xl font-black italic leading-none">{totalPrice.toLocaleString()} ₸</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}