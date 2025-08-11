# 🎓 AVA Sesi Senai

**Sistema de Controle de Conteúdo com Gamificação, IA e Integração Multinível**

> Projeto de TCC – Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas  
> UNISENAI Joinville – 2025

---

## 📘 Sobre o Projeto

O **AVA** é uma plataforma web educacional gamificada e inteligente, desenvolvida como Trabalho de Conclusão de Curso (TCC) no curso de ADS da UniSenai Joinville.

A proposta do sistema é promover **engajamento estudantil**, **organização pedagógica** e **melhoria no desempenho acadêmico**, através da integração entre professores e alunos ao longo dos seis semestres do curso, com o apoio de tecnologias como **IA**, **dashboards personalizados**, **notificações inteligentes** e **gamificação avançada**.

---

## 🎯 Objetivos

- Auxiliar professores no gerenciamento eficiente de conteúdos, atividades e avaliações.
- Estimular o engajamento dos alunos por meio de missões, conquistas e rankings.
- Personalizar trilhas de aprendizado com o suporte de um assistente baseado em IA.
- Fomentar a colaboração e a competição saudável entre turmas e semestres.
- Promover uma visão gerencial e estratégica da aprendizagem via dashboards.

## 🛠 Tecnologias Utilizadas (Propostas)

- **Backend**: Golang (Gin, Bun ORM )
- **Banco de Dados**: PostgreSQL
- **Frontend**: Vue.js 
- **IA / Feedbacks**: OpenAI API / HuggingFace
- **Notificações**: Firebase Cloud Messaging (FCM)
- **Infraestrutura**: Docker + VPS (Ubuntu)
- **Videoconferência**: Jitsi Meet / Daily.co
- **Exportação**: PDF, CSV e relatórios interativos

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Docker ou Docker Compose instalados
- Git

### 🪟 Windows WSL (Windows Subsystem for Linux)

Se você está usando Windows, recomendamos usar o WSL2 para uma melhor experiência de desenvolvimento:

#### 1. Instalar WSL2

```powershell
# No PowerShell como administrador
wsl --install
```

#### 2. Instalar Docker Desktop para Windows

1. Baixe o [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Durante a instalação, certifique-se de marcar "Use WSL 2 based engine"
3. Reinicie o computador após a instalação

#### 3. Configurar WSL2 com Docker

```bash
# No terminal WSL
sudo apt update
sudo apt install docker.io docker-compose

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar o terminal WSL ou executar:
newgrp docker
```

#### 4. Clonar e Executar o Projeto

```bash
# No terminal WSL
cd /mnt/c/Users/seu_usuario/Documents/  # ou onde você quer o projeto
git clone <url-do-repositorio> ava-senai
cd ava-senai

# Executar instalação
chmod +x scripts/install.sh
./scripts/install.sh
```

#### 5. Comandos Úteis no WSL

```bash
# Verificar se Docker está funcionando
docker --version
docker-compose --version

# Iniciar containers
docker-compose up -d

# Executar migrações
chmod +x scripts/migrate.sh
./scripts/migrate.sh up

# Acessar logs
docker-compose logs -f
```

#### 6. Troubleshooting WSL

**Problema**: Docker não inicia no WSL
```bash
# Verificar se o serviço Docker está rodando
sudo service docker status

# Iniciar o serviço Docker
sudo service docker start

# Configurar para iniciar automaticamente
sudo systemctl enable docker
```

**Problema**: Erro de permissão ao executar Docker
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Reiniciar o terminal ou executar:
newgrp docker
```

**Problema**: Containers não conseguem se conectar
```bash
# Verificar se as portas estão disponíveis
netstat -tulpn | grep :5432
netstat -tulpn | grep :27017
netstat -tulpn | grep :9000

# Parar containers e reiniciar
docker-compose down
docker-compose up -d
```

**Problema**: Performance lenta no WSL
```bash
# Verificar versão do WSL
wsl --list --verbose

# Se estiver usando WSL1, migrar para WSL2
wsl --set-version Ubuntu-20.04 2
```

### Scripts de Instalação

#### 1. Script Automatizado (Recomendado)

```bash
# Execute o script de instalação
chmod +x scripts/install.sh
./scripts/install.sh
```

#### 2. Configuração Manual

```bash
# Copiar arquivos de ambiente
cp backend/.env-example backend/.env
cp frontend/.env-example frontend/.env  # Quando o frontend estiver disponível
```

### Executando os Containers

```bash
# Construir e iniciar todos os serviços
docker-compose up -d

# Verificar status dos containers
docker-compose ps

# Visualizar logs em tempo real
docker-compose logs -f
```

### Acessando os Serviços

- **Backend API**: http://localhost:9000
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Nginx**: http://localhost:8732

---

## 🗄️ Gerenciamento de Migrações

### Script de Migração (Recomendado)

O projeto inclui um script automatizado para gerenciar migrações:

```bash
# Tornar o script executável (primeira vez)
chmod +x scripts/migrate.sh

# Executar todas as migrações pendentes
./scripts/migrate.sh up

# Verificar status das migrações
./scripts/migrate.sh status

# Reverter última migração
./scripts/migrate.sh down

# Reverter todas as migrações (DROP)
./scripts/migrate.sh reset

# Criar nova migração
./scripts/migrate.sh create nome_da_migracao

# Ver ajuda completa
./scripts/migrate.sh help
```

### Acessando o Container do Backend

```bash
# Acessar o container do backend
docker exec -it main-backend bash
```

### Comandos Goose para Migrações

#### Executar Migrações Pendentes
```bash
# Dentro do container
goose -dir migrations postgres "postgres://postgres:postgres@postgres-sesi-senai:5432/sesi_senai?sslmode=disable" up
```

#### Reverter Última Migração
```bash
# Dentro do container
goose -dir migrations postgres "postgres://postgres:postgres@postgres-sesi-senai:5432/sesi_senai?sslmode=disable" down
```

#### Reverter Todas as Migrações (DROP)
```bash
# Dentro do container
goose -dir migrations postgres "postgres://postgres:postgres@postgres-sesi-senai:5432/sesi_senai?sslmode=disable" down-to 0
```

#### Verificar Status das Migrações
```bash
# Dentro do container
goose -dir migrations postgres "postgres://postgres:postgres@postgres-sesi-senai:5432/sesi_senai?sslmode=disable" status
```

#### Executar Migração Específica
```bash
# Dentro do container
goose -dir migrations postgres "postgres://postgres:postgres@postgres-sesi-senai:5432/sesi_senai?sslmode=disable" up-by-one
```

### Migrações Disponíveis

- `20250808184303_create_roles_table.sql` - Criação da tabela de roles
- `20250808184316_add_roles_seed.sql` - Inserção de dados iniciais (Admin, Professor, Student)

---

## 📈 Metodologia de Desenvolvimento

- 📋 Kanban com sprints quinzenais
- ✅ Testes de unidade, integração, estresse e regressão
- 🔐 Foco em segurança, performance e escalabilidade
- 🔎 Relatórios de uso e dashboards por perfil

---

## 📁 Estrutura de Entregas

- Código-fonte versionado (GitHub privado)
- Documentação técnica e manual do usuário
- Banco de dados com dados simulados
- Slides para apresentação de banca
- Anexo com propostas futuras (mobile, API pública, diagnóstico com IA)

---

## 📄 Licença

Projeto acadêmico sem fins lucrativos.  
Distribuído sob a licença [MIT](https://opensource.org/licenses/MIT).

---

## 👨‍🏫 Desenvolvido por

Alunos do curso de ADS – UNISENAI Joinville  
Julho a Dezembro / 2025  
