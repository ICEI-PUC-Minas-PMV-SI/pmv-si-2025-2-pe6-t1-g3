#!/bin/bash

# Script de desenvolvimento sem Docker
# Para desenvolvedores que preferem rodar localmente

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[DEV]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar dependências
check_dependencies() {
    print_status "Verificando dependências para desenvolvimento local..."
    
    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js não encontrado. Instale Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm >/dev/null 2>&1; then
        print_error "npm não encontrado"
        exit 1
    fi
    
    if ! command -v docker >/dev/null 2>&1; then
        print_error "Docker não encontrado (necessário apenas para PostgreSQL)"
        exit 1
    fi
    
    print_success "Dependências OK"
}

# Iniciar apenas PostgreSQL via Docker
start_database() {
    print_status "Iniciando PostgreSQL via Docker..."
    
    cd infrastructure/local-environment
    docker-compose up -d postgres
    cd ../..
    
    print_success "PostgreSQL iniciado"
}

# Instalar dependências
install_deps() {
    print_status "Instalando dependências..."
    
    cd infrastructure/backend
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    cd ../..
    
    cd infrastructure/frontend
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    cd ../..
    
    print_success "Dependências instaladas"
}

# Rodar migrations
run_migrations() {
    print_status "Executando migrations..."
    
    cd infrastructure/backend
    npx prisma migrate dev
    cd ../..
    
    print_success "Migrations executadas"
}

# Iniciar backend
start_backend() {
    print_status "Iniciando backend em desenvolvimento..."
    
    cd infrastructure/backend
    npm run start:dev &
    BACKEND_PID=$!
    cd ../..
    
    print_success "Backend iniciado (PID: $BACKEND_PID)"
}

# Iniciar frontend
start_frontend() {
    print_status "Iniciando frontend em desenvolvimento..."
    
    cd infrastructure/frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ../..
    
    print_success "Frontend iniciado (PID: $FRONTEND_PID)"
}

# Cleanup
cleanup() {
    print_status "Parando serviços..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    print_success "Cleanup concluído"
}

trap cleanup EXIT INT TERM

# Main
main() {
    echo "============================================"
    echo "       DESENVOLVIMENTO LOCAL - PMV-SI      "
    echo "============================================"
    echo ""
    
    check_dependencies
    start_database
    install_deps
    
    sleep 5
    run_migrations
    
    start_backend
    sleep 5
    start_frontend
    
    echo ""
    print_success "Ambiente de desenvolvimento iniciado!"
    echo ""
    echo "🌐 Frontend: http://localhost:5173"
    echo "🚀 Backend:  http://localhost:3000"
    echo "📚 Docs:     http://localhost:3000/api"
    echo ""
    print_status "Pressione Ctrl+C para parar"
    
    while true; do
        sleep 1
    done
}

main "$@"