import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          const email = decodedToken.EMAIL || decodedToken.email;
          setUser({
            id: decodedToken.CODUSU,
            email,
            name: decodedToken.NOME,
            lastName: decodedToken.SOBRENOME,
            role: decodedToken.PERMISSAO,
            isAdmin: decodedToken.PERMISSAO === 'ADMIN',
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token);
    const email = decodedToken.EMAIL || decodedToken.email;
    setUser({
      id: decodedToken.CODUSU,
      email,
      name: decodedToken.NOME,
      lastName: decodedToken.SOBRENOME,
      role: decodedToken.PERMISSAO,
      isAdmin: decodedToken.PERMISSAO === 'ADMIN',
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

