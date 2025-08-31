# Technical Context - Docker Infrastructure

## Tecnologia
- **Nome**: Docker + Docker Compose
- **Versão**: Docker Compose v2
- **Propósito**: Containerização e orquestração dos serviços da aplicação

## Configuração
```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15-alpine
    container_name: store-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - "${DATABASE_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - store-network

  backend:
    build:
      context: ./infrastructure/backend
      dockerfile: Dockerfile
    container_name: store-backend
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV}
      PORT: ${BACKEND_PORT}
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "${BACKEND_PORT}:${BACKEND_PORT}"
    depends_on:
      - postgres
    networks:
      - store-network
    volumes:
      - ./infrastructure/backend/prisma:/app/prisma

  frontend:
    build:
      context: ./infrastructure/frontend
      dockerfile: Dockerfile
    container_name: store-frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: http://localhost:${BACKEND_PORT}
      VITE_VIACEP_API_URL: https://viacep.com.br/ws
      VITE_CONTACT_EMAIL: ${VITE_CONTACT_EMAIL}
    ports:
      - "${FRONTEND_PORT}:80"
    depends_on:
      - backend
    networks:
      - store-network
```

## Padrões de Uso
- Containerização de cada serviço
- Rede isolada para comunicação entre containers
- Volumes persistentes para dados
- Variáveis de ambiente para configuração
- Dependências entre serviços

## Dependências
- Docker Engine 20.10+
- Docker Compose 2.0+
- Arquivos .env para variáveis de ambiente

## Exemplos de Implementação
```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Melhores Práticas
- Usar multi-stage builds para otimização
- Implementar health checks
- Configurar restart policies
- Usar volumes para dados persistentes
- Isolar redes por ambiente
- Implementar logging centralizado
- Usar secrets para dados sensíveis

## Data de Criação
27/01/2025

## Última Atualização
27/01/2025
