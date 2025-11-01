// Utility function to get environment variables at runtime
// This function checks for runtime config first, then falls back to Vite's import.meta.env
export const getEnvVar = (key, fallback = undefined) => {
  // First check runtime configuration (injected at container startup)
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) {
    const runtimeValue = window.__RUNTIME_CONFIG__[key];
    if (runtimeValue && runtimeValue !== '${' + key + '}') {
      return runtimeValue;
    }
  }
  
  // Fallback to Vite's build-time environment variables
  if (import.meta && import.meta.env) {
    const buildTimeValue = import.meta.env[key];
    if (buildTimeValue !== undefined) {
      return buildTimeValue;
    }
  }
  
  // Final fallback to provided default value
  return fallback;
};

// Export commonly used environment variables with proper fallbacks
export const ENV = {
  API_URL: () => getEnvVar('VITE_API_URL', 'http://localhost:3000'),
  VIACEP_API_URL: () => getEnvVar('VITE_VIACEP_API_URL', 'https://viacep.com.br/ws'),
  CONTACT_EMAIL: () => getEnvVar('VITE_CONTACT_EMAIL', 'contato@exemplo.com.br'),
  GITHUB_REPOSITORY_URL: () => getEnvVar('VITE_GITHUB_REPOSITORY_URL', 'https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g3'),
  TOAST_AUTOCLOSE_DURATION: () => parseInt(getEnvVar('VITE_TOAST_AUTOCLOSE_DURATION', '3000')),
  SEARCH_DEBOUNCE_MS: () => parseInt(getEnvVar('VITE_SEARCH_DEBOUNCE_MS', '500')),
  CEP_FETCH_DELAY_MS: () => parseInt(getEnvVar('VITE_CEP_FETCH_DELAY_MS', '500')),
  GOOGLE_CLIENT_ID: () => getEnvVar('VITE_GOOGLE_CLIENT_ID', '')
};
