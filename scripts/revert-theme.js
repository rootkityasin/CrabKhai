
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Find the first SiteConfig (usually only one)
        const config = await prisma.siteConfig.findFirst();

        if (config) {
            await prisma.siteConfig.update({
                where: { id: config.id },
                data: {
                    primaryColor: '#ea580c', // Crab Orange
                    secondaryColor: '#0f172a' // Midnight
                }
            });
            console.log('Successfully reverted theme colors to Orange/Midnight.');
        } else {
            // Create if doesn't exist (unlikely)
            await prisma.siteConfig.create({
                data: {
                    primaryColor: '#ea580c',
                    secondaryColor: '#0f172a'
                }
            });
            console.log('Created new SiteConfig with Orange defaults.');
        }

    } catch (e) {
        console.error('Error reverting theme:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
