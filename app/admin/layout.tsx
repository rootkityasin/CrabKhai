import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';
import { headers } from 'next/headers';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const deviceId = cookieStore.get('trusted_device')?.value;
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';

    // Exception for device-setup page to prevent infinite redirect loops 
    // Wait, layouts wrap pages. If I enforce this here, check if device-setup is UNDER this layout.
    // app/admin/layout.tsx wraps app/admin/*
    // app/admin/security/device-setup IS under app/admin.
    // I need to skip this check for that specific path?
    // In Server Components, we don't have easy access to pathname like in Middleware.
    // BUT, we can check if we are already authorizing. 
    // actually, best practice: Move device-setup OUT of admin layout? 
    // OR, just make the check loose for now, but strict about updating.

    // HOWEVER: Middleware already handles the redirect to /admin/security/device-setup.
    // If we are here, middleware passed us. 
    // If deviceId is missing, middleware should have caught it (unless visiting device-setup).

    // Let's rely on the DB check.
    // If DB record is missing but cookie exists -> Redirect to setup. 

    // Check if we are on the setup page to avoid loops
    const isSetupPage = pathname.includes('/admin/security/device-setup');

    if (deviceId) {
        // Verify against DB
        const trustedDevice = await prisma.trustedDevice.findUnique({
            where: { deviceId }
        });

        if (!trustedDevice) {
            // Cookie exists but DB record missing (Stale/Deleted)
            if (!isSetupPage) {
                // Redirect to API route to clear cookie and then to setup
                redirect('/api/clear-auth');
            }
        } else {
            // Valid Device - Update Last Used
            // We use a try-catch to ignore errors if concurrent updates happen
            try {
                await prisma.trustedDevice.update({
                    where: { deviceId },
                    data: { lastUsed: new Date() }
                });
            } catch (e) {
                // Ignore update errors
            }
        }
    }

    // Return Client Layout
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
