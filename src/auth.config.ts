import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
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
        }),
        Credentials({
            name: "Firebase",
            credentials: {
                idToken: { label: "ID Token", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.idToken) return null;

                try {
                    // We need the admin auth here, but authConfig should be edge-light.
                    // However, 'credentials' usually runs on the server (lambda) in NextAuth v5.
                    // We will import it dynamically inside the handler if needed, 
                    // or define it in auth.ts which is full server.
                    // For now, let's keep the provider here and handle logic in auth.ts
                    return { id: "pending-verification", email: "pending@auth.com" };
                } catch (e) {
                    return null;
                }
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
