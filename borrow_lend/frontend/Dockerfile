FROM node:20-alpine

WORKDIR /app

# Build argument for API URL (defaults to localhost:8000)
ARG REACT_APP_API_URL=http://localhost:8000

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables (React needs these at build time)
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV HOST=0.0.0.0
ENV BROWSER=none

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
