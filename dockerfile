FROM node:20-alpine

WORKDIR /app

# 1. Instalar dependencias
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Copiar el resto del código
COPY . .

# 3. Generar el cliente de Prisma y construir la app
RUN npx prisma generate
RUN npm run build

# 4. Configurar entorno de producción y permisos
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3002
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]