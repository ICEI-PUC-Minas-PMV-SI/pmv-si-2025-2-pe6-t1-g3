import * as ExpoSecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NativeSecureStore = ExpoSecureStore && ExpoSecureStore.default ? ExpoSecureStore.default : ExpoSecureStore;

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// Verificar se SecureStore está disponível
const isSecureStoreAvailable = () => {
  try {
    // Verificar se o método isAvailable existe e retorna true
    if (ExpoSecureStore && typeof ExpoSecureStore.isAvailable === 'function') {
      const available = ExpoSecureStore.isAvailable();
      // Se isAvailable retornar false explicitamente, não está disponível
      if (available === false) {
        return false;
      }
      // Se retornar true, está disponível
      if (available === true) {
        return true;
      }
    }
    
    // Se não tiver isAvailable ou retornar undefined, verificar se os métodos existem
    // E se são funções (não apenas propriedades undefined)
    const hasGetItem = NativeSecureStore?.getItemAsync && typeof NativeSecureStore.getItemAsync === 'function';
    const hasSetItem = NativeSecureStore?.setItemAsync && typeof NativeSecureStore.setItemAsync === 'function';
    const hasDeleteItem = NativeSecureStore?.deleteItemAsync && typeof NativeSecureStore.deleteItemAsync === 'function';
    
    // Só considerar disponível se pelo menos um método funcional existir
    return !!(hasGetItem || hasSetItem || hasDeleteItem);
  } catch (error) {
    // Se houver qualquer erro ao verificar, considerar não disponível
    console.warn('Error checking SecureStore availability:', error);
    return false;
  }
};

const tryCandidates = async (candidates, args) => {
  for (const fn of candidates) {
    try {
      if (!fn) continue;
      if (typeof fn !== 'function') continue;
      // Call and return result
      // eslint-disable-next-line no-await-in-loop
      return await fn(...args);
    } catch (err) {
      // If the function exists but calling it throws a TypeError about not a function,
      // continue to next candidate. For other errors, rethrow.
      if (err && err instanceof TypeError && /is not a function/i.test(err.message)) {
        // try next candidate
        // eslint-disable-next-line no-continue
        continue;
      }
      throw err;
    }
  }
  return undefined;
};

const safeGetProp = (obj, name) => {
  try {
    return obj && obj[name];
  } catch (err) {
    return undefined;
  }
};

const getItemAsync = async (key) => {
  // Verificar disponibilidade ANTES de tentar usar
  if (isWeb) return Promise.resolve(window.localStorage.getItem(key));

  // Se SecureStore não está disponível, usar AsyncStorage diretamente
  if (!isSecureStoreAvailable()) {
    if (AsyncStorage) {
      try {
        const value = await AsyncStorage.getItem(key);
        return value;
      } catch (error) {
        console.warn('Error getting item from AsyncStorage fallback:', error);
        throw error;
      }
    }
    throw new Error('SecureStore API is not available in this environment');
  }

  // SecureStore está disponível, tentar usar
  const candidates = [
    safeGetProp(NativeSecureStore, 'getItemAsync'),
    safeGetProp(NativeSecureStore, 'getValueAsync'),
    safeGetProp(NativeSecureStore, 'getValueWithKeyAsync'),
    safeGetProp(NativeSecureStore, 'getItem'),
    safeGetProp(NativeSecureStore, 'getValue'),
  ];

  const result = await tryCandidates(candidates, [key]);
  if (typeof result !== 'undefined') return result;

  // Se SecureStore falhou, tentar AsyncStorage como último recurso
  if (AsyncStorage) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.warn('Error getting item from AsyncStorage fallback:', error);
      throw error;
    }
  }

  throw new Error('SecureStore API is not available in this environment');
};

const setItemAsync = async (key, value) => {
  // Verificar disponibilidade ANTES de tentar usar
  if (isWeb) {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  }

  // Se SecureStore não está disponível, usar AsyncStorage diretamente
  if (!isSecureStoreAvailable()) {
    if (AsyncStorage) {
      try {
        await AsyncStorage.setItem(key, value);
        return Promise.resolve();
      } catch (error) {
        console.warn('Error setting item in AsyncStorage fallback:', error);
        throw error;
      }
    }
    throw new Error('SecureStore API is not available in this environment');
  }

  // SecureStore está disponível, tentar usar
  const candidates = [
    NativeSecureStore && NativeSecureStore.setItemAsync,
    NativeSecureStore && NativeSecureStore.setValueAsync,
    NativeSecureStore && NativeSecureStore.setValueWithKeyAsync,
    NativeSecureStore && NativeSecureStore.setItem,
    NativeSecureStore && NativeSecureStore.setValue,
  ];

  const result = await tryCandidates(candidates, [key, value]);
  if (typeof result !== 'undefined') return result;

  // Se SecureStore falhou, tentar AsyncStorage como último recurso
  if (AsyncStorage) {
    try {
      await AsyncStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      console.warn('Error setting item in AsyncStorage fallback:', error);
      throw error;
    }
  }

  throw new Error('SecureStore API is not available in this environment');
};

const deleteItemAsync = async (key) => {
  // Verificar disponibilidade ANTES de tentar usar
  if (isWeb) {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  }

  // Se SecureStore não está disponível, usar AsyncStorage diretamente
  if (!isSecureStoreAvailable()) {
    if (AsyncStorage) {
      try {
        await AsyncStorage.removeItem(key);
        return Promise.resolve();
      } catch (error) {
        console.warn('Error deleting item from AsyncStorage fallback:', error);
        throw error;
      }
    }
    throw new Error('SecureStore API is not available in this environment');
  }

  // SecureStore está disponível, tentar usar
  const candidates = [
    NativeSecureStore && NativeSecureStore.deleteItemAsync,
    NativeSecureStore && NativeSecureStore.deleteValueAsync,
    NativeSecureStore && NativeSecureStore.deleteValueWithKeyAsync,
    NativeSecureStore && NativeSecureStore.deleteItem,
    NativeSecureStore && NativeSecureStore.deleteValue,
  ];

  const result = await tryCandidates(candidates, [key]);
  if (typeof result !== 'undefined') return result;

  // Se SecureStore falhou, tentar AsyncStorage como último recurso
  if (AsyncStorage) {
    try {
      await AsyncStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      console.warn('Error deleting item from AsyncStorage fallback:', error);
      throw error;
    }
  }

  throw new Error('SecureStore API is not available in this environment');
};

export default {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
};
