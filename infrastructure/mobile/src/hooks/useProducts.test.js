import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useProducts, useProduct } from './useProducts';
import { productService } from '../services/api';

// Mock API service
jest.mock('../services/api', () => ({
  productService: {
    getProducts: jest.fn(),
    getProduct: jest.fn(),
  },
}));

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch products on mount', async () => {
    const mockProducts = [
      { CODPROD: 1, PRODUTO: 'Product 1', VALOR: 100 },
      { CODPROD: 2, PRODUTO: 'Product 2', VALOR: 200 },
    ];

    productService.getProducts.mockResolvedValue({ data: mockProducts });

    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it('should handle different response formats', async () => {
    const mockProducts = [{ CODPROD: 1, PRODUTO: 'Product 1' }];

    // Test with direct array response
    productService.getProducts.mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
  });

  it('should handle response with nested data array', async () => {
    const mockProducts = [{ CODPROD: 1, PRODUTO: 'Product 1' }];

    productService.getProducts.mockResolvedValue({
      data: { data: mockProducts },
    });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
  });

  it('should handle response with products array', async () => {
    const mockProducts = [{ CODPROD: 1, PRODUTO: 'Product 1' }];

    productService.getProducts.mockResolvedValue({
      data: { products: mockProducts },
    });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Network Error');
    productService.getProducts.mockRejectedValue(error);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.products).toEqual([]);
  });

  it('should handle timeout errors', async () => {
    const error = { code: 'ECONNABORTED', message: 'timeout' };
    productService.getProducts.mockRejectedValue(error);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toContain('Tempo de conexão esgotado');
  });

  it('should handle connection refused errors', async () => {
    const error = { code: 'ECONNREFUSED', message: 'Network Error' };
    productService.getProducts.mockRejectedValue(error);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toContain('Não foi possível conectar');
  });

  it('should handle 404 errors', async () => {
    const error = {
      response: { status: 404 },
    };
    productService.getProducts.mockRejectedValue(error);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toContain('Endpoint não encontrado');
  });

  it('should refetch products when refetch is called', async () => {
    const mockProducts = [{ CODPROD: 1, PRODUTO: 'Product 1' }];
    productService.getProducts.mockResolvedValue({ data: mockProducts });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    productService.getProducts.mockClear();

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalled();
    });
  });

  it('should apply filters when provided', async () => {
    const filters = { category: 'ELETRÔNICOS' };
    productService.getProducts.mockResolvedValue({ data: [] });

    renderHook(() => useProducts(filters));

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(filters);
    });
  });
});

describe('useProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch single product by id', async () => {
    const mockProduct = { CODPROD: 1, PRODUTO: 'Product 1', VALOR: 100 };
    productService.getProduct.mockResolvedValue({ data: mockProduct });

    const { result } = renderHook(() => useProduct(1));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(mockProduct);
    expect(result.current.error).toBeNull();
  });

  it('should not fetch when productId is not provided', () => {
    const { result } = renderHook(() => useProduct(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.product).toBeNull();
    expect(productService.getProduct).not.toHaveBeenCalled();
  });

  it('should handle errors when fetching product', async () => {
    const error = {
      response: { data: { message: 'Product not found' } },
    };
    productService.getProduct.mockRejectedValue(error);

    const { result } = renderHook(() => useProduct(999));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Product not found');
    expect(result.current.product).toBeNull();
  });

  it('should refetch when productId changes', async () => {
    const mockProduct1 = { CODPROD: 1, PRODUTO: 'Product 1' };
    const mockProduct2 = { CODPROD: 2, PRODUTO: 'Product 2' };

    productService.getProduct
      .mockResolvedValueOnce({ data: mockProduct1 })
      .mockResolvedValueOnce({ data: mockProduct2 });

    const { result, rerender } = renderHook(
      ({ productId }) => useProduct(productId),
      { initialProps: { productId: 1 } }
    );

    await waitFor(() => {
      expect(result.current.product).toEqual(mockProduct1);
    });

    rerender({ productId: 2 });

    await waitFor(() => {
      expect(result.current.product).toEqual(mockProduct2);
    });
  });
});

