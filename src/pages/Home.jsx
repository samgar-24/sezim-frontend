import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'https://sezim-backend-production.up.railway.app';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products/`);
        setProducts(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B2929]"></div>
    </div>
  );

  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-20">
      
      {/* СЕКЦИЯ БРЕНД ПЛАТФОРМЫ */}
      <section className="mb-24 mt-4 text-center px-4 reveal">
        <h2 className="text-[9px] md:text-[11px] font-medium uppercase tracking-[0.5em] text-[#BBBCB9] mb-8">
          sezim — kózge korinbeitin
        </h2>
        <p className="max-w-3xl mx-auto text-2xl md:text-5xl font-light leading-[1.1] tracking-tighter text-[#2B2929]">
          Одежда как <span className="italic">эмоциональный</span> подарок. <br />
          Передаем чувства, <br className="md:hidden" />
          <span className="opacity-40 font-extralight italic text-xl md:text-4xl">которые сложно сказать.</span>
        </p>
      </section>

      {/* ЗАГОЛОВОК КОЛЛЕКЦИИ */}
      <div className="mb-12 px-2 reveal delay-1">
        <div className="flex items-end justify-between border-b border-[#BBBCB9]/20 pb-4">
          <h1 className="text-2xl md:text-4xl font-light tracking-tighter uppercase text-[#2B2929]">
            Новая коллекция
          </h1>
          <span className="text-[10px] font-medium text-[#BBBCB9] uppercase tracking-widest pb-1">
            Drop 26.0
          </span>
        </div>
      </div>

      {/* СЕТКА ТОВАРОВ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-10">
        {products.map((product, index) => (
          <Link 
            to={`/product/${product.id}`} 
            key={product.id} 
            className={`group flex flex-col reveal delay-${(index % 4) + 1}`}
          >
            {/* Контейнер фото */}
            <div className="aspect-[3/4] rounded-[32px] md:rounded-[48px] overflow-hidden bg-[#F7F6F3] relative mb-5">
              <img 
                // ИСПРАВЛЕНА ТОЛЬКО ЭТА СТРОКА ДЛЯ ЗАГРУЗКИ ФОТО
                src={product.image?.startsWith('http') ? product.image : `${BACKEND_URL}${product.image}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" 
                alt={product.name}
              />
              <div className="absolute inset-0 bg-[#2B2929]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Послание SEZIM на карточке */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[#F0EEE9]/40 backdrop-blur-[2px]">
                 <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#2B2929]">
                    открой чувства
                 </span>
              </div>
            </div>

            {/* Инфо */}
            <div className="px-2">
              <h3 className="text-[11px] md:text-sm font-medium uppercase tracking-tight text-[#2B2929] mb-1 group-hover:opacity-60 transition-opacity">
                {product.name}
              </h3>
              <p className="text-[9px] md:text-[10px] text-[#BBBCB9] font-medium uppercase tracking-[0.15em] mb-2">
                {product.category}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-sm md:text-lg font-light italic text-[#2B2929]">
                  {Number(product.price).toLocaleString()} ₸
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}