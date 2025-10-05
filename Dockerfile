# Etapa 1: build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: producción
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# No copiamos .env, las variables se definen en Render
EXPOSE 3000
CMD ["node", "dist/main.js"]
