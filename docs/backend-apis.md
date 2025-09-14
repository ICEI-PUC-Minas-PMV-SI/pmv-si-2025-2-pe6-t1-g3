# APIs e Web Services

A **Zabbix Store** é um e-commerce de plataforma de terceiros que permite a venda de diversos tipos de produtos, incluindo eletrônicos, roupas e itens de casa. O sistema oferece versões web e mobile, e as APIs serão responsáveis por integrar os serviços entre o front-end, o back-end e sistemas de terceiros, garantindo a comunicação segura e eficiente entre compradores e fornecedores. Entre as funcionalidades da API estão: autenticação de usuários, gerenciamento de produtos, validação de endereços e processamento de pedidos.

## Objetivos da API

A API da Zabbix Store tem como principais objetivos:

1. **Autenticação e Autorização**: Gerenciar o acesso seguro de usuários (clientes e administradores) através de tokens JWT
2. **Gestão de Produtos**: Permitir que administradores cadastrem, atualizem e removam produtos do catálogo
3. **Gestão de Usuários**: Facilitar o cadastro, atualização e busca de informações de usuários
4. **Gestão de Endereços**: Permitir que usuários cadastrem e gerenciem múltiplos endereços de entrega
5. **Processamento de Pedidos**: Gerenciar todo o ciclo de vida dos pedidos, desde a criação até a entrega
6. **Integração Frontend**: Fornecer endpoints RESTful para integração com aplicações web e mobile
7. **Segurança**: Implementar validações, sanitização de dados e controle de acesso baseado em roles

## Modelagem da Aplicação

### Estrutura de Dados

A aplicação é organizada em torno de entidades que representam os usuários (compradores e fornecedores), os produtos disponibilizados e as interações realizadas na Store.

- **Usuário**: entidade base que representa qualquer participante da plataforma. Contém atributos comuns como id_usuario, nome, email, senha e tipo, que define se o usuário é um **comprador** ou um **fornecedor**.

- **Fornecedor**: especialização de usuário responsável pela venda de produtos na Store. Possui atributos adicionais como CNPJ, CPF, telefone, endereço e é associado diretamente aos produtos que oferece.

- **Comprador**: especialização de usuário que consome os produtos. Possui atributos adicionais como CPF, data_nascimento e endereço. Pode visualizar produtos, adicionar ao carrinho, realizar compras e avaliar produtos.

- **Categoria**: classifica os produtos em áreas temáticas (ex.: Roupas, Eletrônicos, Utensílios), permitindo organização e filtragem.

- **Produto**: item à venda na loja, criado por um fornecedor. Contém atributos como id_produto, nome, descrição, preço, estoque, imagens e está vinculado a uma Categoria.

- **Carrinho**: mantém os produtos selecionados pelo comprador antes da finalização da compra. Contém referências ao comprador, produtos e quantidades.

- **Pedido**: registra a compra de um comprador, contendo informações como id_pedido, data, status (ex.: processando, enviado, entregue) e os produtos comprados.

- **Avaliação**: permite que compradores avaliem produtos adquiridos, registrando nota e comentário.

* `diagrama entidade-relacionamento (DER)`
  ![Alt text](../docs/img/diagrams/DER.drawio.svg)

* `modelo relacional`
  ![Alt text](../docs/img/diagrams/modelo_relacional.drawio.svg)

## Tecnologias Utilizadas

### Backend

- **NestJS**: Framework Node.js para construção de APIs escaláveis
- **TypeScript**: Linguagem de programação com tipagem estática
- **Prisma**: ORM para gerenciamento de banco de dados
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação baseada em tokens
- **bcrypt**: Criptografia de senhas
- **Swagger/OpenAPI**: Documentação automática da API
- **Docker**: Containerização da aplicação

### Frontend

- **React**: Biblioteca para interfaces de usuário
- **Vite**: Build tool e bundler
- **Tailwind CSS**: Framework CSS utilitário
- **Axios**: Cliente HTTP para requisições

### DevOps

- **Docker Compose**: Orquestração de containers
- **Nginx**: Servidor web e proxy reverso

## API Endpoints

A API da Zabbix Store oferece endpoints organizados por módulos funcionais. Todos os endpoints (exceto os públicos) requerem autenticação via Bearer Token JWT.

