# Etapa de build
FROM node:18-alpine AS builder
WORKDIR /app

# Só copiamos package.json e lockfile para instalar deps
COPY package.json package-lock.json* ./
RUN npm ci --production=false

# Copiamos o resto do código e buildamos
COPY . .
RUN npm run build

# Etapa de produção
FROM nginx:stable-alpine
# Removemos configuração default do nginx e colocamos a nossa
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copiamos os arquivos estáticos gerados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
