import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import ProductGrid from './Product/ProductGrid';
import LoadingSpinner from './UI/LoadingSpinner';

const Products = () => {
  const { products, loading, loadingMore, error, hasMore, loadMore, allProductsCount } = useInfiniteProducts();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Todos os Produtos</h1>
          <p className="text-gray-600 mt-2">
            Explore nossa seleção completa de {allProductsCount > 0 ? `${allProductsCount} produtos` : 'produtos'}
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center min-h-96">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : (
            <>
              <ProductGrid 
                products={products} 
                loading={false}
                error={null}
              />
              
              <div className="mt-8 flex items-center justify-center">
                {hasMore ? (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-60"
                  >
                    {loadingMore ? 'Carregando...' : 'Ver mais'}
                  </button>
                ) : (
                  products.length > 0 && (
                    <p className="text-gray-500 text-sm">
                      Todos os produtos foram carregados
                    </p>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

