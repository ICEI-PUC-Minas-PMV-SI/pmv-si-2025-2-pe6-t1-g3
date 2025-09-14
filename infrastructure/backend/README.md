# ZabbixStore API

## Descrição

API REST para a loja virtual ZabbixStore, construída com NestJS.

## Instalação

```bash
$ npm install
```

## Executando a aplicação

```bash
# desenvolvimento
$ npm run start

# modo watch
$ npm run start:dev

# produção
$ npm run start:prod
```

## Documentação da API

A documentação completa da API está disponível através do Swagger UI em:

```
http://localhost:3000/api
```

### Autenticação

A API utiliza autenticação JWT (JSON Web Token). Para endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu_token_jwt>
```

#### Endpoints de Autenticação

- **POST /auth/login**

  - Login de usuário
  - Body: `{ "EMAIL": "string", "SENHA": "string" }`
  - Retorna: Token JWT e dados do usuário

- **POST /auth/registro**

  - Registro de novo usuário
  - Body: Dados do usuário (email, senha, nome, etc.)
  - Retorna: Dados do usuário criado

- **POST /auth/change-password** (Autenticado)

  - Alteração de senha
  - Body: `{ "oldPassword": "string", "newPassword": "string" }`

- **POST /auth/validate-token** (Autenticado)
  - Validação de token JWT
  - Retorna: Status do token e dados do usuário

### Produtos

#### Endpoints Públicos

- **GET /produto/listar**

  - Lista todos os produtos
  - Query params: `CATEGORIA` (opcional)
  - Retorna: Array de produtos

- **GET /produto/buscar**
  - Busca produto por ID
  - Query params: `CODPROD` (obrigatório)
  - Retorna: Dados do produto

#### Endpoints Administrativos (Requer autenticação e role ADMIN)

- **POST /produto/cadastrar**

  - Cadastra novo produto
  - Body: Dados do produto (nome, descrição, preço, etc.)
  - Retorna: Produto criado

- **PUT /produto/atualizar**

  - Atualiza produto existente
  - Body: Dados do produto com ID
  - Retorna: Produto atualizado

- **DELETE /produto/remover**
  - Remove produto
  - Body: `{ "CODPROD": number }`
  - Retorna: Confirmação de remoção

### Usuários (Requer autenticação)

- **POST /pessoa/atualizar**

  - Atualiza dados do usuário
  - Body: Dados do usuário para atualização
  - Retorna: Dados atualizados do usuário

- **GET /pessoa/buscar**
  - Busca usuário por ID
  - Query params: `CODPES` (obrigatório)
  - Retorna: Dados do usuário

### Endereços (Requer autenticação)

- **POST /endereco/cadastrar**

  - Cadastra novo endereço
  - Body: Dados do endereço (CEP, rua, número, etc.)
  - Retorna: Endereço cadastrado

- **PATCH /endereco/atualizar**

  - Atualiza endereço existente
  - Body: Dados do endereço com ID
  - Retorna: Endereço atualizado

- **DELETE /endereco/deletar**
  - Remove endereço
  - Query params: ID do endereço
  - Retorna: Confirmação de remoção

### Pedidos (Requer autenticação)

- **POST /pedido/cadastrar**

  - Cria novo pedido
  - Body: Dados do pedido (itens, endereço, etc.)
  - Retorna: Pedido criado

- **PATCH /pedido/atualizar**

  - Atualiza status do pedido
  - Body: Dados de atualização do pedido
  - Retorna: Pedido atualizado

- **DELETE /pedido/deletar**

  - Cancela pedido
  - Query params: ID do pedido
  - Retorna: Confirmação de cancelamento

- **GET /pedido/buscar**

  - Busca pedido por ID
  - Query params: ID do pedido
  - Retorna: Detalhes completos do pedido

- **GET /pedido/listar**
  - Lista pedidos do usuário
  - Query params: Filtros opcionais
  - Retorna: Lista resumida de pedidos

### Códigos de Status HTTP

- **200** - OK: Requisição bem-sucedida
- **201** - Created: Recurso criado com sucesso
- **400** - Bad Request: Dados inválidos ou faltando
- **401** - Unauthorized: Token ausente ou inválido
- **403** - Forbidden: Sem permissão para acessar o recurso
- **404** - Not Found: Recurso não encontrado
- **500** - Internal Server Error: Erro interno do servidor

## Testes

```bash
# testes unitários
$ npm run test

# testes e2e
$ npm run test:e2e

# cobertura de testes
$ npm run test:cov
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configuração do servidor
PORT=3000
FRONTEND_URL=http://localhost:5173

# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/zabbixstore?schema=public"

# JWT
JWT_SECRET=seu_secret_aqui
JWT_EXPIRATION=24h
```

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
