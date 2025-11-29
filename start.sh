#!/bin/bash

echo "🚀 Starting Borrow & Lend Project..."
echo ""

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start MySQL first
echo "📦 Starting MySQL..."
docker-compose up -d mysql

# Wait for MySQL to be healthy
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

# Run migrations
echo "🔄 Running database migrations..."
cd borrow_lend/backend
npx prisma migrate dev --name add_categories
cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Now you can start all services with:"
echo "  docker-compose up -d"
echo ""
echo "Or start in foreground with:"
echo "  docker-compose up"
