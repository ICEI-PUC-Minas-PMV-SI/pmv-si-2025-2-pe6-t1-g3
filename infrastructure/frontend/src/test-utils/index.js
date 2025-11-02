import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';

// Wrapper customizado para testes que precisam de contextos
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Função customizada de render que inclui todos os providers
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-exportar tudo
export * from '@testing-library/react';
export { customRender as render };

// Mock de dados de teste
// Mantidos para compatibilidade com testes existentes
export const mockUser = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@teste.com",
  password: "senha123456",
  phone: "(11) 99999-9999",
  cpf: "123.456.789-00",
  role: "CLIENT",
  addresses: [
    {
      id: 1,
      street: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      isDefault: true
    }
  ]
};

export const mockSupplier = {
  id: 2,
  name: "TechStore Ltda",
  email: "contato@techstore.com",
  password: "senha123456",
  phone: "(11) 88888-8888",
  cnpj: "12.345.678/0001-90",
  businessName: "TechStore Tecnologia",
  role: "SUPPLIER",
  products: [
    {
      id: 1,
      name: "Smartphone XYZ",
      price: 999.99,
      stock: 50,
      category: "Eletrônicos"
    }
  ]
};

export const mockAdmin = {
  id: 3,
  name: "Admin Sistema",
  email: "admin@zabbixstore.com",
  password: "admin123456",
  role: "ADMIN",
  permissions: ["ALL"]
};

export const mockProduct = {
  id: 1,
  name: "Smartphone XYZ Pro",
  description: "Smartphone com tela de 6.1 polegadas, câmera tripla e processador de última geração",
  price: 1299.99,
  originalPrice: 1499.99,
  stock: 25,
  category: "Eletrônicos",
  subcategory: "Smartphones",
  images: [
    "https://example.com/product1-front.jpg",
    "https://example.com/product1-back.jpg",
    "https://example.com/product1-side.jpg"
  ],
  specifications: {
    "Tela": "6.1 polegadas",
    "Processador": "Snapdragon 888",
    "Memória": "8GB RAM",
    "Armazenamento": "128GB",
    "Câmera": "Tripla 48MP"
  },
  reviews: [
    {
      id: 1,
      user: "Maria Santos",
      rating: 5,
      comment: "Excelente produto, recomendo!",
      date: "2024-01-15"
    }
  ],
  isActive: true,
  supplierId: 2
};

export const mockCart = {
  id: 1,
  userId: 1,
  items: [
    {
      productId: 1,
      quantity: 2,
      price: 999.99,
      name: "Smartphone XYZ"
    },
    {
      productId: 2,
      quantity: 1,
      price: 599.99,
      name: "Tablet ABC"
    }
  ],
  subtotal: 2599.97,
  shipping: 15.00,
  discount: 0,
  total: 2614.97,
  updatedAt: "2024-01-15T10:30:00Z"
};

// Dados de teste conforme documentação (frontend-web.md)
// Cliente de Teste conforme documentação
export const testClient = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@teste.com",
  password: "senha123456",
  phone: "(11) 99999-9999",
  cpf: "123.456.789-00",
  addresses: [
    {
      id: 1,
      street: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      isDefault: true
    }
  ]
};

// Fornecedor de Teste conforme documentação
export const testSupplier = {
  id: 2,
  name: "TechStore Ltda",
  email: "contato@techstore.com",
  password: "senha123456",
  phone: "(11) 88888-8888",
  cnpj: "12.345.678/0001-90",
  businessName: "TechStore Tecnologia",
  products: [
    {
      id: 1,
      name: "Smartphone XYZ",
      price: 999.99,
      stock: 50,
      category: "Eletrônicos"
    }
  ]
};

// Admin de Teste conforme documentação
export const testAdmin = {
  id: 3,
  name: "Admin Sistema",
  email: "admin@zabbixstore.com",
  password: "admin123456",
  role: "ADMIN",
  permissions: ["ALL"]
};

