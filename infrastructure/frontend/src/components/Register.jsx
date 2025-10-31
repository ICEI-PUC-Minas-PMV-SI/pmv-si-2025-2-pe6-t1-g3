import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    NOME: '',
    SOBRENOME: '',
    EMAIL: '',
    CPF: '',
    TELEFONE: '',
    SENHA: '',
    confSenha: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.NOME) {
      newErrors.NOME = 'Nome é obrigatório';
    }
    
    if (!formData.SOBRENOME) {
      newErrors.SOBRENOME = 'Sobrenome é obrigatório';
    }
    
    if (!formData.EMAIL) {
      newErrors.EMAIL = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.EMAIL)) {
      newErrors.EMAIL = 'Email inválido';
    }
    
    if (!formData.CPF) {
      newErrors.CPF = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/.test(formData.CPF)) {
      newErrors.CPF = 'CPF inválido';
    }
    
    if (!formData.TELEFONE) {
      newErrors.TELEFONE = 'Telefone é obrigatório';
    }
    
    if (!formData.SENHA) {
      newErrors.SENHA = 'Senha é obrigatória';
    } else if (formData.SENHA.length < 6) {
      newErrors.SENHA = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!formData.confSenha) {
      newErrors.confSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.SENHA !== formData.confSenha) {
      newErrors.confSenha = 'Senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const { confSenha, ...registerData } = formData;
      const response = await authService.register(registerData);
      
      setErrors({
        general: { 
          message: 'Cadastro realizado com sucesso! Redirecionando...',
          type: 'success'
        }
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar usuário';
      
      if (error.response?.status === 409) {
        errorMessage = 'Email já está sendo usado';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors({
        general: { message: errorMessage, type: 'error' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
            Criar Conta
          </h1>
          <p className="text-sm text-gray-600">
            Cadastre-se para acessar a loja
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {errors.general && (
            <div className={`border p-4 text-sm ${
              errors.general.type === 'success'
                ? 'border-black bg-black text-white'
                : 'border-gray-300 bg-gray-50 text-gray-900'
            }`}>
              {errors.general.message}
            </div>
          )}

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-xs uppercase tracking-wider text-gray-900">
                Informações Pessoais
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  name="NOME"
                  id="nome"
                  value={formData.NOME}
                  onChange={handleChange}
                  placeholder="Seu primeiro nome"
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
                {errors.NOME && (
                  <p className="mt-1 text-xs text-gray-600">{errors.NOME}</p>
                )}
              </div>

              <div>
                <label htmlFor="sobrenome" className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
                  Sobrenome
                </label>
                <input
                  type="text"
                  name="SOBRENOME"
                  id="sobrenome"
                  value={formData.SOBRENOME}
                  onChange={handleChange}
                  placeholder="Seu sobrenome"
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
                {errors.SOBRENOME && (
                  <p className="mt-1 text-xs text-gray-600">{errors.SOBRENOME}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="cpf" className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
                CPF
              </label>
              <input
                type="text"
                name="CPF"
                id="cpf"
                value={formData.CPF}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
              {errors.CPF && (
                <p className="mt-1 text-xs text-gray-600">{errors.CPF}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-xs uppercase tracking-wider text-gray-900">
                Contato
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="EMAIL"
                  id="email"
                  value={formData.EMAIL}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
                {errors.EMAIL && (
                  <p className="mt-1 text-xs text-gray-600">{errors.EMAIL}</p>
                )}
              </div>

              <div>
                <label htmlFor="telefone" className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="TELEFONE"
                  id="telefone"
                  value={formData.TELEFONE}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
                {errors.TELEFONE && (
                  <p className="mt-1 text-xs text-gray-600">{errors.TELEFONE}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-xs uppercase tracking-wider text-gray-900">
                Segurança
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="senha" className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  name="SENHA"
                  id="senha"
                  value={formData.SENHA}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
                {errors.SENHA && (
                  <p className="mt-1 text-xs text-gray-600">{errors.SENHA}</p>
                )}
              </div>

              <div>
                <label htmlFor="confSenha" className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  name="confSenha"
                  id="confSenha"
                  value={formData.confSenha}
                  onChange={handleChange}
                  placeholder="Digite a senha novamente"
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
                {errors.confSenha && (
                  <p className="mt-1 text-xs text-gray-600">{errors.confSenha}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-gray-900 hover:text-gray-600 transition-colors underline"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;