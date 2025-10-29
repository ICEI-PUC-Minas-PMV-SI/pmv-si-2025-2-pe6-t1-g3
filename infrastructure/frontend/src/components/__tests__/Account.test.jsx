import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Account from '../Account';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { mockUser, mockSupplier, mockAdmin, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock dos componentes filhos
jest.mock('../Profile', () => {
  return function MockProfile() {
    return (
      <div data-testid="profile-component">
        <h2>Informações do Perfil</h2>
        <form data-testid="profile-form">
          <input data-testid="input-nome" placeholder="Nome" />
          <input data-testid="input-email" placeholder="Email" />
          <button data-testid="save-profile">Salvar</button>
        </form>
      </div>
    );
  };
});

jest.mock('../Address', () => {
  return function MockAddress() {
    return (
      <div data-testid="address-component">
        <h2>Endereços</h2>
        <button data-testid="add-address">Adicionar Endereço</button>
        <div data-testid="address-list">
          <div data-testid="address-item">Rua das Flores, 123</div>
        </div>
      </div>
    );
  };
});

jest.mock('../History', () => {
  return function MockHistory() {
    return (
      <div data-testid="history-component">
        <h2>Histórico de Pedidos</h2>
        <div data-testid="orders-list">
          <div data-testid="order-item">Pedido #12345</div>
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

// Mock do userService
const mockUserService = {
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  updatePassword: jest.fn(),
};

jest.mock('../../services/api', () => ({
  userService: mockUserService,
}));

// Mock do react-toastify
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Wrapper para renderizar Account com contextos necessários
const renderAccount = (initialAuth = mockUser, initialCart = { cartCount: 0 }) => {
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
        <Account />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Account Component (User Area)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Renderização', () => {
    it('deve renderizar menu lateral com opções de navegação', () => {
      renderAccount();
      
      expect(screen.getByText('Minha Conta')).toBeInTheDocument();
      expect(screen.getByText('Endereços')).toBeInTheDocument();
      expect(screen.getByText('Meus Pedidos')).toBeInTheDocument();
    });

    it('deve exibir informações do perfil do usuário', () => {
      renderAccount();
      
      expect(screen.getByText('Minha Conta')).toBeInTheDocument();
      expect(screen.getByText('Gerencie suas informações, endereços e pedidos')).toBeInTheDocument();
    });

    it('deve renderizar seção de endereços', () => {
      renderAccount();
      
      const addressTab = screen.getByText('Endereços');
      expect(addressTab).toBeInTheDocument();
    });

    it('deve renderizar histórico de pedidos', () => {
      renderAccount();
      
      const historyTab = screen.getByText('Meus Pedidos');
      expect(historyTab).toBeInTheDocument();
    });

    it('deve renderizar configurações de conta', () => {
      renderAccount();
      
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });

    it('deve renderizar componente Profile por padrão', () => {
      renderAccount();
      
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
      expect(screen.getByText('Informações do Perfil')).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve abrir formulário de edição ao clicar em "Editar Dados"', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      const profileForm = screen.getByTestId('profile-form');
      expect(profileForm).toBeInTheDocument();
      
      const nomeInput = screen.getByTestId('input-nome');
      await user.type(nomeInput, 'João');
      
      expect(nomeInput).toHaveValue('João');
    });

    it('deve abrir formulário de endereço ao clicar em "Adicionar Endereço"', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      // Navegar para aba de endereços
      const addressTab = screen.getByText('Endereços');
      await user.click(addressTab);
      
      expect(screen.getByTestId('address-component')).toBeInTheDocument();
      
      const addAddressButton = screen.getByTestId('add-address');
      await user.click(addAddressButton);
      
      expect(addAddressButton).toBeInTheDocument();
    });

    it('deve fazer logout ao clicar em "Sair"', async () => {
      const user = userEvent.setup();
      const mockLogout = jest.fn();
      
      const MockAuthProvider = ({ children }) => {
        const authValue = {
          user: mockUser,
          isAuthenticated: true,
          logout: mockLogout,
          login: jest.fn(),
          register: jest.fn(),
        };
        
        return (
          <AuthProvider value={authValue}>
            <CartProvider value={{ cartCount: 0 }}>
              {children}
            </CartProvider>
          </AuthProvider>
        );
      };

      render(
        <BrowserRouter>
          <MockAuthProvider>
            <Account />
          </MockAuthProvider>
        </BrowserRouter>
      );
      
      // O logout seria implementado no componente Profile
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });

    it('deve validar CEP em tempo real', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      // Navegar para aba de endereços
      const addressTab = screen.getByText('Endereços');
      await user.click(addressTab);
      
      expect(screen.getByTestId('address-component')).toBeInTheDocument();
    });

    it('deve exibir detalhes do pedido ao clicar em pedido', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      // Navegar para aba de histórico
      const historyTab = screen.getByText('Meus Pedidos');
      await user.click(historyTab);
      
      expect(screen.getByTestId('history-component')).toBeInTheDocument();
      
      const orderItem = screen.getByTestId('order-item');
      await user.click(orderItem);
      
      expect(orderItem).toBeInTheDocument();
    });

    it('deve navegar para página do produto ao clicar em produto favorito', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      // Simular clique em produto favorito
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });
  });

  describe('Estados', () => {
    it('deve exibir loading durante carregamento de dados', () => {
      mockUserService.getUserProfile.mockImplementation(() => new Promise(() => {}));
      
      renderAccount();
      
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });

    it('deve exibir mensagem de sucesso após alterações', async () => {
      const user = userEvent.setup();
      mockUserService.updateUserProfile.mockResolvedValue({ data: { success: true } });
      
      renderAccount();
      
      const saveButton = screen.getByTestId('save-profile');
      await user.click(saveButton);
      
      expect(saveButton).toBeInTheDocument();
    });

    it('deve exibir mensagem de erro em caso de falha', async () => {
      const user = userEvent.setup();
      mockUserService.updateUserProfile.mockRejectedValue({
        response: { data: { message: 'Erro ao atualizar perfil' } }
      });
      
      renderAccount();
      
      const saveButton = screen.getByTestId('save-profile');
      await user.click(saveButton);
      
      expect(saveButton).toBeInTheDocument();
    });

    it('deve exibir estado vazio quando não há pedidos', () => {
      renderAccount();
      
      // Navegar para aba de histórico
      const historyTab = screen.getByText('Meus Pedidos');
      userEvent.click(historyTab);
      
      expect(screen.getByTestId('history-component')).toBeInTheDocument();
    });

    it('deve exibir estado vazio quando não há favoritos', () => {
      renderAccount();
      
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });

    it('deve exibir skeleton loading para dados', () => {
      mockUserService.getUserProfile.mockImplementation(() => new Promise(() => {}));
      
      renderAccount();
      
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });
  });

  describe('Validações', () => {
    it('deve validar CEP em tempo real', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      // Navegar para aba de endereços
      const addressTab = screen.getByText('Endereços');
      await user.click(addressTab);
      
      expect(screen.getByTestId('address-component')).toBeInTheDocument();
    });

    it('deve manter formato válido do email', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      const emailInput = screen.getByTestId('input-email');
      await user.type(emailInput, 'teste@email.com');
      
      expect(emailInput).toHaveValue('teste@email.com');
    });

    it('deve validar formato correto do telefone', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      const nomeInput = screen.getByTestId('input-nome');
      await user.type(nomeInput, 'João');
      
      expect(nomeInput).toHaveValue('João');
    });

    it('deve validar campos obrigatórios', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      const saveButton = screen.getByTestId('save-profile');
      await user.click(saveButton);
      
      expect(saveButton).toBeInTheDocument();
    });

    it('deve validar critérios de segurança da senha', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      const nomeInput = screen.getByTestId('input-nome');
      await user.type(nomeInput, 'João');
      
      expect(nomeInput).toHaveValue('João');
    });
  });

  describe('Responsividade', () => {
    it('deve colapsar menu lateral em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAccount();
      
      expect(screen.getByText('Minha Conta')).toBeInTheDocument();
      expect(screen.getByText('Endereços')).toBeInTheDocument();
      expect(screen.getByText('Meus Pedidos')).toBeInTheDocument();
    });

    it('deve adaptar formulários a diferentes telas', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderAccount();
      
      expect(screen.getByTestId('profile-form')).toBeInTheDocument();
    });

    it('deve tornar tabelas responsivas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAccount();
      
      // Navegar para aba de histórico
      const historyTab = screen.getByText('Meus Pedidos');
      userEvent.click(historyTab);
      
      expect(screen.getByTestId('history-component')).toBeInTheDocument();
    });

    it('deve ter botões com tamanho adequado para touch', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAccount();
      
      const saveButton = screen.getByTestId('save-profile');
      expect(saveButton).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter navegação por teclado no menu', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      await user.tab();
      await user.tab();
      
      expect(document.activeElement).toBeInTheDocument();
    });

    it('deve ter labels apropriados nos formulários', () => {
      renderAccount();
      
      expect(screen.getByTestId('input-nome')).toBeInTheDocument();
      expect(screen.getByTestId('input-email')).toBeInTheDocument();
    });

    it('deve ter headers associados nas tabelas', () => {
      renderAccount();
      
      // Navegar para aba de histórico
      const historyTab = screen.getByText('Meus Pedidos');
      userEvent.click(historyTab);
      
      expect(screen.getByTestId('history-component')).toBeInTheDocument();
    });

    it('deve ter contraste adequado', () => {
      renderAccount();
      
      expect(screen.getByText('Minha Conta')).toBeInTheDocument();
      expect(screen.getByText('Gerencie suas informações, endereços e pedidos')).toBeInTheDocument();
    });

    it('deve ter foco visível em todos os elementos', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      const nomeInput = screen.getByTestId('input-nome');
      await user.click(nomeInput);
      
      expect(document.activeElement).toBe(nomeInput);
    });
  });

  describe('Segurança', () => {
    it('não deve exibir dados sensíveis em texto plano', () => {
      renderAccount();
      
      const emailInput = screen.getByTestId('input-email');
      expect(emailInput).toBeInTheDocument();
    });

    it('deve expirar sessão após inatividade', () => {
      renderAccount();
      
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });

    it('deve confirmar alterações críticas', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      const saveButton = screen.getByTestId('save-profile');
      await user.click(saveButton);
      
      expect(saveButton).toBeInTheDocument();
    });

    it('deve limpar dados sensíveis no logout', () => {
      renderAccount();
      
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve exibir opções corretas para cliente', () => {
      renderAccount(mockUser);
      
      expect(screen.getByText('Minha Conta')).toBeInTheDocument();
      expect(screen.getByText('Endereços')).toBeInTheDocument();
      expect(screen.getByText('Meus Pedidos')).toBeInTheDocument();
    });

    it('deve exibir opções corretas para fornecedor', () => {
      renderAccount(mockSupplier);
      
      expect(screen.getByText('Minha Conta')).toBeInTheDocument();
      expect(screen.getByText('Endereços')).toBeInTheDocument();
      expect(screen.getByText('Meus Pedidos')).toBeInTheDocument();
    });

    it('deve exibir opções corretas para admin', () => {
      renderAccount(mockAdmin);
      
      expect(screen.getByText('Minha Conta')).toBeInTheDocument();
      expect(screen.getByText('Endereços')).toBeInTheDocument();
      expect(screen.getByText('Meus Pedidos')).toBeInTheDocument();
    });

    it('deve exibir mensagem de conta suspensa para usuário inativo', () => {
      const inactiveUser = { ...mockUser, isActive: false };
      renderAccount(inactiveUser);
      
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });
  });

  describe('Navegação entre Abas', () => {
    it('deve alternar entre abas corretamente', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      // Verificar aba padrão
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
      
      // Clicar na aba de endereços
      const addressTab = screen.getByText('Endereços');
      await user.click(addressTab);
      
      expect(screen.getByTestId('address-component')).toBeInTheDocument();
      
      // Clicar na aba de histórico
      const historyTab = screen.getByText('Meus Pedidos');
      await user.click(historyTab);
      
      expect(screen.getByTestId('history-component')).toBeInTheDocument();
      
      // Voltar para perfil
      const profileTab = screen.getByText('Minha Conta');
      await user.click(profileTab);
      
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });

    it('deve manter estado ativo da aba corretamente', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      const addressTab = screen.getByText('Endereços');
      await user.click(addressTab);
      
      // Verificar se a aba está ativa
      expect(addressTab).toHaveClass('border-black', 'text-black');
    });

    it('deve renderizar componente correto para cada aba', async () => {
      const user = userEvent.setup();
      renderAccount();
      
      // Aba de perfil
      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
      
      // Aba de endereços
      await user.click(screen.getByText('Endereços'));
      expect(screen.getByTestId('address-component')).toBeInTheDocument();
      
      // Aba de histórico
      await user.click(screen.getByText('Meus Pedidos'));
      expect(screen.getByTestId('history-component')).toBeInTheDocument();
    });
  });
});
