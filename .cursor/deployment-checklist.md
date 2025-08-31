# 🚀 Deployment Checklist

## Pré-Deploy

### ✅ Ambiente de Desenvolvimento
- [ ] Todos os testes passando
- [ ] Linting sem erros
- [ ] Build de produção funcionando
- [ ] Variáveis de ambiente configuradas

### ✅ Código
- [ ] Code review aprovado
- [ ] Merge na branch principal
- [ ] Tags de versão criadas
- [ ] Changelog atualizado

### ✅ Banco de Dados
- [ ] Migrations aplicadas
- [ ] Seeds executados
- [ ] Backup realizado
- [ ] Performance testado

## Deploy

### ✅ Backend
```bash
# Build
cd infrastructure/backend
npm run build

# Teste de build
npm run start:prod

# Deploy
docker-compose -f docker-compose.prod.yml up -d backend
```

### ✅ Frontend
```bash
# Build
cd infrastructure/frontend
npm run build

# Teste de build
npm run preview

# Deploy
docker-compose -f docker-compose.prod.yml up -d frontend
```

### ✅ Banco de Dados
```bash
# Verificar conexão
docker-compose exec postgres pg_isready

# Aplicar migrations
cd infrastructure/backend
npx prisma migrate deploy

# Verificar dados
npx prisma studio
```

## Pós-Deploy

### ✅ Verificações
- [ ] Health checks passando
- [ ] Swagger acessível
- [ ] Frontend carregando
- [ ] API respondendo
- [ ] Banco conectado

### ✅ Testes
```bash
# Health check
curl https://your-domain.com/health

# API test
curl https://your-domain.com/api

# Frontend
curl https://your-domain.com
```

### ✅ Monitoramento
- [ ] Logs configurados
- [ ] Métricas ativas
- [ ] Alertas funcionando
- [ ] Performance OK

## Rollback (Se Necessário)

### ✅ Procedimento
```bash
# Parar serviços
docker-compose -f docker-compose.prod.yml down

# Voltar para versão anterior
git checkout v1.0.0

# Rebuild e deploy
docker-compose -f docker-compose.prod.yml up -d
```

### ✅ Verificações Pós-Rollback
- [ ] Serviços funcionando
- [ ] Dados consistentes
- [ ] Performance OK
- [ ] Usuários não afetados

## Variáveis de Ambiente Produção

### Backend
```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-production-key
DATABASE_URL=postgresql://user:pass@host:port/db
FRONTEND_URL=https://your-domain.com
PORT=3000
```

### Frontend
```bash
VITE_API_URL=https://your-domain.com
VITE_APP_NAME=ZabbixStore
```

## SSL/HTTPS

### ✅ Certificados
- [ ] Certificado SSL válido
- [ ] Auto-renewal configurado
- [ ] HTTP → HTTPS redirect
- [ ] Mixed content resolvido

## Performance

### ✅ Otimizações
- [ ] Gzip habilitado
- [ ] Cache configurado
- [ ] Images otimizadas
- [ ] Bundle size OK

## Segurança

### ✅ Checklist
- [ ] Headers de segurança
- [ ] CORS configurado
- [ ] Rate limiting ativo
- [ ] Secrets seguros
- [ ] Logs sem dados sensíveis
