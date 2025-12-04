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
    // Create items if they don't exist
    const existingItems = await prisma.item.findMany({
        where: { ownerId: user.id }
    });
    if (existingItems.length === 0) {
        await prisma.item.createMany({
            data: [
                { title: "Graphing Calculator", description: "TI‑84", location: "CIW", ownerId: user.id },
                { title: "Mini Vacuum", description: "Dorm clean‑up", location: "Hinman", ownerId: user.id }
            ]
        });
    }
    // Create categories
    const categories = [
        { name: "Stationery", icon: "📝", description: "Pens, notebooks, and office supplies" },
        { name: "Cleaning Supplies", icon: "🧹", description: "Cleaning tools and products" },
        { name: "Home Items", icon: "🏠", description: "Household items and furniture" },
        { name: "Electronics", icon: "💻", description: "Electronic devices and accessories" },
        { name: "Automotive", icon: "🚗", description: "Car accessories and automotive supplies" }
    ];
    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            create: category,
            update: {}
        });
    }
    console.log("Seeded ✓");
}
main().finally(() => prisma.$disconnect());
