import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import AuthModal from './AuthModal';

export default function Header() {
  const { toggleCart, cartItems } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="py-5 md:py-8 px-4 border-b border-[#BBBCB9]/20 bg-[#F0EEE9]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        
        {/* ЛОГОТИП — Дизайн из гайдбука */}
        <Link to="/" className="group flex flex-col">
          <span className="text-2xl md:text-3xl font-light tracking-[-0.05em] text-[#2B2929] leading-none">
            sezim<span className="font-medium text-[10px] align-top ml-0.5 opacity-40">®</span>
          </span>
          <span className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-[#BBBCB9] mt-1 font-medium group-hover:text-[#2B2929] transition-colors">
            kózge korinbeitin
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-10">
          <nav className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 md:gap-8">
                
                {/* Админка */}
                {(user?.is_staff || user?.username === 'admin') && (
                  <Link 
                    to="/admin-panel" 
                    className="text-[9px] md:text-[10px] font-medium bg-[#2B2929] text-[#F0EEE9] px-3 py-1.5 rounded-full tracking-widest hover:opacity-80 transition-all uppercase"
                  >
                    Admin
                  </Link>
                )}
                
                {/* Профиль */}
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 md:w-9 md:h-9 border border-[#2B2929]/10 rounded-full flex items-center justify-center text-[10px] font-medium text-[#2B2929] group-hover:bg-[#2B2929] group-hover:text-white transition-all">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <span className="hidden md:inline text-xs font-medium uppercase tracking-widest text-[#2B2929]">
                    Профиль
                  </span>
                </Link>

                {/* Кнопка Выйти */}
                <button 
                  onClick={logout} 
                  className="text-[#BBBCB9] hover:text-[#2B2929] transition-colors"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)} 
                className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-[#2B2929] hover:opacity-40 transition px-2"
              >
                Войти
              </button>
            )}
          </nav>

          {/* КОРЗИНА */}
          <button 
            onClick={toggleCart} 
            className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#2B2929] text-[#F0EEE9] rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2B2929]/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#2B2929] text-[9px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold border-2 border-[#2B2929]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[9999]"> 
          <AuthModal onClose={() => setAuthModalOpen(false)} />
        </div>
      )}
    </header>
  );
}