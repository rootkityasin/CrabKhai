
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/account',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
                token.phone = (user as any).phone
            }
            return token
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                // @ts-ignore
                session.user.role = token.role as string
                // @ts-ignore
                session.user.phone = token.phone as string
            }
            return session
        },
        authorized({ auth, request: nextUrl }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                return true; // TEMPORARY: Allow all access to admin
                // if (isLoggedIn) return true;
                // return false; 
            }
            return true;
        },
    },
    providers: [], // Providers added in auth.ts
    session: { strategy: "jwt" },
} satisfies NextAuthConfig
