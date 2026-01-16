const { PrismaClient } = require('@prisma/client');

async function deleteBatchProducts() {
    const prisma = new PrismaClient();

    try {
        const result = await prisma.product.deleteMany({
            where: {
                name: {
                    contains: '(Batch)'
                }
            }
        });
        console.log('Deleted batch products:', result.count);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteBatchProducts();
