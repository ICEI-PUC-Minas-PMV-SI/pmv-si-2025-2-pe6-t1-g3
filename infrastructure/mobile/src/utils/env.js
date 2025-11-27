import Constants from 'expo-constants';

// Utility function to get environment variables at runtime
export const getEnvVar = (key, fallback = undefined) => {
  const config = Constants.expoConfig?.extra;
  if (config && config[key] !== undefined) {
    return config[key];
  }
  return fallback;
};

// Export commonly used environment variables with proper fallbacks
export const ENV = {
  API_URL: () => getEnvVar('apiUrl', 'https://zabbix.pnunes-develop.work/api'),
  VIACEP_API_URL: () => getEnvVar('viacepApiUrl', 'https://viacep.com.br/ws'),
  CONTACT_EMAIL: () => getEnvVar('contactEmail', 'contato@exemplo.com.br'),
  TOAST_AUTOCLOSE_DURATION: () => parseInt(getEnvVar('toastAutocloseDuration', '3000'), 10),
  SEARCH_DEBOUNCE_MS: () => parseInt(getEnvVar('searchDebounceMs', '500'), 10),
  CEP_FETCH_DELAY_MS: () => parseInt(getEnvVar('cepFetchDelayMs', '500'), 10),
  GOOGLE_CLIENT_ID: () => getEnvVar('googleClientId', ''),
};

