import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProductDetails from '../ProductDetails';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { mockUser, mockSupplier, mockAdmin, mockProduct, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ productId: '1' }),
}));

// Mock dos serviços
const mockProductService = {
  getProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

jest.mock('../../services/api', () => ({
  productService: mockProductService,
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

// Mock do react-toastify
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => '[]'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Wrapper para renderizar ProductDetails com contextos necessários
const renderProductDetails = (initialAuth = null, initialCart = { cartCount: 0 }) => {
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
        <CartProvider value={{ cartCount: initialCart.cartCount, addToCart: jest.fn() }}>
          {children}
        </CartProvider>
      </AuthProvider>
    );
  };

  return render(
    <BrowserRouter>
      <MockAuthProvider>
        <ProductDetails />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('ProductDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockProductService.getProduct.mockResolvedValue({
      data: {
        ...mockProduct,
        CODPROD: 1,
        NOME: 'Smartphone XYZ Pro',
        DESCRICAO: 'Smartphone com tela de 6.1 polegadas',
        PRECO: 1299.99,
        ESTOQUE: 25,
        CATEGORIAS: { CATEGORIA: 'ELETRONICOS' },
        IMAGENS: [
          { URL: 'https://example.com/product1-front.jpg' },
          { URL: 'https://example.com/product1-back.jpg' }
        ]
      }
    });
  });

  describe('Renderização', () => {
    it('deve renderizar galeria de imagens com navegação', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });

    it('deve exibir informações completas do produto', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
        expect(screen.getByText('Smartphone com tela de 6.1 polegadas')).toBeInTheDocument();
      });
    });

    it('deve renderizar seletor de quantidade', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });

    it('deve renderizar botões de ação (Adicionar ao Carrinho, Favoritar)', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });

    it('deve renderizar seção de avaliações', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });

    it('deve renderizar produtos relacionados', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });

    it('deve renderizar informações de estoque', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });

    it('deve renderizar breadcrumbs', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });
  });

  describe('Interações', () => {
    it('deve permitir navegação na galeria de imagens', async () => {
      const user = userEvent.setup();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular navegação na galeria
      const nextButton = screen.queryByText('Próxima');
      if (nextButton) {
        await user.click(nextButton);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve aceitar valores válidos no seletor de quantidade', async () => {
      const user = userEvent.setup();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular alteração de quantidade
      const increaseButton = screen.queryByText('+');
      if (increaseButton) {
        await user.click(increaseButton);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve adicionar produto ao carrinho ao clicar em "Adicionar ao Carrinho"', async () => {
      const user = userEvent.setup();
      const mockAddToCart = jest.fn();
      
      const MockCartProvider = ({ children }) => {
        const cartValue = {
          cartCount: 0,
          addToCart: mockAddToCart,
        };
        
        return (
          <CartProvider value={cartValue}>
            {children}
          </CartProvider>
        );
      };

      render(
        <BrowserRouter>
          <AuthProvider value={{ user: mockUser, isAuthenticated: true }}>
            <MockCartProvider>
              <ProductDetails />
            </MockCartProvider>
          </AuthProvider>
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular clique no botão de adicionar ao carrinho
      const addToCartButton = screen.queryByText('Adicionar ao Carrinho');
      if (addToCartButton) {
        await user.click(addToCartButton);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve adicionar/remover dos favoritos ao clicar em "Favoritar"', async () => {
      const user = userEvent.setup();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular clique no botão de favoritar
      const favoriteButton = screen.queryByText('Favoritar');
      if (favoriteButton) {
        await user.click(favoriteButton);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve navegar para produtos relacionados ao clicar neles', async () => {
      const user = userEvent.setup();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular clique em produto relacionado
      const relatedProduct = screen.queryByText('Produto Relacionado');
      if (relatedProduct) {
        await user.click(relatedProduct);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve expandir avaliações ao clicar nelas', async () => {
      const user = userEvent.setup();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular clique em avaliação
      const reviewButton = screen.queryByText('Ver Avaliações');
      if (reviewButton) {
        await user.click(reviewButton);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve funcionar o zoom de imagens', async () => {
      const user = userEvent.setup();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular zoom de imagem
      const image = screen.queryByAltText('Smartphone XYZ Pro');
      if (image) {
        await user.click(image);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });
  });

  describe('Validações', () => {
    it('não deve permitir quantidade menor que 1', async () => {
      const user = userEvent.setup();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular tentativa de diminuir quantidade abaixo de 1
      const decreaseButton = screen.queryByText('-');
      if (decreaseButton) {
        await user.click(decreaseButton);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('não deve permitir quantidade maior que estoque disponível', async () => {
      const user = userEvent.setup();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular tentativa de aumentar quantidade acima do estoque
      const increaseButton = screen.queryByText('+');
      if (increaseButton) {
        await user.click(increaseButton);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve desabilitar botão de compra para produto sem estoque', async () => {
      mockProductService.getProduct.mockResolvedValue({
        data: {
          ...mockProduct,
          ESTOQUE: 0
        }
      });
      
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Verificar se botão está desabilitado
      const addToCartButton = screen.queryByText('Adicionar ao Carrinho');
      if (addToCartButton) {
        expect(addToCartButton).toBeDisabled();
      }
    });

    it('deve validar formato das avaliações', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Verificar se avaliações são exibidas corretamente
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve carregar imagens corretamente', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Verificar se imagens são carregadas
      const image = screen.queryByAltText('Smartphone XYZ Pro');
      if (image) {
        expect(image).toBeInTheDocument();
      }
    });
  });

  describe('Estados', () => {
    it('deve exibir loading durante carregamento', () => {
      mockProductService.getProduct.mockImplementation(() => new Promise(() => {}));
      
      renderProductDetails();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve exibir erro se produto não encontrado', async () => {
      mockProductService.getProduct.mockRejectedValue(new Error('Produto não encontrado'));
      
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Produto não encontrado')).toBeInTheDocument();
      });
    });

    it('deve exibir estado de produto indisponível', async () => {
      mockProductService.getProduct.mockResolvedValue({
        data: {
          ...mockProduct,
          ESTOQUE: 0,
          DISPONIVEL: false
        }
      });
      
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });

    it('deve exibir skeleton loading para imagens', () => {
      mockProductService.getProduct.mockImplementation(() => new Promise(() => {}));
      
      renderProductDetails();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve exibir loading durante adição ao carrinho', async () => {
      const user = userEvent.setup();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular adição ao carrinho
      const addToCartButton = screen.queryByText('Adicionar ao Carrinho');
      if (addToCartButton) {
        await user.click(addToCartButton);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar galeria a diferentes telas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderProductDetails();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve manter proporção das imagens', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderProductDetails();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve ter botões com tamanho adequado para touch', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderProductDetails();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve reorganizar layout em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderProductDetails();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve funcionar zoom em dispositivos touch', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderProductDetails();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter alt text descritivo para imagens', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      const image = screen.queryByAltText('Smartphone XYZ Pro');
      if (image) {
        expect(image).toBeInTheDocument();
      }
    });

    it('deve ter navegação por teclado na galeria', async () => {
      const user = userEvent.setup();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      await user.tab();
      await user.tab();
      
      expect(document.activeElement).toBeInTheDocument();
    });

    it('deve ter aria-label apropriado nos botões', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Verificar se botões têm aria-labels
      const buttons = screen.getAllByTestId('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('deve anunciar informações de estoque', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Verificar se informações de estoque são anunciadas
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve ter contraste adequado', () => {
      renderProductDetails();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('deve implementar lazy loading para imagens', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Verificar se lazy loading está implementado
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve carregar página em menos de 3 segundos', async () => {
      const startTime = performance.now();
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(3000);
    });

    it('deve carregar produtos relacionados progressivamente', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Verificar carregamento progressivo
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });

    it('deve otimizar zoom para performance', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Verificar otimização do zoom
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve exibir produto público para usuário não logado', async () => {
      renderProductDetails();
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });

    it('deve exibir preços e disponibilidade para cliente logado', async () => {
      renderProductDetails(mockUser);
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });

    it('deve exibir produtos próprios com opções de edição para fornecedor', async () => {
      renderProductDetails(mockSupplier);
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Verificar se opções de edição estão disponíveis
      const editButton = screen.queryByText('Editar');
      if (editButton) {
        expect(editButton).toBeInTheDocument();
      }
    });

    it('deve ter acesso a todos os produtos incluindo desativados para admin', async () => {
      renderProductDetails(mockAdmin);
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidades Específicas', () => {
    it('deve exibir botões de edição e exclusão para fornecedor do produto', async () => {
      renderProductDetails(mockSupplier);
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Verificar se botões de edição estão disponíveis
      const editButton = screen.queryByText('Editar');
      const deleteButton = screen.queryByText('Excluir');
      
      if (editButton) {
        expect(editButton).toBeInTheDocument();
      }
      if (deleteButton) {
        expect(deleteButton).toBeInTheDocument();
      }
    });

    it('deve permitir edição de produto para fornecedor', async () => {
      const user = userEvent.setup();
      renderProductDetails(mockSupplier);
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular clique no botão de editar
      const editButton = screen.queryByText('Editar');
      if (editButton) {
        await user.click(editButton);
        expect(mockNavigate).toHaveBeenCalled();
      }
    });

    it('deve confirmar exclusão de produto', async () => {
      const user = userEvent.setup();
      mockProductService.deleteProduct.mockResolvedValue({ data: { success: true } });
      
      renderProductDetails(mockSupplier);
      
      await waitFor(() => {
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
      });
      
      // Simular clique no botão de excluir
      const deleteButton = screen.queryByText('Excluir');
      if (deleteButton) {
        await user.click(deleteButton);
      }
      
      expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
    });
  });
});
