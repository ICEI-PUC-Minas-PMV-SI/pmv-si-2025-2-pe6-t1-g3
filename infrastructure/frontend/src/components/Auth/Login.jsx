import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';

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
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
            Entrar
          </h1>
          <p className="text-sm text-gray-600">
            Acesse sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900">
              {errors.general}
            </div>
          )}

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
            <label htmlFor="senha" className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
              Senha
            </label>
            <input
              type="password"
              name="SENHA"
              id="senha"
              value={formData.SENHA}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
              className="w-full px-4 py-3 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
            {errors.SENHA && (
              <p className="mt-1 text-xs text-gray-600">{errors.SENHA}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-gray-900 hover:text-gray-600 transition-colors underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;