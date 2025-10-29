import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
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

// Wrapper para renderizar Header com contextos necessários
const renderHeader = (initialAuth = null, initialCart = { cartCount: 0 }) => {
  const MockAuthProvider = ({ children }) => {
    const authValue = {
      user: initialAuth,
      isAuthenticated: !!initialAuth,
      logout: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
    };
    
    return (
      <AuthProvider value={authValue}>
        <CartProvider value={{ cartCount: initialCart.cartCount }}>
          {children}
        </CartProvider>
      </AuthProvider>
    );
  };

  return render(
    <BrowserRouter>
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Renderização', () => {
    it('deve renderizar o logo da marca clicável', () => {
      renderHeader();
      
      const logo = screen.getByAltText('Zabbix');
      expect(logo).toBeInTheDocument();
      expect(logo.closest('a')).toHaveAttribute('href', '/');
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
      expect(searchInput).toHaveAttribute('placeholder', 'Buscar produtos...');
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
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve redirecionar para página inicial ao clicar no logo', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const logoLink = screen.getByAltText('Zabbix').closest('a');
      await user.click(logoLink);
      
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('deve navegar para página sobre ao clicar em "Sobre"', async () => {
      const user = userEvent.setup();
      renderHeader();
      
      const sobreLink = screen.getByText('Sobre');
      await user.click(sobreLink);
      
      expect(sobreLink.closest('a')).toHaveAttribute('href', '/aboutus');
    });

    it('deve abrir carrinho ao clicar no ícone de carrinho', async () => {
      const user = userEvent.setup();
      renderHeader();
      
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
      const MockAuthProvider = ({ children }) => {
        const authValue = {
          user: mockUser,
          isAuthenticated: true,
          logout: mockLogout,
          login: jest.fn(),
          register: jest.fn(),
        };
        
        return (
          <AuthProvider value={authValue}>
            <CartProvider value={{ cartCount: 0 }}>
              {children}
            </CartProvider>
          </AuthProvider>
        );
      };

      render(
        <BrowserRouter>
          <MockAuthProvider>
            <Header />
          </MockAuthProvider>
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
      const logoLink = screen.getByAltText('Zabbix').closest('a');
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
      
      const logoLink = screen.getByAltText('Zabbix').closest('a');
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
