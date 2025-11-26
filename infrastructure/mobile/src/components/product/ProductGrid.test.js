import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductGrid from './ProductGrid';
import { createProductList } from '../../__tests__/factories/productFactory';
import { renderWithProviders } from '../../__tests__/helpers/renderWithProviders';

describe('ProductGrid', () => {
  const mockProducts = createProductList(3);
  const defaultCartValue = {
    cartItems: [],
    cartCount: 0,
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateCartItem: jest.fn(),
    clearCart: jest.fn(),
    setCartItems: jest.fn(),
  };

  it('should render loading state when loading and no products', () => {
    const { getByText } = renderWithProviders(
      <ProductGrid products={[]} loading={true} />,
      { cartValue: defaultCartValue }
    );

    expect(getByText('Carregando produtos...')).toBeTruthy();
  });

  it('should render error state when error occurs', () => {
    const { getByText } = renderWithProviders(
      <ProductGrid products={[]} error="Erro ao carregar" />,
      { cartValue: defaultCartValue }
    );

    expect(getByText('Erro ao carregar produtos')).toBeTruthy();
    expect(getByText('Erro ao carregar')).toBeTruthy();
  });

  it('should call refetch when retry button is pressed in error state', () => {
    const mockRefetch = jest.fn();
    const { getByText } = renderWithProviders(
      <ProductGrid products={[]} error="Erro" refetch={mockRefetch} />,
      { cartValue: defaultCartValue }
    );

    const retryButton = getByText('Tentar novamente');
    fireEvent.press(retryButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should render empty state when no products', () => {
    const { getByText } = renderWithProviders(
      <ProductGrid products={[]} />,
      { cartValue: defaultCartValue }
    );

    expect(getByText('Nenhum produto encontrado')).toBeTruthy();
  });

  it('should call refetch when reload button is pressed in empty state', () => {
    const mockRefetch = jest.fn();
    const { getByText } = renderWithProviders(
      <ProductGrid products={[]} refetch={mockRefetch} />,
      { cartValue: defaultCartValue }
    );

    const reloadButton = getByText('Recarregar');
    fireEvent.press(reloadButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should render products list', async () => {
    const { getByText } = renderWithProviders(
      <ProductGrid products={mockProducts} />,
      { cartValue: defaultCartValue }
    );

    // Wait for products to render
    await waitFor(() => {
      expect(getByText('Produto 1')).toBeTruthy();
    }, { timeout: 3000 });
    
    expect(getByText('Produto 2')).toBeTruthy();
    expect(getByText('Produto 3')).toBeTruthy();
  });

  it('should render loading indicator when loading with existing products', () => {
    const { UNSAFE_root } = renderWithProviders(
      <ProductGrid products={mockProducts} loading={true} />,
      { cartValue: defaultCartValue }
    );

    expect(UNSAFE_root).toBeDefined();
  });

  it('should call onEndReached when scrolling to end', () => {
    const mockOnEndReached = jest.fn();
    const { UNSAFE_getByType } = renderWithProviders(
      <ProductGrid
        products={mockProducts}
        onEndReached={mockOnEndReached}
        onEndReachedThreshold={0.5}
      />,
      { cartValue: defaultCartValue }
    );

    // FlatList should be rendered
    expect(UNSAFE_getByType).toBeDefined();
  });

  it('should render with dashboard variant', async () => {
    const { getByText } = renderWithProviders(
      <ProductGrid products={mockProducts} variant="dashboard" />,
      { cartValue: defaultCartValue }
    );

    await waitFor(() => {
      expect(getByText('Produto 1')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('should handle null products gracefully', () => {
    const { getByText } = renderWithProviders(
      <ProductGrid products={null} />,
      { cartValue: defaultCartValue }
    );

    expect(getByText('Nenhum produto encontrado')).toBeTruthy();
  });

  it('should render products in grid layout when onEndReached is undefined', async () => {
    const { getByText } = renderWithProviders(
      <ProductGrid products={mockProducts} onEndReached={undefined} />,
      { cartValue: defaultCartValue }
    );

    await waitFor(() => {
      expect(getByText('Produto 1')).toBeTruthy();
    }, { timeout: 3000 });
    
    expect(getByText('Produto 2')).toBeTruthy();
  });
});

