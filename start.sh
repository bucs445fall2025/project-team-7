#!/bin/bash

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

