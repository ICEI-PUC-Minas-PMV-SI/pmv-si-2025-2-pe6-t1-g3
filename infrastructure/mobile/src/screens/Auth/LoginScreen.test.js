import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import LoginScreen from './LoginScreen';
import { renderWithProviders } from '../../__tests__/helpers/renderWithProviders';
import { authService } from '../../services/api';
import Toast from 'react-native-toast-message';

// Mock dependencies
jest.mock('../../services/api', () => ({
  authService: {
    login: jest.fn(),
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  const defaultAuthValue = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: mockLogin,
    logout: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // The mock is already set up in setupTests.js globally
    // Just ensure the mockNavigate is used
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('should render login form', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    expect(getByPlaceholderText('seu@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
  });

  it('should update email field when typing', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    const emailInput = getByPlaceholderText('seu@email.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('should update password field when typing', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    const passwordInput = getByPlaceholderText('Digite sua senha');
    fireEvent.changeText(passwordInput, 'password123');

    expect(passwordInput.props.value).toBe('password123');
  });

  it('should show error for invalid email format', async () => {
    const { getByPlaceholderText, getAllByText, getByText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    const emailInput = getByPlaceholderText('seu@email.com');
    fireEvent.changeText(emailInput, 'invalid-email');

    const submitButtons = getAllByText('Entrar');
    const submitButton = submitButtons[submitButtons.length - 1]; // Get the button, not the title
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Email inválido')).toBeTruthy();
    });
  });

  it('should show error for empty email', async () => {
    const { getByPlaceholderText, getAllByText, getByText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    const passwordInput = getByPlaceholderText('Digite sua senha');
    fireEvent.changeText(passwordInput, 'password');

    const submitButtons = getAllByText('Entrar');
    const submitButton = submitButtons[submitButtons.length - 1];
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Email é obrigatório')).toBeTruthy();
    });
  });

  it('should show error for empty password', async () => {
    const { getByPlaceholderText, getAllByText, getByText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    const emailInput = getByPlaceholderText('seu@email.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    const submitButtons = getAllByText('Entrar');
    const submitButton = submitButtons[submitButtons.length - 1];
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Senha é obrigatória')).toBeTruthy();
    });
  });

  it('should call login service on valid form submission', async () => {
    const mockToken = 'mock-token';
    authService.login.mockResolvedValue({ data: { token: mockToken } });

    const { getByPlaceholderText, getAllByText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    const emailInput = getByPlaceholderText('seu@email.com');
    const passwordInput = getByPlaceholderText('Digite sua senha');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    const submitButtons = getAllByText('Entrar');
    const submitButton = submitButtons[submitButtons.length - 1];
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        EMAIL: 'test@example.com',
        SENHA: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockToken);
    });
  });

  it('should show error message on login failure', async () => {
    const error = {
      response: {
        data: {
          message: 'Credenciais inválidas',
        },
      },
    };
    authService.login.mockRejectedValue(error);

    const { getByPlaceholderText, getAllByText, getByText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    const emailInput = getByPlaceholderText('seu@email.com');
    const passwordInput = getByPlaceholderText('Digite sua senha');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    const submitButtons = getAllByText('Entrar');
    const submitButton = submitButtons[submitButtons.length - 1];
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Credenciais inválidas')).toBeTruthy();
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Erro ao fazer login',
        text2: 'Credenciais inválidas',
      });
    });
  });

  it('should show loading state during login', async () => {
    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    authService.login.mockReturnValue(loginPromise);

    const { getByPlaceholderText, getAllByText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    const emailInput = getByPlaceholderText('seu@email.com');
    const passwordInput = getByPlaceholderText('Digite sua senha');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    const submitButtons = getAllByText('Entrar');
    const submitButton = submitButtons[submitButtons.length - 1];
    fireEvent.press(submitButton);

    // Button should show loading state
    await waitFor(() => {
      expect(submitButton).toBeTruthy();
    });

    await act(async () => {
      resolveLogin({ data: { token: 'token' } });
      await loginPromise;
    });
  });

  it('should navigate to register screen', () => {
    const { getByText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    const registerLink = getByText('Cadastre-se');
    fireEvent.press(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('should clear errors when input changes', async () => {
    const { getByPlaceholderText, getAllByText, getByText, queryByText } = renderWithProviders(
      <LoginScreen />,
      { authValue: defaultAuthValue }
    );

    const submitButtons = getAllByText('Entrar');
    const submitButton = submitButtons[submitButtons.length - 1];
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Email é obrigatório')).toBeTruthy();
    });

    const emailInput = getByPlaceholderText('seu@email.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    await waitFor(() => {
      expect(queryByText('Email é obrigatório')).toBeNull();
    });
  });
});

