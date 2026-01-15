import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const authMiddleware = auth((req) => {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', req.nextUrl.pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
});

export default async function middleware(req: any, ctx: any) {
    try {
        return await authMiddleware(req, ctx);
    } catch (error) {
        console.error("Middleware Auth Error:", error);
        // In case of any auth error (like decryption failure), we'll just continue
        // The app handles unauthenticated states fine
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
