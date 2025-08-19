import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiInfo } from "react-icons/fi";
import { MdShoppingBasket, MdAdminPanelSettings } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import Button from "./UI/Button";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            onClick={closeMenu}
          >
            Zabbix
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-gray-900 transition-colors flex items-center"
            >
              <MdShoppingBasket className="mr-1" size={18} />
              Produtos
            </Link>
            
            <Link 
              to="/aboutus" 
              className="text-gray-700 hover:text-gray-900 transition-colors flex items-center"
            >
              <FiInfo className="mr-1" size={18} />
              Sobre
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/cart" 
                  className="text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                >
                  <FiShoppingCart className="mr-1" size={18} />
                  Carrinho
                </Link>

                <Link 
                  to="/account" 
                  className="text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                >
                  <FiUser className="mr-1" size={18} />
                  Perfil
                </Link>

                {user?.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                  >
                    <MdAdminPanelSettings className="mr-1" size={18} />
                    Admin
                  </Link>
                )}

                <Button 
                  variant="outline" 
                  size="small" 
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <FiLogOut className="mr-1" size={16} />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/register">
                  <Button variant="outline" size="small">
                    Cadastrar
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="primary" size="small">
                    Entrar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-gray-900 transition-colors flex items-center py-2"
                onClick={closeMenu}
              >
                <MdShoppingBasket className="mr-2" size={18} />
                Produtos
              </Link>
              
              <Link 
                to="/aboutus" 
                className="text-gray-700 hover:text-gray-900 transition-colors flex items-center py-2"
                onClick={closeMenu}
              >
                <FiInfo className="mr-2" size={18} />
                Sobre
              </Link>

              {isAuthenticated ? (
                <>
                  <Link 
                    to="/cart" 
                    className="text-gray-700 hover:text-gray-900 transition-colors flex items-center py-2"
                    onClick={closeMenu}
                  >
                    <FiShoppingCart className="mr-2" size={18} />
                    Carrinho
                  </Link>

                  <Link 
                    to="/account" 
                    className="text-gray-700 hover:text-gray-900 transition-colors flex items-center py-2"
                    onClick={closeMenu}
                  >
                    <FiUser className="mr-2" size={18} />
                    Perfil
                  </Link>

                  {user?.isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-gray-900 transition-colors flex items-center py-2"
                      onClick={closeMenu}
                    >
                      <MdAdminPanelSettings className="mr-2" size={18} />
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 transition-colors flex items-center py-2 text-left"
                  >
                    <FiLogOut className="mr-2" size={18} />
                    Sair
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link to="/register" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      Cadastrar
                    </Button>
                  </Link>
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="primary" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
