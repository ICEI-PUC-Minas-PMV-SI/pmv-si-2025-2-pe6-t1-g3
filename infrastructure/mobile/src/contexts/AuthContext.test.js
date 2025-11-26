import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from './AuthContext';
import SecureStore from '../services/secureStore';
import { jwtDecode } from 'jwt-decode';

// Mock dependencies
jest.mock('../services/secureStore');
jest.mock('jwt-decode');

const TestComponent = () => {
  const auth = useAuth();
  if (auth.isLoading) {
    return <Text>Loading</Text>;
  }
  return <Text>{auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</Text>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide auth context to children', async () => {
    SecureStore.getItemAsync.mockResolvedValue(null);
    
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for loading to complete and text to appear
    await waitFor(() => {
      expect(getByText('Not Authenticated')).toBeTruthy();
    }, { timeout: 10000 });
  }, 15000);

  it('should load user from token on mount', async () => {
    const mockToken = 'mock-token';
    const mockDecodedToken = {
      CODUSU: 1,
      EMAIL: 'test@example.com',
      NOME: 'Test',
      SOBRENOME: 'User',
      PERMISSAO: 'CLIENT',
      exp: Date.now() / 1000 + 3600, // Valid for 1 hour
    };

    SecureStore.getItemAsync.mockResolvedValue(mockToken);
    jwtDecode.mockReturnValue(mockDecodedToken);

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('token');
    });
  });

  it('should not load user when token is expired', async () => {
    const mockToken = 'expired-token';
    const mockDecodedToken = {
      CODUSU: 1,
      EMAIL: 'test@example.com',
      exp: Date.now() / 1000 - 3600, // Expired 1 hour ago
    };

    SecureStore.getItemAsync.mockResolvedValue(mockToken);
    jwtDecode.mockReturnValue(mockDecodedToken);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('token');
    });
  });

  it('should login and save token', async () => {
    const mockToken = 'new-token';
    const mockDecodedToken = {
      CODUSU: 1,
      EMAIL: 'test@example.com',
      NOME: 'Test',
      SOBRENOME: 'User',
      PERMISSAO: 'CLIENT',
    };

    SecureStore.getItemAsync.mockResolvedValue(null);
    SecureStore.setItemAsync.mockResolvedValue();
    jwtDecode.mockReturnValue(mockDecodedToken);

    let authValue;
    const TestLogin = () => {
      const auth = useAuth();
      authValue = auth;
      React.useEffect(() => {
        auth.login(mockToken);
      }, []);
      return null;
    };

    render(
      <AuthProvider>
        <TestLogin />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('token', mockToken);
    });
  });

  it('should logout and remove token', async () => {
    SecureStore.getItemAsync.mockResolvedValue(null);
    SecureStore.deleteItemAsync.mockResolvedValue();

    let authValue;
    const TestLogout = () => {
      const auth = useAuth();
      authValue = auth;
      React.useEffect(() => {
        auth.logout();
      }, []);
      return null;
    };

    render(
      <AuthProvider>
        <TestLogout />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('token');
    });
  });

  it('should throw error when useAuth is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // The error is thrown during render, so we need to catch it
    try {
      render(<TestComponent />);
      // If we get here, the error wasn't thrown
      expect(true).toBe(false); // Force test to fail
    } catch (error) {
      expect(error.message).toContain('useAuth must be used within an AuthProvider');
    }

    consoleSpy.mockRestore();
  });

  it('should set isAdmin to true for ADMIN role', async () => {
    const mockToken = 'admin-token';
    const mockDecodedToken = {
      CODUSU: 1,
      EMAIL: 'admin@example.com',
      NOME: 'Admin',
      SOBRENOME: 'User',
      PERMISSAO: 'ADMIN',
      exp: Date.now() / 1000 + 3600,
    };

    SecureStore.getItemAsync.mockResolvedValue(mockToken);
    jwtDecode.mockReturnValue(mockDecodedToken);

    let authValue;
    const TestAdmin = () => {
      const auth = useAuth();
      authValue = auth;
      return null;
    };

    render(
      <AuthProvider>
        <TestAdmin />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authValue?.user?.isAdmin).toBe(true);
    });
  });
});

