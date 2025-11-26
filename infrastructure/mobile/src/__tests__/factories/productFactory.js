/**
 * Factory functions for creating test product data
 */

export const testProduct = {
  id: 1,
  CODPROD: 1,
  PRODUTO: 'Smartphone XYZ Pro',
  name: 'Smartphone XYZ Pro', // Keep for backward compatibility
  description:
    'Smartphone com tela de 6.1 polegadas, câmera tripla e processador de última geração',
  VALOR: 1299.99,
  price: 1299.99, // Keep for backward compatibility
  originalPrice: 1499.99,
  ESTOQUE: 25,
  stock: 25, // Keep for backward compatibility
  CATEGORIAS: { CATEGORIA: 'ELETRÔNICOS' },
  category: 'Eletrônicos', // Keep for backward compatibility
  subcategory: 'Smartphones',
  images: [
    'https://example.com/product1-front.jpg',
    'https://example.com/product1-back.jpg',
    'https://example.com/product1-side.jpg',
  ],
  specifications: {
    Tela: '6.1 polegadas',
    Processador: 'Snapdragon 888',
    Memória: '8GB RAM',
    Armazenamento: '128GB',
    Câmera: 'Tripla 48MP',
  },
  reviews: [
    {
      id: 1,
      user: 'Maria Santos',
      rating: 5,
      comment: 'Excelente produto, recomendo!',
      date: '2024-01-15',
    },
  ],
  isActive: true,
  supplierId: 2,
};

export const outOfStockProduct = {
  ...testProduct,
  id: 2,
  CODPROD: 2,
  PRODUTO: 'Produto Esgotado',
  name: 'Produto Esgotado',
  ESTOQUE: 0,
  stock: 0,
  isActive: false,
};

/**
 * Create a custom product object
 * @param {Object} overrides - Properties to override
 * @returns {Object} Product object
 */
export const createProduct = (overrides = {}) => ({
  ...testProduct,
  ...overrides,
});

/**
 * Create a list of products
 * @param {number} count - Number of products to create
 * @param {Object} overrides - Properties to override for all products
 * @returns {Array} Array of product objects
 */
export const createProductList = (count = 5, overrides = {}) => {
  return Array.from({ length: count }, (_, index) =>
    createProduct({
      id: index + 1,
      CODPROD: index + 1,
      PRODUTO: `Produto ${index + 1}`,
      name: `Produto ${index + 1}`,
      VALOR: 100 + index * 10,
      ESTOQUE: 10,
      CATEGORIAS: { CATEGORIA: 'ELETRÔNICOS' },
      IMAGEM: `https://example.com/product${index + 1}.jpg`,
      ...overrides,
    })
  );
};

/**
 * Create a product with discount
 * @param {number} discountPercent - Discount percentage
 * @returns {Object} Product with discount
 */
export const createProductWithDiscount = (discountPercent = 20) => {
  const originalPrice = testProduct.price;
  const discount = (originalPrice * discountPercent) / 100;
  const discountedPrice = originalPrice - discount;

  return createProduct({
    originalPrice,
    price: discountedPrice,
  });
};

