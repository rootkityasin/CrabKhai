import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const certs = [
        '/certifications/haccp.png',
        '/certifications/gmp.png',
        '/certifications/brgs.png'
    ];

    console.log("Updating certificates...");

    // Find the existing config or create new one
    const existing = await prisma.siteConfig.findFirst();

    if (existing) {
        await prisma.siteConfig.update({
            where: { id: existing.id },
            data: { certificates: certs }
        });
        console.log("Updated existing config with new certificates.");
    } else {
        await prisma.siteConfig.create({
            data: {
                certificates: certs
            }
        });
        console.log("Created new config with certificates.");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
