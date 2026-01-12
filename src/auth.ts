
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            authorization: {
                params: {
                    scope: "read:user user:email repo",
                },
            },
        })
    ],
    callbacks: {
        async session({ session, user }) {
            const account = await prisma.account.findFirst({
                where: { userId: user.id, provider: "github" }
            })

            if (session.user) {
                // @ts-ignore
                session.user.id = user.id;
                // @ts-ignore
                session.user.isPro = user.isPro;
                if (account && account.access_token) {
                    // @ts-ignore
                    session.user.githubAccessToken = account.access_token;
                }
            }
            return session
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        }
    }
})
