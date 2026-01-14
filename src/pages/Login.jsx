import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // login принимает (email/username, password)
        const result = await login(username, password);
        
        setLoading(false);

        if (result.success) {
            navigate('/admin-panel');
        } else {
            // Выводим ошибку в UI вместо alert
            setError(result.error || "Неверные данные для входа");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#fcfcfc] relative z-10 py-20">
            <form 
                onSubmit={handleSubmit} 
                className="max-w-md w-full bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-zinc-200/50 border border-zinc-100"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Вход</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Панель управления Sezim</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase rounded-2xl text-center animate-shake">
                        {error}
                    </div>
                )}
                
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Логин / Email</label>
                        <input 
                            type="text" 
                            placeholder="admin_login" 
                            className="w-full p-5 rounded-2xl bg-zinc-50 border border-transparent outline-none focus:ring-2 ring-black focus:bg-white transition-all font-medium"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Пароль</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full p-5 rounded-2xl bg-zinc-50 border border-transparent outline-none focus:ring-2 ring-black focus:bg-white transition-all font-medium"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full bg-black text-white py-5 rounded-2xl font-bold transition-all active:scale-[0.98] mt-6 uppercase text-sm tracking-widest flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-zinc-800'}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Войти в систему"
                        )}
                    </button>
                </div>
                
                <p className="text-center mt-8 text-[10px] font-medium text-zinc-400 uppercase tracking-tighter">
                    Доступ только для администрации
                </p>
            </form>
        </div>
    );
}