import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const users = await prisma.user.findMany();
    const categories = await prisma.category.findMany();
    const requests = await prisma.borrowRequest.findMany();
    
    console.log('USERS:', users.length, users);
    console.log('CATEGORIES:', categories.length, categories);
    console.log('REQUESTS:', requests.length, requests);
  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();







