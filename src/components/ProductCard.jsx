import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] rounded-[32px] md:rounded-[48px] overflow-hidden bg-[#F7F6F3] mb-4">
        {/* Основное фото (внешнее) */}
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
        />
        
        {/* Второе фото (внутреннее сообщение / изнанка) */}
        <img 
          src={product.innerImage || product.image} 
          alt="Inside detail"
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-105 group-hover:scale-100"
        />

        {/* Маленькая плашка "kózge korinbeitin" */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            kózge korinbeitin
          </span>
        </div>
      </div>

      <div className="px-2 space-y-1">
        <h3 className="text-sm md:text-base font-medium uppercase tracking-tight text-[#2B2929]">
          {product.name}
        </h3>
        <p className="text-[10px] md:text-xs text-[#BBBCB9] font-medium uppercase tracking-widest">
          {product.category}
        </p>
        <p className="text-sm md:text-lg font-light mt-2 italic">
          {Number(product.price).toLocaleString()} ₸
        </p>
      </div>
    </Link>
  );
}