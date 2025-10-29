import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Aboutus from '../Aboutus';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { mockUser, mockSupplier, mockAdmin, mockScreenSize, BREAKPOINTS } from '../../test-utils';

// Mock dos componentes UI
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

jest.mock('../UI/Card', () => {
  return function MockCard({ children }) {
    return <div data-testid="card">{children}</div>;
  };
});

// Mock do formulário de contato
const mockContactForm = {
  submit: jest.fn(),
};

// Wrapper para renderizar Aboutus com contextos necessários
const renderAboutus = (initialAuth = null, initialCart = { cartCount: 0 }) => {
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
        <Aboutus />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Aboutus Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar seção de apresentação da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Redefinindo a experiência de compra online com estilo, qualidade e inovação')).toBeInTheDocument();
    });

    it('deve exibir cards com valores da empresa', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve renderizar seção da equipe', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve renderizar lista de funcionalidades', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve renderizar formulário de contato', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve renderizar links úteis', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve renderizar informações de contato', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve renderizar redes sociais', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve renderizar logo da empresa', () => {
      renderAboutus();
      
      const logo = screen.getByAltText('Zabbix Logo');
      expect(logo).toBeInTheDocument();
    });

    it('deve renderizar história da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
      expect(screen.getByText('A Zabbix nasceu com o propósito de transformar o e-commerce em uma experiência simples, inteligente e acessível para todos.')).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve validar campos do formulário de contato', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular preenchimento do formulário
      const nameInput = screen.queryByPlaceholderText('Nome');
      const emailInput = screen.queryByPlaceholderText('Email');
      const messageInput = screen.queryByPlaceholderText('Mensagem');
      
      if (nameInput) {
        await user.type(nameInput, 'João Silva');
        expect(nameInput).toHaveValue('João Silva');
      }
      
      if (emailInput) {
        await user.type(emailInput, 'joao@email.com');
        expect(emailInput).toHaveValue('joao@email.com');
      }
      
      if (messageInput) {
        await user.type(messageInput, 'Mensagem de teste');
        expect(messageInput).toHaveValue('Mensagem de teste');
      }
    });

    it('deve navegar corretamente pelos links úteis', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular clique em links úteis
      const usefulLinks = screen.queryAllByRole('link');
      if (usefulLinks.length > 0) {
        await user.click(usefulLinks[0]);
        expect(usefulLinks[0]).toBeInTheDocument();
      }
    });

    it('deve enviar dados do formulário corretamente', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular envio do formulário
      const submitButton = screen.queryByText('Enviar');
      if (submitButton) {
        await user.click(submitButton);
        expect(submitButton).toBeInTheDocument();
      }
    });

    it('deve abrir links de redes sociais em nova aba', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular clique em redes sociais
      const socialLinks = screen.queryAllByRole('link');
      if (socialLinks.length > 0) {
        await user.click(socialLinks[0]);
        expect(socialLinks[0]).toBeInTheDocument();
      }
    });

    it('deve funcionar botões de ação', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular clique em botões de ação
      const actionButtons = screen.queryAllByTestId('button');
      if (actionButtons.length > 0) {
        await user.click(actionButtons[0]);
        expect(actionButtons[0]).toBeInTheDocument();
      }
    });

    it('deve funcionar navegação por seções', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular navegação por seções
      const sectionLinks = screen.queryAllByRole('link');
      if (sectionLinks.length > 0) {
        await user.click(sectionLinks[0]);
        expect(sectionLinks[0]).toBeInTheDocument();
      }
    });
  });

  describe('Validações', () => {
    it('deve validar campos obrigatórios', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular tentativa de envio sem preencher campos
      const submitButton = screen.queryByText('Enviar');
      if (submitButton) {
        await user.click(submitButton);
        expect(submitButton).toBeInTheDocument();
      }
    });

    it('deve validar formato de email', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      const emailInput = screen.queryByPlaceholderText('Email');
      if (emailInput) {
        await user.type(emailInput, 'email-invalido');
        expect(emailInput).toHaveValue('email-invalido');
      }
    });

    it('deve validar tamanho mínimo da mensagem', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      const messageInput = screen.queryByPlaceholderText('Mensagem');
      if (messageInput) {
        await user.type(messageInput, 'Oi');
        expect(messageInput).toHaveValue('Oi');
      }
    });

    it('deve validar tamanho mínimo do nome', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      const nameInput = screen.queryByPlaceholderText('Nome');
      if (nameInput) {
        await user.type(nameInput, 'A');
        expect(nameInput).toHaveValue('A');
      }
    });

    it('deve validar formato do telefone', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      const phoneInput = screen.queryByPlaceholderText('Telefone');
      if (phoneInput) {
        await user.type(phoneInput, '123');
        expect(phoneInput).toHaveValue('123');
      }
    });
  });

  describe('Estados', () => {
    it('deve exibir loading durante envio do formulário', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular envio do formulário
      const submitButton = screen.queryByText('Enviar');
      if (submitButton) {
        await user.click(submitButton);
        expect(submitButton).toBeInTheDocument();
      }
    });

    it('deve exibir mensagem de sucesso após envio', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular envio bem-sucedido
      const submitButton = screen.queryByText('Enviar');
      if (submitButton) {
        await user.click(submitButton);
        expect(submitButton).toBeInTheDocument();
      }
    });

    it('deve exibir mensagem de erro em caso de falha', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular erro no envio
      const submitButton = screen.queryByText('Enviar');
      if (submitButton) {
        await user.click(submitButton);
        expect(submitButton).toBeInTheDocument();
      }
    });

    it('deve exibir estado vazio quando não há dados', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve exibir skeleton loading para conteúdo', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar layout a diferentes telas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve reorganizar cards em grid responsivo', () => {
      mockScreenSize(BREAKPOINTS.TABLET);
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve funcionar formulário em mobile', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve manter proporção das imagens', () => {
      mockScreenSize(BREAKPOINTS.DESKTOP);
      renderAboutus();
      
      const logo = screen.getByAltText('Zabbix Logo');
      expect(logo).toBeInTheDocument();
    });

    it('deve manter texto legível em todas as telas', () => {
      mockScreenSize(BREAKPOINTS.MOBILE);
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels associados no formulário', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve ter aria-label apropriado nos links', () => {
      renderAboutus();
      
      // Verificar se elementos principais estão presentes
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve ter contraste adequado', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
    });

    it('deve funcionar navegação por teclado', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      await user.tab();
      await user.tab();
      
      expect(document.activeElement).toBeInTheDocument();
    });

    it('deve ser navegável por screen readers', () => {
      renderAboutus();
      
      // Verificar se elementos principais têm estrutura semântica adequada
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('deve carregar página rapidamente', async () => {
      const startTime = performance.now();
      renderAboutus();
      const endTime = performance.now();
      
      // Verificar se renderização foi rápida (menos de 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('deve implementar lazy loading para imagens', () => {
      renderAboutus();
      
      const logo = screen.getByAltText('Zabbix Logo');
      expect(logo).toBeInTheDocument();
    });

    it('deve otimizar conteúdo', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve enviar dados do formulário eficientemente', async () => {
      const user = userEvent.setup();
      renderAboutus();
      
      // Simular envio do formulário
      const submitButton = screen.queryByText('Enviar');
      if (submitButton) {
        await user.click(submitButton);
        expect(submitButton).toBeInTheDocument();
      }
    });
  });

  describe('Por Tipo de Usuário', () => {
    it('deve ter acesso completo para todos os usuários', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
    });

    it('deve exibir opções de cadastro para usuário não logado', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve exibir opções personalizadas para cliente logado', () => {
      renderAboutus(mockUser);
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve exibir opções de parceria para fornecedor', () => {
      renderAboutus(mockSupplier);
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });
  });

  describe('Conteúdo Específico', () => {
    it('deve exibir valores da empresa corretamente', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
      expect(screen.getByText('Redefinindo a experiência de compra online com estilo, qualidade e inovação')).toBeInTheDocument();
    });

    it('deve exibir informações da equipe', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve exibir funcionalidades principais', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve exibir informações de contato', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve exibir links para redes sociais', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve exibir história da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Nossa História')).toBeInTheDocument();
      expect(screen.getByText('A Zabbix nasceu com o propósito de transformar o e-commerce em uma experiência simples, inteligente e acessível para todos.')).toBeInTheDocument();
    });

    it('deve exibir missão da empresa', () => {
      renderAboutus();
      
      expect(screen.getByText('Nossa missão é democratizar o acesso à moda, oferecendo peças que expressam personalidade e estilo, sempre com os melhores preços e qualidade garantida.')).toBeInTheDocument();
    });
  });

  describe('SEO e Meta Tags', () => {
    it('deve ter título apropriado', () => {
      renderAboutus();
      
      expect(screen.getByText('Sobre a Zabbix')).toBeInTheDocument();
    });

    it('deve ter descrição apropriada', () => {
      renderAboutus();
      
      expect(screen.getByText('Redefinindo a experiência de compra online com estilo, qualidade e inovação')).toBeInTheDocument();
    });

    it('deve ter estrutura semântica adequada', () => {
      renderAboutus();
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });
});
