import * as ExpoSecureStore from 'expo-secure-store';

const NativeSecureStore = ExpoSecureStore && ExpoSecureStore.default ? ExpoSecureStore.default : ExpoSecureStore;

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

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
  const candidates = [
    safeGetProp(NativeSecureStore, 'getItemAsync'),
    safeGetProp(NativeSecureStore, 'getValueAsync'),
    safeGetProp(NativeSecureStore, 'getValueWithKeyAsync'),
    safeGetProp(NativeSecureStore, 'getItem'),
    safeGetProp(NativeSecureStore, 'getValue'),
  ];

  const result = await tryCandidates(candidates, [key]);
  if (typeof result !== 'undefined') return result;

  if (isWeb) return Promise.resolve(window.localStorage.getItem(key));

  throw new Error('SecureStore API is not available in this environment');
};

const setItemAsync = async (key, value) => {
  const candidates = [
    NativeSecureStore && NativeSecureStore.setItemAsync,
    NativeSecureStore && NativeSecureStore.setValueAsync,
    NativeSecureStore && NativeSecureStore.setValueWithKeyAsync,
    NativeSecureStore && NativeSecureStore.setItem,
    NativeSecureStore && NativeSecureStore.setValue,
  ];

  const result = await tryCandidates(candidates, [key, value]);
  if (typeof result !== 'undefined') return result;

  if (isWeb) {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  }

  throw new Error('SecureStore API is not available in this environment');
};

const deleteItemAsync = async (key) => {
  const candidates = [
    NativeSecureStore && NativeSecureStore.deleteItemAsync,
    NativeSecureStore && NativeSecureStore.deleteValueAsync,
    NativeSecureStore && NativeSecureStore.deleteValueWithKeyAsync,
    NativeSecureStore && NativeSecureStore.deleteItem,
    NativeSecureStore && NativeSecureStore.deleteValue,
  ];

  const result = await tryCandidates(candidates, [key]);
  if (typeof result !== 'undefined') return result;

  if (isWeb) {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  }

  throw new Error('SecureStore API is not available in this environment');
};

export default {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
};
