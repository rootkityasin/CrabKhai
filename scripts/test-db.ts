import { prisma } from '../lib/prisma';

async function main() {
    console.log('Testing DB connection...');
    try {
        const users = await prisma.user.count();
        console.log('Successfully connected! User count:', users);
    } catch (e) {
        console.error('DB Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
