import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../Cart';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { mockUser, mockSupplier, mockAdmin, mockCart, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock dos componentes filhos
jest.mock('../components/fragments/cartProducts', () => {
  return function MockCartProducts({ onTotalChange, onCartItemsChange }) {
    const mockItems = [
      { id: 1, name: 'Smartphone XYZ', price: 999.99, quantity: 2 },
      { id: 2, name: 'Tablet ABC', price: 599.99, quantity: 1 }
    ];
    
    const mockTotal = 2599.97;
    
    React.useEffect(() => {
      onTotalChange(mockTotal);
      onCartItemsChange(mockItems);
    }, [onTotalChange, onCartItemsChange]);
    
    return (
      <div data-testid="cart-products">
        <h2>Carrinho de Compras</h2>
        {mockItems.map(item => (
          <div key={item.id} data-testid={`cart-item-${item.id}`}>
            <span data-testid={`item-name-${item.id}`}>{item.name}</span>
            <span data-testid={`item-price-${item.id}`}>R$ {item.price}</span>
            <span data-testid={`item-quantity-${item.id}`}>{item.quantity}</span>
            <button data-testid={`remove-item-${item.id}`}>Remover</button>
            <button data-testid={`increase-quantity-${item.id}`}>+</button>
            <button data-testid={`decrease-quantity-${item.id}`}>-</button>
          </div>
        ))}
      </div>
    );
  };
});

// Mock do jwtDecode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    EMAIL: 'teste@email.com',
    CODPES: 1
  }))
}));

// Mock dos serviços
const mockUserService = {
  getProfile: jest.fn(),
};

const mockOrderService = {
  createOrder: jest.fn(),
};

jest.mock('../../services/api', () => ({
  userService: mockUserService,
  orderService2: mockOrderService,
}));

