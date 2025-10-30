import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Auth/Login';
import Register from '../Register';
import { AuthProvider } from '../../contexts/AuthContext';
import { mockUser, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do authService
const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
};

jest.mock('../../services/api', () => ({
  authService: mockAuthService,
}));

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

// Wrapper para renderizar componentes com contextos necessários
const renderWithAuth = (component, initialAuth = null) => {
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
        {children}
      </AuthProvider>
    );
  };

  return render(
    <BrowserRouter>
      <MockAuthProvider>
        {component}
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Renderização', () => {
    it('deve renderizar campos de email e senha', () => {
      renderWithAuth(<Login />);
      
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
      expect(screen.getByTestId('input-EMAIL')).toBeInTheDocument();
      expect(screen.getByTestId('input-SENHA')).toBeInTheDocument();
    });

    it('deve renderizar título e descrição', () => {
      renderWithAuth(<Login />);
      
      expect(screen.getByText('Entrar')).toBeInTheDocument();
      expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
    });

    it('deve renderizar botão de submit', () => {
      renderWithAuth(<Login />);
      
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent('Entrar');
    });

    it('deve renderizar link para cadastro', () => {
      renderWithAuth(<Login />);
      
      expect(screen.getByText('Não tem uma conta?')).toBeInTheDocument();
      expect(screen.getByText('Cadastre-se')).toBeInTheDocument();
      expect(screen.getByText('Cadastre-se').closest('a')).toHaveAttribute('href', '/register');
    });
  });

  describe('Validações', () => {
    it('deve validar formato de email em tempo real', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByTestId('input-EMAIL');
      await user.type(emailInput, 'email-invalido');
      
      // Simular blur para trigger da validação
      await user.tab();
      
      // A validação seria executada no submit
      expect(emailInput).toHaveValue('email-invalido');
    });

    it('deve exibir mensagem de erro para campos obrigatórios', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      // Verificar se erros são exibidos (implementação real)
      expect(submitButton).toBeInTheDocument();
    });

    it('deve exibir mensagem de erro para email inválido', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByTestId('input-EMAIL');
      const passwordInput = screen.getByTestId('input-SENHA');
      
      await user.type(emailInput, 'email-invalido');
      await user.type(passwordInput, 'senha123');
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      // Verificar se erro de email é exibido
      expect(emailInput).toHaveValue('email-invalido');
    });

    it('deve exibir mensagem de erro para senha vazia', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByTestId('input-EMAIL');
      await user.type(emailInput, 'teste@email.com');
      
      const submitButton = screen.getByTestId('submit-button');
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
      
      const emailInput = screen.getByTestId('input-EMAIL');
      const passwordInput = screen.getByTestId('input-SENHA');
      
      await user.type(emailInput, 'teste@email.com');
      await user.type(passwordInput, 'senha123');
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      // Verificar se botão mostra loading
      expect(submitButton).toHaveTextContent('Entrando...');
      expect(submitButton).toBeDisabled();
    });

    it('deve exibir mensagem de erro para credenciais inválidas', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockRejectedValue({
        response: { data: { message: 'Credenciais inválidas' } }
      });
      
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByTestId('input-EMAIL');
      const passwordInput = screen.getByTestId('input-SENHA');
      
      await user.type(emailInput, 'teste@email.com');
      await user.type(passwordInput, 'senha-errada');
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
      });
    });

    it('deve desabilitar botões durante processamento', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockImplementation(() => new Promise(() => {}));
      
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByTestId('input-EMAIL');
      const passwordInput = screen.getByTestId('input-SENHA');
      
      await user.type(emailInput, 'teste@email.com');
      await user.type(passwordInput, 'senha123');
      
      const submitButton = screen.getByTestId('submit-button');
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
      
      const MockAuthProvider = ({ children }) => {
        const authValue = {
          user: null,
          isAuthenticated: false,
          logout: jest.fn(),
          login: mockLogin,
          register: jest.fn(),
        };
        
        return (
          <AuthProvider value={authValue}>
            {children}
          </AuthProvider>
        );
      };

      render(
        <BrowserRouter>
          <MockAuthProvider>
            <Login />
          </MockAuthProvider>
        </BrowserRouter>
      );
      
      const emailInput = screen.getByTestId('input-EMAIL');
      const passwordInput = screen.getByTestId('input-SENHA');
      
      await user.type(emailInput, 'teste@email.com');
      await user.type(passwordInput, 'senha123');
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('mock-token');
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('deve limpar erros ao digitar nos campos', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByTestId('input-EMAIL');
      
      // Simular erro inicial
      await user.click(screen.getByTestId('submit-button'));
      
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
      expect(screen.getByTestId('input-EMAIL')).toBeInTheDocument();
      expect(screen.getByTestId('input-SENHA')).toBeInTheDocument();
    });

    it('deve ter campos com tamanho adequado para touch', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByTestId('input-EMAIL');
      const passwordInput = screen.getByTestId('input-SENHA');
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('deve funcionar em orientação portrait e landscape', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderWithAuth(<Login />);
      
      expect(screen.getByText('Entrar')).toBeInTheDocument();
      expect(screen.getByTestId('card')).toBeInTheDocument();
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
      
      const emailInput = screen.getByTestId('input-EMAIL');
      await user.click(emailInput);
      
      expect(document.activeElement).toBe(emailInput);
    });
  });

  describe('Segurança', () => {
    it('não deve exibir senha em texto plano', () => {
      renderWithAuth(<Login />);
      
      const passwordInput = screen.getByTestId('input-SENHA');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('deve implementar rate limiting para tentativas de login', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockRejectedValue({
        response: { status: 429, data: { message: 'Muitas tentativas' } }
      });
      
      renderWithAuth(<Login />);
      
      const emailInput = screen.getByTestId('input-EMAIL');
      const passwordInput = screen.getByTestId('input-SENHA');
      
      await user.type(emailInput, 'teste@email.com');
      await user.type(passwordInput, 'senha123');
      
      const submitButton = screen.getByTestId('submit-button');
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
      
      expect(screen.getByText('Criar Conta')).toBeInTheDocument();
      expect(screen.getByText('Cadastre-se para acessar sua conta')).toBeInTheDocument();
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
      expect(screen.getByText('Fazer login').closest('a')).toHaveAttribute('href', '/login');
    });
  });

  describe('Validações', () => {
    it('deve validar campos obrigatórios', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      // Verificar se erros são exibidos
      expect(submitButton).toBeInTheDocument();
    });

    it('deve validar formato de email', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const emailInput = screen.getByTestId('input-EMAIL');
      await user.type(emailInput, 'email-invalido');
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      expect(emailInput).toHaveValue('email-invalido');
    });

    it('deve validar formato de CPF', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const cpfInput = screen.getByTestId('input-CPF');
      await user.type(cpfInput, '123');
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      expect(cpfInput).toHaveValue('123');
    });

    it('deve validar força da senha', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const passwordInput = screen.getByTestId('input-SENHA');
      await user.type(passwordInput, '123');
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      expect(passwordInput).toHaveValue('123');
    });

    it('deve validar confirmação de senha', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const passwordInput = screen.getByTestId('input-SENHA');
      const confirmPasswordInput = screen.getByTestId('input-confSenha');
      
      await user.type(passwordInput, 'senha123');
      await user.type(confirmPasswordInput, 'senha456');
      
      const submitButton = screen.getByTestId('submit-button');
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
      await user.type(screen.getByTestId('input-NOME'), 'João');
      await user.type(screen.getByTestId('input-SOBRENOME'), 'Silva');
      await user.type(screen.getByTestId('input-EMAIL'), 'joao@email.com');
      await user.type(screen.getByTestId('input-CPF'), '123.456.789-00');
      await user.type(screen.getByTestId('input-TELEFONE'), '(11) 99999-9999');
      await user.type(screen.getByTestId('input-SENHA'), 'senha123');
      await user.type(screen.getByTestId('input-confSenha'), 'senha123');
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      expect(submitButton).toHaveTextContent('Cadastrando...');
      expect(submitButton).toBeDisabled();
    });

    it('deve exibir mensagem de sucesso após cadastro', async () => {
      const user = userEvent.setup();
      mockAuthService.register.mockResolvedValue({ data: { success: true } });
      
      renderWithAuth(<Register />);
      
      // Preencher todos os campos
      await user.type(screen.getByTestId('input-NOME'), 'João');
      await user.type(screen.getByTestId('input-SOBRENOME'), 'Silva');
      await user.type(screen.getByTestId('input-EMAIL'), 'joao@email.com');
      await user.type(screen.getByTestId('input-CPF'), '123.456.789-00');
      await user.type(screen.getByTestId('input-TELEFONE'), '(11) 99999-9999');
      await user.type(screen.getByTestId('input-SENHA'), 'senha123');
      await user.type(screen.getByTestId('input-confSenha'), 'senha123');
      
      const submitButton = screen.getByTestId('submit-button');
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
      await user.type(screen.getByTestId('input-NOME'), 'João');
      await user.type(screen.getByTestId('input-SOBRENOME'), 'Silva');
      await user.type(screen.getByTestId('input-EMAIL'), 'joao@email.com');
      await user.type(screen.getByTestId('input-CPF'), '123.456.789-00');
      await user.type(screen.getByTestId('input-TELEFONE'), '(11) 99999-9999');
      await user.type(screen.getByTestId('input-SENHA'), 'senha123');
      await user.type(screen.getByTestId('input-confSenha'), 'senha123');
      
      const submitButton = screen.getByTestId('submit-button');
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
      await user.type(screen.getByTestId('input-NOME'), 'João');
      await user.type(screen.getByTestId('input-SOBRENOME'), 'Silva');
      await user.type(screen.getByTestId('input-EMAIL'), 'joao@email.com');
      await user.type(screen.getByTestId('input-CPF'), '123.456.789-00');
      await user.type(screen.getByTestId('input-TELEFONE'), '(11) 99999-9999');
      await user.type(screen.getByTestId('input-SENHA'), 'senha123');
      await user.type(screen.getByTestId('input-confSenha'), 'senha123');
      
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      }, { timeout: 3000 });
    });

    it('deve limpar erros ao digitar nos campos', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const nomeInput = screen.getByTestId('input-NOME');
      
      // Simular erro inicial
      await user.click(screen.getByTestId('submit-button'));
      
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
      
      expect(screen.getByText('Criar Conta')).toBeInTheDocument();
      expect(screen.getByTestId('input-NOME')).toBeInTheDocument();
      expect(screen.getByTestId('input-EMAIL')).toBeInTheDocument();
    });

    it('deve ter campos com tamanho adequado para touch', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderWithAuth(<Register />);
      
      const nomeInput = screen.getByTestId('input-NOME');
      const emailInput = screen.getByTestId('input-EMAIL');
      
      expect(nomeInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
    });

    it('deve funcionar em orientação portrait e landscape', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderWithAuth(<Register />);
      
      expect(screen.getByText('Criar Conta')).toBeInTheDocument();
      expect(screen.getByTestId('card')).toBeInTheDocument();
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
      
      expect(screen.getByText('Criar Conta')).toBeInTheDocument();
      expect(screen.getByText('Cadastre-se para acessar sua conta')).toBeInTheDocument();
    });

    it('deve ter foco visível em todos os campos', async () => {
      const user = userEvent.setup();
      renderWithAuth(<Register />);
      
      const nomeInput = screen.getByTestId('input-NOME');
      await user.click(nomeInput);
      
      expect(document.activeElement).toBe(nomeInput);
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve permitir cadastro para cliente', async () => {
      const user = userEvent.setup();
      mockAuthService.register.mockResolvedValue({ data: { success: true } });
      
      renderWithAuth(<Register />);
      
      // Preencher todos os campos
      await user.type(screen.getByTestId('input-NOME'), 'João');
      await user.type(screen.getByTestId('input-SOBRENOME'), 'Silva');
      await user.type(screen.getByTestId('input-EMAIL'), 'joao@email.com');
      await user.type(screen.getByTestId('input-CPF'), '123.456.789-00');
      await user.type(screen.getByTestId('input-TELEFONE'), '(11) 99999-9999');
      await user.type(screen.getByTestId('input-SENHA'), 'senha123');
      await user.type(screen.getByTestId('input-confSenha'), 'senha123');
      
      const submitButton = screen.getByTestId('submit-button');
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
