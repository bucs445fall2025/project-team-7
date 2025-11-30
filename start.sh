#!/bin/bash

<<<<<<< HEAD
echo "🚀 Borrow and Lend - Başlatılıyor..."
echo ""

# Docker'ın çalışıp çalışmadığını kontrol et
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker çalışmıyor! Lütfen Docker Desktop'ı başlatın."
    exit 1
fi

echo "✅ Docker çalışıyor"
echo ""

# Servisleri başlat
echo "📦 Docker servisleri başlatılıyor..."
docker-compose up -d

echo ""
echo "⏳ Servislerin hazır olması bekleniyor..."
sleep 5

# Servislerin durumunu kontrol et
echo ""
echo "📊 Servis Durumu:"
docker-compose ps

echo ""
echo "✅ Servisler başlatıldı!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo "📊 Prisma Studio: http://localhost:5555"
echo ""

=======
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
>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c