// Produto Completo conforme documentação
export const testProduct = {
  id: 1,
  name: "Smartphone XYZ Pro",
  description: "Smartphone com tela de 6.1 polegadas, câmera tripla e processador de última geração",
  price: 1299.99,
  originalPrice: 1499.99,
  stock: 25,
  category: "Eletrônicos",
  subcategory: "Smartphones",
  images: [
    "https://example.com/product1-front.jpg",
    "https://example.com/product1-back.jpg",
    "https://example.com/product1-side.jpg"
  ],
  specifications: {
    "Tela": "6.1 polegadas",
    "Processador": "Snapdragon 888",
    "Memória": "8GB RAM",
    "Armazenamento": "128GB",
    "Câmera": "Tripla 48MP"
  },
  reviews: [
    {
      id: 1,
      user: "Maria Santos",
      rating: 5,
      comment: "Excelente produto, recomendo!",
      date: "2024-01-15"
    }
  ],
  isActive: true,
  supplierId: 2
};

// Produto Sem Estoque conforme documentação
export const outOfStockProduct = {
  ...testProduct,
  id: 2,
  name: "Produto Esgotado",
  stock: 0,
  isActive: false
};

// Carrinho com Itens conforme documentação
export const testCart = {
  id: 1,
  userId: 1,
  items: [
    {
      productId: 1,
      quantity: 2,
      price: 1299.99,
      total: 2599.98
    },
    {
      productId: 2,
      quantity: 1,
      price: 299.99,
      total: 299.99
    }
  ],
  subtotal: 2899.97,
  shipping: 15.00,
  total: 2914.97,
  coupon: null
};

// Carrinho Vazio conforme documentação
export const emptyCart = {
  id: 1,
  userId: 1,
  items: [],
  subtotal: 0,
  shipping: 0,
  total: 0,
  coupon: null
};

// Pedido Completo conforme documentação
export const testOrder = {
  id: 1,
  userId: 1,
  status: "PENDENTE",
  items: [
    {
      productId: 1,
      quantity: 2,
      price: 1299.99,
      total: 2599.98
    }
  ],
  subtotal: 2599.98,
  shipping: 15.00,
  total: 2614.98,
  shippingAddress: {
    street: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567"
  },
  paymentMethod: "CREDIT_CARD",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
};

// Funções helper para testes
export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides
});

export const createMockProduct = (overrides = {}) => ({
  ...mockProduct,
  ...overrides
});

export const createMockCart = (overrides = {}) => ({
  ...mockCart,
  ...overrides
});

// Funções helper para novos dados de teste conforme documentação
export const createTestClient = (overrides = {}) => ({
  ...testClient,
  ...overrides
});

export const createTestSupplier = (overrides = {}) => ({
  ...testSupplier,
  ...overrides
});

export const createTestAdmin = (overrides = {}) => ({
  ...testAdmin,
  ...overrides
});

export const createTestProduct = (overrides = {}) => ({
  ...testProduct,
  ...overrides
});

export const createOutOfStockProduct = (overrides = {}) => ({
  ...outOfStockProduct,
  ...overrides
});

export const createTestCart = (overrides = {}) => ({
  ...testCart,
  ...overrides
});

export const createEmptyCart = (overrides = {}) => ({
  ...emptyCart,
  ...overrides
});

export const createTestOrder = (overrides = {}) => ({
  ...testOrder,
  ...overrides
});

// Mock de localStorage para testes
export const mockLocalStorage = () => {
  const store = {};
  
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};

// Mock de window.matchMedia para testes de responsividade
export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Helper para simular diferentes tamanhos de tela
export const mockScreenSize = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  // Disparar evento de resize
  window.dispatchEvent(new Event('resize'));
};

// Constantes para breakpoints
export const BREAKPOINTS = {
  MOBILE: 320,
  TABLET: 768,
  DESKTOP: 1024
};
