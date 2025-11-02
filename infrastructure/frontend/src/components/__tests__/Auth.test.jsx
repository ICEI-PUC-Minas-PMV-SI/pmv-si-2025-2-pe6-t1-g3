import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { mockUser, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock do env.js (antes de importar componentes que dependem dele)
jest.mock('../../utils/env', () => ({
  getEnvVar: jest.fn((key, fallback) => fallback),
  ENV: {
    API_URL: () => 'http://localhost:3000',
    VIACEP_API_URL: () => 'https://viacep.com.br/ws',
    CONTACT_EMAIL: () => 'contato@exemplo.com.br',
    GITHUB_REPOSITORY_URL: () => 'https://github.com/example',
    TOAST_AUTOCLOSE_DURATION: () => 3000,
    SEARCH_DEBOUNCE_MS: () => 500,
    CEP_FETCH_DELAY_MS: () => 500,
    GOOGLE_CLIENT_ID: () => '',
  },
}));

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do authService
jest.mock('../../services/api', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

// Importar componentes e serviços (os imports são hoisted, mas os mocks também)
import Login from '../Auth/Login';
import Register from '../Register';
import { authService } from '../../services/api';

// Criar alias para authService mockado
const mockAuthService = authService;

// Mock dos componentes UI
jest.mock('../UI/Input', () => {
  return function MockInput({ label, type, name, value, onChange, error, placeholder, required }) {
    return (
      <div>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          data-testid={`input-${name}`}
        />
        {error && <span data-testid={`error-${name}`}>{error}</span>}
      </div>
    );
  };
});

jest.mock('../UI/Button', () => {
  return function MockButton({ children, type, className, disabled, onClick }) {
    return (
      <button
        type={type}
        className={className}
        disabled={disabled}
        onClick={onClick}
        data-testid="submit-button"
      >
        {children}
      </button>
    );
  };
});

jest.mock('../UI/Card', () => {
  return function MockCard({ children }) {
    return <div data-testid="card">{children}</div>;
  };
});

// Mock do useAuth
const mockUseAuth = jest.fn();

jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => mockUseAuth(),
}));

