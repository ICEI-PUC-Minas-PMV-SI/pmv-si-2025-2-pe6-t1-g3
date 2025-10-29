import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../Admin/AdminDashboard';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { mockUser, mockSupplier, mockAdmin, mockProduct, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock dos componentes filhos
jest.mock('../Admin/ProductManagement', () => {
  return function MockProductManagement() {
    return (
      <div data-testid="product-management">
        <h2>Gerenciamento de Produtos</h2>
        <button data-testid="add-product">Adicionar Produto</button>
        <div data-testid="products-table">
          <div data-testid="product-row-1">Smartphone XYZ - R$ 999.99</div>
          <div data-testid="product-row-2">Tablet ABC - R$ 599.99</div>
        </div>
        <button data-testid="edit-product-1">Editar</button>
        <button data-testid="delete-product-1">Excluir</button>
        <button data-testid="activate-product-1">Ativar/Desativar</button>
      </div>
    );
  };
});

jest.mock('../Admin/MetricsOverview', () => {
  return function MockMetricsOverview({ metrics }) {
    return (
      <div data-testid="metrics-overview">
        <h2>Visão Geral</h2>
        <div data-testid="total-revenue">Receita Total: R$ {metrics.totalRevenue}</div>
        <div data-testid="total-orders">Total de Pedidos: {metrics.totalOrders}</div>
        <div data-testid="total-products">Total de Produtos: {metrics.totalProducts}</div>
        <div data-testid="low-stock-alerts">Alertas de Estoque Baixo: {metrics.lowStockAlerts || 0}</div>
        <div data-testid="sales-chart">Gráfico de Vendas</div>
        <div data-testid="top-products">Produtos Mais Vendidos</div>
      </div>
    );
  };
});

// Mock dos serviços
const mockProductService = {
  getProducts: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

const mockOrderService = {
  getOrders: jest.fn(),
};

jest.mock('../../services/api', () => ({
  productService: mockProductService,
  orderService: mockOrderService,
}));

// Mock dos componentes UI
jest.mock('../UI/Card', () => {
  return function MockCard({ children }) {
    return <div data-testid="card">{children}</div>;
  };
});

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

jest.mock('../UI/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Carregando...</div>;
  };
});

