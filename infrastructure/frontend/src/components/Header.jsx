import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiLogOut } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import SearchDropdown from "./UI/SearchDropdown";
import Button from "./UI/Button";
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

  const categories = [
    { name: 'FASHION', label: 'Moda' },
    { name: 'ELETRÔNICOS', label: 'Eletrônicos' },
    { name: 'CASA', label: 'Casa' },
    { name: 'ESPORTES', label: 'Esportes' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center"
            onClick={closeMenu}
          >
            <img
              src={zabbixLogo}
              alt="Zabbix Store"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/search?category=ELETRÔNICOS"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Eletrônicos
            </Link>

            <Link
              to="/search?category=FASHION"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Fashion
            </Link>

            <Link
              to="/search?category=CASA"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Casa
            </Link>

            <Link
              to="/search?category=ESPORTES"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Esportes
            </Link>

            <Link
              to="/aboutus"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Sobre
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchDropdown
              placeholder="Buscar..."
              className="w-full"
            />
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title="Perfil"
                >
                  <FiUser size={18} />
                </Link>

                <Link
                  to="/favorites"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title="Favoritos"
                >
                  <FiHeart size={18} />
                </Link>

                <Link
                  to="/cart"
                  className="text-gray-600 hover:text-gray-900 transition-colors relative"
                  title="Carrinho"
                >
                  <FiShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    title="Admin"
                  >
                    <MdAdminPanelSettings size={18} />
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
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
                to="/search?category=ELETRÔNICOS"
                className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-sm font-medium"
                onClick={closeMenu}
              >
                Eletrônicos
              </Link>

              <Link
                to="/search?category=FASHION"
                className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-sm font-medium"
                onClick={closeMenu}
              >
                Fashion
              </Link>

              <Link
                to="/search?category=CASA"
                className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-sm font-medium"
                onClick={closeMenu}
              >
                Casa
              </Link>

              <Link
                to="/search?category=ESPORTES"
                className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-sm font-medium"
                onClick={closeMenu}
              >
                Esportes
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
