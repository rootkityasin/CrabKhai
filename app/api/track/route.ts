import { NextRequest, NextResponse } from 'next/server';
import { trackMetaEvent } from '@/lib/serverTracking';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eventName, eventData, userData, sourceUrl } = body;

        // Get IP and User Agent from request headers
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
        const userAgent = req.headers.get('user-agent') || '';

        // Merge provided user data with server-side info (PII will be hashed in the utility for Meta, but kept raw for DB)
        const fullUserData = {
            ...userData,
            clientIpAddress: ip,
            userAgent: userAgent,
        };

        // Trigger Tracking (Internal Logging + Meta CAPI)
        await trackMetaEvent(eventName, fullUserData, eventData, sourceUrl);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Track API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 });
    }
}
