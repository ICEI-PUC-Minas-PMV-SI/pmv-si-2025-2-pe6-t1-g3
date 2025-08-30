import { useState, useEffect, useMemo } from 'react';
import { useProducts } from './useProducts';

// Hook personalizado para busca de produtos com debounce
export const useProductSearch = (initialFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialFilters.searchTerm || '');
  
  // Implementa debounce - aguarda 500ms após o usuário parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, parseInt(import.meta.env.VITE_SEARCH_DEBOUNCE_MS) || 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Carrega todos os produtos inicialmente
  const { products: allProducts, loading, error, refetch } = useProducts(initialFilters);

  // Filtra produtos localmente usando o termo de busca com debounce
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return allProducts;
    }

    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    
    return allProducts.filter(product => 
      product.PRODUTO?.toLowerCase().includes(searchLower) ||
      product.NOME?.toLowerCase().includes(searchLower) ||
      product.DESCRICAO?.toLowerCase().includes(searchLower)
    );
  }, [allProducts, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    products: filteredProducts,
    loading,
    error,
    refetch,
    isSearching: searchTerm !== debouncedSearchTerm,
    hasSearchTerm: debouncedSearchTerm.trim().length > 0,
    resultCount: filteredProducts.length
  };
};