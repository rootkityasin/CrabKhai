'use server';

import { prisma } from '@/lib/prisma'; // Changed alias from globalPrisma to prisma
import { PrismaClient } from '@prisma/client'; // This import is no longer needed if we always use the singleton

// The conditional fallback to local instance is removed as per instruction.
// We now directly use the imported singleton 'prisma' from '@/lib/prisma'.

export async function createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: { productId: string; quantity: number; price: number }[];
    totalAmount: number;
    couponCode?: string;
    discountAmount?: number;
}) {
    // Bot check removed


    try {
        // 1. Create Order
        const order = await prisma.order.create({
            data: {
                orderId: `ORD-${Date.now()}`, // Simple ID generation
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                customerAddress: data.customerAddress,
                totalAmount: data.totalAmount,
                couponCode: data.couponCode,
                discountAmount: data.discountAmount,
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        // 2. Deduct Stock
        for (const item of data.items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                include: { comboItems: true }
            });

            if (!product) continue;

            if (product.type === 'COMBO') {
                // Deduct from children
                for (const comboItem of product.comboItems) {
                    await prisma.product.update({
                        where: { id: comboItem.childId },
                        data: { pieces: { decrement: item.quantity * comboItem.quantity } }
                    });
                }
            } else {
                // Deduct from single product & update inventory records if checking
                // Assuming simple piece deduction for now
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { pieces: { decrement: item.quantity } }
                });
            }
        }

        // 3. Increment Coupon Usage
        if (data.couponCode) {
            // We use updateMany or try/catch to avoid error if coupon deleted/invalid race condition
            // But since we just validated effectively, update is fine.
            // Using prisma.coupon.update requires ID or unique field. Code is unique.
            try {
                await prisma.coupon.update({
                    where: { code: data.couponCode },
                    data: { usedCount: { increment: 1 } }
                });
            } catch (e) {
                console.error("Failed to increment coupon usage", e);
                // Non-blocking error
            }
        }

        return { success: true, orderId: order.orderId };
    } catch (error) {
        console.error("Create Order Error:", error);
        return { success: false, error: "Failed to create order" };
    }
}
