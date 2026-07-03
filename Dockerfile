FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm install --omit=dev

# Copia o restante dos arquivos do projeto (incluindo a pasta src)
COPY . .

EXPOSE 3000

# Inicia a aplicação apontando direto para o arquivo JavaScript
CMD ["node", "--watch", "server.js"]