import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';

export default function CartDrawer() {
  // Достаем все необходимые функции из контекста
  const { cartItems, totalPrice, toggleCart, isOpen, updateQuantity, removeFromCart } = useCart();

  return (
    <>
      {/* Затемнение фона при открытии */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={toggleCart}
        />
      )}

      {/* Сама панель */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          
          {/* Шапка корзины */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Корзина</h2>
            <button onClick={toggleCart} className="text-2xl hover:rotate-90 transition-transform p-2">✕</button>
          </div>

          {/* Список товаров */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 text-zinc-400">
                <p className="text-lg">В корзине пока пусто</p>
                <button onClick={toggleCart} className="mt-4 underline text-black font-medium">К покупкам</button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-zinc-100 pb-6">
                  {/* Изображение */}
                  <img src={item.image} className="w-24 h-28 object-cover rounded-2xl bg-zinc-100" alt={item.name} />
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-900 mb-1">{item.name}</h4>
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2">
                        Размер: <span className="text-black">{item.size}</span>
                      </p>
                      <p className="font-semibold text-sm">{item.price.toLocaleString()} ₽</p>
                    </div>

                    {/* Управление количеством */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-zinc-100 rounded-xl p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-xs text-red-500 font-medium hover:underline p-2"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Итог и кнопка оформления */}
          {cartItems.length > 0 && (
            <div className="border-t border-zinc-100 pt-6 mt-6">
              <div className="flex justify-between items-center text-sm text-zinc-500 mb-2">
                <span>Доставка</span>
                <span>Бесплатно</span>
              </div>
              <div className="flex justify-between text-2xl font-bold mb-8">
                <span>Итого:</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              <Link 
                to="/checkout" 
                onClick={toggleCart}
                className="block w-full bg-black text-white py-5 rounded-[20px] font-bold text-center hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-zinc-200"
              >
                Оформить заказ
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}