# 🛠️ Development Guidelines - Comandos Práticos

## Comandos Rápidos

### Ambiente
```bash
# Iniciar projeto completo
./start-project.sh

# Apenas desenvolvimento
./start-dev.sh

# Parar todos os serviços
docker-compose down
```

### Backend (NestJS)
```bash
cd infrastructure/backend

# Desenvolvimento
npm run start:dev

# Testes
npm run test
npm run test:watch

# Linting e formatação
npm run lint
npm run format

# Build
npm run build
```

### Frontend (React)
```bash
cd infrastructure/frontend

# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview

# Linting
npm run lint
```

### Banco de Dados
```bash
cd infrastructure/backend

# Prisma Studio
npx prisma studio

# Migrations
npx prisma migrate dev --name nome_migration
npx prisma migrate reset
npx prisma migrate deploy

# Seeds
npm run seed
```

### Docker
```bash
# Logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Containers
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U postgres -d store_db

# Rebuild
docker-compose build --no-cache backend
docker-compose up -d backend
```

## Health Checks
```bash
# Backend
curl http://localhost:3000/health

# Frontend
curl http://localhost:5173

# Swagger
open http://localhost:3000/api
```

## Troubleshooting Rápido

### Backend não inicia
```bash
# Verificar logs
docker-compose logs backend

# Reinstalar dependências
cd infrastructure/backend && rm -rf node_modules && npm install
```

### Frontend não carrega
```bash
# Limpar cache
cd infrastructure/frontend && npm run build --force

# Verificar porta
lsof -i :5173
```

### Banco não conecta
```bash
# Verificar status
docker-compose ps postgres

# Reset completo
docker-compose down -v && docker-compose up -d postgres
```

## Variáveis de Ambiente
```bash
# Backend (.env)
NODE_ENV=development
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/store_db
FRONTEND_URL=http://localhost:5173

# Frontend (.env)
VITE_API_URL=http://localhost:3000
```
