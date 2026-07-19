FROM node:20-alpine AS base

# 1. Dependencias
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Construcción
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 🌟 TRUCO: URL ficticia para que Prisma no falle durante el build de Next.js
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"

# Generar cliente con ruta explícita
RUN npx prisma generate --schema=./prisma/schema.prisma

# Limpiar caché de Next.js para evitar conflictos
RUN rm -rf .next
RUN npm run build

# 3. Producción
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos de Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 🌟 CRUCIAL: Copiar el esquema Y el cliente de Prisma generado a la imagen final
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3002
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]