### Autenticação (`/auth`)

#### POST /auth/login

- **Descrição**: Autentica usuário e retorna token JWT
- **Autenticação**: Não requerida
- **Parâmetros**:
  ```json
  {
    "EMAIL": "usuario@exemplo.com",
    "SENHA": "Senha@123"
  }
  ```
- **Resposta**:
  - Sucesso (200 OK)
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": 1,
        "email": "usuario@exemplo.com",
        "permission": "CLIENTE",
        "profile": {
          "id": 1,
          "name": "João",
          "lastName": "Silva",
          "phone": "11987654321",
          "cpf": "12345678900"
        }
      }
    }
    ```
  - Erro (401 Unauthorized)
    ```json
    {
      "statusCode": 401,
      "message": "Credenciais inválidas",
      "error": "Unauthorized"
    }
    ```

#### POST /auth/registro

- **Descrição**: Registra novo usuário no sistema
- **Autenticação**: Não requerida
- **Parâmetros**:
  ```json
  {
    "EMAIL": "usuario@exemplo.com",
    "SENHA": "Senha@123",
    "NOME": "João",
    "SOBRENOME": "Silva",
    "CPF": "12345678900",
    "TELEFONE": "11987654321",
    "ENDERECO": {
      "DESCRICAO": "Casa",
      "CEP": "12345678",
      "RUA": "Rua das Flores",
      "NUMERO": "123",
      "COMPLEMENTO": "Apto 42",
      "BAIRRO": "Centro",
      "CIDADE": "São Paulo"
    }
  }
  ```
- **Resposta**:
  - Sucesso (201 Created)
    ```json
    {
      "id": 1,
      "email": "usuario@exemplo.com",
      "permission": "CLIENTE",
      "profile": {
        "id": 1,
        "name": "João",
        "lastName": "Silva",
        "phone": "11987654321",
        "cpf": "12345678900",
        "address": {
          "id": 1,
          "description": "Casa",
          "zipCode": "12345678",
          "street": "Rua das Flores",
          "number": "123",
          "complement": "Apto 42",
          "neighborhood": "Centro",
          "city": "São Paulo",
          "isMain": true
        }
      }
    }
    ```
  - Erro (400 Bad Request)
    ```json
    {
      "statusCode": 400,
      "message": "Email inválido",
      "error": "Bad Request"
    }
    ```
  - Erro (409 Conflict)
    ```json
    {
      "statusCode": 409,
      "message": "Email já está em uso",
      "error": "Conflict"
    }
    ```
  - Erro (500 Internal Server Error)
    ```json
    {
      "statusCode": 500,
      "message": "Erro interno do servidor",
      "error": "Internal Server Error"
    }
    ```

### Produtos (`/produto`)

#### GET /produto/listar

- **Descrição**: Lista todos os produtos disponíveis
- **Autenticação**: Não requerida (público)
- **Parâmetros**:
  - `CATEGORIA` (opcional): Filtrar por categoria
- **Resposta**:
  - Sucesso (200 OK)
    ```json
    [
      {
        "CODPROD": 1,
        "PRODUTO": "Camiseta Polo",
        "DESCRICAO": "Camiseta polo masculina 100% algodão",
        "VALOR": 29.99,
        "ESTOQUE": 50,
        "CODCAT": 1,
        "IMAGEM": "https://exemplo.com/imagem.jpg",
        "DESCONTO": 0,
        "CATEGORIAS": {
          "CODCAT": 1,
          "CATEGORIA": "MASCULINO"
        }
      }
    ]
    ```
  - Erro (500 Internal Server Error)
    ```json
    {
      "statusCode": 500,
      "message": "Erro interno do servidor",
      "error": "Internal Server Error"
    }
    ```

#### GET /produto/buscar

- **Descrição**: Busca produto por ID
- **Autenticação**: Não requerida (público)
- **Parâmetros**:
  - `CODPROD`: ID do produto
- **Resposta**:
  - Sucesso (200 OK)
    ```json
    {
      "CODPROD": 1,
      "PRODUTO": "Camiseta Polo",
      "DESCRICAO": "Camiseta polo masculina 100% algodão",
      "VALOR": 29.99,
      "ESTOQUE": 50,
      "CODCAT": 1,
      "IMAGEM": "https://exemplo.com/imagem.jpg",
      "DESCONTO": 0,
      "CATEGORIAS": {
        "CODCAT": 1,
        "CATEGORIA": "MASCULINO"
      }
    }
    ```
  - Erro (404 Not Found)
    ```json
    {
      "statusCode": 404,
      "message": "Produto não encontrado",
      "error": "Not Found"
    }
    ```
  - Erro (500 Internal Server Error)
    ```json
    {
      "statusCode": 500,
      "message": "Erro interno do servidor",
      "error": "Internal Server Error"
    }
    ```

#### POST /produto/cadastrar

- **Descrição**: Cadastra novo produto (Admin apenas)
- **Autenticação**: Requerida (Admin)
- **Parâmetros**:
  ```json
  {
    "PRODUTO": "Camiseta Polo",
    "DESCRICAO": "Camiseta polo masculina 100% algodão",
    "VALOR": 29.99,
    "ESTOQUE": 50,
    "CODCAT": 1,
    "IMAGEM": "https://exemplo.com/imagem.jpg",
    "DESCONTO": 0
  }
  ```
- **Resposta**:
  - Sucesso (201 Created)
    ```json
    {
      "CODPROD": 1,
      "PRODUTO": "Camiseta Polo",
      "DESCRICAO": "Camiseta polo masculina 100% algodão",
      "VALOR": 29.99,
      "ESTOQUE": 50,
      "CODCAT": 1,
      "IMAGEM": "https://exemplo.com/imagem.jpg",
      "DESCONTO": 0
    }
    ```
  - Erro (401 Unauthorized)
    ```json
    {
      "statusCode": 401,
      "message": "Não autorizado",
      "error": "Unauthorized"
    }
    ```
  - Erro (403 Forbidden)
    ```json
    {
      "statusCode": 403,
      "message": "Usuário não tem permissão de administrador",
      "error": "Forbidden"
    }
    ```
  - Erro (400 Bad Request)
    ```json
    {
      "statusCode": 400,
      "message": "Valor não pode ser negativo",
      "error": "Bad Request"
    }
    ```
  - Erro (500 Internal Server Error)
    ```json
    {
      "statusCode": 500,
      "message": "Erro interno do servidor",
      "error": "Internal Server Error"
    }
    ```

### Endereços (`/endereco`)

#### POST /endereco/cadastrar

- **Descrição**: Cadastra novo endereço para o usuário
- **Autenticação**: Requerida
- **Parâmetros**:
  ```json
  {
    "CODPES": 1,
    "CEP": "12345678",
    "RUA": "Rua das Flores",
    "NUMERO": "123",
    "COMPLEMENTO": "Apto 42",
    "BAIRRO": "Centro",
    "CIDADE": "São Paulo",
    "DESCRICAO": "Casa"
  }
  ```
- **Resposta**:
  - Sucesso (201 Created)
    ```json
    {
      "CODEND": 1,
      "CODPES": 1,
      "DESCRICAO": "Casa",
      "CEP": "12345678",
      "RUA": "Rua das Flores",
      "NUMERO": "123",
      "COMPLEMENTO": "Apto 42",
      "BAIRRO": "Centro",
      "CIDADE": "São Paulo"
    }
    ```
  - Erro (400 Bad Request)
    ```json
    {
      "statusCode": 400,
      "message": "CEP inválido",
      "error": "Bad Request"
    }
    ```
  - Erro (401 Unauthorized)
    ```json
    {
      "statusCode": 401,
      "message": "Não autorizado",
      "error": "Unauthorized"
    }
    ```
  - Erro (500 Internal Server Error)
    ```json
    {
      "statusCode": 500,
      "message": "Erro interno do servidor",
      "error": "Internal Server Error"
    }
    ```

### Pedidos (`/pedido`)

#### POST /pedido/cadastrar

- **Descrição**: Cria novo pedido
- **Autenticação**: Requerida
- **Parâmetros**:
  ```json
  {
    "CODPES": 1,
    "CODEND": 1,
    "ITENS": [
      {
        "CODPROD": 1,
        "QUANTIDADE": 2
      }
    ]
  }
  ```
- **Resposta**:
  - Sucesso (201 Created)
    ```json
    {
      "CODPED": 1,
      "CODPES": 1,
      "CODEND": 1,
      "DESCONTO": 10,
      "FRETE": 15,
      "SUBTOTAL": 299.99,
      "VALORTOTAL": 304.99,
      "ITENSPEDIDO": [
        {
          "CODPED": 1,
          "CODPROD": 1,
          "TAMANHO": "M",
          "QTD": 2
        }
      ],
      "ENDERECO": {
        "CODEND": 1,
        "CODPES": 1,
        "DESCRICAO": "Casa",
        "CEP": "12345678",
        "RUA": "Rua das Flores",
        "NUMERO": "123",
        "COMPLEMENTO": "Apto 42",
        "BAIRRO": "Centro",
        "CIDADE": "São Paulo"
      }
    }
    ```
  - Erro (400 Bad Request)
    ```json
    {
      "statusCode": 400,
      "message": "Produto sem estoque suficiente",
      "error": "Bad Request"
    }
    ```
  - Erro (401 Unauthorized)
    ```json
    {
      "statusCode": 401,
      "message": "Não autorizado",
      "error": "Unauthorized"
    }
    ```
  - Erro (500 Internal Server Error)
    ```json
    {
      "statusCode": 500,
      "message": "Erro interno do servidor",
      "error": "Internal Server Error"
    }
    ```

#### GET /pedido/listar

- **Descrição**: Lista pedidos do usuário
- **Autenticação**: Requerida
- **Parâmetros**:
  - `CODPES`: ID do usuário
  - `STATUS` (opcional): Filtrar por status
- **Resposta**:
  - Sucesso (200 OK)
    ```json
    [
      {
        "CODPED": 1,
        "CODPES": 1,
        "CODEND": 1,
        "DESCONTO": 10,
        "FRETE": 15,
        "SUBTOTAL": 299.99,
        "VALORTOTAL": 304.99,
        "ITENSPEDIDO": [
          {
            "CODPED": 1,
            "CODPROD": 1,
            "TAMANHO": "M",
            "QTD": 2
          }
        ],
        "ENDERECO": {
          "CODEND": 1,
          "CODPES": 1,
          "DESCRICAO": "Casa",
          "CEP": "12345678",
          "RUA": "Rua das Flores",
          "NUMERO": "123",
          "COMPLEMENTO": "Apto 42",
          "BAIRRO": "Centro",
          "CIDADE": "São Paulo"
        }
      }
    ]
    ```
  - Erro (401 Unauthorized)
    ```json
    {
      "statusCode": 401,
      "message": "Não autorizado",
      "error": "Unauthorized"
    }
    ```
  - Erro (500 Internal Server Error)
    ```json
    {
      "statusCode": 500,
      "message": "Erro interno do servidor",
      "error": "Internal Server Error"
    }
    ```

### Pessoas (`/pessoa`)

#### GET /pessoa/buscar

- **Descrição**: Busca dados do usuário
- **Autenticação**: Requerida
- **Parâmetros**:
  - `CODPES`: ID do usuário
- **Resposta**:
  - Sucesso (200 OK)
    ```json
    {
      "CODPES": 1,
      "NOME": "João",
      "SOBRENOME": "Silva",
      "CPF": "12345678900",
      "TELEFONE": "11987654321",
      "CODUSU": 1,
      "USUARIO": {
        "CODUSU": 1,
        "EMAIL": "usuario@exemplo.com",
        "PERMISSAO": "CLIENTE"
      },
      "ENDERECOS": [
        {
          "CODEND": 1,
          "CODPES": 1,
          "DESCRICAO": "Casa",
          "CEP": "12345678",
          "RUA": "Rua das Flores",
          "NUMERO": "123",
          "COMPLEMENTO": "Apto 42",
          "BAIRRO": "Centro",
          "CIDADE": "São Paulo",
          "PRINCIPAL": true
        }
      ]
    }
    ```
  - Erro (404 Not Found)
    ```json
    {
      "statusCode": 404,
      "message": "Usuário não encontrado",
      "error": "Not Found"
    }
    ```
  - Erro (401 Unauthorized)
    ```json
    {
      "statusCode": 401,
      "message": "Não autorizado",
      "error": "Unauthorized"
    }
    ```
  - Erro (500 Internal Server Error)
    ```json
    {
      "statusCode": 500,
      "message": "Erro interno do servidor",
      "error": "Internal Server Error"
    }
    ```

### Health Check (`/health`)

#### GET /health

- **Descrição**: Verifica status da API
- **Autenticação**: Não requerida
- **Resposta**:
  - Sucesso (200 OK)
    ```json
    {
      "status": "ok",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "service": "store-backend",
      "version": "2.0.0"
    }
    ```

## Considerações de Segurança

### Autenticação e Autorização

- **JWT (JSON Web Tokens)**: Sistema de autenticação baseado em tokens com expiração de 24 horas
- **Roles e Permissões**: Controle de acesso baseado em roles (CLIENTE, ADMIN)
- **Guards**: Middleware de autenticação e autorização em todos os endpoints protegidos
- **Bearer Token**: Autenticação via header `Authorization: Bearer <token>`

### Proteção de Dados

- **Criptografia de Senhas**: Uso do bcrypt com salt rounds para hash de senhas
- **Validação de Entrada**: Validação rigorosa de todos os dados de entrada via DTOs
- **Sanitização**: Limpeza e sanitização de dados para prevenir ataques de injeção
- **Rate Limiting**: Limitação de 100 requests por minuto por IP

### Endpoints Públicos vs Protegidos

- **Públicos**: `/auth/login`, `/auth/registro`, `/produto/listar`, `/produto/buscar`, `/health`
- **Protegidos**: Todos os demais endpoints requerem autenticação
- **Admin Only**: `/produto/cadastrar`, `/produto/atualizar`, `/produto/remover`

### Validações de Segurança

- **CPF**: Validação de formato e dígitos verificadores
- **Email**: Validação de formato e unicidade
- **CEP**: Validação de formato brasileiro
- **Senhas**: Mínimo de 8 caracteres com complexidade
- **SQL Injection**: Proteção via ORM Prisma com queries parametrizadas

### Headers de Segurança

- **CORS**: Configuração adequada para domínios permitidos
- **Content-Type**: Validação de tipos de conteúdo aceitos
- **X-Content-Type-Options**: Prevenção de MIME type sniffing

## Implantação

### Requisitos do Sistema

- **Node.js**: Versão 18+ para o backend
- **PostgreSQL**: Versão 14+ para o banco de dados
- **Docker**: Versão 20+ para containerização
- **Nginx**: Para proxy reverso e servir arquivos estáticos

### Ambiente de Desenvolvimento

```bash
# Clone o repositório
git clone <repository-url>
cd pmv-si-2025-2-pe6-t1-g3

