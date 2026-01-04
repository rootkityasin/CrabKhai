const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultSlides = [
    {
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop',
        title: 'Live Mud Crab',
        title_bn: 'জীবন্ত মাড ক্র্যাব',
        subtitle: 'Fresh from Sundarbans',
        subtitle_bn: 'সুন্দরবন থেকে সরাসরি সংগ্রহকৃত',
        buttonText: 'Order Now',
        buttonLink: '/menu',
        isActive: true,
        order: 0
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop',
        title: 'Family Platters',
        title_bn: 'ফ্যামিলি প্ল্যাটার',
        subtitle: 'Share the joy',
        subtitle_bn: 'খুশি ভাগ করে নিন',
        buttonText: 'Order Now',
        buttonLink: '/menu',
        isActive: true,
        order: 1
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1000&auto=format&fit=crop',
        title: 'Jumbo Shrimp',
        title_bn: 'জাম্বো চিংড়ি',
        subtitle: 'Grilled to perfection',
        subtitle_bn: 'নিখুঁতভাবে গ্রিল করা',
        buttonText: 'Order Now',
        buttonLink: '/menu',
        isActive: true,
        order: 2
    },
];

async function main() {
    const count = await prisma.heroSlide.count();
    if (count === 0) {
        console.log('Seeding default hero slides...');
        for (const slide of defaultSlides) {
            await prisma.heroSlide.create({
                data: slide
            });
        }
        console.log('Seeding complete.');
    } else {
        console.log('Slides already exist. Skipping seed.');
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
