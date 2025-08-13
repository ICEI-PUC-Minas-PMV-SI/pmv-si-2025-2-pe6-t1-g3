#!/bin/bash

# Script de inicialização do projeto PMV-SI com Docker
# Este script inicializa toda a stack usando Docker Compose

set -e  # Para o script se algum comando falhar

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

print_header() {
    echo -e "${PURPLE}[DOCKER]${NC} $1"
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
    local max_attempts=60
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
    print_status "Verificando dependências para Docker..."
    
    # Verificar Docker
    if ! command_exists docker; then
        print_error "Docker não está instalado ou não está no PATH"
        print_error "Por favor, instale o Docker Desktop e ative a integração WSL2"
        print_error "Download: https://docs.docker.com/desktop/"
        exit 1
    fi
    
    # Verificar se Docker está rodando
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker não está rodando"
        print_error "Por favor, inicie o Docker Desktop"
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
        print_error "Docker Compose não está disponível"
        exit 1
    fi
    
    print_success "Docker e Docker Compose estão disponíveis"
}

# Função para verificar .env
check_env_file() {
    print_status "Verificando arquivo de configuração..."
    
    if [ ! -f ".env" ]; then
        print_warning "Arquivo .env não encontrado"
        print_status "Criando .env a partir do .env.example..."
        
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Arquivo .env criado com configurações padrão"
            print_warning "IMPORTANTE: Revise o arquivo .env e altere as senhas padrão!"
        else
            print_error "Arquivo .env.example não encontrado"
            exit 1
        fi
    else
        print_success "Arquivo .env encontrado"
    fi
}

# Função para parar serviços existentes
stop_existing_services() {
    print_status "Parando containers existentes..."
    
    # Parar stack atual se estiver rodando
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Limpar volumes órfãos (opcional)
    docker volume prune -f 2>/dev/null || true
    
    print_success "Containers existentes parados"
}

# Função para fazer build das imagens
build_images() {
    print_header "Fazendo build das imagens Docker..."
    
    # Build das imagens com cache
    docker-compose build --parallel
    
    print_success "Build das imagens concluído"
}

# Função para inicializar a stack Docker
start_docker_stack() {
    print_header "Iniciando stack Docker..."
    
    # Iniciar serviços principais (sem nginx de produção)
    docker-compose up -d postgres redis
    
    # Aguardar PostgreSQL estar disponível
    wait_for_service "localhost" "9080" "PostgreSQL"
    
    # Iniciar backend
    docker-compose up -d backend
    wait_for_service "localhost" "3000" "Backend API"
    
    # Iniciar frontend
    docker-compose up -d frontend
    wait_for_service "localhost" "5173" "Frontend"
    
    # Iniciar Prisma Studio
    docker-compose up -d prisma-studio
    wait_for_service "localhost" "5555" "Prisma Studio"
    
    print_success "Stack Docker iniciada com sucesso"
}

# Função para mostrar logs em tempo real
show_logs() {
    print_status "Iniciando visualização de logs..."
    print_status "Pressione Ctrl+C para parar os logs (serviços continuarão rodando)"
    echo ""
    
    # Mostrar logs de todos os serviços
    docker-compose logs --follow --tail=100
}

# Função para mostrar status dos serviços
show_status() {
    echo ""
    echo "============================================================"
    echo "                    STATUS DOS SERVIÇOS                    "
    echo "============================================================"
    echo ""
    
    # Verificar status dos containers
    if docker-compose ps | grep -q "Up"; then
        docker-compose ps
    else
        print_error "Nenhum container está rodando"
        return 1
    fi
    
    echo ""
    echo "============================================================"
    echo "                      LINKS ÚTEIS                         "
    echo "============================================================"
    echo ""
    echo -e "${CYAN}🌐 Frontend (React):${NC}      http://localhost:5173"
    echo -e "${CYAN}🚀 Backend API:${NC}           http://localhost:3000"
    echo -e "${CYAN}📚 Documentação (Swagger):${NC} http://localhost:3000/api"
    echo -e "${CYAN}🗄️  Database Admin:${NC}       http://localhost:5555"
    echo -e "${CYAN}🗃️  PostgreSQL:${NC}           localhost:9080"
    echo -e "${CYAN}🔴 Redis:${NC}                localhost:6379"
    echo ""
    echo "============================================================"
    echo "                      COMANDOS ÚTEIS                      "
    echo "============================================================"
    echo ""
    echo "Ver logs:              docker-compose logs -f"
    echo "Parar stack:           docker-compose down"
    echo "Restart stack:         docker-compose restart"
    echo "Rebuild images:        docker-compose build --no-cache"
    echo "Limpar tudo:           docker-compose down -v --rmi all"
    echo ""
}