# Inicie os containers
docker-compose up -d

# Execute as migrações do banco
docker-compose exec backend npx prisma migrate dev

# Execute o seed do banco
docker-compose exec backend npx prisma db seed
```

### Variáveis de Ambiente

```env
# Backend (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/zabbixstore"
JWT_SECRET="your-jwt-secret-key"
PORT=3000

# Frontend (public/config.js)
VITE_API_URL="http://localhost:3000"
```

### Deploy em Produção

1. **Configuração do Servidor**:

   - Instalar Docker e Docker Compose
   - Configurar domínio e SSL (Let's Encrypt)
   - Configurar firewall e portas

2. **Deploy da Aplicação**:

   ```bash
   # Build das imagens
   docker-compose -f docker-compose.prod.yml build

   # Deploy
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Configuração do Nginx**:

   - Proxy reverso para o backend
   - Servir arquivos estáticos do frontend
   - Configuração de SSL/TLS

4. **Monitoramento**:
   - Health checks via `/health`
   - Logs centralizados
   - Backup automático do banco de dados

## Testes

### Estratégia de Testes (Pirâmide de Testes)

- **Testes Unitários**: 70% da cobertura - Testam funções e classes isoladamente
- **Testes de Integração**: 20% da cobertura - Testam interação entre componentes
- **Testes E2E**: 10% da cobertura - Testam fluxos completos da aplicação

