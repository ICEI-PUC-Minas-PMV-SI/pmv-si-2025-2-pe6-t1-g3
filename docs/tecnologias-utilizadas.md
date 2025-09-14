# Tecnologias Utilizadas - Backend API

## Arquitetura da API

A API foi desenvolvida utilizando o framework **NestJS**, seguindo os princípios de uma arquitetura REST robusta e escalável. O sistema adota os padrões de design do NestJS, incluindo:

- **Arquitetura Modular**: Organização em módulos especializados para cada domínio
- **Dependency Injection**: Gerenciamento automático de dependências
- **Decorators**: Uso de decorators para definição de rotas, guards e validações
- **Middleware Pipeline**: Pipeline de processamento com guards, pipes e interceptors

### Tecnologias Principais

- **NestJS 10.x**: Framework principal baseado em TypeScript
- **TypeScript**: Linguagem de programação com tipagem estática
- **Prisma**: ORM para gerenciamento do banco de dados
- **Express**: Servidor HTTP subjacente
- **JWT**: Autenticação baseada em tokens JSON Web Token
- **Swagger/OpenAPI**: Documentação automatizada da API

## Planejamento das Rotas

### Recursos da Aplicação

A API gerencia os seguintes recursos principais:

#### 1. Autenticação (`/auth`)
- **POST** `/auth/login` - Login de usuário
- **POST** `/auth/registro` - Registro de novo usuário
- **POST** `/auth/change-password` - Alteração de senha (autenticado)
- **POST** `/auth/validate-token` - Validação de token JWT (autenticado)

#### 2. Produtos (`/produto`)
- **POST** `/produto/cadastrar` - Cadastrar produto (Admin apenas)
- **PUT** `/produto/atualizar` - Atualizar produto (Admin apenas)
- **DELETE** `/produto/remover` - Remover produto (Admin apenas)
- **GET** `/produto/buscar` - Buscar produto por ID (público)
- **GET** `/produto/listar` - Listar produtos com filtro opcional (público)

#### 3. Pedidos (`/pedido`)
- **POST** `/pedido/cadastrar` - Criar novo pedido (autenticado)
- **PATCH** `/pedido/atualizar` - Atualizar pedido (autenticado)
- **DELETE** `/pedido/deletar` - Remover pedido (autenticado)
- **GET** `/pedido/buscar` - Buscar pedido específico (autenticado)
- **GET** `/pedido/listar` - Listar pedidos (autenticado)

#### 4. Pessoas/Usuários (`/pessoa`)
- **POST** `/pessoa/atualizar` - Atualizar dados do usuário (autenticado)
- **GET** `/pessoa/buscar` - Buscar dados do usuário (autenticado)

#### 5. Endereços (`/endereco`)
- **POST** `/endereco/cadastrar` - Cadastrar novo endereço (autenticado)
- **PATCH** `/endereco/atualizar` - Atualizar endereço (autenticado)
- **DELETE** `/endereco/deletar` - Remover endereço (autenticado)

#### 6. Health Check (`/health`, `/`)
- **GET** `/health` - Verificação de saúde da API (público)
- **GET** `/` - Endpoint raiz com informações básicas (público)

## Especificações Técnicas

### Status Codes Utilizados

- **200 OK**: Operação realizada com sucesso
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Dados de entrada inválidos
- **401 Unauthorized**: Token não fornecido ou inválido
- **403 Forbidden**: Permissões insuficientes
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

### Payloads e Validações

A API utiliza **class-validator** e **class-transformer** para validação automática dos dados de entrada através de DTOs (Data Transfer Objects). As validações incluem:

- Validação de tipos de dados
- Validação de campos obrigatórios
- Sanitização de dados de entrada
- Transformação automática de tipos

### Segurança

- **JWT Authentication**: Tokens JWT para autenticação
- **Role-Based Access Control (RBAC)**: Controle de acesso baseado em funções
- **Helmet**: Headers de segurança HTTP
- **CORS**: Configuração de Cross-Origin Resource Sharing
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Validation Pipes**: Sanitização e validação de entrada

### Documentação

- **Swagger UI**: Interface interativa disponível em `/api`
- **OpenAPI 3.0**: Especificação completa da API
- **JWT Bearer Authentication**: Suporte à autenticação na documentação

### Configuração CORS

A API está configurada para aceitar requisições do frontend em `http://localhost:5173` (padrão Vite) ou através da variável de ambiente `FRONTEND_URL`.

### Middlewares e Guards

- **AuthGuard**: Verificação de autenticação JWT
- **RolesGuard**: Verificação de permissões por função
- **ValidationPipe**: Validação global de entrada
- **Global Exception Filter**: Tratamento padronizado de erros