'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPromos() {
    try {
        const promos = await prisma.promoCard.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return promos;
    } catch (error) {
        console.error("Failed to fetch promos:", error);
        return [];
    }
}

export async function getActivePromo() {
    try {
        const promo = await prisma.promoCard.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' }, // Get the most recently updated active one? Or just one
        });
        return promo;
    } catch (error) {
        console.error("Error fetching active promo:", error);
        return null;
    }
}

export async function createPromo(data: any) {
    try {
        // If the new promo is set to active, deactivate others (optional logic, but usually we only want 1 popup)
        if (data.isActive) {
            await prisma.promoCard.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });
        }

        const promo = await prisma.promoCard.create({
            data: {
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
                style: data.style || "CLASSIC",
                buttonText: data.buttonText,
                buttonLink: data.buttonLink,
                price: data.price ? String(data.price) : null,
                originalPrice: data.originalPrice ? String(data.originalPrice) : null,
                isActive: data.isActive ?? true,
            },
        });

        revalidatePath('/admin/promos');
        revalidatePath('/');
        return { success: true, promo };
    } catch (error) {
        console.error("Failed to create promo:", error);
        return { success: false, error: "Failed to create promo" };
    }
}

export async function updatePromo(id: string, data: any) {
    try {
        if (data.isActive) {
            await prisma.promoCard.updateMany({
                where: { id: { not: id }, isActive: true },
                data: { isActive: false },
            });
        }

        const promo = await prisma.promoCard.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
                style: data.style,
                buttonText: data.buttonText,
                buttonLink: data.buttonLink,
                price: data.price ? String(data.price) : null,
                originalPrice: data.originalPrice ? String(data.originalPrice) : null,
                isActive: data.isActive,
            },
        });

        revalidatePath('/admin/promos');
        revalidatePath('/');
        return { success: true, promo };
    } catch (error) {
        console.error("Failed to update promo:", error);
        return { success: false, error: "Failed to update promo" };
    }
}

export async function deletePromo(id: string) {
    try {
        await prisma.promoCard.delete({
            where: { id },
        });
        revalidatePath('/admin/promos');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete promo:", error);
        return { success: false, error: "Failed to delete promo" };
    }
}

export async function togglePromoStatus(id: string, isActive: boolean) {
    try {
        if (isActive) {
            await prisma.promoCard.updateMany({
                where: { id: { not: id }, isActive: true },
                data: { isActive: false },
            });
        }

        await prisma.promoCard.update({
            where: { id },
            data: { isActive },
        });

        revalidatePath('/admin/promos');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to toggle status" };
    }
}
