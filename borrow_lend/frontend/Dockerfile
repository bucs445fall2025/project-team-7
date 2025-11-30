FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Expose port 3000
EXPOSE 3000

# Set environment variable for React to bind to all interfaces
ENV HOST=0.0.0.0
# Disable automatic browser opening
ENV BROWSER=none

# Start the development server
CMD ["npm", "start"]

