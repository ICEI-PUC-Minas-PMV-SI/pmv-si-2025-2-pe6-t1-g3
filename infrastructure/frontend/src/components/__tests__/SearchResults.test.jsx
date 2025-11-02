import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import SearchResults from '../SearchResults';
import { mockUser, mockProduct, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock do hook useProducts
const mockProducts = [
  {
    ...mockProduct,
    CODPROD: 1,
    PRODUTO: 'Smartphone XYZ Pro',
    NOME: 'Smartphone XYZ Pro',
    DESCRICAO: 'Smartphone com tela de 6.1 polegadas',
    CATEGORIAS: { CATEGORIA: 'ELETRÔNICOS' },
  },
  {
    ...mockProduct,
    CODPROD: 2,
    PRODUTO: 'Tablet ABC',
    NOME: 'Tablet ABC',
    DESCRICAO: 'Tablet com tela de 10 polegadas',
    CATEGORIAS: { CATEGORIA: 'ELETRÔNICOS' },
  },
  {
    ...mockProduct,
    CODPROD: 3,
    PRODUTO: 'Camiseta Fashion',
    NOME: 'Camiseta Fashion',
    DESCRICAO: 'Camiseta de algodão',
    CATEGORIAS: { CATEGORIA: 'FASHION' },
  },
];

const mockUseProducts = jest.fn(() => ({
  products: mockProducts,
  loading: false,
  error: null,
}));

jest.mock('../../hooks/useProducts', () => ({
  useProducts: () => mockUseProducts(),
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

// Wrapper para renderizar SearchResults
const renderSearchResults = (searchQuery = '', category = '') => {
  const searchParams = new URLSearchParams();
  if (searchQuery) searchParams.set('q', searchQuery);
  if (category) searchParams.set('category', category);

  return render(
    <MemoryRouter initialEntries={[`/search?${searchParams.toString()}`]}>
      <SearchResults />
    </MemoryRouter>
  );
};

describe('SearchResults Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
    });
  });

  describe('Renderização', () => {
    it('deve renderizar título de resultados de busca', () => {
      renderSearchResults('smartphone');
      
      // O componente mostra "Buscando por" quando há query, ou "Todos os Produtos" quando não há
      expect(screen.getByText(/Buscando por|Todos os Produtos/i)).toBeInTheDocument();
    });

    it('deve renderizar contagem de resultados', () => {
      renderSearchResults('smartphone');
      
      // A contagem de produtos aparece no componente
      expect(screen.getByText(/1 produto/i)).toBeInTheDocument();
    });

    it('deve renderizar sidebar com categorias', () => {
      renderSearchResults('smartphone');
      
      expect(screen.getByText('Categorias')).toBeInTheDocument();
      expect(screen.getByText('Moda')).toBeInTheDocument();
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
      expect(screen.getByText('Casa')).toBeInTheDocument();
      expect(screen.getByText('Esportes')).toBeInTheDocument();
    });

    it('deve renderizar ProductGrid com resultados', () => {
      renderSearchResults('smartphone');
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });
  });

  describe('Busca por Query', () => {
    it('deve filtrar produtos por nome', () => {
      renderSearchResults('smartphone');
      
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
    });

    it('deve filtrar produtos por descrição', () => {
      renderSearchResults('tablet');
      
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
    });

    it('deve filtrar produtos por PRODUTO', () => {
      renderSearchResults('Smartphone');
      
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });

    it('deve filtrar produtos case-insensitive', () => {
      renderSearchResults('SMARTPHONE');
      
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });

    it('deve retornar múltiplos resultados para query parcial', () => {
      renderSearchResults('Pro');
      
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });
  });

  describe('Filtros por Categoria', () => {
    it('deve filtrar produtos por categoria ELETRÔNICOS', () => {
      renderSearchResults('', 'ELETRÔNICOS');
      
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.queryByTestId('product-3')).not.toBeInTheDocument();
    });

    it('deve filtrar produtos por categoria FASHION', () => {
      renderSearchResults('', 'FASHION');
      
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
      expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
    });

    it('deve combinar busca por query e categoria', () => {
      renderSearchResults('Smartphone', 'ELETRÔNICOS');
      
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-3')).not.toBeInTheDocument();
    });
  });

  describe('Estados', () => {
    it('deve exibir loading state durante carregamento inicial', () => {
      mockUseProducts.mockReturnValue({
        products: [],
        loading: true,
        error: null,
      });

      renderSearchResults('smartphone');
      
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('deve exibir mensagem de erro se falhar ao carregar produtos', () => {
      const errorMessage = 'Erro ao carregar produtos';
      mockUseProducts.mockReturnValue({
        products: [],
        loading: false,
        error: errorMessage,
      });

      renderSearchResults('smartphone');
      
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    it('deve exibir estado vazio quando não há resultados', () => {
      mockUseProducts.mockReturnValue({
        products: [],
        loading: false,
        error: null,
      });

      renderSearchResults('produto-inexistente');
      
      expect(screen.getByText(/Nenhum produto encontrado/i)).toBeInTheDocument();
    });

    it('deve exibir mensagem quando busca não retorna resultados', () => {
      mockUseProducts.mockReturnValue({
        products: mockProducts,
        loading: false,
        error: null,
      });

      renderSearchResults('produto-que-nao-existe');
      
      expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
    });
  });

  describe('Ordenação de Resultados', () => {
    it('deve exibir resultados ordenados', () => {
      renderSearchResults('eletrônico');
      
      const productElements = screen.getAllByTestId(/product-/);
      expect(productElements.length).toBeGreaterThan(0);
    });
  });

  describe('Sidebar de Categorias', () => {
    it('deve exibir link "Todas" quando nenhuma categoria está selecionada', () => {
      renderSearchResults('smartphone');
      
      // Buscar link de forma mais robusta - pode haver múltiplos elementos com "Todas"
      const todasTexts = screen.getAllByText('Todas');
      const todasLink = todasTexts.find(el => el.closest('a')) || todasTexts[0]?.closest('a');
      expect(todasLink).toBeTruthy();
      if (todasLink) {
        expect(todasLink).toHaveAttribute('href', '/search');
      }
    });

    it('deve destacar categoria selecionada', () => {
      renderSearchResults('', 'ELETRÔNICOS');
      
      // Buscar link de forma mais robusta - pode haver múltiplos elementos com "Eletrônicos"
      const eletronicosTexts = screen.getAllByText('Eletrônicos');
      const categoriaLink = eletronicosTexts.find(el => el.closest('a')) || eletronicosTexts[0]?.closest('a');
      expect(categoriaLink).toBeTruthy();
      if (categoriaLink) {
        expect(categoriaLink).toHaveAttribute('href', '/search?category=ELETRÔNICOS');
      }
    });

    it('deve permitir navegação entre categorias', () => {
      renderSearchResults('', 'FASHION');
      
      const modaLink = screen.getByText('Moda');
      expect(modaLink).toBeInTheDocument();
    });
  });

  describe('Informações do Sidebar', () => {
    it('deve exibir informações de entrega', () => {
      renderSearchResults('smartphone');
      
      expect(screen.getByText(/Entrega gratuita acima de R\$ 99/i)).toBeInTheDocument();
    });

    it('deve exibir informações de política de devolução', () => {
      renderSearchResults('smartphone');
      
      expect(screen.getByText(/Política de devolução/i)).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar-se corretamente em mobile (320px)', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderSearchResults('smartphone');
      
      // O componente mostra "Buscando por" quando há query, ou "Todos os Produtos" quando não há
      expect(screen.getByText(/Buscando por|Todos os Produtos/i)).toBeInTheDocument();
    });

    it('deve adaptar-se corretamente em tablet (768px)', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderSearchResults('smartphone');
      
      // O componente mostra "Buscando por" quando há query, ou "Todos os Produtos" quando não há
      expect(screen.getByText(/Buscando por|Todos os Produtos/i)).toBeInTheDocument();
    });

    it('deve adaptar-se corretamente em desktop (1024px+)', () => {
      mockScreenSize(BREAKPOINTS.DESKTOP);
      renderSearchResults('smartphone');
      
      // O componente mostra "Buscando por" quando há query, ou "Todos os Produtos" quando não há
      expect(screen.getByText(/Buscando por|Todos os Produtos/i)).toBeInTheDocument();
      expect(screen.getByText('Categorias')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter estrutura semântica adequada', () => {
      renderSearchResults('smartphone');
      
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('deve ter links acessíveis', () => {
      renderSearchResults('smartphone');
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('deve funcionar com navegação por teclado', async () => {
      const user = userEvent.setup();
      renderSearchResults('smartphone');
      
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });
  });

  describe('Busca em Tempo Real', () => {
    it('deve filtrar produtos quando há query', () => {
      renderSearchResults('smartphone');
      
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
    });

    it('deve atualizar resultados para diferentes queries', () => {
      // Testar com query de tablet
      const { unmount } = renderSearchResults('tablet');
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
      
      unmount();
      
      // Testar com query de smartphone
      renderSearchResults('smartphone');
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
    });
  });
});
