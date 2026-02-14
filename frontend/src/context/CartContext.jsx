import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. Initialize State from LocalStorage
  // Page load ainappudu patha data unte techukuntundi
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  // 2. Auto-Save to LocalStorage
  // Cart lo e changes jarigina ventane save aipotundi
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if item is already in cart
      const existingItem = prevItems.find((i) => i.name === item.name);
      
      if (existingItem) {
        // If yes, just increase quantity
        return prevItems.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        // If no, add new item with quantity 1
        return [...prevItems, { ...item, qty: 1 }];
      }
    });
    
    toast.success(`${item.name} added to cart! 🛒`); 
  };

  // Remove Item from Cart
  const removeFromCart = (name) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.name !== name)
    );
    toast.error('Item removed from cart');
  };

  // 3. Clear Cart (New Feature)
  // Order success ayyaka cart empty cheyadaniki idi vadali
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Calculate Total Price
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    // 'clearCart' ni value lo add chesa, so vere daggara vadukovachu
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};