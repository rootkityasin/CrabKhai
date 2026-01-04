
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Attempting to query Product with 'type' field...");
        const products = await prisma.product.findMany({
            take: 1,
            select: {
                id: true,
                name: true,
                type: true, // This caused the error before
            }
        });
        console.log("Success! Found products:", products);
    } catch (error) {
        console.error("Error verifying prisma client:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
