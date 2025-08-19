#!/bin/bash
set -e

echo "🚀 Iniciando instalação do AVA Sesi Senai..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"

# Verificar se estamos no diretório raiz do projeto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Execute este script no diretório raiz do projeto (onde está o docker-compose.yml)"
    exit 1
fi

echo "📁 Configurando arquivos de ambiente..."

# Preparar .env do backend
if [ -f "backend/.env-example" ]; then
    if [ ! -f "backend/.env" ]; then
        cp backend/.env-example backend/.env
        echo "✅ Arquivo backend/.env criado"
    else
        echo "⚠️  Arquivo backend/.env já existe, mantendo configuração atual"
    fi
else
    echo "❌ Arquivo backend/.env-example não encontrado"
    exit 1
fi

# Preparar .env do frontend (quando disponível)
if [ -d "frontend" ] && [ -f "frontend/.env-example" ]; then
    if [ ! -f "frontend/.env" ]; then
        cp frontend/.env-example frontend/.env
        echo "✅ Arquivo frontend/.env criado"
    else
        echo "⚠️  Arquivo frontend/.env já existe, mantendo configuração atual"
    fi
else
    echo "ℹ️  Frontend ainda não configurado, pulando..."
fi

echo "🐳 Iniciando containers..."

# Construir e iniciar containers
docker-compose up -d --build

echo "⏳ Aguardando serviços inicializarem..."
sleep 10

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "🎉 Instalação concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Execute as migrações: docker exec -it main-backend bash"
echo "2. Dentro do container: goose -dir migrations postgres \"postgres://postgres:postgres@postgres-sesi-senai:5432/sesi_senai?sslmode=disable\" up"
echo ""
echo "🌐 Serviços disponíveis:"
echo "- Backend API: http://localhost:9000"
echo "- PostgreSQL: localhost:5432"
echo "- MongoDB: localhost:27017"
echo "- Nginx: http://localhost:8732"
echo ""
echo "📝 Para ver logs: docker-compose logs -f"
echo "🛑 Para parar: docker-compose down"
