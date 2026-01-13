import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        
        if (result.success) {
            // Если вход успешный, просто уходим на страницу админки
            navigate('/admin-panel');
        } else {
            // Показываем ошибку только если вход НЕ удался
            alert(result.error || "Ошибка входа");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#fcfcfc]">
            <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-xl shadow-zinc-100 border border-zinc-50">
                <h2 className="text-3xl font-black mb-8 text-center tracking-tighter">Вход в систему</h2>
                
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Логин (Username)" 
                        className="w-full p-5 rounded-2xl bg-zinc-50 border-none outline-none focus:ring-2 ring-black transition-all"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Пароль" 
                        className="w-full p-5 rounded-2xl bg-zinc-50 border-none outline-none focus:ring-2 ring-black transition-all"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-black text-white py-5 rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] mt-4"
                    >
                        Войти
                    </button>
                </div>
            </form>
        </div>
    );
}