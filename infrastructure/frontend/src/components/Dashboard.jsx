import { useProducts } from "../hooks/useProducts";
import ProductGrid from "./Product/ProductGrid";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { products, loading, error } = useProducts();

  const categories = [
    {
      name: "FASHION",
      label: "Moda",
      description: "Roupas e acessórios"
    },
    {
      name: "ELETRÔNICOS",
      label: "Eletrônicos",
      description: "Tecnologia e inovação"
    },
    {
      name: "CASA",
      label: "Casa",
      description: "Conforto e estilo"
    },
    {
      name: "ESPORTES",
      label: "Esportes",
      description: "Equipamentos e fitness"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-8">
              Descubra produtos
              <span className="block mt-2">que combinam com você</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
              Uma seleção cuidadosa de produtos para todas as suas necessidades
            </p>
            <a
              href="#produtos"
              className="inline-block bg-black text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Ver produtos
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
              Categorias
            </h2>
            <p className="text-3xl font-light text-gray-900">
              Explore por categoria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/search?category=${category.name}`}
                className="group bg-white p-8 hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-normal text-gray-900">
                    {category.label}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explorar</span>
                    <FiArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Entrega gratuita
              </h3>
              <p className="text-sm text-gray-600">
                Em compras acima de R$ 99
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Qualidade garantida
              </h3>
              <p className="text-sm text-gray-600">
                Produtos cuidadosamente selecionados
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Pagamento seguro
              </h3>
              <p className="text-sm text-gray-600">
                Seus dados sempre protegidos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="produtos" className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
              Novidades
            </h2>
            <p className="text-3xl font-light text-gray-900">
              Produtos em destaque
            </p>
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            error={error}
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
