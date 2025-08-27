# 🗄️ Database Guidelines

## Configuração Principal
- **Banco de dados**: PostgreSQL 15 (Alpine)
- **ORM**: Prisma Client
- **Porta**: 9080 (mapeada para 5432 interno)
- **Database**: `store_db`

## Estrutura do Schema
- **Nomenclatura**: Uso de maiúsculas para campos (`PRODUTO`, `DESCRICAO`, etc.)
- **Relacionamentos**: Definidos via `@relation` no Prisma
- **Mapeamento**: Uso de `@@map` para nomes de tabelas customizados
- **Timestamps**: `DATAINC` para data de criação automática

## Entidades Principais
- **Login**: Autenticação e permissões (`CODUSU`, `EMAIL`, `SENHA`, `PERMISSAO`)
- **Pessoa**: Dados pessoais (`CODPES`, `NOME`, `SOBRENOME`, `CPF`, `TELEFONE`)
- **Endereco**: Endereços de entrega (`CODEND`, `CEP`, `RUA`, `NUMERO`, etc.)
- **Produtos**: Catálogo (`CODPROD`, `PRODUTO`, `DESCRICAO`, `IMAGEM`, `ESTOQUE`, `VALOR`)
- **Pedido**: Pedidos (`CODPED`, `SUBTOTAL`, `VALORTOTAL`, `DESCONTO`, `FRETE`)
- **ItensPedido**: Itens dos pedidos (`CODITEM`, `TAMANHO`, `QTD`)

## Migrations e Seeds
- **Migrations**: `npx prisma migrate dev` para mudanças de schema
- **Seeds**: Configurado em `prisma/seed.ts` com `tsx`
- **Reset**: `npx prisma migrate reset` para ambiente limpo
- **Generate**: `npx prisma generate` após mudanças no schema

## Acesso e Gestão
- **Prisma Studio**: Porta `5555` para administração visual
- **Conexão**: Via `DATABASE_URL` environment variable
- **Credenciais**: Nunca versionar `.env` com dados reais
- **Backup**: Volumes Docker para persistência (`postgres_data`)

## Boas Práticas
- **Indexes**: Definidos automaticamente pelo Prisma
- **Constraints**: Validações no nível do banco
- **Soft deletes**: Implementar quando necessário
- **Audit trail**: Usar `DATAINC` para rastreamento temporal
