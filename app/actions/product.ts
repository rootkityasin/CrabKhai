'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { name: 'asc' },
        include: {
            category: true,
            inventory: true,
            sections: true,
            comboItems: {
                include: {
                    child: true
                }
            }
        }
    });
}

export async function getProduct(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                sections: true,
                comboItems: {
                    include: {
                        child: true
                    }
                }
            }
        });
        return product;
    } catch (error) {
        return null;
    }
}

export async function createProduct(data: any) {
    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                price: parseInt(String(data.price || 0)) || 0,
                description: data.description,
                descriptionSwap: data.descriptionSwap || false,
                image: data.image,
                sku: data.sku,
                pieces: parseInt(String(data.pieces || 0)) || 0, // Initial Stock
                weight: parseInt(String(data.weight || 0)) || 0,
                categoryId: data.categoryId,
                images: data.images || [], // Add images
                type: data.type || 'SINGLE', // Default to SINGLE
                sections: data.sections && data.sections.length > 0 ? {
                    connect: data.sections.map((id: string) => ({ id }))
                } : undefined,
                comboItems: data.type === 'COMBO' && data.comboItems ? {
                    create: data.comboItems.map((item: any) => ({
                        childId: item.childId,
                        quantity: parseInt(item.quantity)
                    }))
                } : undefined
            }
        });
        revalidatePath('/admin/products');
        revalidatePath('/admin/inventory');
        return { success: true, product };
    } catch (error) {
        console.error("Create Product Error:", error);
        return { success: false, error: "Failed to create product" };
    }
}

export async function updateProduct(id: string, data: any) {
    try {
        await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                price: parseInt(String(data.price || 0)) || 0,
                pieces: parseInt(String(data.pieces || 0)) || 0, // Explicit stock update
                image: data.image,
                images: data.images || [], // Add images
                weight: parseInt(String(data.weight || 0)) || 0,
                description: data.description,
                descriptionSwap: data.descriptionSwap,
                sections: data.sections ? {
                    set: data.sections.map((id: string) => ({ id }))
                } : undefined,
                // Add other fields
            }
        });
        revalidatePath('/admin/products');
        revalidatePath('/admin/inventory');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update" };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath('/admin/products');
        revalidatePath('/admin/inventory');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete" };
    }
}
