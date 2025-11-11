import { useCart as useCartContext } from '../contexts/CartContext';

/**
 * Wrapper hook for CartContext
 * Provides easy access to cart state and methods
 */
export const useCart = () => {
  return useCartContext();
};

export default useCart;

