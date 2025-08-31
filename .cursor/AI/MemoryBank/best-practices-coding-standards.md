# Best Practices - Coding Standards

## Padrões de Código

### Frontend (React + Vite)

#### Estrutura de Arquivos
- **Organização**: `/components`, `/pages`, `/hooks`, `/services`, `/contexts`, `/assets`
- **Componentes**: `PascalCase` para arquivos de componentes (`Header.jsx`, `ProductDetails.jsx`)
- **Helpers**: `camelCase` para utilitários e hooks customizados
- **Contextos**: `/contexts` para gerenciamento de estado global

#### Tecnologias e Bibliotecas
- **Framework**: React 18 com Hooks
- **Build Tool**: Vite para desenvolvimento e build
- **Styling**: TailwindCSS + Material Tailwind + Headless UI
- **Icons**: FontAwesome + Heroicons + React Icons
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios para requisições
- **Notifications**: React Toastify
- **Loading**: React Spinners

#### Padrões de Código
- **Hooks**: Preferir Hooks funcionais em vez de classes
- **Props**: Destructuring de props
- **State**: useState e useContext para gerenciamento de estado
- **Effects**: useEffect para side effects
- **Components**: Componentes funcionais com arrow functions

#### ESLint Configuração
```javascript
// .eslintrc.cjs
extends: [
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:react/jsx-runtime',
  'plugin:react-hooks/recommended',
]
```

### Backend (NestJS + TypeScript)

#### Estrutura de Arquivos
- **Módulos**: Organização por domínio (`auth/`, `produto/`, `pedido/`, `pessoa/`)
- **Arquitetura**: Controllers, Services, DTOs separados
- **Nomenclatura**: `camelCase` para variáveis/métodos, `PascalCase` para classes
- **DTOs**: Pasta `dto/` em cada módulo

#### Tecnologias e Dependências
- **Framework**: NestJS com TypeScript
- **ORM**: Prisma Client
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI
- **Autenticação**: JWT + bcrypt
- **Segurança**: Helmet + CORS + Rate Limiting

#### Padrões de Código
- **Decorators**: Uso extensivo de decorators NestJS
- **Dependency Injection**: Injeção de dependências via constructor
- **Async/Await**: Preferir async/await em vez de Promises
- **Error Handling**: Exception filters globais
- **Logging**: Logger centralizado

#### ESLint e Prettier
```javascript
// .eslintrc.js
extends: [
  'plugin:@typescript-eslint/recommended',
  'plugin:prettier/recommended',
]

// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

## Testes

### Framework e Configuração
- **Framework**: Jest para testes unitários e e2e
- **Coverage**: Mínimo 80% de cobertura
- **Estrutura**: Arquivos `.spec.ts` junto aos arquivos testados
- **E2E**: Supertest para testes de integração

### Padrões de Teste
- **Describe**: Agrupamento lógico de testes
- **It/Test**: Descrições claras e específicas
- **Setup/Teardown**: beforeEach/afterEach para limpeza
- **Mocks**: Mocking de dependências externas
- **Assertions**: Expectativas claras e específicas

## Convenções Gerais

### Nomenclatura
- **Variáveis**: `camelCase` (ex: `productName`, `userEmail`)
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `API_BASE_URL`)
- **Classes**: `PascalCase` (ex: `ProductService`, `AuthController`)
- **Interfaces**: `PascalCase` com prefixo `I` opcional (ex: `IProduct`, `UserDto`)

### Comentários
- **JSDoc**: Para funções e classes públicas
- **Inline**: Apenas para lógica complexa
- **TODO**: Marcar tarefas pendentes
- **FIXME**: Marcar problemas conhecidos

### Git Commits
- **Conventional Commits**: `type(scope): description`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Scope**: Módulo afetado (ex: `auth`, `product`)
- **Description**: Descrição clara e concisa

## Data de Criação
27/01/2025

## Última Atualização
27/01/2025
