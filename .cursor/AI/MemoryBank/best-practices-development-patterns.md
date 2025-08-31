# Best Practices - Development Patterns

## Padrões de Desenvolvimento

### Backend (NestJS)

#### Logging e Debugging
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

## Padrões de Código

### TypeScript
- Usar tipos explícitos
- Evitar `any`
- Usar interfaces para objetos
- Implementar error handling

### React
- Usar hooks customizados
- Implementar lazy loading
- Usar React.memo para otimização
- Implementar error boundaries

### NestJS
- Seguir princípios SOLID
- Usar decorators para validação
- Implementar interceptors
- Usar guards para autorização

## Data de Criação
27/01/2025

## Última Atualização
27/01/2025
