import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Card from '../UI/Card';

const Login = () => {
  const [formData, setFormData] = useState({
    EMAIL: '',
    SENHA: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

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
    
    if (!formData.EMAIL) {
      newErrors.EMAIL = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.EMAIL)) {
      newErrors.EMAIL = 'Email inválido';
    }
    
    if (!formData.SENHA) {
      newErrors.SENHA = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      login(response.data.token);
      navigate('/');
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Erro ao fazer login'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Entrar
          </h2>
          <p className="mt-2 text-gray-600">
            Acesse sua conta
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

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
              label="Senha"
              type="password"
              name="SENHA"
              value={formData.SENHA}
              onChange={handleChange}
              error={errors.SENHA}
              placeholder="Digite sua senha"
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link 
                to="/register" 
                className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;