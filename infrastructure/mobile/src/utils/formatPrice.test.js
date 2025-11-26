import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('should format price correctly in Brazilian Real', () => {
    expect(formatPrice(99.99)).toBe('R$\xa099,99');
    expect(formatPrice(1000)).toBe('R$\xa01.000,00');
    expect(formatPrice(1299.99)).toBe('R$\xa01.299,99');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('R$\xa00,00');
  });

  it('should handle negative numbers', () => {
    expect(formatPrice(-100)).toBe('-R$\xa0100,00');
  });

  it('should handle very large numbers', () => {
    expect(formatPrice(999999.99)).toBe('R$\xa0999.999,99');
  });

  it('should handle decimal values', () => {
    expect(formatPrice(10.5)).toBe('R$\xa010,50');
    expect(formatPrice(0.99)).toBe('R$\xa00,99');
  });

  it('should return default value for invalid input', () => {
    expect(formatPrice(NaN)).toBe('R$ 0,00');
    expect(formatPrice('invalid')).toBe('R$ 0,00');
    expect(formatPrice(null)).toBe('R$ 0,00');
    expect(formatPrice(undefined)).toBe('R$ 0,00');
  });

  it('should handle different number types', () => {
    expect(formatPrice(100)).toBe('R$\xa0100,00');
    expect(formatPrice(100.0)).toBe('R$\xa0100,00');
    expect(formatPrice(100.5)).toBe('R$\xa0100,50');
  });
});

