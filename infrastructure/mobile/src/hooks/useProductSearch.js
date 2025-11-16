import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';
import { ENV } from '../utils/env';

const DEBOUNCE_MS = ENV.SEARCH_DEBOUNCE_MS();

export const useProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProducts = useCallback(async (term) => {
    if (!term || term.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productService.getProducts({
        search: term.trim(),
      });
      setResults(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar produtos');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(searchTerm);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchProducts]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    searchProducts,
  };
};

