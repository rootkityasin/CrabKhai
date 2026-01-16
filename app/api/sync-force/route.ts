
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Sync Force Triggered");
        const log: string[] = [];

        // 1. Get Sections
        let sections = await prisma.productSection.findMany({
            include: { products: true }
        });

        // 2. Default Seed if missing
        if (sections.length === 0) {
            log.push("No sections found. Creating defaults...");
            const defaults = [
                { title: 'Best Sellers', slug: 'best-sellers', order: 0 },
                { title: 'New Arrivals', slug: 'new-arrivals', order: 1 },
                { title: 'Super Savings', slug: 'super-savings', order: 2 },
            ];
            for (const d of defaults) {
                await prisma.productSection.create({ data: { ...d, isActive: true } });
            }
            sections = await prisma.productSection.findMany({ include: { products: true } });
        }

        // 3. Get Products
        const products = await prisma.product.findMany({
            where: { stage: { in: ['Selling', 'Published', 'Coming Soon'] } }
        });

        if (products.length === 0) {
            return NextResponse.json({ success: false, log, error: "No products found in Selling/Published stage." });
        }

        log.push(`Found ${products.length} products available.`);

        // 4. Assign
        let updated = 0;
        for (const section of sections) {
            if (section.products.length === 0) {
                const count = Math.min(products.length, 4);
                // Simple shuffle
                const shuffled = [...products].sort(() => 0.5 - Math.random()).slice(0, count);

                await prisma.productSection.update({
                    where: { id: section.id },
                    data: {
                        products: {
                            connect: shuffled.map(p => ({ id: p.id }))
                        }
                    }
                });
                log.push(`Assigned ${count} products to ${section.title}`);
                updated++;
            } else {
                log.push(`${section.title} already has products.`);
            }
        }

        return NextResponse.json({ success: true, updated, log });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
