module.exports = {
  // Usar ts-jest para melhor compatibilidade com TypeScript e NestJS
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'test',
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    '../src/**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../src/$1',
  },
  setupFilesAfterEnv: [],
  testTimeout: 10000,
  // Configurações específicas para ts-jest (nova sintaxe)
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: {
        // Usar configuração específica para testes
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    }],
  },
  // Extensões de arquivo que o Jest deve processar
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Configurações de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
