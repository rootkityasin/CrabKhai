import { NextResponse } from 'next/server';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL;
    return NextResponse.json({
        hasDbUrl: !!dbUrl,
        urlLength: dbUrl?.length,
        nodeEnv: process.env.NODE_ENV,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthUrl: process.env.NEXTAUTH_URL
    });
}
