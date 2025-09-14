import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(stored);
  }, []);

  const addToCart = (item) => {
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
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const value = {
    cartItems,
    cartCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
    addToCart,
    setCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
