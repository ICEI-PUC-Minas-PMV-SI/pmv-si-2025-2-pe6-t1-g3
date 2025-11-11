import { useAuth as useAuthContext } from '../contexts/AuthContext';

/**
 * Wrapper hook for AuthContext
 * Provides easy access to authentication state and methods
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;

