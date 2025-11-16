/**
 * Mapeamento de categorias do frontend para o backend
 * Converte nomes/slugs exibidos no frontend para valores esperados pela API
 */

// Mapeamento de nome exibido para valor do backend
// Valores devem corresponder exatamente ao que está no banco de dados
export const CATEGORY_NAME_TO_BACKEND = {
  'Eletrônicos': 'ELETRÔNICOS',
  'Eletronicos': 'ELETRÔNICOS',
  'Fashion': 'FASHION',
  'Casa': 'CASA',
  'Esportes': 'ESPORTES',
};

// Mapeamento de slug para valor do backend
export const CATEGORY_SLUG_TO_BACKEND = {
  'eletronicos': 'ELETRÔNICOS',
  'fashion': 'FASHION',
  'casa': 'CASA',
  'esportes': 'ESPORTES',
};

// Mapeamento reverso: valor do backend para nome exibido
export const BACKEND_TO_CATEGORY_NAME = {
  'ELETRÔNICOS': 'Eletrônicos',
  'FASHION': 'Fashion',
  'CASA': 'Casa',
  'ESPORTES': 'Esportes',
};

/**
 * Converte nome ou slug de categoria para valor do backend
 * @param {string} categoryNameOrSlug - Nome ou slug da categoria
 * @returns {string|null} - Valor do backend ou null se não encontrado
 */
export const mapCategoryToBackend = (categoryNameOrSlug) => {
  if (!categoryNameOrSlug) return null;
  
  const normalized = String(categoryNameOrSlug).trim();
  
  // Tenta primeiro pelo nome exibido
  if (CATEGORY_NAME_TO_BACKEND[normalized]) {
    return CATEGORY_NAME_TO_BACKEND[normalized];
  }
  
  // Tenta pelo slug (lowercase)
  const slugLower = normalized.toLowerCase();
  if (CATEGORY_SLUG_TO_BACKEND[slugLower]) {
    return CATEGORY_SLUG_TO_BACKEND[slugLower];
  }
  
  // Se já estiver no formato do backend, retorna como está
  if (Object.values(CATEGORY_NAME_TO_BACKEND).includes(normalized.toUpperCase())) {
    return normalized.toUpperCase();
  }
  
  return null;
};

/**
 * Converte valor do backend para nome exibido
 * @param {string} backendValue - Valor da categoria no backend
 * @returns {string|null} - Nome exibido ou null se não encontrado
 */
export const mapBackendToCategoryName = (backendValue) => {
  if (!backendValue) return null;
  
  const normalized = String(backendValue).toUpperCase();
  return BACKEND_TO_CATEGORY_NAME[normalized] || null;
};

