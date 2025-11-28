import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-hot-toast'; // <--- Import Toast

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

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
    
    // ✅ NEW: Nice popup instead of alert
    toast.success(`${item.name} added to cart! 🛒`); 
  };

  // Remove Item from Cart
  const removeFromCart = (name) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.name !== name)
    );
    toast.error('Item removed from cart'); // Optional: feedback for removal
  };

  // Calculate Total Price
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};