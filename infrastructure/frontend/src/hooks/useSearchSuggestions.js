import { useState, useEffect, useMemo } from 'react';
import { useProducts } from './useProducts';

export const useSearchSuggestions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const { products: allProducts, loading } = useProducts();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const suggestions = useMemo(() => {
    if (!debouncedSearchTerm.trim() || debouncedSearchTerm.length < 2) {
      return [];
    }
    
    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    
    const filtered = allProducts.filter(product => 
      product.PRODUTO?.toLowerCase().includes(searchLower) ||
      product.NOME?.toLowerCase().includes(searchLower) ||
      product.DESCRICAO?.toLowerCase().includes(searchLower)
    );
    
    return filtered.slice(0, 8);
  }, [allProducts, debouncedSearchTerm]);
  
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2 && suggestions.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedSearchTerm, suggestions.length]);
  
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };
  
  const closeSuggestions = () => {
    setIsOpen(false);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsOpen(false);
  };
  
  return {
    searchTerm,
    suggestions,
    isOpen,
    loading,
    isSearching: searchTerm !== debouncedSearchTerm,
    handleSearchChange,
    closeSuggestions,
    clearSearch,
    setIsOpen
  };
};