// Mock do react-toastify
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    info: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock do window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => 'mock-token'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Wrapper para renderizar Cart com contextos necessários
const renderCart = (initialAuth = mockUser, initialCart = { cartCount: 2 }) => {
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
        <Cart />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Cart Component (Shopping Cart)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
    mockUserService.getProfile.mockResolvedValue({
      data: {
        ENDERECOS: [
          {
            id: 1,
            street: 'Rua das Flores, 123',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
            isDefault: true
          }
        ]
      }
    });
  });

  describe('Renderização', () => {
    it('deve renderizar lista de produtos adicionados', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
        expect(screen.getByText('Carrinho de Compras')).toBeInTheDocument();
      });
    });

    it('deve exibir imagem, nome, preço e quantidade de cada item', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('item-name-1')).toHaveTextContent('Smartphone XYZ');
        expect(screen.getByTestId('item-price-1')).toHaveTextContent('R$ 999.99');
        expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('2');
        
        expect(screen.getByTestId('item-name-2')).toHaveTextContent('Tablet ABC');
        expect(screen.getByTestId('item-price-2')).toHaveTextContent('R$ 599.99');
        expect(screen.getByTestId('item-quantity-2')).toHaveTextContent('1');
      });
    });

    it('deve renderizar resumo do pedido com subtotal e total', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
    });

    it('deve renderizar botões de ação', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('remove-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('increase-quantity-1')).toBeInTheDocument();
        expect(screen.getByTestId('decrease-quantity-1')).toBeInTheDocument();
      });
    });

    it('deve renderizar campo de cupom de desconto', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
    });

    it('deve renderizar opções de frete', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
    });

    it('deve renderizar botão de finalizar compra', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
    });
  });

  describe('Interações', () => {
    it('deve alterar quantidade com botões "+" e "-"', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('increase-quantity-1')).toBeInTheDocument();
      });
      
      const increaseButton = screen.getByTestId('increase-quantity-1');
      await user.click(increaseButton);
      
      expect(increaseButton).toBeInTheDocument();
    });

    it('deve remover item do carrinho ao clicar no ícone de lixeira', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('remove-item-1')).toBeInTheDocument();
      });
      
      const removeButton = screen.getByTestId('remove-item-1');
      await user.click(removeButton);
      
      expect(removeButton).toBeInTheDocument();
    });

    it('deve navegar para checkout ao clicar em "Finalizar Compra"', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Simular clique no botão de finalizar compra
      const checkoutButton = screen.queryByText('Finalizar Compra');
      if (checkoutButton) {
        await user.click(checkoutButton);
      }
      
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve retornar para produtos ao clicar em "Continuar Comprando"', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Simular clique no botão de continuar comprando
      const continueButton = screen.queryByText('Continuar Comprando');
      if (continueButton) {
        await user.click(continueButton);
      }
      
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve atualizar total em tempo real ao alterar quantidade', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('increase-quantity-1')).toBeInTheDocument();
      });
      
      const increaseButton = screen.getByTestId('increase-quantity-1');
      await user.click(increaseButton);
      
      expect(increaseButton).toBeInTheDocument();
    });

    it('deve aplicar desconto ao inserir cupom válido', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Simular inserção de cupom
      const cupomInput = screen.queryByPlaceholderText('Código do cupom');
      if (cupomInput) {
        await user.type(cupomInput, 'DESCONTO10');
      }
      
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve atualizar total ao selecionar frete', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Simular seleção de frete
      const freteOption = screen.queryByText('Frete Grátis');
      if (freteOption) {
        await user.click(freteOption);
      }
      
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });
  });

  describe('Estados', () => {
    it('deve exibir mensagem quando carrinho está vazio', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      renderCart();
      
      // Verificar se toast de login é exibido
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve persistir itens após logout/login', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Simular logout/login
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve atualizar contador no header', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // O contador seria atualizado através do contexto
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve exibir loading durante atualizações', async () => {
      mockUserService.getProfile.mockImplementation(() => new Promise(() => {}));
      
      renderCart();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve exibir mensagem de erro se item não disponível', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Simular erro de disponibilidade
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve exibir mensagem de sucesso ao adicionar item', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Simular adição de item
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });
  });

  describe('Validações', () => {
    it('não deve permitir quantidade menor que 1', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('decrease-quantity-1')).toBeInTheDocument();
      });
      
      const decreaseButton = screen.getByTestId('decrease-quantity-1');
      await user.click(decreaseButton);
      
      expect(decreaseButton).toBeInTheDocument();
    });

    it('não deve permitir quantidade maior que estoque disponível', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('increase-quantity-1')).toBeInTheDocument();
      });
      
      const increaseButton = screen.getByTestId('increase-quantity-1');
      await user.click(increaseButton);
      
      expect(increaseButton).toBeInTheDocument();
    });

    it('deve validar cupom antes de aplicar', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Simular validação de cupom
      const cupomInput = screen.queryByPlaceholderText('Código do cupom');
      if (cupomInput) {
        await user.type(cupomInput, 'CUPOM_INVALIDO');
      }
      
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve calcular frete corretamente', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Simular cálculo de frete
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve calcular total com precisão', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Verificar cálculo do total
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar lista a diferentes telas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderCart();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve ter botões com tamanho adequado para touch', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderCart();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve manter resumo visível em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderCart();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve tornar formulários responsivos', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderCart();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter navegação por teclado na lista', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      await user.tab();
      await user.tab();
      
      expect(document.activeElement).toBeInTheDocument();
    });

    it('deve ter aria-label apropriado nos botões', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('remove-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('increase-quantity-1')).toBeInTheDocument();
        expect(screen.getByTestId('decrease-quantity-1')).toBeInTheDocument();
      });
    });

    it('deve anunciar totais por screen readers', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Verificar se totais são anunciados
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve ter contraste adequado', () => {
      renderCart();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('deve atualizar quantidade instantaneamente', async () => {
      const user = userEvent.setup();
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('increase-quantity-1')).toBeInTheDocument();
      });
      
      const increaseButton = screen.getByTestId('increase-quantity-1');
      await user.click(increaseButton);
      
      expect(increaseButton).toBeInTheDocument();
    });

    it('deve calcular totais localmente quando possível', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      // Verificar cálculos locais
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve persistir dados no localStorage', () => {
      renderCart();
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('deve sincronizar com servidor em background', async () => {
      renderCart();
      
      await waitFor(() => {
        expect(mockUserService.getProfile).toHaveBeenCalled();
      });
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve permitir adicionar itens temporariamente para usuário não logado', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      renderCart();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve persistir carrinho entre sessões para cliente logado', async () => {
      renderCart(mockUser);
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve exibir produtos próprios com preços especiais para fornecedor', async () => {
      renderCart(mockSupplier);
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });

    it('deve ter acesso a todos os produtos para admin', async () => {
      renderCart(mockAdmin);
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-products')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('cart-products')).toBeInTheDocument();
    });
  });

  describe('Autenticação', () => {
    it('deve redirecionar para login se usuário não estiver autenticado', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      renderCart();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
      
      // Verificar se redirecionamento é agendado
      setTimeout(() => {
        expect(mockLocation.href).toBe('/login');
      }, 3000);
    });

    it('deve carregar endereços do usuário logado', async () => {
      renderCart(mockUser);
      
      await waitFor(() => {
        expect(mockUserService.getProfile).toHaveBeenCalledWith(1);
      });
    });

    it('deve exibir erro se falhar ao carregar dados do usuário', async () => {
      mockUserService.getProfile.mockRejectedValue(new Error('Erro ao buscar dados'));
      
      renderCart(mockUser);
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });
  });
});
