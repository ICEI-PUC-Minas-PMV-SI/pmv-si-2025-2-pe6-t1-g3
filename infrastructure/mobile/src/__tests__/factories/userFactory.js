/**
 * Factory functions for creating test user data
 */

export const testClient = {
  id: 1,
  CODPES: 1,
  name: 'João Silva',
  email: 'joao.silva@teste.com',
  password: 'senha123456',
  phone: '(11) 99999-9999',
  cpf: '123.456.789-00',
  role: 'CLIENT',
  addresses: [
    {
      id: 1,
      CODEND: 1,
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      isDefault: true,
    },
  ],
};

export const testSupplier = {
  id: 2,
  CODPES: 2,
  name: 'TechStore Ltda',
  email: 'contato@techstore.com',
  password: 'senha123456',
  phone: '(11) 88888-8888',
  cnpj: '12.345.678/0001-90',
  businessName: 'TechStore Tecnologia',
  role: 'SUPPLIER',
  products: [
    {
      id: 1,
      name: 'Smartphone XYZ',
      price: 999.99,
      stock: 50,
      category: 'Eletrônicos',
    },
  ],
};

export const testAdmin = {
  id: 3,
  CODPES: 3,
  name: 'Admin Sistema',
  email: 'admin@zabbixstore.com',
  password: 'admin123456',
  role: 'ADMIN',
  permissions: ['ALL'],
};

/**
 * Create a custom user object
 * @param {Object} overrides - Properties to override
 * @returns {Object} User object
 */
export const createUser = (overrides = {}) => ({
  ...testClient,
  ...overrides,
});

/**
 * Create a user without authentication
 * @returns {Object} Unauthenticated user state
 */
export const createUnauthenticatedUser = () => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
});

/**
 * Create an authenticated user state
 * @param {Object} user - User data
 * @returns {Object} Authenticated user state
 */
export const createAuthenticatedUser = (user = testClient) => ({
  user,
  isAuthenticated: true,
  isLoading: false,
});

