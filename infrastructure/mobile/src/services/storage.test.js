import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from './storage';

describe('storage service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getItem', () => {
    it('should get item from AsyncStorage', async () => {
      AsyncStorage.getItem.mockResolvedValue('test-value');
      
      const result = await storage.getItem('test-key');
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toBe('test-value');
    });

    it('should return null when item does not exist', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      
      const result = await storage.getItem('non-existent-key');
      
      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await storage.getItem('test-key');
      
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('setItem', () => {
    it('should set item in AsyncStorage', async () => {
      AsyncStorage.setItem.mockResolvedValue();
      
      await storage.setItem('test-key', 'test-value');
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('should handle errors gracefully', async () => {
      AsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await storage.setItem('test-key', 'test-value');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('removeItem', () => {
    it('should remove item from AsyncStorage', async () => {
      AsyncStorage.removeItem.mockResolvedValue();
      
      await storage.removeItem('test-key');
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle errors gracefully', async () => {
      AsyncStorage.removeItem.mockRejectedValue(new Error('Storage error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await storage.removeItem('test-key');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('clear', () => {
    it('should clear all items from AsyncStorage', async () => {
      AsyncStorage.clear.mockResolvedValue();
      
      await storage.clear();
      
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      AsyncStorage.clear.mockRejectedValue(new Error('Storage error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await storage.clear();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });
});

