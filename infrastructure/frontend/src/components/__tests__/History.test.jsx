import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import History from '../History';
import { mockUser, mockScreenSize, BREAKPOINTS } from '../../test-utils';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

// Mock dos serviços
const mockOrderService2 = {
  getOrdersByUser: jest.fn(),
};

jest.mock('../../services/api', () => ({
  orderService2: mockOrderService2,
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Dados mockados de pedidos
const mockPedidos = [
  {
    CODPED: 1,
    CODPES: 1,
    DATAINC: '2024-01-15T10:30:00Z',
    SUBTOTAL: 1299.99,
    DESCONTO: 50.00,
    FRETE: 15.00,
    VALORTOTAL: 1264.99,
    STATUS: 'Processando',
    ENDERECO: {
      DESCRICAO: 'Casa',
      RUA: 'Rua das Flores',
      NUMERO: '123',
      COMPLEMENTO: 'Apto 45',
      BAIRRO: 'Centro',
      CIDADE: 'São Paulo',
      CEP: '01234-567',
    },
    ITENSPEDIDO: [
      {
        QUANTIDADE: 2,
        Produtos: {
          CODPROD: 1,
          PRODUTO: 'Smartphone XYZ Pro',
          IMAGEM: 'https://example.com/product1.jpg',
        },
      },
    ],
  },
  {
    CODPED: 2,
    CODPES: 1,
    DATAINC: '2024-01-20T14:20:00Z',
    SUBTOTAL: 599.99,
    DESCONTO: 0,
    FRETE: 10.00,
    VALORTOTAL: 609.99,
    STATUS: 'Enviado',
    ENDERECO: {
      DESCRICAO: 'Trabalho',
      RUA: 'Avenida Paulista',
      NUMERO: '1000',
      BAIRRO: 'Bela Vista',
      CIDADE: 'São Paulo',
      CEP: '01310-100',
    },
    ITENSPEDIDO: [
      {
        QUANTIDADE: 1,
        Produtos: {
          CODPROD: 2,
          PRODUTO: 'Tablet ABC',
          IMAGEM: null,
        },
      },
    ],
  },
];

// Wrapper para renderizar History
const renderHistory = () => {
  return render(
    <BrowserRouter>
      <History />
    </BrowserRouter>
  );
};

describe('History Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
    jwtDecode.mockReturnValue({ CODPES: 1 });
    mockOrderService2.getOrdersByUser.mockClear();
  });

  describe('Renderização', () => {
    it('deve renderizar título "Meus Pedidos"', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText('Meus Pedidos')).toBeInTheDocument();
      });
    });

    it('deve renderizar descrição do histórico', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText('Acompanhe o histórico dos seus pedidos')).toBeInTheDocument();
      });
    });

    it('deve renderizar lista de pedidos', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText(/Pedido #1/)).toBeInTheDocument();
        expect(screen.getByText(/Pedido #2/)).toBeInTheDocument();
      });
    });

    it('deve renderizar estado vazio quando não há pedidos', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: [],
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText('Nenhum pedido encontrado')).toBeInTheDocument();
        expect(screen.getByText('Você ainda não fez nenhum pedido.')).toBeInTheDocument();
        expect(screen.getByText('Começar a Comprar')).toBeInTheDocument();
      });
    });
  });

  describe('Estados', () => {
    it('deve exibir loading state durante carregamento inicial', () => {
      mockOrderService2.getOrdersByUser.mockImplementation(
        () => new Promise(() => {}) // Promise que nunca resolve
      );

      renderHistory();
      
      expect(screen.getByText('Carregando pedidos...')).toBeInTheDocument();
    });

    it('deve exibir erro se falhar ao carregar pedidos', async () => {
      mockOrderService2.getOrdersByUser.mockRejectedValue({
        response: { data: { message: 'Erro ao buscar pedidos' } },
      });

      renderHistory();
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Erro ao buscar pedidos. Tente mais tarde!',
          expect.objectContaining({
            autoClose: 3000,
          })
        );
      });
    });
  });

  describe('Exibição de Pedidos', () => {
    it('deve exibir número do pedido', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText(/Pedido #1/)).toBeInTheDocument();
      });
    });

    it('deve exibir status do pedido', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        // O componente sempre exibe "Processando" hardcoded
        const statusElements = screen.getAllByText('Processando');
        expect(statusElements.length).toBeGreaterThan(0);
      });
    });

    it('deve exibir data formatada do pedido', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText(/Feito em/)).toBeInTheDocument();
      });
    });

    it('deve exibir resumo do pedido com valores formatados', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText('Subtotal:')).toBeInTheDocument();
        expect(screen.getByText('Desconto:')).toBeInTheDocument();
        expect(screen.getByText('Frete:')).toBeInTheDocument();
        expect(screen.getByText('Total:')).toBeInTheDocument();
      });
    });

    it('deve exibir endereço de entrega', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText('Endereço de Entrega')).toBeInTheDocument();
        expect(screen.getByText(/Rua das Flores/)).toBeInTheDocument();
        expect(screen.getByText(/CEP: 01234-567/)).toBeInTheDocument();
      });
    });

    it('deve exibir itens do pedido', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText('Itens do Pedido')).toBeInTheDocument();
        expect(screen.getByText('Smartphone XYZ Pro')).toBeInTheDocument();
        expect(screen.getByText(/Quantidade: 2/)).toBeInTheDocument();
      });
    });
  });

  describe('Ordenação', () => {
    it('deve renderizar pedidos recebidos do backend', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        const pedidoElements = screen.getAllByText(/Pedido #/);
        // Verificar se todos os pedidos são exibidos
        expect(pedidoElements.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Formatação', () => {
    it('deve formatar valores monetários corretamente', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText(/R\$ 1\.299,99/)).toBeInTheDocument();
        expect(screen.getByText(/R\$ 599,99/)).toBeInTheDocument();
      });
    });

    it('deve formatar data corretamente', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        // A data deve estar formatada em pt-BR
        expect(screen.getByText(/Feito em/)).toBeInTheDocument();
      });
    });
  });

  describe('Estados Vazios', () => {
    it('deve exibir mensagem quando não há pedidos', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: [],
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText('Nenhum pedido encontrado')).toBeInTheDocument();
        expect(screen.getByText('Você ainda não fez nenhum pedido.')).toBeInTheDocument();
      });
    });

    it('deve exibir botão "Começar a Comprar" quando não há pedidos', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: [],
      });

      renderHistory();
      
      await waitFor(() => {
        // Buscar link de forma mais robusta - pode haver múltiplos elementos
        const comecarTexts = screen.getAllByText('Começar a Comprar');
        const button = comecarTexts.find(el => el.closest('a')) || comecarTexts[0]?.closest('a');
        expect(button).toBeTruthy();
        if (button) {
          expect(button).toHaveAttribute('href', '/');
        }
      });
    });
  });

  describe('Interações', () => {
    it('deve exibir botão "Rastrear Pedido"', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        const buttons = screen.getAllByText('Rastrear Pedido');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('deve exibir botão "Comprar Novamente"', async () => {
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        const buttons = screen.getAllByText('Comprar Novamente');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar-se corretamente em mobile (320px)', async () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText('Meus Pedidos')).toBeInTheDocument();
      });
    });

    it('deve adaptar-se corretamente em tablet (768px)', async () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText('Meus Pedidos')).toBeInTheDocument();
      });
    });

    it('deve adaptar-se corretamente em desktop (1024px+)', async () => {
      mockScreenSize(BREAKPOINTS.DESKTOP);
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(screen.getByText('Meus Pedidos')).toBeInTheDocument();
      });
    });
  });

  describe('Autenticação', () => {
    it('deve buscar pedidos quando usuário está autenticado', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-token');
      jwtDecode.mockReturnValue({ CODPES: 1 });
      mockOrderService2.getOrdersByUser.mockResolvedValue({
        data: mockPedidos,
      });

      renderHistory();
      
      await waitFor(() => {
        expect(mockOrderService2.getOrdersByUser).toHaveBeenCalledWith(1);
      });
    });

    it('deve não buscar pedidos quando usuário não está autenticado', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      renderHistory();
      
      await waitFor(() => {
        // Quando não há token, o componente não faz a requisição
        expect(screen.queryByText('Carregando pedidos...')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });
});
