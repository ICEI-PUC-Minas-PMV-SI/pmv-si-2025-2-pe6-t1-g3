import { PrismaService } from '../../src/services/prisma.service';

export const createMockPrismaService = () => ({
  login: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  pessoa: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  produtos: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  categorias: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  pedido: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  itensPedido: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  endereco: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

export const mockUser = {
  CODUSU: 1,
  EMAIL: 'test@example.com',
  SENHA: '$2a$12$hashedpassword',
  PERMISSAO: 'CLIENTE',
  PESSOA: {
    CODPES: 1,
    NOME: 'João',
    SOBRENOME: 'Silva',
    CPF: '12345678900',
    TELEFONE: '11987654321',
    CODUSU: 1,
  },
};

export const mockProduct = {
  CODPROD: 1,
  PRODUTO: 'Camiseta',
  DESCRICAO: 'Camiseta de algodão',
  IMAGEM: 'image.jpg',
  ESTOQUE: 10,
  VALOR: 29.99,
  DESCONTO: 0,
  CODCAT: 1,
  CATEGORIAS: {
    CODCAT: 1,
    CATEGORIA: 'MASCULINO',
  },
};

export const mockCategory = {
  CODCAT: 1,
  CATEGORIA: 'MASCULINO',
};

export const mockAddress = {
  CODEND: 1,
  CODPES: 1,
  DESCRICAO: 'Casa',
  RUA: 'Rua das Flores',
  NUMERO: '123',
  COMPLEMENTO: 'Apto 42',
  BAIRRO: 'Centro',
  CIDADE: 'São Paulo',
  CEP: '12345678',
};

export const mockOrder = {
  CODPED: 1,
  CODPES: 1,
  CODEND: 1,
  SUBTOTAL: 59.98,
  DESCONTO: 0,
  FRETE: 10.00,
  VALORTOTAL: 69.98,
  ITENSPEDIDO: [
    {
      CODPED: 1,
      CODPROD: 1,
      TAMANHO: 'M',
      QTD: 2,
    },
  ],
  ENDERECO: mockAddress,
};