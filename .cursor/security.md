# 🔐 Segurança

## Configurações de Segurança
- **Helmet.js** configurado com políticas de segurança customizadas
- **CORS** configurado para permitir apenas origens específicas (`FRONTEND_URL`)
- **JWT Secrets** devem vir sempre de variáveis de ambiente (`JWT_SECRET`)
- **Rate Limiting** implementado via `@nestjs/throttler`

## Validação e Sanitização
- **DTOs com class-validator** obrigatórios para todos os endpoints
- **ValidationPipe global** com `whitelist: true` e `forbidNonWhitelisted: true`
- **Transformação automática** de tipos via `class-transformer`
- **Mensagens de erro padronizadas** em português

## Configurações de Container
- Containers devem rodar como **usuário não-root**
- Evitar expor portas desnecessárias (somente as listadas na documentação)
- **Health checks** obrigatórios nos serviços críticos
- **Volumes de dados** com permissões restritas

## Produção
- **HTTPS obrigatório** via Nginx ou Load Balancer
- **Headers de segurança** via Helmet.js
- **Body parser limits** configurados (10mb)
- **Environment variables** para todas as configurações sensíveis

## Autenticação
- **JWT Bearer Token** para autenticação
- **Expiração de tokens** configurada (24h por padrão)
- **Guards globais** para proteção de rotas
- **Permissões baseadas em roles** (`PERMISSAO` field)

## Banco de Dados
- **Prisma ORM** com queries parametrizadas
- **Migrations** para controle de schema
- **Seeds** para dados iniciais
- **Conexões seguras** via `DATABASE_URL`
