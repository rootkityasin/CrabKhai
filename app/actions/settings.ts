'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getSiteConfig() {
    try {
        const config = await prisma.siteConfig.findFirst();
        if (!config) {
            // Return default if not found
            return {
                contactPhone: "+880 1804 221 161",
                contactEmail: "crabkhaibangladesh@gmail.com",
                contactAddress: "195 Green Road, Dhaka",
                allergensText: "Crustaceans",
                certificates: []
            };
        }
        return config;
    } catch (error) {
        console.error("Failed to fetch site config:", error);
        return null;
    }
}

export async function updateSiteConfig(data: any) {
    try {
        // Upsert: Create if not exists, otherwise update the first one found
        // Since we don't have a singleton ID, we find first or create
        const existing = await prisma.siteConfig.findFirst();

        if (existing) {
            await prisma.siteConfig.update({
                where: { id: existing.id },
                data: {
                    contactPhone: data.contactPhone,
                    contactEmail: data.contactEmail,
                    contactAddress: data.contactAddress,
                    allergensText: data.allergensText,
                    certificates: data.certificates
                }
            });
        } else {
            await prisma.siteConfig.create({
                data: {
                    contactPhone: data.contactPhone,
                    contactEmail: data.contactEmail,
                    contactAddress: data.contactAddress,
                    allergensText: data.allergensText,
                    certificates: data.certificates
                }
            });
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Failed to save settings" };
    }
}
