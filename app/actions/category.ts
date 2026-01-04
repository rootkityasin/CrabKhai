'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        return categories;
    } catch (error) {
        return [];
    }
}

export async function createCategory(name: string) {
    try {
        const category = await prisma.category.create({
            data: { name }
        });
        revalidatePath('/admin/categories');
        return { success: true, category };
    } catch (error) {
        return { success: false, error: "Failed to create category" };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete" };
    }
}

// Seed helper (can be called from a script or init)
export async function seedCategories() {
    const defaults = ["Live Crab", "Frozen Crab", "Crab Meat", "Ready to Eat", "Meal"];

    for (const name of defaults) {
        const exists = await prisma.category.findFirst({ where: { name } });
        if (!exists) {
            await prisma.category.create({ data: { name } });
        }
    }
}
