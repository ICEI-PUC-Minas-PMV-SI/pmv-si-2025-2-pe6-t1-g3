# Testing Guidelines

## Princípios Gerais

### 1. Pirâmide de Testes
- **Testes Unitários**: 70% da cobertura
- **Testes de Integração**: 20% da cobertura
- **Testes E2E**: 10% da cobertura

### 2. Padrões de Nomenclatura
```
[componente/arquivo].test.[extensão]
[componente/arquivo].spec.[extensão]
```

### 3. Estrutura AAA (Arrange, Act, Assert)
```javascript
// Arrange - Preparar dados
const user = { id: 1, name: 'John' };

// Act - Executar ação
const result = createUser(user);

// Assert - Verificar resultado
expect(result).toBeDefined();
```

## Testes Unitários

### Frontend (React)
```javascript
// Exemplo de teste de componente
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('should render product information correctly', () => {
    const product = {
      id: 1,
      name: 'Test Product',
      price: 99.99
    };

    render(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('R$ 99,99')).toBeInTheDocument();
  });

  it('should call onAddToCart when button is clicked', async () => {
    const mockOnAddToCart = jest.fn();
    const product = { id: 1, name: 'Test Product' };

    render(<ProductCard product={product} onAddToCart={mockOnAddToCart} />);

    const button = screen.getByRole('button', { name: /adicionar/i });
    await userEvent.click(button);

    expect(mockOnAddToCart).toHaveBeenCalledWith(product);
  });
});
```

### Backend (NestJS)
```typescript
// Exemplo de teste de serviço
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return all products', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ];

    jest.spyOn(prisma.product, 'findMany').mockResolvedValue(mockProducts);

    const result = await service.findAll();

    expect(result).toEqual(mockProducts);
    expect(prisma.product.findMany).toHaveBeenCalled();
  });
});
```

## Testes de Integração

### API Endpoints
```typescript
// Exemplo de teste de endpoint
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/products (POST)', () => {
    const product = {
      name: 'Test Product',
      price: 99.99,
      description: 'Test description',
    };

    return request(app.getHttpServer())
      .post('/products')
      .send(product)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe(product.name);
        expect(res.body.price).toBe(product.price);
      });
  });
});
```

## Testes E2E

### Cypress (Frontend)
```javascript
// Exemplo de teste E2E
describe('Product Flow', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should add product to cart', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click();
    });

    cy.get('[data-testid="cart-count"]').should('contain', '1');
    cy.get('[data-testid="cart-items"]').should('have.length', 1);
  });

  it('should complete checkout process', () => {
    // Adicionar produto ao carrinho
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click();
    });

    // Ir para o carrinho
    cy.get('[data-testid="cart-icon"]').click();

    // Preencher formulário de checkout
    cy.get('[data-testid="checkout-form"]').within(() => {
      cy.get('[name="name"]').type('John Doe');
      cy.get('[name="email"]').type('john@example.com');
      cy.get('[name="address"]').type('123 Main St');
      cy.get('[type="submit"]').click();
    });

    // Verificar confirmação
    cy.get('[data-testid="order-confirmation"]').should('be.visible');
  });
});
```

## Mocks e Stubs

### Mock de APIs
```javascript
// Mock de API externa
const mockApiResponse = {
  products: [
    { id: 1, name: 'Mock Product' }
  ]
};

jest.mock('../services/api', () => ({
  fetchProducts: jest.fn().mockResolvedValue(mockApiResponse)
}));
```

### Mock de Banco de Dados
```typescript
// Mock do Prisma
const mockPrisma = {
  product: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};
```

## Cobertura de Testes

### Configuração Jest
```json
{
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/serviceWorker.ts"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

### Relatórios de Cobertura
- Gerar relatório HTML: `npm run test:coverage`
- Integrar com CI/CD
- Manter histórico de cobertura

## Testes de Performance

### Frontend
```javascript
// Teste de performance de componente
import { render } from '@testing-library/react';
import { ProductList } from './ProductList';

test('should render 100 products in less than 100ms', () => {
  const products = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Product ${i}`,
    price: Math.random() * 100
  }));

  const startTime = performance.now();
  render(<ProductList products={products} />);
  const endTime = performance.now();

  expect(endTime - startTime).toBeLessThan(100);
});
```

### Backend
```typescript
// Teste de performance de endpoint
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Performance Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should respond within 200ms', async () => {
    const startTime = Date.now();
    
    await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(200);
  });
});
```

## Boas Práticas

### 1. Isolamento
- Cada teste deve ser independente
- Limpar estado entre testes
- Usar beforeEach/afterEach adequadamente

### 2. Dados de Teste
- Usar factories para criar dados
- Manter dados de teste consistentes
- Evitar dados hardcoded

### 3. Assertions
- Uma assertion por teste
- Mensagens descritivas
- Verificar comportamento, não implementação

### 4. Organização
- Agrupar testes relacionados
- Usar describe blocks aninhados
- Nomes descritivos para testes

### 5. Manutenção
- Atualizar testes quando código muda
- Remover testes obsoletos
- Refatorar testes complexos
