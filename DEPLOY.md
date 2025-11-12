# 🚀 Deploy Automático - Guia Rápido

## 📋 Resumo

Este projeto está configurado para fazer deploy automático no servidor sempre que houver push na branch `master`.

## ⚡ Setup Rápido

### 1️⃣ No Servidor

Execute o script de configuração:

```bash
# SSH no servidor
ssh ocidog@seu-servidor

# Navegue até o projeto
cd /home/ocidog/ava-senai

# Execute o script de setup
bash scripts/setup-deploy.sh
```

O script irá:
- ✅ Configurar Git
- ✅ Gerar chave SSH
- ✅ Verificar permissões Docker
- ✅ Criar diretório de backups
- ✅ Exibir informações para GitHub Secrets

### 2️⃣ No GitHub

Configure os Secrets:

**Repositório → Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valor |
|--------|-------|
| `SERVER_HOST` | IP do servidor (ex: `192.168.1.100`) |
| `SERVER_USER` | Usuário SSH (ex: `ocidog`) |
| `SSH_PRIVATE_KEY` | Chave privada completa (copie do output do script) |
| `SERVER_PORT` | `22` (ou sua porta SSH) |
| `PROJECT_PATH` | `/home/ocidog/ava-senai` |

### 3️⃣ Testar

```bash
# No seu computador local
git add .
git commit -m "test: deploy automático"
git push origin master
```

Acompanhe em: **GitHub → Actions → Deploy to Server**

## 📁 Arquivos Criados

```
.github/
├── workflows/
│   ├── deploy.yml                    # Action principal (simples)
│   ├── deploy-advanced.yml.example   # Action avançada (com backup)
│   └── README.md                     # Documentação completa
scripts/
└── setup-deploy.sh                   # Script de configuração do servidor
```

## 🔧 Versões Disponíveis

### Versão Simples (Ativa)
- Arquivo: `.github/workflows/deploy.yml`
- Faz: Pull + Docker restart
- Uso: Deploy rápido e simples

### Versão Avançada (Exemplo)
- Arquivo: `.github/workflows/deploy-advanced.yml.example`
- Faz: Backup + Pull + Docker restart + Verificações
- Para ativar: Renomeie para `.yml` (remova `.example`)

## 🎯 Como Funciona

```mermaid
graph LR
    A[Push na master] --> B[GitHub Actions]
    B --> C[Conecta via SSH]
    C --> D[Git Pull]
    D --> E[Docker Restart]
    E --> F[Deploy Concluído]
```

## 📊 Monitoramento

### Ver logs do deploy
```bash
# No GitHub
Actions → Deploy to Server → Ver workflow

# No servidor
docker-compose logs -f
```

### Ver status dos containers
```bash
docker-compose ps
```

## 🔍 Troubleshooting

### Deploy falhou?

1. **Verifique os logs no GitHub Actions**
2. **SSH no servidor e verifique manualmente:**

```bash
cd /home/ocidog/ava-senai
git status
git pull origin master
docker-compose ps
```

### Erro de permissão SSH?

```bash
# No servidor
cat ~/.ssh/github_deploy

# Copie novamente para GitHub Secrets (SSH_PRIVATE_KEY)
```

### Containers não iniciam?

```bash
# Ver logs
docker-compose logs

# Reiniciar manualmente
docker-compose down
docker-compose up -d --build
```

## 🎨 Customização

### Alterar branch de deploy

Edite `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main  # ou develop, staging, etc
```

### Adicionar comandos extras

Edite o `script:` em `.github/workflows/deploy.yml`:

```yaml
script: |
  cd ${{ secrets.PROJECT_PATH }}
  git pull origin master
  
  # Seus comandos aqui
  npm install
  npm run build
  
  docker-compose down
  docker-compose up -d --build
```

## 📚 Documentação Completa

Veja: `.github/workflows/README.md`

## ✅ Checklist de Configuração

- [ ] Script `setup-deploy.sh` executado no servidor
- [ ] Chave SSH gerada e adicionada ao `authorized_keys`
- [ ] Secrets configurados no GitHub
- [ ] Permissões Docker verificadas
- [ ] Teste de deploy realizado
- [ ] Logs verificados

## 🆘 Suporte

Em caso de problemas:
1. Verifique os logs no GitHub Actions
2. SSH no servidor e teste manualmente
3. Consulte `.github/workflows/README.md`
4. Verifique se todos os Secrets estão corretos

---

**🎉 Pronto! Agora todo push na master faz deploy automático!**
