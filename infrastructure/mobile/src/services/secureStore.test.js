import SecureStore from './secureStore';
import * as ExpoSecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('SecureStore service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Por padrão, SecureStore está disponível
    ExpoSecureStore.isAvailable.mockReturnValue(true);
  });

  describe('getItemAsync', () => {
    it('should get item from SecureStore', async () => {
      ExpoSecureStore.getItemAsync.mockResolvedValue('test-value');
      
      const result = await SecureStore.getItemAsync('test-key');
      
      expect(ExpoSecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
      expect(result).toBe('test-value');
    });

    it('should return null when item does not exist', async () => {
      ExpoSecureStore.getItemAsync.mockResolvedValue(null);
      
      const result = await SecureStore.getItemAsync('non-existent-key');
      
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      ExpoSecureStore.getItemAsync.mockRejectedValue(new Error('SecureStore error'));
      
      await expect(SecureStore.getItemAsync('test-key')).rejects.toThrow();
    });
  });

  describe('setItemAsync', () => {
    it('should set item in SecureStore', async () => {
      ExpoSecureStore.setItemAsync.mockResolvedValue();
      
      await SecureStore.setItemAsync('test-key', 'test-value');
      
      expect(ExpoSecureStore.setItemAsync).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('should handle errors', async () => {
      ExpoSecureStore.setItemAsync.mockRejectedValue(new Error('SecureStore error'));
      
      await expect(SecureStore.setItemAsync('test-key', 'test-value')).rejects.toThrow();
    });
  });

  describe('deleteItemAsync', () => {
    it('should delete item from SecureStore', async () => {
      ExpoSecureStore.deleteItemAsync.mockResolvedValue();
      
      await SecureStore.deleteItemAsync('test-key');
      
      expect(ExpoSecureStore.deleteItemAsync).toHaveBeenCalledWith('test-key');
    });

    it('should handle errors', async () => {
      ExpoSecureStore.deleteItemAsync.mockRejectedValue(new Error('SecureStore error'));
      
      await expect(SecureStore.deleteItemAsync('test-key')).rejects.toThrow();
    });
  });

  describe('AsyncStorage fallback', () => {
    let originalGetItemAsync;
    let originalSetItemAsync;
    let originalDeleteItemAsync;

    beforeEach(() => {
      // Simular que SecureStore não está disponível
      ExpoSecureStore.isAvailable.mockReturnValue(false);
      // Salvar referências originais
      originalGetItemAsync = ExpoSecureStore.getItemAsync;
      originalSetItemAsync = ExpoSecureStore.setItemAsync;
      originalDeleteItemAsync = ExpoSecureStore.deleteItemAsync;
      // Remover os métodos para simular que não estão disponíveis
      delete ExpoSecureStore.getItemAsync;
      delete ExpoSecureStore.setItemAsync;
      delete ExpoSecureStore.deleteItemAsync;
    });

    afterEach(() => {
      // Restaurar os métodos
      ExpoSecureStore.getItemAsync = originalGetItemAsync;
      ExpoSecureStore.setItemAsync = originalSetItemAsync;
      ExpoSecureStore.deleteItemAsync = originalDeleteItemAsync;
    });

    describe('getItemAsync fallback', () => {
      it('should use AsyncStorage when SecureStore is not available', async () => {
        AsyncStorage.getItem.mockResolvedValue('fallback-value');
        
        const result = await SecureStore.getItemAsync('test-key');
        
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-key');
        expect(result).toBe('fallback-value');
      });

      it('should handle AsyncStorage errors', async () => {
        AsyncStorage.getItem.mockRejectedValue(new Error('AsyncStorage error'));
        
        await expect(SecureStore.getItemAsync('test-key')).rejects.toThrow('AsyncStorage error');
      });
    });

    describe('setItemAsync fallback', () => {
      it('should use AsyncStorage when SecureStore is not available', async () => {
        AsyncStorage.setItem.mockResolvedValue();
        
        await SecureStore.setItemAsync('test-key', 'test-value');
        
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
      });

      it('should handle AsyncStorage errors', async () => {
        AsyncStorage.setItem.mockRejectedValue(new Error('AsyncStorage error'));
        
        await expect(SecureStore.setItemAsync('test-key', 'test-value')).rejects.toThrow('AsyncStorage error');
      });
    });

    describe('deleteItemAsync fallback', () => {
      it('should use AsyncStorage when SecureStore is not available', async () => {
        AsyncStorage.removeItem.mockResolvedValue();
        
        await SecureStore.deleteItemAsync('test-key');
        
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
      });

      it('should handle AsyncStorage errors', async () => {
        AsyncStorage.removeItem.mockRejectedValue(new Error('AsyncStorage error'));
        
        await expect(SecureStore.deleteItemAsync('test-key')).rejects.toThrow('AsyncStorage error');
      });
    });
  });
});

