#!/bin/bash

# Script para gerenciar migrações do AVA Sesi Senai
# Uso: ./scripts/migrate.sh [comando]

set -e

# Configurações
CONTAINER_NAME="main-backend"
DB_URL="postgres://postgres:postgres@postgres-sesi-senai:5432/sesi_senai?sslmode=disable"
MIGRATIONS_DIR="migrations"

# Função para mostrar ajuda
show_help() {
    echo "🗄️  Gerenciador de Migrações - AVA Sesi Senai"
    echo ""
    echo "Uso: ./scripts/migrate.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  up          - Executar todas as migrações pendentes"
    echo "  down        - Reverter última migração"
    echo "  reset       - Reverter todas as migrações (DROP)"
    echo "  status      - Verificar status das migrações"
    echo "  create      - Criar nova migração (ex: ./scripts/migrate.sh create create_users_table)"
    echo "  help        - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./scripts/migrate.sh up"
    echo "  ./scripts/migrate.sh status"
    echo "  ./scripts/migrate.sh create add_user_roles"
}

# Verificar se o container está rodando
check_container() {
    if ! docker ps | grep -q $CONTAINER_NAME; then
        echo "❌ Container $CONTAINER_NAME não está rodando."
        echo "Execute: docker-compose up -d"
        exit 1
    fi
}

# Executar comando goose
run_goose() {
    local command=$1
    docker exec -it $CONTAINER_NAME goose -dir $MIGRATIONS_DIR postgres "$DB_URL" $command
}

# Função principal
main() {
    local command=${1:-help}
    
    case $command in
        "up")
            echo "🔄 Executando migrações pendentes..."
            check_container
            run_goose "up"
            ;;
        "down")
            echo "⬇️  Revertendo última migração..."
            check_container
            run_goose "down"
            ;;
        "reset")
            echo "🗑️  Revertendo todas as migrações..."
            check_container
            run_goose "down-to 0"
            ;;
        "status")
            echo "📊 Verificando status das migrações..."
            check_container
            run_goose "status"
            ;;
        "create")
            local migration_name=$2
            if [ -z "$migration_name" ]; then
                echo "❌ Nome da migração é obrigatório."
                echo "Exemplo: ./scripts/migrate.sh create create_users_table"
                exit 1
            fi
            echo "📝 Criando nova migração: $migration_name"
            check_container
            run_goose "create $migration_name sql"
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Executar função principal
main "$@"