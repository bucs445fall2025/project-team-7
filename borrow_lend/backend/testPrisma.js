import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // CREATE
  const newUser = await prisma.user.create({
    data: { name: 'Hoyeon Yoo', email: 'hoyeon@example.com', password: '123'},
  });
  console.log('Created:', newUser);

  // READ
  const allUsers = await prisma.user.findMany();
  console.log('All users:', allUsers);

  // UPDATE
  const updatedUser = await prisma.user.update({
    where: { id: newUser.id },
    data: { name: 'Hoyeon Y.' },
  });
  console.log('Updated:', updatedUser);

  // DELETE
  const deletedUser = await prisma.user.delete({
    where: { id: newUser.id },
  });
  console.log('Deleted:', deletedUser);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