### Ferramentas Utilizadas

- **Jest**: Framework de testes para JavaScript/TypeScript
- **Supertest**: Testes de integração para APIs REST
- **@testing-library/react**: Testes de componentes React
- **Cypress**: Testes end-to-end para frontend

### Testes Unitários (Backend)

```typescript
// Exemplo de teste de serviço
describe("AuthService", () => {
  it("should authenticate user with valid credentials", async () => {
    const result = await authService.login({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("test@example.com");
  });
});
```

### Testes de Integração (API)

```typescript
// Exemplo de teste de endpoint
describe("AuthController (e2e)", () => {
  it("/auth/login (POST)", () => {
    return request(app.getHttpServer())
      .post("/auth/login")
      .send({
        EMAIL: "test@example.com",
        SENHA: "password123",
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
      });
  });
});
```

### Testes E2E (Frontend)

```javascript
// Exemplo de teste E2E
describe("User Authentication Flow", () => {
  it("should complete login process", () => {
    cy.visit("/login");
    cy.get('[data-testid="email-input"]').type("test@example.com");
    cy.get('[data-testid="password-input"]').type("password123");
    cy.get('[data-testid="login-button"]').click();
    cy.url().should("include", "/dashboard");
  });
});
```

### Cobertura de Testes

- **Meta**: 80% de cobertura mínima
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Comandos de Teste

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:e2e

