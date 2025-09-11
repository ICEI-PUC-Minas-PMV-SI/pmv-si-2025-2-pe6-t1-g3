/**
 * Formata um número para moeda brasileira (R$)
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} - Valor formatado como R$
 */
export const formatPrice = (value) => {
  const numberValue = Number(value) || 0;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(numberValue.toFixed(2)));
};
