const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const defaults = [
        { name: "Live Crab" },
        { name: "Frozen Crab" },
        { name: "Crab Meat" },
        { name: "Ready to Eat" },
        { name: "Meal" } // The requested one
    ];

    console.log(`Start seeding categories...`);

    for (const c of defaults) {
        const exists = await prisma.category.findFirst({ where: { name: c.name } });
        if (!exists) {
            await prisma.category.create({ data: c });
            console.log(`Created category: ${c.name}`);
        } else {
            console.log(`Category exists: ${c.name}`);
        }
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
