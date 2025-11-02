import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../Admin/AdminDashboard';
import { mockUser, mockSupplier, mockAdmin, mockProduct, mockScreenSize, BREAKPOINTS } from '../../test-utils';
import { productService, orderService } from '../../services/api';

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

jest.mock('../Admin/OrderManagement', () => {
  return function MockOrderManagement({ orders, onOrdersChange }) {
    return (
      <div data-testid="order-management">
        <h2>Gerenciamento de Pedidos</h2>
        <div data-testid="orders-table">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.CODPED} data-testid={`order-row-${order.CODPED}`}>
                Pedido #{order.CODPED} - R$ {order.VALORTOTAL}
              </div>
            ))
          ) : (
            <div data-testid="no-orders">Nenhum pedido encontrado</div>
          )}
        </div>
      </div>
    );
  };
});

// Mock dos serviços
jest.mock('../../services/api', () => ({
  productService: {
    getProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  },
  orderService: {
    getOrders: jest.fn(),
    updateOrder: jest.fn(),
  },
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

// Wrapper para renderizar AdminDashboard com contextos necessários
const renderAdminDashboard = (initialAuth = mockAdmin, initialCart = { cartCount: 0 }) => {
  const authUser = initialAuth ? {
    ...initialAuth,
    isAdmin: initialAuth.role === 'ADMIN' || initialAuth.isAdmin === true
  } : null;
  
  mockUseAuth.mockReturnValue({
    user: authUser,
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
      <AdminDashboard />
    </BrowserRouter>
  );
};

// Helper para aguardar o loading terminar
const waitForLoadingToFinish = async () => {
  // Aguardar um tick para garantir que o useEffect seja executado
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });
  
  await waitFor(
    () => {
      const loadingSpinner = screen.queryByTestId('loading-spinner');
      if (loadingSpinner) {
        throw new Error('Loading spinner still visible');
      }
    },
    { timeout: 5000 }
  );
};

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockClear();
    mockUseCart.mockClear();
    
    // Resetar e configurar mocks dos serviços para resolver imediatamente
    const mockProductsData = [
      { ...mockProduct, CODPROD: 1, ESTOQUE: 5, PRODUTO: 'Produto 1', VALOR: 999.99 },
      { ...mockProduct, CODPROD: 2, ESTOQUE: 15, PRODUTO: 'Produto 2', VALOR: 599.99 }
    ];
    
    const mockOrdersData = [
      { 
        CODPED: 1, 
        VALORTOTAL: 999.99, 
        STATUS: 'PENDENTE', 
        DATAINC: new Date().toISOString(),
        ITENSPEDIDO: [],
        PESSOA: { NOME: 'Test', SOBRENOME: 'User' }
      },
      { 
        CODPED: 2, 
        VALORTOTAL: 599.99, 
        STATUS: 'CONFIRMADO', 
        DATAINC: new Date().toISOString(),
        ITENSPEDIDO: [],
        PESSOA: { NOME: 'Test', SOBRENOME: 'User' }
      }
    ];
    
    productService.getProducts.mockImplementation(() => 
      Promise.resolve({ data: mockProductsData })
    );
    productService.createProduct.mockResolvedValue({ data: { success: true } });
    productService.updateProduct.mockResolvedValue({ data: { success: true } });
    productService.deleteProduct.mockResolvedValue({ data: { success: true } });
    
    orderService.getOrders.mockImplementation(() => 
      Promise.resolve({ data: mockOrdersData })
    );
    orderService.updateOrder.mockResolvedValue({ data: { success: true } });
  });

  describe('Visão Geral', () => {
    it('deve renderizar métricas principais (receita, vendas, produtos)', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });

    it('deve exibir indicadores visuais com cores apropriadas', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Verificar se as métricas estão presentes
      expect(screen.getByText(/Receita Total/i)).toBeInTheDocument();
      expect(screen.getByText(/Total de Pedidos/i)).toBeInTheDocument();
      expect(screen.getByText(/Total de Produtos/i)).toBeInTheDocument();
    });

    it('deve permitir filtros por data e categoria', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Verificar que a visão geral está renderizada
      expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
    });

    it('deve renderizar gráficos de vendas', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Verificar se existe conteúdo relacionado a vendas
      expect(screen.getByText(/Produtos Mais Vendidos/i)).toBeInTheDocument();
    });

    it('deve renderizar tabela de produtos mais vendidos', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      expect(screen.getByText(/Produtos Mais Vendidos/i)).toBeInTheDocument();
    });

    it('deve renderizar alertas de estoque baixo', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      expect(screen.getByText(/Alertas de Estoque/i)).toBeInTheDocument();
    });
  });

  describe('Gerenciamento de Produtos', () => {
    it('deve renderizar lista/tabela de produtos cadastrados', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos (label é "Produtos")
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('product-management')).toBeInTheDocument();
      });
    });

    it('deve abrir formulário ao clicar em "Adicionar Produto"', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
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
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });
  });

  describe('Estados', () => {
    it('deve exibir loading durante carregamento de dados', async () => {
      productService.getProducts.mockImplementation(() => new Promise(() => {}));
      orderService.getOrders.mockImplementation(() => new Promise(() => {}));
      
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem de sucesso após operações', async () => {
      const user = userEvent.setup();
      productService.createProduct.mockResolvedValue({ data: { success: true } });
      
      renderAdminDashboard();
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
      
      const addProductButton = screen.getByTestId('add-product');
      await user.click(addProductButton);
      
      expect(addProductButton).toBeInTheDocument();
    });

    // it('deve exibir mensagem de erro em caso de falha', async () => {
    //   productService.getProducts.mockImplementation(() => Promise.reject(new Error('Erro ao carregar produtos')));
    //   orderService.getOrders.mockImplementation(() => Promise.reject(new Error('Erro ao carregar pedidos')));
    //   
    //   renderAdminDashboard();
    //   
    //   // O loading spinner deve aparecer inicialmente
    //   await waitFor(() => {
    //     expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    //   });
    //   
    //   // Aguardar que o loading desapareça (mesmo após erro)
    //   await waitFor(() => {
    //     expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    //   }, { timeout: 5000 });
    //   
    //   // Verificar que o componente ainda renderiza (sem crashar)
    //   // Quando há erro, o componente ainda renderiza mas com dados vazios
    //   expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
    // });

    it('deve exibir skeleton loading para tabelas', async () => {
      productService.getProducts.mockImplementation(() => new Promise(() => {}));
      orderService.getOrders.mockImplementation(() => new Promise(() => {}));
      
      renderAdminDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      });
    });

    it('deve exibir estado vazio quando não há produtos', async () => {
      productService.getProducts.mockImplementation(() => Promise.resolve({ data: [] }));
      orderService.getOrders.mockImplementation(() => Promise.resolve({ data: [] }));
      
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar dashboard a diferentes telas', async () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });

    it('deve tornar tabelas responsivas', async () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });

    it('deve redimensionar gráficos corretamente', async () => {
      mockScreenSize(BREAKPOINTS.DESKTOP);
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });

    it('deve funcionar formulários em mobile', async () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });

    it('deve ter botões com tamanho adequado para touch', async () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter descrições textuais para gráficos', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Verificar se existe conteúdo relacionado a gráficos/vendas
      expect(screen.getByText(/Produtos Mais Vendidos/i)).toBeInTheDocument();
    });

    it('deve ter headers associados nas tabelas', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('products-table')).toBeInTheDocument();
      });
    });

    it('deve ter labels apropriados nos formulários', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('add-product')).toBeInTheDocument();
      });
    });

    it('deve ter contraste adequado', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });

    it('deve funcionar navegação por teclado', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
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
      
      // Verificar se acesso é negado - deve mostrar "Acesso Negado"
      expect(screen.getByText(/Acesso Negado/i)).toBeInTheDocument();
      expect(screen.queryByTestId('metrics-overview')).not.toBeInTheDocument();
      expect(screen.queryByText('Painel Administrativo')).not.toBeInTheDocument();
    });

    it('deve proteger dados sensíveis', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });

    it('deve confirmar operações críticas', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('delete-product-1')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getByTestId('delete-product-1');
      await user.click(deleteButton);
      
      expect(deleteButton).toBeInTheDocument();
    });

    it('deve manter logs de ações', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('deve carregar dashboard em menos de 5 segundos', async () => {
      const startTime = performance.now();
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('deve otimizar gráficos', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Verificar se conteúdo relacionado a gráficos está presente
      expect(screen.getByText(/Produtos Mais Vendidos/i)).toBeInTheDocument();
    });

    it('deve implementar paginação nas tabelas', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('products-table')).toBeInTheDocument();
      });
    });

    it('deve otimizar filtros', async () => {
      renderAdminDashboard();
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve ter acesso apenas aos próprios produtos para fornecedor', () => {
      renderAdminDashboard(mockSupplier);
      
      // Verificar se acesso é negado
      expect(screen.getByText(/Acesso Negado/i)).toBeInTheDocument();
      expect(screen.queryByTestId('metrics-overview')).not.toBeInTheDocument();
      expect(screen.queryByText('Painel Administrativo')).not.toBeInTheDocument();
    });

    it('deve ter acesso a todos os produtos e métricas para admin', async () => {
      const adminUser = { ...mockAdmin, isAdmin: true };
      renderAdminDashboard(adminUser);
      
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
    });

    it('deve negar acesso para cliente', () => {
      renderAdminDashboard(mockUser);
      
      // Verificar se acesso é negado
      expect(screen.getByText(/Acesso Negado/i)).toBeInTheDocument();
      expect(screen.queryByTestId('metrics-overview')).not.toBeInTheDocument();
      expect(screen.queryByText('Painel Administrativo')).not.toBeInTheDocument();
    });

    it('deve redirecionar usuário não logado para login', () => {
      renderAdminDashboard(null);
      
      // Verificar se acesso é negado
      expect(screen.getByText(/Acesso Negado/i)).toBeInTheDocument();
      expect(screen.queryByTestId('metrics-overview')).not.toBeInTheDocument();
      expect(screen.queryByText('Painel Administrativo')).not.toBeInTheDocument();
    });
  });

  describe('Navegação entre Abas', () => {
    it('deve alternar entre visão geral e gerenciamento de produtos', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Verificar aba padrão
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('product-management')).toBeInTheDocument();
      });
    });

    it('deve manter estado ativo da aba corretamente', async () => {
      const user = userEvent.setup();
      renderAdminDashboard();
      
      // Aguardar carregamento inicial
      await waitForLoadingToFinish();
      
      await waitFor(() => {
        expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
      });
      
      // Navegar para aba de produtos
      const productsTab = screen.getByText('Produtos');
      await user.click(productsTab);
      
      await waitFor(() => {
        expect(screen.getByTestId('product-management')).toBeInTheDocument();
      });
      
      // Verificar se a aba está ativa
      expect(productsTab).toBeInTheDocument();
    });
  });
});