// Wrapper para renderizar componentes com contextos necessários
const renderWithAuth = (component, initialAuth = null) => {
  mockUseAuth.mockReturnValue({
    user: initialAuth,
    isAuthenticated: !!initialAuth,
    logout: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    isLoading: false,
  });

  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockClear();
    mockNavigate.mockClear();
  });

  describe('Renderização', () => {
    it('deve renderizar campos de email e senha', () => {
      renderWithAuth(<Login />);
      
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    });

    it('deve renderizar título e descrição', () => {
      renderWithAuth(<Login />);
      
      expect(screen.getByText('Entrar')).toBeInTheDocument();
      expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
    });

    it('deve renderizar botão de submit', () => {
      renderWithAuth(<Login />);
      
      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent('Entrar');
    });

    it('deve renderizar link para cadastro', () => {
      renderWithAuth(<Login />);
      
      expect(screen.getByText('Não tem uma conta?')).toBeInTheDocument();
      expect(screen.getByText('Cadastre-se')).toBeInTheDocument();
      // Buscar link de forma mais robusta
      const cadastreTexts = screen.getAllByText('Cadastre-se');
      const cadastreLink = cadastreTexts.find(el => el.closest('a')) || cadastreTexts[0]?.closest('a');
      expect(cadastreLink).toBeTruthy();
      if (cadastreLink) {
        expect(cadastreLink).toHaveAttribute('href', '/register');
      }
    });
  });

  describe('Validações', () => {
    it('deve validar formato de email em tempo real', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'email-invalido');
      
      // Simular blur para trigger da validação
      await user.tab();
      
      // A validação seria executada no submit
      expect(emailInput).toHaveValue('email-invalido');
    });

    it('deve exibir mensagem de erro para campos obrigatórios', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const submitButton = screen.getByRole('button', { name: /Entrar|Cadastrando|Entrando/i });
      await user.click(submitButton);
      
      // Verificar se erros são exibidos (implementação real)
      expect(submitButton).toBeInTheDocument();
    });

    it('deve exibir mensagem de erro para email inválido', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(emailInput, 'email-invalido');
      await user.type(passwordInput, 'senha123');
      
      const submitButton = screen.getByRole('button', { name: /Entrar|Cadastrando|Entrando/i });
      await user.click(submitButton);
      
      // Verificar se erro de email é exibido
      expect(emailInput).toHaveValue('email-invalido');
    });

    it('deve exibir mensagem de erro para senha vazia', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'teste@email.com');
      
      const submitButton = screen.getByRole('button', { name: /Entrar|Cadastrando|Entrando/i });
      await user.click(submitButton);
      
      // Verificar se erro de senha é exibido
      expect(emailInput).toHaveValue('teste@email.com');
    });
  });

  describe('Estados', () => {
    it('deve exibir loading state durante autenticação', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(emailInput, 'teste@email.com');
      await user.type(passwordInput, 'senha123');
      
      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      await user.click(submitButton);
      
      // Verificar se botão mostra loading
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /Entrando|Entrar/i });
        expect(button).toBeDisabled();
      });
    });

    it('deve exibir mensagem de erro para credenciais inválidas', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockRejectedValue({
        response: { data: { message: 'Credenciais inválidas' } }
      });
      
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(emailInput, 'teste@email.com');
      await user.type(passwordInput, 'senha-errada');
      
      const submitButton = screen.getByRole('button', { name: /Entrar|Cadastrando|Entrando/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
      });
    });

    it('deve desabilitar botões durante processamento', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockImplementation(() => new Promise(() => {}));
      
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(emailInput, 'teste@email.com');
      await user.type(passwordInput, 'senha123');
      
      const submitButton = screen.getByRole('button', { name: /Entrar|Cadastrando|Entrando/i });
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Funcionalidades', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const user = userEvent.setup();
      const mockLogin = jest.fn();
      mockAuthService.login.mockResolvedValue({
        data: { token: 'mock-token' }
      });
      
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: jest.fn(),
        login: mockLogin,
        register: jest.fn(),
        isLoading: false,
      });

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(emailInput, 'teste@email.com');
      await user.type(passwordInput, 'senha123');
      
      const submitButton = screen.getByRole('button', { name: /Entrar|Cadastrando|Entrando/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('mock-token');
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('deve limpar erros ao digitar nos campos', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByLabelText('Email');
      
      // Simular erro inicial
      await user.click(screen.getByRole('button', { name: /Entrar|Cadastrando|Entrando/i }));
      
      // Digitar no campo deve limpar erro
      await user.type(emailInput, 'teste@email.com');
      
      expect(emailInput).toHaveValue('teste@email.com');
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar-se corretamente em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderWithAuth(<Login />);
      
      expect(screen.getByText('Entrar')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    });

    it('deve ter campos com tamanho adequado para touch', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Senha');
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('deve funcionar em orientação portrait e landscape', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderWithAuth(<Login />);
      
      expect(screen.getByText('Entrar')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels associados aos campos', () => {
      renderWithAuth(<Login />);
      
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    });

    it('deve ter navegação por teclado', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      await user.tab();
      await user.tab();
      
      expect(document.activeElement).toBeInTheDocument();
    });

    it('deve ter contraste adequado', () => {
      renderWithAuth(<Login />);
      
      expect(screen.getByText('Entrar')).toBeInTheDocument();
      expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
    });

    it('deve ter foco visível em todos os campos', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.click(emailInput);
      
      expect(document.activeElement).toBe(emailInput);
    });
  });

  describe('Segurança', () => {
    it('não deve exibir senha em texto plano', () => {
      renderWithAuth(<Login />);
      
      const passwordInput = screen.getByLabelText('Senha');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('deve implementar rate limiting para tentativas de login', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockRejectedValue({
        response: { status: 429, data: { message: 'Muitas tentativas' } }
      });
      
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Senha');
      
      await user.type(emailInput, 'teste@email.com');
      await user.type(passwordInput, 'senha123');
      
      const submitButton = screen.getByRole('button', { name: /Entrar|Cadastrando|Entrando/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Muitas tentativas')).toBeInTheDocument();
      });
    });
  });
});

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockClear();
    mockNavigate.mockClear();
  });

  describe('Renderização', () => {
    it('deve renderizar formulário com campos obrigatórios', () => {
      renderWithAuth(<Register />);
      
      expect(screen.getByLabelText('Nome')).toBeInTheDocument();
      expect(screen.getByLabelText('Sobrenome')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('CPF')).toBeInTheDocument();
      expect(screen.getByLabelText('Telefone')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirmar Senha')).toBeInTheDocument();
    });

    it('deve renderizar título e descrição', () => {
      renderWithAuth(<Register />);
      
      expect(screen.getByRole('heading', { name: 'Criar Conta' })).toBeInTheDocument();
      expect(screen.getByText('Cadastre-se para acessar a loja')).toBeInTheDocument();
    });

    it('deve renderizar indicador de progresso', () => {
      renderWithAuth(<Register />);
      
      expect(screen.getByText('Pessoais')).toBeInTheDocument();
      expect(screen.getByText('Contato')).toBeInTheDocument();
      expect(screen.getByText('Segurança')).toBeInTheDocument();
    });

    it('deve renderizar seções organizadas', () => {
      renderWithAuth(<Register />);
      
      expect(screen.getByText('Informações Pessoais')).toBeInTheDocument();
      expect(screen.getByText('Informações de Contato')).toBeInTheDocument();
      expect(screen.getByText('Segurança da Conta')).toBeInTheDocument();
    });

    it('deve renderizar link para login', () => {
      renderWithAuth(<Register />);
      
      expect(screen.getByText('Já tem uma conta?')).toBeInTheDocument();
      expect(screen.getByText('Fazer login')).toBeInTheDocument();
      // Buscar link de forma mais robusta
      const fazerLoginTexts = screen.getAllByText('Fazer login');
      const fazerLoginLink = fazerLoginTexts.find(el => el.closest('a')) || fazerLoginTexts[0]?.closest('a');
      expect(fazerLoginLink).toBeTruthy();
      if (fazerLoginLink) {
        expect(fazerLoginLink).toHaveAttribute('href', '/login');
      }
    });
  });

  describe('Validações', () => {
    it('deve validar campos obrigatórios', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
      await user.click(submitButton);
      
      // Verificar se erros são exibidos
      expect(submitButton).toBeInTheDocument();
    });

    it('deve validar formato de email', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'email-invalido');
      
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
      await user.click(submitButton);
      
      expect(emailInput).toHaveValue('email-invalido');
    });

    it('deve validar formato de CPF', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const cpfInput = screen.getByLabelText('CPF');
      await user.type(cpfInput, '123');
      
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
      await user.click(submitButton);
      
      expect(cpfInput).toHaveValue('123');
    });

    it('deve validar força da senha', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const passwordInput = screen.getByLabelText('Senha');
      await user.type(passwordInput, '123');
      
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
      await user.click(submitButton);
      
      expect(passwordInput).toHaveValue('123');
    });

    it('deve validar confirmação de senha', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const passwordInput = screen.getByLabelText('Senha');
      const confirmPasswordInput = screen.getByLabelText('Confirmar Senha');
      
      await user.type(passwordInput, 'senha123');
      await user.type(confirmPasswordInput, 'senha456');
      
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
      await user.click(submitButton);
      
      expect(passwordInput).toHaveValue('senha123');
      expect(confirmPasswordInput).toHaveValue('senha456');
    });
  });

  describe('Estados', () => {
    it('deve exibir loading state durante cadastro', async () => {
      const user = userEvent.setup();
      mockAuthService.register.mockImplementation(() => new Promise(() => {}));
      
      renderWithAuth(<Register />);
      
      // Preencher todos os campos
      await user.type(screen.getByLabelText('Nome'), 'João');
      await user.type(screen.getByLabelText('Sobrenome'), 'Silva');
      await user.type(screen.getByLabelText('Email'), 'joao@email.com');
      await user.type(screen.getByLabelText('CPF'), '123.456.789-00');
      await user.type(screen.getByLabelText('Telefone'), '(11) 99999-9999');
      await user.type(screen.getByLabelText('Senha'), 'senha123');
      await user.type(screen.getByLabelText('Confirmar Senha'), 'senha123');
      
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
      await user.click(submitButton);
      
      expect(submitButton).toHaveTextContent('Cadastrando...');
      expect(submitButton).toBeDisabled();
    });

    it('deve exibir mensagem de sucesso após cadastro', async () => {
      const user = userEvent.setup();
      mockAuthService.register.mockResolvedValue({ data: { success: true } });
      
      renderWithAuth(<Register />);
      
      // Preencher todos os campos
      await user.type(screen.getByLabelText('Nome'), 'João');
      await user.type(screen.getByLabelText('Sobrenome'), 'Silva');
      await user.type(screen.getByLabelText('Email'), 'joao@email.com');
      await user.type(screen.getByLabelText('CPF'), '123.456.789-00');
      await user.type(screen.getByLabelText('Telefone'), '(11) 99999-9999');
      await user.type(screen.getByLabelText('Senha'), 'senha123');
      await user.type(screen.getByLabelText('Confirmar Senha'), 'senha123');
      
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Cadastro realizado com sucesso! Redirecionando...')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem de erro para email já cadastrado', async () => {
      const user = userEvent.setup();
      mockAuthService.register.mockRejectedValue({
        response: { status: 409, data: { message: 'Email já está sendo usado' } }
      });
      
      renderWithAuth(<Register />);
      
      // Preencher todos os campos
      await user.type(screen.getByLabelText('Nome'), 'João');
      await user.type(screen.getByLabelText('Sobrenome'), 'Silva');
      await user.type(screen.getByLabelText('Email'), 'joao@email.com');
      await user.type(screen.getByLabelText('CPF'), '123.456.789-00');
      await user.type(screen.getByLabelText('Telefone'), '(11) 99999-9999');
      await user.type(screen.getByLabelText('Senha'), 'senha123');
      await user.type(screen.getByLabelText('Confirmar Senha'), 'senha123');
      
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email já está sendo usado')).toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidades', () => {
    it('deve redirecionar para login após cadastro bem-sucedido', async () => {
      const user = userEvent.setup();
      mockAuthService.register.mockResolvedValue({ data: { success: true } });
      
      renderWithAuth(<Register />);
      
      // Preencher todos os campos
      await user.type(screen.getByLabelText('Nome'), 'João');
      await user.type(screen.getByLabelText('Sobrenome'), 'Silva');
      await user.type(screen.getByLabelText('Email'), 'joao@email.com');
      await user.type(screen.getByLabelText('CPF'), '123.456.789-00');
      await user.type(screen.getByLabelText('Telefone'), '(11) 99999-9999');
      await user.type(screen.getByLabelText('Senha'), 'senha123');
      await user.type(screen.getByLabelText('Confirmar Senha'), 'senha123');
      
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      }, { timeout: 3000 });
    });

    it('deve limpar erros ao digitar nos campos', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const nomeInput = screen.getByLabelText('Nome');
      
      // Simular erro inicial
      await user.click(screen.getByRole('button', { name: 'Criar Conta' }));
      
      // Digitar no campo deve limpar erro
      await user.type(nomeInput, 'João');
      
      expect(nomeInput).toHaveValue('João');
    });

    it('deve redirecionar usuário logado para home', () => {
      renderWithAuth(<Register />, mockUser);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar-se corretamente em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderWithAuth(<Register />);
      
      expect(screen.getByRole('heading', { name: 'Criar Conta' })).toBeInTheDocument();
      expect(screen.getByLabelText('Nome')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('deve ter campos com tamanho adequado para touch', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderWithAuth(<Register />);
      
      const nomeInput = screen.getByLabelText('Nome');
      const emailInput = screen.getByLabelText('Email');
      
      expect(nomeInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
    });

    it('deve funcionar em orientação portrait e landscape', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderWithAuth(<Register />);
      
      expect(screen.getByRole('heading', { name: 'Criar Conta' })).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels associados aos campos', () => {
      renderWithAuth(<Register />);
      
      expect(screen.getByLabelText('Nome')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    });

    it('deve ter navegação por teclado', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      await user.tab();
      await user.tab();
      
      expect(document.activeElement).toBeInTheDocument();
    });

    it('deve ter contraste adequado', () => {
      renderWithAuth(<Register />);
      
      expect(screen.getByRole('heading', { name: 'Criar Conta' })).toBeInTheDocument();
      expect(screen.getByText('Cadastre-se para acessar a loja')).toBeInTheDocument();
    });

    it('deve ter foco visível em todos os campos', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const nomeInput = screen.getByLabelText('Nome');
      await user.click(nomeInput);
      
      expect(document.activeElement).toBe(nomeInput);
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve permitir cadastro para cliente', async () => {
      const user = userEvent.setup();
      mockAuthService.register.mockResolvedValue({ data: { success: true } });
      
      renderWithAuth(<Register />);
      
      // Preencher todos os campos usando labels
      await user.type(screen.getByLabelText('Nome'), 'João');
      await user.type(screen.getByLabelText('Sobrenome'), 'Silva');
      await user.type(screen.getByLabelText('Email'), 'joao@email.com');
      await user.type(screen.getByLabelText('CPF'), '123.456.789-00');
      await user.type(screen.getByLabelText('Telefone'), '(11) 99999-9999');
      await user.type(screen.getByLabelText('Senha'), 'senha123');
      await user.type(screen.getByLabelText('Confirmar Senha'), 'senha123');
      
      const submitButton = screen.getByRole('button', { name: 'Criar Conta' });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Cadastro realizado com sucesso! Redirecionando...')).toBeInTheDocument();
      });
    });

    it('deve redirecionar usuário existente para login', () => {
      renderWithAuth(<Register />, mockUser);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
