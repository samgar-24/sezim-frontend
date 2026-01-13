const { token } = useAuth();
const [myOrders, setMyOrders] = useState([]);

useEffect(() => {
    // Проверяем наличие токена перед запросом
    if (token) {
        axios.get('https://sezim-backend-production.up.railway.app/api/my-orders/', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setMyOrders(res.data))
        .catch(err => console.error("Ошибка загрузки заказов:", err));
    }
}, [token]); // Добавили token сюда, чтобы запрос повторился, когда он появится

// В рендере отображаем статус красиво:
const getStatusStyle = (status) => {
    switch(status) {
        case 'paid': return 'text-green-500 bg-green-50';
        case 'processing': return 'text-blue-500 bg-blue-50';
        case 'shipped': return 'text-purple-500 bg-purple-50';
        case 'delivered': return 'text-zinc-500 bg-zinc-100'; // Добавил для полноты
        default: return 'text-zinc-500 bg-zinc-50';
    }
}