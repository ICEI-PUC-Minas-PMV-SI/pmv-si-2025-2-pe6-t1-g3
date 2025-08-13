import { useProducts } from "../hooks/useProducts";
import ProductGrid from "./Product/ProductGrid";

const Dashboard = () => {
  const { products, loading, error } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nossos Produtos
          </h1>
          <p className="text-gray-600">
            Descubra nossa coleção cuidadosamente selecionada
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid 
          products={products} 
          loading={loading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
