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
      onClose(); 
    } else {
      setError(result.error);
    }
  };

  return (
    /* Внешний контейнер (Overlay) */
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-6"
      onClick={onClose} // Закрытие при клике на фон
    >
      {/* Карточка формы */}
      <div 
        className="bg-white w-full max-w-md rounded-[40px] p-8 md:p-12 relative shadow-2xl animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()} // Чтобы клик внутри формы не закрывал её
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">
            {isLogin ? 'Вход' : 'Регистрация'}
          </h2>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-2">
            {isLogin ? 'С возвращением в Sezim' : 'Присоединяйтесь к нам'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[10px] font-bold uppercase mb-6 border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Ваше имя</label>
              <input 
                type="text" 
                placeholder="Имя" 
                required
                className="w-full p-4 bg-zinc-50 rounded-2xl outline-none focus:ring-2 ring-black transition-all"
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Email</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              required
              className="w-full p-4 bg-zinc-50 rounded-2xl outline-none focus:ring-2 ring-black transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Пароль</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full p-4 bg-zinc-50 rounded-2xl outline-none focus:ring-2 ring-black transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-zinc-800 transition-all mt-4 uppercase text-xs tracking-widest active:scale-95">
            {isLogin ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <button 
          onClick={() => { setIsLogin(!isLogin); setError(''); }} 
          className="w-full mt-8 text-[10px] font-black text-zinc-400 hover:text-black transition uppercase tracking-tighter"
        >
          {isLogin ? 'У меня нет аккаунта →' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}