FROM node:20-alpine AS base

# 1. Dependencias
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Construcción
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar cliente de Prisma (necesita el esquema)
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# 3. Producción (Sin standalone, más estable para Prisma)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Copiar TODOS los node_modules (incluyendo Prisma completo)
COPY --from=builder /app/node_modules ./node_modules

# Copiar la aplicación compilada
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3002
ENV PORT 3002
ENV HOSTNAME "0.0.0.0"

# Usar el comando start normal de Next.js
CMD ["npm", "start"]