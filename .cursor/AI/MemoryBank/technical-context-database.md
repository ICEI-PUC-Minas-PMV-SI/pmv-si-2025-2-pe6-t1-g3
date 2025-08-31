# Technical Context - Database (PostgreSQL + Prisma)

## Tecnologia
- **Nome**: PostgreSQL + Prisma ORM
- **Versão**: PostgreSQL 15-alpine, Prisma ^5.11.0
- **Propósito**: Banco de dados relacional com ORM para mapeamento objeto-relacional

## Configuração
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Login {
  CODUSU    Int     @id @default(autoincrement())
  EMAIL     String  @unique
  SENHA     String
  PERMISSAO String? @default("CLIENTE")
  PESSOA    Pessoa?
  @@map("LOGIN")
}

model Pessoa {
  CODPES    Int        @id @default(autoincrement())
  NOME      String
  SOBRENOME String
  CPF       String
  TELEFONE  String
  CODUSU    Int        @unique
  USUARIO   Login      @relation(fields: [CODUSU], references: [CODUSU])
  ENDERECOS Endereco[]
  PEDIDOS   Pedido[]
  @@map("INFOS")
}
```

## Padrões de Uso
- Mapeamento objeto-relacional com Prisma
- Migrações automáticas
- Seed de dados para desenvolvimento
- Relacionamentos bem definidos
- Nomenclatura em português para tabelas

## Dependências
- PostgreSQL 15+
- Prisma CLI
- Node.js 18+
- Docker (para containerização)

## Exemplos de Implementação
```typescript
// Prisma Service
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// Repository Pattern
@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.produtos.findMany({
      include: {
        CATEGORIAS: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.produtos.findUnique({
      where: { CODPROD: id },
      include: {
        CATEGORIAS: true,
      },
    });
  }

  async create(data: CreateProductDto) {
    return this.prisma.produtos.create({
      data,
      include: {
        CATEGORIAS: true,
      },
    });
  }
}
```

## Melhores Práticas
- Usar migrations para controle de versão do schema
- Implementar seed de dados para desenvolvimento
- Utilizar relacionamentos apropriados
- Implementar índices para performance
- Usar transações para operações críticas
- Manter backup regular dos dados
- Monitorar performance das queries

## Data de Criação
27/01/2025

## Última Atualização
27/01/2025
