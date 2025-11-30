FROM node:20-alpine

WORKDIR /app

# Copy package files
<<<<<<< HEAD
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

=======
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
