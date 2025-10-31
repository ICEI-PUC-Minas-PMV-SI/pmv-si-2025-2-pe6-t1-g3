import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from './Product/ProductGrid';

const SearchResults = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const { products: allProducts, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category first
    if (category) {
      filtered = filtered.filter(product =>
        product.CATEGORIAS?.CATEGORIA === category
      );
    }

    // Then filter by search query
    if (query.trim()) {
      const searchLower = query.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.PRODUTO?.toLowerCase().includes(searchLower) ||
        product.NOME?.toLowerCase().includes(searchLower) ||
        product.DESCRICAO?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [allProducts, query, category]);

  const resultCount = filteredProducts.length;

  const getCategoryLabel = (cat) => {
    const labels = {
      'FASHION': 'Moda',
      'ELETRÔNICOS': 'Eletrônicos',
      'CASA': 'Casa',
      'ESPORTES': 'Esportes'
    };
    return labels[cat] || cat;
  };

  const categories = [
    { name: 'FASHION', label: 'Moda' },
    { name: 'ELETRÔNICOS', label: 'Eletrônicos' },
    { name: 'CASA', label: 'Casa' },
    { name: 'ESPORTES', label: 'Esportes' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-xs uppercase tracking-widest text-gray-900 mb-4">
                  Categorias
                </h2>
                <nav className="space-y-2">
                  <Link
                    to="/search"
                    className={`block text-sm py-2 transition-colors ${
                      !category
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Todas
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/search?category=${cat.name}`}
                      className={`block text-sm py-2 transition-colors ${
                        category === cat.name
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xs uppercase tracking-widest text-gray-900 mb-3">
                  Informações
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>Entrega gratuita acima de R$ 99</p>
                  <p>Devolução grátis em 30 dias</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-2xl font-light text-gray-900 mb-2">
                {category ? getCategoryLabel(category) : 'Todos os Produtos'}
              </h1>

              {query && (
                <p className="text-sm text-gray-600 mb-2">
                  Buscando por: <span className="font-medium">"{query}"</span>
                </p>
              )}

              <p className="text-xs text-gray-500">
                {loading
                  ? 'Carregando produtos...'
                  : `${resultCount} produto${resultCount !== 1 ? 's' : ''}`
                }
              </p>
            </div>

            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
            />

            {!loading && resultCount === 0 && (
              <div className="text-center py-16">
                <h2 className="text-base font-normal text-gray-600 mb-2">
                  Nenhum produto encontrado
                </h2>
                <p className="text-sm text-gray-500">
                  Tente ajustar os filtros ou faça uma nova busca
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;