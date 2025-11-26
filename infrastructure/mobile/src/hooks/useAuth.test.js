import { renderHook } from '@testing-library/react-native';
import { useAuth } from './useAuth';
import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Mock the context
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('useAuth hook', () => {
  it('should return context value', () => {
    const mockAuthValue = {
      user: { id: 1, email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    };

    useAuthContext.mockReturnValue(mockAuthValue);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toEqual(mockAuthValue);
    expect(useAuthContext).toHaveBeenCalled();
  });
});

