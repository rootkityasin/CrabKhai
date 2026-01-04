const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Deleting 'Meal' from Product Categories...");
    const deleteResult = await prisma.category.deleteMany({
        where: { name: 'Meal' }
    });
    console.log(`Deleted ${deleteResult.count} categories named 'Meal'.`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
