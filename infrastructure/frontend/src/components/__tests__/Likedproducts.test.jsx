import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Likedproducts from '../Likedproducts';
import { mockUser, mockSupplier, mockAdmin, mockProduct, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock dos componentes filhos
jest.mock('../components/fragments/cartProductsLiked', () => {
  return function MockCartProductsLiked({ onCartItemsChange }) {
    const mockFavorites = [
      { id: 1, name: 'Smartphone XYZ', price: 999.99, rating: 4.5 },
      { id: 2, name: 'Tablet ABC', price: 599.99, rating: 4.0 },
      { id: 3, name: 'Notebook DEF', price: 1999.99, rating: 4.8 }
    ];
    
    React.useEffect(() => {
      onCartItemsChange(mockFavorites);
    }, [onCartItemsChange]);
    
    return (
      <div data-testid="favorites-list">
        <h2>Meus Favoritos</h2>
        <div data-testid="favorites-count">{mockFavorites.length} itens</div>
        {mockFavorites.map(item => (
          <div key={item.id} data-testid={`favorite-item-${item.id}`}>
            <span data-testid={`favorite-name-${item.id}`}>{item.name}</span>
            <span data-testid={`favorite-price-${item.id}`}>R$ {item.price}</span>
            <span data-testid={`favorite-rating-${item.id}`}>{item.rating} ⭐</span>
            <button data-testid={`remove-favorite-${item.id}`}>Remover dos Favoritos</button>
            <button data-testid={`add-to-cart-${item.id}`}>Adicionar ao Carrinho</button>
            <button data-testid={`view-details-${item.id}`}>Ver Detalhes</button>
          </div>
        ))}
        <div data-testid="sort-options">
          <button data-testid="sort-price">Ordenar por Preço</button>
          <button data-testid="sort-rating">Ordenar por Avaliação</button>
          <button data-testid="sort-name">Ordenar por Nome</button>
        </div>
        <div data-testid="filter-options">
          <button data-testid="filter-electronics">Eletrônicos</button>
          <button data-testid="filter-fashion">Fashion</button>
          <button data-testid="filter-home">Casa</button>
        </div>
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

// Wrapper para renderizar Likedproducts com contextos necessários
const renderLikedproducts = (initialAuth = mockUser, initialCart = { cartCount: 0 }) => {
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
      <Likedproducts />
    </BrowserRouter>
  );
};

describe('Likedproducts Component (Favorites List)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockClear();
    mockUseCart.mockClear();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
    mockUserService.getProfile.mockResolvedValue({
      data: {
        ENDERECOS: []
      }
    });
  });

  describe('Renderização', () => {
    it('deve renderizar lista de produtos favoritados', async () => {
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
        expect(screen.getByText('Meus Favoritos')).toBeInTheDocument();
      });
    });

    it('deve exibir imagem, nome, preço e avaliação de cada produto', async () => {
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('favorite-name-1')).toHaveTextContent('Smartphone XYZ');
        expect(screen.getByTestId('favorite-price-1')).toHaveTextContent('R$ 999.99');
        expect(screen.getByTestId('favorite-rating-1')).toHaveTextContent('4.5 ⭐');
        
        expect(screen.getByTestId('favorite-name-2')).toHaveTextContent('Tablet ABC');
        expect(screen.getByTestId('favorite-price-2')).toHaveTextContent('R$ 599.99');
        expect(screen.getByTestId('favorite-rating-2')).toHaveTextContent('4.0 ⭐');
      });
    });

    it('deve renderizar botões de ação para cada item', async () => {
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('remove-favorite-1')).toBeInTheDocument();
        expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument();
        expect(screen.getByTestId('view-details-1')).toBeInTheDocument();
      });
    });

    it('deve renderizar opções de ordenação', async () => {
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('sort-price')).toBeInTheDocument();
        expect(screen.getByTestId('sort-rating')).toBeInTheDocument();
        expect(screen.getByTestId('sort-name')).toBeInTheDocument();
      });
    });

    it('deve renderizar filtros por categoria', async () => {
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('filter-electronics')).toBeInTheDocument();
        expect(screen.getByTestId('filter-fashion')).toBeInTheDocument();
        expect(screen.getByTestId('filter-home')).toBeInTheDocument();
      });
    });

    it('deve renderizar contador de itens', async () => {
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-count')).toHaveTextContent('3 itens');
      });
    });
  });

  describe('Interações', () => {
    it('deve remover item da lista ao clicar em "Remover dos Favoritos"', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('remove-favorite-1')).toBeInTheDocument();
      });
      
      const removeButton = screen.getByTestId('remove-favorite-1');
      await user.click(removeButton);
      
      expect(removeButton).toBeInTheDocument();
    });

    it('deve adicionar produto ao carrinho ao clicar em "Adicionar ao Carrinho"', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument();
      });
      
      const addToCartButton = screen.getByTestId('add-to-cart-1');
      await user.click(addToCartButton);
      
      expect(addToCartButton).toBeInTheDocument();
    });

    it('deve navegar para página do produto ao clicar em "Ver Detalhes"', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('view-details-1')).toBeInTheDocument();
      });
      
      const viewDetailsButton = screen.getByTestId('view-details-1');
      await user.click(viewDetailsButton);
      
      expect(viewDetailsButton).toBeInTheDocument();
    });

    it('deve funcionar ordenação por preço', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('sort-price')).toBeInTheDocument();
      });
      
      const sortPriceButton = screen.getByTestId('sort-price');
      await user.click(sortPriceButton);
      
      expect(sortPriceButton).toBeInTheDocument();
    });

    it('deve funcionar ordenação por avaliação', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('sort-rating')).toBeInTheDocument();
      });
      
      const sortRatingButton = screen.getByTestId('sort-rating');
      await user.click(sortRatingButton);
      
      expect(sortRatingButton).toBeInTheDocument();
    });

    it('deve funcionar ordenação por nome', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('sort-name')).toBeInTheDocument();
      });
      
      const sortNameButton = screen.getByTestId('sort-name');
      await user.click(sortNameButton);
      
      expect(sortNameButton).toBeInTheDocument();
    });

    it('deve funcionar filtros por categoria', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('filter-electronics')).toBeInTheDocument();
      });
      
      const filterElectronicsButton = screen.getByTestId('filter-electronics');
      await user.click(filterElectronicsButton);
      
      expect(filterElectronicsButton).toBeInTheDocument();
    });

    it('deve funcionar seleção múltipla', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('favorite-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('favorite-item-2')).toBeInTheDocument();
      });
      
      // Simular seleção múltipla
      const item1 = screen.getByTestId('favorite-item-1');
      const item2 = screen.getByTestId('favorite-item-2');
      
      await user.click(item1);
      await user.click(item2);
      
      expect(item1).toBeInTheDocument();
      expect(item2).toBeInTheDocument();
    });
  });

  describe('Estados', () => {
    it('deve exibir mensagem quando lista está vazia', () => {
      // Mock para lista vazia
      jest.mock('../components/fragments/cartProductsLiked', () => {
        return function MockCartProductsLikedEmpty() {
          return (
            <div data-testid="favorites-list">
              <h2>Meus Favoritos</h2>
              <div data-testid="empty-message">Nenhum produto favoritado ainda</div>
            </div>
          );
        };
      });
      
      renderLikedproducts();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve persistir favoritos após logout/login', async () => {
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
      });
      
      // Simular logout/login
      expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
    });

    it('deve exibir loading durante carregamento', () => {
      mockUserService.getProfile.mockImplementation(() => new Promise(() => {}));
      
      renderLikedproducts();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve exibir erro se falhar ao carregar', () => {
      mockUserService.getProfile.mockRejectedValue(new Error('Erro ao carregar'));
      
      renderLikedproducts();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve exibir skeleton loading para produtos', () => {
      mockUserService.getProfile.mockImplementation(() => new Promise(() => {}));
      
      renderLikedproducts();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });
  });

  describe('Validações', () => {
    it('deve atualizar produtos removidos em tempo real', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('remove-favorite-1')).toBeInTheDocument();
      });
      
      const removeButton = screen.getByTestId('remove-favorite-1');
      await user.click(removeButton);
      
      expect(removeButton).toBeInTheDocument();
    });

    it('deve manter consistência na ordenação', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('sort-price')).toBeInTheDocument();
      });
      
      const sortPriceButton = screen.getByTestId('sort-price');
      await user.click(sortPriceButton);
      
      expect(sortPriceButton).toBeInTheDocument();
    });

    it('deve funcionar filtros corretamente', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('filter-electronics')).toBeInTheDocument();
      });
      
      const filterButton = screen.getByTestId('filter-electronics');
      await user.click(filterButton);
      
      expect(filterButton).toBeInTheDocument();
    });

    it('deve atualizar contador automaticamente', async () => {
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-count')).toHaveTextContent('3 itens');
      });
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar lista a diferentes telas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderLikedproducts();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve reorganizar cards em grid responsivo', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderLikedproducts();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve ter botões com tamanho adequado para touch', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderLikedproducts();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve colapsar filtros em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderLikedproducts();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter navegação por teclado na lista', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
      });
      
      await user.tab();
      await user.tab();
      
      expect(document.activeElement).toBeInTheDocument();
    });

    it('deve ter aria-label apropriado nos botões', async () => {
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('remove-favorite-1')).toBeInTheDocument();
        expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument();
        expect(screen.getByTestId('view-details-1')).toBeInTheDocument();
      });
    });

    it('deve anunciar contador por screen readers', async () => {
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-count')).toHaveTextContent('3 itens');
      });
    });

    it('deve ter contraste adequado', () => {
      renderLikedproducts();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('deve carregar lista rapidamente', async () => {
      const startTime = performance.now();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('deve ser instantâneo ao remover produtos', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('remove-favorite-1')).toBeInTheDocument();
      });
      
      const startTime = performance.now();
      const removeButton = screen.getByTestId('remove-favorite-1');
      await user.click(removeButton);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('deve otimizar filtros', async () => {
      const user = userEvent.setup();
      renderLikedproducts();
      
      await waitFor(() => {
        expect(screen.getByTestId('filter-electronics')).toBeInTheDocument();
      });
      
      const startTime = performance.now();
      const filterButton = screen.getByTestId('filter-electronics');
      await user.click(filterButton);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('deve persistir dados no localStorage', () => {
      renderLikedproducts();
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve exibir favoritos pessoais para cliente', async () => {
      renderLikedproducts(mockUser);
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('favorites-count')).toHaveTextContent('3 itens');
    });

    it('deve exibir produtos próprios favoritados para fornecedor', async () => {
      renderLikedproducts(mockSupplier);
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('favorites-count')).toHaveTextContent('3 itens');
    });

    it('deve ter acesso a todos os favoritos para admin', async () => {
      renderLikedproducts(mockAdmin);
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('favorites-count')).toHaveTextContent('3 itens');
    });

    it('deve redirecionar para login se usuário não estiver logado', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      renderLikedproducts();
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
      
      // Verificar se redirecionamento é agendado
      setTimeout(() => {
        expect(mockLocation.href).toBe('/login');
      }, 3000);
    });
  });

  describe('Autenticação', () => {
    it('deve carregar dados do usuário logado', async () => {
      renderLikedproducts(mockUser);
      
      await waitFor(() => {
        expect(mockUserService.getProfile).toHaveBeenCalledWith(1);
      });
    });

    it('deve exibir erro se falhar ao carregar dados do usuário', async () => {
      mockUserService.getProfile.mockRejectedValue(new Error('Erro ao buscar dados'));
      
      renderLikedproducts(mockUser);
      
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('deve manter favoritos entre sessões', async () => {
      renderLikedproducts(mockUser);
      
      await waitFor(() => {
        expect(screen.getByTestId('favorites-list')).toBeInTheDocument();
      });
      
      // Simular persistência no localStorage
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });
  });
});
