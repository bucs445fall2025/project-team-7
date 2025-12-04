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

# Expose ports
EXPOSE 8000 5555

# Start the application and Prisma Studio
CMD ["/app/start.sh"]
