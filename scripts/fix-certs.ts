const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    const config = await prisma.siteConfig.findFirst();
    if (config) {
        await prisma.siteConfig.update({
            where: { id: config.id },
            data: {
                certificates: [
                    "/certifications/cert-1.png",
                    "/certifications/cert-2.png"
                ]
            }
        });
        console.log("Updated certificates to local paths");
    } else {
        console.log("No config found to update");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
