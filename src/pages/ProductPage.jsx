import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../CartContext';

const BACKEND_URL = 'https://sezim-backend-production.up.railway.app';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0); // Прокрутка вверх при открытии
    axios.get(`${BACKEND_URL}/api/products/`)
      .then(res => {
        // Важно: приводим id к одному типу (Number), чтобы поиск сработал точно
        const found = res.data.find(p => Number(p.id) === Number(id));
        setProduct(found);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B2929]"></div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20 font-light uppercase tracking-widest text-[#BBBCB9]">
      Товар не найден
    </div>
  );

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Пожалуйста, выберите размер");
      return;
    }
    addToCart({ ...product, size: selectedSize });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-16 pb-32 md:pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-24">
        
        {/* ФОТО ТОВАРА */}
        <div className="rounded-[30px] md:rounded-[48px] overflow-hidden bg-[#F7F6F3] aspect-[4/5]">
          <img 
            // Исправленная логика загрузки фото
            src={product.image?.startsWith('http') ? product.image : `${BACKEND_URL}${product.image}`} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* ИНФОРМАЦИЯ */}
        <div className="flex flex-col justify-center">
          <p className="text-[#BBBCB9] uppercase tracking-[0.3em] text-[10px] md:text-xs font-medium mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl md:text-5xl font-light mb-4 tracking-tighter text-[#2B2929] uppercase leading-tight">
            {product.name}
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-8 text-[#2B2929] italic">
            {Number(product.price).toLocaleString()} ₸
          </p>
          
          {/* Выбор размера */}
          <div className="mb-10">
            <h3 className="text-[10px] font-medium uppercase mb-4 text-[#BBBCB9] tracking-widest">Выберите размер</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes ? product.sizes.split(',').map((size) => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size.trim())}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full border font-medium transition-all text-xs
                    ${selectedSize === size.trim() 
                      ? 'border-[#2B2929] bg-[#2B2929] text-white' 
                      : 'border-[#BBBCB9]/30 text-[#BBBCB9] hover:border-[#2B2929]'}`}
                >
                  {size.trim()}
                </button>
              )) : (
                <p className="text-[#BBBCB9] text-xs italic">Размеры не указаны</p>
              )}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-[#2B2929] text-white py-6 rounded-full font-medium uppercase text-xs tracking-[0.2em] hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
}