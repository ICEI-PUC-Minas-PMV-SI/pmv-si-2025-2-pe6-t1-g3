import { useState, useEffect } from 'react';
import { productService } from '../services/api';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(filters);
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar produtos');
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
    refetch: fetchProducts
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
    error
  };
};