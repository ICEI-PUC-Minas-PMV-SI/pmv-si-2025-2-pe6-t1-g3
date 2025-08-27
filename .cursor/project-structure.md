# 🏗️ Estrutura do Projeto ZabbixStore

## Visão Geral
ZabbixStore é uma plataforma de e-commerce com arquitetura de sistemas distribuídos, desenvolvida como projeto acadêmico para a disciplina de Arquitetura de Sistemas Distribuídos.

## Estrutura de Diretórios

```
pmv-si-2025-2-pe6-t1-g3/
├── .cursor/                    # Guidelines e regras do projeto
├── docs/                      # Documentação técnica
├── help/                      # Documentação de ajuda
├── infrastructure/            # Código fonte da aplicação
│   ├── frontend/             # Aplicação React + Vite
│   │   ├── src/
│   │   │   ├── components/   # Componentes React
│   │   │   ├── contexts/     # Contextos de estado
│   │   │   ├── hooks/        # Hooks customizados
│   │   │   ├── services/     # Serviços de API
│   │   │   └── assets/       # Recursos estáticos
│   │   ├── Dockerfile        # Container do frontend
│   │   └── package.json      # Dependências do frontend
│   └── backend/              # API NestJS + TypeScript
│       ├── src/
│       │   ├── auth/         # Módulo de autenticação
│       │   ├── produto/      # Módulo de produtos
│       │   ├── pedido/       # Módulo de pedidos
│       │   ├── pessoa/       # Módulo de usuários
│       │   ├── endereco/     # Módulo de endereços
│       │   ├── health/       # Health checks
│       │   └── services/     # Serviços compartilhados
│       ├── prisma/           # Schema e migrations
│       ├── test/             # Testes e2e
│       ├── Dockerfile        # Container do backend
│       └── package.json      # Dependências do backend
├── presentation/             # Materiais de apresentação
├── docker-compose.yml        # Orquestração de containers
├── start-project.sh          # Script de inicialização
└── README.md                 # Documentação principal
```

## Módulos do Backend

### Auth Module
- **Controller**: `AuthController` - Endpoints de autenticação
- **Service**: `AuthService` - Lógica de autenticação e JWT
- **Guard**: `AuthGuard` - Proteção de rotas
- **DTOs**: Login e registro de usuários

### Produto Module
- **Controller**: `ProdutoController` - CRUD de produtos
- **Service**: `ProdutoService` - Lógica de negócio
- **DTOs**: Create/Update com validações completas
- **Features**: Filtros, categorias, estoque

### Pedido Module
- **Controller**: `PedidoController` - Gestão de pedidos
- **Service**: `PedidoService` - Processamento de pedidos
- **Features**: Cálculo de totais, desconto, frete

### Pessoa Module
- **Controller**: `PessoaController` - Gestão de usuários
- **Service**: `PessoaService` - Dados pessoais
- **Features**: Perfis, permissões, dados pessoais

### Endereco Module
- **Controller**: `EnderecoController` - Endereços de entrega
- **Service**: `EnderecoService` - Gestão de endereços
- **Features**: Múltiplos endereços por usuário

## Componentes do Frontend

### Estrutura de Componentes
- **UI/**: Componentes de interface reutilizáveis
- **Product/**: Componentes específicos de produtos
- **Auth/**: Componentes de autenticação
- **Admin/**: Painel administrativo
- **fragments/**: Fragmentos de componentes

### Principais Componentes
- **Dashboard**: Página principal com produtos
- **Header**: Navegação e carrinho
- **ProductDetails**: Detalhes do produto
- **Cart**: Carrinho de compras
- **AdminDashboard**: Painel administrativo
- **Auth**: Login e registro

## Configurações de Ambiente

### Variáveis de Ambiente
- **DATABASE_URL**: Conexão com PostgreSQL
- **JWT_SECRET**: Chave secreta para JWT
- **FRONTEND_URL**: URL do frontend para CORS
- **PORT**: Porta do backend (padrão: 3000)

### Portas dos Serviços
- **Frontend**: 5173 (desenvolvimento) / 80 (produção)
- **Backend**: 3000
- **PostgreSQL**: 9080 (mapeada para 5432)
- **Prisma Studio**: 5555
- **Redis**: 6379 (opcional)

## Scripts de Execução

### Desenvolvimento
```bash
./start-dev.sh          # Ambiente de desenvolvimento
```

### Produção
```bash
./start-project.sh       # Ambiente completo de produção
```

### Comandos Úteis
```bash
# Backend
npm run start:dev        # Desenvolvimento com watch
npm run test            # Executar testes
npm run seed            # Executar seeds

# Frontend
npm run dev             # Desenvolvimento com Vite
npm run build           # Build de produção
npm run lint            # Linting
```

## Padrões de Nomenclatura

### Banco de Dados
- **Tabelas**: Maiúsculas (`PRODUTO`, `PEDIDOS`, `PESSOA`)
- **Campos**: Maiúsculas (`CODPROD`, `DESCRICAO`, `VALOR`)
- **Relacionamentos**: Via `@relation` no Prisma

### Código
- **Classes**: PascalCase (`ProductService`, `AuthController`)
- **Variáveis**: camelCase (`productName`, `userEmail`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Arquivos**: kebab-case ou PascalCase para componentes

## Tecnologias Utilizadas

### Backend
- **Framework**: NestJS + TypeScript
- **ORM**: Prisma + PostgreSQL
- **Autenticação**: JWT + bcrypt
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS + Material Tailwind
- **Routing**: React Router DOM
- **State**: Context API + Hooks
- **HTTP**: Axios

### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **Banco**: PostgreSQL 15 (Alpine)
- **Cache**: Redis 7 (Alpine)
- **Proxy**: Nginx (produção)
