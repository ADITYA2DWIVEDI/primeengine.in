
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [
        Google({
            allowDangerousEmailAccountLinking: true,
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
            authorization: {
                params: {
                    scope: "read:user user:email repo",
                },
            },
        })
    ],
    pages: {
        signIn: "/login",
        error: "/login" // Redirect to login page on error
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnBuilder = nextUrl.pathname.startsWith('/builder');
            const isOnLogin = nextUrl.pathname.startsWith('/login');

            if (isOnDashboard || isOnBuilder) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isOnLogin) {
                if (isLoggedIn) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
                return true;
            }
            return true;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            // Basic session mapping for edge, without DB calls
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        }
    }
} satisfies NextAuthConfig;
