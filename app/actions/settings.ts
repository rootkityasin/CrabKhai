'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSiteConfig() {
    try {
        const config = await prisma.siteConfig.findFirst();
        if (!config) {
            // Return default if not found
            return {
                contactPhone: "+880 1804 221 161",
                contactEmail: "crabkhaibangladesh@gmail.com",
                contactAddress: "195 Green Road, Dhaka",
                shopName: "Crab & Khai",
                logoUrl: "/logo.svg",
                measurementUnit: "PCS",
                allergensText: "Crustaceans",
                certificates: [],
                primaryColor: "#ea0000", // Default Crab Red
                secondaryColor: "#0f172a", // Default Slate-900
                taxPercentage: 0.0
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
                    shopName: data.shopName,
                    logoUrl: data.logoUrl,
                    measurementUnit: data.measurementUnit,
                    allergensText: data.allergensText,
                    certificates: data.certificates,
                    primaryColor: data.primaryColor,
                    secondaryColor: data.secondaryColor,
                    taxPercentage: parseFloat(data.taxPercentage || 0)
                }
            });
        } else {
            await prisma.siteConfig.create({
                data: {
                    contactPhone: data.contactPhone,
                    contactEmail: data.contactEmail,
                    contactAddress: data.contactAddress,
                    shopName: data.shopName,
                    logoUrl: data.logoUrl,
                    measurementUnit: data.measurementUnit,
                    allergensText: data.allergensText,
                    certificates: data.certificates,
                    primaryColor: data.primaryColor || "#ea0000",
                    secondaryColor: data.secondaryColor || "#0f172a",
                    taxPercentage: parseFloat(data.taxPercentage || 0)
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

export async function getPaymentConfig() {
    try {
        const config = await prisma.paymentConfig.findFirst();
        if (!config) {
            return {
                isActive: true,
                codEnabled: true,
                bkashEnabled: false,
                bkashAppKey: '',
                bkashSecretKey: '',
                bkashUsername: '',
                bkashPassword: '',
                nagadEnabled: false,
                nagadMerchantNumber: '',
                nagadPublicKey: '',
                nagadPrivateKey: '',
                selfMfsEnabled: false,
                selfMfsType: 'bkash',
                selfMfsPhone: '',
                selfMfsInstruction: '',
                selfMfsQrCode: '',
                advancePaymentType: 'FULL',
                advancePaymentValue: 0
            };
        }
        return config;
    } catch (error) {
        console.error("Failed to fetch payment config:", error);
        return null;
    }
}

export async function updatePaymentConfig(data: any) {
    try {
        const existing = await prisma.paymentConfig.findFirst();

        if (existing) {
            await prisma.paymentConfig.update({
                where: { id: existing.id },
                data: {
                    ...data
                }
            });
        } else {
            await prisma.paymentConfig.create({
                data: {
                    ...data
                }
            });
        }

        revalidatePath('/admin/shop');
        return { success: true };
    } catch (error) {
        console.error("Failed to update payment config:", error);
        return { success: false, error: "Failed to save payment config" };
    }
}

export async function getDeliveryConfig() {
    try {
        const config = await prisma.deliveryConfig.findFirst();
        if (!config) {
            return {
                defaultCharge: 60,
                defaultCodEnabled: true,
                nonRefundable: false,
                weightBasedCharges: [],
                deliveryZones: [],
                courierPathaoEnabled: false,
                courierPathaoCredentials: null
            };
        }
        return config;
    } catch (error) {
        console.error("Failed to fetch delivery config:", error);
        return null;
    }
}

export async function updateDeliveryConfig(data: any) {
    try {
        const existing = await prisma.deliveryConfig.findFirst();

        if (existing) {
            await prisma.deliveryConfig.update({
                where: { id: existing.id },
                data: {
                    defaultCharge: parseInt(data.defaultCharge || 0),
                    defaultCodEnabled: data.defaultCodEnabled,
                    nonRefundable: data.nonRefundable,
                    weightBasedCharges: data.weightBasedCharges || [],
                    deliveryZones: data.deliveryZones || [],
                    courierPathaoEnabled: data.courierPathaoEnabled,
                    courierPathaoCredentials: data.courierPathaoCredentials
                }
            });
        } else {
            await prisma.deliveryConfig.create({
                data: {
                    defaultCharge: parseInt(data.defaultCharge || 0),
                    defaultCodEnabled: data.defaultCodEnabled,
                    nonRefundable: data.nonRefundable,
                    weightBasedCharges: data.weightBasedCharges || [],
                    deliveryZones: data.deliveryZones || [],
                    courierPathaoEnabled: data.courierPathaoEnabled,
                    courierPathaoCredentials: data.courierPathaoCredentials
                }
            });
        }

        revalidatePath('/admin/shop');
        return { success: true };
    } catch (error) {
        console.error("Failed to update delivery config:", error);
        return { success: false, error: "Failed to save delivery config" };
    }
}
