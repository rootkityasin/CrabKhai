'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getNotifications(limit = 10) {
    if (!prisma.notification) return [];
    return await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit
    });
}

export async function markAsRead(id: string) {
    try {
        if (!prisma.notification) return { success: false };
        await prisma.notification.update({
            where: { id },
            data: { read: true }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch {
        return { success: false };
    }
}

export async function clearNotifications() {
    try {
        if (!prisma.notification) return { success: false };
        await prisma.notification.deleteMany();
        revalidatePath('/admin');
        return { success: true };
    } catch {
        return { success: false };
    }
}
