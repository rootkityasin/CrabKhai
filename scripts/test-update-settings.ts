
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const existing = await prisma.siteConfig.findFirst();
    if (!existing) {
        console.log("No config found, creating default first...");
        await prisma.siteConfig.create({
            data: {
                shopType: 'GROCERY'
            }
        });
    }

    const id = existing ? existing.id : (await prisma.siteConfig.findFirst())?.id;
    if (!id) throw new Error("Could not find config ID");

    console.log("Attempting update...");

    // Simulate the payload from the frontend
    const payload = {
        contactPhone: "+880 12345678",
        shopType: "RESTAURANT", // Trying to change to RESTAURANT
        weightUnitValue: 200,
        volumeUnitValue: 1000,
        taxPercentage: 0,
        certificates: [],
        measurementUnit: 'PCS'
        // Add other fields as they appear in the component
    };

    try {
        await prisma.siteConfig.update({
            where: { id },
            data: {
                contactPhone: payload.contactPhone,
                shopType: payload.shopType as any, // Cast to avoid TS enum error in script, but Prisma runtime checks this
                weightUnitValue: payload.weightUnitValue,
                volumeUnitValue: payload.volumeUnitValue,
                // mimic the action logic
                // taxPercentage: parseFloat(payload.taxPercentage || 0), // validation
            }
        });
        console.log("Update successful!");
    } catch (e) {
        console.error("Update failed:", e);
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
