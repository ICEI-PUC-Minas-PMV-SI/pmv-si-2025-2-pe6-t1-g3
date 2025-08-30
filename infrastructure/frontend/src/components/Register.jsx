import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import Input from './UI/Input';
import Button from './UI/Button';
import Card from './UI/Card';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Criar Conta
          </h2>
          <p className="mt-2 text-gray-600">
            Cadastre-se para acessar sua conta
          </p>
        </div>

        <Card>
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm font-medium text-gray-600 mb-4">
              <span className="flex items-center">
                <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs mr-2">1</span>
                Pessoais
              </span>
              <span className="flex items-center">
                <span className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                Contato
              </span>
              <span className="flex items-center">
                <span className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                Segurança
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-900 h-2 rounded-full transition-all duration-300" style={{width: '33.33%'}}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {errors.general && (
              <div className={`border rounded-lg p-4 ${
                errors.general.type === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm ${
                  errors.general.type === 'success' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {errors.general.message}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </span>
                  Informações Pessoais
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Dados básicos para identificação
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome"
                  type="text"
                  name="NOME"
                  value={formData.NOME}
                  onChange={handleChange}
                  error={errors.NOME}
                  placeholder="Seu primeiro nome"
                  required
                />

                <Input
                  label="Sobrenome"
                  type="text"
                  name="SOBRENOME"
                  value={formData.SOBRENOME}
                  onChange={handleChange}
                  error={errors.SOBRENOME}
                  placeholder="Seu sobrenome"
                  required
                />
              </div>

              <Input
                label="CPF"
                type="text"
                name="CPF"
                value={formData.CPF}
                onChange={handleChange}
                error={errors.CPF}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    2
                  </span>
                  Informações de Contato
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Como podemos entrar em contato com você
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  name="EMAIL"
                  value={formData.EMAIL}
                  onChange={handleChange}
                  error={errors.EMAIL}
                  placeholder="seu@email.com"
                  required
                />

                <Input
                  label="Telefone"
                  type="tel"
                  name="TELEFONE"
                  value={formData.TELEFONE}
                  onChange={handleChange}
                  error={errors.TELEFONE}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    3
                  </span>
                  Segurança da Conta
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Crie uma senha forte para proteger sua conta
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Senha"
                  type="password"
                  name="SENHA"
                  value={formData.SENHA}
                  onChange={handleChange}
                  error={errors.SENHA}
                  placeholder="Mínimo 6 caracteres"
                  required
                />

                <Input
                  label="Confirmar Senha"
                  type="password"
                  name="confSenha"
                  value={formData.confSenha}
                  onChange={handleChange}
                  error={errors.confSenha}
                  placeholder="Digite a senha novamente"
                  required
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Dicas para uma senha forte:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>Pelo menos 6 caracteres</li>
                  <li>Use letras maiúsculas e minúsculas</li>
                  <li>Inclua números e símbolos</li>
                  <li>Evite informações pessoais óbvias</li>
                </ul>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;