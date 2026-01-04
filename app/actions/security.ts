'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { UAParser } from 'ua-parser-js';

const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || "crab-secret-setup-123";

// Generate a random device ID
function generateDeviceId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function authorizeDevice(token: string, userAgentString: string) {
    if (token !== SETUP_SECRET) {
        return { success: false, error: "Invalid Setup Token" };
    }

    const deviceId = generateDeviceId();
    const ua = new UAParser(userAgentString);
    const deviceName = `${ua.getBrowser().name} on ${ua.getOS().name}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 Days Validity

    try {
        await prisma.trustedDevice.create({
            data: {
                deviceId,
                name: deviceName,
                userAgent: userAgentString,
                expiresAt
            }
        });

        // Set Cookie
        (await cookies()).set('trusted_device', deviceId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: expiresAt,
            path: '/'
        });

        // Log it
        await prisma.securityLog.create({
            data: {
                ipAddress: "UNKNOWN", // Hard to get in server action without headers hack
                action: "DEVICE_AUTHORIZED",
                severity: "HIGH",
                details: `Authorized: ${deviceName}`,
                userAgent: userAgentString
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Device Auth Error:", error);
        return { success: false, error: "Database Error" };
    }
}

export async function checkDeviceTrust() {
    const cookieStore = await cookies();
    const deviceId = cookieStore.get('trusted_device')?.value;

    if (!deviceId) return false;

    const device = await prisma.trustedDevice.findUnique({
        where: { deviceId }
    });

    if (!device) return false;
    if (new Date() > device.expiresAt) return false;

    // Update last used asynchronously (fire and forget sort of)
    /* await prisma.trustedDevice.update({
        where: { id: device.id },
        data: { lastUsed: new Date() }
    }); */

    return true;
}

export async function logSecurityEvent(action: string, severity: string, details?: string) {
    try {
        await prisma.securityLog.create({
            data: {
                ipAddress: "UNKNOWN",
                action,
                severity,
                details
            }
        });
    } catch (e) {
        // limit crash risk
        console.error("Log failed", e);
    }
}
