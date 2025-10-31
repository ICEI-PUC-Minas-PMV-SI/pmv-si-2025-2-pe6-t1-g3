import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiSearch, FiHeart } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import Button from "./UI/Button";
import SearchDropdown from "./UI/SearchDropdown";
import zabbixLogo from "../assets/zabbixLogo.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
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
          <Link 
            to="/" 
            className="flex items-center hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <img 
              src={zabbixLogo} 
              alt="Zabbix" 
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/category/eletronicos" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Eletrônicos
            </Link>
            
            <Link 
              to="/category/fashion" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Fashion
            </Link>
            
            <Link 
              to="/category/casa" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Casa
            </Link>
            
            <Link 
              to="/aboutus" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Sobre
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchDropdown 
              placeholder="Buscar produtos..."
              className="w-full"
            />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/account" 
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2"
                  title="Perfil"
                >
                  <FiUser size={20} />
                </Link>
                
                <Link 
                  to="/favorites"
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2"
                  title="Favoritos">
                  <FiHeart size={20} />
                </Link>
                
                <Link 
                  to="/cart" 
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2 relative"
                  title="Carrinho"
                >
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                
                {user?.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-600 hover:text-gray-900 transition-colors p-2"
                    title="Admin"
                  >
                    <MdAdminPanelSettings size={20} />
                  </Link>
                )}
                
                <Button 
                  variant="outline" 
                  size="small" 
                  onClick={handleLogout}
                  className="ml-2"
                >
                  Sair
                </Button>
              </>
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
            {/* Mobile Search */}
            <div className="px-4 pb-4">
              <SearchDropdown 
                placeholder="Buscar produtos..."
                className="w-full"
                onClose={() => setIsMenuOpen(false)}
              />
            </div>
            
            <div className="flex flex-col space-y-3 px-4">
              <Link 
                to="/category/eletronicos" 
                className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-sm font-medium"
                onClick={closeMenu}
              >
                Eletrônicos
              </Link>
              
              <Link 
                to="/category/fashion" 
                className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-sm font-medium"
                onClick={closeMenu}
              >
                Fashion
              </Link>
              
              <Link 
                to="/category/casa" 
                className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-sm font-medium"
                onClick={closeMenu}
              >
                Casa
              </Link>
              
              <Link 
                to="/aboutus" 
                className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-sm font-medium"
                onClick={closeMenu}
              >
                Sobre
              </Link>

              {isAuthenticated ? (
                <>
                  <hr className="border-gray-200 my-2" />
                  
                  <Link 
                    to="/account" 
                    className="text-gray-700 hover:text-gray-900 transition-colors flex items-center py-2"
                    onClick={closeMenu}
                  >
                    <FiUser className="mr-2" size={18} />
                    Perfil
                  </Link>
                  
                  <Link 
                    to="/cart" 
                    className="text-gray-700 hover:text-gray-900 transition-colors flex items-center py-2 relative"
                    onClick={closeMenu}
                  >
                    <FiShoppingCart className="mr-2" size={18} />
                    Carrinho
                    {cartCount > 0 && (
                      <span className="absolute -top-1 left-16 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {cartCount}
                      </span>
                    )}
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
                <div className="flex flex-col space-y-2 pt-4">
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
