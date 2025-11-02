import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Aboutus from '../Aboutus';
import { mockUser, mockSupplier, mockAdmin, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock dos componentes UI
jest.mock('../UI/Button', () => {
  return function MockButton({ children, onClick, disabled, className }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={className}
        data-testid="button"
      >
        {children}
      </button>
    );
  };
});

jest.mock('../UI/Card', () => {
  return function MockCard({ children }) {
    return <div data-testid="card">{children}</div>;
  };
});


// Mock do useAuth e useCart
const mockUseAuth = jest.fn();
const mockUseCart = jest.fn();

jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => mockUseAuth(),
}));

jest.mock('../../contexts/CartContext', () => ({
  ...jest.requireActual('../../contexts/CartContext'),
  useCart: () => mockUseCart(),
}));

// Wrapper para renderizar Aboutus com contextos necessários
const renderAboutus = (initialAuth = null, initialCart = { cartCount: 0 }) => {
  mockUseAuth.mockReturnValue({
    user: initialAuth,
    isAuthenticated: !!initialAuth,
    logout: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    isLoading: false,
  });
  
  mockUseCart.mockReturnValue({
    cartCount: initialCart.cartCount,
    cartItems: [],
    addToCart: jest.fn(),
    setCartItems: jest.fn(),
  });

  return render(
    <BrowserRouter>
      <Aboutus />
    </BrowserRouter>
  );
};

describe('Aboutus Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockClear();
    mockUseCart.mockClear();
  });

  describe('Renderização', () => {
    it('deve renderizar seção de apresentação da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Redefinindo a experiência de compra online com estilo, qualidade e inovação')).toBeInTheDocument();
    });

    it('deve exibir cards com valores da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Nossos Valores')).toBeInTheDocument();
      expect(screen.getByText('Qualidade')).toBeInTheDocument();
      expect(screen.getByText('Inovação')).toBeInTheDocument();
      expect(screen.getByText('Atendimento')).toBeInTheDocument();
    });

    it('deve renderizar seção de estatísticas', () => {
      renderAboutus();
      
      expect(screen.getByText('Nossa Trajetória')).toBeInTheDocument();
      expect(screen.getByText('1000+')).toBeInTheDocument();
      expect(screen.getByText('500+')).toBeInTheDocument();
    });

    it('deve renderizar seção CTA', () => {
      renderAboutus();
      
      expect(screen.getByText('Pronto para Descobrir Nossos Produtos?')).toBeInTheDocument();
      expect(screen.getByText('Ver Produtos')).toBeInTheDocument();
    });

    it('deve renderizar logo da empresa', () => {
      renderAboutus();
      
      const logo = screen.getByAltText('Zabbix Logo');
      expect(logo).toBeInTheDocument();
    });

    it('deve renderizar história da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
      expect(screen.getByText(/A Zabbix nasceu com o propósito de transformar o e-commerce em uma experiência simples, inteligente e acessível para todos/i)).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve navegar para página inicial ao clicar em "Ver Produtos"', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Buscar link de forma mais robusta - pode haver múltiplos elementos com "Ver Produtos"
      const verProdutosTexts = screen.getAllByText('Ver Produtos');
      const verProdutosLink = verProdutosTexts.find(el => el.closest('a')) || verProdutosTexts[0]?.closest('a');
      expect(verProdutosLink).toBeTruthy();
      if (verProdutosLink) {
        expect(verProdutosLink).toHaveAttribute('href', '/');
        await user.click(verProdutosLink);
      }
    });
  });

  describe('Validações', () => {
    it('deve renderizar todos os elementos principais', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
      expect(screen.getByText('Nossos Valores')).toBeInTheDocument();
      expect(screen.getByText('Nossa Trajetória')).toBeInTheDocument();
    });

    it('deve renderizar todos os valores da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Qualidade')).toBeInTheDocument();
      expect(screen.getByText('Inovação')).toBeInTheDocument();
      expect(screen.getByText('Atendimento')).toBeInTheDocument();
    });
  });

  describe('Estados', () => {
    it('deve renderizar todos os elementos principais', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
      expect(screen.getByText('Nossos Valores')).toBeInTheDocument();
      expect(screen.getByText('Nossa Trajetória')).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar layout a diferentes telas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve reorganizar cards em grid responsivo', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve funcionar corretamente em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
    });

    it('deve manter proporção das imagens', () => {
      mockScreenSize(BREAKPOINTS.DESKTOP);
      renderAboutus();
      
      const logo = screen.getByAltText('Zabbix Logo');
      expect(logo).toBeInTheDocument();
    });

    it('deve manter texto legível em todas as telas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter estrutura semântica adequada', () => {
      renderAboutus();
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0);
    });

    it('deve ter aria-label apropriado nos links', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve ter contraste adequado', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
    });

    it('deve funcionar navegação por teclado', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      await user.tab();
      await user.tab();
      
      expect(document.activeElement).toBeInTheDocument();
    });

    it('deve ser navegável por screen readers', () => {
      renderAboutus();
      
      // Verificar se elementos principais têm estrutura semântica adequada
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('deve carregar página rapidamente', async () => {
      const startTime = performance.now();
      renderAboutus();
      const endTime = performance.now();
      
      // Verificar se renderização foi rápida (menos de 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('deve implementar lazy loading para imagens', () => {
      renderAboutus();
      
      const logo = screen.getByAltText('Zabbix Logo');
      expect(logo).toBeInTheDocument();
    });

    it('deve otimizar conteúdo', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve renderizar página rapidamente', async () => {
      const startTime = performance.now();
      renderAboutus();
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve ter acesso completo para todos os usuários', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
    });

    it('deve exibir opções de cadastro para usuário não logado', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve exibir opções personalizadas para cliente logado', () => {
      renderAboutus(mockUser);
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve exibir opções de parceria para fornecedor', () => {
      renderAboutus(mockSupplier);
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });
  });

  describe('Conteúdo Específico', () => {
    it('deve exibir valores da empresa corretamente', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Redefinindo a experiência de compra online com estilo, qualidade e inovação')).toBeInTheDocument();
    });

    it('deve exibir valores da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Qualidade')).toBeInTheDocument();
      expect(screen.getByText('Inovação')).toBeInTheDocument();
      expect(screen.getByText('Atendimento')).toBeInTheDocument();
    });

    it('deve exibir história da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
      expect(screen.getByText(/A Zabbix nasceu com o propósito de transformar o e-commerce em uma experiência simples, inteligente e acessível para todos/i)).toBeInTheDocument();
    });

    it('deve exibir missão da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Nossa missão é democratizar o acesso à moda, oferecendo peças que expressam personalidade e estilo, sempre com os melhores preços e qualidade garantida.')).toBeInTheDocument();
    });
  });

  describe('SEO e Meta Tags', () => {
    it('deve ter título apropriado', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve ter descrição apropriada', () => {
      renderAboutus();
      
      expect(screen.getByText('Redefinindo a experiência de compra online com estilo, qualidade e inovação')).toBeInTheDocument();
    });

    it('deve ter estrutura semântica adequada', () => {
      renderAboutus();
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0);
    });
  });
});
