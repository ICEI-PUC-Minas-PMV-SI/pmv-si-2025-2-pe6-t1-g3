# ⚡ Quick Reference - ZabbixStore

## Comandos Mais Utilizados

### 🚀 Iniciar/Parar
```bash
# Iniciar tudo
./start-project.sh

# Parar tudo
docker-compose down

# Apenas desenvolvimento
./start-dev.sh
```

### 🔧 Desenvolvimento
```bash
# Backend
cd infrastructure/backend
npm run start:dev

# Frontend
cd infrastructure/frontend
npm run dev

# Logs
docker-compose logs -f
```

### 🗄️ Banco de Dados
```bash
# Prisma Studio
cd infrastructure/backend && npx prisma studio

# Migration
npx prisma migrate dev --name nome

# Seeds
npm run seed
```

### 🐳 Docker
```bash
# Logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild
docker-compose build --no-cache backend
docker-compose up -d backend
```

### 🧪 Testes
```bash
# Backend
cd infrastructure/backend
npm run test

# Frontend
cd infrastructure/frontend
npm run test
```

### 📊 Health Checks
```bash
# Backend
curl http://localhost:3000/health

# Swagger
open http://localhost:3000/api

# Frontend
curl http://localhost:5173
```

## URLs Importantes

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:5173 | Aplicação React |
| Backend | http://localhost:3000 | API NestJS |
| Swagger | http://localhost:3000/api | Documentação API |
| Prisma Studio | http://localhost:5555 | Interface do banco |

## Variáveis de Ambiente

### Backend (.env)
```bash
NODE_ENV=development
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/store_db
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000
```

## Estrutura de Pastas

```
infrastructure/
├── backend/          # API NestJS
├── frontend/         # App React
└── docker-compose.yml

.cursor/
├── development-guidelines.md    # Comandos práticos
├── troubleshooting.md           # Solução de problemas
└── quick-reference.md          # Este arquivo
```

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Backend não inicia | `docker-compose logs backend` |
| Frontend não carrega | `npm run build --force` |
| Banco não conecta | `docker-compose restart postgres` |
| Porta ocupada | `lsof -i :3000` → `kill -9 <PID>` |

## Git Workflow

```bash
# Novo feature
git checkout -b feature/nome-feature

# Commit
git add .
git commit -m "feat: descrição"

# Push
git push origin feature/nome-feature
```
