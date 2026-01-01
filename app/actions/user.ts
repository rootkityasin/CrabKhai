'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function checkUserExists(phone: string) {
    if (!phone) return false;

    // Normalize phone if needed, but for now exact match
    try {
        const user = await prisma.user.findFirst({
            where: {
                phone: phone
            }
        });
        return !!user;
    } catch (error) {
        console.error("Error checking user:", error);
        return false;
    }
}

export async function createUser(data: { name: string; phone: string; email?: string; address?: string; password?: string }) {
    try {
        // Basic duplicate check again to be safe
        const existing = await prisma.user.findFirst({
            where: { phone: data.phone }
        });

        if (existing) {
            return { success: false, error: "User already exists" };
        }

        const user = await prisma.user.create({
            data: {
                name: data.name,
                phone: data.phone,
                // Email is unique, so we need a placeholder if not provided or handle it better.
                // For this quick implementation, we assume unique email or generic placeholder.
                // Ideally schema should allow optional email if phone is primary.
                email: data.email || `${data.phone}@placeholder.com`,
                password: data.password ? await bcrypt.hash(data.password, 10) : undefined,
            }
        });
        return { success: true, user };
    } catch (error) {
        console.error("Error creating user:", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

// ... (existing code)

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                id: 'desc'
            }
        });
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getUserProfile(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId, 10) }
        });
        return user;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}
