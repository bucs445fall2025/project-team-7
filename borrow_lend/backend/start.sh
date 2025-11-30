#!/bin/sh
# Load environment variables
set -a
[ -f .env ] && . .env
set +a

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database..."
# Seed is optional - if it fails, continue anyway (database might already be seeded)
npm run seed 2>/dev/null || npx tsx prisma/seed.ts 2>/dev/null || echo "⚠️  Seed skipped (optional - database may already be seeded)"

echo "🚀 Starting API..."
node dist/src/index.js &
sleep 3

echo "🎨 Starting Prisma Studio..."
# Start Prisma Studio with explicit environment variables
cd /app
export DATABASE_URL="${DATABASE_URL}"
npx prisma studio --hostname 0.0.0.0 --port 5555 --browser none --schema ./prisma/schema.prisma &
wait

