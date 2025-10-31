import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const retrievetoken = localStorage.getItem("token");
  useEffect(() => {
    const retrievetoken = localStorage.getItem("token");
    if (retrievetoken) {
      try {
        const decodedToken = JSON.parse(atob(retrievetoken.split(".")[1]));
        const expirationTime = decodedToken.exp * 1000;
        if (Date.now() < expirationTime) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [retrievetoken, navigate]);

  const [loginData, setLoginData] = useState({
    EMAIL: "",
    SENHA: "",
  });

  const handleValidateLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await api.post('/login', loginData);
      if (res.status === 201 || res.status === 204 || res.status === 200) {
        setIsSuccess(true);
        const token = res.data.token;
        localStorage.setItem("token", token);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage("Usuário ou senha incorretos.");
      } else {
        setMessage("Erro ao fazer login. Tente novamente.");
        console.error("Erro ao fazer login:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setMessage(null);
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

        <form onSubmit={handleValidateLogin} className="space-y-6">
          {message && (
            <div className={`border p-4 text-sm ${
              isSuccess
                ? 'border-black bg-black text-white'
                : 'border-gray-300 bg-gray-50 text-gray-900'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="EMAIL"
                id="email"
                value={loginData.EMAIL}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="SENHA"
                id="senha"
                value={loginData.SENHA}
                onChange={handleChange}
                placeholder="Sua senha"
                required
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
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
