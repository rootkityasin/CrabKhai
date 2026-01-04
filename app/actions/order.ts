'use server';

import { prisma } from '@/lib/prisma';

export async function getPendingOrderCount() {
    try {
        const count = await prisma.order.count({
            where: {
                status: 'PENDING'
            }
        });
        return count;
    } catch (error) {
        console.error("Failed to get order count:", error);
        return 0;
    }
}
// ... (existing imports)

export async function createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: { productId: string; quantity: number; price: number }[];
    totalAmount: number;
}) {
    try {
        // 1. Create Order
        const order = await prisma.order.create({
            data: {
                orderId: `ORD-${Date.now()}`, // Simple ID generation
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                customerAddress: data.customerAddress,
                totalAmount: data.totalAmount,
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

        return { success: true, orderId: order.orderId };
    } catch (error) {
        console.error("Create Order Error:", error);
        return { success: false, error: "Failed to create order" };
    }
}
