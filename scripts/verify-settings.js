
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const config = await prisma.siteConfig.findFirst();
        console.log("Current Site Config:", JSON.stringify(config, null, 2));
    } catch (e) {
        console.error("Error fetching config:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
