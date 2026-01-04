
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialProducts = [
    {
        sku: 'BS001',
        name: 'Signature Masala Crab wings',
        price: 350,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/651903648889884.png',
        stock: true,
        pieces: 12,
        weight: '200g',
        categoryName: 'Best Sellers'
    },
    {
        sku: 'BS002',
        name: 'Signature Masala Crab Bomb',
        price: 350,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/1684482693291279.png',
        stock: true,
        pieces: 8,
        weight: '250g',
        categoryName: 'Best Sellers'
    },
    {
        sku: 'BS003',
        name: 'Crispy Crab Wings',
        price: 330,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/604194297355933.png',
        stock: true,
        pieces: 10,
        weight: '1 Box',
        categoryName: 'Best Sellers'
    },
    {
        sku: 'SS001',
        name: 'WINGS & BOMB COMBO',
        price: 1200,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/4838007732246716.jpg',
        stock: true,
        pieces: 20,
        weight: 'Family Pack',
        categoryName: 'Super Savings'
    },
    {
        sku: 'SS002',
        name: 'Tempura Shrimp',
        price: 400,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/745402355963125.png',
        stock: true,
        pieces: 15,
        weight: '200g',
        categoryName: 'Super Savings'
    },
    {
        sku: 'NA001',
        name: 'Raw Crab Clean',
        price: 450,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/587600975137614.png',
        stock: true,
        pieces: 6,
        weight: '1kg',
        categoryName: 'New Arrivals'
    },
    {
        sku: 'NA002',
        name: 'Crispy Crab Bomb',
        price: 330,
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/606088101401451.png',
        stock: true,
        pieces: 9,
        weight: '500g',
        categoryName: 'New Arrivals'
    },
    {
        sku: '799245',
        name: 'Shell-less Crab Meat',
        price: 1850,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=300&fit=crop',
        stock: true,
        pieces: 18,
        weight: '1kg',
        categoryName: 'Others'
    },
    {
        sku: '799246',
        name: 'Crab Masala Mix',
        price: 450,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=300&fit=crop',
        stock: false,
        pieces: 12,
        weight: '100g',
        categoryName: 'Others'
    }
];

function parseWeight(weightStr) {
    if (!weightStr) return 0;
    const lower = weightStr.toLowerCase();
    if (lower.includes('kg')) {
        return parseFloat(lower.replace('kg', '')) * 1000;
    }
    if (lower.includes('g')) {
        return parseFloat(lower.replace('g', ''));
    }
    return 0;
}

async function main() {
    console.log('Seeding products...');

    // 1. Create Categories first
    const categories = ['Best Sellers', 'Super Savings', 'New Arrivals', 'Others'];
    for (const cat of categories) {
        // Since name is not unique, we use findFirst.
        let category = await prisma.category.findFirst({ where: { name: cat } });
        if (!category) {
            console.log(`Creating category: ${cat}`);
            category = await prisma.category.create({
                data: { name: cat }
            });
        }
    }

    // 2. Create Products
    for (const p of initialProducts) {
        const category = await prisma.category.findFirst({ where: { name: p.categoryName } });

        if (!category) {
            console.error(`Category not found for product ${p.name}`);
            continue;
        }

        console.log(`Upserting product: ${p.sku}`);
        await prisma.product.upsert({
            where: { sku: p.sku },
            update: {}, // No updates if exists
            create: {
                name: p.name,
                sku: p.sku,
                price: p.price,
                image: p.image,
                pieces: p.pieces,
                weight: parseWeight(p.weight),
                categoryId: category.id,
                description: p.categoryName + ' Item'
            }
        });
    }

    console.log('Seeding completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
