/**
 * Formata um número para moeda brasileira (R$)
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como R$
 */
export const formatPrice = (value) => {
  const roundedValue = Number(value.toFixed(2));
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(roundedValue);
};
