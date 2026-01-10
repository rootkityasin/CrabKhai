'use server';

import { prisma } from '@/lib/prisma';

export async function getRecommendedProducts(excludeIds: string[] = [], limit: number = 4) {
    try {
        const products = await prisma.product.findMany({
            where: {
                id: { notIn: excludeIds },
                isAvailable: true
            },
            take: limit,
            orderBy: {
                createdAt: 'desc',
            }
        });
        return products;
    } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        return [];
    }
}
