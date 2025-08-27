# 🛠️ Guidelines de Desenvolvimento

## Ambiente de Desenvolvimento

### Pré-requisitos
- **Node.js**: Versão 18 ou superior
- **Docker**: Versão 20 ou superior
- **Docker Compose**: Versão 2 ou superior
- **Git**: Controle de versão

### Configuração Inicial
```bash
# Clone do repositório
git clone <repository-url>
cd pmv-si-2025-2-pe6-t1-g3

# Instalação de dependências
cd infrastructure/backend && npm install
cd ../frontend && npm install

# Configuração do ambiente
cp .env.example .env  # Se disponível
```

## Fluxo de Desenvolvimento

### 1. Iniciar Ambiente
```bash
# Ambiente completo (recomendado)
./start-project.sh

# Ou apenas desenvolvimento
./start-dev.sh
```

### 2. Desenvolvimento Backend
```bash
cd infrastructure/backend

# Desenvolvimento com hot reload
npm run start:dev

# Executar testes
npm run test
npm run test:watch

# Verificar linting
npm run lint

# Formatação de código
npm run format
```

### 3. Desenvolvimento Frontend
```bash
cd infrastructure/frontend

# Desenvolvimento com Vite
npm run dev

# Build de produção
npm run build

# Verificar linting
npm run lint

# Preview do build
npm run preview
```

## Debugging e Troubleshooting

### Backend (NestJS)

#### Logs e Debugging
```typescript
// Usar Logger do NestJS
import { Logger } from '@nestjs/common';

const logger = new Logger('ServiceName');
logger.log('Mensagem de log');
logger.error('Erro encontrado', error.stack);
logger.debug('Debug info');
```

#### Debug com VS Code
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "program": "${workspaceFolder}/infrastructure/backend/src/main.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

#### Testes de API
```bash
# Health check
curl http://localhost:3000/health

# Swagger documentation
open http://localhost:3000/api

# Teste de autenticação
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Frontend (React)

#### Debug com React DevTools
- Instalar extensão React Developer Tools
- Usar `console.log` para debugging
- Utilizar React DevTools para inspecionar componentes

#### Debug de Estado
```javascript
// Context debugging
const AuthContext = createContext();

// Adicionar logs no provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    console.log('Auth state changed:', user);
  }, [user]);
  
  // ... resto do provider
};
```

#### Debug de Requisições
```javascript
// Interceptor do Axios para logging
axios.interceptors.request.use(request => {
  console.log('Request:', request);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

## Banco de Dados

### Prisma Studio
```bash
# Acessar interface visual
open http://localhost:5555

# Ou via CLI
cd infrastructure/backend
npx prisma studio
```

### Migrations
```bash
cd infrastructure/backend

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Reset do banco (cuidado!)
npx prisma migrate reset

# Aplicar migrations em produção
npx prisma migrate deploy
```

### Seeds
```bash
# Executar seeds
npm run seed

# Ou diretamente
npx prisma db seed
```

## Docker e Containers

### Comandos Úteis
```bash
# Ver logs dos containers
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Entrar no container
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U postgres -d store_db

# Rebuild de containers
docker-compose build --no-cache backend
docker-compose up -d backend

# Limpar volumes (cuidado!)
docker-compose down -v
```

### Health Checks
```bash
# Verificar status dos serviços
docker-compose ps

# Health check manual
curl http://localhost:3000/health
curl http://localhost:5173/health
```

## Performance e Otimização

### Backend
- **Caching**: Implementar Redis para cache
- **Database**: Otimizar queries com Prisma
- **Compression**: Habilitar gzip/brotli
- **Rate Limiting**: Configurar throttler

### Frontend
- **Code Splitting**: Lazy loading de componentes
- **Bundle Analysis**: Analisar tamanho do bundle
- **Image Optimization**: Otimizar imagens
- **Caching**: Configurar cache de assets

## Monitoramento

### Logs Centralizados
```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Logs específicos com timestamp
docker-compose logs -f --timestamps backend
```

### Métricas
- **Health Checks**: Endpoints `/health`
- **Performance**: Monitorar tempo de resposta
- **Errors**: Logs de erro centralizados
- **Database**: Monitorar conexões e queries

## Deploy e Produção

### Build de Produção
```bash
# Frontend
cd infrastructure/frontend
npm run build

# Backend
cd infrastructure/backend
npm run build
```

### Environment Variables
```bash
# Produção
NODE_ENV=production
JWT_SECRET=your-super-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
FRONTEND_URL=https://your-domain.com
```

### SSL/HTTPS
- Configurar Nginx com SSL
- Usar certificados válidos
- Configurar redirecionamento HTTP → HTTPS
