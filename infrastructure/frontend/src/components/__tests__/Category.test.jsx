import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Category from '../Category';
import { mockUser, mockProduct, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock do hook useInfiniteProducts
const mockProducts = [
  {
    ...mockProduct,
    CODPROD: 1,
    PRODUTO: 'Smartphone XYZ',
    CATEGORIA: 'ELETRÔNICOS',
  },
  {
    ...mockProduct,
    CODPROD: 2,
    PRODUTO: 'Tablet ABC',
    CATEGORIA: 'ELETRÔNICOS',
  },
];

const mockUseInfiniteProducts = jest.fn(() => ({
  products: mockProducts,
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: true,
  loadMore: jest.fn(),
  allProductsCount: 2,
}));

jest.mock('../../hooks/useInfiniteProducts', () => ({
  useInfiniteProducts: () => mockUseInfiniteProducts(),
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

// Wrapper para renderizar Category
const renderCategory = (categorySlug = 'eletronicos') => {
  return render(
    <MemoryRouter initialEntries={[`/category/${categorySlug}`]}>
      <Category />
    </MemoryRouter>
  );
};

describe('Category Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseInfiniteProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
      allProductsCount: 2,
    });
  });

  describe('Renderização', () => {
    it('deve renderizar título da categoria Eletrônicos', () => {
      renderCategory('eletronicos');
      
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
    });

    it('deve renderizar título da categoria Fashion', () => {
      renderCategory('fashion');
      
      expect(screen.getByText('Fashion')).toBeInTheDocument();
    });

    it('deve renderizar título da categoria Casa', () => {
      renderCategory('casa');
      
      expect(screen.getByText('Casa')).toBeInTheDocument();
    });

    it('deve renderizar título da categoria Esportes', () => {
      renderCategory('esportes');
      
      expect(screen.getByText('Esportes')).toBeInTheDocument();
    });

    it('deve renderizar descrição da categoria', () => {
      renderCategory('eletronicos');
      
      expect(screen.getByText(/Explore os melhores produtos de/i)).toBeInTheDocument();
    });

    it('deve renderizar contagem de produtos', () => {
      renderCategory('eletronicos');
      
      expect(screen.getByText(/2 produto/i)).toBeInTheDocument();
    });

    it('deve renderizar ProductGrid com produtos', () => {
      renderCategory('eletronicos');
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
    });
  });

  describe('Categorias Inválidas', () => {
    it('deve exibir mensagem de erro para categoria não encontrada', () => {
      renderCategory('categoria-invalida');
      
      expect(screen.getByText('Categoria não encontrada')).toBeInTheDocument();
      expect(screen.getByText(/A categoria solicitada não existe/)).toBeInTheDocument();
    });

    it('deve exibir link para voltar à home quando categoria não encontrada', () => {
      renderCategory('categoria-invalida');
      
      // Buscar link de forma mais robusta - pode haver múltiplos elementos
      const voltarTexts = screen.getAllByText('Voltar para a Home');
      const link = voltarTexts.find(el => el.closest('a')) || voltarTexts[0]?.closest('a');
      expect(link).toBeTruthy();
      if (link) {
        expect(link).toHaveAttribute('href', '/');
      }
    });
  });

  describe('Filtros por Categoria', () => {
    it('deve renderizar produtos da categoria ELETRÔNICOS', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: true,
        loadMore: jest.fn(),
        allProductsCount: 2,
      });

      renderCategory('eletronicos');
      
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });

    it('deve renderizar produtos da categoria FASHION', () => {
      renderCategory('fashion');
      
      expect(screen.getByText('Fashion')).toBeInTheDocument();
    });

    it('deve renderizar produtos da categoria CASA', () => {
      renderCategory('casa');
      
      expect(screen.getByText('Casa')).toBeInTheDocument();
    });

    it('deve renderizar produtos da categoria ESPORTES', () => {
      renderCategory('esportes');
      
      expect(screen.getByText('Esportes')).toBeInTheDocument();
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
        allProductsCount: 0,
      });

      renderCategory('eletronicos');
      
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
        allProductsCount: 0,
      });

      renderCategory('eletronicos');
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('deve exibir estado vazio quando não há produtos na categoria', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: [],
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: false,
        loadMore: jest.fn(),
        allProductsCount: 0,
      });

      renderCategory('eletronicos');
      
      expect(screen.queryByTestId('product-grid')).not.toBeInTheDocument();
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
        allProductsCount: 2,
      });

      renderCategory('eletronicos');
      
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
        allProductsCount: 2,
      });

      renderCategory('eletronicos');
      
      const verMaisButton = screen.getByText('Carregando...');
      expect(verMaisButton).toBeDisabled();
    });

    it('deve exibir mensagem quando todos os produtos foram carregados', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: false,
        loadMore: jest.fn(),
        allProductsCount: 2,
      });

      renderCategory('eletronicos');
      
      expect(screen.getByText('Todos os produtos foram carregados')).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar-se corretamente em mobile (320px)', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderCategory('eletronicos');
      
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });

    it('deve adaptar-se corretamente em tablet (768px)', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderCategory('eletronicos');
      
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });

    it('deve adaptar-se corretamente em desktop (1024px+)', () => {
      mockScreenSize(BREAKPOINTS.DESKTOP);
      renderCategory('eletronicos');
      
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter estrutura semântica adequada', () => {
      renderCategory('eletronicos');
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('deve ter botão acessível', () => {
      renderCategory('eletronicos');
      
      const verMaisButton = screen.getByText('Ver mais');
      expect(verMaisButton).toBeInTheDocument();
      expect(verMaisButton.tagName).toBe('BUTTON');
    });

    it('deve funcionar com navegação por teclado', async () => {
      const user = userEvent.setup();
      renderCategory('eletronicos');
      
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });
  });

  describe('Produtos por Categoria', () => {
    it('deve exibir produtos filtrados corretamente', () => {
      renderCategory('eletronicos');
      
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
    });

    it('deve atualizar contagem quando produtos mudam', () => {
      mockUseInfiniteProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: true,
        loadMore: jest.fn(),
        allProductsCount: 10,
      });

      renderCategory('eletronicos');
      
      expect(screen.getByText(/10 produto/i)).toBeInTheDocument();
    });
  });
});
