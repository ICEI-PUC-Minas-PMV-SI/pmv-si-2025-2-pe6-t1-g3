import React from "react";
import zabbixLogo from "../assets/zabbixLogo.png";

const Aboutus = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Sobre a Zabbix
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              Redefinindo a experiência de compra online com estilo, qualidade e inovação
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Company Story */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A Zabbix nasceu com o propósito de transformar o e-commerce em uma experiência simples, inteligente e acessível para todos.
                Somos uma plataforma completa, onde tecnologia, variedade e qualidade se encontram para oferecer tudo o que você precisa em um só lugar.
                De eletrônicos a moda, de itens para casa a acessórios, trabalhamos para garantir produtos de confiança, ótimos preços e um atendimento que realmente entende o cliente.
              </p>
              <p className="text-lg text-gray-600">
                Nossa missão é democratizar o acesso à moda, oferecendo peças que expressam 
                personalidade e estilo, sempre com os melhores preços e qualidade garantida.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-80 rounded-lg flex items-center justify-center p-8">
              <div className="text-center">
                <img 
                  src={zabbixLogo} 
                  alt="Zabbix Logo" 
                  className="w-32 h-32 mx-auto mb-6 opacity-80 hover:opacity-100 transition-opacity"
                />
                <p className="text-gray-500 text-sm mt-2">Qualidade e estilo em cada produto</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Nossos Valores</h2>
            <p className="mt-4 text-lg text-gray-600">
              Os pilares que guiam nossa atuação no mercado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg mx-auto mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Qualidade</h3>
              <p className="text-gray-600">
                Selecionamos cuidadosamente cada produto para garantir a melhor experiência aos nossos clientes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg mx-auto mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inovação</h3>
              <p className="text-gray-600">
                Utilizamos as melhores tecnologias para proporcionar uma experiência de compra única e moderna.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg mx-auto mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Atendimento</h3>
              <p className="text-gray-600">
                Nosso foco está sempre no cliente, oferecendo suporte dedicado e personalizado.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Nossa Trajetória</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2025</div>
              <div className="text-gray-600">Ano de Fundação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600">Produtos Disponíveis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Clientes Satisfeitos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Suporte Online</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para Descobrir Nossos Produtos?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore nossa coleção e encontre peças que combinem com seu estilo único.
          </p>
          <a 
            href="/products" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
          >
            Ver Produtos
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
