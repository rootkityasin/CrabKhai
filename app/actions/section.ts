'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSections() {
    try {
        const sections = await prisma.productSection.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        return sections;
    } catch (error) {
        console.error("Failed to fetch sections:", error);
        return [];
    }
}

export async function getHomeSections() {
    try {
        const sections = await prisma.productSection.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
                products: {
                    where: {
                        stage: { in: ['Selling', 'Published', 'Coming Soon'] }
                    },
                    orderBy: { createdAt: 'desc' }, // Or allow custom ordering per section in future
                    take: 10 // Limit products per rail
                }
            }
        });
        return sections;
    } catch (error) {
        console.error("Failed to fetch home sections:", error);
        return [];
    }
}

export async function createSection(data: { title: string; slug: string; isActive?: boolean; order?: number }) {
    try {
        const section = await prisma.productSection.create({
            data: {
                title: data.title,
                slug: data.slug,
                isActive: data.isActive ?? true,
                order: data.order ?? 0
            }
        });
        revalidatePath('/admin/sections');
        return { success: true, section };
    } catch (error) {
        return { success: false, error: "Failed to create section" };
    }
}

export async function updateSection(id: string, data: { title?: string; slug?: string; isActive?: boolean; order?: number }) {
    try {
        const section = await prisma.productSection.update({
            where: { id },
            data
        });
        revalidatePath('/admin/sections');
        return { success: true, section };
    } catch (error) {
        return { success: false, error: "Failed to update section" };
    }
}

export async function deleteSection(id: string) {
    try {
        await prisma.productSection.delete({ where: { id } });
        revalidatePath('/admin/sections');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete section" };
    }
}

export async function assignProductToSections(productId: string, sectionIds: string[]) {
    try {
        // Transaction to overwrite sections
        // First disconnect all, then connect new ones
        // Or simpler: set relation
        await prisma.product.update({
            where: { id: productId },
            data: {
                sections: {
                    set: sectionIds.map(id => ({ id }))
                }
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to assign sections", error);
        return { success: false, error: "Failed to assign sections" };
    }
}

// Seed helper
export async function seedDefaultSections() {
    const defaults = [
        { title: 'Best Sellers', slug: 'best-sellers', order: 0 },
        { title: 'New Arrivals', slug: 'new-arrivals', order: 1 },
        { title: 'Super Savings', slug: 'super-savings', order: 2 },
    ];

    const sections = [];

    for (const s of defaults) {
        const existing = await prisma.productSection.findUnique({ where: { slug: s.slug } });
        if (!existing) {
            const created = await prisma.productSection.create({ data: { ...s, isActive: true } });
            sections.push(created);
        } else {
            sections.push(existing);
        }
    }

    // Assign some products if sections act as fresh start
    try {
        const products = await prisma.product.findMany({
            take: 10,
            where: { stage: { in: ['Selling', 'Published'] } }
        });

        if (products.length === 0) return;

        // Best Sellers (assign first 3)
        const bestSellers = sections.find(s => s.slug === 'best-sellers');
        if (bestSellers) {
            const pIds = products.slice(0, 3).map(p => ({ id: p.id }));
            if (pIds.length > 0) {
                await prisma.productSection.update({
                    where: { id: bestSellers.id },
                    data: { products: { connect: pIds } }
                });
            }
        }

        // New Arrivals (assign next 3)
        const newArrivals = sections.find(s => s.slug === 'new-arrivals');
        if (newArrivals) {
            const pIds = products.slice(3, 6).map(p => ({ id: p.id }));
            if (pIds.length > 0) {
                await prisma.productSection.update({
                    where: { id: newArrivals.id },
                    data: { products: { connect: pIds } }
                });
            }
        }

        // Super Savings (assign last 2)
        const superSavings = sections.find(s => s.slug === 'super-savings');
        if (superSavings) {
            const pIds = products.slice(6, 8).map(p => ({ id: p.id }));
            if (pIds.length > 0) {
                await prisma.productSection.update({
                    where: { id: superSavings.id },
                    data: { products: { connect: pIds } }
                });
            }
        }

        revalidatePath('/');
        revalidatePath('/admin/sections');
    } catch (error) {
        console.error("Error auto-assigning products during seed:", error);
    }
}

export async function reorderSections(items: { id: string; order: number }[]) {
    try {
        await prisma.$transaction(
            items.map((item) =>
                prisma.productSection.update({
                    where: { id: item.id },
                    data: { order: item.order }
                })
            )
        );
        revalidatePath('/admin/sections');
        return { success: true };
    } catch (error) {
        console.error("Failed to reorder sections:", error);
        return { success: false, error: "Failed to reorder sections" };
    }
}
