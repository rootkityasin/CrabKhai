const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const STORY_DATA = [
    {
        type: 'HERO',
        content: {
            title: "Our Story",
            subtitle: "A journey of flavor, quality, and passion. Bringing Bangladesh's finest crabs to your table since 2023.",
            estYear: "Est. 2023",
            mascotImage: "/mascot/story-character.png"
        }
    },
    {
        type: 'VALUES',
        content: {
            manifestoTitle: "The Manifesto",
            manifestoText: "So, it's 2023. We're in Dhaka, craving good crab. Not the sad, frozen kind—we wanted the REAL deal. But finding it? Harder than finding a rickshaw in the rain. So we said, 'Forget it, let's do it ourselves.' Now we bring the fattest, juiciest crabs from the Bay straight to you. No middlemen, no nonsense. Just pure, messy, delicious happiness. Get your bibs ready!",
            brandValues: ["FRESH", "ORGANIC", "PREMIUM", "SUSTAINABLE", "LOCAL", "AUTHENTIC", "HYGIENIC", "DELICIOUS", "CRABTASTIC", "OCEANIC"]
        }
    },
    {
        type: 'GALLERY',
        content: [
            { src: '/story/lover.jpg', alt: 'Rainy Day Combo ❤️', rotate: -6 },
            { src: '/story/gallery_hq_1.jpg', alt: 'Fresh Catch 2026', rotate: 4 },
            { src: '/story/gallery_hq_2.jpg', alt: 'Pizza Flame & Crab', rotate: -3 },
            { src: '/story/gallery_hq_3.jpg', alt: 'We are in Feni', rotate: 5 },
        ]
    },
    {
        type: 'TEAM',
        content: [
            {
                name: "S. Rahman",
                role: "Founder & Chief Crab Officer",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander&backgroundColor=b6e3f4&facialHair=beardLight&top=shortHairShortFlat",
                story: "Started with a bucket and a dream. Now feeds Dhaka's crab cravings."
            },
            {
                name: "Abir H.",
                role: "Head of Operations",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mason&backgroundColor=c0aede&facialHair=beardMedium&top=shortHairTheCaesar",
                story: "Ensures your order gets there faster than you can say 'CrabKhai'."
            },
            {
                name: "Uncle J.",
                role: "Quality Control",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&backgroundColor=ffdfbf&clothing=collarAndSweater&top=shortHairSides&accessories=prescription02&facialHair=beardMajestic&hairColor=2c1b18",
                story: "Been inspecting crabs since 1985. If it's not perfect, it's not leaving."
            },
            {
                name: "Rootkit",
                role: "The Developer",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher&backgroundColor=e6e6e6&top=winterHat02&clothing=hoodie&accessories=sunglasses&facialHair=beardLight",
                story: "Turns coffee into code and fixing bugs while eating crab."
            }
        ]
    },
    {
        type: 'WHOLESALE',
        content: {
            title: "Want to buy in Wholesale?",
            description: "We supply premium quality crabs to restaurants, hotels, and event caterers across Bangladesh. Partner with us for consistent quality and special bulk pricing.",
            whatsappNumber: "8801804221161",
            image: "/mascot/story-character.png"
        }
    },
    {
        type: 'REVIEWS',
        content: {
            featuredImage: "/story/reviews/review_new.jpg",
            gridImages: [
                { id: 1, src: '/story/reviews/review_3.jpg', alt: "Day 1 Review" },
                { id: 2, src: '/story/reviews/review_2.jpg', alt: "Day 2 Review" },
                { id: 3, src: '/story/reviews/review_1.jpg', alt: "Day 3 Review" }
            ],
            reviews: [
                { id: 1, name: "Tanvir Hasan", rating: 5, comment: "Absolutely fresh! The packaging was premium and the taste was authentic.", date: "2 days ago" },
                { id: 2, name: "Sarah Ahmed", rating: 5, comment: "Best crab delivery in Dhaka. Loved the ready-to-eat options.", date: "1 week ago" },
                { id: 3, name: "Rahim Chowdhury", rating: 4, comment: "Great service, fast delivery. Will order again.", date: "2 weeks ago" }
            ]
        }
    }
];

async function main() {
    console.log('Seeding story sections...');
    for (const data of STORY_DATA) {
        const exists = await prisma.storySection.findUnique({ where: { type: data.type } });
        if (!exists) {
            await prisma.storySection.create({
                data: {
                    type: data.type,
                    content: data.content
                }
            });
            console.log(`Created ${data.type}`);
        } else {
            console.log(`Skipping ${data.type} (already exists)`);
        }
    }
    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
