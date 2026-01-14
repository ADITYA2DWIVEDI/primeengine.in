import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" }, // Force JWT strategy for edge compatibility mix
    providers: [
        ...authConfig.providers.filter(p => p.id !== 'credentials'),
        {
            id: 'credentials',
            name: 'Credentials',
            type: 'credentials',
            credentials: {
                idToken: { label: "ID Token", type: "text" },
            },
            async authorize(credentials: any) {
                const { idToken } = credentials;
                if (!idToken) return null;

                try {
                    const { adminAuth } = await import("@/lib/firebase-admin");
                    const decodedToken = await adminAuth.verifyIdToken(idToken);

                    if (decodedToken) {
                        try {
                            // Upsert user in Prisma
                            const user = await prisma.user.upsert({
                                where: { email: decodedToken.email },
                                update: {
                                    name: decodedToken.name,
                                    image: decodedToken.picture,
                                },
                                create: {
                                    email: decodedToken.email!,
                                    name: decodedToken.name,
                                    image: decodedToken.picture,
                                },
                            });
                            return user;
                        } catch (dbError) {
                            console.error("Prisma Auth Error (Database sync issue?):", dbError);
                            // Rethrow or return null to trigger NextAuth failure
                            return null;
                        }
                    }
                    return null;
                } catch (error) {
                    console.error("Firebase Auth Error:", error);
                    return null;
                }
            }
        }
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token, user }) {
            // Re-implement the DB session enrichment here if needed, or rely on JWT
            if (session.user && token) {
                // @ts-ignore
                session.user.id = token.sub;
                // @ts-ignore
                session.user.provider = token.provider;

                // Fetch extra data from DB if critical and not on edge
                // For now, we rely on JWT to avoid the circular dep or size issue in middleware
            }

            // Re-adding the GitHub token logic if possible from token
            if (token && token.accessToken) {
                // @ts-ignore
                session.user.githubAccessToken = token.accessToken;
            }

            return session
        }
    }
})
