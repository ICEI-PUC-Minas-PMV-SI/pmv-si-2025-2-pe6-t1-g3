/**
 * Factory functions for creating test cart data
 */
import { testProduct } from './productFactory';

export const testCart = {
  id: 1,
  userId: 1,
  items: [
    {
      productId: 1,
      CODPROD: 1,
      quantity: 2,
      price: 999.99,
      name: 'Smartphone XYZ',
      product: testProduct,
    },
    {
      productId: 2,
      CODPROD: 2,
      quantity: 1,
      price: 599.99,
      name: 'Tablet ABC',
      product: {
        ...testProduct,
        id: 2,
        CODPROD: 2,
        name: 'Tablet ABC',
        price: 599.99,
      },
    },
  ],
  subtotal: 2599.97,
  shipping: 15.0,
  discount: 0,
  total: 2614.97,
  updatedAt: '2024-01-15T10:30:00Z',
};

export const emptyCart = {
  id: 1,
  userId: 1,
  items: [],
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  updatedAt: '2024-01-15T10:30:00Z',
};

/**
 * Create a custom cart object
 * @param {Object} overrides - Properties to override
 * @returns {Object} Cart object
 */
export const createCart = (overrides = {}) => ({
  ...testCart,
  ...overrides,
});

/**
 * Create an empty cart
 * @param {Object} overrides - Properties to override
 * @returns {Object} Empty cart object
 */
export const createEmptyCart = (overrides = {}) => ({
  ...emptyCart,
  ...overrides,
});

/**
 * Create a cart with a single item
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity of the product
 * @returns {Object} Cart with single item
 */
export const createCartWithItem = (product, quantity = 1) => {
  const item = {
    productId: product.id || product.CODPROD,
    CODPROD: product.id || product.CODPROD,
    quantity,
    price: product.price,
    name: product.name,
    product,
  };

  const subtotal = item.price * quantity;

  return createCart({
    items: [item],
    subtotal,
    total: subtotal,
  });
};

