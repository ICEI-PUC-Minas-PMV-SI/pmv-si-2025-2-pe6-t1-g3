import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { storage } from '../services/storage';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await storage.getItem('cart');
        if (stored) {
          setCartItems(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCart();
  }, []);

  const addToCart = async (item) => {
    const updatedCart = [...cartItems];
    const existing = updatedCart.find(
      (i) => i.CODPROD === item.CODPROD && i.size === item.size
    );
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      updatedCart.push(item);
    }
    setCartItems(updatedCart);
    try {
      await storage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const removeFromCart = async (itemId, size) => {
    const updatedCart = cartItems.filter(
      (i) => !(i.CODPROD === itemId && i.size === size)
    );
    setCartItems(updatedCart);
    try {
      await storage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const updateCartItem = async (itemId, size, quantity) => {
    const updatedCart = cartItems.map((item) => {
      if (item.CODPROD === itemId && item.size === size) {
        return { ...item, quantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    try {
      await storage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      await storage.removeItem('cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cartItems,
    cartCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    setCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useCart() {
  return useContext(CartContext);
}

