import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from './Product/ProductGrid';
import { FiSearch } from 'react-icons/fi';

const SearchResults = () => {
  const location = useLocation();
  
  const query = new URLSearchParams(location.search).get('q') || '';
  
  const { products: allProducts, loading, error } = useProducts();
  
  const filteredProducts = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const searchLower = query.toLowerCase().trim();
    
    return allProducts.filter(product => 
      product.PRODUTO?.toLowerCase().includes(searchLower) ||
      product.NOME?.toLowerCase().includes(searchLower) ||
      product.DESCRICAO?.toLowerCase().includes(searchLower)
    );
  }, [allProducts, query]);
  
  const resultCount = filteredProducts.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FiSearch className="w-8 h-8 text-gray-400 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Resultados da Busca
            </h1>
          </div>
          
          {query && (
            <div className="mb-6">
              <p className="text-lg text-gray-600">
                Buscando por: <span className="font-semibold text-gray-900">"{query}"</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {loading 
                  ? 'Buscando produtos...' 
                  : `${resultCount} produto${resultCount !== 1 ? 's' : ''} encontrado${resultCount !== 1 ? 's' : ''}`
                }
              </p>
            </div>
          )}
        </div>

        {!query ? (
          <div className="text-center py-12">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Digite algo para buscar
            </h2>
            <p className="text-gray-500">
              Use a barra de busca no header para encontrar produtos
            </p>
          </div>
        ) : (
          <ProductGrid 
            products={filteredProducts} 
            loading={loading} 
            error={error} 
          />
        )}

        {query && !loading && resultCount === 0 && (
          <div className="text-center py-12">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum produto encontrado
            </h2>
            <p className="text-gray-500 mb-6">
              Não encontramos produtos que correspondam à sua busca por "{query}"
            </p>
            <div className="text-sm text-gray-500">
              <p className="mb-2">Dicas para melhorar sua busca:</p>
              <ul className="list-disc list-inside space-y-1 max-w-md mx-auto">
                <li>Verifique a ortografia das palavras</li>
                <li>Tente usar termos mais genéricos</li>
                <li>Use menos palavras na busca</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;