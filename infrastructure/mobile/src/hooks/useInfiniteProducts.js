import { useState, useEffect, useCallback, useRef } from 'react';
import { productService } from '../services/api';

const PRODUCTS_PER_PAGE = 12;

export const useInfiniteProducts = (filters = {}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const currentPageRef = useRef(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts(filters);
      const products = response.data || [];
      setAllProducts(products);
      
      // Inicializa com a primeira página
      const initialProducts = products.slice(0, PRODUCTS_PER_PAGE);
      setDisplayedProducts(initialProducts);
      setHasMore(products.length > PRODUCTS_PER_PAGE);
      currentPageRef.current = 1;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    
    // Simula um pequeno delay para melhor UX
    setTimeout(() => {
      const nextPage = currentPageRef.current + 1;
      const startIndex = currentPageRef.current * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      const newProducts = allProducts.slice(startIndex, endIndex);

      if (newProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...newProducts]);
        currentPageRef.current = nextPage;
        setHasMore(endIndex < allProducts.length);
      } else {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    }, 300);
  }, [allProducts, loadingMore, hasMore]);

  return {
    products: displayedProducts,
    allProductsCount: allProducts.length,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch: fetchProducts
  };
};

