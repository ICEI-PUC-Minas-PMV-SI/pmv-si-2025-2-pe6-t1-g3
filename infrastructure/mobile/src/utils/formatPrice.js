/**
 * Format a number as Brazilian Real currency
 * @param {number} price - The price to format
 * @returns {string} Formatted price string (e.g., "R$ 99,99")
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export default formatPrice;

