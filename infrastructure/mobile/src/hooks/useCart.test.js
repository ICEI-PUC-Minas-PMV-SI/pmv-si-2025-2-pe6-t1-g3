import { renderHook } from '@testing-library/react-native';
import { useCart } from './useCart';
import { useCart as useCartContext } from '../contexts/CartContext';

// Mock the context
jest.mock('../contexts/CartContext', () => ({
  useCart: jest.fn(),
}));

describe('useCart hook', () => {
  it('should return context value', () => {
    const mockCartValue = {
      cartItems: [],
      cartCount: 0,
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateCartItem: jest.fn(),
      clearCart: jest.fn(),
    };

    useCartContext.mockReturnValue(mockCartValue);

    const { result } = renderHook(() => useCart());

    expect(result.current).toEqual(mockCartValue);
    expect(useCartContext).toHaveBeenCalled();
  });
});

