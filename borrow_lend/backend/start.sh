#!/bin/sh
# Load environment variables
set -a
[ -f .env ] && . .env
set +a

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database..."
npx tsx prisma/seed.ts || npm run seed || echo "⚠️  Seed failed, continuing..."

echo "🚀 Starting API..."
node dist/src/index.js &
sleep 3

echo "🎨 Starting Prisma Studio..."
# Start Prisma Studio with explicit environment variables
cd /app
export DATABASE_URL="${DATABASE_URL}"
npx prisma studio --hostname 0.0.0.0 --port 5555 --browser none --schema ./prisma/schema.prisma &
wait

