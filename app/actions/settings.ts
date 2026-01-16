'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ShopType } from '@prisma/client';

export async function getSiteConfig() {
    const defaults = {
        contactPhone: "+880 1804 221 161",
        contactEmail: "crabkhaibangladesh@gmail.com",
        contactAddress: "195 Green Road, Dhaka",
        shopName: "Crab & Khai",
        logoUrl: "/logo.svg",
        measurementUnit: "PCS",
        allergensText: "Crustaceans",
        certificates: [],
        primaryColor: "#ea0000",
        secondaryColor: "#0f172a",
        taxPercentage: 0.0,
        shopType: 'RESTAURANT',
        weightUnitValue: 200,
        volumeUnitValue: 1000,
        privacyPolicy: `**Your Privacy Matters to Us**

At **Crab & Khai**, we believe building trust is just as important as delivering premium seafood. We want to be transparent about how we handle your information.

**What We Collect & Why**
When you place an order, we ask for your name, phone number, and delivery address. This isn't just data to us—it's the bridge that allows us to deliver fresh, quality products directly to your kitchen.

**Our Promise**
Your personal details are used strictly to fulfill your orders and improve your experience with us. We do not sell, trade, or share your information with outside parties. You are our valued customer, and your privacy is preserved with the highest standards of security.

**Always Here for You**
If you have any questions about your data or just want to verify details, please don't hesitate to contact us directly at crabkhaibangladesh@gmail.com.`,
        refundPolicy: `**Our Freshness Guarantee**

We take immense pride in the quality of our seafood. If something isn't right, we want to know.

**Spoilage & Quality Issues**
In the unlikely event that you receive a product that doesn't meet our premium standards (e.g., spoiled or damaged), please inform us within **24 hours** of delivery. A quick photo helps us resolve this instantly.

**Hassle-Free Refunds**
For valid claims, we process refunds directly to your original payment method (or bKash/Nagad) within **5-7 business days**. We aim to resolve every issue with fairness and speed.

*Note: Due to the perishable nature of our products, we cannot accept returns for items that have been cooked or consumed.*`,
        termsPolicy: `**Terms of Service**

**1. General**
By accessing and placing an order with **Crab & Khai**, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Crab & Khai.

**2. Products**
All products and specific offers are subject to availability. We prioritize freshness, so availability may vary daily based on the catch.

**3. Payments**
We accept Cash on Delivery (COD) and Mobile Financial Services (bKash, Nagad). Full payment must be cleared upon delivery or in advance as per the order terms.`
    };

    try {
        const config = await prisma.siteConfig.findFirst();
        if (!config) {
            return defaults;
        }
        // Merge: Use DB values, but fall back to defaults for any missing/null fields
        return {
            ...defaults,
            ...config,
            shopType: config.shopType || defaults.shopType, // Explicit fallback
        };
    } catch (error) {
        console.error("Failed to fetch site config:", error);
        return defaults;
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
                    secondaryColor: data.secondaryColor,
                    taxPercentage: parseFloat(data.taxPercentage || 0),
                    shopType: (data.shopType as ShopType) || ShopType.RESTAURANT,
                    weightUnitValue: parseInt(data.weightUnitValue || 200),
                    volumeUnitValue: parseInt(data.volumeUnitValue || 1000)
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
                    taxPercentage: parseFloat(data.taxPercentage || 0),
                    shopType: (data.shopType as ShopType) || ShopType.RESTAURANT,
                    weightUnitValue: parseInt(data.weightUnitValue || 200),
                    volumeUnitValue: parseInt(data.volumeUnitValue || 1000)
                }
            });
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        console.error("Payload was:", data);
        return { success: false, error: String(error) };
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
