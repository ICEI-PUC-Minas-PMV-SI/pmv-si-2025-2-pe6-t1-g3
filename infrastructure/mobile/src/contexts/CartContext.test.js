import React from 'react';
import { Text } from 'react-native';
import { render, waitFor, act } from '@testing-library/react-native';
import { CartProvider, useCart } from './CartContext';
import { storage } from '../services/storage';

// Mock dependencies
jest.mock('../services/storage');

const TestComponent = () => {
  const cart = useCart();
  return <Text testID="cart-count">{cart.cartCount}</Text>;
};

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide cart context to children', async () => {
    storage.getItem.mockResolvedValue(null);

    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(getByTestId('cart-count')).toBeTruthy();
      expect(getByTestId('cart-count').props.children).toBe(0);
    }, { timeout: 3000 });
  });

  it('should load cart from storage on mount', async () => {
    const mockCart = [
      { CODPROD: 1, quantity: 2, VALOR: 100 },
      { CODPROD: 2, quantity: 1, VALOR: 50 },
    ];

    storage.getItem.mockResolvedValue(JSON.stringify(mockCart));

    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(storage.getItem).toHaveBeenCalledWith('cart');
    });

    await waitFor(() => {
      const cartCount = getByTestId('cart-count');
      expect(cartCount).toBeTruthy();
      expect(cartCount.props.children).toBe(3); // Total quantity: 2 + 1
    }, { timeout: 3000 });
  });

  it('should add item to cart', async () => {
    storage.getItem.mockResolvedValue(null);
    storage.setItem.mockResolvedValue();

    let cartValue;
    const TestAdd = () => {
      const cart = useCart();
      cartValue = cart;
      React.useEffect(() => {
        cart.addToCart({
          CODPROD: 1,
          PRODUTO: 'Test Product',
          VALOR: 100,
          quantity: 1,
        });
      }, []);
      return null;
    };

    render(
      <CartProvider>
        <TestAdd />
      </CartProvider>
    );

    await waitFor(() => {
      expect(storage.setItem).toHaveBeenCalled();
      expect(cartValue.cartCount).toBe(1);
    });
  });

  it('should update quantity when adding existing item', async () => {
    const existingCart = [
      { CODPROD: 1, quantity: 2, VALOR: 100, size: null },
    ];

    storage.getItem.mockResolvedValue(JSON.stringify(existingCart));
    storage.setItem.mockResolvedValue();

    let cartValue;
    const TestUpdate = () => {
      const cart = useCart();
      cartValue = cart;
      return <Text testID="cart-count">{cart.cartCount}</Text>;
    };

    const { getByTestId } = render(
      <CartProvider>
        <TestUpdate />
      </CartProvider>
    );

    // Wait for cart to load from storage first
    await waitFor(() => {
      const cartCount = getByTestId('cart-count');
      expect(cartCount).toBeTruthy();
      expect(cartCount.props.children).toBe(2);
      expect(cartValue.cartItems.length).toBe(1);
    }, { timeout: 3000 });

    // Now add the item
    await act(async () => {
      await cartValue.addToCart({
        CODPROD: 1,
        quantity: 1,
        size: null,
      });
    });

    // Wait for the addition to complete
    await waitFor(() => {
      const cartCount = getByTestId('cart-count');
      expect(cartCount).toBeTruthy();
      expect(cartCount.props.children).toBe(3); // 2 + 1
      expect(cartValue.cartCount).toBe(3);
    }, { timeout: 3000 });
  });

  it('should remove item from cart', async () => {
    const existingCart = [
      { CODPROD: 1, quantity: 2, VALOR: 100, size: null },
      { CODPROD: 2, quantity: 1, VALOR: 50, size: null },
    ];

    storage.getItem.mockResolvedValue(JSON.stringify(existingCart));
    storage.setItem.mockResolvedValue();

    let cartValue;
    const TestRemove = () => {
      const cart = useCart();
      cartValue = cart;
      return <Text testID="cart-count">{cart.cartCount}</Text>;
    };

    const { getByTestId } = render(
      <CartProvider>
        <TestRemove />
      </CartProvider>
    );

    // First wait for cart to load with 2 items
    await waitFor(() => {
      expect(cartValue.cartItems.length).toBe(2);
    }, { timeout: 3000 });

    // Then manually remove the item
    await act(async () => {
      await cartValue.removeFromCart(1, null);
    });

    // Then wait for removal to complete
    await waitFor(() => {
      const cartCount = getByTestId('cart-count');
      expect(cartCount).toBeTruthy();
      expect(cartCount.props.children).toBe(1); // Only item 2 remains
      expect(cartValue.cartCount).toBe(1);
    }, { timeout: 3000 });
  });

  it('should update cart item quantity', async () => {
    const existingCart = [
      { CODPROD: 1, quantity: 2, VALOR: 100, size: null },
    ];

    storage.getItem.mockResolvedValue(JSON.stringify(existingCart));
    storage.setItem.mockResolvedValue();

    let cartValue;
    const TestUpdate = () => {
      const cart = useCart();
      cartValue = cart;
      return <Text testID="cart-count">{cart.cartCount}</Text>;
    };

    const { getByTestId } = render(
      <CartProvider>
        <TestUpdate />
      </CartProvider>
    );

    // First wait for cart to load with 1 item and quantity 2
    await waitFor(() => {
      expect(cartValue.cartItems.length).toBe(1);
      expect(cartValue.cartItems[0]?.quantity).toBe(2);
    }, { timeout: 3000 });

    // Then manually update the quantity
    await act(async () => {
      await cartValue.updateCartItem(1, null, 5);
    });

    // Then wait for update to complete
    await waitFor(() => {
      const cartCount = getByTestId('cart-count');
      expect(cartCount).toBeTruthy();
      expect(cartCount.props.children).toBe(5);
      expect(cartValue.cartCount).toBe(5);
    }, { timeout: 3000 });
  });

  it('should clear cart', async () => {
    const existingCart = [
      { CODPROD: 1, quantity: 2, VALOR: 100 },
    ];

    storage.getItem.mockResolvedValue(JSON.stringify(existingCart));
    storage.removeItem.mockResolvedValue();

    let cartValue;
    const TestClear = () => {
      const cart = useCart();
      cartValue = cart;
      React.useEffect(() => {
        cart.clearCart();
      }, []);
      return null;
    };

    render(
      <CartProvider>
        <TestClear />
      </CartProvider>
    );

    await waitFor(() => {
      expect(storage.removeItem).toHaveBeenCalledWith('cart');
      expect(cartValue.cartCount).toBe(0);
    });
  });

  it('should calculate cart count correctly', async () => {
    const mockCart = [
      { CODPROD: 1, quantity: 3, VALOR: 100 },
      { CODPROD: 2, quantity: 2, VALOR: 50 },
      { CODPROD: 3, quantity: 1, VALOR: 25 },
    ];

    storage.getItem.mockResolvedValue(JSON.stringify(mockCart));

    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      const cartCount = getByTestId('cart-count');
      expect(cartCount).toBeTruthy();
      expect(cartCount.props.children).toBe(6); // 3 + 2 + 1
    }, { timeout: 3000 });
  });

  it('should handle storage errors gracefully', async () => {
    storage.getItem.mockRejectedValue(new Error('Storage error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});

