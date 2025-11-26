import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';

/**
 * Helper to render components with all context providers
 * @param {React.Component} component - Component to render
 * @param {Object} options - Provider options
 * @returns {Object} Render result
 */
export const renderWithProviders = (
  component,
  options = {}
) => {
  const {
    authValue = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    },
    cartValue = {
      cartItems: [],
      cartCount: 0,
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateCartItem: jest.fn(),
      clearCart: jest.fn(),
      setCartItems: jest.fn(),
    },
  } = options;

  const Wrapper = ({ children }) => (
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  );

  return render(component, { wrapper: Wrapper });
};

export default renderWithProviders;

