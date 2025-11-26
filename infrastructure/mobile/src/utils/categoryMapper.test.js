import {
  mapCategoryToBackend,
  mapBackendToCategoryName,
  CATEGORY_NAME_TO_BACKEND,
  CATEGORY_SLUG_TO_BACKEND,
  BACKEND_TO_CATEGORY_NAME,
} from './categoryMapper';

describe('categoryMapper', () => {
  describe('mapCategoryToBackend', () => {
    it('should map category name to backend value', () => {
      expect(mapCategoryToBackend('Eletrônicos')).toBe('ELETRÔNICOS');
      expect(mapCategoryToBackend('Fashion')).toBe('FASHION');
      expect(mapCategoryToBackend('Casa')).toBe('CASA');
      expect(mapCategoryToBackend('Esportes')).toBe('ESPORTES');
    });

    it('should map category slug to backend value', () => {
      expect(mapCategoryToBackend('eletronicos')).toBe('ELETRÔNICOS');
      expect(mapCategoryToBackend('fashion')).toBe('FASHION');
      expect(mapCategoryToBackend('casa')).toBe('CASA');
      expect(mapCategoryToBackend('esportes')).toBe('ESPORTES');
    });

    it('should handle already backend format', () => {
      expect(mapCategoryToBackend('ELETRÔNICOS')).toBe('ELETRÔNICOS');
      expect(mapCategoryToBackend('FASHION')).toBe('FASHION');
    });

    it('should handle case variations', () => {
      expect(mapCategoryToBackend('ELETRONICOS')).toBe('ELETRÔNICOS');
      expect(mapCategoryToBackend('Eletronicos')).toBe('ELETRÔNICOS');
    });

    it('should return null for invalid categories', () => {
      expect(mapCategoryToBackend('InvalidCategory')).toBeNull();
      expect(mapCategoryToBackend('')).toBeNull();
      expect(mapCategoryToBackend(null)).toBeNull();
      expect(mapCategoryToBackend(undefined)).toBeNull();
    });

    it('should trim whitespace', () => {
      expect(mapCategoryToBackend('  Eletrônicos  ')).toBe('ELETRÔNICOS');
      expect(mapCategoryToBackend('  fashion  ')).toBe('FASHION');
    });
  });

  describe('mapBackendToCategoryName', () => {
    it('should map backend value to category name', () => {
      expect(mapBackendToCategoryName('ELETRÔNICOS')).toBe('Eletrônicos');
      expect(mapBackendToCategoryName('FASHION')).toBe('Fashion');
      expect(mapBackendToCategoryName('CASA')).toBe('Casa');
      expect(mapBackendToCategoryName('ESPORTES')).toBe('Esportes');
    });

    it('should handle lowercase backend values', () => {
      expect(mapBackendToCategoryName('eletrônicos')).toBe('Eletrônicos');
      expect(mapBackendToCategoryName('fashion')).toBe('Fashion');
    });

    it('should return null for invalid backend values', () => {
      expect(mapBackendToCategoryName('INVALID')).toBeNull();
      expect(mapBackendToCategoryName('')).toBeNull();
      expect(mapBackendToCategoryName(null)).toBeNull();
      expect(mapBackendToCategoryName(undefined)).toBeNull();
    });
  });

  describe('Constants', () => {
    it('should have correct mappings in CATEGORY_NAME_TO_BACKEND', () => {
      expect(CATEGORY_NAME_TO_BACKEND['Eletrônicos']).toBe('ELETRÔNICOS');
      expect(CATEGORY_NAME_TO_BACKEND['Fashion']).toBe('FASHION');
      expect(CATEGORY_NAME_TO_BACKEND['Casa']).toBe('CASA');
      expect(CATEGORY_NAME_TO_BACKEND['Esportes']).toBe('ESPORTES');
    });

    it('should have correct mappings in CATEGORY_SLUG_TO_BACKEND', () => {
      expect(CATEGORY_SLUG_TO_BACKEND['eletronicos']).toBe('ELETRÔNICOS');
      expect(CATEGORY_SLUG_TO_BACKEND['fashion']).toBe('FASHION');
      expect(CATEGORY_SLUG_TO_BACKEND['casa']).toBe('CASA');
      expect(CATEGORY_SLUG_TO_BACKEND['esportes']).toBe('ESPORTES');
    });

    it('should have correct mappings in BACKEND_TO_CATEGORY_NAME', () => {
      expect(BACKEND_TO_CATEGORY_NAME['ELETRÔNICOS']).toBe('Eletrônicos');
      expect(BACKEND_TO_CATEGORY_NAME['FASHION']).toBe('Fashion');
      expect(BACKEND_TO_CATEGORY_NAME['CASA']).toBe('Casa');
      expect(BACKEND_TO_CATEGORY_NAME['ESPORTES']).toBe('Esportes');
    });
  });
});

