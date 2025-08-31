# 🔧 Troubleshooting - ZabbixStore

## Problemas Comuns e Soluções

### Backend (NestJS)

#### Erro: "Cannot find module"
```bash
# Solução: Reinstalar dependências
cd infrastructure/backend
rm -rf node_modules package-lock.json
npm install
```

#### Erro: "Database connection failed"
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Reiniciar banco
docker-compose restart postgres

# Verificar logs
docker-compose logs postgres

# Reset completo (cuidado!)
docker-compose down -v
docker-compose up -d postgres
```

#### Erro: "JWT_SECRET is not defined"
```bash
# Verificar arquivo .env
cd infrastructure/backend
cat .env

# Criar .env se não existir
cp .env.example .env
# Editar JWT_SECRET no arquivo .env
```

#### Erro: "Port 3000 is already in use"
```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
# Editar docker-compose.yml ou .env
```

### Frontend (React)

#### Erro: "Module not found"
```bash
# Limpar cache e reinstalar
cd infrastructure/frontend
rm -rf node_modules package-lock.json
npm install

# Limpar cache do Vite
npm run build --force
```

#### Erro: "Cannot connect to API"
```bash
# Verificar se backend está rodando
curl http://localhost:3000/health

# Verificar variável VITE_API_URL
cat infrastructure/frontend/.env

# Verificar CORS no backend
# Verificar se FRONTEND_URL está configurado
```

#### Erro: "Port 5173 is already in use"
```bash
# Encontrar processo
lsof -i :5173

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
# VITE_PORT=3001 npm run dev
```

### Docker

#### Erro: "Container keeps restarting"
```bash
# Verificar logs
docker-compose logs <service-name>

# Verificar configuração
docker-compose config

# Rebuild container
docker-compose build --no-cache <service-name>
docker-compose up -d <service-name>
```

#### Erro: "Permission denied"
```bash
# No Windows/Mac
docker-compose down
docker-compose up -d

# No Linux
sudo chown -R $USER:$USER .
docker-compose up -d
```

#### Erro: "Out of memory"
```bash
# Aumentar memória do Docker
# Docker Desktop > Settings > Resources > Memory

# Ou limpar recursos
docker system prune -a
docker volume prune
```

### Banco de Dados

#### Erro: "Migration failed"
```bash
# Reset migrations
cd infrastructure/backend
npx prisma migrate reset

# Verificar schema
npx prisma validate

# Gerar novo cliente
npx prisma generate
```

#### Erro: "Database is locked"
```bash
# Parar todos os serviços
docker-compose down

# Remover volumes
docker-compose down -v

# Reiniciar
docker-compose up -d
```

#### Erro: "Connection timeout"
```bash
# Verificar se PostgreSQL está acessível
docker-compose exec postgres psql -U postgres -d store_db

# Verificar variáveis de ambiente
echo $DATABASE_URL

# Testar conexão manual
psql $DATABASE_URL
```

### Performance

#### Backend lento
```bash
# Verificar logs de performance
docker-compose logs backend | grep "slow"

# Verificar uso de memória
docker stats

# Otimizar queries
# Usar Prisma Studio para análise
npx prisma studio
```

#### Frontend lento
```bash
# Verificar bundle size
npm run build
# Analisar output

# Limpar cache
npm run build --force

# Verificar dependências desnecessárias
npm ls
```

## Logs Úteis

### Verificar logs de todos os serviços
```bash
docker-compose logs -f
```

### Logs específicos com timestamp
```bash
docker-compose logs -f --timestamps backend
docker-compose logs -f --timestamps frontend
docker-compose logs -f --timestamps postgres
```

### Logs de erro apenas
```bash
docker-compose logs backend | grep -i error
docker-compose logs frontend | grep -i error
```

## Comandos de Diagnóstico

### Status dos serviços
```bash
docker-compose ps
```

### Uso de recursos
```bash
docker stats
```

### Espaço em disco
```bash
docker system df
```

### Verificar conectividade
```bash
# Backend
curl -v http://localhost:3000/health

# Frontend
curl -v http://localhost:5173

# Database
docker-compose exec postgres pg_isready -U postgres
```

## Reset Completo (Último Recurso)

```bash
# Parar tudo
docker-compose down -v

# Limpar imagens
docker system prune -a

# Reinstalar dependências
cd infrastructure/backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install

# Reiniciar
./start-project.sh
```
