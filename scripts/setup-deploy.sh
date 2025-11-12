#!/bin/bash

# Script de configuração inicial para deploy automático
# Execute este script NO SERVIDOR

set -e

echo "=========================================="
echo "🔧 Configuração de Deploy Automático"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variáveis
PROJECT_PATH="${1:-/home/ocidog/ava-senai}"
SSH_KEY_NAME="github_deploy"

echo -e "${YELLOW}📂 Diretório do projeto: $PROJECT_PATH${NC}"

# Verificar se o diretório existe
if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}❌ Diretório não encontrado: $PROJECT_PATH${NC}"
    exit 1
fi

cd "$PROJECT_PATH"

# 1. Configurar Git
echo ""
echo "1️⃣  Configurando Git..."
git config --global --add safe.directory "$PROJECT_PATH"
git config pull.rebase false

# Verificar branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ]; then
    echo -e "${YELLOW}⚠️  Branch atual: $CURRENT_BRANCH${NC}"
    read -p "Deseja fazer checkout para master? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout master
    fi
fi

echo -e "${GREEN}✅ Git configurado${NC}"

# 2. Gerar chave SSH (se não existir)
echo ""
echo "2️⃣  Configurando chave SSH..."

if [ -f "$HOME/.ssh/$SSH_KEY_NAME" ]; then
    echo -e "${YELLOW}⚠️  Chave SSH já existe: $HOME/.ssh/$SSH_KEY_NAME${NC}"
    read -p "Deseja gerar uma nova chave? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Usando chave existente..."
    else
        ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$HOME/.ssh/$SSH_KEY_NAME" -N ""
    fi
else
    ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$HOME/.ssh/$SSH_KEY_NAME" -N ""
fi

# Adicionar chave pública ao authorized_keys
if ! grep -q "github-actions-deploy" "$HOME/.ssh/authorized_keys" 2>/dev/null; then
    cat "$HOME/.ssh/$SSH_KEY_NAME.pub" >> "$HOME/.ssh/authorized_keys"
    chmod 600 "$HOME/.ssh/authorized_keys"
    echo -e "${GREEN}✅ Chave pública adicionada ao authorized_keys${NC}"
else
    echo -e "${YELLOW}⚠️  Chave já está no authorized_keys${NC}"
fi

# 3. Verificar permissões Docker
echo ""
echo "3️⃣  Verificando permissões Docker..."

if groups | grep -q docker; then
    echo -e "${GREEN}✅ Usuário já tem permissão Docker${NC}"
else
    echo -e "${YELLOW}⚠️  Usuário não tem permissão Docker${NC}"
    echo "Execute: sudo usermod -aG docker $USER"
    echo "Depois: newgrp docker"
fi

# 4. Criar diretório de backups
echo ""
echo "4️⃣  Criando diretório de backups..."
mkdir -p "$HOME/backups/ava-senai"
echo -e "${GREEN}✅ Diretório de backups criado${NC}"

# 5. Testar Docker Compose
echo ""
echo "5️⃣  Testando Docker Compose..."
if docker-compose --version > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker Compose instalado${NC}"
else
    echo -e "${RED}❌ Docker Compose não encontrado${NC}"
    echo "Instale com: sudo apt install docker-compose"
fi

# 6. Exibir informações para GitHub Secrets
echo ""
echo "=========================================="
echo "📋 INFORMAÇÕES PARA GITHUB SECRETS"
echo "=========================================="
echo ""
echo -e "${YELLOW}Copie estas informações para os Secrets do GitHub:${NC}"
echo ""
echo "1. SERVER_HOST:"
echo "   $(hostname -I | awk '{print $1}')"
echo ""
echo "2. SERVER_USER:"
echo "   $USER"
echo ""
echo "3. SERVER_PORT:"
echo "   22"
echo ""
echo "4. PROJECT_PATH:"
echo "   $PROJECT_PATH"
echo ""
echo "5. SSH_PRIVATE_KEY:"
echo "   (Copie TODO o conteúdo abaixo, incluindo as linhas BEGIN e END)"
echo ""
echo "----------------------------------------"
cat "$HOME/.ssh/$SSH_KEY_NAME"
echo "----------------------------------------"
echo ""
echo -e "${GREEN}✅ Configuração concluída!${NC}"
echo ""
echo "📚 Próximos passos:"
echo "1. Copie a chave privada acima para GitHub Secrets (SSH_PRIVATE_KEY)"
echo "2. Configure os outros secrets no GitHub"
echo "3. Faça um push na branch master para testar"
echo ""
echo "=========================================="
