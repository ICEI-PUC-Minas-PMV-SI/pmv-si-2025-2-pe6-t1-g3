# 🐳 Docker Setup - Projeto PMV-SI

Este projeto foi containerizado usando Docker para facilitar o desenvolvimento e deploy. A stack completa inclui frontend React, backend NestJS, PostgreSQL, Redis e Prisma Studio.

## 📋 Pré-requisitos

- [Docker Desktop](https://docs.docker.com/desktop/) instalado e rodando
- [Git](https://git-scm.com/) para clonar o repositório
- No mínimo 4GB de RAM disponível
- No mínimo 10GB de espaço em disco

## 🚀 Início Rápido

### 1. Clone o Repositório
```bash
git clone <repository-url>
cd pmv-si-2025-2-pe6-t1-g3
```

### 2. Inicie a Stack
```bash
./start-project.sh
```

O script irá:
- Verificar dependências
- Criar arquivo `.env` se necessário
- Fazer build das imagens Docker
- Iniciar todos os serviços
- Executar health checks

### 3. Acesse os Serviços

| Serviço | URL | Descrição |
|---------|-----|-----------|
| 🌐 Frontend | http://localhost:5173 | Interface React da loja |
| 🚀 Backend API | http://localhost:3000 | API NestJS |
| 📚 Documentação | http://localhost:3000/api | Swagger API Docs |
| 🗄️ Database Admin | http://localhost:5555 | Prisma Studio |
| 🗃️ PostgreSQL | localhost:9080 | Banco de dados |
| 🔴 Redis | localhost:6379 | Cache (opcional) |

## 🛠️ Comandos Disponíveis

O script `start-project.sh` oferece vários comandos úteis:

```bash
# Iniciar a stack completa
./start-project.sh start

# Parar todos os containers
./start-project.sh stop

# Reiniciar todos os containers
./start-project.sh restart

# Ver logs em tempo real
./start-project.sh logs

# Verificar status dos serviços
./start-project.sh status

# Limpar tudo (containers, volumes, imagens)
./start-project.sh clean

# Ver ajuda
./start-project.sh help
```

## 🐳 Comandos Docker Diretos

### Gerenciamento Básico
```bash
# Ver containers rodando
docker-compose ps

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild e restart específico
docker-compose up -d --build backend

# Escalar serviços (exemplo: 3 instâncias do backend)
docker-compose up -d --scale backend=3
```

### Desenvolvimento
```bash
# Executar comandos dentro dos containers
docker-compose exec backend npm run lint
docker-compose exec backend npx prisma studio
docker-compose exec frontend npm run build

# Acessar shell dos containers
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres -d store_db
```

### Limpeza
```bash
# Parar e remover containers
docker-compose down

# Remover containers e volumes
docker-compose down -v

# Remover tudo incluindo imagens
docker-compose down -v --rmi all

# Limpeza geral do Docker
docker system prune -af
```

## ⚙️ Configuração

### Variáveis de Ambiente
O arquivo `.env` é criado automaticamente a partir do `.env.example`. As principais variáveis são:

```env
# JWT Secret (MUDE EM PRODUÇÃO!)
JWT_SECRET=your-super-secret-jwt-key

# Database
POSTGRES_DB=store_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password123

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

### Portas Utilizadas
- `5173` - Frontend React
- `3000` - Backend NestJS
- `9080` - PostgreSQL
- `5555` - Prisma Studio
- `6379` - Redis

Certifique-se de que essas portas estejam livres antes de iniciar.

## 🔧 Desenvolvimento

### Hot Reload
Os containers estão configurados para development por padrão:
- Frontend: Vite com hot reload
- Backend: NestJS em modo watch
- Mudanças no código são refletidas automaticamente

### Database Migrations
```bash
# Executar migrations
docker-compose exec backend npx prisma migrate dev

# Reset do database
docker-compose exec backend npx prisma migrate reset

# Seed do database (se configurado)
docker-compose exec backend npx prisma db seed
```

### Debugging
```bash
# Ver logs detalhados
docker-compose logs -f --tail=100

# Executar tests
docker-compose exec backend npm run test
docker-compose exec frontend npm run test

# Verificar saúde dos containers
docker-compose exec backend curl -f http://localhost:3000/health
```

## 🚀 Deploy para Produção

### Build Otimizado
```bash
# Build para produção
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Usar perfil de produção
docker-compose --profile production up -d
```

### Variáveis de Produção
```env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
DATABASE_URL=<production-database-url>
FRONTEND_URL=https://yourdomain.com
```

## 🐛 Troubleshooting

### Problemas Comuns

**Container não inicia:**
```bash
# Verificar logs
docker-compose logs <service-name>

# Rebuild da imagem
docker-compose build --no-cache <service-name>
```

**Porta ocupada:**
```bash
# Encontrar processo usando a porta
lsof -ti:3000
kill -9 $(lsof -ti:3000)
```

**Database connection failed:**
```bash
# Verificar se PostgreSQL está rodando
docker-compose exec postgres pg_isready -U postgres

# Verificar logs do database
docker-compose logs postgres
```

**Permissões no WSL2:**
```bash
# Dar permissão de execução
chmod +x start-project.sh

# Converter line endings (se necessário)
dos2unix start-project.sh
```

### Performance

**Otimizar build:**
```bash
# Usar cache do Docker
docker-compose build --parallel

# Limpar cache antigo
docker builder prune
```

**Monitorar recursos:**
```bash
# Ver uso de recursos
docker stats

# Ver espaço usado
docker system df
```

## 📁 Estrutura dos Containers

```
📦 Docker Stack
├── 🗄️ postgres (PostgreSQL 15)
├── 🔴 redis (Redis 7)
├── 🚀 backend (NestJS + Prisma)
├── 🌐 frontend (React + Vite + Nginx)
├── 🗄️ prisma-studio (Database Admin)
└── 🌐 nginx (Load Balancer - produção)
```

## 🔐 Segurança

- Containers rodando como usuário não-root
- Secrets via variáveis de ambiente
- Volumes com permissões apropriadas
- Network isolada para comunicação entre containers
- Health checks configurados

## 📚 Links Úteis

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker](https://docs.nestjs.com/recipes/dockerfile)
- [React Docker](https://create-react-app.dev/docs/deployment/#docker)

---

Para mais informações ou problemas, consulte a documentação oficial do Docker ou abra uma issue no repositório.