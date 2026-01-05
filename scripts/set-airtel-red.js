const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const config = await prisma.siteConfig.findFirst();

        if (config) {
            await prisma.siteConfig.update({
                where: { id: config.id },
                data: {
                    primaryColor: '#E60000', // Airtel Red
                    secondaryColor: '#0f172a' // Midnight
                }
            });
            console.log('✅ Successfully set theme to Airtel Red (#E60000)');
        } else {
            await prisma.siteConfig.create({
                data: {
                    primaryColor: '#E60000',
                    secondaryColor: '#0f172a'
                }
            });
            console.log('✅ Created new SiteConfig with Airtel Red defaults');
        }

    } catch (e) {
        console.error('❌ Error updating theme:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
