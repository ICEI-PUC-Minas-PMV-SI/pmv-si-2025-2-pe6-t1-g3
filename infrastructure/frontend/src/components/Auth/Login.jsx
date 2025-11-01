import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';
import GoogleLoginButton from './GoogleLoginButton';

const Login = () => {
  const [formData, setFormData] = useState({
    EMAIL: '',
    SENHA: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [googleError, setGoogleError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.EMAIL) {
      errors.EMAIL = 'Email e obrigatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.EMAIL)) {
      errors.EMAIL = 'Email invalido';
    }

    if (!formData.SENHA) {
      errors.SENHA = 'Senha e obrigatoria';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');
    setGoogleError('');

    try {
      const response = await authService.login(formData);
      login(response.data.token);
      navigate('/');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Nao foi possivel fazer login.';
      setGeneralError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setGoogleError('');
    setGeneralError('');
    setIsGoogleLoading(true);

    try {
      const response = await authService.loginWithGoogle({ credential });
      login(response.data.token);
      navigate('/');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Nao foi possivel entrar com Google.';
      setGoogleError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (message) => {
    setGoogleError(message);
  };

  const isSubmitting = isLoading || isGoogleLoading;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
            Entrar
          </h1>
          <p className="text-sm text-gray-600">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {generalError && (
            <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {generalError}
            </div>
          )}

          {googleError && !generalError && (
            <div className="border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              {googleError}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider text-gray-900 mb-2"
            >
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
            {fieldErrors.EMAIL && (
              <p className="mt-1 text-xs text-gray-600">{fieldErrors.EMAIL}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="senha"
              className="block text-xs uppercase tracking-wider text-gray-900 mb-2"
            >
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
            {fieldErrors.SENHA && (
              <p className="mt-1 text-xs text-gray-600">{fieldErrors.SENHA}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="flex items-center my-8">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="px-4 text-xs uppercase tracking-widest text-gray-400">
            ou
          </span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        <GoogleLoginButton
          onCredential={handleGoogleCredential}
          onError={handleGoogleError}
          isSubmitting={isSubmitting}
        />
        {isGoogleLoading && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Entrando com Google...
          </p>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Nao tem uma conta?{' '}
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
