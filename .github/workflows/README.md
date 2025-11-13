# GitHub Actions - Deploy Automático

## 📋 Descrição

Esta action realiza deploy automático no servidor sempre que houver push na branch `master`.

## 🔧 Configuração Necessária

### 1. Secrets do GitHub

Você precisa configurar os seguintes secrets no repositório GitHub:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `SERVER_HOST` | IP ou domínio do servidor | `192.168.1.100` ou `servidor.com` |
| `SERVER_USER` | Usuário SSH do servidor | `ocidog` |
| `SSH_PRIVATE_KEY` | Chave privada SSH (conteúdo completo) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_PORT` | Porta SSH (opcional, padrão: 22) | `22` |
| `PROJECT_PATH` | Caminho do projeto no servidor (opcional) | `/home/ocidog/ava-senai` |

### 2. Gerar Chave SSH (se não tiver)

No seu **servidor**:

```bash
# Gerar chave SSH (se não existir)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Adicionar chave pública ao authorized_keys
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys

# Exibir chave privada (copie todo o conteúdo)
cat ~/.ssh/github_deploy
```

**⚠️ IMPORTANTE**: Copie TODO o conteúdo da chave privada, incluindo:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### 3. Configurar Git no Servidor

No seu **servidor**, no diretório do projeto:

```bash
cd /home/ocidog/ava-senai

# Configurar Git para aceitar o diretório
git config --global --add safe.directory /home/ocidog/ava-senai

# Garantir que está na branch master
git checkout master

# Configurar para fazer pull sem conflitos
git config pull.rebase false
```

### 4. Permissões Docker (se necessário)

Se o usuário não tiver permissão para executar Docker:

```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker ocidog

# Relogar ou executar
newgrp docker
```

## 🚀 Como Funciona

1. **Trigger**: Push na branch `master`
2. **Conexão SSH**: Action conecta no servidor via SSH
3. **Git Pull**: Baixa as alterações do repositório
4. **Docker**: Reinicia os containers com as novas alterações
5. **Notificação**: Logs mostram o progresso

## 📝 Logs

Você pode acompanhar o deploy em:
- **GitHub**: Actions → Deploy to Server → Ver logs
- **Servidor**: `docker-compose logs -f`

## 🔍 Troubleshooting

### Erro: "Permission denied (publickey)"
- Verifique se a chave privada está correta no secret `SSH_PRIVATE_KEY`
- Confirme que a chave pública está em `~/.ssh/authorized_keys` no servidor

### Erro: "fatal: detected dubious ownership"
```bash
# No servidor
git config --global --add safe.directory /caminho/do/projeto
```

### Erro: "docker: permission denied"
```bash
# No servidor
sudo usermod -aG docker $USER
newgrp docker
```

### Erro: "git pull failed"
```bash
# No servidor, verificar se há conflitos
cd /home/ocidog/ava-senai
git status
git stash  # Se houver alterações locais
git pull origin master
```

## 🎯 Customização

### Alterar Branch de Deploy

Edite `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main  # ou outra branch
```

### Adicionar Notificações

Adicione steps para notificar Discord, Slack, etc:

```yaml
- name: Notify Discord
  if: success()
  run: |
    curl -X POST ${{ secrets.DISCORD_WEBHOOK }} \
      -H "Content-Type: application/json" \
      -d '{"content":"✅ Deploy realizado com sucesso!"}'
```

### Executar Comandos Adicionais

Adicione no script da action:

```yaml
script: |
  cd ${{ secrets.PROJECT_PATH }}
  git pull origin master
  
  # Seus comandos personalizados
  npm install
  npm run build
  
  docker-compose down
  docker-compose up -d --build
```

## 📚 Referências

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SSH Action](https://github.com/appleboy/ssh-action)
- [Docker Compose](https://docs.docker.com/compose/)
