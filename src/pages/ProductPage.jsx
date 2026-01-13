import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/')
      .then(res => {
        const found = res.data.find(p => p.id === parseInt(id));
        setProduct(found);
      });
  }, [id]);

  if (!product) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B2929]"></div>
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
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-16 pb-32 md:pb-16 reveal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-24">
        
        {/* ФОТО */}
        <div className="rounded-[30px] md:rounded-[48px] overflow-hidden bg-[#F7F6F3] aspect-[4/5] -mx-2 md:mx-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* ИНФОРМАЦИЯ */}
        <div className="flex flex-col justify-center">
          <p className="text-[#BBBCB9] uppercase tracking-[0.3em] text-[10px] md:text-xs font-medium mb-2 md:mb-4">
            {product.category}
          </p>
          <h1 className="text-3xl md:text-5xl font-light mb-4 md:mb-6 tracking-tighter text-[#2B2929] uppercase leading-tight">
            {product.name}
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-8 md:mb-10 text-[#2B2929] italic">
            {Number(product.price).toLocaleString()} ₸
          </p>
          
          {/* Выбор размера */}
          <div className="mb-8 md:mb-10">
            <h3 className="text-[10px] font-medium uppercase mb-4 text-[#BBBCB9] tracking-widest">Выберите размер</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
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
                <p className="text-[#BBBCB9] text-xs italic text-center">Размеры не указаны</p>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#2B2929] text-white py-6 rounded-full font-medium uppercase text-xs tracking-[0.2em] hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Добавить в корзину
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-8 border-t border-[#BBBCB9]/20 mt-8">
            <p className="text-[#2B2929] text-[10px] uppercase tracking-widest flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Бесплатная доставка от 25 000 ₸
            </p>
            <p className="text-[#2B2929] text-[10px] uppercase tracking-widest flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#BBBCB9] rounded-full"></span>
              kózge korinbeitin
            </p>
          </div>
        </div>
      </div>

      {/* БЛОК УХОДА ЗА ЧУВСТВАМИ (теперь внутри return) */}
      <section className="mt-24 border-t border-[#BBBCB9]/20 pt-16 mb-10">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#BBBCB9] mb-12 text-center">
          инструкция по уходу за чувствами
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-3 px-6">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#2B2929]">бережное отношение</p>
            <p className="text-[11px] text-[#BBBCB9] leading-relaxed font-light">Стирайте при 30°C, чтобы сохранить тепло и мягкость послания.</p>
          </div>
          <div className="space-y-3 px-6 border-y md:border-y-0 md:border-x border-[#BBBCB9]/20 py-8 md:py-0">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#2B2929]">скрытые смыслы</p>
            <p className="text-[11px] text-[#BBBCB9] leading-relaxed font-light">Гладьте с изнанки, уделяя внимание самым важным словам.</p>
          </div>
          <div className="space-y-3 px-6">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#2B2929]">долговечность</p>
            <p className="text-[11px] text-[#BBBCB9] leading-relaxed font-light">Дарите и носите с любовью. Чувства не имеют срока годности.</p>
          </div>
        </div>
      </section>

      {/* ЛИПКАЯ КНОПКА ДЛЯ МОБИЛОК */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 p-4 bg-[#F0EEE9]/80 backdrop-blur-md border-t border-[#BBBCB9]/10 z-40">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-[#2B2929] text-white py-5 rounded-full font-medium uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-all"
        >
          В корзину • {Number(product.price).toLocaleString()} ₸
        </button>
      </div>
    </div>
  );
}