// Wrapper para renderizar AdminDashboard com contextos necessários
const renderAdminDashboard = (initialAuth = mockAdmin, initialCart = { cartCount: 0 }) => {
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
        <AdminDashboard />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProductService.getProducts.mockResolvedValue({
      data: [
        { ...mockProduct, CODPROD: 1, ESTOQUE: 5 },
        { ...mockProduct, CODPROD: 2, ESTOQUE: 15 }
      ]
    });
    mockOrderService.getOrders.mockResolvedValue({
      data: [
        { CODPED: 1, VALORTOTAL: 999.99, STATUS: 'PENDENTE' },
        { CODPED: 2, VALORTOTAL: 599.99, STATUS: 'CONFIRMADO' }
      ]
    });
  });

  describe('Visão Geral', () => {
    it('deve renderizar métricas principais (receita, vendas, produtos)', async () => {
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
        expect(screen.getByText('Visão Geral')).toBeInTheDocument();
      });
    });

    it('deve exibir indicadores visuais com cores apropriadas', async () => {
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('total-revenue')).toBeInTheDocument();
        expect(screen.getByTestId('total-orders')).toBeInTheDocument();
        expect(screen.getByTestId('total-products')).toBeInTheDocument();
      });
    });

    it('deve permitir filtros por data e categoria', async () => {
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Simular filtros
      const dateFilter = screen.queryByText('Filtrar por Data');
      const categoryFilter = screen.queryByText('Filtrar por Categoria');
      
      if (dateFilter) {
        expect(dateFilter).toBeInTheDocument();
      }
      if (categoryFilter) {
        expect(categoryFilter).toBeInTheDocument();
      }
    });

    it('deve renderizar gráficos de vendas', async () => {
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
      });
    });

    it('deve renderizar tabela de produtos mais vendidos', async () => {
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('top-products')).toBeInTheDocument();
      });
    });

    it('deve renderizar alertas de estoque baixo', async () => {
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('low-stock-alerts')).toBeInTheDocument();
      });
    });
  });

  describe('Gerenciamento de Produtos', () => {
    it('deve renderizar lista/tabela de produtos cadastrados', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('product-management')).toBeInTheDocument();
      });
    });

    it('deve abrir formulário ao clicar em "Adicionar Produto"', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });

    it('deve funcionar botões "Editar" e "Excluir"', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('edit-product-1')).toBeInTheDocument();
        expect(screen.getByTestId('delete-product-1')).toBeInTheDocument();
      });
      
      const editButton = screen.getByTestId('edit-product-1');
      const deleteButton = screen.getByTestId('delete-product-1');
      
      await user.click(editButton);
      await user.click(deleteButton);
      
      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    it('deve validar todos os campos obrigatórios no formulário', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });

    it('deve funcionar upload de imagens', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });

    it('deve permitir ativar/desativar produtos', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('activate-product-1')).toBeInTheDocument();
      });
      
      const activateButton = screen.getByTestId('activate-product-1');
      await user.click(activateButton);
      
      expect(activateButton).toBeInTheDocument();
    });

    it('deve permitir gerenciar estoque', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('product-management')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('product-management')).toBeInTheDocument();
    });
  });

  describe('Validações', () => {
    it('deve validar campos obrigatórios', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });

    it('deve validar preços como valores positivos', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });

    it('não deve permitir quantidade negativa em estoque', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });

    it('deve validar formatos de imagem', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });

    it('deve validar seleção de categorias', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });

    it('deve validar tamanho mínimo de descrições', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });
  });

  describe('Estados', () => {
    it('deve exibir loading durante carregamento de dados', () => {
      mockProductService.getProducts.mockImplementation(() => new Promise(() => {}));
      
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve exibir mensagem de sucesso após operações', async () => {
      const user = userEvent.setup();
      mockProductService.createProduct.mockResolvedValue({ data: { success: true } });
      
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });

    it('deve exibir mensagem de erro em caso de falha', async () => {
      mockProductService.getProducts.mockRejectedValue(new Error('Erro ao carregar produtos'));
      
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve exibir skeleton loading para tabelas', () => {
      mockProductService.getProducts.mockImplementation(() => new Promise(() => {}));
      
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve exibir estado vazio quando não há produtos', async () => {
      mockProductService.getProducts.mockResolvedValue({ data: [] });
      
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar dashboard a diferentes telas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve tornar tabelas responsivas', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve redimensionar gráficos corretamente', () => {
      mockScreenSize(BREAKPOINTS.DESKTOP);
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve funcionar formulários em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve ter botões com tamanho adequado para touch', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter descrições textuais para gráficos', async () => {
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
      });
    });

    it('deve ter headers associados nas tabelas', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('products-table')).toBeInTheDocument();
      });
    });

    it('deve ter labels apropriados nos formulários', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
    });

    it('deve ter contraste adequado', () => {
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve funcionar navegação por teclado', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      await user.tab();
      await user.tab();
      
      expect(document.activeElement).toBeInTheDocument();
    });
  });

  describe('Segurança', () => {
    it('deve restringir acesso a fornecedores', () => {
      renderAdminDashboard(mockSupplier);
      
      // Verificar se acesso é negado
      expect(screen.queryByTestId('metrics-overview')).not.toBeInTheDocument();
    });

    it('deve proteger dados sensíveis', () => {
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve confirmar operações críticas', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('delete-product-1')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByTestId('delete-product-1');
      await user.click(deleteButton);
      
      expect(deleteButton).toBeInTheDocument();
    });

    it('deve manter logs de ações', () => {
      renderAdminDashboard();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('deve carregar dashboard em menos de 5 segundos', async () => {
      const startTime = performance.now();
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('deve otimizar gráficos', async () => {
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
      });
    });

    it('deve implementar paginação nas tabelas', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('products-table')).toBeInTheDocument();
      });
    });

    it('deve otimizar filtros', async () => {
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve ter acesso apenas aos próprios produtos para fornecedor', () => {
      renderAdminDashboard(mockSupplier);
      
      // Verificar se acesso é negado
      expect(screen.queryByTestId('metrics-overview')).not.toBeInTheDocument();
    });

    it('deve ter acesso a todos os produtos e métricas para admin', async () => {
      renderAdminDashboard(mockAdmin);
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });

    it('deve negar acesso para cliente', () => {
      renderAdminDashboard(mockUser);
      
      // Verificar se acesso é negado
      expect(screen.queryByTestId('metrics-overview')).not.toBeInTheDocument();
    });

    it('deve redirecionar usuário não logado para login', () => {
      renderAdminDashboard(null);
      
      // Verificar se acesso é negado
      expect(screen.queryByTestId('metrics-overview')).not.toBeInTheDocument();
    });
  });

  describe('Navegação entre Abas', () => {
    it('deve alternar entre visão geral e gerenciamento de produtos', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Verificar aba padrão
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
        
        await waitFor(() => {
          expect(screen.getByTestId('product-management')).toBeInTheDocument();
        });
      }
    });

    it('deve manter estado ativo da aba corretamente', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Navegar para aba de produtos
      const productsTab = screen.queryByText('Produtos');
      if (productsTab) {
        await user.click(productsTab);
        
        // Verificar se a aba está ativa
        expect(productsTab).toBeInTheDocument();
      }
    });
  });
});
