import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

// Устанавливаем базовый URL для всех запросов axios
axios.defaults.baseURL = 'https://sezim-backend-production.up.railway.app';

export default function AdminPanel() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(''); 
    const [search, setSearch] = useState(''); 
    const { isAuthenticated, token, user } = useAuth();

    // Цветовая схема для статусов
    const statusStyles = {
        pending: 'bg-orange-100 text-orange-700',
        paid: 'bg-green-100 text-green-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-zinc-100 text-zinc-500',
    };

    const fetchOrders = () => {
        if (isAuthenticated && token) {
            // Исправлено: заменено на относительный путь (база берется из axios.defaults.baseURL)
            const url = filter 
                ? `/api/orders-list/?status=${filter}` 
                : '/api/orders-list/';
            
            axios.get(url, { headers: { Authorization: `Bearer ${token}` }})
                .then(res => {
                    setOrders(res.data);
                    setLoading(false);
                })
                .catch(err => console.error("Ошибка загрузки:", err));
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [isAuthenticated, token, filter]);

    const updateStatus = (orderId, newStatus) => {
        // Исправлено: заменено на относительный путь
        axios.patch(`/api/orders/${orderId}/status/`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` }}
        ).then(() => {
            setOrders(orders.map(o => o.id === orderId ? {...o, status: newStatus} : o));
        }).catch(err => alert("Ошибка обновления статуса"));
    };

    // Парсинг товаров из строки Python в читаемый вид
    const renderItems = (itemsString) => {
        try {
            const validJson = itemsString.replace(/'/g, '"');
            const items = JSON.parse(validJson);
            return items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs border-b border-zinc-100 py-1 last:border-0">
                    <span>Товар ID: {item.id}</span>
                    <span className="font-black">x{item.quantity}</span>
                </div>
            ));
        } catch (e) {
            return <span className="text-xs text-zinc-400">{itemsString}</span>;
        }
    };

    const filteredOrders = orders.filter(o => 
        o.email.toLowerCase().includes(search.toLowerCase()) || 
        o.first_name.toLowerCase().includes(search.toLowerCase())
    );

    // Защита: проверяем, что пользователь — админ (staff)
    if (!isAuthenticated || (!user?.is_staff && user?.username !== 'admin')) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Доступ закрыт</h2>
                <p className="text-zinc-400 mb-8">У вас нет прав для просмотра этой страницы.</p>
                <Link to="/" className="bg-black text-white px-8 py-3 rounded-2xl font-bold uppercase text-xs">Вернуться в магазин</Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Управление</h1>
                    <p className="text-zinc-400 font-medium">Всего заказов: {orders.length}</p>
                </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <input 
                    type="text" 
                    placeholder="Поиск клиента..." 
                    className="flex-1 p-5 rounded-[24px] bg-zinc-100 outline-none focus:ring-2 ring-black transition-all font-medium"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['', 'pending', 'paid', 'processing', 'shipped', 'delivered'].map(s => (
                        <button 
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-6 py-4 rounded-[20px] text-[10px] font-black tracking-widest transition-all whitespace-nowrap uppercase ${
                                filter === s ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                            }`}
                        >
                            {s === '' ? 'ВСЕ' : s}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center font-bold animate-pulse uppercase tracking-widest">Загрузка базы...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white border border-zinc-100 rounded-[32px] p-8 hover:shadow-xl hover:shadow-zinc-100 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-black text-zinc-300">#{order.id}</span>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${statusStyles[order.status] || 'bg-zinc-100'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight">{order.first_name} {order.last_name}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black tracking-tighter">{order.total_price.toLocaleString()} ₸</p>
                                    <p className="text-[10px] text-zinc-400 font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Товары */}
                            <div className="bg-zinc-50 rounded-3xl p-5 mb-6">
                                <p className="text-[9px] text-zinc-400 font-black uppercase mb-3 tracking-widest">Состав посылки</p>
                                <div className="space-y-1">
                                    {renderItems(order.items)}
                                </div>
                            </div>

                            {/* Кнопки действий */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                                {['paid', 'processing', 'shipped', 'delivered'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => updateStatus(order.id, s)}
                                        className={`text-[9px] py-3 rounded-xl font-black uppercase transition-all border ${
                                            order.status === s 
                                            ? 'bg-black border-black text-white' 
                                            : 'border-zinc-100 text-zinc-400 hover:border-zinc-300'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-zinc-50 flex flex-col gap-1">
                                <p className="text-xs font-bold text-zinc-900">{order.email}</p>
                                <p className="text-[11px] text-zinc-400 leading-tight">{order.address}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}