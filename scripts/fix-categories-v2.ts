
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Category Cleanup...");

    // 1. Identify "Bad" Categories to remove
    const badCategoryNames = ['Best Sellers', 'New Arrivals', 'Super Savings', 'Others'];
    const badCategories = await prisma.category.findMany({
        where: { name: { in: badCategoryNames } },
        include: { _count: { select: { products: true } } }
    });

    if (badCategories.length === 0) {
        console.log("No bad categories found. Exiting.");
        return;
    }

    console.log(`Found ${badCategories.length} bad categories:`, badCategories.map(c => `${c.name} (${c._count.products} products)`));

    // 2. Find or Create a "Safe" Target Category
    // Prefer "Ready to Eat" or "Uncategorized"
    let targetCategory = await prisma.category.findFirst({
        where: { name: { in: ['Ready to Eat', 'Uncategorized'] } }
    });

    if (!targetCategory) {
        console.log("Creating 'Uncategorized' category...");
        targetCategory = await prisma.category.create({ data: { name: 'Uncategorized' } });
    }

    console.log(`Target Category: ${targetCategory.name} (${targetCategory.id})`);

    // 3. Reassign Products
    for (const badCat of badCategories) {
        if (badCat._count.products > 0) {
            console.log(`Reassigning ${badCat._count.products} products from '${badCat.name}' to '${targetCategory.name}'...`);
            await prisma.product.updateMany({
                where: { categoryId: badCat.id },
                data: { categoryId: targetCategory.id }
            });
        }
    }

    // 4. Delete Bad Categories
    console.log("Deleting bad categories...");
    const deleteResult = await prisma.category.deleteMany({
        where: { id: { in: badCategories.map(c => c.id) } }
    });

    console.log(`Deleted ${deleteResult.count} categories.`);
    console.log("Cleanup Complete!");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
