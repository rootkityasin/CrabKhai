const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.product.count();
    console.log(`Total Products: ${count}`);
    if (count > 0) {
        const products = await prisma.product.findMany({
            take: 3,
            include: { category: true }
        });
        console.log("Sample Products:", JSON.stringify(products, null, 2));
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
