
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const config = await prisma.siteConfig.findFirst();

        if (config) {
            await prisma.siteConfig.update({
                where: { id: config.id },
                data: {
                    primaryColor: '#ea0000', // Crab Red
                    secondaryColor: '#0f172a' // Midnight
                }
            });
            console.log('Successfully set theme colors to Red/Midnight.');
        } else {
            await prisma.siteConfig.create({
                data: {
                    primaryColor: '#ea0000',
                    secondaryColor: '#0f172a'
                }
            });
            console.log('Created new SiteConfig with Red defaults.');
        }

    } catch (e) {
        console.error('Error updating theme:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
