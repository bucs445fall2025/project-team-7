import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();


async function main() {
const password = await bcrypt.hash("password123", 10);
const user = await prisma.user.upsert({
where: { email: "demo@binghamton.edu" },
create: { email: "demo@binghamton.edu", name: "Demo User", password },
update: {}
});


await prisma.item.createMany({
data: [
{ title: "Graphing Calculator", description: "TI‑84", location: "CIW", ownerId: user.id },
{ title: "Mini Vacuum", description: "Dorm clean‑up", location: "Hinman", ownerId: user.id }
]
});


console.log("Seeded ✓");
}


main().finally(() => prisma.$disconnect());