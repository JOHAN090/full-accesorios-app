# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para compilar NestJS)
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar la aplicación de NestJS
RUN npm run build

# Stage 2: Producción
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar dependencias de producción
COPY package*.json ./
RUN npm install --only=production

# Copiar la carpeta dist generada en la fase anterior
COPY --from=builder /usr/src/app/dist ./dist

# Crear la carpeta de uploads para asegurar que exista (con permisos)
RUN mkdir -p uploads

# Exponer el puerto
EXPOSE 3001

# Iniciar la aplicación
CMD ["node", "dist/main"]
