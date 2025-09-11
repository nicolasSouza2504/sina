# Base image com Node 22 (Debian)
FROM node:22

# Diretório de trabalho
WORKDIR /app

# Copia apenas os manifests para leverage de cache
COPY package.json ./

# Copia o entrypoint e dá permissão
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copia o restante do projeto
COPY . .

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
