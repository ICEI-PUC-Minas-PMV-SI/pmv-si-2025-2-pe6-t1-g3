/**
 * Factory functions for creating test order data
 */
import { testProduct } from './productFactory';

export const testOrder = {
  id: 1,
  CODPED: 1,
  userId: 1,
  CODPES: 1,
  items: [
    {
      productId: 1,
      CODPROD: 1,
      quantity: 2,
      price: 999.99,
      name: 'Smartphone XYZ',
      product: testProduct,
    },
  ],
  subtotal: 1999.98,
  shipping: 15.0,
  discount: 0,
  total: 2014.98,
  status: 'pending',
  shippingAddress: {
    street: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
  },
  paymentMethod: 'credit_card',
  createdAt: '2024-01-15T10:30:00Z',
};

/**
 * Create a custom order object
 * @param {Object} overrides - Properties to override
 * @returns {Object} Order object
 */
export const createOrder = (overrides = {}) => ({
  ...testOrder,
  ...overrides,
});

/**
 * Create an order with specific status
 * @param {string} status - Order status
 * @returns {Object} Order with status
 */
export const createOrderWithStatus = (status) => {
  return createOrder({ status });
};

/**
 * Create a list of orders
 * @param {number} count - Number of orders to create
 * @param {Object} overrides - Properties to override for all orders
 * @returns {Array} Array of order objects
 */
export const createOrderList = (count = 5, overrides = {}) => {
  return Array.from({ length: count }, (_, index) =>
    createOrder({
      id: index + 1,
      CODPED: index + 1,
      status: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'][
        index % 5
      ],
      ...overrides,
    })
  );
};

