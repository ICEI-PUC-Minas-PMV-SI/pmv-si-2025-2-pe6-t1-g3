# 🚀 API Guidelines

## Estrutura e Arquitetura
- **Framework**: NestJS com TypeScript
- **Arquitetura Modular**: Módulos separados por domínio (`auth`, `produto`, `pedido`, `pessoa`)
- **Padrão REST**: Endpoints seguindo convenções RESTful
- **Versionamento**: Preparado para `/api/v1/` (estrutura base)

## Documentação e Swagger
- **Swagger UI**: Disponível em `/api`
- **Configuração**: `DocumentBuilder` com metadados completos
- **Tags**: Organização por domínio (`auth`, `produto`, `pedido`, `pessoa`)
- **Bearer Auth**: Configurado para JWT tokens
- **Exemplos**: Todos os DTOs devem incluir exemplos

## Autenticação e Autorização
- **JWT**: Implementado via `@nestjs/jwt`
- **Guards**: `AuthGuard` global para proteção de rotas
- **Roles**: Sistema de permissões (`PERMISSAO` field)
- **Expiração**: Tokens com 24h de validade padrão
- **Refresh**: Implementar quando necessário

## Validação e DTOs
- **class-validator**: Validações obrigatórias em todos os DTOs
- **class-transformer**: Transformação automática de tipos
- **Mensagens**: Erros em português com contexto específico
- **Swagger Decorators**: `@ApiProperty` para documentação
- **Validações Customizadas**: `@IsIn`, `@Min`, `@MaxLength`

## Estrutura de DTOs
```typescript
export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Camiseta Polo' })
  @IsNotEmpty({ message: 'Nome do produto é obrigatório' })
  @IsString()
  @MaxLength(100)
  PRODUTO: string;
  
  // ... outros campos
}
```

## Tratamento de Erros
- **ValidationPipe Global**: Configurado com `whitelist: true`
- **Exception Filters**: Tratamento centralizado de exceções
- **Status Codes**: Uso correto de códigos HTTP
- **Logs**: Logger centralizado para debugging

## Configurações Globais
- **CORS**: Configurado para `FRONTEND_URL`
- **Helmet**: Headers de segurança
- **Body Parser**: Limite de 10mb configurado
- **Rate Limiting**: Via `@nestjs/throttler`

## Endpoints Principais
- **Health Check**: `/health` para monitoramento
- **Auth**: `/auth/login`, `/auth/register`
- **Produtos**: CRUD completo com filtros
- **Pedidos**: Gestão de pedidos e itens
- **Pessoas**: Gestão de usuários e endereços
