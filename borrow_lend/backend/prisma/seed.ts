import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();


async function main() {
try {
console.log("Starting seed...");

const password = await bcrypt.hash("password123", 10);
const user = await prisma.user.upsert({
where: { email: "demo@binghamton.edu" },
create: { email: "demo@binghamton.edu", name: "Demo User", password },
update: {}
});
console.log("Demo user created/updated");

// Delete duplicate/old categories (only if they have no requests)
const duplicateCategories = ["Clothing", "Sports", "Tools", "Home Items"];
for (const name of duplicateCategories) {
try {
const category = await prisma.category.findUnique({ where: { name } });
if (category) {
const requestCount = await prisma.borrowRequest.count({ where: { categoryId: category.id } });
if (requestCount === 0) {
await prisma.category.delete({ where: { id: category.id } });
console.log(`Deleted duplicate category: ${name}`);
}
}
} catch (error: any) {
// Ignore errors when deleting duplicates
console.log(`Skipped deleting category ${name}: ${error?.message || error}`);
}
}

// Create/update categories
const categoryData = [
{ name: "Electronics", icon: "📱", description: "Phones, laptops, calculators, and other electronic devices" },
{ name: "Books", icon: "📚", description: "Textbooks, novels, study guides, and reference materials" },
{ name: "Sports & Fitness", icon: "⚽", description: "Sports equipment, gym gear, and fitness accessories" },
{ name: "Clothing & Accessories", icon: "👕", description: "Clothes, shoes, bags, and fashion accessories" },
{ name: "Home & Living", icon: "🏠", description: "Furniture, kitchen items, and dorm essentials" },
{ name: "Tools & Equipment", icon: "🔧", description: "Hand tools, power tools, and equipment for projects" },
{ name: "Transportation", icon: "🚲", description: "Bikes, scooters, and transportation accessories" },
{ name: "Entertainment", icon: "🎮", description: "Games, movies, music equipment, and entertainment items" },
{ name: "School Supplies", icon: "✏️", description: "Pens, notebooks, binders, and other school essentials" },
{ name: "Other", icon: "📦", description: "Miscellaneous items that don't fit other categories" }
];

for (const category of categoryData) {
await prisma.category.upsert({
where: { name: category.name },
create: category,
update: {}
});
}
console.log("Categories created/updated");

// Create items if they don't exist
const existingItems = await prisma.item.findMany({
where: { ownerId: user.id }
});

if (existingItems.length === 0) {
await prisma.item.createMany({
data: [
{ title: "Graphing Calculator", description: "TI‑84", location: "CIW", ownerId: user.id },
{ title: "Mini Vacuum", description: "Dorm clean‑up", location: "Hinman", ownerId: user.id }
],
skipDuplicates: true
});
<<<<<<< HEAD
console.log("Items created");
=======
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

>>>>>>> f53064f1b463130d6a7e70a189454ae23a4f718c

console.log("Seeded ✓");
} catch (error: any) {
console.error("Seed failed:", error?.message || error);
console.error("Full error:", error);
throw error;
}
}


main()
.catch((error: any) => {
console.error("Seed execution failed:", error?.message || error);
console.error("Stack:", error?.stack);
process.exit(1);
})
.finally(() => prisma.$disconnect());