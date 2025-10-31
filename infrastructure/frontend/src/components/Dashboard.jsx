import { useProducts } from "../hooks/useProducts";
import ProductGrid from "./Product/ProductGrid";
import { FiArrowRight, FiShoppingBag, FiStar, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { products, loading, error } = useProducts();

  const categories = [
    {
      name: "Eletrônicos",
      slug: "eletronicos",
      description: "Tecnologia de ponta para seu dia a dia",
      icon: "🔌",
      items: "500+ produtos",
      color: "bg-blue-50 border-blue-200"
    },
    {
      name: "Fashion",
      slug: "fashion",
      description: "Roupas e acessórios para todos os estilos",
      icon: "👕",
      items: "300+ produtos",
      color: "bg-pink-50 border-pink-200"
    },
    {
      name: "Casa",
      slug: "casa",
      description: "Tudo para deixar sua casa mais bonita",
      icon: "🏠",
      items: "200+ produtos",
      color: "bg-green-50 border-green-200"
    },
    {
      name: "Esportes",
      slug: "esportes",
      description: "Equipamentos para sua vida ativa",
      icon: "⚽",
      items: "150+ produtos",
      color: "bg-orange-50 border-orange-200"
    }
  ];

  const features = [
    {
      icon: <FiShoppingBag className="w-6 h-6" />,
      title: "Entrega Grátis",
      description: "Em compras acima de R$ 99"
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      title: "Qualidade Garantida",
      description: "Produtos selecionados"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Melhores Preços",
      description: "Ofertas imperdíveis"
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
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
                >
                  Ver Produtos
                  <FiArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  to="/aboutus"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Sobre Nós
                </Link>
              </div>
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontre exatamente o que você precisa em nossa ampla seleção de produtos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={`/category/${category.slug}`} className={`p-6 rounded-lg border-2 ${category.color} hover:shadow-lg transition-all cursor-pointer group block`}>
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <p className="text-sm font-medium text-gray-500">{category.items}</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium text-gray-900 flex items-center">
                    Explorar <FiArrowRight className="ml-1 w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="produtos" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-lg text-gray-600">
              Descubra nossa seleção especial de produtos
            </p>
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
