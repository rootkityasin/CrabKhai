
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const sections = await prisma.productSection.findMany({
        include: { _count: { select: { products: true } } }
    });
    console.log("Sections:", sections);

    const products = await prisma.product.findMany({
        where: { stage: { in: ['Selling', 'Published', 'Coming Soon'] } },
        select: { id: true, name: true, stage: true }
    });
    console.log(`Available Products (${products.length}):`, products.map(p => p.name).slice(0, 5));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
