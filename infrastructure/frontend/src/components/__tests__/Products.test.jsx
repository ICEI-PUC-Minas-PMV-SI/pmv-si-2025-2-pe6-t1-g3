import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Products from '../Products';
import { mockUser, mockProduct, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock do hook useInfiniteProducts
const mockProducts = [
  mockProduct,
  {
    ...mockProduct,
    CODPROD: 2,
    PRODUTO: 'Tablet ABC',
    PRECO: 599.99,
    CATEGORIA: 'Eletrônicos'
  },
  {
    ...mockProduct,
    CODPROD: 3,
    PRODUTO: 'Notebook XYZ',
    PRECO: 1999.99,
    CATEGORIA: 'Eletrônicos'
  }
];

const mockUseInfiniteProducts = jest.fn(() => ({
  products: mockProducts,
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: true,
  loadMore: jest.fn(),
  allProductsCount: 3
}));

jest.mock('../../hooks/useInfiniteProducts', () => ({
  useInfiniteProducts: () => mockUseInfiniteProducts()
}));

// Mock do ProductGrid
jest.mock('../Product/ProductGrid', () => {
  return function MockProductGrid({ products, loading, error }) {
    if (loading) return <div data-testid="loading">Carregando produtos...</div>;
    if (error) return <div data-testid="error">Erro ao carregar produtos</div>;
    
    return (
      <div data-testid="product-grid">
        {products && products.map(product => (
          <div key={product.CODPROD} data-testid={`product-${product.CODPROD}`}>
            <h3>{product.PRODUTO || product.NOME}</h3>
            <p>R$ {product.PRECO}</p>
          </div>
        ))}
      </div>
    );
  };
});

// Mock do LoadingSpinner
jest.mock('../UI/LoadingSpinner', () => {
  return function MockLoadingSpinner({ size }) {
    return <div data-testid="loading-spinner">Carregando...</div>;
  };
});

// Wrapper para renderizar Products
const renderProducts = () => {
  return render(
    <BrowserRouter>
      <Products />
    </BrowserRouter>
  );
};

describe('Products Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseInfiniteProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
      allProductsCount: 3
    });
  });

  describe('Renderização', () => {
    it('deve renderizar título "Todos os Produtos"', () => {
      renderProducts();
      
      expect(screen.getByText('Todos os Produtos')).toBeInTheDocument();
    });

    it('deve renderizar descrição com contagem de produtos', () => {
      renderProducts();
      
      expect(screen.getByText(/Explore nossa seleção completa de/i)).toBeInTheDocument();
      expect(screen.getByText(/3 produtos/i)).toBeInTheDocument();
    });

    it('deve renderizar ProductGrid com produtos', () => {
      renderProducts();
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });

    it('deve renderizar botão "Ver mais" quando há mais produtos', () => {
      renderProducts();
      
      expect(screen.getByText('Ver mais')).toBeInTheDocument();
    });

    it('deve renderizar mensagem quando todos os produtos foram carregados', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: false,
        loadMore: jest.fn(),
        allProductsCount: 3
      });

      renderProducts();
      
      expect(screen.getByText('Todos os produtos foram carregados')).toBeInTheDocument();
    });
  });

  describe('Estados', () => {
    it('deve exibir loading state durante carregamento inicial', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: [],
        loading: true,
        loadingMore: false,
        error: null,
        hasMore: true,
        loadMore: jest.fn(),
        allProductsCount: 0
      });

      renderProducts();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve exibir mensagem de erro se falhar ao carregar produtos', () => {
      const errorMessage = 'Erro ao carregar produtos';
      mockUseInfiniteProducts.mockReturnValue({
        products: [],
        loading: false,
        loadingMore: false,
        error: errorMessage,
        hasMore: false,
        loadMore: jest.fn(),
        allProductsCount: 0
      });

      renderProducts();
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('deve exibir estado vazio quando não há produtos', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: [],
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: false,
        loadMore: jest.fn(),
        allProductsCount: 0
      });

      renderProducts();
      
      expect(screen.queryByTestId('product-grid')).not.toBeInTheDocument();
    });

    it('deve exibir contagem correta de produtos na descrição', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: true,
        loadMore: jest.fn(),
        allProductsCount: 10
      });

      renderProducts();
      
      expect(screen.getByText(/10 produtos/i)).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve chamar loadMore quando clicar em "Ver mais"', async () => {
      const user = userEvent.setup();
      const mockLoadMore = jest.fn();
      
      mockUseInfiniteProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: true,
        loadMore: mockLoadMore,
        allProductsCount: 3
      });

      renderProducts();
      
      const verMaisButton = screen.getByText('Ver mais');
      await user.click(verMaisButton);
      
      expect(mockLoadMore).toHaveBeenCalledTimes(1);
    });

    it('deve desabilitar botão "Ver mais" durante carregamento', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        loadingMore: true,
        error: null,
        hasMore: true,
        loadMore: jest.fn(),
        allProductsCount: 3
      });

      renderProducts();
      
      const verMaisButton = screen.getByText('Carregando...');
      expect(verMaisButton).toBeDisabled();
    });

    it('deve exibir texto "Carregando..." no botão durante carregamento', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        loadingMore: true,
        error: null,
        hasMore: true,
        loadMore: jest.fn(),
        allProductsCount: 3
      });

      renderProducts();
      
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar-se corretamente em mobile (320px)', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderProducts();
      
      expect(screen.getByText('Todos os Produtos')).toBeInTheDocument();
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });

    it('deve adaptar-se corretamente em tablet (768px)', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderProducts();
      
      expect(screen.getByText('Todos os Produtos')).toBeInTheDocument();
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });

    it('deve adaptar-se corretamente em desktop (1024px+)', () => {
      mockScreenSize(BREAKPOINTS.DESKTOP);
      renderProducts();
      
      expect(screen.getByText('Todos os Produtos')).toBeInTheDocument();
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter estrutura semântica adequada', () => {
      renderProducts();
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('deve ter botão acessível', () => {
      renderProducts();
      
      const verMaisButton = screen.getByText('Ver mais');
      expect(verMaisButton).toBeInTheDocument();
      expect(verMaisButton.tagName).toBe('BUTTON');
    });

    it('deve funcionar com navegação por teclado', async () => {
      const user = userEvent.setup();
      renderProducts();
      
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });
  });

  describe('Paginação Infinita', () => {
    it('deve renderizar produtos iniciais corretamente', () => {
      renderProducts();
      
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });

    it('deve permitir carregar mais produtos', async () => {
      const user = userEvent.setup();
      const mockLoadMore = jest.fn();
      
      mockUseInfiniteProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: true,
        loadMore: mockLoadMore,
        allProductsCount: 20
      });

      renderProducts();
      
      const verMaisButton = screen.getByText('Ver mais');
      await user.click(verMaisButton);
      
      expect(mockLoadMore).toHaveBeenCalled();
    });

    it('não deve exibir botão quando não há mais produtos', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: false,
        loadMore: jest.fn(),
        allProductsCount: 3
      });

      renderProducts();
      
      expect(screen.queryByText('Ver mais')).not.toBeInTheDocument();
    });
  });
});
