import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts";
import ProductGrid from "./Product/ProductGrid";
import LoadingSpinner from "./UI/LoadingSpinner";

const SLUG_TO_CATEGORY = {
  eletronicos: "ELETRÔNICOS",
  fashion: "FASHION",
  casa: "CASA",
  esportes: "ESPORTES",
};

const Category = () => {
  const { categorySlug } = useParams();

  const categoriaNome = useMemo(() => {
    if (!categorySlug) return null;
    const key = String(categorySlug).toLowerCase();
    return SLUG_TO_CATEGORY[key] || null;
  }, [categorySlug]);

  const heading = useMemo(() => {
    if (!categorySlug) return "";
    const map = {
      eletronicos: "Eletrônicos",
      fashion: "Fashion",
      casa: "Casa",
      esportes: "Esportes",
    };
    return map[String(categorySlug).toLowerCase()] || "Categoria";
  }, [categorySlug]);

  const { products, loading, loadingMore, error, hasMore, loadMore, allProductsCount } = useInfiniteProducts(
    categoriaNome ? { CATEGORIA: categoriaNome } : {}
  );

  if (!categoriaNome) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Categoria não encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            A categoria solicitada não existe. Verifique o link ou explore nossas categorias.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800"
          >
            Voltar para a Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{heading}</h1>
          <p className="text-gray-600 mt-2">
            Explore os melhores produtos de {heading.toLowerCase()}.
            {allProductsCount > 0 && ` ${allProductsCount} produto${allProductsCount !== 1 ? 's' : ''} disponível${allProductsCount !== 1 ? 'eis' : ''}`}
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
                    className="px-6 py-3 rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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

export default Category;


