/**
 * Formata um número para moeda brasileira (R$)
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como R$
 */
export const formatPrice = (value) => {
  const roundedValue = Number.parseFloat(value); 

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2
  }).format(roundedValue);
};
