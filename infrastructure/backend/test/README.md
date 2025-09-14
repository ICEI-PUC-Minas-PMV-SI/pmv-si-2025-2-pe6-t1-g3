# Testes Automatizados - ZabbixStore Backend

Este diretório contém todos os testes automatizados para o backend do ZabbixStore, organizados seguindo a pirâmide de testes.

## Estrutura dos Testes

### 1. Testes Unitários
- **Localização**: `test/unit/**/*.spec.ts`
- **Objetivo**: Testar funções e métodos individuais isoladamente
- **Cobertura**: Serviços e controladores

## Como Executar os Testes

### Executar Todos os Testes
```bash
npm run test:all
```

### Executar Testes Unitários
```bash
npm run test:unit
```

### Executar Testes com Cobertura
```bash
npm run test:cov
```

### Executar Testes em Modo Watch
```bash
npm run test:watch
```

## Estrutura dos Arquivos de Teste

### Testes Unitários
```
test/
├── unit/
│   ├── auth.service.spec.ts
│   ├── auth.controller.spec.ts
│   ├── pessoa.service.spec.ts
│   ├── produto.service.spec.ts
│   ├── pedido.service.spec.ts
│   └── endereco.service.spec.ts
├── utils/
│   └── test-utils.ts
└── README.md
```

## Padrões de Teste

### Estrutura AAA (Arrange, Act, Assert)
```typescript
describe('Service Method', () => {
  it('should do something when condition is met', async () => {
    // Arrange - Preparar dados
    const input = { id: 1, name: 'Test' };
    mockService.method.mockResolvedValue(expectedResult);

    // Act - Executar ação
    const result = await service.method(input);

    // Assert - Verificar resultado
    expect(result).toEqual(expectedResult);
    expect(mockService.method).toHaveBeenCalledWith(input);
  });
});
```

### Nomenclatura de Testes
- **Descritiva**: `should return user data when valid credentials are provided`
- **Específica**: `should throw NOT_FOUND when user is not found`
- **Contextual**: `should update product successfully with valid data`

## Cobertura de Testes

### Métricas Alvo
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Relatórios
- **HTML**: `coverage/index.html`
- **LCOV**: `coverage/lcov.info`
- **Terminal**: Output durante execução

## Boas Práticas

### 1. Isolamento
- Cada teste deve ser independente
- Limpar mocks entre testes
- Usar `beforeEach` e `afterEach` adequadamente

### 2. Dados de Teste
- Usar factories para criar dados
- Manter dados consistentes
- Evitar dados hardcoded

### 3. Assertions
- Uma assertion principal por teste
- Mensagens descritivas
- Verificar comportamento, não implementação

### 4. Mocks
- Mock apenas dependências externas
- Verificar chamadas de métodos mockados
- Usar dados realistas nos mocks

## Troubleshooting

### Problemas Comuns

1. **Timeout em Testes**
   - Aumentar `testTimeout` na configuração
   - Verificar se os mocks estão corretos

2. **Mocks Não Funcionando**
   - Verificar se o mock está sendo aplicado antes da importação
   - Usar `jest.clearAllMocks()` no `beforeEach`

3. **Cobertura Baixa**
   - Verificar se todos os branches estão sendo testados
   - Adicionar testes para casos de erro

### Debug
```bash
# Executar teste específico
npm run test:unit -- --testNamePattern="should login successfully"

# Executar com debug
npm run test:debug

# Executar com verbose
npm run test:unit -- --verbose
```

## Contribuição

### Adicionando Novos Testes
1. Seguir a estrutura AAA
2. Usar nomenclatura descritiva
3. Adicionar casos de erro
4. Manter cobertura alta
5. Documentar casos especiais

### Revisão de Testes
- Verificar se todos os cenários estão cobertos
- Validar se os mocks estão corretos
- Confirmar se as assertions são adequadas
- Verificar se os testes são determinísticos