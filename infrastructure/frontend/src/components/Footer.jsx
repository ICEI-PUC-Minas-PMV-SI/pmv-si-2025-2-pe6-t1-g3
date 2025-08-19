import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [token, setToken] = useState(null);
  const storedToken = localStorage.getItem("token");
  
  useEffect(() => {
    if (storedToken) {
      setToken(storedToken);
    }
  }, [storedToken]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = decodedToken.exp * 1000;
        if (Date.now() > expirationTime) {
          localStorage.removeItem("token");
          setToken(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded font-bold text-lg mr-3">
                E
              </div>
              <span className="text-xl font-semibold text-gray-900">EStore</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Sua loja de moda online com as melhores peças femininas e masculinas. 
              Qualidade, estilo e tendências em um só lugar.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g3" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/aboutus" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              {token ? (
                <li>
                  <Link to="/account" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Minha Conta
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/register" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Criar Conta
                  </Link>
                </li>
              )}
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Carrinho
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Suporte
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contato@estore.com.br" className="text-gray-600 hover:text-gray-900 transition-colors">
                  contato@estore.com.br
                </a>
              </li>
              <li className="text-gray-600">
                Belo Horizonte, MG
              </li>
              <li className="text-gray-600">
                Segunda a Sexta, 9h às 18h
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2025 EStore. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
