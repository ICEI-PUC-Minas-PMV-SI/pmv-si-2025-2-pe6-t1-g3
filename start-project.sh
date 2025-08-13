#!/bin/bash

# Script de inicialização do projeto PMV-SI
# Este script inicializa todos os serviços necessários para o desenvolvimento

set -e  # Para o script se algum comando falhar

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
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

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para aguardar um serviço estar disponível
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    local max_attempts=30
    local attempt=1
    
    print_status "Aguardando $service_name estar disponível em $host:$port..."
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z "$host" "$port" 2>/dev/null; then
            print_success "$service_name está rodando em $host:$port"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Timeout aguardando $service_name"
    return 1
}

# Função para verificar dependências
check_dependencies() {
    print_status "Verificando dependências..."
    
    # Verificar Docker
    if ! command_exists docker; then
        print_error "Docker não está instalado ou não está no PATH"
        print_error "Por favor, instale o Docker Desktop e ative a integração WSL2"
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
        print_error "Docker Compose não está disponível"
        exit 1
    fi
    
    # Verificar Node.js
    if ! command_exists node; then
        print_error "Node.js não está instalado"
        exit 1
    fi
    
    # Verificar npm
    if ! command_exists npm; then
        print_error "npm não está instalado"
        exit 1
    fi
    
    print_success "Todas as dependências estão instaladas"
}

# Função para parar serviços existentes
stop_existing_services() {
    print_status "Parando serviços existentes..."
    
    # Parar containers Docker existentes
    if docker ps -q | grep -q .; then
        docker stop $(docker ps -q) 2>/dev/null || true
    fi
    
    # Parar processos Node.js existentes nas portas 3000 e 5173
    if lsof -ti:3000 >/dev/null 2>&1; then
        print_warning "Parando processo na porta 3000 (backend)"
        kill -9 $(lsof -ti:3000) 2>/dev/null || true
    fi
    
    if lsof -ti:5173 >/dev/null 2>&1; then
        print_warning "Parando processo na porta 5173 (frontend)"
        kill -9 $(lsof -ti:5173) 2>/dev/null || true
    fi
    
    print_success "Serviços existentes parados"
}

# Função para inicializar Docker Compose
start_docker_compose() {
    print_status "Iniciando Docker Compose..."
    
    cd infrastructure/local-environment
    
    # Remover containers existentes
    docker-compose down -v 2>/dev/null || true
    
    # Iniciar serviços
    docker-compose up -d
    
    # Aguardar PostgreSQL estar disponível
    wait_for_service "localhost" "9080" "PostgreSQL"
    
    cd ../..
    print_success "Docker Compose iniciado com sucesso"
}

# Função para instalar dependências do backend
install_backend_dependencies() {
    print_status "Instalando dependências do backend..."
    
    cd infrastructure/backend
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Dependências do backend instaladas"
    else
        print_status "Dependências do backend já estão instaladas"
    fi
    
    cd ../..
}

# Função para instalar dependências do frontend
install_frontend_dependencies() {
    print_status "Instalando dependências do frontend..."
    
    cd infrastructure/frontend
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Dependências do frontend instaladas"
    else
        print_status "Dependências do frontend já estão instaladas"
    fi
    
    cd ../..
}

# Função para iniciar o backend
start_backend() {
    print_status "Iniciando backend..."
    
    cd infrastructure/backend
    
    # Iniciar backend em background
    npm run start:dev > ../../backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Aguardar backend estar disponível
    wait_for_service "localhost" "3000" "Backend"
    
    cd ../..
    print_success "Backend iniciado com PID: $BACKEND_PID"
}

# Função para iniciar o frontend
start_frontend() {
    print_status "Iniciando frontend..."
    
    cd infrastructure/frontend
    
    # Iniciar frontend em background
    npm run dev > ../../frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Aguardar frontend estar disponível
    wait_for_service "localhost" "5173" "Frontend"
    
    cd ../..
    print_success "Frontend iniciado com PID: $FRONTEND_PID"
}

# Função para mostrar status dos serviços
show_status() {
    echo ""
    echo "=========================================="
    echo "           STATUS DOS SERVIÇOS            "
    echo "=========================================="
    echo ""
    
    # Status do Docker
    if docker ps | grep -q postgres; then
        echo -e "${GREEN}✓ Docker Compose:${NC} Rodando"
    else
        echo -e "${RED}✗ Docker Compose:${NC} Parado"
    fi
    
    # Status do Backend
    if lsof -ti:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend:${NC} Rodando em http://localhost:3000"
    else
        echo -e "${RED}✗ Backend:${NC} Parado"
    fi
    
    # Status do Frontend
    if lsof -ti:5173 >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend:${NC} Rodando em http://localhost:5173"
    else
        echo -e "${RED}✗ Frontend:${NC} Parado"
    fi
    
    echo ""
    echo "=========================================="
    echo "              LINKS ÚTEIS                "
    echo "=========================================="
    echo "Backend API:     http://localhost:3000"
    echo "Frontend:        http://localhost:5173"
    echo "Documentação:    http://localhost:3000/api"
    echo "PostgreSQL:      localhost:9080"
    echo ""
    echo "Logs do Backend: ./backend.log"
    echo "Logs do Frontend: ./frontend.log"
    echo ""
}

# Função para limpeza ao sair
cleanup() {
    print_status "Limpando recursos..."
    
    # Parar processos em background
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Parar Docker Compose
    cd infrastructure/local-environment
    docker-compose down 2>/dev/null || true
    cd ../..
    
    print_success "Limpeza concluída"
}

# Configurar trap para limpeza ao sair
trap cleanup EXIT INT TERM

# Função principal
main() {
    echo "=========================================="
    echo "    INICIALIZADOR DO PROJETO PMV-SI      "
    echo "=========================================="
    echo ""
    
    # Verificar dependências
    check_dependencies
    
    # Parar serviços existentes
    stop_existing_services
    
    # Iniciar Docker Compose
    start_docker_compose
    
    # Instalar dependências
    install_backend_dependencies
    install_frontend_dependencies
    
    # Iniciar serviços
    start_backend
    start_frontend
    
    # Mostrar status final
    show_status
    
    print_success "Projeto inicializado com sucesso!"
    print_status "Pressione Ctrl+C para parar todos os serviços"
    
    # Manter script rodando
    while true; do
        sleep 1
    done
}

# Executar função principal
main "$@" 