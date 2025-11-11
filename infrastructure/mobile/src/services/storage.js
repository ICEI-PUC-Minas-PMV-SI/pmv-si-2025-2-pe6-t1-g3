import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Wrapper for AsyncStorage to provide a consistent API
 * Similar to localStorage but async
 */
export const storage = {
  /**
   * Get an item from storage
   * @param {string} key - The key to retrieve
   * @returns {Promise<string|null>} The stored value or null
   */
  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  /**
   * Set an item in storage
   * @param {string} key - The key to store
   * @param {string} value - The value to store
   * @returns {Promise<void>}
   */
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },

  /**
   * Remove an item from storage
   * @param {string} key - The key to remove
   * @returns {Promise<void>}
   */
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  },

  /**
   * Clear all items from storage
   * @returns {Promise<void>}
   */
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export default storage;

