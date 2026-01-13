import { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = isLogin 
      ? await login(formData.email, formData.password)
      : await register(formData);

    if (result.success) {
      onClose(); // Закрываем окно при успехе
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-black text-2xl">&times;</button>
        
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">
          {isLogin ? 'С возвращением' : 'Создать аккаунт'}
        </h2>
        <p className="text-zinc-400 text-sm mb-6">Введите ваши данные ниже</p>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-xs font-bold mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Имя" 
              required
              className="w-full p-3 bg-zinc-100 rounded-lg outline-none focus:ring-2 ring-black/5"
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            required
            className="w-full p-3 bg-zinc-100 rounded-lg outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            required
            className="w-full p-3 bg-zinc-100 rounded-lg outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <button className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-zinc-800 transition-all mt-4">
            {isLogin ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
          </button>
        </form>

        <button 
          onClick={() => { setIsLogin(!isLogin); setError(''); }} 
          className="w-full mt-6 text-sm font-bold text-zinc-400 hover:text-black transition"
        >
          {isLogin ? 'У меня нет аккаунта →' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}