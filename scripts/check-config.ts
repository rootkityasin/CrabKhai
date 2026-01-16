
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const config = await prisma.siteConfig.findFirst();
    console.log('Current SiteConfig:', config);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
