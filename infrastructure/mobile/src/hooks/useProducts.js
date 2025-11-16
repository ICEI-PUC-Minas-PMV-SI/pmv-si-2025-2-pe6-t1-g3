import { useState, useEffect } from 'react';
import { productService } from '../services/api';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(filters);
      
      // Handle different response formats
      const productsData = response.data || response || [];
      
      // Ensure it's an array
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else if (productsData && Array.isArray(productsData.data)) {
        setProducts(productsData.data);
      } else if (productsData && Array.isArray(productsData.products)) {
        setProducts(productsData.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      // Provide more helpful error messages
      let errorMessage = 'Erro ao carregar produtos';
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Tempo de conexão esgotado. Verifique sua conexão com a internet.';
      } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se a API está rodando e se a URL está correta.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Endpoint não encontrado. Verifique a configuração da API.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProduct(productId);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
  };
};