# Função para fazer health check
health_check() {
    print_status "Verificando saúde dos serviços..."
    
    local failed=0
    
    # Check PostgreSQL
    if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
        print_success "PostgreSQL: Saudável"
    else
        print_error "PostgreSQL: Não responsivo"
        failed=1
    fi
    
    # Check Backend
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        print_success "Backend API: Saudável"
    else
        print_error "Backend API: Não responsivo"
        failed=1
    fi
    
    # Check Frontend
    if curl -f http://localhost:5173 >/dev/null 2>&1; then
        print_success "Frontend: Saudável"
    else
        print_error "Frontend: Não responsivo"
        failed=1
    fi
    
    if [ $failed -eq 0 ]; then
        print_success "Todos os serviços estão saudáveis!"
        return 0
    else
        print_warning "Alguns serviços podem estar com problemas"
        return 1
    fi
}

# Função para limpeza ao sair
cleanup() {
    echo ""
    print_status "Limpeza iniciada..."
    print_status "Stack Docker continuará rodando em background"
    print_status "Para parar completamente, execute: docker-compose down"
    print_success "Script finalizado"
}

# Configurar trap para limpeza ao sair
trap cleanup EXIT INT TERM

# Função principal
main() {
    local mode=${1:-"start"}
    
    echo "============================================================"
    echo "           🐳 DOCKER STACK - PROJETO PMV-SI              "
    echo "============================================================"
    echo ""
    
    case $mode in
        "start"|"")
            check_dependencies
            check_env_file
            stop_existing_services
            build_images
            start_docker_stack
            
            echo ""
            print_success "🎉 Stack Docker iniciada com sucesso!"
            show_status
            
            echo ""
            print_status "Executando health check em 10 segundos..."
            sleep 10
            health_check
            
            echo ""
            print_status "Para ver logs em tempo real, execute:"
            echo "docker-compose logs -f"
            echo ""
            print_status "Pressione Ctrl+C para sair (serviços continuarão rodando)"
            
            # Manter script rodando para logs
            while true; do
                sleep 5
                if ! docker-compose ps | grep -q "Up"; then
                    print_error "Alguns containers pararam. Verificando..."
                    show_status
                    break
                fi
            done
            ;;
            
        "stop")
            print_status "Parando stack Docker..."
            docker-compose down
            print_success "Stack parada"
            ;;
            
        "restart")
            print_status "Reiniciando stack Docker..."
            docker-compose restart
            print_success "Stack reiniciada"
            show_status
            ;;
            
        "logs")
            show_logs
            ;;
            
        "status")
            show_status
            health_check
            ;;
            
        "clean")
            print_warning "Limpando tudo (containers, volumes, imagens)..."
            read -p "Tem certeza? Esta ação não pode ser desfeita. (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                docker-compose down -v --rmi all
                docker system prune -f
                print_success "Limpeza concluída"
            else
                print_status "Limpeza cancelada"
            fi
            ;;
            
        "help"|"-h"|"--help")
            echo "Uso: $0 [comando]"
            echo ""
            echo "Comandos disponíveis:"
            echo "  start     - Inicia a stack Docker (padrão)"
            echo "  stop      - Para todos os containers"
            echo "  restart   - Reinicia todos os containers"
            echo "  logs      - Mostra logs em tempo real"
            echo "  status    - Mostra status dos serviços"
            echo "  clean     - Remove tudo (containers, volumes, imagens)"
            echo "  help      - Mostra esta ajuda"
            echo ""
            ;;
            
        *)
            print_error "Comando inválido: $mode"
            print_status "Execute '$0 help' para ver comandos disponíveis"
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@" 