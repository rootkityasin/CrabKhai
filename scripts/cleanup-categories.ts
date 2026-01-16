
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const sectionsToRemove = ['Best Sellers', 'New Arrivals', 'Super Savings'];

    const result = await prisma.category.deleteMany({
        where: {
            name: { in: sectionsToRemove }
        }
    });

    console.log(`Deleted ${result.count} categories.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
