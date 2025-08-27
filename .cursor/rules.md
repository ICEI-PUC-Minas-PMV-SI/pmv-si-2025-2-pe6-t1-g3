# 📌 Regras Gerais

## Linguagem e Documentação
- **Código**: Inglês para variáveis, funções, classes e comentários técnicos
- **Documentação**: Português para documentação de negócio e contexto
- **Commits**: Conventional Commits padrão (`feat:`, `fix:`, `docs:`, etc.)
- **README**: Documentação principal em português

## Estrutura do Projeto
- **Arquitetura**: Monorepo com frontend e backend separados
- **Frontend**: `infrastructure/frontend/` (React + Vite)
- **Backend**: `infrastructure/backend/` (NestJS + TypeScript)
- **Documentação**: `docs/` para documentação técnica
- **Apresentação**: `presentation/` para materiais de apresentação

## Desenvolvimento e Hot Reload
- **Frontend**: Vite com hot reload automático (porta 5173)
- **Backend**: NestJS com `--watch` para desenvolvimento (porta 3000)
- **Database**: Prisma Studio para administração visual (porta 5555)
- **Docker**: Ambiente completo via `docker-compose.yml`

## Testes e Qualidade
- **Testes Unitários**: Obrigatórios para novos recursos
- **Testes de Integração**: Quando aplicável (e2e)
- **Cobertura**: Mínimo 80% de cobertura de código
- **Linting**: ESLint configurado para frontend e backend
- **Formatting**: Prettier para formatação consistente

## Documentação de APIs
- **Swagger**: Documentação obrigatória para todos os endpoints
- **DTOs**: Documentados com `@ApiProperty` e exemplos
- **Tags**: Organização por domínio de negócio
- **Autenticação**: Documentação de JWT Bearer tokens

## Ambiente e Deploy
- **Docker**: Referência única de ambiente de execução
- **Scripts**: `./start-project.sh` para execução completa
- **Variáveis**: Environment variables para configurações
- **Volumes**: Persistência de dados via Docker volumes
- **Networks**: Comunicação entre serviços via Docker network

## Versionamento e Controle
- **Git**: Controle de versão centralizado
- **Branches**: Estratégia de branching definida
- **Merges**: Pull requests obrigatórios para main
- **Releases**: Versionamento semântico (SemVer)

## Monitoramento e Logs
- **Health Checks**: Endpoints de saúde para todos os serviços
- **Logs**: Centralização e padronização de logs
- **Métricas**: Coleta de métricas de performance
- **Alertas**: Sistema de alertas para falhas críticas

## Segurança e Compliance
- **Secrets**: Nunca commitar credenciais no repositório
- **Dependências**: Atualização regular de dependências
- **Vulnerabilidades**: Scan regular de vulnerabilidades
- **Backup**: Estratégia de backup para dados críticos
