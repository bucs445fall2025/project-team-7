FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code (excluding .env files)
COPY . .
RUN rm -f .env .env.*

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Copy start scripts
COPY start.sh /app/start.sh
COPY start-prisma-studio.js /app/start-prisma-studio.js
RUN chmod +x /app/start.sh
RUN chmod +x /app/start-prisma-studio.js

<<<<<<< HEAD
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY prisma ./prisma
COPY package.json ./package.json
EXPOSE 8000
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/src/index.js"]
=======
# Expose ports
EXPOSE 8000 5555

# Start the application and Prisma Studio
CMD ["/app/start.sh"]
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
