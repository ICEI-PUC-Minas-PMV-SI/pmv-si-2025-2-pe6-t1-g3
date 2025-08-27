# 🐳 Docker Guidelines

## Serviços e Portas
- **Frontend**: Porta `5173` (React + Vite)
- **Backend**: Porta `3000` (NestJS)
- **PostgreSQL**: Porta `9080` (mapeada para 5432 interno)
- **Prisma Studio**: Porta `5555` (Database Admin)
- **Redis**: Porta `6379` (Cache - opcional)
- **Nginx**: Portas `80/443` (Reverse Proxy - produção)

## Configuração de Containers
- **Base images**: `node:18-alpine` para aplicações Node.js
- **PostgreSQL**: `postgres:15-alpine` para banco de dados
- **Redis**: `redis:7-alpine` para cache
- **Nginx**: `nginx:alpine` para proxy reverso

## Volumes e Persistência
- **PostgreSQL**: `postgres_data` para dados do banco
- **Redis**: `redis_data` para cache persistente
- **Backend**: Volume para Prisma migrations
- **Nginx**: Configurações SSL e nginx.conf

## Health Checks
- **PostgreSQL**: `pg_isready` para verificação de conectividade
- **Backend**: HTTP health check em `/health`
- **Frontend**: HTTP health check em `/health`
- **Redis**: `redis-cli ping` para verificação de status

## Rede e Comunicação
- **Network**: `store-network` (subnet: 172.25.0.0/16)
- **Dependências**: Ordem de inicialização configurada
- **CORS**: Configurado para comunicação entre serviços
- **Environment**: Variáveis compartilhadas entre containers

## Otimizações
- **Multi-stage builds** para frontend (build → nginx)
- **Alpine images** para reduzir tamanho
- **Non-root users** para segurança
- **Resource limits** configuráveis
- **Logs centralizados** via Docker logging

## Scripts de Execução
- **Desenvolvimento**: `./start-dev.sh`
- **Produção**: `./start-project.sh`
- **Profiles**: `production` para configurações de produção
- **Cleanup**: Scripts para limpeza de volumes e containers
