import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useInfiniteProducts } from './useInfiniteProducts';
import { productService } from '../services/api';

// Mock API service
jest.mock('../services/api', () => ({
  productService: {
    getProducts: jest.fn(),
  },
}));

describe('useInfiniteProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should fetch products on mount', async () => {
    const mockProducts = Array.from({ length: 20 }, (_, i) => ({
      CODPROD: i + 1,
      PRODUTO: `Product ${i + 1}`,
    }));

    productService.getProducts.mockResolvedValue({ data: mockProducts });

    const { result } = renderHook(() => useInfiniteProducts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should display first 12 products
    expect(result.current.products).toHaveLength(12);
    expect(result.current.allProductsCount).toBe(20);
    expect(result.current.hasMore).toBe(true);
  });

  it('should load more products when loadMore is called', async () => {
    const mockProducts = Array.from({ length: 25 }, (_, i) => ({
      CODPROD: i + 1,
      PRODUTO: `Product ${i + 1}`,
    }));

    productService.getProducts.mockResolvedValue({ data: mockProducts });

    const { result } = renderHook(() => useInfiniteProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(12);
    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.loadingMore).toBe(true);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.loadingMore).toBe(false);
      expect(result.current.products).toHaveLength(24);
      expect(result.current.hasMore).toBe(true);
    });
  });

  it('should set hasMore to false when all products are loaded', async () => {
    const mockProducts = Array.from({ length: 10 }, (_, i) => ({
      CODPROD: i + 1,
      PRODUTO: `Product ${i + 1}`,
    }));

    productService.getProducts.mockResolvedValue({ data: mockProducts });

    const { result } = renderHook(() => useInfiniteProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(10);
    expect(result.current.hasMore).toBe(false);
  });

  it('should not load more when already loading', async () => {
    const mockProducts = Array.from({ length: 20 }, (_, i) => ({
      CODPROD: i + 1,
      PRODUTO: `Product ${i + 1}`,
    }));

    productService.getProducts.mockResolvedValue({ data: mockProducts });

    const { result } = renderHook(() => useInfiniteProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.loadMore();
    });

    // Try to load more while already loading
    act(() => {
      result.current.loadMore();
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      // Should only load once
      expect(result.current.products.length).toBeLessThanOrEqual(24);
    });
  });

  it('should handle errors gracefully', async () => {
    const error = {
      response: { data: { message: 'Failed to load products' } },
    };
    productService.getProducts.mockRejectedValue(error);

    const { result } = renderHook(() => useInfiniteProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load products');
    expect(result.current.products).toEqual([]);
  });

  it('should refetch products when refetch is called', async () => {
    const mockProducts = Array.from({ length: 15 }, (_, i) => ({
      CODPROD: i + 1,
      PRODUTO: `Product ${i + 1}`,
    }));

    productService.getProducts.mockResolvedValue({ data: mockProducts });

    const { result } = renderHook(() => useInfiniteProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    productService.getProducts.mockClear();

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalled();
    });
  });

  it('should apply filters when provided', async () => {
    const filters = { category: 'ELETRÔNICOS' };
    productService.getProducts.mockResolvedValue({ data: [] });

    renderHook(() => useInfiniteProducts(filters));

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(filters);
    });
  });

  it('should reset displayed products when filters change', async () => {
    const mockProducts1 = Array.from({ length: 15 }, (_, i) => ({
      CODPROD: i + 1,
      PRODUTO: `Product ${i + 1}`,
    }));

    const mockProducts2 = Array.from({ length: 10 }, (_, i) => ({
      CODPROD: i + 1,
      PRODUTO: `Product ${i + 1}`,
    }));

    productService.getProducts
      .mockResolvedValueOnce({ data: mockProducts1 })
      .mockResolvedValueOnce({ data: mockProducts2 });

    const { result, rerender } = renderHook(
      ({ filters }) => useInfiniteProducts(filters),
      { initialProps: { filters: { category: 'ELETRÔNICOS' } } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(12);

    rerender({ filters: { category: 'FASHION' } });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should reset to first page
    expect(result.current.products).toHaveLength(10);
  });
});

