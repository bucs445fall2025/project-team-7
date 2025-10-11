# Multi-stage build
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || yarn || pnpm i
COPY . .
RUN npm run build


FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY prisma ./prisma
COPY package.json ./package.json
EXPOSE 8000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
