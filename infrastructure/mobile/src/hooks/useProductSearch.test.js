import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useProductSearch } from './useProductSearch';
import { productService } from '../services/api';

// Mock API service
jest.mock('../services/api', () => ({
  productService: {
    getProducts: jest.fn(),
  },
}));

// Mock ENV
jest.mock('../utils/env', () => ({
  ENV: {
    SEARCH_DEBOUNCE_MS: () => 300,
  },
}));

describe('useProductSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should initialize with empty search term', () => {
    const { result } = renderHook(() => useProductSearch());

    expect(result.current.searchTerm).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should debounce search when searchTerm changes', async () => {
    const mockResults = [
      { CODPROD: 1, PRODUTO: 'Product 1' },
      { CODPROD: 2, PRODUTO: 'Product 2' },
    ];

    productService.getProducts.mockResolvedValue({ data: mockResults });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      result.current.setSearchTerm('test');
    });

    // Should not call API immediately
    expect(productService.getProducts).not.toHaveBeenCalled();

    // Fast-forward time to trigger debounce
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith({
        search: 'test',
      });
    });

    await waitFor(() => {
      expect(result.current.results).toEqual(mockResults);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should clear results when search term is empty', async () => {
    const mockResults = [{ CODPROD: 1, PRODUTO: 'Product 1' }];
    productService.getProducts.mockResolvedValue({ data: mockResults });

    const { result } = renderHook(() => useProductSearch());

    // Set search term
    await act(async () => {
      result.current.setSearchTerm('test');
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.results).toEqual(mockResults);
    });

    // Clear search term
    await act(async () => {
      result.current.setSearchTerm('');
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.results).toEqual([]);
    });

    expect(productService.getProducts).not.toHaveBeenCalledTimes(2);
  });

  it('should handle search errors', async () => {
    const error = {
      response: { data: { message: 'Search failed' } },
    };
    productService.getProducts.mockRejectedValue(error);

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      result.current.setSearchTerm('test');
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Search failed');
      expect(result.current.results).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should trim search term before searching', async () => {
    productService.getProducts.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      result.current.setSearchTerm('  test  ');
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith({
        search: 'test',
      });
    });
  });

  it('should allow manual search via searchProducts', async () => {
    const mockResults = [{ CODPROD: 1, PRODUTO: 'Product 1' }];
    productService.getProducts.mockResolvedValue({ data: mockResults });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('manual search');
    });

    expect(productService.getProducts).toHaveBeenCalledWith({
      search: 'manual search',
    });

    await waitFor(() => {
      expect(result.current.results).toEqual(mockResults);
    });
  });

  it('should set loading state during search', async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    productService.getProducts.mockReturnValue(promise);

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      result.current.setSearchTerm('test');
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      resolvePromise({ data: [] });
      await promise;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});

