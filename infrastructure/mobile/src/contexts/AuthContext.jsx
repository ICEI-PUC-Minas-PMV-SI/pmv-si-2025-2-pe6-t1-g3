import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import SecureStore from '../services/secureStore';

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
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
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
              await SecureStore.deleteItemAsync('token');
            }
          } catch (error) {
            console.error('Invalid token:', error);
            await SecureStore.deleteItemAsync('token');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (token) => {
    try {
      await SecureStore.setItemAsync('token', token);
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
    } catch (error) {
      console.error('Error saving token:', error);
      throw error; // Re-throw error so LoginScreen can handle it
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setUser(null);
    } catch (error) {
      console.error('Error removing token:', error);
    }
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

