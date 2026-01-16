
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Section Sync...");

    // 1. Get Sections
    let sections = await prisma.productSection.findMany({
        include: { products: true }
    });

    console.log(`Found ${sections.length} sections.`);

    // 2. Ensure Defaults if missing
    if (sections.length === 0) {
        console.log("No sections found. Seeding defaults...");
        const defaults = [
            { title: 'Best Sellers', slug: 'best-sellers', order: 0 },
            { title: 'New Arrivals', slug: 'new-arrivals', order: 1 },
            { title: 'Super Savings', slug: 'super-savings', order: 2 },
        ];
        for (const d of defaults) {
            await prisma.productSection.create({ data: { ...d, isActive: true } });
        }
        sections = await prisma.productSection.findMany({ include: { products: true } });
    }

    // 3. Get Products
    const products = await prisma.product.findMany({
        where: { stage: { in: ['Selling', 'Published', 'Coming Soon'] } }
    });

    if (products.length === 0) {
        console.error("No available products found to assign!");
        return;
    }

    console.log(`Found ${products.length} available products.`);

    // 4. Assign
    for (const section of sections) {
        if (section.products.length === 0) {
            // Shuffle and pick 3-6
            const shuffled = [...products].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 3);

            await prisma.productSection.update({
                where: { id: section.id },
                data: {
                    products: {
                        connect: selected.map(p => ({ id: p.id }))
                    }
                }
            });
            console.log(`Assigned ${selected.length} products to '${section.title}'`);
        } else {
            console.log(`Section '${section.title}' already has ${section.products.length} products.`);
        }
    }
    console.log("Sync Complete.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
