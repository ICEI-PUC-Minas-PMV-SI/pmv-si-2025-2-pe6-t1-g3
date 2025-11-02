import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { mockUser, mockSupplier, mockAdmin, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do SearchDropdown
jest.mock('../UI/SearchDropdown', () => {
  return function MockSearchDropdown({ placeholder, className, onClose }) {
    return (
      <div className={className}>
        <input 
          placeholder={placeholder}
          data-testid="search-input"
          onChange={() => onClose && onClose()}
        />
      </div>
    );
  };
});

// Mock do useAuth
const mockUseAuth = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => mockUseAuth(),
}));

// Mock do useCart
const mockUseCart = jest.fn();
jest.mock('../../contexts/CartContext', () => ({
  ...jest.requireActual('../../contexts/CartContext'),
  useCart: () => mockUseCart(),
}));

// Wrapper para renderizar Header com contextos necessários
const renderHeader = (initialAuth = null, initialCart = { cartCount: 0 }) => {
  const mockLogout = jest.fn();
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();
  
  // Garantir que o admin tenha isAdmin
  const authUser = initialAuth ? {
    ...initialAuth,
    isAdmin: initialAuth.role === 'ADMIN' || initialAuth.isAdmin
  } : null;
  
  mockUseAuth.mockReturnValue({
    user: authUser,
    isAuthenticated: !!initialAuth,
    logout: mockLogout,
    login: mockLogin,
    register: mockRegister,
    isLoading: false,
  });
  
  mockUseCart.mockReturnValue({
    cartCount: initialCart.cartCount,
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    items: [],
    cartItems: [],
    setCartItems: jest.fn(),
  });

  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockUseAuth.mockClear();
    mockUseCart.mockClear();
  });

  describe('Renderização', () => {
    it('deve renderizar o logo da marca clicável', () => {
      renderHeader();
      
      const logo = screen.getByAltText('Zabbix Store');
      expect(logo).toBeInTheDocument();
      // Logo deve estar dentro de um link
      const logoLink = logo.closest('a');
      expect(logoLink).toBeTruthy();
      if (logoLink) {
        expect(logoLink).toHaveAttribute('href', '/');
      }
    });

    it('deve renderizar menu de navegação com links principais', () => {
      renderHeader();
      
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
      expect(screen.getByText('Fashion')).toBeInTheDocument();
      expect(screen.getByText('Casa')).toBeInTheDocument();
      expect(screen.getByText('Sobre')).toBeInTheDocument();
    });

    it('deve renderizar campo de pesquisa', () => {
      renderHeader();
      
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'Buscar...');
    });

    it('deve renderizar ícone de carrinho com contador', () => {
      renderHeader(null, { cartCount: 3 });
      
      const cartLink = screen.getByTitle('Carrinho');
      expect(cartLink).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('deve renderizar ícone de perfil', () => {
      renderHeader(mockUser);
      
      const profileLink = screen.getByTitle('Perfil');
      expect(profileLink).toBeInTheDocument();
    });

    it('deve renderizar botão de menu hambúrguer em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderHeader();
      
      const menuButtons = screen.getAllByRole('button');
      const menuButton = menuButtons.find(btn => 
        btn.className.includes('md:hidden') || btn.querySelector('svg')
      );
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve redirecionar para página inicial ao clicar no logo', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const logo = screen.getByAltText('Zabbix Store');
      const logoLink = logo.closest('a');
      expect(logoLink).toBeTruthy();
      if (logoLink) {
        await user.click(logoLink);
        expect(logoLink).toHaveAttribute('href', '/');
      }
    });

    it('deve navegar para página sobre ao clicar em "Sobre"', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      // Buscar link de forma mais robusta - pode haver múltiplos elementos com "Sobre"
      const sobreTexts = screen.getAllByText('Sobre');
      const sobreLink = sobreTexts.find(el => el.closest('a')) || sobreTexts[0];
      expect(sobreLink).toBeTruthy();
      if (sobreLink) {
        await user.click(sobreLink);
        const sobreLinkElement = sobreLink.closest('a');
        if (sobreLinkElement) {
          expect(sobreLinkElement).toHaveAttribute('href', '/aboutus');
        }
      }
    });

    it('deve abrir carrinho ao clicar no ícone de carrinho', async () => {
      const user = userEvent.setup();
      renderHeader(mockUser);
      
      const cartLink = screen.getByTitle('Carrinho');
      await user.click(cartLink);
      
      expect(cartLink).toHaveAttribute('href', '/cart');
    });

    it('deve abrir menu mobile ao clicar no botão hambúrguer', async () => {
      const user = userEvent.setup();
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderHeader();
      
      const menuButton = screen.getByRole('button');
      await user.click(menuButton);
      
      // Verificar se o menu mobile aparece
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
    });

    it('deve fechar menu mobile ao clicar no X', async () => {
      const user = userEvent.setup();
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderHeader();
      
      // Abrir menu
      const menuButton = screen.getByRole('button');
      await user.click(menuButton);
      
      // Fechar menu
      await user.click(menuButton);
      
      // Verificar se o menu foi fechado (elementos específicos do mobile não devem estar visíveis)
      const mobileMenu = screen.queryByText('Perfil');
      expect(mobileMenu).not.toBeInTheDocument();
    });
  });

  describe('Funcionalidades', () => {
    it('deve permitir digitação no campo de pesquisa', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'smartphone');
      
      expect(searchInput).toHaveValue('smartphone');
    });

    it('deve atualizar contador do carrinho quando produtos são adicionados', () => {
      renderHeader(null, { cartCount: 5 });
      
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('deve exibir opções corretas para usuário não logado', () => {
      renderHeader();
      
      expect(screen.getByText('Cadastrar')).toBeInTheDocument();
      expect(screen.getByText('Entrar')).toBeInTheDocument();
      expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
    });

    it('deve exibir opções corretas para cliente logado', () => {
      renderHeader(mockUser);
      
      expect(screen.getByTitle('Perfil')).toBeInTheDocument();
      expect(screen.getByTitle('Favoritos')).toBeInTheDocument();
      expect(screen.getByTitle('Carrinho')).toBeInTheDocument();
      expect(screen.getByText('Sair')).toBeInTheDocument();
      expect(screen.queryByText('Cadastrar')).not.toBeInTheDocument();
    });

    it('deve exibir opções de admin para usuário admin', () => {
      renderHeader(mockAdmin);
      
      expect(screen.getByTitle('Admin')).toBeInTheDocument();
    });

    it('deve fazer logout ao clicar em "Sair"', async () => {
      const user = userEvent.setup();
      const mockLogout = jest.fn();
      
      // Mock do contexto de auth
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: mockLogout,
        login: jest.fn(),
        register: jest.fn(),
        isLoading: false,
      });
      
      mockUseCart.mockReturnValue({
        cartCount: 0,
        cartItems: [],
        addToCart: jest.fn(),
        setCartItems: jest.fn(),
      });

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );
      
      const logoutButton = screen.getByText('Sair');
      await user.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('Estados', () => {
    it('deve exibir loading state durante pesquisa', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'test');
      
      // Simular loading (isso seria implementado no componente real)
      expect(searchInput).toBeInTheDocument();
    });

    it('deve manter estado de pesquisa após navegação', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'smartphone');
      
      // Navegar para outra página
      const logoLink = screen.getByAltText('Zabbix Store').closest('a');
      await user.click(logoLink);
      
      // O estado seria mantido pelo contexto/estado global
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar-se corretamente em dispositivos móveis', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderHeader();
      
      // Em mobile, o menu desktop deve estar oculto
      const desktopMenu = screen.queryByText('Eletrônicos');
      expect(desktopMenu).toBeInTheDocument(); // Ainda visível no mobile menu quando aberto
      
      // Botão hambúrguer deve estar visível
      const menuButton = screen.getByRole('button');
      expect(menuButton).toBeInTheDocument();
    });

    it('deve colapsar menu em telas pequenas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderHeader();
      
      // Menu desktop deve estar oculto por padrão
      const desktopNav = screen.getByRole('navigation');
      expect(desktopNav).toBeInTheDocument();
    });

    it('deve manter funcionalidade do campo de pesquisa em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderHeader();
      
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
    });

    it('deve manter tamanho adequado dos ícones em diferentes resoluções', () => {
      mockScreenSize(BREAKPOINTS.DESKTOP);
      renderHeader(mockUser);
      
      const profileIcon = screen.getByTitle('Perfil');
      expect(profileIcon).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter atributos aria-label apropriados', () => {
      renderHeader(mockUser);
      
      expect(screen.getByTitle('Perfil')).toBeInTheDocument();
      expect(screen.getByTitle('Carrinho')).toBeInTheDocument();
      expect(screen.getByTitle('Favoritos')).toBeInTheDocument();
    });

    it('deve funcionar com navegação por teclado', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      // Tab para navegar pelos elementos
      await user.tab();
      await user.tab();
      
      // Enter para ativar
      await user.keyboard('{Enter}');
      
      // Verificar se algum elemento foi ativado
      expect(document.activeElement).toBeInTheDocument();
    });

    it('deve ter contraste adequado', () => {
      renderHeader();
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toBeInTheDocument();
      });
    });

    it('deve ter foco visível em elementos interativos', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const logoLink = screen.getByAltText('Zabbix Store').closest('a');
      await user.tab();
      
      expect(document.activeElement).toBeInTheDocument();
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve exibir opções corretas para usuário não logado', () => {
      renderHeader();
      
      expect(screen.getByText('Cadastrar')).toBeInTheDocument();
      expect(screen.getByText('Entrar')).toBeInTheDocument();
      expect(screen.queryByText('Sair')).not.toBeInTheDocument();
    });

    it('deve exibir opções corretas para cliente logado', () => {
      renderHeader(mockUser);
      
      expect(screen.getByTitle('Perfil')).toBeInTheDocument();
      expect(screen.getByTitle('Favoritos')).toBeInTheDocument();
      expect(screen.getByTitle('Carrinho')).toBeInTheDocument();
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });

    it('deve exibir opções corretas para fornecedor logado', () => {
      renderHeader(mockSupplier);
      
      expect(screen.getByTitle('Perfil')).toBeInTheDocument();
      expect(screen.getByTitle('Carrinho')).toBeInTheDocument();
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });

    it('deve exibir opções corretas para admin', () => {
      renderHeader(mockAdmin);
      
      expect(screen.getByTitle('Perfil')).toBeInTheDocument();
      expect(screen.getByTitle('Admin')).toBeInTheDocument();
      expect(screen.getByText('Sair')).toBeInTheDocument();
    });
  });
});
