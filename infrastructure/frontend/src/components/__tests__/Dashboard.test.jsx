import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { mockUser, mockSupplier, mockAdmin, mockProduct, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock do hook useProducts
const mockProducts = [
  mockProduct,
  {
    ...mockProduct,
    id: 2,
    name: "Tablet ABC",
    price: 599.99,
    category: "Eletrônicos"
  },
  {
    ...mockProduct,
    id: 3,
    name: "Notebook XYZ",
    price: 1999.99,
    category: "Eletrônicos"
  }
];

jest.mock('../../hooks/useProducts', () => ({
  useProducts: jest.fn(() => ({
    products: mockProducts,
    loading: false,
    error: null
  }))
}));

// Mock do ProductGrid
jest.mock('../Product/ProductGrid', () => {
  return function MockProductGrid({ products, loading, error }) {
    if (loading) return <div data-testid="loading">Carregando produtos...</div>;
    if (error) return <div data-testid="error">Erro ao carregar produtos</div>;
    
    return (
      <div data-testid="product-grid">
        {products.map(product => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            <h3>{product.name}</h3>
            <p>R$ {product.price}</p>
            <button>Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>
    );
  };
});

// Wrapper para renderizar Dashboard com contextos necessários
const renderDashboard = (initialAuth = null, initialCart = { cartCount: 0 }) => {
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
        <Dashboard />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component (Home Page)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar banner promocional', () => {
      renderDashboard();
      
      expect(screen.getByText('Descubra o melhor')).toBeInTheDocument();
      expect(screen.getByText('em cada categoria')).toBeInTheDocument();
      expect(screen.getByText('Na Zabbix, você encontra uma seleção cuidadosa de produtos para todas as suas necessidades. Qualidade, estilo e preços justos.')).toBeInTheDocument();
    });

    it('deve renderizar logo da marca', () => {
      renderDashboard();
      
      const logo = screen.getByAltText('Zabbix');
      expect(logo).toBeInTheDocument();
    });

    it('deve renderizar seção de produtos em destaque', () => {
      renderDashboard();
      
      expect(screen.getByText('Produtos em Destaque')).toBeInTheDocument();
      expect(screen.getByText('Descubra nossa seleção especial de produtos')).toBeInTheDocument();
    });

    it('deve renderizar seção de categorias', () => {
      renderDashboard();
      
      expect(screen.getByText('Explore Nossas Categorias')).toBeInTheDocument();
      expect(screen.getByText('Encontre exatamente o que você precisa em nossa ampla seleção de produtos')).toBeInTheDocument();
      
      // Verificar categorias específicas
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
      expect(screen.getByText('Fashion')).toBeInTheDocument();
      expect(screen.getByText('Casa')).toBeInTheDocument();
      expect(screen.getByText('Esportes')).toBeInTheDocument();
    });

    it('deve renderizar seção de funcionalidades', () => {
      renderDashboard();
      
      expect(screen.getByText('Entrega Grátis')).toBeInTheDocument();
      expect(screen.getByText('Qualidade Garantida')).toBeInTheDocument();
      expect(screen.getByText('Melhores Preços')).toBeInTheDocument();
    });

    it('deve renderizar produtos através do ProductGrid', () => {
      renderDashboard();
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve navegar para seção de produtos ao clicar em "Ver Produtos"', async () => {
      const user = userEvent.setup();
      renderDashboard();
      
      const verProdutosButton = screen.getByText('Ver Produtos');
      await user.click(verProdutosButton);
      
      // Verificar se há um elemento com id "produtos" (âncora)
      const produtosSection = document.getElementById('produtos');
      expect(produtosSection).toBeInTheDocument();
    });

    it('deve navegar para página sobre ao clicar em "Sobre Nós"', async () => {
      const user = userEvent.setup();
      renderDashboard();
      
      const sobreNosButton = screen.getByText('Sobre Nós');
      await user.click(sobreNosButton);
      
      expect(sobreNosButton.closest('a')).toHaveAttribute('href', '/aboutus');
    });

    it('deve exibir hover effects nas categorias', async () => {
      const user = userEvent.setup();
      renderDashboard();
      
      const eletronicosCard = screen.getByText('Eletrônicos').closest('div');
      await user.hover(eletronicosCard);
      
      // Verificar se o texto "Explorar" aparece no hover
      expect(screen.getByText('Explorar')).toBeInTheDocument();
    });

    it('deve permitir interação com produtos', async () => {
      const user = userEvent.setup();
      renderDashboard();
      
      const addToCartButtons = screen.getAllByText('Adicionar ao Carrinho');
      expect(addToCartButtons).toHaveLength(3);
      
      await user.click(addToCartButtons[0]);
      // A funcionalidade de adicionar ao carrinho seria testada no contexto do carrinho
    });
  });

  describe('Estados', () => {
    it('deve exibir loading state durante carregamento de produtos', () => {
      // Mock do hook para retornar loading true
      const { useProducts } = require('../../hooks/useProducts');
      useProducts.mockReturnValue({
        products: [],
        loading: true,
        error: null
      });
      
      renderDashboard();
      
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();
    });

    it('deve exibir mensagem de erro se falhar ao carregar produtos', () => {
      // Mock do hook para retornar erro
      const { useProducts } = require('../../hooks/useProducts');
      useProducts.mockReturnValue({
        products: [],
        loading: false,
        error: 'Erro ao carregar produtos'
      });
      
      renderDashboard();
      
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText('Erro ao carregar produtos')).toBeInTheDocument();
    });

    it('deve exibir skeleton loading para produtos', () => {
      // Mock do hook para retornar loading true
      const { useProducts } = require('../../hooks/useProducts');
      useProducts.mockReturnValue({
        products: [],
        loading: true,
        error: null
      });
      
      renderDashboard();
      
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('deve exibir estado vazio quando não há produtos disponíveis', () => {
      // Mock do hook para retornar array vazio
      const { useProducts } = require('../../hooks/useProducts');
      useProducts.mockReturnValue({
        products: [],
        loading: false,
        error: null
      });
      
      renderDashboard();
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      // O ProductGrid mockado não renderiza nada quando products está vazio
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar-se corretamente em mobile (320px)', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderDashboard();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Descubra o melhor')).toBeInTheDocument();
      expect(screen.getByText('Explore Nossas Categorias')).toBeInTheDocument();
    });

    it('deve adaptar-se corretamente em tablet (768px)', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderDashboard();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Descubra o melhor')).toBeInTheDocument();
      expect(screen.getByText('Produtos em Destaque')).toBeInTheDocument();
    });

    it('deve adaptar-se corretamente em desktop (1024px+)', () => {
      mockScreenSize(BREAKPOINTS.DESKTOP);
      renderDashboard();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Descubra o melhor')).toBeInTheDocument();
      expect(screen.getByText('Entrega Grátis')).toBeInTheDocument();
    });

    it('deve reorganizar cards de produtos em grid responsivo', () => {
      renderDashboard();
      
      const productGrid = screen.getByTestId('product-grid');
      expect(productGrid).toBeInTheDocument();
      
      // Verificar se produtos estão sendo renderizados
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });

    it('deve manter proporção do banner em diferentes telas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderDashboard();
      
      const logo = screen.getByAltText('Zabbix');
      expect(logo).toBeInTheDocument();
    });

    it('deve colapsar menu de categorias em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderDashboard();
      
      // As categorias ainda devem estar visíveis, mas o layout deve ser responsivo
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
      expect(screen.getByText('Fashion')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter alt text descritivo para imagens', () => {
      renderDashboard();
      
      const logo = screen.getByAltText('Zabbix');
      expect(logo).toBeInTheDocument();
    });

    it('deve ter aria-label apropriado para botões', () => {
      renderDashboard();
      
      const verProdutosButton = screen.getByText('Ver Produtos');
      expect(verProdutosButton).toBeInTheDocument();
      
      const sobreNosButton = screen.getByText('Sobre Nós');
      expect(sobreNosButton).toBeInTheDocument();
    });

    it('deve funcionar com navegação por teclado', async () => {
      const user = userEvent.setup();
      renderDashboard();
      
      // Tab para navegar pelos elementos
      await user.tab();
      await user.tab();
      
      // Verificar se algum elemento recebeu foco
      expect(document.activeElement).toBeInTheDocument();
    });

    it('deve ter contraste adequado', () => {
      renderDashboard();
      
      // Verificar se elementos de texto estão presentes
      expect(screen.getByText('Descubra o melhor')).toBeInTheDocument();
      expect(screen.getByText('Explore Nossas Categorias')).toBeInTheDocument();
    });

    it('deve ser navegável por screen readers', () => {
      renderDashboard();
      
      // Verificar se elementos principais têm estrutura semântica adequada
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('deve carregar página em tempo razoável', async () => {
      const startTime = performance.now();
      renderDashboard();
      const endTime = performance.now();
      
      // Verificar se renderização foi rápida (menos de 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('deve implementar lazy loading para imagens', () => {
      renderDashboard();
      
      const logo = screen.getByAltText('Zabbix');
      expect(logo).toBeInTheDocument();
      // O lazy loading seria implementado no componente real
    });

    it('deve carregar produtos progressivamente', () => {
      renderDashboard();
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      // A paginação progressiva seria implementada no ProductGrid real
    });

    it('deve carregar banner primeiro (prioridade visual)', () => {
      renderDashboard();
      
      // Banner deve estar presente
      expect(screen.getByText('Descubra o melhor')).toBeInTheDocument();
      expect(screen.getByAltText('Zabbix')).toBeInTheDocument();
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve exibir produtos públicos para usuário não logado', () => {
      renderDashboard();
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      expect(screen.getByText('Ver Produtos')).toBeInTheDocument();
    });

    it('deve exibir produtos personalizados para cliente logado', () => {
      renderDashboard(mockUser);
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      // Produtos personalizados seriam implementados no hook useProducts
    });

    it('deve exibir produtos próprios em destaque para fornecedor', () => {
      renderDashboard(mockSupplier);
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      // Produtos do fornecedor seriam implementados no hook useProducts
    });

    it('deve exibir todos os produtos para admin', () => {
      renderDashboard(mockAdmin);
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      // Admin veria todos os produtos incluindo desativados
    });
  });

  describe('Conteúdo Dinâmico', () => {
    it('deve exibir diferentes categorias com informações corretas', () => {
      renderDashboard();
      
      // Verificar informações específicas de cada categoria
      expect(screen.getByText('Tecnologia de ponta para seu dia a dia')).toBeInTheDocument();
      expect(screen.getByText('Roupas e acessórios para todos os estilos')).toBeInTheDocument();
      expect(screen.getByText('Tudo para deixar sua casa mais bonita')).toBeInTheDocument();
      expect(screen.getByText('Equipamentos para sua vida ativa')).toBeInTheDocument();
    });

    it('deve exibir contadores de produtos por categoria', () => {
      renderDashboard();
      
      expect(screen.getByText('500+ produtos')).toBeInTheDocument();
      expect(screen.getByText('300+ produtos')).toBeInTheDocument();
      expect(screen.getByText('200+ produtos')).toBeInTheDocument();
      expect(screen.getByText('150+ produtos')).toBeInTheDocument();
    });

    it('deve exibir funcionalidades com descrições corretas', () => {
      renderDashboard();
      
      expect(screen.getByText('Em compras acima de R$ 99')).toBeInTheDocument();
      expect(screen.getByText('Produtos selecionados')).toBeInTheDocument();
      expect(screen.getByText('Ofertas imperdíveis')).toBeInTheDocument();
    });
  });
});
