import { useProducts } from "../hooks/useProducts";
import ProductGrid from "./Product/ProductGrid";
import { FiTrendingUp, FiShoppingBag, FiStar, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import zabbixLogo from "../assets/zabbixLogo.png";

const Dashboard = () => {
  const { products, loading, error } = useProducts();

  const categories = [
    {
      name: "Eletrônicos",
      description: "Tecnologia de ponta para seu dia a dia",
      icon: "🔌",
      items: "500+ produtos",
      color: "bg-blue-50 border-blue-200"
    },
    {
      name: "Fashion",
      description: "Roupas e acessórios para todos os estilos",
      icon: "👕",
      items: "300+ produtos",
      color: "bg-pink-50 border-pink-200"
    },
    {
      name: "Casa",
      description: "Tudo para deixar sua casa mais bonita",
      icon: "🏠",
      items: "200+ produtos",
      color: "bg-green-50 border-green-200"
    },
    {
      name: "Esportes",
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
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Descubra o melhor
                <span className="block text-gray-700">em cada categoria</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Na Zabbix, você encontra uma seleção cuidadosa de produtos 
                para todas as suas necessidades. Qualidade, estilo e preços justos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="#produtos"
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
            <div className="flex justify-center">
              <img 
                src={zabbixLogo} 
                alt="Zabbix" 
                className="w-64 h-64 opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Nossas Categorias
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontre exatamente o que você precisa em nossa ampla seleção de produtos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className={`p-6 rounded-lg border-2 ${category.color} hover:shadow-lg transition-all cursor-pointer group`}>
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <p className="text-sm font-medium text-gray-500">{category.items}</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium text-gray-900 flex items-center">
                    Explorar <FiArrowRight className="ml-1 w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
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

      {/* Products Section */}
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
