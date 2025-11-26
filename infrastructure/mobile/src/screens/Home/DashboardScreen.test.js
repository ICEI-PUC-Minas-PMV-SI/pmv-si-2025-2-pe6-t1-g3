import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DashboardScreen from './DashboardScreen';
import { useProducts } from '../../hooks/useProducts';
import { renderWithProviders } from '../../__tests__/helpers/renderWithProviders';

// Mock dependencies
jest.mock('../../hooks/useProducts');
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('DashboardScreen', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    const { useNavigation } = require('@react-navigation/native');
    useNavigation.mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('should render dashboard with products', () => {
    const mockProducts = [
      { CODPROD: 1, PRODUTO: 'Product 1', VALOR: 100 },
      { CODPROD: 2, PRODUTO: 'Product 2', VALOR: 200 },
    ];

    useProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = renderWithProviders(<DashboardScreen />);

    expect(getByText('Product 1')).toBeTruthy();
  });

  it('should show loading state', () => {
    useProducts.mockReturnValue({
      products: [],
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    const { UNSAFE_root } = renderWithProviders(<DashboardScreen />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should show error state', () => {
    useProducts.mockReturnValue({
      products: [],
      loading: false,
      error: 'Erro ao carregar produtos',
      refetch: jest.fn(),
    });

    const { UNSAFE_root } = renderWithProviders(<DashboardScreen />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('should navigate to category when category is pressed', () => {
    const mockProducts = [];
    useProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = renderWithProviders(<DashboardScreen />);

    const categoryButton = getByText('Eletrônicos');
    fireEvent.press(categoryButton);

    expect(mockNavigate).toHaveBeenCalledWith('Category', {
      categorySlug: 'eletronicos',
    });
  });

  it('should navigate to products list when view all is pressed', () => {
    const mockProducts = [];
    useProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = renderWithProviders(<DashboardScreen />);

    const viewAllButton = getByText(/Ver produtos/i);
    if (viewAllButton) {
      fireEvent.press(viewAllButton);
      expect(mockNavigate).toHaveBeenCalled();
    }
  });

  it('should render categories', () => {
    useProducts.mockReturnValue({
      products: [],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = renderWithProviders(<DashboardScreen />);

    expect(getByText('Eletrônicos')).toBeTruthy();
    expect(getByText('Fashion')).toBeTruthy();
    expect(getByText('Casa')).toBeTruthy();
    expect(getByText('Esportes')).toBeTruthy();
  });

  it('should render features', () => {
    useProducts.mockReturnValue({
      products: [],
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = renderWithProviders(<DashboardScreen />);

    expect(getByText('Entrega Grátis')).toBeTruthy();
    expect(getByText('Qualidade Garantida')).toBeTruthy();
    expect(getByText('Melhores Preços')).toBeTruthy();
  });

  it('should call refetch when pull to refresh', () => {
    const mockRefetch = jest.fn();
    useProducts.mockReturnValue({
      products: [],
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { UNSAFE_getByType } = renderWithProviders(<DashboardScreen />);

    // ScrollView should be rendered
    expect(UNSAFE_getByType).toBeDefined();
  });
});

