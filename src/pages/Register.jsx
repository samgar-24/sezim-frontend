import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({ firstName: '', email: '', password: '' });
  const navigate = useNavigate();

  // Актуальный URL для Railway
  const BACKEND_URL = 'https://sezim-backend-production.up.railway.app'; 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Замена 127.0.0.1 на BACKEND_URL
      await axios.post(`${BACKEND_URL}/api/register/`, formData);
      alert('Аккаунт создан! Теперь вы можете войти.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка при регистрации');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={handleRegister} className="max-w-md w-full bg-white border border-zinc-100 p-10 rounded-[40px] shadow-2xl shadow-zinc-200/50">
        <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">Join Sez</h1>
        <p className="text-zinc-400 mb-8 text-sm font-medium">Создайте аккаунт для истории заказов</p>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Ваше имя" required
            className="w-full p-5 bg-zinc-50 rounded-2xl outline-none focus:ring-2 ring-black transition-all"
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
          <input 
            type="email" placeholder="Email" required
            className="w-full p-5 bg-zinc-50 rounded-2xl outline-none focus:ring-2 ring-black transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Придумайте пароль" required
            className="w-full p-5 bg-zinc-50 rounded-2xl outline-none focus:ring-2 ring-black transition-all"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase mt-8 hover:bg-zinc-800 transition-all active:scale-[0.98]">
          Зарегистрироваться
        </button>

        <p className="mt-8 text-center text-zinc-400 text-sm">
          Уже есть аккаунт? <Link to="/login" className="text-black font-bold underline underline-offset-4">Войти</Link>
        </p>
      </form>
    </div>
  );
}