# Cobertura de testes
npm run test:coverage

# Testes E2E (Cypress)
npm run cypress:open
```

# Referências

## Documentação Oficial

- [NestJS Documentation](https://docs.nestjs.com/) - Framework Node.js para APIs
- [Prisma Documentation](https://www.prisma.io/docs) - ORM para TypeScript e Node.js
- [React Documentation](https://react.dev/) - Biblioteca para interfaces de usuário
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Banco de dados relacional
- [Docker Documentation](https://docs.docker.com/) - Plataforma de containerização

## Ferramentas de Desenvolvimento

- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Linguagem de programação
- [Jest Documentation](https://jestjs.io/docs/getting-started) - Framework de testes
- [Cypress Documentation](https://docs.cypress.io/) - Testes end-to-end
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Framework CSS
- [Vite Documentation](https://vitejs.dev/guide/) - Build tool

## Padrões e Boas Práticas

- [REST API Design Best Practices](https://restfulapi.net/) - Padrões para APIs REST
- [JWT.io](https://jwt.io/) - JSON Web Tokens
- [OWASP API Security](https://owasp.org/www-project-api-security/) - Segurança em APIs
- [Testing Library](https://testing-library.com/) - Utilitários para testes

## Arquitetura e Design

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Princípios de arquitetura limpa
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) - Design orientado ao domínio
- [Microservices Patterns](https://microservices.io/) - Padrões de microserviços

# Planejamento

## Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Etapa 2

Atualizado em: 01/09/2025

| Responsável      | Tarefa/Requisito              | Iniciado em |   Prazo    | Status | Terminado em |
| :--------------- | :---------------------------- | :---------: | :--------: | :----: | :----------: |
| Todos            | Correção etapa 1              | 01/09/2025  | 05/09/2025 |   ✔️   |  04/09/2025  |
| Jully            | Montar a apresentação 1 Etapa | 01/09/2025  | 05/09/2025 |   📝   |              |
| Jully            | APIs e Web Services           | 01/09/2025  | 10/09/2025 |   📝   |              |
| Victor           | Objetivos da API              | 01/09/2025  | 10/09/2005 |   ❌   |              |
| Vinicius / Jully | Modelagem da Aplicação        | 01/09/2025  | 12/09/2005 |   ❌   |              |
| Vinicius         | Tecnologias Utilizadas        | 01/09/2025  | 12/09/2005 |   ❌   |              |
| Lucas            | API Endpoints                 | 01/09/2025  | 12/09/2005 |   ❌   |              |
| Lucas / Pedro    | Tecnologias Utilizadas        | 01/09/2025  | 17/09/2005 |   ❌   |              |
| Victor /Pedro    | Considerações de Segurança    | 01/09/2025  | 04/10/2005 |   ❌   |              |
| Pedro / Ítalo    | Implantação                   | 01/09/2025  | 04/10/2005 |   ❌   |              |
| Pedro            | Considerações de Segurança    | 01/09/2025  | 04/10/2005 |   ❌   |              |
| Ítalo            | Testes                        | 01/09/2025  | 04/10/2005 |   ❌   |              |

Legenda:

- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado
