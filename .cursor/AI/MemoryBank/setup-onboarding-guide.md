# Setup & Onboarding Guide

## Pré-requisitos do Sistema

### Requisitos Mínimos
- **Node.js**: Versão 18 ou superior
- **Docker**: Versão 20 ou superior
- **Docker Compose**: Versão 2 ou superior
- **Git**: Controle de versão
- **RAM**: Mínimo 8GB (recomendado 16GB)
- **Disco**: 10GB de espaço livre

### Verificação de Instalação
```bash
# Node.js
node --version  # Deve ser >= 18.0.0
npm --version   # Deve ser >= 8.0.0

# Docker
docker --version
docker-compose --version

# Git
git --version
```

## Configuração Inicial

### 1. Clone do Repositório
```bash
# Clone do repositório
git clone <repository-url>
cd pmv-si-2025-2-pe6-t1-g3

# Verificar estrutura
ls -la
```

### 2. Configuração do Ambiente
```bash
# Backend
cd infrastructure/backend
cp .env.example .env  # Se disponível
# Editar .env com suas configurações

# Frontend
cd ../frontend
cp .env.example .env  # Se disponível
# Editar .env com suas configurações
```

### 3. Instalação de Dependências
```bash
# Backend
cd infrastructure/backend
npm install

# Frontend
cd ../frontend
npm install
```

## Primeira Execução

### 1. Iniciar Serviços
```bash
# Ambiente completo (recomendado)
./start-project.sh

# Verificar se todos os serviços estão rodando
docker-compose ps
```

### 2. Verificar Funcionamento
```bash
# Backend
curl http://localhost:3000/health

# Frontend
curl http://localhost:5173

# Swagger
open http://localhost:3000/api
```

### 3. Banco de Dados
```bash
# Verificar migrations
cd infrastructure/backend
npx prisma migrate status

# Executar seeds se necessário
npm run seed
```

## Configurações Específicas

### Variáveis de Ambiente Backend
```bash
# .env (infrastructure/backend/.env)
NODE_ENV=development
JWT_SECRET=your-super-secret-key-change-this
DATABASE_URL=postgresql://postgres:password@localhost:5432/store_db
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Variáveis de Ambiente Frontend
```bash
# .env (infrastructure/frontend/.env)
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=ZabbixStore
```

### Configuração do Docker
```bash
# Verificar se Docker está rodando
docker info

# Configurar recursos (Docker Desktop)
# Memory: 4GB mínimo
# CPU: 2 cores mínimo
# Disk: 20GB mínimo
```

## Fluxo de Desenvolvimento

### 1. Desenvolvimento Diário
```bash
# Iniciar ambiente
./start-project.sh

# Desenvolvimento backend
cd infrastructure/backend
npm run start:dev

# Desenvolvimento frontend (outro terminal)
cd infrastructure/frontend
npm run dev
```

### 2. Testes
```bash
# Backend
cd infrastructure/backend
npm run test
npm run test:watch

# Frontend
cd infrastructure/frontend
npm run test
```

### 3. Build e Deploy
```bash
# Build de produção
cd infrastructure/frontend && npm run build
cd ../backend && npm run build

# Deploy com Docker
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting Inicial

### Problemas Comuns

#### Docker não inicia
```bash
# Verificar se Docker Desktop está rodando
# Reiniciar Docker Desktop
# Verificar recursos alocados
```

#### Portas ocupadas
```bash
# Verificar portas em uso
lsof -i :3000
lsof -i :5173
lsof -i :5432

# Matar processos se necessário
kill -9 <PID>
```

#### Dependências não instalam
```bash
# Limpar cache
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Banco não conecta
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Reiniciar banco
docker-compose restart postgres

# Verificar logs
docker-compose logs postgres
```

## Próximos Passos

### 1. Familiarização
- Explorar a documentação Swagger: http://localhost:3000/api
- Testar endpoints básicos
- Navegar pela aplicação frontend

### 2. Desenvolvimento
- Escolher uma feature para trabalhar
- Criar branch: `git checkout -b feature/nome-feature`
- Seguir padrões de commit: `feat: descrição`

### 3. Contribuição
- Ler guidelines de desenvolvimento
- Seguir padrões de código
- Fazer code review antes do merge

## Recursos Adicionais

### Documentação
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)

### Ferramentas Úteis
- **VS Code Extensions**: 
  - ESLint
  - Prettier
  - Docker
  - Prisma
  - React Developer Tools

### Comunicação
- **Slack**: Canal do projeto
- **GitHub**: Issues e Pull Requests
- **Documentação**: Este MemoryBank

## Data de Criação
27/01/2025

## Última Atualização
27/01/2025
