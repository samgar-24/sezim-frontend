import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isOpen, setIsOpen] = useState(false);

  // Очистка корзины (теперь будет доступна везде)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleCart = () => setIsOpen(!isOpen);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const isExist = prev.find(item => item.id === product.id && item.size === product.size);
      
      if (isExist) {
        return prev.map(item => 
          (item.id === product.id && item.size === product.size) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const updateQuantity = (productId, size, delta) => {
    setCartItems(prev => prev.map(item => 
      (item.id === productId && item.size === size)
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      totalPrice, 
      isOpen, 
      toggleCart,
      clearCart // <--- ОБЯЗАТЕЛЬНО ДОБАВЛЯЕМ СЮДА
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);